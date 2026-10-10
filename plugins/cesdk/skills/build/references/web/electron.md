# Build with CE.SDK in Electron

Docs folder: `skills/docs/references/web/electron/` (remote docs workflow, page index, and rules for
Electron). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/electron/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/electron/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/electron/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/electron/get-started/electron/quickstart-e2l3c0.md`
- `https://img.ly/docs/cesdk/dev/electron/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/electron/get-started/overview-e18f40.md`

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
