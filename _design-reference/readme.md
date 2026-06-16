# Buca Yıldız — Tasarım Sistemi

Design system for **Buca Yıldız Futbol Akademisi**, a youth football (altyapı) academy based in Buca, İzmir. The system powers the club's public website and member panel with a **professional, corporate yet modern** visual language built on the club's two colors: **lacivert (navy)** and **gold**.

> **Brand essence:** Look like a serious institution — a real club, not a hobby site. Sharp, confident lines softened by only the smallest radii. Navy and white do the heavy lifting; gold is used sparingly, as a precious accent.

## Sources
- **Club crest / logo:** `uploads/WhatsApp Image 2026-06-12 at 20.10.36.jpeg` — supplied by the client. Processed into a transparent circular PNG at `assets/logo-emblem.png` (background removed by clipping to the outer ring); original kept at `assets/logo-emblem-original.jpeg`.
- **Brief:** client-provided site template description (header with logo + social left, panel/başvuru buttons right, mega menu below; homepage sections: ücretsiz deneme card → haberler → güncel fikstür → medya → yaş grupları → sliding jerseys → footer with overhanging crest).
- No codebase or Figma file was provided — visual foundations are derived from the crest and the written brief.

---

## CONTENT FUNDAMENTALS
Copy is **Turkish**, written in a warm-but-institutional voice.

- **Tone:** confident, disciplined, encouraging. The club speaks as a serious academy that develops character as well as players ("disiplin, saygı ve takım ruhu").
- **Person:** addresses families and prospects directly with **siz** ("Yıldız adaylarını sahaya bekliyoruz", "Hemen kayıt ol"). The club refers to itself as **biz / kulübümüz**.
- **Casing:** **Headlines are UPPERCASE** (sporty, strong) set in the condensed display face. Body and UI labels use normal sentence case. Button labels render uppercase automatically.
- **Numbers:** Turkish formatting; scores and stats use the condensed tabular face ("3 – 1", "19:00", "128 lisanslı sporcu").
- **Emoji:** **none.** The brand never uses emoji. Iconography is line icons only.
- **Vocabulary:** football/academy register — *altyapı, yaş grupları, fikstür, gelişim ligi, seçmeler, deneme antrenmanı, forma, A Takım, U-15…U-18*.
- **Examples**
  - Kicker → Title: `KULÜPTEN` → "Son Haberler"; `FİKSTÜR` → "Güncel Maç Programı"; `AKADEMİ` → "Yaş Grupları".
  - CTA copy: "Ücretsiz Denemelere Katıl", "Hemen Kayıt Ol", "Başvuru Formu", "Panele Giriş".
  - Microcopy: "* işaretli alanlar zorunludur.", "Antrenörlerimiz 48 saat içinde sizinle iletişime geçecek."

---

## VISUAL FOUNDATIONS

**Colors** — Lacivert + gold. Navy scale (`--navy-50…950`, primary `--navy-700 #15295A`) carries surfaces, headers, footers and dark bands. Gold (`--gold-500 #C9A227`) is a **precious accent**: kickers, the single hero CTA, active nav underline, focus rings, small edges — never large gold fills except the one accent button and the jersey "third kit". Neutral ink scale is cool and leans slightly navy. White and off-white (`--ink-50`) are the dominant light surfaces. Status colors are restrained and corporate.

**Typography** — Three-member Barlow superfamily:
- **Display/headings:** `Barlow Condensed` 700, **UPPERCASE**, tight tracking — the sporty club voice.
- **Body/UI:** `Barlow` 400/500/600 — humanist grotesk, highly legible.
- **Stats/scoreboard:** `Barlow Semi Condensed` 700 with `tabular-nums` for scores, times, counts.
- Fonts load from **Google Fonts CDN** (see Caveats).

**Spacing & layout** — 4px base grid. Containers max ~1280px, generous section padding (`clamp(56–104px)`). Fixed sticky header. Sections alternate white / off-white / navy bands for rhythm.

**Corner radii** — deliberately **small** to keep the sharp corporate line: cards `--radius-lg 10px`, buttons/inputs `--radius-sm 4px`, big feature panels `--radius-xl 14px`. Pills only for the tiny gold accent rule and avatars.

**Backgrounds** — solid navy or subtle navy **gradients** (`--grad-navy`, `--grad-navy-deep`); a faint oversized gold **★ watermark** appears on dark feature panels at ~4–8% opacity. No noisy textures, no purple/blue tech gradients. Imagery is full-bleed inside cards with a navy **scrim** (`--scrim-navy`, `--scrim-bottom`) protecting overlaid text. Photo color vibe: warm, on-pitch, editorial (placeholders used until client supplies photos).

**Borders & shadows** — hairline borders (`--border-subtle #DDE1E8`); on navy, white at 8–12% opacity. Shadows are **navy-tinted**, never grey mush (`--shadow-sm…xl`). Gold is the focus ring (`--ring-focus`).

**Cards** — white surface, hairline border, small radius, soft navy shadow; optional **gold top accent rule**. Interactive cards lift `translateY(-3px)` with a stronger shadow. Navy variant uses the gradient + white text.

**Animation** — purposeful and restrained. `--ease-out` for hovers/lifts (140–220ms). The jersey showcase uses a slow horizontal **marquee** (40s linear, pauses on hover, disabled under `prefers-reduced-motion`). The live badge dot pulses. No bounces, no infinite decorative motion on content.

**Hover / press** — buttons darken (navy→navy-800) or brighten (gold); secondary fills with `--navy-50`; on-navy controls raise their white overlay and gold their border. Links shift navy-600→navy-800. Arrows nudge `translateX` on card hover.

---

## ICONOGRAPHY
- **Line icons via [Lucide](https://lucide.dev)** loaded from CDN (`lucide@latest`), rendered with `<i data-lucide="…">` + `lucide.createIcons()`. Stroke style matches the clean corporate tone. **Substitution flag:** the brand had no icon set of its own, so Lucide is the chosen standard — swap if the client adopts another.
- Common icons: `instagram, facebook, youtube, twitter` (social), `lock, clipboard-list, arrow-right, arrow-left, chevron-down, map-pin, phone, mail, play, image, clock, shield-check, calendar-check, users, trophy, check`.
- **No emoji, no hand-drawn SVG icons.** The only bespoke vector mark is the club ★ watermark (a plain Unicode star set large at low opacity).
- **Crest:** `assets/logo-emblem.png` (transparent). Use on navy or light; overhang it half-out of the footer top edge per the brand lockup card.

---

## INDEX / MANIFEST
**Root**
- `styles.css` — global entry (import this one file). Imports everything below.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `assets/` — `logo-emblem.png` (transparent crest), `logo-emblem-original.jpeg`.
- `readme.md` (this file), `SKILL.md`.

**Components** (`window.BucaYLdZTasarMSistemi_45a34f.<Name>`)
- `components/core/` — `Button`, `IconButton`, `Badge`, `Card`, `Avatar`
- `components/forms/` — `Input`, `Select`, `Checkbox`, `Switch`
- `components/navigation/` — `Tabs`
- `components/club/` — `SectionHeading`, `TrialBanner`, `NewsCard`, `FixtureCard`, `AgeGroupCard`
- `components/data/` — `StatTile`, `ProgressRing`, `MetricBar`, `Table`

**UI kits**
- `ui_kits/website/`
  - `index.html` — full homepage (header → ücretsiz deneme → haberler → fikstür → medya → yaş grupları → formalar → footer)
  - `basvuru.html` — başvuru / application form screen
  - `panel-giris.html` — panel login screen
- `ui_kits/panel/`
  - `index.html` — Sporcu Paneli dashboard (sidebar + sporcu bilgileri, program takvimi hafta/ay, performans matrisi)
- `ui_kits/admin/`
  - `index.html` — Yönetim Paneli: genel bakış, sporcular, takımlar, antrenmanlar, fikstür, haberler/blog sihirbazı, medya kütüphanesi, formalar

**Templates** — `templates/sayfa-iskeleti/` markalı sayfa iskeleti (consuming projects copy this).

**Foundation cards** — `guidelines/*.html` (Colors, Type, Spacing, Brand) render in the Design System tab.

---

## CAVEATS
- **Fonts** are served from Google Fonts CDN (Barlow family) — binaries could not be self-hosted here. Provide font files if you need offline/locked delivery.
- **Photography** uses branded navy placeholders. Supply real photos for haberler, medya, yaş grupları, and transparent **jersey PNGs** for the formalar marquee (currently CSS-shape placeholders).
- **Crest** background was removed by circular clipping; if you have a true transparent/vector logo, drop it in to replace `assets/logo-emblem.png`.
