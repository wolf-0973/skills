---
name: grill
description: 需求追问 · 设计对齐（上游，先于 spec）。Grill a plan or design one decision at a time until shared understanding is reached; maintain CONTEXT.md.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
disable-model-invocation: true
---

# 追问

## Process

1. **Frame the tree.** 命名当前要压实的分支（根决策）、它下面的子决策，以及它为什么阻塞后续。若用户给了 `/scout` map，先读 Destination 与 Decisions so far。
2. **Separate fact from decision.** 事实靠代码、文档、日志或工具查证，查不到就明说「无法证实」并当决策处理；决策交给用户。
3. **Ask one question.** 每轮只问一个决策问题，附推荐答案与理由；宿主有结构化提问工具（选项 + 推荐标注）时用它出题，推荐项排最前。**等用户答完再问下一题**。用户否决时换推荐再问；已闭合决策被新事实推翻则显式重开。
4. **Update language.** 用户用词与 `CONTEXT.md` 冲突时指出。仅当某词**已造成一次实际误解**、或用户确认为领域术语时，才提出精确规范词并写入 `CONTEXT.md`；普通措辞调整不写。格式见 [references/CONTEXT-FORMAT.md](references/CONTEXT-FORMAT.md)。
5. **Continue or hand off.** 需求大且模糊、单会话装不下 → 提示 `/scout`；可落规格 → 提示 `/to-spec`。**未获用户确认不得 handoff / enact。**

## Completion

Done only when the user confirms shared understanding or chooses a handoff. Before confirm: every framed branch is resolved or explicitly deferred; name updated CONTEXT terms and recap closed decisions in one line each（handoff 时由 `/to-spec` 吸收）.
