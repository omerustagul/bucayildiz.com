/** Paylaşılan sabit listeler (server action olmayan, hem client hem server kullanır). */
export const TRAINING_TYPES = ["Saha", "Kondisyon", "Taktik", "Bireysel", "Maç"] as const;

export const POSITIONS = ["Kaleci", "Stoper", "Bek", "Ön Libero", "Orta Saha", "Ofansif O.S.", "Kanat", "Forvet"] as const;

export const ATHLETE_STATUS = [
  { value: "active", label: "Aktif" },
  { value: "injured", label: "Sakat" },
  { value: "rest", label: "İzinli" },
] as const;

export const POST_TEMPLATES = [
  { id: "sondakika", name: "Son Dakika", icon: "zap", tag: "Haber", desc: "Tek manşet, büyük kapak görseli ve kısa metin. Hızlı duyurular için.", blocks: ["Kapak görseli", "Manşet", "Özet", "Metin"] },
  { id: "macraporu", name: "Maç Raporu", icon: "trophy", tag: "Spor", desc: "Skor başlığı, kadro, maç anlatımı ve foto galeri.", blocks: ["Skor başlığı", "Kapak", "Maç anlatımı", "Galeri"] },
  { id: "galeri", name: "Galeri / Ödül Töreni", icon: "images", tag: "Galeri", desc: "Görsel ağırlıklı; kapak + foto ızgarası + kısa açıklamalar.", blocks: ["Kapak", "Foto ızgarası", "Açıklama"] },
  { id: "standart", name: "Standart Haber", icon: "newspaper", tag: "Genel", desc: "Klasik; görsel + paragraflar + ara başlıklar. Çok amaçlı.", blocks: ["Kapak", "Giriş", "Ara başlık + metin", "Görsel"] },
  { id: "roportaj", name: "Röportaj", icon: "mic", tag: "Söyleşi", desc: "Soru–cevap blokları, alıntılar ve portre görseli.", blocks: ["Portre", "Giriş", "Soru–Cevap", "Alıntı"] },
  { id: "duyuru", name: "Duyuru", icon: "megaphone", tag: "Resmî", desc: "Sade, metin odaklı; logo + başlık + bilgilendirme.", blocks: ["Başlık", "Bilgilendirme", "İletişim"] },
] as const;

export const POST_TEMPLATE_IDS = POST_TEMPLATES.map((t) => t.id) as unknown as [string, ...string[]];

export const POST_CATEGORIES = ["Manşet", "Altyapı", "Maç Günü", "Tesis", "Ödül Töreni", "Etkinlik", "Duyuru", "Röportaj"] as const;

export const POST_STATUSES = [
  { id: "draft", name: "Taslak" },
  { id: "published", name: "Yayında" },
  { id: "scheduled", name: "Zamanlanmış" },
] as const;

