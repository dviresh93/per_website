# /apply Workflow Redesign Plan

**Status:** Completed (v2 — post-first-run fixes)
**Last Updated:** 2026-05-11

---

## Problem Statement

The current `/apply` workflow has four structural issues:

1. **No state detection** — restarts from scratch every session, gets confused when artifacts already exist
2. **Validation is cosmetic** — checklist template written but never actually verified against baseline
3. **Fit scoring is non-deterministic** — free-form assessment gives different scores across runs (78% vs 82% same job)
4. **Instructions split across 4 files** — drift and redundancy between `apply.md`, `RESUME_APPLICATION_WORKFLOW.md`, `VALIDATION_RULES.md`, `RESUME_VALIDATION_CHECKLIST.md`
5. **Logging is broken** — state document written too early, JSONL never flushed, `IN_PROGRESS` used as a status

---

## Design Goals

1. `scratchpad.md` is the backbone — AI generates it, user or AI can edit it, PDF is always generated from it
2. Core logic never changes for a fork — only user config + resume data changes
3. Event-stream logging baked in from the start — not bolted on
4. Validation is real — diff against baseline, not a checklist template
5. Consistent, auditable fit scoring
6. Clean state detection — resume from where you left off

---

## Output Structure

Every application produces:

```
{role}_{company}_{YYMMDD-HHMM}/
  job-posting.md                  ← job description + fit analysis (reference, not edited)
  scratchpad.md                   ← backbone: customization + status (editable by user or Claude)
  resume_{username}_{role}.pdf    ← generated from scratchpad.md
```

`resume-data.json` is built internally at generation time and discarded — never surfaced to user.

---

## Three-Layer Architecture

```
Layer 1 — Core logic       apply.md                          Never modify. Same for any fork.
Layer 2 — User config      _resources/resume-profile.json   Fork and replace with your rules.
Layer 3 — User data        _resources/baseline-resume-data.json   Fork and replace with your resume.
```

A forker:
1. Replaces `baseline-resume-data.json` with their resume
2. Replaces `resume-profile.json` with their locked rules + bullet counts
3. Runs `/apply` — core logic unchanged

---

## File Changes

### Create
- `job-prep/applications/_resources/resume-profile.json`

### Rewrite
- `.claude/commands/apply.md` — absorbs workflow doc, adds state detection, generic rubric, event logging
- `job-prep/applications/_logs/README.md` — updated event schema

### Delete
- `job-prep/RESUME_APPLICATION_WORKFLOW.md`
- `job-prep/applications/_resources/VALIDATION_RULES.md`
- `job-prep/applications/_resources/RESUME_VALIDATION_CHECKLIST.md`

---

## `resume-profile.json` Schema

```json
{
  "owner": "Viresh Duvvuri",
  "username": "viresh-duvvuri",
  "baseline": "job-prep/applications/_resources/baseline-resume-data.json",
  "bullet_counts": {
    "Bizgenie": 4,
    "Grid CoOperator": 3,
    "Freefly Systems": 4,
    "Lumenier": 2,
    "York Exponential": 2
  },
  "locked_bullets": [
    { "company": "Freefly Systems", "indices": [1, 2, 3] },
    { "company": "Lumenier", "indices": [0, 1] },
    { "company": "York Exponential", "indices": [0, 1] }
  ],
  "customizable_bullets": [
    { "company": "Freefly Systems", "index": 0 }
  ]
}
```

---

## `scratchpad.md` Format

Contains only the sections that vary per application. Locked content comes from `baseline-resume-data.json` at generation time — not duplicated here.

```markdown
# {Role} @ {Company}
**Date:** YYYY-MM-DD HH:MM
**Fit Score:** N/100
**Status:** draft | approved | generated

---

## Summary
{customized summary text}

---

## Skills Order
1. {section name}
2. {section name}
3. {section name}
4. {section name}
5. {section name}

---

## {Company} Bullet 1
{customized bullet text — only appears if company has a customizable bullet per resume-profile.json}

---

## Projects
1. {project name from baseline}
2. {project name from baseline}
3. {project name from baseline}

---

## Notes
{user and AI discussion, change requests, iteration history}
```

Editing workflow:
- User edits file directly → says "generate PDF" → Claude reads scratchpad + baseline → generates
- User says "Claude, change X" → Claude edits this file → confirms what changed → user approves → generate

---

## `job-posting.md` Format

Reference only — never edited after creation.

```markdown
# {Role} @ {Company}
**Date:** YYYY-MM-DD
**Source:** {LinkedIn / company website / etc.}

## Fit Analysis
**Score:** N/100

| Category | Score | Notes |
|---|---|---|
| Required skills match | N/40 | ... |
| Preferred skills match | N/20 | ... |
| Years of experience | N/20 | ... |
| Domain/context match | N/20 | ... |

**Gaps:**
- ...

**Recommendation:** Strong Fit / Moderate Fit / Weak Fit

---

## Job Description
{full raw job description pasted here}
```

---

## Workflow Phases

### Phase 0: INIT
- Check what artifacts exist in the expected folder
- Determine resume point (see State Detection)
- Load `resume-profile.json` and `baseline-resume-data.json`
- If either fails to load: log `FILE_LOAD_FAILED`, alert user, stop
- Log: `FILES_LOADED`, `STATE_DETECTED`

### Phase 1: FIT ANALYSIS
_Skip if scratchpad.md already exists — go to Phase 2 resumption._

- Parse job description: required skills, preferred skills, experience level, domain
- Score with fixed rubric:
  ```
  Required skills match   0–40
  Preferred skills match  0–20
  Years of experience     0–20
  Domain/context match    0–20
  Total                   0–100
  ```
- Write `job-posting.md` with full job description + fit analysis
- Create `scratchpad.md` shell with `Status: draft`
- Tell user: fit score + breakdown + gaps + recommendation
- Wait: proceed / abort
- Log: `FIT_SCORED`, `CHECKPOINT_FIT`

### Phase 2: CUSTOMIZATION
_On fresh run: generate content. On resume: show existing scratchpad._

- Generate: summary, skills order, customizable bullet(s) per `resume-profile.json`, 3 projects
- Write all into `scratchpad.md` sections
- Tell user: "scratchpad.md ready at `{path}`. Edit directly or tell me what to change."
- Wait: approve / change request
- If change request: edit `scratchpad.md`, confirm what changed, wait again (loop)
- Log: `SCRATCHPAD_WRITTEN`, `CHECKPOINT_SCRATCHPAD`

### Phase 3: GENERATION
- Read `scratchpad.md`
- Load `baseline-resume-data.json`
- Build resume JSON internally (transient — not saved to disk)
- **Validate:** for each entry in `resume-profile.json` `locked_bullets`, compare generated JSON against baseline verbatim
  - If mismatch: show exact diff, log `VALIDATION_FAILED`, stop
- Generate PDF via `mcp__resume-generator__generate_resume`
  - filename: `resume_{username}_{role}.pdf`
  - folder: `{role}_{company}_{YYMMDD-HHMM}/`
- Update `scratchpad.md` Status: generated
- Log: `VALIDATION_PASSED` or `VALIDATION_FAILED`, `PDF_GENERATED` or `PDF_FAILED`, `RUN_COMPLETE`

---

## State Detection

Run at the start of every session before anything else:

```
No folder exists                → fresh run, start at Phase 1
Folder exists, no scratchpad    → fresh run, start at Phase 1
scratchpad.md exists, Status: draft     → Phase 2 resumption: show scratchpad, ask "changes or generate?"
scratchpad.md exists, Status: approved  → Phase 3: go straight to generation
scratchpad.md exists, Status: generated → already complete: tell user, offer to regenerate if they edited scratchpad
```

---

## Logging

**Single file:** `job-prep/applications/_logs/apply-runs.jsonl`
**Format:** one JSON object per line, appended immediately when event occurs via Bash `>>`
**Never rewrite** — append only

### Event schema

Every event has these base fields:
```json
{
  "ts": "2026-05-10T14:30:01",
  "run_id": "{role}_{company}_{YYMMDD-HHMM}",
  "company": "...",
  "role": "...",
  "folder": "{role}_{company}_{YYMMDD-HHMM}",
  "event": "EVENT_NAME",
  "data": {}
}
```

### Event types

| Event | data fields |
|---|---|
| `FILES_LOADED` | — |
| `FILE_LOAD_FAILED` | `file` |
| `STATE_DETECTED` | `state: fresh\|resuming\|complete` |
| `FIT_SCORED` | `score`, `breakdown: {required, preferred, experience, domain}`, `gaps` |
| `CHECKPOINT_FIT` | `decision: approved\|rejected` |
| `SCRATCHPAD_WRITTEN` | `path`, `iterations` |
| `CHECKPOINT_SCRATCHPAD` | `decision: approved\|rejected` |
| `VALIDATION_PASSED` | — |
| `VALIDATION_FAILED` | `errors: [...]` |
| `PDF_GENERATED` | `filename` |
| `PDF_FAILED` | `error` |
| `RUN_COMPLETE` | `status: COMPLETED\|ABORTED_FIT\|ABORTED_SCRATCHPAD\|FAILED_FILE_LOAD\|FAILED_VALIDATION\|FAILED_PDF` |

Incomplete sessions (session died mid-run) = `run_id` has no `RUN_COMPLETE` event.

---

## Hard Rules (unchanged)

- Always start from `baseline-resume-data.json` — never generate resume content from scratch
- Locked bullets per `resume-profile.json` — never modify
- Job titles, company names, dates — never change
- Education, contact info — never change
- No user approval at Phase 2 checkpoint = no PDF
- Bullet counts must match `resume-profile.json` exactly

---

## Implementation Order

1. Create `resume-profile.json`
2. Rewrite `apply.md`
3. Update `_logs/README.md`
4. Delete `RESUME_APPLICATION_WORKFLOW.md`, `VALIDATION_RULES.md`, `RESUME_VALIDATION_CHECKLIST.md`

---

## Implementation Notes

- `RESUME_APPLICATION_WORKFLOW.md`, `VALIDATION_RULES.md`, `RESUME_VALIDATION_CHECKLIST.md` deleted
- `resume-profile.json` created at `job-prep/applications/_resources/`
- `apply.md` fully rewritten — single source of truth
- `_logs/README.md` updated with new event schema
- Existing Betwixt run (`betwixt-founding-ai-engineer/`) predates redesign — folder name uses old convention

## Post-First-Run Fixes (2026-05-11)

**Bug 1 — State detection removed**
State detection was checking for folder existence rather than `scratchpad.md` existence, causing incorrect `resuming` state on pre-existing folders. Removed entirely. `/apply` is always a fresh run. Resuming an existing application is done by editing `scratchpad.md` directly and asking Claude to regenerate — no command needed. A lightweight safety check warns before overwriting an existing `scratchpad.md`.

**Bug 2 — Fit scoring made deterministic**
Free-form scoring produced different totals across runs (82%, 78%, 75% for the same job). Replaced with explicit math: required skills scored as (matched/total)×40, preferred as (matched/total)×20, experience and domain scored against fixed anchor tables. Same input now produces same output.
