---
name: implement
description: Implement one frontier slice by default with a red-green tracer-bullet loop, then run review. Only work a set of slices when the user explicitly asks. Also 实现 slice、红绿推进.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# Implement

- **选哪条：** 给了 slice/spec 就做那个；没点名时取 frontier 第一条（未 blocked、`Status` 非 done）。**`Status: in progress` 的优先于 `ready`**——先读那句「做到哪」接着做，别重做。多个 `docs/slices/*.md` 时先问做哪个 Feature。无 slices 文件时按用户/对话给定范围做（小 spec 可直接实现）。
- **认领：** 动手前把该 slice 的 `Status` 改成 `in progress — <下一步碰哪>`，每完成一个红→绿循环更新这句。这是上下文用尽时唯一留给下一个会话的东西。
- **红→绿：** 在约定 seams 上走红→绿；见 `/tdd`。slice/spec 已列 seams 视作已确认，除非标注 assumed。
- **AC 与现实冲突时改 slice，不改代码去迁就：** AC 描述的行为与代码现实矛盾（seam 不存在、前置 slice 没交付它承诺的东西、AC 自相矛盾）→ 停下，在 slices 文件里改写那条 AC 并注明为什么，再继续；改动影响 spec 决策时回 `/grill`。
- **校验：** typecheck/单测常跑，区域全量校验收尾一次。**再把功能真跑起来看一眼**（宿主有 `/run` 就用它，否则用项目自己的启动方式），纯逻辑改动无从跑起时在小结说明为什么跳过。
- **收尾：** 调用 `/code-review` 时写明定点（或工作区 diff）+ 当前 slice/spec 路径作 Spec 契约。

## Completion

有 `docs/slices` 时：每条 AC 把对应 `- [ ]` 勾成 `- [x]`，或在该 AC 旁写明阻塞原因；该 slice 的 `Status` 收成 `done` 或 `blocked — <原因>`，不留 `in progress`。无 slices 文件、直接按 spec 实现时：在小结列出已完成 / 阻塞的 AC（不伪造 slices 文件）。只修当前 slice / spec contract 内的 code-review critical；修完重跑受影响的 lens，**verdict 无 critical 才算完成**。未决决策回 `/grill`，范围外 finding 提示 `/breakdown`，撞见原因不明的既有 bug 提示 `/diagnose`，都不顺手实现。Commit 仅在用户明确要求时做。收尾输出一行 handoff：

```
下一步：/implement · docs/slices/<slug>.md · 已交付「<行为>」，下一条 frontier 是「<title>」（无则写「本 Feature 已无 frontier」）
```

小结另说清还剩什么风险。
