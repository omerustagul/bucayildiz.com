# Website UI Kit — Buca Yıldız

High-fidelity recreation of the Buca Yıldız public website and member entry screens, composed from the design-system component primitives.

## Screens
- **`index.html`** — Homepage. Sticky header (crest + social left, *Panele Giriş* / *Başvuru Formu* right, mega menu below) → *Ücretsiz Denemelere Katıl* hero card → Haberler → Güncel Fikstür (navy band) → Görseller & Videolar → Yaş Grupları (A Takım, U-18…U-15) → Formalar marquee → footer with crest overhanging the top edge.
- **`basvuru.html`** — Başvuru / application form. Two columns: navy intro panel (benefits) + sporcu & veli form. Submits to a success state. *Starting point.*
- **`panel-giris.html`** — Panel login. Split card: navy brand side + e-posta/şifre form with remember + forgot links. *Starting point.*

## Composition
`index.html` loads React + Babel + the DS bundle (`../../_ds_bundle.js`) + Lucide, then mounts section components (`SiteHeader.jsx`, `NewsSection.jsx`, `FixtureSection.jsx`, `MediaSection.jsx`, `AgeGroupsSection.jsx`, `JerseySection.jsx`, `SiteFooter.jsx`). Each section file reads DS primitives from `window.BucaYLdZTasarMSistemi_45a34f` and exports itself to `window`.

## Notes
- Photos are branded navy placeholders; jerseys are CSS-shape placeholders. Swap in real assets when available.
- The jersey marquee pauses on hover and disables under `prefers-reduced-motion`.
