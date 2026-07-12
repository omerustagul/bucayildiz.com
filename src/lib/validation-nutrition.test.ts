// @vitest-environment node
// Beslenme bug (izole): Zod mesajları TÜRKÇE — eskiden uzun içerik/not, ondalık
// veya büyük makro girince İngilizce ("Too big", "expected int") dönüyordu.
import { describe, it, expect } from "vitest";
import { nutritionPlanSchema, mealLogSchema } from "@/lib/validation";

const baseMeal = (over: Record<string, unknown> = {}) => ({
  name: "Kahvaltı", time: "08:00", content: "yumurta",
  kcal: null, protein: null, carbs: null, fat: null, ...over,
});
const basePlan = (mealOver: Record<string, unknown> = {}, planOver: Record<string, unknown> = {}) => ({
  athleteId: "a1", title: "Program", startDate: "2026-07-12", endDate: "", notes: "",
  meals: [baseMeal(mealOver)], ...planOver,
});

// İngilizce Zod sızıntısı OLMAMALI + mesaj boş olmamalı.
const assertTurkish = (msg: string) => {
  expect(msg).not.toMatch(/Too big|Too small|expected|Invalid input|character\(s\)|Required/i);
  expect(msg.trim().length).toBeGreaterThan(0);
};

describe("beslenme Zod mesajları TÜRKÇE (İngilizce sızıntı regresyonu)", () => {
  it("ondalık makro (2000.5) → Türkçe (tam sayı)", () => {
    const r = nutritionPlanSchema.safeParse(basePlan({ kcal: 2000.5 }));
    expect(r.success).toBe(false);
    if (!r.success) { assertTurkish(r.error.issues[0].message); expect(r.error.issues[0].message).toMatch(/ondalık|tam sayı/i); }
  });

  it("çok büyük makro (>10000) → Türkçe (en fazla 10000)", () => {
    const r = nutritionPlanSchema.safeParse(basePlan({ kcal: 15000 }));
    expect(r.success).toBe(false);
    if (!r.success) { assertTurkish(r.error.issues[0].message); expect(r.error.issues[0].message).toMatch(/10000|en fazla/i); }
  });

  it("uzun içerik (>500) → Türkçe", () => {
    const r = nutritionPlanSchema.safeParse(basePlan({ content: "x".repeat(600) }));
    expect(r.success).toBe(false);
    if (!r.success) { assertTurkish(r.error.issues[0].message); expect(r.error.issues[0].message).toMatch(/karakter/i); }
  });

  it("uzun not (>500) → Türkçe", () => {
    const r = nutritionPlanSchema.safeParse(basePlan({}, { notes: "y".repeat(600) }));
    expect(r.success).toBe(false);
    if (!r.success) assertTurkish(r.error.issues[0].message);
  });

  it("uzun öğün adı (>60) → Türkçe", () => {
    const r = nutritionPlanSchema.safeParse(basePlan({ name: "z".repeat(80) }));
    expect(r.success).toBe(false);
    if (!r.success) assertTurkish(r.error.issues[0].message);
  });

  it("mealLog: her makro/uzunluk hatası Türkçe", () => {
    const r = mealLogSchema.safeParse({ mealId: "m1", date: "2026-07-12", note: "n".repeat(500), kcal: 20000, protein: 1.5 });
    expect(r.success).toBe(false);
    if (!r.success) r.error.issues.forEach((i) => assertTurkish(i.message));
  });
});
