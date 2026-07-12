// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { uploadFiles } from "@/lib/mediaUpload";

const f = (name: string) => ({ name } as unknown as File);

describe("uploadFiles (çoklu yükleme + kısmi başarı)", () => {
  it("çok dosya kabul edilir — HER dosya ayrı yüklenir (sadece ilki değil)", async () => {
    const up = vi.fn(async (file: File) => ({ ok: true as const, url: "/uploads/" + file.name }));
    const create = vi.fn(async () => ({ ok: true as const }));
    const r = await uploadFiles([f("a.jpg"), f("b.png"), f("c.webp")], up, create);
    expect(r.okCount).toBe(3);
    expect(r.failed).toEqual([]);
    expect(up).toHaveBeenCalledTimes(3); // her dosya ayrı doğrulamadan geçti
    expect(create).toHaveBeenCalledTimes(3);
  });

  it("araya geçersiz dosya sıkışırsa O reddedilir, diğerleri yüklenir (kısmi başarı + net sebep)", async () => {
    const up = vi.fn(async (file: File) =>
      file.name === "kotu.txt"
        ? { ok: false as const, reason: "Geçersiz veya bozuk görsel dosyası." }
        : { ok: true as const, url: "/uploads/" + file.name },
    );
    const create = vi.fn(async () => ({ ok: true as const }));
    const r = await uploadFiles([f("a.jpg"), f("kotu.txt"), f("b.png")], up, create);
    expect(r.okCount).toBe(2);
    expect(r.failed).toEqual([{ name: "kotu.txt", reason: "Geçersiz veya bozuk görsel dosyası." }]);
    expect(up).toHaveBeenCalledTimes(3); // geçersiz olan da ayrı doğrulamaya gönderildi
    expect(create).toHaveBeenCalledTimes(2); // yalnız geçerliler kaydedildi
  });

  it("5MB aşan dosya (sunucu reddi) diğerlerini engellemez", async () => {
    const up = vi.fn(async (file: File) =>
      file.name === "buyuk.png"
        ? { ok: false as const, reason: "Dosya boyutu 5 MB'ı aşamaz." }
        : { ok: true as const, url: "/uploads/" + file.name },
    );
    const create = vi.fn(async () => ({ ok: true as const }));
    const r = await uploadFiles([f("buyuk.png"), f("ok.jpg")], up, create);
    expect(r.okCount).toBe(1);
    expect(r.failed).toEqual([{ name: "buyuk.png", reason: "Dosya boyutu 5 MB'ı aşamaz." }]);
  });

  it("kayıt (createMediaAsset) başarısızsa o dosya reddedilir", async () => {
    const up = vi.fn(async () => ({ ok: true as const, url: "/uploads/x" }));
    const create = vi.fn(async () => ({ ok: false as const, reason: "Kaydedilemedi." }));
    const r = await uploadFiles([f("a.jpg")], up, create);
    expect(r.okCount).toBe(0);
    expect(r.failed).toEqual([{ name: "a.jpg", reason: "Kaydedilemedi." }]);
  });
});
