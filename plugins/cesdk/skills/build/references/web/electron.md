# Build with CE.SDK in Electron

Docs folder: `skills/docs/references/web/electron/` (guides, API digests, rules for Electron).

## Setup

Follow the get-started pages first. They carry the exact packages and versions.

- `skills/docs/references/web/electron/get-started/agent-skills.md`
- `skills/docs/references/web/electron/get-started/build-with-ai.md`
- `skills/docs/references/web/electron/get-started/cesdk-plugin-coding-agents.md`
- `skills/docs/references/web/electron/get-started/electron/quickstart.md`
- `skills/docs/references/web/electron/get-started/mcp-server.md`
- `skills/docs/references/web/electron/get-started/overview.md`

## Rules for Electron

Read before writing code.

- `skills/docs/references/web/electron/rules/asset-handling.md`
- `skills/docs/references/web/electron/rules/common-pitfalls.md`
- `skills/docs/references/web/electron/rules/content-fill-mode.md`
- `skills/docs/references/web/electron/rules/silent-init-errors.md`
- `skills/docs/references/web/electron/rules/verify-properties-before-use.md`

## Notes

The editor runs in the renderer process, a browser context. Serve assets from the app bundle when the app must work offline.

Then apply `common.md` for the workflow, output format, and starter kits.
