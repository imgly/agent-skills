# Build with CE.SDK in Vue.js

Docs folder: `skills/docs/references/web/vue/` (remote docs workflow, page index, and rules for
Vue.js). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/vue/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/vue/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/vue/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/vue/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/vue/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/vue/get-started/vue/quickstart-v4t5y6.md`

## Rules for Vue.js

Read before writing code.

- `skills/docs/references/web/vue/rules/asset-handling.md`
- `skills/docs/references/web/vue/rules/common-pitfalls.md`
- `skills/docs/references/web/vue/rules/content-fill-mode.md`
- `skills/docs/references/web/vue/rules/silent-init-errors.md`
- `skills/docs/references/web/vue/rules/verify-properties-before-use.md`

## Notes

Create the editor in the mounted hook and dispose it when the component unmounts.

Then apply `common.md` for the workflow, output format, and starter kits.
