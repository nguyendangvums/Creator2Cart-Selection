#!/usr/bin/env python3
"""QA for a built deck: validate, render to JPEGs + contact sheets, scan text.
Usage: python3 qa.py out/Deck.pptx --market thailand
Needs the pptx skill scripts (validate.py, soffice.py): looked up in --skill-scripts,
then under ~/.claude/skills. Renders with pdftoppm, or PyMuPDF when pdftoppm is missing."""
import sys, os, re, glob, zipfile, subprocess, argparse, shutil
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('deck')
ap.add_argument('--market', default='', help='target market name, e.g. thailand (excluded from the banned scan)')
ap.add_argument('--banned', default=r'vietnam|philippin|thailand|thai\b|indonesia|türkiye|turkey|singapore|malaysia|korea|japan|china|chinese|southeast|\bSEA\b|\basia|united states|\bU\.S\.',
                help='regex of other markets/regions that must not appear (remove the target market from it)')
ap.add_argument('--skill-scripts', default='/mnt/skills/public/pptx/scripts')
a = ap.parse_args()
deck = os.path.abspath(a.deck); d = os.path.dirname(deck)


def find_scripts(first):
    cands = [first] + sorted(glob.glob(os.path.expanduser('~/.claude/skills/**/pptx/scripts'), recursive=True))
    for c in cands:
        if os.path.exists(os.path.join(c, 'office', 'soffice.py')):
            return c
    return None


scripts = find_scripts(a.skill_scripts)
pdf = os.path.splitext(deck)[0] + '.pdf'
if scripts:
    print('== validate'); subprocess.run(['python3', f'{scripts}/office/validate.py', deck])
    print('== render')
    subprocess.run(['python3', f'{scripts}/office/soffice.py', '--headless', '--convert-to', 'pdf', '--outdir', d, deck], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
else:
    print('== validate skipped: pptx skill scripts not found')
    print('== render')
    subprocess.run(['soffice', '--headless', '--convert-to', 'pdf', '--outdir', d, deck], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
for f in glob.glob(os.path.join(d, 's-*.jpg')): os.remove(f)
if shutil.which('pdftoppm'):
    subprocess.run(['pdftoppm', '-jpeg', '-r', '110', pdf, os.path.join(d, 's')])
else:
    import pymupdf
    doc = pymupdf.open(pdf)
    for i, pg in enumerate(doc):
        pg.get_pixmap(dpi=110).save(os.path.join(d, f's-{i + 1:02d}.jpg'))
fs = sorted(glob.glob(os.path.join(d, 's-*.jpg')), key=lambda f: int(re.findall(r'(\d+)\.jpg$', f)[0])); w, h = 733, 412
for f in glob.glob(os.path.join(d, 'contact-*.jpg')): os.remove(f)
for part in range(0, len(fs), 6):
    m = Image.new('RGB', (w * 2 + 10, h * 3 + 20), '#888')
    for i, f in enumerate(fs[part:part + 6]):
        m.paste(Image.open(f).resize((w, h)), ((i % 2) * (w + 10), (i // 2) * (h + 10)))
    m.save(os.path.join(d, f'contact-{part // 6}.jpg'), quality=88)
print(f'{len(fs)} slides rendered; contact sheets: contact-*.jpg in {d}')

print('== text scan (slides + notes)')
z = zipfile.ZipFile(deck)
num = lambda n: int(re.findall(r'(\d+)\.xml$', n)[0])
slides = sorted([n for n in z.namelist() if re.match(r'ppt/slides/slide\d+\.xml$', n)], key=num)
notes = [n for n in z.namelist() if re.match(r'ppt/notesSlides/.*\.xml$', n)]
txt_of = lambda n: z.read(n).decode('utf8')
txt = ''.join(txt_of(n) for n in slides + notes)
print('em dashes:', txt.count('\u2014'), ' en dashes:', txt.count('\u2013'))
hits = sorted(set(m.lower() for m in re.findall(a.banned, txt, re.I)))
if a.market: hits = [x for x in hits if not a.market.lower().startswith(x.strip().rstrip('\\b')[:4])]
print('other markets/regions:', hits or 'none')
# internal data may only sit on the Audiences slide (one slide); everything else is scanned for placeholders
holder = [num(n) for n in slides if '[internal data]' in txt_of(n)]
print('internal-data holder slides:', holder or 'none', '' if len(holder) == 1 else ' <- expected exactly one')
rest = ''.join(txt_of(n) for n in slides if num(n) not in holder) + ''.join(txt_of(n) for n in notes)
ph = sorted(set(re.findall(r'video_content|\[internal data\]|\[ID|TBC|lorem|xx%', rest, re.I)))
print('placeholders outside the holder slide:', ph or 'none')
print('native charts:', [n for n in z.namelist() if n.startswith('ppt/charts/') and n.endswith('.xml')] or 'none')
