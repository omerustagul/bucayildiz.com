/** Admin formları için paylaşılan, stillenmiş alan yapı taşları. */

export const inputStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  padding: "10px 12px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--text-body)",
  width: "100%",
};

export function Labeled({
  label,
  required,
  hint,
  error,
  span,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: span ? "1 / -1" : undefined }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
        {label} {required && <span style={{ color: "var(--red-600)" }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: "var(--text-muted)" }}> · {hint}</span>}
      </label>
      {children}
      {error && <span className="by-anim-error" style={{ fontSize: 12.5, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}

export function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-sm)", padding: "clamp(20px,3vw,32px)", maxWidth: 760 }}>
      {children}
    </div>
  );
}
