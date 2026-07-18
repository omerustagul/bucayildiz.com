"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";
import { MIN_QUERY } from "@/lib/search";

/**
 * Header arama kutusu (Faz 4.3).
 *
 * NATIVE form GET — `action="/arama"` + `name="q"`. Bilerek router.push kullanılmadı:
 * JS yüklenmeden de çalışır, geri/ileri ve paylaşılabilir URL bedavaya gelir.
 * `required minLength` ile boş/tek harflik sorgu tarayıcıda durdurulur (sunucu
 * tarafı da ayrıca MIN_QUERY uygular — çift kapı).
 */
export function HeaderSearch({
  variant,
  defaultValue = "",
}: {
  /**
   * Varyant RENK BAĞLAMINI belirler, konumu değil — bu ayrım önemli:
   * `drawer` koyu zemin içindir; açık zeminde kullanılırsa kutu GÖRÜNMEZ olur
   * (yarı saydam beyaz üstüne beyaz — sonuç sayfasında bu hata yaşandı).
   *   `menubar` → açık zemin, sabit dar genişlik (masaüstü mega menü çubuğu)
   *   `drawer`  → KOYU zemin, tam genişlik (mobil çekmece)
   *   `page`    → açık zemin, tam genişlik (sayfa gövdesi)
   */
  variant: "menubar" | "drawer" | "page";
  defaultValue?: string;
}) {
  const [focused, setFocused] = useState(false);
  const onDark = variant === "drawer";
  const fullWidth = variant !== "menubar";

  return (
    <form
      action="/arama"
      role="search"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        // Mega menü çubuğunda menü öğelerinden sonra sağa yaslanır.
        marginLeft: variant === "menubar" ? "auto" : undefined,
        alignSelf: "center",
        width: fullWidth ? "100%" : undefined,
        minWidth: 0,
        height: 36,
        padding: "0 12px",
        borderRadius: 999,
        background: onDark ? "rgba(255,255,255,0.08)" : "var(--paper-2, #f4f5f7)",
        border: `1px solid ${focused ? "var(--gold-500)" : onDark ? "rgba(255,255,255,0.14)" : "var(--ink-200)"}`,
        transition: "border-color .16s ease",
      }}
    >
      {/* İkon dekoratif değil, GERÇEK submit butonu: büyüteci tıklamak/dokunmak
          arayanın ilk refleksi. Ayrıca tek alanlı formlarda "implicit submission"
          (Enter) davranışına tek başına yaslanmamış oluyoruz. Enter da çalışır —
          ikisi de Chromium'da masaüstü + 375px doğrulandı. */}
      <button
        type="submit"
        aria-label="Ara"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          padding: 0,
          border: "none",
          background: "transparent",
          color: onDark ? "var(--navy-200)" : "var(--ink-500)",
          cursor: "pointer",
        }}
      >
        <Icon name="search" size={16} />
      </button>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        required
        minLength={MIN_QUERY}
        placeholder="Sitede ara"
        aria-label="Sitede ara"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          border: "none",
          outline: "none",
          background: "transparent",
          fontFamily: "var(--font-body)",
          fontSize: 14,
          color: onDark ? "#fff" : "var(--ink-900)",
          // min-width:0 → flex öğesi 320px'te taşmaz (CLAUDE.md taşma kuralı).
          minWidth: 0,
          width: fullWidth ? "100%" : 150,
        }}
      />
    </form>
  );
}
