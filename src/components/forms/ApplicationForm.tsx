"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/lib/icons";
import { applicationSchema, ageFromBirthDate, CONSENT_AGE } from "@/lib/validation";
import { submitApplication } from "@/app/(site)/basvuru/actions";
import { ConsentReaderModal } from "@/components/forms/ConsentReaderModal";

export type ConsentDocSummary = {
  key: string;
  title: string;
  summary: string;
  required: boolean;
  isConsent: boolean;
  body: string;
};

type FormValues = {
  athleteName: string;
  birthDate: string;
  currentClub: string;
  position: string;
  parentName: string;
  phone: string;
  email: string;
  consents: Record<string, boolean>;
};

const EMPTY: Omit<FormValues, "consents"> = {
  athleteName: "",
  birthDate: "",
  currentClub: "",
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
        fontSize: 17,
        letterSpacing: "0.0em",
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
  htmlFor,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  full?: boolean;
  /** İlişkili input/Select id'si — ekran okuyucu etiketi bu alana bağlar. */
  htmlFor?: string;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0, gridColumn: full ? "1 / -1" : undefined }}>
      <label htmlFor={htmlFor} style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>
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
  const [modalDoc, setModalDoc] = useState<ConsentDocSummary | null>(null);
  // Honeypot: gerçek kullanıcılar bu gizli alanı görmez/doldurmaz; botlar doldurur.
  const honeypotRef = useRef<HTMLInputElement>(null);

  // Ana sayfa hızlı randevu formundan gelen bilgileri ön-doldur (yalnızca client; URL/sunucu kullanılmaz).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("by_basvuru_prefill");
      if (!raw) return;
      const p = JSON.parse(raw) as { parentName?: string; phone?: string; athleteName?: string };
      setValues((s) => ({
        ...s,
        parentName: p.parentName || s.parentName,
        phone: p.phone || s.phone,
        athleteName: p.athleteName || s.athleteName,
      }));
      sessionStorage.removeItem("by_basvuru_prefill");
    } catch {
      /* sessionStorage yoksa/parse hatasında sessizce geç */
    }
  }, []);

  const set = <K extends keyof Omit<FormValues, "consents">>(key: K, val: FormValues[K]) => {
    setValues((v) => ({ ...v, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const setConsent = (key: string, val: boolean) => {
    setValues((v) => ({ ...v, consents: { ...v.consents, [key]: val } }));
    if (errors.consents) setErrors((e) => ({ ...e, consents: "" }));
  };

  // Yaş dalı (HUKUKİ): doğum tarihinden yaş → <18 ise altta veli bölümü animasyonla
  // açılır ve ZORUNLU olur (rızayı veli verir); ≥18 ise sporcunun kendi iletişimi görünür.
  const age = ageFromBirthDate(values.birthDate);
  const isMinor = age !== null && age < CONSENT_AGE;

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
      const res = await submitApplication({ ...values, website: honeypotRef.current?.value ?? "" });
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
    <div style={{ padding: "28px" }}>
      <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 28, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 4px" }}>Başvuru Formu</h2>
      <p style={{ fontSize: 14.5, color: "var(--text-muted)", margin: "0 0 26px" }}>
        <span style={{ color: "var(--red-600)" }}>*</span> işaretli alanlar zorunludur.
      </p>

      <form onSubmit={onSubmit} noValidate>
        {/* Honeypot — ekran dışı, klavye/erişilebilirlik dışı; yalnız botlar doldurur. */}
        <input
          ref={honeypotRef}
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
        />
        <SectionLabel>Sporcu Bilgileri</SectionLabel>
        <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Ad Soyad" required error={errors.athleteName} htmlFor="app-athleteName">
            <input id="app-athleteName" style={fieldBase} placeholder="Sporcunun adı" value={values.athleteName} onChange={(e) => set("athleteName", e.target.value)} />
          </Field>
          <Field label="Doğum Tarihi" required error={errors.birthDate} htmlFor="app-birthDate">
            <input id="app-birthDate" type="date" style={fieldBase} value={values.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
          <Field label="Mevcut Kulüp" hint="Var ise — zorunlu değil" error={errors.currentClub} htmlFor="app-currentClub">
            <input id="app-currentClub" style={fieldBase} placeholder="örn. bağımsız / kulüp adı" value={values.currentClub} onChange={(e) => set("currentClub", e.target.value)} />
          </Field>
          <Field label="Tercih Edilen Mevki" hint="İsteğe bağlı" error={errors.position} htmlFor="app-position">
            <input id="app-position" style={fieldBase} placeholder="örn. Forvet" value={values.position} onChange={(e) => set("position", e.target.value)} />
          </Field>
          {/* Yetişkin (≥18) veya henüz yaş yok: iletişim sporcunun kendisine ait. */}
          {!isMinor && (
            <>
              <Field label="Telefon" required error={errors.phone} htmlFor="app-phone">
                <input id="app-phone" style={fieldBase} placeholder="05xx xxx xx xx" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="E-posta" hint="İsteğe bağlı" error={errors.email} htmlFor="app-email">
                <input id="app-email" type="email" style={fieldBase} placeholder="ornek@eposta.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </>
          )}
        </div>

        {/* Yaş <18: rızayı ve iletişimi VELİ verir — bölüm animasyonla açılır, alanlar zorunlu. */}
        {isMinor && (
          <div key="veli-section" className="app-veli-reveal">
            <div style={{ height: 26 }} />
            <SectionLabel>Veli İletişim</SectionLabel>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "-8px 0 14px", lineHeight: 1.5 }}>
              Sporcu 18 yaşından küçük — KVKK rızasını ve iletişimi <strong>veli</strong> verir. Bu alanlar zorunludur.
            </p>
            <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              <Field label="Veli Ad Soyad" required error={errors.parentName} htmlFor="app-parentName">
                <input id="app-parentName" style={fieldBase} placeholder="Veli adı" value={values.parentName} onChange={(e) => set("parentName", e.target.value)} />
              </Field>
              <Field label="Veli Telefon" required error={errors.phone} htmlFor="app-phone">
                <input id="app-phone" style={fieldBase} placeholder="05xx xxx xx xx" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
              </Field>
              <Field label="Veli E-posta" hint="İsteğe bağlı" error={errors.email} full htmlFor="app-email">
                <input id="app-email" type="email" style={fieldBase} placeholder="ornek@eposta.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

        <div style={{ height: 26 }} />
        <SectionLabel>KVKK Onayları</SectionLabel>
        <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "-8px 0 14px", lineHeight: 1.5 }}>
          Sporcu reşit değilse onaylar veli tarafından verilir. Onaylamak için kutuya dokunun;
          açılan sözleşmeyi sonuna kadar okuyup onaylayın. <span style={{ color: "var(--red-600)" }}>*</span> zorunludur.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {consentDocs.map((d) => {
            const checked = values.consents[d.key] ?? false;
            const toggle = () => (checked ? setConsent(d.key, false) : setModalDoc(d));
            return (
              <div
                key={d.key}
                role="checkbox"
                aria-checked={checked}
                aria-label={d.summary}
                tabIndex={0}
                onClick={toggle}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggle();
                  }
                }}
                style={{
                  display: "flex",
                  gap: 11,
                  alignItems: "flex-start",
                  cursor: "pointer",
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "var(--text-body)",
                  padding: "12px 14px",
                  borderRadius: "var(--radius-sm)",
                  border: `1px solid ${checked ? "var(--green-600)" : "var(--border-subtle)"}`,
                  background: checked ? "var(--green-100)" : d.required ? "var(--surface-subtle)" : "var(--surface-card)",
                  transition: "all var(--dur-fast) var(--ease-out)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    flex: "none",
                    marginTop: 1,
                    width: 19,
                    height: 19,
                    borderRadius: 5,
                    border: `2px solid ${checked ? "var(--green-600)" : "var(--ink-300)"}`,
                    background: checked ? "var(--green-600)" : "#fff",
                    display: "grid",
                    placeItems: "center",
                    color: "#fff",
                    transition: "all var(--dur-fast)",
                  }}
                >
                  {checked && <Icon name="check" size={13} />}
                </span>
                <span>
                  {d.summary}{" "}
                  {d.required ? <span style={{ color: "var(--red-600)" }}>*</span> : <span style={{ color: "var(--text-muted)", fontSize: 12 }}> (opsiyonel)</span>}
                  <br />
                  <span style={{ color: checked ? "var(--green-600)" : "var(--text-link)", textDecoration: checked ? "none" : "underline", fontSize: 12.5, fontWeight: checked ? 600 : 400 }}>
                    {checked ? "✓ Onaylandı — kaldırmak için tıklayın" : `${d.title} — oku ve onayla`}
                  </span>
                </span>
              </div>
            );
          })}
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

      {modalDoc && (
        <ConsentReaderModal title={modalDoc.title} body={modalDoc.body} onApprove={() => setConsent(modalDoc.key, true)} onClose={() => setModalDoc(null)} />
      )}
    </div>
  );
}
