> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Create From Scratch](./from-scratch.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-templates-from-scratch/CreateTemplateFromScratch.kt reference-only
import android.net.Uri
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.Font
import ly.img.engine.FontStyle
import ly.img.engine.FontUnit
import ly.img.engine.FontWeight
import ly.img.engine.GlobalScope
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.Typeface

suspend fun createTemplateFromScratch(engine: Engine): TemplateFromScratchResult {
    val scopeKeys = listOf("layer/move", "layer/resize", "fill/change")
    val previousGlobalScopes = scopeKeys.associateWith(engine.editor::getGlobalScope)
    val previousVariables = engine.variable.findAll().associateWith { key ->
        engine.variable.get(key)
    }

    return try {
        previousVariables.keys.forEach(engine.variable::remove)

        val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)

        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 1000F)
        engine.block.appendChild(parent = scene, child = page)

        val backgroundFill = engine.block.createFill(FillType.Color)
        engine.block.setColor(
            block = backgroundFill,
            property = "fill/color/value",
            value = Color.fromRGBA(r = 0.98F, g = 0.98F, b = 0.99F, a = 1F),
        )
        engine.block.setFill(block = page, fill = backgroundFill)

        val bundledAssetsBaseUri = "file:///android_asset/imgly-assets"
        val brandTypeface = Typeface(
            name = "Brand Sans",
            fonts = listOf(
                Font(
                    uri = Uri.parse("$bundledAssetsBaseUri/ly.img.typeface/fonts/FiraSans/FiraSans-Regular.ttf"),
                    subFamily = "Regular",
                    weight = FontWeight.NORMAL,
                    style = FontStyle.NORMAL,
                ),
                Font(
                    uri = Uri.parse("$bundledAssetsBaseUri/ly.img.typeface/fonts/FiraSans/FiraSans-Bold.ttf"),
                    subFamily = "Bold",
                    weight = FontWeight.BOLD,
                    style = FontStyle.NORMAL,
                ),
            ),
        )
        val brandRegularFont = brandTypeface.fonts.firstOrNull {
            it.weight == FontWeight.NORMAL && it.style == FontStyle.NORMAL
        } ?: error("Brand Sans must include a regular font.")

        val headline = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(headline, text = "{{title}}")
        engine.block.setFont(headline, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(headline, fontSize = 72F)
        engine.block.setTextColor(headline, color = Color.fromHex("#171717"))
        engine.block.setPositionX(headline, value = 72F)
        engine.block.setPositionY(headline, value = 96F)
        engine.block.setWidth(headline, value = 656F)
        engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = headline)

        val subtitle = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(subtitle, text = "{{subtitle}}")
        engine.block.setFont(subtitle, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(subtitle, fontSize = 32F)
        engine.block.setTextColor(subtitle, color = Color.fromHex("#525252"))
        engine.block.setPositionX(subtitle, value = 72F)
        engine.block.setPositionY(subtitle, value = 194F)
        engine.block.setWidth(subtitle, value = 620F)
        engine.block.setHeightMode(subtitle, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = subtitle)

        val cta = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(cta, text = "{{cta}}")
        engine.block.setFont(cta, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(cta, fontSize = 36F)
        engine.block.setTextColor(cta, color = Color.fromHex("#171717"))
        engine.block.setPositionX(cta, value = 72F)
        engine.block.setPositionY(cta, value = 858F)
        engine.block.setWidth(cta, value = 400F)
        engine.block.setHeightMode(cta, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = cta)

        engine.variable.set(key = "title", value = "Summer Sale")
        engine.variable.set(key = "subtitle", value = "Up to 50% off all items")
        engine.variable.set(key = "cta", value = "Learn More")

        val variableNames = engine.variable.findAll()

        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        engine.block.setName(imageBlock, name = "hero-image")
        engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(imageBlock, value = 72F)
        engine.block.setPositionY(imageBlock, value = 300F)
        engine.block.setWidth(imageBlock, value = 656F)
        engine.block.setHeight(imageBlock, value = 500F)
        engine.block.setContentFillMode(imageBlock, mode = ContentFillMode.COVER)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "$bundledAssetsBaseUri/ly.img.image/images/sample_1.jpg",
        )
        engine.block.setFill(block = imageBlock, fill = imageFill)
        engine.block.appendChild(parent = page, child = imageBlock)

        val placeholderFill = engine.block.getFill(imageBlock)
        if (engine.block.supportsPlaceholderBehavior(placeholderFill)) {
            engine.block.setPlaceholderBehaviorEnabled(placeholderFill, enabled = true)
        }

        engine.block.setPlaceholderEnabled(imageBlock, enabled = true)
        if (engine.block.supportsPlaceholderControls(imageBlock)) {
            engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, enabled = true)
            engine.block.setPlaceholderControlsButtonEnabled(imageBlock, enabled = true)
        }

        engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)

        listOf(headline, subtitle, cta, imageBlock).forEach { block ->
            engine.block.setScopeEnabled(block = block, key = "layer/move", enabled = false)
            engine.block.setScopeEnabled(block = block, key = "layer/resize", enabled = false)
        }
        engine.block.setScopeEnabled(imageBlock, key = "fill/change", enabled = true)

        engine.block.forceLoadResources(blocks = listOf(page))
        val templateString = engine.scene.saveToString(scene = scene)
        val templateArchive = engine.scene.saveToArchive(scene = scene)

        val previewPng = engine.block.export(page, mimeType = MimeType.PNG)

        TemplateFromScratchResult(
            scene = scene,
            page = page,
            titleBlock = headline,
            imageBlock = imageBlock,
            templateString = templateString,
            templateArchive = templateArchive,
            previewPng = previewPng,
            variables = variableNames,
            placeholderBehaviorEnabled = engine.block.isPlaceholderBehaviorEnabled(placeholderFill),
            placeholderEnabled = engine.block.isPlaceholderEnabled(imageBlock),
            overlayEnabled = engine.block.isPlaceholderControlsOverlayEnabled(imageBlock),
            buttonEnabled = engine.block.isPlaceholderControlsButtonEnabled(imageBlock),
            imageCanMove = engine.block.isAllowedByScope(imageBlock, key = "layer/move"),
            imageCanResize = engine.block.isAllowedByScope(imageBlock, key = "layer/resize"),
            imageFillCanChange = engine.block.isAllowedByScope(imageBlock, key = "fill/change"),
        )
    } finally {
        previousGlobalScopes.forEach { (key, scope) ->
            engine.editor.setGlobalScope(key = key, globalScope = scope)
        }
        engine.variable.findAll().forEach { key ->
            runCatching { engine.variable.remove(key) }
        }
        previousVariables.forEach(engine.variable::set)
    }
}
```

```kotlin file=@cesdk_android_examples/engine-guides-create-templates-from-scratch/TemplateFromScratchResult.kt reference-only
import ly.img.engine.DesignBlock
import java.nio.ByteBuffer

data class TemplateFromScratchResult(
    val scene: DesignBlock,
    val page: DesignBlock,
    val titleBlock: DesignBlock,
    val imageBlock: DesignBlock,
    val templateString: String,
    val templateArchive: ByteBuffer,
    val previewPng: ByteBuffer,
    val variables: List<String>,
    val placeholderBehaviorEnabled: Boolean,
    val placeholderEnabled: Boolean,
    val overlayEnabled: Boolean,
    val buttonEnabled: Boolean,
    val imageCanMove: Boolean,
    val imageCanResize: Boolean,
    val imageFillCanChange: Boolean,
)
```

Build reusable design templates entirely through code for automation, batch
generation, and custom template creation tools.

![Create Templates From Scratch](https://img.ly/docs/cesdk/android/create-templates/from-scratch-663cda/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-create-templates-from-scratch)

CE.SDK lets you create a template without starting from an existing scene. You can define the page size, add text and graphic blocks, bind text variables, mark media as a placeholder, restrict editing with scopes, and save the result for reuse.

<EngineReferenceNote {...props} />

This guide uses a promotional card template with variable-driven text and one swappable image area. The sample assumes an existing `Engine` instance and focuses on the scene and block APIs that create the reusable template.

## Create a Blank Scene

Create the scene with pixel units for layout and text sizing, add a page, and define the template canvas size. On Android, page dimensions are set on the page block after the scene is created.

```kotlin highlight-android-create-scene
        val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)

        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(page, value = 800F)
        engine.block.setHeight(page, value = 1000F)
        engine.block.appendChild(parent = scene, child = page)
```

## Set Page Background

Use a color fill for the page background so every generated template starts from the same base appearance.

```kotlin highlight-android-add-background
val backgroundFill = engine.block.createFill(FillType.Color)
engine.block.setColor(
    block = backgroundFill,
    property = "fill/color/value",
    value = Color.fromRGBA(r = 0.98F, g = 0.98F, b = 0.99F, a = 1F),
)
engine.block.setFill(block = page, fill = backgroundFill)
```

The fill stores the color value, and `setFill` assigns that fill to the page.

## Add Text Blocks

Text blocks hold the template copy. The sample uses a bundled font, variable tokens for dynamic content, and fixed positions so the layout remains predictable.

```kotlin highlight-android-add-text
        val bundledAssetsBaseUri = "file:///android_asset/imgly-assets"
        val brandTypeface = Typeface(
            name = "Brand Sans",
            fonts = listOf(
                Font(
                    uri = Uri.parse("$bundledAssetsBaseUri/ly.img.typeface/fonts/FiraSans/FiraSans-Regular.ttf"),
                    subFamily = "Regular",
                    weight = FontWeight.NORMAL,
                    style = FontStyle.NORMAL,
                ),
                Font(
                    uri = Uri.parse("$bundledAssetsBaseUri/ly.img.typeface/fonts/FiraSans/FiraSans-Bold.ttf"),
                    subFamily = "Bold",
                    weight = FontWeight.BOLD,
                    style = FontStyle.NORMAL,
                ),
            ),
        )
        val brandRegularFont = brandTypeface.fonts.firstOrNull {
            it.weight == FontWeight.NORMAL && it.style == FontStyle.NORMAL
        } ?: error("Brand Sans must include a regular font.")

        val headline = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(headline, text = "{{title}}")
        engine.block.setFont(headline, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(headline, fontSize = 72F)
        engine.block.setTextColor(headline, color = Color.fromHex("#171717"))
        engine.block.setPositionX(headline, value = 72F)
        engine.block.setPositionY(headline, value = 96F)
        engine.block.setWidth(headline, value = 656F)
        engine.block.setHeightMode(headline, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = headline)

        val subtitle = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(subtitle, text = "{{subtitle}}")
        engine.block.setFont(subtitle, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(subtitle, fontSize = 32F)
        engine.block.setTextColor(subtitle, color = Color.fromHex("#525252"))
        engine.block.setPositionX(subtitle, value = 72F)
        engine.block.setPositionY(subtitle, value = 194F)
        engine.block.setWidth(subtitle, value = 620F)
        engine.block.setHeightMode(subtitle, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = subtitle)

        val cta = engine.block.create(DesignBlockType.Text)
        engine.block.replaceText(cta, text = "{{cta}}")
        engine.block.setFont(cta, fontFileUri = brandRegularFont.uri, typeface = brandTypeface)
        engine.block.setTextFontSize(cta, fontSize = 36F)
        engine.block.setTextColor(cta, color = Color.fromHex("#171717"))
        engine.block.setPositionX(cta, value = 72F)
        engine.block.setPositionY(cta, value = 858F)
        engine.block.setWidth(cta, value = 400F)
        engine.block.setHeightMode(cta, mode = SizeMode.AUTO)
        engine.block.appendChild(parent = page, child = cta)
```

Each text block is appended to the page after its content, typography, position, and sizing are configured.

## Add Text Variables

Variables populate the `{{title}}`, `{{subtitle}}`, and `{{cta}}` tokens in the text blocks. Set defaults while authoring the template so the design has meaningful preview content.

```kotlin highlight-android-add-variables
        engine.variable.set(key = "title", value = "Summer Sale")
        engine.variable.set(key = "subtitle", value = "Up to 50% off all items")
        engine.variable.set(key = "cta", value = "Learn More")

        val variableNames = engine.variable.findAll()
```

When your app applies the template later, call `engine.variable.set` again with the runtime values.

## Add Graphic Blocks

Graphic blocks are the image containers in the template. Give the image block a name so your app can find it later, then assign a rectangle shape and image fill.

```kotlin highlight-android-add-graphic
        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        engine.block.setName(imageBlock, name = "hero-image")
        engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(imageBlock, value = 72F)
        engine.block.setPositionY(imageBlock, value = 300F)
        engine.block.setWidth(imageBlock, value = 656F)
        engine.block.setHeight(imageBlock, value = 500F)
        engine.block.setContentFillMode(imageBlock, mode = ContentFillMode.COVER)

        val imageFill = engine.block.createFill(FillType.Image)
        engine.block.setString(
            block = imageFill,
            property = "fill/image/imageFileURI",
            value = "$bundledAssetsBaseUri/ly.img.image/images/sample_1.jpg",
        )
        engine.block.setFill(block = imageBlock, fill = imageFill)
        engine.block.appendChild(parent = page, child = imageBlock)
```

The sample uses an Android asset URI for the preview image. In your app, replace it with a stable local or remote URI that can be resolved when the template is loaded.

## Configure Placeholders

Placeholder behavior makes the image fill act as swappable content, while placeholder controls make the containing block interactive in editor UI workflows.

```kotlin highlight-android-configure-placeholder
        val placeholderFill = engine.block.getFill(imageBlock)
        if (engine.block.supportsPlaceholderBehavior(placeholderFill)) {
            engine.block.setPlaceholderBehaviorEnabled(placeholderFill, enabled = true)
        }

        engine.block.setPlaceholderEnabled(imageBlock, enabled = true)
        if (engine.block.supportsPlaceholderControls(imageBlock)) {
            engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, enabled = true)
            engine.block.setPlaceholderControlsButtonEnabled(imageBlock, enabled = true)
        }
```

Enable placeholder behavior on the fill, then enable placeholder interaction and controls on the graphic block.

## Apply Editing Constraints

Scopes protect the layout while keeping the image content replaceable. Defer the global scopes to block-level settings, then lock movement and resizing on the template elements.

```kotlin highlight-android-apply-constraints
        engine.editor.setGlobalScope(key = "layer/move", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "layer/resize", globalScope = GlobalScope.DEFER)
        engine.editor.setGlobalScope(key = "fill/change", globalScope = GlobalScope.DEFER)

        listOf(headline, subtitle, cta, imageBlock).forEach { block ->
            engine.block.setScopeEnabled(block = block, key = "layer/move", enabled = false)
            engine.block.setScopeEnabled(block = block, key = "layer/resize", enabled = false)
        }
        engine.block.setScopeEnabled(imageBlock, key = "fill/change", enabled = true)
```

The image block keeps `fill/change` enabled so users or automation can replace the image without moving the placeholder.

## Save the Template

Save the finished scene as a string when assets stay externally resolvable, or as an archive when you need a portable package with accessible assets included.

```kotlin highlight-android-save-template
engine.block.forceLoadResources(blocks = listOf(page))
val templateString = engine.scene.saveToString(scene = scene)
val templateArchive = engine.scene.saveToArchive(scene = scene)
```

`saveToString` is compact and works well for templates stored alongside stable asset URLs. `saveToArchive` creates a ZIP archive that bundles assets the engine can access at save time.

## Troubleshooting

**Blocks do not appear**: Verify that every page, text block, and graphic block is attached with `engine.block.appendChild`.

**Variables do not resolve**: Check that each text token uses the same key as `engine.variable.set`, including the double curly braces in the text.

**The placeholder is not interactive**: Enable placeholder behavior on the fill and placeholder interaction on the graphic block.

**Constraints are not enforced**: Set the relevant global scope to `GlobalScope.DEFER` before applying block-level scope settings.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.create(designUnit=DesignUnit.PIXEL, fontSizeUnit=FontUnit.PIXEL)` | Create the empty template scene with pixel measurements and pixel text sizing. |
| `engine.block.create(blockType=DesignBlockType.Page)` | Create the template page. |
| `engine.block.create(blockType=DesignBlockType.Text)` | Create text blocks for variable-driven copy. |
| `engine.block.create(blockType=DesignBlockType.Graphic)` | Create the image placeholder block. |
| `engine.block.setWidth(block=_, value=_)` | Set page or block width. |
| `engine.block.setHeight(block=_, value=_)` | Set page or block height. |
| `engine.block.setPositionX(block=_, value=_)` | Set a block's horizontal position. |
| `engine.block.setPositionY(block=_, value=_)` | Set a block's vertical position. |
| `engine.block.setHeightMode(block=_, mode=SizeMode.AUTO)` | Let text block height fit its content. |
| `engine.block.appendChild(parent=_, child=_)` | Add a page or block to the scene hierarchy. |
| `engine.block.createFill(fillType=FillType.Color)` | Create the page background fill. |
| `engine.block.createFill(fillType=FillType.Image)` | Create the image fill used by the placeholder. |
| `engine.block.setColor(block=_, property="fill/color/value", value=_)` | Set the background fill color. |
| `engine.block.setFill(block=_, fill=_)` | Assign a fill to a page or graphic block. |
| `engine.block.replaceText(block=_, text=_)` | Set text block content. |
| `engine.block.setFont(block=_, fontFileUri=_, typeface=_)` | Apply the selected font to a text block. |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set text size. |
| `engine.block.setTextColor(block=_, color=_)` | Set text color. |
| `engine.variable.set(key=_, value=_)` | Set a text variable value. |
| `engine.variable.findAll()` | Read the variables registered in the scene. |
| `engine.block.setName(block=_, name=_)` | Name a block for later lookup. |
| `engine.block.createShape(type=ShapeType.Rect)` | Create a rectangular shape for the graphic block. |
| `engine.block.setShape(block=_, shape=_)` | Assign the shape to the graphic block. |
| `engine.block.setContentFillMode(block=_, mode=ContentFillMode.COVER)` | Crop the image to cover its placeholder bounds. |
| `engine.block.setString(block=_, property="fill/image/imageFileURI", value=_)` | Set the image URI on the image fill. |
| `engine.block.getFill(block=_)` | Read the fill block attached to the graphic block. |
| `engine.block.supportsPlaceholderBehavior(block=_)` | Check whether the fill supports placeholder behavior. |
| `engine.block.setPlaceholderBehaviorEnabled(block=_, enabled=_)` | Enable placeholder behavior on the fill. |
| `engine.block.setPlaceholderEnabled(block=_, enabled=_)` | Enable placeholder interaction on the graphic block. |
| `engine.block.supportsPlaceholderControls(block=_)` | Check whether the graphic block supports placeholder controls. |
| `engine.block.setPlaceholderControlsOverlayEnabled(block=_, enabled=_)` | Show the placeholder overlay. |
| `engine.block.setPlaceholderControlsButtonEnabled(block=_, enabled=_)` | Show the placeholder action button. |
| `engine.editor.setGlobalScope(key=_, globalScope=GlobalScope.DEFER)` | Defer a scope to block-level settings. |
| `engine.block.setScopeEnabled(block=_, key=_, enabled=_)` | Allow or deny a scope on one block. |
| `engine.block.forceLoadResources(blocks=_)` | Ensure referenced assets are loaded before saving. |
| `engine.scene.saveToString(scene=_)` | Serialize the template scene as a string. |
| `engine.scene.saveToArchive(scene=_)` | Save the template scene and accessible assets as an archive. |

## Next Steps

- [Placeholders](./add-dynamic-content/placeholders.md) - Configure placeholder behavior and visual controls in depth.
- [Text Variables](./add-dynamic-content/text-variables.md) - Implement dynamic text personalization with variables.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) — Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences
- [Add to Template Library](./add-to-template-library.md) — Save and organize templates in an asset source for users to browse and apply from the template library.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support