# Vietnam beauty: top 5 YouTube creators (test run)

First test of the `creator-portfolio-design` skill (`.claude/skills/creator-portfolio-design`), run 14 Oct 2026.

- `vietnam-beauty-top5.html`: single-file deck (images inlined). Open in a browser; print to PDF gives one slide per page.
- `vietnam-beauty-top5.pdf`: 8-page PDF, 1280x720 per page.
- `previews/`: PNG of each slide at 2x.
- `deck.json`: all copy, numbers, and a `sources` audit trail per creator.
- `images/`: each creator's official YouTube channel image (900x900) as show image, avatar and mosaic tile.

Rebuild after editing `deck.json`:

```bash
S=.claude/skills/creator-portfolio-design/scripts
python3 $S/build_deck.py decks/vietnam-beauty-top5/deck.json -o decks/vietnam-beauty-top5/vietnam-beauty-top5.html
NODE_PATH=$(npm root -g) node $S/render_deck.cjs $PWD/decks/vietnam-beauty-top5/vietnam-beauty-top5.html
```

Selection: discovery mode, ranked by subscribers among beauty-led Vietnamese channels.
YouTube metrics only, read from each channel's YouTube About page on 14 Oct 2026 (rendered via WordPress mShots, fetched by Google Slides).
Open items: Changmakeup uploads rarely now (about 860 daily views on Social Blade); Lie Makeup's About description now lists AI 3D animation content, so confirm the channel's direction before pitching it.
