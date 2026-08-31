> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From IMG.LY Premium Assets](./imgly-premium-assets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-media-from-remote-source-imgly-premium-assets/ImglyPremiumAssets.swift reference-only
import Foundation
import IMGLYEngine

// A Decodable model matching the `content.json` manifest that ships with the
// IMG.LY premium asset package. Each template carries the design archive `uri`
// and a `thumbUri`, both using `{{base_url}}` placeholders so the package stays
// portable across hosting locations.
private struct PremiumTemplateManifest: Decodable {
  struct Template: Decodable {
    let id: String
    let label: [String: String]?
    let meta: [String: String]
  }

  let id: String
  let assets: [Template]
}

@MainActor
func imglyPremiumAssets(engine: Engine) async throws {
  // A design scene the premium templates apply into. In your app this is
  // whatever the user is currently editing.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  // Stand in for the hosted premium package so the example runs offline: save
  // the current scene to a real design archive under a per-template directory
  // that plays the role of your hosting location. In production this directory
  // is your server or CDN and already contains the extracted IMG.LY premium
  // package (its `content.json`, per-template design archives, and thumbnails).
  let hostingURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("premium-\(UUID().uuidString)", isDirectory: true)
  let templateDirURL = hostingURL.appendingPathComponent("modern-social-story", isDirectory: true)
  try FileManager.default.createDirectory(at: templateDirURL, withIntermediateDirectories: true)
  let archive = try await engine.scene.saveToArchive()
  try archive.write(to: templateDirURL.appendingPathComponent("design.zip"))
  let baseURL = hostingURL.absoluteString

  let manifestJSON = """
  {
    "version": "1.0",
    "id": "imgly-premium-templates",
    "assets": [
      {
        "id": "modern-social-story",
        "label": { "en": "Modern Social Media Story" },
        "meta": {
          "uri": "{{base_url}}/modern-social-story/design.zip",
          "thumbUri": "{{base_url}}/modern-social-story/thumbnail.jpg"
        }
      }
    ]
  }
  """
  let manifest = try JSONDecoder().decode(
    PremiumTemplateManifest.self,
    from: Data(manifestJSON.utf8),
  )

  try engine.asset.addLocalSource(sourceID: manifest.id, applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else {
      return nil
    }
    try await engine.scene.load(from: url)
    return nil
  })

  for template in manifest.assets {
    let resolvedMeta = template.meta.mapValues {
      $0.replacingOccurrences(of: "{{base_url}}", with: baseURL)
    }
    try engine.asset.addAsset(
      to: manifest.id,
      asset: AssetDefinition(id: template.id, meta: resolvedMeta, label: template.label),
    )
  }

  let templates = try await engine.asset.findAssets(
    sourceID: manifest.id,
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Premium templates available:", templates.total)

  if let first = templates.assets.first {
    let appliedBlock = try await engine.asset.apply(sourceID: manifest.id, assetResult: first)
    print("Applied template, resulting block:", appliedBlock as Any)
  }
}
```

Host IMG.LY's premium templates on your own infrastructure and integrate them
into CE.SDK's asset library alongside your other sources.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-rc.0/engine-guides-import-media-from-remote-source-imgly-premium-assets)

<EngineReferenceNote {...props} />

IMG.LY offers premium templates through downloadable asset archives. You host these templates on your own server or CDN and register them as a local asset source, so they appear in the asset library alongside every other source. Because each template is a self-contained design archive, the integration parses a manifest, registers a source with a custom apply callback that loads the archive, and resolves the manifest's hosting placeholders at runtime. Contact IMG.LY sales to purchase premium template packages.

## Prerequisites

Before integrating premium assets, ensure you have:

- The IMG.LY premium asset archive (contact sales to purchase).
- A server or CDN to host the extracted package.
- A working CE.SDK `Engine` with a loaded scene.

## Premium Asset Package Structure

The archive contains a `content.json` manifest and one directory per template. Each template directory holds three files: `asset.json` with the template's metadata, `thumbnail.jpg` for the asset library preview, and `design.zip` with the complete design and its bundled assets.

The manifest lists every template. Each asset's `meta.uri` points at its `design.zip` archive and `meta.thumbUri` at its preview. The `{{base_url}}` placeholder lets you host the package anywhere and resolve the location at runtime.

```json
{
  "version": "1.0",
  "id": "imgly-premium-templates",
  "assets": [
    {
      "id": "modern-social-story",
      "label": { "en": "Modern Social Media Story" },
      "meta": {
        "uri": "{{base_url}}/modern-social-story/design.zip",
        "thumbUri": "{{base_url}}/modern-social-story/thumbnail.jpg"
      }
    }
  ]
}
```

## Hosting Premium Assets

Upload the extracted package to your server or CDN so the `content.json`, each `design.zip`, and each thumbnail are reachable over HTTPS. The `baseURL` you configure points at the directory that holds the package; CE.SDK combines it with the paths from the manifest to fetch each resource. Serving the package over HTTPS keeps it accessible from the device, since Apple platforms block plaintext HTTP by default.

## Fetching and Parsing the Manifest

Model the manifest with a `Decodable` type that carries the source `id` and the array of template definitions.

```swift highlight-imglyPremium-model
// A Decodable model matching the `content.json` manifest that ships with the
// IMG.LY premium asset package. Each template carries the design archive `uri`
// and a `thumbUri`, both using `{{base_url}}` placeholders so the package stays
// portable across hosting locations.
private struct PremiumTemplateManifest: Decodable {
  struct Template: Decodable {
    let id: String
    let label: [String: String]?
    let meta: [String: String]
  }

  let id: String
  let assets: [Template]
}
```

Decode the manifest into that model. It is inline here so the example is self-contained; in production, fetch it from `<baseURL>/content.json` with `URLSession.shared.data(from:)` and decode the response.

```swift highlight-imglyPremium-manifest
let manifestJSON = """
{
  "version": "1.0",
  "id": "imgly-premium-templates",
  "assets": [
    {
      "id": "modern-social-story",
      "label": { "en": "Modern Social Media Story" },
      "meta": {
        "uri": "{{base_url}}/modern-social-story/design.zip",
        "thumbUri": "{{base_url}}/modern-social-story/thumbnail.jpg"
      }
    }
  ]
}
"""
let manifest = try JSONDecoder().decode(
  PremiumTemplateManifest.self,
  from: Data(manifestJSON.utf8),
)
```

The manifest's `id` becomes the asset source identifier you pass to every other Asset API call, and each template's `meta` holds the archive `uri` and the `thumbUri`.

## Creating the Asset Source

Register a local source with `addLocalSource(sourceID:applyAsset:)`. Premium templates are `.zip` design archives, so provide a custom `applyAsset` callback that loads each one with `engine.scene.load(from:)` instead of the default apply logic. The callback returns `nil` because loading an archive mutates the current scene rather than creating a new block.

```swift highlight-imglyPremium-source
try engine.asset.addLocalSource(sourceID: manifest.id, applyAsset: { [weak engine] asset in
  guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else {
    return nil
  }
  try await engine.scene.load(from: url)
  return nil
})
```

A local source suits a finite, known set of assets: the engine manages search and pagination for you, so you only supply the assets and the apply behavior. The `engine` reference is captured weakly because the source retains this callback for its lifetime.

## Processing and Adding Templates

For each template in the manifest, replace the `{{base_url}}` placeholder in every metadata value with your hosting location, then add the processed template to the source with `addAsset(to:asset:)`.

```swift highlight-imglyPremium-addTemplates
for template in manifest.assets {
  let resolvedMeta = template.meta.mapValues {
    $0.replacingOccurrences(of: "{{base_url}}", with: baseURL)
  }
  try engine.asset.addAsset(
    to: manifest.id,
    asset: AssetDefinition(id: template.id, meta: resolvedMeta, label: template.label),
  )
}
```

The engine stores each template and returns it from queries, in insertion order.

## Displaying Templates in the Asset Library

Once registered, the source's templates are available to the asset library. On iOS, you surface them in the editor by adding the source to a library category — the [Customize Asset Library](../asset-library/customize.md) guide walks through presenting a registered source and configuring category labels and panels.

## Applying a Template

Query the source to confirm the templates registered, then apply one. Applying runs the source's `applyAsset` callback, which loads the design archive and replaces the current scene — exactly what happens when a user taps a thumbnail in the asset library.

```swift highlight-imglyPremium-verify
let templates = try await engine.asset.findAssets(
  sourceID: manifest.id,
  query: .init(query: nil, page: 0, perPage: 10),
)
print("Premium templates available:", templates.total)
```

```swift highlight-imglyPremium-apply
if let first = templates.assets.first {
  let appliedBlock = try await engine.asset.apply(sourceID: manifest.id, assetResult: first)
  print("Applied template, resulting block:", appliedBlock as Any)
}
```

## Optimization

Deliver `design.zip` files and thumbnails through a CDN with long cache lifetimes so repeat loads stay fast. For paid content, protect the package behind signed URLs or token-based authentication so only authorized users can fetch the archives.

## Troubleshooting

- **Templates not applying** — Premium templates are `.zip` archives. Confirm the source's `applyAsset` callback loads them with `engine.scene.load(from:)` rather than relying on the default apply behavior.
- **Assets returning 404** — Verify the package is uploaded with the same directory layout the manifest expects, and that the resolved URLs match your hosting location, including the protocol and any path prefix.
- **Media not loading** — Serve the package over HTTPS, or configure an App Transport Security exception; Apple platforms block plaintext HTTP by default.
- **Manifest failing to decode** — Confirm the `content.json` structure matches your model, with the `id` and the `assets` array present and each asset carrying a `meta.uri`.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource(sourceID:applyAsset:)` | Register a local source with a custom apply callback for loading template archives. |
| `engine.asset.addAsset(to:asset:)` | Add a template definition to the local source. |
| `engine.scene.load(from:)` | Load a design archive, replacing the current scene. |
| `engine.asset.findAssets(sourceID:query:)` | Query a source for a page of templates. |
| `engine.asset.apply(sourceID:assetResult:)` | Apply a template, running the source's apply callback. |

## Next Steps

- [Integrate Unsplash Stock Images](./unsplash.md) — Stream royalty-free photos from a custom asset source.
- [Customize Asset Library](../asset-library/customize.md) — On iOS, present your registered sources in the asset library.
- [Serve Assets From Your Server](../../serve-assets.md) — Host CE.SDK's default and sample content on your own infrastructure.
- [Asset Concepts](../concepts.md) — Learn how asset sources and metadata fit together.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support