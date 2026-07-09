# Mobil Navbar (Dock) — A'dan Z'ye Denetim Raporu

**Tarih:** 9 Temmuz 2026
**Yöntem:** Sonnet inceleme ajanı (`bucayildiz-reviewer`, 25 araç çağrısı, satır satır okuma) + Fable orkestratör sentezi ve ek analiz.
**Durum:** Bulgular raporlandı — düzeltme YAPILMADI (onay bekliyor).

## Kapsam

| Dosya | Rol |
|---|---|
| `src/components/ui/MobileTabBar.tsx` | Çekirdek: dock + grup sayfası + animasyon koreografisi |
| `src/components/admin/AdminShell.tsx` | `TABBAR_ITEMS`, entegrasyon, `hidden={mobileOpen}` |
| `src/components/panel/PanelShell.tsx` | Sporcu paneli entegrasyonu |
| `src/app/globals.css` | `.by-tabbar`, `.by-tabbar-pad` kuralları |
| `src/app/admin/(panel)/layout.tsx`, `src/app/panel/layout.tsx` | `mobileNav` prop kaynağı |
| `SettingsForm.tsx` + `ayarlar/actions.ts` | `mobileNavAdmin/Panel` bayrakları |

`npm run typecheck` ve `lint` bu kapsamda temiz.

---

## 🔴 Kritik

**K1. Grup sayfası, dock dışından navigasyonda açık kalıyor.**
`MobileTabBar.tsx` — `openGroup` yalnız dock içi tıklamalarda sıfırlanıyor; `pathname` değişimini izleyen bir etki yok. Kulüp menüsü açıkken sayfa içeriğindeki bir linkle başka sayfaya gidilirse menü yeni sayfanın üstünde açık kalır (z-index 71).
*Çözüm:* `useEffect(() => close(), [pathname])`.

**K2. Sidebar aç-kapa sonrası grup sayfası "hayalet" gibi geri geliyor.**
`hidden=true` dock'u unmount eder ama `openGroup` state'i bileşende yaşamaya devam eder; sidebar kapanınca menü kendiliğinden tekrar belirir. (Yalnız admin'i etkiler; sporcu dock'unda grup öğesi yok.)
*Çözüm:* `useEffect(() => { if (hidden) close(); }, [hidden])`.

## 🟠 Önemli

**Ö1. `NAV` ↔ `TABBAR_ITEMS` çift kaynağı somut bug üretmiş: `/admin/profil` breadcrumb'ı "Genel Bakış" gösteriyor.**
`AdminShell.tsx` — Profil sayfası dock'ta ve header avatarında var ama breadcrumb'ı besleyen `ALL_ITEMS/NAV`'da yok.
*Çözüm (kısa):* Profil'i `ALL_ITEMS`'a ekle. *Çözüm (kalıcı):* dock öğelerini `NAV`'dan türet (tek kaynak).

**Ö2. Grup sayfası proje overlay standardını (`useOverlayDismiss`) kullanmıyor.**
Escape ile kapanmıyor, arka plan scroll kilidi yok (iOS'ta overlay arkası kayar), focus trap / `inert` yok — proje genelinde çözülmüş örüntü burada atlanmış.
*Çözüm:* `useOverlayDismiss` entegrasyonu + `aria-controls`/panel `id` eşleşmesi.

**Ö3. `useReducedMotion` desteği yok + Android geri tuşu sheet'i kapatmıyor.**
Dock koreografisi (blur + rotateX + stagger) hareket azaltma tercihine bakmıyor — projedeki diğer framer bileşenlerinin hepsinde var. Geri tuşu beklentisi: önce sheet kapanmalı.
*Çözüm:* reduce'da statik varyantlar; sheet açılınca `history.pushState` + `popstate` dinleyicisi.

## 🟡 Orta

**O1. Dock öğe dokunma hedefi ~39-42px — 44px hedefinin altında (şüphe, ölçülecek).**
*Çözüm:* dikey padding artışı veya min-height 44.

**O2. Dock aktif etiketi taşmaya açık:** `whiteSpace: nowrap` var ama `minWidth:0`+ellipsis yok (CLAUDE.md kural #7'nin ruhu). Grup sayfası satırları doğru, dock etiketi eksik.

**O3. Kapanış stagger formülü `(2 - order)` sabitiyle 5 öğeye kilitli** — 6+ öğede animasyon sessizce bozulur. *Çözüm:* `(maxOrder - order)` parametrik.

**O4. Exit'teki `blur(7px)` düşük donanımlı Android'de jank riski** (Ö3'teki reduce desteğiyle birlikte ele alınmalı).

**O5. `.by-tabbar-pad` sabit 104px varsayımı** — dock içeriği büyürse alt içerik gizlenebilir. *Çözüm:* değeri dock gerçek yüksekliğine bağla (header'daki `--by-header-h` deseni gibi `--by-dock-h`).

**O6. (Fable ek) Grup sayfası listesinde maxHeight/scroll yok** — ileride 10+ öğeli bir grupta sheet ekranı aşar. *Çözüm:* `maxHeight: 55dvh` + `overflow-y: auto` + `overscroll-behavior: contain`.

## 🔵 Küçük / İyileştirme

- **İ1.** `pathname` prop yerine bileşen içinde `usePathname()` — bir bağlantı katmanı eksilir (K1 çözümü zaten hook gerektirecek).
- **İ2.** Sheet, medya sorgusu için `.by-tabbar` sınıfını "ödünç alıyor" — anlamsal olarak yanlış; `.by-mobile-only` yardımcı sınıfı daha doğru.
- **İ3.** Grup butonunda `aria-controls` ↔ panel `id` bağlantısı yok (`aria-expanded` var).
- **İ4.** Masaüstünde bileşen mount olup görünmez animasyon çalıştırıyor (CSS-gizli) — hydration için doğru tercih; istenirse `matchMedia` ile motion atlanabilir (düşük öncelik).

## ✅ Temiz alanlar

- z-index katmanı tutarlı (55 → 60 → 68 → 70 → 71), çakışma yok.
- `TABBAR_ITEMS` modül seviyesinde — render başına yeniden yaratım yok.
- `LayoutGroup id` izolasyonu doğru; `layoutId` çakışması yok.
- SSR/hydration: `mobileNav` sunucudan, görünürlük CSS-only — flaş yok.
- Ayar bayrağı akışı (settings → layout → shell → dock) ve `saveSettings`'te `requireAdmin()` + Zod doğru.
- KVKK: navbar içeriğinde hassas veri yok.

---

**Genel değerlendirme:** Görsel/animasyon katmanı özenli ve mimari temeller (z-index, SSR, ayar akışı) sağlam. Ana zafiyet `openGroup` state'inin `pathname`/`hidden` ile senkronize edilmemesi (K1-K2 — kolayca tekrarlanan iki gerçek UX bug'ı) ve `NAV`/`TABBAR_ITEMS` çift kaynağının şimdiden ürettiği breadcrumb hatası (Ö1). Kalanlar erişilebilirlik, dayanıklılık ve gelecek-genişleme önlemleri.
