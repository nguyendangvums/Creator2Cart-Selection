#!/usr/bin/env python3
"""QA for a built deck: validate, render to JPEGs + contact sheets, scan text.
Usage: python3 qa.py out/Deck.pptx --market thailand
Needs the pptx skill scripts at /mnt/skills/public/pptx/scripts (validate.py, soffice.py)."""
import sys, os, re, glob, zipfile, subprocess, argparse
from PIL import Image

ap = argparse.ArgumentParser()
ap.add_argument('deck')
ap.add_argument('--market', default='', help='target market name, e.g. thailand (excluded from the banned scan)')
ap.add_argument('--banned', default=r'vietnam|philippin|thailand|thai\b|indonesia|türkiye|turkey|singapore|malaysia|korea|japan|china|chinese|southeast|\bSEA\b|\basia|united states|\bU\.S\.',
                help='regex of other markets/regions that must not appear (remove the target market from it)')
ap.add_argument('--skill-scripts', default='/mnt/skills/public/pptx/scripts')
a = ap.parse_args()
deck = os.path.abspath(a.deck); d = os.path.dirname(deck)

print('== validate'); subprocess.run(['python3', f'{a.skill_scripts}/office/validate.py', deck])
print('== render')
subprocess.run(['python3', f'{a.skill_scripts}/office/soffice.py', '--headless', '--convert-to', 'pdf', '--outdir', d, deck], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
pdf = os.path.splitext(deck)[0] + '.pdf'
for f in glob.glob(os.path.join(d, 's-*.jpg')): os.remove(f)
subprocess.run(['pdftoppm', '-jpeg', '-r', '110', pdf, os.path.join(d, 's')])
fs = sorted(glob.glob(os.path.join(d, 's-*.jpg'))); w, h = 733, 412
for part in range(0, len(fs), 6):
    m = Image.new('RGB', (w * 2 + 10, h * 3 + 20), '#888')
    for i, f in enumerate(fs[part:part + 6]):
        m.paste(Image.open(f).resize((w, h)), ((i % 2) * (w + 10), (i // 2) * (h + 10)))
    m.save(os.path.join(d, f'contact-{part // 6}.jpg'), quality=88)
print(f'{len(fs)} slides rendered; contact sheets: contact-*.jpg in {d}')
print('== text scan (slides + notes)')
z = zipfile.ZipFile(deck)
txt = ''.join(z.read(n).decode('utf8') for n in z.namelist() if re.match(r'ppt/(slides|notesSlides)/.*\.xml$', n))
print('em dashes:', txt.count('\u2014'), ' en dashes:', txt.count('\u2013'))
hits = sorted(set(m.lower() for m in re.findall(a.banned, txt, re.I)))
if a.market: hits = [x for x in hits if not a.market.lower().startswith(x.strip().rstrip('\\b')[:4])]
print('other markets/regions:', hits or 'none')
ph = sorted(set(re.findall(r'video_content|\[ID|TBC|lorem|xx%', txt, re.I)))
print('placeholders:', ph or 'none')
print('native charts:', [n for n in z.namelist() if n.startswith('ppt/charts/') and n.endswith('.xml')] or 'none')
