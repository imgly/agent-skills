> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Your Server](./your-server.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-media-from-remote-source-your-server/YourServer.swift reference-only
import Foundation
import IMGLYEngine

// A custom asset source backed by your backend. Implement the `AssetSource`
// protocol: expose a unique `id` and a `findAssets(queryData:)` method that
// returns paginated results. This example returns a fixed in-memory catalog so
// it runs without a network connection; `fetchAssetsFromBackend(...)` below
// shows the production shape that requests the same data from your API.
final class BackendAssetSource: NSObject, AssetSource {
  let id: String
  private let catalog: [AssetResult]

  var supportedMIMETypes: [String]? {
    nil
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  init(id: String) {
    self.id = id

    let image = AssetResult(
      id: "photo-1",
      label: "Mountain Landscape",
      tags: ["nature", "mountain", "landscape"],
      meta: [
        "uri": "https://cdn.example.com/assets/photo-1.jpg",
        "thumbUri": "https://cdn.example.com/thumbs/photo-1.jpg",
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "width": "1920",
        "height": "1080",
      ],
      context: .init(sourceID: id),
    )

    let video = AssetResult(
      id: "clip-1",
      label: "City Timelapse",
      tags: ["city", "timelapse"],
      meta: [
        "uri": "https://cdn.example.com/assets/clip-1.mp4",
        "thumbUri": "https://cdn.example.com/thumbs/clip-1.jpg",
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.video.rawValue,
        "duration": "12.5",
        "width": "1920",
        "height": "1080",
      ],
      context: .init(sourceID: id),
    )

    let audio = AssetResult(
      id: "track-1",
      label: "Ambient Loop",
      tags: ["ambient", "loop"],
      meta: [
        "uri": "https://cdn.example.com/assets/track-1.m4a",
        "thumbUri": "https://cdn.example.com/thumbs/track-1.jpg",
        "blockType": DesignBlockType.audio.rawValue,
        "mimeType": "audio/x-m4a",
        "duration": "30.0",
      ],
      context: .init(sourceID: id),
    )

    let sticker = AssetResult(
      id: "sticker-1",
      label: "Star Badge",
      tags: ["badge", "star"],
      meta: [
        "uri": "https://cdn.example.com/assets/sticker-1.png",
        "thumbUri": "https://cdn.example.com/thumbs/sticker-1.png",
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "kind": "sticker",
        "width": "512",
        "height": "512",
      ],
      context: .init(sourceID: id),
    )

    catalog = [image, video, audio, sticker]
    super.init()
  }

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let term = (queryData.query ?? "").lowercased()
    let matches = term.isEmpty ? catalog : catalog.filter { asset in
      (asset.label?.lowercased().contains(term) ?? false)
        || (asset.tags?.contains { $0.lowercased().contains(term) } ?? false)
    }

    let start = queryData.page * queryData.perPage
    let page = Array(matches.dropFirst(start).prefix(queryData.perPage))
    let hasMore = start + page.count < matches.count

    return AssetQueryResult(
      assets: page,
      currentPage: queryData.page,
      nextPage: hasMore ? queryData.page + 1 : -1,
      total: matches.count,
    )
  }
}

@MainActor
func yourServer(engine: Engine) async throws {
  let source = BackendAssetSource(id: "my-backend")
  try engine.asset.addSource(source)

  let results = try await engine.asset.findAssets(
    sourceID: source.id,
    query: .init(query: "", page: 0, perPage: 10),
  )
  print("Loaded \(results.assets.count) of \(results.total) assets from the backend source")

  try engine.asset.addLocalSource(sourceID: "my-backend-templates", applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else {
      return nil
    }
    try await engine.scene.applyTemplate(from: url)
    return nil
  })

  let template = AssetDefinition(
    id: "promo-card",
    meta: [
      "uri": "https://cdn.example.com/templates/promo-card.scene",
      "thumbUri": "https://cdn.example.com/thumbs/promo-card.jpg",
      "blockType": DesignBlockType.scene.rawValue,
    ],
    label: ["en": "Promo Card"],
  )
  try engine.asset.addAsset(to: "my-backend-templates", asset: template)

  let manifest = """
  {
    "version": "1.0.0",
    "id": "my-backend-stickers",
    "assets": [
      {
        "id": "star-badge",
        "label": { "en": "Star Badge" },
        "tags": { "en": ["badge", "star"] },
        "meta": {
          "uri": "{{base_url}}/stickers/star-badge.png",
          "thumbUri": "{{base_url}}/stickers/star-badge.png",
          "blockType": "//ly.img.ubq/graphic",
          "fillType": "//ly.img.ubq/fill/image",
          "kind": "sticker",
          "width": "512",
          "height": "512"
        }
      }
    ]
  }
  """
  let staticSourceID = try engine.asset.addLocalAssetSourceFromJSON(
    manifest,
    basePath: "https://cdn.example.com/assets",
  )
  print("Registered static source: \(staticSourceID)")
}

// MARK: - Fetching from your backend

// A Decodable model that matches the JSON your `/assets` endpoint returns.
private struct BackendAssetPage: Decodable {
  struct Item: Decodable {
    let id: String
    let label: String
    let uri: String
    let thumbUri: String
    let width: Int
    let height: Int
  }

  let assets: [Item]
  let total: Int
  let currentPage: Int
  let nextPage: Int?
}

// The production shape of `findAssets(queryData:)`: forward the query to your
// API, decode the response, and map each row into an `AssetResult`. Called from
// `BackendAssetSource.findAssets(queryData:)` in a real integration.
@MainActor
func fetchAssetsFromBackend(
  host: URL,
  sourceID: String,
  queryData: AssetQueryData,
) async throws -> AssetQueryResult {
  var components = URLComponents(
    url: host.appendingPathComponent("assets"),
    resolvingAgainstBaseURL: false,
  )!
  components.queryItems = [
    URLQueryItem(name: "query", value: queryData.query),
    URLQueryItem(name: "page", value: String(queryData.page)),
    URLQueryItem(name: "perPage", value: String(queryData.perPage)),
  ]

  var request = URLRequest(url: components.url!)
  request.setValue("Bearer YOUR_API_TOKEN", forHTTPHeaderField: "Authorization")
  let (data, _) = try await URLSession.shared.data(for: request)
  let page = try JSONDecoder().decode(BackendAssetPage.self, from: data)

  let assets = page.assets.map { item in
    AssetResult(
      id: item.id,
      label: item.label,
      meta: [
        "uri": item.uri,
        "thumbUri": item.thumbUri,
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "width": String(item.width),
        "height": String(item.height),
      ],
      context: .init(sourceID: sourceID),
    )
  }

  return AssetQueryResult(
    assets: assets,
    currentPage: page.currentPage,
    nextPage: page.nextPage ?? -1,
    total: page.total,
  )
}
```

Load images, videos, audio, and stickers from your own backend into CE.SDK to
integrate a CMS, DAM, or custom asset management system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-import-media-from-remote-source-your-server)

<EngineReferenceNote {...props} />

CE.SDK offers two ways to bring your server's content into the engine. Choose the pattern that fits how your assets change.

## Understanding Asset Source Types

**Custom asset sources** suit database-backed content — user uploads, DAM integrations, CMS media. You implement the `AssetSource` protocol and provide a `findAssets(queryData:)` method that handles search and pagination against your API. Register it with `engine.asset.addSource(_:)`.

**JSON asset sources** suit static content that rarely changes — stickers, icons, brand elements, templates. You host a JSON manifest alongside the assets and register it with `engine.asset.addLocalAssetSourceFromJSON(_:)`. CE.SDK's bundled libraries use this pattern; the [Serve Assets From Your Server](../../serve-assets.md) guide covers hosting them on your own infrastructure, and [Asset Concepts](../concepts.md) explains how sources and assets fit together.

## Creating a Custom Asset Source

A custom source is a class that conforms to `AssetSource`: it exposes a unique `id` and implements `findAssets(queryData:)`. The `queryData` carries the search `query`, the requested `page`, and `perPage`; return an `AssetQueryResult` with the current page of `assets`, the `total` count, the `currentPage`, and `nextPage` (use `-1` when there are no more results).

```swift highlight-yourServer-find-assets
  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let term = (queryData.query ?? "").lowercased()
    let matches = term.isEmpty ? catalog : catalog.filter { asset in
      (asset.label?.lowercased().contains(term) ?? false)
        || (asset.tags?.contains { $0.lowercased().contains(term) } ?? false)
    }

    let start = queryData.page * queryData.perPage
    let page = Array(matches.dropFirst(start).prefix(queryData.perPage))
    let hasMore = start + page.count < matches.count

    return AssetQueryResult(
      assets: page,
      currentPage: queryData.page,
      nextPage: hasMore ? queryData.page + 1 : -1,
      total: matches.count,
    )
  }
```

Register the source once, then query it through the Asset API:

```swift highlight-yourServer-register
  let source = BackendAssetSource(id: "my-backend")
  try engine.asset.addSource(source)

  let results = try await engine.asset.findAssets(
    sourceID: source.id,
    query: .init(query: "", page: 0, perPage: 10),
  )
  print("Loaded \(results.assets.count) of \(results.total) assets from the backend source")
```

The example returns a fixed catalog so it runs without a network connection. In a real integration, `findAssets(queryData:)` builds a request from your backend's base URL, forwards the query, and maps the decoded response into `AssetResult` values. Attach an `Authorization` header for protected endpoints, or sign the asset URLs themselves:

```swift highlight-yourServer-backend-fetch
  var components = URLComponents(
    url: host.appendingPathComponent("assets"),
    resolvingAgainstBaseURL: false,
  )!
  components.queryItems = [
    URLQueryItem(name: "query", value: queryData.query),
    URLQueryItem(name: "page", value: String(queryData.page)),
    URLQueryItem(name: "perPage", value: String(queryData.perPage)),
  ]

  var request = URLRequest(url: components.url!)
  request.setValue("Bearer YOUR_API_TOKEN", forHTTPHeaderField: "Authorization")
  let (data, _) = try await URLSession.shared.data(for: request)
  let page = try JSONDecoder().decode(BackendAssetPage.self, from: data)

  let assets = page.assets.map { item in
    AssetResult(
      id: item.id,
      label: item.label,
      meta: [
        "uri": item.uri,
        "thumbUri": item.thumbUri,
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "width": String(item.width),
        "height": String(item.height),
      ],
      context: .init(sourceID: sourceID),
    )
  }

  return AssetQueryResult(
    assets: assets,
    currentPage: page.currentPage,
    nextPage: page.nextPage ?? -1,
    total: page.total,
  )
```

For a complete worked source that talks to a live REST API, see the [Unsplash integration](./unsplash.md).

## Serving Different Media Types

Each media type needs the right `blockType` and `fillType` in its `meta` dictionary. Set `thumbUri` to a small preview and `uri` to the full-resolution asset.

### Image Assets

Images use a graphic block with an image fill. Include `width` and `height` so CE.SDK preserves the aspect ratio.

```swift highlight-yourServer-image-asset
let image = AssetResult(
  id: "photo-1",
  label: "Mountain Landscape",
  tags: ["nature", "mountain", "landscape"],
  meta: [
    "uri": "https://cdn.example.com/assets/photo-1.jpg",
    "thumbUri": "https://cdn.example.com/thumbs/photo-1.jpg",
    "blockType": DesignBlockType.graphic.rawValue,
    "fillType": FillType.image.rawValue,
    "width": "1920",
    "height": "1080",
  ],
  context: .init(sourceID: id),
)
```

### Video Assets

Videos use a graphic block with a video fill. Include `duration` for the timeline and `thumbUri` for the preview.

```swift highlight-yourServer-video-asset
let video = AssetResult(
  id: "clip-1",
  label: "City Timelapse",
  tags: ["city", "timelapse"],
  meta: [
    "uri": "https://cdn.example.com/assets/clip-1.mp4",
    "thumbUri": "https://cdn.example.com/thumbs/clip-1.jpg",
    "blockType": DesignBlockType.graphic.rawValue,
    "fillType": FillType.video.rawValue,
    "duration": "12.5",
    "width": "1920",
    "height": "1080",
  ],
  context: .init(sourceID: id),
)
```

### Audio Assets

Audio uses the `//ly.img.ubq/audio` block type. The `mimeType` is required for preview playback; include `duration` for the timeline.

```swift highlight-yourServer-audio-asset
let audio = AssetResult(
  id: "track-1",
  label: "Ambient Loop",
  tags: ["ambient", "loop"],
  meta: [
    "uri": "https://cdn.example.com/assets/track-1.m4a",
    "thumbUri": "https://cdn.example.com/thumbs/track-1.jpg",
    "blockType": DesignBlockType.audio.rawValue,
    "mimeType": "audio/x-m4a",
    "duration": "30.0",
  ],
  context: .init(sourceID: id),
)
```

### Sticker Assets

Stickers share the image structure but add `kind: "sticker"`, which marks them as overlays with limited editing options instead of regular images.

```swift highlight-yourServer-sticker-asset
let sticker = AssetResult(
  id: "sticker-1",
  label: "Star Badge",
  tags: ["badge", "star"],
  meta: [
    "uri": "https://cdn.example.com/assets/sticker-1.png",
    "thumbUri": "https://cdn.example.com/thumbs/sticker-1.png",
    "blockType": DesignBlockType.graphic.rawValue,
    "fillType": FillType.image.rawValue,
    "kind": "sticker",
    "width": "512",
    "height": "512",
  ],
  context: .init(sourceID: id),
)
```

### Template Assets

Templates replace the whole scene rather than adding a block, so they use a local source with a custom `applyAsset` callback that loads a `.scene` file. Return `nil` because applying a template mutates the current scene rather than creating a new block.

```swift highlight-yourServer-template-source
  try engine.asset.addLocalSource(sourceID: "my-backend-templates", applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"], let url = URL(string: uri) else {
      return nil
    }
    try await engine.scene.applyTemplate(from: url)
    return nil
  })

  let template = AssetDefinition(
    id: "promo-card",
    meta: [
      "uri": "https://cdn.example.com/templates/promo-card.scene",
      "thumbUri": "https://cdn.example.com/thumbs/promo-card.jpg",
      "blockType": DesignBlockType.scene.rawValue,
    ],
    label: ["en": "Promo Card"],
  )
  try engine.asset.addAsset(to: "my-backend-templates", asset: template)
```

## Loading Assets from JSON

For static collections that rarely change, register a source from a JSON manifest. Each asset carries an `id`, a localized `label`, and a `meta` dictionary. The `{{base_url}}` placeholder resolves against the `basePath` you pass, so the manifest stays portable.

```swift highlight-yourServer-json-source
let manifest = """
{
  "version": "1.0.0",
  "id": "my-backend-stickers",
  "assets": [
    {
      "id": "star-badge",
      "label": { "en": "Star Badge" },
      "tags": { "en": ["badge", "star"] },
      "meta": {
        "uri": "{{base_url}}/stickers/star-badge.png",
        "thumbUri": "{{base_url}}/stickers/star-badge.png",
        "blockType": "//ly.img.ubq/graphic",
        "fillType": "//ly.img.ubq/fill/image",
        "kind": "sticker",
        "width": "512",
        "height": "512"
      }
    }
  ]
}
"""
let staticSourceID = try engine.asset.addLocalAssetSourceFromJSON(
  manifest,
  basePath: "https://cdn.example.com/assets",
)
print("Registered static source: \(staticSourceID)")
```

`addLocalAssetSourceFromJSON(_:basePath:matcher:)` takes the manifest inline; the `addLocalAssetSourceFromJSON(_:matcher:)` overload loads a hosted `content.json` from a URL instead. See [Serve Assets From Your Server](../../serve-assets.md) for the manifest format and hosting details.

## Server Architecture Considerations

A few backend choices keep asset loading fast and reliable:

- **Authentication** — Pass tokens through your `findAssets` request headers, or hand out signed URLs that embed a temporary access token.
- **Thumbnails** — Generate ~512px-wide thumbnails server-side and return them in `meta.thumbUri`; keep the full-resolution asset in `meta.uri`.
- **CDN and caching** — Deliver assets through a CDN, with long cache TTLs for immutable thumbnails and shorter TTLs for content that changes.

## Troubleshooting

- **Assets not appearing** — Confirm `findAssets(queryData:)` returns a valid `AssetQueryResult` with `assets`, `total`, `currentPage`, and `nextPage`, and that every asset has an `id` and a `meta.uri`.
- **Media not loading** — Verify the `uri` is reachable from the device. Apple platforms block plaintext HTTP by default, so serve assets over HTTPS or configure an App Transport Security exception.
- **Search returns nothing** — Make sure `findAssets(queryData:)` reads `queryData.query` and forwards the term to your backend.
- **Pagination stalls** — Return `nextPage: -1` once results are exhausted, and report the complete result count in `total` rather than the current page size.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register a custom `AssetSource` whose `findAssets(queryData:)` fetches from your backend. |
| `engine.asset.findAssets(sourceID:query:)` | Query a registered source for a page of results. |
| `engine.asset.addLocalSource(sourceID:applyAsset:)` | Register a source with a custom apply callback, used for templates. |
| `engine.asset.addAsset(to:asset:)` | Add an `AssetDefinition` to a local source. |
| `engine.asset.addLocalAssetSourceFromJSON(_:basePath:matcher:)` | Register a source from an inline JSON manifest string. |
| `engine.asset.addLocalAssetSourceFromJSON(_:matcher:)` | Register a source from a hosted `content.json` URL. |

### Metadata Properties

| Property | Description |
| --- | --- |
| `uri` | Full-resolution asset URL applied to the canvas. |
| `thumbUri` | Thumbnail URL shown in the asset library. |
| `blockType` | `//ly.img.ubq/graphic` for images, videos, and stickers; `//ly.img.ubq/audio` for audio. |
| `fillType` | `//ly.img.ubq/fill/image` or `//ly.img.ubq/fill/video`. |
| `kind` | Set to `sticker` to treat an image asset as a sticker overlay. |
| `mimeType` | Required for audio assets, for example `audio/x-m4a`. |
| `duration` | Length in seconds for video and audio. |
| `width` / `height` | Original dimensions used for aspect-ratio handling. |

## Next Steps

- User Upload — On iOS, handle file uploads with progress tracking
- [Asset Concepts](../concepts.md) — Asset sources and metadata architecture
- [Thumbnails](../asset-library/thumbnails.md) — Configure thumbnail display and preview URIs
- Customize Asset Library — On iOS, present your registered sources in the asset library
- [Serve Assets From Your Server](../../serve-assets.md) — Host CE.SDK's default and sample content on your own infrastructure



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support