> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Events](./events.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-events/Events.kt reference-only
package ly.img.editor.examples.engine.guides.events

import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.launchIn
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockEvent
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

suspend fun events(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    val allBlocksSubscription = engine.event.subscribe(blocks = emptyList())
        .onEach { events ->
            events.forEach { event ->
                println("[All Blocks] ${event.type} event for block ${event.block}")
            }
        }.launchIn(this)

    val graphic = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = graphic, shape = rectShape)
    engine.block.setPositionX(graphic, value = 200F)
    engine.block.setPositionY(graphic, value = 150F)
    engine.block.setWidth(graphic, value = 400F)
    engine.block.setHeight(graphic, value = 300F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block = graphic, fill = imageFill)
    engine.block.setEnum(
        block = graphic,
        property = "contentFill/mode",
        value = "Cover",
    )
    engine.block.appendChild(parent = page, child = graphic)

    engine.block.forceLoadResources(listOf(graphic))

    val specificBlocksSubscription = engine.event.subscribe(blocks = listOf(graphic))
        .onEach { events ->
            events.forEach { event ->
                println("[Specific Block] ${event.type} event for block ${event.block}")
            }
        }.launchIn(this)

    val processedEventsSubscription = engine.event.subscribe(blocks = emptyList())
        .onEach { events ->
            events.forEach { event ->
                when (event.type) {
                    DesignBlockEvent.Type.CREATED -> {
                        val blockType = engine.block.getType(event.block)
                        println("Block created with type: $blockType")
                    }

                    DesignBlockEvent.Type.UPDATED -> {
                        println("Block ${event.block} was updated")
                    }

                    DesignBlockEvent.Type.DESTROYED -> {
                        println("Block ${event.block} was destroyed")
                    }
                }
            }
        }.launchIn(this)

    try {
        val cachedBlocks = mutableSetOf(graphic)
        cachedBlocks.removeAll { block -> !engine.block.isValid(block) }

        engine.block.setRotation(graphic, radians = 0.1F)
        engine.block.setFloat(
            block = graphic,
            property = "opacity",
            value = 0.9F,
        )

        engine.block.destroy(graphic)
        println("Destroyed graphic block $graphic")

        // Let the guide test collect the final batched events before cleanup.
        delay(1_000)
    } finally {
        withContext(NonCancellable) {
            allBlocksSubscription.cancelAndJoin()
            specificBlocksSubscription.cancelAndJoin()
            processedEventsSubscription.cancelAndJoin()
        }
    }
}
```

Monitor and react to block changes in real time by subscribing to creation,
update, and destruction events in your CE.SDK scene.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260824/engine-guides-events)

<EngineReferenceNote {...props} />

Events let you monitor block changes as they happen. On Android,
`engine.event.subscribe()` returns a `Flow<List<DesignBlockEvent>>`, so you
collect batched updates inside a coroutine on `Dispatchers.Main` and cancel the
collection job when you no longer need it.

This guide covers subscribing to block lifecycle events, processing the three
event types (`CREATED`, `UPDATED`, `DESTROYED`), filtering events to specific
blocks, understanding batching and deduplication behavior, and properly
cleaning up subscriptions.

## Setup

Create a scene and page before subscribing. Call the sample from your Engine's
main-thread coroutine; each event collector stays scoped to that coroutine and
is cancelled during cleanup.

```kotlin highlight-android-setup
val scene = engine.scene.create()
val page = engine.block.create(DesignBlockType.Page)
engine.block.setWidth(page, value = 800F)
engine.block.setHeight(page, value = 600F)
engine.block.appendChild(parent = scene, child = page)
```

## Event Types

CE.SDK provides three event types that capture the block lifecycle:

| Type | Description |
| --- | --- |
| `DesignBlockEvent.Type.CREATED` | Fires when a new block is created. |
| `DesignBlockEvent.Type.UPDATED` | Fires when any property of a block changes. |
| `DesignBlockEvent.Type.DESTROYED` | Fires when a block is destroyed. |

Each `DesignBlockEvent` contains a `block` property with the block ID and a
`type` property indicating which event occurred.

## Subscribing to All Blocks

Use `engine.event.subscribe()` to register a collector that receives batched
events. Pass `emptyList()` to receive events from every block:

```kotlin highlight-android-subscribe-all
val allBlocksSubscription = engine.event.subscribe(blocks = emptyList())
    .onEach { events ->
        events.forEach { event ->
            println("[All Blocks] ${event.type} event for block ${event.block}")
        }
    }.launchIn(this)
```

The `launchIn(this)` call returns a `Job`. Keep that job so you can cancel the
subscription during cleanup.

## Subscribing to Specific Blocks

When you only care about certain blocks, pass their IDs to filter the flow:

```kotlin highlight-android-subscribe-specific
val specificBlocksSubscription = engine.event.subscribe(blocks = listOf(graphic))
    .onEach { events ->
        events.forEach { event ->
            println("[Specific Block] ${event.type} event for block ${event.block}")
        }
    }.launchIn(this)
```

Filtering reduces overhead because the engine only prepares events for the
blocks you are tracking.

### API Reference

Signature: `fun subscribe(blocks: List<DesignBlock> = emptyList()): Flow<List<DesignBlockEvent>>`

Subscribe to block life-cycle events

- `blocks`: a list of blocks to filter events by. If the list is empty, events for every block are sent.

## Creating Blocks and Handling `CREATED` Events

Creating a block triggers a `CREATED` event. This example also appends the block
to the page, adds a 400×300 graphic at `(200, 150)` with a remote image fill,
and sets `Cover` content fill mode.

```kotlin highlight-android-event-created
    val graphic = engine.block.create(DesignBlockType.Graphic)
    val rectShape = engine.block.createShape(ShapeType.Rect)
    engine.block.setShape(block = graphic, shape = rectShape)
    engine.block.setPositionX(graphic, value = 200F)
    engine.block.setPositionY(graphic, value = 150F)
    engine.block.setWidth(graphic, value = 400F)
    engine.block.setHeight(graphic, value = 300F)

    val imageFill = engine.block.createFill(FillType.Image)
    engine.block.setString(
        block = imageFill,
        property = "fill/image/imageFileURI",
        value = "https://img.ly/static/ubq_samples/sample_1.jpg",
    )
    engine.block.setFill(block = graphic, fill = imageFill)
    engine.block.setEnum(
        block = graphic,
        property = "contentFill/mode",
        value = "Cover",
    )
    engine.block.appendChild(parent = page, child = graphic)
```

Use `CREATED` events to start tracking a block, update local state, or trigger
follow-up work such as analytics or sync jobs.

## Updating Blocks and Handling `UPDATED` Events

Changing any property of a block triggers an `UPDATED` event. Here, the example
rotates the block by `0.1f` radians and sets its opacity to `0.9f`.

```kotlin highlight-android-event-updated
engine.block.setRotation(graphic, radians = 0.1F)
engine.block.setFloat(
    block = graphic,
    property = "opacity",
    value = 0.9F,
)
```

The event itself does not tell you which property changed, only that the block
was updated.

## Processing Events by Type

Process each batch by switching on `event.type`. For `CREATED` and `UPDATED`
events, Block API calls are safe. For `DESTROYED` events, treat the block ID as
invalid and clean up local references without calling more Block API methods on
that ID.

```kotlin highlight-android-process-events
    val processedEventsSubscription = engine.event.subscribe(blocks = emptyList())
        .onEach { events ->
            events.forEach { event ->
                when (event.type) {
                    DesignBlockEvent.Type.CREATED -> {
                        val blockType = engine.block.getType(event.block)
                        println("Block created with type: $blockType")
                    }

                    DesignBlockEvent.Type.UPDATED -> {
                        println("Block ${event.block} was updated")
                    }

                    DesignBlockEvent.Type.DESTROYED -> {
                        println("Block ${event.block} was destroyed")
                    }
                }
            }
        }.launchIn(this)
```

## Handling `DESTROYED` Events Safely

Once a block is destroyed, its ID becomes invalid. If your app keeps cached block
IDs, use `engine.block.isValid()` to prune stale references before passing them
to other Block API methods:

```kotlin highlight-android-destroyed-safety
val cachedBlocks = mutableSetOf(graphic)
cachedBlocks.removeAll { block -> !engine.block.isValid(block) }
```

Destroying the tracked graphic block in the example triggers a `DESTROYED` event:

```kotlin highlight-android-event-destroyed
engine.block.destroy(graphic)
println("Destroyed graphic block $graphic")
```

After a `DESTROYED` event, clean up matching cached references in your app state
instead of calling more Block API methods on that ID.

## Unsubscribing from Events

On Android, unsubscribing means cancelling the `Job`s that collect your event
flows:

```kotlin highlight-android-unsubscribe
allBlocksSubscription.cancelAndJoin()
specificBlocksSubscription.cancelAndJoin()
processedEventsSubscription.cancelAndJoin()
```

Cancel subscriptions when your screen leaves composition, the editor closes, or
you stop tracking a block. Leaving collectors active forces the engine to keep
preparing event lists on every update.

## Event Batching and Deduplication

Events are collected during an engine update and delivered together at the end.
The engine deduplicates `UPDATED` events, so you receive at most one
`UPDATED` event per block per update cycle.

This batching behavior means:

- Multiple rapid changes to a single block result in one `UPDATED` event.
- The array order does not reflect the chronological order of changes inside one update cycle.
- If you need to know which property changed, compare against cached values in your app.

## Use Cases

Events support several reactive patterns in Android apps:

- **Syncing external state**: Keep ViewModels, Redux stores, or persistence layers aligned with scene changes.
- **Building reactive UI**: Update Compose state when blocks change without polling the engine.
- **Tracking changes for undo/redo**: Monitor block changes for custom history or analytics pipelines.
- **Validating scene constraints**: React to new or updated blocks when you enforce design rules in code.

## Troubleshooting

**Events not firing**: Make sure you have not cancelled the collection job too early, and confirm the filtered block IDs are still valid.

**Exception on `DESTROYED` events**: Treat destroyed block IDs as invalid, and prune stale cached IDs with `engine.block.isValid()` before calling other Block API methods.

**Missing `UPDATED` events**: The engine deduplicates updates, so multiple rapid property changes become one `UPDATED` event per block.

**Leaking collectors**: Store the `Job` returned by `launchIn()` and cancel it during cleanup.

## Next Steps

[Blocks](./blocks.md) — Learn about block types, properties, and lifecycle.

[Undo and History](./undo-and-history.md) — Implement undo/redo functionality.

[Scenes](./scenes.md) — Understand scene structure and management.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support