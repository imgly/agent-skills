> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Asset Library](../asset-library.md) > [Customize](./customize.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-asset-library/AssetLibraryEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import ly.img.editor.Editor
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.library.AssetLibrary

@Composable
fun AssetLibraryEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                assetLibrary = {
                    remember { AssetLibrary.getDefault() }
                }
            }
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/editor-guides-configuration-asset-library/DefaultAssetLibraryEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import ly.img.editor.Editor
import ly.img.editor.core.R
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.addSection
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.library.dropSection
import ly.img.editor.core.library.replaceSection

@Composable
fun DefaultAssetLibraryEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    val remoteImageAssetSource = remember {
        RemoteImageAssetSource(assetBaseUri = "<your image asset base URI>")
    }

    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    editorContext.engine.asset.addSource(remoteImageAssetSource)
                }

                assetLibrary = {
                    remember {
                        val remoteImageSection = LibraryContent.Section(
                            titleRes = R.string.ly_img_editor_asset_library_title_images,
                            sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                            assetType = AssetType.Image,
                        )
                        AssetLibrary.getDefault(
                            tabs = listOf(
                                AssetLibrary.Tab.IMAGES,
                                AssetLibrary.Tab.SHAPES,
                                AssetLibrary.Tab.STICKERS,
                                AssetLibrary.Tab.TEXT,
                            ),
                            images = LibraryCategory.Images
                                .replaceSection(index = 0) {
                                    copy(count = 6)
                                }
                                .dropSection(index = 1)
                                .addSection(remoteImageSection),
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

```kotlin file=@cesdk_android_examples/editor-guides-configuration-asset-library/CustomAssetLibraryEditorSolution.kt reference-only
import android.net.Uri
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import kotlinx.coroutines.delay
import ly.img.editor.Editor
import ly.img.editor.core.R
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.LibraryElements
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryCategory.Companion.sourceTypes
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.addSection
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.sheet.SheetType
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.assetBaseUri
import ly.img.engine.populateAssetSource

@Composable
fun CustomAssetLibraryEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    val remoteImageAssetSource = remember {
        RemoteImageAssetSource(assetBaseUri = demoImageAssetBaseUri)
    }
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    editorContext.engine.asset.addSource(remoteImageAssetSource)
                }

                assetLibrary = {
                    remember {
                        // This category appears as a tab in the asset library sheet.
                        val myAssetsCategory = LibraryCategory(
                            tabTitleRes = R.string.ly_img_editor_asset_library_title_elements,
                            tabSelectedIcon = IconPack.LibraryElements,
                            tabUnselectedIcon = IconPack.LibraryElements,
                            content = LibraryContent.Sections(
                                titleRes = R.string.ly_img_editor_asset_library_title_elements,
                                sections = listOf(
                                    LibraryContent.Section(
                                        titleRes = R.string.ly_img_editor_asset_library_title_stickers,
                                        sourceTypes = LibraryContent.Stickers.sourceTypes,
                                        assetType = AssetType.Sticker,
                                        expandContent = LibraryContent.Stickers,
                                    ),
                                    LibraryContent.Section(
                                        titleRes = R.string.ly_img_editor_asset_library_title_images,
                                        sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                                        assetType = AssetType.Image,
                                    ),
                                ),
                            ),
                        )

                        AssetLibrary(
                            tabs = {
                                listOf(
                                    myAssetsCategory,
                                    LibraryCategory.Images,
                                )
                            },
                            images = {
                                val remoteImageSection = LibraryContent.Section(
                                    titleRes = R.string.ly_img_editor_asset_library_title_images,
                                    sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                                    assetType = AssetType.Image,
                                )
                                // Replacement sheets can use a different category than the Add tab.
                                LibraryCategory.Images.addSection(remoteImageSection)
                            },
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}

@Composable
fun CustomAssetLibraryPreviewSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    val remoteImageAssetSource = remember {
        RemoteImageAssetSource(assetBaseUri = demoImageAssetBaseUri)
    }
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    val scene = editorContext.engine.scene.create()
                    val page = editorContext.engine.block.create(DesignBlockType.Page)
                    editorContext.engine.block.setWidth(block = page, value = 1080F)
                    editorContext.engine.block.setHeight(block = page, value = 1080F)
                    editorContext.engine.block.appendChild(parent = scene, child = page)
                }
                onLoaded = {
                    val defaultImageSourceId = "ly.img.image"
                    if (defaultImageSourceId !in editorContext.engine.asset.findAllSources()) {
                        @Suppress("DEPRECATION")
                        editorContext.engine.populateAssetSource(
                            id = defaultImageSourceId,
                            jsonUri = Uri.parse("$demoImageAssetBaseUri/$defaultImageSourceId/content.json"),
                            replaceBaseUri = Uri.parse(demoImageAssetBaseUri),
                        )
                    }
                    editorContext.engine.asset.addSource(remoteImageAssetSource)
                    // Let the editor apply the runtime asset-library configuration before opening the screenshot sheet.
                    delay(500)
                    val previewCategory = LibraryCategory(
                        tabTitleRes = R.string.ly_img_editor_asset_library_title_elements,
                        tabSelectedIcon = IconPack.LibraryElements,
                        tabUnselectedIcon = IconPack.LibraryElements,
                        content = LibraryContent.Sections(
                            titleRes = R.string.ly_img_editor_asset_library_title_elements,
                            sections = listOf(
                                LibraryContent.Section(
                                    titleRes = R.string.ly_img_editor_asset_library_title_images,
                                    sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                                    assetType = AssetType.Image,
                                ),
                            ),
                        ),
                    )
                    editorContext.eventHandler.send(
                        EditorEvent.Sheet.Open(SheetType.LibraryAdd(libraryCategory = previewCategory)),
                    )
                }
                assetLibrary = {
                    remember {
                        val previewCategory = LibraryCategory(
                            tabTitleRes = R.string.ly_img_editor_asset_library_title_elements,
                            tabSelectedIcon = IconPack.LibraryElements,
                            tabUnselectedIcon = IconPack.LibraryElements,
                            content = LibraryContent.Sections(
                                titleRes = R.string.ly_img_editor_asset_library_title_elements,
                                sections = listOf(
                                    LibraryContent.Section(
                                        titleRes = R.string.ly_img_editor_asset_library_title_images,
                                        sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                                        assetType = AssetType.Image,
                                    ),
                                ),
                            ),
                        )
                        AssetLibrary(
                            tabs = {
                                listOf(
                                    previewCategory,
                                    LibraryCategory.Images,
                                )
                            },
                        )
                    }
                }
            }
        },
        onClose = onClose,
    )
}

@Suppress("DEPRECATION")
private val demoImageAssetBaseUri: String
    get() = Engine.assetBaseUri.toString()
```

```kotlin file=@cesdk_android_examples/editor-guides-configuration-asset-library/RemoteImageAssetSource.kt reference-only
import ly.img.engine.Asset
import ly.img.engine.AssetContext
import ly.img.engine.AssetSource
import ly.img.engine.DesignBlockType
import ly.img.engine.FillType
import ly.img.engine.FindAssetsQuery
import ly.img.engine.FindAssetsResult
import ly.img.engine.MimeType
import ly.img.engine.ShapeType

class RemoteImageAssetSource(
    assetBaseUri: String,
) : AssetSource(sourceId = SOURCE_ID) {
    override val supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key)

    override suspend fun getGroups(): List<String>? = null

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = FindAssetsResult(
        assets = imageAssets,
        currentPage = query.page,
        nextPage = -1,
        total = imageAssets.size,
    )

    private val imageBaseUri = assetBaseUri.trimEnd('/')

    private val imageAssets = listOf(
        Asset(
            id = "brand-background",
            context = AssetContext(sourceId = sourceId),
            label = "Brand Background",
            locale = "en",
            tags = listOf("background", "brand"),
            meta = mapOf(
                "uri" to "$imageBaseUri/ly.img.image/images/sample_1.jpg",
                "thumbUri" to "$imageBaseUri/ly.img.image/thumbnails/sample_1.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "720",
            ),
        ),
        Asset(
            id = "brand-landscape",
            context = AssetContext(sourceId = sourceId),
            label = "Brand Landscape",
            locale = "en",
            tags = listOf("landscape", "brand"),
            meta = mapOf(
                "uri" to "$imageBaseUri/ly.img.image/images/sample_10.jpg",
                "thumbUri" to "$imageBaseUri/ly.img.image/thumbnails/sample_10.jpg",
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

    private companion object {
        const val SOURCE_ID = "remote-image-assets"
    }
}
```

Configure the Android asset library so the editor opens the tabs, sections,
and replacement sheets that fit your app.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260826/editor-guides-configuration-asset-library)

The asset library displays assets from registered asset sources. Sources provide the data, while `AssetLibrary`, `LibraryCategory`, and `LibraryContent` define how the CE.SDK editor UI presents those sources.

This guide covers setting the asset library configuration, reordering default tabs, changing category sections, adding a registered custom source, and providing separate categories for add and replace flows.

## Configuration

Asset library customization starts in `EditorConfiguration`. Set `assetLibrary` to return either the default library or a custom `AssetLibrary` instance.

```kotlin highlight-android-asset-library-configuration
EditorConfiguration.remember {
    assetLibrary = {
        remember { AssetLibrary.getDefault() }
    }
}
```

The default configuration uses `AssetLibrary.getDefault()`, which opens the Elements, Images, Text, Shapes, and Stickers tabs. Video and audio tabs are only included when you pass `includeAVResources = true`, while the video and audio category providers remain available for type-specific replacement flows.

## Register a Custom Source

Before a custom source can appear in the asset library, implement an `AssetSource` that returns assets. This source receives an asset base URI from the app and returns deterministic image assets, but the same shape applies when your app loads metadata from its own storage service.

```kotlin highlight-android-remote-image-source
class RemoteImageAssetSource(
    assetBaseUri: String,
) : AssetSource(sourceId = SOURCE_ID) {
    override val supportedMimeTypes = listOf(MimeType.JPEG.key, MimeType.PNG.key)

    override suspend fun getGroups(): List<String>? = null

    override suspend fun findAssets(query: FindAssetsQuery): FindAssetsResult = FindAssetsResult(
        assets = imageAssets,
        currentPage = query.page,
        nextPage = -1,
        total = imageAssets.size,
    )

    private val imageBaseUri = assetBaseUri.trimEnd('/')

    private val imageAssets = listOf(
        Asset(
            id = "brand-background",
            context = AssetContext(sourceId = sourceId),
            label = "Brand Background",
            locale = "en",
            tags = listOf("background", "brand"),
            meta = mapOf(
                "uri" to "$imageBaseUri/ly.img.image/images/sample_1.jpg",
                "thumbUri" to "$imageBaseUri/ly.img.image/thumbnails/sample_1.jpg",
                "mimeType" to MimeType.JPEG.key,
                "kind" to "image",
                "blockType" to DesignBlockType.Graphic.key,
                "fillType" to FillType.Image.key,
                "shapeType" to ShapeType.Rect.key,
                "width" to "1080",
                "height" to "720",
            ),
        ),
        Asset(
            id = "brand-landscape",
            context = AssetContext(sourceId = sourceId),
            label = "Brand Landscape",
            locale = "en",
            tags = listOf("landscape", "brand"),
            meta = mapOf(
                "uri" to "$imageBaseUri/ly.img.image/images/sample_10.jpg",
                "thumbUri" to "$imageBaseUri/ly.img.image/thumbnails/sample_10.jpg",
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

    private companion object {
        const val SOURCE_ID = "remote-image-assets"
    }
}
```

Register the source with the editor engine after the editor loads. Replace the asset base URI with the root of your app's bundled assets or hosted image storage.

```kotlin highlight-android-custom-asset-source
val remoteImageAssetSource = remember {
    RemoteImageAssetSource(assetBaseUri = "<your image asset base URI>")
}
```

```kotlin highlight-android-register-asset-source
onLoaded = {
    editorContext.engine.asset.addSource(remoteImageAssetSource)
}
```

The `AssetSourceType` used in a library section must reference the same source ID as the registered source.

## Modify the Default Library

Use `AssetLibrary.getDefault()` when you want to keep the default behavior but adjust tab order or category content. The sample removes the Elements tab, changes the order of the remaining tabs, changes the first image section's preview count, drops the gallery section, and appends the custom source.

```kotlin highlight-android-default-asset-library
assetLibrary = {
    remember {
        val remoteImageSection = LibraryContent.Section(
            titleRes = R.string.ly_img_editor_asset_library_title_images,
            sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
            assetType = AssetType.Image,
        )
        AssetLibrary.getDefault(
            tabs = listOf(
                AssetLibrary.Tab.IMAGES,
                AssetLibrary.Tab.SHAPES,
                AssetLibrary.Tab.STICKERS,
                AssetLibrary.Tab.TEXT,
            ),
            images = LibraryCategory.Images
                .replaceSection(index = 0) {
                    copy(count = 6)
                }
                .dropSection(index = 1)
                .addSection(remoteImageSection),
        )
    }
}
```

The `images` category is reused for both the Images tab and image replacement sheets, so changes to this category affect both flows.

## Create a Custom Category

For deeper changes, create a `LibraryCategory` with your own title resource, selected and unselected tab icons, and nested `LibraryContent`. Sections can expand into default content or display a registered source directly.

```kotlin highlight-android-custom-category
// This category appears as a tab in the asset library sheet.
val myAssetsCategory = LibraryCategory(
    tabTitleRes = R.string.ly_img_editor_asset_library_title_elements,
    tabSelectedIcon = IconPack.LibraryElements,
    tabUnselectedIcon = IconPack.LibraryElements,
    content = LibraryContent.Sections(
        titleRes = R.string.ly_img_editor_asset_library_title_elements,
        sections = listOf(
            LibraryContent.Section(
                titleRes = R.string.ly_img_editor_asset_library_title_stickers,
                sourceTypes = LibraryContent.Stickers.sourceTypes,
                assetType = AssetType.Sticker,
                expandContent = LibraryContent.Stickers,
            ),
            LibraryContent.Section(
                titleRes = R.string.ly_img_editor_asset_library_title_images,
                sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
                assetType = AssetType.Image,
            ),
        ),
    ),
)
```

Use Android string resources for tab and section labels. That keeps labels localizable through your app's normal Android resource workflow.

## Customize Add and Replace Flows

The `AssetLibrary` constructor lets each entry point return a different category. In this sample, the Add sheet shows a custom Elements category and the default Images category as tabs, while image replacement uses an Images category with the custom source appended.

```kotlin highlight-android-custom-asset-library
AssetLibrary(
    tabs = {
        listOf(
            myAssetsCategory,
            LibraryCategory.Images,
        )
    },
    images = {
        val remoteImageSection = LibraryContent.Section(
            titleRes = R.string.ly_img_editor_asset_library_title_images,
            sourceTypes = listOf(AssetSourceType(sourceId = remoteImageAssetSource.sourceId)),
            assetType = AssetType.Image,
        )
        // Replacement sheets can use a different category than the Add tab.
        LibraryCategory.Images.addSection(remoteImageSection)
    },
)
```

The editor chooses replacement categories by selected block type and fill type. For example, image fills use `images`, video fills use `videos`, stickers use `stickers`, and audio blocks use `audios`.

## Troubleshooting

**Custom source section is empty:** Confirm that the source was registered with `editorContext.engine.asset.addSource()` and that the section uses a matching `AssetSourceType(sourceId = ...)`.

**Tab order did not change:** Check the `tabs` list passed to `AssetLibrary.getDefault()` or the `tabs` lambda passed to `AssetLibrary`.

**Section helper throws at runtime:** `addSection()`, `dropSection()`, and `replaceSection()` only work on categories whose `content` is `LibraryContent.Sections`.

**Labels are wrong or missing:** Use valid Android string resources for `tabTitleRes`, `LibraryContent.Sections.titleRes`, and `LibraryContent.Section.titleRes`.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `EditorConfiguration.remember(builder=_)` | Configuration | Create an editor configuration and set the asset library. |
| `editorContext.engine.asset.addSource(source=_)` | Assets | Register a custom asset source with the engine. |
| `AssetSource(sourceId=_)` | Assets | Define a custom source that the engine can query for assets. |
| `AssetSource.findAssets(query=_)` | Assets | Return paginated assets for the current search, group, and page query. |
| `AssetSource.getGroups()` | Assets | Return available group identifiers for grouped source content, or `null` for ungrouped content. |
| `AssetLibrary.getDefault(tabs=_, images=_)` | Asset Library | Keep the default library and override selected categories or tab order. |
| `AssetLibrary(tabs=_, images=_)` | Asset Library | Build a custom library with separate providers for add and replace flows. |
| `LibraryCategory.addSection(section=_)` | Asset Library | Append a section to a category backed by `LibraryContent.Sections`. |
| `LibraryCategory.dropSection(index=_)` | Asset Library | Remove a section from a category backed by `LibraryContent.Sections`. |
| `LibraryCategory.replaceSection(index=_, sectionReducer=_)` | Asset Library | Replace one section while keeping the rest of the category. |

## Key Types

| Type | Category | Purpose |
| --- | --- | --- |
| `Asset` | Assets | Describe one asset returned by a source. |
| `AssetContext` | Assets | Associate an asset with the source that returned it. |
| `FindAssetsQuery` | Assets | Pass pagination, search, tag, locale, and group filters into `findAssets()`. |
| `FindAssetsResult` | Assets | Return paginated asset results from `findAssets()`. |
| `AssetSourceType` | Assets | Reference a registered asset source from library content. |
| `LibraryCategory` | Asset Library | Define one tab or type-specific replacement category. |
| `LibraryContent.Sections` | Asset Library | Group multiple preview sections inside a category. |
| `LibraryContent.Section` | Asset Library | Display a preview row and optional drill-down content for one or more sources. |
| `LibraryContent.Grid` | Asset Library | Display assets from a source in a grid view. |

## Next Steps

- [Basics](./basics.md) — Explore the core functionality of the asset library and how users browse, search, and insert media.
- [Thumbnails](./thumbnails.md) — Configure thumbnail images for assets in CE.SDK's asset library with proper sizing, preview URIs for audio, and customized UI display.
- [Refresh Assets](./refresh-assets.md) — Trigger asset reloads to ensure the library reflects newly uploaded or updated items.
- [Serve Assets](../../serve-assets.md) — Configure CE.SDK to load engine and content assets from your own servers instead of the IMG.LY CDN for production deployments.
- [From Your Server](../from-remote-source/your-server.md) — Load images, videos, and audio from your backend servers into CE.SDK for integration with CMS, DAM, or custom asset management systems.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support