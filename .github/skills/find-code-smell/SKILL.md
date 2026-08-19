---
name: find-code-smell
description: "Use when: scanning a file, directory, or the whole codebase for code smells and anti-patterns. Use for: pre-refactor audits, code review preparation, identifying where to start cleaning up, producing a prioritised list of problems before touching any code. DO NOT use when you want to fix a smell — use the refactor-code-smell skill for that. No argument scans the entire repository."
argument-hint: "<optional: file path or directory to scan — omit to scan the whole repo>"
---

# Find Code Smell Skill

Scan code and produce a complete, prioritised report of every smell and anti-pattern present — without touching a single line.

This skill is **read-only**. It never modifies code. Its output is a ranked list that feeds directly into the `refactor-code-smell` skill, one smell at a time.

---

## When to Use

- Before starting a refactoring session — scan first, then fix one at a time
- During a code review — identify smells to discuss with the team
- When a developer asks "what's wrong with this code?", "where should I start?", or "give me a code review"
- When scanning a whole directory or service for technical debt

## When NOT to Use

- When you want to fix a smell — invoke `refactor-code-smell` for that
- When the scope is a single function you already understand — go straight to `refactor-code-smell`

---

## Catalogue Reference

All smell and anti-pattern definitions, signs, and severity ratings are in:
[code-smell-catalogue.md](../references/code-smell-catalogue.md)

Load this before scanning. It is the authoritative reference for naming and severity.

---

## Workflow

Follow these steps in order.

### Step 1 — Determine scope

Identify what to scan from the argument:
- **Single file**: scan every function and block in that file
- **Directory**: scan all source files within it
- **Function name**: locate the function across the codebase and scan it
- **No argument (default)**: scan the entire repository

In all cases, skip: test files (`*.test.*`, `*.spec.*`), generated files, `node_modules/`, `dist/`, `build/`, `coverage/`, and `.github/`.

### Step 2 — Read the code

Read the target files. For each function or block, check it against every entry in both catalogues in [code-smell-catalogue.md](../references/code-smell-catalogue.md).

Do not skim. Every smell must be named using the exact catalogue term.

### Step 3 — Compile the findings

For each smell or anti-pattern found, record:
- **File** and **location** (function name or line range)
- **Smell/Anti-Pattern name** (exact term from catalogue)
- **Evidence** — one sentence quoting or describing the specific code that triggers it
- **Severity** — from the catalogue (Critical / High / Medium / Low)

### Step 4 — Rank and report

Sort findings by severity (Critical → High → Medium → Low). Within the same severity, smells that appear in more than one place rank higher.

### Step 5 — Write the report file

Write the findings to a markdown file using the **Report Template** defined below.

Default output path: `docs/code-smell-report.md`
If `docs/` does not exist, write to the workspace root as `code-smell-report.md`.

After writing, confirm the file path in chat.

### Step 6 — Recommend the next step

At the end of the report (and in chat), state the single highest-priority smell and the exact invocation to fix it:

```
Next: fix <Smell Name> in <file>
Invoke: refactor-code-smell <file path>
```

---

## Report Template

Write the report file using exactly this structure:

```markdown
# Code Smell Report

**Scanned:** <file path or directory>
**Date:** <YYYY-MM-DD>
**Files scanned:** N
**Total findings:** N (Critical: N, High: N, Medium: N, Low: N)
**Status:** not-started

---

## Summary

| Severity | Count |
|---|---|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

---

## Task List

| # | Smell | File | Location | Status |
|---|---|---|---|---|
| 1 | <Smell Name> | `path/to/file.ts` | `functionName()` | not-started |
| 2 | <Smell Name> | `path/to/file.ts` | `functionName()` | not-started |

<!-- Status values: not-started | in-progress | signed-off | blocked -->

---

## Findings

### 1. <Smell / Anti-Pattern Name> — <Severity>

| Field | Detail |
|---|---|
| **File** | `path/to/file.ts` |
| **Location** | `functionName()` or lines N–N |
| **Smell** | <Exact catalogue name> |
| **Severity** | Critical / High / Medium / Low |
| **Description** | What this smell is and why it matters |
| **Evidence** | The specific code or pattern that triggered it |
| **Standard fix** | The fix prescribed in the catalogue |

---

### 2. <Next finding>

<!-- repeat block for each finding, ordered Critical → High → Medium → Low -->

---

## Recommended Next Step

Fix **<Smell Name>** in `<file>` — it is the highest-severity finding.

```
Invoke: refactor-code-smell <file path>
```
```

---

## Constraints

- **Never propose or apply a fix** — this skill is strictly diagnostic
- **Never skip a file** in the declared scope
- **Always use the exact catalogue name** for every finding — do not invent new smell names
- If a block of code has no smells, do not fabricate findings — omit it from the table
