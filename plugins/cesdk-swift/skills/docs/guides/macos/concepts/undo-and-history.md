> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Undo and History](./undo-and-history.md)

---

```swift file=@cesdk_swift_examples/engine-guides-undo-and-history/UndoAndHistory.swift reference-only
import IMGLYEngine

@MainActor
func undoAndHistory(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Subscribe to history updates.
  let historyTask = Task {
    for await kind in engine.editor.onHistoryUpdatedWithKind {
      switch kind {
      case .activated:
        print("Active history switched, scene unchanged.")
      case .updated:
        let canUndo = try engine.editor.canUndo()
        let canRedo = try engine.editor.canRedo()
        print("History updated — canUndo: \(canUndo), canRedo: \(canRedo)")
      @unknown default:
        break
      }
    }
  }

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(block, value: 100)
  try engine.block.setHeight(block, value: 100)
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)

  if try engine.editor.canUndo() {
    try engine.editor.undo()
  }

  if try engine.editor.canRedo() {
    try engine.editor.redo()
  }

  try engine.block.setWidth(block, value: 200)
  try engine.editor.addUndoStep()

  if try engine.editor.canUndo() {
    try engine.editor.removeUndoStep()
  }

  let primaryHistory = engine.editor.getActiveHistory()
  let secondaryHistory = engine.editor.createHistory()
  engine.editor.setActiveHistory(secondaryHistory)

  // Operations here only affect secondaryHistory
  try engine.block.setWidth(block, value: 300)

  engine.editor.setActiveHistory(primaryHistory)
  engine.editor.destroyHistory(secondaryHistory)

  historyTask.cancel()
}
```

Manage undo and redo operations in CE.SDK programmatically, subscribe to history changes, and use multiple independent history stacks for isolated editing contexts.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260821/engine-guides-undo-and-history)

CE.SDK automatically tracks editing operations, enabling users to undo and redo changes. The engine creates undo steps for most operations automatically. You can also create multiple independent history stacks to isolate editing contexts — for example, separate histories for a main canvas and an overlay editor.

## Setup

We start by creating a scene and page. The engine automatically creates a history stack when it initializes.

```swift highlight-undoAndHistory-setup
let scene = try engine.scene.create()
let page = try engine.block.create(.page)
try engine.block.setWidth(page, value: 800)
try engine.block.setHeight(page, value: 600)
try engine.block.appendChild(to: scene, child: page)
```

## Subscribing to History Changes

Use `engine.editor.onHistoryUpdatedWithKind` to receive notifications when the history state changes. Each emission is a `HistoryUpdate` value that describes the kind of change:

- `.updated` — the active history's snapshots changed because of an edit, an `addUndoStep()` call, or an `undo()`/`redo()`. The scene reflects the new state.
- `.activated` — a different history buffer was made active via `setActiveHistory(_:)`. The undo/redo stack visible to the user changed, but no new snapshot was created and no undo or redo was applied.

This separation matters for save-button or dirty-state logic: switching the active history (for example when toggling a preview mode) should not be treated as an unsaved change.

```swift highlight-undoAndHistory-subscribe
// Subscribe to history updates.
let historyTask = Task {
  for await kind in engine.editor.onHistoryUpdatedWithKind {
    switch kind {
    case .activated:
      print("Active history switched, scene unchanged.")
    case .updated:
      let canUndo = try engine.editor.canUndo()
      let canRedo = try engine.editor.canRedo()
      print("History updated — canUndo: \(canUndo), canRedo: \(canRedo)")
    @unknown default:
      break
    }
  }
}
```

Cancel the `Task` when you no longer need notifications, such as when dismissing a view.

## Automatic Undo Step Creation

Most editing operations automatically create undo steps. Adding a block to the scene records this operation in the history stack.

```swift highlight-undoAndHistory-createBlock
let block = try engine.block.create(.graphic)
try engine.block.setShape(block, shape: engine.block.createShape(.rect))
try engine.block.setWidth(block, value: 100)
try engine.block.setHeight(block, value: 100)
try engine.block.setFill(block, fill: engine.block.createFill(.color))
try engine.block.appendChild(to: page, child: block)
```

After creating the block, `canUndo()` returns `true`.

## Performing Undo and Redo

Use `engine.editor.undo()` and `engine.editor.redo()` to revert or restore changes. Always check availability with `canUndo()` and `canRedo()` first.

```swift highlight-undoAndHistory-undo
if try engine.editor.canUndo() {
  try engine.editor.undo()
}
```

After undoing, `canRedo()` returns `true`. Call `redo()` to restore the change.

```swift highlight-undoAndHistory-redo
if try engine.editor.canRedo() {
  try engine.editor.redo()
}
```

## Managing Undo Steps Manually

Most operations are tracked automatically. For custom operations that the engine doesn't track, use `addUndoStep()` to create a checkpoint manually.

```swift highlight-undoAndHistory-manualStep
try engine.block.setWidth(block, value: 200)
try engine.editor.addUndoStep()
```

Use `removeUndoStep()` to discard the most recent undo step without affecting the redo stack.

```swift highlight-undoAndHistory-removeStep
if try engine.editor.canUndo() {
  try engine.editor.removeUndoStep()
}
```

## Working with Multiple History Stacks

CE.SDK supports multiple independent history stacks. This is useful when different parts of your app need separate undo/redo histories. Only the active history responds to undo/redo operations.

```swift highlight-undoAndHistory-multipleHistories
  let primaryHistory = engine.editor.getActiveHistory()
  let secondaryHistory = engine.editor.createHistory()
  engine.editor.setActiveHistory(secondaryHistory)

  // Operations here only affect secondaryHistory
  try engine.block.setWidth(block, value: 300)

  engine.editor.setActiveHistory(primaryHistory)
  engine.editor.destroyHistory(secondaryHistory)
```

- Create a stack with `createHistory()` and activate it with `setActiveHistory()`
- Operations while a stack is active only affect that stack
- Always call `destroyHistory()` when a stack is no longer needed to free resources

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.editor.createHistory()` | Create a new undo/redo history stack |
| `engine.editor.destroyHistory(_:)` | Destroy a history stack and free resources |
| `engine.editor.setActiveHistory(_:)` | Set a history stack as the active one |
| `engine.editor.getActiveHistory()` | Get the currently active history stack |
| `engine.editor.addUndoStep()` | Manually add a checkpoint to the undo stack |
| `engine.editor.removeUndoStep()` | Remove the most recent undo step |
| `engine.editor.undo()` | Revert to the previous history state |
| `engine.editor.redo()` | Restore the next history state |
| `engine.editor.canUndo()` | Check if an undo operation is available |
| `engine.editor.canRedo()` | Check if a redo operation is available |
| `engine.editor.onHistoryUpdatedWithKind` | Subscribe to history change notifications |

## Next Steps

- [Events](./events.md) — subscribe to block creation, update, and deletion events
- [Editor State](./edit-modes.md) — track selection and edit mode changes
- [Scenes](./scenes.md) — create and manage design scenes



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support