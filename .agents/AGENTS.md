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
