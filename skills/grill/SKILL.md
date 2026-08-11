---
name: grill
description: 需求追问 · 设计对齐（上游，先于 spec）。Grill a plan or design in frontier rounds until the design tree is empty; record decisions and terms in CONTEXT.md.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# 追问

## Process

1. **Frame the tree.** 把设计画成**决策树**：每个决策分叉出挂在它下面的决策。若用户给了 `/scout` map，先读 Destination 与 Decisions so far。
2. **Fetch the facts yourself.** 查事实是你的活，不是用户的：需要环境事实（代码、文档、日志、工具）时派子代理去查，**不等它**——只有依赖该事实的问题顺延到后续轮，frontier 其余部分照问。查不到就明说「无法证实」并当决策处理。**决策归用户**。
3. **Ask the whole frontier in one round.** **frontier** = 前置已定、现在就能问而不必猜的全部决策。一轮问完整条 frontier：编号，每题附推荐答案与理由；宿主有结构化提问工具（选项 + 推荐标注）时用它出题，推荐项排最前，否则用下面的格式。答案依赖本轮另一道未决问题的题目属于**下一轮**，本轮不问。**等用户答完整轮再算下一轮**：用户的回答重塑决策树，闭合的决策把 frontier 向外推。用户否决时换推荐再问；已闭合决策被新事实推翻则显式重开。

   ```
   ❓ **Q1** — **<问题标题>**：<问题正文，可含选项>

   ➡️ <你的推荐答案>
   ```
4. **Record each closed decision.** 每轮答完即向 `CONTEXT.md` 的 `## Decisions` 追加一行 gist（决策 + 一句为什么），**不等到 handoff**——换窗口后这里是唯一的记录。被新事实推翻时改写那一行并注明推翻原因。有 `/scout` map 时同一条也追加到 map 的 Decisions so far。格式见 [references/CONTEXT-FORMAT.md](references/CONTEXT-FORMAT.md)。
5. **Update language.** 用户用词与 `CONTEXT.md` 的 Language 段冲突时立即指出。仅当某词**已造成一次实际误解**、或用户确认为领域术语时，才写入 Language 段；普通措辞调整不写。

## Completion

Done when the frontier is empty——决策树每条分支都已走到、没有默默假设的东西，且用户确认达成共识。**未获用户确认不得 enact**。每条闭合决策都已在 `CONTEXT.md` 的 Decisions 段留一行。收尾输出一行 handoff：

```
下一步：/to-spec · CONTEXT.md（+ map 路径若有） · <一句当前状态>
```

雾未散尽时把 `/to-spec` 换成 `/scout`。
