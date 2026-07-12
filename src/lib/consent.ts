/**
 * KVKK dijital onay sistemi — kanonik belge tanımları (CLIENT-SAFE).
 * Sunucuya özel yardımcılar (hash, DB) için `lib/consent.server.ts`.
 *
 * Her onay AYRI bir belgedir; tek "hepsini kabul" kutusu KVKK'da geçersizdir
 * (battaniye rıza). Foto/video ve pazarlama OPSİYONELDİR ve kayıt/üyelik
 * şartına bağlanamaz. Aydınlatma metni bir "rıza" değil, bilgilendirmedir.
 *
 * ⚠️ Buradaki `body` metinleri TASLAKTIR — bir KVKK avukatı yazıp onaylamalı.
 * Sürüm (`CONSENT_VERSION`) değişirse yeni belge sürümü seed edilmeli; eski
 * kayıtlar (ConsentRecord) hangi sürüme onay verildiğini saklamaya devam eder.
 */
export const CONSENT_VERSION = "2026-06-15";

export type ConsentKey = "aydinlatma" | "acik-riza" | "saglik-verisi" | "foto-video" | "pazarlama";

export type ConsentDef = {
  key: ConsentKey;
  title: string;
  summary: string; // formda gösterilen kısa onay cümlesi
  isConsent: boolean; // false = sadece aydınlatma (rıza değil)
  required: boolean; // false = opsiyonel (kayda bağlanamaz)
  ordering: number;
  body: string; // tam metin (TASLAK — avukat onayı bekleniyor)
};

const DRAFT = "\n\n— — —\n⚠️ Bu metin taslaktır; nihai hali KVKK avukatı tarafından hazırlanıp onaylanacaktır.";

export const CONSENT_DOCS: ConsentDef[] = [
  {
    key: "aydinlatma",
    title: "Aydınlatma Metni",
    summary: "Aydınlatma metnini okudum.",
    isConsent: false,
    required: true,
    ordering: 1,
    body:
      "Buca Yıldız Futbol Akademisi (\"Kulüp\") olarak, 6698 sayılı Kişisel Verilerin " +
      "Korunması Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla; sporcu adayının ve " +
      "velisinin kimlik, iletişim, doğum tarihi, fiziksel ölçüm ve sağlık verileri ile " +
      "varsa görsel verilerini, akademi başvurusu, antrenman planlaması, performans takibi " +
      "ve yasal yükümlülüklerin yerine getirilmesi amaçlarıyla işliyoruz. Verileriniz " +
      "Türkiye'de barındırılır, mevzuatın gerektirdiği süreler boyunca saklanır. KVKK md.11 " +
      "kapsamındaki haklarınızı (erişim, düzeltme, silme, itiraz) kullanabilirsiniz." +
      DRAFT,
  },
  {
    key: "acik-riza",
    title: "Kişisel Verilerin İşlenmesi — Açık Rıza",
    summary: "Kişisel verilerimin yukarıdaki amaçlarla işlenmesine açık rıza veriyorum.",
    isConsent: true,
    required: true,
    ordering: 2,
    body:
      "Sporcu adayına ve veliye ait kimlik ve iletişim verilerinin; başvurunun " +
      "değerlendirilmesi, deneme antrenmanı organizasyonu ve Kulüp ile iletişim amaçlarıyla " +
      "işlenmesine açık rıza veriyorum. Rızamı dilediğim zaman geri alabileceğimi biliyorum." +
      DRAFT,
  },
  {
    key: "saglik-verisi",
    title: "Sağlık ve Fiziksel Ölçüm Verileri — Açık Rıza (Özel Nitelikli)",
    summary: "Sporcunun sağlık ve fiziksel ölçüm (özel nitelikli) verilerinin işlenmesine açık rıza veriyorum.",
    isConsent: true,
    required: true,
    ordering: 3,
    body:
      "Sporcunun boy, kilo, fiziksel performans ölçümleri ve sağlık durumuna ilişkin özel " +
      "nitelikli kişisel verilerinin; antrenman güvenliği, gelişim ve performans takibi " +
      "amaçlarıyla, yalnızca yetkili antrenör/sağlık personeli tarafından işlenmesine açık " +
      "rıza veriyorum. Bu verilerin Türkiye'de saklanacağını biliyorum." +
      DRAFT,
  },
  {
    key: "foto-video",
    title: "Fotoğraf ve Video Paylaşım Muvafakatnamesi",
    summary: "Sporcunun fotoğraf/videolarının Kulüp tanıtımında ve sosyal medyada paylaşılmasına izin veriyorum.",
    isConsent: true,
    required: false, // OPSİYONEL — kayıt şartına bağlanamaz (KVKK)
    ordering: 4,
    body:
      "Sporcunun antrenman, maç ve etkinliklerde çekilen fotoğraf ve videolarının; Kulübün " +
      "web sitesi, sosyal medya hesapları ve tanıtım materyallerinde paylaşılmasına muvafakat " +
      "ediyorum. Bu izin OPSİYONELDİR; vermemem üyelik/kayıt hakkımı etkilemez ve izni " +
      "dilediğim zaman geri alabilirim. Geri aldığımda ileriye dönük paylaşımlar durdurulur." +
      DRAFT,
  },
  {
    key: "pazarlama",
    title: "Ticari Elektronik İleti (Pazarlama) İzni",
    summary: "Kulüpten haber, duyuru ve kampanyalardan haberdar olmak istiyorum.",
    isConsent: true,
    required: false,
    ordering: 5,
    body:
      "Kulübe ait haber, duyuru, etkinlik ve kampanyalara ilişkin ticari elektronik " +
      "iletilerin (SMS/e-posta) tarafıma gönderilmesine izin veriyorum. İzni dilediğim zaman " +
      "geri alabilirim." +
      DRAFT,
  },
];

export const REQUIRED_CONSENT_KEYS = CONSENT_DOCS.filter((d) => d.required).map((d) => d.key);

/**
 * İş başvurusu (kariyer) — kayıt-İÇİNDE aydınlatma+rıza metni ve sürümü.
 * Sporcu tarafının çok-belgeli ConsentRecord sistemi burada TEKRARLANMAZ:
 * tek seferlik, yetişkin başvuran. Form bu metni gösterir + gerçek onay kutusu;
 * başvuru kaydına metnin SHA-256'sı (consentTextHash) + sürüm + an + IP/UA yazılır.
 */
export const CAREER_CONSENT_VERSION = "2026-06-15";
export const CAREER_CONSENT_TEXT =
  "Buca Yıldız Futbol Akademisi olarak, 6698 sayılı Kişisel Verilerin Korunması " +
  "Kanunu (KVKK) kapsamında veri sorumlusu sıfatıyla; iş başvurunuz kapsamında " +
  "ad-soyad, iletişim (e-posta/telefon) ve özgeçmiş (CV) bilgilerinizi YALNIZCA " +
  "başvurunuzun değerlendirilmesi ve sizinle iletişim amacıyla işliyoruz. " +
  "Verileriniz Türkiye'de barındırılır, işe alım süreci sonuçlanana kadar veya " +
  "mevzuatın gerektirdiği süre boyunca saklanır ve üçüncü kişilerle paylaşılmaz. " +
  "KVKK md.11 kapsamındaki haklarınızı (erişim, düzeltme, silme, itiraz) " +
  "kullanabilirsiniz. Başvurumun bu kapsamda işlenmesine açık rıza veriyorum." +
  DRAFT;
