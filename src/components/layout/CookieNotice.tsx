"use client";
/* eslint-disable react-hooks/set-state-in-effect -- mount sonrası istemci-only tespit
   (localStorage SSR'de yok); banner'ı ancak client'ta okuyup gösterebiliriz — meşru
   effect senkronizasyonu (hydration uyumu için ilk render'da GİZLİ). */

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon } from "@/lib/icons";

/**
 * KVKK çerez bilgilendirmesi (Faz 2.1). Site YALNIZCA zorunlu teknik oturum çerezleri
 * kullanır (by_admin_session / by_panel_session); analitik/pazarlama/tracker YOKTUR.
 * Bu yüzden bu bir "kabul/ret" ONAY kapısı DEĞİL — zorunlu çerezde KVKK ön-onay
 * gerektirmez; yalnızca ŞEFFAF BİLGİLENDİRME yeter. Kullanıcı okuyup kapatır; tercih
 * localStorage'da saklanır (sunucuya çerez yazmayız — bilgilendirmenin kendisi çerez
 * eklememeli). Analitik/pazarlama çerezi eklenirse burası gerçek onay kapısına
 * yükseltilmeli (accept/reject + kategori). localStorage anahtarı sürümlü: politika
 * maddi değişirse v2'ye çıkarıp yeniden gösterilebilir.
 */
const STORAGE_KEY = "by-cookie-notice-v1";

export function CookieNotice() {
  // SSR/hydration güvenli: sunucuda ve ilk render'da GİZLİ; mount'ta localStorage
  // okunup gösterilir (server/client HTML uyuşmazlığı olmaz).
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) !== "1") setShow(true);
    } catch {
      // localStorage engelliyse (gizli mod/izin) banner'ı yine de göster.
      setShow(true);
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* yut — kapatma yine de çalışsın */
    }
    setShow(false);
  };

  if (!show) return null;

  return (
    <div
      role="region"
      aria-label="Çerez bilgilendirmesi"
      style={{
        position: "fixed",
        left: "max(16px, env(safe-area-inset-left))",
        right: "max(16px, env(safe-area-inset-right))",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        zIndex: 1000,
        margin: "0 auto",
        maxWidth: 560,
        background: "var(--navy-900)",
        color: "#fff",
        border: "1px solid var(--navy-700)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-xl)",
        padding: "16px 18px",
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
      }}
    >
      <span style={{ flex: "none", display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: 10, background: "rgba(201,162,39,0.16)", color: "var(--gold-400)" }}>
        <Icon name="cookie" size={18} />
      </span>
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,0.82)" }}>
          Bu site, oturumunuzun güvenli şekilde açık kalması için yalnızca <strong style={{ color: "#fff" }}>zorunlu teknik çerezler</strong> kullanır.
          Analitik, reklam veya takip çerezi <strong style={{ color: "#fff" }}>kullanmıyoruz</strong>. Ayrıntı için{" "}
          <Link href="/cerez-politikasi" className="footer-link" style={{ color: "var(--gold-400)", textDecoration: "underline" }}>
            Çerez Politikası
          </Link>
          .
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={dismiss}
            style={{
              padding: "9px 20px",
              borderRadius: "var(--radius-pill)",
              border: "none",
              background: "var(--grad-gold)",
              color: "var(--navy-900)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 13.5,
              cursor: "pointer",
            }}
          >
            Anladım
          </button>
        </div>
      </div>
    </div>
  );
}
