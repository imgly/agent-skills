> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Plugins](./plugins.md) > [Perfectly Clear](./plugins/perfectly-clear.md)

---

In this guide, you'll learn how to integrate the Perfectly Clear plugin into a CE.SDK editor. The `@imgly/plugin-perfectlyclear-web` plugin adds a one-click Enhance button that runs Perfectly Clear's (eyeQ) scene-aware correction pipeline — scene detection, skin-tone correction, AI color, dynamic range, noise reduction — entirely in the browser via WebAssembly. No image data leaves the client.

![Perfectly Clear starter kit showing a design editor with a portrait image ready for enhancement](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-perfectlyclear-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://img.ly/docs/cesdk/examples/starterkit-perfectlyclear-editor/)

The plugin registers an Enhance button component for every CE.SDK shell location (canvas menu, dock, inspector bar, navigation bar, canvas bar) but does not auto-insert into any order. You decide where the button appears by adding its component ID to the relevant component order. The runnable example linked above is a full editor with the plugin wired into the canvas menu — open it to see the integration end-to-end.

## What the User Sees

When a block with an image fill is selected, an "Enhance" entry appears in whichever shell location you wired the button to. Clicking it puts the block into a pending state while the WebAssembly runtime processes the image, then writes the enhanced result back to the same block. The change is staged into CE.SDK's standard undo stack, so users can revert with ⌘Z. Mixed selections and non-image blocks hide the button.

## Setting Up the Plugin

Registering the plugin is a two-step pattern: pass it to `cesdk.addPlugin()`, then insert its button component into the shell location order. The plugin's deliberate decision not to auto-insert keeps placement in your hands — you choose which surface (canvas menu, dock, inspector bar, navigation bar, or canvas bar) hosts the Enhance button.

### Install the Plugin

The plugin is versioned in lockstep with `@cesdk/cesdk-js`. Pin both to the same version:

```bash
npm install @cesdk/cesdk-js@$UBQ_VERSION$ @imgly/plugin-perfectlyclear-web@$UBQ_VERSION$
```

### Register the Plugin

Pass your Perfectly Clear (eyeQ) API key to the factory. The key must be authorized for the page's origin — Perfectly Clear validates the page hostname against its certificate endpoint at runtime.

```typescript
import PerfectlyClearPlugin from '@imgly/plugin-perfectlyclear-web';

await cesdk.addPlugin(
  PerfectlyClearPlugin({ apiKey: 'YOUR_PFC_API_KEY' })
);
```

If `apiKey` is missing or empty, the factory throws synchronously and `addPlugin` rejects. The plugin never registers and the Enhance button never appears, so always confirm the key is present at runtime (a common cause is an undefined `import.meta.env.VITE_PFC_API_KEY` after build-time env stripping).

### Insert the Enhance Button into a Component Order

Prepend the button's component ID to the shell location order. For the canvas menu, use `setComponentOrder` qualified to `editMode: 'Transform'` — that's the order the design-editor's canvas menu actually consults when a block is selected. The deprecated `setCanvasMenuOrder` writes a different, unqualified order that the qualified Transform order shadows, so your button would never render.

```typescript
const location = {
  in: 'ly.img.canvas.menu',
  when: { editMode: 'Transform' }
} as const;

cesdk.ui.setComponentOrder(location, [
  '@imgly/plugin-perfectlyclear-web.canvasMenu',
  ...cesdk.ui.getComponentOrder(location)
]);
```

The same pattern works for the other shell locations. Here are the component IDs for each:

| Shell location | Component ID                                            |
| -------------- | ------------------------------------------------------- |
| Canvas menu    | `@imgly/plugin-perfectlyclear-web.canvasMenu`           |
| Dock           | `@imgly/plugin-perfectlyclear-web.dock`                 |
| Inspector bar  | `@imgly/plugin-perfectlyclear-web.inspectorBar`         |
| Navigation bar | `@imgly/plugin-perfectlyclear-web.navigationBar`        |
| Canvas bar     | `@imgly/plugin-perfectlyclear-web.canvasBar`            |

The plugin also exports `PLUGIN_ID` as a string constant. Use `` `${PLUGIN_ID}.canvasMenu` `` if you prefer not to hard-code the namespace.

## Self-Hosting the Runtime Assets

The plugin lazy-loads the Perfectly Clear runtime (`pfc.mjs`, `pfc.wasm`, worker JS, the ONNX runtime, model files, and the scene preset) from a CDN at runtime. The asset tree is roughly 170 MB and is never bundled into the plugin. The default `baseURL` points at the IMG.LY CDN, which is convenient for prototyping. Production integrations should self-host so the runtime is served alongside your editor under your own caching and uptime policies.

### Override `baseURL`

Point `baseURL` at a directory mirroring the layout in the plugin's README. The directory must contain `pfc.mjs`, `pfc.wasm`, `image.worker.js`, `inference.worker.js`, the `ort-wasm/` directory, the `models/` directory, and `presets/sd.preset`.

```typescript
await cesdk.addPlugin(
  PerfectlyClearPlugin({
    apiKey: 'YOUR_PFC_API_KEY',
    baseURL: 'https://cdn.your-domain.com/pfc/v1/'
  })
);
```

### Required Response Headers

Perfectly Clear spawns blob-URL workers (opaque origin) that re-fetch the runtime assets cross-origin. Each asset needs the full cross-origin header set plus a correct `Content-Type` — a common CDN default of `application/octet-stream` for `.wasm` files breaks streaming compilation in the browser.

| Header                                | Required value                                  | Why                                                                              |
| ------------------------------------- | ----------------------------------------------- | -------------------------------------------------------------------------------- |
| `Access-Control-Allow-Origin`         | `*` or the editor's origin                      | Lets the editor and its blob workers fetch the asset cross-origin                |
| `Access-Control-Allow-Methods`        | `GET, HEAD, OPTIONS`                            | Lets preflighted requests for ranged or HEAD reads succeed                       |
| `Access-Control-Allow-Headers`        | `Content-Type, Range, If-Match, If-None-Match`  | Lets preflight pass for range requests and conditional fetches                   |
| `Cross-Origin-Resource-Policy`        | `cross-origin`                                  | Lets blob-URL workers (opaque origin) embed the asset                            |
| `Content-Type` (`.wasm`)              | `application/wasm`                              | Required for `WebAssembly.instantiateStreaming()` to accept the response         |
| `Content-Type` (`.mjs`)               | `text/javascript`                               | Required for `import()` of the runtime module to evaluate as JavaScript          |
| `Content-Type` (`.pnn`)               | `application/octet-stream`                      | Default for binary model files; any binary MIME other than `text/*` works        |
| `Content-Type` (`.preset`)            | `text/plain`                                    | The scene preset is parsed as text                                               |
| `Timing-Allow-Origin` *(optional)*    | `*`                                             | Exposes Resource Timing details for performance debugging across origins         |

## Configuration Reference

The plugin factory accepts a single configuration object:

| Property           | Type      | Required | Default                             | Purpose                                                                       |
| ------------------ | --------- | -------- | ----------------------------------- | ----------------------------------------------------------------------------- |
| `apiKey`           | `string`  | Yes      | —                                   | Perfectly Clear (eyeQ) client API key; must be authorized for the host origin |
| `baseURL`          | `string`  | No       | IMG.LY CDN                          | Base URL for the Perfectly Clear runtime assets; must be CORS-enabled         |
| `certificateURL`   | `string`  | No       | Perfectly Clear production endpoint | Endpoint that validates the WASM license against the page hostname            |
| `numWorkers`       | `number`  | No       | `4`                                 | Number of image-processing worker threads spawned by the engine               |
| `cacheCertificate` | `boolean` | No       | `true`                              | Cache the WASM certificate in `localStorage`                                  |

## Troubleshooting

| Issue                                    | Cause / Fix                                                                                                                                                            |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Enhance button never appears             | Component ID not inserted into the order, `apiKey` empty at build time (`addPlugin` threw — check the console), or the key is not authorized for the current host.     |
| Enhance button inserted but hidden       | A qualified order (e.g. canvas menu under `editMode: 'Transform'`) is shadowing the unqualified order. Use `setComponentOrder` with the matching qualifier.            |
| Certificate validation error             | The API key is not authorized for `location.hostname`. Bind the key to every origin you ship from (production, staging, local dev) in the Perfectly Clear dashboard.   |
| Worker boot fails with CORS error        | Missing `Access-Control-Allow-Origin` or `Cross-Origin-Resource-Policy: cross-origin` on the CDN, or wrong `Content-Type` on `.wasm` / `.mjs` files.                   |
| Slow first enhancement                   | Runtime and models download on first use. Cache the asset bundle behind long-lived caching headers and reuse the cached WASM certificate via `cacheCertificate: true`. |

## Complete Example

The [Perfectly Clear starter kit](https://github.com/imgly/starterkit-perfectlyclear-editor-ts-web) is a runnable demo of the integration in this guide. It boots a design editor preloaded with an enhancement-ready scene, registers the plugin with an API key from `VITE_PFC_API_KEY`, and wires the Enhance button into the Transform-mode canvas menu. The wire-up lives in `src/imgly/plugins/perfectly-clear.ts` — that's the file to copy when you integrate the plugin into your own editor.



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support