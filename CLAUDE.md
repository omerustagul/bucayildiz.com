# CLAUDE.md — Buca Yıldız Futbol Akademisi

Bu dosya, bu depoda çalışan her Claude oturumunun (ve geliştiricinin) okuması
gereken proje oyun kitabıdır. Ayrıntılı durum için `docs/ROADMAP.md`, dağıtım
için `docs/DEPLOYMENT.md`.

## Proje

Futbol akademisi için tam kapsamlı web uygulaması: halka açık kurumsal site +
yönetim paneli (admin) + sporcu/veli paneli. Türkiye'de barındırılacak, **KVKK
uyumu birinci sınıf gereksinim**. Arayüz ve kod yorumları **Türkçe**.

## Teknoloji

- **Next.js 16** (App Router) + **React 19** + **TypeScript** (strict)
- **Prisma 6** + **PostgreSQL**
- **Zod 4** (doğrulama), **jose** (JWT oturum), **bcryptjs** (parola)
- **Vitest** + Testing Library (birim), **Playwright** (E2E, MCP üzerinden)
- Servisler: PWA, Web Push (VAPID), Nodemailer (SMTP), S3-uyumlu depolama, SMS

> **Sürüm uyarısı:** Next 16 / React 19 / Prisma 6 / Zod 4 yeni ana sürümlerdir.
> API'lerini ezberden varsayma — **`context7` MCP** ile güncel resmî dokümanı çek
> (özellikle App Router, Server Actions, `next/cache`, Prisma Client, Zod v4).

## Komutlar

| Komut | İş |
|---|---|
| `npm run dev` | Geliştirme sunucusu (webpack, `0.0.0.0` — telefondan erişilebilir) |
| `npm run build` / `npm run start` | Üretim derleme / başlatma |
| `npm run typecheck` | `tsc --noEmit` — **her değişiklikten sonra çalıştır** |
| `npm run lint` | ESLint (`eslint-config-next`) |
| `npm run test` / `test:watch` | Vitest |
| `npm run db:migrate` | Migration üret + uygula (dev) |
| `npm run db:deploy` | Bekleyen migration'ları uygula (prod) |
| `npm run db:seed` | Örnek/ilk veri (admin + takım + sporcu) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:generate` | Prisma Client'ı yeniden üret |
| `npm run db:backup` | DB yedeği al (`backups/`, son 14 tutulur) — **her migration ÖNCESİ zorunlu** |

**Bir işi "bitti" demeden önce:** en az `npm run typecheck` (ideali + `lint` +
ilgili `test`) temiz olmalı.

## Veritabanı (bu makine — Windows)

- **Native PostgreSQL 18, port `5432`** (Docker/5433 DEĞİL — Docker Desktop bu
  makinede bozuk).
- Bağlantı: `postgresql://bucayildiz:bucayildiz_dev@127.0.0.1:5432/bucayildiz?schema=public`
- `.env` git'e girmez. Şablonlar: `.env.example`, `.env.production.example`.
- Üretim: Türkiye veri merkezi (KVKK). Ayrıntı `docs/DEPLOYMENT.md`.

## Dizin yapısı

- `src/app/(site)/` — halka açık site (kurumsal, takımlar, altyapı, haberler,
  fikstür, medya, iletişim, başvuru, KVKK/sözleşme sayfaları)
- `src/app/admin/(panel)/` — yönetim paneli (rota grubu `(panel)` layout ile korunur)
- `src/app/panel/` — sporcu/veli paneli
- `src/app/api/` — route handler'lar (upload, push subscribe/unsubscribe)
- `src/components/admin/` — panel bileşen kütüphanesi (`kit.tsx`, `controls.tsx`,
  `form.tsx`, `ui.tsx`, `views/*`)
- `src/lib/` — sunucu servisleri: `auth`, `session`, `prisma`, `mail`, `push`,
  `sms`, `storage`, `consent(.server)`, `validation`, `perf`, `settings`, `data`
- `prisma/schema.prisma` — tek şema; migration'lar `prisma/migrations/`
- `_design-reference/` — Claude Design sistemi (token/bileşen prompt'ları); UI
  yaparken buna sadık kal

## Değişmez kurallar

1. **Yetkilendirme her server action'ın kendi sorumluluğu.** Server actions
   middleware'i baypas eden POST uçlarıdır. Her admin mutasyonu başında
   `requireAdmin()` (veya eşdeğer rol kontrolü), sporcu uçları `requireAthlete()`
   çağırmalı. Örnek: `src/lib/auth.ts`, `src/app/admin/(panel)/sporcular/actions.ts`.
2. **Girdi doğrulama Zod ile.** Tüm action girdileri `unknown` alır, `safeParse`
   edilir; hata mesajları Türkçe döner.
3. **Oturum:** `jose` HS256 JWT; portallar TAMAMEN AYRI — admin `by_admin_session`,
   sporcu paneli `by_panel_session` cookie'si taşır (httpOnly, prod'da secure, 7 gün).
   Çapraz yönlendirme YOK; aynı tarayıcıda iki portala aynı anda giriş yapılabilir.
   `getAdminSession()`/`getPanelSession()` kullan — genel bir `getSession` yok.
   `AUTH_SECRET` zorunlu. `session.ts` edge-safe'tir (bcrypt/next-headers içermez)
   — middleware güvenle kullanabilir.
4. **Env-driven servisler sessiz devre dışı deseni:** SMTP/S3/SMS/Push, ilgili
   env boşken sessizce atlanır, dolunca aktifleşir. Yeni servis eklerken bu deseni
   koru (ör. mail başarısızlığı başvuru kaydını bozmaz — non-blocking).
5. **Dosya yükleme:** `src/lib/storage.ts` tek nokta; upload'larda magic-byte
   doğrulaması yapılır. Depolama env boşsa yerel disk (`public/uploads`).
6. **Tarihler:** doğum tarihi vb. TZ sorunlarını önlemek için `String`
   ("YYYY-MM-DD") tutulur. Şema sade — enum yerine `String` status alanları.
7. **CSS taşma kuralı:** grid/flex içinde `ellipsis` kullanılan her öğeye
   `min-width: 0` ver (grid/flex öğelerinin varsayılanı `min-width: auto` —
   ellipsis tek başına çalışmaz, 320px'te layout patlar). Bu hata kod
   incelemelerinde iki kez yakalandı; yeni kart/chip yazarken baştan uygula.

## KVKK (kritik)

- Onaylar **ayrı belgeler** (aydınlatma / açık-rıza / sağlık / foto-video /
  pazarlama) — battaniye "hepsini kabul" KVKK'da geçersiz.
- Her onay/geri-alma **denetim izi** ile kaydedilir (metin sürümü+hash, IP, UA,
  veli). Bkz. `ConsentDocument` / `ConsentRecord`.
- **Web Push / bildirim gövdesine sağlık veya performans verisi yazma.**
- Onay metni gövdeleri (`ConsentDocument.body`) şu an TASLAK — avukat onayı bekler.

## Araç kullanımı

- Next/React/Prisma/Zod API soruları → **`context7` MCP** (güncel doküman).
- E2E doğrulama → **Playwright MCP** (kritik akış: başvuru, giriş, KVKK onayı).
- Geniş kod arama → `bucayildiz-scout` alt-ajanı (aşağı bkz.) veya Explore.
- Üretim **Vercel'e değil, Türkiye VPS'ine** yapılacak; Vercel MCP bu proje için
  gerekli değil.

## Model yönlendirme / delegasyon politikası (maliyet-verim)

> Amaç: pahalı ana modeli (Fable 5 en pahalı katman + tokenizer'ı ~%30 fazla
> token sayar) **düşünme/planlama** için kullan; bağlam-yoğun ve mekanik işi
> **ucuz modeldeki alt-ajanlara** devret. Alt-ajan işi kendi içinde yapıp ana
> zincire **sadece özet sonuç** döndürür → ana bağlam küçük kalır, token düşer.

**Ana zincir (orkestratör) şunları KENDİ yapar:**
- İsteği anlama, plan, yönlendirme kararı, alt-ajan çıktılarının sentezi.
- Zor/az-geri-dönüşlü muhakeme: mimari, güvenlik, KVKK tasarımı, ince hatalar.
- Önemsiz 1–2 satırlık düzenlemeler (alt-ajan overhead'i kâr etmez).

**Alt-ajana DEVRET (bağlam-yoğun veya mekanik ise):**

| İş türü | Model | Ajan / yol |
|---|---|---|
| Keşif, arama, "şu nerede", çok dosya okuma (salt-okunur) | **Haiku** | `bucayildiz-scout` |
| KOD YAZAN her iş (özellik, düzenleme, doküman dahi olsa depo dosyası) | **Sonnet** (min.) | `bucayildiz-builder` |
| Diff'i proje kurallarına göre inceleme | **Sonnet** | `bucayildiz-reviewer` |
| Hassas UI (konumlandırma/portal/responsive), mimari, migration gözetimi | **Orkestratör kendisi** (veya `model: opus` alt-ajan) | — |

> 2026-07-07 dersi: kod yazımında Haiku'ya inmek geri dönüşlü hatalara mal
> oldu; kod üreten işlerde taban **Sonnet**'tir. Haiku YALNIZ salt-okunur
> keşifte kullanılır.

**Effort:** salt-okunur keşif = `low`; kod yazan alt-ajan = `medium`+. Zor
muhakeme ana zincirde yüksek effort'ta kalır.

**Kurallar:**
1. Bir işe başlamadan önce sor: "Bu, ucuz bir alt-ajanın halledebileceği
   bağlam-yoğun/mekanik bir iş mi?" Evetse devret.
2. Bağımsız alt-ajanları **tek mesajda paralel** başlat (beklemeyi azaltır).
3. Alt-ajandan dosya dökümü değil, **kısa sonuç/karar** iste.
4. Kod yazan her alt-ajan işini `npm run typecheck` (+ ilgili `test`) temiz
   bırakmadan "bitti" demez.
5. **UI değişikliği, tarayıcıda (Playwright) görsel doğrulama yapılmadan
   "bitti" sayılmaz** — masaüstü + 375px; popover/overlay varsa konum ölçümü.
   Statik inceleme render hatalarını yakalayamıyor (kanıtlandı).
6. **Şema/migration işinden önce yedek al** (`pg_dump`) — 2026-07-07'de
   migration baseline'ı dev DB'yi sıfırladı (seed ile kurtarıldı, ama kural bu).
