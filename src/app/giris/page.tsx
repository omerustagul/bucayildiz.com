import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { PanelLoginForm } from "@/components/PanelLoginForm";
import { Icon } from "@/lib/icons";

export const metadata: Metadata = { title: "Panele Giriş" };

export default async function GirisPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  const session = await getSession();
  // Paneller ayrı: yalnız SPORCU oturumu panele yönlenir. Yönetici oturumu
  // varken bu sayfa yine sporcu giriş formunu gösterir (admin'e atmaz).
  if (session?.athleteId) redirect("/panel");

  return (
    <div style={{ minHeight: "100dvh", background: "var(--navy-950)", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="login-card" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", width: "min(940px, 96vw)", background: "#fff", borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-xl)" }}>
        {/* Brand side */}
        <div className="login-brand" style={{ background: "var(--grad-navy-deep)", color: "#fff", padding: "52px 44px", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 40 }}>
          <span aria-hidden style={{ position: "absolute", right: -60, top: "40%", fontSize: 300, color: "rgba(201,162,39,0.05)", lineHeight: 1 }}>★</span>
          <Image src="/brand/logo-emblem.png" alt="Buca Yıldız" width={64} height={64} style={{ objectFit: "contain", position: "relative" }} />
          <div style={{ position: "relative" }}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 38, lineHeight: 0.98, textTransform: "uppercase", color: "#fff", margin: "0 0 12px" }}>
              Kulüp
              <br />
              Paneli
            </h1>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: "var(--navy-100)", maxWidth: 300, margin: 0 }}>
              Sporcu ve veliler için antrenman programı, performans takibi ve kulüp bilgileri tek panelde.
            </p>
          </div>
          <span style={{ position: "relative", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--gold-400)", fontWeight: 600 }}>Buca Yıldız Futbol Akademisi</span>
        </div>

        {/* Form side */}
        <div style={{ padding: "52px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 6px" }}>Panele Giriş</h2>
          <p style={{ fontSize: 14.5, color: "var(--text-muted)", margin: "0 0 28px" }}>Kullanıcı adı veya e-posta ile giriş yapın.</p>
          <PanelLoginForm next={next} />
          <p style={{ textAlign: "center", fontSize: 14, color: "var(--text-muted)", margin: "24px 0 0" }}>
            Henüz üye değil misiniz?{" "}
            <Link href="/basvuru" style={{ fontWeight: 600, color: "var(--navy-700)" }}>
              Başvuru yapın
            </Link>
          </p>
          <div style={{ textAlign: "center", marginTop: 14 }}>
            <Link href="/" style={{ fontSize: 13.5, color: "var(--ink-400)", display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="arrow-left" size={14} /> Ana sayfaya dön
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
