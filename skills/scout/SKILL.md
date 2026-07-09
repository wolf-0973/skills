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
2. **Scan the fog.** List unknowns until each is either a sharp question or still unphraseable fog. Completion: if nothing is foggy and the destination is already clear, stop and ask whether a map is needed.
3. **Create the map.** 按 map-rules 建文件。Completion: Destination 与 Notes 已填，Decisions so far 为空，雾写入 Not yet specified。
4. **Create only sharp investigations.** Each asks one decision-sized question. Completion: every sharp question is an investigation; unphraseable fog stays in Not yet specified.
5. **Wire blockers.** Connect real dependencies; leave unblocked investigations on the **frontier**. Completion: blocker graph has no cycles; at least one frontier investigation is visible.
6. **Stop.** Do not work an investigation in the same pass.

## Work the map

1. **Load the map at low resolution.** 只读索引层——destination、notes、decisions so far、fog、frontier。
2. **Claim one investigation.** User-specified, or the first open, unblocked, unclaimed frontier investigation.
3. **Resolve by type.** Default unresolved human decisions to `/grill`. If stuck / sprawling / moot: close as inconclusive with one-line reason, then split into sharper investigations or demote to fog. If out of destination: close and move to Out of scope.
4. **Write the resolution.** 答案写入该 investigation 正文，标 closed，并向 Decisions so far 追加一行 gist。
5. **Update the fog.** Create newly sharp investigations, move still-foggy questions to Not yet specified, and mark out-of-scope discoveries. If Destination was falsified this session, rewrite it before creating new investigations.

## Completion

Each session: newly charted map (zero investigations consumed), or exactly one investigation closed and the map updated. When no fog or frontier remains, hand off to `/to-spec` with the map path plus Destination and Decisions so far.
