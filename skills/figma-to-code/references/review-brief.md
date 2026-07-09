# Review brief

<!-- SYNC: 与 figma-review-phase/references/review-brief.md 保持一致，改一处同步另一处 -->

```markdown
## Review Brief

- mode: generate | review-only
- figmaUrl: <Figma URL>
- nodeId: <target node id, e.g. 1234:5678>
- modifiedFiles:
  - <path>
- devCommand: <command or "unknown">
- devUrl: <URL or "unknown">
- route: <route or "unknown">
- viewport: <width>x<height>
- techStack: <framework / styling / build info>
- assumptions:
  - <item or "none">
- assetsSummary: downloaded: N | linked: N | placeholder: N
- tokensSummary: figma: N | project: N | literals: N
- lintTypecheckResult: pass | failed (<command>) | not-run (<reason>)
- allowedFixScope: visual-only
- blockedConditions:
  - business logic
  - API
  - routing
  - state model
  - persistence
  - public component API
```

Current-session fallback judges only from this brief, the Figma reference, implementation screenshots, browser/runtime evidence, and code.
