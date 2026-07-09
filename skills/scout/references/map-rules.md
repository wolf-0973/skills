# Map rules

固定写 `docs/scout/<slug>.md`（`<slug>` = 该探路主题的短横线命名；非 git 仓库放仓库根下同路径）。

investigation 写在同一文件 `## Investigations` 下，或 `docs/scout/<slug>/` 目录每项一文件；阻塞用标题引用。

## Map body

```markdown
## Destination

<走到哪算完：一两句；每会话先读>

## Notes

<领域、每会话应查阅的技能/文档、本轮偏好>

## Decisions so far

- [<closed title>](link) — <one-line gist>

## Not yet specified

<!-- 范围内但还写不清的雾；前沿推进后升级为 investigation -->

## Out of scope

<!-- 超出目的地；永不升级 -->

## Investigations

<!-- 每项一个 ## 小节，body 见下 -->
```

## Investigation body

每条 investigation 体量适合一个新会话。

```markdown
## Question

<本条要解决的决策或调查>

## Type

research | grilling | chore

## Status

open | closed

## Claimed by

None | <agent/user/session>

## Blocked by

None | <investigation titles>
```

## Investigation types

每条 investigation 要么 **HITL**（human-in-the-loop：须与真人现场一问一答，agent **不得替人作答**——grilling 里自问自答即破坏），要么 **AFK**（agent 独立完成）。

| Type | Mode | 含义 |
|------|------|------|
| research | AFK | 查一手资料，纪要作附件 |
| grilling | HITL | 与人追问；可调 `/grill`。人负责决策 |
| chore | HITL/AFK | 探路时要人手动做、但不产代码的杂活：开通权限、申请测试账号、找人要资料。做完才能继续往下判断 |

## Frontier

`Status: open` + blockers all closed + `Claimed by: None`.

## Fog vs investigation

- Question sharp now → investigation (even if blocked).
- Cannot phrase sharply → Not yet specified. Do not pre-slice fog into fake investigations.
