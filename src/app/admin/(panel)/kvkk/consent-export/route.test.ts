// @vitest-environment node
// KVKK CSV export ucu DOĞRUDAN çağrılabilir → kendi yetki kapısını yapmalı.
// İzinsiz erişim = hassas PII (isim/IP/ilişki) sızıntısı; kapı testle sabitlenir.
import { describe, it, expect, vi, beforeEach } from "vitest";

const H = vi.hoisted(() => ({ perms: vi.fn(), athleteFind: vi.fn() }));

vi.mock("@/lib/auth", () => ({ getAdminPermissions: H.perms }));
vi.mock("@/lib/prisma", () => ({ prisma: { athlete: { findUnique: H.athleteFind } } }));

import { GET } from "./route";

const req = (id?: string) =>
  new Request(`http://localhost/admin/kvkk/consent-export${id !== undefined ? `?athleteId=${id}` : ""}`);

beforeEach(() => {
  H.perms.mockReset();
  H.athleteFind.mockReset().mockResolvedValue({
    name: "Ayşe Yılmaz",
    consents: [
      { documentTitle: "Foto", documentVersion: "v1", granted: true, granterName: "Ayşe", granterRelation: "veli", channel: "veli-panel", createdAt: new Date("2026-07-18T10:00:00Z"), withdrawnAt: null, ipAddress: "1.2.3.4", otpVerified: false, textHash: "h" },
    ],
  });
});

describe("KVKK export yetki kapısı", () => {
  it("oturum yoksa 401", async () => {
    H.perms.mockResolvedValue(null);
    const res = await GET(req("a1"));
    expect(res.status).toBe(401);
    expect(H.athleteFind).not.toHaveBeenCalled(); // DB'ye HİÇ gitmeden reddet
  });

  it("kvkk.view izni yoksa 403 (roster yetkisi YETMEZ)", async () => {
    H.perms.mockResolvedValue({ role: "admin", permissions: ["sporcular.view", "sporcular.manage"] });
    const res = await GET(req("a1"));
    expect(res.status).toBe(403);
    expect(H.athleteFind).not.toHaveBeenCalled();
  });

  it("owner geçer (tüm izinler örtük)", async () => {
    H.perms.mockResolvedValue({ role: "owner", permissions: [] });
    const res = await GET(req("a1"));
    expect(res.status).toBe(200);
  });

  it("kvkk.view olan admin geçer", async () => {
    H.perms.mockResolvedValue({ role: "admin", permissions: ["kvkk.view"] });
    const res = await GET(req("a1"));
    expect(res.status).toBe(200);
  });
});

describe("KVKK export davranışı (yetkiliyken)", () => {
  beforeEach(() => H.perms.mockResolvedValue({ role: "owner", permissions: [] }));

  it("athleteId yoksa 400", async () => {
    const res = await GET(req());
    expect(res.status).toBe(400);
  });

  it("sporcu bulunamazsa 404", async () => {
    H.athleteFind.mockResolvedValue(null);
    const res = await GET(req("yok"));
    expect(res.status).toBe(404);
  });

  it("başarıda CSV indirme başlıklarıyla döner", async () => {
    const res = await GET(req("a1"));
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("text/csv");
    const cd = res.headers.get("content-disposition") ?? "";
    expect(cd).toContain("attachment");
    expect(cd).toContain("kvkk-onay-ayse-yilmaz"); // Türkçe ad → slug
    expect(res.headers.get("cache-control")).toContain("no-store"); // PII önbelleğe alınmaz
    // .text() spec gereği baştaki BOM'u KIRPAR; indirilen dosyada BOM asıl önemli
    // olan (Excel Türkçe) → ham byte'larla doğrula: UTF-8 BOM = EF BB BF.
    const bytes = new Uint8Array(await res.arrayBuffer());
    expect([bytes[0], bytes[1], bytes[2]]).toEqual([0xef, 0xbb, 0xbf]);
    const body = new TextDecoder().decode(bytes);
    expect(body).toContain('"Foto"');
    expect(body).toContain('"Verildi"');
  });
});
