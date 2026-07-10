"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateApplicationStatus } from "@/app/admin/(panel)/basvurular/actions";
import { Select } from "@/components/ui/Select";

const OPTIONS = [
  { value: "new", label: "Yeni" },
  { value: "contacted", label: "İletişime Geçildi" },
  { value: "scheduled", label: "Randevu Verildi" },
  { value: "closed", label: "Kapandı" },
];

export function ApplicationStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Select
      defaultValue={status}
      disabled={pending}
      options={OPTIONS}
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
