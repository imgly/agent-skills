> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Editor State](./edit-modes.md)

---

```swift file=@cesdk_swift_examples/engine-guides-editor-state/EditorState.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editorState(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Add an image block to demonstrate Crop mode
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 350)
  try engine.block.setHeight(imageBlock, value: 250)
  try engine.block.setPositionX(imageBlock, value: 50)
  try engine.block.setPositionY(imageBlock, value: 175)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  // Add a text block to demonstrate Text mode
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)
  try engine.block.replaceText(textBlock, text: "Edit this text")
  try engine.block.setTextFontSize(textBlock, fontSize: 48)
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setPositionX(textBlock, value: 450)
  try engine.block.setPositionY(textBlock, value: 275)

  // Subscribe to state changes using AsyncStream
  let stateTask = Task {
    for await _ in engine.editor.onStateChanged {
      let currentMode = engine.editor.getEditMode()
      print("Edit mode changed to: \(currentMode)")
    }
  }

  // Get the current edit mode (default is Transform)
  let initialMode = engine.editor.getEditMode()
  print("Initial edit mode: \(initialMode)")

  // Select the image block and switch to Crop mode
  try engine.block.select(imageBlock)
  engine.editor.setEditMode(.crop)
  print("Switched to Crop mode")

  // Switch back to Transform mode
  engine.editor.setEditMode(.transform)
  print("Switched back to Transform mode")

  // Get the cursor type to display the appropriate cursor
  let cursorType = engine.editor.getCursorType()
  print("Cursor type: \(cursorType)")
  // Returns: .arrow, .move, .moveNotPermitted, .resize, .rotate, or .text

  // Get cursor rotation for directional cursors like resize handles
  let cursorRotation = engine.editor.getCursorRotation()
  print("Cursor rotation (radians): \(cursorRotation)")

  // Select the text block and switch to Text mode to get cursor position
  try engine.block.select(textBlock)
  engine.editor.setEditMode(.text)

  // Get text cursor position in screen space
  let textCursorX = engine.editor.getTextCursorPositionInScreenSpaceX()
  let textCursorY = engine.editor.getTextCursorPositionInScreenSpaceY()
  print("Text cursor position: (\(textCursorX), \(textCursorY))")

  // Check if a user interaction is currently in progress
  let isInteracting = try engine.editor.unstable_isInteractionHappening()
  print("Is interaction happening: \(isInteracting)")

  // Clean up the state subscription
  stateTask.cancel()

  // Switch back to Transform mode
  engine.editor.setEditMode(.transform)
}
```

Control how users interact with content on the canvas by switching between edit modes, subscribing to state changes, and reading cursor information.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-editor-state)

Edit modes define what type of content users can currently modify on the canvas. Each mode enables different interaction behaviors — Transform mode for moving and resizing, Crop mode for adjusting content within frames, Text mode for inline text editing, and so on. The engine maintains the current edit mode as part of its state and notifies subscribers when it changes.

This guide covers:

- The five built-in edit modes (Transform, Crop, Text, Trim, Playback)
- Switching edit modes programmatically
- Subscribing to state changes for UI synchronization
- Reading cursor type and rotation
- Tracking text cursor position for overlays
- Detecting active user interactions

## Setup

Create a scene with an image block and a text block to demonstrate the different edit modes.

```swift highlight-editorState-setup
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Add an image block to demonstrate Crop mode
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(imageBlock, value: 350)
  try engine.block.setHeight(imageBlock, value: 250)
  try engine.block.setPositionX(imageBlock, value: 50)
  try engine.block.setPositionY(imageBlock, value: 175)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  // Add a text block to demonstrate Text mode
  let textBlock = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: textBlock)
  try engine.block.replaceText(textBlock, text: "Edit this text")
  try engine.block.setTextFontSize(textBlock, fontSize: 48)
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setPositionX(textBlock, value: 450)
  try engine.block.setPositionY(textBlock, value: 275)
```

## Edit Modes

CE.SDK supports five built-in edit modes, each designed for a specific type of interaction with canvas content.

| Mode | Purpose |
|------|---------|
| `.transform` | Move, resize, and rotate blocks (default) |
| `.crop` | Adjust media content within block frames |
| `.text` | Edit text content inline |
| `.trim` | Adjust clip start and end points (video scenes) |
| `.playback` | Play video or audio content (limited interactions) |

### Getting the Current Mode

Query the current mode with `engine.editor.getEditMode()`. The initial mode is always `.transform`.

```swift highlight-editorState-getEditMode
// Get the current edit mode (default is Transform)
let initialMode = engine.editor.getEditMode()
print("Initial edit mode: \(initialMode)")
```

### Switching Edit Modes

Use `engine.editor.setEditMode(_:)` to change the current editing mode. The mode determines what interactions are available on selected blocks.

```swift highlight-editorState-setEditMode
  // Select the image block and switch to Crop mode
  try engine.block.select(imageBlock)
  engine.editor.setEditMode(.crop)
  print("Switched to Crop mode")

  // Switch back to Transform mode
  engine.editor.setEditMode(.transform)
  print("Switched back to Transform mode")
```

> **Tip:** Some modes only take effect when a compatible block is selected. For example, Crop mode has no visible effect unless an image or video block is selected, and Text mode requires a text block.

## Subscribing to State Changes

The engine notifies subscribers whenever the editor state changes, including mode switches and cursor updates. Use the `onStateChanged` `AsyncStream` to react to changes.

```swift highlight-editorState-onStateChanged
// Subscribe to state changes using AsyncStream
let stateTask = Task {
  for await _ in engine.editor.onStateChanged {
    let currentMode = engine.editor.getEditMode()
    print("Edit mode changed to: \(currentMode)")
  }
}
```

Common use cases include updating toolbar UI to reflect the current mode, showing mode-specific panels, and disabling actions during Playback mode.

Cancel the task when you no longer need updates to prevent unnecessary work.

## Cursor State

The engine tracks what cursor type should be displayed based on the current context and hovered element. These APIs are most relevant for iPad apps with mouse or trackpad input (iPadOS 13.4+) and macOS apps, where users interact with a pointer. On iPhone, touch interactions don't use a visible cursor, so you can skip this section if you're targeting iPhone only.

### Reading Cursor Type

Use `engine.editor.getCursorType()` to get the cursor type to display.

```swift highlight-editorState-cursorType
// Get the cursor type to display the appropriate cursor
let cursorType = engine.editor.getCursorType()
print("Cursor type: \(cursorType)")
// Returns: .arrow, .move, .moveNotPermitted, .resize, .rotate, or .text
```

| Cursor Type | Meaning |
|-------------|---------|
| `.arrow` | Default pointer cursor |
| `.move` | Element can be moved |
| `.moveNotPermitted` | Element cannot be moved in the current context |
| `.resize` | Resize handle is hovered |
| `.rotate` | Rotation handle is hovered |
| `.text` | Text editing cursor |

### Reading Cursor Rotation

For directional cursors like resize handles, use `engine.editor.getCursorRotation()` to get the rotation angle in radians. Apply this rotation to your cursor image for correct visual feedback.

```swift highlight-editorState-cursorRotation
// Get cursor rotation for directional cursors like resize handles
let cursorRotation = engine.editor.getCursorRotation()
print("Cursor rotation (radians): \(cursorRotation)")
```

## Text Cursor Position

When in Text edit mode, track the text cursor (caret) position for rendering custom overlays or toolbars near the insertion point.

Use `getTextCursorPositionInScreenSpaceX()` and `getTextCursorPositionInScreenSpaceY()` to get the cursor position in screen pixels. These values update as the user moves through text.

```swift highlight-editorState-textCursorPosition
  // Select the text block and switch to Text mode to get cursor position
  try engine.block.select(textBlock)
  engine.editor.setEditMode(.text)

  // Get text cursor position in screen space
  let textCursorX = engine.editor.getTextCursorPositionInScreenSpaceX()
  let textCursorY = engine.editor.getTextCursorPositionInScreenSpaceY()
  print("Text cursor position: (\(textCursorX), \(textCursorY))")
```

## Detecting Active Interactions

Call `engine.editor.unstable_isInteractionHappening()` to check if a user interaction like dragging or resizing is in progress. This is useful for deferring expensive operations until after the interaction completes.

```swift highlight-editorState-interactionHappening
// Check if a user interaction is currently in progress
let isInteracting = try engine.editor.unstable_isInteractionHappening()
print("Is interaction happening: \(isInteracting)")
```

> **Warning:** This API is marked unstable and may change in future releases.

## Next Steps

- [Undo and History](./undo-and-history.md) — Implement undo/redo functionality and manage history stacks
- [Events](./events.md) — Subscribe to block creation, update, and deletion events
- [Blocks](./blocks.md) — Understand block types and the design hierarchy
- [Scenes](./scenes.md) — Learn about scene structure and page management



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support