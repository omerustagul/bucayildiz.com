/**
 * Sayfa-bazlı SEO için indexlenen ana statik sayfaların KANONİK listesi (Madde 6).
 * CLIENT-SAFE (yalnız sabit; server/prisma içermez) → admin SEO yöneticisi bunu
 * gösterir. Her sayfa generateMetadata'sında kendi path'iyle getPageMetadata
 * (lib/seo.ts) çağırır. Dinamik içerik sayfaları (haber/takım detayı) burada YOK —
 * onlar SEO'yu kendi içeriğinden türetir.
 */
export type SeoPage = { path: string; label: string; group: string };

export const SEO_PAGES: SeoPage[] = [
  { path: "/", label: "Ana Sayfa", group: "Genel" },
  { path: "/iletisim", label: "İletişim", group: "Genel" },
  { path: "/basvuru", label: "Başvuru", group: "Genel" },
  { path: "/ucretsiz-deneme", label: "Ücretsiz Deneme", group: "Genel" },

  { path: "/kurumsal", label: "Kurumsal", group: "Kurumsal" },
  { path: "/kurumsal/hakkimizda", label: "Hakkımızda", group: "Kurumsal" },
  { path: "/kurumsal/yonetim", label: "Yönetim", group: "Kurumsal" },
  { path: "/kurumsal/tesisler", label: "Tesisler", group: "Kurumsal" },
  { path: "/kurumsal/vizyon-misyon", label: "Vizyon & Misyon", group: "Kurumsal" },
  { path: "/kurumsal/kariyer", label: "Kariyer", group: "Kurumsal" },

  { path: "/altyapi", label: "Altyapı", group: "Altyapı" },
  { path: "/altyapi/antrenorler", label: "Antrenörler", group: "Altyapı" },
  { path: "/altyapi/gelisim-programi", label: "Gelişim Programı", group: "Altyapı" },
  { path: "/altyapi/secmeler", label: "Seçmeler", group: "Altyapı" },
  { path: "/altyapi/yaz-okulu", label: "Yaz Okulu", group: "Altyapı" },

  { path: "/takimlar", label: "Takımlar", group: "Takımlar & Fikstür" },
  { path: "/fikstur", label: "Fikstür", group: "Takımlar & Fikstür" },
  { path: "/fikstur/puan-durumu", label: "Puan Durumu", group: "Takımlar & Fikstür" },
  { path: "/fikstur/sonuclar", label: "Sonuçlar", group: "Takımlar & Fikstür" },

  { path: "/haberler", label: "Haberler", group: "Medya" },
  { path: "/medya", label: "Medya", group: "Medya" },
  { path: "/medya/fotograflar", label: "Fotoğraflar", group: "Medya" },
  { path: "/medya/videolar", label: "Videolar", group: "Medya" },
  { path: "/medya/basinda-biz", label: "Basında Biz", group: "Medya" },
];

/** Geçerli SEO path'leri — savePageSeo yalnız bu path'leri kabul eder (allowlist). */
export const SEO_PAGE_PATHS = new Set(SEO_PAGES.map((p) => p.path));
