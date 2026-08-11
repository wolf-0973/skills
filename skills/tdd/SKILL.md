---
name: tdd
description: 测试驱动 · 红绿推进。Test-driven development — red → green at confirmed seams. Use when the user asks to work test-first, mentions 红绿 / TDD / red-green, or another skill drives a red→green loop.
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
---

# TDD（红→绿）

TDD = red → green。下列各节**每个循环都要对照**。读 `CONTEXT.md`（若有）对齐用词。

## 好测试

经公共接口验行为，不绑实现；读起来像规格，重构后仍稳定。示例见 [references/tests.md](references/tests.md)；mock 边界见 [references/mocking.md](references/mocking.md)。

## Seam

**Seam** = 观察行为的公共边界。<!-- SYNC: skills/to-spec/SKILL.md Seam -->**No unconfirmed seam** — 只在与用户确认的 seam 上写测试；缺 seam 时先问。slice/spec Testing Decisions 已列且未标 assumed 的 seams 视作已确认。

「seam 该放哪」本身成为问题时，用这三条判：

- **interface 即测试面** —— 调用方与测试穿过同一个 seam。想测到 interface *背后*，说明模块形状不对，别为测试开后门。
- **删除测试** —— 假想删掉这个模块：复杂度消失 → 它只是转发层，不配有 seam；复杂度在 N 个调用方重新长出来 → 它在挣钱，seam 立在它的 interface 上。
- **一个 adapter 是假 seam，两个才是真的** —— 只有一种实现时不要为了「可测」造 seam；真有东西在这条线两侧变化才立。

## 坏味道

- **Implementation-coupled** — mock 内部、测私有、走旁路断言。征兆：行为没变，重构却红。
- **Tautological** — 期望值用与实现相同的算法算出。期望须来自独立真相：字面量、手算例、规格。
- **Horizontal slicing** — 先写完全部测试再实现。改为垂直 **tracer bullet**：一测 → 一实现 → 再下一刀。

## 循环规则

- **Fail first** —— 先写失败的测试，确认已红，再写刚好让它过的代码；不预留未来测试或投机特性。
- **One slice at a time** —— 一个 seam、一测、一最小实现。
- **重构不属于循环** —— 绿之后再重构，且**测试不动**：测试是行为没变的证据，同一步里改测试就没了参照。顺手可清的（命名、抽重复）当场清完；成体系的（跨模块、要改接口）交 `/breakdown` 开一条独立 slice，别夹在这条里。
