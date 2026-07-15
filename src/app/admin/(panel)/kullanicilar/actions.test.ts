// @vitest-environment node
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("server-only", () => ({}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/headers", () => ({ headers: async () => ({ get: () => null }) }));

const H = vi.hoisted(() => ({
  session: { sub: "owner1", name: "Sahip", email: "", role: "owner" },
  ownerCount: 2,
  target: null as null | { id: string; name: string; role: string; permissions: string[] },
  created: [] as Array<Record<string, unknown>>,
  updated: [] as Array<Record<string, unknown>>,
  deleted: [] as string[],
  requireOwner: vi.fn(async () => H.session),
  hashPassword: vi.fn(async () => "hashed"),
}));

vi.mock("@/lib/auth", () => ({ requireOwner: H.requireOwner, hashPassword: H.hashPassword }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async () => H.target),
      count: vi.fn(async () => H.ownerCount),
      create: vi.fn(async ({ data }: { data: Record<string, unknown> }) => { H.created.push(data); return { id: "new", ...data }; }),
      update: vi.fn(async ({ data }: { data: Record<string, unknown> }) => { H.updated.push(data); return {}; }),
      delete: vi.fn(async ({ where }: { where: { id: string } }) => { H.deleted.push(where.id); return {}; }),
    },
    adminAuditLog: { create: vi.fn(async () => ({})) },
  },
}));

import { createAdminUser, updateAdminUser, deleteAdminUser } from "./actions";

beforeEach(() => {
  H.session = { sub: "owner1", name: "Sahip", email: "", role: "owner" };
  H.ownerCount = 2;
  H.target = null;
  H.created = [];
  H.updated = [];
  H.deleted = [];
  H.requireOwner.mockClear();
});

describe("createAdminUser", () => {
  it("kullanicilar.* ve geçersiz izinler süzülür; manage view'ı elle içermeli", async () => {
    const r = await createAdminUser({ name: "Ali", email: "ali@x.com", username: "", password: "12345678", role: "admin", permissions: ["sporcular.manage", "sporcular.view", "kullanicilar.manage", "olmayan.view"] });
    expect(r).toEqual({ ok: true });
    const perms = H.created[0].permissions as string[];
    expect(perms).toEqual(expect.arrayContaining(["sporcular.manage", "sporcular.view"]));
    expect(perms).not.toContain("kullanicilar.manage");
    expect(perms).not.toContain("olmayan.view");
  });

  it("e-posta VEYA kullanıcı adı gerekli", async () => {
    const r = await createAdminUser({ name: "Ali", email: "", username: "", password: "12345678", role: "admin", permissions: [] });
    expect(r).toEqual({ ok: false, error: expect.stringContaining("gerekli") });
    expect(H.created).toHaveLength(0);
  });

  it("owner rolünde izinler yok sayılır (boş kaydedilir)", async () => {
    const r = await createAdminUser({ name: "Sahip2", email: "s2@x.com", username: "", password: "12345678", role: "owner", permissions: ["sporcular.manage"] });
    expect(r).toEqual({ ok: true });
    expect(H.created[0].permissions).toEqual([]);
    expect(H.created[0].role).toBe("owner");
  });
});

describe("deleteAdminUser — güvenlik", () => {
  it("kendini silemez", async () => {
    const r = await deleteAdminUser("owner1");
    expect(r).toEqual({ ok: false, error: expect.stringContaining("Kendinizi") });
    expect(H.deleted).toHaveLength(0);
  });

  it("son sahip silinemez (ownerCount<=1)", async () => {
    H.target = { id: "owner2", name: "Sahip2", role: "owner", permissions: [] };
    H.ownerCount = 1;
    const r = await deleteAdminUser("owner2");
    expect(r).toEqual({ ok: false, error: expect.stringContaining("Son sahip") });
    expect(H.deleted).toHaveLength(0);
  });

  it("birden fazla sahip varsa owner silinebilir", async () => {
    H.target = { id: "owner2", name: "Sahip2", role: "owner", permissions: [] };
    H.ownerCount = 2;
    const r = await deleteAdminUser("owner2");
    expect(r).toEqual({ ok: true });
    expect(H.deleted).toEqual(["owner2"]);
  });
});

describe("updateAdminUser — güvenlik", () => {
  it("son sahip 'Yönetici'ye düşürülemez", async () => {
    H.target = { id: "owner2", name: "Sahip2", role: "owner", permissions: [] };
    H.ownerCount = 1;
    const r = await updateAdminUser("owner2", { name: "Sahip2", role: "admin", permissions: [] });
    expect(r).toEqual({ ok: false, error: expect.stringContaining("Son sah") });
    expect(H.updated).toHaveLength(0);
  });

  it("kendi sahip yetkini kaldıramazsın", async () => {
    H.target = { id: "owner1", name: "Sahip", role: "owner", permissions: [] };
    H.ownerCount = 3;
    const r = await updateAdminUser("owner1", { name: "Sahip", role: "admin", permissions: [] });
    expect(r).toEqual({ ok: false, error: expect.stringContaining("Kendi") });
    expect(H.updated).toHaveLength(0);
  });
});
