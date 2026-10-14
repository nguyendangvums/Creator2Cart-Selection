---
name: creator-portfolio-design
description: Creator Portfolio Design. Researches a mix of YouTube creators or channels, pulls their published channel statistics and show imagery from YouTube and public internet sources, and packages them into a YouTube Select-style Creator Portfolio slide deck (1280x720 HTML, PDF and PNG) using the locked design system below, built through the ui-ux-pro-max workflow. Trigger on "Run creator_portfolio on [creator list]", "creator portfolio deck", "creator lineup slides", "YouTube Select deck", "top [N] [category] creators in [market] deck", or any request to turn a list of YouTube creators into portfolio slides for advertisers.
---

# Creator Portfolio Design

Turns a creator mix into a YouTube Select-style portfolio deck for advertisers. This skill fuses two things:

1. **The creator_portfolio spec** (inputs, research rules, slide order, pixel spec). This is the source of truth for content and layout.
2. **The ui-ux-pro-max workflow** (analyze, design brief, tokens, implement, UX writing, validate). This governs how the deck is built and checked.

When the two conflict, the creator_portfolio spec wins on layout and color values, and the conflict is flagged to the user (example: TBC grey #9E9E9E on #F2F2F2 is 2.4:1 contrast, below the ui-ux-pro-max 3:1 large-text floor; keep the spec value, mention it once).

---

## Inputs

| Input | Required | Notes |
|---|---|---|
| `creator_mix` | Yes, unless discovery is requested | Any list of YouTube creator names, @handles or channel URLs. |
| `category` | Yes | Shown in ALL CAPS in the top-right red pill (PODCAST, PARENTING & FAMILY, GAMING, BEAUTY). |
| `market` | No | Country or region for the title and divider slides (Thailand, Vietnam). |
| `brand_fit` | No | Target advertiser vertical; tailors the last sentence of each bio. |

**Discovery mode.** If the user asks for "top N [category] creators in [market]" instead of giving a list, run discovery: rank category-led channels by subscribers from tracker data (vidIQ, Social Blade, Influesque, Scrumball, Playboard, YouTube page data), exclude channels whose content is not led by the category, and state the ranking criterion in the grid-slide footnote. Flag any channel that looks dormant (very low daily views, no recent uploads) to the user rather than silently dropping or keeping it.

---

## Workflow

### Step 0: Analyze and lock the design brief (ui-ux-pro-max)
Product type: advertiser sales deck. Industry: creator partnerships. Stack: static HTML + CSS (no framework), rendered to PDF/PNG with Playwright. The design system is locked (below); do not re-pick style, palette or type. Show the user this compact brief only if they ask about the design.

```
+------------------------------------------------------------------+
|  TARGET: Creator Portfolio deck (YouTube Select style)           |
+------------------------------------------------------------------+
|  PATTERN: Title > Portfolio grid > Category divider > Profiles   |
|  STYLE: Swiss grid + YouTube player motifs (scrubber, play bar)  |
|     Keywords: bold, data-forward, editorial, high-contrast       |
|  COLORS:                                                         |
|     Primary:    #DA3832 (YouTube red pill)                       |
|     Accent:     #D93832 (pill outlines, icons)                   |
|     Gradient:   #E52D27 > #E5489A (scrubber fill)                |
|     Surface:    #F2F2F2 (stat cards) / #000000 (photo panel)     |
|     Text:       #1A1A1A / #4D4D4D / #1F1F1F                      |
|  TYPOGRAPHY: YouTube Display (YouTube Sans) / Google Sans        |
|     Google Fonts: Google Sans 400/500/700, YouTube Sans 500-800  |
|  KEY EFFECTS: bottom gradient fade on show image, rounded-tr 90  |
|  AVOID: emoji icons, stock photos, AI-generated faces, invented  |
|         numbers, em dashes in copy                               |
+------------------------------------------------------------------+
```

### Step 1: Take the creator mix and resolve channels
Use only the creators provided (or confirmed) by the user, preserving their exact input order. Do not run a generic "top 10" discovery search unless explicitly asked (see Discovery mode). Search "[Creator Name] YouTube Channel" to resolve the canonical channel (handle and channel ID). Flag in the footnote if the creator operates multiple channels.

### Step 2: Pull 3 public numbers per channel (always 3, never TBC)
Primary numbers, in this order:
1. **Subscribers**
2. **Videos Produced**
3. **Total Channel Views**

**Every creator card shows 3 real public numbers.** If a primary number is still unavailable after the Step 4 gap-fill, replace that card with the next relevant public number from this ladder (first available wins), and say which substitution you made in the hand-off:
1. Most-viewed video views on the channel ("Top Video Views")
2. The same creator's TikTok followers, then TikTok likes (official account only)
3. Instagram followers, then Facebook followers (official account only)
4. Years on YouTube or join year ("On YouTube Since")
5. A verifiable milestone count (for example Play Buttons earned)

Put substitutes in the creator's `substitutes` list (label, short, value, icon, source); the builder slots them into the missing positions and uses the first one on the grid slide. Never use monthly views, average views per video, age skew or gender skew, even as substitutes. Format cleanly: 1.95M, ~3,100, 343M, 62.4K, 1.47B. Record the source and date for every number in the deck JSON `sources` block.

### Step 3: Assign content-type pills
Tag each channel with 2 to 4 content verticals (Business, Economics, History, Self-Development, Lifestyle, Beauty, Fitness, Makeup, Skincare, Reviews). One balanced row above the stat cards, preceded by the uppercase tracked CONTENT label. Also pick the 2 most representative for the grid slide (`grid_pills`).

### Step 4: Mandatory internet gap-fill (numbers and images)
If any of the 3 numbers or the show image is missing from the YouTube lookup, search other published sources before falling back.
- **Numbers:** vidIQ, Social Blade, NoxInfluencer, HypeAuditor, Playboard, SponsorRadar, Influesque, and news or press articles in English and the local language.
- **Images (channel image first, never video-frame crops):**
  1. Image-search "[Channel Name] YouTube Channel" and take the **official channel image**: the avatar on yt3.googleusercontent.com, requested at full size (`=s900` or larger), or the channel banner. This is the default show image and grid avatar.
  2. Do not crop frames or thumbnails from videos for the show image. They are too low-resolution once cropped to the 442x450 panel. The source must be at least 884px wide (2x of the panel) without upscaling.
  3. If no official channel image exists, try podcast platforms (Podbean, Spotify, Apple Podcasts), official Facebook or Instagram profile images, and reputable news or blog profiles, at the same resolution bar.
  4. **Verify** the image belongs to the right channel. Look at it. Discard keyword matches from other channels, re-uploads and fan accounts. If the official image is a logo or illustration rather than a face, still use it (it is the channel's own image) and mention it in the hand-off.

### Step 5: Last-resort rule
TBC should not appear on a creator card: work the Step 2 substitution ladder first. TBC (muted grey #9E9E9E) or the dashed "Add show image capture" placeholder is allowed only when no ladder metric or official image exists anywhere, and must be called out to the user. Never invent, estimate, or use multi-year-old totals. Never AI-generate photos of real creators. Snapshots under 12 months old are acceptable when the footnote states the date.

### Step 6: Write slide copy (Google Sans)
- **Hook:** at most 12 words and must fit one line (about 55 characters at 25px in the 732px column). Punchy positioning statement under the channel name.
- **Bio:** 3 to 4 sentences, 55 to 75 words, must fit 4 lines (about 380 characters). Structure: what the channel covers, then why audiences watch plus scale proof, then best-fit advertiser verticals (use `brand_fit` when given).
- **Footnote:** one line, bottom right: data source, date, image credit, plus any channel-scope note.

UX writing standards (ui-ux-pro-max): active voice, plain language, front-load the key fact, consistent terms (pick "views" or "channel views" and keep it). House rules: no em dashes, no emoji, standard sentence capitalization in body copy, no claims that the sources do not support.

### Step 7: Build
1. From each official channel image (900x900 avatar), save next to the deck JSON: `images/<slug>-show.jpg` (884x900 centre crop, the 2x of 442x450), `images/<slug>-avatar.jpg` (240x240) and `images/<slug>-tile.jpg` (434x434) for the title-slide mosaic (two large tiles over three small ones, in deck order).
2. Write `deck.json` following `references/deck-schema.md` (see `references/example-deck.json`).
3. Build: `python3 scripts/build_deck.py deck.json -o <name>.html` (images inlined as data URIs, single portable file). The builder warns on pill counts, bio word counts and hook length.

### Step 8: Validate
Run `NODE_PATH=$(npm root -g) node scripts/render_deck.cjs <abs path to html>`. It renders `previews/slide-NN.png` and `<name>.pdf`, and fails on: fonts not loaded, bio clamped past 4 lines, hook wrapping, footnote overflowing one line, pills row wrapping, creator name wrapping, text block colliding with the pills row, broken images. Fix copy or crops until it prints `QA: all checks passed`, then look at every PNG.

Pre-delivery checklist (ui-ux-pro-max, adapted to fixed slides):
- [ ] Icons are inline SVG (Lucide), never emoji
- [ ] Text contrast at least 4.5:1 (TBC grey exception flagged)
- [ ] Every image verified by eye as the right creator or show
- [ ] Every number has a source and date in `sources`; nothing estimated
- [ ] Fonts load (Google Sans, YouTube Sans; Noto Sans Thai for Thai markets)
- [ ] Viewer scales slides to the window (works at 375px wide) and prints one slide per page
- [ ] `prefers-reduced-motion` respected (no animation is used)

### Step 9: Deliver
Hand over the HTML (shareable single file), PDF and slide PNGs. Summarize sources, every TBC and why, and any judgment calls (discovery criterion, dormant channels, older snapshots).

---

## Visual design system (portfolio card specification)

Implemented in `scripts/build_deck.py` as plain CSS with the exact values below and semantic tokens on `:root`.

| Element | CSS / layout specification |
|---|---|
| **Slide canvas** | 1280x720px white (#FFFFFF); default font stack Google Sans, Product Sans, Noto Sans Thai, Roboto, sans-serif |
| **All slide headers** | YouTube Display Bold (YouTube Sans 700 fallback), size 70 (text-[70px]), line-spacing 0.8 (leading-[0.8]), margin 0 (my-0), color #1A1A1A (or #FFFFFF on dark panels) |
| **Hook line** | Google Sans Bold, 25px, leading-[1.2], mt-[14px] mb-0, color #4D4D4D |
| **Bio paragraph** | Google Sans Regular, 15.5px, leading-[1.45], mt-[18px], max 4 lines (line-clamp-4), color #1F1F1F |
| **Top-right category pill** | top-[28px] right-[34px], solid #DA3832, rounded-full, w-[162px] h-[44px], inline-flex items-center justify-center; text ALL CAPS (Google Sans Bold 20px, white, leading-none tracking-[0.04em]) |
| **Left black photo panel** | left-0 top-[48px] bottom-0 w-[462px] bg-black rounded-tr-[90px] overflow-hidden |
| **Framed show image** | left-[10px] right-[10px] top-[60px] w-[442px] h-[450px] object-cover inside the black panel, with a bottom gradient fade (h-[180px] from-black via-black/75 to-transparent) |
| **Bottom-left dark bar** | left-0 bottom-0 w-[462px] h-[62px] bg-[#1F1F1F] flex items-center pl-[20px] containing the inline SVG YouTube play badge (27x19px, #FF0000 rounded rect + white play triangle) |
| **Content-type pills row** | left-[514px] top-[386px] flex flex-wrap items-center gap-[10px]; starts with CONTENT label (11px Bold uppercase tracking-[0.18em] #666666 mr-2), then pills (inline-flex items-center justify-center h-[35px] px-[22px] rounded-full border-[1.75px] border-[#D93832] text-[#D93832] text-[13.5px] font-bold leading-none whitespace-nowrap) |
| **3 grey stat cards** | left-[514px] top-[452px] flex gap-[16px]; each card w-[226px] h-[150px] bg-[#F2F2F2] rounded-[24px] relative |
| **Stat card internals** | Icon: inline SVG 28x28, #D93832, stroke-width 2, at top-[16px] right-[18px]. Label: Google Sans Bold 15.5px #141414 at left-[18px] top-[36px] (max-width 152px so two-word combined labels wrap clear of the icon). Number: YouTube Display Bold size 55 (text-[55px] leading-none #1A1A1A) at left-[18px] bottom-[18px] |
| **Scrubber progress bar** | Fill: left-0 top-[652px] w-[986px] h-[5px] gradient #E52D27 to #E5489A. Track: left-[986px] right-0 top-[652px] h-[5px] #C9C9C9. Handle: left-[980px] top-[645px] 18x18 rounded-[4px] #DE3B4B |
| **Single-line footnote** | left-[514px] top-[678px] w-[740px], Google Sans 11.5px leading-none #212121 |

Right-column text block (name, hook, bio) sits at left 514, width 732, top 124 on profile slides and top 96 on the title slide, and must end above y 376.

## Deck slide order (strict)
1. **Title slide:** portfolio header, subtitle (hook style), summary paragraph (bio style), category CONTENT pills, and 3 combined stat cards (Combined Subscribers, Combined Videos Produced, Combined Channel Views). The black panel holds a 5-tile mosaic of the creators' show images.
2. **Portfolio grid slide:** "Choose From A Portfolio Of Top [Category]" header + 5-column cards with circular avatar (100x100), channel name, handle, subscriber count (YouTube Display 55), total views, and 2 content pills.
3. **Category divider slide:** wide black rounded panel (w-[880px]) with market eyebrow, category title, description, white-text content pills, and the 3 combined stat cards stacked on the right.
4. **Slides 4 to N+3, creator profile cards:** one per creator in the exact input order (discovery mode: ranked order), following the portfolio card specification.

**Do not generate** a Methodology and Data Caveats slide or an Image Sources slide. Caveats go in footnotes and in the hand-off message.

Combined totals: add what is known; when a creator's primary metric was substituted, show the sum with a trailing "+" (2,201+) and say who is excluded in the footnote. Substitute metrics (TikTok followers and the like) never go into YouTube combined totals.

---

## Environment notes (sandboxed sessions)

Cloud sandboxes often block youtube.com, yt3.googleusercontent.com, i.ytimg.com and the tracker sites. When that happens:
- **Numbers:** use the WebSearch tool against vidIQ, Social Blade, Playboard, Influesque and YouTube channel pages. Search snippets carry the figures and their snapshot dates. Prefer the freshest dated figure; note the date in the footnote.
- **Images:** if the Google Slides and Google Drive connectors are available, create a scratch presentation and insert each channel's official image with Slides `createImage` (Google fetches the URL server side). Use the yt3 avatar URL at `=s900` when you have it; otherwise `https://unavatar.io/youtube/<handle>?fallback=false`, which resolves to the channel's own avatar at 900x900. Export the presentation with Drive `download_file_content` as `application/pdf` (the large result is saved to a file), decode the base64, extract with `pdfimages -all`, inspect every image, then trash the scratch file. Name scratch files clearly so the user knows they are safe to delete.
- Google Sheets IMPORTXML is not a usable fallback: uploaded CSV neutralizes IMPORT formulas, and uploaded XLSX returns #REF! until someone clicks "Allow access" in the Sheets UI.
- If neither path works, tell the user which hosts to allow in the environment's network settings and fall back to the Step 5 placeholder.

## Files
- `scripts/build_deck.py`: JSON to single-file HTML deck (stdlib only).
- `scripts/render_deck.cjs`: Playwright render to PDF and PNGs plus layout QA.
- `references/deck-schema.md`: deck JSON fields.
- `references/example-deck.json`: the Vietnam beauty test run (Oct 2026).
