---
name: to-spec
description: 写规格 / PRD（Feature 级）。Turn the current conversation into a spec written to docs/spec/<slug>.md.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# To Spec

把当前对话与代码库理解合成为规格（PRD）。**Do not interview** — synthesize what is already known.

**Seam** = 观察功能行为的公共边界；后续 `/breakdown`·`/implement`·`/tdd` 在此写测试。理想数量 = 1。<!-- SYNC: skills/tdd/SKILL.md Seam -->

## Process

1. **Gather known material.** 读取当前对话、用户给的文档、相关代码、`CONTEXT.md` 与 ADR。先读 scout handoff 给出的 map path；否则试 `docs/scout/<slug>.md` / 对话里的 slug 别名；找到则读 Destination、Decisions so far 与已闭 investigation gist，找不到且用户声称有 map 则停问。开环决策未决则停并回 `/grill`。Completion: problem, solution shape, and constraints are grounded in existing evidence.

2. **Name the seams.** 草拟本功能要测的公共边界；优先已有 seam，尽量高层。与用户确认后再发布；AFK 时按提议继续，并在 Testing Decisions 标注「assumed, unconfirmed」。

3. **Write the spec.** 按 [references/spec-template.md](references/spec-template.md) 写到 `docs/spec/<slug>.md`（`<slug>` = Feature 短横线名）。Completion: 模板各节要么填好、要么显式标 N/A；未知项进 Further Notes，绝不编造；Testing Decisions 列出已确认（或 assumed）seams。

## Completion

Done means `docs/spec/<slug>.md` exists with seams in Testing Decisions. 下一步：**小到单个 context 能做完 → `/implement`；大 / 多条垂直切片 → `/breakdown`。**
