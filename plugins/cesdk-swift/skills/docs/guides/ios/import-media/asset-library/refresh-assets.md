> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Refresh Assets](./refresh-assets.md)

---

```swift file=@cesdk_swift_examples/editor-guides-import-media-asset-library-refresh-assets/RefreshAssetsSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// One record in a simulated external store (a CMS, cloud storage, or upload
/// service).
struct CloudImage {
  let id: String
  let fileName: String
  let name: String
  let width: String
  let height: String
}

/// The external store, standing in for a backend whose contents change while
/// the app runs. Modeled as an `actor` because the asset source reads it from a
/// background task while the UI mutates it from the main actor. Here it simply
/// publishes more of a fixed catalog on demand; a real store would talk to a
/// server.
actor CloudImageStore {
  private let catalog: [CloudImage]
  private var publishedCount = 1

  init(catalog: [CloudImage]) {
    self.catalog = catalog
  }

  /// The images the store currently serves.
  var publishedImages: [CloudImage] {
    Array(catalog.prefix(publishedCount))
  }

  /// Publishes one more image from the catalog. Returns `true` if the published
  /// set actually changed.
  func publishNextImage() -> Bool {
    guard publishedCount < catalog.count else { return false }
    publishedCount += 1
    return true
  }

  /// Resets the store to its initial single image. Returns `true` if anything
  /// changed.
  func reset() -> Bool {
    guard publishedCount > 1 else { return false }
    publishedCount = 1
    return true
  }
}

/// A custom asset source that serves the store's images. The asset library
/// calls `findAssets` whenever it queries the source, so it always reflects the
/// store's current contents.
final class CloudImageAssetSource: NSObject, AssetSource {
  static let sourceID = "cloud-images"

  private let store: CloudImageStore
  private let baseURL: String

  init(store: CloudImageStore, baseURL: String) {
    self.store = store
    self.baseURL = baseURL
    super.init()
  }

  var id: String {
    Self.sourceID
  }

  var supportedMIMETypes: [String]? {
    ["image/jpeg"]
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let needle = queryData.query?.lowercased()
    let matches = await store.publishedImages.filter { image in
      guard let needle, !needle.isEmpty else { return true }
      return image.name.lowercased().contains(needle)
    }

    let assets = matches.map { image in
      AssetResult(
        id: image.id,
        label: image.name,
        meta: [
          "uri": "\(baseURL)/ly.img.image/images/\(image.fileName)",
          "thumbUri": "\(baseURL)/ly.img.image/thumbnails/\(image.fileName)",
          // `fillType` makes the inserted block an image fill (the engine would
          // otherwise default to a solid color); `width`/`height` set the aspect
          // ratio before the image finishes loading.
          "fillType": "//ly.img.ubq/fill/image",
          "width": image.width,
          "height": image.height,
        ],
        context: .init(sourceID: id),
      )
    }

    return AssetQueryResult(assets: assets, currentPage: queryData.page, total: assets.count)
  }
}

/// Editor demonstrating how the asset library stays in sync with a custom
/// source: navigation-bar buttons change the external store at runtime and the
/// open library refreshes to match.
struct RefreshAssetsSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
    baseURL: secrets.baseURL, // read back below via getSettingString("basePath")
  )

  /// The external store, owned by the view so the navigation-bar buttons and
  /// the registered source share the same instance.
  @State private var store = CloudImageStore(catalog: [
    CloudImage(id: "cloud-1", fileName: "sample_1.jpg", name: "Mountain Landscape", width: "2500", height: "1667"),
    CloudImage(id: "cloud-2", fileName: "sample_2.jpg", name: "Ocean Sunset", width: "2500", height: "1667"),
    CloudImage(id: "cloud-3", fileName: "sample_3.jpg", name: "Forest Path", width: "1667", height: "2500"),
    CloudImage(id: "cloud-4", fileName: "sample_4.jpg", name: "City Skyline", width: "1667", height: "2500"),
  ])

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            // GuideEditorConfiguration ships no scene, so build the page the
            // editor renders on before registering the source.
            let scene = try engine.scene.create()
            let page = try engine.block.create(.page)
            try engine.block.appendChild(to: scene, child: page)
            try engine.block.setWidth(page, value: 1080)
            try engine.block.setHeight(page, value: 1080)

            // Wrap the store in an asset source and register it. The source's
            // image URLs resolve against the engine's `basePath`
            // setting—initialized from `EngineSettings(baseURL:)`.
            let source = CloudImageAssetSource(
              store: store,
              baseURL: try engine.editor.getSettingString("basePath"),
            )
            try engine.asset.addSource(source)
          }
          builder.navigationBar { navigationBar in
            navigationBar.modify { _, items in
              items.addLast(placement: .topBarLeading) {
                // Publishes another image to the store, then tells the engine
                // the source changed. The editor forwards that to the open
                // library, which re-queries and shows the new image right away.
                NavigationBar.Button(id: "ly.img.guide.navigationBar.button.addCloudImage") { context in
                  let engine = context.engine
                  Task {
                    guard await store.publishNextImage(), let engine else { return }
                    try? engine.asset.assetSourceContentsChanged(sourceID: CloudImageAssetSource.sourceID)
                  }
                } label: { _ in
                  Label("Add Image", systemImage: "plus.circle")
                }
                // Resets the store to its single starting image and refreshes.
                NavigationBar.Button(id: "ly.img.guide.navigationBar.button.resetCloudImages") { context in
                  let engine = context.engine
                  Task {
                    guard await store.reset(), let engine else { return }
                    try? engine.asset.assetSourceContentsChanged(sourceID: CloudImageAssetSource.sourceID)
                  }
                } label: { _ in
                  Label("Reset", systemImage: "arrow.counterclockwise")
                }
              }
            }
          }
          builder.assetLibrary { assetLibrary in
            assetLibrary.categories([
              .init(
                id: AssetLibraryCategory.ID.images,
                title: .imgly.localized("ly_img_editor_asset_library_title_images"),
                icon: Image(systemName: "photo"),
                sections: [
                  .image(id: "cloud-images", title: "Cloud Images", source: .init(id: CloudImageAssetSource.sourceID)),
                ],
              ),
            ])
          }
          builder.dock { dock in
            dock.items { _ in
              // Open the images library at a medium detent so the navigation
              // bar stays visible and tappable while the library is open.
              Dock.Buttons.imagesLibrary(action: { context in
                context.eventHandler.send(.openSheet(type: .libraryAdd(style: .addAsset(detent: .imgly.medium)) {
                  context.assetLibrary.imagesTab
                }))
              })
            }
          }
        }
      }
  }

  @State private var isPresented = false

  var body: some View {
    Button("Use the Editor") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        editor
      }
    }
  }
}

#Preview {
  RefreshAssetsSolution()
}
```

Serve images from a custom asset source and keep the asset library in step with the source's contents. When the source's backing store changes—through a custom CMS, cloud storage, or upload service—call `assetSourceContentsChanged(sourceID:)` and the open library re-queries the source and updates in place.

![The editor's asset library open at a medium detent on a custom cloud image source, with navigation-bar buttons that refresh it live](https://img.ly/docs/cesdk/ios/import-media/asset-library/refresh-assets-382060/assets/ios.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/editor-guides-import-media-asset-library-refresh-assets)

This guide registers a custom asset source backed by an external store, surfaces it in the asset library, and refreshes the library live when the store changes. It builds on the asset source, asset library, and dock setup introduced in the [Asset Library Basics](./basics.md) guide, on top of the editor configuration covered by the [Configuration](../../configuration.md) guide.

The example wraps the editor in `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260903/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration class—the `onCreate`, `navigationBar`, `assetLibrary`, and `dock` builders are available on every configuration, so the rest of the calls stay the same.

## When to Use Asset Refresh

CE.SDK refreshes the asset library on its own for changes the engine makes. You only call `assetSourceContentsChanged(sourceID:)` when a source's contents change outside the engine's knowledge.

**Automatic refresh** (no action needed):

- Uploads through the built-in upload flow—`engine.asset.addAsset(to:asset:)` reports the change internally, so the library shows new uploads without any extra call.
- Additions from the Photo Roll asset source.
- Any add or remove made through the engine's asset APIs (`addAsset`, `removeAsset`).

**Manual refresh required**—call `assetSourceContentsChanged(sourceID:)` after:

- A backend or CMS updates the content a custom source serves.
- A sync with external cloud storage adds, replaces, or removes files.
- A background task pulls new assets into the store behind a custom source.
- Real-time collaboration, when another client changes a shared source's contents.

## Registering a Custom Asset Source

A source that serves content from an external system implements the `AssetSource` protocol. Its `findAssets(queryData:)` method reads the store's current contents on each call, so every query returns up-to-date results. Here the store is a small `actor` standing in for a backend; in your app it would talk to a server.

```swift highlight-refreshAssets-source
/// One record in a simulated external store (a CMS, cloud storage, or upload
/// service).
struct CloudImage {
  let id: String
  let fileName: String
  let name: String
  let width: String
  let height: String
}

/// The external store, standing in for a backend whose contents change while
/// the app runs. Modeled as an `actor` because the asset source reads it from a
/// background task while the UI mutates it from the main actor. Here it simply
/// publishes more of a fixed catalog on demand; a real store would talk to a
/// server.
actor CloudImageStore {
  private let catalog: [CloudImage]
  private var publishedCount = 1

  init(catalog: [CloudImage]) {
    self.catalog = catalog
  }

  /// The images the store currently serves.
  var publishedImages: [CloudImage] {
    Array(catalog.prefix(publishedCount))
  }

  /// Publishes one more image from the catalog. Returns `true` if the published
  /// set actually changed.
  func publishNextImage() -> Bool {
    guard publishedCount < catalog.count else { return false }
    publishedCount += 1
    return true
  }

  /// Resets the store to its initial single image. Returns `true` if anything
  /// changed.
  func reset() -> Bool {
    guard publishedCount > 1 else { return false }
    publishedCount = 1
    return true
  }
}

/// A custom asset source that serves the store's images. The asset library
/// calls `findAssets` whenever it queries the source, so it always reflects the
/// store's current contents.
final class CloudImageAssetSource: NSObject, AssetSource {
  static let sourceID = "cloud-images"

  private let store: CloudImageStore
  private let baseURL: String

  init(store: CloudImageStore, baseURL: String) {
    self.store = store
    self.baseURL = baseURL
    super.init()
  }

  var id: String {
    Self.sourceID
  }

  var supportedMIMETypes: [String]? {
    ["image/jpeg"]
  }

  var credits: AssetCredits? {
    nil
  }

  var license: AssetLicense? {
    nil
  }

  func findAssets(queryData: AssetQueryData) async throws -> AssetQueryResult {
    let needle = queryData.query?.lowercased()
    let matches = await store.publishedImages.filter { image in
      guard let needle, !needle.isEmpty else { return true }
      return image.name.lowercased().contains(needle)
    }

    let assets = matches.map { image in
      AssetResult(
        id: image.id,
        label: image.name,
        meta: [
          "uri": "\(baseURL)/ly.img.image/images/\(image.fileName)",
          "thumbUri": "\(baseURL)/ly.img.image/thumbnails/\(image.fileName)",
          // `fillType` makes the inserted block an image fill (the engine would
          // otherwise default to a solid color); `width`/`height` set the aspect
          // ratio before the image finishes loading.
          "fillType": "//ly.img.ubq/fill/image",
          "width": image.width,
          "height": image.height,
        ],
        context: .init(sourceID: id),
      )
    }

    return AssetQueryResult(assets: assets, currentPage: queryData.page, total: assets.count)
  }
}
```

Register the source on the engine with `engine.asset.addSource(_:)`. Do this in the configuration's [callback](../../user-interface/events.md), where the engine is available before the editor presents its UI. The source's image URLs resolve against the engine's `basePath` setting—initialized from `EngineSettings(baseURL:)`—so they follow whatever asset host you configure. For more on asset sources and the asset metadata schema, see [Asset Concepts](../concepts.md).

```swift highlight-refreshAssets-register
// Wrap the store in an asset source and register it. The source's
// image URLs resolve against the engine's `basePath`
// setting—initialized from `EngineSettings(baseURL:)`.
let source = CloudImageAssetSource(
  store: store,
  baseURL: try engine.editor.getSettingString("basePath"),
)
try engine.asset.addSource(source)
```

## Refreshing the Library on Source Changes

When the store changes, call `engine.asset.assetSourceContentsChanged(sourceID:)`. This emits the source's `onAssetSourceUpdated` event, which the editor observes and turns into a refresh of any open library showing that source—the library re-queries `findAssets` and updates in place, no reopen required.

The example wires two navigation-bar buttons that mutate the store and fire that event. Because the library opens at a medium detent (see below), the navigation bar stays tappable while the library is visible, so you can watch it update live.

```swift highlight-refreshAssets-refresh
builder.navigationBar { navigationBar in
  navigationBar.modify { _, items in
    items.addLast(placement: .topBarLeading) {
      // Publishes another image to the store, then tells the engine
      // the source changed. The editor forwards that to the open
      // library, which re-queries and shows the new image right away.
      NavigationBar.Button(id: "ly.img.guide.navigationBar.button.addCloudImage") { context in
        let engine = context.engine
        Task {
          guard await store.publishNextImage(), let engine else { return }
          try? engine.asset.assetSourceContentsChanged(sourceID: CloudImageAssetSource.sourceID)
        }
      } label: { _ in
        Label("Add Image", systemImage: "plus.circle")
      }
      // Resets the store to its single starting image and refreshes.
      NavigationBar.Button(id: "ly.img.guide.navigationBar.button.resetCloudImages") { context in
        let engine = context.engine
        Task {
          guard await store.reset(), let engine else { return }
          try? engine.asset.assetSourceContentsChanged(sourceID: CloudImageAssetSource.sourceID)
        }
      } label: { _ in
        Label("Reset", systemImage: "arrow.counterclockwise")
      }
    }
  }
}
```

To run your own logic when a source changes—updating a badge, refreshing a view you built yourself—observe `engine.asset.onAssetSourceUpdated` directly; it emits the changed source's ID. The editor already observes it to refresh the built-in library.

## Displaying the Source in the Library

Surface the source as a library category so users can browse it, and add a dock button to open it. Using `AssetLibraryCategory.ID.images` as the category ID ties it to the images dock button.

```swift highlight-refreshAssets-library
builder.assetLibrary { assetLibrary in
  assetLibrary.categories([
    .init(
      id: AssetLibraryCategory.ID.images,
      title: .imgly.localized("ly_img_editor_asset_library_title_images"),
      icon: Image(systemName: "photo"),
      sections: [
        .image(id: "cloud-images", title: "Cloud Images", source: .init(id: CloudImageAssetSource.sourceID)),
      ],
    ),
  ])
}
```

Open the images library at a medium detent by passing `SheetStyle.addAsset(detent: .imgly.medium)` to the sheet the dock button presents. A medium detent leaves the top of the editor—including the navigation bar—visible and interactive, so the buttons above can drive the library while it is open.

```swift highlight-refreshAssets-dock
builder.dock { dock in
  dock.items { _ in
    // Open the images library at a medium detent so the navigation
    // bar stays visible and tappable while the library is open.
    Dock.Buttons.imagesLibrary(action: { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd(style: .addAsset(detent: .imgly.medium)) {
        context.assetLibrary.imagesTab
      }))
    })
  }
}
```

## Troubleshooting

**Assets not appearing:**

Verify the source ID in the library section matches the ID you register with `addSource(_:)`, and that `findAssets(queryData:)` returns results for the query. Source IDs are case-sensitive.

**Library not refreshing after a change:**

Confirm you call `assetSourceContentsChanged(sourceID:)` with the same source ID after mutating the store, and that `findAssets(queryData:)` reflects the change. The refresh only reaches libraries that are currently showing that source.

**Thumbnails not loading:**

Confirm `thumbUri` points at a reachable image. Here it resolves against the engine's `basePath`; the built-in `ly.img.image` source ships thumbnails under `ly.img.image/thumbnails/`.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addSource(_:)` | Register a custom `AssetSource` with the engine. |
| `AssetSource.findAssets(queryData:)` | Protocol method returning the source's current assets for a query; the library calls it each time it queries the source. |
| `engine.asset.assetSourceContentsChanged(sourceID:)` | Signal that a source's contents changed; refreshes any open library showing that source and emits `onAssetSourceUpdated`. |
| `engine.asset.onAssetSourceUpdated` | An `AsyncStream` that emits a source ID whenever that source's contents change. |
| `assetLibrary.categories([…])` | Define the library's categories (replaces the editor defaults). |
| `AssetLibrarySection.image(id:title:source:)` | A titled image section backed by an asset source ID. |
| `NavigationBar.Button(id:action:label:)` | A custom navigation-bar button; `action` receives the editor context and its `engine`. |
| `Dock.Buttons.imagesLibrary(action:)` | Predefined dock button that opens the images tab of the asset library. |
| `SheetStyle.addAsset(detent:detents:)` | Sheet style for the asset library; set `detent` to `.imgly.medium` to keep the navigation bar interactive. |

## Next Steps

- [Asset Library Basics](./basics.md) — Register sources, configure categories, and add library dock buttons.
- [Asset Concepts](../concepts.md) — Create and configure engine-level asset sources.
- [Import Remote Assets](../from-remote-source/remote-asset.md) — Load asset definitions from remote JSON manifests hosted on a CDN or server.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support