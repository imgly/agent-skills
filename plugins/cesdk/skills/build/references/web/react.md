# Build with CE.SDK in React

Docs folder: `skills/docs/references/web/react/` (guides, API digests, rules for React).

## Setup

Follow the get-started pages first. They carry the exact packages and versions.

- `skills/docs/references/web/react/get-started/agent-skills.md`
- `skills/docs/references/web/react/get-started/build-with-ai.md`
- `skills/docs/references/web/react/get-started/cesdk-plugin-coding-agents.md`
- `skills/docs/references/web/react/get-started/mcp-server.md`
- `skills/docs/references/web/react/get-started/overview.md`
- `skills/docs/references/web/react/get-started/react/quickstart.md`

## Rules for React

Read before writing code.

- `skills/docs/references/web/react/rules/asset-handling.md`
- `skills/docs/references/web/react/rules/common-pitfalls.md`
- `skills/docs/references/web/react/rules/content-fill-mode.md`
- `skills/docs/references/web/react/rules/silent-init-errors.md`
- `skills/docs/references/web/react/rules/strict-mode-double-mount.md`
- `skills/docs/references/web/react/rules/verify-properties-before-use.md`

## Notes

Create the editor once per mounted component and dispose it on unmount. React 18 Strict Mode mounts components twice in development; see the rules.

Then apply `common.md` for the workflow, output format, and starter kits.
