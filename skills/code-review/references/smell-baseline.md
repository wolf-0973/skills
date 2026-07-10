# Smell baseline (Fowler)

Repo docs override. Always judgement calls, never hard violations. Skip what tooling already enforces.

**Severity**：smell 本身大多是 **nit**；若同时破坏行为、契约或 spec，按 [severity.md](severity.md) 升 critical / warning。

- **Mysterious Name** — name doesn't reveal role → rename; if no honest name, design is murky.
- **Duplicated Code** — same logic shape in more than one place → extract shared shape.
- **Feature Envy** — method reaches into another object's data more than its own → move it.
- **Data Clumps** — same fields travel together → bundle into a type.
- **Primitive Obsession** — primitive standing in for a domain concept → small type.
- **Repeated Switches** — same switch/if-cascade on the same type → polymorphism or shared map.
- **Shotgun Surgery** — one logical change forces scattered edits → gather into one module.
- **Divergent Change** — one module edited for unrelated reasons → split by reason.
- **Speculative Generality** — abstraction for needs the spec doesn't have → delete until real need.
- **Message Chains** — long `a.b().c().d()` → hide walk behind one method.
- **Middle Man** — mostly delegates → cut it, call the real target.
- **Refused Bequest** — subclass ignores most of what it inherits → composition.
