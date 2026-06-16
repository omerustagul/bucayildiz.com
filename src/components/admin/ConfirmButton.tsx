"use client";

/** Submit butonu + tarayıcı onayı (form action ile birlikte kullanılır). */
export function ConfirmButton({
  message,
  children,
  style,
}: {
  message: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      style={style}
    >
      {children}
    </button>
  );
}
