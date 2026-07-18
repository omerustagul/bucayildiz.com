// @vitest-environment node
// KVKK otomatik imha — KALICI SİLME yapar, bu yüzden SEÇİM kuralları (özellikle
// MUAFİYETLER) sorgu düzeyinde sabitlenir. Bir muafiyetin sessizce kaybolması
// (ör. dönüştürülmüş başvurunun silinmesi) geri alınamaz veri kaybı demektir.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  appFind: vi.fn(), nlFind: vi.fn(), conFind: vi.fn(), payFind: vi.fn(),
  appDel: vi.fn(), nlDel: vi.fn(), conDel: vi.fn(), payDel: vi.fn(),
  audit: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    application: { findMany: H.appFind },
    newsletterSubscriber: { findMany: H.nlFind },
    consentRecord: { findMany: H.conFind },
    payment: { findMany: H.payFind },
    adminAuditLog: { create: H.audit },
    $transaction: async (fn: (tx: unknown) => Promise<unknown>) =>
      fn({
        application: { deleteMany: H.appDel },
        newsletterSubscriber: { deleteMany: H.nlDel },
        consentRecord: { deleteMany: H.conDel },
        payment: { deleteMany: H.payDel },
      }),
  },
}));

import { collectExpired, applyRetention, RETENTION, monthsAgo, yearsAgo, maskName, maskEmail } from "@/lib/retention";

const NOW = new Date("2026-07-18T00:00:00.000Z");

beforeEach(() => {
  for (const f of Object.values(H)) f.mockReset();
  H.appFind.mockResolvedValue([]); H.nlFind.mockResolvedValue([]);
  H.conFind.mockResolvedValue([]); H.payFind.mockResolvedValue([]);
  H.appDel.mockResolvedValue({ count: 0 }); H.nlDel.mockResolvedValue({ count: 0 });
  H.conDel.mockResolvedValue({ count: 0 }); H.payDel.mockResolvedValue({ count: 0 });
  H.audit.mockResolvedValue({});
});

describe("collectExpired — MUAFİYETLER (veri kaybı koruması)", () => {
  it("başvuru: sporcuya DÖNÜŞTÜRÜLMÜŞ olanlar MUAF (athlete: is null şartı)", async () => {
    await collectExpired(NOW);
    const where = H.appFind.mock.calls[0][0].where;
    expect(where.athlete).toEqual({ is: null }); // dönüştürülmüşü ASLA seçme
    expect(where.createdAt.lt).toEqual(monthsAgo(NOW, RETENTION.applicationMonths));
  });

  it("rıza: sporcuya VEYA başvuruya bağlı olanlar MUAF (yalnız TAM YETİM)", async () => {
    await collectExpired(NOW);
    const where = H.conFind.mock.calls[0][0].where;
    expect(where.athleteId).toBeNull();
    expect(where.applicationId).toBeNull(); // İKİSİ de null olmalı
    expect(where.createdAt.lt).toEqual(yearsAgo(NOW, RETENTION.orphanConsentYears));
  });

  it("bülten: yalnız İPTAL EDİLMİŞ aboneler (aktif/pending MUAF)", async () => {
    await collectExpired(NOW);
    const where = H.nlFind.mock.calls[0][0].where;
    expect(where.status).toBe("unsubscribed");
    expect(where.unsubscribedAt.lt).toEqual(yearsAgo(NOW, RETENTION.newsletterYears));
  });

  it("ödeme: yasal saklama süresi dolmuş olanlar (yaşa göre)", async () => {
    await collectExpired(NOW);
    expect(H.payFind.mock.calls[0][0].where.createdAt.lt).toEqual(yearsAgo(NOW, RETENTION.paymentYears));
  });

  it("hiçbir toplama sorgusu SİLME yapmaz (kuru çalışma)", async () => {
    await collectExpired(NOW);
    expect(H.appDel).not.toHaveBeenCalled();
    expect(H.nlDel).not.toHaveBeenCalled();
    expect(H.conDel).not.toHaveBeenCalled();
    expect(H.payDel).not.toHaveBeenCalled();
  });
});

describe("tarih yardımcıları (sınır hesabı)", () => {
  it("monthsAgo/yearsAgo doğru geriye gider", () => {
    expect(monthsAgo(new Date("2026-07-18"), 12).toISOString().slice(0, 10)).toBe("2025-07-18");
    expect(yearsAgo(new Date("2026-07-18"), 10).toISOString().slice(0, 10)).toBe("2016-07-18");
    expect(yearsAgo(new Date("2026-07-18"), 3).toISOString().slice(0, 10)).toBe("2023-07-18");
  });
});

describe("PII maskeleme (log'da veri minimizasyonu)", () => {
  it("ad ve e-posta maskelenir", () => {
    expect(maskName("Ali Veli")).toBe("A*** V***");
    expect(maskName(null)).toBe("—");
    expect(maskEmail("veli@ornek.com")).toBe("v***@ornek.com");
    expect(maskEmail(null)).toBe("—");
  });
});

describe("applyRetention — yalnız plandakini siler + denetim izi", () => {
  const plan = {
    applications: [{ id: "a1", label: "A***", date: NOW }],
    newsletter: [],
    orphanConsents: [{ id: "c1", label: "acik-riza", date: NOW }],
    payments: [],
  };

  it("YALNIZ plandaki kimlikleri siler (sürpriz silme yok)", async () => {
    H.appDel.mockResolvedValue({ count: 1 });
    H.conDel.mockResolvedValue({ count: 1 });
    await applyRetention(plan);
    expect(H.appDel).toHaveBeenCalledWith({ where: { id: { in: ["a1"] } } });
    expect(H.conDel).toHaveBeenCalledWith({ where: { id: { in: ["c1"] } } });
    // boş kategorilerde silme çağrısı HİÇ yapılmaz
    expect(H.nlDel).not.toHaveBeenCalled();
    expect(H.payDel).not.toHaveBeenCalled();
  });

  it("imha DENETİM İZİ yazar (system aktörü + sayılar)", async () => {
    H.appDel.mockResolvedValue({ count: 1 });
    H.conDel.mockResolvedValue({ count: 1 });
    await applyRetention(plan);
    const d = H.audit.mock.calls[0][0].data;
    expect(d.action).toBe("retention.purge");
    expect(d.actorId).toBe("system");
    expect(d.detail).toMatch(/başvuru 1/);
    expect(d.detail).toMatch(/yetim rıza 1/);
  });

  it("silinecek bir şey yoksa denetim izi YAZMAZ (log gürültüsü olmaz)", async () => {
    await applyRetention({ applications: [], newsletter: [], orphanConsents: [], payments: [] });
    expect(H.audit).not.toHaveBeenCalled();
  });
});
