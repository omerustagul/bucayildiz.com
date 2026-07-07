import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, ""));
const filePath = input.tool_response?.filePath ?? input.tool_input?.file_path ?? "";

const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(filePath);
const excluded = /[\\/](node_modules|\.next|\.git)[\\/]/.test(filePath);
if (!filePath || !isTestFile || excluded) process.exit(0);

const result = spawnSync(`npx vitest run "${filePath}"`, {
  shell: true,
  encoding: "utf8",
  timeout: 240_000,
});

// Blok modu (AGENTS.md §2): exit 2 en kati seviyedir — islemi basarisiz sayar
// ve hata ciktisini modele geri besleyerek duzeltme yapilmadan devam edilmesini engeller.
if (result.status !== 0) {
  console.error(`Vitest basarisiz — testler gecmeden islem tamamlanmis sayilmaz (${filePath}):\n${result.stdout || ""}${result.stderr || ""}`);
  process.exit(2);
}
