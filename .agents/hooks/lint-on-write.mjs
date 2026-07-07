import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, ""));
const filePath = input.tool_response?.filePath ?? input.tool_input?.file_path ?? "";

const lintable = /\.(ts|tsx|js|jsx|mjs|cjs)$/.test(filePath);
const excluded = /[\\/](node_modules|\.next|\.git|\.agents|\.claude)[\\/]/.test(filePath);
if (!filePath || !lintable || excluded) process.exit(0);

const result = spawnSync(`npx eslint --no-warn-ignored --max-warnings=0 "${filePath}"`, {
  shell: true,
  encoding: "utf8",
  timeout: 90_000,
});

// Uyari modu: exit 0 + additionalContext — modele bilgi verir ama islemi engellemez.
if (result.status !== 0) {
  const output = `${result.stdout || ""}${result.stderr || ""}`.trim();
  console.log(
    JSON.stringify({
      systemMessage: `ESLint uyarisi: ${filePath}`,
      hookSpecificOutput: {
        hookEventName: "PostToolUse",
        additionalContext: `ESLint sorunlari (uyari, engellemez) — ${filePath}:\n${output}`,
      },
    })
  );
}
