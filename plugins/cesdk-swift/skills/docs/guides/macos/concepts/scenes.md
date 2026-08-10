> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Scenes](./scenes.md)

---

```swift file=@cesdk_swift_examples/engine-guides-modifying-scenes/ModifyingScenes.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func modifyingScenes(engine: Engine) async throws {
  let scene = try engine.scene.create(sceneLayout: .verticalStack)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  let shape = try engine.block.createShape(.rect)
  try engine.block.setShape(block, shape: shape)
  let fill = try engine.block.createFill(.color)
  try engine.block.setFill(block, fill: fill)
  try engine.block.setWidth(block, value: 200)
  try engine.block.setHeight(block, value: 200)
  try engine.block.appendChild(to: page, child: block)

  let designUnit = try engine.scene.getDesignUnit()
  print("Design unit: \(designUnit)")

  try engine.scene.setDesignUnit(.mm)

  let layout = try engine.scene.getLayout()
  print("Layout: \(layout)")

  let pages = try engine.scene.getPages()
  print("Number of pages: \(pages.count)")

  let currentPage = try engine.scene.getCurrentPage()
  print("Current page: \(String(describing: currentPage))")

  try await engine.scene.zoom(to: page, paddingLeft: 20, paddingTop: 20, paddingRight: 20, paddingBottom: 20)

  let zoomLevel = try engine.scene.getZoom()
  print("Zoom level: \(zoomLevel)")

  try engine.scene.setZoom(1.0)

  let savedScene = try await engine.scene.saveToString()
  print("Scene saved, length: \(savedScene.count)")

  let loadedScene = try await engine.scene.load(from: savedScene)
  print("Scene loaded: \(loadedScene)")

  let zoomTask = Task {
    for await _ in engine.scene.onZoomLevelChanged {
      let zoom = try engine.scene.getZoom()
      print("Zoom changed: \(zoom)")
    }
  }

  let activeTask = Task {
    for await _ in engine.scene.onActiveChanged {
      print("Active scene changed")
    }
  }

  zoomTask.cancel()
  activeTask.cancel()
}
```

Scenes are the root container for all designs in CE.SDK. They hold pages,
blocks, and the camera that controls what you see in the canvas—and the engine
manages only one active scene at a time.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-modifying-scenes)

Every design you create starts with a scene. Scenes contain pages, and pages contain the visible design elements—text, images, shapes, and other blocks. Understanding how scenes work is essential for building, saving, and restoring user designs.

This guide covers how to create scenes from scratch, manage pages within scenes, configure scene properties, save and load designs, and control the camera's zoom and position.

## Scene Hierarchy

Scenes form the root of CE.SDK's design structure. The hierarchy works as follows:

- **Scene** — The root container holding all design content
- **Pages** — Direct children of scenes, arranged according to the scene's layout
- **Blocks** — Design elements (text, images, shapes) that belong to pages

Only blocks attached to pages within the active scene are rendered in the canvas. Use `engine.scene.get()` to retrieve the current scene and `engine.scene.getPages()` to access its pages.

## Creating Scenes

### Creating an Empty Scene

Use `engine.scene.create(sceneLayout:)` to create a new design scene with a configurable page layout. The `sceneLayout` parameter controls how pages are arranged in the canvas.

```swift highlight-create-scene
let scene = try engine.scene.create(sceneLayout: .verticalStack)
```

Available layouts:

| Layout | Description |
|--------|-------------|
| `.verticalStack` | Pages arranged vertically |
| `.horizontalStack` | Pages arranged horizontally |
| `.depthStack` | Pages layered on top of each other |
| `.free` | Manual positioning (default) |

### Creating for Video Editing

For video projects, use `engine.scene.createVideo()` which configures the scene for timeline-based editing. Unlike `create(sceneLayout:)`, this method takes no parameters — page dimensions are set separately after creation.

### Creating from Media Files

Create scenes directly from images or videos using `engine.scene.create(fromImage:)` and `engine.scene.create(fromVideo:)`. The scene dimensions match the source media.

### Adding Pages

After creating a scene, add pages using `engine.block.create(.page)`. Configure the page dimensions and append it to the scene.

```swift highlight-create-page
let page = try engine.block.create(.page)
try engine.block.setWidth(page, value: 800)
try engine.block.setHeight(page, value: 600)
try engine.block.appendChild(to: scene, child: page)
```

### Adding Blocks

With pages in place, add design elements like shapes, text, or images. Create a graphic block, configure its shape and fill, then append it to a page.

```swift highlight-create-block
let block = try engine.block.create(.graphic)
let shape = try engine.block.createShape(.rect)
try engine.block.setShape(block, shape: shape)
let fill = try engine.block.createFill(.color)
try engine.block.setFill(block, fill: fill)
try engine.block.setWidth(block, value: 200)
try engine.block.setHeight(block, value: 200)
try engine.block.appendChild(to: page, child: block)
```

## Scene Properties

### Design Units

Query or configure how measurements are interpreted using `engine.scene.getDesignUnit()` and `engine.scene.setDesignUnit()`. This is useful for print workflows where precise physical dimensions matter.

```swift highlight-scene-properties
  let designUnit = try engine.scene.getDesignUnit()
  print("Design unit: \(designUnit)")

  try engine.scene.setDesignUnit(.mm)

  let layout = try engine.scene.getLayout()
  print("Layout: \(layout)")
```

Supported units are `.px`, `.mm`, and `.in`.

### Scene Layout

Control how pages are arranged using `engine.scene.getLayout()` and `engine.scene.setLayout()`. The layout affects how users navigate between pages in multi-page designs.

## Page Navigation

Access pages within your scene using these methods:

```swift highlight-page-navigation
  let pages = try engine.scene.getPages()
  print("Number of pages: \(pages.count)")

  let currentPage = try engine.scene.getCurrentPage()
  print("Current page: \(String(describing: currentPage))")
```

`getCurrentPage()` returns the page nearest to the viewport center—useful for determining which page the user is currently viewing. For more advanced block queries, use `engine.scene.findNearestToViewPortCenter(byType:)` and `engine.scene.findNearestToViewPortCenter(byKind:)`.

## Camera and Zoom

### Zoom to Block

Use `engine.scene.zoom(to:)` to frame a specific block in the viewport with padding. Pass the scene block to show all pages.

```swift highlight-camera-zoom
  try await engine.scene.zoom(to: page, paddingLeft: 20, paddingTop: 20, paddingRight: 20, paddingBottom: 20)

  let zoomLevel = try engine.scene.getZoom()
  print("Zoom level: \(zoomLevel)")

  try engine.scene.setZoom(1.0)
```

### Zoom Level

Get and set the zoom level directly with `engine.scene.getZoom()` and `engine.scene.setZoom()`. A zoom level of `1.0` means one design unit equals one screen pixel.

### Auto-Fit Zoom

For continuous auto-framing, use `engine.scene.enableZoomAutoFit()` to automatically keep a block centered as the viewport resizes. Disable it with `engine.scene.disableZoomAutoFit()` and check the current state with `engine.scene.isZoomAutoFitEnabled()`.

## Saving Scenes

### Saving to String

Use `engine.scene.saveToString()` to serialize the current scene. This captures the complete scene structure—pages, blocks, and their properties—as a string you can store.

```swift highlight-save-scene
let savedScene = try await engine.scene.saveToString()
print("Scene saved, length: \(savedScene.count)")
```

The serialized string references external assets by URL rather than embedding them. For complete portability including assets, use `engine.scene.saveToArchive()`.

## Loading Scenes

### Loading from String

Use `engine.scene.load(from:)` to restore a scene from a saved string:

```swift highlight-load-scene
let loadedScene = try await engine.scene.load(from: savedScene)
print("Scene loaded: \(loadedScene)")
```

Loading a new scene replaces any existing scene. The engine only holds one active scene at a time.

### Loading from URL

Use `engine.scene.load(from:)` with a `URL` to load a scene directly from a local/remote location. The same call also loads archives that bundle all referenced assets — the engine detects the file kind automatically. Both scenes and archives use the `.imgly` extension; `.scene` and `.zip` files also load.

### Applying Templates

Apply template content to the current scene using `engine.scene.applyTemplate(from:)`, which accepts either a `URL` or a `String`. Template content is automatically scaled to fit the current page dimensions.

## Event Subscriptions

Subscribe to scene-related events using Swift's `AsyncStream` to react to changes in real time.

```swift highlight-event-subscriptions
  let zoomTask = Task {
    for await _ in engine.scene.onZoomLevelChanged {
      let zoom = try engine.scene.getZoom()
      print("Zoom changed: \(zoom)")
    }
  }

  let activeTask = Task {
    for await _ in engine.scene.onActiveChanged {
      print("Active scene changed")
    }
  }

  zoomTask.cancel()
  activeTask.cancel()
```

| Event | Description |
|-------|-------------|
| `onZoomLevelChanged` | Fires when the zoom level changes |
| `onActiveChanged` | Fires when the active scene changes |

## Next Steps

- [Blocks](./blocks.md) — Create and manipulate design elements within pages



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support