# Claude Agent Configuration

This repository uses the Claude Labs CLI multi-agent system.

Agents live in `.claude/agents/`.
Features live in `/features/`, each with:
- `ba.md` – Business context
- `requirement.md` – Detailed requirements
- `technical.md` – Technical notes
- `tasks.md` – Work breakdown
- `schedule.md` – Timeline or milestones

### Coordination Flow
1. `requirements-analyst` → validates and extracts requirements
2. `task-translator` → turns requirements into technical tasks
3. `technical-analyst` → reviews architecture and API design
4. `project-manager` → organizes schedule and delivery plan
