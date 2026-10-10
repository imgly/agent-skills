# Build with CE.SDK in Vanilla JavaScript

Docs folder: `skills/docs/references/web/js/` (remote docs workflow, page index, and rules for
Vanilla JavaScript). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/js/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/js/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/js/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/js/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/js/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/js/get-started/vanilla-js/quickstart-yef23s.md`

## Rules for Vanilla JavaScript

Read before writing code.

- `skills/docs/references/web/js/rules/asset-handling.md`
- `skills/docs/references/web/js/rules/common-pitfalls.md`
- `skills/docs/references/web/js/rules/content-fill-mode.md`
- `skills/docs/references/web/js/rules/silent-init-errors.md`
- `skills/docs/references/web/js/rules/verify-properties-before-use.md`

## Notes

No framework wrapper. Mount the editor into a container element after the DOM is ready.

Then apply `common.md` for the workflow, output format, and starter kits.
