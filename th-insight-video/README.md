# TH Creator Content Insight 2026: explainer video

A 5:24 motion explainer built from the deck "[TH] YouTube Creator Content Insight 2026".
Built with Remotion (React), keeping the deck's fonts (Plus Jakarta Sans, Google Sans),
YouTube red palette, icons and illustrations.

## Structure

- Intro: title, why Thai content shines (4 stats), every screen (4 stats), the six passion points
- Six sections, each in six beats: cover, surprising fact, proof, what works + moments to own,
  where brands fit, creators
- Amplify: creator content boosted together with brand ads (no sales contact, insight only)
- Outro

## Audio

- Music: "Sketch 06, Harbor Notes (Bossa Nova)". It plays once, then crossfades (equal power) into a second pass at a beat- and chroma-matched point (song 32.16 s at video 157.49 s), so the natural ending lands on the last frame. If the timeline length changes, recompute the join in `src/Video.tsx`.
- Sound effects are synthesised by `scripts/make_sfx.py` (whoosh, pop, tick, ding, impact,
  riser, sparkle, marimba notes, chord), no third-party samples

## Commands

```bash
npm install
python3 scripts/make_sfx.py public/sfx   # regenerate the SFX kit (needs numpy + scipy)
npx remotion studio                       # preview
npx remotion render src/index.ts InsightVideo out/th-creator-insight-2026.mp4 --crf=18
node scripts/stills.mjs 150 900          # spot-check frames as PNG
```

Content lives in `src/data.ts`; layout and motion in `src/scenes/*`; shared animation primitives in `src/ui.tsx`.

## Captions

```bash
node scripts/build-captions.mjs   # writes out/th-creator-insight-2026.en.srt from src/timeline.ts + src/data.ts
```
