"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { AGE_GROUPS } from "@/lib/validation";

/**
 * Ana sayfa hızlı randevu formu. Veri BURADA sunucuya gönderilmez (KVKK: onay
 * /basvuru'da alınır). Girilenler sessionStorage ile /basvuru'ya taşınır ve
 * tam formu ön-doldurur — kullanıcı yeniden yazmaz, tek başvuru hattı korunur.
 */
const inputStyle: React.CSSProperties = {
  width: "100%",
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  padding: "10px 15px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--ink-900)",
  outline: "none",
};

export function AppointmentForm({ fill = false }: { fill?: boolean }) {
  const router = useRouter();
  const [v, setV] = useState({ parentName: "", phone: "", childName: "", age: "", ageGroup: "" });
  const [focus, setFocus] = useState<string | null>(null);
  const set = (k: keyof typeof v, val: string) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      sessionStorage.setItem(
        "by_basvuru_prefill",
        JSON.stringify({
          parentName: v.parentName.trim(),
          phone: v.phone.trim(),
          athleteName: v.childName.trim(),
          ageGroup: v.ageGroup,
        }),
      );
    } catch {
      /* sessionStorage yoksa sorun değil, yine de yönlendir */
    }
    router.push("/basvuru");
  };

  const fieldStyle = (k: string): React.CSSProperties => ({
    ...inputStyle,
    border: `1px solid ${focus === k ? "var(--navy-700)" : "var(--border-subtle)"}`,
    boxShadow: focus === k ? "var(--ring-focus)" : "none",
    transition: "all var(--dur-fast)",
  });

  return (
    // fill: sütun yüksekliğini doldurur, alanlar eşit aralıklarla dağılır (gap alt sınırdır)
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 12, ...(fill ? { flex: 1, justifyContent: "space-between" } : {}) }}>
      {[
        { k: "parentName", ph: "Veli Adı Soyadı", mode: undefined },
        { k: "phone", ph: "Telefon Numarası", mode: "tel" as const },
        { k: "childName", ph: "Çocuğun Adı Soyadı", mode: undefined },
        { k: "age", ph: "Yaş", mode: "numeric" as const },
      ].map((f) => (
        <input
          key={f.k}
          style={fieldStyle(f.k)}
          placeholder={f.ph}
          inputMode={f.mode}
          value={v[f.k as keyof typeof v]}
          onChange={(e) => set(f.k as keyof typeof v, e.target.value)}
          onFocus={() => setFocus(f.k)}
          onBlur={() => setFocus(null)}
        />
      ))}

      <div style={{ position: "relative" }}>
        <select
          style={{ ...fieldStyle("ageGroup"), appearance: "none", WebkitAppearance: "none", cursor: "pointer", color: v.ageGroup ? "var(--ink-900)" : "var(--ink-400)", paddingRight: 40 }}
          value={v.ageGroup}
          onChange={(e) => set("ageGroup", e.target.value)}
          onFocus={() => setFocus("ageGroup")}
          onBlur={() => setFocus(null)}
        >
          <option value="">Yaş Grubu Seçiniz</option>
          {AGE_GROUPS.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <span style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--navy-600)", fontSize: 12 }}>▾</span>
      </div>

      <Button type="submit" variant="accent" size="lg" fullWidth style={{ marginTop: 6 }} leftIcon={<Icon name="calendar-check" size={18} />} rightIcon={<Icon name="arrow-right" size={18} />}>
        Ücretsiz Randevu Al
      </Button>
      <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", margin: "2px 0 0", lineHeight: 1.5 }}>
        Bilgileriniz başvuru sayfasına taşınır; onaylar orada alınır.
      </p>
    </form>
  );
}
