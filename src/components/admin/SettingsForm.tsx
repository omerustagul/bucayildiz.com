"use client";

import { useState, useTransition } from "react";
import { TextInput, TextArea, FileDrop } from "@/components/admin/controls";
import { Field } from "@/components/admin/kit";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/lib/icons";
import { saveSettings } from "@/app/admin/(panel)/ayarlar/actions";

export type SettingsFormValues = {
  clubName: string; clubShortName: string; logoUrl: string; foundedYear: string;
  phone: string; email: string; address: string;
  instagramUrl: string; facebookUrl: string; youtubeUrl: string; xUrl: string;
  metaTitle: string; metaDescription: string; ogImageUrl: string; keywords: string;
  smtpHost: string; smtpPort: string; smtpUser: string; mailFrom: string; mailToAdmin: string;
  customCursor: boolean; cursorStyle: string;
  mobileNavAdmin: boolean; mobileNavPanel: boolean;
};

const TABS: { id: string; label: string; icon: IconName }[] = [
  { id: "kulup", label: "Kulüp", icon: "shield" },
  { id: "seo", label: "SEO", icon: "search" },
  { id: "eposta", label: "E-posta", icon: "mail" },
  { id: "gorunum", label: "Görünüm", icon: "eye" },
];

const CURSORS: { id: string; label: string; desc: string }[] = [
  { id: "default", label: "Varsayılan", desc: "Tarayıcının yerleşik imleci" },
  { id: "star", label: "Altın Yıldız", desc: "Logolu özel ok imleci" },
  { id: "ball", label: "Futbol Topu", desc: "Spor temalı top imleci" },
  { id: "whistle", label: "Düdük", desc: "Hakem düdüğü imleci" },
];

export function SettingsForm({ initial, smtpPassSet }: { initial: SettingsFormValues; smtpPassSet: boolean }) {
  const [tab, setTab] = useState("kulup");
  const [v, setV] = useState<SettingsFormValues>(initial);
  const [smtpPass, setSmtpPass] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();
  const set = <K extends keyof SettingsFormValues>(k: K, val: SettingsFormValues[K]) => { setV((s) => ({ ...s, [k]: val })); setMsg(null); };

  const save = () => {
    if (pending) return;
    setMsg(null);
    const payload = {
      ...v,
      foundedYear: v.foundedYear.trim() === "" ? null : Number(v.foundedYear),
      smtpPort: v.smtpPort.trim() === "" ? null : Number(v.smtpPort),
      smtpPass, // boşsa action mevcut değeri korur
    };
    start(async () => {
      const res = await saveSettings(payload);
      if (res.ok) { setMsg({ ok: true, text: "Ayarlar kaydedildi." }); setSmtpPass(""); }
      else setMsg({ ok: false, text: res.error });
    });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Sekmeler */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", borderBottom: "1px solid var(--border-subtle)", paddingBottom: 2 }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px", border: "none", background: "transparent",
            borderBottom: `2px solid ${tab === t.id ? "var(--gold-500)" : "transparent"}`, cursor: "pointer",
            fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 14, color: tab === t.id ? "var(--text-strong)" : "var(--text-muted)",
          }}>
            <Icon name={t.icon} size={15} /> {t.label}
          </button>
        ))}
      </div>

      <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "22px 24px" }}>
        {tab === "kulup" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "minmax(0,0.7fr) minmax(0,1.3fr)", gap: 22, alignItems: "start" }} className="jersey-form-grid">
              <Field label="Logo" hint="Şeffaf PNG önerilir">
                <FileDrop value={v.logoUrl || null} onChange={(url) => set("logoUrl", url ?? "")} label="Logo yükle" aspect="1 / 1" icon="shield" />
              </Field>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <Field label="Kulüp Adı" required><TextInput value={v.clubName} onChange={(e) => set("clubName", e.target.value)} /></Field>
                <Field label="Kısa Ad" required hint="Sekmelerde / PWA'da"><TextInput value={v.clubShortName} onChange={(e) => set("clubShortName", e.target.value)} /></Field>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="Kuruluş Yılı"><TextInput type="number" value={v.foundedYear} onChange={(e) => set("foundedYear", e.target.value)} placeholder="2010" /></Field>
                  <Field label="Telefon"><TextInput value={v.phone} onChange={(e) => set("phone", e.target.value)} placeholder="0232 ..." /></Field>
                </div>
              </div>
            </div>
            <Field label="E-posta"><TextInput value={v.email} onChange={(e) => set("email", e.target.value)} placeholder="bilgi@bucayildiz.com" /></Field>
            <Field label="Adres"><TextArea rows={2} value={v.address} onChange={(e) => set("address", e.target.value)} /></Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Instagram"><TextInput value={v.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} placeholder="https://instagram.com/..." /></Field>
              <Field label="Facebook"><TextInput value={v.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} placeholder="https://facebook.com/..." /></Field>
              <Field label="YouTube"><TextInput value={v.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} placeholder="https://youtube.com/..." /></Field>
              <Field label="X (Twitter)"><TextInput value={v.xUrl} onChange={(e) => set("xUrl", e.target.value)} placeholder="https://x.com/..." /></Field>
            </div>
          </div>
        )}

        {tab === "seo" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Meta Başlık" hint="Boşsa kulüp adı kullanılır"><TextInput value={v.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} /></Field>
            <Field label="Meta Açıklama" hint="Arama sonuçlarında görünür (~160 karakter)"><TextArea rows={3} value={v.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} /></Field>
            <Field label="Anahtar Kelimeler" hint="virgülle ayır"><TextInput value={v.keywords} onChange={(e) => set("keywords", e.target.value)} placeholder="futbol akademisi, izmir, buca, altyapı" /></Field>
            <Field label="Paylaşım Görseli (OG)" hint="Sosyal medyada paylaşımda görünür (1200×630)">
              <FileDrop value={v.ogImageUrl || null} onChange={(url) => set("ogImageUrl", url ?? "")} label="OG görseli yükle" aspect="1200 / 630" icon="image" />
            </Field>
          </div>
        )}

        {tab === "eposta" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-muted)", lineHeight: 1.55 }}>
              Başvuru bildirimleri bu SMTP hesabıyla gönderilir. Boş bırakılırsa e-posta gönderimi devre dışı kalır (başvurular yine kaydedilir).
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}>
              <Field label="SMTP Sunucu"><TextInput value={v.smtpHost} onChange={(e) => set("smtpHost", e.target.value)} placeholder="smtp.yandex.com" /></Field>
              <Field label="Port"><TextInput type="number" value={v.smtpPort} onChange={(e) => set("smtpPort", e.target.value)} placeholder="587" /></Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Kullanıcı"><TextInput value={v.smtpUser} onChange={(e) => set("smtpUser", e.target.value)} placeholder="bilgi@bucayildiz.com" /></Field>
              <Field label="Şifre" hint={smtpPassSet ? "Kayıtlı — değiştirmek için yeni gir" : "Uygulama şifresi"}>
                <TextInput type="password" value={smtpPass} onChange={(e) => setSmtpPass(e.target.value)} placeholder={smtpPassSet ? "••••••••" : ""} autoComplete="new-password" />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Gönderen" hint='örn. "Buca Yıldız <bilgi@...>"'><TextInput value={v.mailFrom} onChange={(e) => set("mailFrom", e.target.value)} /></Field>
              <Field label="Bildirim Alıcısı" hint="Başvurular buraya gelir"><TextInput value={v.mailToAdmin} onChange={(e) => set("mailToAdmin", e.target.value)} /></Field>
            </div>
          </div>
        )}

        {tab === "gorunum" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>Özel İmleç</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Site genelinde spor temalı özel fare imleci kullan.</div>
              </div>
              <Switch checked={v.customCursor} onChange={(n) => set("customCursor", n)} />
            </div>

            <div style={{ opacity: v.customCursor ? 1 : 0.5, pointerEvents: v.customCursor ? "auto" : "none", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
              {CURSORS.filter((c) => c.id !== "default").map((c) => {
                const on = v.cursorStyle === c.id;
                return (
                  <button key={c.id} onClick={() => set("cursorStyle", c.id)} style={{
                    display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", textAlign: "left",
                    borderRadius: "var(--radius-md)", border: `1.5px solid ${on ? "var(--navy-700)" : "var(--border-subtle)"}`,
                    background: on ? "var(--navy-50)" : "var(--surface-card)", cursor: "pointer",
                  }}>
                    <span style={{ flex: "none", width: 40, height: 40, borderRadius: 8, background: "var(--navy-900)", display: "grid", placeItems: "center" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/cursors/${c.id}.svg`} alt={c.label} width={26} height={26} />
                    </span>
                    <span>
                      <span style={{ display: "block", fontWeight: 600, fontSize: 14, color: "var(--text-strong)" }}>{c.label}</span>
                      <span style={{ display: "block", fontSize: 12, color: "var(--text-muted)" }}>{c.desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "var(--text-muted)" }}>
              İmleç tüm siteye uygulanır. Dokunmatik cihazlarda etkisi yoktur.
            </p>

            <div style={{ height: 1, background: "var(--border-subtle)", margin: "6px 0" }} />

            {/* Mobil alt gezinme çubukları */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>Mobil Alt Menü — Yönetim Paneli</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Mobil cihazlarda yönetim panelinin altında hızlı gezinme çubuğu göster.</div>
              </div>
              <Switch checked={v.mobileNavAdmin} onChange={(n) => set("mobileNavAdmin", n)} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 15, color: "var(--text-strong)" }}>Mobil Alt Menü — Sporcu Paneli</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 3 }}>Mobil cihazlarda sporcu panelinin altında hızlı gezinme çubuğu göster.</div>
              </div>
              <Switch checked={v.mobileNavPanel} onChange={(n) => set("mobileNavPanel", n)} />
            </div>
          </div>
        )}
      </div>

      {msg && (
        <div style={{ maxWidth: 820, padding: "10px 13px", borderRadius: "var(--radius-sm)", fontSize: 13.5, background: msg.ok ? "var(--green-100)" : "var(--red-100)", border: `1px solid ${msg.ok ? "var(--green-600)" : "var(--red-600)"}`, color: msg.ok ? "var(--green-600)" : "var(--red-600)" }}>
          {msg.text}
        </div>
      )}
      <div><Button variant="primary" onClick={save} disabled={pending}>{pending ? "Kaydediliyor…" : "Ayarları Kaydet"}</Button></div>
    </div>
  );
}
