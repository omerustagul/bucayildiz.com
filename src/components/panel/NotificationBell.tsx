"use client";

import { useState, useTransition, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Icon, type IconName } from "@/lib/icons";
import { IconButton } from "@/components/ui/IconButton";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  type FeedItem,
} from "@/app/panel/bildirimler/actions";

/** Bildirim türüne göre ikon + renk (feed satırındaki yuvarlak rozet). */
const TYPE_META: Record<string, { icon: IconName; color: string; bg: string }> = {
  training: { icon: "calendar-days", color: "var(--navy-700)", bg: "var(--navy-50)" },
  match: { icon: "trophy", color: "var(--red-600)", bg: "var(--red-100)" },
  measurement: { icon: "heart-pulse", color: "var(--gold-700)", bg: "var(--gold-100)" },
  message: { icon: "mail", color: "var(--navy-700)", bg: "var(--navy-50)" },
  nutrition: { icon: "apple", color: "var(--green-600)", bg: "var(--green-100)" },
  admin: { icon: "bell", color: "var(--gold-700)", bg: "var(--gold-100)" },
};

function relTime(iso: string): string {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return "az önce";
  if (min < 60) return `${min} dk önce`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} sa önce`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit" });
}

/** Kapanışta unmount'u kısa süre geciktirir; .is-closing ile çıkış animasyonu
 *  oynar (proje overlay standardı — bkz. admin controls.tsx Drawer). */
function useDelayedUnmount(open: boolean, ms = 200) {
  const [render, setRender] = useState(open);
  if (open && !render) setRender(true); // açılış: render anı senkron
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => setRender(false), ms);
    return () => clearTimeout(t);
  }, [open, ms]);
  return { render, closing: render && !open };
}

export function NotificationBell({ initialUnread }: { initialUnread: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, startLoad] = useTransition();
  const [, startAction] = useTransition();
  // unread: ilk değer sunucudan; açılışta feed'den yeniden hesaplanır, okununca
  // lokal azalır. (Prop→state sync effect'i gereksiz — açılış zaten düzeltir.)
  // Açılış: by-anim-fade/drawer; kapanış: is-closing çıkış animasyonu oynar.
  const { render, closing } = useDelayedUnmount(open, 200);

  const openSheet = () => {
    setOpen(true);
    startLoad(async () => {
      const rows = await getMyNotifications();
      setItems(rows);
      setUnread(rows.filter((r) => !r.read).length);
    });
  };

  // Escape ile kapat + iOS-GÜVENLİ arka plan scroll kilidi (position:fixed).
  // Eskiden `body.style.overflow = "hidden"` idi — iOS Safari'de dokunmatik
  // kaydırmayı durdurmuyordu (arka plan sızıyordu). Tek kaynak.
  useOverlayDismiss(open, () => setOpen(false));

  const onTap = (n: FeedItem) => {
    if (!n.read) {
      setItems((cur) => cur?.map((x) => (x.id === n.id ? { ...x, read: true } : x)) ?? cur);
      setUnread((u) => Math.max(0, u - 1));
      startAction(async () => { await markNotificationRead(n.id); });
    }
    if (n.url) { setOpen(false); router.push(n.url); }
  };

  const onMarkAll = () => {
    setItems((cur) => cur?.map((x) => ({ ...x, read: true })) ?? cur);
    setUnread(0);
    startAction(async () => { await markAllNotificationsRead(); });
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-flex" }}>
        <IconButton label="Bildirimler" variant="outline" onClick={openSheet}><Icon name="bell" size={18} /></IconButton>
        {unread > 0 && (
          <span aria-hidden style={{ position: "absolute", top: -4, right: -4, minWidth: 18, height: 18, padding: "0 5px", borderRadius: 9, background: "var(--red-600)", color: "#fff", fontSize: 11, fontWeight: 700, display: "grid", placeItems: "center", lineHeight: 1, border: "2px solid var(--surface-card)" }}>
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </div>

      {render && typeof document !== "undefined" && createPortal(
        <div
          onClick={() => setOpen(false)}
          className={`by-anim-fade${closing ? " is-closing" : ""}`}
          style={{ position: "fixed", inset: 0, height: "100dvh", background: "rgba(8,18,38,.5)", zIndex: 1000, display: "flex", justifyContent: "flex-end" }}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Bildirimler"
            className={`by-anim-drawer${closing ? " is-closing" : ""}`}
            style={{ width: "min(420px, 100%)", height: "100dvh", background: "var(--surface-card)", boxShadow: "var(--shadow-xl)", display: "flex", flexDirection: "column" }}
          >
            {/* Başlık */}
            <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flex: "none" }}>
              <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Bildirimler</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {(items?.some((i) => !i.read) ?? false) && (
                  <button type="button" onClick={onMarkAll} style={{ font: "inherit", cursor: "pointer", border: "none", background: "transparent", color: "var(--navy-700)", fontSize: 12.5, fontWeight: 600, padding: "6px 8px", borderRadius: "var(--radius-sm)", display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <Icon name="check" size={14} /> Tümünü okundu
                  </button>
                )}
                <button type="button" onClick={() => setOpen(false)} aria-label="Kapat" style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-500)", padding: 6, display: "inline-flex" }}>
                  <Icon name="x" size={20} />
                </button>
              </div>
            </div>

            {/* Liste */}
            <div className="by-overlay-scroll" style={{ flex: 1, overflowY: "auto", padding: 10 }}>
              {loading && items === null ? (
                <div style={{ padding: "40px 16px", textAlign: "center", color: "var(--ink-400)", fontSize: 14 }}>Yükleniyor…</div>
              ) : (items?.length ?? 0) === 0 ? (
                <div style={{ padding: "56px 24px", display: "grid", placeItems: "center", gap: 12, textAlign: "center", color: "var(--ink-400)" }}>
                  <span style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--surface-subtle)", display: "grid", placeItems: "center", color: "var(--ink-300)" }}>
                    <Icon name="bell" size={26} />
                  </span>
                  <span style={{ fontSize: 14 }}>Henüz bildirimin yok.</span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {items!.map((n) => {
                    const meta = TYPE_META[n.type] ?? TYPE_META.admin;
                    return (
                      <button
                        key={n.id}
                        type="button"
                        onClick={() => onTap(n)}
                        style={{
                          font: "inherit", textAlign: "left", cursor: "pointer", width: "100%",
                          display: "flex", gap: 12, alignItems: "flex-start", padding: "12px 12px",
                          borderRadius: "var(--radius-md)", border: "1px solid transparent",
                          background: n.read ? "transparent" : "var(--navy-50)",
                        }}
                      >
                        <span style={{ flex: "none", width: 38, height: 38, borderRadius: "50%", background: meta.bg, color: meta.color, display: "grid", placeItems: "center", marginTop: 1 }}>
                          <Icon name={meta.icon} size={18} />
                        </span>
                        <span style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
                            <span style={{ fontWeight: n.read ? 600 : 700, fontSize: 14, color: "var(--text-strong)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.title}</span>
                            {!n.read && <span aria-hidden style={{ flex: "none", width: 8, height: 8, borderRadius: "50%", background: "var(--red-600)" }} />}
                          </span>
                          {n.body && <span style={{ marginTop: 2, fontSize: 13, color: "var(--ink-500)", lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const }}>{n.body}</span>}
                          <span style={{ display: "block", marginTop: 4, fontSize: 11.5, color: "var(--ink-400)" }}>{relTime(n.createdAt)}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
