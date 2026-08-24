> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Images](./images.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-modifying-scenes/ModifyingScenes.kt reference-only
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.SceneLayout
import ly.img.engine.ShapeType
import ly.img.engine.ZoomAutoFitAxis

suspend fun modifyingScenes(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val block = engine.block.create(DesignBlockType.Graphic)
    val shape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block, shape = shape)
    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block, fill = fill)
    engine.block.setWidth(block, value = 200F)
    engine.block.setHeight(block, value = 200F)
    engine.block.appendChild(parent = page, child = block)

    val designUnit = engine.scene.getDesignUnit()
    println("Design unit: $designUnit")

    engine.scene.setDesignUnit(DesignUnit.MILLIMETER)

    engine.scene.setLayout(SceneLayout.HORIZONTAL_STACK)

    val layout = engine.scene.getLayout()
    println("Layout: $layout")

    val pages = engine.scene.getPages()
    println("Number of pages: ${pages.size}")

    val currentPage = engine.scene.getCurrentPage()
    println("Current page: $currentPage")

    engine.scene.zoomToBlock(
        block = page,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )

    val zoomLevel = engine.scene.getZoomLevel()
    println("Zoom level: $zoomLevel")

    engine.scene.setZoomLevel(1F)

    engine.scene.enableZoomAutoFit(
        block = page,
        axis = ZoomAutoFitAxis.BOTH,
        paddingLeft = 20F,
        paddingTop = 20F,
        paddingRight = 20F,
        paddingBottom = 20F,
    )
    println("Auto-fit enabled: ${engine.scene.isZoomAutoFitEnabled(page)}")
    engine.scene.disableZoomAutoFit(page)

    val savedScene = engine.scene.saveToString(scene = scene)
    println("Scene saved, length: ${savedScene.length}")

    val loadedScene = engine.scene.load(scene = savedScene)
    println("Scene loaded: $loadedScene")

    val zoomEvents = engine.scene.onZoomLevelChanged()
        .onEach {
            println("Zoom changed: ${engine.scene.getZoomLevel()}")
        }
        .launchIn(this)

    val activeSceneEvents = engine.scene.onActiveChanged()
        .onEach {
            println("Active scene changed")
        }
        .launchIn(this)

    try {
        engine.scene.setZoomLevel(2F)
        engine.scene.load(scene = savedScene)
    } finally {
        zoomEvents.cancel()
        activeSceneEvents.cancel()
    }
}
```

You can insert images into a scene using CE.SDK, either through the prebuilt UI for Android or programmatically via Kotlin. This gives you the flexibility to build interactive design workflows, enable user-generated content, or automate image placement based on logic or data.

> **Note:** CE.SDK supports a wide range of image formats, including:* `.png`
> * `.jpeg`, `.jpg`
> * `.gif`
> * `.webp`
> * `.svg`
> * `.bmp`See a [full list](../file-format-support.md) of supported file types.

## What You'll Learn

- Two ways to insert images:
  - Programmatically by creating a graphic block, applying an image fill, and setting its position/size/rotation/z-index.
  - With Editor UI using the controls and asset libraries of a prebuilt editor such as the Design Editor or Photo Editor.
- Supported image sources such as app assets, file URIs, and remote URLs.
- Practical transforms after insertion such as move, scale, rotate and order.

## When to Use It

- You're building custom UI or automation flow to add images to compositions.
- You want a ready-made editing experience on Android with an image picker and panels.

## Inserting Images Using the UI

CE.SDK's UI includes a built-in **image tool** that lets users add images from device sources directly onto the canvas. Once inserted, users can move, resize, crop, rotate, or stack images visually.

**Supported image sources:**

- Gallery (Photos app)
- Storage (Files app)
- Camera (device camera)
- Image (project asset library)

In the Asset Library, a user can add images from the Gallery, the camera or the Files app.

You can customize how the image tool appears in the user interface.

## Inserting Images Programmatically

For apps with automation, batch workflows, or logic-driven design experiences, you can insert images into a scene using the block API and the graphics engine.

Here's how to do it:

```kotlin
// 1. Create a graphic block
val imageBlock = engine.block.create(DesignBlockType.Graphic)

// 2. Create a shape for the image
val shape = engine.block.createShape(ShapeType.Rect)
engine.block.setShape(imageBlock, shape = shape)

// 3. Create an image fill
val imageFill = engine.block.createFill(FillType.Image)
engine.block.setString(
    block = imageFill,
    property = "fill/image/imageFileURI",
    value = "https://img.ly/static/ubq_samples/sample_4.jpg"
)
engine.block.setFill(imageBlock, fill = imageFill)

// 4. (Optional) Set semantic kind to "image" for clarity
engine.block.setKind(imageBlock, kind = "image")

// 5. Add image to the scene
val page = engine.block.findByType(DesignBlockType.Page).first()
engine.block.appendChild(page, child = imageBlock)
```

The `shape` can be any of the supported shapes like `ShapeType.Rect`, `ShapeType.Star`, etc and masks the inserted image. The asset URI in step 3 can either be a remote URL or a local asset URI.

For assets from app resources, use a URI:

```kotlin
import android.net.Uri

val uri = Uri.parse("file:///android_asset/images/poster.jpg")
```

For file assets, use standard Android file handling:

```kotlin
import android.net.Uri
import java.io.File

val file = File(context.filesDir, "uploads/avatar.png")
val uri = Uri.fromFile(file)
```

When working with the asset catalog, you can apply an image that's an `AssetResult` either to:

- The scene directly
- A block

```kotlin
val assetList = engine.asset.findAssets(sourceId, queryData)
val newAsset = assetList.assets.first()

// Creates a new block that contains the image
val imageBlock = engine.asset.defaultApplyAsset(newAsset)

// Applies the image to a block that already exists
engine.asset.defaultApplyAssetToBlock(newAsset, someBlock)
```

## Image Properties

After inserting the image, you can change the block's layout properties using standard methods in the `engine.block` API.

### Positioning

Refer to the guide in the Transform Section for [Move](../edit-image/transform/move.md) for more details and other options.

```kotlin
// Set X/Y position on the canvas (in absolute units)
engine.block.setPositionX(imageBlock, value = 100f)
engine.block.setPositionY(imageBlock, value = 200f)
```

### Scaling

Refer to the guide in the Transform Section for [Scale](../edit-image/transform/scale.md) for more details and other options.

```kotlin
// Uniform scale
engine.block.setFloat(imageBlock, property = "transform/scale/x", value = 1.5f)
engine.block.setFloat(imageBlock, property = "transform/scale/y", value = 1.5f)

// Non-uniform (stretching)
engine.block.setFloat(imageBlock, property = "transform/scale/x", value = 2.0f)
engine.block.setFloat(imageBlock, property = "transform/scale/y", value = 1.0f)
```

### Rotation

Refer to the guide in the Transform Section for [Rotate](../edit-image/transform/rotate.md) for more details and other options.

```kotlin
// Rotate 45 degrees (in radians)
import kotlin.math.PI

val degrees = 45.0
val radians = (degrees * PI / 180).toFloat()
engine.block.setFloat(imageBlock, property = "transform/rotation", value = radians)
```

### Layering

Control stack order using the helper methods to move blocks forward (towards the user) or backwards. You can also pin a block to the front or back of the stack.

```kotlin
engine.block.bringToFront(imageBlock) // Move above siblings
engine.block.sendToBack(imageBlock) // Move below siblings
engine.block.bringForward(imageBlock) // One step forward
engine.block.sendBackward(imageBlock) // One step backward

engine.block.setAlwaysOnTop(imageBlock, enabled = true)
```

> **Note:** You can also group images and other elements using `engine.block.group()` for easier layer management.

## Insert Into an Existing Block

If your template exposes a placeholder block or you are creating an automated workflow, you can **replace an image fill** instead of creating a new block. Locate the block using its `name` property or by its known `id`.

When you know the `id` of the target:

```kotlin
val fill = engine.block.createFill(FillType.Image)
engine.block.setString(fill, property = "fill/image/imageFileURI", value = imageURI)
engine.block.setFill(targetBlock, fill = fill)
```

When you're using the `name` property to find the block, you need to search manually:

```kotlin
val allBlocks = engine.block.findByType(DesignBlockType.Graphic)
val targetBlock = allBlocks.find { block ->
    engine.block.getString(block, property = "name") == "HeroTile"
} ?: return

val fill = engine.block.createFill(FillType.Image)
engine.block.setString(fill, property = "fill/image/imageFileURI", value = imageURI)
engine.block.setFill(targetBlock, fill = fill)
```

> **Note:** When generating templates, assign names so downstream replacement stays straightforward:```kotlin
> engine.block.setString(imageBlock, property = "name", value = "HeroImage")
> ```

## Troubleshooting

**❌ Nothing appears after insert**:

- Verify that the block is attached to the page.
- Verify the URI string is correct.
- Check the scene's current zoom and camera framing.

**❌ Remote images fail**:

- Confirm HTTPS and CORS settings.
- Verify network permissions in AndroidManifest.xml.
- Test the URL in a browser.

**❌ Pixelated result**:

- Change the block size or use a higher-resolution source image.

**❌ Unexpected orientation of image**:

- Some formats carry EXIF orientation information. Apply `setRotation` or normalize the asset during import.

## Next Steps

Now that you've learned about inserting images into your compositions, here are some topics to explore to deepen your understanding.

- Apply more [transformations](../edit-image/transform.md) such as crop, or scale.
- Create [templates](../create-templates.md) for automating content creation and formatting.
- [Export](../export-save-publish/export.md) compositions in a variety of formats.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support