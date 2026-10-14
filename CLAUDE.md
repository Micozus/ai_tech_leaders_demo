@AGENTS.md

## Claude Code specifics

Shared rules (planning, verification, lessons, `.ai/` workflow) live in AGENTS.md; do not repeat them here.

- Use plan mode (`Shift+Tab`) for any change that spans several files or layers; for risky plans, have a subagent review the plan before implementing.
- Run independent work in parallel: use subagents for wide read-only investigation or independent reviews to keep the main context clean; use separate `git worktree`s for unrelated tasks on disjoint files.
- Prefer a fresh session (or `HANDOFF.md`) when the task changes; keep this file short and prune stale rules.
- Turn procedures repeated more than once into a skill/slash command committed to the repo (e.g. a tech-debt scan for duplicated code) rather than into this file.
- After the user corrects you, update `.ai/lessons/` (and AGENTS.md if it is a standing convention) in the same session.
