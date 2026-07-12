"use client";

import { useRef, useState, useTransition } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { FileDrop } from "@/components/admin/controls";
import { Icon } from "@/lib/icons";
import { jobApplicationSchema } from "@/lib/validation";
import { CAREER_CONSENT_TEXT } from "@/lib/consent";
import { submitJobApplication } from "@/app/(site)/kurumsal/kariyer/actions";

export type PostingOption = { id: string; title: string };

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

function Field({ label, required, hint, error, htmlFor, children, full }: {
  label: string; required?: boolean; hint?: string; error?: string; htmlFor?: string; children: React.ReactNode; full?: boolean;
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

export function JobApplicationForm({ postings, initialPostingId = "" }: { postings: PostingOption[]; initialPostingId?: string }) {
  const [values, setValues] = useState({ postingId: initialPostingId, name: "", email: "", phone: "", message: "", cvUrl: "" });
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, startTransition] = useTransition();
  // Honeypot: gerçek kullanıcılar görmez/doldurmaz; botlar doldurur.
  const honeypotRef = useRef<HTMLInputElement>(null);

  const set = (k: keyof typeof values, v: string) => {
    setValues((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setFormError(null);
    const payload = { ...values, consent };
    // İstemci tarafı anında doğrulama (sunucu yeniden doğrular).
    const parsed = jobApplicationSchema.safeParse(payload);
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
      const res = await submitJobApplication({ ...payload, website: honeypotRef.current?.value ?? "" });
      if (res.ok) setSent(true);
      else {
        if (res.fieldErrors) setErrors(res.fieldErrors);
        setFormError(res.error);
      }
    });
  };

  if (sent) {
    return (
      <div style={{ padding: "48px 24px", display: "grid", placeItems: "center", textAlign: "center", gap: 14, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)" }}>
        <span style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--green-100)", color: "var(--green-600)", display: "grid", placeItems: "center" }}>
          <Icon name="check" size={30} />
        </span>
        <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 24, textTransform: "uppercase", color: "var(--text-strong)", margin: 0 }}>Başvurunuz Alındı</h3>
        <p style={{ fontSize: 14.5, color: "var(--text-muted)", maxWidth: 380, margin: 0 }}>
          Teşekkürler! Başvurunuzu değerlendirip uygun olması hâlinde sizinle iletişime geçeceğiz.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, textTransform: "uppercase", color: "var(--text-strong)", margin: "0 0 4px" }}>Başvuru Formu</h3>
      <p style={{ fontSize: 13.5, color: "var(--text-muted)", margin: "0 0 22px" }}>
        <span style={{ color: "var(--red-600)" }}>*</span> işaretli alanlar zorunludur.
      </p>

      {/* Honeypot — ekran dışı; yalnız botlar doldurur. */}
      <input ref={honeypotRef} type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />

      <div className="form-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {postings.length > 0 && (
          <Field label="Pozisyon" hint="İsteğe bağlı" htmlFor="job-posting" full>
            <Select
              id="job-posting"
              style={fieldBase}
              value={values.postingId}
              onChange={(e) => set("postingId", e.target.value)}
              placeholder="Genel başvuru"
              options={postings.map((p) => ({ value: p.id, label: p.title }))}
            />
          </Field>
        )}
        <Field label="Ad Soyad" required error={errors.name} htmlFor="job-name">
          <input id="job-name" style={fieldBase} placeholder="Adınız Soyadınız" value={values.name} onChange={(e) => set("name", e.target.value)} />
        </Field>
        <Field label="E-posta" required error={errors.email} htmlFor="job-email">
          <input id="job-email" type="email" style={fieldBase} placeholder="ornek@eposta.com" value={values.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Telefon" hint="İsteğe bağlı" error={errors.phone} htmlFor="job-phone">
          <input id="job-phone" style={fieldBase} placeholder="05xx xxx xx xx" value={values.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Mesaj / Ön Yazı" hint="İsteğe bağlı" error={errors.message} htmlFor="job-message" full>
          <textarea id="job-message" rows={4} style={{ ...fieldBase, resize: "vertical" }} placeholder="Kendinizden kısaca bahsedin" value={values.message} onChange={(e) => set("message", e.target.value)} />
        </Field>
        <Field label="Özgeçmiş (CV)" hint="PDF · en fazla 10 MB · isteğe bağlı" error={errors.cvUrl} full>
          <FileDrop
            value={values.cvUrl || null}
            onChange={(url) => set("cvUrl", url ?? "")}
            kind="document"
            endpoint="/api/kariyer/cv"
            label="PDF yükle (özgeçmiş)"
            hint="Sürükle-bırak veya tıkla"
            icon="clipboard-list"
            aspect="16 / 6"
          />
        </Field>
      </div>

      {/* KVKK aydınlatma + gerçek onay kutusu */}
      <div style={{ marginTop: 20, padding: "14px 16px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--surface-subtle)" }}>
        <div style={{ maxHeight: 128, overflowY: "auto", fontSize: 12.5, lineHeight: 1.6, color: "var(--text-body)", whiteSpace: "pre-wrap", marginBottom: 12 }}>
          {CAREER_CONSENT_TEXT}
        </div>
        <label htmlFor="job-consent" style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13.5, color: "var(--text-body)" }}>
          <input
            id="job-consent"
            type="checkbox"
            checked={consent}
            onChange={(e) => { setConsent(e.target.checked); if (errors.consent) setErrors((x) => ({ ...x, consent: "" })); }}
            style={{ marginTop: 2, width: 18, height: 18, flex: "none", accentColor: "var(--navy-700)" }}
          />
          <span>Yukarıdaki aydınlatma metnini okudum; kişisel verilerimin işlenmesine açık rıza veriyorum. <span style={{ color: "var(--red-600)" }}>*</span></span>
        </label>
        {errors.consent && <span style={{ display: "block", marginTop: 6, fontSize: 12.5, color: "var(--red-600)" }}>{errors.consent}</span>}
      </div>

      {formError && (
        <div style={{ marginTop: 16, padding: "11px 14px", background: "var(--red-100)", border: "1px solid var(--red-600)", borderRadius: "var(--radius-sm)", fontSize: 13.5, color: "var(--red-600)" }}>
          {formError}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <Button type="submit" variant="accent" size="lg" fullWidth disabled={pending} rightIcon={<Icon name="arrow-right" size={18} />}>
          {pending ? "Gönderiliyor…" : "Başvuruyu Gönder"}
        </Button>
      </div>
    </form>
  );
}
