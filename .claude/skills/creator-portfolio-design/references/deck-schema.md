# Deck JSON schema

`scripts/build_deck.py` reads one JSON file. Image paths are relative to that file.

```jsonc
{
  "page_title": "Vietnam Beauty Portfolio",      // browser tab title, 2 to 4 words
  "category": "Beauty",                          // rendered ALL CAPS in the red pill
  "market": "Vietnam",                           // optional
  "brand_fit": null,                             // optional advertiser vertical
  "selection_note": "...",                       // optional: how creators were chosen

  "title_slide": {
    "header": "Vietnam Beauty Creator Portfolio",
    "subtitle": "...",                           // hook style, one line
    "summary": "...",                            // bio style, max 4 lines
    "pills": ["Beauty", "Makeup", "Skincare", "Reviews"],
    "combined": {"subscribers": "8.36M", "videos": "2,201+", "views": "1.47B+"},
    "mosaic": ["images/a-mosaic.jpg", "..."],    // first tile is wide; up to 5
    "image": "images/x.jpg",                     // used only when mosaic is empty
    "top": 96,                                   // optional text block top (px)
    "footnote": "..."
  },

  "grid_slide": {
    "header": "Choose From A Portfolio Of Top Beauty Creators",
    "footnote": "..."
  },

  "divider_slide": {
    "eyebrow": "Vietnam",                        // defaults to market
    "title": "Beauty",
    "description": "...",
    "pills": ["Makeup", "Skincare", "Reviews", "Tutorials"],
    "footnote": "..."                            // max ~60 characters (346px column)
  },

  "creators": [
    {
      "name": "Hà Linh Official",
      "handle": "@HaLinhOfficial",
      "url": "https://www.youtube.com/@HaLinhOfficial",
      "hook": "...",                             // <= 12 words, one line
      "bio": "...",                              // 55 to 75 words, max 4 lines
      "pills": ["Beauty", "Reviews", "Skincare", "Makeup"],   // 2 to 4
      "grid_pills": ["Reviews", "Skincare"],     // exactly 2
      "stats": {"subscribers": "2.22M", "videos": "452", "views": "395M"},  // null = TBC
      "image": "images/halinh-show.jpg",         // missing = dashed placeholder
      "avatar": "images/halinh-avatar.jpg",
      "top": 124,                                // optional text block top (px)
      "footnote": "...",
      "sources": {                               // not rendered; audit trail
        "subscribers": "Social Blade / vidIQ, Jan 2026 (2.22M)",
        "videos": "...", "views": "...", "image": "https://i.ytimg.com/vi/<id>/maxresdefault.jpg"
      }
    }
  ]
}
```

Rules enforced by the builder (warnings) and the renderer (failures) are listed in SKILL.md Steps 7 and 8.
