// @vitest-environment node
// Hatırlatma motoru. Bu sistem VELİLERE bildirim gönderir — hatası mükerrer/yanlış
// zamanlı spam demektir. Sabitlenen garantiler: (1) kilit alınamazsa GÖNDERİM YOK
// (cluster'da çift gönderim), (2) gece yarısı gönderim yok, (3) KVKK: gövdede yalnız
// zaman/yer, (4) iptal edilen antrenman hatırlatılmaz.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({
  trainingFind: vi.fn(),
  fixtureFind: vi.fn(),
  athleteCount: vi.fn(),
  logCreate: vi.fn(),
  notifyAthletes: vi.fn(),
  notifyTeam: vi.fn(),
  notifyAll: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    training: { findMany: H.trainingFind },
    fixture: { findMany: H.fixtureFind },
    athlete: { count: H.athleteCount },
    reminderLog: { create: H.logCreate },
  },
}));
vi.mock("@/lib/notify", () => ({
  notifyAthletes: H.notifyAthletes,
  notifyTeam: H.notifyTeam,
  notifyAllAthletes: H.notifyAll,
}));

import { runReminders, addDaysYmd, whenLabel, REMINDER_DAYS } from "@/lib/reminders";

const AT_10 = new Date(2026, 6, 18, 10, 0, 0); // 18 Tem 2026, saat 10 (pencere içi)
const AT_03 = new Date(2026, 6, 18, 3, 0, 0); // saat 03 (pencere dışı)

const training = (over = {}) => ({ id: "t1", teamId: "team1", time: "18:30", pitch: "Kuruçeşme Sahası", scope: "team", attendance: [], ...over });

beforeEach(() => {
  for (const f of Object.values(H)) f.mockReset();
  H.trainingFind.mockResolvedValue([]);
  H.fixtureFind.mockResolvedValue([]);
  H.athleteCount.mockResolvedValue(12);
  H.logCreate.mockResolvedValue({});
  H.notifyAthletes.mockResolvedValue({});
  H.notifyTeam.mockResolvedValue({});
  H.notifyAll.mockResolvedValue({});
});

describe("gönderim penceresi", () => {
  it("gece yarısı ÇALIŞMAZ — sorgu bile atmaz", async () => {
    const r = await runReminders(AT_03);
    expect(r.outOfWindow).toBe(true);
    expect(r.sent).toBe(0);
    expect(H.trainingFind).not.toHaveBeenCalled();
    expect(H.notifyTeam).not.toHaveBeenCalled();
  });

  it("pencere içinde çalışır", async () => {
    const r = await runReminders(AT_10);
    expect(r.outOfWindow).toBe(false);
    expect(H.trainingFind).toHaveBeenCalledTimes(REMINDER_DAYS.length);
  });
});

describe("ÇİFT GÖNDERİM KİLİDİ (claim-then-send)", () => {
  it("kilit ALINAMAZSA bildirim GÖNDERİLMEZ", async () => {
    H.trainingFind.mockResolvedValue([training()]);
    H.logCreate.mockRejectedValue(new Error("unique")); // başka instance almış
    const r = await runReminders(AT_10);
    expect(H.notifyTeam).not.toHaveBeenCalled(); // ← asıl garanti
    expect(r.sent).toBe(0);
    expect(r.alreadySent).toBeGreaterThan(0);
  });

  it("kilit gönderimden ÖNCE alınır (sıra: create → notify)", async () => {
    const order: string[] = [];
    H.trainingFind.mockResolvedValueOnce([training()]).mockResolvedValue([]);
    H.logCreate.mockImplementation(async () => { order.push("claim"); return {}; });
    H.notifyTeam.mockImplementation(async () => { order.push("notify"); return {}; });
    await runReminders(AT_10);
    expect(order).toEqual(["claim", "notify"]);
  });

  it("alıcı YOKSA kilit açılmaz (boş takıma kilit yakılmaz)", async () => {
    H.trainingFind.mockResolvedValue([training()]);
    H.athleteCount.mockResolvedValue(0);
    await runReminders(AT_10);
    expect(H.logCreate).not.toHaveBeenCalled();
    expect(H.notifyTeam).not.toHaveBeenCalled();
  });
});

describe("hedefleme", () => {
  it("takım antrenmanı → notifyTeam", async () => {
    H.trainingFind.mockResolvedValueOnce([training()]).mockResolvedValue([]);
    await runReminders(AT_10);
    expect(H.notifyTeam).toHaveBeenCalledWith("team1", expect.objectContaining({ type: "training" }));
    expect(H.notifyAthletes).not.toHaveBeenCalled();
  });

  it("bireysel antrenman → YALNIZ katılımcı sporculara", async () => {
    H.trainingFind.mockResolvedValueOnce([training({ scope: "individual", attendance: [{ athleteId: "a1" }, { athleteId: "a2" }] })]).mockResolvedValue([]);
    await runReminders(AT_10);
    expect(H.notifyAthletes).toHaveBeenCalledWith(["a1", "a2"], expect.objectContaining({ type: "training" }));
    expect(H.notifyTeam).not.toHaveBeenCalled();
  });

  it("takımsız maç → tüm sporculara", async () => {
    H.fixtureFind.mockResolvedValueOnce([{ id: "f1", teamId: null, time: "14:00", venue: "Saha", opponent: "X SK", isHome: true }]).mockResolvedValue([]);
    await runReminders(AT_10);
    expect(H.notifyAll).toHaveBeenCalledWith(expect.objectContaining({ type: "match" }));
  });

  it("İPTAL edilmiş antrenman sorguya girmez", async () => {
    await runReminders(AT_10);
    expect(H.trainingFind.mock.calls[0][0].where.status).toEqual({ not: "cancelled" });
  });

  it("yalnız OYNANMAMIŞ maçlar", async () => {
    await runReminders(AT_10);
    expect(H.fixtureFind.mock.calls[0][0].where.status).toBe("upcoming");
  });
});

describe("KVKK — bildirim gövdesi", () => {
  it("yalnız zaman ve yer içerir (sağlık/performans YOK)", async () => {
    H.trainingFind.mockResolvedValueOnce([training()]).mockResolvedValue([]);
    await runReminders(AT_10);
    const body = H.notifyTeam.mock.calls[0][1].body as string;
    expect(body).toContain("18:30");
    expect(body).toContain("Kuruçeşme Sahası");
    expect(body).not.toMatch(/boy|kilo|ölçüm|sakat|performans|puan|skor/i);
  });

  it("1 gün kala 'Yarın' der", () => {
    expect(whenLabel(1)).toBe("Yarın");
    expect(whenLabel(3)).toBe("3 gün sonra");
  });
});

describe("addDaysYmd (TZ-güvenli)", () => {
  it("gün ekler, ay/yıl geçişini aşar", () => {
    expect(addDaysYmd(new Date(2026, 6, 18), 1)).toBe("2026-07-19");
    expect(addDaysYmd(new Date(2026, 6, 30), 3)).toBe("2026-08-02");
    expect(addDaysYmd(new Date(2026, 11, 30), 3)).toBe("2027-01-02");
  });
});
