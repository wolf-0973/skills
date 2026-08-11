# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{What the term IS, one or two sentences}
_Avoid_: Purchase, transaction

## Decisions

- {决策一句} — {为什么}
```

## Rules

### Language

- Pick the best word; list others under `_Avoid_`.
- **Keep definitions tight.** What it IS, not what it does.
- **Only project-specific terms.** General programming concepts do not belong.

### Decisions

- 一条决策一行，追加在末尾（时间序）。写拍板了什么 + 为什么，不写讨论过程。
- **一行以内说完**。文件路径、代码片段、接口签名、验收标准都属于 spec 与 slice，这里只留决策本身——`CONTEXT.md` 是长期文件，写成草稿本就会腐烂。
- 被推翻时**改写原行**并在同行注明推翻原因，不追加新行、不留删除线。
- 决策被规格吸收后仍留着：它解释的是 spec 为什么长这样，spec 过期删除时它不跟着删。

## Single vs multi-context

- Root `CONTEXT.md` → single context (most repos). Create lazily when the first term is resolved.
- Root `CONTEXT-MAP.md` → multiple contexts; map points to each `CONTEXT.md`.

