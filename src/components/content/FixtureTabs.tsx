import Link from "next/link";

const TABS = [
  { key: "program", label: "Maç Programı", href: "/fikstur" },
  { key: "puan-durumu", label: "Puan Durumu", href: "/fikstur/puan-durumu" },
  { key: "sonuclar", label: "Sonuçlar", href: "/fikstur/sonuclar" },
] as const;

export function FixtureTabs({ active }: { active: "program" | "puan-durumu" | "sonuclar" }) {
  return (
    // Sekmeler dar ekranda alt satıra kırılmaz; tek satırda yana kaydırılır
    <div className="by-overlay-scroll" style={{ display: "flex", gap: 4, flexWrap: "nowrap", overflowX: "auto", marginBottom: 28, borderBottom: "1px solid var(--border-subtle)" }}>
      {TABS.map((t) => {
        const on = t.key === active;
        return (
          <Link
            key={t.key}
            href={t.href}
            style={{
              padding: "12px 18px",
              flex: "none",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: 16,
              letterSpacing: "0.03em",
              textTransform: "uppercase",
              color: on ? "var(--navy-800)" : "var(--text-muted)",
              borderBottom: `2px solid ${on ? "var(--gold-500)" : "transparent"}`,
              textDecoration: "none",
            }}
          >
            {t.label}
          </Link>
        );
      })}
    </div>
  );
}
