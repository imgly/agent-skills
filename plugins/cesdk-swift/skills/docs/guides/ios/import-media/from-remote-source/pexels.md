> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Pexels](./pexels.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-from-pexels/ImportFromPexels.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importFromPexels(engine: Engine) async throws {
  // Replace with your Pexels API key from https://www.pexels.com/api/
  let apiKey = "YOUR_PEXELS_API_KEY"
  let source = PexelsAssetSource(apiKey: apiKey)
  try engine.asset.addSource(source)

  let registeredSources = engine.asset.findAllSources()
  print("Registered asset sources: \(registeredSources)")
  assert(registeredSources.contains(PexelsAssetSource.id))

  // A live query needs a real API key, so skip it while the placeholder is in place.
  guard apiKey != "YOUR_PEXELS_API_KEY" else { return }

  let curated = try await engine.asset.findAssets(
    sourceID: PexelsAssetSource.id,
    query: .init(query: nil, page: 0, perPage: 20),
  )
  print("Pexels returned \(curated.assets.count) curated photos")

  let results = try await engine.asset.findAssets(
    sourceID: PexelsAssetSource.id,
    query: .init(query: "mountains", page: 0, perPage: 20),
  )
  print("Pexels search returned \(results.assets.count) photos for 'mountains'")
}
```

```swift file=@cesdk_swift_examples/third-party/PexelsAssetSource.swift reference-only
import Foundation
import IMGLYEngine

public final class PexelsAssetSource: NSObject {
  private let decoder = JSONDecoder()
  private let apiKey: String

  public init(apiKey: String) {
    self.apiKey = apiKey
  }

  private struct Endpoint {
    let path: String
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/v1/search",
        query: [
          .init(name: "query", value: queryData.query),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
        ],
      )
    }

    static func curated(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/v1/curated",
        query: [
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
        ],
      )
    }

    var url: URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = "api.pexels.com"
      components.path = path
      components.queryItems = query
      return components.url
    }
  }
}

extension PexelsAssetSource: AssetSource {
  public static let id = "pexels"

  public var id: String {
    Self.id
  }

  public func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let endpoint: Endpoint = queryData.query?
      .isEmpty ?? true ? .curated(queryData: queryData) : .search(queryData: queryData)

    var request = URLRequest(url: endpoint.url!)
    request.setValue(apiKey, forHTTPHeaderField: "Authorization")
    let data = try await URLSession.shared.data(for: request).0

    let response = try decoder.decode(PexelsSearchResponse.self, from: data)
    let hasNextPage = response.nextPage != nil && !response.photos.isEmpty

    return .init(
      assets: response.photos.map(AssetResult.init),
      currentPage: queryData.page,
      nextPage: hasNextPage ? queryData.page + 1 : -1,
      total: response.totalResults ?? -1,
    )
  }

  public var supportedMIMETypes: [String]? {
    [MIMEType.jpeg.rawValue]
  }

  public var credits: AssetCredits? {
    .init(
      name: "Pexels",
      url: URL(string: "https://www.pexels.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Pexels license (free)",
      url: URL(string: "https://www.pexels.com/license/")!,
    )
  }
}

private extension AssetResult {
  convenience init(photo: PexelsPhoto) {
    self.init(
      id: String(photo.id),
      locale: "en",
      label: photo.alt,
      meta: [
        "uri": photo.src.original.absoluteString,
        "thumbUri": photo.src.medium.absoluteString,
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "shapeType": ShapeType.rect.rawValue,
        "kind": "image",
        "width": String(photo.width),
        "height": String(photo.height),
      ],
      context: .init(sourceID: PexelsAssetSource.id),
      credits: .init(
        name: photo.photographer,
        url: photo.photographerURL.flatMap(URL.init(string:)),
      ),
      utm: .init(source: "CE.SDK Demo", medium: "referral"),
    )
  }
}
```

```swift file=@cesdk_swift_examples/third-party/PexelsResponse.swift reference-only
import Foundation

// MARK: - PexelsResponse

struct PexelsSearchResponse: Decodable {
  let totalResults: Int?
  let nextPage: String?
  let photos: [PexelsPhoto]

  enum CodingKeys: String, CodingKey {
    case totalResults = "total_results"
    case nextPage = "next_page"
    case photos
  }
}

// MARK: - Photo

struct PexelsPhoto: Decodable {
  let id: Int
  let width: Int
  let height: Int
  let photographer: String
  let photographerURL: String?
  let alt: String?
  let src: PexelsPhotoSource

  enum CodingKeys: String, CodingKey {
    case id, width, height, photographer, alt, src
    case photographerURL = "photographer_url"
  }
}

// MARK: - Source

struct PexelsPhotoSource: Decodable {
  let original: URL
  let medium: URL
}
```

Connect CE.SDK to the Pexels API to search and add royalty-free stock photos
directly to your designs.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-import-from-pexels)

<EngineReferenceNote {...props} />

Pexels offers a large library of high-quality, royalty-free stock photos through a public REST API. You expose that library inside CE.SDK by implementing a custom asset source: a small class that conforms to the `AssetSource` protocol, fetches results from the Pexels API, and maps them into the asset format the engine understands. Once registered, the source behaves like any other — it can be queried programmatically and surfaced in the asset library.

## Prerequisites

- A Pexels API key from the [Pexels API documentation](https://www.pexels.com/api/documentation/).
- Familiarity with Pexels' [API guidelines](https://www.pexels.com/api/documentation/#guidelines) and rate limits.

No third-party dependencies are required — the example uses `URLSession` and `Codable` from Foundation.

## Register the Asset Source

A custom asset source is any object conforming to the `AssetSource` protocol. Register it with `engine.asset.addSource(_:)`, passing your Pexels API key so the source can authenticate its requests:

```swift highlight-pexels-definition
// Replace with your Pexels API key from https://www.pexels.com/api/
let apiKey = "YOUR_PEXELS_API_KEY"
let source = PexelsAssetSource(apiKey: apiKey)
try engine.asset.addSource(source)
```

Pass your own key in place of the `YOUR_PEXELS_API_KEY` placeholder. Pexels expects the key in the `Authorization` header of every request, which the source sets for you.

After registering, the source ID appears in `engine.asset.findAllSources()` alongside the engine's built-in sources:

```swift highlight-pexels-verify
let registeredSources = engine.asset.findAllSources()
print("Registered asset sources: \(registeredSources)")
```

## Implement findAssets

The source wraps two Pexels endpoints — `/v1/search` for queries and `/v1/curated` for browsing without a search term. CE.SDK uses 0-based page indices, so it converts each page to the 1-based index Pexels expects:

```swift highlight-pexels-api-creation
public final class PexelsAssetSource: NSObject {
  private let decoder = JSONDecoder()
  private let apiKey: String

  public init(apiKey: String) {
    self.apiKey = apiKey
  }

  private struct Endpoint {
    let path: String
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/v1/search",
        query: [
          .init(name: "query", value: queryData.query),
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
        ],
      )
    }

    static func curated(queryData: AssetQueryData) -> Self {
      Endpoint(
        path: "/v1/curated",
        query: [
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "per_page", value: String(queryData.perPage)),
        ],
      )
    }

    var url: URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = "api.pexels.com"
      components.path = path
      components.queryItems = query
      return components.url
    }
  }
}
```

Conform to `AssetSource` by giving the source a unique `id` and implementing `findAssets(queryData:) async throws -> AssetQueryResult`. The method receives the current query — a search string plus pagination — and returns a page of results. Because it is `async`, you can back it with `URLSession`, a cache, or any third-party client:

```swift highlight-pexels-find-assets
  public static let id = "pexels"

  public var id: String {
    Self.id
  }

  public func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let endpoint: Endpoint = queryData.query?
      .isEmpty ?? true ? .curated(queryData: queryData) : .search(queryData: queryData)

    var request = URLRequest(url: endpoint.url!)
    request.setValue(apiKey, forHTTPHeaderField: "Authorization")
    let data = try await URLSession.shared.data(for: request).0

    let response = try decoder.decode(PexelsSearchResponse.self, from: data)
    let hasNextPage = response.nextPage != nil && !response.photos.isEmpty

    return .init(
      assets: response.photos.map(AssetResult.init),
      currentPage: queryData.page,
      nextPage: hasNextPage ? queryData.page + 1 : -1,
      total: response.totalResults ?? -1,
    )
  }
```

`findAssets` routes to `/v1/search` when the query string is non-empty and to `/v1/curated` otherwise, sends the request with the API key in the `Authorization` header, then decodes the response into an `AssetQueryResult`:

- `currentPage` echoes the requested page.
- `nextPage` is the next page to request, or `-1` when no more results exist — Pexels returns a `next_page` URL only while there are more.
- `total` is the overall result count; the curated endpoint omits it, so the source reports `-1` to signal an unknown total.

## Translate Pexels Photos to Assets

Each Pexels photo becomes an `AssetResult`. The `meta` dictionary carries the values the engine needs to add the image to a scene:

```swift highlight-pexels-translate
convenience init(photo: PexelsPhoto) {
  self.init(
    id: String(photo.id),
    locale: "en",
    label: photo.alt,
    meta: [
      "uri": photo.src.original.absoluteString,
      "thumbUri": photo.src.medium.absoluteString,
      "blockType": DesignBlockType.graphic.rawValue,
      "fillType": FillType.image.rawValue,
      "shapeType": ShapeType.rect.rawValue,
      "kind": "image",
      "width": String(photo.width),
      "height": String(photo.height),
    ],
    context: .init(sourceID: PexelsAssetSource.id),
    credits: .init(
      name: photo.photographer,
      url: photo.photographerURL.flatMap(URL.init(string:)),
    ),
    utm: .init(source: "CE.SDK Demo", medium: "referral"),
  )
}
```

- `uri` is the full-resolution image (`src.original`); `thumbUri` is the preview shown in the asset library (`src.medium`).
- `blockType` and `fillType` tell the engine to create a graphic block with an image fill when the asset is applied. Setting them up front avoids a round-trip to infer the type from the file.
- `shapeType` and `kind` give the block a rectangle shape and mark its content as an image, so it renders correctly without further setup.
- `width` and `height` come straight from the API so the engine can size the block correctly.
- `context.sourceID` links the result back to the Pexels source.

## Handle Attribution

Pexels' license asks you to credit photographers. Provide attribution at two levels. Source-level `credits` and `license` describe the provider and apply to every result:

```swift highlight-pexels-credits-license
  public var credits: AssetCredits? {
    .init(
      name: "Pexels",
      url: URL(string: "https://www.pexels.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Pexels license (free)",
      url: URL(string: "https://www.pexels.com/license/")!,
    )
  }
```

Per-asset `credits` (set in the translation above) name the individual photographer with a link to their Pexels profile, and the `utm` parameters tag outgoing links for analytics.

## Query the Source

Once registered, query the source through the standard Asset API. Pass an empty query to fetch curated photos, or a search term to search the library — pagination works the same way for both:

```swift highlight-pexels-findAssets
  let curated = try await engine.asset.findAssets(
    sourceID: PexelsAssetSource.id,
    query: .init(query: nil, page: 0, perPage: 20),
  )
  print("Pexels returned \(curated.assets.count) curated photos")

  let results = try await engine.asset.findAssets(
    sourceID: PexelsAssetSource.id,
    query: .init(query: "mountains", page: 0, perPage: 20),
  )
  print("Pexels search returned \(results.assets.count) photos for 'mountains'")
```

The returned `AssetResult` values can be added to a scene with `engine.asset.apply(sourceID:assetResult:)`. Registering the source makes it queryable through the Asset API but does not add it to an editor's asset library — on iOS, add a library section for it as shown in the [Customize Asset Library](../asset-library/customize.md) guide.

## Troubleshooting

- **Authentication errors:** Confirm the key is sent in the `Authorization` header and is valid for the Pexels API.
- **Rate limiting:** Pexels enforces per-key rate limits and returns HTTP 429 when exceeded. Cache results and back off on 429 responses.
- **Missing attribution:** Verify both the source-level `credits`/`license` and the per-asset `credits` are populated from the API response.
- **Images fail to load:** Check that the Pexels CDN URLs in `src` are reachable from the device's network.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register an object conforming to `AssetSource` (such as `PexelsAssetSource`) as a custom source. |
| `engine.asset.findAllSources()` | List the IDs of every registered asset source. |
| `engine.asset.findAssets(sourceID:query:)` | Query a source for a page of results, returning an `AssetQueryResult`. |

## Next Steps

- [Integrate Unsplash Images](./unsplash.md) — Add another remote stock-image source.
- [Customize Asset Library](../asset-library/customize.md) — On iOS, surface the source in the editor's asset panels.
- [Insert Shapes or Stickers](../../insert-media/shapes-or-stickers.md) — Query and apply assets from a registered source.
- [Serve Assets From Your Server](../../serve-assets.md) — Host and register your own asset content.
- [Asset Concepts](../concepts.md) — Learn the core import and asset-source concepts.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support