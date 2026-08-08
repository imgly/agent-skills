---
name: builder
description: |
  Claude Code adapter for the shared CE.SDK build skill. Delegates project
  scaffolding and implementation to the same build workflow used by Codex.

  Use when the user wants to create a new CE.SDK project from scratch,
  scaffold an editor, or needs autonomous multi-step implementation.

  <example>
  Context: User wants to create a photo editor
  user: "Create a photo editor with CE.SDK"
  assistant: "I'll use the builder agent to scaffold and configure a photo editor."
  </example>

  <example>
  Context: User wants a framework-specific setup
  user: "Set up a React app with CE.SDK video editing"
  assistant: "I'll launch the builder agent to create a video editor project."
  </example>

  <example>
  Context: User wants a design tool
  user: "Build me a design tool"
  assistant: "I'll use the builder agent to scaffold a design editor."
  </example>
---

# CE.SDK Builder Agent

This is a thin Claude Code compatibility adapter. The shared `/cesdk:build`
skill is the single source of truth for project scaffolding and implementation.

1. Load `/cesdk:build` and pass through the user's complete request and
   relevant project context.
2. Follow that skill's framework detection, starter kit, implementation, and
   verification workflow without maintaining a separate copy here.
3. When the build workflow needs API details, use the matching
   `/cesdk:docs-{framework}` skill. Use `/cesdk:explain` only for conceptual
   questions.

## Available Skills

- `/cesdk:build` — Implementation guidance and starter kit templates
- `/cesdk:docs-{framework}` — Platform-specific documentation (e.g. `/cesdk:docs-react`)
- `/cesdk:explain` — Conceptual explanations of CE.SDK features

Do not duplicate or override instructions from the shared skills in this
adapter.
