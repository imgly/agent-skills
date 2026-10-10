# Build with CE.SDK in SvelteKit

Docs folder: `skills/docs/references/web/sveltekit/` (remote docs workflow, page index, and rules for
SvelteKit). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/sveltekit/get-started/sveltekit/quickstart-k4q5w6.md`

## Rules for SvelteKit

Read before writing code.

- `skills/docs/references/web/sveltekit/rules/asset-handling.md`
- `skills/docs/references/web/sveltekit/rules/common-pitfalls.md`
- `skills/docs/references/web/sveltekit/rules/content-fill-mode.md`
- `skills/docs/references/web/sveltekit/rules/silent-init-errors.md`
- `skills/docs/references/web/sveltekit/rules/verify-properties-before-use.md`

## Notes

Pages render on the server. The editor needs a browser, so create it client-side only; the get-started pages show the pattern.

Then apply `common.md` for the workflow, output format, and starter kits.
