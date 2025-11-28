# Documentation Cleanup Plan

**Date:** 2025-01-06
**Purpose:** Consolidate documentation after creating refined-architecture.md

---

## Current State

### docs/ Folder Contents:
1. `architecture.md` - Previous architecture (pre-optimization vs target)
2. `diagrams.md` - Mermaid diagrams for old system
3. `tool-selection.md` - Technology selection rationale
4. `refined-architecture.md` - **NEW** comprehensive architecture

### Evaluation:

| File | Status | Action | Reasoning |
|------|--------|--------|-----------|
| `refined-architecture.md` | ✅ Active | **KEEP** | Primary architecture doc with mermaid diagrams |
| `architecture.md` | 🟡 Outdated | **ARCHIVE** | Superseded by refined-architecture.md but useful for history |
| `diagrams.md` | 🟡 Partial overlap | **CONSOLIDATE → REMOVE** | Diagrams now in refined-architecture.md |
| `tool-selection.md` | ✅ Still relevant | **KEEP** | Explains technology choices, still valid |

---

## Recommended Actions

### Phase 1: Immediate Cleanup ✅ DO THIS

1. **Keep as primary reference:**
   - `refined-architecture.md` - Main architecture document
   - `tool-selection.md` - Technology rationale (still valid)

2. **Archive for history:**
   - Move `architecture.md` → `docs/archive/architecture-v1.md`
   - Reason: Useful to see evolution, but not primary reference

3. **Remove (content merged):**
   - Delete `diagrams.md`
   - Reason: All mermaid diagrams now in `refined-architecture.md`

### Phase 2: Root-Level Docs (Keep These)

These docs in `optimization-project/` root are still active:

| File | Purpose | Keep? |
|------|---------|-------|
| `README.md` | Project overview and quick start | ✅ YES |
| `USER_GUIDE.md` | Daily usage guide | ✅ YES |
| `DEDUPLICATION_STRATEGY.md` | Similarity check strategy | ✅ YES - Reference |
| `COST_COMPARISON.md` | Cost analysis | ✅ YES - Useful data |
| `MASTER_PLAN.md` | Original 3-phase plan | 🟡 ARCHIVE (phases complete) |
| `COMPLETION_SUMMARY.md` | Implementation summary | ✅ YES - Historical record |
| `IMPLEMENTATION_TRACKER.md` | Progress tracking | ✅ YES |
| `QUICKSTART.md` | Quick setup guide | ✅ YES |
| `LINKEDIN_INTEGRATION.md` | LinkedIn MCP setup | ✅ YES |
| `WORKING_WITH_CLAUDE_CODE.md` | Development tips | ✅ YES |
| `SESSION_STATE.md` | Session recovery | 🟡 ARCHIVE (phases complete) |
| `SESSION_RECOVERY_GUIDE.md` | Recovery guide | 🟡 ARCHIVE |
| `PHASE_1_SUMMARY.md` | Phase 1 summary | 🟡 ARCHIVE |

---

## Final Structure (Recommended)

```
optimization-project/
├── README.md                          [Primary entry point]
├── USER_GUIDE.md                      [Daily usage]
├── QUICKSTART.md                      [Quick setup]
├── LINKEDIN_INTEGRATION.md            [LinkedIn integration]
├── WORKING_WITH_CLAUDE_CODE.md       [Dev tips]
│
├── docs/                              [Architecture & Technical]
│   ├── refined-architecture.md        [✅ PRIMARY ARCHITECTURE DOC]
│   ├── tool-selection.md              [Tech choices rationale]
│   ├── DEDUPLICATION_STRATEGY.md      [Similarity check details]
│   ├── COST_COMPARISON.md             [Cost analysis data]
│   └── DOCS_CLEANUP_PLAN.md          [This file]
│
├── implementation/                    [Implementation history - OPTIONAL]
│   ├── COMPLETION_SUMMARY.md
│   ├── IMPLEMENTATION_TRACKER.md
│   ├── MASTER_PLAN.md
│   ├── PHASE_1_SUMMARY.md
│   ├── SESSION_STATE.md
│   └── SESSION_RECOVERY_GUIDE.md
│
├── phase-1/                           [Phase artifacts]
├── phase-2/
├── phase-3/
└── research/
```

---

## Migration Commands

### Step 1: Create archive and implementation folders
```bash
cd /home/virus/Documents/repo/per_wesite/optimization-project
mkdir -p docs/archive
mkdir -p implementation
```

### Step 2: Archive old architecture
```bash
mv docs/architecture.md docs/archive/architecture-v1.md
```

### Step 3: Remove consolidated diagrams
```bash
rm docs/diagrams.md
# Reason: All diagrams now in refined-architecture.md
```

### Step 4: Move implementation docs (optional)
```bash
mv MASTER_PLAN.md implementation/
mv COMPLETION_SUMMARY.md implementation/
mv IMPLEMENTATION_TRACKER.md implementation/
mv PHASE_1_SUMMARY.md implementation/
mv SESSION_STATE.md implementation/
mv SESSION_RECOVERY_GUIDE.md implementation/
```

### Step 5: Move strategy docs to docs/
```bash
mv DEDUPLICATION_STRATEGY.md docs/
mv COST_COMPARISON.md docs/
```

---

## What Users Should Read

### For new users:
1. **START:** `README.md` - Project overview
2. **SETUP:** `QUICKSTART.md` - Get up and running
3. **USE:** `USER_GUIDE.md` - Daily workflow

### For understanding architecture:
1. **ARCHITECTURE:** `docs/refined-architecture.md` - Complete system design
2. **TECH CHOICES:** `docs/tool-selection.md` - Why each technology
3. **DEDUPLICATION:** `docs/DEDUPLICATION_STRATEGY.md` - Similarity check details
4. **COSTS:** `docs/COST_COMPARISON.md` - Cost analysis

### For developers:
1. **ARCHITECTURE:** `docs/refined-architecture.md` - System design with diagrams
2. **CODE TIPS:** `WORKING_WITH_CLAUDE_CODE.md` - Development workflow
3. **IMPLEMENTATION:** `implementation/` folder - Historical context

---

## Benefits of Cleanup

1. **Clearer structure:** Primary docs in root, technical docs in `docs/`
2. **No duplication:** Removed `diagrams.md` (merged into refined-architecture.md)
3. **Historical context:** Old architecture in `archive/` for reference
4. **Easier onboarding:** Clear reading path for new users
5. **Implementation history:** Separated from active docs

---

## Summary

**DELETE:**
- `docs/diagrams.md` (content merged into refined-architecture.md)

**MOVE TO ARCHIVE:**
- `docs/architecture.md` → `docs/archive/architecture-v1.md`

**MOVE TO implementation/:**
- `MASTER_PLAN.md`
- `COMPLETION_SUMMARY.md`
- `IMPLEMENTATION_TRACKER.md`
- `PHASE_1_SUMMARY.md`
- `SESSION_STATE.md`
- `SESSION_RECOVERY_GUIDE.md`

**MOVE TO docs/:**
- `DEDUPLICATION_STRATEGY.md`
- `COST_COMPARISON.md`

**KEEP IN ROOT:**
- `README.md`
- `USER_GUIDE.md`
- `QUICKSTART.md`
- `LINKEDIN_INTEGRATION.md`
- `WORKING_WITH_CLAUDE_CODE.md`

**KEEP IN docs/:**
- `refined-architecture.md` ⭐ PRIMARY
- `tool-selection.md`

---

**Next Step:** Review this plan and execute migration commands

**Approval needed?** YES - User should review before executing cleanup
