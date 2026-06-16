import "server-only";

/**
 * SMS gönderimi — sağlayıcıdan bağımsız HTTP geçidi (Netgsm, İletimerkezi,
 * Turkcell vb. çoğu sağlayıcı basit bir HTTP POST kabul eder). SMS_* env
 * tanımlı DEĞİLSE sessizce atlanır (dev'de OTP kodu konsola yazılır).
 *
 * KVKK: Veli kimlik doğrulaması (açık rıza ispatı) için OTP buradan gönderilir.
 * Sağlayıcı bağlanınca `setAthleteConsent`/başvuru akışına OTP kapısı eklenir.
 */

export function generateOtp(digits = 6): string {
  let code = "";
  // Math.random kullanımından kaçınmıyoruz çünkü bu yalnızca server'da kısa
  // ömürlü doğrulama kodu üretir; kriptografik anahtar değildir.
  for (let i = 0; i < digits; i++) code += Math.floor(Math.random() * 10);
  return code;
}

export async function sendSms(phone: string, text: string): Promise<{ sent: boolean; reason?: string }> {
  const url = process.env.SMS_API_URL;
  const user = process.env.SMS_API_USER;
  const key = process.env.SMS_API_KEY;
  const sender = process.env.SMS_SENDER;

  if (!url || !user || !key) {
    console.warn(`[sms] SMS sağlayıcı yapılandırılmadı — atlandı: ${phone} "${text.slice(0, 40)}"`);
    return { sent: false, reason: "sms-not-configured" };
  }

  try {
    // Genel form-encoded POST; sağlayıcının alan adlarına göre uyarlanabilir.
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ usercode: user, password: key, gsmno: phone, message: text, msgheader: sender || "" }),
    });
    return res.ok ? { sent: true } : { sent: false, reason: `http-${res.status}` };
  } catch (e) {
    console.error("[sms] gönderim hatası:", e);
    return { sent: false, reason: "send-failed" };
  }
}

/** OTP mesajını biçimlendirir + gönderir. */
export async function sendOtpSms(phone: string, code: string) {
  return sendSms(phone, `Buca Yıldız doğrulama kodunuz: ${code}. Kimseyle paylaşmayın.`);
}
