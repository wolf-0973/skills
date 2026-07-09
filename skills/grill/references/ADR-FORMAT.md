# ADR Format

ADRs live in `docs/adr/`: `0001-slug.md`, `0002-slug.md`, …

Create `docs/adr/` lazily — only when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{1-3 sentences: context, decision, why.}
```

Optional: Status, Considered Options, Consequences.

## When to offer an ADR

All three must be true:

1. **Hard to reverse**
2. **Surprising without context**
3. **Real trade-off** (genuine alternatives)

