// @vitest-environment node
// KVKK imha mantığı (deleteAthlete): geri dönüşsüz olduğu için sabit tutulur —
// ödeme adı SNAPSHOT'lanır (mali kayıt saklanır), giriş hesabı SİLİNİR, foto silinir,
// silme DENETİM İZİ yazılır. Şema referential action'ları (SetNull/Cascade) ayrı
// DB testinde doğrulanır; burada FONKSİYON davranışı mock'la sabitlenir.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  findUnique: vi.fn(),
  paymentUpdateMany: vi.fn(),
  userDelete: vi.fn(),
  athleteDelete: vi.fn(),
  auditCreate: vi.fn(),
  deleteUpload: vi.fn(),
  revalidate: vi.fn(),
  txSpy: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    athlete: { findUnique: H.findUnique },
    adminAuditLog: { create: H.auditCreate },
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) => {
      H.txSpy();
      return fn({
        payment: { updateMany: H.paymentUpdateMany },
        user: { delete: H.userDelete },
        athlete: { delete: H.athleteDelete },
      });
    },
  },
}));
vi.mock("@/lib/auth", () => ({
  requirePermission: vi.fn(async () => ({ sub: "admin1", name: "Yönetici" })),
  hashPassword: vi.fn(),
}));
vi.mock("@/lib/net", () => ({ clientIp: vi.fn(() => "1.2.3.4") }));
vi.mock("@/lib/storage", () => ({ deleteUpload: H.deleteUpload }));
vi.mock("next/headers", () => ({ headers: vi.fn(async () => new Map()) }));
vi.mock("next/cache", () => ({ revalidatePath: H.revalidate }));

import { deleteAthlete } from "./actions";

beforeEach(() => {
  Object.values(H).forEach((f) => "mockReset" in f && f.mockReset());
  H.paymentUpdateMany.mockResolvedValue({ count: 0 });
  H.userDelete.mockResolvedValue({});
  H.athleteDelete.mockResolvedValue({});
  H.auditCreate.mockResolvedValue({});
  H.deleteUpload.mockResolvedValue(undefined);
});

describe("deleteAthlete (KVKK imha mekaniği)", () => {
  it("sporcu YOKSA hiçbir şey yapmaz (no-op)", async () => {
    H.findUnique.mockResolvedValue(null);
    await deleteAthlete("yok");
    expect(H.txSpy).not.toHaveBeenCalled();
    expect(H.auditCreate).not.toHaveBeenCalled();
    expect(H.deleteUpload).not.toHaveBeenCalled();
  });

  it("ödeme adını SNAPSHOT'lar (mali kayıt atıflı kalır) — silmeden önce", async () => {
    H.findUnique.mockResolvedValue({ id: "a1", name: "Ali Veli", photoUrl: null, user: null });
    await deleteAthlete("a1");
    expect(H.paymentUpdateMany).toHaveBeenCalledWith({ where: { athleteId: "a1" }, data: { payerName: "Ali Veli" } });
  });

  it("giriş hesabını (User) SİLER — varsa", async () => {
    H.findUnique.mockResolvedValue({ id: "a1", name: "Ali", photoUrl: null, user: { id: "u1" } });
    await deleteAthlete("a1");
    expect(H.userDelete).toHaveBeenCalledWith({ where: { id: "u1" } });
    expect(H.athleteDelete).toHaveBeenCalledWith({ where: { id: "a1" } });
  });

  it("User yoksa User.delete ÇAĞRILMAZ (yine de sporcu silinir)", async () => {
    H.findUnique.mockResolvedValue({ id: "a1", name: "Ali", photoUrl: null, user: null });
    await deleteAthlete("a1");
    expect(H.userDelete).not.toHaveBeenCalled();
    expect(H.athleteDelete).toHaveBeenCalledWith({ where: { id: "a1" } });
  });

  it("foto varsa depodan SİLER (deleteUpload)", async () => {
    H.findUnique.mockResolvedValue({ id: "a1", name: "Ali", photoUrl: "/uploads/x.webp", user: null });
    await deleteAthlete("a1");
    expect(H.deleteUpload).toHaveBeenCalledWith("/uploads/x.webp");
  });

  it("silme DENETİM İZİ yazar (actor + hedef + aksiyon)", async () => {
    H.findUnique.mockResolvedValue({ id: "a1", name: "Ali Veli", photoUrl: null, user: null });
    await deleteAthlete("a1");
    const arg = H.auditCreate.mock.calls[0][0];
    expect(arg.data.action).toBe("athlete.delete");
    expect(arg.data.actorId).toBe("admin1");
    expect(arg.data.targetId).toBe("a1");
    expect(arg.data.targetName).toBe("Ali Veli");
    expect(arg.data.ipAddress).toBe("1.2.3.4");
  });
});
