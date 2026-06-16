import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Icon } from "@/lib/icons";

export type PanelAthlete = {
  name: string;
  teamName: string;
  position: string;
  number: number | null;
  height: number | null;
  weight: number | null;
  foot: string | null;
  licenseNo: string | null;
  birthYear: number | null;
  photoUrl: string | null;
};

function Metric({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "14px 18px", background: "var(--surface-subtle)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", minWidth: 96 }}>
      <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: ".08em", textTransform: "uppercase", color: "var(--ink-500)" }}>{label}</span>
      <span style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 24, color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        {unit && <span style={{ fontFamily: "var(--font-stat)", fontWeight: 600, fontSize: 13, color: "var(--ink-400)" }}>{unit}</span>}
      </span>
    </div>
  );
}

export function AthleteCard({ athlete }: { athlete: PanelAthlete }) {
  const bmi = athlete.height && athlete.weight ? (athlete.weight / Math.pow(athlete.height / 100, 2)).toFixed(1) : "—";

  return (
    <section>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <span style={{ width: 18, height: 2, background: "var(--gold-500)" }} />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--ink-600)", margin: 0 }}>Sporcu Bilgileri</h2>
      </div>
      <div className="pl-athlete" style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", overflow: "hidden", display: "flex" }}>
        <div className="pl-athlete-photo" style={{ width: 188, flex: "none", position: "relative", background: "var(--grad-navy)", display: "grid", placeItems: "center", minHeight: 160 }}>
          {athlete.photoUrl ? (
            <Image src={athlete.photoUrl} alt={athlete.name} fill style={{ objectFit: "cover" }} sizes="188px" />
          ) : (
            <div style={{ color: "rgba(255,255,255,.18)" }}><Icon name="user-round" size={64} /></div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "var(--scrim-bottom)" }} />
          {athlete.number != null && <span style={{ position: "absolute", left: 14, bottom: 12, fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 42, color: "var(--gold-400)", lineHeight: 1 }}>{athlete.number}</span>}
        </div>
        <div style={{ flex: 1, padding: "24px 26px", display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 34, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1 }}>{athlete.name}</h3>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <Badge tone="navy">{athlete.teamName}</Badge>
                {athlete.position && <Badge tone="gold">{athlete.position}</Badge>}
                {athlete.birthYear && <Badge tone="neutral">{athlete.birthYear} doğumlu</Badge>}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Metric label="Boy" value={athlete.height ? String(athlete.height) : "—"} unit={athlete.height ? "cm" : undefined} />
            <Metric label="Kilo" value={athlete.weight ? String(athlete.weight) : "—"} unit={athlete.weight ? "kg" : undefined} />
            <Metric label="Ayak" value={athlete.foot ?? "—"} />
            <Metric label="VKİ" value={bmi} />
            <Metric label="Lisans" value={athlete.licenseNo ?? "—"} />
          </div>
        </div>
      </div>
    </section>
  );
}
