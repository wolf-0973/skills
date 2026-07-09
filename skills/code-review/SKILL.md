---
name: code-review
description: >-
  Review a fixed-point diff or workspace changes along two axes — Standards and Spec
  (default: current slice / AC). Use when reviewing a branch, PR, uncommitted diff,
  after /implement, or the user says 审核、code review、对照规格审查.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
---

# Code Review

审查结果只作对话内 inline 输出。

## Process

1. **Pin the review target.** **定点** = 审查区间起点 commit-ish。
   - 用户给了定点 → 审 `定点...HEAD`（三点，相对 merge-base）；先 `git rev-parse` 确认定点，且 diff 非空，否则停在此步。
   - 未给定点 → 询问审 `定点...HEAD` 还是工作区未提交 diff。
   - 非 git 仓库 → 要求用户给定 changed files / diff。
   - 询问无人应答（AFK）时：有工作区 diff 就默认审它，否则停止。

2. **Find the contract.** 依次查 commit / PR 引用、用户给的路径、`docs/spec/` 或 `docs/slices/` 下匹配文件。仍无来源则询问；用户确认没有时，Spec 轴记 `no spec available` 并跳过。

3. **Find the standards.** 读取 `CODING_STANDARDS.md`、`CONTRIBUTING.md`、`.cursor/rules` 等；再套用 [references/smell-baseline.md](references/smell-baseline.md)。

4. **Review both axes.** 能并行则用两个 sub-agent 分跑 Standards 与 Spec，再聚合。每条发现引用规则/规格与 hunk。Spec：缺失、部分实现、范围蔓延、做错。

5. **Aggregate.** 输出 `## Standards` 与 `## Spec`。每轴按严重度排序，每条标 **blocker** / **nit**（判级见 smell-baseline）——含影响、证据、建议修复。每轴末一行：findings 数与最严重项。不跨轴合并排序。

## Completion

完成时必须有：固定点或工作区 diff 来源、审查过的 diff/log、Standards 证据源、Spec 证据源或 `no spec available`、双轴结果。没有问题时写 `No findings`。nit 或够一条新 slice 的范围 → 提示 `/breakdown`。
