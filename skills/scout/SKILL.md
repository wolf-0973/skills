---
name: scout
description: 大需求探路 · 摸清 Feature 形状。Scout a huge or foggy chunk of work: chart a map of destination, fog, and investigations, resolved one at a time until the route is clear. Also 探路.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# Scout

Scout = chart a map for work too large or foggy for one agent session. **Plan, don't do** — 想直接把活干了，往往就是到了地图边界：交接 `/to-spec`，别顺手实现。目的地若被证伪，显式改写 Destination 并记一句为什么。

## Map

结构见 [references/map-rules.md](references/map-rules.md)。Map 是索引：按 **title** 引用，写 gist + link，不写完整研究笔记。用户点名已有 map（路径或 slug）时续跑该文件。

## Chart the map

1. **Pin the destination.** Use `/grill` if needed. Completion: the map has a one- or two-sentence “done when” destination.
2. **Scan the fog breadth-first.** 再走一轮 `/grill`，这轮**广度优先**——横向铺开整个空间，不深钻任何一条线，把开放决策与现在就能动的第一步都问出来，别只靠自己扫代码。Completion: 每个未知要么是一个 sharp question、要么是还写不清的雾；若毫无雾且目的地已清楚，停下并问是否真需要 map。
3. **Create the map.** 按 map-rules 建文件。Completion: Destination 与 Notes 已填，Decisions so far 为空，雾写入 Not yet specified。
4. **Create only sharp investigations.** Each asks one decision-sized question. Completion: every sharp question is an investigation; unphraseable fog stays in Not yet specified.
5. **Wire blockers.** Connect real dependencies; leave unblocked investigations on the **frontier**. Completion: blocker graph has no cycles; at least one frontier investigation is visible.
6. **Fire the research investigations.** 刚建的每条 `research`（AFK）在**同一条消息内**并行派子代理去查，纪要写回该条正文。Completion: 每条 research 都已派出或已带纪要 closed。
7. **Stop.** HITL 型（grilling / chore）一条都不在本轮做。

## Work the map

1. **Load the map at low resolution.** 只读索引层——destination、notes、decisions so far、fog、frontier。
2. **Claim one investigation.** User-specified, or the first open, unblocked, unclaimed frontier investigation。先把 `Claimed by` 写上再动手，并发会话才会跳过它。**research 是例外**：frontier 上的 research 可以在同一条消息内并行派子代理，不占「一会话一条」的额度。
3. **Resolve by type.** Default unresolved human decisions to `/grill`. If stuck / sprawling / moot: close as inconclusive with one-line reason, then split into sharper investigations or demote to fog. If out of destination: close and move to Out of scope.
4. **Write the resolution.** 答案写入该 investigation 正文，标 closed，并向 Decisions so far 追加一行 gist。
5. **Update the fog.** Create newly sharp investigations, move still-foggy questions to Not yet specified, and mark out-of-scope discoveries. If Destination was falsified this session, rewrite it before creating new investigations.

## Completion

Each session: newly charted map (zero HITL investigations consumed), or exactly one HITL investigation closed and the map updated——research 不受此限，可并行关掉多条。雾与 frontier 都空时输出一行 handoff：

```
下一步：/to-spec · docs/scout/<slug>.md（+ CONTEXT.md 若有） · <一句 Destination 与剩余风险>
```
