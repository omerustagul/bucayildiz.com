// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({})); // storage.ts (isOwnStorageUrl) node testinde yüklensin
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  created: [] as Array<Record<string, unknown>>,
  deleted: [] as string[],
  assets: [] as Array<Record<string, unknown>>,
  maxSort: 3,
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
  requirePermission: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin, requirePermission: H.requirePermission }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    homeMediaCard: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        H.created.push(data);
        return { id: "new", ...data };
      }),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => {
        H.deleted.push(where.id);
        return {};
      }),
      aggregate: vi.fn(async () => ({ _max: { sort: H.maxSort } })),
    },
    mediaAsset: {
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => {
        H.assets.push(data);
        return { id: "asset1", ...data };
      }),
    },
    folder: { findUnique: vi.fn(async () => null) },
  },
}));

import { createHomeCard, deleteHomeCard, createMediaAsset } from "./actions";

beforeEach(() => {
  H.created = [];
  H.deleted = [];
  H.assets = [];
  H.requireAdmin.mockClear();
  H.requirePermission.mockClear();
});

describe("createMediaAsset — URL allowlist", () => {
  it("kendi depolamamızdan (/uploads/) medya kaydedilir", async () => {
    const r = await createMediaAsset({ url: "/uploads/foto.webp", categoryId: "cat1", kind: "photo" });
    expect(r).toEqual({ ok: true });
    expect(H.assets).toHaveLength(1);
    expect(H.assets[0].url).toBe("/uploads/foto.webp");
  });

  it("keyfi HARİCİ medya URL'i REDDEDİLİR (KVKK: MediaAsset.url ham <img>/<video> ile render edilir → next/image allowlist'ini baypas edip ziyaretçi IP'sini sızdırırdı)", async () => {
    const r = await createMediaAsset({ url: "https://evil.example/pixel.gif", categoryId: "cat1", kind: "photo" });
    expect(r).toMatchObject({ ok: false });
    expect(H.assets).toHaveLength(0);
  });
});

describe("createHomeCard — yetki + URL allowlist + boş durum", () => {
  it("kendi depolamamızdan (/uploads/) kapakla oluşturulur ve sona eklenir", async () => {
    const r = await createHomeCard({ title: "Kamp", categoryId: "cat1", kind: "photo", coverUrl: "/uploads/x.webp" });
    expect(r).toEqual({ ok: true });
    expect(H.created).toHaveLength(1);
    expect(H.created[0].sort).toBe(4); // maxSort(3) + 1
    expect(H.created[0].coverUrl).toBe("/uploads/x.webp");
  });

  it("keyfi HARİCİ kapak URL'i REDDEDİLİR (allowlist — tracking-pixel deliği kapalı)", async () => {
    const r = await createHomeCard({ title: "Kamp", coverUrl: "https://evil.example/pixel.gif" });
    expect(r).toMatchObject({ ok: false });
    expect(H.created).toHaveLength(0);
  });

  it("boş başlık reddedilir (Zod)", async () => {
    const r = await createHomeCard({ title: "", coverUrl: "/uploads/x.webp" });
    expect(r).toMatchObject({ ok: false });
    expect(H.created).toHaveLength(0);
  });

  it("kapaksız (boş) kart oluşturulabilir — coverUrl opsiyonel", async () => {
    const r = await createHomeCard({ title: "Videolar", kind: "video" });
    expect(r).toEqual({ ok: true });
    expect(H.created[0].coverUrl).toBeNull();
    expect(H.created[0].kind).toBe("video");
  });

  it("video kartta kendi depolamamızdan coverVideoUrl kabul edilir", async () => {
    const r = await createHomeCard({ title: "Özet", kind: "video", coverUrl: "/uploads/p.webp", coverVideoUrl: "/uploads/v.mp4" });
    expect(r).toEqual({ ok: true });
    expect(H.created[0].coverVideoUrl).toBe("/uploads/v.mp4");
  });

  it("harici coverVideoUrl REDDEDİLİR (allowlist)", async () => {
    const r = await createHomeCard({ title: "Özet", kind: "video", coverVideoUrl: "https://evil.example/x.mp4" });
    expect(r).toMatchObject({ ok: false });
    expect(H.created).toHaveLength(0);
  });

  it("foto kartında coverVideoUrl null'a çekilir (video değil)", async () => {
    const r = await createHomeCard({ title: "Foto", kind: "photo", coverUrl: "/uploads/p.webp", coverVideoUrl: "/uploads/v.mp4" });
    expect(r).toEqual({ ok: true });
    expect(H.created[0].coverVideoUrl).toBeNull();
  });
});

describe("deleteHomeCard", () => {
  it("geçerli id siler", async () => {
    const r = await deleteHomeCard("card-1");
    expect(r).toEqual({ ok: true });
    expect(H.deleted).toEqual(["card-1"]);
  });

  it("boş/geçersiz id reddedilir, silmez", async () => {
    const r = await deleteHomeCard("");
    expect(r).toMatchObject({ ok: false });
    expect(H.deleted).toHaveLength(0);
  });
});

describe("yetki kapısı", () => {
  it("her iki action da requirePermission'dan geçer", async () => {
    await createHomeCard({ title: "X", coverUrl: "/uploads/a.webp" });
    await deleteHomeCard("id1");
    expect(H.requirePermission).toHaveBeenCalledTimes(2);
  });
});
