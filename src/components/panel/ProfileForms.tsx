"use client";

import { useState, useTransition } from "react";
import { Icon } from "@/lib/icons";
import { updateContact, changePassword } from "@/app/panel/profil/actions";

const card: React.CSSProperties = {
  background: "var(--surface-card)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "var(--radius-lg)",
  padding: "20px 22px",
  display: "flex",
  flexDirection: "column",
  gap: 14,
};
const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--text-strong)", marginBottom: 6, display: "block" };
const input: React.CSSProperties = {
  fontFamily: "var(--font-body)", fontSize: 14.5, padding: "11px 13px", borderRadius: "var(--radius-sm)",
  border: "1px solid var(--border-subtle)", background: "var(--surface-page)", color: "var(--text-body)", width: "100%",
};
const btn: React.CSSProperties = {
  alignSelf: "flex-start", padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none",
  background: "var(--grad-gold)", color: "var(--navy-900)", fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, cursor: "pointer",
};
const title: React.CSSProperties = { fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, letterSpacing: ".04em", textTransform: "uppercase", color: "var(--text-strong)", margin: 0 };

function Msg({ ok, text }: { ok: boolean; text: string }) {
  return (
    <div style={{ padding: "9px 12px", borderRadius: "var(--radius-sm)", fontSize: 13, background: ok ? "var(--green-100)" : "var(--red-100)", border: `1px solid ${ok ? "var(--green-600)" : "var(--red-600)"}`, color: ok ? "var(--green-600)" : "var(--red-600)" }}>
      {text}
    </div>
  );
}

export function ProfileForms({ parentPhone }: { parentPhone: string }) {
  const [phone, setPhone] = useState(parentPhone);
  const [contactMsg, setContactMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [cPending, startContact] = useTransition();

  const [cur, setCur] = useState("");
  const [nxt, setNxt] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pPending, startPw] = useTransition();

  const saveContact = () => {
    if (cPending) return;
    setContactMsg(null);
    startContact(async () => {
      const res = await updateContact(phone);
      setContactMsg(res.ok ? { ok: true, text: "İletişim bilgisi güncellendi." } : { ok: false, text: res.error });
    });
  };

  const savePw = () => {
    if (pPending) return;
    setPwMsg(null);
    startPw(async () => {
      const res = await changePassword(cur, nxt);
      if (res.ok) {
        setPwMsg({ ok: true, text: "Şifreniz güncellendi." });
        setCur("");
        setNxt("");
      } else {
        setPwMsg({ ok: false, text: res.error });
      }
    });
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 18 }}>
      <div style={card}>
        <h2 style={title}><Icon name="phone" size={16} /> İletişim Bilgisi</h2>
        <div>
          <label style={label} htmlFor="pp">Veli Telefonu</label>
          <input id="pp" style={input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="05xx xxx xx xx" />
        </div>
        {contactMsg && <Msg ok={contactMsg.ok} text={contactMsg.text} />}
        <button style={btn} onClick={saveContact} disabled={cPending}>{cPending ? "Kaydediliyor…" : "Kaydet"}</button>
      </div>

      <div style={card}>
        <h2 style={title}><Icon name="lock" size={16} /> Şifre Değiştir</h2>
        <div>
          <label style={label} htmlFor="cp">Mevcut Şifre</label>
          <input id="cp" type="password" style={input} value={cur} onChange={(e) => setCur(e.target.value)} autoComplete="current-password" />
        </div>
        <div>
          <label style={label} htmlFor="np">Yeni Şifre <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>· en az 8 karakter</span></label>
          <input id="np" type="password" style={input} value={nxt} onChange={(e) => setNxt(e.target.value)} autoComplete="new-password" />
        </div>
        {pwMsg && <Msg ok={pwMsg.ok} text={pwMsg.text} />}
        <button style={btn} onClick={savePw} disabled={pPending}>{pPending ? "Güncelleniyor…" : "Şifreyi Güncelle"}</button>
      </div>
    </div>
  );
}
