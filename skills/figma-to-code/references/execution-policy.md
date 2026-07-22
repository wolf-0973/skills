# Execution Policy

## Core Rule

能从工具和代码证据确认的事直接执行。必须停止的情况只有：

- Figma MCP、Figma token 或目标 node 不可用，导致无法读取设计稿。
- 用户未提供且项目中无法推断目标技术栈或落地路径。
- 需要修改业务逻辑、API、路由、状态模型、持久化结构或组件公共 API。
- 图片资产缺失且没有可接受的 Figma 导出、项目现有资产或用户确认的 placeholder。

## Evidence Order

决策依据按优先级使用：

1. 用户显式要求。
2. Figma MCP 返回的节点、截图、尺寸、样式、资产信息。
3. 当前项目已有组件、样式系统、token、目录约定和 lint/typecheck 命令。
4. 浏览器或 DevTools 的页面截图与运行时结果。
5. 工程常识推断。

若 1-4 足以判断，直接执行。只有会改变非视觉行为或公共接口时才输出 `needs_decision`。

## Code Generation Scope

允许自动生成或修改：

- 页面/组件的展示结构。
- spacing、size、color、typography、border、radius、shadow。
- flex/grid 布局、响应式断点、safe-area 视觉适配。
- 图片、图标、静态资产引用与尺寸对齐。
- 展示层 TODO，例如 `// TODO: wire handler`。

禁止自动生成或修改：

- 真实 API 请求、权限、登录态、表单提交、校验规则。
- 路由结构、状态管理、数据模型、持久化结构。
- 已发布组件的公共 props / events / slots 语义。
- 与 Figma 无关的重构。

## Figma Data Gate

设计数据获取成功前禁止输出界面代码。失败时报告错误类型并停止，不用想象补 UI。

允许基于 Figma 节点与项目模式做工程推断，例如组件拆分、class 命名、响应式容器写法；不允许在缺少设计稿数据时猜测布局、颜色、字体或图片内容。

## Review Phase Handoff

代码生成、资产处理、lint/typecheck 结束后默认进入 review phase。用户明说不要（如"只生成代码""不用 review"）则跳过，并在摘要标注；不为此停下来询问，也不阻塞 loop/自动化运行。

进入时按 `SKILL.md` 生成 review brief 并选择 review executor；brief 模板与 executor 顺序以 `SKILL.md` 为唯一权威，此处不重复。
