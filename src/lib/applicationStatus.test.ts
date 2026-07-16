// @vitest-environment node
// Durum kataloğu tek kaynak: sistem-yazımlı durumlar elle SET edilemez ama
// MEVCUT durum olduklarında görünmelidirler (aksi halde select ilk seçeneğe düşer
// ve yönetici yanlış durum görür — bu hata tarayıcı doğrulamasında yakalandı).
import { describe, it, expect } from "vitest";
import { APPLICATION_STATUSES, MANUAL_APPLICATION_STATUSES, applicationStatusMeta } from "@/lib/applicationStatus";

/** ApplicationStatusSelect'in seçenek kuralı — bileşenle AYNI mantık. */
const optionsFor = (status: string) => APPLICATION_STATUSES.filter((s) => !s.system || s.value === status).map((s) => s.value);

describe("applicationStatus kataloğu", () => {
  it("'registered' sistem-yazımlıdır (elle seçilemez)", () => {
    const reg = APPLICATION_STATUSES.find((s) => s.value === "registered");
    expect(reg?.system).toBe(true);
    expect(MANUAL_APPLICATION_STATUSES.map((s) => s.value)).not.toContain("registered");
  });

  it("elle seçilebilir liste diğer tüm durumları içerir", () => {
    expect(MANUAL_APPLICATION_STATUSES.map((s) => s.value)).toEqual(["new", "contacted", "scheduled", "closed"]);
  });

  it("'registered' etiket/renk döndürür (görüntüleme + filtre sekmesi çalışsın)", () => {
    const meta = applicationStatusMeta("registered");
    expect(meta.label).toBe("Kayıtlandı");
    expect(meta.tint).not.toBe("transparent"); // bilinmeyen-durum fallback'ine düşmemeli
  });

  it("select seçenekleri: normal durumda 'registered' YOK", () => {
    expect(optionsFor("new")).not.toContain("registered");
  });

  it("select seçenekleri: başvuru ZATEN 'registered' ise seçenek olarak VAR (yoksa yanlış durum gösterilir)", () => {
    const opts = optionsFor("registered");
    expect(opts).toContain("registered");
    // çıkış serbest: diğer durumlar da seçilebilir
    expect(opts).toContain("closed");
  });
});
