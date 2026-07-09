# Wide refactors

A **wide refactor** is one mechanical change — rename a column, retype a shared symbol — whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites and no vertical slice can land green.

Do not force it into a tracer bullet. Sequence **expand–contract**:

1. **Expand** — add the new form beside the old so nothing breaks.
2. **Migrate** — move call sites in batches sized by blast radius (per package / directory). Each batch is its own slice, blocked by expand. CI stays green because the old form still exists.
3. **Contract** — delete the old form once no caller remains; blocked by every migrate batch.

When even batches cannot stay green alone, keep the sequence but share an integration branch; all block a final integrate-and-verify slice — green is promised only there.

