---
name: "youtube-content-insight"
description: "Build a market-specific YouTube Trending Content Pack sales deck (.pptx) for agencies and brands: research native pillars, verify creators on Social Blade, get approval, then build and QA."
---

# YouTube Content Insight: Trending Content Pack deck

A sales deck for agencies and brands: "what [MARKET] can't stop watching on YouTube right now", organized into 4 to 6 content pillars native to that market, with real creators, sourced public stats, a surprising fact per pillar, and ready-to-pitch content angles. Reference decks: Vietnam (Google Slides 1b9hBOdL0z-agly4rg89bZx0kS4A7FXrau84aU_WmZNE), Philippines (41 slides) and Thailand (47 slides), all 2026. Output: a 16:9 .pptx built with pptxgenjs that the user opens in Google Slides.

## Hard rules (never break)
- Never use em dashes or en dashes anywhere: slides, speaker notes, chat.
- Never mention any other country, market or region in the deck (slides AND notes). Watch for: "most subscribed in Southeast Asia", "Asian output", event names with a region (say "Thailand Game Show", not "gamescom asia x Thailand Game Show"), host cities of international events, creator nationalities, foreign series lists from Year in Search.
- Public data only. No slides needing YouTube internal data (no audience splits, gender, in-market, watch time YoY placeholders). No video_content ID placeholders.
- No "Activate" section (no Creator Program, tiers, package pricing, algorithm or partnership-ads slides).
- Every stat needs a source (outlet + date). No source, no stat. Source in the footer of every stat slide; detail in speaker notes.
- Charts are shapes (rectangles + text), never native pptx charts (they break in Google Slides).
- Headlines are short, confident claims, not labels. Friendly, clear English. Extra detail goes to notes.
- Conversation language follows the user (often Vietnamese); deliverables in English.

## Step 1: Research, then stop for approval
1. Reference deck: if given a Google Slides link, read it with the Drive connector (read_file_content, fileId from /d/<id>/). To see visuals, download_file_content with exportMimeType application/vnd.openxmlformats-officedocument.presentationml.presentation, base64-decode the saved JSON content to .pptx, render with LibreOffice.
2. Test reachability at the start: curl youtube.com, yt3.ggpht.com, i.ytimg.com. They are usually blocked; tell the user immediately that avatars will be monogram placeholders.
3. Best sources, in order:
   - YouTube Works Awards [market] press coverage (Google country manager stats: CTV viewers, Shorts upload growth, trust %, % of views 1+ month after upload, ROI vs TV via Analytic Edge, winners by category). Local-language outlets carry the most numbers.
   - Google Year in Search [market]: local Google blog (blog.google/intl/<lang>-<cc>/...) and trends.withgoogle.com/year-in-search/<year>/<cc>/.
   - YouTube year-end lists on the local Google blog (top music videos, top creators). Goldmine for surprising facts.
   - Channel rankings (HypeAuditor top-youtube-all-<country>, Favikon, Spiralytics) as a map only. HypeAuditor also returns channel IDs if asked.
   - Streams Charts / Esports Charts, Wikipedia (box office, charts, tours, event dates), national press (Nation Thailand, Bangkok Post, Inquirer, adobo, etc.).
4. Candidate pillar types to test (keep only what data proves is native): music and fandom (incl. local genres), TV/drama/series, talk shows and podcasts, horror and storytelling, food and travel, gaming and esports, sports, comedy and skits, shopping and reviews. Do not copy another market's pillars.
5. Present a shortlist: each pillar with 2 to 3 sourced proof points and 1 candidate surprising fact; plus screened-out options, swap options, and data gaps. Wait for OK.

## Step 2: Creators (8 to 10 per pillar)
- Social Blade via WebFetch, prompt: "Channel name, channel ID, exact subscriber count, total views."
- URL patterns, in order of reliability: /youtube/channel/UC.../monthly (works when the plain page 403s), /youtube/channel/UC..., /youtube/handle/<handle>/monthly, /youtube/c/<name>/monthly. Guessed handles often hit the wrong channel; always confirm the returned name. 403s are intermittent; retry with /monthly.
- Find IDs with web search: "socialblade <name>", "<name> youtube.com/channel UC", or HypeAuditor.
- Record: display name (romanize non-Latin names on slides, keep the native name in notes), channel ID, subs as Social Blade shows it, a 1 to 3 word niche. For a show hosted on a bigger channel, show a sourced views figure instead of subs.
- Brand-safety screen every creator: search "<name> controversy" in English AND the local language (Thai: ดราม่า). Exclude: controversies of any age (parody backlash, disputes, lawsuits, health misinformation), online gambling promotion, political content or political figures, kids-directed channels, anonymous or content-farm channels (thousands of uploads in a few years, no known host), suspicious subs-to-views ratios. List exclusions in the finishing message and notes.

## Step 3: Deck structure
1. Cover: pill "YOUTUBE ADVERTISING <YEAR> · <MARKET>", "Capture the Culture." (ink) + "Capitalise on the Trend." (red), subline, 2x3 mosaic of the pillar hero illustrations.
2. Why YouTube in <market>: 4 stat tiles (longevity, scale or reach, trust, return). If a tile has no public number, swap the concept and say so in notes.
3. Every screen: 4 tiles (connected TV, long-form, Shorts, live).
4. Contents: numbered pillar rows with icon squares.
Then for EACH pillar (7 slides):
  a. Divider: big red number, "THE <NOUN> OF" kicker, pillar name, one-line description, hero illustration.
  b. Surprising fact: red tag + ink "SURPRISING FACT" pill; huge number (100pt); the lead sentence as headline; one supporting line; pale "So what:" box; right side concentric pale circles with a big red icon tile and a "Did you know?" chip.
  c. Insight: 3 sourced stats + "Why it matters" box, OR a shape bar chart (top 5 channels) + 3 stat cards.
  d. What's working on YouTube: 4 format cards (2x2) + dark "Moments to own" panel with 4 dated upcoming events (verify every date; flag past-timing guesses in notes).
  e. Where your brand fits: 4 category cards (cite local YouTube Works Awards winners where possible) + dark "How to join the story" panel with 3 integration ideas.
  f. Creators: 8 to 10 channel cards, 4 columns for 8, 5 columns for 9 to 10, two rows: banner strip, centered avatar with white ring, name, "<subs> subs · <niche>", Subscribe pill.
  g. Dominate the key opinion leaders for <pillar>, while owning the trending moments: left grey panel "5 CONTENT ANGLES TO MAKE WITH THESE CREATORS" (numbered rows: bold angle + short description, then "With:" + creator names in red); right column: compact Roadblock card (pill, "100% share of voice across these creators", roadblock diagram) above a VeloTrend / Lineup card (2 to 3 lineup names with one-line descriptions, no IDs). Footnote about illustrative creators and DVIP.
Last: Sources slide.

## Step 4: Design system
- pptxgenjs LAYOUT_WIDE (13.333 x 7.5 in), white background, margins 0.55 in.
- Colors: red FF0033, ink 0F0F0F, pale FFE8EC, grey cards F3F3F3, muted text 5F5F5F, light 8A8A8A.
- Fonts: headlines Plus Jakarta Sans, body Google Sans. Title 30pt (Dominate title 26pt, two lines).
- Recurring pieces: red rounded tag "NN · PILLAR NAME" top-left; source footer 8.5pt; page number bottom right; dark ink panels for Moments and How to join.
- Icons: react-icons/pi Bold (filled stars: PiStarFill), rendered with react-dom/server, rasterized by sharp to 256px PNG in red and white. Check names exist before use.
- Hero illustrations: SVG per pillar in a YouTube player-card motif: white rounded card with soft red shadow, 16:9 thumbnail with themed art (800x450 region), red progress bar and knob, duration chip, avatar + title lines, dark top-left chip and white bottom-right chip (icon + label), pale decorative circles. sharp density 144, width 1500. Reusable arts so far: stage/equalizer (music), TV with silhouettes (series), podcast mic + bubbles (stories), ON AIR studio with two mics (talk), haunted night with ghost + ON AIR card (horror), noodle bowl + map pin + mountains (food and travel), pot with steam (cooking), court + controller + trophy (gaming), bag + product card (shopping).
- Banners: red strip with the pillar's icons repeated in white at 28% opacity. Avatars: 400px monogram circles rotating red, ink, pink, grey, inserted as images with altText so they can be swapped.
- Roadblock diagram: 3 thumbnails (pink, dark, pink), red play circle, yellow "Ad" chip, text lines.

## Step 5: Build and QA (bundled scripts)
The skill ships a working pipeline. Paths below are relative to this skill folder (`<skill>`).

- `templates/content.thailand.example.js`: a complete, real content file (Thailand, 47 slides). Copy it to your work folder as `content.js` and rewrite every field for the new market. Keep the shape: `market`, `file`, `cover`, `why`, `screens`, `contents`, `pillars[]` (each with `key`, `art`, `num`, `name`, `tag`, `short`, `icon`, `banner`, `hero`, `divider`, `fact`, `insight` (type `stats` or `bars`), `working`, `fit`, `creators.list[]`, `angles[5]`, `lineups[]`, `what`, plus the `*Notes` fields), and `sources[]`.
- `art` must be one of the hero arts in `scripts/assets.js`: `opm` (music stage), `tele` (TV series), `kwento` (stories mic + bubbles), `talk` (ON AIR studio), `ghost` (haunted night), `eat` (noodles + map pin), `kitchen` (cooking pot), `game` (controller + trophy), `shop` (bag + product card). For a new theme, add `arts.<name>` in assets.js (800x450 SVG) following the existing ones.
- Creator `url` holds the channel ID (notes print `youtube.com/channel/<id>`); `i` is the monogram (2 to 3 letters); avatar colors rotate automatically.
- Run from the work folder:
  ```bash
  bash <skill>/scripts/setup_fonts.sh          # once per machine: real fonts for faithful QA renders
  node <skill>/scripts/build.js content.js --dry   # writes icons.json + avatars.json
  node <skill>/scripts/assets.js content.js        # icons, heroes, banners, avatars, roadblock -> assets/
  node <skill>/scripts/build.js content.js         # -> out/<file>.pptx
  python3 <skill>/scripts/qa.py out/<file>.pptx --market <market>   # validate, render, contact sheets, dash/market/placeholder/chart scan
  ```
- Needs: node with pptxgenjs, react, react-dom, react-icons, sharp; python3 with Pillow and fontTools; LibreOffice and pdftoppm; the pptx skill scripts at /mnt/skills/public/pptx/scripts (validate.py, soffice.py).
- Look at every contact sheet (`out/contact-*.jpg`) for overflow, wrapped names, overlaps and empty areas. Fix copy length in content.js first; change layouts in build.js only if needed.
- pptxgenjs gotchas: every addText gets isTextBox: true and margin 0; colors without #; never reuse option objects; set layout before adding slides.
- Deliver the .pptx with SendUserFile. The Drive connector cannot edit slides in place and cannot upload multi-MB files, so the user imports via File > Import slides.

## Finishing message
Short: slide count and what's new, creator count and who was screened out and why, what the user must do (swap avatars, re-check fast-moving charts and near-expiry moments), and data gaps. No recap of steps.