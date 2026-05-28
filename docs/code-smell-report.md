# Code Smell Report

**Scanned:** entire repository (`backend/src/`, `frontend/src/`)
**Date:** 2026-05-27
**Files scanned:** 12
**Total findings:** 10 (Critical: 0, High: 2, Medium: 3, Low: 5)
**Status:** not-started

---

## Summary

| Severity | Count |
|---|---|
| Critical | 0 |
| High | 2 |
| Medium | 3 |
| Low | 5 |

---

## Task List

| # | Smell | File | Location | Status |
|---|---|---|---|---|
| 1 | God Function | `backend/src/services/urlService.ts` | `createShortenedUrl()` | signed-off |
| 2 | Duplicate Code | `frontend/src/services/api.ts` | `getAllUrls()` | in-progress |
| 3 | Inappropriate Intimacy | `backend/src/services/urlService.ts` | module-level | not-started |
| 4 | Magic Number | `backend/src/services/urlService.ts` | `createShortenedUrl()` | not-started |
| 5 | Magic Number | `frontend/src/services/api.ts` | `getAllUrls()` | not-started |
| 6 | Dead Code | `frontend/src/services/api.ts` | `getAllUrls()` | not-started |
| 7 | Comments That Explain What | `backend/src/index.ts` | module-level | not-started |
| 8 | Comments That Explain What | `backend/src/routes/urlRoutes.ts` | route handlers | not-started |
| 9 | Comments That Explain What | `backend/src/routes/redirectRoutes.ts` | route handler | not-started |
| 10 | Comments That Explain What | `backend/src/services/urlService.ts` | multiple functions | not-started |

<!-- Status values: not-started | in-progress | signed-off | blocked -->

---

## Findings

### 1. God Function — High

| Field | Detail |
|---|---|
| **File** | `backend/src/services/urlService.ts` |
| **Location** | `createShortenedUrl()` lines ~116–160 |
| **Smell** | God Function |
| **Severity** | High |
| **Description** | A function should do one thing. If you can't describe it without "and", split it. |
| **Evidence** | `createShortenedUrl` validates the URL, generates a short code, checks uniqueness in a retry loop (up to 10 attempts), inserts into the database, and handles errors — four distinct responsibilities in one function. |
| **Standard fix** | Split into focused, composable steps: a validation function, a unique-code generator, and a persistence function. |

---

### 2. Duplicate Code — High

| Field | Detail |
|---|---|
| **File** | `frontend/src/services/api.ts` |
| **Location** | `getAllUrls()` lines ~42–57 |
| **Smell** | Duplicate Code |
| **Severity** | High |
| **Description** | Same or near-identical logic in two or more places should be extracted to a shared function. |
| **Evidence** | The retry loop contains `if (attempt >= 2) { throw new Error('Failed to fetch URLs'); }` inside the loop, then a second identical `throw new Error('Failed to fetch URLs')` after the loop — the exit condition and error message are duplicated. The post-loop throw is also unreachable (see finding #6). |
| **Standard fix** | Extract the retry logic to a named helper, or simplify to a straightforward loop with a single throw path. |

---

### 3. Inappropriate Intimacy — Medium

| Field | Detail |
|---|---|
| **File** | `backend/src/services/urlService.ts` |
| **Location** | Module-level — all `FromRequest` / `FromRequestAndRespond` functions |
| **Smell** | Inappropriate Intimacy |
| **Severity** | Medium |
| **Description** | Module A reaches deep into the internals of module B — here the service layer imports and directly uses Express `Request` and `Response`, coupling business logic to the HTTP transport. |
| **Evidence** | Functions such as `getLongUrlFromRequest`, `createShortenedUrlFromRequestAndRespond`, `listAllUrlsFromRequest` parse `req.params`, `req.body`, `req.query`, and write `res.status(...).json(...)` directly — the service owns HTTP concerns it should not. The code itself annotates this with comments like `// Tight coupling: service now depends on Express request shape.` |
| **Standard fix** | Expose a clear interface — service functions accept plain domain values (strings, numbers) and return plain result objects; route handlers own the HTTP translation layer. |

---

### 4. Magic Number — Medium

| Field | Detail |
|---|---|
| **File** | `backend/src/services/urlService.ts` |
| **Location** | `createShortenedUrl()` |
| **Smell** | Magic Number |
| **Severity** | Medium |
| **Description** | Raw numeric literals used without explanation — a reader cannot tell what `10` or `256` represent without context. |
| **Evidence** | `if (attempts > 10)` (maximum retry attempts) and `if (longUrl.length > 256)` (maximum URL length) — both values are policy decisions that should be named constants. |
| **Standard fix** | Extract to named constants: `MAX_SHORT_CODE_ATTEMPTS = 10` and `MAX_URL_LENGTH = 256`. |

---

### 5. Magic Number — Medium

| Field | Detail |
|---|---|
| **File** | `frontend/src/services/api.ts` |
| **Location** | `getAllUrls()` |
| **Smell** | Magic Number |
| **Severity** | Medium |
| **Description** | Raw numeric literal used without explanation. |
| **Evidence** | `while (attempt < 2)` and `if (attempt >= 2)` — the value `2` is the maximum retry count but has no name to communicate that intent. |
| **Standard fix** | Extract to a named constant: `MAX_FETCH_ATTEMPTS = 2`. |

---

### 6. Dead Code — Low

| Field | Detail |
|---|---|
| **File** | `frontend/src/services/api.ts` |
| **Location** | `getAllUrls()` — after the `while` loop |
| **Smell** | Dead Code |
| **Severity** | Low |
| **Description** | Unreachable code — branches that can never execute waste space and mislead readers. |
| **Evidence** | The `throw new Error('Failed to fetch URLs')` on the last line of `getAllUrls` is unreachable: the `while` loop always exits by returning or throwing before reaching this statement. |
| **Standard fix** | Delete the unreachable throw — that's what git history is for. |

---

### 7. Comments That Explain What — Low

| Field | Detail |
|---|---|
| **File** | `backend/src/index.ts` |
| **Location** | Module-level section comments |
| **Smell** | Comments That Explain What |
| **Severity** | Low |
| **Description** | Comments that restate what the code does literally add no information a reader couldn't see directly. |
| **Evidence** | `// Middleware`, `// Health check endpoint`, `// API routes`, `// Redirect routes (must be last to avoid conflicts)`, `// Start server` — each comment restates the immediately following code. |
| **Standard fix** | Remove the comments; the code is already self-explanatory. The one note worth keeping is the ordering constraint on redirect routes — extract that rationale into a brief inline comment on the `app.use` call itself. |

---

### 8. Comments That Explain What — Low

| Field | Detail |
|---|---|
| **File** | `backend/src/routes/urlRoutes.ts` |
| **Location** | Route handler JSDoc blocks |
| **Smell** | Comments That Explain What |
| **Severity** | Low |
| **Description** | JSDoc blocks that repeat the HTTP method, path, and purpose already visible from the route definition. |
| **Evidence** | `/** POST /api/urls — Create a new shortened URL */`, `/** GET /api/urls — List all shortened URLs */`, `/** DELETE /api/urls/:id — Delete a shortened URL by ID */` — all of this is already expressed by the router method and path. |
| **Standard fix** | Remove the JSDoc blocks. |

---

### 9. Comments That Explain What — Low

| Field | Detail |
|---|---|
| **File** | `backend/src/routes/redirectRoutes.ts` |
| **Location** | Route handler |
| **Smell** | Comments That Explain What |
| **Severity** | Low |
| **Description** | Inline comment restates what the regex already expresses. |
| **Evidence** | `// Validate short code format (5 alphanumeric characters)` immediately above `if (!/^[A-Za-z0-9]{5}$/.test(shortCode))` — the regex is readable and the comment adds no new information. |
| **Standard fix** | Remove the comment. If the regex is considered opaque, extract it to a named constant `SHORT_CODE_PATTERN` instead. |

---

### 10. Comments That Explain What — Low

| Field | Detail |
|---|---|
| **File** | `backend/src/services/urlService.ts` |
| **Location** | Multiple functions |
| **Smell** | Comments That Explain What |
| **Severity** | Low |
| **Description** | JSDoc blocks and inline comments throughout the service restate what function names and code already communicate. |
| **Evidence** | `/** Creates a new shortened URL — Generates a unique short code and stores the URL mapping */`, `/** Retrieves all shortened URLs */`, `/** Deletes a shortened URL by ID */`, `/** Gets the long URL for a short code (for redirect) */`, plus inline `// Validate URL length. Verbose and repetitive for refactoring exercises.`, `// Magic numbers + environment coupling.` |
| **Standard fix** | Remove JSDoc that restates the function name. Keep only comments that explain *why* a non-obvious decision was made (e.g. the retry cap rationale, once the magic number is named). |

---

## Recommended Next Step

Fix **God Function** in `backend/src/services/urlService.ts` — it is the highest-severity finding and the function whose complexity makes all other smells in the file harder to fix.

```
Invoke: refactor-code-smell docs/code-smell-report.md
```
