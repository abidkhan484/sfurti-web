# Command Execution Guardrails Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish explicit command execution guardrails by removing `run_command` from trusted tools in `.gemini/settings.json`, creating `.agents/AGENTS.md`, and updating `gemini.md`.

**Architecture:** Update settings.json to remove `run_command` from `trustedTools`, create workspace-level agent rule file `.agents/AGENTS.md`, and update project onboarding guide `gemini.md`.

**Tech Stack:** JSON, Markdown.

## Global Constraints
- `trustedTools` must retain `read_file`, `write_file`, `search_web`, `grep_search`, and `list_dir`.
- `.agents/AGENTS.md` must be placed in workspace root under `.agents/`.
- `gemini.md` must document the security guardrails.

---

### Task 1: Update `.gemini/settings.json` to untrust `run_command`

**Files:**
- Modify: `.gemini/settings.json:13-20`

**Interfaces:**
- Consumes: Existing `.gemini/settings.json`
- Produces: `.gemini/settings.json` with `run_command` removed from `trustedTools`

- [ ] **Step 1: Modify `.gemini/settings.json`**

Update `trustedTools` array:
```json
  "trustedTools": [
    "read_file",
    "write_file",
    "search_web",
    "grep_search",
    "list_dir"
  ]
```

- [ ] **Step 2: Verify JSON validity**

Verify that `.gemini/settings.json` is valid JSON and contains the correct list of trusted tools without `run_command`.

---

### Task 2: Create `.agents/AGENTS.md` with workspace command guardrails

**Files:**
- Create: `.agents/AGENTS.md`

**Interfaces:**
- Consumes: Design spec requirements
- Produces: `.agents/AGENTS.md` workspace rules file

- [ ] **Step 1: Create `.agents/AGENTS.md`**

Write the rules for command execution, explicit approval, destructive command safeguards, and safe command protocol.

---

### Task 3: Update `gemini.md` with Security & Guardrails documentation

**Files:**
- Modify: `gemini.md`

**Interfaces:**
- Consumes: `.agents/AGENTS.md` rules
- Produces: Updated `gemini.md` containing Security & Guardrails section

- [ ] **Step 1: Add Security & Guardrails section to `gemini.md`**

Add documentation explaining that `run_command` requires user confirmation and reference `.agents/AGENTS.md`.

- [ ] **Step 2: Verify documentation consistency**

Ensure links and section references in `gemini.md` are clean and accurate.
