> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Customize](./customize.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-asset-library/AssetLibraryEditorSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

struct AssetLibraryEditorSolution: View {
  var settings: EngineSettings {
    EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                   userID: "<your unique user id>",
                   baseURL: secrets.baseURL) // read back below via getSettingString("basePath")
  }

  /// The recommended path the guide leads with and the view the showcase presents.
  ///
  /// `assetLibrary.categories([...])` supplies the complete, ordered list of tabs,
  /// mixing a custom category with the editor's predefined categories.
  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            try await registerSources(engine)
          }
          builder.assetLibrary { assetLibrary in
            assetLibrary.categories([
              // The Elements meta-category combines every other category below — including
              // the custom one — into a single scrollable tab.
              .defaultElements,
              AssetLibraryCategory(
                id: AssetLibraryCategory.ID.images,
                title: "Images",
                icon: Image(systemName: "photo"),
                sections: [
                  .image(id: "brand-images", title: "Brand Images", source: .init(id: "brand-images")),
                ],
              ),
              .defaultShapes,
              .defaultStickers,
            ])
          }
          builder.dock { dock in
            dock.items { _ in
              // The Elements button opens the combined tab, which includes the custom category.
              Dock.Buttons.elementsLibrary()
              // The custom category reuses `AssetLibraryCategory.ID.images`, so the default
              // images button opens it automatically — no custom action needed.
              Dock.Buttons.imagesLibrary()
            }
          }
        }
      }
  }

  /// The `modify` path: adjust the editor's default categories instead of replacing them.
  ///
  /// Not presented at runtime — it exists so the guide's highlight markers reference
  /// complete, compiled code for the modify section.
  var modifyEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            try await registerSources(engine)
          }
          builder.assetLibrary { assetLibrary in
            assetLibrary.modify { categories in
              // Add the custom "Brand Images" section to the top of the images category.
              categories.modifySections(of: AssetLibraryCategory.ID.images) { sections in
                sections.addFirst(.image(
                  id: "brand-images",
                  title: "Brand Images",
                  source: .init(id: "brand-images"),
                ))
              }
              // Drop the device photo roll category.
              categories.remove(id: AssetLibraryCategory.ID.photoRoll)
            }
          }
        }
      }
  }

  /// The `view` path: replace the library with a fully custom `AssetLibrary` view.
  ///
  /// Not presented at runtime — it exists so the guide's highlight markers reference
  /// complete, compiled code for the custom-view section.
  var viewEditor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onCreate { engine, _ in
            try await registerSources(engine)
          }
          builder.assetLibrary { assetLibrary in
            assetLibrary.view { categories in
              // `AssetLibraryView` is the default `AssetLibrary` conformer; return your own
              // type for full control. `categories` carries any `modify` changes already applied.
              AssetLibraryView(categories: categories)
            }
          }
          builder.dock { dock in
            dock.items { _ in
              // A custom dock button can open an ad-hoc library sheet whose content is
              // built with the `@AssetLibraryBuilder` DSL — `AssetLibrarySource` rows
              // grouped with `AssetLibraryGroup`. This sheet is independent of the
              // configured `assetLibrary` above.
              Dock.Button(id: "my.app.dock.brandImages") { context in
                context.eventHandler.send(.openSheet(type: .libraryAdd("Brand Images") {
                  AssetLibrarySource.image(.title("Brand Images"), source: .init(id: "brand-images"))
                }))
              } label: { _ in
                Label("Brand Images", systemImage: "photo.stack")
              }
            }
          }
        }
      }
  }

  /// Registers the asset sources the categories above reference. The custom "Brand Images"
  /// section is backed by an in-memory source; the predefined categories pull from CE.SDK's
  /// bundled shape and sticker content. See the Asset Library Basics guide for the details
  /// of source registration.
  private func registerSources(_ engine: Engine) async throws {
    let scene = try engine.scene.create()
    let page = try engine.block.create(.page)
    try engine.block.appendChild(to: scene, child: page)
    try engine.block.setWidth(page, value: 1080)
    try engine.block.setHeight(page, value: 1080)

    let basePath = try engine.editor.getSettingString("basePath")

    // The custom category's in-memory source, populated from bundled `ly.img.image` content.
    let sourceID = "brand-images"
    try engine.asset.addLocalSource(sourceID: sourceID)
    let images = [
      (id: "sample-1", label: "Sample 1", fileName: "sample_1.jpg", width: "2500", height: "1667"),
      (id: "sample-2", label: "Sample 2", fileName: "sample_2.jpg", width: "2500", height: "1667"),
      (id: "sample-3", label: "Sample 3", fileName: "sample_3.jpg", width: "1667", height: "2500"),
    ]
    for image in images {
      try engine.asset.addAsset(
        to: sourceID,
        asset: AssetDefinition(
          id: image.id,
          meta: [
            "uri": "\(basePath)/ly.img.image/images/\(image.fileName)",
            "thumbUri": "\(basePath)/ly.img.image/thumbnails/\(image.fileName)",
            "fillType": "//ly.img.ubq/fill/image",
            "width": image.width,
            "height": image.height,
          ],
          label: ["en": image.label],
        ),
      )
    }

    // The predefined `.defaultShapes` / `.defaultStickers` / `.defaultElements` categories
    // reference these bundled sources; register them so their tabs render.
    if let baseURL = URL(string: basePath) {
      for predefinedSource in ["ly.img.vector.shape", "ly.img.sticker"] {
        _ = try await engine.asset.addLocalAssetSourceFromJSON(
          baseURL.appendingPathComponent(predefinedSource).appendingPathComponent("content.json"),
        )
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
  AssetLibraryEditorSolution()
}
```

Decide which categories (tabs) appear in the asset library, adjust the editor's default categories, or replace the library with a fully custom view.

![The editor's asset library open on the combined Elements tab, showing a custom Images category alongside the default shapes and stickers](https://img.ly/docs/cesdk/ios/import-media/asset-library/customize-c9a4de/assets/ios.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260904/editor-guides-configuration-asset-library)

This guide picks up where the [Asset Library Basics](./basics.md) guide leaves off. Basics registers a source, surfaces one category, and adds a dock button; this guide covers tab ordering, mixing custom and default categories, modifying the defaults, building a fully custom library view, and opening an ad-hoc, button-specific library. It does not re-teach source registration or the source → library → dock layering.

You configure the asset library on the same `EditorConfiguration` builder where you configure the dock, navigation bar, inspector bar, and canvas menu. The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

The examples wrap the editor in `GuideEditorConfiguration`, a small helper class the [iOS guides repository](https://github.com/imgly/cesdk-swift-examples/blob/v1.83.0-nightly.20260904/editor-guides-quickstart/GuideEditorConfiguration.swift) ships as a minimal baseline. Substitute your own editor configuration class — the `assetLibrary` builder is available on every configuration, so the rest of the calls stay the same.

## Configuration

Configure the asset library on the editor configuration builder's `assetLibrary` property — `builder.assetLibrary { assetLibrary in … }` inside the `imgly.configuration` closure. The builder offers three methods, in increasing complexity:

| Method | Best for |
|--------|----------|
| `assetLibrary.categories(_:)` | Defining the complete, ordered list of tabs. The recommended starting point. |
| `assetLibrary.modify(_:)` | Adjusting the editor's default categories without rebuilding the list. |
| `assetLibrary.view(_:)` | Replacing the library with a fully custom view. |

`categories` and `view` are single values: the last configuration to set either one wins, so they **replace**. `modify` modifications **accumulate** — a base configuration can set the list with `categories` while later configurations or plugins still layer their `modify` changes on top.

The example's `EngineSettings` reads its base URL back through `engine.editor.getSettingString("basePath")` in `onCreate` to resolve asset URIs, so it passes `baseURL:`:

```swift highlight-assetLibrary-configuration
  var settings: EngineSettings {
    EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                   userID: "<your unique user id>",
                   baseURL: secrets.baseURL) // read back below via getSettingString("basePath")
  }
```

The example registers the asset sources its categories reference in `onCreate`. See the [Asset Library Basics](./basics.md) guide for the details of source registration.

## Define the Library with Categories

`assetLibrary.categories([...])` supplies the complete, ordered list of categories. The array order is the tab order. Mix a custom `AssetLibraryCategory(id:title:icon:sections:)` with the editor's predefined categories — `.defaultImages`, `.defaultShapes`, `.defaultStickers`, `.defaultText`, and `.defaultElements` (the combined tab that groups every other category):

```swift highlight-assetLibrary-categories
builder.assetLibrary { assetLibrary in
  assetLibrary.categories([
    // The Elements meta-category combines every other category below — including
    // the custom one — into a single scrollable tab.
    .defaultElements,
    AssetLibraryCategory(
      id: AssetLibraryCategory.ID.images,
      title: "Images",
      icon: Image(systemName: "photo"),
      sections: [
        .image(id: "brand-images", title: "Brand Images", source: .init(id: "brand-images")),
      ],
    ),
    .defaultShapes,
    .defaultStickers,
  ])
}
```

Each `AssetLibraryCategory` becomes a tab, and its `sections` hold the rows of assets. `AssetLibrarySection.image(id:title:source:)` adds a section that queries a registered source — the `id` passed to `source:` must match a `sourceID` registered with the engine:

```swift highlight-assetLibrary-customCategory
AssetLibraryCategory(
  id: AssetLibraryCategory.ID.images,
  title: "Images",
  icon: Image(systemName: "photo"),
  sections: [
    .image(id: "brand-images", title: "Brand Images", source: .init(id: "brand-images")),
  ],
),
```

The dock button that opens each tab comes from the same configuration. The example's dock includes the Elements button, which opens the combined tab, and the images button:

```swift highlight-assetLibrary-dock
builder.dock { dock in
  dock.items { _ in
    // The Elements button opens the combined tab, which includes the custom category.
    Dock.Buttons.elementsLibrary()
    // The custom category reuses `AssetLibraryCategory.ID.images`, so the default
    // images button opens it automatically — no custom action needed.
    Dock.Buttons.imagesLibrary()
  }
}
```

## Category IDs and the Built-in UI

The editor resolves its built-in typed tabs by matching a category's `id` against the values in `AssetLibraryCategory.ID`. Two built-in UI elements rely on this:

- The default dock library buttons. `Dock.Buttons.imagesLibrary()` opens the tab whose category `id` is `AssetLibraryCategory.ID.images`.
- The inspector bar's **Replace** button (`InspectorBar.Buttons.replace`). When a block is selected, it opens the library tab that matches the block's fill or type — the images tab for an image fill.

In the example above, the custom category uses `id: AssetLibraryCategory.ID.images`. That single choice wires it into both built-in buttons automatically: the default images dock button opens it, and Replace surfaces it for image blocks. Give a category an arbitrary id instead, and it becomes a standalone tab that the built-in typed buttons won't reach — you'd open it from its own custom dock button (shown in [Custom Library Buttons](./customize.md#custom-library-buttons)).

## Modify the Default Categories

Use `assetLibrary.modify { categories in … }` to adjust the editor's default categories without rebuilding the whole list. The closure receives a `CategoryModifier` with `addFirst`/`addLast`/`addAfter(id:)`/`addBefore(id:)`/`replace(id:)`/`remove(id:)`, plus `modifySections(of:)` to edit a category's sections. Target categories by their `AssetLibraryCategory.ID` value:

```swift highlight-assetLibrary-modify
builder.assetLibrary { assetLibrary in
  assetLibrary.modify { categories in
    // Add the custom "Brand Images" section to the top of the images category.
    categories.modifySections(of: AssetLibraryCategory.ID.images) { sections in
      sections.addFirst(.image(
        id: "brand-images",
        title: "Brand Images",
        source: .init(id: "brand-images"),
      ))
    }
    // Drop the device photo roll category.
    categories.remove(id: AssetLibraryCategory.ID.photoRoll)
  }
}
```

`modifySections(of:)` reaches into a category's section list — here it prepends the custom "Brand Images" section to the images category — while `remove(id:)` drops the photo roll category entirely.

Unlike `categories` and `view`, `modify` **composes**: every configuration and plugin in the chain applies its modifications on top of the resolved list, so your changes layer with theirs instead of replacing the whole library. The id-based operations (`addAfter`, `addBefore`, `replace`, `remove`, and `modifySections(of:)`) throw if no category with that id is present when the modifications are applied, so every id you reference must exist in the list.

## A Fully Custom Library View

When the category model isn't enough, `assetLibrary.view { categories in … }` replaces the library with any type conforming to the `AssetLibrary` protocol. The closure receives the resolved categories — including any `modify` changes already applied — and returns the view that renders them:

```swift highlight-assetLibrary-view
builder.assetLibrary { assetLibrary in
  assetLibrary.view { categories in
    // `AssetLibraryView` is the default `AssetLibrary` conformer; return your own
    // type for full control. `categories` carries any `modify` changes already applied.
    AssetLibraryView(categories: categories)
  }
}
```

`AssetLibraryView` is the default `AssetLibrary` conformer; its `init(categories:includeAVResources:)` renders the categories it's handed. Return your own `AssetLibrary` type for full control over the library UI.

## Custom Library Buttons

A custom dock button can open an ad-hoc library sheet that is independent of the configured `assetLibrary`. Send an `.openSheet(type: .libraryAdd(_:content:))` event whose content is built with the `@AssetLibraryBuilder` DSL — `AssetLibrarySource` rows, grouped with `AssetLibraryGroup`:

```swift highlight-assetLibrary-customButton
builder.dock { dock in
  dock.items { _ in
    // A custom dock button can open an ad-hoc library sheet whose content is
    // built with the `@AssetLibraryBuilder` DSL — `AssetLibrarySource` rows
    // grouped with `AssetLibraryGroup`. This sheet is independent of the
    // configured `assetLibrary` above.
    Dock.Button(id: "my.app.dock.brandImages") { context in
      context.eventHandler.send(.openSheet(type: .libraryAdd("Brand Images") {
        AssetLibrarySource.image(.title("Brand Images"), source: .init(id: "brand-images"))
      }))
    } label: { _ in
      Label("Brand Images", systemImage: "photo.stack")
    }
  }
}
```

This sheet defines its own one-off library UI: it isn't tied to the categories you configured, so it's the way to surface a standalone source (or a curated mix of sources) from a button without adding it to the main library.

## API Reference

### Configuration

| Method | Description |
| --- | --- |
| `builder.assetLibrary { assetLibrary in … }` | Enter asset library configuration on the editor configuration builder. |
| `assetLibrary.categories(_:)` | Define the complete, ordered category list (replaces the editor defaults). |
| `assetLibrary.modify(_:)` | Adjust the default categories and sections (composes across configurations). |
| `assetLibrary.view(_:)` | Supply a fully custom view conforming to `AssetLibrary`. |

### Library

| Symbol | Description |
| --- | --- |
| `AssetLibraryCategory(id:title:icon:sections:)` | A category (tab) holding asset sections. |
| `AssetLibraryCategory.defaultElements` (and siblings) | Predefined categories; `.defaultElements` is the combined tab. |
| `AssetLibraryCategory.ID.images` (and siblings) | Default category ids; reuse one to back a built-in typed tab. |
| `AssetLibrarySection.image(id:title:source:)` | A titled image section backed by an asset source id. |
| `CategoryModifier` | The modifier passed to `modify`; mutates categories with `addFirst`/`addLast`/`addAfter(id:)`/`addBefore(id:)`/`replace(id:)`/`remove(id:)`/`modifySections(of:)`. |
| `AssetLibraryView(categories:includeAVResources:)` | The default `AssetLibrary` conformer returned from `view`. |
| `AssetLibrarySource.image(_:source:)` / `AssetLibraryGroup` | View-based content for a `.libraryAdd` sheet. |

### Dock & Inspector Bar

| Symbol | Description |
| --- | --- |
| `Dock.Buttons.imagesLibrary()` | Built-in button that opens the images tab by category id. |
| `Dock.Buttons.elementsLibrary()` | Built-in button that opens the combined Elements tab. |
| `Dock.Button(id:action:label:)` | A custom dock button; open `.libraryAdd` for an ad-hoc library. |
| `InspectorBar.Buttons.replace` | Replace action; opens the library tab matching the selected block. |

## Next Steps

- [Asset Library Basics](./basics.md) — Sources, a first category, and a dock button.
- [Thumbnails](./thumbnails.md) — Configure thumbnail display and grid layout.
- [Refresh Assets](./refresh-assets.md) — Update the library when external changes occur.
- [Serve Assets](../../serve-assets.md) — The default sources and how to host them.
- [From Your Server](../from-remote-source/your-server.md) — Create custom asset sources from your own backend.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support