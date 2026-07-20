import type { Metadata } from "next";
import { requireOwner } from "@/lib/auth";
import { ViewHeader } from "@/components/admin/ui";
import { Icon } from "@/lib/icons";
import { listBackups, diskUsage, dbSizeMB, pm2Status, offsiteConfigured, lastBackupAgeHours } from "@/lib/systemInfo";

export const metadata: Metadata = { title: "Sistem & Yedekler" };
export const dynamic = "force-dynamic"; // canlı durum — önbelleğe alınmaz

function fmtDateTime(ms: number) {
  const d = new Date(ms);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
}

function Stat({ label, value, tone, hint }: { label: string; value: string; tone?: "ok" | "warn" | "bad"; hint?: string }) {
  const color = tone === "ok" ? "var(--green-600)" : tone === "warn" ? "var(--gold-700)" : tone === "bad" ? "var(--red-600)" : "var(--text-strong)";
  return (
    <div style={{ background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", padding: "16px 18px" }}>
      <div style={{ fontSize: 11.5, letterSpacing: ".06em", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: 22, color, marginTop: 5 }}>{value}</div>
      {hint && <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

export default async function SistemPage() {
  await requireOwner();
  const [dbMB] = await Promise.all([dbSizeMB()]);
  const backups = listBackups();
  const disk = diskUsage();
  const pm2 = pm2Status();
  const offsite = offsiteConfigured();

  const lastBackupAgeH = lastBackupAgeHours(backups);
  const backupFresh = lastBackupAgeH != null && lastBackupAgeH <= 26;

  return (
    <>
      <ViewHeader title="Sistem & Yedekler" subtitle="Sunucu durumu, veritabanı yedekleri ve indirme — yalnız Sahip erişir." />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, marginTop: 18 }}>
        <Stat
          label="Son yedek"
          value={lastBackupAgeH == null ? "Yok" : lastBackupAgeH < 1 ? "Az önce" : `${Math.floor(lastBackupAgeH)} saat önce`}
          tone={lastBackupAgeH == null ? "bad" : backupFresh ? "ok" : "warn"}
          hint={`${backups.length} yerel yedek`}
        />
        <Stat
          label="Off-site (S3)"
          value={offsite ? "Aktif" : "Kapalı"}
          tone={offsite ? "ok" : "warn"}
          hint={offsite ? "Sunucu-dışı kopya açık" : "BACKUP_S3_* girilmeli"}
        />
        {disk && <Stat label="Disk" value={`%${disk.pct}`} tone={disk.pct >= 85 ? "bad" : disk.pct >= 70 ? "warn" : "ok"} hint={`${disk.used} / ${disk.total}`} />}
        {dbMB != null && <Stat label="Veritabanı" value={`${dbMB} MB`} tone="ok" />}
        {pm2 && <Stat label="PM2 süreç" value={`${pm2.online}/${pm2.total}`} tone={pm2.total > 0 && pm2.online === pm2.total ? "ok" : "bad"} hint="online / toplam" />}
      </div>

      {!offsite && (
        <div style={{ marginTop: 16, display: "flex", gap: 10, padding: "12px 14px", borderRadius: "var(--radius-md)", border: "1px solid var(--gold-500)", background: "rgba(201,162,39,0.08)", fontSize: 13, color: "var(--ink-700)", lineHeight: 1.5 }}>
          <span style={{ flex: "none", color: "var(--gold-700)", display: "inline-flex" }}><Icon name="shield-check" size={18} /></span>
          <span>
            <strong>Off-site yedek kapalı.</strong> Yedekler yalnız bu sunucunun diskinde — sunucu kaybında yedekler de gider.
            S3-uyumlu bir kova açıp <code>BACKUP_S3_*</code> env değişkenlerini doldurun (bkz. DEPLOYMENT.md §Yedekleme). Doldurulunca off-site otomatik aktifleşir.
          </span>
        </div>
      )}

      <div style={{ marginTop: 22, background: "var(--surface-card)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border-subtle)", fontFamily: "var(--font-heading)", fontSize: 13, fontWeight: 700, letterSpacing: ".05em", textTransform: "uppercase", color: "var(--text-strong)" }}>
          Yerel Yedekler ({backups.length})
        </div>
        {backups.length === 0 ? (
          <div style={{ padding: "30px 18px", textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>Henüz yedek yok.</div>
        ) : (
          <div>
            {backups.map((b, i) => (
              <div key={b.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 18px", borderTop: i === 0 ? "none" : "1px solid var(--border-subtle)" }}>
                <span style={{ flex: "none", color: "var(--ink-400)", display: "inline-flex" }}><Icon name="clipboard-list" size={16} /></span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-strong)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.name}</div>
                  <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 1 }}>{fmtDateTime(b.mtime)} · {b.sizeKB.toLocaleString("tr-TR")} KB</div>
                </div>
                <a
                  href={`/admin/sistem/download?name=${encodeURIComponent(b.name)}`}
                  download
                  style={{ flex: "none", display: "inline-flex", alignItems: "center", gap: 6, padding: "7px 12px", borderRadius: "var(--radius-pill)", border: "1px solid var(--border-subtle)", background: "var(--surface-card)", color: "var(--text-body)", fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}
                >
                  <Icon name="download" size={14} /> İndir
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      <p style={{ margin: "16px 0 0", fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5, maxWidth: 760 }}>
        Yedekler her migration öncesi (deploy) ve günlük cron ile otomatik alınır. Geri yükleme:
        <code style={{ margin: "0 4px" }}>pg_restore -d &quot;$DATABASE_URL&quot; --clean --no-owner &lt;dosya&gt;</code>.
        İndirilen yedek hassas veri içerir — güvenli saklayın.
      </p>
    </>
  );
}
