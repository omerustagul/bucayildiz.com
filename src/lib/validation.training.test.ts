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
