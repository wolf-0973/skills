#!/usr/bin/env node
// 确定性探测项目前端栈，输出 JSON 供 figma-to-code Step 0 使用。
// 用法：node detect-stack.mjs [projectRoot]   (默认当前目录)
//
// 只做能从文件确定的判断；判不出的写进 assumptions，交给模型兜底。
// 不写死任何具体栈——每次都现场探测。

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const root = process.argv[2] || process.cwd();
const assumptions = [];

const readText = (p) => {
  try {
    return readFileSync(join(root, p), "utf8");
  } catch {
    return null;
  }
};
const readJSON = (p) => {
  const t = readText(p);
  if (!t) return null;
  try {
    return JSON.parse(t);
  } catch {
    return null;
  }
};

const pkg = readJSON("package.json");
const deps = pkg ? { ...pkg.dependencies, ...pkg.devDependencies } : {};
const has = (name) => Object.prototype.hasOwnProperty.call(deps, name);
const major = (name) => {
  const m = String(deps[name] || "").match(/(\d+)/);
  return m ? Number(m[1]) : null;
};

// 找到根目录下匹配某前缀的配置文件（如 postcss.config / tailwind.config / vite.config）
const findConfig = (prefix) => {
  try {
    return readdirSync(root).find((f) => f.startsWith(prefix + ".")) || null;
  } catch {
    return null;
  }
};

// —— framework ——
let framework = "unknown";
let frameworkMeta = null;
if (has("next")) {
  framework = "react";
  frameworkMeta = "next";
} else if (has("nuxt")) {
  framework = "vue";
  frameworkMeta = "nuxt";
} else if (has("@angular/core")) {
  framework = "angular";
} else if (has("svelte")) {
  framework = "svelte";
} else if (has("solid-js")) {
  framework = "solid";
} else if (has("vue")) {
  framework = "vue";
  frameworkMeta = `vue@${major("vue") ?? "?"}`;
} else if (has("preact")) {
  framework = "preact";
} else if (has("react")) {
  framework = "react";
}
if (framework === "unknown") {
  if (!pkg) assumptions.push("无 package.json，无法判断框架，可能是纯 HTML/CSS");
  else assumptions.push("package.json 里未识别到已知框架依赖，请人工确认");
}

// —— styling ——
const styling = [];
if (has("tailwindcss")) styling.push("tailwind");
if (has("unocss")) styling.push("unocss");
if (has("styled-components")) styling.push("styled-components");
if (has("@emotion/react") || has("@emotion/styled")) styling.push("emotion");
if (has("@vanilla-extract/css")) styling.push("vanilla-extract");
if (has("sass") || has("node-sass")) styling.push("sass");

// css-modules 是打包器特性、不体现在依赖里，做一次有界扫描找 *.module.(css|scss|less)
const cssModuleFound = (() => {
  let visited = 0;
  const skip = new Set(["node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage"]);
  const walk = (dir) => {
    if (visited > 2000) return false;
    let entries;
    try {
      entries = readdirSync(dir);
    } catch {
      return false;
    }
    for (const name of entries) {
      if (skip.has(name)) continue;
      const full = join(dir, name);
      let st;
      try {
        st = statSync(full);
      } catch {
        continue;
      }
      if (st.isDirectory()) {
        if (walk(full)) return true;
      } else {
        visited++;
        if (/\.module\.(css|scss|less)$/.test(name)) return true;
      }
    }
    return false;
  };
  return walk(root);
})();
if (cssModuleFound) styling.push("css-modules");
if (styling.length === 0) {
  styling.push("css");
  assumptions.push("未识别到样式方案，按原生 CSS 处理，请人工确认");
}

// —— unitStrategy（px 换算）——
let unitStrategy = { mode: "px" };
const postcssFile = findConfig("postcss.config") || findConfig(".postcssrc");
const postcssText =
  (postcssFile && readText(postcssFile)) ||
  (pkg && pkg.postcss ? JSON.stringify(pkg.postcss) : null);
if (postcssText && /pxtorem/.test(postcssText)) {
  const rv = postcssText.match(/rootValue\s*:\s*([\d.]+)/);
  unitStrategy = { mode: "pxtorem", rootValue: rv ? Number(rv[1]) : null };
  if (!rv) assumptions.push("检测到 postcss-pxtorem，但未解析出 rootValue，请人工确认");
} else if (postcssText && /(px-to-viewport|pxtoviewport)/.test(postcssText)) {
  const vw = postcssText.match(/viewportWidth\s*:\s*([\d.]+)/);
  unitStrategy = { mode: "pxtoviewport", viewportWidth: vw ? Number(vw[1]) : null };
} else if (styling.includes("tailwind")) {
  unitStrategy = { mode: "tailwind-rem" };
}

// —— tokenSource ——
let tokenSource = "none";
if (findConfig("tailwind.config")) tokenSource = "tailwind";
else assumptions.push("未发现 tailwind config，token 来源可能是 CSS 变量或无，请人工确认");

// —— pagesDir ——
const pagesDir = ["app", "pages", "src/app", "src/pages", "src/views", "src/routes"].filter(
  (d) => existsSync(join(root, d))
);
if (pagesDir.length === 0) assumptions.push("未发现常见页面目录，请人工指定落地路径");

// —— commands ——
const scripts = (pkg && pkg.scripts) || {};
const pick = (...names) => {
  const key = names.find((n) => scripts[n]);
  return key ? `${detectPM(root)} run ${key}` : null;
};
const commands = {
  dev: pick("dev", "serve", "start"),
  lint: pick("lint"),
  typecheck: pick("type-check", "typecheck", "tsc"),
};
if (!commands.dev) assumptions.push("package.json 无 dev/serve/start 脚本，review phase 需人工提供启动方式");

function detectPM(r) {
  if (existsSync(join(r, "pnpm-lock.yaml"))) return "pnpm";
  if (existsSync(join(r, "yarn.lock"))) return "yarn";
  if (existsSync(join(r, "bun.lockb"))) return "bun";
  return "npm";
}

console.log(
  JSON.stringify(
    { framework, frameworkMeta, styling, unitStrategy, tokenSource, pagesDir, commands, assumptions },
    null,
    2
  )
);
