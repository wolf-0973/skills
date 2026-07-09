---
name: figma-to-code
description: >-
  Convert Figma designs to production code (Vue / React / HTML / CSS) and run a
  built-in visual review phase. Use when a message contains figma.com/design/ or
  figma.com/file/ links, or the user asks to implement from a design, build a
  component from Figma, review visual fidelity, or turn a mockup into code. Do
  UI code only after get_figma_data succeeds.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
compatibility: Requires Framelink Figma MCP, Chrome DevTools MCP, and a Figma API token.
---

# Figma to Code

核心顺序：**data gate → structure → anchors → code → validation → review**。

## Gates

- Capability gate: 确认 Framelink Figma MCP、浏览器截图能力、仓库读写能力；配置见 [references/mcp-setup.md](references/mcp-setup.md)。
- Data gate: `get_figma_data` 成功前只做探测与规划；失败即输出 `Figma MCP: <错误类型>` 并停止。
- Scope gate: 执行边界见 [references/execution-policy.md](references/execution-policy.md)。视觉/display 可自动改；业务逻辑、API、路由、状态、持久化、公共组件 API 进入 `needs_decision`。

## Process

1. **Choose mode.** `generate` 从 Figma 实现代码；`review-only` 对已有实现做视觉验收。Completion: mode、Figma URL、目标节点、dev URL/route 或落地路径已知；缺关键输入时询问。
2. **Read project context.** 运行 `scripts/detect-stack.mjs`，再读仓库规则与同类组件。Completion: framework、styling、目录、命令、token/source assumptions 已记录。
3. **Fetch Figma data.** 用 `scripts/parse-figma-url.mjs` 解析 URL，读 MCP schema，再调用 `get_figma_data`。Completion: 节点树可用，`visible: false` 节点进入 Assumptions。
4. **Plan structure and anchors.** 按 [references/pipeline-details.md](references/pipeline-details.md) 完成 region checklist、至少 6 个尺寸锚点、样式映射与资产计划。Completion: 代码前的结构和尺寸证据齐全。
5. **Generate code.** 复用项目组件和 token；布局优先 flex/grid；事件处理只留展示层 TODO。页面/路由组件写 `@figma` 文件头。
6. **Validate.** 运行探测到的 lint/typecheck；没有命令时尝试项目常见命令。Completion: 通过，或失败原因和未修复项明确。
7. **Review phase.** 默认生成 [references/review-brief.md](references/review-brief.md) 并交给 `figma-review-phase`；用户明说跳过时记录 `Review phase: skipped (user opt-out)`。

## Output

最终摘要：

```
Figma MCP            : success | <错误类型>
Assumptions          : <无则"无">
TODOs                : <无则"无">
Assets               : downloaded: N | linked: N | placeholder: N
Tokens               : figma: N | project: N | literals: N
Lint/Typecheck       : pass | failed (<命令>)
Review executor      : figma-review-phase | subagent | current-session | skipped
Review phase         : pass | partial | blocked (<原因>) | skipped (user opt-out)
Fix rounds           : N / 3 | N / 5
Remaining issues     : <列表或"无">
needs_decision       : <列表或"无">
```

## Scripts

- `scripts/setup-check.mjs [figmaToken]` — 环境自检
- `scripts/parse-figma-url.mjs "<url>"` — 解析 fileKey + nodeId
- `scripts/detect-stack.mjs [projectRoot]` — 探测项目栈

## References

- [mcp-setup.md](references/mcp-setup.md) — MCP 配置
- [execution-policy.md](references/execution-policy.md) — Agent 执行策略
- [pipeline-details.md](references/pipeline-details.md) — 结构、尺寸锚点、文件头
- [review-brief.md](references/review-brief.md) — review phase 输入
- [css-mapping.md](references/css-mapping.md) — Figma → CSS 对照
- [asset-pipeline.md](references/asset-pipeline.md) — 图片资产下载
