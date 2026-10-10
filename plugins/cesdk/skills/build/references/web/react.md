# Build with CE.SDK in React

Docs folder: `skills/docs/references/web/react/` (remote docs workflow, page index, and rules for
React). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/react/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/react/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/react/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/react/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/react/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/react/get-started/react/quickstart-r1q2w3.md`

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
