// @vitest-environment node
import { describe, expect, it } from "vitest";
import { nutritionPlanSchema, mealLogSchema, assignmentCreateSchema } from "@/lib/validation";

describe("nutritionPlanSchema", () => {
  const base = {
    athleteId: "a1",
    title: "Yaz Programı",
    startDate: "2026-07-10",
    endDate: "",
    notes: "",
  };
  const meal = { name: "Kahvaltı", time: "08:00", content: "Yulaf, yumurta", kcal: 400, protein: 20, carbs: 40, fat: 10 };

  it("1 öğünlü geçerli plan kabul edilir", () => {
    const r = nutritionPlanSchema.safeParse({ ...base, meals: [meal] });
    expect(r.success).toBe(true);
  });

  it("öğünsüz plan reddedilir", () => {
    const r = nutritionPlanSchema.safeParse({ ...base, meals: [] });
    expect(r.success).toBe(false);
  });

  it("geçersiz startDate reddedilir", () => {
    const r = nutritionPlanSchema.safeParse({ ...base, startDate: "07.07.2026", meals: [meal] });
    expect(r.success).toBe(false);
  });
});

describe("mealLogSchema", () => {
  const base = { mealId: "m1", date: "2026-07-07", photoUrl: null, note: "" };

  it("geçerli günlük kaydı kabul edilir", () => {
    const r = mealLogSchema.safeParse({ ...base, kcal: 300, protein: 25, carbs: 30, fat: 8 });
    expect(r.success).toBe(true);
  });

  it("negatif protein reddedilir", () => {
    const r = mealLogSchema.safeParse({ ...base, kcal: 300, protein: -1, carbs: 30, fat: 8 });
    expect(r.success).toBe(false);
  });
});

describe("assignmentCreateSchema", () => {
  const base = { athleteIds: ["a1"], title: "Duyuru", body: "Merhaba" };

  it("doküman türünde dosya yoksa reddedilir", () => {
    const r = assignmentCreateSchema.safeParse({ ...base, kind: "document", fileUrl: null });
    expect(r.success).toBe(false);
  });

  it("mesaj türünde dosya yoksa kabul edilir", () => {
    const r = assignmentCreateSchema.safeParse({ ...base, kind: "message", fileUrl: null });
    expect(r.success).toBe(true);
  });

  it("boş athleteIds reddedilir", () => {
    const r = assignmentCreateSchema.safeParse({ ...base, athleteIds: [], kind: "message" });
    expect(r.success).toBe(false);
  });
});
