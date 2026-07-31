# Command Execution Guardrails — Design Specification

**Date:** 2026-08-01  
**Project:** sfurti-landing  
**Status:** Approved  

## 1. Overview
To ensure all shell command executions are intentional, explicit, and secure, this design establishes guardrails both at the IDE/harness tool level and at the repository agent instructions level.

## 2. Changes & Specifications

### 2.1 Harness Tool Configuration (`.gemini/settings.json`)
Remove `run_command` from the `trustedTools` array.

- **Current `trustedTools`**:
  `["read_file", "write_file", "run_command", "search_web", "grep_search", "list_dir"]`
- **Updated `trustedTools`**:
  `["read_file", "write_file", "search_web", "grep_search", "list_dir"]`

**Impact:** The client environment will explicitly require user approval for any command proposed via `run_command`.

---

### 2.2 Workspace Agent Rules (`.agents/AGENTS.md`)
Create `.agents/AGENTS.md` to define workspace-scoped rules for all AI agents.

**Contents of `.agents/AGENTS.md`**:
```markdown
# Workspace Agent Rules — Sfurti Landing

## Command Execution Guardrails

1. **Explicit Purpose & Approval**:
   - Before executing any shell command, explain what the command does, why it is necessary, and its expected impact.
   - Do not assume permission to run terminal commands silently.

2. **Destructive & Mutating Command Safeguards**:
   - The following actions require explicit user confirmation before execution:
     - Deleting or overwriting non-generated files (`rm`, `git clean`, etc.).
     - Modifying remote git state (`git push`, `git reset --hard`, branch deletions).
     - Installing or removing system/global dependencies.
     - Production deployment commands or database schema drops/resets.

3. **Safe Command Protocol**:
   - Verification commands (`npm test`, `tsc --noEmit`, `git status`, `lint`) should be proposed with concise explanations.
   - Never bypass pre-commit hooks or safety flags (e.g., do not use `git commit --no-verify`).
```

---

### 2.3 Onboarding Documentation (`gemini.md`)
Update `gemini.md` to document command permissions:
- Under a new section **Security & Guardrails**, note that `run_command` requires user confirmation and point to `.agents/AGENTS.md`.
