"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/lib/icons";
import { Avatar } from "@/components/ui/Avatar";
import { IconButton } from "@/components/ui/IconButton";
import { panelLogout } from "@/app/panel/actions";
import { InstallHint } from "@/components/panel/InstallHint";
import { PageTransition } from "@/components/layout/PageTransition";

type Athlete = { name: string; teamName: string; number: number | null; position: string; photoUrl: string | null };

const NAV: { href: string; label: string; icon: IconName; ready?: boolean }[] = [
  { href: "/panel", label: "Genel Bakış", icon: "layout-dashboard", ready: true },
  { href: "/panel/antrenmanlar", label: "Antrenmanlar", icon: "calendar-days", ready: true },
  { href: "/panel/beslenme", label: "Beslenme", icon: "apple", ready: true },
  { href: "/panel/mesajlar", label: "Mesajlar", icon: "mail", ready: true },
  { href: "/panel/performans", label: "Performans", icon: "heart-pulse", ready: true },
  { href: "/panel/izinler", label: "İzinler", icon: "shield-check", ready: true },
  { href: "/panel/maclar", label: "Maçlar", icon: "trophy", ready: true },
  { href: "/panel/odemeler", label: "Ödemeler", icon: "clipboard-list", ready: true },
  { href: "/panel/profil", label: "Profil", icon: "user-round", ready: true },
];

export function PanelShell({ athlete, unreadCount = 0, children }: { athlete: Athlete; unreadCount?: number; children: React.ReactNode }) {
  const pathname = usePathname();
  const numberLabel = athlete.number != null ? `${athlete.number} Numara` : athlete.position;
  const title = NAV.find((n) => n.href === pathname)?.label ?? "Genel Bakış";
  const subtitle = pathname === "/panel" ? `Hoş geldin, ${athlete.name.split(" ")[0]}` : undefined;

  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const on = () => {
      setIsMobile(mq.matches);
      if (!mq.matches) setMobileOpen(false);
    };
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const closeMobile = () => isMobile && setMobileOpen(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-subtle)" }}>
      {/* Mobile overlay */}
      {isMobile && mobileOpen && <div onClick={() => setMobileOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(8,18,38,.45)", zIndex: 55 }} />}

      {/* Sidebar — konum/transform CSS'te (.pl-sidebar): ilk boyamada bile doğru,
          sayfa yüklenirken "açılıp kapanma" flaşı olmaz. */}
      <aside
        className={`pl-sidebar${mobileOpen ? " pl-sidebar-open" : ""}`}
        style={{
          width: 252,
          flex: "none",
          background: "var(--navy-950)",
          borderRight: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ padding: "22px 22px 18px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,.07)" }}>
          <Image src="/brand/logo-emblem.png" alt="" width={40} height={40} style={{ objectFit: "contain" }} />
          <div style={{ lineHeight: 1 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 17, color: "#fff", textTransform: "uppercase", letterSpacing: ".02em" }}>Buca Yıldız</div>
            <div style={{ fontSize: 10, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-400)", marginTop: 3, fontWeight: 600 }}>Sporcu Paneli</div>
          </div>
        </div>
        <nav className="by-scroll-on-dark" style={{ padding: 12, display: "flex", flexDirection: "column", gap: 3, flex: 1, overflowY: "auto", minHeight: 0 }}>
          {NAV.map((n) => {
            const on = pathname === n.href;
            const disabled = !n.ready;
            const inner = (
              <>
                {on && <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: "var(--grad-gold)", borderRadius: "0 2px 2px 0" }} />}
                <span style={{ color: on ? "var(--gold-400)" : "var(--navy-300)", display: "inline-flex" }}><Icon name={n.icon} size={18} /></span>
                <span style={{ flex: 1 }}>{n.label}</span>
                {n.href === "/panel/mesajlar" && unreadCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 700, lineHeight: 1, color: "var(--navy-900)", background: "var(--grad-gold)", borderRadius: "var(--radius-pill)", padding: "3px 7px", minWidth: 18, textAlign: "center" }}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
                {disabled && <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--navy-400)", border: "1px solid var(--navy-600)", borderRadius: 4, padding: "1px 5px" }}>Yakında</span>}
              </>
            );
            const base: React.CSSProperties = {
              position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: "var(--radius-sm)", textDecoration: "none",
              fontFamily: "var(--font-body)", fontWeight: on ? 600 : 500, fontSize: 14.5,
              color: on ? "#fff" : disabled ? "var(--navy-400)" : "var(--navy-200)",
              background: on ? "rgba(255,255,255,.07)" : "transparent",
              cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.75 : 1,
            };
            return disabled ? (
              <div key={n.href} title={`${n.label} — yakında`} style={base}>{inner}</div>
            ) : (
              <Link key={n.href} href={n.href} onClick={closeMobile} style={base}>{inner}</Link>
            );
          })}
        </nav>
        <div style={{ padding: 14, borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <form action={panelLogout}>
            <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: "var(--radius-sm)", border: "none", background: "transparent", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14.5, color: "var(--navy-200)", cursor: "pointer" }}>
              <Icon name="log-out" size={18} /> Çıkış Yap
            </button>
          </form>
        </div>
      </aside>

      {/* Main — sidebar fixed olduğundan sol boşluk .pl-main (CSS) ile açılır */}
      <div className="pl-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,.88)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ padding: "14px clamp(14px, 4vw, 32px)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              {/* Menü butonu CSS ile yalnız mobilde görünür (hydration beklemez) */}
              <button aria-label="Menü" className="pl-menu-btn" onClick={() => setMobileOpen((o) => !o)} style={{ placeItems: "center", width: 38, height: 38, flex: "none", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--navy-700)", cursor: "pointer" }}>
                <Icon name="menu" size={18} />
              </button>
              <div style={{ minWidth: 0 }}>
                <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(19px, 5vw, 26px)", textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</h1>
                {subtitle && <div style={{ fontSize: 13.5, color: "var(--ink-500)", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{subtitle}</div>}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flex: "none" }}>
              <IconButton label="Bildirimler" variant="outline"><Icon name="bell" size={18} /></IconButton>
              <span className="pl-header-divider" style={{ width: 1, height: 30, background: "var(--ink-200)" }} />
              {/* Kullanıcı bloğu → profil sayfası */}
              <Link href="/panel/profil" title="Profilim" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none", borderRadius: "var(--radius-sm)" }}>
                <Avatar name={athlete.name} src={athlete.photoUrl} size={40} />
                <div className="pl-header-identity" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{athlete.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-400)" }}>{athlete.teamName} · {numberLabel}</div>
                </div>
              </Link>
            </div>
          </div>
        </header>
        <main style={{ padding: "24px clamp(14px, 4vw, 32px) 48px", display: "flex", flexDirection: "column", gap: 24, width: "100%" }}>
          <InstallHint />
          <PageTransition style={{ display: "flex", flexDirection: "column", gap: 24 }}>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}
