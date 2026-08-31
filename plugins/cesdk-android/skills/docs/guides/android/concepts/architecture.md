> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Architecture](./architecture.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-concepts-architecture/Architecture.kt reference-only
import kotlinx.coroutines.Job
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

@Suppress("UNUSED_VARIABLE")
suspend fun architecture(engine: Engine) = withContext(engine.dispatcher) {
    var subscription: Job? = null
    val variableKey = "username"
    val hadPreviousVariable = variableKey in engine.variable.findAll()
    val previousVariable = if (hadPreviousVariable) engine.variable.get(variableKey) else null

    try {
        // The engine exposes six API namespaces:
        engine.scene // Scene API — content hierarchy
        engine.block // Block API — create and modify blocks
        engine.asset // Asset API — manage asset sources
        engine.editor // Editor API — edit modes, undo/redo, roles
        engine.event // Event API — subscribe to changes
        engine.variable // Variable API — template variables

        // Create a scene with a page and a graphic block.
        val scene = engine.scene.create()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)

        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setFill(block, fill = engine.block.createFill(FillType.Color))
        engine.block.appendChild(parent = page, child = block)

        // Traverse the hierarchy.
        val pages = engine.scene.getPages()
        val children = engine.block.getChildren(block = pages.first())

        // Scenes use the same hierarchy for static and time-based experiences.
        val contentScene = engine.scene.create()
        val contentPage = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = contentScene, child = contentPage)

        // Subscribe to block changes using Flow.
        subscription =
            engine.event.subscribe(blocks = listOf(scene))
                .onEach { events ->
                    events.forEach { event ->
                        println("Block ${event.block} had event: ${event.type}")
                    }
                }
                // `this` is the surrounding coroutine scope.
                .launchIn(this)

        // Set and retrieve template variables.
        engine.variable.set(key = "username", value = "Jane")
        val username = engine.variable.get(key = "username")
    } finally {
        subscription?.cancel()
        if (hadPreviousVariable) {
            engine.variable.set(key = variableKey, value = checkNotNull(previousVariable))
        } else if (variableKey in engine.variable.findAll()) {
            engine.variable.remove(variableKey)
        }
    }
}
```

Understand how CE.SDK is structured around the CreativeEngine and its six interconnected APIs.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-concepts-architecture)

<EngineReferenceNote {...props} />

CE.SDK is built around the **CreativeEngine** runtime, exposed on Android through the `Engine` class. It manages state, rendering, and coordination between six specialized APIs. Understanding how these pieces connect makes it much easier to navigate the SDK and decide where a change belongs.

## The CreativeEngine

The `Engine` is the central coordinator. Creating content, manipulating blocks, rendering, and exporting all flow through it. Start it once, keep engine work on the main thread, and access the rest of CE.SDK through its API namespaces.

The `Engine` manages:

- **One active scene** containing all design content
- **Six API namespaces** for different domains of functionality
- **Event dispatching** for reactive state management
- **Resource loading** and caching
- **Rendering** to a `SurfaceView`, `TextureView`, or offscreen context

On Android, lifecycle methods such as `start`, `bindSurfaceView`, `bindTextureView`, and `bindOffscreen` are annotated `@MainThread`. Engine-only integrations therefore typically run inside `CoroutineScope(Dispatchers.Main).launch { ... }`.

## Core APIs

The engine exposes six API namespaces, each handling a specific domain of functionality:

```kotlin highlight-android-architecture-apis
// The engine exposes six API namespaces:
engine.scene // Scene API — content hierarchy
engine.block // Block API — create and modify blocks
engine.asset // Asset API — manage asset sources
engine.editor // Editor API — edit modes, undo/redo, roles
engine.event // Event API — subscribe to changes
engine.variable // Variable API — template variables
```

| API | Namespace | Purpose |
| --- | --- | --- |
| Scene API | `engine.scene` | Content hierarchy: create, load, and save scenes |
| Block API | `engine.block` | Create, modify, and query design blocks |
| Asset API | `engine.asset` | Register and query asset sources |
| Editor API | `engine.editor` | Edit modes, undo/redo, and user roles |
| Event API | `engine.event` | Subscribe to engine state changes |
| Variable API | `engine.variable` | Template variables for data-driven designs |

## Content Hierarchy

CE.SDK organizes content in a tree: **Scene** → **Pages** → **Blocks**.

- **Scene**: The root container. One scene per engine instance. Supports both static designs and time-based video editing.
- **Pages**: Containers within a scene. Artboards in design scenes and timeline compositions in video scenes.
- **Blocks**: The atomic units: graphics, text, audio, video, and more. Everything visible is a block.

Create a scene, add a page, and populate it with blocks:

```kotlin highlight-android-architecture-hierarchy
        // Create a scene with a page and a graphic block.
        val scene = engine.scene.create()
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.appendChild(parent = scene, child = page)

        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setFill(block, fill = engine.block.createFill(FillType.Color))
        engine.block.appendChild(parent = page, child = block)

        // Traverse the hierarchy.
        val pages = engine.scene.getPages()
        val children = engine.block.getChildren(block = pages.first())
```

The **Scene API** manages this hierarchy. The **Block API** manipulates individual blocks within it. See [Scenes](./scenes.md) and [Blocks](./blocks.md) for details.

## Scene Contexts

CE.SDK uses the same scene hierarchy for static designs and time-based content. Starter kits and editor configurations decide which editing tools are available for a given experience; the scene itself still contains pages and blocks.

```kotlin highlight-android-architecture-scene-modes
// Scenes use the same hierarchy for static and time-based experiences.
val contentScene = engine.scene.create()
val contentPage = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = contentScene, child = contentPage)
```

- **Design experiences**: Static outputs such as social posts, print materials, and graphics. Blocks are positioned spatially on pages.
- **Video experiences**: Time-based outputs with playback, timeline, and audio support. Blocks can use temporal properties such as duration and trim.

Create the scene with `engine.scene.create()`, then configure the editor experience or automation pipeline around the content you want to produce. See [Scenes](./scenes.md) for details.

## Event System

Subscribe to engine events to build reactive UIs that update when state changes. On Android, the Event API exposes a Kotlin `Flow` of `DesignBlockEvent` batches:

```kotlin highlight-android-architecture-events
// Subscribe to block changes using Flow.
subscription =
    engine.event.subscribe(blocks = listOf(scene))
        .onEach { events ->
            events.forEach { event ->
                println("Block ${event.block} had event: ${event.type}")
            }
        }
        // `this` is the surrounding coroutine scope.
        .launchIn(this)
```

Store the `Job` returned by `launchIn` and cancel it when you no longer need updates.

See [Events](./events.md) for details on subscribing to engine state changes.

## Template Variables

The Variable API enables data-driven designs. Define variables at the scene level and reference them in text blocks with `{{variableName}}` syntax:

```kotlin highlight-android-architecture-variables
// Set and retrieve template variables.
engine.variable.set(key = "username", value = "Jane")
val username = engine.variable.get(key = "username")
```

When variable values change, affected blocks update automatically.

## How They Connect

A typical flow shows the interconnection:

1. **Scene API** creates the content structure.
2. **Asset API** provides images, templates, or other content.
3. **Block API** creates blocks and applies assets to them.
4. **Variable API** injects dynamic data into text blocks.
5. **Editor API** controls what users can modify.
6. **Event API** notifies your UI of every change.

Each API focuses on one domain, but they operate through the same Engine instance. The runtime coordinates these interactions for you.

## Integration Patterns

CE.SDK runs in two main Android contexts:

- **Interactive UI**: Use the `Editor` composable directly or start from one of the Android starter kits. This gives you a ready-made editing surface while still exposing the same Engine APIs underneath. The legacy solution composables such as `DesignEditor` are deprecated in favor of this architecture.
- **Headless**: Create the engine yourself with `Engine.getInstance(...)`, call `start(...)`, and render through `bindOffscreen(...)`. Use this for exports, automation, and batch processing. See [Headless Mode](./headless-mode.md).

Both patterns use the same six APIs. The difference is how you host the engine and whether you attach a UI render target.

## Next Steps

- [Scenes](./scenes.md) — Scene creation and management
- [Blocks](./blocks.md) — Working with design blocks
- [Pages](./pages.md) — Page management and configuration
- [Headless Mode](./headless-mode.md) — Running without UI
- [Templating](./templating.md) — Creating data-driven designs



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support