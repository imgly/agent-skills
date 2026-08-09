> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Apply a Template](./apply-template.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-apply-template/ApplyTemplate.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.ExportOptions
import ly.img.engine.FontUnit
import ly.img.engine.MimeType
import ly.img.engine.SizeMode
import java.io.File
import java.nio.ByteBuffer
import kotlin.math.abs

data class ApplyTemplate(
    val uriWidth: Float,
    val uriHeight: Float,
    val switchedWidth: Float,
    val switchedHeight: Float,
    val stringWidth: Float,
    val stringHeight: Float,
    val serializedTemplateLength: Int,
    val previewPngData: ByteBuffer,
)

suspend fun applyTemplate(engine: Engine): ApplyTemplate {
    val firstTemplateString = createTemplateString(engine = engine, headlineText = "Spring Sale")
    val secondTemplateString = createTemplateString(engine = engine, headlineText = "New Arrivals")
    val firstTemplateFile = File.createTempFile("spring-sale-template", ".imgly").apply {
        writeText(firstTemplateString)
    }
    val secondTemplateFile = File.createTempFile("new-arrivals-template", ".imgly").apply {
        writeText(secondTemplateString)
    }

    try {
        return applyTemplates(
            engine = engine,
            firstTemplateFile = firstTemplateFile,
            secondTemplateFile = secondTemplateFile,
            firstTemplateString = firstTemplateString,
        )
    } finally {
        firstTemplateFile.delete()
        secondTemplateFile.delete()
    }
}

private suspend fun applyTemplates(
    engine: Engine,
    firstTemplateFile: File,
    secondTemplateFile: File,
    firstTemplateString: String,
): ApplyTemplate {
    val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)
    val page = engine.scene.getPages().firstOrNull() ?: engine.block.create(DesignBlockType.Page).also {
        engine.block.appendChild(parent = scene, child = it)
    }

    val targetWidth = 1080F
    val targetHeight = 1920F
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/width",
        value = targetWidth,
    )
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/height",
        value = targetHeight,
    )
    engine.block.setWidthMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(block = page, value = targetWidth)
    engine.block.setHeight(block = page, value = targetHeight)

    val templateUri = Uri.fromFile(firstTemplateFile)
    engine.scene.applyTemplate(templateUri = templateUri)

    val appliedScene = requireNotNull(engine.scene.get()) { "No scene loaded after applying the template." }
    val appliedWidth = engine.block.getFloat(
        block = appliedScene,
        property = "scene/pageDimensions/width",
    )
    val appliedHeight = engine.block.getFloat(
        block = appliedScene,
        property = "scene/pageDimensions/height",
    )

    check(abs(appliedWidth - targetWidth) < 0.001F) {
        "Expected applied width $targetWidth but was $appliedWidth."
    }
    check(abs(appliedHeight - targetHeight) < 0.001F) {
        "Expected applied height $targetHeight but was $appliedHeight."
    }

    val alternativeTemplateUri = Uri.fromFile(secondTemplateFile)
    engine.scene.applyTemplate(templateUri = alternativeTemplateUri)

    val switchedScene = requireNotNull(engine.scene.get()) { "No scene loaded after switching templates." }
    val switchedWidth = engine.block.getFloat(
        block = switchedScene,
        property = "scene/pageDimensions/width",
    )
    val switchedHeight = engine.block.getFloat(
        block = switchedScene,
        property = "scene/pageDimensions/height",
    )
    check(abs(switchedWidth - targetWidth) < 0.001F) {
        "Expected switched width $targetWidth but was $switchedWidth."
    }
    check(abs(switchedHeight - targetHeight) < 0.001F) {
        "Expected switched height $targetHeight but was $switchedHeight."
    }

    val templateString = firstTemplateString
    engine.scene.applyTemplate(template = templateString)

    val stringScene = requireNotNull(engine.scene.get()) { "No scene loaded after applying the template string." }
    val stringWidth = engine.block.getFloat(
        block = stringScene,
        property = "scene/pageDimensions/width",
    )
    val stringHeight = engine.block.getFloat(
        block = stringScene,
        property = "scene/pageDimensions/height",
    )
    check(abs(stringWidth - targetWidth) < 0.001F) {
        "Expected string-applied width $targetWidth but was $stringWidth."
    }
    check(abs(stringHeight - targetHeight) < 0.001F) {
        "Expected string-applied height $targetHeight but was $stringHeight."
    }

    val previewPage = engine.scene.getPages().first()
    val previewPngData = engine.block.export(
        block = previewPage,
        mimeType = MimeType.PNG,
        options = ExportOptions(targetWidth = 360F, targetHeight = 640F),
    )

    return ApplyTemplate(
        uriWidth = appliedWidth,
        uriHeight = appliedHeight,
        switchedWidth = switchedWidth,
        switchedHeight = switchedHeight,
        stringWidth = stringWidth,
        stringHeight = stringHeight,
        serializedTemplateLength = firstTemplateString.length,
        previewPngData = previewPngData,
    )
}

private suspend fun createTemplateString(
    engine: Engine,
    headlineText: String,
): String {
    val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)
    val page = engine.scene.getPages().firstOrNull() ?: engine.block.create(DesignBlockType.Page).also {
        engine.block.appendChild(parent = scene, child = it)
    }
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/width",
        value = 600F,
    )
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/height",
        value = 600F,
    )
    engine.block.setWidthMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(block = page, value = 600F)
    engine.block.setHeight(block = page, value = 600F)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(block = headline, text = headlineText)
    engine.block.setPositionX(block = headline, value = 72F)
    engine.block.setPositionY(block = headline, value = 96F)
    engine.block.setWidth(block = headline, value = 456F)
    engine.block.setHeight(block = headline, value = 120F)
    engine.block.appendChild(parent = page, child = headline)

    return engine.scene.saveToString(scene = scene)
}
```

Apply template content to an existing scene with the Android Engine API while
keeping your current page dimensions and design unit. Template content is
automatically scaled to fit, so you can switch layouts without changing the
canvas size.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-apply-template)

<EngineReferenceNote {...props} />

Applying a template loads the template's content into the current scene while keeping the scene's design unit and page dimensions. The content is resized to fit those dimensions. This differs from `engine.scene.load(sceneUri=_)`, which replaces the entire scene, including its dimensions.

This guide covers applying templates from a URI and from a serialized string, verifying that page dimensions stay fixed, and switching between templates on the same scene.

## When to Use Apply vs Load

Use `engine.scene.applyTemplate(templateUri=_)` or `engine.scene.applyTemplate(template=_)` when you want to:

- **Switch templates**: Let users preview different templates while keeping a consistent canvas size.
- **Standardize output dimensions**: Generate content with fixed sizes, such as social-media formats or print sizes.
- **Batch process with templates**: Apply different templates to a pre-configured scene without dimension drift.

Use `engine.scene.load(sceneUri=_)` when you need the template's original dimensions.

**Key distinction**: Loading replaces everything, including dimensions; applying keeps your dimensions and resizes the template's content to fit.

## Prepare Template Inputs

The sample creates two small template scenes so the URI and string examples run without external storage. The helper builds a square template scene, adds a text block, and serializes it to a `.scene` string.

```kotlin highlight-android-create-template
private suspend fun createTemplateString(
    engine: Engine,
    headlineText: String,
): String {
    val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)
    val page = engine.scene.getPages().firstOrNull() ?: engine.block.create(DesignBlockType.Page).also {
        engine.block.appendChild(parent = scene, child = it)
    }
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/width",
        value = 600F,
    )
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/height",
        value = 600F,
    )
    engine.block.setWidthMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(block = page, value = 600F)
    engine.block.setHeight(block = page, value = 600F)

    val headline = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(block = headline, text = headlineText)
    engine.block.setPositionX(block = headline, value = 72F)
    engine.block.setPositionY(block = headline, value = 96F)
    engine.block.setWidth(block = headline, value = 456F)
    engine.block.setHeight(block = headline, value = 120F)
    engine.block.appendChild(parent = page, child = headline)

    return engine.scene.saveToString(scene = scene)
}
```

Use those serialized template strings directly, or write them to temporary `.scene` files when the URI overload is the API under test. In your app, these values usually come from bundled files, app storage, or your backend.

```kotlin highlight-android-template-inputs
val firstTemplateString = createTemplateString(engine = engine, headlineText = "Spring Sale")
val secondTemplateString = createTemplateString(engine = engine, headlineText = "New Arrivals")
val firstTemplateFile = File.createTempFile("spring-sale-template", ".imgly").apply {
    writeText(firstTemplateString)
}
val secondTemplateFile = File.createTempFile("new-arrivals-template", ".imgly").apply {
    writeText(secondTemplateString)
}
```

## Apply a Template from URI

Create a scene and set the scene-level page dimensions you want to keep. `applyTemplate` reads these dimensions from `scene/pageDimensions/width` and `scene/pageDimensions/height`, then resizes the template content to fit them.

```kotlin highlight-android-setup
    val scene = engine.scene.create(designUnit = DesignUnit.PIXEL, fontSizeUnit = FontUnit.PIXEL)
    val page = engine.scene.getPages().firstOrNull() ?: engine.block.create(DesignBlockType.Page).also {
        engine.block.appendChild(parent = scene, child = it)
    }

    val targetWidth = 1080F
    val targetHeight = 1920F
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/width",
        value = targetWidth,
    )
    engine.block.setFloat(
        block = scene,
        property = "scene/pageDimensions/height",
        value = targetHeight,
    )
    engine.block.setWidthMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setHeightMode(block = page, mode = SizeMode.ABSOLUTE)
    engine.block.setWidth(block = page, value = targetWidth)
    engine.block.setHeight(block = page, value = targetHeight)
```

Call `engine.scene.applyTemplate(templateUri=_)` with a URI to a `.scene` template file. The sample writes a temporary template file to keep the guide self-contained; the same method accepts any reachable `.scene` URI from app storage or an asset host.

```kotlin highlight-android-apply-from-uri
val templateUri = Uri.fromFile(firstTemplateFile)
engine.scene.applyTemplate(templateUri = templateUri)
```

## Verify Preserved Dimensions

Applying a template reloads the scene, so query the current scene again with `engine.scene.get()` before reading its scene-level page dimensions. The width and height match the values set during setup, confirming the template adopted your dimensions instead of its own.

```kotlin highlight-android-verify-dimensions
    val appliedScene = requireNotNull(engine.scene.get()) { "No scene loaded after applying the template." }
    val appliedWidth = engine.block.getFloat(
        block = appliedScene,
        property = "scene/pageDimensions/width",
    )
    val appliedHeight = engine.block.getFloat(
        block = appliedScene,
        property = "scene/pageDimensions/height",
    )

    check(abs(appliedWidth - targetWidth) < 0.001F) {
        "Expected applied width $targetWidth but was $appliedWidth."
    }
    check(abs(appliedHeight - targetHeight) < 0.001F) {
        "Expected applied height $targetHeight but was $appliedHeight."
    }
```

## Template Switching

Apply another template to the same scene. Each call replaces the content while preserving the page dimensions and design unit, which is the basis for a preview experience where users explore different templates without affecting their canvas size.

```kotlin highlight-android-template-switching
val alternativeTemplateUri = Uri.fromFile(secondTemplateFile)
engine.scene.applyTemplate(templateUri = alternativeTemplateUri)
```

## Apply a Template from String

For templates stored in a database or returned from an API, pass the serialized scene contents to `engine.scene.applyTemplate(template=_)` as a string instead of a URI. The example creates a serialized template to keep the sample self-contained; in your app, the string comes from your own storage.

```kotlin highlight-android-apply-from-string
val templateString = firstTemplateString
engine.scene.applyTemplate(template = templateString)
```

## Troubleshooting

### No Scene Loaded

`engine.scene.applyTemplate(templateUri=_)` and `engine.scene.applyTemplate(template=_)` require an existing scene. Create one first with `engine.scene.create()` or load one with `engine.scene.load(sceneUri=_)`; otherwise the call fails.

### Template Not Accessible

Verify the template URI is reachable and valid. For remote URLs, check network connectivity; for bundled files, confirm the asset path resolves.

### Content Not Scaling as Expected

Template content scales to fit the current scene-level page dimensions. Set `scene/pageDimensions/width` and `scene/pageDimensions/height` before applying the template so the content adjusts to the size you expect.

## API Reference

| Method                                                                            | Category | Purpose                                                                        |
| --------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------ |
| `engine.scene.applyTemplate(templateUri=_)`                                       | Scene    | Apply a template from a URI, preserving current dimensions                     |
| `engine.scene.applyTemplate(template=_)`                                          | Scene    | Apply a template from a serialized scene string, preserving current dimensions |
| `engine.scene.create(designUnit=_, fontSizeUnit=_)`                               | Scene    | Create a new scene as the target for template application                      |
| `engine.scene.get()`                                                              | Scene    | Read the active scene after template application                               |
| `engine.scene.getPages()`                                                         | Scene    | Read the scene's page blocks                                                   |
| `engine.scene.load(sceneUri=_)`                                                   | Scene    | Load a scene when you want to replace the current dimensions                   |
| `engine.scene.saveToString(scene=_)`                                              | Scene    | Serialize a scene as a string                                                  |
| `engine.block.create(blockType=DesignBlockType.Page)`                             | Block    | Create a page block                                                            |
| `engine.block.create(blockType=DesignBlockType.Text)`                             | Block    | Create a text block for the template content                                   |
| `engine.block.appendChild(parent=_, child=_)`                                     | Block    | Add the page to the scene                                                      |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/width", value=_)`  | Block    | Set the scene-level page width                                                 |
| `engine.block.setFloat(block=_, property="scene/pageDimensions/height", value=_)` | Block    | Set the scene-level page height                                                |
| `engine.block.getFloat(block=_, property="scene/pageDimensions/width")`           | Block    | Read the scene-level page width                                                |
| `engine.block.getFloat(block=_, property="scene/pageDimensions/height")`          | Block    | Read the scene-level page height                                               |
| `engine.block.setWidthMode(block=_, mode=_)`                                      | Block    | Set the page width sizing mode                                                 |
| `engine.block.setHeightMode(block=_, mode=_)`                                     | Block    | Set the page height sizing mode                                                |
| `engine.block.setWidth(block=_, value=_)`                                         | Block    | Set the page width                                                             |
| `engine.block.setHeight(block=_, value=_)`                                        | Block    | Set the page height                                                            |
| `engine.block.replaceText(block=_, text=_)`                                       | Block    | Populate the text block in the template                                        |
| `engine.block.setPositionX(block=_, value=_)`                                     | Block    | Position the template text horizontally                                        |
| `engine.block.setPositionY(block=_, value=_)`                                     | Block    | Position the template text vertically                                          |

## Next Steps

- [Templates Overview](./overview.md) — Understanding templates in CE.SDK
- [Use Templates Programmatically](./programmatic.md) — Comprehensive programmatic
  template workflows
- [Headless Mode](../concepts/headless-mode.md) — Use the Engine directly without a prebuilt
  UI



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support