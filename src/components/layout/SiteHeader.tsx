"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon, type IconName } from "@/lib/icons";
import { logoSrc } from "@/lib/branding";
import { SocialLinks } from "@/components/layout/SocialLinks";
import type { SocialLink } from "@/lib/social";

/**
 * Buca Yıldız — Site header: logo + social (left), panel/başvuru (right),
 * mega menu (bottom). Collapses to a hamburger drawer under 900px.
 */

type MenuEntry = { label: string; href: string; items: { label: string; href: string }[] };

const MENU: MenuEntry[] = [
  {
    label: "Kurumsal",
    href: "/kurumsal",
    items: [
      { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
      { label: "Yönetim", href: "/kurumsal/yonetim" },
      { label: "Tesisler", href: "/kurumsal/tesisler" },
      { label: "Vizyon & Misyon", href: "/kurumsal/vizyon-misyon" },
    ],
  },
  {
    label: "Takımlar",
    href: "/takimlar",
    items: [
      { label: "A Takım", href: "/takimlar/a-takim" },
      { label: "U-18", href: "/takimlar/u18" },
      { label: "U-17", href: "/takimlar/u17" },
      { label: "U-16", href: "/takimlar/u16" },
      { label: "U-15", href: "/takimlar/u15" },
    ],
  },
  {
    label: "Altyapı",
    href: "/altyapi",
    items: [
      { label: "Antrenörler", href: "/altyapi/antrenorler" },
      { label: "Gelişim Programı", href: "/altyapi/gelisim-programi" },
      { label: "Seçmeler", href: "/altyapi/secmeler" },
      { label: "Yaz Okulu", href: "/altyapi/yaz-okulu" },
    ],
  },
  { label: "Haberler", href: "/haberler", items: [] },
  {
    label: "Fikstür",
    href: "/fikstur",
    items: [
      { label: "Maç Programı", href: "/fikstur" },
      { label: "Puan Durumu", href: "/fikstur/puan-durumu" },
      { label: "Sonuçlar", href: "/fikstur/sonuclar" },
    ],
  },
  {
    label: "Medya",
    href: "/medya",
    items: [
      { label: "Fotoğraflar", href: "/medya/fotograflar" },
      { label: "Videolar", href: "/medya/videolar" },
      { label: "Basında Biz", href: "/medya/basinda-biz" },
    ],
  },
  { label: "İletişim", href: "/iletisim", items: [] },
];

/** Takım renkleri şeridi — FCB'deki gibi ortadan bölünmüş: lacivert | altın. */
function TeamStripe() {
  return (
    <div
      aria-hidden
      style={{
        height: 6,
        background: "linear-gradient(90deg, var(--navy-700) 0%, var(--navy-600) 50%, var(--gold-400) 50%, var(--gold-800) 100%)",
      }}
    />
  );
}


const navIcon = (name: IconName, size = 14) => <Icon name={name} size={size} />;

export function SiteHeader({ active: activeOverride, socials = [], logoUrl }: { active?: string; socials?: SocialLink[]; logoUrl?: string | null }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const pathname = usePathname();
  const deskRef = useRef<HTMLElement>(null);

  // Rota değişince (mobil menüden herhangi bir linke tıklanıp başka sayfaya
  // gidince) menü + akordeon KAPANSIN. Render sırasında prop-türevi reset deseni
  // — effect gerektirmez (react-hooks/set-state-in-effect lint'ine takılmaz;
  // panel MobileTabBar ile aynı yol). Genişleyebilir öğeler preventDefault ile
  // akordeon açtığından rota değişmez → menü açık kalır (doğru davranış).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    if (mobileOpen) setMobileOpen(false);
    if (acc) setAcc(null);
  }

  // Header yüksekliğini CSS değişkenine yaz — .trial-hero gibi tam ekran
  // hesaplar sabit sayı yerine bunu kullanır (bant yüksekliği değişince kaymaz).
  useEffect(() => {
    const el = deskRef.current;
    if (!el) return;
    const apply = () => document.documentElement.style.setProperty("--by-header-h", `${el.offsetHeight}px`);
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Auto-highlight the top-level menu item matching the current route.
  const active =
    activeOverride ??
    MENU.filter((m) => m.href !== "/" && (pathname === m.href || pathname.startsWith(m.href + "/")))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label;

  // Masaüstü/mobil ayrımı CSS media query ile yapılır (by-header-desktop /
  // by-header-mobile). Böylece doğru header SSR'da/JS olmadan da gelir —
  // gerçek cihazda "masaüstü header" sorunu yaşanmaz.
  return (
    <>
      {/* ---------- MOBILE (≤900px) ---------- */}
      <header
        className="by-header-mobile"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--navy-900)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ padding: "10px 14px 10px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          {/* yalnız arma — yazı yok */}
          <Link href="/" aria-label="Buca Yıldız — Anasayfa" style={{ display: "inline-flex" }}>
            <Image src={logoSrc(logoUrl)} alt="Buca Yıldız" width={50} height={50} style={{ objectFit: "contain", display: "block" }} />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Button as="a" href="/ucretsiz-deneme" variant="accent" size="sm">
              Ücretsiz Analiz
            </Button>
            <IconButton label="Menü" variant="on-navy" onClick={() => setMobileOpen((v) => !v)}>
              <span style={{ display: "inline-flex", transition: "transform .28s var(--ease-out)", transform: mobileOpen ? "rotate(90deg)" : "none" }}>
                {navIcon(mobileOpen ? "x" : "menu", 20)}
              </span>
            </IconButton>
          </div>
        </div>
        <div
          className="by-scroll-on-dark"
          aria-hidden={!mobileOpen}
          style={{
            borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
            maxHeight: mobileOpen ? "calc(100vh - 66px)" : "0px",
            opacity: mobileOpen ? 1 : 0,
            overflowY: mobileOpen ? "auto" : "hidden",
            pointerEvents: mobileOpen ? "auto" : "none",
            transition: "max-height .34s var(--ease-out), opacity .26s ease",
          }}
        >
          <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <Button as="a" href="/giris" variant="on-navy" size="md" fullWidth leftIcon={navIcon("lock", 16)}>
              Sporcu Girişi
            </Button>
            <Button as="a" href="/basvuru" variant="accent" size="md" fullWidth leftIcon={navIcon("clipboard-list", 16)}>
              Başvuru Formu
            </Button>
          </div>
          <nav style={{ padding: "8px 10px" }}>
            {MENU.map((m) => {
              const expandable = m.items.length > 0;
              const isOpen = acc === m.label;
              return (
                <div key={m.label}>
                  <Link
                    href={m.href}
                    onClick={(e) => {
                      if (expandable) {
                        e.preventDefault();
                        setAcc(isOpen ? null : m.label);
                      }
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "13px 12px",
                      textDecoration: "none",
                      fontFamily: "var(--font-heading)",
                      fontWeight: 700,
                      fontSize: 18,
                      textTransform: "uppercase",
                      letterSpacing: "0.015em",
                      color: m.label === active ? "var(--gold-400)" : "#fff",
                    }}
                  >
                    {m.label}
                    {expandable && (
                      <span
                        style={{
                          color: "var(--navy-300)",
                          display: "inline-flex",
                          transform: isOpen ? "rotate(180deg)" : "none",
                          transition: "transform .2s",
                        }}
                      >
                        {navIcon("chevron-down", 16)}
                      </span>
                    )}
                  </Link>
                  {expandable && (
                    <div style={{ display: "flex", flexDirection: "column", overflow: "hidden", maxHeight: isOpen ? 480 : 0, opacity: isOpen ? 1 : 0, paddingBottom: isOpen ? 6 : 0, transition: "max-height .3s var(--ease-out), opacity .24s ease, padding .3s ease" }}>
                      {m.items.map((it) => (
                        <Link
                          key={it.label}
                          href={it.href}
                          style={{
                            padding: "10px 12px 10px 24px",
                            textDecoration: "none",
                            fontFamily: "var(--font-body)",
                            fontSize: 14.5,
                            color: "var(--navy-200)",
                          }}
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
          <div style={{ padding: "14px 18px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <SocialLinks links={socials} box={40} iconSize={17} />
          </div>
        </div>
        <TeamStripe />
      </header>

      {/* ---------- DESKTOP (≥901px) — FCB düzeni ----------
          İki EŞİT 64px bant: üstte en solda sosyal + sağda panel/başvuru;
          altta mega menü. Arma yalnız menü bandının solunda, alta taşar.
          En altta takım renkleri şeridi (lacivert | altın). */}
      <header
        ref={deskRef}
        className="by-header-desktop"
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--navy-900)",
        }}
      >
        <div style={{ maxWidth: 1680, margin: "0 auto", position: "relative" }}>
          {/* Arma — menü bandının solunda, header'dan alta taşar */}
          <Link
            href="/"
            aria-label="Buca Yıldız — Anasayfa"
            style={{ position: "absolute", left: 32, top: 54, zIndex: 55, display: "block", filter: "drop-shadow(0 10px 22px rgba(0,0,0,.45))" }}
          >
            <Image src={logoSrc(logoUrl)} alt="Buca Yıldız" width={79} height={79} priority style={{ objectFit: "contain", display: "block" }} />
          </Link>

          {/* Üst bant: sosyal content alanının EN SOLUNDA + sağda panel/başvuru — 64px */}
          <div style={{ height: 58, padding: "32px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 18, minWidth: 0 }}>
              {/* Camsı motto kartı — dar ekranda CSS ile gizlenir */}
              <Link href="/kurumsal/vizyon-misyon" className="by-motto-card">
                <span className="by-motto-inner" >
                  <span className="by-motto-star">
                    <Icon name="star" size={13} />
                  </span>
                  <span style={{ whiteSpace: "nowrap" }}>
                    Önce iyi bir <b>insan</b>, sonra iyi bir <b>sporcu</b> yetiştiriyoruz
                  </span>
                </span>
              </Link>
              <SocialLinks links={socials} box={34} iconSize={16} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Button style={{ height: "24px", padding: "0 12px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "0.015em" }} as="a" href="/giris" variant="on-navy" size="sm" leftIcon={navIcon("lock")}>
                Sporcu Girişi
              </Button>
              <Button style={{ height: "24px", padding: "0 12px", textTransform: "uppercase", fontWeight: "900", letterSpacing: "0.015em" }} as="a" href="/basvuru" variant="accent" size="sm" leftIcon={navIcon("clipboard-list")}>
                Ücretsiz Analiz ve Başvuru
              </Button>
            </div>
          </div>
        </div>

        {/* Alt bant: mega menü — üst bantla TAM EŞİT 64px */}
        <nav style={{ background: "var(--paper)", borderTop: "1px solid rgba(255,255,255,0.06)" }} onMouseLeave={() => setOpen(null)}>
          <div style={{ maxWidth: 1680, margin: "0 auto", minHeight: 60, padding: "0 24px 0 148px", display: "flex", alignItems: "stretch", gap: "clamp(14px, 1.4vw, 30px)", flexWrap: "wrap" }}>
            {MENU.map((m) => {
              const isActive = m.label === active;
              const isOpen = open === m.label;
              return (
                <div key={m.label} style={{ position: "relative", display: "flex", height: 60 }} onMouseEnter={() => setOpen(m.items.length ? m.label : null)}>
                  <Link
                    href={m.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      padding: "0 4px",
                      fontFamily: "var(--font-heading)",
                      fontWeight: "900",
                      fontSize: 19.5,
                      letterSpacing: "-0.02em",
                      textTransform: "uppercase",
                      color: isActive ? "var(--navy-900)" : "var(--navy-900)",
                      borderBottom: `3px solid ${isActive || isOpen ? "var(--gold-500)" : "transparent"}`,
                      transition: "color .15s, border-color .15s",
                      textDecoration: "none",
                    }}
                  >
                    {m.label}
                    {m.items.length > 0 && navIcon("chevron-down")}
                  </Link>
                  {isOpen && m.items.length > 0 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        minWidth: 210,
                        background: "#fff",
                        border: "1px solid var(--ink-200)",
                        borderTop: "2px solid var(--gold-500)",
                        borderRadius: "0 0 var(--radius-md) var(--radius-md)",
                        boxShadow: "var(--shadow-lg)",
                        padding: 6,
                        zIndex: 60,
                      }}
                    >
                      {m.items.map((it) => (
                        <Link
                          key={it.label}
                          href={it.href}
                          className="mega-link"
                          style={{
                            display: "block",
                            padding: "10px 14px",
                            fontFamily: "var(--font-body)",
                            fontSize: 14.5,
                            fontWeight: 500,
                            color: "var(--ink-700)",
                            textDecoration: "none",
                            borderRadius: "var(--radius-sm)",
                          }}
                        >
                          {it.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
        <TeamStripe />
      </header >
    </>
  );
}
