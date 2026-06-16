import "server-only";
import nodemailer from "nodemailer";

/**
 * E-posta gönderimi (SMTP). SMTP_* env değişkenleri tanımlı DEĞİLSE sessizce
 * atlanır (geliştirmede ve sağlayıcı bağlanmadan önce uygulamayı bloklamaz).
 * Prod'da Türkiye'deki bir SMTP sağlayıcısı (Yandex360, Turkcell, Natro vb.)
 * ile doldurulur — bkz .env.production.example.
 */

type MailInput = { to: string; subject: string; html: string; text?: string };

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: { user, pass },
  });
}

export async function sendMail(input: MailInput): Promise<{ sent: boolean; reason?: string }> {
  const transport = getTransport();
  if (!transport) {
    console.warn(`[mail] SMTP yapılandırılmadı — atlandı: "${input.subject}" → ${input.to}`);
    return { sent: false, reason: "smtp-not-configured" };
  }
  const from = process.env.MAIL_FROM || "Buca Yıldız <bilgi@bucayildiz.com>";
  try {
    await transport.sendMail({ from, to: input.to, subject: input.subject, html: input.html, text: input.text });
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
  const adminTo = process.env.MAIL_TO_ADMIN || process.env.SEED_ADMIN_EMAIL;
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
