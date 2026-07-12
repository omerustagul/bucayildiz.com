// @vitest-environment node
// Admin kariyer: ilan CRUD + başvuru durum — hepsi requireAdmin + Zod kapılı.
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const H = vi.hoisted(() => ({
  created: null as Record<string, unknown> | null,
  updatedApp: null as Record<string, unknown> | null,
  requireAdmin: vi.fn(async () => ({ role: "admin", sub: "u1", name: "A", email: "" })),
}));

vi.mock("@/lib/auth", () => ({ requireAdmin: H.requireAdmin }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    jobPosting: {
      create: async ({ data }: { data: Record<string, unknown> }) => { H.created = data; return {}; },
      update: async () => ({}),
      delete: async () => ({}),
    },
    jobApplication: {
      update: async ({ data }: { data: Record<string, unknown> }) => { H.updatedApp = data; return {}; },
      delete: async () => ({}),
    },
  },
}));

import { createJobPosting, updateJobApplicationStatus, deleteJobPosting } from "./actions";

beforeEach(() => { H.created = null; H.updatedApp = null; H.requireAdmin.mockClear(); });

describe("kariyer admin actions — requireAdmin + Zod", () => {
  it("createJobPosting requireAdmin çağırır + geçerli veriyi yazar", async () => {
    const res = await createJobPosting({ title: "Altyapı Antrenörü", employment: "full-time" });
    expect(res).toBeUndefined();
    expect(H.requireAdmin).toHaveBeenCalled();
    expect(H.created).toMatchObject({ title: "Altyapı Antrenörü", employment: "full-time" });
  });

  it("createJobPosting geçersiz veri (başlık yok) REDDEDİLİR, yazılmaz", async () => {
    const res = await createJobPosting({ title: "" });
    expect(res).toMatchObject({ error: expect.any(String) });
    expect(H.created).toBeNull();
  });

  it("updateJobApplicationStatus geçersiz durum REDDEDİLİR (enum dışı)", async () => {
    const res = await updateJobApplicationStatus("a1", "hacked");
    expect(res).toMatchObject({ error: "Geçersiz durum." });
    expect(H.updatedApp).toBeNull();
  });

  it("updateJobApplicationStatus geçerli durum → requireAdmin + yazar", async () => {
    const res = await updateJobApplicationStatus("a1", "reviewing");
    expect(res).toBeUndefined();
    expect(H.requireAdmin).toHaveBeenCalled();
    expect(H.updatedApp).toMatchObject({ status: "reviewing" });
  });

  it("deleteJobPosting requireAdmin çağırır (yetki kapısı)", async () => {
    await deleteJobPosting("p1");
    expect(H.requireAdmin).toHaveBeenCalled();
  });
});
