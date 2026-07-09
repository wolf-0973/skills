#!/usr/bin/env node
// 解析 Figma URL，输出 { fileKey, nodeId }。
// 用法：node parse-figma-url.mjs "<figma-url>"
//   nodeId 已转成 MCP 需要的冒号格式（1234-5678 → 1234:5678）
//   缺 node-id 时 nodeId 为 null；无法识别 fileKey 时非零退出。

const url = process.argv[2];
if (!url) {
  console.error("usage: node parse-figma-url.mjs <figma-url>");
  process.exit(2);
}

// fileKey：/design/<key>/ 或 /file/<key>/
const fileKey = url.match(/\/(?:design|file)\/([a-zA-Z0-9]+)/)?.[1] ?? null;

// nodeId：query 里的 node-id=1234-5678 或 1234:5678
let nodeId = null;
const raw = url.match(/[?&]node-id=([^&]+)/)?.[1];
if (raw) {
  nodeId = decodeURIComponent(raw).replace("-", ":");
}

if (!fileKey) {
  console.error("error: 无法从 URL 提取 fileKey，请确认这是 figma.com/design 或 /file 链接");
  process.exit(1);
}

console.log(JSON.stringify({ fileKey, nodeId }));
