"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Icon, type IconName } from "@/lib/icons";

/** Mobil dock (yalnız ≤900px; .by-tabbar CSS'i ile gizlenir/gösterilir).
 *  Tasarım: açık sayfa zemininden bir ton koyu, yumuşak gölgeli yüzer kart.
 *  - Aktif öğe genişler: ikon + etiket + altın alt çizgi (çizgi layoutId ile
 *    öğeler arasında kayarak taşınır); pasifler yalnız ikon.
 *  - "group" öğeleri dock'un hemen üstünde TAM GENİŞLİK kompakt bir sayfa açar.
 *  - `hidden` (sidebar açıkken) dock ve sayfa tatlı bir animasyonla kapanır. */

export type TabBarLink = { kind: "link"; href: string; label: string; icon: IconName };
export type TabBarGroup = { kind: "group"; id: string; label: string; icon: IconName; items: { href: string; label: string; icon: IconName }[] };
export type TabBarItem = TabBarLink | TabBarGroup;

const spring = { type: "spring" as const, stiffness: 420, damping: 34 };

/* Dock koreografisi: kabuk 3D perspektifle blur içinde erir; öğeler
   merkezden dışa doğru zıplayarak gelir, kenardan içe sönerek gider. */
const dockVariants = {
  show: {
    opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", borderTopLeftRadius: 12, borderTopRightRadius: 12,
    transition: { type: "spring" as const, stiffness: 380, damping: 30, when: "beforeChildren" as const },
  },
  // grup sayfası açıkken dock ile sayfa tek yüzey gibi birleşir
  showFlat: {
    opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)", borderTopLeftRadius: 0, borderTopRightRadius: 0,
    transition: { type: "spring" as const, stiffness: 380, damping: 30, when: "beforeChildren" as const },
  },
  hide: {
    opacity: 0, y: 14, scale: 0.9, rotateX: 14, filter: "blur(7px)",
    transition: { duration: 0.22, ease: [0.32, 0, 0.67, 0] as const, when: "afterChildren" as const },
  },
};

const dockItemShow = (order: number) => ({
  opacity: 1, scale: 1, y: 0,
  transition: { type: "spring" as const, stiffness: 520, damping: 27, delay: order * 0.05 },
});

const dockItemVariants = {
  show: dockItemShow,
  showFlat: dockItemShow, // dock düz moddayken de öğeler görünür kalır

  hide: (order: number) => ({
    opacity: 0, scale: 0.45, y: 9,
    transition: { duration: 0.13, ease: "easeIn" as const, delay: (2 - order) * 0.03 },
  }),
};

function isGroupActive(g: TabBarGroup, pathname: string) {
  return g.items.some((i) => pathname === i.href || pathname.startsWith(i.href + "/"));
}

const itemKey = (it: TabBarItem) => (it.kind === "link" ? it.href : it.id);

export function MobileTabBar({
  items,
  pathname,
  homeHref,
  hidden = false,
}: {
  items: TabBarItem[];
  pathname: string;
  homeHref: string;
  hidden?: boolean;
}) {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const close = () => setOpenGroup(null);

  const linkActive = (href: string) => (href === homeHref ? pathname === homeHref : pathname === href || pathname.startsWith(href + "/"));
  const routeActiveKey = items.map((it) => (it.kind === "link" ? (linkActive(it.href) ? it.href : null) : isGroupActive(it, pathname) ? it.id : null)).find(Boolean);
  // Tek öğe genişler: açık grup önceliklidir, yoksa rotadaki aktif öğe.
  const expandedKey = openGroup ?? routeActiveKey ?? null;

  const openItem = items.find((it): it is TabBarGroup => it.kind === "group" && it.id === openGroup);

  return (
    <>
      {/* Grup sayfası arkaplan kapatıcısı */}
      <AnimatePresence>
        {openItem && !hidden && (
          <motion.div
            key="tb-ovl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            style={{ position: "fixed", inset: 0, background: "rgba(10,18,38,.30)", zIndex: 68 }}
          />
        )}
      </AnimatePresence>

      {/* Grup sayfası: dock'un hemen üstünde, tam genişlik, dock ile aynı dil */}
      <AnimatePresence>
        {openItem && !hidden && (
          <motion.div
            key={openItem.id}
            className="by-tabbar"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98, transition: { duration: 0.18 } }}
            transition={spring}
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: "calc(65px + env(safe-area-inset-bottom))", // dock içeriği ~65px + safe-area
              zIndex: 71,
              maxWidth: 478,
              margin: "0 auto",
              background: "var(--ink-100)",
              border: "1px solid var(--ink-200)",
              borderBottom: "none", // dock ile tek yüzey: araya çizgi girmez
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              boxShadow: "0 -14px 36px rgba(14,33,72,.16)",
              overflow: "hidden",
            }}
          >
            <div style={{ padding: "10px 14px 8px", fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--navy-600)", borderBottom: "1px solid var(--ink-200)" }}>
              {openItem.label}
            </div>
            <div style={{ display: "flex", flexDirection: "column", padding: "4px 8px 6px" }}>
              {openItem.items.map((sub, i) => {
                const on = pathname === sub.href || pathname.startsWith(sub.href + "/");
                return (
                  <motion.div key={sub.href} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.022 * i, ...spring }} style={{ borderTop: i === 0 ? "none" : "1px solid var(--ink-200)" }}>
                    <Link
                      href={sub.href}
                      onClick={close}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 11,
                        padding: "10px 8px",
                        borderRadius: 10,
                        textDecoration: "none",
                        background: on ? "var(--navy-800)" : "transparent",
                      }}
                    >
                      <span
                        style={{
                          flex: "none",
                          width: 27,
                          height: 27,
                          borderRadius: 9,
                          display: "grid",
                          placeItems: "center",
                          background: on ? "rgba(233,200,96,.18)" : "var(--paper)",
                          border: on ? "1px solid rgba(233,200,96,.4)" : "1px solid var(--ink-200)",
                          color: on ? "var(--gold-300)" : "var(--navy-600)",
                        }}
                      >
                        <Icon name={sub.icon} size={15} />
                      </span>
                      <span style={{ minWidth: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 14.5, fontWeight: on ? 700 : 600, color: on ? "#fff" : "var(--ink-700)" }}>
                        {sub.label}
                      </span>
                      <span style={{ flex: "none", display: "inline-flex", color: on ? "rgba(255,255,255,.55)" : "var(--ink-300)" }}>
                        <Icon name="chevron-right" size={15} />
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dock */}
      <AnimatePresence>
        {!hidden && (
          <motion.nav
            key="dock"
            className="by-tabbar"
            aria-label="Alt gezinme"
            variants={dockVariants}
            initial="hide"
            animate={openItem ? "showFlat" : "show"}
            exit="hide"
            style={{
              transformOrigin: "50% 100%",
              transformPerspective: 700,
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 70,
              maxWidth: 478,
              margin: "0 auto",
              background: "var(--ink-100)",
              border: "1px solid var(--ink-200)",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
              boxShadow: "0 10px 32px rgba(14,33,72,.18)",
              // safe-area (iOS home çubuğu) dock'un İÇİNDE kalır — havada uçmaz
              padding: "12px 16px calc(12px + env(safe-area-inset-bottom))",
            }}
          >
            <LayoutGroup id="by-dock">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                {items.map((it, idx) => {
                  const key = itemKey(it);
                  const expanded = key === expandedKey;
                  const order = Math.abs(idx - (items.length - 1) / 2); // merkezden dışa

                  const iconColor = expanded ? "var(--navy-800)" : "var(--ink-500)";

                  const inner = (
                    <>
                      <motion.span layout transition={spring} style={{ display: "inline-flex", color: iconColor }}>
                        <Icon name={it.icon} size={21} />
                      </motion.span>
                      <AnimatePresence mode="popLayout" initial={false}>
                        {expanded && (
                          <motion.span
                            key="lbl"
                            layout
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -6, transition: { duration: 0.14 } }}
                            transition={spring}
                            style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1 }}
                          >
                            <span style={{ fontSize: 12.5, fontWeight: 700, color: "var(--navy-800)", whiteSpace: "nowrap" }}>{it.label}</span>
                            {/* altın alt çizgi — öğeler arasında kayarak taşınır */}
                            <motion.span layoutId="by-dock-line" transition={spring} style={{ height: 2.5, width: "100%", marginTop: 3.5, borderRadius: 2, background: "var(--grad-gold)" }} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </>
                  );

                  const boxStyle: React.CSSProperties = {
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "9px 11px",
                    borderRadius: 8,
                    textDecoration: "none",
                    background: expanded ? "var(--paper)" : "transparent",
                    boxShadow: expanded ? "0 2px 10px rgba(14,33,72,.01)" : "none",
                    border: "none",
                    font: "inherit",
                    cursor: "pointer",
                  };

                  if (it.kind === "link") {
                    return (
                      <motion.div key={key} layout custom={order} variants={dockItemVariants} transition={spring} whileTap={{ scale: 0.93 }}>
                        <Link href={it.href} onClick={close} aria-label={it.label} aria-current={expanded ? "page" : undefined} style={boxStyle}>
                          {inner}
                        </Link>
                      </motion.div>
                    );
                  }

                  const open = openGroup === it.id;
                  return (
                    <motion.div key={key} layout custom={order} variants={dockItemVariants} transition={spring} whileTap={{ scale: 0.93 }}>
                      <button
                        type="button"
                        aria-label={it.label}
                        aria-expanded={open}
                        onClick={() => setOpenGroup(open ? null : it.id)}
                        style={boxStyle}
                      >
                        {inner}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </LayoutGroup>
          </motion.nav>
        )}
      </AnimatePresence>
    </>
  );
}
