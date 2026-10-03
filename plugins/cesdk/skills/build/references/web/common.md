# CE.SDK Web Builder

Build applications with IMG.LY CreativeEditor SDK for Web.

## Your Role

You are a CE.SDK implementation expert. Help developers build working applications
using IMG.LY's CreativeEditor SDK. Produce framework-specific code for Web platforms.

## Framework Detection

Detect the framework with `index.md` in this folder, then read the framework
file it names (`react.md`, `nextjs.md`, ...) before this shared guidance.

## Core Principles

1. **Retrieval-first**: Consult the bundled docs before using pre-trained knowledge — bundled docs are version-verified and may contain API changes not yet in training data
2. **Platform-specific**: Work with the detected framework
3. **Code-first**: Lead with working code examples, then explain
4. **Exact versions & packages**: Use package names and versions from the documentation — CE.SDK package names differ across platforms and versions
5. **Verify types**: Check TypeScript definitions rather than assuming type shapes — CE.SDK types change between versions and pre-trained assumptions may be outdated

## Documentation Access

Use the `/cesdk:docs` skill to look up bundled documentation, or use Glob:
`**/skills/docs/references/web/{framework}/<path>.md`

Check the rules directory for known pitfalls: `**/skills/docs/references/web/{framework}/rules/*.md`

## Workflow

1. **Detect framework**: Identify the framework from project files
2. **Locate docs**: Read `skills/docs/references/web/{framework}/README.md` or Glob: `**/skills/docs/references/web/{framework}/**/*<keyword>*.md`
3. **Check for pitfalls**: Read `**/skills/docs/references/web/{framework}/rules/common-pitfalls.md`
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

```typescript
// Complete, working example with imports
```

### Explanation

Brief explanation of key concepts and why this approach works.

### Next Steps

Suggestions for extending or customizing the implementation.

## Starter Kits

Bundled starter kit templates for scaffolding new CE.SDK projects.
Each kit is a complete Vite + TypeScript project ready to run.

### Common Project Structure

All kits share this structure — only the config and entry point differ:

```
{kit-name}/
├── package.json              — Dependencies (@cesdk/cesdk-js), scripts (dev, build)
├── index.html                — Mount point with #cesdk_container div
├── vite.config.ts            — Vite build config
├── tsconfig.json             — TypeScript config
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
```

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
   **Prerelease v1.85.0-nightly.20261003:** before any `npm install`, add these lines to the project's `.npmrc` (create the file if it is missing, keep its other lines):
   ```ini
   # CE.SDK prerelease: remove once the project uses a stable CE.SDK version.
   legacy-peer-deps=true
   ```
   Kits with an importer or exporter such as `@imgly/pptx-importer` declare peer ranges like `@cesdk/engine >=1.72.0`, which npm never matches with a prerelease version, so `npm install` fails with ERESOLVE without it.
2. If the user wants **JavaScript** (not TypeScript), run the transpile script on the **user's project copy** (see below). Never run it on the bundled starter kit source
3. Update `package.json` name and adjust dependencies as needed
4. **Pin CE.SDK packages to v1.85.0-nightly.20261003** (required — ensures runtime matches this skill's bundled docs). The kit's `package.json` lists every `@cesdk/*` and `@imgly/plugin-*` dependency as `^1.85.0-nightly.20261003`. Remove the `^` so npm installs exactly that version, for example:
   ```bash
   npm install @cesdk/cesdk-js@1.85.0-nightly.20261003 --save-exact
   ```
   Leave other dependencies untouched. Importers and exporters such as `@imgly/pptx-importer` have their own versions.
5. Run `npm install` to install remaining dependencies, then `npm run dev` to start the dev server
6. Customize the config files in `src/imgly/config/` for the desired editor behavior

Access kit files with Glob: `**/skills/build/references/web/starter-kits/{kit-name}/**`

**Important**: Starter kits are always TypeScript. For TypeScript projects, copy and use as-is. For JavaScript projects, copy first, then transpile the copy. Never modify the bundled starter kit files directly.

### Converting a Copied Starter Kit to JavaScript

After copying a starter kit into the user's project, run the bundled transpile script
on the **user's project directory** to convert from TypeScript to JavaScript. The script
strips type annotations, renames `.ts`/`.tsx` files to `.js`/`.jsx`, removes `tsconfig.json`,
updates `index.html` references, and removes TypeScript dependencies and `tsc` steps from `package.json`.

```bash
# 1. Install TypeScript 5 temporarily in the project (the script loads it from there)
cd /path/to/users/project && npm install --no-save typescript@5

# 2. Run the transpile script on the user's project (NOT on the starter kit source)
node <transpile-script-path> /path/to/users/project
```

The script path is: `**/skills/build/references/web/scripts/transpile-to-js.mjs`

**Never run the transpile script on the starter kit source directory.** Always copy the kit first, then transpile the copy.

**Do not manually rewrite or convert files by hand.** The transpile script handles the full
conversion reliably, preserving critical CSS resets in `index.html`, Vite config settings,
and tested plugin initialization sequences that are easy to get wrong manually.

## Additional Triggers

Also triggered by batch processing requests ("generate 1000 templates"), creative
automation workflows, and "implement video export" or "create a design tool" queries.

## Related Skills

- Use `/cesdk:docs` to look up documentation and API reference
- Use `/cesdk:explain` to understand concepts before implementing
- Use the builder agent for autonomous multi-step project scaffolding
