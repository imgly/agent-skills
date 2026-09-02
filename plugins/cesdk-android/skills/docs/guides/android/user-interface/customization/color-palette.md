> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Color Palette](./color-palette.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-color-palette/ColorPaletteEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import ly.img.editor.Editor
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberFillStroke
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.engine.AssetColor
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetPayload
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FindAssetsQuery
import androidx.compose.ui.graphics.Color as ComposeColor

private const val BRAND_COLOR_SOURCE_ID = "my-brand-colors"
private const val BRAND_CORAL_ID = "brand-coral"

private data class BrandColorAsset(
    val definition: AssetDefinition,
    val paletteColor: ComposeColor?,
)

private fun brandColorAssets() = listOf(
    BrandColorAsset(
        definition = AssetDefinition(
            id = "brand-blue",
            label = mapOf("en" to "Brand Blue"),
            tags = mapOf("en" to listOf("brand", "blue", "primary")),
            payload = AssetPayload(
                color = AssetColor.RGB(r = 0.2F, g = 0.4F, b = 0.8F),
            ),
        ),
        paletteColor = ComposeColor(red = 0.2F, green = 0.4F, blue = 0.8F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = BRAND_CORAL_ID,
            label = mapOf("en" to "Brand Coral"),
            tags = mapOf("en" to listOf("brand", "coral", "secondary")),
            payload = AssetPayload(
                color = AssetColor.RGB(r = 0.95F, g = 0.45F, b = 0.4F),
            ),
        ),
        paletteColor = ComposeColor(red = 0.95F, green = 0.45F, blue = 0.4F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = "print-magenta",
            label = mapOf("en" to "Print Magenta"),
            tags = mapOf("en" to listOf("print", "magenta", "cmyk")),
            payload = AssetPayload(
                color = AssetColor.CMYK(c = 0F, m = 0.9F, y = 0.2F, k = 0F),
            ),
        ),
        paletteColor = ComposeColor(red = 1F, green = 0.1F, blue = 0.8F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = "metallic-gold",
            label = mapOf("en" to "Metallic Gold"),
            tags = mapOf("en" to listOf("spot", "metallic", "gold")),
            payload = AssetPayload(
                color = AssetColor.SpotColor(
                    name = "Metallic Gold Ink",
                    externalReference = "Custom Inks",
                    representation = AssetColor.RGB(r = 0.85F, g = 0.65F, b = 0.13F),
                ),
            ),
        ),
        paletteColor = ComposeColor(red = 0.85F, green = 0.65F, blue = 0.13F),
    ),
)

private fun brandPaletteColors() = brandColorAssets().mapNotNull { it.paletteColor }

private fun createBrandColorLibrary(engine: Engine) {
    // Keep repeated guide launches idempotent inside the same editor process.
    if (BRAND_COLOR_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = BRAND_COLOR_SOURCE_ID)
    }
    engine.asset.addLocalSource(
        sourceId = BRAND_COLOR_SOURCE_ID,
        supportedMimeTypes = emptyList(),
    )
    brandColorAssets().forEach { color ->
        engine.asset.addAsset(sourceId = BRAND_COLOR_SOURCE_ID, asset = color.definition)
    }
    engine.asset.assetSourceContentsChanged(sourceId = BRAND_COLOR_SOURCE_ID)
}

private fun removeBrandColor(
    engine: Engine,
    assetId: String = BRAND_CORAL_ID,
) {
    engine.asset.removeAsset(sourceId = BRAND_COLOR_SOURCE_ID, assetId = assetId)
    engine.asset.assetSourceContentsChanged(sourceId = BRAND_COLOR_SOURCE_ID)
}

data class ColorPaletteSmokeResult(
    val paletteColorCount: Int,
    val initialAssetIds: List<String>,
    val remainingAssetIds: List<String>,
)

suspend fun colorPalette(engine: Engine): ColorPaletteSmokeResult {
    createBrandColorLibrary(engine)

    val initialAssetIds = engine.asset.findAssets(
        sourceId = BRAND_COLOR_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    ).assets.map { asset -> asset.id }

    removeBrandColor(engine)

    val remainingAssetIds = engine.asset.findAssets(
        sourceId = BRAND_COLOR_SOURCE_ID,
        query = FindAssetsQuery(page = 0, perPage = 10),
    ).assets.map { asset -> asset.id }

    return ColorPaletteSmokeResult(
        paletteColorCount = brandPaletteColors().size,
        initialAssetIds = initialAssetIds,
        remainingAssetIds = remainingAssetIds,
    )
}

// Add this composable to your NavHost
@Composable
fun ColorPaletteEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    val scene = editorContext.engine.scene.create()
                    val page = editorContext.engine.block.create(DesignBlockType.Page)
                    editorContext.engine.block.setWidth(block = page, value = 1080F)
                    editorContext.engine.block.setHeight(block = page, value = 1080F)
                    editorContext.engine.block.appendChild(parent = scene, child = page)

                    createBrandColorLibrary(editorContext.engine)
                }
                onLoaded = {
                    // Select the page so the Fill/Stroke inspector button is visible immediately.
                    editorContext.engine.block.findByType(DesignBlockType.Page)
                        .firstOrNull()
                        ?.let { editorContext.engine.block.setSelected(it, selected = true) }
                }
                colorPalette = {
                    remember {
                        brandPaletteColors()
                    }
                }
                inspectorBar = {
                    InspectorBar.remember {
                        listBuilder = {
                            InspectorBar.ListBuilder.remember {
                                add { InspectorBar.Button.rememberFillStroke() }
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

Replace the editor's default color swatches with brand colors so fills,
strokes, and other color-aware Android editor controls start from the same
approved palette.

![Editor showing custom brand color swatches in the Fill and Stroke controls](https://img.ly/docs/cesdk/android/user-interface/customization/color-palette-429fd9/assets/android.hero.png)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/editor-guides-configuration-color-palette)

<EngineReferenceNote {...props} />

The Android editor reads palette swatches from `EditorConfiguration.colorPalette`. The list replaces the built-in swatches that appear in the CE.SDK editor UI's fill, stroke, and similar color controls; include any default colors you still want to keep.

The sample also registers the same brand colors as a local asset source. That part is useful when your app needs reusable color definitions for custom UI, searches, or other engine workflows. For a dedicated asset-source walkthrough, see [Create a Color Palette](../../colors/create-color-palette.md).

The [Design Editor Starter Kit](../../starterkits/design-editor.md) uses the same editor configuration model, so you can apply this palette configuration to a complete design editor surface as well.

## Define Brand Colors

Keep one data model for the reusable color assets and the editor swatches. The `AssetDefinition` stores labels, tags, and RGB, CMYK, or spot color payloads; `paletteColor` stores the Compose `Color` shown in Android's swatch row.

```kotlin highlight-android-defining-color-assets
private const val BRAND_COLOR_SOURCE_ID = "my-brand-colors"
private const val BRAND_CORAL_ID = "brand-coral"

private data class BrandColorAsset(
    val definition: AssetDefinition,
    val paletteColor: ComposeColor?,
)

private fun brandColorAssets() = listOf(
    BrandColorAsset(
        definition = AssetDefinition(
            id = "brand-blue",
            label = mapOf("en" to "Brand Blue"),
            tags = mapOf("en" to listOf("brand", "blue", "primary")),
            payload = AssetPayload(
                color = AssetColor.RGB(r = 0.2F, g = 0.4F, b = 0.8F),
            ),
        ),
        paletteColor = ComposeColor(red = 0.2F, green = 0.4F, blue = 0.8F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = BRAND_CORAL_ID,
            label = mapOf("en" to "Brand Coral"),
            tags = mapOf("en" to listOf("brand", "coral", "secondary")),
            payload = AssetPayload(
                color = AssetColor.RGB(r = 0.95F, g = 0.45F, b = 0.4F),
            ),
        ),
        paletteColor = ComposeColor(red = 0.95F, green = 0.45F, blue = 0.4F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = "print-magenta",
            label = mapOf("en" to "Print Magenta"),
            tags = mapOf("en" to listOf("print", "magenta", "cmyk")),
            payload = AssetPayload(
                color = AssetColor.CMYK(c = 0F, m = 0.9F, y = 0.2F, k = 0F),
            ),
        ),
        paletteColor = ComposeColor(red = 1F, green = 0.1F, blue = 0.8F),
    ),
    BrandColorAsset(
        definition = AssetDefinition(
            id = "metallic-gold",
            label = mapOf("en" to "Metallic Gold"),
            tags = mapOf("en" to listOf("spot", "metallic", "gold")),
            payload = AssetPayload(
                color = AssetColor.SpotColor(
                    name = "Metallic Gold Ink",
                    externalReference = "Custom Inks",
                    representation = AssetColor.RGB(r = 0.85F, g = 0.65F, b = 0.13F),
                ),
            ),
        ),
        paletteColor = ComposeColor(red = 0.85F, green = 0.65F, blue = 0.13F),
    ),
)

private fun brandPaletteColors() = brandColorAssets().mapNotNull { it.paletteColor }
```

Android swatches are screen colors, so CMYK and spot color assets still need an sRGB preview value for `paletteColor`. The engine color remains in `AssetPayload.color` for workflows that query or apply the asset directly.

## Register the Color Library

Create the local source before adding color assets to it. The sample removes an existing source with the same ID first so repeated launches in the same editor process stay deterministic.

```kotlin highlight-android-add-library
private fun createBrandColorLibrary(engine: Engine) {
    // Keep repeated guide launches idempotent inside the same editor process.
    if (BRAND_COLOR_SOURCE_ID in engine.asset.findAllSources()) {
        engine.asset.removeSource(sourceId = BRAND_COLOR_SOURCE_ID)
    }
    engine.asset.addLocalSource(
        sourceId = BRAND_COLOR_SOURCE_ID,
        supportedMimeTypes = emptyList(),
    )
    brandColorAssets().forEach { color ->
        engine.asset.addAsset(sourceId = BRAND_COLOR_SOURCE_ID, asset = color.definition)
    }
    engine.asset.assetSourceContentsChanged(sourceId = BRAND_COLOR_SOURCE_ID)
}
```

Call the registration helper from `EditorConfiguration.onCreate`. In Android editor configurations, use `onCreate` when the callback owns scene creation or loading; this sample creates a blank scene and page before registering the library.

```kotlin highlight-android-register-library
                onCreate = {
                    val scene = editorContext.engine.scene.create()
                    val page = editorContext.engine.block.create(DesignBlockType.Page)
                    editorContext.engine.block.setWidth(block = page, value = 1080F)
                    editorContext.engine.block.setHeight(block = page, value = 1080F)
                    editorContext.engine.block.appendChild(parent = scene, child = page)

                    createBrandColorLibrary(editorContext.engine)
                }
```

## Configure the Editor Palette

Assign `colorPalette` inside `EditorConfiguration.remember`. The editor shows the Compose colors in list order and replaces the default Android swatches with this list.

```kotlin highlight-android-config-palette
colorPalette = {
    remember {
        brandPaletteColors()
    }
}
```

Controls that allow disabling a color, such as Fill and Stroke, reserve one slot for the "no color" button and show up to the first six palette entries. Controls that always require a color can use the full configured list.

## Update a Color Library

When you change a local color source at runtime, mutate the source and then notify listeners. This updates the reusable asset library; `EditorConfiguration.colorPalette` remains the Compose swatch list configured by your editor state.

```kotlin highlight-android-remove-color
private fun removeBrandColor(
    engine: Engine,
    assetId: String = BRAND_CORAL_ID,
) {
    engine.asset.removeAsset(sourceId = BRAND_COLOR_SOURCE_ID, assetId = assetId)
    engine.asset.assetSourceContentsChanged(sourceId = BRAND_COLOR_SOURCE_ID)
}
```

If your app also lets users remove visible editor swatches, back `colorPalette` with your own Compose state and remove the color from that state before the editor recomposes.

## API Reference

| Method | Description |
|--------|-------------|
| `EditorConfiguration.Companion.remember(builder=_)` | Creates the editor configuration used by the `Editor` composable. |
| `EditorConfiguration.colorPalette` | Provides the ordered Compose color list used by Android editor color controls. |
| `engine.scene.create(sceneLayout=_)` | Creates the scene that hosts the sample page. |
| `engine.block.create(blockType=_)` | Creates the page block that receives the configured dimensions. |
| `engine.block.setWidth(block=_, value=_, maintainCrop=_)` | Sets the page width used by the sample scene. |
| `engine.block.setHeight(block=_, value=_, maintainCrop=_)` | Sets the page height used by the sample scene. |
| `engine.block.appendChild(parent=_, child=_)` | Adds the page block to the created scene. |
| `engine.asset.findAllSources()` | Lists registered asset source IDs so the sample can replace an existing local source. |
| `engine.asset.removeSource(sourceId=_)` | Removes an existing asset source by ID. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Creates a local asset source for reusable color assets. |
| `engine.asset.addAsset(sourceId=_, asset=_)` | Adds a color asset definition to the local source. |
| `engine.asset.assetSourceContentsChanged(sourceId=_)` | Notifies listeners that local source contents changed. |
| `engine.asset.removeAsset(sourceId=_, assetId=_)` | Removes one asset from a local source. |

| Type | Description |
|------|-------------|
| `ComposeColor(red=_, green=_, blue=_)` | Compose color shown as an Android editor swatch. |
| `AssetDefinition` | Stores a reusable color asset ID, labels, tags, and payload. |
| `AssetPayload(color=_)` | Carries the color data inside an asset definition. |
| `AssetColor.RGB` | Defines an sRGB color with normalized RGB components. |
| `AssetColor.CMYK` | Defines a CMYK color with normalized CMYK components. |
| `AssetColor.SpotColor` | Defines a named spot color with a preview representation. |

## Next Steps

- [Color Basics](../../colors/basics.md) — Review CE.SDK's color spaces and where they apply
- [Apply Colors](../../colors/apply.md) — Set fills, strokes, and text color programmatically
- [Theming](../appearance/theming.md) — Customize the editor's appearance and color tokens
- [Dock](./dock.md) — Configure the editor's primary navigation
- [Inspector Bar](./inspector-bar.md) — Tailor which controls appear when a block is selected



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support