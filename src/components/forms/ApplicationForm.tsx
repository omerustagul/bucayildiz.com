"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Icon } from "@/lib/icons";
import { AGE_GROUPS, applicationSchema } from "@/lib/validation";
import { submitApplication } from "@/app/(site)/basvuru/actions";

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
    <div style={{ display: "flex", flexDirection: "column", gap: 6, gridColumn: full ? "1 / -1" : undefined }}>
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

/**
 * Sözleşme onay popup'ı — mobil bankacılık akışı:
 * metin sonuna kadar kaydırılmadan "Onayla" butonu pasif kalır; sona inince aktifleşir.
 */
function ConsentModal({ doc, onApprove, onClose }: { doc: ConsentDocSummary; onApprove: () => void; onClose: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const [reachedEnd, setReachedEnd] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // Metin zaten kaydırma gerektirmiyorsa (kısa) butonu hemen aktif et.
    const el = bodyRef.current;
    if (el && el.scrollHeight - el.clientHeight <= 8) setReachedEnd(true);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const handleScroll = () => {
    const el = bodyRef.current;
    if (el && el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setReachedEnd(true);
  };

  if (typeof document === "undefined") return null;
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        height: "100dvh",
        background: "rgba(8,18,38,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={doc.title}
        style={{ width: "min(640px, 100%)", maxHeight: "min(86dvh, 760px)", background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--border-subtle)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 18, textTransform: "uppercase", color: "var(--text-strong)", margin: 0, lineHeight: 1.15 }}>{doc.title}</h3>
            <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "5px 0 0" }}>Onaylamak için metni sonuna kadar okuyun.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Kapat" style={{ flex: "none", border: "none", background: "transparent", cursor: "pointer", color: "var(--ink-500)", padding: 4, display: "inline-flex" }}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div
          ref={bodyRef}
          onScroll={handleScroll}
          style={{ flex: 1, overflowY: "auto", padding: "20px 22px", fontSize: 13.8, lineHeight: 1.7, color: "var(--text-body)", whiteSpace: "pre-wrap", background: "var(--surface-subtle)" }}
        >
          {doc.body}
        </div>

        <div style={{ padding: "14px 22px", borderTop: "1px solid var(--border-subtle)", display: "flex", flexDirection: "column", gap: 10, background: "#fff" }}>
          {!reachedEnd && (
            <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, fontSize: 12.5, color: "var(--text-muted)" }}>
              <Icon name="arrow-down" size={14} /> Onaylamak için sözleşmeyi sonuna kadar kaydırın
            </div>
          )}
          <button
            type="button"
            disabled={!reachedEnd}
            onClick={() => {
              onApprove();
              onClose();
            }}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: "var(--radius-sm)",
              border: reachedEnd ? "1px solid var(--gold-600)" : "1px solid var(--border-subtle)",
              fontFamily: "var(--font-body)",
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: ".03em",
              textTransform: "uppercase",
              cursor: reachedEnd ? "pointer" : "not-allowed",
              background: reachedEnd ? "var(--grad-gold)" : "var(--ink-100)",
              color: reachedEnd ? "var(--navy-900)" : "var(--ink-400)",
              transition: "all var(--dur-base) var(--ease-out)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {reachedEnd && <Icon name="check" size={17} />}
            Sözleşmeyi Onayla
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
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
      const p = JSON.parse(raw) as { parentName?: string; phone?: string; athleteName?: string; ageGroup?: string };
      setValues((s) => ({
        ...s,
        parentName: p.parentName || s.parentName,
        phone: p.phone || s.phone,
        athleteName: p.athleteName || s.athleteName,
        ageGroup: p.ageGroup && (AGE_GROUPS as readonly string[]).includes(p.ageGroup) ? p.ageGroup : s.ageGroup,
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
            <input id="app-athleteName" style={fieldBase} placeholder="Öğrencinin adı" value={values.athleteName} onChange={(e) => set("athleteName", e.target.value)} />
          </Field>
          <Field label="Doğum Tarihi" required error={errors.birthDate} htmlFor="app-birthDate">
            <input id="app-birthDate" type="date" style={fieldBase} value={values.birthDate} onChange={(e) => set("birthDate", e.target.value)} />
          </Field>
          <Field label="Yaş Grubu" required error={errors.ageGroup} htmlFor="app-ageGroup">
            <Select
              id="app-ageGroup"
              style={fieldBase}
              value={values.ageGroup}
              onChange={(e) => set("ageGroup", e.target.value)}
              placeholder="Seçiniz"
              options={[...AGE_GROUPS]}
            />
          </Field>
          <Field label="Mevki" hint="İsteğe bağlı" error={errors.position} htmlFor="app-position">
            <input id="app-position" style={fieldBase} placeholder="örn. Forvet" value={values.position} onChange={(e) => set("position", e.target.value)} />
          </Field>
        </div>

        <div style={{ height: 26 }} />
        <SectionLabel>Veli İletişim</SectionLabel>
        <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Veli Ad Soyad" required error={errors.parentName} htmlFor="app-parentName">
            <input id="app-parentName" style={fieldBase} placeholder="Veli adı" value={values.parentName} onChange={(e) => set("parentName", e.target.value)} />
          </Field>
          <Field label="Telefon" required error={errors.phone} htmlFor="app-phone">
            <input id="app-phone" style={fieldBase} placeholder="05xx xxx xx xx" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
          </Field>
          <Field label="E-posta" hint="İsteğe bağlı" error={errors.email} full htmlFor="app-email">
            <input id="app-email" type="email" style={fieldBase} placeholder="ornek@eposta.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
        </div>

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
        <ConsentModal doc={modalDoc} onApprove={() => setConsent(modalDoc.key, true)} onClose={() => setModalDoc(null)} />
      )}
    </div>
  );
}
