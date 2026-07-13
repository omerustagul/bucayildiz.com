// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { UploadDropzone } from "./UploadDropzone";

const png = (name: string) => new File(["x"], name, { type: "image/png" });

describe("UploadDropzone", () => {
  it("dosya seçici görsel VE video kabul eder (MP4/WebM de kütüphaneye yüklenebilsin)", () => {
    render(<UploadDropzone onFiles={vi.fn()} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.accept).toBe("image/*,video/mp4,video/webm");
  });

  it("çoklu seçim açık (multiple) ve onChange TÜM dosyaları geçirir", () => {
    const onFiles = vi.fn();
    render(<UploadDropzone onFiles={onFiles} />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.multiple).toBe(true);
    fireEvent.change(input, { target: { files: [png("a.png"), png("b.png")] } });
    expect(onFiles).toHaveBeenCalledOnce();
    expect((onFiles.mock.calls[0][0] as File[]).map((f) => f.name)).toEqual(["a.png", "b.png"]);
  });

  it("sürükle-bırak (drop) gerçekten onFiles'ı tetikler — mantık artık kırık değil", () => {
    const onFiles = vi.fn();
    render(<UploadDropzone onFiles={onFiles} />);
    fireEvent.drop(screen.getByTestId("upload-dropzone"), { dataTransfer: { files: [png("c.png"), png("d.png")] } });
    expect(onFiles).toHaveBeenCalledOnce();
    expect((onFiles.mock.calls[0][0] as File[]).map((f) => f.name)).toEqual(["c.png", "d.png"]);
  });

  it("disabled iken ne drop ne seçim yükleme yapar", () => {
    const onFiles = vi.fn();
    render(<UploadDropzone onFiles={onFiles} disabled />);
    fireEvent.drop(screen.getByTestId("upload-dropzone"), { dataTransfer: { files: [png("c.png")] } });
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [png("a.png")] } });
    expect(onFiles).not.toHaveBeenCalled();
  });
});
