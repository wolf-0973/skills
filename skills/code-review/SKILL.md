---
name: code-review
description: >-
  Review a fixed-point diff or workspace changes by fanning out parallel review
  lenses — machine checks, critical, quality, spec — then merging one
  severity-sorted report (critical / warning / nit). Use when reviewing a
  branch, uncommitted diff, after /implement, or the user says 审核、code
  review、对照规格审查.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
---

# Code Review (Lens Fan-out)

主 agent 只做 定靶 → 收集来源 → fan-out → 合并报告，**不亲自 review** —— review 是 lens subagent 的事。报告只作对话内 inline 输出，不落 md 文件；报告语言跟随对话语言。

## Process

1. **Pin the target.** **定点** = 审查区间起点 commit-ish。
   - 用户给了定点 → 审 `定点...HEAD`（三点，相对 merge-base）；先 `git rev-parse` 确认定点，且 diff 非空，否则停在此步。工作区不干净时，报告注明未提交改动不在审查范围。
   - 未给定点 → 询问审 `定点...HEAD` 还是工作区未提交 diff；询问无人应答（AFK）时有工作区 diff 就默认审它，否则停止。
   - **派生/生成文件无条件剔除**：锁文件（`*.lock`、`pnpm-lock.yaml` 等）、生成代码（`*.gen.*`、`*.min.*`、OpenAPI/protobuf 产物）、构建产物（`dist`/`build`/`.nuxt`）、vendored / `node_modules`、快照（`*.snap`、`__snapshots__`）。报告开头列一行 `Derived (not reviewed): …`。例外——只在其变更「异常」时升一条 finding：锁文件动了却无对应 manifest 改动，或夹带与本次意图无关的版本 churn；判异常看 manifest 侧 diff，不逐行读锁文件。

2. **Collect sources.**
   - Standards：`CODING_STANDARDS.md`、`CONTRIBUTING.md`、`AGENTS.md`/`CLAUDE.md`、`.cursor/rules`；
   - Spec：依次查 commit / PR 引用、用户给的路径、`docs/spec/` 或 `docs/slices/` 下匹配文件。仍无来源则询问一次；确认没有 → spec lens 不 spawn，报告标 `no spec`。

3. **Fan-out lenses.** 在**单条消息内**并行 spawn subagent，每个 lens 一个（定义见 [references/lenses.md](references/lenses.md)）：
   - **machine** — 跑项目自有检查（lint / typecheck / …），scoped 到变更文件
   - **critical** — 只报 critical：安全 / 正确性 / 数据破坏 / 严重性能
   - **quality** — repo standards + smell + 可维护性
   - **spec** — 对照 spec / 当前 slice AC（仅 spec 存在时 spawn）

   subagent 看不到对话，prompt 必须自带：完整 diff、变更文件列表、standards 原文或路径、spec 路径、该 lens 在 lenses.md 的段落与 [references/severity.md](references/severity.md) 的路径。diff 超大（> ~5000 行）时提示各 lens 只报 critical / warning。

4. **Verify criticals.** 每条 critical finding 并行派一个 verify subagent 证伪（定义见 lenses.md 的 verify 段；输入同 lens：diff + 该条 finding）。verdict 处理：`refuted` → 剔除；`insufficient-evidence` → 降级 warning 并注明；`confirmed` → 保留。warning / nit 不复核。machine lens 的工具报错不复核（exit code 即证据）。

5. **Merge & report.** 主 agent 职责仅「合并 + 去重 + 排序」：
   - findings **逐字保留**（verify 导致的剔除/降级除外），不 second-guess subagent —— 它比你更接近源数据。
   - 去重仅当 file + line + message 三者全等；剔除 file 不在变更文件列表的条目。
   - 某 lens 崩了 → 该部分 findings 空、报告注明，不放弃整个 review。
   - 按 critical → warning → nit 排序，按下方模板输出。

6. **Offer auto-fix.** 仅对当前 contract 内、建议明确且无歧义的条目，一行询问是否修复；spec 未决或范围外的议题不自动修，提示回 `/grill` 或 `/breakdown`。修完列出实际改动与未修条目。无 findings 不问。

## Report template

```markdown
## Code Review — <定点>...HEAD · N files（Derived not reviewed: …）

Sources: <standards 来源> · Spec: <路径 | no spec>
Machine: <check>=pass|fail|skipped …

**Critical N · Warning N · Nit N**

### Critical（已证伪复核）
1. `file:line`（分类）问题一句 + 为什么严重 + 修复方向

### Warning
1. `file:line`（分类）问题一句 + 修复方向

### Nit
- `file:line`（分类）一行一条

<verdict 一句>
```

无 findings 的等级不渲染其小节。verdict 决策表：

| Critical | Warning | verdict |
|---|---|---|
| 0 | 0 | ✅ 未发现问题。 |
| 0 | 1–3 | ⚠️ N 个 warning，建议处理或说明后合并。 |
| 0 | 4+ | ⚠️ warning 较多（N 个），建议先处理再合并。 |
| 1+ | * | 🛑 N 个 critical，先修复再合并。 |

## Completion

报告里必须出现：diff 来源（定点或工作区）、变更文件列表规模、Standards / Spec 来源（或 `no spec`）、每个 lens 的状态（含崩了 / 跳过的）、severity counts 与 verdict。报告中的 critical 必须全部经过 verify（被剔除/降级的在报告末尾一行带过）。没有 findings 时写 `未发现问题`，不要硬凑。nit 或够一条新 slice 的范围 → 提示 `/breakdown`；critical 指向一个成因未明的 bug（不是这批改动直接引入的）→ 提示 `/diagnose`，别在报告里猜原因。

<!-- SYNC: README.md#产物与回退概述此处的项目级规则承接方式。 -->
只有同类问题重复出现——同一类 finding 再次被报出，或用户重复给出同类反馈——且用户明确确认“以后都这样”或“这是项目级规则”时，才提议向**现有** `AGENTS.md` 添加一条**错题式规则**：一行写清「适用场景 + 禁止 X，改用 Y」，不复制整条 finding。不得自动写入；审查报告始终只在对话内，不落盘。
