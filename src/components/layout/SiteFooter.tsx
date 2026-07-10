import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { SocialLinks } from "@/components/layout/SocialLinks";
import type { SocialLink } from "@/lib/social";

/** Buca Yıldız — Footer with the crest overhanging the top edge. */

function Col({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <h4
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 700,
          fontSize: 15,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "var(--gold-400)",
          margin: 0,
        }}
      >
        {title}
      </h4>
      {links.map((l) => (
        <Link key={l.label} href={l.href} className="footer-link" style={{ fontSize: 14 }}>
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export function SiteFooter({ socials = [] }: { socials?: SocialLink[] }) {
  // Arma üstteki bölümün üzerine taşar (beyaz bant yok); taşma payı
  // globals.css'te son bölüme verilen bottom padding ile açılır.
  return (
    <footer style={{ position: "relative", background: "var(--navy-950)" }}>
      {/* Overhanging crest */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: 92,
          height: 92,
          borderRadius: "50%",
          background: "var(--navy-950)",
          display: "grid",
          placeItems: "center",
          border: "1px solid var(--navy-700)",
        }}
      >
        <Image src="/brand/logo-emblem.png" alt="Buca Yıldız" width={78} height={78} style={{ objectFit: "contain" }} />
      </div>
      <div style={{ maxWidth: 1540, margin: "0 auto", padding: "78px 32px 28px" }}>
        <div className="hp-grid-footer" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1.4fr", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 24,
                textTransform: "uppercase",
                color: "#fff",
                letterSpacing: "0.02em",
              }}
            >
              Buca Yıldız
              <span style={{ display: "block", fontSize: 10.5, letterSpacing: "0.26em", color: "var(--gold-400)", marginTop: 4 }}>
                Futbol Akademisi
              </span>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--navy-200)", margin: 0, maxWidth: 320 }}>
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
              { label: "U-18", href: "/takimlar/u18" },
              { label: "U-17", href: "/takimlar/u17" },
              { label: "Seçmeler", href: "/altyapi/secmeler" },
            ]}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <h4
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--gold-400)",
                margin: 0,
              }}
            >
              Bülten
            </h4>
            <p style={{ fontSize: 14, color: "var(--navy-200)", margin: 0 }}>
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
                  fontSize: 14,
                  padding: "10px 12px",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                }}
              />
              <Button variant="accent">Katıl</Button>
            </form>
            <div style={{ fontSize: 13.5, color: "var(--navy-200)", display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="map-pin" size={16} /><span>Buca, İzmir</span>
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                <Icon name="phone" size={16} /><span>+90 232 000 00 00</span>
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12,
            borderTop: "1px solid rgba(255,255,255,0.08)",
            marginTop: 44,
            paddingTop: 22,
          }}
        >
          <span style={{ fontSize: 13, color: "var(--navy-300)" }}>
            © 2026 Buca Yıldız Futbol Akademisi. Tüm hakları saklıdır.
          </span>
          <div style={{ display: "flex", gap: 22 }}>
            <Link href="/kvkk" className="footer-legal-link">
              KVKK
            </Link>
            <Link href="/gizlilik" className="footer-legal-link">
              Gizlilik
            </Link>
            <Link href="/cerez-politikasi" className="footer-legal-link">
              Çerez Politikası
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
