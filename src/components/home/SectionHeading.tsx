/**
 * Buca Yıldız — SectionHeading
 * Eyebrow kicker + uppercase condensed title, optional action.
 */
export function SectionHeading({
  kicker,
  title,
  action,
  onDark = false,
  kickerColor = "gold",
  align = "left",
  style = {},
  titleStyle,
}: {
  kicker?: string;
  title: string;
  action?: React.ReactNode;
  onDark?: boolean;
  /** Kicker metni rengi. "gold" (varsayılan) marka aksanı; "text" gövde metni
   *  rengini kullanır — başlığın altın aksanla yarışmaması istendiğinde.
   *  Altın çizgi her iki durumda da kalır (marka işareti). */
  kickerColor?: "gold" | "text";
  align?: "left" | "center";
  style?: React.CSSProperties;
  titleStyle?: React.CSSProperties;
}) {
  const titleColor = onDark ? "#fff" : "var(--text-strong)";
  const kickerTextColor =
    kickerColor === "text"
      ? onDark
        ? "#fff"
        : "var(--text-strong)"
      : onDark
        ? "var(--gold-400)"
        : "var(--gold-700)";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: align === "center" ? "center" : "space-between",
        gap: "var(--space-6)",
        flexWrap: "wrap",
        textAlign: align,
        ...style,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: align === "center" ? "center" : "flex-start" }}>
        {kicker && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-body)",
              fontWeight: 600,
              fontSize: 13,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: kickerTextColor,
            }}
          >
            <span style={{ width: 22, height: 2, background: "var(--gold-500)" }} />
            {kicker}
          </span>
        )}
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 700,
            fontSize: "var(--text-h2)",
            lineHeight: 1.05,
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
            color: titleColor,
            margin: 0,
            ...titleStyle,
          }}
        >
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}
