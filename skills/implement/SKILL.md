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

- **选哪条：** 给了 slice/spec 就做那个；没点名时取 frontier 第一条（未被 blocked、AC 未打勾）。多个 `docs/slices/*.md` 时先问做哪个 Feature。无 slices 文件时按用户/对话给定范围做（小 spec 可直接实现）。
- **红→绿：** 在约定 seams 上走红→绿；见 `/tdd`。slice/spec 已列 seams 视作已确认，除非标注 assumed。
- **校验：** typecheck/单测常跑，区域全量校验收尾一次。
- **收尾：** 调用 `/code-review` 时写明定点（或工作区 diff）+ 当前 slice/spec 路径作 Spec 契约。

## Completion

有 `docs/slices` 时：每条 AC 把对应 `- [ ]` 勾成 `- [x]`，或在该 AC 旁写明阻塞原因。无 slices、直做小 spec 时：在小结列出已完成 / 阻塞的 AC（不伪造 slices 文件）。code-review 的 blocker 已修，nit / 新范围提示 `/breakdown`；小结说清改了什么行为、还剩什么风险，并点名下一条 frontier（若有）。Commit 仅在用户明确要求时做。
