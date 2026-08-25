> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Undo and History](./undo-and-history.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-undo-and-history/UndoAndHistory.kt reference-only
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.NonCancellable
import kotlinx.coroutines.cancelAndJoin
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.engine.Color
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.HistoryUpdate
import ly.img.engine.ShapeType

suspend fun undoAndHistory(
    engine: Engine,
    page: DesignBlock? = null,
) = withContext(engine.dispatcher) {
    val targetPage = page ?: createDemoPage(engine)
    val activeHistory = engine.editor.getActiveHistory()
    val guideHistory = engine.editor.createHistory()
    var historyUpdates: Job? = null

    try {
        engine.editor.setActiveHistory(guideHistory)
        historyUpdates = subscribeToHistoryUpdates(scope = this, engine = engine)

        val primaryBlock = createPrimaryBlock(engine, targetPage)
        undoLatestChange(engine)
        redoLatestChange(engine)
        applyManualUndoStep(engine, primaryBlock)
        createSecondaryHistoryDemo(engine, targetPage)
    } finally {
        withContext(NonCancellable) {
            try {
                historyUpdates?.cancelAndJoin()
            } finally {
                try {
                    engine.editor.setActiveHistory(activeHistory)
                } finally {
                    engine.editor.destroyHistory(guideHistory)
                }
            }
        }
    }
}

private fun subscribeToHistoryUpdates(
    scope: CoroutineScope,
    engine: Engine,
): Job = scope.launch {
    // Subscribe to history updates.
    engine.editor.onHistoryUpdatedWithKind().collect { kind ->
        when (kind) {
            HistoryUpdate.ACTIVATED -> println("Active history switched, scene unchanged.")
            HistoryUpdate.UPDATED -> println(
                "History updated: canUndo=${engine.editor.canUndo()}, " +
                    "canRedo=${engine.editor.canRedo()}",
            )
        }
    }
}

private fun createPrimaryBlock(
    engine: Engine,
    page: DesignBlock,
): DesignBlock {
    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setPositionX(block, 140F)
    engine.block.setPositionY(block, 95F)
    engine.block.setWidth(block, 265F)
    engine.block.setHeight(block, 265F)
    val triangleShape = engine.block.createShape(ShapeType.Polygon)
    engine.block.setInt(
        triangleShape,
        property = "shape/polygon/sides",
        value = 3,
    )
    engine.block.setShape(block, triangleShape)
    val triangleFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        triangleFill,
        property = "fill/color/value",
        value = Color.fromRGBA(0.2F, 0.5F, 0.9F, 1F),
    )
    engine.block.setFill(block, triangleFill)
    engine.block.appendChild(page, block)
    engine.editor.addUndoStep()

    return block
}

private fun undoLatestChange(engine: Engine) {
    if (engine.editor.canUndo()) {
        engine.editor.undo()
    }
}

private fun redoLatestChange(engine: Engine) {
    if (engine.editor.canRedo()) {
        engine.editor.redo()
    }
}

private fun applyManualUndoStep(
    engine: Engine,
    primaryBlock: DesignBlock,
) {
    engine.block.setPositionX(primaryBlock, 190F)
    engine.editor.addUndoStep()
    if (engine.editor.canUndo()) {
        engine.editor.removeUndoStep()
    }
    engine.block.setPositionX(primaryBlock, 140F)
}

private fun createSecondaryHistoryDemo(
    engine: Engine,
    page: DesignBlock,
) {
    val primaryHistory = engine.editor.getActiveHistory()
    val secondaryHistory = engine.editor.createHistory()
    try {
        engine.editor.setActiveHistory(secondaryHistory)
        val secondaryBlock = engine.block.create(DesignBlockType.Graphic)
        engine.block.setPositionX(secondaryBlock, 440F)
        engine.block.setPositionY(secondaryBlock, 95F)
        engine.block.setWidth(secondaryBlock, 220F)
        engine.block.setHeight(secondaryBlock, 220F)
        val circleShape = engine.block.createShape(ShapeType.Ellipse)
        engine.block.setShape(secondaryBlock, circleShape)
        val circleFill = engine.block.createFill(FillType.Color)
        engine.block.setColor(
            circleFill,
            property = "fill/color/value",
            value = Color.fromRGBA(0.9F, 0.3F, 0.3F, 1F),
        )
        engine.block.setFill(secondaryBlock, circleFill)
        engine.block.appendChild(page, secondaryBlock)
        engine.editor.addUndoStep()
    } finally {
        try {
            engine.editor.setActiveHistory(primaryHistory)
        } finally {
            engine.editor.destroyHistory(secondaryHistory)
        }
    }
}

private fun createDemoPage(engine: Engine): DesignBlock {
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1920F)
    return page
}
```

Manage undo and redo operations with the Android CreativeEngine API, subscribe to history updates with `Flow`, and isolate workflows with multiple history stacks.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/engine-guides-undo-and-history)

<EngineReferenceNote {...props} />

This guide focuses on the engine APIs. It assumes your app already has an initialized `Engine` and a scene or block to edit. Pass an existing page to `undoAndHistory()` to keep its active history isolated from the temporary guide history. When no page is passed, the standalone sample creates a small offscreen demo page and preserves that new scene's initial history. The highlighted code is the history logic you would apply to your own scene.

If you use the default Android editor UI, its undo and redo buttons call the same history APIs shown here. Custom UI can mirror that behavior by checking `canUndo()` and `canRedo()`.

## Creating an Undoable Change

When you make programmatic engine changes outside the default UI, commit the logical operation with `addUndoStep()`. The example creates a graphic block on an existing page and records that as one undoable checkpoint.

```kotlin highlight-android-create-block
val block = engine.block.create(DesignBlockType.Graphic)
engine.block.setPositionX(block, 140F)
engine.block.setPositionY(block, 95F)
engine.block.setWidth(block, 265F)
engine.block.setHeight(block, 265F)
val triangleShape = engine.block.createShape(ShapeType.Polygon)
engine.block.setInt(
    triangleShape,
    property = "shape/polygon/sides",
    value = 3,
)
engine.block.setShape(block, triangleShape)
val triangleFill = engine.block.createFill(FillType.Color)
engine.block.setColor(
    triangleFill,
    property = "fill/color/value",
    value = Color.fromRGBA(0.2F, 0.5F, 0.9F, 1F),
)
engine.block.setFill(block, triangleFill)
engine.block.appendChild(page, block)
engine.editor.addUndoStep()
```

## Performing Undo and Redo Operations

Check `canUndo()` or `canRedo()` before calling the corresponding API. This matches the availability rules of the built-in Android UI.

```kotlin highlight-android-undo
if (engine.editor.canUndo()) {
    engine.editor.undo()
}
```

```kotlin highlight-android-redo
if (engine.editor.canRedo()) {
    engine.editor.redo()
}
```

## Subscribing to History Changes

`engine.editor.onHistoryUpdatedWithKind()` returns a `Flow<HistoryUpdate>` that fires after undo, redo, or any new committed change. Each event reports whether the active stack's snapshots changed (`UPDATED`) or whether `setActiveHistory()` swapped to a different stack without changing the scene (`ACTIVATED`). Collect it from a scope owned by the screen or workflow that exposes your custom undo and redo controls, and ignore `ACTIVATED` events in dirty-state or save-button logic.

```kotlin highlight-android-subscribe-history
// Subscribe to history updates.
engine.editor.onHistoryUpdatedWithKind().collect { kind ->
    when (kind) {
        HistoryUpdate.ACTIVATED -> println("Active history switched, scene unchanged.")
        HistoryUpdate.UPDATED -> println(
            "History updated: canUndo=${engine.editor.canUndo()}, " +
                "canRedo=${engine.editor.canRedo()}",
        )
    }
}
```

In a real app, map the callback to Compose state, toolbar buttons, or analytics instead of just printing the current availability.

## Managing Undo Steps Manually

Use `addUndoStep()` when several engine calls should be treated as one logical action. `removeUndoStep()` lets you discard the latest checkpoint again.

```kotlin highlight-android-manual-step
engine.block.setPositionX(primaryBlock, 190F)
engine.editor.addUndoStep()
if (engine.editor.canUndo()) {
    engine.editor.removeUndoStep()
}
engine.block.setPositionX(primaryBlock, 140F)
```

## Working with Multiple History Stacks

Multiple histories are useful when an Android flow needs isolated undo and redo behavior, such as a temporary overlay or guided sub-step.

### Creating and Switching History Stacks

Create a second stack with `createHistory()`, switch to it with `setActiveHistory()`, and switch back when the isolated edits are done.

```kotlin highlight-android-multiple-histories
val primaryHistory = engine.editor.getActiveHistory()
val secondaryHistory = engine.editor.createHistory()
try {
    engine.editor.setActiveHistory(secondaryHistory)
    val secondaryBlock = engine.block.create(DesignBlockType.Graphic)
    engine.block.setPositionX(secondaryBlock, 440F)
    engine.block.setPositionY(secondaryBlock, 95F)
    engine.block.setWidth(secondaryBlock, 220F)
    engine.block.setHeight(secondaryBlock, 220F)
    val circleShape = engine.block.createShape(ShapeType.Ellipse)
    engine.block.setShape(secondaryBlock, circleShape)
    val circleFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        circleFill,
        property = "fill/color/value",
        value = Color.fromRGBA(0.9F, 0.3F, 0.3F, 1F),
    )
    engine.block.setFill(secondaryBlock, circleFill)
    engine.block.appendChild(page, secondaryBlock)
    engine.editor.addUndoStep()
} finally {
    try {
        engine.editor.setActiveHistory(primaryHistory)
    } finally {
        engine.editor.destroyHistory(secondaryHistory)
    }
}
```

### Cleaning Up History Stacks

Destroy temporary stacks once the isolated workflow is complete. The preceding example performs that cleanup in a nested `finally` block, so it restores the primary stack and destroys the temporary stack even when the isolated workflow fails. Cleaning up unused stacks avoids leaving unused history handles around longer than necessary.

## Troubleshooting

- **Undo or redo stays disabled**: Call `addUndoStep()` after programmatic changes that should become undoable.
- **History updates never arrive**: Start the `Flow` collection from `onLoaded` in `editorContext.coroutineScope` or another editor-owned scope.
- **Undo affects the wrong workflow**: Check `getActiveHistory()` before calling `undo()` or `redo()` when multiple stacks are active.

## API Reference

| Method | Purpose |
| ------ | ------- |
| `engine.editor.createHistory()` | Create a new undo and redo history stack. |
| `engine.editor.destroyHistory()` | Destroy a history stack when an isolated workflow is complete. |
| `engine.editor.setActiveHistory()` | Switch undo and redo operations to a specific history stack. |
| `engine.editor.getActiveHistory()` | Get the history stack that currently receives undo and redo operations. |
| `engine.editor.addUndoStep()` | Commit the current editor state as a manual checkpoint. |
| `engine.editor.removeUndoStep()` | Remove the most recent manual checkpoint again. |
| `engine.editor.undo()` | Revert the latest committed change in the active history stack. |
| `engine.editor.redo()` | Restore the latest reverted change in the active history stack. |
| `engine.editor.canUndo()` | Check whether the active history stack currently has an undo step. |
| `engine.editor.canRedo()` | Check whether the active history stack currently has a redo step. |
| `engine.editor.onHistoryUpdatedWithKind()` | Observe history changes as a `Flow<HistoryUpdate>` that distinguishes `UPDATED` (snapshot change, undo, or redo) from `ACTIVATED` (a `setActiveHistory()` switch). |

## Next Steps

- [Events](./events.md) — subscribe to block creation, update, and deletion events alongside history updates
- [Editor State](./edit-modes.md) — combine edit mode changes with history state in custom Android UI
- [Scenes](./scenes.md) — build or reset scenes before assigning them to specific history stacks



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support