# AGENTS.md

本仓库存放可分享的 Agent Skills。

## 目录

```
skills/{kebab-name}/
  SKILL.md
  references/          # 可选：按需加载的细节
  scripts/             # 可选：SKILL.md 直接调用的脚本
AGENTS.md
CLAUDE.md              # → AGENTS.md
skills.sh.json
README.md
```

## 约定

- 目录 / 脚本：`kebab-case`；指令文件固定 `SKILL.md`，< 500 行
- frontmatter 统一：`license: MIT`，`metadata.author: wolf`，`version: "1.0.0"`（带引号）
- 默认 `disable-model-invocation: true`（手敲触发，不占常驻上下文）；只有需要模型自己发现、或被别的 skill 调用时才去掉
- `description` ≤ 1024 字符：手敲型写一句人话；模型触发型写触发场景（英文 + 必要中文口令），一个场景一条，别写同义改写
- 单一事实源；不得不双份时用 `<!-- SYNC -->` 互指

## 写 skill

- 一阶段一职责；每个阶段收在**能分辨做完没做完**的条件上，该穷尽时写穷尽（「每个改动的 model 都有交代」而不是「产出改动清单」）
- 判据模糊时会**提前收工**——后面还看得见的步骤在拉着它往前赶。先锐化判据；只有判据确实收不紧、且真观察到赶工，才把后续步骤拆到新会话或子代理去（同上下文内调用挡不住）
- 每条路径都要的写进 `SKILL.md`，只有部分路径要的下沉 `references/`；链接措辞决定它会不会被读，没被读先改措辞
- 跨会话的东西必须落到文件里：状态、决策、下一步。写「小结说清」不算，agent 的对话不是记录
- 复用模型已有的概念当关键词（*红/绿*、*探路*、*tracer bullet*），重复这个词而不是重复解释它
- 正向写。要禁止时同时写清该做什么
- 逐句问「这句相对默认行为改变了什么」，没有就整句删
- 太长先下沉 `references/`，再按路径或阶段拆，不靠压句子
- 步骤是确定的（探测、等待、校验）就写成 `scripts/` 里的脚本，正文只留一行调用和它的输出含义

## 新建

1. 写 `skills/{name}/SKILL.md`
2. 需要时加 `references/`（MCP 配置固定写 `references/mcp-setup.md`）
3. 同步 `README.md` 与 `skills.sh.json`：两处都列出并归好分组才算完

安装命令见 README。
