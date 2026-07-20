"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { MIN_QUERY, type SearchHit } from "@/lib/search";

/**
 * Masaüstü header araması (kompakt). Daralmış hâlde KARE ikon; tıklanınca
 * animasyonla input'a GENİŞLER ve yazdıkça altta ANLIK öneri gösterir.
 *
 * - Köşeler hafif yuvarlak (radius-md) — hap değil, proje dili.
 * - Öneri: /api/arama (debounce 220ms, min 2 harf) — searchSite kuralları
 *   (yalnız yayımlanmış içerik; KVKK: sporcular kapsam dışı).
 * - Klavye: ↑/↓ gez, Enter seç/git, Esc daralt. Dışarı tıklama daraltır.
 * - Enter (öneri seçili değilse) → /arama tam sonuç sayfası.
 *
 * Mobil çekmece + /arama sayfası ayrı (HeaderSearch) — orada daraltma gereksiz.
 */
export function SmartSearch() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const collapse = useCallback(() => {
    setExpanded(false);
    setHits([]);
    setActive(-1);
  }, []);

  // Dışarı tıklama → daralt
  useEffect(() => {
    if (!expanded) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) collapse();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [expanded, collapse]);

  // Debounce'lı anlık öneri. TÜM setState debounce callback'inde (async) — effect
  // gövdesinde senkron setState "cascading render" lint hatası verir; loading ise
  // anında geri bildirim için onChange'de (event handler) set edilir.
  useEffect(() => {
    const query = q.trim();
    const ac = new AbortController();
    const t = setTimeout(async () => {
      if (query.length < MIN_QUERY) {
        setHits([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/arama?q=${encodeURIComponent(query)}`, { signal: ac.signal });
        const data = await res.json();
        setHits(Array.isArray(data.hits) ? data.hits : []);
      } catch {
        /* iptal/ağ hatası → öneri gösterme, sessiz */
      } finally {
        setLoading(false);
      }
    }, 220);
    return () => {
      clearTimeout(t);
      ac.abort();
    };
  }, [q]);

  const open = () => setExpanded(true);
  // input yalnız expanded iken render edilir → mount SONRASI odaklan (effect,
  // rAF yarışına düşmez).
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);
  const go = (href: string) => {
    collapse();
    router.push(href);
  };
  const submit = () => {
    const query = q.trim();
    if (active >= 0 && hits[active]) return go(hits[active].href);
    if (query.length >= MIN_QUERY) go(`/arama?q=${encodeURIComponent(query)}`);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      collapse();
      inputRef.current?.blur();
    }
  };

  const showDropdown = expanded && q.trim().length >= MIN_QUERY;

  return (
    <div ref={rootRef} style={{ position: "relative", marginLeft: "auto", alignSelf: "center" }}>
      {/* Alan: daralmış 38px KARE (ikon tam ortada) → genişlemiş input. Daralmışken
          input HİÇ render edilmez (sadece ikon → justify:center ile ortalanır).
          input type="text" (search DEĞİL → native × yok, çift × olmaz); global gold
          odak halkası (base.css :focus-visible) inline boxShadow:none ile ezilir
          (konteyner border'ı odak göstergesi) — iç içe sarı kenar olmaz. */}
      <div
        onClick={() => !expanded && open()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: expanded ? 8 : 0,
          height: 38,
          width: expanded ? 280 : 38,
          padding: expanded ? "0 8px 0 12px" : 0,
          justifyContent: "center",
          borderRadius: "var(--radius-md)",
          background: expanded ? "var(--surface-card, #fff)" : "var(--paper-2, #f4f5f7)",
          border: `1px solid ${expanded ? "var(--gold-500)" : "var(--ink-200)"}`,
          overflow: "hidden",
          cursor: expanded ? "text" : "pointer",
          transition: "width 0.3s var(--ease-out), gap 0.2s ease, border-color 0.16s ease, background 0.16s ease",
          boxShadow: showDropdown ? "var(--shadow-sm)" : "none",
        }}
      >
        <button
          type="button"
          aria-label="Ara"
          onClick={(e) => {
            e.stopPropagation();
            if (expanded) submit();
            else open();
          }}
          style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", flex: "none", padding: 0, border: "none", background: "transparent", color: "var(--ink-500)", cursor: "pointer" }}
        >
          <Icon name="search" size={18} />
        </button>
        {expanded && (
          <>
            <input
              ref={inputRef}
              type="text"
              inputMode="search"
              value={q}
              onChange={(e) => {
                const v = e.target.value;
                setQ(v);
                setActive(-1);
                if (v.trim().length >= MIN_QUERY) setLoading(true); // anlık "Aranıyor…"
              }}
              onKeyDown={onKey}
              placeholder="Sitede ara"
              aria-label="Sitede ara"
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                boxShadow: "none", // global gold odak halkasını ez
                WebkitAppearance: "none",
                appearance: "none",
                background: "transparent",
                fontFamily: "var(--font-body)",
                fontSize: 14,
                color: "var(--ink-900)",
              }}
            />
            {q && (
              <button
                type="button"
                aria-label="Temizle"
                onClick={(e) => {
                  e.stopPropagation();
                  setQ("");
                  setActive(-1);
                  inputRef.current?.focus();
                }}
                style={{ display: "inline-flex", flex: "none", padding: 2, border: "none", background: "transparent", color: "var(--ink-400)", cursor: "pointer" }}
              >
                <Icon name="x" size={15} />
              </button>
            )}
          </>
        )}
      </div>

      {showDropdown && (
        <div
          role="listbox"
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            right: 0,
            width: 360,
            maxWidth: "80vw",
            background: "#fff",
            border: "1px solid var(--ink-200)",
            borderRadius: "var(--radius-md)",
            boxShadow: "var(--shadow-lg)",
            overflow: "hidden",
            zIndex: 70,
          }}
        >
          {loading && hits.length === 0 ? (
            <div style={{ padding: "14px 14px", fontSize: 13, color: "var(--ink-500)" }}>Aranıyor…</div>
          ) : hits.length === 0 ? (
            <div style={{ padding: "14px 14px", fontSize: 13, color: "var(--ink-500)" }}>
              “{q.trim()}” için öneri yok — <span style={{ color: "var(--text-link)" }}>tümünü ara</span>.
            </div>
          ) : (
            hits.map((h, i) => (
              <button
                key={`${h.kind}-${h.href}-${h.title}`}
                role="option"
                aria-selected={i === active}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault(); // input blur → dropdown kapanmadan tıklama işlensin
                  go(h.href);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  border: "none",
                  borderBottom: "1px solid var(--ink-100)",
                  background: i === active ? "var(--paper-2, #f4f5f7)" : "transparent",
                  cursor: "pointer",
                }}
              >
                <span style={{ flex: "none", fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase", color: "var(--gold-700)", border: "1px solid var(--ink-200)", borderRadius: 4, padding: "2px 6px" }}>
                  {h.label}
                </span>
                <span style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }}>
                  <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink-900)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.title}</span>
                  {h.excerpt && <span style={{ fontSize: 12, color: "var(--ink-500)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{h.excerpt}</span>}
                </span>
              </button>
            ))
          )}
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              go(`/arama?q=${encodeURIComponent(q.trim())}`);
            }}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", padding: "10px 12px", border: "none", background: "var(--paper-2, #f4f5f7)", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "var(--text-link)" }}
          >
            “{q.trim()}” için tüm sonuçlar
            <Icon name="arrow-right" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
