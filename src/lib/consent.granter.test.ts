// @vitest-environment node
// KVKK denetim izi — "onaylayan kişi" çözümü.
// Panel hesabının adı ÇOCUĞUN adıdır; onu "veli" diye yazmak kaydı yanlış kılıyordu.
// Bu testler kuralı kilitler: bilinmeyen yakınlık İDDİA EDİLMEZ.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({ athleteFind: vi.fn(), consentFind: vi.fn() }));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    athlete: { findUnique: H.athleteFind },
    consentRecord: { findFirst: H.consentFind },
  },
}));

import { resolveAthleteGranter } from "@/lib/consent.server";

beforeEach(() => {
  H.athleteFind.mockReset().mockResolvedValue(null);
  H.consentFind.mockReset().mockResolvedValue(null);
});

describe("resolveAthleteGranter", () => {
  it("1. öncelik: Athlete.parentName (admin'in tuttuğu sorumlu kişi)", async () => {
    H.athleteFind.mockResolvedValue({ parentName: "Ayşe Yılmaz" });
    expect(await resolveAthleteGranter("a1", "Mehmet Yılmaz")).toEqual({ name: "Ayşe Yılmaz", relation: "veli" });
    // parentName varken geçmiş kayda hiç bakılmaz
    expect(H.consentFind).not.toHaveBeenCalled();
  });

  it("parentName'deki baştaki/sondaki boşluk kırpılır", async () => {
    H.athleteFind.mockResolvedValue({ parentName: "  Ayşe Yılmaz  " });
    expect((await resolveAthleteGranter("a1", "X")).name).toBe("Ayşe Yılmaz");
  });

  it("2. öncelik: kişinin DAHA ÖNCE kendi beyan ettiği ad ve yakınlık", async () => {
    H.athleteFind.mockResolvedValue({ parentName: null });
    H.consentFind.mockResolvedValue({ granterName: "Fatma Demir", granterRelation: "anne" });
    expect(await resolveAthleteGranter("a1", "Can Demir")).toEqual({ name: "Fatma Demir", relation: "anne" });
  });

  it("3. öncelik: hiçbir kaynak yoksa hesap adı — ama YAKINLIK İDDİA EDİLMEZ", async () => {
    H.athleteFind.mockResolvedValue({ parentName: null });
    const r = await resolveAthleteGranter("a1", "Can Demir");
    expect(r.name).toBe("Can Demir");
    expect(r.relation).toBe("hesap-sahibi");
    expect(r.relation).not.toBe("veli"); // ASIL HATA buydu
  });

  it("boş/whitespace parentName gerçek kaynak sayılmaz", async () => {
    H.athleteFind.mockResolvedValue({ parentName: "   " });
    H.consentFind.mockResolvedValue({ granterName: "Fatma Demir", granterRelation: "anne" });
    expect((await resolveAthleteGranter("a1", "Can")).name).toBe("Fatma Demir");
  });

  it("sporcu bulunamazsa çökmez", async () => {
    H.athleteFind.mockResolvedValue(null);
    expect(await resolveAthleteGranter("yok", "Hesap")).toEqual({ name: "Hesap", relation: "hesap-sahibi" });
  });
});
