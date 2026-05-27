---
name: refactor-code-smell
description: "Use when: identifying or fixing a code smell, anti-pattern, or readability problem. Use for: long functions, duplicate logic, magic numbers, magic strings, deep nesting, poor or misleading variable or function names, functions that do too many things, dead code, boolean trap parameters, excessive comments that explain what instead of why, primitive obsession, god objects or god functions, silent catch blocks, or any time a developer asks to refactor, clean up, improve, simplify, or review code quality."
argument-hint: "<file path or function name — e.g. src/app/booking.ts, or describe the smell you want to fix>"
---

# Refactor Code Smell Skill

Identify and fix code smells and anti-patterns in a disciplined, test-safe way — one change at a time.

This skill enforces a strict workflow: **name it → test baseline → fix → verify → explain**. It never silently changes behaviour, and it never skips the test step.

---

## When to Use

- A function is hard to understand at a glance
- Logic is duplicated across two or more places
- A function does more than one thing
- Variable or function names don't describe intent
- There are unexplained raw values (`86400`, `"APPT"`, `3`)
- The code is deeply nested (callbacks, if/else chains)
- There is dead code, commented-out code, or unreachable branches
- A catch block is empty or silently swallows errors
- A developer asks to "clean this up", "refactor", "make this better", or "what's wrong with this code"

## When NOT to Use

- The change would alter external behaviour, not just structure — that is a feature change, not a refactor
- There are no tests for the code being changed (write tests first, then invoke this skill)
- The scope is large (multiple files, multiple smells) — break it into separate invocations, one smell at a time

---

## Smell Catalogue

Use this as your reference when analysing code. Always name the smell before proposing a fix.

| Smell | What it looks like | Standard fix |
|---|---|---|
| **Long Method** | Function > ~20 lines, does multiple things | Extract smaller, single-purpose functions |
| **Magic Number** | Raw numeric literal with no explanation (`60`, `404`, `86400`) | Extract to a named constant |
| **Magic String** | Raw string literal used as a value (`"PENDING"`, `"admin"`) | Extract to a typed enum or const |
| **Duplicate Code** | Same or near-identical logic in two or more places | Extract to a shared function |
| **Dead Code** | Unreachable branches, unused variables, commented-out blocks | Delete it — that's what git history is for |
| **Long Parameter List** | Function takes 4+ arguments | Group related params into an object/interface |
| **Boolean Trap** | `doThing(true, false)` — booleans as positional params | Replace with an options object or two named functions |
| **Deep Nesting** | 3+ levels of if/else or callbacks | Invert conditions (early return), or extract functions |
| **Misleading Name** | Name says one thing, code does another | Rename to match actual behaviour |
| **Poor Name** | `data`, `val`, `temp`, `stuff`, `handleIt` | Rename to describe the domain concept |
| **Comments That Explain What** | Comment restates what the code does literally | Remove the comment, rename the code to be self-explanatory |
| **God Function** | One function that orchestrates everything | Split into focused, composable steps |
| **Primitive Obsession** | Passing raw strings/numbers where a typed object or enum belongs | Introduce a domain type |
| **Feature Envy** | Function uses more of another module's data than its own | Move the function closer to the data it uses |

---

## Anti-Pattern Catalogue

Anti-patterns are structural problems larger than a single smell. Name and explain before touching.

| Anti-Pattern | Signs | Fix |
|---|---|---|
| **Silent Catch** | `catch (e) {}` or `catch (e) { return null }` with no logging | Log the error, or rethrow — never swallow silently |
| **Any Escape Hatch** | `as any`, `as unknown as X` used to bypass types | Resolve the real type; only use `as` with a written justification comment |
| **Callback Hell** | Functions nested 3+ levels deep inside callbacks | Refactor to `async/await` with named steps |
| **Mutable Shared State** | Module-level `let` mutated by multiple functions | Encapsulate behind a function or class |
| **Shotgun Surgery** | One conceptual change requires edits across many unrelated files | Extract the shared concept into a single module |
| **Inappropriate Intimacy** | Module A reaches deep into the internals of module B | Expose a clear interface, hide internals |

---

## Workflow

Follow these steps in order. Do not skip any step.

### Step 1 — Analyse: name before you touch

Read the code. Before writing a single line of changed code:

1. State in plain English what the code currently does
2. Identify every smell or anti-pattern present
3. Name each one using the catalogues above (e.g. "This is a **Magic Number** — the value `86400` is used without explanation")
4. Rank them: which smell is causing the most harm to readability or safety?

**Do not propose any code changes in this step.** Present the analysis to the developer and confirm which smell to fix first.

### Step 2 — Establish a green baseline

Before touching any code, run the tests for the file being changed:

```bash
npm test -- --testPathPattern=<filename>
```

If tests fail before you start: **stop**. Tell the developer the tests are already failing and do not proceed. A failing baseline means you cannot tell whether your change broke something.

If there are no tests for this code: **stop**. Recommend writing tests first using the `create-unit-test` pattern, then re-invoke this skill.

### Step 3 — Fix one smell only

Address the single highest-priority smell identified in Step 1. Do not fix multiple smells in one change — each fix should be reviewable on its own.

Apply the fix using the rules in the **Conventions** section below.

### Step 4 — Explain the change

After proposing the fix:
1. State which smell you fixed and why this fix resolves it
2. Confirm that the external behaviour (inputs, outputs, side effects) is unchanged
3. Point out any related smells that were deliberately left for a separate change

### Step 5 — Verify

Run the tests again:

```bash
npm test -- --testPathPattern=<filename>
```

All tests must still pass. If any test fails:
1. Do not try to fix the test to make it pass
2. Revert the change
3. Explain what assumption was wrong
4. Ask the developer how to proceed

---

## Conventions

These rules apply to every change produced by this skill.

### Naming
- Functions: `camelCase`, verb-first — `getBooking`, `validateDate`, `buildResponse`
- Booleans: prefix with `is`, `has`, `can`, `should` — `isValid`, `hasExpired`
- Constants: `SCREAMING_SNAKE_CASE` for module-level — `MAX_RETRY_COUNT`, `DEFAULT_TIMEOUT_MS`
- Types and interfaces: `PascalCase` — `BookingRequest`, `PatientRecord`
- Do not use `data`, `result`, `temp`, `val`, `info`, `stuff`, or `item` as names — these describe nothing

### Extraction rules
- Extracted functions go in the same file unless they are used in more than one place
- If a function is used in more than one file, it belongs in a shared module, not copy-pasted
- Extracted functions must have tests before the original function is changed

### Type safety
- Do not introduce `any` to make a refactor easier — resolve the real type
- Do not widen a type to `unknown` without a guard that narrows it again
- Prefer `const` over `let`; prefer immutable patterns unless mutation is genuinely necessary

### Size
- A function should do one thing
- If you cannot describe what a function does without using the word "and", it should be split
- Aim for functions that fit in one screen (~20–30 lines including whitespace)

### Comments
- Remove comments that describe what the code does — rename the code instead
- Keep comments that explain *why* a non-obvious decision was made
- Never leave commented-out code — delete it

---

## Output Format

For every invocation, structure your response as:

```
## Analysis
[Plain English: what does this code do, what smell(s) are present, what are they called]

## Recommended fix
[Which smell to fix first and why]

## Proposed change
[The code diff or replacement — one smell only]

## What changed and why
[Confirm: external behaviour unchanged, name of smell fixed, what was extracted/renamed/deleted]

## Remaining smells
[List any other smells identified but not fixed — leave for the next invocation]

## Test result
[Output of npm test before and after — both must be green]
```
