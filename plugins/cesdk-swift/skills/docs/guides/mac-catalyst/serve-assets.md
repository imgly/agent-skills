> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Serve Assets](./serve-assets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-serve-assets/ServeAssets.swift reference-only
import Foundation
import IMGLYEngine

private let serveAssetsDefaultSourceIDs = [
  "ly.img.sticker",
  "ly.img.vector.shape",
  "ly.img.filter",
  "ly.img.color.palette",
  "ly.img.effect",
  "ly.img.blur",
  "ly.img.typeface",
  "ly.img.crop.presets",
  "ly.img.page.presets",
  "ly.img.text",
  "ly.img.text.styles",
  "ly.img.text.curves",
  "ly.img.text.components",
]

private let serveAssetsDemoSourceIDs = [
  "ly.img.image",
  "ly.img.video",
  "ly.img.audio",
  "ly.img.templates",
  "ly.img.templates.premium",
]

@MainActor
func serveAssets(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  for id in serveAssetsDefaultSourceIDs {
    _ = try await engine.asset.addLocalAssetSourceFromJSON(
      baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
    )
  }

  try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
}

// Register the sample content sources (images, videos, audio, templates). These
// ship in the same archive and load the same way — replace them with your own
// content sources in production.
@MainActor
func serveAssetsSampleContent(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  for id in serveAssetsDemoSourceIDs {
    _ = try await engine.asset.addLocalAssetSourceFromJSON(
      baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
    )
  }
}

// Variations showing where to host the assets. These are compile-only
// demonstrations — the test runs `serveAssets` against the bundled assets.

@MainActor
func serveAssetsFromRemoteServer(engine: Engine) async throws {
  let baseURL = URL(string: "https://cdn.your.custom.domain/assets")!
  for id in serveAssetsDefaultSourceIDs {
    _ = try await engine.asset.addLocalAssetSourceFromJSON(
      baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
    )
  }
}

@MainActor
func serveAssetsFromAppBundle(engine: Engine) async throws {
  guard let baseURL = Bundle.main.url(forResource: "IMGLYAssets", withExtension: "bundle") else {
    return
  }
  for id in serveAssetsDefaultSourceIDs {
    _ = try await engine.asset.addLocalAssetSourceFromJSON(
      baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
    )
  }
}
```

Configure the Creative Engine to load its asset sources from your own server or app bundle instead of the IMG.LY CDN.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-serve-assets)

<EngineReferenceNote {...props} />

The engine serves all assets from the IMG.LY CDN by default, which is convenient while you are getting started. For production you should serve them from your own location so your app doesn't depend on the IMG.LY CDN at runtime — it gives you control over performance and availability and keeps you within your own compliance boundary.

## Download the Assets

The assets are versioned alongside the SDK, so always download the archive that matches your engine version — content from a different version may not be compatible. Asset versions are platform-specific: the iOS and Android archives are usually aligned, but the web SDK can move at a different pace, so download from the `cesdk-swift` path that matches your engine version.

[Download Assets (v1.83.0-nightly.20260831)](https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260831/imgly-assets.zip)

Or download and extract it from the command line:

```bash
curl -O https://cdn.img.ly/packages/imgly/cesdk-swift/1.83.0-nightly.20260831/imgly-assets.zip
unzip imgly-assets.zip -d IMGLYAssets.bundle
```

The archive contains one `ly.img.*` directory per asset source, the `fonts/` and `emoji/` directories, and thumbnail directories such as `ly.img.animation` that serve preview images for the engine's built-in animation presets. Those thumbnail directories have no `content.json` and aren't registered as asset sources — keep them at your `baseURL` so the previews resolve. To ship the assets inside your app, add the extracted `.bundle` folder to your app target — this produces a nested `Bundle` your app can resolve at runtime. Alternatively, upload the extracted folders to your own server or CDN to serve them remotely.

## Register the Default Asset Sources

Each asset source is described by a `content.json` manifest. Register a source by pointing `engine.asset.addLocalAssetSourceFromJSON(_:)` at its manifest URL; the engine resolves the asset files relative to that URL. Loop over the default source IDs and load each manifest from a single `baseURL` that points at your asset location:

```swift highlight-serveAssets-defaultSourceIDs
private let serveAssetsDefaultSourceIDs = [
  "ly.img.sticker",
  "ly.img.vector.shape",
  "ly.img.filter",
  "ly.img.color.palette",
  "ly.img.effect",
  "ly.img.blur",
  "ly.img.typeface",
  "ly.img.crop.presets",
  "ly.img.page.presets",
  "ly.img.text",
  "ly.img.text.styles",
  "ly.img.text.curves",
  "ly.img.text.components",
]
```

```swift highlight-serveAssets-registerDefaults
for id in serveAssetsDefaultSourceIDs {
  _ = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
  )
}
```

`baseURL` points at your hosting location — set it to your own server or app bundle as shown below. The default sources are:

- `ly.img.sticker` — Stickers.
- `ly.img.vector.shape` — Shapes and arrows.
- `ly.img.filter` — LUT and duotone color filters.
- `ly.img.color.palette` — Default color palette.
- `ly.img.effect` — Effects.
- `ly.img.blur` — Blurs.
- `ly.img.typeface` — Typefaces.
- `ly.img.crop.presets` — Crop presets.
- `ly.img.page.presets` — Page resize presets.
- `ly.img.text`, `ly.img.text.styles`, `ly.img.text.curves` — Text style presets.
- `ly.img.text.components` — Text design component library.

## Register Sample Content Sources

The archive also ships sample content — images, videos, audio, and templates — registered the same way. These are meant for development and prototyping; replace them with your own content sources in production.

```swift highlight-serveAssets-demoSourceIDs
private let serveAssetsDemoSourceIDs = [
  "ly.img.image",
  "ly.img.video",
  "ly.img.audio",
  "ly.img.templates",
  "ly.img.templates.premium",
]
```

```swift highlight-serveAssets-registerDemo
for id in serveAssetsDemoSourceIDs {
  _ = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
  )
}
```

The sample content sources are:

- `ly.img.image` — Sample images.
- `ly.img.video` — Sample videos.
- `ly.img.audio` — Sample audio.
- `ly.img.templates` — Sample design templates.
- `ly.img.templates.premium` — Premium sample design templates.

## Point the Base URL at Your Assets

Set `baseURL` to wherever you copied the assets, then register the sources exactly as above.

For assets on your own server or CDN, use an absolute URL pointing at the folder that contains the per-source directories:

```swift highlight-serveAssets-remoteBaseURL
let baseURL = URL(string: "https://cdn.your.custom.domain/assets")!
for id in serveAssetsDefaultSourceIDs {
  _ = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
  )
}
```

For assets bundled with your app, resolve the `.bundle` URL you added to your app target:

```swift highlight-serveAssets-bundleBaseURL
guard let baseURL = Bundle.main.url(forResource: "IMGLYAssets", withExtension: "bundle") else {
  return
}
for id in serveAssetsDefaultSourceIDs {
  _ = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
  )
}
```

## Customize Which Assets Load

To register only a subset of a source's assets, pass ID patterns to the `matcher:` parameter of `addLocalAssetSourceFromJSON(_:matcher:)`. Patterns support the `*` wildcard, and an asset is included if it matches any pattern — for example, `matcher: ["ly.img.sticker.emoji.*"]` registers only the emoji stickers.

For deeper changes — curating your own collection, renaming assets, or adjusting their metadata — edit the `content.json` manifests directly. See the [Asset Content JSON Schema](./import-media/content-json-schema.md) guide for the manifest format.

## Configure Engine-Level Assets

The engine also loads font fallback files (for Unicode character coverage) and the emoji font separately from the asset sources. Point the `basePath` setting at your location so they load from there too:

```swift highlight-serveAssets-engineLevelAssets
try engine.editor.setSettingString("basePath", value: baseURL.absoluteString)
```

This setting affects:

- **Font fallback files** — Used when text contains characters not covered by the selected font. Located at `{basePath}/fonts/font-{index}.ttf`.
- **Emoji font** — The default emoji font (`NotoColorEmoji.ttf`). Located at `{basePath}/emoji/NotoColorEmoji.ttf`.

Both the `fonts/` and `emoji/` directories are included in the `imgly-assets.zip` download, so once the assets are at your `basePath` location the engine resolves them automatically.

> **Note:** On iOS, when you embed the prebuilt editor UI, pass your `baseURL` to `EngineSettings` instead of setting `basePath` yourself. The editor initializes the engine's `basePath` from it before running the `onCreate` callback, where you register the asset sources shown above.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalAssetSourceFromJSON(_:matcher:)` | Register an asset source by loading its `content.json` manifest from a URL. Pass `matcher` ID patterns to filter which assets load. Returns the source ID. |
| `engine.editor.setSettingString("basePath", value:)` | Set the base URL for font fallback files and the emoji font. |

## Next Steps

- Configuration — Pass `baseURL` to `EngineSettings` so the editor initializes `basePath` for you before `onCreate` runs.
- [Assets](./concepts/assets.md) — How asset sources and assets fit together.
- [Insert Shapes or Stickers](./insert-media/shapes-or-stickers.md) — Query and apply assets from a registered source.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support