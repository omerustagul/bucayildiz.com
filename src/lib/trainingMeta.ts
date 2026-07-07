/** Antrenman durum etiketleri — admin ve sporcu paneli ortak kullanır. */
export const TRAINING_STATUS_META: Record<string, { label: string; tone: "navy" | "success" | "live" | "gold" }> = {
  planned: { label: "Planlandı", tone: "navy" },
  completed: { label: "Tamamlandı", tone: "success" },
  cancelled: { label: "İptal Edildi", tone: "live" },
  partial: { label: "Yarım Kaldı", tone: "gold" },
};

export const statusMeta = (s: string) => TRAINING_STATUS_META[s] ?? TRAINING_STATUS_META.planned;
