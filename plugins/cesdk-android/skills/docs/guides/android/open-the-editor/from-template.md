> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Create From Template](./from-template.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-from-template/FromTemplate.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.Font
import ly.img.engine.FontStyle
import ly.img.engine.FontWeight
import ly.img.engine.MimeType
import ly.img.engine.Typeface
import java.nio.ByteBuffer

data class FromTemplate(
    val pageCount: Int,
    val textBlockCount: Int,
    val customizedText: String?,
    val previewPngData: ByteBuffer,
)

suspend fun fromTemplate(engine: Engine): FromTemplate {
    val templateUri = Uri.parse(
        "https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0-rc.0/assets/ly.img.templates/templates/cesdk_business_card_1.scene",
    )
    val scene = engine.scene.load(sceneUri = templateUri, waitForResources = true)

    check(scene == engine.scene.get())

    val templateString = engine.scene.saveToString(scene = scene)
    engine.scene.load(scene = templateString, waitForResources = true)

    val replacementTemplateUri = Uri.parse(
        "https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0-rc.0/assets/ly.img.templates/templates/cesdk_business_card_1.scene",
    )
    engine.scene.applyTemplate(templateUri = replacementTemplateUri)

    val firstTextBlock = engine.block.findByType(DesignBlockType.Text).firstOrNull()
    if (firstTextBlock != null) {
        engine.block.replaceText(block = firstTextBlock, text = "Your Company")
    }

    val page = engine.block.findByType(DesignBlockType.Page).first()
    val exportTypeface = Typeface(
        name = "Fira Sans",
        fonts = listOf(
            Font(
                uri = Uri.parse("file:///android_asset/imgly-assets/ly.img.typeface/fonts/FiraSans/FiraSans-Regular.ttf"),
                subFamily = "Regular",
                weight = FontWeight.NORMAL,
                style = FontStyle.NORMAL,
            ),
        ),
    )
    val exportFont = exportTypeface.fonts.first()
    engine.block.findByType(DesignBlockType.Text).forEach { textBlock ->
        engine.block.setFont(block = textBlock, fontFileUri = exportFont.uri, typeface = exportTypeface)
    }
    engine.block.forceLoadResources(blocks = listOf(page))
    val pageWidth = engine.block.getWidth(page)
    val pageHeight = engine.block.getHeight(page)
    val previewPngData = engine.block.export(
        block = page,
        mimeType = MimeType.PNG,
        options = ExportOptions(
            targetWidth = 1200F,
            targetHeight = 1200F * pageHeight / pageWidth,
        ),
    )

    return FromTemplate(
        pageCount = engine.block.findByType(DesignBlockType.Page).size,
        textBlockCount = engine.block.findByType(DesignBlockType.Text).size,
        customizedText = firstTextBlock?.let { engine.block.getString(block = it, property = "text/text") },
        previewPngData = previewPngData,
    )
}
```

Load pre-designed templates to give users a professional starting point instead of a blank canvas.

![Customized template preview](https://img.ly/docs/cesdk/android/open-the-editor/from-template-46c096/assets/from-template-android.png)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-from-template)

<EngineReferenceNote {...props} />

Templates provide consistent layouts and styling that users can customize for their own needs. CE.SDK loads Android templates from remote or local scene URIs, from serialized strings, and applies template content to an existing scene while preserving its page dimensions.

## Load a Template from URL

The most common approach is loading a template from a `.scene` file URI. Pass the URI to `engine.scene.load(sceneUri=_)`, and the engine replaces the current scene with the loaded template.

```kotlin highlight-android-load-from-url
val templateUri = Uri.parse(
    "https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0-rc.0/assets/ly.img.templates/templates/cesdk_business_card_1.scene",
)
val scene = engine.scene.load(sceneUri = templateUri, waitForResources = true)
```

The scene file references assets by URI, so those assets must stay reachable. Use `waitForResources=true` when later code depends on the template's resources being loaded before it continues.

## Load a Template from String

When a template is stored as serialized scene data, load it with `engine.scene.load(scene=_)`. The string usually comes from a previous `engine.scene.saveToString(scene=_)` call and can be stored in your database or app storage.

```kotlin highlight-android-load-from-string
val templateString = engine.scene.saveToString(scene = scene)
engine.scene.load(scene = templateString, waitForResources = true)
```

This path is useful for restoring saved user designs or serving templates through your backend.

## Apply a Template to an Existing Scene

To populate an existing scene with template content while keeping its current page dimensions, use `engine.scene.applyTemplate(templateUri=_)`. Android also exposes `engine.scene.applyTemplate(template=_)` when the template is already available as a serialized string.

```kotlin highlight-android-apply-template
val replacementTemplateUri = Uri.parse(
    "https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0-rc.0/assets/ly.img.templates/templates/cesdk_business_card_1.scene",
)
engine.scene.applyTemplate(templateUri = replacementTemplateUri)
```

Use this when the canvas size is already set for a fixed output format and you want to drop in template content without changing those dimensions.

## Modify Template Content

After loading or applying a template, customize its blocks with the block APIs. Find the elements you want to change and update them.

```kotlin highlight-android-modify-content
val firstTextBlock = engine.block.findByType(DesignBlockType.Text).firstOrNull()
if (firstTextBlock != null) {
    engine.block.replaceText(block = firstTextBlock, text = "Your Company")
}
```

Common modifications include:

- **Replacing text**: `engine.block.replaceText(block=_, text=_)` swaps text content.
- **Swapping images**: set `fill/image/imageFileURI` on a graphic block's image fill with `engine.block.setUri(block=_, property=_, value=_)` — see [Image Fills](../fills/image.md).
- **Adjusting colors**: set `fill/color/value` on a block's fill — see [Color Fills](../fills/color.md).

## Troubleshooting

**Template fails to load**

- Verify the URI is reachable and returns a valid `.scene` file.
- Ensure the template format is compatible with your CE.SDK version.
- For remote URLs, confirm your app has network access and the server allows Android clients to download the file.

**Assets not displaying after load**

- Scene files store asset references as URIs; ensure those URIs remain reachable.
- Use an archive (`.imgly` or `.zip`) for a self-contained template with bundled assets, and load that archive with the same `engine.scene.load(sceneUri=_)` call.
- Configure a [URI resolver](./uri-resolver.md) if assets are hosted on a different server.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.load(sceneUri=_, waitForResources=_)` | Load a scene or archive from a remote or local URI (content detected automatically). |
| `engine.scene.load(scene=_, waitForResources=_)` | Load a scene from a serialized string. |
| `engine.scene.applyTemplate(templateUri=_)` | Apply a template scene URI to the current scene. |
| `engine.scene.applyTemplate(template=_)` | Apply a serialized string template to the current scene. |
| `engine.scene.saveToString(scene=_)` | Serialize the current scene to a string. |
| `engine.block.findByType(type=_)` | Find all blocks of a given type. |
| `engine.block.replaceText(block=_, text=_)` | Replace text content in a text block. |
| `engine.block.setString(block=_, property=_, value=_)` | Set a string property. |
| `engine.block.setUri(block=_, property=_, value=_)` | Set a URI property, such as an image fill URI. |
| `engine.block.setColor(block=_, property=_, value=_)` | Set a color property, such as a fill color. |

## Next Steps

- [Load a Scene](./load-scene.md) — Load saved scenes from various sources
- [Save a Design](../export-save-publish/save.md) — Save your customized template
- [Import a Design](./import-design.md) — Load previously saved scenes, self-contained archives, or create editable scenes from images and videos.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support