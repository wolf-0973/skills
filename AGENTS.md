# AGENTS.md

本仓库 Agent 协作约定。写 skill 时：指令短、一阶段一职责、细节进 `references/`。

## 目录

```
skills/{kebab-name}/
  SKILL.md
  references/          # 可选
  scripts/             # 可选
AGENTS.md
CLAUDE.md              # → AGENTS.md
skills.sh.json
README.md
```

## 约定

- 目录 / 脚本：`kebab-case`；指令文件固定 `SKILL.md`
- `SKILL.md` < 500 行；只一级链接 `references/`
- `description`：给人看或给模型触发（英文 + 必要中文口令），≤ 1024 字符
- frontmatter 统一：`license: MIT`，`metadata.author: wolf`，`version: "1.0.0"`（带引号）
- 单一事实源；不得不双份时用 `<!-- SYNC -->` 互指

## 新建

1. `skills/{name}/SKILL.md`
2. 需要时加 `references/`（MCP 写 `references/mcp-setup.md`）
3. 更新 `README.md` 与 `skills.sh.json`

安装命令见 README。
