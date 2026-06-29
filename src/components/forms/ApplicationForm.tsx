"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { AGE_GROUPS, applicationSchema } from "@/lib/validation";
import { submitApplication } from "@/app/(site)/basvuru/actions";

export type ConsentDocSummary = {
  key: string;
  title: string;
  summary: string;
  required: boolean;
  isConsent: boolean;
};

type FormValues = {
  athleteName: string;
  birthDate: string;
  ageGroup: string;
  position: string;
  parentName: string;
  phone: string;
  email: string;
  consents: Record<string, boolean>;
};

const EMPTY: Omit<FormValues, "consents"> = {
  athleteName: "",
  birthDate: "",
  ageGroup: "",
  position: "",
  parentName: "",
  phone: "",
  email: "",
};

const fieldBase: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: 14.5,
  padding: "11px 13px",
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)",
  background: "var(--surface-card)",
  color: "var(--text-body)",
  width: "100%",
};

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 600,
        fontSize: 15,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "var(--gold-700)",
        margin: "0 0 14px",
      }}
    >
      {children}
    </div>
  );
}

function Field({
  label,
  required,
  hint,
  error,
  children,
  full,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : undefined }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
        {label} {required && <span style={{ color: "var(--red-600)" }}>*</span>}
        {hint && <span style={{ fontWeight: 400, color: "var(--text-muted)" }}> · {hint}</span>}
      </label>
      {children}
      {error && <span style={{ fontSize: 12.5, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}

function initConsents(docs: ConsentDocSummary[]): Record<string, boolean> {
  const c: Record<string, boolean> = {};
  for (const d of docs) c[d.key] = false;
  return c;
}

export function ApplicationForm({ consentDocs }: { consentDocs: ConsentDocSummary[] }) {
  const [values, setValues] = useState<FormValues>({ ...EMPTY, consents: initConsents(consentDocs) });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof Omit<FormValues, "consents">>(key: K, val: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const setConsent = (key: string, val: boolean) => {
    setValues((v) => ({ ...v, consents: { ...v.consents, [key]: val } }));
    if (errors.consents) setErrors((e) => ({ ...e, consents: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setFormError(null);

    // İstemci tarafı anında doğrulama (sunucu yeniden doğrular).
    const parsed = applicationSchema.safeParse(values);
    if (!parsed.success) {
      const fe: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0];
        if (typeof key === "string" && !fe[key]) fe[key] = issue.message;
      }
      setErrors(fe);
      setFormError("Lütfen işaretli alanları kontrol edin.");
      return;
    }

    startTransition(async () => {
      const res = await submitApplication(values);
      if (res.ok) {
        setSent(true);
      } else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        setFormError(res.error);
      }
    });
  };

  if (sent) {
    return (
      <div style={{ padding: "56px 24px", display: "grid", placeItems: "center", textAlign: "center", minHeight: 480, alignContent: "center", gap: 14 }}>
        <span style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-600)", display: "grid", placeItems: "center" }}>
          <Icon name="check" size={34} />
        </span>
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 30, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Başvurunuz Alındı</h2>
        <p style={{ fontSize: 15, color: "var(--text-muted)", maxWidth: 360, margin: 0 }}>
          Teşekkürler! Antrenörlerimiz 48 saat içinde sizinle iletişime geçerek deneme antrenmanı randevunuzu oluşturacak.
        </p>
        <Button
          variant="secondary"
          onClick={() => {
            setValues({ ...EMPTY, consents: initConsents(consentDocs) });
            setSent(false);
          }}
        >
          Yeni Başvuru
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "44px 48px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 4px" }}>Başvuru Formu</h2>
      <p style={{ fontSize: 14.5, color: "var(--text-muted)", margin: "0 0 26px" }}>
        <span style={{ color: "var(--red-600)" }}>*</span> işaretli alanlar zorunludur.
      </p>

      <form onSubmit={onSubmit} noValidate>
        <SectionLabel>Sporcu Bilgileri</SectionLabel>
        <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Ad Soyad" required error={errors.athleteName}>
            <input style={fieldBase} placeholder="Öğrencinin adı" value={values.athleteName} onChange={(e) => set("athleteName", e.target.value)} />
          </Field>
          <Field label="Doğum Tarihi" required error={errors.birthDate}>
            <input type="date" style={fieldBase} value={values.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
          <Field label="Yaş Grubu" required error={errors.ageGroup}>
            <select style={fieldBase} value={values.ageGroup} onChange={(e) => set("ageGroup", e.target.value)}>
              <option value="">Seçiniz</option>
              {AGE_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Mevki" hint="İsteğe bağlı" error={errors.position}>
            <input style={fieldBase} placeholder="örn. Forvet" value={values.position} onChange={(e) => set("position", e.target.value)} />
          </Field>
        </div>

        <div style={{ height: 26 }} />
        <SectionLabel>Veli İletişim</SectionLabel>
        <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Veli Ad Soyad" required error={errors.parentName}>
            <input style={fieldBase} placeholder="Veli adı" value={values.parentName} onChange={(e) => set("parentName", e.target.value)} />
          </Field>
          <Field label="Telefon" required error={errors.phone}>
            <input style={fieldBase} placeholder="05xx xxx xx xx" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="E-posta" hint="İsteğe bağlı" error={errors.email} full>
            <input type="email" style={fieldBase} placeholder="ornek@eposta.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>

        <div style={{ height: 26 }} />
        <SectionLabel>KVKK Onayları</SectionLabel>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "-8px 0 14px", lineHeight: 1.5 }}>
          Sporcu reşit değilse onaylar veli tarafından verilir. Her onay ayrıdır; metni
          görmek için başlığa dokunun. <span style={{ color: "var(--red-600)" }}>*</span> zorunludur.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {consentDocs.map((d) => (
            <label
              key={d.key}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                cursor: "pointer",
                fontSize: 13.5,
                lineHeight: 1.5,
                color: "var(--text-body)",
                padding: "11px 13px",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--border-subtle)",
                background: d.required ? "var(--surface-subtle)" : "var(--surface-card)",
              }}
            >
              <input
                type="checkbox"
                checked={values.consents[d.key] ?? false}
                onChange={(e) => setConsent(d.key, e.target.checked)}
                style={{ marginTop: 2, width: 17, height: 17, accentColor: "var(--navy-700)", flex: "none" }}
              />
              <span>
                {d.summary}{" "}
                {d.required && <span style={{ color: "var(--red-600)" }}>*</span>}
                {!d.required && <span style={{ color: "var(--text-muted)", fontSize: 12 }}> (opsiyonel)</span>}
                <br />
                <Link href={`/sozlesmeler/${d.key}`} target="_blank" style={{ color: "var(--text-link)", textDecoration: "underline", fontSize: 12.5 }}>
                  {d.title} — metni oku
                </Link>
              </span>
            </label>
          ))}
        </div>
        {errors.consents && <span style={{ display: "block", marginTop: 8, fontSize: 12.5, color: "var(--red-600)" }}>{errors.consents}</span>}
        <div style={{ height: 22 }} />

        {formError && (
          <div style={{ marginBottom: 16, padding: "11px 14px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13.5, color: "var(--red-600)" }}>
            {formError}
          </div>
        )}

        <Button type="submit" variant="accent" size="lg" fullWidth disabled={pending} rightIcon={<Icon name="arrow-right" size={18} />}>
          {pending ? "Gönderiliyor…" : "Başvuruyu Gönder"}
        </Button>
      </form>
    </div>
  );
}
