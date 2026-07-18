"use client";

import { useState } from "react";
import { Panel } from "@/components/admin/kit";
import { Icon } from "@/lib/icons";
import { purgeExpiredData } from "@/app/admin/(panel)/ayarlar/retention-actions";

export type RetentionRow = {
  key: string;
  label: string;
  /** İnsan-okur kural ("12 aydan eski, sporcuya dönüştürülmemiş"). */
  rule: string;
  count: number;
  /** İlk birkaç örnek — PII MASKELİ (sunucuda maskelenir). */
  samples: { id: string; label: string; date: string }[];
};

/**
 * KVKK periyodik imha paneli (Faz 2.4/B). Admin ÖNCE neyin silineceğini görür
 * (kuru çalışma, sunucuda hesaplanır), sonra İKİ ADIMDA onaylar — yıkıcı işlem
 * tek tıkla yapılmaz. İstemci hiçbir kimlik göndermez; action sunucuda yeniden
 * toplar (bkz. retention-actions.ts). Örnek etiketlerde ad/e-posta maskelidir.
 */
export function RetentionPanel({ rows, total }: { rows: RetentionRow[]; total: number }) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  const run = async () => {
    setPhase("busy");
    const res = await purgeExpiredData();
    if (res.ok) {
      const c = res.counts;
      setMsg(`İmha tamamlandı: ${c.applications} başvuru · ${c.newsletter} bülten aboneliği · ${c.orphanConsents} yetim rıza kaydı · ${c.payments} ödeme kaydı.`);
      setPhase("done");
    } else {
      setMsg(res.error);
      setPhase("error");
    }
  };

  return (
    <Panel title="KVKK Saklama & İmha" style={{ marginTop: 20 }}>
      <p style={{ margin: "0 0 16px", fontSize: 13.5, lineHeight: 1.6, color: "var(--text-muted)" }}>
        Saklama süresi dolan kişisel veriler <strong>kalıcı olarak</strong> imha edilir (KVKK md.7).
        Aşağıda şu an süresi dolmuş kayıtlar listelenir. Bu işlemi düzenli aralıklarla (ör. 6 ayda bir)
        çalıştırın. <strong>Sporcuya dönüştürülmüş başvurular</strong> ve <strong>aktif sporcuya bağlı
        rıza kayıtları</strong> asla silinmez.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {rows.map((r) => (
          <div key={r.key} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--border-subtle)", background: r.count > 0 ? "var(--amber-50, var(--surface-subtle))" : "var(--surface-subtle)" }}>
            <span style={{ flex: "none", minWidth: 34, height: 26, borderRadius: "var(--radius-pill)", display: "grid", placeItems: "center", padding: "0 9px", fontWeight: 800, fontSize: 13, background: r.count > 0 ? "var(--amber-600, #b45309)" : "var(--ink-200)", color: r.count > 0 ? "#fff" : "var(--ink-600)" }}>
              {r.count}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 13.5, color: "var(--text-strong)" }}>{r.label}</div>
              <div style={{ fontSize: 12.5, color: "var(--text-muted)", marginTop: 2 }}>{r.rule}</div>
              {r.samples.length > 0 && (
                <div style={{ fontSize: 12, color: "var(--ink-500)", marginTop: 6, lineHeight: 1.6 }}>
                  {r.samples.map((s) => (
                    <div key={s.id} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      • {s.label} <span style={{ color: "var(--ink-400)" }}>({s.date})</span>
                    </div>
                  ))}
                  {r.count > r.samples.length && (
                    <div style={{ color: "var(--ink-400)" }}>… ve {r.count - r.samples.length} kayıt daha</div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
        {phase === "done" && (
          <div style={{ fontSize: 13.5, color: "var(--green-700, #15803d)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={16} /> {msg}
          </div>
        )}
        {phase === "error" && (
          <div style={{ fontSize: 13.5, color: "var(--red-600, #dc2626)" }}>{msg}</div>
        )}

        {phase !== "done" && total === 0 && (
          <div style={{ fontSize: 13.5, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="check" size={16} /> Şu an süresi dolmuş kayıt yok — imha edilecek bir şey bulunmuyor.
          </div>
        )}

        {phase === "idle" && total > 0 && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13.5, color: "var(--text-strong)", fontWeight: 600 }}>
              Toplam <strong>{total}</strong> kayıt imha edilecek.
            </span>
            <button type="button" onClick={() => setPhase("confirm")} style={btn("danger")}>
              <Icon name="alert-triangle" size={15} /> İmha Et
            </button>
          </div>
        )}

        {phase === "confirm" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 13.5, color: "var(--red-600, #dc2626)", lineHeight: 1.55 }}>
              <strong>Bu işlem geri alınamaz.</strong> {total} kayıt kalıcı olarak silinecek ve denetim
              kaydına yazılacak. Devam edilsin mi?
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button type="button" onClick={run} style={btn("danger")}>
                Evet, kalıcı olarak sil
              </button>
              <button type="button" onClick={() => setPhase("idle")} style={btn("ghost")}>
                Vazgeç
              </button>
            </div>
          </div>
        )}

        {phase === "busy" && <div style={{ fontSize: 13.5, color: "var(--text-muted)" }}>İmha ediliyor…</div>}
      </div>
    </Panel>
  );
}

function btn(kind: "danger" | "ghost"): React.CSSProperties {
  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    padding: "9px 16px",
    borderRadius: "var(--radius-sm)",
    fontFamily: "var(--font-body)",
    fontWeight: 600,
    fontSize: 13.5,
    cursor: "pointer",
  };
  return kind === "danger"
    ? { ...base, border: "1px solid var(--red-600, #dc2626)", background: "var(--red-600, #dc2626)", color: "#fff" }
    : { ...base, border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)" };
}
