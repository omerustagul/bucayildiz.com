import "server-only";
import nodemailer from "nodemailer";
import { getSettings } from "@/lib/settings";

/**
 * E-posta gönderimi (SMTP). Yapılandırma önce admin > Ayarlar (DB), yoksa
 * SMTP_* env'inden okunur. Hiçbiri yoksa sessizce atlanır (uygulamayı bloklamaz).
 */

type MailInput = { to: string; subject: string; html: string; text?: string };

async function getSmtpConfig() {
  const s = await getSettings();
  const host = s.smtpHost || process.env.SMTP_HOST || "";
  const user = s.smtpUser || process.env.SMTP_USER || "";
  const pass = s.smtpPass || process.env.SMTP_PASS || "";
  const port = s.smtpPort || Number(process.env.SMTP_PORT || 587);
  const from = s.mailFrom || process.env.MAIL_FROM || "Buca Yıldız <bilgi@bucayildiz.com>";
  const adminTo = s.mailToAdmin || process.env.MAIL_TO_ADMIN || s.email || process.env.SEED_ADMIN_EMAIL || "";
  return { host, user, pass, port, from, adminTo };
}

export async function sendMail(input: MailInput): Promise<{ sent: boolean; reason?: string }> {
  const cfg = await getSmtpConfig();
  if (!cfg.host || !cfg.user || !cfg.pass) {
    console.warn(`[mail] SMTP yapılandırılmadı — atlandı: "${input.subject}" → ${input.to}`);
    return { sent: false, reason: "smtp-not-configured" };
  }
  try {
    const transport = nodemailer.createTransport({
      host: cfg.host,
      port: cfg.port,
      secure: cfg.port === 465, // 465 = SSL, 587 = STARTTLS
      auth: { user: cfg.user, pass: cfg.pass },
    });
    await transport.sendMail({ from: cfg.from, to: input.to, subject: input.subject, html: input.html, text: input.text });
    return { sent: true };
  } catch (e) {
    console.error("[mail] gönderim hatası:", e);
    return { sent: false, reason: "send-failed" };
  }
}

const esc = (s: string) => s.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]!));

/** Yeni başvuru → yöneticiye bildirim + (e-posta verildiyse) veliye teşekkür. */
export async function notifyNewApplication(app: {
  athleteName: string;
  ageGroup: string;
  parentName: string;
  phone: string;
  email: string | null;
}) {
  const { adminTo } = await getSmtpConfig();
  const results: Record<string, boolean> = {};

  if (adminTo) {
    const r = await sendMail({
      to: adminTo,
      subject: `Yeni başvuru: ${app.athleteName} (${app.ageGroup})`,
      html: `<h2 style="font-family:sans-serif">Yeni Akademi Başvurusu</h2>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:4px 10px;color:#666">Sporcu</td><td style="padding:4px 10px"><b>${esc(app.athleteName)}</b></td></tr>
          <tr><td style="padding:4px 10px;color:#666">Yaş Grubu</td><td style="padding:4px 10px">${esc(app.ageGroup)}</td></tr>
          <tr><td style="padding:4px 10px;color:#666">Veli</td><td style="padding:4px 10px">${esc(app.parentName)}</td></tr>
          <tr><td style="padding:4px 10px;color:#666">Telefon</td><td style="padding:4px 10px">${esc(app.phone)}</td></tr>
          ${app.email ? `<tr><td style="padding:4px 10px;color:#666">E-posta</td><td style="padding:4px 10px">${esc(app.email)}</td></tr>` : ""}
        </table>
        <p style="font-family:sans-serif;font-size:13px;color:#888">Yönetim panelindeki Başvurular bölümünden inceleyebilirsiniz.</p>`,
      text: `Yeni başvuru: ${app.athleteName} (${app.ageGroup}) — Veli: ${app.parentName}, Tel: ${app.phone}`,
    });
    results.admin = r.sent;
  }

  if (app.email) {
    const r = await sendMail({
      to: app.email,
      subject: "Başvurunuz alındı — Buca Yıldız Futbol Akademisi",
      html: `<div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#1a2540">
        <h2>Başvurunuz alındı 🎉</h2>
        <p>Sayın ${esc(app.parentName)},</p>
        <p><b>${esc(app.athleteName)}</b> için yaptığınız ücretsiz deneme başvurusu bize ulaştı.
        Antrenörlerimiz en kısa sürede sizinle iletişime geçerek deneme antrenmanı randevunuzu oluşturacak.</p>
        <p>Buca Yıldız Futbol Akademisi</p>
      </div>`,
      text: `Sayın ${app.parentName}, ${app.athleteName} için başvurunuz alındı. En kısa sürede iletişime geçeceğiz.`,
    });
    results.parent = r.sent;
  }

  return results;
}
