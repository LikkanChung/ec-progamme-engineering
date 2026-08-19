# Code Smell & Anti-Pattern Catalogue

Shared reference used by both `refactor-code-smell` and `find-code-smell` skills.

---

## Smell Catalogue

Always name the smell before proposing or reporting a fix.

| Smell | What it looks like | Standard fix | Severity |
|---|---|---|---|
| **Long Method** | Function > ~20 lines, does multiple things | Extract smaller, single-purpose functions | High |
| **Magic Number** | Raw numeric literal with no explanation (`60`, `404`, `86400`) | Extract to a named constant | Medium |
| **Magic String** | Raw string literal used as a value (`"PENDING"`, `"admin"`) | Extract to a typed enum or const | Medium |
| **Duplicate Code** | Same or near-identical logic in two or more places | Extract to a shared function | High |
| **Dead Code** | Unreachable branches, unused variables, commented-out blocks | Delete it — that's what git history is for | Low |
| **Long Parameter List** | Function takes 4+ arguments | Group related params into an object/interface | Medium |
| **Boolean Trap** | `doThing(true, false)` — booleans as positional params | Replace with an options object or two named functions | Medium |
| **Deep Nesting** | 3+ levels of if/else or callbacks | Invert conditions (early return), or extract functions | High |
| **Misleading Name** | Name says one thing, code does another | Rename to match actual behaviour | High |
| **Poor Name** | `data`, `val`, `temp`, `stuff`, `handleIt` | Rename to describe the domain concept | Medium |
| **Comments That Explain What** | Comment restates what the code does literally | Remove the comment, rename the code to be self-explanatory | Low |
| **God Function** | One function that orchestrates everything | Split into focused, composable steps | High |
| **Primitive Obsession** | Passing raw strings/numbers where a typed object or enum belongs | Introduce a domain type | Medium |
| **Feature Envy** | Function uses more of another module's data than its own | Move the function closer to the data it uses | Medium |

---

## Anti-Pattern Catalogue

Anti-patterns are structural problems larger than a single smell.

| Anti-Pattern | Signs | Fix | Severity |
|---|---|---|---|
| **Silent Catch** | `catch (e) {}` or `catch (e) { return null }` with no logging | Log the error, or rethrow — never swallow silently | Critical |
| **Any Escape Hatch** | `as any`, `as unknown as X` used to bypass types | Resolve the real type; only use `as` with a written justification comment | High |
| **Callback Hell** | Functions nested 3+ levels deep inside callbacks | Refactor to `async/await` with named steps | High |
| **Mutable Shared State** | Module-level `let` mutated by multiple functions | Encapsulate behind a function or class | High |
| **Shotgun Surgery** | One conceptual change requires edits across many unrelated files | Extract the shared concept into a single module | High |
| **Inappropriate Intimacy** | Module A reaches deep into the internals of module B | Expose a clear interface, hide internals | Medium |

---

## Severity Guide

| Level | Meaning |
|---|---|
| **Critical** | Active safety or correctness risk — fix before anything else |
| **High** | Significantly harms readability or creates a maintenance hazard |
| **Medium** | Noticeable friction but not immediately dangerous |
| **Low** | Cosmetic — clean up opportunistically |
