# Yönetim Paneli UI Kit — Buca Yıldız

Comprehensive admin panel — a single place to manage the website, athletes, and everything the Sporcu Paneli shows. Composed from the design-system primitives (`Table`, `Tabs`, `Avatar`, `Switch`, `Badge`, `Button`, `Select`, `StatTile`, …) plus a shared `AdminUI` toolkit.

## Screen
- **`index.html`** — single-page admin app. Grouped navy sidebar routes between eight views; the topbar carries breadcrumb, notifications and the admin identity.

## Views
1. **Genel Bakış** (`DashboardView.jsx`) — reporting: KPI tiles, squad-distribution bar chart, upcoming matches, featured-athlete table. Drill-through links to each section.
2. **Sporcular** (`AthletesView.jsx`) — searchable, team-filtered athlete table. "Sporcu Ekle" / row-click opens a drawer form with **photo upload, team & mevki assignment, boy/kilo/foot/licence** and active toggle.
3. **Takımlar** (`TeamsView.jsx`) — team cards (A Takım → U-15). Open a team to edit coach/category and manage its **roster** (assign athletes via modal). "Takım Oluştur" modal.
4. **Antrenmanlar** (`TrainingView.jsx`) — assign training: pick team, type (Saha/Kondisyon/Taktik/Bireysel/Maç), date/time/duration/pitch, notify toggle — with a live weekly plan preview.
5. **Fikstür** (`FixturesView.jsx`) — match table + add/edit drawer. **Our crest is fixed; opponent name + logo are uploaded manually.** Home/away toggle, competition, venue, status, score.
6. **Haberler / Blog** (`BlogView.jsx`) — post list + the **step-by-step wizard**: ① pick a template (Son Dakika, Maç Raporu, Galeri/Ödül Töreni, Standart, Röportaj, Duyuru) → ② fill the template's image/text blocks with a **live preview** → ③ publish settings (category, date, featured, share). Template-adaptive editor.
7. **Medya Kütüphanesi** (`MediaView.jsx`) — three tabs: **Kütüphane** (nested folder tree + asset grid + upload), **Kategoriler** (create/colour categories that feed the homepage), and **Ana Sayfa Kartları** (rename the "Görseller & Videolar" cards and assign each a category, so clicking a card on the site shows only that category's media, auto-foldered).
8. **Formalar** (`JerseysView.jsx`) — manage İç Saha / Deplasman / Üçüncü / Kaleci kits and add alternates, each with **image upload** + publish toggle.

## Composition
`index.html` loads React + Babel + the DS bundle (`../../_ds_bundle.js`) + Lucide, then mounts (in order): `AdminData.jsx` (shared sample data → `window.AdminData`), `AdminUI.jsx` (shared toolkit → `window.AdminUI`: `Drawer`, `Modal`, `FileDrop`, `Stepper`, `Field`, `TextInput`, `TextArea`, `ViewHeader`, `Panel`, `Toolbar`, `SearchBox`, `ic`), `AdminShell.jsx` (chrome + router host), then the eight view files. Each view reads DS primitives from `window.BucaYLdZTasarMSistemi_45a34f` and exports itself to `window`. The page maps `active` → view component.

## Notes
- All data is sample (`AdminData.jsx`); forms are cosmetic (no persistence) — this is a high-fidelity recreation, not production code.
- Image/video areas are `FileDrop` placeholders (dashed dropzones); wire to a real uploader / `<image-slot>` in production.
- Charts (dashboard bars), the jersey shape and the folder tree are kit-local; reusable metric/table/tab primitives live in `components/`.
