> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Architecture](./architecture.md)

---

```swift file=@cesdk_swift_examples/engine-guides-concepts-architecture/Architecture.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func architecture(engine: Engine) async throws {
  // The engine exposes six API namespaces:
  _ = engine.scene // Scene API — content hierarchy
  _ = engine.block // Block API — create and modify blocks
  _ = engine.asset // Asset API — manage asset sources
  _ = engine.editor // Editor API — edit modes, undo/redo, roles
  _ = engine.event // Event API — subscribe to changes
  _ = engine.variable // Variable API — template variables

  // Create a scene with a page and a graphic block.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)

  // Traverse the hierarchy.
  let pages = try engine.scene.getPages()
  let children = try engine.block.getChildren(pages.first!)

  _ = children

  // Design mode — static designs like social posts and print materials.
  let designScene = try engine.scene.create()

  // Video mode — time-based content with playback and timeline.
  let videoScene = try engine.scene.createVideo()

  _ = designScene
  _ = videoScene

  // Subscribe to block changes using AsyncStream.
  let subscription = engine.event.subscribe(to: [scene])
  Task {
    for await events in subscription {
      for event in events {
        print("Block \(event.block) had event: \(event.type)")
      }
    }
  }

  // Set and retrieve template variables.
  try engine.variable.set(key: "username", value: "Jane")
  let username = try engine.variable.get(key: "username")

  _ = username
}
```

Understand how CE.SDK is structured around the CreativeEngine and its six interconnected APIs.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-concepts-architecture)

CE.SDK is built around the **CreativeEngine**—a single-threaded core runtime that manages state, rendering, and coordination between six specialized APIs. Understanding how these pieces connect helps you navigate the SDK effectively.

## The CreativeEngine

The `Engine` is the central coordinator. All operations—creating content, manipulating blocks, rendering, and exporting—flow through it. Initialize it once and access everything else through its API namespaces.

The `Engine` manages:

- **One active scene** containing all design content
- **Six API namespaces** for different domains of functionality
- **Event dispatching** for reactive state management
- **Resource loading** and caching
- **Rendering** to a Metal view or offscreen context

All engine operations run on the main thread. In Swift, this is enforced by marking the `Engine` class as `@MainActor`.

## Core APIs

The engine exposes six API namespaces, each handling a specific domain of functionality:

```swift highlight-architecture-apis
// The engine exposes six API namespaces:
_ = engine.scene // Scene API — content hierarchy
_ = engine.block // Block API — create and modify blocks
_ = engine.asset // Asset API — manage asset sources
_ = engine.editor // Editor API — edit modes, undo/redo, roles
_ = engine.event // Event API — subscribe to changes
_ = engine.variable // Variable API — template variables
```

| API | Namespace | Purpose |
|-----|-----------|---------|
| Scene API | `engine.scene` | Content hierarchy—create, load, save scenes |
| Block API | `engine.block` | Create, modify, and query design blocks |
| Asset API | `engine.asset` | Register and query asset sources |
| Editor API | `engine.editor` | Edit modes, undo/redo, user roles |
| Event API | `engine.event` | Subscribe to engine state changes |
| Variable API | `engine.variable` | Template variables for data-driven designs |

## Content Hierarchy

CE.SDK organizes content in a tree: **Scene** → **Pages** → **Blocks**.

- **Scene**: The root container. One scene per engine instance. Operates in either *Design Mode* (static) or *Video Mode* (timeline-based).
- **Pages**: Containers within a scene. Artboards in Design Mode, timeline compositions in Video Mode.
- **Blocks**: The atomic units—graphics, text, audio, video. Everything visible is a block.

Create a scene, add a page, and populate it with blocks:

```swift highlight-architecture-hierarchy
  // Create a scene with a page and a graphic block.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)

  // Traverse the hierarchy.
  let pages = try engine.scene.getPages()
  let children = try engine.block.getChildren(pages.first!)
```

The **Scene API** manages this hierarchy. The **Block API** manipulates individual blocks within it. See [Scenes](./scenes.md) and [Blocks](./blocks.md) for details.

## Scene Modes

CE.SDK supports two scene modes that determine available features and behavior:

```swift highlight-architecture-sceneModes
  // Design mode — static designs like social posts and print materials.
  let designScene = try engine.scene.create()

  // Video mode — time-based content with playback and timeline.
  let videoScene = try engine.scene.createVideo()
```

- **Design Mode**: Static designs—social posts, print materials, graphics. Blocks are positioned spatially on pages. Created with `engine.scene.create()`.
- **Video Mode**: Time-based content with playback, timeline, and audio support. Blocks have temporal properties like duration and trim. Created with `engine.scene.createVideo()`.

Choose the mode when creating a scene. It determines which Block API properties and Editor API capabilities are available. See [Scenes](./scenes.md) for details.

## Event System

Subscribe to engine events to build reactive UIs that update when state changes. The Event API provides Swift-native `AsyncStream` for consuming events:

```swift highlight-architecture-events
// Subscribe to block changes using AsyncStream.
let subscription = engine.event.subscribe(to: [scene])
Task {
  for await events in subscription {
    for event in events {
      print("Block \(event.block) had event: \(event.type)")
    }
  }
}
```

Store your `Task` and cancel it when you no longer need updates to prevent leaks.

See [Events](./events.md) for details on subscribing to engine state changes.

## Template Variables

The Variable API enables data-driven designs. Define variables at the scene level and reference them in text blocks with `{{variableName}}` syntax:

```swift highlight-architecture-variables
// Set and retrieve template variables.
try engine.variable.set(key: "username", value: "Jane")
let username = try engine.variable.get(key: "username")
```

When variable values change, affected blocks update automatically.

## How They Connect

A typical flow shows the interconnection:

1. **Scene API** creates the content structure
2. **Asset API** provides images, templates, or other content
3. **Block API** creates blocks and applies assets to them
4. **Variable API** injects dynamic data into text blocks
5. **Editor API** controls what users can modify
6. **Event API** notifies your UI of every change

Each API focuses on one domain but works through the others. The Engine coordinates these interactions.

## Integration Patterns

CE.SDK runs in two contexts on Apple platforms, determined by the render context you choose at initialization:

- **Interactive**: Pass a Metal view as the render context. The engine renders content on screen in real time. Use the built-in editor UI (`IMGLYEditor`) for a full editing experience on iOS, or build your own SwiftUI interface on top of the engine APIs for complete control.
- **Headless**: Initialize with an `.offscreen` render context—no view required. Use for server-side exports, automation, and batch operations where you need to process designs without displaying them.

Both patterns use the same six APIs—only rendering differs.

## Next Steps

- [Scenes](./scenes.md) — Scene creation and management
- [Blocks](./blocks.md) — Working with design blocks



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support