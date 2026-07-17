"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Icon } from "@/lib/icons";
import { ConsentReaderModal } from "@/components/forms/ConsentReaderModal";
import { captureInitialConsents, panelLogout } from "@/app/panel/actions";
import { ageFromBirthDate, CONSENT_AGE } from "@/lib/validation";

export type GateDoc = { key: string; title: string; summary: string; required: boolean; isConsent: boolean; body: string };

/**
 * KVKK ilk-giriş sözleşme kapısı (Faz 0.1). `panel/layout.tsx`, sporcunun zorunlu
 * rızaları eksikse panel yerine BUNU render eder → server-enforced (JS kapatılarak
 * bile aşılamaz). Tüm aktif sözleşmeler aşağı-kaydır-oku ile imzalanır; zorunlular
 * onaylanmadan "Panele Giriş" pasif. Minörde rızayı VELİ verir (ad sorulur; sunucu
 * da zorlar). Bkz. docs/superpowers/specs/2026-07-17-panel-ilk-giris-*.
 */
export function ConsentGate({ docs, athleteName, birthDate, logoUrl }: { docs: GateDoc[]; athleteName: string; birthDate: string | null; logoUrl: string | null }) {
  const router = useRouter();
  const age = birthDate ? ageFromBirthDate(birthDate) : null;
  const isMinor = age !== null ? age < CONSENT_AGE : null; // null = doğum tarihi bilinmiyor

  const [consents, setConsents] = useState<Record<string, boolean>>(() => Object.fromEntries(docs.map((d) => [d.key, false])));
  const [granterName, setGranterName] = useState(isMinor === false ? athleteName : "");
  const [relation, setRelation] = useState<"veli" | "kendisi">(isMinor === false ? "kendisi" : "veli");
  const [modalDoc, setModalDoc] = useState<GateDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const requiredKeys = docs.filter((d) => d.required).map((d) => d.key);
  const allRequired = requiredKeys.every((k) => consents[k]);
  const nameOk = granterName.trim().length >= 2;
  const canSubmit = allRequired && nameOk && !pending;

  const setConsent = (key: string, val: boolean) => setConsents((c) => ({ ...c, [key]: val }));

  const submit = () => {
    setError(null);
    setPending(true);
    // Minörde daima "veli" (sunucu da zorlar); yetişkin/bilinmiyorda seçim.
    const rel = isMinor === true ? "veli" : relation;
    captureInitialConsents({ consents, granterName: granterName.trim(), granterRelation: rel })
      .then((res) => {
        if (res.ok) router.refresh();
        else { setError(res.error); setPending(false); }
      })
      .catch(() => { setError("Bir hata oluştu. Lütfen tekrar deneyin."); setPending(false); });
  };

  const label = { fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 12.5, color: "var(--ink-600)" } as const;

  return (
    <div style={{ minHeight: "100dvh", background: "var(--navy-950)", display: "flex", flexDirection: "column", alignItems: "center", padding: "clamp(20px, 5vw, 48px) 16px" }}>
      <div style={{ width: "min(680px, 100%)", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* Marka başlığı */}
        <div style={{ textAlign: "center", color: "#fff", marginBottom: 4 }}>
          {logoUrl ? (
            <span style={{ display: "inline-block", position: "relative", width: 64, height: 64 }}>
              <Image src={logoUrl} alt="" fill sizes="64px" style={{ objectFit: "contain" }} />
            </span>
          ) : (
            <span style={{ display: "inline-grid", placeItems: "center", width: 56, height: 56, borderRadius: "50%", background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-heading)", fontWeight: 800 }}>★</span>
          )}
          <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "clamp(20px, 3.5vw, 26px)", textTransform: "uppercase", margin: "14px 0 6px" }}>Sözleşme Onayı</h1>
          <p style={{ fontSize: 14, color: "var(--navy-100)", margin: 0, lineHeight: 1.5 }}>
            <strong style={{ color: "#fff" }}>{athleteName}</strong> için sporcu panelini kullanmaya başlamadan önce
            aşağıdaki KVKK sözleşmelerini okuyup onaylamanız gerekir.
          </p>
        </div>

        {/* Sözleşme kartları */}
        <div style={{ background: "#fff", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {docs.map((d) => {
              const approved = consents[d.key] === true;
              return (
                <div key={d.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", borderBottom: "1px solid var(--border-subtle)" }}>
                  <span style={{ flex: "none", display: "inline-grid", placeItems: "center", width: 34, height: 34, borderRadius: "50%", background: approved ? "var(--grad-gold)" : "var(--surface-subtle)", border: approved ? "none" : "1px solid var(--border-subtle)", color: approved ? "var(--navy-900)" : "var(--ink-400)" }}>
                    <Icon name={approved ? "check" : "file-text"} size={17} />
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 14.5, color: "var(--text-strong)" }}>{d.title}</span>
                      <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: "var(--radius-pill)", background: d.required ? "rgba(201,162,39,0.14)" : "var(--surface-subtle)", color: d.required ? "var(--gold-700)" : "var(--ink-500)", border: `1px solid ${d.required ? "var(--gold-500)" : "var(--border-subtle)"}` }}>
                        {d.required ? "Zorunlu" : "Opsiyonel"}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--text-muted)", margin: "3px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.summary}</p>
                  </div>
                  {approved ? (
                    <button type="button" onClick={() => setConsent(d.key, false)} style={{ flex: "none", border: "none", background: "transparent", cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "var(--ink-500)" }}>Geri al</button>
                  ) : (
                    <button type="button" onClick={() => setModalDoc(d)} style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 5, padding: "8px 13px", borderRadius: "var(--radius-sm)", border: "1px solid var(--navy-700)", background: "var(--navy-700)", color: "#fff", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13 }}>
                      Oku ve Onayla <Icon name="arrow-right" size={14} />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* İmzalayan */}
          <div style={{ padding: "18px", background: "var(--surface-subtle)", display: "flex", flexDirection: "column", gap: 12 }}>
            {isMinor === null && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={label}>Onaylayan</span>
                <div style={{ display: "flex", gap: 8 }}>
                  {(["veli", "kendisi"] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRelation(r)} style={{ flex: 1, padding: "9px 12px", borderRadius: "var(--radius-sm)", border: `1px solid ${relation === r ? "var(--navy-700)" : "var(--border-subtle)"}`, background: relation === r ? "var(--navy-700)" : "#fff", color: relation === r ? "#fff" : "var(--text-body)", cursor: "pointer", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 13.5 }}>
                      {r === "veli" ? "Veli / Vasi" : "Sporcunun kendisi"}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={label}>
                {isMinor === true ? "Veli / vasi adı soyadı" : isMinor === false ? "Ad soyad" : relation === "veli" ? "Veli / vasi adı soyadı" : "Ad soyad"}
              </span>
              <input
                value={granterName}
                onChange={(e) => setGranterName(e.target.value)}
                placeholder={isMinor === true || relation === "veli" ? "Onayı veren velinin adı" : "Adınız soyadınız"}
                style={{ width: "100%", padding: "11px 13px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-subtle)", background: "#fff", fontFamily: "var(--font-body)", fontSize: 14.5, color: "var(--text-strong)" }}
              />
              {(isMinor === true || (isMinor === null && relation === "veli")) && (
                <span style={{ fontSize: 11.5, color: "var(--ink-500)" }}>18 yaş altı sporcuda rızayı yasal olarak veli/vasi verir.</span>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ padding: "11px 14px", borderRadius: "var(--radius-md)", background: "rgba(220,38,38,0.12)", border: "1px solid var(--red-600, #dc2626)", fontSize: 13.5, color: "#fff" }}>{error}</div>
        )}

        {/* Aksiyonlar */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            style={{
              width: "100%", padding: "15px 18px", borderRadius: "var(--radius-md)",
              border: "none", fontFamily: "var(--font-body)", fontWeight: 700, fontSize: 15.5,
              letterSpacing: ".02em", textTransform: "uppercase",
              cursor: canSubmit ? "pointer" : "not-allowed",
              background: canSubmit ? "var(--grad-gold)" : "rgba(255,255,255,0.14)",
              color: canSubmit ? "var(--navy-900)" : "rgba(255,255,255,0.45)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            {pending ? "Kaydediliyor…" : <>Onayla ve Panele Giriş <Icon name="arrow-right" size={17} /></>}
          </button>
          {!canSubmit && !pending && (
            <span style={{ textAlign: "center", fontSize: 12.5, color: "var(--navy-100)" }}>
              {!allRequired ? "Devam etmek için zorunlu sözleşmeleri onaylayın." : "Onaylayan adını girin."}
            </span>
          )}
          <form action={panelLogout} style={{ display: "flex", justifyContent: "center" }}>
            <button type="submit" style={{ border: "none", background: "transparent", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "var(--navy-100)", display: "inline-flex", alignItems: "center", gap: 6, padding: 8 }}>
              <Icon name="log-out" size={15} /> Çıkış Yap
            </button>
          </form>
        </div>
      </div>

      {modalDoc && (
        <ConsentReaderModal
          title={modalDoc.title}
          body={modalDoc.body}
          onApprove={() => setConsent(modalDoc.key, true)}
          onClose={() => setModalDoc(null)}
        />
      )}
    </div>
  );
}
