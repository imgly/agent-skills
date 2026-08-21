> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Basics](./basics.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-import-media-asset-library-basics/AssetLibraryBasicsEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import ly.img.editor.Editor
import ly.img.editor.core.R
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberImagesLibrary
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlockType
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

private const val BRAND_IMAGE_SOURCE_ID = "ly.img.asset.source.brand.images"

@Composable
fun AssetLibraryBasicsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    val engine = editorContext.engine
                    if (engine.scene.get() == null) {
                        val scene = engine.scene.create()
                        val page = engine.block.create(DesignBlockType.Page)
                        engine.block.setWidth(block = page, value = 1080F)
                        engine.block.setHeight(block = page, value = 1080F)
                        engine.block.appendChild(parent = scene, child = page)
                    }

                    val assetEngine = editorContext.engine
                    if (BRAND_IMAGE_SOURCE_ID !in assetEngine.asset.findAllSources()) {
                        assetEngine.asset.addLocalSource(
                            sourceId = BRAND_IMAGE_SOURCE_ID,
                            supportedMimeTypes = listOf(MimeType.JPEG.key),
                        )
                        assetEngine.asset.addAsset(
                            sourceId = BRAND_IMAGE_SOURCE_ID,
                            asset = AssetDefinition(
                                id = "brand-background",
                                label = mapOf("en" to "Brand Background"),
                                tags = mapOf("en" to listOf("brand", "background")),
                                groups = listOf("campaign"),
                                meta = mapOf(
                                    "uri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                                    "thumbUri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                                    "mimeType" to MimeType.JPEG.key,
                                    "kind" to "image",
                                    "blockType" to DesignBlockType.Graphic.key,
                                    "fillType" to FillType.Image.key,
                                    "shapeType" to ShapeType.Rect.key,
                                    "width" to "1080",
                                    "height" to "720",
                                ),
                            ),
                        )
                        assetEngine.asset.assetSourceContentsChanged(sourceId = BRAND_IMAGE_SOURCE_ID)
                    }
                }

                assetLibrary = {
                    remember {
                        val brandSourceType = AssetSourceType(sourceId = BRAND_IMAGE_SOURCE_ID)
                        val brandImagesSection = LibraryContent.Section(
                            titleRes = R.string.ly_img_editor_asset_library_section_images,
                            sourceTypes = listOf(brandSourceType),
                            assetType = AssetType.Image,
                            expandContent = LibraryContent.Grid(
                                titleRes = R.string.ly_img_editor_asset_library_section_images,
                                sourceType = brandSourceType,
                                assetType = AssetType.Image,
                            ),
                        )
                        val brandImagesCategory = LibraryCategory.Images.copy(
                            content = LibraryContent.Sections(
                                titleRes = R.string.ly_img_editor_asset_library_title_images,
                                sections = listOf(brandImagesSection),
                            ),
                        )
                        AssetLibrary.getDefault(
                            tabs = listOf(
                                AssetLibrary.Tab.IMAGES,
                                AssetLibrary.Tab.TEXT,
                                AssetLibrary.Tab.SHAPES,
                            ),
                            images = brandImagesCategory,
                        )
                    }
                }

                dock = {
                    Dock.remember {
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add { Dock.Button.rememberImagesLibrary() }
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

Learn how asset sources, asset library categories, and dock buttons work together in the Android editor UI.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-rc.1/editor-guides-import-media-asset-library-basics)

<EngineReferenceNote {...props} />

On Android, configure the asset library through the editor's Kotlin `configuration` block. Asset sources live on the Engine, `AssetLibrary` defines the categories and sections shown in sheets, and dock buttons can open those categories for users.

```text
User taps dock button
        |
        v
AssetLibrary category and sections
        |
        v
Engine asset source
```

This guide covers the basic flow for registering an asset source, surfacing it in an asset library category, and opening that category from the dock. For a complete product surface that already includes the editor UI, start from the [Design Editor Starter Kit](../../starterkits/design-editor.md) and apply the configuration shown here.

All three layers use the same source ID:

```kotlin highlight-android-source-id
private const val BRAND_IMAGE_SOURCE_ID = "ly.img.asset.source.brand.images"
```

## Layer 1: Asset Source

Asset sources provide the media data that the library queries. Register a source on the existing editor Engine, then add asset definitions that include the URI, thumbnail URI, MIME type, and block creation metadata.

```kotlin highlight-android-asset-source
val assetEngine = editorContext.engine
if (BRAND_IMAGE_SOURCE_ID !in assetEngine.asset.findAllSources()) {
    assetEngine.asset.addLocalSource(
        sourceId = BRAND_IMAGE_SOURCE_ID,
        supportedMimeTypes = listOf(MimeType.JPEG.key),
    )
    assetEngine.asset.addAsset(
        sourceId = BRAND_IMAGE_SOURCE_ID,
        asset = AssetDefinition(
            id = "brand-background",
            label = mapOf("en" to "Brand Background"),
            tags = mapOf("en" to listOf("brand", "background")),
            groups = listOf("campaign"),
            meta = mapOf(
                "uri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                "thumbUri" to "https://img.ly/static/ubq_samples/sample_4.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "720",
            ),
        ),
    )
    assetEngine.asset.assetSourceContentsChanged(sourceId = BRAND_IMAGE_SOURCE_ID)
}
```

The sample uses a local image source for clarity. A remote source follows the same UI wiring, but its `findAssets` implementation fetches assets from your backend.

## Layer 2: Asset Library Category

Inside `configuration`, set the `assetLibrary` property with `LibraryCategory` and `LibraryContent` values. A section connects one or more `AssetSourceType` values to the category that the sheet renders.

```kotlin highlight-android-library-category
assetLibrary = {
    remember {
        val brandSourceType = AssetSourceType(sourceId = BRAND_IMAGE_SOURCE_ID)
        val brandImagesSection = LibraryContent.Section(
            titleRes = R.string.ly_img_editor_asset_library_section_images,
            sourceTypes = listOf(brandSourceType),
            assetType = AssetType.Image,
            expandContent = LibraryContent.Grid(
                titleRes = R.string.ly_img_editor_asset_library_section_images,
                sourceType = brandSourceType,
                assetType = AssetType.Image,
            ),
        )
        val brandImagesCategory = LibraryCategory.Images.copy(
            content = LibraryContent.Sections(
                titleRes = R.string.ly_img_editor_asset_library_title_images,
                sections = listOf(brandImagesSection),
            ),
        )
        AssetLibrary.getDefault(
            tabs = listOf(
                AssetLibrary.Tab.IMAGES,
                AssetLibrary.Tab.TEXT,
                AssetLibrary.Tab.SHAPES,
            ),
            images = brandImagesCategory,
        )
    }
}
```

Use `AssetLibrary.getDefault()` when you want to keep the standard editor behavior and adjust the tab order or one category. This sample replaces the Images category content so the sheet only queries the local source that the sample registers. Use your own Android string resources for app-specific category or section titles.

## Layer 3: Dock Button

Dock buttons can be used as a source to open asset library sheets. The image button below opens `assetLibrary.images()`, so the custom image section becomes available from the dock.

```kotlin highlight-android-dock-button
dock = {
    Dock.remember {
        listBuilder = {
            Dock.ListBuilder.remember {
                add { Dock.Button.rememberImagesLibrary() }
            }
        }
    }
}
```

You can build a small dock as shown here, or modify an existing dock list in a larger editor configuration.

## How Browsing and Insertion Work

When a user opens a library sheet, the UI queries the configured source types through the Engine asset API. Search text is passed to sources through `FindAssetsQuery`, and selecting an asset lets the Engine apply the asset metadata to the scene.

The important connection is the shared source ID:

- The Engine source is registered with `BRAND_IMAGE_SOURCE_ID`.
- The library section wraps that ID in `AssetSourceType`.
- The dock button opens the category that contains that section.

## Key Types

| Type | Purpose |
| ---- | ------- |
| `AssetDefinition` | Describes one asset in a local source, including localized labels and `meta` values. |
| `AssetSourceType` | Wraps an Engine asset source ID for use in library content. |
| `LibraryContent.Section` | Shows a horizontal preview row for one or more source types. |
| `LibraryContent.Grid` | Shows the expanded asset grid for one source type. |
| `LibraryCategory` | Defines one library category, including title, icons, and content. |
| `AssetLibrary` | Groups the categories used by tabs, dock buttons, and replace sheets. |

## API Reference

| Method | Purpose |
| ------ | ------- |
| `editorContext.engine.asset.findAllSources()` | Check which asset source IDs are already registered. |
| `editorContext.engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Register a local source for assets added at runtime. |
| `editorContext.engine.asset.addAsset(sourceId=_, asset=_)` | Add one asset definition to a local source. |
| `editorContext.engine.asset.assetSourceContentsChanged(sourceId=_)` | Notify the editor UI to re-query a source after its contents change. |
| `AssetLibrary.getDefault(tabs=_, images=_)` | Create the default library while overriding selected categories. |
| `LibraryCategory.Images.copy(content=_)` | Replace the default Images category content with source-backed sections. |
| `LibraryContent.Sections(titleRes=_, sections=_)` | Group one or more section rows inside a library category. |
| `Dock.remember(builder=_)` | Create a dock component for an editor configuration. |
| `Dock.ListBuilder.remember(builder=_)` | Build the ordered list of dock items. |
| `Dock.Button.rememberImagesLibrary(builder=_)` | Create a dock button that opens the image library category. |

## Next Steps

- [Customize](./customize.md) - Adapt the asset library UI and behavior to suit your application's structure and user needs.
- [Thumbnails](./thumbnails.md) - Configure thumbnail images for assets in CE.SDK's asset library with proper sizing, preview URIs for audio, and customized UI display.
- [Refresh Assets](./refresh-assets.md) - Trigger asset reloads to ensure the library reflects newly uploaded or updated items.
- [Asset Sources](../concepts.md) - Create and configure Engine-level asset sources.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support