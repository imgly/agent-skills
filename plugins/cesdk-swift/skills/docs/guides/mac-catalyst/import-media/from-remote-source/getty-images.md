> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Remote Source](../from-remote-source.md) > [From Getty Images](./getty-images.md)

---

```swift file=@cesdk_swift_examples/engine-guides-import-media-from-remote-source-getty-images/ImportFromGettyImages.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func importFromGettyImages(engine: Engine) async throws {
  // Replace with the host of your Getty Images proxy server (see the prerequisites).
  let proxyHost = "YOUR_GETTY_IMAGES_PROXY_HOST"
  let source = GettyImagesAssetSource(proxyHost: proxyHost)
  try engine.asset.addSource(source)

  let registeredSources = engine.asset.findAllSources()
  print("Registered asset sources: \(registeredSources)")
  assert(registeredSources.contains(GettyImagesAssetSource.id))

  // A live query needs a running proxy server, so skip it while the placeholder host is in place.
  guard proxyHost != "YOUR_GETTY_IMAGES_PROXY_HOST" else { return }

  let results = try await engine.asset.findAssets(
    sourceID: GettyImagesAssetSource.id,
    query: .init(query: "business", page: 0, perPage: 20),
  )
  print("Getty Images returned \(results.assets.count) photos for 'business'")
}
```

```swift file=@cesdk_swift_examples/third-party/GettyImagesAssetSource.swift reference-only
import Foundation
import IMGLYEngine

public final class GettyImagesAssetSource: NSObject {
  private let decoder = JSONDecoder()
  private let host: String
  private let path: String

  public init(proxyHost: String, path: String = "/getty-proxy") {
    host = proxyHost
    self.path = path
  }

  private struct Endpoint {
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        query: [
          .init(name: "phrase", value: queryData.query),
          // Getty Images pages start at 1, while CE.SDK uses 0-based indices.
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "page_size", value: String(queryData.perPage)),
        ],
      )
    }

    func url(host: String, path: String) -> URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = host
      components.path = path
      components.queryItems = query
      return components.url
    }
  }
}

extension GettyImagesAssetSource: AssetSource {
  public static let id = "gettyImagesImageAssets"

  public var id: String {
    Self.id
  }

  public func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    guard let url = Endpoint.search(queryData: queryData).url(host: host, path: path) else {
      throw NSError(domain: "GettyImagesAssetSource", code: -1)
    }

    let data = try await URLSession.shared.data(from: url).0
    let response = try decoder.decode(GettyImagesSearchResponse.self, from: data)

    let total = response.resultCount ?? -1
    let loadedSoFar = (queryData.page + 1) * queryData.perPage
    let hasNextPage = !response.images.isEmpty && (total < 0 || loadedSoFar < total)

    return .init(
      assets: response.images.map(AssetResult.init),
      currentPage: queryData.page,
      nextPage: hasNextPage ? queryData.page + 1 : -1,
      total: total,
    )
  }

  public var supportedMIMETypes: [String]? {
    [MIMEType.jpeg.rawValue]
  }

  public var credits: AssetCredits? {
    .init(
      name: "Getty Images",
      url: URL(string: "https://www.gettyimages.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Getty Images Content License Agreement",
      url: URL(string: "https://www.gettyimages.com/eula")!,
    )
  }
}

private extension AssetResult {
  convenience init(image: GettyImage) {
    // Getty's searchimages display sizes are named (typically "comp", "preview", "thumb").
    // Pick the largest for the imported asset and a smaller one for the library thumbnail so
    // the grid loads lightweight previews instead of full-resolution comps.
    let sizesByName = Dictionary(
      image.displaySizes.map { ($0.name, $0.uri) },
      uniquingKeysWith: { first, _ in first },
    )
    let fullURL = sizesByName["comp"] ?? sizesByName["preview"] ?? image.displaySizes.first?.uri
    let thumbURL = sizesByName["thumb"] ?? sizesByName["preview"] ?? fullURL
    self.init(
      id: image.id,
      locale: "en",
      label: image.title,
      meta: [
        "uri": fullURL?.absoluteString ?? "",
        "thumbUri": thumbURL?.absoluteString ?? "",
        "blockType": DesignBlockType.graphic.rawValue,
        "fillType": FillType.image.rawValue,
        "shapeType": ShapeType.rect.rawValue,
        "kind": "image",
        "width": image.maxDimensions?.width.map(String.init) ?? "",
        "height": image.maxDimensions?.height.map(String.init) ?? "",
      ],
      context: .init(sourceID: GettyImagesAssetSource.id),
    )
  }
}
```

```swift file=@cesdk_swift_examples/third-party/GettyImagesResponse.swift reference-only
import Foundation

// MARK: - GettyImagesResponse

struct GettyImagesSearchResponse: Decodable {
  let resultCount: Int?
  let images: [GettyImage]

  enum CodingKeys: String, CodingKey {
    case resultCount = "result_count"
    case images
  }
}

// MARK: - Image

struct GettyImage: Decodable {
  let id: String
  let title: String?
  let maxDimensions: GettyImageDimensions?
  let displaySizes: [GettyDisplaySize]

  enum CodingKeys: String, CodingKey {
    case id, title
    case maxDimensions = "max_dimensions"
    case displaySizes = "display_sizes"
  }
}

// MARK: - Dimensions

struct GettyImageDimensions: Decodable {
  let width: Int?
  let height: Int?
}

// MARK: - Display size

struct GettyDisplaySize: Decodable {
  let name: String
  let uri: URL
}
```

Connect CE.SDK to Getty Images' premium stock photography library so users can
search and add professionally curated photos to their designs, served through a
secure proxy that keeps your API credentials off the device.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-import-media-from-remote-source-getty-images)

<EngineReferenceNote {...props} />

Getty Images offers premium, professionally curated stock photography through its API. You expose that library inside CE.SDK by implementing a custom asset source: a class that conforms to the `AssetSource` protocol, fetches results from your proxy, and maps them into the asset format the engine understands. Once registered, the source behaves like any other — it can be queried programmatically and surfaced in the asset library.

## Prerequisites

- Getty Images API credentials (an API key and secret) from the [Getty Images API Portal](https://developer.gettyimages.com/).
- Familiarity with Getty Images' API guidelines, rate limits, and licensing terms.
- A secure proxy server that authenticates with Getty Images on the app's behalf. Getty Images requires both a key and a secret, which must never ship inside a client app, so the source talks to your proxy rather than the Getty Images API directly. Setting up the proxy itself is out of scope here; the [web version of this guide](./getty-images.md) covers standing one up with the `gettyimages-api` package. This example decodes Getty Images' response and paginates on the client, so its proxy must forward Getty Images' raw `searchimages` JSON unchanged — a thin pass-through, not the response-translating proxy the web guide builds.

No third-party dependencies are required on the client — the example uses `URLSession` and `Codable` from Foundation.

## Understanding the Proxy Server Requirement

Getty Images authenticates every request with both an API key and a secret. Embedding those credentials in a distributed app would expose them, so a proxy server holds the credentials and forwards requests on the app's behalf:

**App (CE.SDK)** → **Your Proxy Server** → **Getty Images API**

The app sends a search phrase and pagination to the proxy; the proxy authenticates with Getty Images, runs the search, and returns the results. The example expects the proxy to forward the Getty Images `searchimages` response, so the client decodes Getty Images' native shape and translates it into CE.SDK assets. You configure the source with your proxy's host, and the source builds requests against a `/getty-proxy` path.

## Register the Asset Source

A custom asset source is any object conforming to the `AssetSource` protocol. Register it with `engine.asset.addSource(_:)`, passing the host of your proxy so the source can reach it:

```swift highlight-getty-definition
// Replace with the host of your Getty Images proxy server (see the prerequisites).
let proxyHost = "YOUR_GETTY_IMAGES_PROXY_HOST"
let source = GettyImagesAssetSource(proxyHost: proxyHost)
try engine.asset.addSource(source)
```

Pass your own proxy host in place of the `YOUR_GETTY_IMAGES_PROXY_HOST` placeholder. The source targets the `/getty-proxy` path on that host; override the `path` argument if your proxy exposes a different endpoint.

After registering, the source ID appears in `engine.asset.findAllSources()` alongside the engine's built-in sources:

```swift highlight-getty-verify
let registeredSources = engine.asset.findAllSources()
print("Registered asset sources: \(registeredSources)")
```

## Implement findAssets

The source wraps a single proxy endpoint that maps to Getty Images' search API. CE.SDK uses 0-based page indices, so it converts each page to the 1-based index Getty Images expects:

```swift highlight-getty-api-creation
public final class GettyImagesAssetSource: NSObject {
  private let decoder = JSONDecoder()
  private let host: String
  private let path: String

  public init(proxyHost: String, path: String = "/getty-proxy") {
    host = proxyHost
    self.path = path
  }

  private struct Endpoint {
    let query: [URLQueryItem]

    static func search(queryData: AssetQueryData) -> Self {
      Endpoint(
        query: [
          .init(name: "phrase", value: queryData.query),
          // Getty Images pages start at 1, while CE.SDK uses 0-based indices.
          .init(name: "page", value: String(queryData.page + 1)),
          .init(name: "page_size", value: String(queryData.perPage)),
        ],
      )
    }

    func url(host: String, path: String) -> URL? {
      var components = URLComponents()
      components.scheme = "https"
      components.host = host
      components.path = path
      components.queryItems = query
      return components.url
    }
  }
}
```

Conform to `AssetSource` by giving the source a unique `id` and implementing `findAssets(queryData:) async throws -> AssetQueryResult`. The method receives the current query — a search phrase plus pagination — and returns a page of results. Because it is `async`, you can back it with `URLSession`, a cache, or any client:

```swift highlight-getty-find-assets
  public static let id = "gettyImagesImageAssets"

  public var id: String {
    Self.id
  }

  public func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    guard let url = Endpoint.search(queryData: queryData).url(host: host, path: path) else {
      throw NSError(domain: "GettyImagesAssetSource", code: -1)
    }

    let data = try await URLSession.shared.data(from: url).0
    let response = try decoder.decode(GettyImagesSearchResponse.self, from: data)

    let total = response.resultCount ?? -1
    let loadedSoFar = (queryData.page + 1) * queryData.perPage
    let hasNextPage = !response.images.isEmpty && (total < 0 || loadedSoFar < total)

    return .init(
      assets: response.images.map(AssetResult.init),
      currentPage: queryData.page,
      nextPage: hasNextPage ? queryData.page + 1 : -1,
      total: total,
    )
  }
```

`findAssets` sends the phrase and pagination to the proxy, decodes the Getty Images response, then builds an `AssetQueryResult`:

- `currentPage` echoes the requested page.
- `nextPage` is the next page to request, or `-1` once a page comes back empty or the loaded results reach the reported total, so the engine stops querying.
- `total` is the overall result count Getty Images reports for the query; the source falls back to `-1` when it is absent.

## Translate Getty Images Photos to Assets

Each Getty Images photo becomes an `AssetResult`. The `meta` dictionary carries the values the engine needs to add the image to a scene:

```swift highlight-getty-translate
convenience init(image: GettyImage) {
  // Getty's searchimages display sizes are named (typically "comp", "preview", "thumb").
  // Pick the largest for the imported asset and a smaller one for the library thumbnail so
  // the grid loads lightweight previews instead of full-resolution comps.
  let sizesByName = Dictionary(
    image.displaySizes.map { ($0.name, $0.uri) },
    uniquingKeysWith: { first, _ in first },
  )
  let fullURL = sizesByName["comp"] ?? sizesByName["preview"] ?? image.displaySizes.first?.uri
  let thumbURL = sizesByName["thumb"] ?? sizesByName["preview"] ?? fullURL
  self.init(
    id: image.id,
    locale: "en",
    label: image.title,
    meta: [
      "uri": fullURL?.absoluteString ?? "",
      "thumbUri": thumbURL?.absoluteString ?? "",
      "blockType": DesignBlockType.graphic.rawValue,
      "fillType": FillType.image.rawValue,
      "shapeType": ShapeType.rect.rawValue,
      "kind": "image",
      "width": image.maxDimensions?.width.map(String.init) ?? "",
      "height": image.maxDimensions?.height.map(String.init) ?? "",
    ],
    context: .init(sourceID: GettyImagesAssetSource.id),
  )
}
```

- `uri` is the full-size `comp` display size; `thumbUri` prefers the smaller `thumb` (or `preview`) size, so the asset library grid loads lightweight previews instead of full-resolution comps.
- `blockType` and `fillType` tell the engine to create a graphic block with an image fill when the asset is applied. Setting them up front avoids a round-trip to infer the type from the file.
- `shapeType` and `kind` give the block a rectangle shape and mark its content as an image, so it renders correctly without further setup.
- `width` and `height` come from the photo's maximum dimensions so the engine can size the block correctly.
- `context.sourceID` links the result back to the Getty Images source.

## Handle Licensing and Attribution

Getty Images content is premium and is not royalty-free. Describe the provider and its license once at the source level so the editor can surface attribution for every result:

```swift highlight-getty-credits-license
  public var credits: AssetCredits? {
    .init(
      name: "Getty Images",
      url: URL(string: "https://www.gettyimages.com/")!,
    )
  }

  public var license: AssetLicense? {
    .init(
      name: "Getty Images Content License Agreement",
      url: URL(string: "https://www.gettyimages.com/eula")!,
    )
  }
```

The license URL points to Getty Images' End User License Agreement for reference. Keep these points in mind:

- Getty Images content requires a licensing agreement for production use.
- Attribution requirements depend on the license type you hold.
- Consult Getty Images' licensing terms for your specific use case.

## Configure the Asset Library UI

Registering the source makes it queryable through the Asset API but does not add it to an editor's asset library. On iOS, the Customize Asset Library guide covers adding a source to the default library and building a fully custom one.

## Query the Source

Once registered, query the source through the standard Asset API. Pass a search phrase and pagination:

```swift highlight-getty-findAssets
let results = try await engine.asset.findAssets(
  sourceID: GettyImagesAssetSource.id,
  query: .init(query: "business", page: 0, perPage: 20),
)
print("Getty Images returned \(results.assets.count) photos for 'business'")
```

The returned `AssetResult` values can be added to a scene with `engine.asset.apply(sourceID:assetResult:)`.

## Troubleshooting

- **Authentication errors:** Confirm your proxy authenticates with Getty Images using a valid key and secret, and that the app points at the correct proxy host.
- **Rate limiting:** Getty Images enforces per-account request limits. Cache results and avoid re-querying on every keystroke to stay within them.
- **Missing attribution:** Verify the source-level `credits` and `license` are populated; the editor uses them to display Getty Images attribution.
- **Images fail to load:** Check that the proxy returns usable `display_sizes` URLs and that they are reachable from the device's network over HTTPS.
- **Pagination issues:** The client already converts CE.SDK's 0-based index to Getty Images' 1-based page number before sending it; the proxy must forward that page through unchanged rather than converting it again.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register an object conforming to `AssetSource` (such as `GettyImagesAssetSource`) as a custom source. |
| `engine.asset.findAllSources()` | List the IDs of every registered asset source. |
| `engine.asset.findAssets(sourceID:query:)` | Query a source for a page of results, returning an `AssetQueryResult`. |
| `engine.asset.apply(sourceID:assetResult:)` | Add a queried asset to the scene as a design block. |

## Next Steps

- Customize Asset Library — Surface the source in the editor's asset panels.
- [Integrate Unsplash Images](./unsplash.md) — Add another remote stock-image source.
- [Integrate Pexels Images](./pexels.md) — A free royalty-free stock photo alternative.
- [Asset Concepts](../concepts.md) — Learn the core import and asset-source concepts.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support