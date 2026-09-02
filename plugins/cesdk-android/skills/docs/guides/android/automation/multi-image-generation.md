> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Multiple Image Generation](./multi-image-generation.md)

---

Generate image variants, such as square, portrait, or landscape layouts, from a single data record using the CreativeEditor SDK's Engine API. This pattern lets you populate templates programmatically with text, images, and colors to create consistent, on-brand designs across all formats.

## What You'll Learn

- Load multiple templates into CE.SDK and populate them with structured data.
- Replace text and image placeholders dynamically using variables and named blocks.
- Apply consistent brand color themes across scenes.
- Export each variant as PNG, JPEG, or PDF.
- Build efficient workflows for generating multiple format variations.

## When to Use It

Use multi-image generation when a single record (like a restaurant listing or product) needs to produce multiple layout variants. For larger datasets with many records generating many images, refer to the [Batch Processing](./batch-processing.md) guide.

## Core Concepts

**Templates and Instances**:

Templates define reusable layout and placeholders. An instance is a populated version with specific data. Use `engine.scene.saveToString()` to serialize a template and `engine.scene.load(scene =)` to load it for processing.

**Variables for Dynamic Text**:

Define variables in your templates for fields like `RestaurantName` or `Rating`. Set them at runtime with `engine.variable.set(key =, value =)`. Use `engine.variable.findAll()` to verify available variable names.

**Named Blocks for Image Replacement**:

Name your image placeholders (for example, `RestaurantImage`, `Logo`). Retrieve them with `engine.block.findByName()`, access the fill with `getFill()`, then update its source URI using `setString(..., property = "fill/image/imageFileURI")`. Always reset the crop after replacing an image fill for proper framing.

**Brand and Conditional Styling**:

Use predictable block naming for elements such as star ratings. Apply color changes programmatically with `setColor` to visualize rating or brand status.

**Sequential Template Processing**:

Process each variant one at a time to reduce memory pressure and simplify export tracking.

## Prerequisites

- CE.SDK for Android integrated through Gradle.
- A valid license key.
- Templates saved as `.scene` files in assets or available via URLs.
- Template variables and named blocks prepared for population.

## Initialize the Engine

```kotlin
import ly.img.engine.Engine
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

fun makeEngine(license: String, userId: String) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.multiimage")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)
    val baseUri = Uri.parse("https://cdn.img.ly/packages/imgly/cesdk-android/1.83.0-nightly.20260902/assets")
    listOf(
        "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
        "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
        "ly.img.page.presets", "ly.img.text", "ly.img.text.components",
    ).forEach { id ->
        engine.asset.addLocalSourceFromJSON(contentUri = "$baseUri/$id/content.json".toUri())
    }
}
```

## Define Your Data Model

Your data model can use proper typing for variables. When you insert values into the templates, you will often need to convert them to strings.

```kotlin
import java.util.UUID

data class Restaurant(
    val id: UUID = UUID.randomUUID(),
    val name: String,
    val rating: Double,
    val reviewCount: Int,
    val imageURL: String,
    val logoURL: String,
    val brandPrimary: String,
    val brandSecondary: String
)
```

This model provides a data record for the example code below.

## Populate Templates and Export Variants

Use one template per format such as:

- square
- portrait
- landscape

Populate the templates sequentially.

```kotlin
import android.content.Context
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MimeType
import java.io.File

suspend fun generateVariants(
    engine: Engine,
    context: Context,
    restaurant: Restaurant
): List<File> {
    val templates = listOf(
        "restaurant_square.scene",
        "restaurant_portrait.scene",
        "restaurant_landscape.scene"
    )
    
    val results = mutableListOf<File>()
    
    for (template in templates) {
        val templateUri = Uri.parse("file:///android_asset/templates/$template")
        val scene = engine.scene.load(sceneUri = templateUri)
        
        // Set text variables
        engine.variable.set(key = "RestaurantName", value = restaurant.name)
        engine.variable.set(key = "Rating", value = String.format("%.1f ★", restaurant.rating))
        engine.variable.set(key = "ReviewCount", value = "${restaurant.reviewCount}")
        
        // Replace images
        replaceImage(engine, name = "RestaurantImage", uri = restaurant.imageURL)
        replaceImage(engine, name = "Logo", uri = restaurant.logoURL)
        
        // Apply brand theme
        applyBrandTheme(
            engine = engine,
            primary = parseColor(restaurant.brandPrimary),
            secondary = parseColor(restaurant.brandSecondary)
        )
        
        // Export variant
        val output = exportJPEG(engine, context, outputName(restaurant, template))
        results.add(output)
    }
    
    return results
}

fun outputName(restaurant: Restaurant, template: String): String {
    val format = template.substringAfter("restaurant_").substringBefore(".scene")
    return "${restaurant.name.replace(" ", "_")}_$format"
}
```

**Helper Functions**:

The preceding code example uses some helper functions. These aren't part of the CE.SDK. Possible implementations of the functions follow.

```kotlin
import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MimeType
import java.io.File

fun replaceImage(engine: Engine, name: String, uri: String) {
    val matches = engine.block.findByName(name)
    if (matches.isNotEmpty()) {
        val block = matches.first()
        val fill = engine.block.getFill(block)
        engine.block.setString(fill, property = "fill/image/imageFileURI", value = uri)
        engine.block.resetCrop(block)
    }
}

fun applyBrandTheme(engine: Engine, primary: Color, secondary: Color) {
    val allBlocks = engine.block.findAll()
    
    for (block in allBlocks) {
        when (engine.block.getType(block)) {
            "//ly.img.ubq/text" -> {
                engine.block.setTextColor(block, color = primary)
            }
            "//ly.img.ubq/graphic" -> {
                runCatching {
                    val fill = engine.block.getFill(block)
                    engine.block.setColor(fill, property = "fill/color/value", color = secondary)
                }
            }
        }
    }
}

suspend fun exportJPEG(engine: Engine, context: Context, name: String): File {
    val page = engine.block.findByType(DesignBlockType.Page).firstOrNull()
        ?: throw IllegalStateException("No page found")
    
    val data = engine.block.export(page, mimeType = MimeType.JPEG)
    val dir = context.filesDir
    val file = File(dir, "$name.jpg")
    
    withContext(Dispatchers.IO) {
        file.outputStream().channel.use { channel ->
            channel.write(data)
        }
    }
    
    return file
}
```

## Color Utility

Add this helper to convert hex strings into CE.SDK `Color` values.

```kotlin
import ly.img.engine.Color

fun parseColor(hex: String): Color {
    var hexString = hex.trim().removePrefix("#")
    
    // Add alpha if missing
    if (hexString.length == 6) {
        hexString += "FF"
    }
    
    val hexValue = hexString.toLongOrNull(16) ?: 0L
    
    val r = ((hexValue and 0xFF000000) shr 24).toFloat() / 255f
    val g = ((hexValue and 0x00FF0000) shr 16).toFloat() / 255f
    val b = ((hexValue and 0x0000FF00) shr 8).toFloat() / 255f
    val a = (hexValue and 0x000000FF).toFloat() / 255f
    
    return Color(r = r, g = g, b = b, a = a)
}
```

## Preview the Generated Variants

Use Jetpack Compose to display and share generated images.

```kotlin
import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Card
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import java.io.File

@Composable
fun VariantsGrid(files: List<File>) {
    var selectedFile by remember { mutableStateOf<File?>(null) }
    
    LazyVerticalGrid(
        columns = GridCells.Adaptive(minSize = 160.dp),
        contentPadding = PaddingValues(12.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(files) { file ->
            Card(
                modifier = Modifier
                    .aspectRatio(1f)
                    .shadow(elevation = 2.dp, shape = RoundedCornerShape(10.dp))
                    .clickable { selectedFile = file },
                shape = RoundedCornerShape(10.dp)
            ) {
                Image(
                    painter = rememberAsyncImagePainter(file),
                    contentDescription = file.name,
                    contentScale = ContentScale.Crop,
                    modifier = Modifier.fillMaxSize()
                )
            }
        }
    }
    
    // Handle share dialog for selectedFile if needed
}
```

## Advanced Use Cases

**Conditional Content**:

Show or hide elements based on data values—for example, color stars according to the rating.

```kotlin
import ly.img.engine.Color
import ly.img.engine.Engine

fun colorStars(engine: Engine, rating: Int, baseName: String = "Rating") {
    for (index in 1..5) {
        val starBlocks = engine.block.findByName("$baseName$index")
        if (starBlocks.isEmpty()) continue
        
        val star = starBlocks.first()
        runCatching {
            val fill = engine.block.getFill(star)
            val color = if (index <= rating) {
                parseColor("#FFD60A")
            } else {
                parseColor("#CCCCCC")
            }
            engine.block.setColor(fill, property = "fill/color/value", color = color)
        }
    }
}
```

**Custom Assets**:

Add your own logos or fonts by registering a custom asset source. See the [Unsplash](../import-media/from-remote-source/unsplash.md) guide for a complete custom asset source example covering search, pagination, and asset mapping.

**Adopter Mode Editing**:

Allow users to open the generated design in the editor UI for minor edits. Serialize the populated scene with `engine.scene.saveToString()` and load it into the Design Editor configured for [restricted content](../create-templates/lock.md) editing.

## Troubleshooting

**❌ Variables not updating**:

- Verify variable names in both template and code using `engine.variable.findAll()`.
- Variable names are case-sensitive.
- Ensure `engine.variable.set()` is called with the correct key.

**❌ Images missing**:

- Confirm local path or remote URL points to a valid image.
- For remote images, add `<uses-permission android:name="android.permission.INTERNET" />` to AndroidManifest.xml.
- Verify CORS settings for remote images.

**❌ Colors incorrect**:

- Check block type before applying color with `engine.block.getType()`.
- Ensure color values are in range 0-1 (not 0-255).
- Use `runCatching` to handle blocks that don't support fills.

**❌ Memory spikes**:

- Process templates sequentially, not in parallel.
- Call `engine.stop()` when completely done.
- Clean up temporary files after export.

**❌ Export size unexpected**:

- Confirm consistent page dimensions across templates.
- Verify `engine.block.getFrameWidth()` and `engine.block.getFrameHeight()` values.
- Check template design settings.

**Debugging Tips**:

- Print variable names using `engine.variable.findAll()`
- Log block names with `engine.block.getName(id)`
- Test with one minimal template before expanding
- Use Android Logcat to track processing flow

## Next Steps

Multi-image generation is one way to automate your workflow. Some other ways the CE.SDK can automate are in these guides:

- [Batch Processing](./batch-processing.md) lets you process many data records at once.
- Adapt layouts across aspect ratios using [auto resize](./auto-resize.md).
- Explore [export formats](../export-save-publish/export.md) and settings.
- Add branded fonts, logos, and graphics by creating custom asset sources, following the [Unsplash](../import-media/from-remote-source/unsplash.md) example.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support