# Sporcu Paneli UI Kit — Buca Yıldız

Logged-in athlete dashboard. Composed from the design-system primitives (`Badge`, `IconButton`, `StatTile`, `ProgressRing`, `MetricBar`).

## Screen
- **`index.html`** — Sporcu Paneli. Navy sidebar (Genel Bakış, Antrenmanlar, Performans, Maçlar, Ödemeler, Profil + Çıkış) and a sticky header with athlete identity. Three content sections:
  1. **Sporcu Bilgileri** (`AthleteCard.jsx`) — photo, isim, badges (yaş grubu / mevki) and metrics (boy, kilo, ayak, VKİ, lisans).
  2. **Program Takvimi** (`TrainingCalendar.jsx`) — interactive calendar. Defaults to **weekly** view; toggle **Hafta / Ay** or hit the maximize button to expand to **monthly**. Prev/next navigates real dates; clicking a day in month view drops back into that week. Trainings are colour-coded by type (Saha, Kondisyon, Taktik, Maç, Bireysel, İzin).
  3. **Sporcu Performans Matrisi** (`PerformanceMatrix.jsx`) — VO2 Max with trend sparkline + percentile, body composition rings (Vücut Yağ / Kas Oranı), an athletic radar (Sürat, Dayanıklılık, Güç, Teknik, Taktik, Pas), and a KPI row (sprint, sıçrama, nabız, antrenman yükü).

## Composition
`index.html` loads React + Babel + the DS bundle (`../../_ds_bundle.js`) + Lucide, then mounts the panel components. `PanelShell.jsx` provides the sidebar + header chrome and accepts `title`, `subtitle`, `children`. Each section file reads DS primitives from `window.BucaYLdZTasarMSistemi_45a34f` and exports itself to `window`.

## Notes
- All data is sample/placeholder (athlete "Arda Yılmaz", U-17). The calendar pattern is generated deterministically so any week/month is populated.
- The athlete photo is a navy placeholder — swap for a real image or an `<image-slot>`.
- Sparkline & radar are hand-built inline SVG (kit-only); the reusable gauges/tiles live in `components/data/`.
