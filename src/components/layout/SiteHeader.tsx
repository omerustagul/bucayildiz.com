"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Icon, BrandGlyph, type IconName } from "@/lib/icons";

/**
 * Buca Yıldız — Site header: logo + social (left), panel/başvuru (right),
 * mega menu (bottom). Collapses to a hamburger drawer under 900px.
 */

const SOCIAL: { name: "instagram" | "facebook" | "youtube" | "x"; label: string }[] = [
  { name: "instagram", label: "Instagram" },
  { name: "facebook", label: "Facebook" },
  { name: "youtube", label: "YouTube" },
  { name: "x", label: "X" },
];

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

function Brand({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" style={{ display: "flex", alignItems: "center", gap: compact ? 11 : 13, textDecoration: "none" }}>
      <Image
        src="/brand/logo-emblem.png"
        alt="Buca Yıldız"
        width={compact ? 42 : 50}
        height={compact ? 42 : 50}
        style={{ objectFit: "contain" }}
      />
      <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: compact ? 20 : 23,
            color: "#fff",
            textTransform: "uppercase",
            letterSpacing: "0.02em",
          }}
        >
          Buca Yıldız
        </span>
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontWeight: 600,
            fontSize: compact ? 9.5 : 10.5,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--gold-400)",
            marginTop: 3,
          }}
        >
          Futbol Akademisi
        </span>
      </span>
    </Link>
  );
}

function Social({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <div style={{ display: "flex", gap: 8 }}>
      {SOCIAL.map((s) => (
        <IconButton key={s.name} label={s.label} variant="on-navy" size={size}>
          <BrandGlyph name={s.name} />
        </IconButton>
      ))}
    </div>
  );
}

const navIcon = (name: IconName, size = 17) => <Icon name={name} size={size} />;

export function SiteHeader({ active: activeOverride }: { active?: string }) {
  const [open, setOpen] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [acc, setAcc] = useState<string | null>(null);
  const pathname = usePathname();

  // Auto-highlight the top-level menu item matching the current route.
  const active =
    activeOverride ??
    MENU.filter((m) => m.href !== "/" && (pathname === m.href || pathname.startsWith(m.href + "/")))
      .sort((a, b) => b.href.length - a.href.length)[0]?.label;

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

  // ---------- MOBILE ----------
  if (isMobile) {
    return (
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--navy-800)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <div style={{ padding: "12px 18px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Brand compact />
          <IconButton label="Menü" variant="on-navy" onClick={() => setMobileOpen((v) => !v)}>
            {navIcon(mobileOpen ? "x" : "menu", 20)}
          </IconButton>
        </div>
        {mobileOpen && (
          <div className="by-scroll-on-dark" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", maxHeight: "calc(100vh - 66px)", overflowY: "auto" }}>
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 10, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Button as="a" href="/giris" variant="on-navy" size="md" fullWidth leftIcon={navIcon("lock", 16)}>
                Panele Giriş
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
                        fontWeight: 600,
                        fontSize: 18,
                        textTransform: "uppercase",
                        letterSpacing: "0.03em",
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
                    {expandable && isOpen && (
                      <div style={{ display: "flex", flexDirection: "column", paddingBottom: 6 }}>
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
              <Social size="md" />
            </div>
          </div>
        )}
      </header>
    );
  }

  // ---------- DESKTOP ----------
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "var(--navy-800)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "14px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <Brand />
          <span style={{ width: 1, height: 34, background: "rgba(255,255,255,0.12)" }} />
          <Social />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Button as="a" href="/giris" variant="on-navy" size="sm" leftIcon={navIcon("lock")}>
            Panele Giriş
          </Button>
          <Button as="a" href="/basvuru" variant="accent" size="sm" leftIcon={navIcon("clipboard-list")}>
            Başvuru Formu
          </Button>
        </div>
      </div>
      <nav style={{ background: "var(--navy-900)", borderTop: "1px solid rgba(255,255,255,0.06)" }} onMouseLeave={() => setOpen(null)}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", gap: 2, flexWrap: "wrap" }}>
          {MENU.map((m) => {
            const isActive = m.label === active;
            const isOpen = open === m.label;
            return (
              <div key={m.label} style={{ position: "relative" }} onMouseEnter={() => setOpen(m.items.length ? m.label : null)}>
                <Link
                  href={m.href}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "14px 18px",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: 16,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: isActive ? "#fff" : "var(--navy-200)",
                    borderBottom: `2px solid ${isActive || isOpen ? "var(--gold-500)" : "transparent"}`,
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
    </header>
  );
}
