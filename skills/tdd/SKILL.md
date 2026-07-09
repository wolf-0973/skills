---
name: tdd
description: 测试驱动 · 红绿推进。Test-driven development — red → green at confirmed seams. Use when building a feature or fixing a bug test-first, or 红绿、TDD.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
---

# TDD（红→绿）

TDD = red → green。下列各节**每个循环都要对照**。读 `CONTEXT.md`（若有）对齐用词，尊重相关 ADR。

## 好测试

经公共接口验行为，不绑实现；读起来像规格，重构后仍稳定。示例见 [references/tests.md](references/tests.md)；mock 边界见 [references/mocking.md](references/mocking.md)。

## Seam

**Seam** = 观察行为的公共边界。<!-- SYNC: skills/to-spec/SKILL.md Seam -->**No unconfirmed seam** — 只在与用户确认的 seam 上写测试；缺 seam 时先问。slice/spec Testing Decisions 已列且未标 assumed 的 seams 视作已确认。

## 坏味道

- **Implementation-coupled** — mock 内部、测私有、走旁路断言。征兆：行为没变，重构却红。
- **Tautological** — 期望值用与实现相同的算法算出。期望须来自独立真相：字面量、手算例、规格。
- **Horizontal slicing** — 先写完全部测试再实现。改为垂直 **tracer bullet**：一测 → 一实现 → 再下一刀。

## 循环规则

- **Fail first** —— 先写失败的测试，确认已红，再写刚好让它过的代码；不预留未来测试或投机特性。
- **One slice at a time** —— 一个 seam、一测、一最小实现。
- **重构不属于循环** —— 见 `/code-review`。
