---
name: buca-yildiz-design
description: Use this skill to generate well-branded interfaces and assets for Buca Yıldız Futbol Akademisi, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference
- **Brand:** Buca Yıldız Futbol Akademisi — youth football academy, İzmir. Corporate, professional, modern. Navy + gold; sharp lines, small radii.
- **Colors:** primary navy `--navy-700 #15295A`; precious accent gold `--gold-500 #C9A227`. Gold used sparingly. See `tokens/colors.css` and `guidelines/colors-*.html`.
- **Type:** `Barlow Condensed` (UPPERCASE display/headings), `Barlow` (body), `Barlow Semi Condensed` (stats/scores). Google Fonts CDN.
- **Voice:** Turkish, warm-but-institutional, addresses families as **siz**, no emoji, UPPERCASE headlines.
- **Icons:** Lucide (CDN), line style. No emoji, no hand-drawn SVG.
- **Logo:** `assets/logo-emblem.png` (transparent crest).

## How to consume
1. Link the global stylesheet: `<link rel="stylesheet" href="styles.css">` (it imports tokens + fonts).
2. For components, load the compiled bundle and read from the namespace:
   `const { Button, NewsCard } = window.BucaYLdZTasarMSistemi_45a34f;` (see any file in `ui_kits/website/`).
3. Compose screens from `components/` primitives; reference `ui_kits/website/` for full-page patterns.

## Files
- `styles.css`, `tokens/` — design tokens & fonts
- `components/{core,forms,club}/` — React primitives
- `ui_kits/website/` — homepage, başvuru form, panel login
- `guidelines/` — foundation specimen cards
- `assets/` — crest/logo
- `readme.md` — full design guide (content, visual foundations, iconography, manifest)
