---
name: "youtube-content-insight"
description: "Build or edit a market-specific YouTube Trending Content Pack sales deck for agencies and brands. Build mode: research native pillars, verify creators on Social Blade, get approval, then build a 16:9 .pptx and QA it. Edit mode: change a live Google Slides deck in place through the Slides and Drive connectors (content ideas slides, one internal-data slide, real circle-cropped avatars, renumbering, render checks). Use for any YouTube trending content pack, creator pillar deck or market deck (VN, PH, TH or a new market), including a docs.google.com/presentation link with a request to update it."
---

# YouTube Content Insight: Trending Content Pack deck

A sales deck for agencies and brands: "what [MARKET] can't stop watching on YouTube right now", organized into 4 to 6 content pillars native to that market, with real creators, sourced public stats, a surprising fact per pillar, content ideas tied to named creators, and ready-to-pitch formats.

Reference decks (Google Slides, 2026):
- Vietnam `1b9hBOdL0z-agly4rg89bZx0kS4A7FXrau84aU_WmZNE`: the model for the content ideas slides and the Audiences slide.
- Thailand `1QZfw2zZnBVMrUBHx54nXNG44nqHuXhPw7vsqdedi1a8` (47 slides, built with this skill before the Sep 2026 merge).
- Philippines `118Nj6SOSNyJg1bPk2LGguqT9U-Uep1RofU7lNHKLnPI` (41 slides, earlier structure: no fact slides, 4 to 5 creators).

Two modes:
- **Build mode** (Steps 1 to 5): a new market or a full rebuild. Output: a 16:9 .pptx built with pptxgenjs that Vu imports into Google Slides.
- **Edit mode** (section E): the deck already lives in Google Slides. Change it in place with the Slides connector, so the file and link stay the same. Use it whenever Vu shares a docs.google.com/presentation link and asks for changes.

## Working with Vu
- Talk to Vu in Vietnamese and address her as "chị". Deliverables stay in English.
- Go phase by phase ("làm từ từ"): one deck at a time. Stop for sign-off after research and after each deck's audit, before writing to it.
- Never ask for or use Vu's Google password. Work only through the Slides and Drive connectors.
- Vu edits the deck in parallel (e.g. she set titles in "YouTube Display"). Re-read before every write, never overwrite her styling, and flag overflow caused by her changes instead of fixing it silently.
- When Vu rejects a stat, remove it entirely, and every line built on it. VN example: the "50%+ of watch time from audiences abroad" stat and the "Global reach: overseas Vietnamese" band item both went.
- Report back: lead with what changed, then the flags: stale numbers, weak sources, brand-safety notes, and overlaps with Vu's own in-progress edits.

## Hard rules (never break)
- Never use em dashes or en dashes anywhere: slides, speaker notes, chat.
- Never mention any other country, market or region in the deck (slides AND notes). Watch for: "most subscribed in Southeast Asia", "Asian output", event names with a region (say "Thailand Game Show", not "gamescom asia x Thailand Game Show"), host cities of international events, creator nationalities, foreign series lists from Year in Search.
- Public data only on every pillar slide. Anything that needs YouTube internal access (watch time YoY and CTV share, gender and age skew, in-market segments, VeloTrend video_content IDs) goes on ONE holder slide, the Audiences slide (Step 3), as red "[internal data]" placeholders. No internal-data placeholders anywhere else.
- No "Activate" section (no Creator Program, tiers, package pricing, algorithm or partnership-ads slides). Roadblock and VeloTrend live on each pillar's Dominate slide.
- Every stat needs a source (outlet + date). No source, no stat. Source in the footer of every stat slide; detail in speaker notes.
- Brand safety comes first (Step 2). When in doubt, leave the creator out and propose a safer swap.
- Circle-crop every avatar, every time.
- Charts are shapes (rectangles + text), never native pptx charts (they break in Google Slides). Tables are fine.
- Headlines are short, confident claims, not labels. Friendly, clear English. Extra detail goes to notes.

## Step 1: Research, then stop for approval
1. Reference deck: if given a Google Slides link, read it with Drive `read_file_content` (fileId from /d/<id>/). To see visuals, export it (E4).
2. Reachability: youtube.com, yt3.ggpht.com, i.ytimg.com and often socialblade.com are blocked from the container. In build mode, tell Vu that avatars start as monogram placeholders and can be swapped after import with the avatar pipeline (E3), which works because Google fetches images server side.
3. Best sources, in order:
   - YouTube Works Awards [market] press coverage (Google country manager stats: CTV viewers, Shorts upload growth, trust %, % of views 1+ month after upload, ROI vs TV via Analytic Edge, winners by category). Local-language outlets carry the most numbers.
   - Google Year in Search [market]: local Google blog (blog.google/intl/<lang>-<cc>/...) and trends.withgoogle.com/year-in-search/<year>/<cc>/.
   - YouTube year-end lists on the local Google blog (top music videos, top creators). Goldmine for surprising facts.
   - Channel rankings (HypeAuditor top-youtube-all-<country>, Favikon, Spiralytics) as a map only. HypeAuditor also returns channel IDs if asked.
   - Streams Charts / Esports Charts, Wikipedia (box office, charts, tours, event dates), national press (Nation Thailand, Bangkok Post, Inquirer, adobo, etc.).
4. Candidate pillar types to test (keep only what data proves is native): music and fandom (incl. local genres), TV/drama/series, talk shows and podcasts, horror and storytelling, food and travel, gaming and esports, sports, comedy and skits, shopping and reviews. Do not copy another market's pillars.
5. Present a shortlist: each pillar with 2 to 3 sourced proof points and 1 candidate surprising fact; plus screened-out options, swap options, and data gaps. Wait for OK.

## Step 2: Creators (8 to 10 per pillar)
- Counts: Social Blade via WebFetch, prompt: "Channel name, channel ID, exact subscriber count, total views." URL patterns, in order of reliability: /youtube/channel/UC.../monthly (works when the plain page 403s), /youtube/channel/UC..., /youtube/handle/<handle>/monthly, /youtube/c/<name>/monthly. 403s are intermittent; retry with /monthly. When Social Blade is unreachable, take the ID and count from WebSearch results (vidIQ, NoxInfluencer, HypeAuditor) and name that source in the notes.
- Guessed handles often hit the wrong channel; always confirm the returned name. Find IDs with web search: "socialblade <name>", "\"<name>\" youtube.com/channel UC", or HypeAuditor.
- Record: display name (romanize non-Latin names on slides, keep the native name in notes), channel ID, subs as the source shows it, a 1 to 3 word niche. For a show hosted on a bigger channel, show a sourced views figure instead of subs. For live streamers, "<X> hrs watched · H1 2026" (Streams Charts) can replace subs.
- Brand-safety screen every creator: search "<name> controversy" in English AND the local language (Thai: ดราม่า; Vietnamese: lùm xùm, bị phạt; Filipino: isyu, kontrobersya). Exclude:
  - controversies of any age (parody backlash, disputes, lawsuits, health misinformation) and any history of fines or public backlash;
  - prank, dangerous-stunt and "extreme challenge" channels (VN: NTN and PHD were removed at Vu's request);
  - online gambling promotion; political content or political figures; kids-directed channels; anonymous or content-farm channels (thousands of uploads in a few years, no known host); suspicious subs-to-views ratios.
- List exclusions in the finishing message and the notes. If only 7 creators pass, the 8th card reads "More creators on request".

## Step 3: Deck structure
1. Cover: pill "YOUTUBE ADVERTISING <YEAR> · <MARKET>", "Capture the Culture." (ink) + "Capitalise on the Trend." (red), subline, 2x3 mosaic of the pillar hero illustrations.
2. Why YouTube in <market>: 4 stat tiles (longevity, scale or reach, trust, return). If a tile has no public number, swap the concept and say so in notes.
3. Every screen: 4 tiles (connected TV, long-form, Shorts, live).
4. Contents: numbered pillar rows with icon squares.
5. Audiences (the only internal-data slide): tag "AUDIENCES", title "Who watches each passion point on YouTube", subline "Red cells are filled from YouTube internal data before this deck is shared". One table, one row per pillar; columns: Passion point | Watch time YoY, incl. CTV share | Gender and age skew | In-market segments | VeloTrend video_content IDs. Every data cell reads "[internal data]" in red (FF0033). Footer: "Source: YouTube internal data (to be pulled)". Notes: in-market hypotheses to validate and the VeloTrend lineup names per pillar.
Then for EACH pillar (8 slides):
  a. Divider: big red number, "THE <NOUN> OF" kicker, pillar name, one-line description, hero illustration.
  b. Surprising fact: red tag + ink "SURPRISING FACT" pill; huge number (100pt); the lead sentence as headline; one supporting line; pale "So what:" box; right side concentric pale circles with a big red icon tile and a "Did you know?" chip.
  c. Insight: 3 sourced stats + "Why it matters" box, OR a shape bar chart (top 5 channels) + 3 stat cards.
  d. What's working on YouTube: 4 format cards (2x2) + dark "Moments to own" panel with 4 dated upcoming events (verify every date; flag past-timing guesses in notes).
  e. Where your brand fits: 4 category cards (cite local YouTube Works Awards winners where possible) + dark "How to join the story" panel with 3 integration ideas.
  f. Creators: 8 to 10 channel cards, 4 columns for 8, 5 columns for 9 to 10, two rows: banner strip, centered circle-cropped avatar with white ring, name, "<subs> subs · <niche>", Subscribe pill. Footnote: "The creators featured are for illustrative purposes only, other creators also available upon request."
  g. Content ideas: a short claim as title (VN: "Put your brand inside the fandom", "Write your brand into the plot", "Make your product the challenge", "Join the stream, not just the break"). 4 cards, each one angle tied to one named creator from slide f: bold angle title, then italic "<Creator>: <what they make, with the brand's role>". When one of the pillar's creators runs a show format (a network, studio or show channel; VN: Vie Channel's Anh Trai Say Hi), one card is "Celebrity show integration". Dark band "HOW THE BRAND SHOWS UP" with 3 formats. Footer: "Sample content angles for illustration only. Final concepts are co-created with each creator and subject to their approval."
  h. Dominate the key opinion leaders for <pillar>, while owning the trending moments: Roadblock card (pill, "100% share of voice across these creators", roadblock diagram) and VeloTrend / Lineup card (2 to 3 lineup names with one-line descriptions, no IDs) side by side. No content-angles panel (angles live on slide g). Footnote about illustrative creators and DVIP.
Last: Sources slide.
Optional, only when Vu asks: a closing "How to get started" slide before Sources (4 numbered steps: pick passion points, shortlist creators, co-create, amplify; plus a dark "What we need from you" band: brief, brand guardrails, key moments), as in the VN deck.

## Step 4: Design system
- pptxgenjs LAYOUT_WIDE (13.333 x 7.5 in), white background, margins 0.55 in.
- Colors: red FF0033, ink 0F0F0F, pale FFE8EC, grey cards F3F3F3, muted text 5F5F5F, light 8A8A8A.
- Fonts: headlines Plus Jakarta Sans, body Google Sans. Title 30pt (Dominate title 26pt, two lines). In edit mode, keep whatever title font Vu has set.
- Recurring pieces: red rounded tag "NN · PILLAR NAME" top-left; source footer 8.5pt; page number bottom right; dark ink panels for Moments, How to join and How the brand shows up.
- Icons: react-icons/pi Bold (filled stars: PiStarFill), rendered with react-dom/server, rasterized by sharp to 256px PNG in red and white. Check names exist before use.
- Hero illustrations: SVG per pillar in a YouTube player-card motif: white rounded card with soft red shadow, 16:9 thumbnail with themed art (800x450 region), red progress bar and knob, duration chip, avatar + title lines, dark top-left chip and white bottom-right chip (icon + label), pale decorative circles. sharp density 144, width 1500. Reusable arts so far: stage/equalizer (music), TV with silhouettes (series), podcast mic + bubbles (stories), ON AIR studio with two mics (talk), haunted night with ghost + ON AIR card (horror), noodle bowl + map pin + mountains (food and travel), pot with steam (cooking), court + controller + trophy (gaming), bag + product card (shopping).
- Banners: red strip with the pillar's icons repeated in white at 28% opacity. Avatars: build mode inserts 400px monogram circles rotating red, ink, pink, grey, as images with altText so they can be swapped; edit mode swaps in real circle-cropped avatars (E3).
- Roadblock diagram: 3 thumbnails (pink, dark, pink), red play circle, yellow "Ad" chip, text lines.

## Step 5: Build and QA (bundled scripts)
The skill ships a working pipeline. Paths below are relative to this skill folder (`<skill>`).

- `templates/content.thailand.example.js`: a complete, real content file (Thailand, 54 slides). Copy it to your work folder as `content.js` and rewrite every field for the new market. Keep the shape: `market`, `file`, `cover`, `why`, `screens`, `contents`, `audiences` (optional `title`, `sub`), `pillars[]` (each with `key`, `art`, `num`, `name`, `tag`, `short`, `icon`, `banner`, `hero`, `divider`, `fact`, `insight` (type `stats` or `bars`), `working`, `fit`, `creators.list[]`, `ideas` (`title`, `cards[4]` of `{icon, t, c, d}` where `c` is the creator, `band[3]` of `{t, d}`), `lineups[]`, `inMarket`, `what`, plus the `*Notes` fields), and `sources[]`.
- `art` must be one of the hero arts in `scripts/assets.js`: `opm` (music stage), `tele` (TV series), `kwento` (stories mic + bubbles), `talk` (ON AIR studio), `ghost` (haunted night), `eat` (noodles + map pin), `kitchen` (cooking pot), `game` (controller + trophy), `shop` (bag + product card). For a new theme, add `arts.<name>` in assets.js (800x450 SVG) following the existing ones.
- Creator `url` holds the channel ID (notes print `youtube.com/channel/<id>`); `i` is the monogram (2 to 3 letters); avatar colors rotate automatically. A list of 7 gets an automatic "More creators on request" card.
- Run from the work folder:
  ```bash
  bash <skill>/scripts/setup_fonts.sh          # once per machine: real fonts for faithful QA renders
  node <skill>/scripts/build.js content.js --dry   # writes icons.json + avatars.json
  node <skill>/scripts/assets.js content.js        # icons, heroes, banners, avatars, roadblock -> assets/
  node <skill>/scripts/build.js content.js         # -> out/<file>.pptx
  python3 <skill>/scripts/qa.py out/<file>.pptx --market <market>   # validate, render, contact sheets, dash/market/placeholder/chart scan
  ```
- Needs: node with pptxgenjs, react, react-dom, react-icons, sharp; python3 with Pillow and fontTools; LibreOffice; pdftoppm or PyMuPDF (qa.py falls back to PyMuPDF); the pptx skill scripts (validate.py, soffice.py), which qa.py looks for in /mnt/skills/public/pptx/scripts and then under ~/.claude/skills.
- Look at every contact sheet (`out/contact-*.jpg`) for overflow, wrapped names, overlaps and empty areas. Fix copy length in content.js first; change layouts in build.js only if needed.
- pptxgenjs gotchas: every addText gets isTextBox: true and margin 0; colors without #; never reuse option objects; set layout before adding slides.
- Deliver the .pptx with SendUserFile; Vu imports it via File > Import slides. Drive uploads of multi-MB files fail. Once the slides are in Google Slides, switch to edit mode for any change, including the avatar swap.

## E. Edit a live Google Slides deck
Load the `google-workspace` skill and read its `references/slides.md` before the first write. Every change lands in Vu's file: same deck, same link.

### E1. Access and audit
1. Open the deck: Drive `get_file_metadata`, then Slides `read_presentation` with a field mask. "Not found" or "Permission denied" means the deck is not shared with the connector's Google account: ask Vu to share it as Editor. Never ask for a password.
2. Read the text with Drive `read_file_content`; read geometry with a masked `read_presentation` (mask in slides.md). A read over the size limit is saved to a file: parse it with python or `slides_helper.py outline`, never page through it.
3. Export and render the deck once (E4) to see the current state.
4. Audit against Step 3 and the hard rules: missing Audiences, fact or content ideas slides; fewer than 8 creators; content-angles panels still on Dominate slides; internal-data placeholders outside the Audiences slide; dashes; other markets; stale or unsourced stats; monogram avatars; brand-safety issues.
5. Send Vu the audit as numbered phases and wait for her OK. Then run one phase at a time and show the renders after each.

### E2. Connector mechanics
- Guard every write with the latest revision: re-read `revisionId` right before each batch and pass it as `writeControl.requiredRevisionId`. On a mismatch, re-read and rebuild; never retry without the guard.
- Edit text without losing styles: `replaceAllText` scoped with `pageObjectIds` keeps the existing styles. `deleteText` + `insertText` resets them, so re-apply `updateTextStyle` afterwards.
- Numbers-only boxes (page numbers): never use `replaceAllText`, because "4" also matches inside "44". `insertText` the new number at index 0, then `deleteText` the old characters with a `FIXED_RANGE`; the new text inherits the style.
- Object IDs must be 5 to 50 characters (`cx1` fails, `idea_s1` works).
- `duplicateObject` copies a whole slide; `objectIds` names the copies.
- `updateSlidesPosition`: `insertionIndex` counts from the order before the move.
- `createSlide` with `predefinedLayout: BLANK` can fail on custom masters; omit the layout for scratch slides.
- Table text: style cell text per cell with `cellLocation`.
- Batches are atomic: one bad image URL fails the whole batch. Test uncertain images one per call on a scratch slide first.

### E3. Avatar pipeline (circle-crop every avatar)
The container cannot reach youtube.com or most sites, but Google fetches image URLs server side:
1. Fetch the raw avatar: `createImage` (or `replaceImage`) with `https://unavatar.io/youtube/<channelId or handle>?fallback=false`. Prefer the channel ID (UC...). Guessed handles can return the wrong channel or a letter placeholder (VN: `BENEAGLE` returned a letter, `tinhte` needed checking).
2. Read the Google copy: the element's `image.contentUrl` (lh7-rt.googleusercontent.com).
3. Circle-crop it: `replaceImage` / `createImage` with `https://wsrv.nl/?url=<urlencoded contentUrl>&w=400&h=400&fit=cover&mask=circle&output=png`. wsrv cannot fetch unavatar directly; it must go through the Google contentUrl. A contentUrl that is already circle-cropped can be reused as is in `replaceImage`.
4. Verify visually: lay the raw avatars out in a grid on a scratch slide, export to PDF, check each face or logo against the channel, then delete the scratch slide.
5. Channel IDs: WebSearch `"<name>" youtube.com/channel`, or vidIQ / Social Blade / NoxInfluencer results.

### E4. Verification loop
- Export with Drive `download_file_content` (`application/pdf`). Render the saved result with `google-workspace/scripts/render_export.py` (use `--pages` for single slides); when pdftoppm is missing, render the decoded PDF with PyMuPDF. Build PIL contact sheets and look at every changed slide.
- Catch these problems: avatars covering card titles; titles wrapping after Vu's font change; source lines running into the page number; cards touching the subtitle; text overflowing its card.
- After adding, moving or deleting slides, renumber the static page-number boxes by slide position (E2 recipe).
- Scan the export's text: no em or en dashes, no other markets, "[internal data]" only on the Audiences slide.

### E5. Recipes for the Step 3 structure
- Content ideas slide: duplicate the pillar's "Where your brand fits" slide and move the copy right after the Creators slide. Swap in the title, the 4 card titles (angles), the italic descriptions ("<Creator>: <angle>"), card icons if needed, the band label "HOW THE BRAND SHOWS UP", the 3 band items, and the footer line.
- Dominate slide with a content-angles panel: delete the panel's elements (panel card, label, numbered circles, angle rows, "With:" lines, dividers), then move and resize the Roadblock and VeloTrend cards and their contents into two side-by-side cards that fill the freed area. Keep the title and the DVIP footnote.
- Creators slide with fewer than 8 cards: duplicate one card's elements (card, banner, white ring, avatar, name, subs line, Subscribe pill), fill in the new creators, and re-grid all cards (8: 4 columns; 9 to 10: 5 columns; 2 rows). Then run E3 on every avatar.
- Audiences slide: create it after Contents (no predefined layout on custom masters), add the tag, title and subline in the deck's fonts, and a real table: bold header without fill, one row per pillar, bold first column, data cells "[internal data]" in FF0033, light row borders only.
- Stat removal: delete the stat, then search the deck (`read_file_content`) for every line that repeats or depends on it and remove those too.

## Finishing message
In Vietnamese, addressing Vu as "chị". Short: slide count and what changed, creator count and who was screened out and why, what Vu must do (swap any remaining monogram avatars, re-check fast-moving charts and near-expiry moments), flags (stale numbers, weak sources, brand-safety notes, overlaps with her edits) and data gaps. No recap of steps.

## Market notes
Per-market research (verified channel IDs, screened-out creators, numbers to re-check, open items) lives in `references/market-notes.md`. Read the market's section before a refresh and add to it at the end of each session.
