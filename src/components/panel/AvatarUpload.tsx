"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "@/components/ui/Avatar";
import { Icon } from "@/lib/icons";
import { updatePhoto } from "@/app/panel/profil/actions";
import { toast } from "@/components/ui/Toast";

/**
 * Sporcu paneli — profil fotoğrafı yükleme/değiştirme.
 * Akış: dosya seçilir → /api/upload (magic-byte doğrulamalı, storage.ts) → dönen
 * URL, `updatePhoto` server action'ı ile (requireAthlete, yalnız kendi kaydı)
 * Athlete.photoUrl'e yazılır → router.refresh() ile sunucu bileşenleri (header,
 * layout) tazelenir.
 */
export function AvatarUpload({ name, photoUrl }: { name: string; photoUrl: string | null }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");

      startTransition(async () => {
        const result = await updatePhoto(data.url);
        if (result.ok) {
          toast.success("Profil fotoğrafınız güncellendi.");
          router.refresh();
        } else {
          setError(result.error);
          toast.error(result.error);
        }
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Yükleme başarısız.";
      setError(message);
      toast.error(message);
    } finally {
      setBusy(false);
    }
  }

  const loading = busy || pending;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <div style={{ position: "relative", width: 72, height: 72 }}>
        <Avatar name={name} src={photoUrl} size={72} ring />
        <button
          type="button"
          aria-label={photoUrl ? "Fotoğrafı değiştir" : "Fotoğraf yükle"}
          title={photoUrl ? "Fotoğrafı değiştir" : "Fotoğraf yükle"}
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          style={{
            position: "absolute",
            right: -2,
            bottom: -2,
            width: 28,
            height: 28,
            borderRadius: "50%",
            border: "2px solid var(--surface-card)",
            background: "var(--grad-gold)",
            color: "var(--navy-900)",
            display: "grid",
            placeItems: "center",
            cursor: loading ? "wait" : "pointer",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <Icon name="camera" size={14} />
        </button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {error && <span style={{ fontSize: 11.5, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}
