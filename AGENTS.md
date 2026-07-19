# AGENTS.md

## Purpose
This repository already has a knowledge graph in `graphify-out/`. Use it before reading raw source when it can answer the question faster and more accurately.

## Default Workflow
1. Check whether `graphify-out/graph.json` exists.
2. If it exists and you need to understand the codebase, prefer `graphify query`, `graphify path`, or `graphify explain` before broad file browsing.
3. Use `graphify-out/GRAPH_REPORT.md` for high-level architecture, community structure, god nodes, and surprising connections.
4. Use source files only to confirm details that the graph does not settle.

## When To Use The Graph
- Use `graphify query "<question>"` for codebase questions, call flows, ownership, dependencies, and feature tracing.
- Use `graphify path "<A>" "<B>"` for shortest relationship paths.
- Use `graphify explain "<concept>"` for focused concept lookup.
- Prefer the graph over ad hoc grep/search when you need cross-file context.

## After Code Changes
- After modifying code, refresh the graph with `graphify update .` when available.
- If the graph already exists, keep it current rather than letting it drift from the codebase.

## Scope And Safety
- Do not inspect `node_modules/` unless the task explicitly requires dependency internals.
- Treat generated graph outputs as derived artifacts, not source of truth for code edits.
- If a graph result and source file disagree, verify the source file before changing behavior.

## Practical Rule
Before starting new coding work, ask: can the existing graph answer this faster than a full repo scan? If yes, use the graph first.