import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { SectionHeading } from "./SectionHeading";

/** Buca Yıldız — Formalar marquee. DB'deki aktif formalardan beslenir. */

const JERSEY_CLIP = "polygon(30% 0,42% 8%,58% 8%,70% 0,100% 14%,87% 39%,78% 30%,78% 100%,22% 100%,22% 30%,13% 39%,0 14%)";

type J = { id: string; name: string; primary: string; accent: string; imageUrl: string | null };

function Jersey({ j }: { j: J }) {
  return (
    <div className="by-jersey">
      {j.imageUrl ? (
        <div style={{ position: "relative", width: 180, height: 210 }}>
          <Image src={j.imageUrl} alt={j.name} fill style={{ objectFit: "contain", filter: "drop-shadow(0 22px 30px rgba(0,0,0,.35))" }} sizes="180px" />
        </div>
      ) : (
        <div style={{ position: "relative", width: 180, height: 210, filter: "drop-shadow(0 22px 30px rgba(0,0,0,.35))" }}>
          <div style={{ position: "absolute", inset: 0, clipPath: JERSEY_CLIP, background: j.primary }} />
          <div style={{ position: "absolute", top: "7%", left: "42%", width: "16%", height: "5%", background: j.accent, borderRadius: "0 0 40% 40%" }} />
          <span style={{ position: "absolute", top: "34%", left: 0, right: 0, textAlign: "center", fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 64, color: j.accent, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>10</span>
        </div>
      )}
      <span className="by-jersey-label">{j.name}</span>
    </div>
  );
}

export async function JerseySection() {
  const jerseys = (await prisma.jersey.findMany({ where: { active: true }, orderBy: { sort: "asc" } })) as J[];
  if (jerseys.length === 0) return null;

  const loop = [...jerseys, ...jerseys, ...jerseys];

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--surface-page)", isolation: "isolate" }}>
      {/* Sol-üstten sağ-alta eğimli lacivert bant + silik marka motifi (yıldız + top).
          Bant tüm bölümü kaplar; açık zemin yalnız sağ-üst ve sol-alt köşe üçgenlerinde görünür. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "var(--grad-navy)",
          // Bandın ÜST kenarı başlığın ALTINDAN başlar: başlık+kicker açık zeminde
          // kalır → koyu metin okunur (ölçüldü: başlık altı %20/1280px, %17.2/375px;
          // bant %3'ten başlayınca kontrast 1.27:1 idi — görünmezdi). Eğim korunur (5 puan).
          clipPath: "polygon(0% 1%, 100% 5%, 100% 86%, 0% 82%)",
          overflow: "hidden",
          zIndex: -1,
          filter: "drop-shadow(0 18px 38px rgba(14,33,72,.18))",
        }}
      >
        {/* Modern kafes doku — lacivert bölümlerle aynı desen (by-navy-sec::before) */}
        <div className="by-navy-sec" style={{ position: "absolute", inset: 0 }} />
      </div>

      <div>
        <div style={{ maxWidth: 1540, margin: "0 auto", padding: "28px clamp(16px, 5vw, 32px) 4px" }}>
          <SectionHeading
            kicker="Mağaza"
            title="2025/26 Formalarımız"
            align="center"
            onDark
            style={{ marginBottom: 4 }}
          />
        </div>
        <div className="by-marquee">
          <div className="by-marquee-track">
            {loop.map((k, i) => (
              <Jersey key={i} j={k} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", padding: "16px 0 36px" }}>
          <span style={{ fontSize: 13, color: "#fff", letterSpacing: "0.04em" }}>Resmi formalar yakında kulüp mağazasında · Üzerine gelin, kayma durur</span>
        </div>
      </div>
    </section>
  );
}
