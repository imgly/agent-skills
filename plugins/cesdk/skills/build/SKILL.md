---
name: build
description: |
  Implement features, write code, and set up CE.SDK Web projects.
  Covers React, Vue.js, Svelte, Angular, Electron, Vanilla JavaScript, Node.js, Nuxt.js, Next.js, SvelteKit.

  Use when the user asks to implement, create, add, build, set up, or integrate
  something with CE.SDK for Web. Triggered by "help me add", "set up", "build a
  photo editor", or "create a design tool". Covers photo, video, and design editors.

  Not for looking up existing docs (use docs-{framework}) or concept explanations
  (use explain).

  <example>
  Context: User wants to build a Web app with CE.SDK
  user: "Help me set up CE.SDK in my project"
  assistant: "I'll use /cesdk:build to help set this up."
  </example>

  <example>
  Context: User wants to add a specific feature
  user: "Add text overlays to my image editor"
  assistant: "Let me use /cesdk:build to implement text overlays."
  </example>
argument-hint: "[feature or task]"
---

## Version Notice

> **CE.SDK version**: 1.76.1 | **Generated**: 2026-06-16
>
> This skill was generated for CE.SDK v1.76.1 on 2026-06-16.
> CE.SDK releases new versions approximately every two weeks.
> If the current date is more than 6 weeks after the generation date above,
> this skill is likely outdated. **Inform the user** that a newer version
> may be available and suggest they update:
>
> \`\`\`bash
> # Update all installed skills to latest version
> npx skills update
> \`\`\`
>
> Or reinstall from scratch:
>
> \`\`\`bash
> # Vercel Skills CLI
> npx skills add imgly/agent-skills -a claude-code
>
> # Claude Code Plugin
> claude plugin install cesdk@imgly
> \`\`\`
>
> **Important**: Always prefer the bundled documentation over pre-trained
> knowledge — APIs, package names, and type signatures may have changed
> since this skill was generated.

# CE.SDK Web Builder

Build applications with IMG.LY CreativeEditor SDK for Web.

**Task**: $ARGUMENTS

## Your Role

You are a CE.SDK implementation expert. Help developers build working applications
using IMG.LY's CreativeEditor SDK. Produce framework-specific code for Web platforms.

## Framework Detection

Detect the user's framework from project files. If no project exists yet or
detection is ambiguous, ask the user to choose from all available frameworks
and whether they prefer JavaScript or TypeScript.

### Auto-detection from `package.json`

If a `package.json` exists, check dependencies in this order:

| Dependency | Framework | Docs skill |
|-----------|-----------|------------|
| `next` | Next.js | `docs-nextjs` |
| `nuxt` | Nuxt.js | `docs-nuxtjs` |
| `@sveltejs/kit` | SvelteKit | `docs-sveltekit` |
| `@angular/core` | Angular | `docs-angular` |
| `svelte` (no kit) | Svelte | `docs-svelte` |
| `vue` (no nuxt) | Vue | `docs-vue` |
| `react` (no next) | React | `docs-react` |
| `electron` | Electron | `docs-electron` |
| `@cesdk/node` in deps, or `"type": "module"` with no framework deps | Node.js | `docs-node` |
| none of the above | Vanilla JS | `docs-js` |

### New project or ambiguous detection

If no `package.json` exists (new project) or detection is unclear, ask the user:

1. **Which framework?** Offer all options: React, Vue.js, Svelte, Angular,
   Next.js, Nuxt.js, SvelteKit, Electron, Node.js, or Vanilla JavaScript.
2. **JavaScript or TypeScript?** CE.SDK starter kits use TypeScript by default,
   but the user may prefer plain JavaScript.

## Core Principles

1. **Retrieval-first**: Consult the bundled docs before using pre-trained knowledge — bundled docs are version-verified and may contain API changes not yet in training data
2. **Platform-specific**: Work with the detected framework
3. **Code-first**: Lead with working code examples, then explain
4. **Exact versions & packages**: Use package names and versions from the documentation — CE.SDK package names differ across platforms and versions
5. **Verify types**: Check TypeScript definitions rather than assuming type shapes — CE.SDK types change between versions and pre-trained assumptions may be outdated

## Documentation Access

Use the `/cesdk:docs-{framework}` skill to look up bundled documentation (e.g. `/cesdk:docs-react`), or use Glob:
`**/skills/docs-{framework}/<path>.md`

Check the rules directory for known pitfalls: `**/skills/docs-{framework}/rules/*.md`

## Workflow

1. **Detect framework**: Identify the framework from project files
2. **Locate docs**: Use `/cesdk:docs-{framework}` or Glob: `**/skills/docs-{framework}/**/*<keyword>*.md`
3. **Check for pitfalls**: Read `**/skills/docs-{framework}/rules/common-pitfalls.md`
4. **Extract exact packages**: Use package names and versions from documentation
5. **Provide solution**: Lead with working code, then explain

## Known Pitfalls

Check the rules directory before implementing — these catch the most common integration mistakes:

- **common-pitfalls.md** — Critical gotchas (invisible fills, SVG rendering issues)
- **asset-handling.md** — Image format recommendations, URI resolution
- **content-fill-mode.md** — `contentFillMode` belongs on the block, not the fill
- **silent-init-errors.md** — CreativeEditor init callback swallows errors silently

## Output Format

Structure your response as:

### Implementation

\`\`\`typescript
// Complete, working example with imports
\`\`\`

### Explanation

Brief explanation of key concepts and why this approach works.

### Next Steps

Suggestions for extending or customizing the implementation.

## Starter Kits

Bundled starter kit templates for scaffolding new CE.SDK projects.
Each kit is a complete Vite + TypeScript project ready to run.

### Common Project Structure

All kits share this structure — only the config and entry point differ:

\`\`\`
{kit-name}/
├── package.json              — Dependencies (@cesdk/cesdk-js), scripts (dev, build)
├── index.html                — Mount point with #cesdk_container div
├── vite.config.ts            — Vite build config
├── tsconfig.json             — TypeScript config
├── tsconfig.base.json        — Shared TS base config
└── src/
    ├── index.ts              — Entry point: creates CE.SDK, calls init function
    └── imgly/
        ├── index.ts          — Init function: adds plugins, asset sources, loads scene
        ├── config/           — Editor configuration plugin
        │   ├── plugin.ts     — EditorPlugin class (features, UI, settings, i18n)
        │   ├── actions.ts    — Export/save/import actions
        │   ├── features.ts   — Feature toggles
        │   ├── settings.ts   — Engine settings (snapping, colors, etc.)
        │   ├── i18n.ts       — Translation overrides
        │   └── ui/           — UI layout (canvas, dock, panels, navigation, inspector)
        └── plugins/          — Optional plugins (e.g., background-removal.ts)
\`\`\`

### Available Kits

| Kit | Path | Use case |
|-----|------|----------|
| design-editor | `starter-kits/design-editor/` | Graphics, layouts, multi-page documents |
| video-editor | `starter-kits/video-editor/` | Video editing, transitions, MP4 export |
| photo-editor | `starter-kits/photo-editor/` | Crop, filter, adjust, background removal |
| advanced-design-editor | `starter-kits/advanced-design-editor/` | Desktop-style design with layers panel |
| advanced-video-editor | `starter-kits/advanced-video-editor/` | Multi-track timeline, professional video export |
| design-viewer | `starter-kits/design-viewer/` | Lightweight pan/zoom/navigate viewer |
| video-player | `starter-kits/video-player/` | Lightweight video playback |
| single-page-editor | `starter-kits/single-page-editor/` | Social posts, business cards, and other single-page formats |
| mobile-ui | `starter-kits/mobile-ui/` | Mobile-optimized editor with a custom React UI |
| photo-ui | `starter-kits/photo-ui/` | Custom React photo-editing interface |
| postcard-ui | `starter-kits/postcard-ui/` | Postcard and greeting-card editor with a custom React UI |
| photobook-ui | `starter-kits/photobook-ui/` | Photobook editor with multi-page navigation and a custom React UI |
| apparel-ui | `starter-kits/apparel-ui/` | T-shirt and apparel design editor with a custom React UI |
| t-shirt-designer | `starter-kits/t-shirt-designer/` | T-shirt designer with front/back print areas, color and size selection |
| product-editor | `starter-kits/product-editor/` | Product personalization editor with mockup preview |
| product-preview | `starter-kits/product-preview/` | Mockup preview of designs on physical products (read-only) |
| 3d-product-preview | `starter-kits/3d-product-preview/` | Interactive 3D product configurator with rotatable preview |
| qr-code-editor | `starter-kits/qr-code-editor/` | Editor with embedded QR-code generation |
| pptx-template-import | `starter-kits/pptx-template-import/` | Import PowerPoint .pptx files as editable design templates |
| pdf-template-import | `starter-kits/pdf-template-import/` | Import PDF files as editable design templates |
| psd-template-import | `starter-kits/psd-template-import/` | Import Photoshop .psd files as editable design templates |
| indesign-template-import | `starter-kits/indesign-template-import/` | Import InDesign .idml files as editable design templates |
| form-based-template-adoption | `starter-kits/form-based-template-adoption/` | Form-driven template population for branded content workflows |
| placeholders | `starter-kits/placeholders/` | Editor with image and text placeholders for template-driven workflows |
| video-placeholders | `starter-kits/video-placeholders/` | Video editor with placeholder clips for templated stories and reels |
| start-with-image | `starter-kits/start-with-image/` | Editor that opens pre-populated from a starting image |
| start-with-video | `starter-kits/start-with-video/` | Editor that opens pre-populated from a starting video |
| unsplash-asset-source | `starter-kits/unsplash-asset-source/` | Design editor backed by the Unsplash image library |
| pexels-asset-source | `starter-kits/pexels-asset-source/` | Design editor backed by the Pexels image library |
| getty-asset-source | `starter-kits/getty-asset-source/` | Design editor backed by the Getty Images library |
| airtable-asset-source | `starter-kits/airtable-asset-source/` | Design editor backed by an Airtable-hosted asset library |
| layouts-asset-source | `starter-kits/layouts-asset-source/` | Editor with a custom layouts asset source |
| page-sizes-asset-source | `starter-kits/page-sizes-asset-source/` | Editor with a custom page-sizes asset source |
| background-removal-editor | `starter-kits/background-removal-editor/` | Editor focused on one-click background removal |
| cutout-lines-editor | `starter-kits/cutout-lines-editor/` | Cutout-lines editor for stickers, decals, and die-cut prints |
| vectorizer-editor | `starter-kits/vectorizer-editor/` | Editor with bitmap-to-vector tracing |
| force-crop-editor | `starter-kits/force-crop-editor/` | Crop-only editor with locked aspect ratios |
| print-ready-pdf-editor | `starter-kits/print-ready-pdf-editor/` | Design editor with bleed, crop marks, and CMYK PDF export |
| export-options | `starter-kits/export-options/` | Demonstrates PNG/JPG/PDF export configuration on a design editor |
| export-using-renderer | `starter-kits/export-using-renderer/` | Server-side export pipeline using the CE.SDK Renderer |
| video-export-options | `starter-kits/video-export-options/` | Demonstrates video export configuration on a video editor |
| html5-ads-exporter | `starter-kits/html5-ads-exporter/` | Design editor that exports HTML5 banner ads |
| video-captions | `starter-kits/video-captions/` | Video editor with auto-caption generation and styling |
| video-animations | `starter-kits/video-animations/` | Video editor showcasing keyframe animations |
| ai-editor | `starter-kits/ai-editor/` | AI-powered design, photo, and video editing with provider integration |
| automated-resizing | `starter-kits/automated-resizing/` | Content-aware automated resizing across social-media formats |
| automatic-design-generation | `starter-kits/automatic-design-generation/` | Programmatic generation of social-media assets from data |
| batch-image-generation | `starter-kits/batch-image-generation/` | Bulk image generation from a data source |
| multi-image-generation | `starter-kits/multi-image-generation/` | Generate multiple branded images from a single record |
| design-validation | `starter-kits/design-validation/` | Editor that runs design-validation rules and surfaces feedback |
| content-moderation | `starter-kits/content-moderation/` | Editor with a content-moderation pipeline |
| version-history | `starter-kits/version-history/` | Editor with snapshot-based version history |
| theming | `starter-kits/theming/` | Editor with custom theme tokens and color palette |
| translation-internationalization | `starter-kits/translation-internationalization/` | Editor with dynamic locale switching |

### Scaffolding a New Project

1. **Copy** the appropriate starter kit directory into the user's project directory
2. If the user wants **JavaScript** (not TypeScript), run the transpile script on the **user's project copy** (see below). Never run it on the bundled starter kit source
3. Update `package.json` name and adjust dependencies as needed
4. **Pin CE.SDK packages to v1.76.1** (required — ensures runtime matches this skill's bundled docs). In the kit's `package.json`, every `@cesdk/*` and `@imgly/*` dependency set to `"latest"` must be installed at the pinned version — **except** for packages with independent release cycles (see skip list below):
   \`\`\`bash
   # Inspect package.json, then for each @cesdk/* or @imgly/* dep with value "latest"
   # (and not in the skip list below):
   npm install <package-name>@1.76.1
   \`\`\`
   Example (if the kit has `"@cesdk/cesdk-js": "latest"`):
   \`\`\`bash
   npm install @cesdk/cesdk-js@1.76.1
   \`\`\`
   **Skip list — do NOT pin these packages to v1.76.1** (they have their own release schedules, their npm versions do NOT match CE.SDK versions, and pinning would resolve to a non-existent version):
   - `@imgly/background-removal`
   - `@imgly/background-removal-node`
   - `@imgly/html-exporter`
   - `@imgly/idml-importer`
   - `@imgly/pptx-importer`
   - `@imgly/psd-importer`

   For these, install without a version suffix (e.g. `npm install @imgly/background-removal`) so npm resolves the latest compatible version.
   Also leave dependencies with explicit versions (e.g. `"^1.4.5"`) untouched.
5. Run `npm install` to install remaining dependencies, then `npm run dev` to start the dev server
6. Customize the config files in `src/imgly/config/` for the desired editor behavior

Access kit files with Glob: `**/skills/build/starter-kits/{kit-name}/**`

**Important**: Starter kits are always TypeScript. For TypeScript projects, copy and use as-is. For JavaScript projects, copy first, then transpile the copy. Never modify the bundled starter kit files directly.

### Converting a Copied Starter Kit to JavaScript

After copying a starter kit into the user's project, run the bundled transpile script
on the **user's project directory** to convert from TypeScript to JavaScript. The script
strips type annotations, renames `.ts` files to `.js`, removes `tsconfig.json`/`tsconfig.base.json`,
updates `index.html` references, and cleans TypeScript dependencies from `package.json`.

\`\`\`bash
# 1. Install typescript temporarily (needed by the transpile script)
cd /path/to/users/project && npm install --no-save typescript

# 2. Run the transpile script on the user's project (NOT on the starter kit source)
node <path-to-skill>/scripts/transpile-to-js.mjs /path/to/users/project
\`\`\`

The script path is: `**/skills/build/scripts/transpile-to-js.mjs`

**Never run the transpile script on the starter kit source directory.** Always copy the kit first, then transpile the copy.

**Do not manually rewrite or convert files by hand.** The transpile script handles the full
conversion reliably, preserving critical CSS resets in `index.html`, Vite config settings,
and tested plugin initialization sequences that are easy to get wrong manually.

## Additional Triggers

Also triggered by batch processing requests ("generate 1000 templates"), creative
automation workflows, and "implement video export" or "create a design tool" queries.

## Related Skills

- Use \`/cesdk:docs-{framework}\` to look up documentation and API reference (e.g. `/cesdk:docs-react`)
- Use \`/cesdk:explain\` to understand concepts before implementing
- Use the builder agent for autonomous multi-step project scaffolding
