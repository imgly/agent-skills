> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Page Format](./page-format.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-page-format/PageFormatEditorSolution.kt reference-only
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.engine.AssetDefinition
import ly.img.engine.AssetPayload
import ly.img.engine.AssetTransformPreset
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit

@Composable
fun PageFormatEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember(::DesignConfigurationBuilder) {
                onCreate = {
                    val pagePresetsSourceId = "ly.img.page.presets"
                    if (editorContext.engine.asset.findAllSources().contains(pagePresetsSourceId)) {
                        editorContext.engine.asset.removeSource(pagePresetsSourceId)
                    }
                    editorContext.engine.asset.addLocalSource(
                        sourceId = pagePresetsSourceId,
                        supportedMimeTypes = emptyList(),
                    )

                    editorContext.engine.asset.addAsset(
                        sourceId = pagePresetsSourceId,
                        asset = AssetDefinition(
                            id = "a4-portrait",
                            label = mapOf("en" to "A4 Portrait"),
                            groups = listOf("print"),
                            payload = AssetPayload(
                                transformPreset = AssetTransformPreset.FixedSize(
                                    width = 210F,
                                    height = 297F,
                                    designUnit = DesignUnit.MILLIMETER,
                                ),
                            ),
                        ),
                    )
                    editorContext.engine.asset.addAsset(
                        sourceId = pagePresetsSourceId,
                        asset = AssetDefinition(
                            id = "a5-landscape",
                            label = mapOf("en" to "A5 Landscape"),
                            groups = listOf("print"),
                            payload = AssetPayload(
                                transformPreset = AssetTransformPreset.FixedSize(
                                    width = 210F,
                                    height = 148F,
                                    designUnit = DesignUnit.MILLIMETER,
                                ),
                            ),
                        ),
                    )

                    editorContext.engine.asset.addAsset(
                        sourceId = pagePresetsSourceId,
                        asset = AssetDefinition(
                            id = "square-social",
                            label = mapOf("en" to "Square Social"),
                            groups = listOf("digital"),
                            payload = AssetPayload(
                                transformPreset = AssetTransformPreset.FixedSize(
                                    width = 1080F,
                                    height = 1080F,
                                    designUnit = DesignUnit.PIXEL,
                                ),
                            ),
                        ),
                    )

                    editorContext.engine.asset.addAsset(
                        sourceId = pagePresetsSourceId,
                        asset = AssetDefinition(
                            id = "letter",
                            label = mapOf("en" to "US Letter"),
                            groups = listOf("print"),
                            payload = AssetPayload(
                                transformPreset = AssetTransformPreset.FixedSize(
                                    width = 8.5F,
                                    height = 11F,
                                    designUnit = DesignUnit.INCH,
                                ),
                            ),
                        ),
                    )

                    val scene = editorContext.engine.scene.create(designUnit = DesignUnit.MILLIMETER)
                    val page = editorContext.engine.block.create(DesignBlockType.Page)
                    editorContext.engine.block.setWidth(block = page, value = 210F)
                    editorContext.engine.block.setHeight(block = page, value = 297F)
                    editorContext.engine.block.appendChild(parent = scene, child = page)
                }
            }
        },
        onClose = onClose,
    )
}
```

Customize the page format presets that appear in the CE.SDK editor UI so your users can choose only the sizes your workflow supports.

![Page format selector in the CE.SDK editor UI](https://img.ly/docs/cesdk/android/user-interface/customization/page-format-496315/assets/page-presets-android.png)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260902/editor-guides-configuration-page-format)

<EngineReferenceNote {...props} />

CE.SDK includes page format presets in the resize sheet. The Android editor UI reads these presets from the `ly.img.page.presets` asset source, so you customize the selector by replacing that source with your own fixed-size assets.

> **Note:** For a complete product surface, see the [Design Editor Starter Kit](../../starterkits/design-editor.md). The example below focuses on the asset source setup that feeds the CE.SDK editor UI.

## Using the Built-in Page Format UI

Users can open the resize sheet from the CE.SDK editor UI and select one of the registered page presets. Selecting a preset resizes the current page, or all pages when the resize-all flow is active.

Each Android page format is an asset with an `AssetTransformPreset.FixedSize` payload. The `groups` list controls how formats are grouped in the selector.

## Replacing the Page Format Source

Register the source with the default page preset ID, `"ly.img.page.presets"`. If the editor already registered that source, remove it first so the selector reads only your custom formats.

```kotlin highlight-android-register-page-source
val pagePresetsSourceId = "ly.img.page.presets"
if (editorContext.engine.asset.findAllSources().contains(pagePresetsSourceId)) {
    editorContext.engine.asset.removeSource(pagePresetsSourceId)
}
editorContext.engine.asset.addLocalSource(
    sourceId = pagePresetsSourceId,
    supportedMimeTypes = emptyList(),
)
```

## Adding Page Format Assets

Each page format asset needs a `FixedSize` transform preset:

- `width` and `height` define the page dimensions.
- `designUnit` sets the unit for those dimensions: `DesignUnit.PIXEL`, `DesignUnit.MILLIMETER`, or `DesignUnit.INCH`.
- `label` is the text shown in the selector.
- `groups` lets the selector organize formats into sections such as print or digital sizes.

### Using Millimeter Dimensions

Use millimeters for print formats. This example adds A4 portrait and A5 landscape presets to the same page preset source.

```kotlin highlight-android-add-print-formats
editorContext.engine.asset.addAsset(
    sourceId = pagePresetsSourceId,
    asset = AssetDefinition(
        id = "a4-portrait",
        label = mapOf("en" to "A4 Portrait"),
        groups = listOf("print"),
        payload = AssetPayload(
            transformPreset = AssetTransformPreset.FixedSize(
                width = 210F,
                height = 297F,
                designUnit = DesignUnit.MILLIMETER,
            ),
        ),
    ),
)
editorContext.engine.asset.addAsset(
    sourceId = pagePresetsSourceId,
    asset = AssetDefinition(
        id = "a5-landscape",
        label = mapOf("en" to "A5 Landscape"),
        groups = listOf("print"),
        payload = AssetPayload(
            transformPreset = AssetTransformPreset.FixedSize(
                width = 210F,
                height = 148F,
                designUnit = DesignUnit.MILLIMETER,
            ),
        ),
    ),
)
```

### Using Pixel Dimensions

Use pixels for screen-first formats. A square preset uses the same width and height so it keeps a 1:1 page shape.

```kotlin highlight-android-add-pixel-format
editorContext.engine.asset.addAsset(
    sourceId = pagePresetsSourceId,
    asset = AssetDefinition(
        id = "square-social",
        label = mapOf("en" to "Square Social"),
        groups = listOf("digital"),
        payload = AssetPayload(
            transformPreset = AssetTransformPreset.FixedSize(
                width = 1080F,
                height = 1080F,
                designUnit = DesignUnit.PIXEL,
            ),
        ),
    ),
)
```

### Using Inch Dimensions

Use inches for formats common in regions that use imperial measurements.

```kotlin highlight-android-add-inch-format
editorContext.engine.asset.addAsset(
    sourceId = pagePresetsSourceId,
    asset = AssetDefinition(
        id = "letter",
        label = mapOf("en" to "US Letter"),
        groups = listOf("print"),
        payload = AssetPayload(
            transformPreset = AssetTransformPreset.FixedSize(
                width = 8.5F,
                height = 11F,
                designUnit = DesignUnit.INCH,
            ),
        ),
    ),
)
```

## Creating the Scene

Load the page format source before creating the scene. Then create the initial page with the dimensions you want users to see first.

```kotlin highlight-android-create-scene
val scene = editorContext.engine.scene.create(designUnit = DesignUnit.MILLIMETER)
val page = editorContext.engine.block.create(DesignBlockType.Page)
editorContext.engine.block.setWidth(block = page, value = 210F)
editorContext.engine.block.setHeight(block = page, value = 297F)
editorContext.engine.block.appendChild(parent = scene, child = page)
```

The Android editor UI does not read a `meta.default` field from page format assets during scene creation. If your app needs a default page size, create the first page with that size in your `onCreate` callback.

## Page Orientation

Orientation comes from the relationship between `width` and `height`. A wider format appears as landscape, while a taller format appears as portrait.

Android represents each orientation as a separate fixed-size asset. Add one portrait asset and one landscape asset when users need both options; the Android resize sheet does not read the web-only `fixedOrientation` metadata flag.

## Troubleshooting

- **Custom formats do not appear**: Make sure the source ID is `"ly.img.page.presets"` and that you add the source before opening the resize sheet.
- **Default page size is unchanged**: Create the initial page with the desired dimensions in `onCreate`; Android does not apply `meta.default` automatically.
- **Formats appear in the wrong unit**: Check that each `AssetTransformPreset.FixedSize` uses the intended `DesignUnit`.

## API Reference

| Method | Category | Description |
|--------|----------|-------------|
| `editorContext.engine.asset.findAllSources()` | Asset | Check whether the page preset source already exists |
| `editorContext.engine.asset.removeSource(sourceId=_)` | Asset | Remove the existing page preset source before replacing it |
| `editorContext.engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Asset | Register a local source for page format assets |
| `editorContext.engine.asset.addAsset(sourceId=_, asset=_)` | Asset | Add one page format asset to the source |
| `editorContext.engine.scene.create(designUnit=_)` | Scene | Create the scene with the unit used by the initial page |
| `editorContext.engine.block.create(blockType=_)` | Block | Create the initial page block |
| `editorContext.engine.block.setWidth(block=_, value=_)` | Block | Set the initial page width |
| `editorContext.engine.block.setHeight(block=_, value=_)` | Block | Set the initial page height |
| `editorContext.engine.block.appendChild(parent=_, child=_)` | Block | Attach the page to the scene |

## Related Types

| Type | Purpose |
|------|---------|
| `AssetDefinition` | Describes one page format asset |
| `AssetPayload` | Stores the `transformPreset` for a page format asset |
| `AssetTransformPreset.FixedSize` | Defines fixed page dimensions and their design unit |
| `DesignUnit` | Selects pixel, millimeter, or inch dimensions |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support