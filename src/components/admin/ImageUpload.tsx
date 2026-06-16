"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/lib/icons";

/** Görsel yükleme — /api/upload'a POST eder, URL döndürür. */
export function ImageUpload({
  value,
  onChange,
  label = "Görsel",
  aspect = "16 / 9",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  aspect?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Yükleme başarısız.");
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "var(--text-strong)" }}>{label}</label>

      {value ? (
        <div style={{ position: "relative", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--border-subtle)", aspectRatio: aspect, background: "var(--surface-subtle)" }}>
          <Image src={value} alt="" fill style={{ objectFit: "cover" }} sizes="(max-width: 760px) 100vw, 480px" />
          <button
            type="button"
            onClick={() => onChange(null)}
            style={{ position: "absolute", top: 8, right: 8, display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: "var(--radius-sm)", border: "none", background: "rgba(0,0,0,0.6)", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
          >
            <Icon name="trash-2" size={13} /> Kaldır
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          style={{
            display: "grid",
            placeItems: "center",
            gap: 8,
            aspectRatio: aspect,
            borderRadius: "var(--radius-md)",
            border: "1.5px dashed var(--border-strong)",
            background: "var(--surface-subtle)",
            color: "var(--text-muted)",
            cursor: uploading ? "wait" : "pointer",
            width: "100%",
          }}
        >
          <Icon name="image" size={26} />
          <span style={{ fontSize: 13, fontWeight: 600 }}>{uploading ? "Yükleniyor…" : "Görsel Yükle"}</span>
          <span style={{ fontSize: 11.5 }}>JPG, PNG, WEBP · maks. 5 MB</span>
        </button>
      )}

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
      {error && <span style={{ fontSize: 12.5, color: "var(--red-600)" }}>{error}</span>}
    </div>
  );
}
