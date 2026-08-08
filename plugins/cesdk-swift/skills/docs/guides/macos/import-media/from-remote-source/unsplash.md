> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Unsplash](./unsplash.md)

---

```swift file=@cesdk_swift_examples/engine-guides-custom-asset-source/CustomAssetSource.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func customAssetSource(engine: Engine) async throws {
  let source = UnsplashAssetSource(host: secrets.unsplashHost)
  try engine.asset.addSource(source)

  let list = try await engine.asset.findAssets(
    sourceID: "ly.img.asset.source.unsplash",
    query: .init(query: "", page: 1, perPage: 10),
  )
  let search = try await engine.asset.findAssets(
    sourceID: "ly.img.asset.source.unsplash",
    query: .init(query: "banana", page: 1, perPage: 10),
  )

  try engine.asset.addLocalSource(sourceID: "background-videos")

  let asset = AssetDefinition(id: "ocean-waves-1",
                              meta: [
                                "uri": "https://example.com/ocean-waves-1.mp4",
                                "thumbUri": "https://example.com/thumbnails/ocean-waves-1.jpg",
                                "mimeType": "video/mp4",
                                "width": "1920",
                                "height": "1080",
                              ],
                              label: [
                                "en": "relaxing ocean waves",
                                "es": "olas del mar relajantes",
                              ],
                              tags: [
                                "en": ["ocean", "waves", "soothing", "slow"],
                                "es": ["mar", "olas", "calmante", "lento"],
                              ])
  try engine.asset.addAsset(to: "background-videos", asset: asset)
}
```

```swift file=@cesdk_swift_examples/third-party/UnsplashAssetSource.swift reference-only
import Foundation
import IMGLYEngine

public final class UnsplashAssetSource: NSObject {
  private lazy var decoder: JSONDecoder = {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return decoder
  }()

  private let host: String
  private let path: String

  public init(host: String, path: String = "/unsplashProxy") {
    self.host = host
    self.path = path
  }

  private struct Endpoint {
    let path: String
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/search/photos",
        query: [
          .init(name: "query", value: queryData.query),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
          .init(name: "content_filter", value: "high"),
        ],
      )
    }

    static func list(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/photos",
        query: [
          .init(name: "order_by", value: "popular"),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
          .init(name: "content_filter", value: "high"),
        ],
      )
    }

    func url(with host: String, path: String) -> URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = host
      components.path = path + self.path
      components.queryItems = query
      return components.url
    }
  }
}

extension UnsplashAssetSource: AssetSource {
  public static let id = "ly.img.asset.source.unsplash"

  public var id: String {
    Self.id
  }

  public func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let endpoint: Endpoint = queryData.query?
      .isEmpty ?? true ? .list(queryData: queryData) : .search(queryData: queryData)

    let data = try await URLSession.shared.data(from: endpoint.url(with: host, path: path)!).0

    if queryData.query?.isEmpty ?? true {
      let response = try decoder.decode(UnsplashListResponse.self, from: data)
      let nextPage = queryData.page + 1

      return .init(
        assets: response.map(AssetResult.init),
        currentPage: queryData.page,
        nextPage: nextPage,
        total: -1,
      )
    } else {
      let response = try decoder.decode(UnsplashSearchResponse.self, from: data)
      let (results, total, totalPages) = (response.results, response.total ?? 0, response.totalPages ?? 0)
      let nextPage = (queryData.page + 1) == totalPages ? -1 : queryData.page + 1

      return .init(
        assets: results.map(AssetResult.init),
        currentPage: queryData.page,
        nextPage: nextPage,
        total: total,
      )
    }
  }

  public var supportedMIMETypes: [String]? {
    [MIMEType.jpeg.rawValue]
  }

  public var credits: AssetCredits? {
    .init(
      name: "Unsplash",
      url: URL(string: "https://unsplash.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Unsplash license (free)",
      url: URL(string: "https://unsplash.com/license")!,
    )
  }
}

private extension AssetResult {
  convenience init(image: UnsplashImage) {
    self.init(
      id: image.id,
      locale: "en",
      label: image.description ?? image.altDescription,
      tags: image.tags?.compactMap(\.title),
      meta: [
        "uri": image.urls.full.absoluteString,
        "thumbUri": image.urls.thumb.absoluteString,
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "shapeType": ShapeType.rect.rawValue,
        "kind": "image",
        "width": String(image.width),
        "height": String(image.height),
        "looping": "false",
      ],
      context: .init(sourceID: "unsplash"),
      credits: .init(name: image.user.name!, url: image.user.links?.html),
      utm: .init(source: "CE.SDK Demo", medium: "referral"),
    )
  }
}
```

```swift file=@cesdk_swift_examples/third-party/UnsplashResponse.swift reference-only
import Foundation

// MARK: - UnsplashResponse

struct UnsplashSearchResponse: Decodable {
  let total, totalPages: Int?
  let results: [UnsplashImage]
}

typealias UnsplashListResponse = [UnsplashImage]

// MARK: - Result

struct UnsplashImage: Decodable {
  let id: String
  let createdAt, updatedAt: String
  let promotedAt: String?
  let width, height: Int
  let color, blurHash: String?
  let description: String?
  let altDescription: String?
  let urls: Urls
  let likes: Int?
  let likedByUser: Bool?
  let user: User
  let tags: [Tag]?
}

// MARK: - Tag

struct Tag: Decodable {
  let type, title: String?
}

// MARK: - Urls

struct Urls: Decodable {
  let raw, full, regular, small: URL
  let thumb, smallS3: URL
}

// MARK: - User

struct User: Decodable {
  let id: String
  let updatedAt: String

  let username, name, firstName: String?
  let lastName, twitterUsername: String?
  let portfolioURL: String?
  let bio, location: String?
  let links: UserLinks?
  let instagramUsername: String?
  let totalCollections, totalLikes, totalPhotos: Int?
  let acceptedTos, forHire: Bool?
}

// MARK: - UserLinks

struct UserLinks: Decodable {
  let linksSelf, html, photos, likes: URL?
  let portfolio, following, followers: URL?
}
```

Browse Unsplash's library of royalty-free photos from inside the editor by
registering a custom asset source. The engine calls your `findAssets`
implementation as the user searches and scrolls, so results stream in from the
Unsplash API on demand.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260808/engine-guides-custom-asset-source)

<EngineReferenceNote {...props} />

CE.SDK lets you plug external image providers — like Unsplash or your own backend — into the engine as custom asset sources. This guide builds an Unsplash source, maps its REST responses to the engine's asset format, handles attribution, surfaces the source in the asset library, and shows the engine-managed local-source alternative.

## Prerequisites

- An Unsplash API access key from the [Unsplash Developer portal](https://unsplash.com/developers).
- A proxy that forwards requests to the Unsplash API. The example reads the proxy host from `secrets.unsplashHost` — a secrets shim the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.81.0-nightly.20260808/secrets/Secrets.swift) ships, which you replace with your own host string. Unsplash's guidelines ask you to proxy requests rather than embed your access key in the app; setting up the proxy itself is out of scope here.

## Setting Up the Unsplash API Client

The example wraps the Unsplash REST API in a class. The setup holds two endpoint definitions — `/search/photos` for queries and `/photos` for popular images — along with a JSON decoder configured to convert Unsplash's snake-case keys.

```swift highlight-unsplash-api-creation
public final class UnsplashAssetSource: NSObject {
  private lazy var decoder: JSONDecoder = {
    let decoder = JSONDecoder()
    decoder.keyDecodingStrategy = .convertFromSnakeCase
    return decoder
  }()

  private let host: String
  private let path: String

  public init(host: String, path: String = "/unsplashProxy") {
    self.host = host
    self.path = path
  }

  private struct Endpoint {
    let path: String
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/search/photos",
        query: [
          .init(name: "query", value: queryData.query),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
          .init(name: "content_filter", value: "high"),
        ],
      )
    }

    static func list(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/photos",
        query: [
          .init(name: "order_by", value: "popular"),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
          .init(name: "content_filter", value: "high"),
        ],
      )
    }

    func url(with host: String, path: String) -> URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = host
      components.path = path + self.path
      components.queryItems = query
      return components.url
    }
  }
}
```

## Creating the Unsplash Asset Source Definition

Register an asset source by passing an object that implements the `AssetSource` protocol to `addSource(_:)`. Each source needs a unique identifier — every Asset API call references it.

```swift highlight-unsplash-definition
let source = UnsplashAssetSource(host: secrets.unsplashHost)
try engine.asset.addSource(source)
```

The single method every source must implement is `findAssets(queryData:)`. It receives the query the engine wants — a search string plus pagination — and returns the matching slice of assets along with the current page, the next page, and the total number available. Because it is `async`, you are free to back it with `URLSession`, local storage, a cache, or a third-party SDK.

## Implementing Search and Discovery

Unsplash uses different endpoints for searching versus browsing. Inspect the query string to decide which one to call: an empty query lists popular photos from `/photos`, while a non-empty query hits `/search/photos`.

The `queryData` carries everything you need:

- `queryData.query` — the current search term from the asset library's search bar.
- `queryData.page` — the zero-based page index the engine requests; pages load as the user scrolls. The example adds `1` when calling Unsplash because Unsplash's pages start at `1`.
- `queryData.perPage` — how many assets to return per page; this can change between calls (a small number for a preview, a larger one for a grid).

```swift highlight-unsplash-query
let endpoint: Endpoint = queryData.query?
  .isEmpty ?? true ? .list(queryData: queryData) : .search(queryData: queryData)
```

Once the response arrives, map it to the `AssetQueryResult` the engine expects:

- `assets` — the assets for this page.
- `total` — the total number available for the query. The popular-images branch can't know this ahead of time, so it returns `-1`.
- `currentPage` — the page that was requested.
- `nextPage` — the next page to request, or `-1` when there are no more results so the engine stops querying.

```swift highlight-unsplash-result-mapping
    if queryData.query?.isEmpty ?? true {
      let response = try decoder.decode(UnsplashListResponse.self, from: data)
      let nextPage = queryData.page + 1

      return .init(
        assets: response.map(AssetResult.init),
        currentPage: queryData.page,
        nextPage: nextPage,
        total: -1,
      )
    } else {
      let response = try decoder.decode(UnsplashSearchResponse.self, from: data)
      let (results, total, totalPages) = (response.results, response.total ?? 0, response.totalPages ?? 0)
      let nextPage = (queryData.page + 1) == totalPages ? -1 : queryData.page + 1

      return .init(
        assets: results.map(AssetResult.init),
        currentPage: queryData.page,
        nextPage: nextPage,
        total: total,
      )
    }
```

## Translating Unsplash Data to CE.SDK Format

Each Unsplash photo is translated into an `AssetResult`. The `id` is mandatory and must be unique within the source; every other field is optional but improves the experience.

```swift highlight-translateToAssetResult
convenience init(image: UnsplashImage) {
  self.init(
    id: image.id,
    locale: "en",
    label: image.description ?? image.altDescription,
    tags: image.tags?.compactMap(\.title),
    meta: [
      "uri": image.urls.full.absoluteString,
      "thumbUri": image.urls.thumb.absoluteString,
      "blockType": DesignBlockType.graphic.rawValue,
      "fillType": FillType.image.rawValue,
      "shapeType": ShapeType.rect.rawValue,
      "kind": "image",
      "width": String(image.width),
      "height": String(image.height),
      "looping": "false",
    ],
    context: .init(sourceID: "unsplash"),
    credits: .init(name: image.user.name!, url: image.user.links?.html),
    utm: .init(source: "CE.SDK Demo", medium: "referral"),
  )
}
```

`id` — the asset's unique identifier.

```swift highlight-result-id
id: image.id,
```

`locale` — the language locale used for `label` and `tags`.

```swift highlight-result-locale
locale: "en",
```

`label` — a human-readable name, shown in tooltips and credits.

```swift highlight-result-label
label: image.description ?? image.altDescription,
```

`tags` — searchable keywords, also shown in credits.

```swift highlight-result-tags
tags: image.tags?.compactMap(\.title),
```

The `meta` dictionary holds the type-specific properties that tell the engine how to apply the asset.

```swift highlight-result-meta
meta: [
  "uri": image.urls.full.absoluteString,
  "thumbUri": image.urls.thumb.absoluteString,
  "blockType": DesignBlockType.graphic.rawValue,
  "fillType": FillType.image.rawValue,
  "shapeType": ShapeType.rect.rawValue,
  "kind": "image",
  "width": String(image.width),
  "height": String(image.height),
  "looping": "false",
],
```

`uri` — the URL of the full-resolution image used when the asset is added to the scene.

```swift highlight-result-uri
"uri": image.urls.full.absoluteString,
```

`thumbUri` — the URL of the thumbnail shown in the asset library grid.

```swift highlight-result-thumbUri
"thumbUri": image.urls.thumb.absoluteString,
```

`blockType` — the design block to create when the asset is applied. If omitted, the engine infers it from the `mimeType` or by loading the asset data, which delays insertion — so always set it.

```swift highlight-result-blockType
"blockType": DesignBlockType.graphic.rawValue,
```

`fillType` — the fill attached to the block. Defaults to a solid color fill when omitted.

```swift highlight-result-fillType
"fillType": FillType.image.rawValue,
```

`shapeType` — the shape attached to the block. Defaults to a rectangle when omitted.

```swift highlight-result-shapeType
"shapeType": ShapeType.rect.rawValue,
```

`kind` — the kind set on the block. Defaults to an empty string when omitted.

```swift highlight-result-kind
"kind": "image",
```

`width` and `height` — the image's original dimensions, used to preserve aspect ratio.

```swift highlight-result-size
"width": String(image.width),
"height": String(image.height),
```

`looping` — whether the asset loops. Applies only to video and GIF assets.

```swift highlight-result-looping
"looping": "false",
```

`context` — contextual information about the asset; currently the source ID it belongs to.

```swift highlight-result-context
context: .init(sourceID: "unsplash"),
```

## Handling Attribution Requirements

Unsplash requires you to credit the photographer. Set the per-asset `credits` to the artist's name and a link to their page.

```swift highlight-result-credits
credits: .init(name: image.user.name!, url: image.user.links?.html),
```

Some providers also require UTM parameters on every link back to the source or artist. The `utm` field adds a `source` (`utm_source`) and a `medium` (`utm_medium`).

```swift highlight-result-utm
utm: .init(source: "CE.SDK Demo", medium: "referral"),
```

Attribution can also be declared once for the whole source. For Unsplash this is a link to the provider and the license that covers every asset from it.

```swift highlight-unsplash-credits-license
  public var credits: AssetCredits? {
    .init(
      name: "Unsplash",
      url: URL(string: "https://unsplash.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Unsplash license (free)",
      url: URL(string: "https://unsplash.com/license")!,
    )
  }
```

## Adding Download Tracking

Unsplash's API guidelines ask you to call a photo's download endpoint whenever an image is used, so photographers receive usage credit. This example maps `image.urls.full` directly and does not trigger that endpoint — the demo proxy's response model doesn't decode the `download_location` link the endpoint needs.

To add tracking in production, first extend the response model to decode `download_location` from each photo's `links`. Then request the download endpoint either inside `findAssets` while mapping each result — so the stored `uri` is already the tracked URL — or by overriding the optional `apply(asset:)` hook on `AssetSource` to fire the request when the asset is added to the scene. See [Unsplash's API guidelines](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download) for the exact endpoint and requirements.

## Configuring the Asset Library UI

On iOS, once the source is registered you can surface it in the editor's asset library. Add it to an image category with `AssetLibrarySource.image(.title("Unsplash"), source: .init(id: UnsplashAssetSource.id))`, which renders the source's results in an image grid. The Customize Asset Library guide walks through adding a source to the default library and building a fully custom one.

## Testing the Integration

Query the registered source directly to verify it works. Pass an empty query for popular images:

```swift highlight-unsplash-findAssets
let list = try await engine.asset.findAssets(
  sourceID: "ly.img.asset.source.unsplash",
  query: .init(query: "", page: 1, perPage: 10),
)
```

Pass a search term to hit the search endpoint:

```swift highlight-unsplash-list
let search = try await engine.asset.findAssets(
  sourceID: "ly.img.asset.source.unsplash",
  query: .init(query: "banana", page: 1, perPage: 10),
)
```

## Troubleshooting

**Rate limiting** — Unsplash enforces per-hour request limits. Cache results and avoid re-querying on every keystroke to stay within them.

**Authentication failures** — If requests fail with an authentication error, verify your access key and proxy host (`secrets.unsplashHost`) are configured correctly.

**Missing attribution** — Confirm the per-asset `credits` and the source-level `credits` and `license` are populated; the editor uses them to display photographer attribution.

**Images not loading** — Check that the mapped `uri` resolves over HTTPS and that App Transport Security permits the host.

## Local Asset Sources

When you already have a finite set of assets, you can skip implementing a query callback and let the engine manage search and pagination for you. Create a "local" source with `addLocalSource(sourceID:)` and a unique ID you reference later.

```swift highlight-add-local-source
try engine.asset.addLocalSource(sourceID: "background-videos")
```

Add assets with `addAsset(to:asset:)`. The engine stores them and returns matching items from queries, in insertion order. Note that `AssetDefinition` differs from the `AssetResult` returned by queries: it carries all localizations of the labels and tags, whereas an `AssetResult` is specific to the query's locale.

```swift highlight-add-asset-to-source
let asset = AssetDefinition(id: "ocean-waves-1",
                            meta: [
                              "uri": "https://example.com/ocean-waves-1.mp4",
                              "thumbUri": "https://example.com/thumbnails/ocean-waves-1.jpg",
                              "mimeType": "video/mp4",
                              "width": "1920",
                              "height": "1080",
                            ],
                            label: [
                              "en": "relaxing ocean waves",
                              "es": "olas del mar relajantes",
                            ],
                            tags: [
                              "en": ["ocean", "waves", "soothing", "slow"],
                              "es": ["mar", "olas", "calmante", "lento"],
                            ])
try engine.asset.addAsset(to: "background-videos", asset: asset)
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register a custom asset source such as Unsplash. |
| `engine.asset.findAssets(sourceID:query:)` | Query a registered source for a page of results. |
| `engine.asset.apply(sourceID:assetResult:)` | Add a queried asset to the scene as a design block. |
| `engine.asset.addLocalSource(sourceID:)` | Create an engine-managed local asset source. |
| `engine.asset.addAsset(to:asset:)` | Add an asset definition to a local source. |

## Next Steps

- Customize Asset Library — On iOS, configure asset panels and surface custom sources in the editor UI.
- Asset Library Basics — On iOS, explore the core functionality of the asset library and how users browse, search, and insert media.
- [IMG.LY Premium Assets](./imgly-premium-assets.md) — Access a curated set of premium IMG.LY media assets for use in designs.
- [Asset Concepts](../concepts.md) — Learn the core asset and import model.




---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support