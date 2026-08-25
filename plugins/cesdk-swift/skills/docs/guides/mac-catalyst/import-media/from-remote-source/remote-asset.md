> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [Import Remote Asset](./remote-asset.md)

---

```swift file=@cesdk_swift_examples/engine-guides-remote-asset/RemoteAsset.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func remoteAsset(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Base URL where the asset files are hosted. In production this is your CDN or
  // server; substitute your own base URL here.
  let baseURL = try engine.guidesBaseURL

  let imageSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("ly.img.image/content.json"),
  )
  print("Loaded source:", imageSourceID)

  let absoluteImageURL = baseURL
    .appendingPathComponent("ly.img.image/images/sample_1.jpg")
    .absoluteString
  let manifestJSON = """
  {
    "version": "2.0.0",
    "id": "my.remote.images",
    "assets": [
      {
        "id": "sample_image",
        "label": { "en": "Sample Image" },
        "meta": {
          "uri": "\(absoluteImageURL)",
          "thumbUri": "\(absoluteImageURL)",
          "blockType": "//ly.img.ubq/graphic",
          "fillType": "//ly.img.ubq/fill/image",
          "mimeType": "image/jpeg"
        }
      }
    ]
  }
  """
  let stringSourceID = try engine.asset.addLocalAssetSourceFromJSON(manifestJSON)
  print("Loaded source:", stringSourceID)

  let hostedManifest = """
  {
    "version": "2.0.0",
    "id": "my.remote.images.hosted",
    "assets": [
      {
        "id": "sample_image",
        "label": { "en": "Sample Image" },
        "meta": {
          "uri": "{{base_url}}/ly.img.image/images/sample_1.jpg",
          "thumbUri": "{{base_url}}/ly.img.image/images/sample_1.jpg",
          "blockType": "//ly.img.ubq/graphic",
          "fillType": "//ly.img.ubq/fill/image",
          "mimeType": "image/jpeg"
        }
      }
    ]
  }
  """
  let hostedSourceID = try engine.asset.addLocalAssetSourceFromJSON(
    hostedManifest,
    basePath: baseURL.absoluteString,
  )
  print("Loaded source:", hostedSourceID)

  let results = try await engine.asset.findAssets(
    sourceID: "my.remote.images",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  print("Found assets:", results.total)

  let hostedAssets = try await engine.asset.findAssets(
    sourceID: "my.remote.images.hosted",
    query: .init(query: nil, page: 0, perPage: 10),
  )
  if let asset = hostedAssets.assets.first {
    let blockID = try await engine.asset.apply(sourceID: "my.remote.images.hosted", assetResult: asset)
    print("Applied asset to block:", blockID as Any)
  }

  let sources = engine.asset.findAllSources()
  print("Registered sources:", sources)

  try engine.asset.removeSource(sourceID: "my.remote.images")

  do {
    let sourceID = try engine.asset.addLocalAssetSourceFromJSON("{ not valid json }")
    print("Loaded source:", sourceID)
  } catch {
    print("Failed to load asset source:", error.localizedDescription)
  }
}

// Compile-only variant showing the URL overload with a fully-qualified remote
// URL. The test above runs `remoteAsset` against the bundled sample assets; this
// function is here to illustrate how the same call looks against a CDN.
@MainActor
func remoteAssetFromRemoteServer(engine: Engine) async throws {
  let baseURL = URL(string: "https://cdn.example.com/assets")!
  let sourceID = try await engine.asset.addLocalAssetSourceFromJSON(
    baseURL.appendingPathComponent("my-source/content.json"),
  )
  print("Loaded source:", sourceID)
}
```

Load asset definitions from remote JSON files hosted on a CDN or server into CE.SDK's asset library.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/engine-guides-remote-asset)

<EngineReferenceNote {...props} />

Remote asset loading lets you host asset definitions on a CDN or server and load them into CE.SDK at runtime. This keeps asset management separate from your app, so you can update the available assets without shipping a new build. `engine.asset.addLocalAssetSourceFromJSON(_:)` loads a manifest from a URL, and the string overload loads one you already have in memory.

## Setup

Create a scene and a page so there is something to apply assets to.

```swift highlight-remoteAsset-setup
let scene = try engine.scene.create()
let page = try engine.block.create(.page)
try engine.block.setWidth(page, value: 800)
try engine.block.setHeight(page, value: 600)
try engine.block.appendChild(to: scene, child: page)
```

## JSON Manifest Structure

A manifest declares a `version`, a source `id`, and an `assets` array. Each asset carries an `id`, localized labels, and a `meta` object with the URIs and block type.

```json
{
  "version": "2.0.0",
  "id": "my.remote.images",
  "assets": [
    {
      "id": "sample_image",
      "label": { "en": "Sample Image" },
      "meta": {
        "uri": "{{base_url}}/images/sample.jpg",
        "thumbUri": "{{base_url}}/thumbnails/sample.jpg",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/jpeg"
      }
    }
  ]
}
```

The `id` becomes the asset source identifier you pass to every other Asset API call. Each asset's `meta` holds the full-size `uri`, the `thumbUri`, the `blockType` to create when applied, the `fillType` to attach, and the `mimeType`. The `{{base_url}}` placeholder resolves against the manifest's location or a base path you provide.

## Loading Assets from a Remote URL

Pass the manifest's URL to the async `addLocalAssetSourceFromJSON(_:)` overload. It fetches and parses the file and returns the source ID from the manifest's `id` field. CE.SDK resolves `{{base_url}}` placeholders against the manifest's parent directory. Here `baseURL` is the location where your asset files are hosted.

```swift highlight-remoteAsset-loadFromURL
let imageSourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("ly.img.image/content.json"),
)
print("Loaded source:", imageSourceID)
```

In production you pass a fully-qualified URL pointing at your CDN or server:

```swift highlight-remoteAsset-remoteServer
let baseURL = URL(string: "https://cdn.example.com/assets")!
let sourceID = try await engine.asset.addLocalAssetSourceFromJSON(
  baseURL.appendingPathComponent("my-source/content.json"),
)
print("Loaded source:", sourceID)
```

## Loading Assets from a JSON String

When you already have the manifest content — for example from an API response or a configuration value — use the synchronous string overload. When the manifest contains absolute URLs, no base path is needed.

```swift highlight-remoteAsset-loadFromString
let absoluteImageURL = baseURL
  .appendingPathComponent("ly.img.image/images/sample_1.jpg")
  .absoluteString
let manifestJSON = """
{
  "version": "2.0.0",
  "id": "my.remote.images",
  "assets": [
    {
      "id": "sample_image",
      "label": { "en": "Sample Image" },
      "meta": {
        "uri": "\(absoluteImageURL)",
        "thumbUri": "\(absoluteImageURL)",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/jpeg"
      }
    }
  ]
}
"""
let stringSourceID = try engine.asset.addLocalAssetSourceFromJSON(manifestJSON)
print("Loaded source:", stringSourceID)
```

## Customizing the Base Path

When the manifest uses `{{base_url}}` placeholders for relative paths, pass a `basePath` so CE.SDK can resolve them against your hosting location.

```swift highlight-remoteAsset-basePath
let hostedManifest = """
{
  "version": "2.0.0",
  "id": "my.remote.images.hosted",
  "assets": [
    {
      "id": "sample_image",
      "label": { "en": "Sample Image" },
      "meta": {
        "uri": "{{base_url}}/ly.img.image/images/sample_1.jpg",
        "thumbUri": "{{base_url}}/ly.img.image/images/sample_1.jpg",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "mimeType": "image/jpeg"
      }
    }
  ]
}
"""
let hostedSourceID = try engine.asset.addLocalAssetSourceFromJSON(
  hostedManifest,
  basePath: baseURL.absoluteString,
)
print("Loaded source:", hostedSourceID)
```

## Verifying Loaded Assets

Call `findAssets(sourceID:query:)` to query a loaded source. This confirms the manifest was parsed and the assets are available.

```swift highlight-remoteAsset-verify
let results = try await engine.asset.findAssets(
  sourceID: "my.remote.images",
  query: .init(query: nil, page: 0, perPage: 10),
)
print("Found assets:", results.total)
```

## Applying Remote Assets

Use `apply(sourceID:assetResult:)` to add an asset from a loaded source to the scene. The engine downloads the underlying media when it is needed and returns the ID of the created block.

```swift highlight-remoteAsset-apply
let hostedAssets = try await engine.asset.findAssets(
  sourceID: "my.remote.images.hosted",
  query: .init(query: nil, page: 0, perPage: 10),
)
if let asset = hostedAssets.assets.first {
  let blockID = try await engine.asset.apply(sourceID: "my.remote.images.hosted", assetResult: asset)
  print("Applied asset to block:", blockID as Any)
}
```

## Listing Asset Sources

Call `findAllSources()` to list the IDs of every registered asset source.

```swift highlight-remoteAsset-listSources
let sources = engine.asset.findAllSources()
print("Registered sources:", sources)
```

## Removing Asset Sources

Call `removeSource(sourceID:)` to remove a source you no longer need, freeing its assets from memory.

```swift highlight-remoteAsset-removeSource
try engine.asset.removeSource(sourceID: "my.remote.images")
```

## Error Handling

These methods throw on failure. The URL overload can fail on network errors or a missing file; both overloads fail on malformed JSON. Wrap calls in a `do`/`catch` block to handle these cases.

```swift highlight-remoteAsset-errorHandling
do {
  let sourceID = try engine.asset.addLocalAssetSourceFromJSON("{ not valid json }")
  print("Loaded source:", sourceID)
} catch {
  print("Failed to load asset source:", error.localizedDescription)
}
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalAssetSourceFromJSON(_:)` | Load asset definitions from a JSON file URL. Returns the source ID. |
| `engine.asset.addLocalAssetSourceFromJSON(_:basePath:)` | Load asset definitions from a JSON string, resolving `{{base_url}}` placeholders against `basePath`. Returns the source ID. |
| `engine.asset.findAssets(sourceID:query:)` | Query the assets in a loaded source. |
| `engine.asset.apply(sourceID:assetResult:)` | Apply an asset to the scene, creating a block. |
| `engine.asset.findAllSources()` | List the IDs of all registered asset sources. |
| `engine.asset.removeSource(sourceID:)` | Remove a loaded asset source. |

## Next Steps

- [Assets](../../concepts/assets.md) — How asset sources and assets fit together.
- [Serve Assets From Your Server](../../serve-assets.md) — Host the asset files behind a manifest on your own server or CDN.
- [Integrate Unsplash Stock Images](./unsplash.md) — See a complete custom `AssetSource` implementation backed by a remote API.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support