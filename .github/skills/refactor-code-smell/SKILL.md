---
name: refactor-code-smell
description: "Use when: identifying or fixing a code smell, anti-pattern, or readability problem. Use for: long functions, duplicate logic, magic numbers, magic strings, deep nesting, poor or misleading variable or function names, functions that do too many things, dead code, boolean trap parameters, excessive comments that explain what instead of why, primitive obsession, god objects or god functions, silent catch blocks, or any time a developer asks to refactor, clean up, improve, simplify, or review code quality. Also use when given a code-smell-report.md to work through all findings one at a time with sign-off gates."
argument-hint: "<file path or function name — e.g. src/app/booking.ts> OR <path to code-smell-report.md to work through all findings>"
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
- The scope is large (multiple files, multiple smells) — use report-driven mode instead of manually chaining invocations

---

## Modes of Operation

| Mode | When to use | Argument |
|---|---|---|
| **Single-smell** | You know the specific file or function to fix | File path or function name |
| **Report-driven** | You have a `code-smell-report.md` from `find-code-smell` | Path to the report file |

If the argument ends in `.md` or contains `code-smell-report`, use **Report-driven mode**. Otherwise use **Single-smell mode**.

---

## Catalogue Reference

All smell and anti-pattern definitions, signs, and standard fixes are in:
[code-smell-catalogue.md](../references/code-smell-catalogue.md)

Load this before analysing. Always use the exact catalogue term when naming a smell.

---

## Report-Driven Workflow

Use this workflow when the argument is a `code-smell-report.md`.

### Step R1 — Load the report and initialise the task list

Read the report file. Find the `## Task List` section.

If no Task List section exists, add one immediately after the `## Summary` section using this format, with one row per finding ordered by severity:

```markdown
## Task List

| # | Smell | File | Location | Status |
|---|---|---|---|---|
| 1 | Silent Catch | path/to/file.ts | catchBlock() | not-started |
| 2 | God Function | path/to/file.ts | processData() | not-started |
```

Status values:
- `not-started` — not yet addressed
- `in-progress` — fix applied, awaiting user sign-off
- `signed-off` — user has approved the fix
- `blocked` — tests were already failing before the fix; skipped

Present the full task list to the user in chat before proceeding.

### Step R2 — Pick the next finding

Take the first row with status `not-started`. Update its status to `in-progress` in the report file.

Announce in chat:
> **Now fixing [#N]: [Smell Name]** in `[file]` — `[location]`

### Step R3 — Establish a green baseline

Run tests for the affected file:

```bash
npm test -- --testPathPattern=<filename>
```

If tests fail: update the row status to `blocked`, explain why in chat, and proceed to Step R2 with the next finding. Do not attempt the fix.

### Step R4 — Fix the smell

Apply the fix following all rules in the **Conventions** section. One smell only.

### Step R5 — Verify

Run the tests again. If any test fails:
1. Revert the change
2. Update the row status back to `not-started`
3. Explain what went wrong
4. Ask the developer how to proceed before continuing

### Step R6 — Present and request sign-off

Post a summary in chat using this format:

```
## Fix [#N]: [Smell Name]

**File:** `path/to/file.ts`
**Location:** `functionName()`
**What changed:** [one sentence — what was extracted, renamed, or deleted]
**Behaviour unchanged:** yes
**Tests:** all passing

Please review this fix. Reply **approved** to sign it off, or describe any concerns.
```

Do not proceed to the next finding until the user replies.

### Step R7 — Handle the response

- If the user replies **approved** (or equivalent): update the row status to `signed-off` in the report file, then return to Step R2.
- If the user raises a concern: address it, re-run tests, then re-present for sign-off. Do not mark `signed-off` until explicitly approved.

### Step R8 — Completion

When all rows are `signed-off` or `blocked`, update the report file's top-level metadata:

```markdown
**Status:** complete
```

Post in chat:
> All findings have been processed. Report updated at `[path to report]`.

---

## Single-Smell Workflow

Use this workflow when the argument is a file path or function name.

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
