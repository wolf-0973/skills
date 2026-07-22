# MCP 配置指南

`figma-to-code` 需要两类能力：**Figma MCP**（读设计节点数据、截图、导出资产）与**浏览器截图**（review phase 用）。Figma 侧任选其一，官方优先。

## 1a. 官方 Figma MCP（首选）

Figma 官方 MCP server，OAuth 登录，无需手动管理 token。核心工具：`get_design_context`、`get_metadata`、`get_screenshot`、`download_assets`。

远程接入（以 Claude Code 为例）：

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

或使用 Figma 桌面端内置的 Dev Mode MCP server（桌面端 Preferences 里启用后监听本地）：

```json
{
  "mcpServers": {
    "figma": { "url": "http://127.0.0.1:3845/mcp" }
  }
}
```

端点与开启方式以 Figma 官方文档（help.figma.com 搜 "MCP server"）最新说明为准。

## 1b. Framelink Figma MCP（fallback）

社区实现，走 Figma REST API，需要 Personal access token。核心工具：`get_figma_data`、`download_figma_images`。

```json
{
  "mcpServers": {
    "Framelink Figma MCP": {
      "command": "npx",
      "args": ["-y", "figma-developer-mcp", "--figma-api-key=YOUR_FIGMA_TOKEN", "--stdio"]
    }
  }
}
```

**获取 token**：Figma → Settings → Security → Personal access tokens → Generate new token。

## 2. Chrome DevTools MCP

用于 review phase 的页面导航、截图与交互状态检视（宿主已有等效浏览器截图能力时可省）。

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

需要本机已安装 Chrome / Chromium。

## 验证

Framelink 分支先跑环境自检，一眼看出 Node / Chrome / Figma token 还差什么（官方 MCP 走 OAuth，跳过 token 检查）：

```bash
node scripts/setup-check.mjs                 # token 从环境变量读
node scripts/setup-check.mjs figd_xxx        # 或直接传入待验证的 token
```

再在 Agent 对话中发送 Figma 链接测试：

```
按这个设计稿实现登录页：https://figma.com/design/xxx/...?node-id=1-2
```

Agent 应能调用设计数据工具并成功返回节点树。若报错 `Figma MCP: ...`，检查登录状态 / token 权限与 node-id 格式。
