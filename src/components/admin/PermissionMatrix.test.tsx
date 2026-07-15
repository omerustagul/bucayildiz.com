// @vitest-environment jsdom
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PermissionMatrix } from "./PermissionMatrix";

// Gerçek katalog yerine küçük/sabit bir katalogla test eder — testler
// lib/permissions.ts'teki alan listesi büyüdükçe/değiştikçe kırılmasın.
vi.mock("@/lib/permissions", () => ({
  PERMISSION_AREAS: [
    { key: "sporcular", label: "Sporcular", group: "Kulüp" },
    { key: "haberler", label: "Haberler", group: "İçerik" },
    { key: "kullanicilar", label: "Yöneticiler & Yetkiler", group: "Sistem" },
  ],
  ROLE_PRESETS: [
    { key: "antrenor", label: "Antrenör Şablonu", permissions: ["sporcular.view", "sporcular.manage"] },
    { key: "ozel", label: "Özel — boş başla, elle seç", permissions: [] },
  ],
}));

/** Kontrollü bileşen — gerçek kullanım gibi (UserDrawer) durumu üstte tutan sarmalayıcı. */
function Harness({ initial = [] as string[] }: { initial?: string[] }) {
  const [value, setValue] = useState<string[]>(initial);
  return <PermissionMatrix value={value} onChange={setValue} />;
}

describe("PermissionMatrix", () => {
  it("owner-exclusive 'kullanicilar' alanını hiç göstermez", () => {
    render(<Harness />);
    expect(screen.queryByText("Yöneticiler & Yetkiler")).not.toBeInTheDocument();
    expect(screen.getByText("Sporcular")).toBeInTheDocument();
    expect(screen.getByText("Haberler")).toBeInTheDocument();
  });

  it("'Yönet' işaretlenince 'Görüntüle' de otomatik işaretlenir", () => {
    render(<Harness />);
    const manage = screen.getByTestId("perm-sporcular-manage") as HTMLInputElement;
    const view = screen.getByTestId("perm-sporcular-view") as HTMLInputElement;
    expect(view.checked).toBe(false);
    fireEvent.click(manage);
    expect(manage.checked).toBe(true);
    expect(view.checked).toBe(true);
  });

  it("'Görüntüle' kaldırılınca 'Yönet' de kalkar (manage view'ı ima eder)", () => {
    render(<Harness initial={["sporcular.view", "sporcular.manage"]} />);
    const manage = screen.getByTestId("perm-sporcular-manage") as HTMLInputElement;
    const view = screen.getByTestId("perm-sporcular-view") as HTMLInputElement;
    expect(manage.checked).toBe(true);
    fireEvent.click(view);
    expect(view.checked).toBe(false);
    expect(manage.checked).toBe(false);
  });

  it("'Görüntüle' tek başına kaldırılabilir/eklenebilir ve diğer alanı etkilemez", () => {
    render(<Harness />);
    const sporcularView = screen.getByTestId("perm-sporcular-view") as HTMLInputElement;
    const haberlerView = screen.getByTestId("perm-haberler-view") as HTMLInputElement;
    fireEvent.click(sporcularView);
    expect(sporcularView.checked).toBe(true);
    expect(screen.getByTestId("perm-sporcular-manage")).not.toBeChecked();
    expect(haberlerView.checked).toBe(false);
  });

  it("rol şablonu butonu tıklanınca izin kümesini şablonla DEĞİŞTİRİR", () => {
    render(<Harness initial={["haberler.view"]} />);
    fireEvent.click(screen.getByTestId("perm-preset-antrenor"));
    expect(screen.getByTestId("perm-sporcular-view")).toBeChecked();
    expect(screen.getByTestId("perm-sporcular-manage")).toBeChecked();
    expect(screen.getByTestId("perm-haberler-view")).not.toBeChecked();
  });

  it("'Özel' şablonu izin kümesini tamamen boşaltır", () => {
    render(<Harness initial={["sporcular.view", "sporcular.manage"]} />);
    fireEvent.click(screen.getByTestId("perm-preset-ozel"));
    expect(screen.getByTestId("perm-sporcular-view")).not.toBeChecked();
    expect(screen.getByTestId("perm-sporcular-manage")).not.toBeChecked();
  });
});
