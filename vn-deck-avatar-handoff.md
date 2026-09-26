# Handoff: add channel avatars to the VN Trending Content Pack deck

Deck: https://docs.google.com/presentation/d/1b9hBOdL0z-agly4rg89bZx0kS4A7FXrau84aU_WmZNE/edit
(YouTube_Trending_Content_Pack_2026_VN, 61 slides)

Requirement from Vu: every slide that names a YouTube channel shows that channel's avatar.

## Prerequisites for the session doing the edit
- Google Slides connector connected (edits land in the same deck, same link).
- Network access to youtube.com, yt3.googleusercontent.com and yt3.ggpht.com, to look up each avatar URL.
  Slides `createImage` then fetches the yt3 URL itself.

## Slides and channels

Replace the initials circle with the real avatar, same position and size, circular crop:
- 10: Sơn Tùng M-TP Official (10.1M), Vie Channel - HTV2 (10M), Hòa Minzy (3.16M), YeaH1 Show (770K)
- 17: Uyen Ninh (3.59M), Khoai Lang Thang (3.54M), Hòa Minzy (3.16M), Ninh Titô (872K)
- 24: H&T Official (31.2M), Chany (19.8M), Nam Phương (19.4M), FAPTV (14.6M), Oppa Huy IDol (12.1M), Yến Dương (7.38M), Ghiền Mì Gõ (6.9M)
- 31: TonyTV (11.5M), Lâm Vlog (11.2M), PHD - Phương Hữu Dưỡng (9.91M), Bà Tân Vlog (4.59M)
- 38: Cris Devil Gamer (10.5M), MixiGaming (8.2M+), Oops Zeros (4M+), FPT Bóng Đá (1.79M)
- 45: Vật Vờ Studio (2.34M), Ha Linh Official (2.22M), Trinh Phạm (1.2M), Changmakeup (1.2M), Chloe Nguyen (418K), Dương Dê (3.3B views)

Add a small avatar where there is no slot today:
- 20 (bar chart): ToRung (59.4M) plus the 6 Shorts channels above, beside each bar label
- 34 (bar chart, hours watched): MixiGaming, Bác Gấu, Thầy Giáo Ba, Levi, TUI TÊN BÔ
- 27 (3 stats): TonyTV, PHD, Lâm Vlog, in place of the icon above each number

## Rules
- Match each avatar to the channel by subscriber count on the slide. Ambiguous names (Levi, Bác Gấu,
  Changmakeup): if not certain, keep the initials circle and report it. Never guess.
- Read before edit, guard every batch with writeControl.requiredRevisionId, verify with a PDF render.
- Vu's house rules: no em-dashes, sentence case, numbers as numerals.

## Other review findings (only fix once Vu approves)
1. Old product name "partnership ads" on slides 9, 23, 48, 50, 51, 60 (60 in the title); slide 49 says
   "Creator Partnership Boost". Current name: creator partnerships boost (renamed at NewFronts 2026).
2. Numbers as words: slide 4 "Six things", 50 "Three levers, one plan", 55 "Three reasons" and
   FIRST/SECOND/THIRD, 41 "three years", 49 "two rounds".
3. Unfilled placeholders: [VN internal data] on 8, 15, 22, 29, 36, 43; [ID TBC] on 11, 18, 25, 32, 39, 46;
   [Confirm VN tiers] on 49; [x] on 51.
4. Slide 38 uses "8.2M+" and "4M+" while other slides use exact Social Blade counts.
