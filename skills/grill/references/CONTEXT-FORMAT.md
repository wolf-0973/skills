# CONTEXT.md Format

## Structure

```md
# {Context Name}

{One or two sentence description of what this context is and why it exists.}

## Language

**Order**:
{What the term IS, one or two sentences}
_Avoid_: Purchase, transaction
```

## Rules

- Pick the best word; list others under `_Avoid_`.
- **Keep definitions tight.** What it IS, not what it does.
- **Only project-specific terms.** General programming concepts do not belong.

## Single vs multi-context

- Root `CONTEXT.md` → single context (most repos). Create lazily when the first term is resolved.
- Root `CONTEXT-MAP.md` → multiple contexts; map points to each `CONTEXT.md`.

