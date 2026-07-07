# Takvim Programı + Antrenman Yönetimi + Responsive Fikstür — Uygulama Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sporcu/admin fikstür listelerini mobilde kaydırmasız hâle getirmek; `/admin/antrenmanlar`'ı madde-listeli "Takvim Programı"na (`/admin/takvim-programi`) dönüştürmek; yeni `/admin/antrenmanlar` sayfasında durum + madde tiki + yoklama/not yönetimi kurmak.

**Architecture:** Maçlar takvime `Fixture`'dan otomatik ve salt-okunur yansır (ayrı kayıt YOK). `Training` modeli `type` yerine `scope`(team|individual) + `status` alır; içerik `TrainingDrill[]`, yoklama/not `TrainingAttendance[]` (upsert). UI proje deseninde: inline style + `globals.css` responsive sınıfları, `Panel/Field/Drawer/Badge/Tabs` bileşenleri.

**Tech Stack:** Next.js 16 App Router, React 19, Prisma 6 + PostgreSQL (dev :5432), Zod 4 (`safeParse`, Türkçe mesaj), Vitest.

**Spec:** `docs/superpowers/specs/2026-07-07-takvim-programi-antrenman-yonetimi-design.md`

**Her görevde geçerli kurallar:**
- Server action = başta `requireAdmin()` (`@/lib/auth`), girdi `unknown` + Zod `safeParse`, Türkçe hata.
- Tarih `String` "YYYY-MM-DD". Enum yok — `String` status.
- Görev sonunda `npm run typecheck` temiz olmadan commit atma.

---

## FAZ A — Responsive fikstür listeleri (şema yok)

### Task A1: `MatchList` mobil-öncelikli kart düzeni

**Files:**
- Modify: `src/components/content/MatchList.tsx` (tamamen değiştir)
- Modify: `src/app/globals.css` (dosya sonuna ekle)

- [ ] **Step 1: `MatchList.tsx` içeriğini şununla değiştir**

```tsx
import type { Fixture } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";

/** Maç listesi — mobil öncelikli; dar ekranda kaydırmasız iki satırlı kart. */
export function MatchList({ fixtures }: { fixtures: Fixture[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {fixtures.map((f, i) => {
        const finished = f.status === "finished";
        const ours = f.home === "Buca Yıldız" || f.away === "Buca Yıldız";
        return (
          <div
            key={i}
            className="match-card"
            style={{
              background: "var(--surface-card)",
              border: `1px solid ${ours ? "var(--gold-300)" : "var(--border-subtle)"}`,
              borderLeft: `3px solid ${ours ? "var(--gold-500)" : "var(--border-subtle)"}`,
              borderRadius: "var(--radius-md)",
              padding: "12px 16px",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <div className="match-meta">
              <span className="match-comp">{f.comp}</span>
              <span className="match-date">{f.date} · {f.time}</span>
              <span className="match-badge">
                <Badge tone={finished ? "neutral" : "gold"}>{finished ? "Bitti" : "Yaklaşan"}</Badge>
              </span>
            </div>
            <div className="match-teams">
              <span className="match-team match-team-home">{f.home}</span>
              <span className="match-score">{finished ? `${f.hs}–${f.as}` : f.time}</span>
              <span className="match-team">{f.away}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: `src/app/globals.css` sonuna ekle**

```css
/* --- MatchList: mobil öncelikli maç kartı (panel/maclar + public fikstür) --- */
.match-card { display: flex; flex-direction: column; gap: 10px; }
.match-meta { display: flex; align-items: center; gap: 10px; min-width: 0; }
.match-comp { font-size: 11px; font-weight: 600; letter-spacing: .08em; text-transform: uppercase; color: var(--gold-700); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.match-date { font-size: 12.5px; color: var(--text-muted); white-space: nowrap; flex: none; }
.match-badge { margin-left: auto; flex: none; }
.match-teams { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; font-family: var(--font-heading); font-weight: 600; font-size: 15px; text-transform: uppercase; color: var(--text-strong); }
.match-team { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.match-team-home { text-align: right; }
.match-score { font-family: var(--font-stat); font-weight: 700; min-width: 48px; text-align: center; color: var(--navy-800); background: var(--ink-50); border-radius: var(--radius-sm); padding: 3px 8px; font-variant-numeric: tabular-nums; flex: none; }
@media (max-width: 480px) {
  .match-teams { font-size: 13px; gap: 8px; }
  .match-date { font-size: 11.5px; }
  .match-card { padding: 11px 13px; }
}
```

- [ ] **Step 3: Doğrula**

Run: `npm run typecheck`
Expected: exit 0.
Ardından (Playwright MCP veya tarayıcı): `localhost:3000/panel/maclar` 375px ve 320px genişlikte — yatay taşma yok, takım adları ellipsis ile kısalıyor, rozet sağ üstte.
Not: `MatchList` public `(site)/fikstur` sayfalarında da kullanılıyor — 375px'te `/fikstur` sayfasına da bak (regresyon yok).

- [ ] **Step 4: Commit**

```bash
git add src/components/content/MatchList.tsx src/app/globals.css
git commit -m "feat(panel): maç listesi mobil öncelikli kaydırmasız kart düzeni"
```

### Task A2: `FixturesView` mobil kart modu

**Files:**
- Modify: `src/components/admin/views/FixturesView.tsx`

- [ ] **Step 1: import satırına `useEffect` ekle**

Satır 3: `import { useMemo, useState, useTransition } from "react";` →
```tsx
import { useEffect, useMemo, useState, useTransition } from "react";
```

- [ ] **Step 2: `FixtureCards` bileşenini ekle** — `FixturesView` fonksiyonunun ÜSTÜNE (dosyada `FixtureDrawer`'dan sonra):

```tsx
/** Mobil (<=560px) kart listesi — Table yerine; tıklayınca aynı Drawer açılır. */
function FixtureCards({ rows, onOpen }: { rows: FixtureRow[]; onOpen: (r: FixtureRow) => void }) {
  if (rows.length === 0) {
    return (
      <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
        Maç bulunamadı.
      </div>
    );
  }
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((r) => {
        const home = r.isHome ? "Buca Yıldız" : r.opponent;
        const away = r.isHome ? r.opponent : "Buca Yıldız";
        const hs = r.isHome ? r.ourScore : r.oppScore;
        const as = r.isHome ? r.oppScore : r.ourScore;
        const finished = r.status === "finished";
        return (
          <button
            key={r.id}
            type="button"
            onClick={() => onOpen(r)}
            style={{ font: "inherit", textAlign: "left", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", padding: "12px 14px", display: "flex", flexDirection: "column", gap: 8, boxShadow: "var(--shadow-xs)" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <Badge tone="outline">{r.competition}</Badge>
              <span style={{ marginLeft: "auto", flex: "none" }}>
                <Badge tone={STATUS[r.status]?.tone ?? "neutral"}>{STATUS[r.status]?.label ?? r.status}</Badge>
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 8, fontWeight: 600, fontSize: 13.5 }}>
              <span style={{ textAlign: "right", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: home === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{home}</span>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, background: "var(--ink-100)", borderRadius: "var(--radius-sm)", padding: "2px 9px", fontVariantNumeric: "tabular-nums" }}>
                {finished ? `${hs ?? 0}–${as ?? 0}` : "vs"}
              </span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: away === "Buca Yıldız" ? "var(--navy-700)" : "var(--ink-700)" }}>{away}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--ink-500)", minWidth: 0 }}>
              <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, color: "var(--text-strong)", flex: "none" }}>{fmtDate(r.date)}</span>
              {r.time && <span style={{ flex: "none" }}>{r.time}</span>}
              {r.venue && <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>· {r.venue}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 3: `FixturesView` içine mobil algılama ekle** — mevcut state satırlarının hemen altına (`const [drawer, setDrawer] = ...` sonrası):

```tsx
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
```

- [ ] **Step 4: Table satırını koşullu yap** — mevcut `<Table columns={cols} ... />` satırını değiştir:

```tsx
      {isMobile ? (
        <FixtureCards rows={rows} onOpen={(r) => setDrawer({ fx: r })} />
      ) : (
        <Table columns={cols} rows={rows} getRowKey={(r) => r.id} onRowClick={(r) => setDrawer({ fx: r })} empty="Maç bulunamadı." />
      )}
```

- [ ] **Step 5: Doğrula + commit**

Run: `npm run typecheck` → exit 0. `npm run test` → 5+ test PASS.
Tarayıcı/Playwright: `/admin/fikstur` 375px — kartlar görünür, kart tıklayınca Drawer açılıyor; masaüstünde tablo aynı.

```bash
git add src/components/admin/views/FixturesView.tsx
git commit -m "feat(admin): fikstür tablosuna mobil kart görünümü (<=560px)"
```

---

## FAZ B — Şema + Takvim Programı

### Task B1: Prisma şema değişikliği + migration + seed

**Files:**
- Modify: `prisma/schema.prisma`
- Modify: `prisma/seed.mjs`

- [ ] **Step 1: `Training` modelini değiştir** — mevcut modeli şununla değiştir:

```prisma
/// Antrenman programı kaydı (Takvim Programı). Maçlar burada TUTULMAZ —
/// takvim, yaklaşan maçları Fixture tablosundan otomatik gösterir.
model Training {
  id        String   @id @default(cuid())
  teamId    String
  team      Team     @relation(fields: [teamId], references: [id])
  scope     String   @default("team") // team | individual
  status    String   @default("planned") // planned | completed | cancelled | partial
  date      String // "YYYY-MM-DD"
  time      String   @default("") // "HH:MM"
  duration  Int? // dakika
  pitch     String   @default("")
  notes     String   @default("")
  createdAt DateTime @default(now())

  drills     TrainingDrill[]
  attendance TrainingAttendance[]

  @@index([teamId])
  @@index([date])
  @@index([status])
}

/// Antrenman içeriği maddesi (yapılacak çalışma). done = tamamlandı tiki.
model TrainingDrill {
  id         String   @id @default(cuid())
  trainingId String
  training   Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  text       String
  done       Boolean  @default(false)
  sort       Int      @default(0)
  createdAt  DateTime @default(now())

  @@index([trainingId])
}

/// Yoklama + sporcuya özel not. Takım antrenmanında kadrodan türetilir
/// (kaydedildikçe upsert); bireyselde oluşturmada katılımcı olarak açılır.
model TrainingAttendance {
  id         String   @id @default(cuid())
  trainingId String
  training   Training @relation(fields: [trainingId], references: [id], onDelete: Cascade)
  athleteId  String
  athlete    Athlete  @relation(fields: [athleteId], references: [id], onDelete: Cascade)
  status     String   @default("unknown") // present | absent | excused | unknown
  note       String   @default("") // sporcuya özel direktif/not
  createdAt  DateTime @default(now())

  @@unique([trainingId, athleteId])
  @@index([athleteId])
}
```

- [ ] **Step 2: `Athlete` modeline ters ilişki ekle** — `payments Payment[]` satırının altına:

```prisma
  trainingAttendance TrainingAttendance[]
```

- [ ] **Step 3: `prisma/seed.mjs` antrenman seed'ini güncelle** — dosyayı oku; `prisma.training.create` çağrısındaki `type: t.type` alanını kaldırıp `scope: "team"` ekle (TR dizisindeki `type:` alanlarını da sil). create satırının yeni hâli:

```js
  for (const t of TR) await prisma.training.create({ data: { teamId: teamBySlug[t.team], scope: "team", date: t.date, time: t.time, duration: t.duration, pitch: t.pitch, notes: t.notes } });
```

- [ ] **Step 4: Migration üret + uygula**

Run: `npm run db:migrate -- --name training_program_overhaul`
Expected: "Your database is now in sync". UYARI: `type` kolonu düşer (veri kaybı) — onaylı; prompt gelirse kabul et.
Run: `npm run db:generate` (migrate dev zaten üretir; emniyet için).

- [ ] **Step 5: Commit**

```bash
git add prisma/schema.prisma prisma/seed.mjs prisma/migrations
git commit -m "feat(db): Training scope/status + TrainingDrill + TrainingAttendance modelleri"
```

> NOT: Bu commit sonrası `typecheck` KIRIK olur (eski kod `type` bekliyor) — B2–B7 tamamlayana kadar normaldir; faz sonunda temizlenir. Bu yüzden B1–B7 arasında Stop-hook typecheck hataları beklenen durumdur.

### Task B2: Doğrulama şemaları (TDD)

**Files:**
- Modify: `src/lib/validation.ts` (sonuna ekle; dosyada `z` importu yoksa `import { z } from "zod";` ekle)
- Create: `src/lib/validation.training.test.ts`

- [ ] **Step 1: Önce başarısız testi yaz** — `src/lib/validation.training.test.ts`:

```ts
// @vitest-environment node
import { describe, expect, it } from "vitest";
import { trainingCreateSchema, attendanceSaveSchema } from "@/lib/validation";

describe("trainingCreateSchema", () => {
  const base = { teamId: "t1", date: "2026-07-10", time: "17:00", duration: 90, pitch: "Saha 1", notes: "", drills: [], athleteIds: [] };

  it("takım antrenmanı maddesiz geçerli", () => {
    const r = trainingCreateSchema.safeParse({ ...base, scope: "team" });
    expect(r.success).toBe(true);
  });

  it("bireysel antrenman sporcusuz reddedilir", () => {
    const r = trainingCreateSchema.safeParse({ ...base, scope: "individual" });
    expect(r.success).toBe(false);
  });

  it("bireysel + sporcu geçerli; boş madde reddedilir", () => {
    expect(trainingCreateSchema.safeParse({ ...base, scope: "individual", athleteIds: ["a1"] }).success).toBe(true);
    expect(trainingCreateSchema.safeParse({ ...base, drills: ["  "] }).success).toBe(false);
  });

  it("geçersiz tarih reddedilir", () => {
    expect(trainingCreateSchema.safeParse({ ...base, date: "10.07.2026" }).success).toBe(false);
  });
});

describe("attendanceSaveSchema", () => {
  it("geçerli satırlar kabul, geçersiz status red", () => {
    const ok = attendanceSaveSchema.safeParse({ trainingId: "tr1", rows: [{ athleteId: "a1", status: "present", note: "" }] });
    expect(ok.success).toBe(true);
    const bad = attendanceSaveSchema.safeParse({ trainingId: "tr1", rows: [{ athleteId: "a1", status: "yok", note: "" }] });
    expect(bad.success).toBe(false);
  });
});
```

- [ ] **Step 2: Testin BAŞARISIZ olduğunu gör**

Run: `npx vitest run src/lib/validation.training.test.ts`
Expected: FAIL — `trainingCreateSchema` export edilmemiş.

- [ ] **Step 3: Şemaları `src/lib/validation.ts` sonuna ekle**

```ts
// --- Takvim Programı / Antrenman ---
export const TRAINING_SCOPES = ["team", "individual"] as const;
export const TRAINING_STATUSES = ["planned", "completed", "cancelled", "partial"] as const;
export const ATTENDANCE_STATUSES = ["present", "absent", "excused", "unknown"] as const;

export const trainingCreateSchema = z
  .object({
    teamId: z.string().min(1, "Takım seçiniz."),
    scope: z.enum(TRAINING_SCOPES).default("team"),
    date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
    time: z.string().trim().max(5).optional().or(z.literal("")),
    duration: z.number().int().min(0).max(300).nullable().optional(),
    pitch: z.string().trim().max(80).optional().or(z.literal("")),
    notes: z.string().trim().max(500).optional().or(z.literal("")),
    drills: z.array(z.string().trim().min(1, "Boş madde olamaz.").max(200)).max(30).default([]),
    athleteIds: z.array(z.string().min(1)).max(40).default([]),
  })
  .superRefine((v, ctx) => {
    if (v.scope === "individual" && v.athleteIds.length === 0) {
      ctx.addIssue({ code: "custom", message: "Bireysel antrenman için en az bir sporcu seçiniz.", path: ["athleteIds"] });
    }
  });

export const attendanceRowSchema = z.object({
  athleteId: z.string().min(1),
  status: z.enum(ATTENDANCE_STATUSES),
  note: z.string().trim().max(300).optional().or(z.literal("")),
});

export const attendanceSaveSchema = z.object({
  trainingId: z.string().min(1),
  rows: z.array(attendanceRowSchema).min(1, "En az bir satır gerekli.").max(60),
});
```

- [ ] **Step 4: Test geç + commit**

Run: `npx vitest run src/lib/validation.training.test.ts` → 6 test PASS.

```bash
git add src/lib/validation.ts src/lib/validation.training.test.ts
git commit -m "feat(lib): antrenman/yoklama Zod şemaları (TDD)"
```

### Task B3: enums temizliği

**Files:**
- Modify: `src/lib/enums.ts` — 2. satırdaki `TRAINING_TYPES` sabitini SİL.
- Modify: `src/__tests__/setup.test.tsx` — `TRAINING_TYPES` importunu ve onu kullanan `expect(TRAINING_TYPES).toContain("Saha")` satırını (ve varsa sadece ona ait test bloğunu) sil; kalan importlar `POST_TEMPLATES, POST_TEMPLATE_IDS` olur.

- [ ] **Step 1: İki düzenlemeyi yap**
- [ ] **Step 2: Run: `npx vitest run src/__tests__/setup.test.tsx` → PASS**
- [ ] **Step 3: Commit**

```bash
git add src/lib/enums.ts src/__tests__/setup.test.tsx
git commit -m "refactor: kullanımdan kalkan TRAINING_TYPES kaldırıldı"
```

### Task B4: Rota taşıma + yeni actions + AdminShell nav

**Files:**
- Create: `src/app/admin/(panel)/takvim-programi/actions.ts`
- Create: `src/app/admin/(panel)/takvim-programi/page.tsx`
- Delete: `src/app/admin/(panel)/antrenmanlar/` (klasör; C fazında yeniden oluşturulacak)
- Delete: `src/components/admin/views/TrainingView.tsx`
- Modify: `src/components/admin/AdminShell.tsx:23`

- [ ] **Step 1: `takvim-programi/actions.ts` oluştur**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { trainingCreateSchema } from "@/lib/validation";

export type TrainingResult = { error: string };

function revalidate() {
  revalidatePath("/admin/takvim-programi");
  revalidatePath("/admin/antrenmanlar");
}

export async function createTraining(input: unknown): Promise<TrainingResult | void> {
  await requireAdmin();
  const parsed = trainingCreateSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  try {
    await prisma.training.create({
      data: {
        teamId: d.teamId,
        scope: d.scope,
        date: d.date,
        time: d.time || "",
        duration: d.duration ?? null,
        pitch: d.pitch || "",
        notes: d.notes || "",
        drills: d.drills.length ? { create: d.drills.map((text, i) => ({ text, sort: i })) } : undefined,
        attendance: d.scope === "individual" ? { create: d.athleteIds.map((athleteId) => ({ athleteId })) } : undefined,
      },
    });
  } catch {
    return { error: "Kaydedilemedi. Takım ve sporcu seçimini kontrol edin." };
  }
  revalidate();
}

export async function deleteTraining(id: string): Promise<void> {
  await requireAdmin();
  await prisma.training.delete({ where: { id } }).catch(() => {});
  revalidate();
}
```

- [ ] **Step 2: `takvim-programi/page.tsx` oluştur**

```tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ScheduleView } from "@/components/admin/views/ScheduleView";

export const metadata: Metadata = { title: "Takvim Programı" };

export default async function TakvimProgramiPage() {
  const [teams, athletes, trainings, fixtures] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.training.findMany({
      orderBy: [{ date: "asc" }, { time: "asc" }],
      include: {
        drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } },
        attendance: { select: { athlete: { select: { name: true } } } },
      },
    }),
    prisma.fixture.findMany({
      where: { status: "upcoming" },
      orderBy: { date: "asc" },
      select: { id: true, competition: true, opponent: true, isHome: true, date: true, time: true, venue: true, teamId: true },
    }),
  ]);

  const now = new Date();
  const todayYmd = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  return (
    <ScheduleView
      teams={teams}
      athletes={athletes}
      trainings={trainings.map((t) => ({
        id: t.id, teamId: t.teamId, scope: t.scope, status: t.status, date: t.date, time: t.time,
        duration: t.duration, pitch: t.pitch, notes: t.notes,
        drills: t.drills,
        participants: t.attendance.map((a) => a.athlete.name),
      }))}
      fixtures={fixtures}
      todayYmd={todayYmd}
    />
  );
}
```

- [ ] **Step 3: Eski dosyaları sil**

```bash
git rm -r "src/app/admin/(panel)/antrenmanlar"
git rm src/components/admin/views/TrainingView.tsx
```

- [ ] **Step 4: `AdminShell.tsx` nav güncelle** — satır 23:

```tsx
      { href: "/admin/antrenmanlar", label: "Antrenmanlar", icon: "dumbbell", ready: true },
```
→
```tsx
      { href: "/admin/takvim-programi", label: "Takvim Programı", icon: "calendar-days", ready: true },
      { href: "/admin/antrenmanlar", label: "Antrenmanlar", icon: "dumbbell", ready: true },
```
(Not: "Fikstür" da `calendar-days` kullanıyor — sorun değil; istersen Takvim Programı için `calendar-check` kullan, `Icon` kütüphanesinde mevcut — TrainingView'da kullanılıyordu.)

- [ ] **Step 5: Commit** (typecheck hâlâ ScheduleView eksikliğinden kırık — B5–B6 ile kapanacak; commit yine de at, çalışan noktaya B7'de gelinir)

```bash
git add "src/app/admin/(panel)/takvim-programi" src/components/admin/AdminShell.tsx
git commit -m "feat(admin): takvim-programi rotası + yeni antrenman actions; eski antrenmanlar taşındı"
```

### Task B5: `ScheduleAssignCard` (Program Ata kartı)

**Files:**
- Create: `src/components/admin/ScheduleAssignCard.tsx`

- [ ] **Step 1: Dosyayı oluştur**

```tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Panel, Field } from "@/components/admin/kit";
import { TextInput, TextArea } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import { createTraining } from "@/app/admin/(panel)/takvim-programi/actions";
import type { SAthlete, SFixture, STeam } from "@/components/admin/views/ScheduleView";

const PITCHES = ["Saha 1", "Saha 2", "Kapalı Salon", "Kondisyon Salonu"];

type ProgramKind = "team" | "individual" | "mac";

const KINDS: { id: ProgramKind; label: string; color: string }[] = [
  { id: "team", label: "Takım Antrenmanı", color: "var(--navy-600)" },
  { id: "individual", label: "Bireysel Antrenman", color: "var(--gold-600)" },
  { id: "mac", label: "Maç", color: "var(--red-600)" },
];

export function ScheduleAssignCard({ teams, athletes, fixtures }: { teams: STeam[]; athletes: SAthlete[]; fixtures: SFixture[] }) {
  const router = useRouter();
  const [kind, setKind] = useState<ProgramKind>("team");
  const [team, setTeam] = useState(teams[0]?.id ?? "");
  const [selAthletes, setSelAthletes] = useState<Set<string>>(new Set());
  const [date, setDate] = useState("");
  const [time, setTime] = useState("17:00");
  const [duration, setDuration] = useState("90");
  const [pitch, setPitch] = useState("Saha 1");
  const [notes, setNotes] = useState("");
  const [drills, setDrills] = useState<string[]>([""]);
  const [notify, setNotify] = useState(true);
  const [selFx, setSelFx] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const teamAthletes = useMemo(() => athletes.filter((a) => a.teamId === team), [athletes, team]);
  const fx = fixtures.find((f) => f.id === selFx) ?? null;

  const toggleAthlete = (id: string) =>
    setSelAthletes((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  const setDrill = (i: number, v: string) => setDrills((ds) => ds.map((d, j) => (j === i ? v : d)));
  const removeDrill = (i: number) => setDrills((ds) => ds.filter((_, j) => j !== i));

  const assign = () => {
    setError(null);
    if (!date) {
      setError("Tarih seçiniz.");
      return;
    }
    startTransition(async () => {
      const res = await createTraining({
        teamId: team,
        scope: kind === "individual" ? "individual" : "team",
        date,
        time,
        duration: duration ? Number(duration) : null,
        pitch,
        notes,
        drills: drills.map((d) => d.trim()).filter(Boolean),
        athleteIds: kind === "individual" ? [...selAthletes] : [],
      });
      if (res?.error) setError(res.error);
      else {
        setNotes("");
        setDate("");
        setDrills([""]);
        setSelAthletes(new Set());
        router.refresh();
      }
    });
  };

  return (
    <Panel title="Program Ata">
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <Field label="Program Türü" required>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {KINDS.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => { setKind(k.id); setError(null); }}
                style={{ font: "inherit", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${kind === k.id ? k.color : "var(--ink-200)"}`, background: kind === k.id ? "var(--navy-50)" : "#fff", fontWeight: 600, fontSize: 13, color: "var(--ink-700)" }}
              >
                <span style={{ width: 9, height: 9, borderRadius: 3, background: k.color }} />
                {k.label}
              </button>
            ))}
          </div>
        </Field>

        {kind === "mac" ? (
          <MacPanel fixtures={fixtures} selFx={selFx} onSelect={setSelFx} fx={fx} />
        ) : (
          <>
            <Select label="Takım" required options={teams.map((t) => ({ value: t.id, label: t.name }))} value={team} onChange={(e) => { setTeam(e.target.value); setSelAthletes(new Set()); }} />
            {kind === "individual" && (
              <Field label="Sporcular" required hint={`${selAthletes.size} sporcu seçili`}>
                <div style={{ maxHeight: 190, overflowY: "auto", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }}>
                  {teamAthletes.length === 0 && <span style={{ padding: 8, fontSize: 13, color: "var(--ink-400)" }}>Bu takımda sporcu bulunmuyor.</span>}
                  {teamAthletes.map((a) => (
                    <label key={a.id} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13.5, padding: "7px 9px", borderRadius: "var(--radius-sm)", cursor: "pointer", background: selAthletes.has(a.id) ? "var(--navy-50)" : "transparent", color: "var(--ink-700)" }}>
                      <input type="checkbox" checked={selAthletes.has(a.id)} onChange={() => toggleAthlete(a.id)} />
                      {a.name}
                    </label>
                  ))}
                </div>
              </Field>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Tarih" required><TextInput type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
              <Field label="Saat"><TextInput type="time" value={time} onChange={(e) => setTime(e.target.value)} /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <Field label="Süre" hint="dakika"><TextInput type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
              <Select label="Saha" options={PITCHES} value={pitch} onChange={(e) => setPitch(e.target.value)} />
            </div>
            <Field label="Antrenman İçeriği" hint="Çalışmaları madde madde ekleyin">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {drills.map((d, i) => (
                  <div key={i} style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1 }}>
                      <TextInput value={d} onChange={(e) => setDrill(i, e.target.value)} placeholder={`Madde ${i + 1} — örn. Pas kalıpları`} />
                    </div>
                    {drills.length > 1 && (
                      <IconButton label="Maddeyi sil" variant="outline" size="sm" onClick={() => removeDrill(i)}>
                        <Icon name="trash-2" size={14} />
                      </IconButton>
                    )}
                  </div>
                ))}
                <Button variant="secondary" size="sm" leftIcon={<Icon name="plus" size={14} />} onClick={() => setDrills((ds) => [...ds, ""])}>
                  Madde Ekle
                </Button>
              </div>
            </Field>
            <Field label="Genel Not"><TextArea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="örn. Krampon ve yağmurluk getirilecek" /></Field>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13, color: "var(--ink-600)" }}>Sporculara bildirim gönder</span>
              <Switch checked={notify} onChange={setNotify} />
            </div>
            {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
            <Button variant="accent" fullWidth leftIcon={<Icon name="calendar-check" size={16} />} onClick={assign} disabled={pending}>
              {pending ? "Ekleniyor…" : "Programa Ekle"}
            </Button>
          </>
        )}
      </div>
    </Panel>
  );
}

function MacPanel({ fixtures, selFx, onSelect, fx }: { fixtures: SFixture[]; selFx: string | null; onSelect: (id: string) => void; fx: SFixture | null }) {
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-");
    return day && m && y ? `${day}.${m}.${y}` : d;
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--ink-500)", lineHeight: 1.5 }}>
        Maçlar fikstürden takvime <strong>otomatik</strong> yansır; ayrıca eklemeniz gerekmez. Aşağıdan yaklaşan maçların detayına bakabilirsiniz.
      </p>
      <div style={{ maxHeight: 250, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
        {fixtures.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Yaklaşan maç bulunmuyor.</span>}
        {fixtures.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => onSelect(f.id)}
            style={{ font: "inherit", textAlign: "left", cursor: "pointer", padding: "9px 11px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${selFx === f.id ? "var(--red-600)" : "var(--ink-200)"}`, background: selFx === f.id ? "var(--red-100)" : "#fff", display: "flex", flexDirection: "column", gap: 3 }}
          >
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--gold-700)" }}>{f.competition}</span>
            <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-800)" }}>
              {f.isHome ? `Buca Yıldız – ${f.opponent}` : `${f.opponent} – Buca Yıldız`}
            </span>
            <span style={{ fontSize: 12, color: "var(--ink-400)" }}>{fmt(f.date)}{f.time ? ` · ${f.time}` : ""}</span>
          </button>
        ))}
      </div>
      {fx && (
        <div style={{ padding: "12px 14px", borderRadius: "var(--radius-md)", background: "var(--navy-50)", border: "1px solid var(--navy-300)", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Badge tone="gold">{fx.isHome ? "Ev Sahibi" : "Deplasman"}</Badge>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-800)" }}>{fx.competition}</span>
          </div>
          {fx.venue && <span style={{ fontSize: 12.5, color: "var(--ink-500)" }}>Saha: {fx.venue}</span>}
          <Link href="/admin/fikstur" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-700)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
            Fikstür&apos;de Yönet <Icon name="external-link" size={13} />
          </Link>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/admin/ScheduleAssignCard.tsx
git commit -m "feat(admin): Program Ata kartı — tür segmenti, madde listesi, sporcu çoklu seçim, maç paneli"
```

### Task B6: `ScheduleCalendar` + detay popover/sheet + `ScheduleView`

**Files:**
- Create: `src/components/admin/ScheduleCalendar.tsx`
- Create: `src/components/admin/views/ScheduleView.tsx`

- [ ] **Step 1: `ScheduleView.tsx` oluştur** (tipler burada — AssignCard bunları import ediyor)

```tsx
"use client";

import { ViewHeader } from "@/components/admin/kit";
import { ScheduleAssignCard } from "@/components/admin/ScheduleAssignCard";
import { ScheduleCalendar } from "@/components/admin/ScheduleCalendar";

export type STeam = { id: string; name: string };
export type SAthlete = { id: string; name: string; teamId: string };
export type SDrill = { id: string; text: string; done: boolean };
export type STraining = {
  id: string; teamId: string; scope: string; status: string; date: string; time: string;
  duration: number | null; pitch: string; notes: string; drills: SDrill[]; participants: string[];
};
export type SFixture = { id: string; competition: string; opponent: string; isHome: boolean; date: string; time: string; venue: string; teamId: string | null };

export function ScheduleView({ teams, athletes, trainings, fixtures, todayYmd }: {
  teams: STeam[]; athletes: SAthlete[]; trainings: STraining[]; fixtures: SFixture[]; todayYmd: string;
}) {
  return (
    <>
      <ViewHeader title="Takvim Programı" subtitle="Antrenman programını planla; maçlar fikstürden otomatik görünür" />
      <div className="hp-grid-2" style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: 18, alignItems: "start" }}>
        <ScheduleAssignCard teams={teams} athletes={athletes} fixtures={fixtures} />
        <ScheduleCalendar teams={teams} trainings={trainings} fixtures={fixtures} todayYmd={todayYmd} />
      </div>
    </>
  );
}
```

- [ ] **Step 2: `ScheduleCalendar.tsx` oluştur**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Panel } from "@/components/admin/kit";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { Icon } from "@/lib/icons";
import type { SFixture, STeam, STraining } from "@/components/admin/views/ScheduleView";

const MONTHS = ["Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];
const DOW = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];

export const TRAINING_STATUS_META: Record<string, { label: string; tone: "navy" | "success" | "live" | "gold" }> = {
  planned: { label: "Planlandı", tone: "navy" },
  completed: { label: "Tamamlandı", tone: "success" },
  cancelled: { label: "İptal Edildi", tone: "live" },
  partial: { label: "Yarım Kaldı", tone: "gold" },
};
export const statusMeta = (s: string) => TRAINING_STATUS_META[s] ?? TRAINING_STATUS_META.planned;

const parseYmd = (s: string) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d); };
const ymd = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const startOfWeek = (d: Date) => { const x = new Date(d); const wd = (x.getDay() + 6) % 7; x.setDate(x.getDate() - wd); x.setHours(0, 0, 0, 0); return x; };
const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const sameDay = (a: Date, b: Date) => a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const fmtDate = (d: string) => { const [y, m, day] = d.split("-"); return day && m && y ? `${day}.${m}.${y}` : d; };

type ActiveItem = { kind: "training"; t: STraining } | { kind: "fixture"; f: SFixture };

export function ScheduleCalendar({ teams, trainings, fixtures, todayYmd }: { teams: STeam[]; trainings: STraining[]; fixtures: SFixture[]; todayYmd: string }) {
  const [teamFilter, setTeamFilter] = useState("all");
  const [anchor, setAnchor] = useState<Date>(() => parseYmd(todayYmd));
  const [isMobile, setIsMobile] = useState(false);
  const [tip, setTip] = useState<{ item: ActiveItem; x: number; y: number; up: boolean } | null>(null);
  const [sheet, setSheet] = useState<ActiveItem | null>(null);
  const hideTimer = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 760px)");
    const on = () => { setIsMobile(mq.matches); if (mq.matches) setTip(null); };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const today = parseYmd(todayYmd);
  const mon = startOfWeek(anchor);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(mon, i));
  const sun = addDays(mon, 6);
  const title = `${mon.getDate()} – ${sun.getDate()} ${MONTHS[sun.getMonth()]} ${sun.getFullYear()}`;

  const trs = trainings.filter((t) => teamFilter === "all" || t.teamId === teamFilter);
  const fxs = fixtures.filter((f) => teamFilter === "all" || f.teamId === teamFilter);
  const trByDate: Record<string, STraining[]> = {};
  for (const t of trs) (trByDate[t.date] ??= []).push(t);
  const fxByDate: Record<string, SFixture[]> = {};
  for (const f of fxs) (fxByDate[f.date] ??= []).push(f);

  const cancelHide = () => { if (hideTimer.current) { window.clearTimeout(hideTimer.current); hideTimer.current = null; } };
  const scheduleHide = () => { cancelHide(); hideTimer.current = window.setTimeout(() => setTip(null), 140); };
  const show = (item: ActiveItem, el: HTMLElement) => {
    cancelHide();
    const r = el.getBoundingClientRect();
    const up = window.innerHeight - r.bottom < 340;
    const x = Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160);
    setTip({ item, x, y: up ? r.top - 8 : r.bottom + 8, up });
  };
  const activate = (item: ActiveItem) => (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isMobile) setSheet(item);
    else show(item, e.currentTarget);
  };

  const chipBase: React.CSSProperties = { font: "inherit", width: "100%", textAlign: "left", cursor: "pointer", border: "none", display: "flex", flexDirection: "column", gap: 2, padding: "7px 9px", borderRadius: "var(--radius-sm)", boxShadow: "var(--shadow-xs)" };

  return (
    <Panel
      title={`Haftalık Program`}
      action={
        <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)} style={{ font: "inherit", fontSize: 13, padding: "6px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--ink-200)", background: "#fff", color: "var(--ink-700)" }}>
          <option value="all">Tüm Takımlar</option>
          {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      }
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <IconButton label="Önceki hafta" variant="outline" size="sm" onClick={() => setAnchor((a) => addDays(a, -7))}><Icon name="chevron-down" size={16} style={{ transform: "rotate(90deg)" }} /></IconButton>
        <IconButton label="Sonraki hafta" variant="outline" size="sm" onClick={() => setAnchor((a) => addDays(a, 7))}><Icon name="chevron-down" size={16} style={{ transform: "rotate(-90deg)" }} /></IconButton>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>{title}</h3>
      </div>

      <div className="cal-week-grid" style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10 }}>
        {weekDays.map((day, i) => {
          const isToday = sameDay(day, today);
          const key = ymd(day);
          const dayTr = trByDate[key] ?? [];
          const dayFx = fxByDate[key] ?? [];
          return (
            <div key={i} className="cal-day" style={{ background: isToday ? "var(--navy-50)" : "var(--surface-card)", border: `1px solid ${isToday ? "var(--navy-300)" : "var(--border-subtle)"}`, borderRadius: "var(--radius-md)", overflow: "hidden", minHeight: 170, display: "flex", flexDirection: "column" }}>
              <div className="cal-day-head" style={{ padding: "8px 10px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", background: isToday ? "var(--navy-700)" : "transparent" }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: isToday ? "#fff" : "var(--ink-400)" }}>{DOW[i]}</span>
                <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 15, color: isToday ? "var(--gold-400)" : "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{day.getDate()}</span>
              </div>
              <div className="cal-day-body" style={{ padding: 7, display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                {dayTr.length === 0 && dayFx.length === 0 && <span style={{ margin: "auto", fontSize: 11, color: "var(--ink-300)" }}>—</span>}
                {dayTr.map((t) => {
                  const indiv = t.scope === "individual";
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={activate({ kind: "training", t })}
                      onMouseEnter={isMobile ? undefined : (e) => show({ kind: "training", t }, e.currentTarget)}
                      onMouseLeave={isMobile ? undefined : scheduleHide}
                      style={{ ...chipBase, background: indiv ? "var(--gold-100)" : "var(--navy-50)", borderLeft: `3px solid ${indiv ? "var(--gold-600)" : "var(--navy-600)"}` }}
                    >
                      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{t.time || "—"}</span>
                      <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.2 }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</span>
                      <span style={{ fontSize: 10.5, color: "var(--ink-400)" }}>
                        {[t.pitch, t.duration ? `${t.duration} dk` : ""].filter(Boolean).join(" · ") || " "}
                      </span>
                    </button>
                  );
                })}
                {dayFx.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={activate({ kind: "fixture", f })}
                    onMouseEnter={isMobile ? undefined : (e) => show({ kind: "fixture", f }, e.currentTarget)}
                    onMouseLeave={isMobile ? undefined : scheduleHide}
                    style={{ ...chipBase, background: "var(--red-100)", borderLeft: "3px solid var(--red-600)" }}
                  >
                    <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 12, color: "var(--ink-700)", fontVariantNumeric: "tabular-nums" }}>{f.time || "—"}</span>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink-800)", lineHeight: 1.2 }}>Maç</span>
                    <span style={{ fontSize: 10.5, color: "var(--ink-400)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.venue || " "}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14 }}>
        <LegendDot color="var(--navy-600)" label="Takım Antrenmanı" />
        <LegendDot color="var(--gold-600)" label="Bireysel Antrenman" />
        <LegendDot color="var(--red-600)" label="Maç (fikstürden otomatik)" />
      </div>

      {tip && !isMobile && (
        <div
          onMouseEnter={cancelHide}
          onMouseLeave={scheduleHide}
          style={{ position: "fixed", left: tip.x, top: tip.y, transform: `translate(-50%, ${tip.up ? "-100%" : "0"})`, zIndex: 80, width: 300, maxWidth: "calc(100vw - 24px)" }}
        >
          <ProgramDetailCard item={tip.item} teams={teams} />
        </div>
      )}

      {sheet && isMobile && (
        <>
          <div onClick={() => setSheet(null)} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 70 }} />
          <div role="dialog" aria-modal="true" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 71, maxHeight: "72vh", overflowY: "auto", borderRadius: "16px 16px 0 0", background: "var(--surface-card)", boxShadow: "var(--shadow-lg)", padding: "8px 0 22px" }}>
            <div style={{ width: 44, height: 4, borderRadius: 2, background: "var(--ink-200)", margin: "8px auto 10px" }} />
            <ProgramDetailCard item={sheet} teams={teams} plain />
          </div>
        </>
      )}
    </Panel>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--ink-600)" }}>
      <span style={{ width: 9, height: 9, borderRadius: 3, background: color }} />
      {label}
    </span>
  );
}

/** Popover (masaüstü hover) ve bottom-sheet (mobil) ortak detay içeriği. */
function ProgramDetailCard({ item, teams, plain }: { item: ActiveItem; teams: STeam[]; plain?: boolean }) {
  const teamName = (id: string | null) => teams.find((t) => t.id === id)?.name ?? "";
  const box: React.CSSProperties = plain
    ? { padding: "4px 20px 0" }
    : { background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-lg)", padding: 16 };
  const metaRow: React.CSSProperties = { display: "flex", flexWrap: "wrap", gap: "4px 14px", fontSize: 12.5, color: "var(--ink-500)", marginBottom: 10 };

  if (item.kind === "fixture") {
    const f = item.f;
    return (
      <div style={box}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ width: 9, height: 9, borderRadius: 3, background: "var(--red-600)" }} />
          <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>Maç</strong>
          <span style={{ marginLeft: "auto" }}><Badge tone="gold">{f.isHome ? "Ev Sahibi" : "Deplasman"}</Badge></span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink-800)", marginBottom: 6 }}>
          {f.isHome ? `Buca Yıldız – ${f.opponent}` : `${f.opponent} – Buca Yıldız`}
        </div>
        <div style={metaRow}>
          <span>{f.competition}</span>
          <span>{fmtDate(f.date)}{f.time ? ` · ${f.time}` : ""}</span>
          {f.venue && <span>{f.venue}</span>}
          {f.teamId && <span>{teamName(f.teamId)}</span>}
        </div>
        <Link href="/admin/fikstur" style={{ fontSize: 13, fontWeight: 600, color: "var(--navy-700)", display: "inline-flex", alignItems: "center", gap: 6, textDecoration: "none" }}>
          Fikstür&apos;de Yönet <Icon name="external-link" size={13} />
        </Link>
      </div>
    );
  }

  const t = item.t;
  const st = statusMeta(t.status);
  const indiv = t.scope === "individual";
  return (
    <div style={box}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: 3, background: indiv ? "var(--gold-600)" : "var(--navy-600)" }} />
        <strong style={{ fontSize: 14, color: "var(--text-strong)" }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</strong>
        <span style={{ marginLeft: "auto" }}><Badge tone={st.tone}>{st.label}</Badge></span>
      </div>
      <div style={metaRow}>
        <span>{teamName(t.teamId)}</span>
        <span>{fmtDate(t.date)}{t.time ? ` · ${t.time}` : ""}</span>
        {t.duration != null && <span>{t.duration} dk</span>}
        {t.pitch && <span>{t.pitch}</span>}
      </div>
      {t.drills.length > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)", marginBottom: 6 }}>Antrenman İçeriği</div>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
            {t.drills.map((d) => (
              <li key={d.id} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 13, color: d.done ? "var(--ink-400)" : "var(--ink-700)" }}>
                <Icon name={d.done ? "calendar-check" : "chevron-right"} size={13} style={{ marginTop: 2, flex: "none", color: d.done ? "var(--green-600)" : "var(--ink-300)" }} />
                <span style={{ textDecoration: d.done ? "line-through" : "none" }}>{d.text}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      {t.participants.length > 0 && (
        <div style={{ fontSize: 12.5, color: "var(--ink-500)", marginBottom: 6 }}>
          <strong style={{ color: "var(--ink-600)" }}>Katılımcılar:</strong> {t.participants.join(", ")}
        </div>
      )}
      {t.notes && <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}><strong style={{ color: "var(--ink-600)" }}>Not:</strong> {t.notes}</div>}
    </div>
  );
}
```

> İkon notu: `Icon` adları `@/lib/icons`'tan gelir; bu planda kullanılanlar (`calendar-check`, `chevron-right`, `chevron-down`, `external-link`, `trash-2`, `plus`) mevcut kodda halihazırda kullanılıyor. Farklı bir ad hata verirse `src/lib/icons.tsx` içindeki `IconName` union'ından en yakınını seç.

- [ ] **Step 3: Doğrula + commit**

Run: `npm run typecheck`
Expected: admin tarafı hatasız; çıktıda YALNIZCA `src/app/panel/*` ve `src/components/panel/TrainingCalendar.tsx` kaynaklı `type`/`scope` hataları kalır (B7'de sıfırlanacak). Başka dosyadan hata varsa bu görevde düzelt.

```bash
git add src/components/admin/ScheduleCalendar.tsx src/components/admin/views/ScheduleView.tsx
git commit -m "feat(admin): haftalık program takvimi — hover popover, mobil sheet, fikstürden otomatik maçlar"
```

### Task B7: Sporcu paneli takvim uyumu (`scope`)

**Files:**
- Modify: `src/components/panel/TrainingCalendar.tsx`
- Modify: `src/app/panel/page.tsx:20`
- Modify: `src/app/panel/antrenmanlar/page.tsx:16`

- [ ] **Step 1: `TrainingCalendar.tsx` — tip ve etiket eşlemesini scope'a çevir**

`CalTraining` tipini değiştir:
```tsx
export type CalTraining = { id: string; date: string; time: string; scope: string; duration: number | null };
```

`TYPES` sabitini şununla değiştir:
```tsx
const SCOPES: Record<string, { label: string; color: string; soft: string }> = {
  team: { label: "Takım Antrenmanı", color: "var(--navy-600)", soft: "var(--navy-50)" },
  individual: { label: "Bireysel Antrenman", color: "var(--gold-600)", soft: "var(--gold-100)" },
};
const scopeMeta = (s: string) => SCOPES[s] ?? SCOPES.team;
```

`typeMeta(` çağrılarını `scopeMeta(` yap; `EventChip`'in `type` prop adını `scope` yap (`EventChip({ time, scope, compact })`, kullanım `ev.scope`); alt lejant `Object.entries(TYPES)` → `Object.entries(SCOPES)`.

- [ ] **Step 2: İki panel sayfasındaki map satırını güncelle** — her ikisinde:

```tsx
  const trainings: CalTraining[] = athlete.team.trainings.map((t) => ({ id: t.id, date: t.date, time: t.time, scope: t.scope, duration: t.duration }));
```

- [ ] **Step 3: FAZ B tam doğrulama**

Run: `npm run typecheck` → exit 0 (artık sıfır hata).
Run: `npm run lint` → temiz.
Run: `npm run test` → tümü PASS.
Tarayıcı/Playwright: `/admin/takvim-programi` — takım antrenmanı maddelerle ata → takvimde görünür; hover popover maddeleri gösterir; 375px'te karta dokun → alttan sheet; takvimde yaklaşan maç kırmızı çipte; Bireysel'de sporcu seçmeden kaydet → Türkçe hata. `/panel` ve `/panel/antrenmanlar` hatasız açılır.

- [ ] **Step 4: Commit**

```bash
git add src/components/panel/TrainingCalendar.tsx src/app/panel/page.tsx src/app/panel/antrenmanlar/page.tsx
git commit -m "feat(panel): sporcu takvimi scope tabanlı etiketlere geçti"
```

---

## FAZ C — Antrenman Yönetimi (`/admin/antrenmanlar`)

### Task C1: Yönetim action'ları

**Files:**
- Create: `src/app/admin/(panel)/antrenmanlar/actions.ts`

- [ ] **Step 1: Dosyayı oluştur**

```ts
"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { attendanceSaveSchema, TRAINING_STATUSES } from "@/lib/validation";

function revalidate() {
  revalidatePath("/admin/antrenmanlar");
  revalidatePath("/admin/takvim-programi");
}

export async function setTrainingStatus(id: string, status: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = z.enum(TRAINING_STATUSES).safeParse(status);
  if (!parsed.success) return { error: "Geçersiz durum." };
  await prisma.training.update({ where: { id }, data: { status: parsed.data } }).catch(() => {});
  revalidate();
}

const basicsSchema = z.object({
  date: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Geçerli bir tarih seçiniz."),
  time: z.string().trim().max(5).optional().or(z.literal("")),
  duration: z.number().int().min(0).max(300).nullable().optional(),
  pitch: z.string().trim().max(80).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export async function updateTrainingBasics(id: string, input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = basicsSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const d = parsed.data;
  await prisma.training
    .update({ where: { id }, data: { date: d.date, time: d.time || "", duration: d.duration ?? null, pitch: d.pitch || "", notes: d.notes || "" } })
    .catch(() => {});
  revalidate();
}

export async function toggleDrill(drillId: string, done: boolean): Promise<void> {
  await requireAdmin();
  await prisma.trainingDrill.update({ where: { id: drillId }, data: { done } }).catch(() => {});
  revalidate();
}

export async function addDrill(trainingId: string, text: string): Promise<{ error?: string } | void> {
  await requireAdmin();
  const t = text.trim();
  if (!t || t.length > 200) return { error: "Geçerli bir madde giriniz (en fazla 200 karakter)." };
  const count = await prisma.trainingDrill.count({ where: { trainingId } });
  try {
    await prisma.trainingDrill.create({ data: { trainingId, text: t, sort: count } });
  } catch {
    return { error: "Madde eklenemedi." };
  }
  revalidate();
}

export async function removeDrill(drillId: string): Promise<void> {
  await requireAdmin();
  await prisma.trainingDrill.delete({ where: { id: drillId } }).catch(() => {});
  revalidate();
}

export async function saveAttendance(input: unknown): Promise<{ error?: string } | void> {
  await requireAdmin();
  const parsed = attendanceSaveSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Geçersiz veri." };
  const { trainingId, rows } = parsed.data;
  try {
    await prisma.$transaction(
      rows.map((r) =>
        prisma.trainingAttendance.upsert({
          where: { trainingId_athleteId: { trainingId, athleteId: r.athleteId } },
          create: { trainingId, athleteId: r.athleteId, status: r.status, note: r.note || "" },
          update: { status: r.status, note: r.note || "" },
        }),
      ),
    );
  } catch {
    return { error: "Yoklama kaydedilemedi." };
  }
  revalidate();
}
```

- [ ] **Step 2: Run: `npm run typecheck` → exit 0; commit**

```bash
git add "src/app/admin/(panel)/antrenmanlar/actions.ts"
git commit -m "feat(admin): antrenman durum/madde/yoklama server actions"
```

### Task C2: Antrenman Yönetimi sayfası + detay drawer

**Files:**
- Create: `src/app/admin/(panel)/antrenmanlar/page.tsx`
- Create: `src/components/admin/views/TrainingManageView.tsx`

- [ ] **Step 1: `page.tsx` oluştur**

```tsx
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { TrainingManageView } from "@/components/admin/views/TrainingManageView";

export const metadata: Metadata = { title: "Antrenmanlar" };

export default async function AntrenmanlarPage() {
  const [teams, athletes, trainings] = await Promise.all([
    prisma.team.findMany({ orderBy: { sort: "asc" }, select: { id: true, name: true } }),
    prisma.athlete.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, teamId: true } }),
    prisma.training.findMany({
      orderBy: [{ date: "desc" }, { time: "desc" }],
      include: {
        drills: { orderBy: { sort: "asc" }, select: { id: true, text: true, done: true } },
        attendance: { select: { athleteId: true, status: true, note: true } },
      },
    }),
  ]);

  return (
    <TrainingManageView
      teams={teams}
      athletes={athletes}
      trainings={trainings.map((t) => ({
        id: t.id, teamId: t.teamId, scope: t.scope, status: t.status, date: t.date, time: t.time,
        duration: t.duration, pitch: t.pitch, notes: t.notes, drills: t.drills, attendance: t.attendance,
      }))}
    />
  );
}
```

- [ ] **Step 2: `TrainingManageView.tsx` oluştur**

```tsx
"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ViewHeader, Toolbar, Field } from "@/components/admin/kit";
import { TextInput, TextArea, Drawer } from "@/components/admin/controls";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Tabs } from "@/components/ui/Tabs";
import { Icon } from "@/lib/icons";
import { TRAINING_STATUS_META, statusMeta } from "@/components/admin/ScheduleCalendar";
import {
  setTrainingStatus, updateTrainingBasics, toggleDrill, addDrill, removeDrill, saveAttendance,
} from "@/app/admin/(panel)/antrenmanlar/actions";
import { deleteTraining } from "@/app/admin/(panel)/takvim-programi/actions";

export type MTeam = { id: string; name: string };
export type MAthlete = { id: string; name: string; teamId: string };
export type MDrill = { id: string; text: string; done: boolean };
export type MAttendance = { athleteId: string; status: string; note: string };
export type MTraining = {
  id: string; teamId: string; scope: string; status: string; date: string; time: string;
  duration: number | null; pitch: string; notes: string; drills: MDrill[]; attendance: MAttendance[];
};

const ATT_OPTIONS = [
  { id: "present", label: "Katıldı", color: "var(--green-600)" },
  { id: "absent", label: "Katılmadı", color: "var(--red-600)" },
  { id: "excused", label: "İzinli", color: "var(--gold-600)" },
] as const;

const fmtDate = (d: string) => { const [y, m, day] = d.split("-"); return day && m && y ? `${day}.${m}.${y}` : d; };

export function TrainingManageView({ teams, athletes, trainings }: { teams: MTeam[]; athletes: MAthlete[]; trainings: MTraining[] }) {
  const [teamTab, setTeamTab] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [openId, setOpenId] = useState<string | null>(null);

  const rows = useMemo(
    () => trainings.filter((t) => (teamTab === "all" || t.teamId === teamTab) && (statusFilter === "all" || t.status === statusFilter)),
    [trainings, teamTab, statusFilter],
  );
  const open = trainings.find((t) => t.id === openId) ?? null;
  const teamName = (id: string) => teams.find((t) => t.id === id)?.name ?? "";

  const tabs = [
    { id: "all", label: "Tümü", count: trainings.length },
    ...teams.map((t) => ({ id: t.id, label: t.name, count: trainings.filter((x) => x.teamId === t.id).length })),
  ];

  return (
    <>
      <ViewHeader
        title="Antrenmanlar"
        subtitle="Takvim programındaki antrenmanları yönet: durum, içerik ve yoklama"
        tabs={<Tabs tabs={tabs} value={teamTab} onChange={setTeamTab} />}
      />
      <Toolbar>
        <span style={{ fontSize: 13, color: "var(--ink-400)" }}>{rows.length} antrenman</span>
        <div style={{ marginLeft: "auto" }}>
          <Select
            options={[{ value: "all", label: "Tüm Durumlar" }, ...Object.entries(TRAINING_STATUS_META).map(([v, m]) => ({ value: v, label: m.label }))]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            containerStyle={{ minWidth: 160 }}
            style={{ padding: "8px 34px 8px 12px", fontSize: 13.5 }}
          />
        </div>
      </Toolbar>

      {rows.length === 0 ? (
        <div style={{ padding: "44px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
          Antrenman bulunamadı. Takvim Programı sayfasından antrenman atayabilirsiniz.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {rows.map((t) => {
            const st = statusMeta(t.status);
            const doneCount = t.drills.filter((d) => d.done).length;
            const presentCount = t.attendance.filter((a) => a.status === "present").length;
            const indiv = t.scope === "individual";
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setOpenId(t.id)}
                style={{ font: "inherit", textAlign: "left", cursor: "pointer", background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderLeft: `3px solid ${indiv ? "var(--gold-600)" : "var(--navy-600)"}`, borderRadius: "var(--radius-md)", padding: "13px 16px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 16px", boxShadow: "var(--shadow-xs)" }}
              >
                <div style={{ minWidth: 90 }}>
                  <div style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 14, color: "var(--text-strong)" }}>{fmtDate(t.date)}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{t.time || "—"}</div>
                </div>
                <div style={{ flex: 1, minWidth: 150 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: "var(--ink-800)" }}>{indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}</div>
                  <div style={{ fontSize: 12.5, color: "var(--ink-500)" }}>
                    {[teamName(t.teamId), t.pitch, t.duration ? `${t.duration} dk` : ""].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  {t.drills.length > 0 && <span style={{ fontSize: 12, color: "var(--ink-500)" }}><Icon name="calendar-check" size={12} style={{ marginRight: 4, verticalAlign: -1 }} />{doneCount}/{t.drills.length} madde</span>}
                  {t.attendance.length > 0 && <span style={{ fontSize: 12, color: "var(--ink-500)" }}>{presentCount}/{t.attendance.length} katılım</span>}
                  <Badge tone={st.tone}>{st.label}</Badge>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {open && <TrainingDrawer key={open.id} training={open} teams={teams} athletes={athletes} onClose={() => setOpenId(null)} />}
    </>
  );
}

function TrainingDrawer({ training: t, teams, athletes, onClose }: { training: MTraining; teams: MTeam[]; athletes: MAthlete[]; onClose: () => void }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [newDrill, setNewDrill] = useState("");
  const [basics, setBasics] = useState({ date: t.date, time: t.time, duration: t.duration?.toString() ?? "", pitch: t.pitch, notes: t.notes });

  // Yoklama satırları: bireyselde attendance kayıtları (katılımcılar); takımda
  // takım kadrosu + mevcut kayıtlarla birleşim.
  const roster: { athleteId: string; name: string }[] =
    t.scope === "individual"
      ? t.attendance.map((a) => ({ athleteId: a.athleteId, name: athletes.find((x) => x.id === a.athleteId)?.name ?? "—" }))
      : athletes.filter((a) => a.teamId === t.teamId).map((a) => ({ athleteId: a.id, name: a.name }));

  const [att, setAtt] = useState<Record<string, { status: string; note: string }>>(() => {
    const m: Record<string, { status: string; note: string }> = {};
    for (const r of roster) {
      const ex = t.attendance.find((a) => a.athleteId === r.athleteId);
      m[r.athleteId] = { status: ex?.status ?? "unknown", note: ex?.note ?? "" };
    }
    return m;
  });

  const run = (fn: () => Promise<{ error?: string } | void>) => {
    setError(null);
    startTransition(async () => {
      const res = await fn();
      if (res?.error) setError(res.error);
      router.refresh();
    });
  };

  const saveAll = () => {
    const rows = roster
      .map((r) => ({ athleteId: r.athleteId, status: att[r.athleteId]?.status ?? "unknown", note: att[r.athleteId]?.note ?? "" }))
      .filter((r) => r.status !== "unknown" || r.note.trim() !== "");
    if (rows.length === 0) { setError("Kaydedilecek yoklama satırı yok."); return; }
    run(() => saveAttendance({ trainingId: t.id, rows }));
  };

  const remove = () => {
    if (!window.confirm("Bu antrenmanı silmek istediğinize emin misiniz?")) return;
    startTransition(async () => {
      await deleteTraining(t.id);
      onClose();
      router.refresh();
    });
  };

  const st = statusMeta(t.status);
  const indiv = t.scope === "individual";

  return (
    <Drawer
      open
      onClose={onClose}
      title={indiv ? "Bireysel Antrenman" : "Takım Antrenmanı"}
      subtitle={`${teams.find((x) => x.id === t.teamId)?.name ?? ""} · ${fmtDate(t.date)}${t.time ? ` · ${t.time}` : ""}`}
      width={620}
      footer={
        <>
          <Button variant="ghost" size="sm" style={{ color: "var(--red-600)", marginRight: "auto" }} leftIcon={<Icon name="trash-2" size={15} />} onClick={remove} disabled={pending}>
            Sil
          </Button>
          <Button variant="secondary" size="sm" onClick={onClose}>Kapat</Button>
          <Button variant="primary" size="sm" onClick={saveAll} disabled={pending}>
            {pending ? "Kaydediliyor…" : "Yoklamayı Kaydet"}
          </Button>
        </>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Durum */}
        <Field label="Antrenman Durumu">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(TRAINING_STATUS_META).map(([value, meta]) => (
              <button
                key={value}
                type="button"
                disabled={pending}
                onClick={() => run(() => setTrainingStatus(t.id, value))}
                style={{ font: "inherit", cursor: "pointer", padding: "8px 13px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${t.status === value ? "var(--navy-600)" : "var(--ink-200)"}`, background: t.status === value ? "var(--navy-50)" : "#fff", fontWeight: 600, fontSize: 13, color: "var(--ink-700)" }}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Temel bilgiler */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>Program Bilgileri</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Tarih"><TextInput type="date" value={basics.date} onChange={(e) => setBasics((b) => ({ ...b, date: e.target.value }))} /></Field>
            <Field label="Saat"><TextInput type="time" value={basics.time} onChange={(e) => setBasics((b) => ({ ...b, time: e.target.value }))} /></Field>
            <Field label="Süre" hint="dakika"><TextInput type="number" value={basics.duration} onChange={(e) => setBasics((b) => ({ ...b, duration: e.target.value }))} /></Field>
            <Field label="Saha"><TextInput value={basics.pitch} onChange={(e) => setBasics((b) => ({ ...b, pitch: e.target.value }))} /></Field>
          </div>
          <div style={{ marginTop: 12 }}>
            <Field label="Genel Not"><TextArea rows={2} value={basics.notes} onChange={(e) => setBasics((b) => ({ ...b, notes: e.target.value }))} /></Field>
          </div>
          <div style={{ marginTop: 10 }}>
            <Button
              variant="secondary"
              size="sm"
              disabled={pending}
              onClick={() => run(() => updateTrainingBasics(t.id, { date: basics.date, time: basics.time, duration: basics.duration ? Number(basics.duration) : null, pitch: basics.pitch, notes: basics.notes }))}
            >
              Bilgileri Güncelle
            </Button>
          </div>
        </div>

        {/* Maddeler */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>
            Antrenman İçeriği {t.drills.length > 0 && <span style={{ color: "var(--ink-400)" }}>({t.drills.filter((d) => d.done).length}/{t.drills.length})</span>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {t.drills.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Henüz madde eklenmemiş.</span>}
            {t.drills.map((d) => (
              <div key={d.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: d.done ? "var(--green-100)" : "var(--surface-card)" }}>
                <input type="checkbox" checked={d.done} disabled={pending} onChange={(e) => run(async () => { await toggleDrill(d.id, e.target.checked); })} />
                <span style={{ flex: 1, fontSize: 13.5, color: d.done ? "var(--ink-400)" : "var(--ink-700)", textDecoration: d.done ? "line-through" : "none" }}>{d.text}</span>
                <IconButton label="Maddeyi sil" variant="outline" size="sm" onClick={() => run(async () => { await removeDrill(d.id); })}><Icon name="trash-2" size={13} /></IconButton>
              </div>
            ))}
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <TextInput value={newDrill} onChange={(e) => setNewDrill(e.target.value)} placeholder="Yeni madde — örn. Şut çalışması" />
              </div>
              <Button variant="secondary" size="sm" disabled={pending || !newDrill.trim()} onClick={() => run(async () => { const r = await addDrill(t.id, newDrill); if (!r?.error) setNewDrill(""); return r; })}>
                Ekle
              </Button>
            </div>
          </div>
        </div>

        {/* Yoklama */}
        <div>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", marginBottom: 10 }}>
            Yoklama & Sporcu Notları {indiv && <Badge tone="gold" style={{ marginLeft: 6 }}>Katılımcılar</Badge>}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {roster.length === 0 && <span style={{ fontSize: 13, color: "var(--ink-400)" }}>Sporcu bulunamadı.</span>}
            {roster.map((r) => {
              const row = att[r.athleteId] ?? { status: "unknown", note: "" };
              return (
                <div key={r.athleteId} style={{ display: "flex", flexDirection: "column", gap: 7, padding: "10px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: "var(--ink-800)", flex: 1, minWidth: 120 }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      {ATT_OPTIONS.map((o) => (
                        <button
                          key={o.id}
                          type="button"
                          onClick={() => setAtt((m) => ({ ...m, [r.athleteId]: { ...row, status: row.status === o.id ? "unknown" : o.id } }))}
                          style={{ font: "inherit", cursor: "pointer", padding: "5px 10px", borderRadius: "var(--radius-sm)", border: `1.5px solid ${row.status === o.id ? o.color : "var(--ink-200)"}`, background: row.status === o.id ? "var(--ink-50)" : "#fff", fontWeight: 600, fontSize: 12, color: row.status === o.id ? o.color : "var(--ink-500)" }}
                        >
                          {o.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <TextInput value={row.note} onChange={(e) => setAtt((m) => ({ ...m, [r.athleteId]: { ...row, note: e.target.value } }))} placeholder="Sporcuya özel not / direktif (opsiyonel)" />
                </div>
              );
            })}
          </div>
        </div>

        {error && <div style={{ padding: "10px 13px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13, color: "var(--red-600)" }}>{error}</div>}
      </div>
    </Drawer>
  );
}
```

> Not: `run(async () => { await toggleDrill(...) })` deseni — `toggleDrill`/`removeDrill` `void` döner; `run` `{error?}|void` bekler, uyumludur.

- [ ] **Step 3: FAZ C doğrulama**

Run: `npm run typecheck` → exit 0. `npm run lint` → temiz. `npm run test` → tümü PASS.
Tarayıcı/Playwright uçtan uca: Takvim Programı'nda maddeli takım antrenmanı ata → Antrenmanlar listesinde görün → aç → 2 maddeden 1'ini tikle (listede 1/2 görünür) → durumu "Tamamlandı" yap → yoklamada 2 sporcuya Katıldı + 1'ine not yaz → "Yoklamayı Kaydet" → sayfayı yenile, veriler kalıcı. 375px'te drawer kullanılabilir.

- [ ] **Step 4: Commit**

```bash
git add "src/app/admin/(panel)/antrenmanlar" src/components/admin/views/TrainingManageView.tsx
git commit -m "feat(admin): antrenman yönetimi — durum, madde kontrol listesi, yoklama ve sporcu notları"
```

---

## Bitiş kontrol listesi

- [ ] `npm run typecheck` + `npm run lint` + `npm run test` üçü de temiz
- [ ] 375px: `/panel/maclar`, `/admin/fikstur`, `/admin/takvim-programi`, `/admin/antrenmanlar` — yatay taşma yok
- [ ] `/admin/takvim-programi`: hover popover (masaüstü) + dokunma sheet (mobil) + fikstürden otomatik maçlar
- [ ] `/admin/antrenmanlar`: durum + madde tik + yoklama/not uçtan uca kalıcı
- [ ] `/panel` ve `/panel/antrenmanlar` regresyonsuz (scope etiketli)
- [ ] ROADMAP.md güncelle: bu üç özellik "Tamamlananlar"a işlenir (ayrı commit)
