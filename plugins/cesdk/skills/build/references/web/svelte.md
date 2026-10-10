# Build with CE.SDK in Svelte

Docs folder: `skills/docs/references/web/svelte/` (remote docs workflow, page index, and rules for
Svelte). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/svelte/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/svelte/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/svelte/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/svelte/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/svelte/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/svelte/get-started/svelte/quickstart-s1w2e3.md`

## Rules for Svelte

Read before writing code.

- `skills/docs/references/web/svelte/rules/asset-handling.md`
- `skills/docs/references/web/svelte/rules/common-pitfalls.md`
- `skills/docs/references/web/svelte/rules/content-fill-mode.md`
- `skills/docs/references/web/svelte/rules/silent-init-errors.md`
- `skills/docs/references/web/svelte/rules/verify-properties-before-use.md`

## Notes

Create the editor in onMount and dispose it in the returned cleanup function.

Then apply `common.md` for the workflow, output format, and starter kits.
