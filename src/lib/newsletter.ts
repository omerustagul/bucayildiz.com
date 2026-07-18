import "server-only";
import { randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { getConsentDocumentByKey, consentTextHash } from "@/lib/consent.server";
import { sendMail } from "@/lib/mail";

/** Kriptografik rastgele jeton (URL-güvenli) — doğrulama/iptal linkleri için. */
function makeToken(): string {
  return randomBytes(24).toString("base64url");
}

export type NewsletterResult = { ok: true; message: string } | { ok: false; error: string };

/**
 * Bülten aboneliği (KVKK ticari elektronik ileti). Rıza ispatı abone satırında:
 * abone olurken aktif "pazarlama" belgesinin sürümü + gövde SHA-256'sı + IP/UA.
 * ÇİFT OPT-IN: SMTP varsa doğrulama e-postası gider ve abone `pending` kalır
 * (linke tıklayınca `active`); SMTP yoksa `sendMail` sent:false döner ve TEK
 * opt-in'e düşülür (`active`). Zaten aktif e-posta yeniden abone edilmez.
 */
export async function subscribeNewsletter(input: {
  email: string;
  consent: boolean;
  ip?: string | null;
  ua?: string | null;
  baseUrl: string;
}): Promise<NewsletterResult> {
  const email = input.email.trim().toLowerCase();

  // Rıza ispatı için aktif pazarlama belgesi (sürüm + hash anlık görüntüsü).
  const doc = await getConsentDocumentByKey("pazarlama");
  if (!doc) return { ok: false, error: "Bülten aboneliği şu an kullanılamıyor." };

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email }, select: { status: true } });
  if (existing?.status === "active") return { ok: true, message: "Bu e-posta zaten bültenimize kayıtlı." };

  const unsubToken = makeToken();
  const confirmTok = makeToken();
  const confirmUrl = `${input.baseUrl}/bulten/dogrula?token=${confirmTok}`;

  // Çift opt-in: doğrulama e-postası dene. SMTP yapılandırılmamışsa sent:false → tek opt-in.
  const { sent } = await sendConfirmationEmail(email, `${input.baseUrl}/bulten/iptal?token=${unsubToken}`, confirmUrl).catch(() => ({ sent: false }));

  const audit = {
    consentVersion: doc.version,
    consentHash: consentTextHash(doc.body),
    ipAddress: input.ip ?? null,
    userAgent: input.ua ?? null,
    unsubToken,
    unsubscribedAt: null,
  };
  const data = sent
    ? { ...audit, status: "pending", confirmToken: confirmTok, confirmedAt: null }
    : { ...audit, status: "active", confirmToken: null, confirmedAt: new Date() };

  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, ...data },
    update: data,
  });

  return {
    ok: true,
    message: sent
      ? "Son bir adım kaldı! Aboneliğinizi tamamlamak için e-postanıza gönderdiğimiz onay bağlantısına tıklayın."
      : "Aboneliğiniz alındı. Teşekkürler!",
  };
}

async function sendConfirmationEmail(to: string, unsubUrl: string, confirmUrl: string) {
  return sendMail({
    to,
    subject: "Bülten aboneliğinizi onaylayın — Buca Yıldız",
    text:
      `Buca Yıldız Futbol Akademisi bültenine abone olma talebinizi aldık.\n\n` +
      `Onaylamak için: ${confirmUrl}\n\n` +
      `Bu isteği siz yapmadıysanız bu e-postayı yok sayın. Abonelikten çıkmak: ${unsubUrl}`,
    html:
      `<p>Buca Yıldız Futbol Akademisi bültenine abone olma talebinizi aldık.</p>` +
      `<p><a href="${confirmUrl}" style="display:inline-block;padding:10px 18px;background:#c9a227;color:#0b1220;text-decoration:none;border-radius:6px;font-weight:700">Aboneliğimi onaylıyorum</a></p>` +
      `<p style="color:#666;font-size:13px">Bu isteği siz yapmadıysanız bu e-postayı yok sayabilirsiniz. ` +
      `Dilediğinizde <a href="${unsubUrl}">abonelikten çıkabilirsiniz</a>.</p>`,
  });
}

/** Çift opt-in onayı: jetonla aboneyi `active` yapar (jeton tek kullanımlık → null'lanır). */
export async function confirmNewsletter(tok: string): Promise<{ ok: boolean }> {
  if (!tok) return { ok: false };
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { confirmToken: tok }, select: { id: true } });
  if (!sub) return { ok: false };
  await prisma.newsletterSubscriber.update({
    where: { id: sub.id },
    data: { status: "active", confirmedAt: new Date(), confirmToken: null, unsubscribedAt: null },
  });
  return { ok: true };
}

/** Tek-tık iptal: jetonla aboneyi `unsubscribed` yapar. Kayıt SİLİNMEZ (denetim izi
 *  + rıza ispatı durur); yalnız durum + zaman güncellenir. */
export async function unsubscribeNewsletter(tok: string): Promise<{ ok: boolean }> {
  if (!tok) return { ok: false };
  const sub = await prisma.newsletterSubscriber.findUnique({ where: { unsubToken: tok }, select: { id: true, status: true } });
  if (!sub) return { ok: false };
  if (sub.status !== "unsubscribed") {
    await prisma.newsletterSubscriber.update({
      where: { id: sub.id },
      data: { status: "unsubscribed", unsubscribedAt: new Date() },
    });
  }
  return { ok: true };
}
