---
name: figma-review-phase
description: Internal helper for figma-to-code review phase. Run isolated Figma visual review and automatic visual fixes from a review brief.
context: fork
license: MIT
metadata:
  author: wolf
  version: "1.0.0"
compatibility: Requires Framelink Figma MCP, Chrome DevTools MCP, and a review brief from figma-to-code.
disable-model-invocation: true
---

# Figma Review Phase

## Input

The caller provides [references/review-brief.md](references/review-brief.md).

If required fields are missing, recover only from code evidence, `@figma` file headers, package scripts, dev server output, or explicit user input already present in the task. Stop with:

- `blocked: incomplete review brief` when `figmaUrl`, target node, and implementation URL/route cannot be recovered.
- `blocked: capability unavailable` when Figma or implementation screenshots cannot be captured.

## Capability Gate

1. Confirm Figma screenshot capability; read MCP schema before calling Figma tools.
2. Confirm browser screenshot capability.
3. Bring up implementation: probe `devUrl` with `scripts/wait-for-server.mjs`; reuse a responding server, otherwise start `devCommand` and wait. Timeout returns `blocked: dev server not ready`.
4. Handle auth walls with available dev bypass or pre-auth state; otherwise report `needs_decision: auth required`.
5. Confirm review files. In review-only mode, locate likely page files from route and `@figma` headers when the brief lacks a file list.

Completion: both Figma reference and implementation screenshot are available.

## Review Loop

Run at most 3 rounds by default. If high-impact differences are still obvious, continue up to 5 rounds. Stop after 5 rounds and report the remaining issues.

Each round:

1. Capture or refresh the Figma reference screenshot for the target node.
2. Open the implementation and capture a screenshot. Use the brief's viewport; if it is `unknown`, default to 375×812 for mobile/H5 and 1440×900 for desktop. The Figma reference and the implementation must use the same viewport.
3. Compare in this priority order:
  - layout structure, alignment, width, height
  - spacing
  - typography
  - color
  - shadow, radius, icons, image assets
  - responsive viewport details
4. Select 1-3 highest-impact categories to fix.
5. Modify only visual/display code in the listed files or directly related style/assets files.
6. Run the relevant lint/typecheck command from the brief or project scripts. Fix failures introduced by this round's changes; leave unrelated pre-existing failures as reported context.
7. Re-screenshot and reassess.

## Allowed Fixes

- display structure needed to match Figma
- spacing, size, color, typography, border, radius, shadow
- flex/grid layout and responsive visual details
- image/icon references, dimensions, `object-fit`, alignment, clipping
- visual TODOs that do not implement business behavior

Stop and report `needs_decision` before changing:

- business logic, API calls, permissions, auth, form submission, validation rules
- routing structure
- state management, data model, persistence
- public props/events/slots or component API
- behavior that conflicts with explicit user requirements

## Fix Patterns

- When the whole page is offset, fix root/container width, max-width, padding, or alignment before child margins.
- When multiple children are misaligned together, fix the parent gap, padding, flex/grid axis, or alignment.
- Use project spacing tokens, Tailwind scale, or CSS variables when present.
- Match font family, size, line-height, weight, and letter-spacing before changing text content.
- Prefer project color tokens. Use literal Figma values only when no token exists, and report them in `tokensSummary`.
- For shadows, match offset, blur, spread, and opacity. Preserve the primary visual layer if the stack cannot express every Figma layer.
- For missing image content, export from Figma or use existing project assets; otherwise report `blocked` or a confirmed placeholder.

## Output

Return this summary to the caller:

```markdown
Review phase         : pass | partial | blocked (<reason>)
Fix rounds           : N / 3 | N / 5
Screenshots          : Figma <path-or-id> | Implementation <path-or-id>
Validation           : pass | failed (<command>) | not-run (<reason>)
Files changed        : <list or "none">
Remaining issues     : <list or "none">
needs_decision       : <list or "none">
blocked              : <reason or "none">
```

When reporting differences, use `pass`, `partial`, or `fail` for each category. `pass` means matched, `partial` means minor remaining differences, and `fail` means visibly different.

## Scripts

- `scripts/wait-for-server.mjs <url> [timeoutMs] [intervalMs]` — poll until the dev server responds (Capability Gate step 3)