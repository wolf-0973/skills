#!/usr/bin/env node
// 转码/评审前的环境自检：给团队新人一眼看出还差什么、怎么补。
// 用法：node setup-check.mjs [figmaToken]
//   token 未传时依次读环境变量 FIGMA_API_KEY / FIGMA_TOKEN / FIGMA_PERSONAL_ACCESS_TOKEN
//
// 只检查脚本能确定的环境前提；MCP 服务器是否真的被宿主加载，由运行时 Capability Probe 判。

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

let hardFail = false;
const line = (icon, msg, hint) => console.log(`${icon} ${msg}${hint ? `\n    → ${hint}` : ""}`);

// 1) Node 版本（fetch 需 18+）
const nodeMajor = Number(process.versions.node.split(".")[0]);
if (nodeMajor >= 18) line("✓", `Node ${process.versions.node}`);
else {
  hardFail = true;
  line("✗", `Node ${process.versions.node} 过低`, "升级到 Node 18+（脚本依赖内置 fetch）");
}

// 2) Chrome / Chromium（review phase 截图用）
const chromeBins = ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser", "chrome"];
const macPaths = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];
let chrome = chromeBins.find((b) => {
  try {
    execFileSync("which", [b], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
});
if (!chrome) chrome = macPaths.find((p) => existsSync(p));
if (chrome) line("✓", `Chrome/Chromium 可用（${chrome}）`);
else line("⚠", "未发现 Chrome/Chromium", "review phase 截图需要；装 Chrome 或确认 chrome-devtools MCP 自带浏览器");

// 3) Figma token（转码的硬前提）
const token =
  process.argv[2] ||
  process.env.FIGMA_API_KEY ||
  process.env.FIGMA_TOKEN ||
  process.env.FIGMA_PERSONAL_ACCESS_TOKEN;

if (!token) {
  line(
    "⚠",
    "环境里未发现 Figma token",
    "若已直接写在 MCP 参数 --figma-api-key 里可忽略；否则见 references/mcp-setup.md 生成 token"
  );
} else {
  try {
    const res = await fetch("https://api.figma.com/v1/me", {
      headers: { "X-Figma-Token": token },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const me = await res.json().catch(() => ({}));
      line("✓", `Figma token 有效${me.email ? `（${me.email}）` : ""}`);
    } else if (res.status === 403) {
      hardFail = true;
      line("✗", "Figma token 无效或权限不足（403）", "重新生成 Personal access token");
    } else {
      line("⚠", `Figma /v1/me 返回 ${res.status}`, "稍后重试或检查 token");
    }
  } catch {
    line("⚠", "无法连到 api.figma.com（离线？）", "有网时重跑本脚本以验证 token");
  }
}

console.log("");
console.log(
  hardFail
    ? "✗ 存在必须修复的问题，见上方 → 提示"
    : "✓ 环境前提就绪；MCP 工具是否加载由运行时 Capability Probe 确认"
);
process.exit(hardFail ? 1 : 0);
