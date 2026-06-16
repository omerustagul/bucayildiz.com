import Image from "next/image";

/**
 * Buca Yıldız — FixtureCard
 * Güncel fikstür kartı. Two teams, competition, date/time or score.
 * Stateless → server component.
 */
type TeamSide = { name?: string; crest?: string; score?: number; time?: string };

function TeamCrest({ crest, name }: { crest?: string; name?: string }) {
  if (crest) return <Image src={crest} alt={name ?? ""} width={52} height={52} style={{ objectFit: "contain" }} />;
  const initials = (name ?? "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        display: "grid",
        placeItems: "center",
        background: "var(--navy-50)",
        border: "1.5px solid var(--ink-200)",
        fontFamily: "var(--font-heading)",
        fontWeight: 700,
        fontSize: 18,
        color: "var(--navy-700)",
        textTransform: "uppercase",
      }}
    >
      {initials}
    </div>
  );
}

export function FixtureCard({
  competition = "Lig Maçı",
  date,
  venue,
  status = "upcoming",
  home = {},
  away = {},
  style = {},
}: {
  competition?: string;
  date?: string;
  venue?: string;
  status?: "upcoming" | "live" | "finished";
  home?: TeamSide;
  away?: TeamSide;
  style?: React.CSSProperties;
}) {
  const finished = status === "finished";
  const live = status === "live";
  const center =
    live || finished ? (
      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 34, color: "var(--navy-900)", fontVariantNumeric: "tabular-nums" }}>
        {home.score ?? 0}–{away.score ?? 0}
      </span>
    ) : (
      <span style={{ fontFamily: "var(--font-stat)", fontWeight: 700, fontSize: 26, color: "var(--navy-600)", fontVariantNumeric: "tabular-nums" }}>
        {home.time || "VS"}
      </span>
    );

  return (
    <div
      style={{
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        boxShadow: "var(--shadow-sm)",
        ...style,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: "var(--navy-800)", color: "#fff" }}>
        <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>{competition}</span>
        {live ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--red-600)", animation: "byPulse 1.4s var(--ease-in-out) infinite" }} />
            Canlı
          </span>
        ) : (
          <span style={{ fontSize: 12, color: "var(--navy-200)", fontWeight: 500 }}>{finished ? "Tamamlandı" : date}</span>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", gap: 12, padding: "22px 16px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <TeamCrest crest={home.crest} name={home.name} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, textTransform: "uppercase", color: "var(--text-strong)", lineHeight: 1.1 }}>{home.name}</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, minWidth: 70 }}>{center}</div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, textAlign: "center" }}>
          <TeamCrest crest={away.crest} name={away.name} />
          <span style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: 16, textTransform: "uppercase", color: "var(--text-strong)", lineHeight: 1.1 }}>{away.name}</span>
        </div>
      </div>
      {venue && (
        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border-subtle)", textAlign: "center", fontSize: 12.5, color: "var(--ink-500)", letterSpacing: "0.02em" }}>
          {venue}
        </div>
      )}
    </div>
  );
}
