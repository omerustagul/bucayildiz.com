// @vitest-environment node
import { describe, expect, it } from "vitest";
import { defaultTemplateData, parseTemplateData } from "@/lib/postTemplates";

describe("defaultTemplateData", () => {
  it("macraporu için boş skor/gol/galeri yapısı döner", () => {
    expect(defaultTemplateData("macraporu")).toEqual({
      opponent: "",
      ourScore: "",
      oppScore: "",
      isHome: true,
      competition: "",
      matchDate: "",
      goals: [],
      gallery: [],
    });
  });

  it("bilinmeyen/standart şablon için boş obje döner", () => {
    expect(defaultTemplateData("standart")).toEqual({});
    expect(defaultTemplateData("sondakika")).toEqual({});
  });
});

describe("parseTemplateData", () => {
  it("geçerli JSON'u varsayılanla birleştirir", () => {
    const raw = JSON.stringify({ opponent: "Karşıyaka", ourScore: "3" });
    const r = parseTemplateData("macraporu", raw);
    expect(r.opponent).toBe("Karşıyaka");
    expect(r.ourScore).toBe("3");
    expect(r.goals).toEqual([]); // varsayılandan gelir
  });

  it("bozuk JSON'a karşı dayanıklıdır — varsayılana düşer", () => {
    const r = parseTemplateData("galeri", "{bozuk-json");
    expect(r).toEqual({ photos: [] });
  });

  it("boş/null girdi varsayılana düşer", () => {
    expect(parseTemplateData("roportaj", null)).toEqual({ portraitUrl: "", quote: "", qa: [] });
    expect(parseTemplateData("duyuru", undefined)).toEqual({ contact: "" });
  });
});
