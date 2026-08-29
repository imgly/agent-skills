> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Scenes](./scenes.md)

---

Scenes are the root container for all designs in CE.SDK. They hold pages,
blocks, and the camera that controls what you see in the canvas, and the
engine manages only one active scene at a time.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-modifying-scenes)

<EngineReferenceNote {...props} />

Every design you create starts with a scene. Scenes contain pages, and pages contain the visible design elements such as text, images, shapes, and other blocks. Understanding how scenes work is essential for building, saving, and restoring user designs.

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

This guide covers how to create scenes from scratch, manage pages within scenes, configure scene properties, save and load designs, and control the camera's zoom and position.

## Scene Hierarchy

Scenes form the root of CE.SDK's design structure. The hierarchy works as follows:

- **Scene** — The root container holding all design content
- **Pages** — Direct children of scenes, arranged according to the scene's layout
- **Blocks** — Design elements such as text, images, and shapes that belong to pages

Only blocks attached to pages within the active scene are rendered in the canvas. Use `engine.scene.get()` to retrieve the current scene and `engine.scene.getPages()` to access its pages.

## Creating Scenes

### Creating an Empty Scene

Use `engine.scene.create(sceneLayout = ...)` to create a new design scene with a configurable page layout. The `sceneLayout` parameter controls how pages are arranged in the canvas.

```kotlin highlight-android-create-scene
val scene = engine.scene.create(sceneLayout = SceneLayout.VERTICAL_STACK)
```

Available layouts:

| Layout | Description |
|--------|-------------|
| `SceneLayout.VERTICAL_STACK` | Pages arranged vertically |
| `SceneLayout.HORIZONTAL_STACK` | Pages arranged horizontally |
| `SceneLayout.DEPTH_STACK` | Pages layered on top of each other |
| `SceneLayout.FREE` | Manual positioning (default) |

### Creating for Video Editing

For video projects, use `engine.scene.createForVideo()` to configure the scene for timeline-based editing. Unlike `create(sceneLayout = ...)`, this method takes no parameters, so you set the page size separately after creating the scene.

### Creating from Media Files

Create scenes directly from images or videos with `engine.scene.createFromImage(imageUri = ...)` and `engine.scene.createFromVideo(videoUri = ...)`. The resulting scene uses the source media dimensions for its initial page.

### Adding Pages

After creating a scene, add pages using `engine.block.create(DesignBlockType.Page)`. Configure the page dimensions and append it to the scene.

```kotlin highlight-android-create-page
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(page, value = 800F)
engine.block.setHeight(page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

### Adding Blocks

With pages in place, add design elements like shapes, text, or images. Create a graphic block, configure its shape and fill, then append it to a page.

```kotlin highlight-android-create-block
val block = engine.block.create(DesignBlockType.Graphic)
val shape = engine.block.createShape(ShapeType.Rect)
engine.block.setShape(block, shape = shape)
val fill = engine.block.createFill(FillType.Color)
engine.block.setFill(block, fill = fill)
engine.block.setWidth(block, value = 200F)
engine.block.setHeight(block, value = 200F)
engine.block.appendChild(parent = page, child = block)
```

## Scene Properties

### Design Units

Query or configure how measurements are interpreted using `engine.scene.getDesignUnit()` and `engine.scene.setDesignUnit()`. This is useful for print workflows where precise physical dimensions matter.

```kotlin highlight-android-design-unit
    val designUnit = engine.scene.getDesignUnit()
    println("Design unit: $designUnit")

    engine.scene.setDesignUnit(DesignUnit.MILLIMETER)
```

Supported units are `DesignUnit.PIXEL`, `DesignUnit.MILLIMETER`, and `DesignUnit.INCH`.

### Scene Layout

Control how pages are arranged using `engine.scene.getLayout()` and `engine.scene.setLayout()`. The layout affects how users navigate between pages in multi-page designs.

```kotlin highlight-android-scene-layout
    engine.scene.setLayout(SceneLayout.HORIZONTAL_STACK)

    val layout = engine.scene.getLayout()
    println("Layout: $layout")
```

## Page Navigation

Access pages within your scene using these methods:

```kotlin highlight-android-page-navigation
    val pages = engine.scene.getPages()
    println("Number of pages: ${pages.size}")

    val currentPage = engine.scene.getCurrentPage()
    println("Current page: $currentPage")
```

`getCurrentPage()` returns the page nearest to the viewport center, which is useful for determining which page the user is currently viewing. For more advanced block queries, use `engine.scene.findNearestToViewPortCenterByType(...)` and `engine.scene.findNearestToViewPortCenterByKind(...)`.

## Camera and Zoom

### Zoom to Block

Use `engine.scene.zoomToBlock()` to frame a specific block in the viewport with padding. Passing the page focuses the current page; passing the scene lets you frame the complete scene.

```kotlin highlight-android-zoom-to-block
engine.scene.zoomToBlock(
    block = page,
    paddingLeft = 20F,
    paddingTop = 20F,
    paddingRight = 20F,
    paddingBottom = 20F,
)
```

### Zoom Level

Get and set the zoom level directly with `engine.scene.getZoomLevel()` and `engine.scene.setZoomLevel()`. The zoom level is a camera scale value; how that maps to physical output depends on the scene's design unit and DPI.

```kotlin highlight-android-zoom-level
    val zoomLevel = engine.scene.getZoomLevel()
    println("Zoom level: $zoomLevel")

    engine.scene.setZoomLevel(1F)
```

### Auto-Fit Zoom

For continuous auto-framing, use `engine.scene.enableZoomAutoFit(block = page, axis = ZoomAutoFitAxis.BOTH, ...)` to keep a block centered as the viewport changes. Disable it with `engine.scene.disableZoomAutoFit(page)` and query the current state with `engine.scene.isZoomAutoFitEnabled(page)`.

```kotlin highlight-android-zoom-auto-fit
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
```

## Saving Scenes

### Saving to String

Use `engine.scene.saveToString(scene = scene)` to serialize the current scene. This captures the complete scene structure, including pages, blocks, and their properties, as a string you can store.

```kotlin highlight-android-save-scene
val savedScene = engine.scene.saveToString(scene = scene)
println("Scene saved, length: ${savedScene.length}")
```

The serialized string references external assets by URL instead of embedding them. For a self-contained bundle that includes referenced assets, use `engine.scene.saveToArchive(scene = scene)`.

## Loading Scenes

### Loading from String

Use `engine.scene.load(scene = savedScene)` to restore a scene from a saved string:

```kotlin highlight-android-load-scene
val loadedScene = engine.scene.load(scene = savedScene)
println("Scene loaded: $loadedScene")
```

Loading a new scene replaces any existing scene. The engine only keeps one active scene at a time.

### Loading from URL

Use `engine.scene.load(sceneUri = Uri.parse(...))` to load a scene from a local or remote location. The same call also loads archives that bundle referenced assets — the engine detects the content automatically. Both scenes and archives use the `.imgly` extension; `.scene` and `.zip` files also load.

### Applying Templates

Apply template content to the current scene using `engine.scene.applyTemplate(template = ...)` or `engine.scene.applyTemplate(templateUri = ...)`. Template content is scaled automatically to the current page dimensions while keeping the current scene's design unit and page size.

## Event Subscriptions

Subscribe to scene-related events with Kotlin `Flow` to react to changes in real time. The example below keeps both collectors active long enough to observe a zoom change and a scene reload before cleaning them up.

```kotlin highlight-android-event-subscriptions
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
```

| Event | Description |
|-------|-------------|
| `onZoomLevelChanged()` | Fires when the zoom level changes |
| `onActiveChanged()` | Fires when the active scene changes |

## Next Steps

- [Blocks](./blocks.md) — Create and manipulate design elements within pages



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support