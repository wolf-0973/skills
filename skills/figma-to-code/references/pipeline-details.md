# Pipeline details

## Entry modes

- **generate**: 用户提供 Figma 链接，要求实现页面或组件。缺目标技术栈或落地路径时，先从项目确认；仍缺再问。
- **review-only**: 用户要求验收、视觉对比、还原度检查，已有实现可访问。输入优先级：用户给 Figma URL + dev URL/route；源码 `@figma` 文件头 + dev URL/route；询问用户。

## Project context

先跑：

```bash
node scripts/detect-stack.mjs
```

脚本输出 `framework / styling / unitStrategy / tokenSource / pagesDir / commands`。脚本判不出的 assumptions 才需要人工读文件或询问。再按需读取 `AGENTS.md` / `CLAUDE.md`、同类页面/组件、页面文件头 `@figma`。

## Structure checklist

`review-only` 跳过结构与代码生成，直接进入 review phase。

| 类型 | 判断信号 | Region checklist |
|------|----------|------------------|
| mobile-single-column | 用户或 README 判定为 H5 | header / content-sections / footer / overlays |
| dashboard | 侧栏与主内容并列 | top / sidebar / main / overlays |
| component | 单组件 frame | root / variants-or-slots / overlays |
| unknown | 无法判断 | 按节点树列 region，写入 Assumptions |

## Size anchors

代码前为 checklist 中影响布局的每个 region 列尺寸锚点，明确设计稿倍率、CSS 写法、换算公式（Figma px → 代码值）。项目已有换算规则时沿用。

| 元素/区域 | 来源节点 | Figma px | 换算后 | 计划 class/token |
| --------- | -------- | -------- | ------ | ---------------- |

## Styling and assets

- 样式映射前查项目现有组件，能复用就复用。
- Figma → CSS 对照见 [css-mapping.md](css-mapping.md)。
- 图片资产按 [asset-pipeline.md](asset-pipeline.md)，用所连 Figma MCP 的资产导出分支。
- 使用 Figma 变量、项目 token 或 CSS 变量；只有没有 token 时才使用局部字面量。
- 无法确认组件 API 时写 TODO 或 `needs_decision`。

## Code generation

布局优先 flex/grid + gap/padding；absolute 只用于叠加层。Auto Layout 映射为 flex-direction。重复 COMPONENT 有复用价值时抽组件。

事件处理写展示层 TODO，例如 `// TODO: wire handler`，不实现业务行为。

页面/路由组件文件头：

```typescript
/**
 * @file LoginPage.tsx
 * @description 登录页
 * @figma https://figma.com/design/<fileKey>/...?node-id=1-2
 */
```
