---
name: breakdown
description: 需求拆解 · 把 Feature 规格拆成 slice。Break a Feature spec, plan, or conversation into tracer-bullet vertical slices with blocking edges. Written to docs/slices/<slug>.md.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# Breakdown

## Process

1. **Gather context.** 用户给规格路径时读全文；否则从对话归纳 source scope。Completion: source scope and acceptance intent are known.

2. **Explore if needed.** 未探过仓库时读取领域词汇、同类实现与约束。顺手**主动找 prefactor 机会**——「先让改动变容易，再做那个容易的改动」：现有代码哪里挡着这批 slice，就先排一条只做准备的 slice。Completion: domain vocabulary for titles is known（或已在 context 里），且挡路的地方要么有对应 Prefactor slice、要么确认不挡。

3. **Draft slices.** 每条是 **tracer-bullet**。把 spec Testing Decisions 里的 seams 写入对应 slice 的 AC；**Prefactor**（只做准备、不交付新行为）排最前，其 AC = 就绪条件而非用户可见行为。Completion: 每条都有可检查 AC，spec 的每个 seam 都落在某条 slice 上。

4. **Wire blockers.** 每条写 `Blocked by`；无阻塞即是 frontier。出现依赖环时，合并或重切打破它。Wide refactor 走 [references/wide-refactor.md](references/wide-refactor.md)。Completion: 依赖边成图无环，且至少存在一条 frontier slice。

5. **Quiz the user.** 编号列出 Title / Blocked by / What it delivers；问：粒度对不对？边是否只依赖真正门闩？要不要合并或拆分？Completion: user approves the set or asks for concrete edits.

6. **Write it out.** 写 `docs/slices/<slug>.md`，按依赖序排列。模板见 [references/slice-templates.md](references/slice-templates.md)。只写 slices 文件；避免具体文件路径与代码片段，除非代码本身承载决策。Completion: 用户批准的每条 slice 都已落进文件、接好 blockers 且 `Status: ready`。

## Completion

Done means approved slices are written in dependency order with blockers、AC 与 Status，且 frontier 一眼可见。收尾输出一行 handoff：

```
下一步：/implement · docs/slices/<slug>.md · frontier 第一条是「<title>」，新开窗口只做这一条
```
