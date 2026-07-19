## graphify

This project has a knowledge graph at `graphify-out/` with god nodes, community structure, and cross-file relationships.

Agent workflow:
- Treat [AGENTS.md](AGENTS.md) as the repo-level instruction file.
- For codebase questions, first run `graphify query "<question>"` when `graphify-out/graph.json` exists.
- Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts.
- Use `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).


## Note
After adding new test cases or discovering new bugs, update the docs accordingly:
- ./docs/test_documentation.md (documentation of the test cases)
- ./docs/jira_bug_tracker.md (track the bugs discovered)
