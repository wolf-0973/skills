# 图片资产（figma-to-code · Step 5）

Step 5 内部 reference：转码流程中下载图标/图片/SVG 时用；不单独作为入口。

## 连接方式

用所连 Figma MCP 自带的资产导出工具，全程不混用分支：

- 官方 Figma MCP → `download_assets`
- Framelink → `download_figma_images`
- Figma Desktop（Dev Mode / Plugin API）→ Desktop 工具

## 落地规则（各分支通用）

1. 落地目录：用户指定优先；否则扫描并沿用项目现有同类资产目录（如 `src/assets`、`public/assets`、`assets/images`、`public/images` 等）。无法判断时询问用户；图标同理，优先沿用现有 icons/assets 目录。
2. 代码中必须真实引用下载的资产；失败停止或经用户同意标记 `placeholder (user-approved)`。

## 分支注意点

- Framelink：含 `imageRef` 时必须传入；SVG 矢量可省略。
- Desktop：遍历节点导出 `exportSettings`（PNG/SVG/PDF）；文件名清理 `node.name` → `[a-zA-Z0-9_]+`。

## 批量去重

多 URL/多页面时按资源 URL 或 imageRef 去重，相同资源只下载一次。

## 输出

向主流程回报，字段与 review brief 的 `assetsSummary` 一致：`downloaded: N | linked: N | placeholder: N`

去重是内部步骤，不进摘要字段；如需说明可写入 Assumptions。
