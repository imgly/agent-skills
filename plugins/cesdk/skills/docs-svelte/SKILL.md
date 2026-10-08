---
name: docs-svelte
description: |
  Look up CE.SDK Svelte reference docs, guides, and configuration pages.

  Use when the user needs CE.SDK docs for Svelte — configuration, UI customization,
  export options, feature guides, or getting-started instructions. Also triggered by "IMG.LY", "CreativeEditor",
  "CE.SDK", or "cesdk" when the user needs an existing Svelte doc page.

  Not for writing code (use build) or concept explanations (use explain).

  <example>
  Context: User asks about Svelte configuration
  user: "How do I configure the editor in Svelte?"
  assistant: "I'll use /imgly-sdk:docs-svelte to look up configuration options."
  </example>

  <example>
  Context: User needs Svelte integration
  user: "How do I use CE.SDK in a Svelte component?"
  assistant: "Let me use /imgly-sdk:docs-svelte to find the relevant documentation."
  </example>
argument-hint: "[search-topic]"
---

## Version Notice

> CE.SDK `1.83.0` · generated `2026-09-30` · plugin `cesdk`
> · canonical update source `imgly/agent-skills`.
>
> If this bundle is over six weeks old, or the user asks about updates, follow
> `references/update-check.md` once per task and reuse the result for all CE.SDK
> skills. Keep the check read-only. Never install, update, overwrite, or delete
> anything without explicit user approval. Continue with this bundle unless an
> update is approved.

# CE.SDK Svelte Documentation

Look up documentation for IMG.LY CreativeEditor SDK (Svelte).

**Query**: $ARGUMENTS

## Remote Documentation

This skill reads the CE.SDK docs on `https://img.ly/docs/cesdk/svelte/`.
The website serves only the latest stable CE.SDK release. It has no older versions.
This bundle targets CE.SDK `1.83.0`. If the project uses a different CE.SDK version,
read the changelog and upgrade pages, and check the type definitions of the
installed package.

## How to Use

1. **Read the index**: Read `references/svelte.md`. It lists all Svelte pages with
   their titles and links.
2. **Select pages**: Pick the pages that match the query.
3. **Fetch each page as Markdown**: Remove the trailing `/` from the link and add `.md`.
   For example, `https://img.ly/docs/cesdk/svelte/export-save-publish/export/to-png-f87eaf/`
   becomes `https://img.ly/docs/cesdk/svelte/export-save-publish/export/to-png-f87eaf.md`.
   Use WebFetch. If WebFetch is not available (for example in Codex), use `curl -sL <url>`.
4. **Answer from the fetched pages only**: Give the relevant section and code examples,
   and cite the page URLs. If no page covers the request, say so. Do not fill the gap
   with pre-trained knowledge.
5. **Check rules**: Before setup, initialization, or common operations, read the local
   `rules/*.md` files. They list agent pitfalls that the website does not cover.

## API Lookup

For TypeScript API queries (method signatures, types, parameters):

- Editor API (`@cesdk/cesdk-js`): `https://img.ly/docs/cesdk/svelte/api/cesdk-js.md`
- Engine API (`@cesdk/engine`): `https://img.ly/docs/cesdk/svelte/api/engine.md`

Class and type pages follow the same `.md` rule. For example:
`https://img.ly/docs/cesdk/svelte/api/engine/classes/blockapi.md`.

**Tip**: Verify types against the TypeScript definitions — CE.SDK evolves rapidly and type shapes may differ from pre-trained knowledge.

## Full Text

`https://img.ly/docs/cesdk/svelte/llms-full.txt` holds all Svelte pages in one file
(several MB). Use it only as a last resort, when the index and the pages do not
answer the query. Search it with `curl -sL <url> | grep -n "<keyword>"`. Do not read
it in full.

## Local Rules

- `rules/asset-handling.md`: Image format recommendations, URI resolution
- `rules/common-pitfalls.md`: Critical gotchas (invisible fills, SVG rendering issues)
- `rules/content-fill-mode.md`: `contentFillMode` belongs on the block, not the fill
- `rules/silent-init-errors.md`: CreativeEditor init callback swallows errors silently
- `rules/verify-properties-before-use.md`: Call `engine.block.findAllProperties()` before you get or set a property

## Additional Triggers

This skill also covers queries about CE.SDK block types, asset sources, and feature capabilities.
It handles API method lookups — BlockAPI, SceneAPI, EditorAPI, AssetAPI, method signatures,
return types, and "engine.block" style queries.

## Related Skills

- Use \`/imgly-sdk:build\` when the user needs implementation help, not just docs
- Use \`/imgly-sdk:explain\` for conceptual explanations beyond what docs cover
