# Build with CE.SDK in Node.js

Docs folder: `skills/docs/references/web/node/` (remote docs workflow, page index, and rules for
Node.js). The API digests are in `skills/docs/references/web/api/`.

## Setup

Follow the get-started pages first. They carry the exact packages and versions.
Fetch them as Markdown (WebFetch, or `curl -sL --compressed <url>`):

- `https://img.ly/docs/cesdk/dev/node/get-started/agent-skills-f7g8h9.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/build-with-ai-k7m9p2.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/bun-l3456c.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/cesdk-plugin-coding-agents-c0d3ag.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/deno-m2345b.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/mcp-server-fde71c.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/overview-e18f40.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/vanilla-n1234a.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/vanilla-aws-lambda-fee18b.md`
- `https://img.ly/docs/cesdk/dev/node/get-started/vanilla-clone-github-project-n1fe4a.md`

## Rules for Node.js

Read before writing code.

- `skills/docs/references/web/node/rules/asset-handling.md`
- `skills/docs/references/web/node/rules/common-pitfalls.md`
- `skills/docs/references/web/node/rules/content-fill-mode.md`
- `skills/docs/references/web/node/rules/silent-init-errors.md`
- `skills/docs/references/web/node/rules/verify-properties-before-use.md`

## Notes

Headless engine only (`@cesdk/node`), no editor UI. Use it for batch and server-side rendering.

Then apply `common.md` for the workflow, output format, and starter kits.
