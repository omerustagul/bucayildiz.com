/**
 * RBAC izin kataloğu — TEK KAYNAK. Admin alanları (AdminShell nav'ıyla eşleşir) ×
 * 2 seviye: `.view` (sayfayı gör) + `.manage` (ekle/düzenle/sil). `owner` rolü
 * tüm izinleri ÖRTÜK taşır. Client-safe (yalnız sabitler + saf fonksiyonlar) —
 * hem izin matrisi UI'ı hem server guard'ları (requirePermission) bunu kullanır.
 *
 * "Genel Bakış" (/admin) her admin'e açıktır (katalogda YOK — izin gerektirmez).
 */

export type PermissionArea = { key: string; label: string; group: string };

/** Yönetilebilir alanlar — nav gruplarıyla birebir. Sıra UI'daki matris sırası. */
export const PERMISSION_AREAS: PermissionArea[] = [
  { key: "basvurular", label: "Başvurular", group: "Başvurular" },
  { key: "sporcular", label: "Sporcular", group: "Kulüp" },
  { key: "performans", label: "Performans", group: "Kulüp" },
  { key: "beslenme", label: "Beslenme", group: "Kulüp" },
  { key: "takimlar", label: "Takımlar", group: "Kulüp" },
  { key: "takvim", label: "Takvim Programı", group: "Kulüp" },
  { key: "antrenmanlar", label: "Antrenmanlar", group: "Kulüp" },
  { key: "fikstur", label: "Fikstür", group: "Kulüp" },
  { key: "puan", label: "Puan Durumu", group: "Kulüp" },
  { key: "odemeler", label: "Ödemeler", group: "Kulüp" },
  { key: "haberler", label: "Haberler / Blog", group: "İçerik & Site" },
  { key: "medya", label: "Medya Kütüphanesi", group: "İçerik & Site" },
  { key: "formalar", label: "Formalar", group: "İçerik & Site" },
  { key: "kadro", label: "Teknik Ekip & Yönetim", group: "İçerik & Site" },
  { key: "tesisler", label: "Tesisler", group: "İçerik & Site" },
  { key: "kariyer", label: "Kariyer / İş İlanları", group: "İçerik & Site" },
  { key: "mesajlar", label: "Mesaj & Doküman", group: "İletişim" },
  { key: "bildirimler", label: "Bildirimler", group: "İletişim" },
  { key: "ayarlar", label: "Ayarlar", group: "Sistem" },
  // KVKK rıza denetim izi (isim/IP/ilişki gibi hassas alanlar) — erişim minimizasyonu:
  // roster'ı yöneten herkes bu izi görmesin, ayrı yetki gerektirsin. Yalnız GÖRÜNTÜLEME
  // + CSV dışa aktarım (kayıtlar append-only; buradan mutasyon yok).
  { key: "kvkk", label: "KVKK Onay Kayıtları", group: "Sistem" },
  { key: "kullanicilar", label: "Yöneticiler & Yetkiler", group: "Sistem" },
];

export type PermissionLevel = "view" | "manage";

/** Tüm geçerli izin anahtarları (ör. "sporcular.view", "sporcular.manage"). */
export const ALL_PERMISSIONS: string[] = PERMISSION_AREAS.flatMap((a) => [`${a.key}.view`, `${a.key}.manage`]);
const ALL_SET = new Set(ALL_PERMISSIONS);

/** İstemciden gelen izin anahtarı katalogda var mı (kaydetmeden önce doğrulama). */
export function isValidPermission(key: string): boolean {
  return ALL_SET.has(key);
}

/**
 * Yetki kontrolü (SAF). Kurallar:
 * - `owner` → her şey.
 * - `admin` → izin kümesine bakılır; ayrıca `.manage` otomatik `.view`'ı İMA EDER
 *   (bir alanı yöneten görebilir de).
 * - diğer roller (athlete) → admin paneline zaten giremez → false.
 */
export function hasPermission(role: string, permissions: string[], key: string): boolean {
  if (role === "owner") return true;
  if (role !== "admin") return false;
  if (permissions.includes(key)) return true;
  if (key.endsWith(".view")) {
    const area = key.slice(0, -5); // ".view"
    return permissions.includes(`${area}.manage`);
  }
  return false;
}

/**
 * Rol ön-ayarları — UI'da izin kümesini tek tıkla doldurur (sonra elle düzenlenir).
 * `owner` özel olduğundan (tüm izinler örtük) burada yer almaz.
 */
export const ROLE_PRESETS: { key: string; label: string; permissions: string[] }[] = [
  {
    key: "editor",
    label: "Editör — içerik & site",
    permissions: ["haberler", "medya", "formalar", "kadro", "tesisler", "kariyer"].flatMap((a) => [`${a}.view`, `${a}.manage`]),
  },
  {
    key: "antrenor",
    label: "Antrenör — kulüp & performans",
    permissions: ["sporcular", "performans", "beslenme", "takimlar", "takvim", "antrenmanlar", "fikstur", "puan"].flatMap((a) => [`${a}.view`, `${a}.manage`]),
  },
  { key: "ozel", label: "Özel — boş başla, elle seç", permissions: [] },
];
