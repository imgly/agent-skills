> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Product Variations](./product-variations.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-product-variations/ProductVariations.kt reference-only
import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.MimeType
import ly.img.engine.ShapeType
import java.io.File

private data class ProductVariant(
    val name: String,
    val color: String,
    val size: String,
    val price: String,
    val imageURL: String,
)

private val productVariableKeys = listOf("ProductName", "ProductColor", "ProductPrice")

suspend fun productVariations(
    engine: Engine,
    context: Context,
): List<File> = withContext(engine.dispatcher) {
    val currentVariableKeys = engine.variable.findAll().toSet()
    val previousVariables = productVariableKeys
        .filter(currentVariableKeys::contains)
        .associateWith(engine.variable::get)

    try {
        createProductVariations(engine = engine, context = context)
    } finally {
        val variablesToRemove = engine.variable.findAll().toSet()
        productVariableKeys.filter(variablesToRemove::contains).forEach(engine.variable::remove)
        previousVariables.forEach { (key, value) -> engine.variable.set(key = key, value = value) }
    }
}

private suspend fun createProductVariations(
    engine: Engine,
    context: Context,
): List<File> {
    val variants = listOf(
        ProductVariant(
            name = "Classic Tee",
            color = "Midnight Black",
            size = "M",
            price = "$29.99",
            imageURL = "https://img.ly/static/ubq_samples/sample_1.jpg",
        ),
        ProductVariant(
            name = "Classic Tee",
            color = "Ocean Blue",
            size = "L",
            price = "$34.99",
            imageURL = "https://img.ly/static/ubq_samples/sample_2.jpg",
        ),
    )

    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 500F)
    engine.block.setHeight(page, value = 500F)

    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = text)
    engine.block.setWidth(text, value = 400F)
    engine.block.setHeight(text, value = 50F)
    engine.block.setPositionX(text, value = 50F)
    engine.block.setPositionY(text, value = 50F)
    engine.block.setName(text, name = "ProductTitle")
    engine.block.replaceText(text, text = "{{ProductName}} – {{ProductColor}}")
    engine.block.setTextColor(text, color = Color.fromHex("#FF000000"))

    val priceText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = priceText)
    engine.block.setWidth(priceText, value = 200F)
    engine.block.setHeight(priceText, value = 40F)
    engine.block.setPositionX(priceText, value = 50F)
    engine.block.setPositionY(priceText, value = 120F)
    engine.block.setName(priceText, name = "ProductPriceLabel")
    engine.block.replaceText(priceText, text = "{{ProductPrice}}")
    engine.block.setTextColor(priceText, color = Color.fromHex("#FF000000"))

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = page, child = imageBlock)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 180F)
    engine.block.setName(imageBlock, name = "ProductImage")
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setFill(imageBlock, fill = imageFill)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setContentFillMode(imageBlock, ContentFillMode.CONTAIN)

    // Seed the variable store that this sample persists with the reusable template string.
    engine.variable.set(key = "ProductName", value = variants.first().name)
    engine.variable.set(key = "ProductColor", value = variants.first().color)
    engine.variable.set(key = "ProductPrice", value = variants.first().price)

    val templateString = engine.scene.saveToString(scene = scene)

    engine.block.forceLoadResources(listOf(imageBlock, text, priceText))

    val tokenRegex = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
    val templateTokens = engine.block.findByType(DesignBlockType.Text)
        .flatMap { textBlock ->
            tokenRegex.findAll(engine.block.getString(textBlock, property = "text/text"))
                .map { match -> match.groupValues[1].trim() }
                .toList()
        }
        .distinct()
    println("Template text tokens: $templateTokens")
    // Expected: [ProductName, ProductColor, ProductPrice]

    val exportedFiles = mutableListOf<File>()

    for (variant in variants) {
        engine.scene.load(scene = templateString)

        engine.variable.set(key = "ProductName", value = variant.name)
        engine.variable.set(key = "ProductColor", value = variant.color)
        engine.variable.set(key = "ProductPrice", value = variant.price)
        // Keep the rendered text blocks in sync for Android's offscreen export path.
        engine.block.findByName("ProductTitle").firstOrNull()?.let { title ->
            engine.block.replaceText(
                title,
                text = "${variant.name} – ${variant.color} (${variant.size})",
            )
        }
        engine.block.findByName("ProductPriceLabel").firstOrNull()?.let { priceLabel ->
            engine.block.replaceText(priceLabel, text = "${variant.price} · Size ${variant.size}")
        }

        engine.block.findByName("ProductImage").firstOrNull()?.let { block ->
            val fill = engine.block.getFill(block)
            engine.block.setString(
                block = fill,
                property = "fill/image/imageFileURI",
                value = variant.imageURL,
            )
            engine.block.resetCrop(block)
        }

        val exportPage = engine.block.findByType(DesignBlockType.Page).firstOrNull()
            ?: continue
        // Android needs explicit resource preloading so text glyphs and image fills are
        // resolved before the offscreen export runs.
        engine.block.forceLoadResources(
            engine.block.findByType(DesignBlockType.Text) +
                engine.block.findByName("ProductImage"),
        )
        val blob = engine.block.export(exportPage, mimeType = MimeType.JPEG)

        val fileName =
            "product-${variant.color.lowercase().replace(" ", "-")}-${variant.size}.jpg"
        val file = File(context.cacheDir, fileName)
        withContext(Dispatchers.IO) {
            blob.rewind()
            file.outputStream().channel.use { channel ->
                channel.write(blob)
            }
        }
        exportedFiles += file
    }

    return exportedFiles
}
```

Generate multiple product variants — different colors, sizes or copy — from a single design template using the CE.SDK Engine API in Kotlin.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-product-variations)

<EngineReferenceNote {...props} />

## What You'll Learn

- Define a data model to describe product attribute combinations.
- Load a design template and scan its text blocks for `{{...}}` tokens.
- Replace text placeholders and swap product images for each variant.
- Export each variation as JPEG.

## When to Use It

Use product variations when a single product needs multiple visual representations — for example, a t-shirt in five colors or a sneaker in three sizes. Each variant shares the same layout but differs in text, images or styling.

For generating many images from **different data records**, see [Batch Processing](./batch-processing.md). For producing **multiple layout formats** from one record, see [Multiple Image Generation](./multi-image-generation.md).

## Define the Data Model

Start by modeling your product variants. Each entry represents one combination of attributes to apply to the template.

```kotlin highlight-android-product-variations-data-model
val variants = listOf(
    ProductVariant(
        name = "Classic Tee",
        color = "Midnight Black",
        size = "M",
        price = "$29.99",
        imageURL = "https://img.ly/static/ubq_samples/sample_1.jpg",
    ),
    ProductVariant(
        name = "Classic Tee",
        color = "Ocean Blue",
        size = "L",
        price = "$34.99",
        imageURL = "https://img.ly/static/ubq_samples/sample_2.jpg",
    ),
)
```

The `imageURL` points to the product photo for that color variant. In production, you'd load these from an API or database.

## Create a Template

Product variation templates use **text variables** (wrapped in `{{double braces}}`) and **named image blocks** as placeholders. You can create templates in the Web CE.SDK editor and save them as archives, or build them on any platform programmatically (see example below).

```kotlin highlight-android-product-variations-create-template
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 500F)
    engine.block.setHeight(page, value = 500F)

    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = text)
    engine.block.setWidth(text, value = 400F)
    engine.block.setHeight(text, value = 50F)
    engine.block.setPositionX(text, value = 50F)
    engine.block.setPositionY(text, value = 50F)
    engine.block.setName(text, name = "ProductTitle")
    engine.block.replaceText(text, text = "{{ProductName}} – {{ProductColor}}")
    engine.block.setTextColor(text, color = Color.fromHex("#FF000000"))

    val priceText = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = priceText)
    engine.block.setWidth(priceText, value = 200F)
    engine.block.setHeight(priceText, value = 40F)
    engine.block.setPositionX(priceText, value = 50F)
    engine.block.setPositionY(priceText, value = 120F)
    engine.block.setName(priceText, name = "ProductPriceLabel")
    engine.block.replaceText(priceText, text = "{{ProductPrice}}")
    engine.block.setTextColor(priceText, color = Color.fromHex("#FF000000"))

    val imageBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = page, child = imageBlock)
    engine.block.setShape(imageBlock, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setWidth(imageBlock, value = 300F)
    engine.block.setHeight(imageBlock, value = 300F)
    engine.block.setPositionX(imageBlock, value = 100F)
    engine.block.setPositionY(imageBlock, value = 180F)
    engine.block.setName(imageBlock, name = "ProductImage")
    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setFill(imageBlock, fill = imageFill)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setContentFillMode(imageBlock, ContentFillMode.CONTAIN)

    // Seed the variable store that this sample persists with the reusable template string.
    engine.variable.set(key = "ProductName", value = variants.first().name)
    engine.variable.set(key = "ProductColor", value = variants.first().color)
    engine.variable.set(key = "ProductPrice", value = variants.first().price)

    val templateString = engine.scene.saveToString(scene = scene)
```

The template text uses `{{ProductName}}`, `{{ProductColor}}` and `{{ProductPrice}}` tokens, and the sample seeds those keys into `engine.variable` before saving the reusable template string. Named image blocks like `"ProductImage"` let you swap fills by name.

## Discover Template Variables

Before processing, scan the template text blocks for `{{...}}` tokens so you can validate the placeholders the design expects at runtime.

```kotlin highlight-android-product-variations-discover-variables
val tokenRegex = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
val templateTokens = engine.block.findByType(DesignBlockType.Text)
    .flatMap { textBlock ->
        tokenRegex.findAll(engine.block.getString(textBlock, property = "text/text"))
            .map { match -> match.groupValues[1].trim() }
            .toList()
    }
    .distinct()
println("Template text tokens: $templateTokens")
// Expected: [ProductName, ProductColor, ProductPrice]
```

On Android, `engine.variable.findAll()` inspects the current variable store, not unresolved placeholder tokens in the template text. The sample therefore scans each text block's `text/text` content with a regex and extracts the referenced token names directly from the template.

## Generate Variations

Loop through each variant, reload the template, populate variables, then export.

```kotlin highlight-android-product-variations-generate-loop
    for (variant in variants) {
        engine.scene.load(scene = templateString)

        engine.variable.set(key = "ProductName", value = variant.name)
        engine.variable.set(key = "ProductColor", value = variant.color)
        engine.variable.set(key = "ProductPrice", value = variant.price)
        // Keep the rendered text blocks in sync for Android's offscreen export path.
        engine.block.findByName("ProductTitle").firstOrNull()?.let { title ->
            engine.block.replaceText(
                title,
                text = "${variant.name} – ${variant.color} (${variant.size})",
            )
        }
        engine.block.findByName("ProductPriceLabel").firstOrNull()?.let { priceLabel ->
            engine.block.replaceText(priceLabel, text = "${variant.price} · Size ${variant.size}")
        }

        engine.block.findByName("ProductImage").firstOrNull()?.let { block ->
            val fill = engine.block.getFill(block)
            engine.block.setString(
                block = fill,
                property = "fill/image/imageFileURI",
                value = variant.imageURL,
            )
            engine.block.resetCrop(block)
        }

        val exportPage = engine.block.findByType(DesignBlockType.Page).firstOrNull()
            ?: continue
        // Android needs explicit resource preloading so text glyphs and image fills are
        // resolved before the offscreen export runs.
        engine.block.forceLoadResources(
            engine.block.findByType(DesignBlockType.Text) +
                engine.block.findByName("ProductImage"),
        )
        val blob = engine.block.export(exportPage, mimeType = MimeType.JPEG)

        val fileName =
            "product-${variant.color.lowercase().replace(" ", "-")}-${variant.size}.jpg"
        val file = File(context.cacheDir, fileName)
        withContext(Dispatchers.IO) {
            blob.rewind()
            file.outputStream().channel.use { channel ->
                channel.write(blob)
            }
        }
        exportedFiles += file
    }
```

### Set Text Variables

Use `engine.variable.set(key =, value =)` to replace each placeholder with the variant's data:

```kotlin highlight-android-product-variations-set-variables
engine.variable.set(key = "ProductName", value = variant.name)
engine.variable.set(key = "ProductColor", value = variant.color)
engine.variable.set(key = "ProductPrice", value = variant.price)
// Keep the rendered text blocks in sync for Android's offscreen export path.
engine.block.findByName("ProductTitle").firstOrNull()?.let { title ->
    engine.block.replaceText(
        title,
        text = "${variant.name} – ${variant.color} (${variant.size})",
    )
}
engine.block.findByName("ProductPriceLabel").firstOrNull()?.let { priceLabel ->
    engine.block.replaceText(priceLabel, text = "${variant.price} · Size ${variant.size}")
}
```

All variable values are strings. Convert numbers or prices to their display format before setting them.

### Replace the Product Image

Find the image block by its name and update its fill URI:

```kotlin highlight-android-product-variations-replace-image
engine.block.findByName("ProductImage").firstOrNull()?.let { block ->
    val fill = engine.block.getFill(block)
    engine.block.setString(
        block = fill,
        property = "fill/image/imageFileURI",
        value = variant.imageURL,
    )
    engine.block.resetCrop(block)
}
```

The block name `"ProductImage"` was assigned when the template was created. Using names keeps automation readable compared to referencing block IDs directly.

### Export the Variant

Export the populated page as JPEG and write it to disk:

```kotlin highlight-android-product-variations-export
        val exportPage = engine.block.findByType(DesignBlockType.Page).firstOrNull()
            ?: continue
        // Android needs explicit resource preloading so text glyphs and image fills are
        // resolved before the offscreen export runs.
        engine.block.forceLoadResources(
            engine.block.findByType(DesignBlockType.Text) +
                engine.block.findByName("ProductImage"),
        )
        val blob = engine.block.export(exportPage, mimeType = MimeType.JPEG)

        val fileName =
            "product-${variant.color.lowercase().replace(" ", "-")}-${variant.size}.jpg"
        val file = File(context.cacheDir, fileName)
        withContext(Dispatchers.IO) {
            blob.rewind()
            file.outputStream().channel.use { channel ->
                channel.write(blob)
            }
        }
        exportedFiles += file
```

On Android, preload the text and image blocks before exporting so glyphs and remote image fills are resolved before the offscreen JPEG render runs.

You can export as PNG, PDF or other formats by changing the `mimeType` parameter. See the [Export](../export-save-publish/export.md) guide for all available options.

## Next Steps

Product variations are one pattern for automating design output. Explore related guides:

- [Batch Processing](./batch-processing.md) — process many data records at once.
- [Multiple Image Generation](./multi-image-generation.md) — create multiple layout formats from one record.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — deep dive into the variable system.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — work with placeholder blocks.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support