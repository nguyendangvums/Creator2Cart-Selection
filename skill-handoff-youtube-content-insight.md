# Skill handoff: merge into `youtube-content-insight`

Source: the session editing the VN deck "YouTube_Trending_Content_Pack_2026_VN"
(Google Slides `1b9hBOdL0z-agly4rg89bZx0kS4A7FXrau84aU_WmZNE`), Sep 2026.

How to use this file in a new session: say "tổng hợp skill từ file skill-handoff-youtube-content-insight.md
và kết hợp với youtube-content-insight". Claude should read this file and the current
`youtube-content-insight/SKILL.md`, resolve the conflicts listed at the end with Vu,
then add the sections below as a new mode, "Edit a live Google Slides deck".

---

## 1. Vu's working rules learned in this session

- **No em dashes or en dashes anywhere:** slides, notes or chat.
- **Circle-crop every avatar, every time.** Vu stated this as a standing rule.
- **Never ask for or use Vu's Google password.** Edit only through the Slides and Drive connectors.
- **Brand safety comes first.** Vu removed NTN and PHD ("tìm người khác safe hơn"). She kept Bà Tân Vlog.
  - Screen out prank, dangerous-stunt and "extreme challenge" creators before proposing them.
  - Screen out creators with a history of fines or public backlash.
- **Remove a stat entirely when Vu rejects it.**
  - Example: the "50%+ of watch time from audiences abroad" stat.
  - Also remove every line built on that stat, e.g. the "Global reach: overseas Vietnamese" band item.
- **Show 8 to 10 creators per pillar,** not 4 or 5.
- **Content ideas slide per pillar:** add one after each Creators slide.
  - 4 sample angles, each tied to a named creator.
  - Include a "Celebrity show integration" angle where a creator runs a show format (e.g. Vie Channel).
  - Add a dark "How the brand shows up" band with 3 formats.
  - Footer: "Sample content angles for illustration only. Final concepts are co-created with each creator and subject to their approval."
- **Report back in Vietnamese,** addressing Vu as "chị".
  - Lead with what changed.
  - Then list flags: stale numbers, weak sources, brand-safety notes, and overlaps with Vu's own in-progress edits.
- **Vu edits the deck in parallel,** e.g. the title font "YouTube Display".
  - Re-read before every write.
  - Never overwrite her styling.
  - Flag overflow caused by her changes instead of fixing it silently.

## 2. Connector mechanics (Google Slides, live deck)

- **Guard every write with the latest revision.**
  - Re-read `revisionId` right before each batch.
  - Pass it as `writeControl.requiredRevisionId`.
- **Edit text without losing styles:**
  - Use `replaceAllText` scoped with `pageObjectIds`. It keeps the existing styles.
  - `deleteText` + `insertText` resets styles, so re-apply `updateTextStyle` afterwards.
- **Numbers-only text boxes (e.g. page numbers):** never use `replaceAllText`, because "4" also matches inside "44".
  - Instead, `insertText` the new number at index 0.
  - Then `deleteText` the old characters at a `FIXED_RANGE`.
  - The new text inherits the style.
- **Object IDs** must be 5 to 50 characters (`cx1` fails, `idea_s1` works).
- **`duplicateObject`** copies a whole slide.
- **`updateSlidesPosition`:** `insertionIndex` counts from the order before the move.
- **`createSlide` with `predefinedLayout: BLANK`** can fail on custom masters. Omit the layout for scratch slides.
- **Table text:** style cell text per cell with `cellLocation`.
- **Batches are atomic,** so one bad image URL fails the whole batch.
  - Test uncertain images in single-request calls on a scratch slide first.
- **Large reads:** `read_presentation` output over the limit is saved to a file. Parse it with python and do not page through it.

## 3. Avatar pipeline (the container cannot reach youtube.com or most sites)

Google fetches image URLs server side, so:

1. **Fetch the raw avatar.** Call `createImage` (or `replaceImage`) with `https://unavatar.io/youtube/<channelId or handle>?fallback=false`.
   - Prefer the channel ID (UC...).
   - Guessed handles can return the wrong channel. Examples: `BENEAGLE` returned a letter placeholder, `tinhte` needed checking.
2. **Read the Google copy.** Read the element's `image.contentUrl` (lh7-rt.googleusercontent.com).
3. **Circle-crop it.** Call `replaceImage` / `createImage` with:
   `https://wsrv.nl/?url=<urlencoded contentUrl>&w=400&h=400&fit=cover&mask=circle&output=png`
   - wsrv cannot fetch unavatar directly; it must go through the Google contentUrl.
   - A contentUrl that is already circle-cropped can be reused as-is in `replaceImage`.
4. **Verify visually.** Lay the raw avatars out in a grid on a scratch slide, export to PDF, and check each face or logo before using it. Delete the scratch slide afterwards.
5. **Find channel IDs with WebSearch:** `"<name>" youtube.com/channel`, or vidIQ / Social Blade / NoxInfluencer results.
   - Social Blade itself is not reachable from the container.

## 4. Verification loop

- **Export and render.**
  - Export with Drive `download_file_content` (`application/pdf`). The saved result file goes to `google-workspace/scripts/render_export.py` (use `--pages` for single slides).
  - Build PIL contact sheets and look at every changed slide.
- **Catch these problems:**
  - Avatars covering card titles (fixed by 0.60in avatars at the card top).
  - Titles wrapping after Vu's font change.
  - Source lines running into the page number.
  - Cards touching the subtitle (row 1 at y 2.4in works).
- **Renumber static page-number boxes** by slide position after adding, moving or deleting slides.

## 5. Layout specs used in the VN deck (13.33 x 7.5in)

- **Creators slide (8 cards, 4x2).**
  - Cards: 2.88 x 1.45in, 0.2in gap, x from 0.6in, rows at y 2.4 and 4.05in, fill F4F4F4, no outline.
  - Avatar: 0.8in circle at card +0.18 / +0.325.
  - Text box: at card +1.08 / +0.08, 1.70 x 1.29in, middle-anchored.
  - Name: Plus Jakarta Sans 13 bold 0F0F0F.
  - Second line: Google Sans 10.5, 6E6E6E, "Subs: X · niche". For streamers use "X hrs watched · H1 2026".
  - If only 7 creators pass screening, the 8th card reads "More creators on request".
- **Idea slide.** Duplicate the pillar's "Where your brand fits" slide, then swap in:
  - Card titles (angles).
  - Italic descriptions ("<Creator>: <angle>").
  - Band label "HOW THE BRAND SHOWS UP".
- **Audiences slide.** Table: Passion point | Watch time YoY incl. CTV | Gender and age skew | In-market segments to validate.
- **Activate slide.** Roadblock card plus a VeloTrend lineup table for every pillar.
- **Closing slide "How to get started".**
  - 4 numbered steps: pick passion points, shortlist creators, co-create, amplify.
  - "What we need from you" band: brief, brand guardrails, key moments.

## 6. VN research notes (for refreshes)

- **Verified VN channel IDs:**

  | Creator | Channel ID |
  |---|---|
  | SOOBIN | UCr5yCP6Qjel6r66JMPXkk6g |
  | Quang Hùng MasterD | UCQ4snivOmAYFUR1vdFOwMKw |
  | Phương Mỹ Chi | UCGRIV5jOtKyAibhjBdIndZQ |
  | Sang Vlog | UCPsM4HZOSOfbCxYD4Fgy-1A |
  | Mèo Simmy | UCh2lo0AEEMkJ3LO4dldfjGA |
  | Đen Vâu | UCWu91J5KWEj1bQhCBuGeJxw |
  | Hoàng Thùy Linh | UCMLVQcgkkFsTR7o8_sMt7lQ |
  | Quỳnh Trần JP | UCfqlEBRWzGJEFOdcL_RJycA |
  | Fahoka Xê Dịch | UCrTm4gQU2ka7Bqctm8GMQMw |

- **Verified handles:** HIEUTHUHAIOFFICIAL, HaiXuanHinhOfficial, schannelvn, BenEagleOfficial, AmThucMeLam, MisterVit.
- **Screened out:**
  - NTN: prank and backlash history.
  - PHD: extreme stunts.
  - Thầy Giáo Ba: YouTube channel deleted in 2021.
  - Quang Linh Vlogs: legal case in 2025.
  - Hưng Vlog: fined for its content.
- **Weak or stale numbers to re-check before sending to a client:**
  - SOOBIN (Oct 2024)
  - Phương Mỹ Chi (Sep 2024)
  - Sang Vlog (2023)
  - Mister Vịt and Mèo Simmy (blog sources)
  - Ẩm Thực Mẹ Làm (2024)
- **Still open in the VN deck:** PHD remains on slide 25 (stat "9.91M") and on slide 29 (idea card "Survival test"). Vu stopped the fix, so ask before changing.

## 7. Conflicts with the current `youtube-content-insight` SKILL.md (ask Vu to decide)

- **Internal data.** The skill says "public data only, no internal-data placeholders, no video_content IDs, no Activate section". In this session Vu approved:
  - An Audiences table with "[VN internal data]" placeholders.
  - An Activate slide with VeloTrend IDs marked "to be confirmed".
- **Creators layout.** The skill specifies banner cards with Subscribe pills in 4 or 5 columns. This session switched to the simpler 4x2 avatar cards.
- **Content ideas.** The skill puts "5 content angles" inside the Dominate slide. This session used separate idea slides with 4 angles plus celebrity-show integration.
