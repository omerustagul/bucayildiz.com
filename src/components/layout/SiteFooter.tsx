import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { logoSrc } from "@/lib/branding";
import { SocialLinks } from "@/components/layout/SocialLinks";
import type { SocialLink } from "@/lib/social";

/** Buca Yıldız — Footer. Üst kenarda takım renkleri şeridi, ortada altın
 *  halkalı taşan arma; kompakt üç bölge: kolonlar → ayraç → telif barı. */

function ColTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 style={{ display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 13.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-400)", margin: 0 }}>
      {children}
      <span aria-hidden="true" style={{ width: 18, height: 2, background: "var(--gold-500)", opacity: 0.8 }} />
    </h4>
  );
}

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <ColTitle>{title}</ColTitle>
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="footer-link" style={{ fontSize: 13.5 }}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteFooter({ socials = [], logoUrl, address, phone }: { socials?: SocialLink[]; logoUrl?: string | null; address?: string | null; phone?: string | null }) {
  return (
    <footer style={{ position: "relative", background: "linear-gradient(180deg, var(--navy-900) 0%, var(--navy-950) 30%)" }}>
      {/* Üst kenar: takım renkleri şeridi (header'daki dilin aynası) */}
      <div aria-hidden="true" style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: "linear-gradient(90deg, var(--gold-500) 0 50%, var(--navy-500) 50% 100%)" }} />

      {/* Taşan arma — altın halkalı lacivert disk */}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 88,
          height: 88,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
        }}
      >
        <Image src={logoSrc(logoUrl)} alt="Buca Yıldız" width={72} height={72} style={{ objectFit: "contain" }} />
      </div>

      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "70px 32px 20px" }}>
        <div className="hp-grid-footer" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 32 }}>
          {/* Marka bloğu */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 23, textTransform: "uppercase", color: "#fff", letterSpacing: "0.02em", lineHeight: 1 }}>
              Buca Yıldız
              <span style={{ display: "block", fontSize: 10.5, letterSpacing: "0.1em", color: "var(--gold-400)", marginTop: 6 }}>
                Futbol Akademisi
              </span>
            </div>
            <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.62)", margin: 0, maxWidth: 320 }}>
              İzmir Buca&apos;da geleceğin futbolcularını disiplin, saygı ve takım ruhuyla yetiştiren altyapı kulübü.
            </p>
            <SocialLinks links={socials} />
          </div>

          <Col
            title="Kurumsal"
            links={[
              { label: "Hakkımızda", href: "/kurumsal/hakkimizda" },
              { label: "Antrenörler", href: "/altyapi/antrenorler" },
              { label: "Tesisler", href: "/kurumsal/tesisler" },
              { label: "Kariyer", href: "/kurumsal/kariyer" },
            ]}
          />
          <Col
            title="Akademi"
            links={[
              { label: "A Takım", href: "/takimlar/a-takim" },
              { label: "U-18", href: "/takimlar/u-18" },
              { label: "U-17", href: "/takimlar/u-17" },
              { label: "Seçmeler", href: "/altyapi/secmeler" },
            ]}
          />

          {/* Bülten + iletişim */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <ColTitle>Bülten</ColTitle>
            <p style={{ fontSize: 13.5, lineHeight: 1.55, color: "rgba(255, 255, 255, 0.62)", margin: 0 }}>
              Kulüpten haberler ve maç duyuruları için kayıt olun.
            </p>
            <form style={{ display: "flex", gap: 8 }}>
              <input
                type="email"
                placeholder="E-posta adresiniz"
                aria-label="E-posta adresiniz"
                style={{
                  flex: 1,
                  minWidth: 0,
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  padding: "9px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255, 255, 255, 0.16)",
                  background: "rgba(255, 255, 255, 0.06)",
                  color: "#fff",
                }}
              />
              <Button variant="accent" size="sm">Katıl</Button>
            </form>
            {/* Adres/telefon admin ayarlarından beslenir (tek kaynak). Boşsa satır
                gösterilmez — sahte iletişim bilgisi basmayız (bkz. /iletisim aynı kaynak). */}
            {(address || phone) && (
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.62)", display: "flex", flexDirection: "column", gap: 7, marginTop: 2 }}>
                {address && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Icon name="map-pin" size={15} style={{ color: "var(--gold-400)" }} /><span>{address}</span>
                  </span>
                )}
                {phone && (
                  <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="footer-link" style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <Icon name="phone" size={15} style={{ color: "var(--gold-400)" }} /><span>{phone}</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Telif barı */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            marginTop: 30,
            paddingTop: 16,
          }}
        >
          <span style={{ fontSize: 12.5, color: "rgba(255, 255, 255, 0.45)" }}>
            © 2026 Buca Yıldız Futbol Akademisi. Tüm hakları saklıdır.
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <Link href="/kvkk" className="footer-legal-link">KVKK</Link>
            <span aria-hidden="true" style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255, 255, 255, 0.25)" }} />
            <Link href="/gizlilik" className="footer-legal-link">Gizlilik</Link>
            <span aria-hidden="true" style={{ width: 3, height: 3, borderRadius: "50%", background: "rgba(255, 255, 255, 0.25)" }} />
            <Link href="/cerez-politikasi" className="footer-legal-link">Çerez Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
