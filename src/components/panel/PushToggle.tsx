"use client";
/* eslint-disable react-hooks/set-state-in-effect -- mount sonrası istemci-only
   tespiti (Notification/serviceWorker/standalone); meşru effect senkronizasyonu. */

import { useEffect, useState } from "react";
import { Icon } from "@/lib/icons";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";

function urlBase64ToUint8Array(base64: string) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(b64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

/**
 * VAPID public anahtarı = base64url kodlu sıkıştırılmamış P-256 noktası (65 bayt →
 * 87 karakter, 0x04 öneki yüzünden HER ZAMAN "B" ile başlar). Placeholder/açıklama
 * metni (ör. Türkçe harf veya parantez içeren) bu kapıdan geçemez. Geçersiz anahtarla
 * `pushManager.subscribe` KESİN fırlatır; kullanıcıya "açılamadı" demek yerine
 * yapılandırma eksikliğini dürüstçe söyleriz.
 */
export function isValidVapidKey(k: string): boolean {
  return /^B[A-Za-z0-9_-]{79,95}$/.test(k);
}

type State = "loading" | "unsupported" | "ios-needs-pwa" | "unconfigured" | "off" | "on" | "denied";

/**
 * Sporcu/veli paneli — bildirim aç/kapat. KVKK: opt-in, tek tıkla iptal.
 * iOS'ta yalnızca "Ana Ekrana Ekle" ile kurulu PWA'da çalışır.
 */
export function PushToggle() {
  const [state, setState] = useState<State>("loading");
  const [busy, setBusy] = useState(false);
  // Hata geri bildirimi: eskiden başarısız açılışta state sessizce "off"a dönüyordu
  // → buton "değişmedi" gibi görünüyordu. Artık her başarısızlıkta neden gösterilir.
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;
    const isIOS = /iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

    // iOS'ta Web Push YALNIZ "Ana Ekrana Ekle" ile kurulu PWA'da çalışır. iOS 16.4+
    // Safari SEKMESİNDE Push API'leri VAR görünür ama subscribe() patlar → butonu hiç
    // gösterme, doğrudan kurulum yönergesi ver. (Eskiden bu kontrol yalnız API'ler YOKken
    // tetikleniyordu; modern iOS'ta API'ler var olduğu için kullanıcı "Aç"a basıp
    // "Bildirim açılamadı" hatası alıyordu.)
    if (isIOS && !standalone) {
      setState("ios-needs-pwa");
      return;
    }

    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported) {
      setState("unsupported");
      return;
    }
    // Anahtar yok/placeholder ise subscribe kesin patlar → dürüst mesaj.
    if (!isValidVapidKey(VAPID_PUBLIC)) {
      setState("unconfigured");
      return;
    }
    if (Notification.permission === "denied") {
      setState("denied");
      return;
    }
    navigator.serviceWorker.getRegistration().then(async (reg) => {
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      setState(sub ? "on" : "off");
    });
  }, []);

  const enable = async () => {
    setBusy(true);
    setErr(null);
    try {
      // Savunma derinliği: mount kapısı geçilse bile geçersiz anahtarla subscribe denemeyiz.
      if (!isValidVapidKey(VAPID_PUBLIC)) {
        setState("unconfigured");
        return;
      }
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        // "denied" = tarayıcı engelledi; "default" = kullanıcı pencereyi kapattı.
        setState(perm === "denied" ? "denied" : "off");
        if (perm !== "denied") setErr("İzin verilmedi. Açmak için izin penceresinden “İzin Ver”i seçin.");
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC),
      });
      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub.toJSON()),
      });
      if (res.ok) {
        setState("on");
      } else {
        setState("off");
        setErr("Bildirim kaydı yapılamadı. Lütfen tekrar deneyin.");
      }
    } catch (e) {
      console.error("[push] abone olunamadı:", e);
      setState("off");
      setErr("Bildirim açılamadı. Lütfen tekrar deneyin.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    setBusy(true);
    setErr(null);
    try {
      const reg = await navigator.serviceWorker.getRegistration();
      const sub = reg ? await reg.pushManager.getSubscription() : null;
      if (sub) {
        await fetch("/api/push/unsubscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        });
        await sub.unsubscribe();
      }
      setState("off");
    } finally {
      setBusy(false);
    }
  };

  const card = (children: React.ReactNode) => (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)" }}>
      <div style={{ flex: "none", width: 42, height: 42, borderRadius: 12, background: "var(--navy-50)", color: "var(--navy-700)", display: "grid", placeItems: "center" }}>
        <Icon name="bell" size={20} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  );

  const title = <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>Bildirimler</div>;

  if (state === "loading") return card(<>{title}<div style={{ fontSize: 13, color: "var(--text-muted)" }}>Kontrol ediliyor…</div></>);

  if (state === "ios-needs-pwa")
    return card(<>{title}<div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>iPhone&apos;da bildirim için önce siteyi <strong>Ana Ekrana Ekle</strong> ile uygulama olarak ekleyin, sonra uygulamadan açın.</div></>);

  if (state === "unsupported")
    return card(<>{title}<div style={{ fontSize: 13, color: "var(--text-muted)" }}>Bu tarayıcı bildirimleri desteklemiyor.</div></>);

  if (state === "unconfigured")
    return card(<>{title}<div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>Bildirim servisi henüz yapılandırılmadı. Kulüp yöneticisi bildirim anahtarlarını tanımladığında bu bölüm otomatik olarak aktifleşecek.</div></>);

  if (state === "denied")
    return card(<>{title}<div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>Bildirim izni engellenmiş. Tarayıcı ayarlarından bu site için bildirimlere izin verin.</div></>);

  const on = state === "on";
  return card(
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
      <div style={{ minWidth: 0 }}>
        {title}
        <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
          {on ? "Antrenman, maç ve duyuru bildirimleri açık." : "Antrenman, maç ve duyurulardan haberdar olun (opsiyonel, KVKK)."}
        </div>
        {err && !on && (
          <div style={{ fontSize: 12.5, color: "var(--red-600, #dc2626)", lineHeight: 1.5, marginTop: 4 }}>{err}</div>
        )}
      </div>
      <button
        onClick={on ? disable : enable}
        disabled={busy}
        style={{
          flex: "none",
          padding: "9px 16px",
          borderRadius: "var(--radius-pill)",
          border: on ? "1px solid var(--border-subtle)" : "none",
          background: on ? "var(--surface-card)" : "var(--grad-gold)",
          color: on ? "var(--text-muted)" : "var(--navy-900)",
          fontFamily: "var(--font-body)",
          fontWeight: 600,
          fontSize: 13.5,
          cursor: busy ? "wait" : "pointer",
          whiteSpace: "nowrap",
        }}
      >
        {busy ? "…" : on ? "Kapat" : "Bildirimleri Aç"}
      </button>
    </div>,
  );
}
