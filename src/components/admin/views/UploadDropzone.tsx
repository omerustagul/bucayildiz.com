"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";

/**
 * Medya yükleme alanı — GERÇEK sürükle-bırak (onDrop) + çoklu seçim (multiple).
 * Dosya doğrulaması sunucuda (/api/upload → saveUpload); burada yalnız dosyaları
 * toplayıp `onFiles`'a verir. `disabled` iken ne tık ne bırakma yükleme yapar.
 */
export function UploadDropzone({
  onFiles,
  busy = false,
  disabled = false,
}: {
  onFiles: (files: File[]) => void;
  busy?: boolean;
  disabled?: boolean;
}) {
  const [over, setOver] = useState(false);

  const pick = (list: FileList | null) => {
    if (disabled || !list) return;
    const files = Array.from(list);
    if (files.length) onFiles(files);
  };

  return (
    <label
      data-testid="upload-dropzone"
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        pick(e.dataTransfer?.files ?? null);
      }}
      style={{
        position: "relative",
        aspectRatio: "1 / 1",
        borderRadius: "var(--radius-md)",
        border: over ? "1.5px solid var(--navy-600)" : "1.5px dashed var(--ink-300)",
        background: over ? "var(--navy-50)" : "var(--ink-50)",
        display: "grid",
        placeItems: "center",
        cursor: busy ? "wait" : disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        textAlign: "center",
        transition: "border-color var(--dur-fast), background var(--dur-fast)",
      }}
    >
      <input
        type="file"
        accept="image/*,video/mp4,video/webm"
        multiple
        disabled={busy || disabled}
        style={{ display: "none" }}
        onChange={(e) => {
          pick(e.target.files);
          e.target.value = "";
        }}
      />
      <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, color: "var(--ink-600)", padding: 12 }}>
        <span style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--navy-50)", color: "var(--navy-600)", display: "grid", placeItems: "center" }}>
          <Icon name="image" size={18} />
        </span>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{busy ? "Yükleniyor…" : "Sürükle bırak / seç"}</span>
        <span style={{ fontSize: 11, color: "var(--ink-400)", textAlign: "center", lineHeight: 1.5 }}>JPG, PNG · otomatik sıkıştırılır · Video (MP4/WEBM) en fazla 30 MB</span>
      </span>
    </label>
  );
}
