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

- 对照 prompt 给的 repo standards 来源逐条检查，违反明文规范 → warning。
- 套用 [smell-baseline.md](smell-baseline.md)，大多数 → nit。
- 可维护性门槛要**高**：严重重复（同一逻辑 3+ 处）、God function（超长且多个无关职责）、死代码、注释掉的代码块。
- 不重复 machine 工具已抓的、不越界报 critical 范围（那是 critical lens 的事）。

## spec — 对照规格

对照 prompt 给的 spec / 当前 slice AC，逐条 AC 核对 diff：

- 核心 AC 缺失或做错 → critical
- 部分实现、范围蔓延（spec 没要求的改动） → warning

每条 finding 的 message 引用对应 AC 条目。
