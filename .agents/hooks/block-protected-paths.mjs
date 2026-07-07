import { readFileSync } from "node:fs";

const PROTECTED = ["node_modules", ".git", "vendor", ".next"];

const input = JSON.parse(readFileSync(0, "utf8").replace(/^﻿/, ""));
const filePath = input.tool_input?.file_path ?? input.tool_input?.notebook_path ?? "";
const segments = filePath.split(/[\\/]/);
const hit = PROTECTED.find((dir) => segments.includes(dir));

if (hit) {
  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: "PreToolUse",
        permissionDecision: "deny",
        permissionDecisionReason: `Korumali klasore yazma engellendi: "${hit}" (${filePath}). Bu klasorler uretilen/harici iceriktir; kaynak dosyayi duzenle.`,
      },
    })
  );
}
