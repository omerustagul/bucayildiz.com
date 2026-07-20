import { NextResponse } from "next/server";
import { searchSite } from "@/lib/search";

/**
 * Anlık arama önerisi (header SmartSearch, yazdıkça). searchSite ile AYNI kurallar:
 * yalnız yayımlanmış içerik + sporcular kapsam DIŞI (KVKK). MIN_QUERY altı → [].
 *
 * Salt-okunur, PII yok, mutasyon yok. İstemci 220ms debounce + min 2 harf uygular
 * → yük düşük; öneri kutusu için az sonuç yeter.
 */
export async function GET(req: Request) {
  const q = new URL(req.url).searchParams.get("q") ?? "";
  const hits = (await searchSite(q, 3)).slice(0, 7);
  return NextResponse.json({ hits }, { headers: { "Cache-Control": "no-store" } });
}
