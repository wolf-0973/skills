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

1. **Gather known material.** 读取当前对话、用户给的文档与相关代码。**决策的记录有两处，都要读**：`CONTEXT.md` 的 Language 段（用词）与 Decisions 段（已拍板的决策 + 为什么）；以及 scout map——先用 handoff 给的 path，否则试 `docs/scout/<slug>.md` / 对话里的 slug 别名，找到则读 Destination、Decisions so far 与已闭 investigation gist，找不到且用户声称有 map 则停问。规格与某条已记决策矛盾时，以决策为准并指出矛盾。开环决策未决则停并回 `/grill`。Completion: problem, solution shape, and constraints 都能追到对话、代码或某条已记决策。

2. **Name the seams.** 草拟本功能要测的公共边界；优先已有 seam，尽量高层。与用户确认后再发布；AFK 时按提议继续，并在 Testing Decisions 标注「assumed, unconfirmed」。

3. **Write the spec.** 按 [references/spec-template.md](references/spec-template.md) 写到 `docs/spec/<slug>.md`（`<slug>` = Feature 短横线名）。Completion: 模板各节要么填好、要么显式标 N/A；未知项进 Further Notes，绝不编造；Testing Decisions 列出已确认（或 assumed）seams。

## Completion

Done means `docs/spec/<slug>.md` exists with seams in Testing Decisions。收尾输出一行 handoff：

```
下一步：/implement · docs/spec/<slug>.md · <一句范围与已确认 seams>
```

**`/breakdown` 只在 spec 装不下一个窗口时才走**——判据：需要不止一条 tracer bullet 才能覆盖（多个 seam、改动面跨多个互不相干的区域）。装不下时把 `/implement` 换成 `/breakdown`；拿不准就先 `/implement`，做的过程中撑爆了再回来拆。
