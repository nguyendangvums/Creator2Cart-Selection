#!/usr/bin/env python3
"""Build a YouTube Select-style Creator Portfolio deck (1280x720 HTML slides).

Usage:
    python3 build_deck.py <deck.json> [-o out.html] [--link-images]

The JSON schema is documented in references/deck-schema.md. Image paths in the
JSON are resolved relative to the JSON file. By default images are inlined as
data URIs so the HTML is a single portable file; --link-images keeps them as
relative links instead (smaller file, needs the images folder alongside).
"""

import argparse
import base64
import html
import json
import mimetypes
import os
import sys

FONT_URL = (
    "https://fonts.googleapis.com/css2?"
    "family=Google+Sans:wght@400;500;700"
    "&family=YouTube+Sans:wght@500;700;800"
    "&family=Noto+Sans+Thai:wght@400;700"
    "&display=swap"
)

# Lucide icons (MIT), stroke-based, rendered at 28x28 in #D93832.
ICONS = {
    "subscribers": (
        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>'
        '<circle cx="9" cy="7" r="4"/>'
        '<path d="M22 21v-2a4 4 0 0 0-3-3.87"/>'
        '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
    ),
    "videos": (
        '<path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z"/>'
        '<path d="m6.2 5.3 3.1 3.9"/><path d="m12.4 3.4 3.1 4"/>'
        '<path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>'
    ),
    "followers": (
        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>'
        '<line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>'
    ),
    "likes": (
        '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2'
        '-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>'
    ),
    "calendar": (
        '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/>'
        '<path d="M3 10h18"/>'
    ),
    "play": '<polygon points="6 3 20 12 6 21 6 3"/>',
    "views": (
        '<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 '
        '1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/>'
        '<circle cx="12" cy="12" r="3"/>'
    ),
}

STAT_LABELS = {
    "subscribers": "Subscribers",
    "videos": "Videos Produced",
    "views": "Total Channel Views",
}
COMBINED_LABELS = {
    "subscribers": "Combined Subscribers",
    "videos": "Combined Videos Produced",
    "views": "Combined Channel Views",
}

CSS = r"""
:root {
  --yt-red: #DA3832;
  --yt-red-line: #D93832;
  --ink: #1A1A1A;
  --ink-hook: #4D4D4D;
  --ink-body: #1F1F1F;
  --ink-foot: #212121;
  --ink-label: #141414;
  --ink-muted: #666666;
  --tbc: #9E9E9E;
  --card: #F2F2F2;
  --panel: #000000;
  --bar: #1F1F1F;
  --track: #C9C9C9;
  --handle: #DE3B4B;
  --grad-a: #E52D27;
  --grad-b: #E5489A;
  --canvas: #FFFFFF;
  --viewer-bg: #E8E8E8;
  --font-display: 'YouTube Display', 'YouTube Sans', 'Google Sans', 'Product Sans', 'Roboto', sans-serif;
  --font-body: 'Google Sans', 'Product Sans', 'Noto Sans Thai', 'Roboto', sans-serif;
  --zoom: 1;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --viewer-bg: #121212; }
}
:root[data-theme="dark"] { --viewer-bg: #121212; }

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--viewer-bg);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  padding: 24px 16px;
}
.deck { display: flex; flex-direction: column; align-items: center; gap: 24px; }
.slide {
  zoom: var(--zoom);
  position: relative;
  width: 1280px;
  height: 720px;
  flex: none;
  background: var(--canvas);
  overflow: hidden;
  color: var(--ink);
  box-shadow: 0 2px 6px rgba(0,0,0,.08), 0 12px 32px rgba(0,0,0,.10);
}
.abs { position: absolute; }

/* Type */
.h-display {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 70px;
  line-height: 0.8;
  letter-spacing: -0.02em;
  margin: 0;
  color: var(--ink);
}
.h-display.on-dark { color: #FFFFFF; }
.hook {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 25px;
  line-height: 1.2;
  margin: 14px 0 0;
  color: var(--ink-hook);
}
.bio {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: 15.5px;
  line-height: 1.45;
  margin: 18px 0 0;
  color: var(--ink-body);
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Category pill */
.cat-pill {
  position: absolute; top: 28px; right: 34px;
  width: 162px; height: 44px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--yt-red); border-radius: 9999px;
  color: #FFFFFF; font: 700 20px/1 var(--font-body); letter-spacing: 0.04em;
  text-transform: uppercase; white-space: nowrap;
}

/* Left black photo panel */
.panel {
  position: absolute; left: 0; top: 48px; bottom: 0; width: 462px;
  background: var(--panel); border-top-right-radius: 90px; overflow: hidden;
}
.panel .shot {
  position: absolute; left: 10px; right: 10px; top: 60px;
  width: 442px; height: 450px; overflow: hidden;
}
.panel .shot img { width: 100%; height: 100%; object-fit: cover; display: block; }
.panel .shot .fade {
  position: absolute; left: 0; right: 0; bottom: 0; height: 180px;
  background: linear-gradient(to top, #000 0%, rgba(0,0,0,.75) 50%, rgba(0,0,0,0) 100%);
}
.panel .shot.placeholder {
  border: 2px dashed #5F5F5F; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--tbc); font: 500 16px/1.3 var(--font-body);
}
.mosaic { display: flex; flex-direction: column; gap: 8px; }
.mosaic .row { display: flex; gap: 8px; }
.mosaic img { object-fit: cover; display: block; flex: none; }
.mosaic .big img { width: 217px; height: 217px; }
.mosaic .small img { width: 142px; height: 142px; }

/* Bottom-left dark bar with YouTube play badge */
.bar {
  position: absolute; left: 0; bottom: 0; width: 462px; height: 62px;
  background: var(--bar); display: flex; align-items: center; padding-left: 20px;
}

/* Scrubber progress bar */
.scrub-fill { position: absolute; left: 0; top: 652px; width: 986px; height: 5px;
  background: linear-gradient(to right, var(--grad-a), var(--grad-b)); }
.scrub-track { position: absolute; left: 986px; right: 0; top: 652px; height: 5px; background: var(--track); }
.scrub-handle { position: absolute; left: 980px; top: 645px; width: 18px; height: 18px;
  border-radius: 4px; background: var(--handle); }

/* Right column */
.col { position: absolute; left: 514px; width: 732px; }

/* Content pills row */
.pills-row {
  position: absolute; left: 514px; top: 386px; width: 740px;
  display: flex; flex-wrap: wrap; align-items: center; gap: 10px;
}
.pills-label {
  font: 700 11px/1 var(--font-body); letter-spacing: 0.18em; text-transform: uppercase;
  color: var(--ink-muted); margin-right: 8px;
}
.pill {
  display: inline-flex; align-items: center; justify-content: center;
  height: 35px; padding: 0 22px; border-radius: 9999px;
  border: 1.75px solid var(--yt-red-line); color: var(--yt-red-line);
  font: 700 13.5px/1 var(--font-body); white-space: nowrap;
}
.pill.on-dark { border-color: #FFFFFF; color: #FFFFFF; }
.pills-label.on-dark { color: #BDBDBD; }

/* Stat cards */
.stats { position: absolute; left: 514px; top: 452px; display: flex; gap: 16px; }
.stats.stacked { flex-direction: column; }
.card { position: relative; width: 226px; height: 150px; background: var(--card); border-radius: 24px; flex: none; }
.card svg.icon { position: absolute; top: 16px; right: 18px; width: 28px; height: 28px; }
.card .label {
  position: absolute; left: 18px; top: 36px; max-width: 152px;
  font: 700 15.5px/1.2 var(--font-body); color: var(--ink-label);
}
.card .num {
  position: absolute; left: 18px; bottom: 18px;
  font-family: var(--font-display); font-weight: 700; font-size: 55px; line-height: 1;
  color: var(--ink); white-space: nowrap;
}
.tbc { color: var(--tbc) !important; }

/* Footnote */
.footnote {
  position: absolute; left: 514px; top: 678px; width: 740px;
  font: 400 11.5px/1 var(--font-body); color: var(--ink-foot);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.footnote.on-dark { color: #D6D6D6; }

/* Portfolio grid */
.grid { position: absolute; left: 34px; right: 34px; top: 244px; height: 384px; display: flex; gap: 16px; }
.gcard {
  flex: 1 1 0; min-width: 0; background: var(--card); border-radius: 24px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  padding: 24px 14px 22px;
}
.avatar {
  width: 100px; height: 100px; border-radius: 50%; overflow: hidden; flex: none;
  box-shadow: 0 0 0 3px #FFFFFF, 0 0 0 5px var(--yt-red-line);
  background: #DDD;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gname { margin-top: 18px; font: 700 17px/1.2 var(--font-body); color: var(--ink);
  max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ghandle { margin-top: 3px; font: 400 12.5px/1.2 var(--font-body); color: var(--ink-muted); }
.gsubs { margin-top: 16px; font-family: var(--font-display); font-weight: 700; font-size: 55px; line-height: 1; color: var(--ink); }
.glabel { margin-top: 6px; font: 700 11px/1 var(--font-body); letter-spacing: 0.16em; text-transform: uppercase; color: var(--ink-muted); }
.gviews { margin-top: 14px; font: 500 14px/1.2 var(--font-body); color: var(--ink-body); }
.gviews b { font-weight: 700; }
.gpills { margin-top: auto; display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
.gpills .pill { height: 30px; padding: 0 14px; font-size: 12.5px; }

/* Divider */
.panel-wide { width: 880px; }
.divider-copy { position: absolute; left: 64px; top: 171px; width: 700px; }
.eyebrow { font: 700 12px/1 var(--font-body); letter-spacing: 0.22em; text-transform: uppercase; color: #BDBDBD; margin: 0 0 22px; }
.divider-desc { margin: 24px 0 0; max-width: 640px; font: 400 18px/1.5 var(--font-body); color: #D9D9D9; }
.divider-pills { margin-top: 30px; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }

@media print {
  @page { size: 1280px 720px; margin: 0; }
  body { background: #FFFFFF; padding: 0; }
  .deck { gap: 0; }
  .slide { zoom: 1; box-shadow: none; break-after: page; page-break-after: always; }
  .slide:last-child { break-after: auto; page-break-after: auto; }
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
"""

FIT_JS = r"""
(function () {
  function fit() {
    var w = document.documentElement.clientWidth - 32;
    var z = Math.min(1, w / 1280);
    document.documentElement.style.setProperty('--zoom', z.toFixed(4));
  }
  window.addEventListener('resize', fit);
  window.addEventListener('beforeprint', function () {
    document.documentElement.style.setProperty('--zoom', '1');
  });
  window.addEventListener('afterprint', fit);
  fit();
})();
"""


def esc(text):
    return html.escape(str(text), quote=True)


class Builder:
    def __init__(self, data, base_dir, link_images):
        self.d = data
        self.base = base_dir
        self.link = link_images
        self.warnings = []

    # ---------- helpers ----------
    def img_src(self, rel):
        if not rel:
            return None
        path = os.path.join(self.base, rel)
        if not os.path.exists(path):
            self.warnings.append(f"missing image: {rel}")
            return None
        if self.link:
            return rel
        mime = mimetypes.guess_type(path)[0] or "image/jpeg"
        with open(path, "rb") as fh:
            return f"data:{mime};base64,{base64.b64encode(fh.read()).decode()}"

    @staticmethod
    def num(value):
        if value is None or str(value).strip().upper() in ("", "TBC"):
            return '<div class="num tbc">TBC</div>'
        return f'<div class="num">{esc(value)}</div>'

    @staticmethod
    def icon(kind):
        return (
            '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="#D93832" '
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" '
            f'aria-hidden="true">{ICONS[kind]}</svg>'
        )

    @staticmethod
    def missing(value):
        return value is None or str(value).strip().upper() in ("", "TBC")

    def card_specs(self, stats, labels, substitutes=(), who=""):
        """Three (icon, label, value) cards. A missing primary metric is replaced by
        the next substitute public metric, so TBC only appears when none is left."""
        subs = list(substitutes or [])
        specs = []
        for kind in ("subscribers", "videos", "views"):
            value = stats.get(kind)
            if not self.missing(value):
                specs.append((kind, labels[kind], value))
            elif subs:
                sub = subs.pop(0)
                specs.append((sub.get("icon", "play"), sub["label"], sub["value"]))
            else:
                self.warnings.append(f"{who or 'deck'}: {kind} missing and no substitute metric (renders TBC)")
                specs.append((kind, labels[kind], None))
        return specs

    def stat_cards(self, stats, labels, stacked=False, style="", substitutes=(), who=""):
        cls = "stats stacked" if stacked else "stats"
        cards = []
        for icon, label, value in self.card_specs(stats, labels, substitutes, who):
            cards.append(
                f'<div class="card">{self.icon(icon)}'
                f'<div class="label">{esc(label)}</div>'
                f'{self.num(value)}</div>'
            )
        return f'<div class="{cls}" style="{style}">{"".join(cards)}</div>'

    @staticmethod
    def pills_row(pills, on_dark=False, row_class="pills-row", label=True):
        dark = " on-dark" if on_dark else ""
        parts = [f'<span class="pills-label{dark}">Content</span>'] if label else []
        parts += [f'<span class="pill{dark}">{esc(p)}</span>' for p in pills]
        return f'<div class="{row_class}">{"".join(parts)}</div>'

    def chrome(self, with_bar=True):
        """Category pill, scrubber and bottom-left play bar shared by every slide."""
        cat = esc(self.d["category"]).upper()
        bar = (
            '<div class="bar"><svg width="27" height="19" viewBox="0 0 27 19" role="img" '
            'aria-label="YouTube"><rect width="27" height="19" rx="5" fill="#FF0000"/>'
            '<path d="M11 5.5v8l7-4z" fill="#FFFFFF"/></svg></div>'
            if with_bar else ""
        )
        return (
            f'<div class="cat-pill">{cat}</div>{bar}'
            '<div class="scrub-fill"></div><div class="scrub-track"></div>'
            '<div class="scrub-handle"></div>'
        )

    def shot(self, rel, alt):
        src = self.img_src(rel)
        if not src:
            return '<div class="shot placeholder">Add show image capture</div>'
        return (
            f'<div class="shot"><img src="{src}" alt="{esc(alt)}">'
            '<div class="fade"></div></div>'
        )

    @staticmethod
    def footnote(text, on_dark=False, style=""):
        dark = " on-dark" if on_dark else ""
        return f'<div class="footnote{dark}" style="{style}">{esc(text)}</div>'

    # ---------- slides ----------
    def slide_title(self):
        t = self.d["title_slide"]
        tiles = t.get("mosaic", [])
        if tiles:
            imgs = []
            for i, rel in enumerate(tiles[:5]):
                src = self.img_src(rel)
                if src:
                    imgs.append(f'<img src="{src}" alt="Creator channel image {i + 1}">')
            shot = (
                f'<div class="shot"><div class="mosaic">'
                f'<div class="row big">{"".join(imgs[:2])}</div>'
                f'<div class="row small">{"".join(imgs[2:5])}</div></div></div>'
            )
        else:
            shot = self.shot(t.get("image"), t["header"])
        return (
            f'<section class="slide" aria-label="Title slide">'
            f'<div class="panel">{shot}</div>'
            f'<div class="col" style="top:{t.get("top", 96)}px">'
            f'<h1 class="h-display">{esc(t["header"])}</h1>'
            f'<p class="hook">{esc(t["subtitle"])}</p>'
            f'<p class="bio">{esc(t["summary"])}</p></div>'
            f'{self.pills_row(t["pills"])}'
            f'{self.stat_cards(t["combined"], COMBINED_LABELS)}'
            f'{self.footnote(t["footnote"])}{self.chrome()}</section>'
        )

    def slide_grid(self):
        g = self.d["grid_slide"]
        cards = []
        for c in self.d["creators"]:
            src = self.img_src(c.get("avatar"))
            avatar = f'<img src="{src}" alt="{esc(c["name"])} avatar">' if src else ""
            views = c["stats"].get("views")
            alt = [s for s in c.get("substitutes", [])]
            if not self.missing(views):
                views_html = f'<b>{esc(views)}</b> channel views'
            elif alt:
                short = alt[0].get("short", alt[0]["label"])
                views_html = f'<b>{esc(alt[0]["value"])}</b> {esc(short)}'
            else:
                views_html = '<b class="tbc">TBC</b> channel views'
            subs = c["stats"].get("subscribers")
            subs_cls = "gsubs" if subs and str(subs).upper() != "TBC" else "gsubs tbc"
            pills = "".join(f'<span class="pill">{esc(p)}</span>' for p in c["grid_pills"][:2])
            cards.append(
                f'<div class="gcard"><div class="avatar">{avatar}</div>'
                f'<div class="gname">{esc(c["name"])}</div>'
                f'<div class="ghandle">{esc(c.get("handle", ""))}</div>'
                f'<div class="{subs_cls}">{esc(subs or "TBC")}</div>'
                f'<div class="glabel">Subscribers</div>'
                f'<div class="gviews">{views_html}</div>'
                f'<div class="gpills">{pills}</div></div>'
            )
        return (
            f'<section class="slide" aria-label="Portfolio grid">'
            f'<h2 class="h-display abs" style="left:34px;top:96px;width:1010px">{esc(g["header"])}</h2>'
            f'<div class="grid">{"".join(cards)}</div>'
            f'{self.footnote(g["footnote"])}{self.chrome()}</section>'
        )

    def slide_divider(self):
        v = self.d["divider_slide"]
        pills = "".join(f'<span class="pill on-dark">{esc(p)}</span>' for p in v["pills"])
        return (
            f'<section class="slide" aria-label="Category divider">'
            f'<div class="panel panel-wide"><div class="divider-copy">'
            f'<p class="eyebrow">{esc(v.get("eyebrow", self.d.get("market", "")))}</p>'
            f'<h2 class="h-display on-dark">{esc(v["title"])}</h2>'
            f'<p class="divider-desc">{esc(v["description"])}</p>'
            f'<div class="divider-pills"><span class="pills-label on-dark">Content</span>{pills}</div>'
            f'</div></div>'
            f'{self.stat_cards(self.d["title_slide"]["combined"], COMBINED_LABELS, stacked=True, style="left:967px;top:103px")}'
            f'{self.footnote(v["footnote"], style="left:900px;width:346px")}'
            f'{self.chrome()}</section>'
        )

    def slide_creator(self, c):
        return (
            f'<section class="slide" aria-label="{esc(c["name"])}">'
            f'<div class="panel">{self.shot(c.get("image"), c["name"] + " show capture")}</div>'
            f'<div class="col" style="top:{c.get("top", 124)}px">'
            f'<h2 class="h-display">{esc(c["name"])}</h2>'
            f'<p class="hook">{esc(c["hook"])}</p>'
            f'<p class="bio">{esc(c["bio"])}</p></div>'
            f'{self.pills_row(c["pills"])}'
            f'{self.stat_cards(c["stats"], STAT_LABELS, substitutes=c.get("substitutes"), who=c["name"])}'
            f'{self.footnote(c["footnote"])}{self.chrome()}</section>'
        )

    def build(self):
        d = self.d
        for c in d["creators"]:
            n = len(c["pills"])
            if not 2 <= n <= 4:
                self.warnings.append(f'{c["name"]}: {n} content pills (spec: 2 to 4)')
            words = len(c["bio"].split())
            if not 55 <= words <= 75:
                self.warnings.append(f'{c["name"]}: bio is {words} words (spec: 55 to 75)')
            if len(c["hook"].split()) > 12:
                self.warnings.append(f'{c["name"]}: hook over 12 words')
        slides = [self.slide_title(), self.slide_grid(), self.slide_divider()]
        slides += [self.slide_creator(c) for c in d["creators"]]
        title = esc(d.get("page_title", "Creator Portfolio"))
        return (
            '<!doctype html><html lang="en"><head><meta charset="utf-8">'
            '<meta name="viewport" content="width=device-width, initial-scale=1">'
            f'<title>{title}</title>'
            '<link rel="preconnect" href="https://fonts.googleapis.com">'
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
            f'<link rel="stylesheet" href="{FONT_URL}">'
            f'<style>{CSS}</style></head><body>'
            f'<main class="deck">{"".join(slides)}</main>'
            f'<script>{FIT_JS}</script></body></html>'
        )


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("json")
    ap.add_argument("-o", "--out")
    ap.add_argument("--link-images", action="store_true")
    args = ap.parse_args()

    with open(args.json, encoding="utf-8") as fh:
        data = json.load(fh)
    b = Builder(data, os.path.dirname(os.path.abspath(args.json)), args.link_images)
    out = args.out or os.path.splitext(args.json)[0] + ".html"
    with open(out, "w", encoding="utf-8") as fh:
        fh.write(b.build())
    for w in b.warnings:
        print(f"WARN {w}", file=sys.stderr)
    print(out)


if __name__ == "__main__":
    main()
