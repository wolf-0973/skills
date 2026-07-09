#!/usr/bin/env node
// 轮询一个 URL 直到 server 就绪，供 review phase 起 dev server 后判断是否可截图。
// 用法：node wait-for-server.mjs <url> [timeoutMs=60000] [intervalMs=1000]
//
// 输出 JSON：
//   { ready: true,  alreadyRunning: true }   首探就通（server 已在跑，别再起一个）
//   { ready: true,  waitedMs: N }            起后等就绪
//   { ready: false, error, waitedMs }        超时未就绪
// 任何 HTTP 响应（含 3xx/4xx/5xx）都视为"就绪"——server 在监听即可，鉴权/路由问题另判。

const url = process.argv[2];
const timeoutMs = Number(process.argv[3] || 60000);
const intervalMs = Number(process.argv[4] || 1000);

if (!url) {
  console.error("usage: node wait-for-server.mjs <url> [timeoutMs] [intervalMs]");
  process.exit(2);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probe() {
  try {
    await fetch(url, { signal: AbortSignal.timeout(Math.min(intervalMs * 3, 5000)) });
    return true; // 有响应即视为在监听
  } catch (e) {
    // ECONNREFUSED / abort / DNS 等 = 还没起来
    return false;
  }
}

const start = Date.now();
let first = true;
let lastErr = "connection refused / timeout";

while (Date.now() - start < timeoutMs) {
  if (await probe()) {
    const waitedMs = Date.now() - start;
    console.log(JSON.stringify(first ? { ready: true, alreadyRunning: true } : { ready: true, waitedMs }));
    process.exit(0);
  }
  first = false;
  await sleep(intervalMs);
}

console.log(JSON.stringify({ ready: false, error: lastErr, waitedMs: Date.now() - start }));
process.exit(1);
