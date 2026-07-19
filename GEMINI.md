## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

Agent workflow:
- Treat [AGENTS.md](AGENTS.md) as the repo-level instruction file.
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- Use `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).


## SQA Testing & Documentation Guidelines
- **Target Coverage**: The target test coverage for both frontend and backend is **~70%**.
- **Checking**: Always check existing test cases in `./docs/test_documentation.md` and existing bugs in `./docs/jira_bug_tracker.md` before writing new tests. Run `npm test -- --coverage` to verify the current coverage percentage.
- **Documenting**: When adding new test cases, append them to the unified table in `./docs/test_documentation.md`. Ensure you use the next sequential `TC-XX` ID to avoid conflicts.
- **Tracking**: When discovering or injecting new bugs, log them in `./docs/jira_bug_tracker.md` under the "Logged Bugs" section. Include the severity, description, and the failing Test ID.
- **Updating**: Keep both `./docs/test_documentation.md` (including the Test Coverage Metrics section) and `./docs/jira_bug_tracker.md` strictly up to date after every new test added, coverage change, or bug discovered.
