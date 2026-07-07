"use client";

import { useState } from "react";
import { Icon } from "@/lib/icons";

/**
 * Buca Yıldız — PasswordInput
 * Şifre alanı + göster/gizle ikon-buton. Giriş formları ve profil şifre
 * değiştirme formlarında ortak kullanılır (min:0 kuralına uyar).
 */
type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  autoComplete?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  style?: React.CSSProperties;
};

export function PasswordInput({
  value,
  onChange,
  id,
  placeholder,
  autoComplete = "current-password",
  required = false,
  leftIcon,
  style,
}: PasswordInputProps) {
  const [show, setShow] = useState(false);

  const fieldStyle: React.CSSProperties = {
    fontFamily: "var(--font-body)",
    fontSize: 14.5,
    padding: leftIcon ? "11px 40px 11px 40px" : "11px 40px 11px 13px",
    borderRadius: "var(--radius-sm)",
    border: "1px solid var(--border-subtle)",
    background: "var(--surface-card)",
    color: "var(--text-body)",
    width: "100%",
    minWidth: 0,
    ...style,
  };

  return (
    <div style={{ position: "relative", minWidth: 0 }}>
      {leftIcon && (
        <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--ink-400)" }}>
          {leftIcon}
        </span>
      )}
      <input
        id={id}
        type={show ? "text" : "password"}
        autoComplete={autoComplete}
        style={fieldStyle}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "Şifreyi gizle" : "Şifreyi göster"}
        title={show ? "Şifreyi gizle" : "Şifreyi göster"}
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          display: "grid",
          placeItems: "center",
          width: 28,
          height: 28,
          border: "none",
          background: "transparent",
          color: "var(--ink-400)",
          cursor: "pointer",
          padding: 0,
        }}
      >
        <Icon name={show ? "eye-off" : "eye"} size={16} />
      </button>
    </div>
  );
}
