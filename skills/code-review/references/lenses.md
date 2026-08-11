# Review Lenses

每个 lens 一个 subagent，只吃 prompt 里的输入 + 本文件自己的段落 + [severity.md](severity.md)。

**共同规则**（对所有 lens 生效）：

- 不修改源代码。
- 只报变更文件里的问题——输出前逐条验证 `file` 在变更文件列表里，不在 → 删除。
- 没问题 findings 留空，不要硬凑。
- 最终返回 JSON（machine 才有 `checks` 字段）：

```json
{
  "lens": "<name>",
  "checks": { "<tool>": "pass|fail|skipped" },
  "findings": [
    { "severity": "critical|warning|nit", "file": "…", "line": 42,
      "category": "…", "message": "问题一句 + 修复方向" }
  ]
}
```

- 结尾给主 agent 一句：`<lens>: N findings`。

## machine — 项目自有检查

1. 探测项目已配好的检查命令：`package.json` scripts（lint / typecheck / test）、Makefile、justfile 等。只用项目自己的，不自己发明命令；仅存在测试文件不算已配置命令。找不到配置入口时 `checks` 全部 `skipped`，不得推断 `python -m unittest`、`pytest` 等命令。
2. 尽量 scope 到变更文件（如 `eslint <files>`）；scope 不了就整体跑，但**只把变更文件上的 error 写进 findings** —— diff 外的是 pre-existing，只影响 `checks` 状态，不写 finding。
3. `checks`：exit code 直译，`0` → `pass`、非 0 → `fail`，不要因为「看起来无害」改成 pass；没有可用检查 → 全 `skipped`。多条命令时一条 fail 也要继续跑其余的。
4. findings：变更文件上的工具 error → critical。

## critical — 一票否决

只报 critical 级（见 severity.md 的 critical 段）：安全、正确性、数据破坏、严重性能。逐 hunk 读 diff，必要时 Read 周边源码确认问题没在别处处理——证据不足不报。warning / nit 级交给 quality，不要报。空 findings 是干净 diff 的正常结果。

## quality — standards + 可维护性

只报**作者从这条 slice 内部看不见的**——这是本 lens 存在的理由：

- 对照 prompt 给的 repo standards 来源逐条检查，违反明文规范 → warning。
- 偏离 repo 既有抽象（已有共享 util / 组件 / hook，新代码另写一套）、跨文件重复、与 diff 外代码的不一致 → warning。
- 套用 [smell-baseline.md](smell-baseline.md) 里跨文件 / 跨模块的条目（Shotgun Surgery、Divergent Change、Duplicated Code 等），大多数 → nit。
- 单文件内的命名、小重复、God function 这类红→绿循环里本该顺手清的：**不逐条报**；成堆出现（同一文件 3+ 处）才汇总成一条 nit，指出该文件需要一轮清理。
- 不重复 machine 工具已抓的、不越界报 critical 范围（那是 critical lens 的事）。

## verify — critical 证伪复核

不产 findings，只裁决一条已有 critical。输入：完整 diff + 单条 finding。任务：**主动寻找它不成立的证据**——误读 diff、问题已在别处处理（Read 周边源码确认）、场景实际不可达、severity 判高了。找不到反证才算 confirmed。返回 JSON：

```json
{ "lens": "verify", "verdict": "confirmed|refuted|insufficient-evidence", "reason": "一句依据" }
```

## spec — 对照规格

对照 prompt 给的 spec / 当前 slice AC，逐条 AC 核对 diff：

- 核心 AC 缺失或做错 → critical
- 部分实现、范围蔓延（spec 没要求的改动） → warning

每条 finding 的 message 引用对应 AC 条目。
