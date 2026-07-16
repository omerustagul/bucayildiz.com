"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/app/admin/(panel)/basvurular/actions";
import { Select } from "@/components/ui/Select";
import { APPLICATION_STATUSES } from "@/lib/applicationStatus";

/**
 * Seçenekler tek kaynaktan (applicationStatus) — filtre sekmeleri + satır rengiyle uyumlu.
 *
 * Sistem-yazımlı durumlar (ör. "Kayıtlandı") elle SET EDİLEMEZ — onları yalnız
 * dönüşüm aksiyonu koyar (sporcu yokken "Kayıtlandı" demek durumu yalanlardı).
 * AMA başvuru ZATEN o durumdaysa seçenek listesinde OLMALI: yoksa select onu
 * gösteremez ve sessizce İLK seçeneğe düşer → yönetici "Kayıtlandı" başvuruyu
 * "Yeni Başvuru" sanır (bu hata tarayıcı doğrulamasında yakalandı).
 * Sonuç: mevcut sistem-durumu görünür + oradan ÇIKMAK serbest, ama başka bir
 * başvuruya elle SET EDİLEMEZ. Sunucu tarafı kapı: updateApplicationStatus.
 */
function optionsFor(status: string) {
  return APPLICATION_STATUSES.filter((s) => !s.system || s.value === status).map((s) => ({ value: s.value, label: s.label }));
}

export function ApplicationStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      // key: Select KONTROLSÜZDÜR (iç state'i yalnız ilk mount'ta defaultValue'dan
      // kurulur — bkz. ui/Select.tsx). Durum DIŞARIDAN değişince (ör. başvurudan
      // sporcu oluşturma → "registered") prop değişse de select ESKİ değeri
      // göstermeye devam ediyordu. key değişince remount olur → doğru durum görünür.
      // Elle değişimde anlık geri bildirim de korunur (kontrollü yapsaydık kaybolurdu).
      key={status}
      defaultValue={status}
      disabled={pending}
      options={optionsFor(status)}
      onChange={(e) => {
        const value = e.target.value;
        startTransition(async () => {
          await updateApplicationStatus(id, value);
          router.refresh();
        });
      }}
      style={{
        fontFamily: "var(--font-body)",
        fontSize: 13,
        fontWeight: 600,
        padding: "6px 10px",
        borderRadius: "var(--radius-sm)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-card)",
        color: "var(--text-body)",
        cursor: pending ? "wait" : "pointer",
      }}
    />
  );
}
