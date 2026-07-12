"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/lib/icons";
import { logoSrc } from "@/lib/branding";
import { PageTransition } from "@/components/layout/PageTransition";
import { MobileTabBar, type TabBarItem } from "@/components/ui/MobileTabBar";
import { MobileMenu } from "@/components/ui/MobileMenu";
import { Toaster } from "@/components/ui/Toast";
import { logoutAction } from "@/app/admin/actions";

type NavItem = { href: string; label: string; icon: IconName; ready?: boolean };
type NavGroup = { group: string; items: NavItem[] };

const NAV: NavGroup[] = [
  { group: "Genel", items: [{ href: "/admin", label: "Genel Bakış", icon: "layout-dashboard", ready: true }] },
  { group: "Başvurular", items: [{ href: "/admin/basvurular", label: "Başvurular", icon: "inbox", ready: true }] },
  {
    group: "Kulüp",
    items: [
      { href: "/admin/sporcular", label: "Sporcular", icon: "users", ready: true },
      { href: "/admin/performans", label: "Performans", icon: "heart-pulse", ready: true },
      { href: "/admin/beslenme", label: "Beslenme", icon: "clipboard-list", ready: true },
      { href: "/admin/takimlar", label: "Takımlar", icon: "shield", ready: true },
      { href: "/admin/takvim-programi", label: "Takvim Programı", icon: "calendar-check", ready: true },
      { href: "/admin/antrenmanlar", label: "Antrenmanlar", icon: "dumbbell", ready: true },
      { href: "/admin/fikstur", label: "Fikstür", icon: "calendar-days", ready: true },
      { href: "/admin/puan-durumu", label: "Puan Durumu", icon: "trophy", ready: true },
      { href: "/admin/odemeler", label: "Ödemeler", icon: "clipboard-list", ready: true },
    ],
  },
  {
    group: "İçerik & Site",
    items: [
      { href: "/admin/haberler", label: "Haberler / Blog", icon: "newspaper", ready: true },
      { href: "/admin/medya", label: "Medya Kütüphanesi", icon: "images", ready: true },
      { href: "/admin/formalar", label: "Formalar", icon: "shirt", ready: true },
      { href: "/admin/kadro", label: "Teknik Ekip & Yönetim", icon: "user-round", ready: true },
      { href: "/admin/tesisler", label: "Tesisler", icon: "shield-check", ready: true },
      { href: "/admin/kariyer", label: "Kariyer / İş İlanları", icon: "file-text", ready: true },
    ],
  },
  {
    group: "İletişim",
    items: [
      { href: "/admin/mesajlar", label: "Mesaj & Doküman", icon: "send", ready: true },
      { href: "/admin/bildirimler", label: "Bildirimler", icon: "bell", ready: true },
    ],
  },
  {
    group: "Sistem",
    items: [{ href: "/admin/ayarlar", label: "Ayarlar", icon: "settings", ready: true }],
  },
];

/** Kenar çubuğunda görünmeyen ama breadcrumb/dock'ta yer alan sayfalar. */
const EXTRA_ITEMS: NavItem[] = [{ href: "/admin/profil", label: "Profilim", icon: "user-round", ready: true }];

const ALL_ITEMS = [...NAV.flatMap((g) => g.items), ...EXTRA_ITEMS];

/** Mobil dock grupları NAV'dan türetilir — TEK KAYNAK: kenar çubuğuna
 *  eklenen sayfa dock'a otomatik düşer, elle senkron gerektirmez. */
const navGroup = (name: string): NavItem[] => NAV.find((g) => g.group === name)?.items ?? [];
const toTab = ({ href, label, icon }: NavItem) => ({ href, label, icon });

const TABBAR_ITEMS: TabBarItem[] = [
  { kind: "group", id: "kulup", label: "Kulüp", icon: "shield", items: navGroup("Kulüp").map(toTab) },
  { kind: "group", id: "site", label: "Site", icon: "newspaper", items: [...navGroup("Başvurular"), ...navGroup("İçerik & Site")].map(toTab) },
  { kind: "link", href: "/admin", label: "Genel Bakış", icon: "layout-dashboard" },
  { kind: "group", id: "iletisim", label: "İletişim", icon: "bell", items: navGroup("İletişim").map(toTab) },
  { kind: "group", id: "sistem", label: "Sistem", icon: "settings", items: [...navGroup("Sistem"), ...EXTRA_ITEMS].map(toTab) },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(href + "/");
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "BY"
  );
}

export function AdminShell({ user, mobileNav = true, logoUrl, children }: { user: { name: string; role: string }; mobileNav?: boolean; logoUrl?: string | null; children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
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

  const current = ALL_ITEMS.find((i) => isActive(pathname, i.href));
  const breadcrumb = current?.label ?? "Genel Bakış";
  const roleLabel = user.role === "admin" ? "Yönetici" : "Editör";
  const showLabels = isMobile || !collapsed;
  const closeMobile = () => isMobile && setMobileOpen(false);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--surface-subtle)" }}>
      {/* Mobile overlay */}

      {/* Sidebar — konum/animasyon CSS'te (.adm-sidebar): ilk boyamada doğru, flaş yok */}
      <aside
        className="adm-sidebar"
        style={{
          width: isMobile ? 256 : collapsed ? 76 : 256,
          flex: "none",
          background: "var(--navy-950)",
          borderRight: "1px solid rgba(255,255,255,.07)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Link
          href="/admin"
          onClick={closeMobile}
          style={{ padding: showLabels ? "20px 22px 18px" : "20px 0", display: "flex", alignItems: "center", justifyContent: showLabels ? "flex-start" : "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,.07)", textDecoration: "none" }}
        >
          <Image src={logoSrc(logoUrl)} alt="" width={38} height={38} style={{ objectFit: "contain" }} />
          {showLabels && (
            <div style={{ lineHeight: 1 }}>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 16, color: "#fff", textTransform: "uppercase", letterSpacing: ".02em" }}>Buca Yıldız</div>
              <div style={{ fontSize: 9.5, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-400)", marginTop: 3, fontWeight: 600 }}>Yönetim Paneli</div>
            </div>
          )}
        </Link>

        <nav className="by-scroll-on-dark" style={{ padding: showLabels ? 12 : "10px 10px", display: "flex", flexDirection: "column", gap: 4, flex: 1, overflowY: "auto" }}>
          {NAV.map((sec) => (
            <div key={sec.group} style={{ marginBottom: 6 }}>
              {showLabels && <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--navy-400)", padding: "10px 14px 6px" }}>{sec.group}</div>}
              {sec.items.map((n) => {
                const on = isActive(pathname, n.href);
                const disabled = !n.ready;
                const inner = (
                  <>
                    {on && <span style={{ position: "absolute", left: 0, top: 8, bottom: 8, width: 3, background: "var(--grad-gold)", borderRadius: "0 2px 2px 0" }} />}
                    <span style={{ color: on ? "var(--gold-400)" : "var(--navy-300)", display: "inline-flex" }}>
                      <Icon name={n.icon} size={18} />
                    </span>
                    {showLabels && <span style={{ flex: 1 }}>{n.label}</span>}
                    {showLabels && disabled && <span style={{ fontSize: 9, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--navy-400)", border: "1px solid var(--navy-600)", borderRadius: 4, padding: "1px 5px" }}>Yakında</span>}
                  </>
                );
                const base: React.CSSProperties = {
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: showLabels ? "11px 14px" : "12px 0",
                  justifyContent: showLabels ? "flex-start" : "center",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                  fontFamily: "var(--font-body)",
                  fontWeight: on ? 600 : 500,
                  fontSize: 14.5,
                  color: on ? "#fff" : disabled ? "var(--navy-400)" : "var(--navy-200)",
                  background: on ? "rgba(255,255,255,.07)" : "transparent",
                  cursor: disabled ? "not-allowed" : "pointer",
                  opacity: disabled ? 0.7 : 1,
                };
                return disabled ? (
                  <div key={n.href} title={`${n.label} — yakında`} style={base}>
                    {inner}
                  </div>
                ) : (
                  <Link key={n.href} href={n.href} title={n.label} onClick={closeMobile} style={base}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        <div style={{ padding: 12, borderTop: "1px solid rgba(255,255,255,.07)" }}>
          <Link href="/" target="_blank" onClick={closeMobile} title="Siteyi görüntüle" style={{ display: "flex", alignItems: "center", justifyContent: showLabels ? "flex-start" : "center", gap: 12, padding: "11px 14px", borderRadius: "var(--radius-sm)", textDecoration: "none", fontFamily: "var(--font-body)", fontWeight: 500, fontSize: 14, color: "var(--navy-200)" }}>
            <Icon name="external-link" size={18} />
            {showLabels && "Siteyi Görüntüle"}
          </Link>
        </div>
      </aside>

      {/* Main column — sidebar fixed; sol boşluk .adm-main (CSS), daraltmada inline */}
      <div className="adm-main" style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", marginLeft: !isMobile && collapsed ? 76 : undefined }}>
        <header style={{ position: "sticky", top: 0, zIndex: 30, background: "rgba(255,255,255,.9)", backdropFilter: "blur(8px)", borderBottom: "1px solid var(--border-subtle)" }}>
          <div style={{ padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
              <button aria-label="Menü" onClick={() => (isMobile ? setMobileOpen((o) => !o) : setCollapsed((c) => !c))} style={{ display: "grid", placeItems: "center", width: 36, height: 36, flex: "none", borderRadius: "var(--radius-sm)", border: "1px solid transparent", background: "transparent", color: "var(--navy-600)", cursor: "pointer" }}>
                <Icon name={isMobile ? "menu" : "panel-left"} size={18} />
              </button>
              <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13.5, color: "var(--ink-500)", minWidth: 0 }}>
                <span style={{ fontWeight: 600, color: "var(--ink-700)" }}>Yönetim</span>
                <Icon name="chevron-right" size={14} />
                <span style={{ color: "var(--navy-700)", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{breadcrumb}</span>
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, flex: "none" }}>
              <Link href="/admin/profil" title="Profilim" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <div style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--grad-gold)", display: "grid", placeItems: "center", color: "var(--navy-900)", fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15 }}>{initials(user.name)}</div>
                <div className="admin-user-text" style={{ lineHeight: 1.2 }}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{user.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-400)" }}>{roleLabel}</div>
                </div>
              </Link>
              <span className="admin-user-text" style={{ width: 1, height: 30, background: "var(--ink-200)" }} />
              <form action={logoutAction}>
                <button type="submit" title="Çıkış" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-muted)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  <Icon name="log-out" size={15} />
                  <span className="admin-logout-text">Çıkış</span>
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className={mobileNav ? "by-tabbar-pad" : undefined} style={{ padding: "28px clamp(16px, 4vw, 28px) 56px", width: "100%", maxWidth: 1380, margin: "0 auto" }}>
          <PageTransition style={{ display: "flex", flexDirection: "column", gap: 22 }}>{children}</PageTransition>
        </main>
      </div>

      {mobileNav && <MobileTabBar items={TABBAR_ITEMS} homeHref="/admin" hidden={mobileOpen} />}

      {/* Tam ekran mobil menü — soldan drawer'ın yerini aldı */}
      <MobileMenu
        open={isMobile && mobileOpen}
        onClose={() => setMobileOpen(false)}
        header={{ title: user.name, subtitle: roleLabel, initials: initials(user.name) }}
        groups={[...NAV, { group: "Hesap", items: EXTRA_ITEMS }]}
        footer={
          <form action={logoutAction}>
            <button type="submit" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, minHeight: 48, borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14.5, color: "var(--red-600)", cursor: "pointer" }}>
              <Icon name="log-out" size={17} /> Çıkış Yap
            </button>
          </form>
        }
      />

      <Toaster />
    </div>
  );
}
