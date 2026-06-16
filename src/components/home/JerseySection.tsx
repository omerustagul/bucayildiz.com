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
    <section style={{ background: "var(--grad-navy)", borderTop: "1px solid var(--navy-600)", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "72px 32px 24px" }}>
        <SectionHeading kicker="Mağaza" title="2025/26 Formalarımız" onDark style={{ marginBottom: 8 }} />
      </div>
      <div className="by-marquee">
        <div className="by-marquee-track">
          {loop.map((k, i) => (
            <Jersey key={i} j={k} />
          ))}
        </div>
      </div>
      <div style={{ textAlign: "center", paddingBottom: 64 }}>
        <span style={{ fontSize: 13, color: "var(--navy-200)", letterSpacing: "0.04em" }}>Resmi formalar yakında kulüp mağazasında · Üzerine gelin, kayma durur</span>
      </div>
    </section>
  );
}
