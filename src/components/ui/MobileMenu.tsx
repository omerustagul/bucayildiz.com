"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, type IconName } from "@/lib/icons";
import { useOverlayDismiss } from "@/components/ui/useOverlayDismiss";

/** Tam ekran mobil menü (Instagram/Linear kalıbı) — soldan drawer'ın yerini alır.
 *  Üstte kullanıcı kartı + kapat, ortada büyük dokunma alanlı gruplu liste
 *  (stagger animasyonlu), altta shell'in verdiği footer (Çıkış vb.).
 *  Overlay standardı: Escape + scroll kilidi; geri tuşu önce menüyü kapatır;
 *  rota değişince kendiliğinden kapanır; reduced-motion desteklidir. */

export type MobileMenuItem = { href: string; label: string; icon: IconName; badge?: number; disabled?: boolean };
export type MobileMenuGroup = { group?: string; items: MobileMenuItem[] };

const spring = { type: "spring" as const, stiffness: 360, damping: 32 };

export function MobileMenu({
  open,
  onClose,
  header,
  groups,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  header: { title: string; subtitle?: string; initials: string; photoUrl?: string | null };
  groups: MobileMenuGroup[];
  footer?: React.ReactNode;
}) {
  const pathname = usePathname();
  const reduce = !!useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Rota değişince kapan (render-anı state türetme deseni — dock ile aynı)
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (open) onClose();
  }

  useOverlayDismiss(open, onClose);

  // Geri tuşu önce menüyü kapatır
  useEffect(() => {
    if (!open) return;
    const onPop = () => onClose();
    window.history.pushState({ byMobileMenu: true }, "");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [open, onClose]);

  // Açılınca ilk bağlantıya odak
  useEffect(() => {
    if (!open) return;
    const id = requestAnimationFrame(() => panelRef.current?.querySelector("a")?.focus());
    return () => cancelAnimationFrame(id);
  }, [open]);

  const container = reduce
    ? {
        show: { opacity: 1, transition: { duration: 0.15 } },
        hide: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        show: { opacity: 1, y: 0, scale: 1, transition: { ...spring, when: "beforeChildren" as const, staggerChildren: 0.028 } },
        hide: { opacity: 0, y: 26, scale: 0.97, transition: { duration: 0.2, ease: [0.4, 0, 1, 1] as const } },
      };
  const row = reduce
    ? { show: { opacity: 1 }, hide: { opacity: 1 } }
    : { show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 480, damping: 30 } }, hide: { opacity: 0, y: 14 } };

  // En uzun eşleşme kazanır: kök href ("/panel") alt rotalarda aktif görünmez
  const activeHref = groups
    .flatMap((g) => g.items)
    .filter((it) => pathname === it.href || pathname.startsWith(it.href + "/"))
    .reduce<string | null>((a, b) => (b.href.length > (a?.length ?? 0) ? b.href : a), null);
  const isActive = (href: string) => href === activeHref;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menü"
          className="by-mobile-only"
          variants={container}
          initial="hide"
          animate="show"
          exit="hide"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 80,
            background: "var(--surface-page)",
            display: "flex",
            flexDirection: "column",
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          {/* Üst: kullanıcı kartı + kapat */}
          <motion.div variants={row} style={{ display: "flex", alignItems: "center", gap: 13, padding: "16px 18px 12px", borderBottom: "1px solid var(--border-subtle)" }}>
            <span style={{ width: 46, height: 46, flex: "none", borderRadius: "50%", background: "var(--grad-navy)", border: "2px solid var(--gold-500)", color: "var(--gold-300)", display: "grid", placeItems: "center", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, overflow: "hidden" }}>
              {header.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={header.photoUrl} alt={header.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                header.initials
              )}
            </span>
            <span style={{ minWidth: 0, flex: 1, lineHeight: 1.25 }}>
              <span style={{ display: "block", fontWeight: 700, fontSize: 16.5, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{header.title}</span>
              {header.subtitle && <span style={{ display: "block", fontSize: 12.5, color: "var(--text-muted)" }}>{header.subtitle}</span>}
            </span>
            <button
              type="button"
              aria-label="Menüyü kapat"
              onClick={onClose}
              style={{ width: 44, height: 44, flex: "none", display: "grid", placeItems: "center", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--navy-700)", cursor: "pointer" }}
            >
              <Icon name="x" size={19} />
            </button>
          </motion.div>

          {/* Orta: gruplu liste */}
          <div className="by-overlay-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "8px 12px 16px" }}>
            {groups.map((g, gi) => (
              <div key={g.group ?? gi} style={{ marginTop: gi === 0 ? 4 : 14 }}>
                {g.group && (
                  <motion.div variants={row} style={{ padding: "4px 10px 6px", fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--text-muted)" }}>
                    {g.group}
                  </motion.div>
                )}
                {g.items.map((it) => {
                  const on = isActive(it.href);
                  return (
                    <motion.div key={it.href} variants={row}>
                      <Link
                        href={it.disabled ? "#" : it.href}
                        onClick={onClose}
                        aria-current={on ? "page" : undefined}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 13,
                          minHeight: 52,
                          padding: "6px 10px",
                          borderRadius: "var(--radius-md)",
                          textDecoration: "none",
                          background: on ? "var(--navy-800)" : "transparent",
                          opacity: it.disabled ? 0.45 : 1,
                          pointerEvents: it.disabled ? "none" : "auto",
                        }}
                      >
                        <span style={{ width: 38, height: 38, flex: "none", borderRadius: 12, display: "grid", placeItems: "center", background: on ? "rgba(233,200,96,.18)" : "var(--navy-50)", color: on ? "var(--gold-300)" : "var(--navy-700)" }}>
                          <Icon name={it.icon} size={18} />
                        </span>
                        <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 15.5, fontWeight: on ? 700 : 600, color: on ? "#fff" : "var(--text-strong)" }}>
                          {it.label}
                        </span>
                        {it.badge != null && it.badge > 0 && (
                          <span style={{ flex: "none", fontSize: 11, fontWeight: 700, lineHeight: 1, color: "var(--navy-900)", background: "var(--grad-gold)", borderRadius: "var(--radius-pill)", padding: "4px 8px", minWidth: 20, textAlign: "center" }}>
                            {it.badge}
                          </span>
                        )}
                        <span style={{ flex: "none", display: "inline-flex", color: on ? "rgba(255,255,255,.5)" : "var(--ink-300)" }}>
                          <Icon name="chevron-right" size={16} />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Alt: shell'in footer'ı (Çıkış vb.) */}
          {footer && (
            <motion.div variants={row} style={{ borderTop: "1px solid var(--border-subtle)", padding: "10px 14px calc(10px + env(safe-area-inset-bottom))" }}>
              {footer}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
