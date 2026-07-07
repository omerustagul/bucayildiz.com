"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Icon, type IconName } from "@/lib/icons";

/** Mobil alt gezinme çubuğu (yalnız ≤900px; .by-tabbar CSS'i).
 *  - Orta slot: vurgulu ana sayfa butonu (altın daire).
 *  - "link" öğeleri doğrudan gider; "group" öğeleri üstüne doğru modern bir
 *    liste açar (framer spring). Aktif sekme noktası layoutId ile kayar. */

export type TabBarLink = { kind: "link"; href: string; label: string; icon: IconName };
export type TabBarGroup = { kind: "group"; id: string; label: string; icon: IconName; items: { href: string; label: string; icon: IconName }[] };
export type TabBarItem = TabBarLink | TabBarGroup;

const spring = { type: "spring" as const, stiffness: 420, damping: 34 };

function isGroupActive(g: TabBarGroup, pathname: string) {
  return g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
}

export function MobileTabBar({ items, pathname, homeHref }: { items: TabBarItem[]; pathname: string; homeHref: string }) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const close = () => setOpenGroup(null);

  const linkActive = (href: string) => (href === homeHref ? pathname === homeHref : pathname === href || pathname.startsWith(href + "/"));

  return (
    <>
      {/* Grup menüsü arkaplan kapatıcısı */}
      <AnimatePresence>
        {openGroup && (
          <motion.div
            key="tb-ovl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.35)", zIndex: 68 }}
          />
        )}
      </AnimatePresence>

      <nav className="by-tabbar" aria-label="Alt gezinme" style={{ position: "fixed", left: 0, right: 0, bottom: 0, zIndex: 70, background: "var(--navy-950)", borderTop: "1px solid rgba(201,162,39,.35)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, alignItems: "end", height: 62, maxWidth: 520, margin: "0 auto", position: "relative" }}>
          {items.map((it) => {
            const isCenter = it.kind === "link" && it.href === homeHref;
            const active = it.kind === "link" ? linkActive(it.href) : isGroupActive(it, pathname);
            const color = active ? "var(--gold-400)" : "var(--navy-300)";

            const activeDot = active && (
              <motion.span layoutId="by-tabbar-dot" transition={spring} style={{ position: "absolute", top: 6, width: 5, height: 5, borderRadius: "50%", background: "var(--gold-400)" }} />
            );

            if (it.kind === "link") {
              if (isCenter) {
                return (
                  <Link key={it.href} href={it.href} onClick={close} aria-label={it.label} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", textDecoration: "none", paddingBottom: 8 }}>
                    <motion.span
                      whileTap={{ scale: 0.9 }}
                      style={{ width: 52, height: 52, marginTop: -18, borderRadius: "50%", background: "var(--grad-gold)", border: "4px solid var(--navy-950)", display: "grid", placeItems: "center", color: "var(--navy-900)", boxShadow: "0 6px 18px rgba(201,162,39,.4)" }}
                    >
                      <Icon name={it.icon} size={22} />
                    </motion.span>
                    <span style={{ marginTop: 3, fontSize: 9.5, fontWeight: 700, letterSpacing: ".04em", color: active ? "var(--gold-400)" : "var(--navy-200)" }}>{it.label}</span>
                  </Link>
                );
              }
              return (
                <Link key={it.href} href={it.href} onClick={close} style={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, textDecoration: "none", padding: "10px 2px 9px" }}>
                  {activeDot}
                  <motion.span whileTap={{ scale: 0.85 }} style={{ color, display: "inline-flex" }}><Icon name={it.icon} size={20} /></motion.span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".02em", color: active ? "#fff" : "var(--navy-300)", maxWidth: "100%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.label}</span>
                </Link>
              );
            }

            const open = openGroup === it.id;
            return (
              <div key={it.id} style={{ position: "relative", display: "flex", justifyContent: "center" }}>
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenGroup(open ? null : it.id)}
                  style={{ position: "relative", font: "inherit", border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "10px 2px 9px", width: "100%" }}
                >
                  {activeDot}
                  <motion.span animate={{ scale: open ? 1.12 : 1, color: open ? "var(--gold-400)" : color }} transition={spring} style={{ display: "inline-flex" }}>
                    <Icon name={it.icon} size={20} />
                  </motion.span>
                  <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: ".02em", color: open || active ? "#fff" : "var(--navy-300)" }}>{it.label}</span>
                </button>

                {/* Yukarı açılan grup menüsü */}
                <AnimatePresence>
                  {open && (
                    <motion.div
                      key="menu"
                      initial={{ opacity: 0, y: 14, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={spring}
                      style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", transformOrigin: "bottom center", minWidth: 190, maxWidth: "calc(100vw - 24px)", background: "var(--navy-950)", border: "1px solid rgba(201,162,39,.4)", borderRadius: 14, boxShadow: "0 14px 40px rgba(5,12,28,.55)", overflow: "hidden", zIndex: 72 }}
                    >
                      <div style={{ padding: "9px 14px 7px", fontSize: 10, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--gold-400)", borderBottom: "1px solid rgba(255,255,255,.08)" }}>{it.label}</div>
                      {it.items.map((sub, i) => {
                        const on = pathname === sub.href || pathname.startsWith(sub.href + "/");
                        return (
                          <motion.div key={sub.href} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.03 * i, ...spring }}>
                            <Link
                              href={sub.href}
                              onClick={close}
                              style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 14px", textDecoration: "none", fontSize: 13.5, fontWeight: on ? 700 : 500, color: on ? "#fff" : "var(--navy-200)", background: on ? "rgba(201,162,39,.14)" : "transparent" }}
                            >
                              <span style={{ color: on ? "var(--gold-400)" : "var(--navy-300)", display: "inline-flex" }}><Icon name={sub.icon} size={16} /></span>
                              <span style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.label}</span>
                            </Link>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
