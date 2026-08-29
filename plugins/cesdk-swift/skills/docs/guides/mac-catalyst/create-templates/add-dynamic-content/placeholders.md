> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Placeholders](./placeholders.md)

---

```swift file=@cesdk_swift_examples/engine-guides-placeholders/Placeholders.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func placeholders(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL
  let sampleImage1 = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
  let sampleImage2 = baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg")

  // Build a sample template with an image placeholder, a text placeholder, and a
  // second "featured" image. This setup runs before any placeholder API is
  // called, so every creation call succeeds.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1200)
  try engine.block.setHeight(page, value: 800)
  try engine.block.appendChild(to: scene, child: page)

  // A graphic block backed by an image fill — the primary placeholder.
  let imagePlaceholder = try engine.block.create(.graphic)
  try engine.block.setShape(imagePlaceholder, shape: engine.block.createShape(.rect))
  let imageSetupFill = try engine.block.createFill(.image)
  try engine.block.setURL(imageSetupFill, property: "fill/image/imageFileURI", value: sampleImage1)
  try engine.block.setFill(imagePlaceholder, fill: imageSetupFill)
  try engine.block.setPositionX(imagePlaceholder, value: 80)
  try engine.block.setPositionY(imagePlaceholder, value: 250)
  try engine.block.setWidth(imagePlaceholder, value: 300)
  try engine.block.setHeight(imagePlaceholder, value: 300)
  try engine.block.appendChild(to: page, child: imagePlaceholder)

  // A text block — the text placeholder.
  let textPlaceholder = try engine.block.create(.text)
  try engine.block.setString(textPlaceholder, property: "text/text", value: "Your headline here")
  try engine.block.setFloat(textPlaceholder, property: "text/fontSize", value: 48)
  try engine.block.setPositionX(textPlaceholder, value: 80)
  try engine.block.setPositionY(textPlaceholder, value: 120)
  try engine.block.setWidth(textPlaceholder, value: 600)
  try engine.block.setHeight(textPlaceholder, value: 80)
  try engine.block.appendChild(to: page, child: textPlaceholder)

  // A second graphic block used to demonstrate the combined "Act as Placeholder" setup.
  let featuredImage = try engine.block.create(.graphic)
  try engine.block.setShape(featuredImage, shape: engine.block.createShape(.rect))
  let featuredSetupFill = try engine.block.createFill(.image)
  try engine.block.setURL(featuredSetupFill, property: "fill/image/imageFileURI", value: sampleImage2)
  try engine.block.setFill(featuredImage, fill: featuredSetupFill)
  try engine.block.setPositionX(featuredImage, value: 440)
  try engine.block.setPositionY(featuredImage, value: 250)
  try engine.block.setWidth(featuredImage, value: 300)
  try engine.block.setHeight(featuredImage, value: 300)
  try engine.block.appendChild(to: page, child: featuredImage)

  let imageFill = try engine.block.getFill(imagePlaceholder)
  let supportsBehavior = try engine.block.supportsPlaceholderBehavior(imageFill)
  let supportsControls = try engine.block.supportsPlaceholderControls(imagePlaceholder)
  print("Image fill supports placeholder behavior:", supportsBehavior) // true
  print("Image block supports placeholder controls:", supportsControls) // true

  if try engine.block.supportsPlaceholderBehavior(imageFill) {
    try engine.block.setPlaceholderBehaviorEnabled(imageFill, enabled: true)
  }
  let behaviorEnabled = try engine.block.isPlaceholderBehaviorEnabled(imageFill)
  print("Placeholder behavior enabled on the image fill:", behaviorEnabled) // true

  if try engine.block.supportsPlaceholderBehavior(textPlaceholder) {
    try engine.block.setPlaceholderBehaviorEnabled(textPlaceholder, enabled: true)
  }

  try engine.block.setPlaceholderEnabled(imagePlaceholder, enabled: true)
  let isInteractive = try engine.block.isPlaceholderEnabled(imagePlaceholder)
  print("Placeholder is interactive in Adopter mode:", isInteractive) // true

  let featuredFill = try engine.block.getFill(featuredImage)
  if try engine.block.supportsPlaceholderBehavior(featuredFill) {
    try engine.block.setPlaceholderBehaviorEnabled(featuredFill, enabled: true)
  }
  if try engine.block.supportsPlaceholderControls(featuredImage) {
    try engine.block.setPlaceholderControlsOverlayEnabled(featuredImage, enabled: true)
    try engine.block.setPlaceholderControlsButtonEnabled(featuredImage, enabled: true)
  }

  try engine.block.setPlaceholderControlsOverlayEnabled(imagePlaceholder, enabled: true)

  try engine.block.setPlaceholderControlsButtonEnabled(imagePlaceholder, enabled: true)

  try engine.block.setScopeEnabled(imagePlaceholder, key: "fill/change", enabled: true)
  try engine.block.setScopeEnabled(imagePlaceholder, key: "fill/changeType", enabled: true)
  try engine.block.setScopeEnabled(imagePlaceholder, key: "layer/crop", enabled: true)

  try engine.block.setScopeEnabled(textPlaceholder, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(textPlaceholder, key: "text/character", enabled: true)

  for url in [sampleImage1, sampleImage2] {
    let slot = try engine.block.create(.graphic)
    try engine.block.setShape(slot, shape: engine.block.createShape(.rect))
    let slotFill = try engine.block.createFill(.image)
    try engine.block.setURL(slotFill, property: "fill/image/imageFileURI", value: url)
    try engine.block.setFill(slot, fill: slotFill)
    try engine.block.appendChild(to: page, child: slot)

    try engine.block.setPlaceholderEnabled(slot, enabled: true)
    if try engine.block.supportsPlaceholderBehavior(slotFill) {
      try engine.block.setPlaceholderBehaviorEnabled(slotFill, enabled: true)
    }
  }
}
```

Placeholders turn design blocks into drop-zones that users can swap content into
while the template's layout and styling stay locked. This guide configures
placeholder behavior and visual controls for image and text blocks with the
Swift Engine API.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-placeholders)

<EngineReferenceNote {...props} />

Placeholders are the backbone of editable-yet-locked templates: a designer marks which blocks an end user may replace, and the rest of the design stays fixed. This guide covers checking placeholder support, enabling behavior, exposing visual controls, the scopes placeholders depend on, and applying settings to multiple blocks at once.

The example builds a sample template with an `imagePlaceholder` graphic block, a `textPlaceholder` text block, and a second `featuredImage` graphic block. The snippets below configure their placeholder settings.

## Placeholder Fundamentals

Placeholders convert design blocks into interactive drop-zones where content can be replaced while the surrounding layout and styling remain under the template author's control.

### Two Distinct Features

**Placeholder behavior** marks a block's content as replaceable — it turns the block into a drop-zone and backs the support checks used to validate replacement.

**Placeholder controls** are the visual affordances drawn over a placeholder: an overlay pattern and a Replace button that guide users to the editable area. These appear only inside the editor — an exported design never includes them.

### Block-Level vs Fill-Level Behavior

The target of the behavior API depends on the block type:

- **Graphic blocks** (images and videos) hold their replaceable content in a **fill**. Enable placeholder behavior on the fill from `engine.block.getFill(_:)`, and enable placeholder controls on the block.
- **Text blocks** have no replaceable fill, so enable placeholder behavior directly on the block. Text blocks do not support placeholder controls.

## Checking Placeholder Support

Before enabling placeholder features, check whether the target supports them. For a graphic block, query the fill for behavior support and the block for controls support.

```swift highlight-placeholders-checkSupport
let imageFill = try engine.block.getFill(imagePlaceholder)
let supportsBehavior = try engine.block.supportsPlaceholderBehavior(imageFill)
let supportsControls = try engine.block.supportsPlaceholderControls(imagePlaceholder)
print("Image fill supports placeholder behavior:", supportsBehavior) // true
print("Image block supports placeholder controls:", supportsControls) // true
```

`supportsPlaceholderBehavior(_:)` reports whether a fill — or a text block — can become a drop-zone. `supportsPlaceholderControls(_:)` reports whether a block can display the overlay and button; it returns `false` for text blocks.

## Enabling Placeholder Behavior

Enabling placeholder behavior is what turns a block into a drop-zone. The target differs by block type.

### For Graphic Blocks (Images/Videos)

For graphic blocks, enable behavior on the fill obtained above with `engine.block.getFill(_:)`, not on the block itself.

```swift highlight-placeholders-enableBehaviorGraphic
if try engine.block.supportsPlaceholderBehavior(imageFill) {
  try engine.block.setPlaceholderBehaviorEnabled(imageFill, enabled: true)
}
let behaviorEnabled = try engine.block.isPlaceholderBehaviorEnabled(imageFill)
print("Placeholder behavior enabled on the image fill:", behaviorEnabled) // true
```

Calling `setPlaceholderBehaviorEnabled(_:enabled:)` on the fill reflects the underlying architecture: a graphic block contains a fill, and the fill is the replaceable content. The matching query `isPlaceholderBehaviorEnabled(_:)` reads back the current state.

### For Text Blocks

For text blocks, enable behavior directly on the block — text blocks carry their content rather than a replaceable fill.

```swift highlight-placeholders-enableBehaviorText
if try engine.block.supportsPlaceholderBehavior(textPlaceholder) {
  try engine.block.setPlaceholderBehaviorEnabled(textPlaceholder, enabled: true)
}
```

## Enabling Adopter Mode Interaction

Placeholder behavior marks content as replaceable, but a block also has to be enabled for interaction in the Adopter role before a user can swap its content.

```swift highlight-placeholders-enableAdopterMode
try engine.block.setPlaceholderEnabled(imagePlaceholder, enabled: true)
let isInteractive = try engine.block.isPlaceholderEnabled(imagePlaceholder)
print("Placeholder is interactive in Adopter mode:", isInteractive) // true
```

`setPlaceholderEnabled(_:enabled:)` controls whether the placeholder is interactive for users in the Adopter role. CE.SDK distinguishes the **Creator** role (full editing access) from the **Adopter** role (replace-only). In the Creator role, enabling the placeholder also opens the block's `editor/select` scope so the block stays selectable. Once an Adopter replaces the content, the engine clears the placeholder flag automatically.

### Automatic Management

In the CE.SDK editor, placeholder interaction is managed for you: the editor keeps `setPlaceholderEnabled(_:enabled:)` in sync with a block's content scopes as they change. When you configure placeholders directly through the Engine, as in this guide, call `setPlaceholderEnabled(_:enabled:)` explicitly to make a placeholder interactive.

## Configuring Visual Feedback

Placeholders can display visual indicators that point users to the editable area.

### Combined Setup: The "Act as Placeholder" Pattern

The most common setup enables placeholder behavior on the fill and both visual controls on the block together.

```swift highlight-placeholders-fullConfiguration
let featuredFill = try engine.block.getFill(featuredImage)
if try engine.block.supportsPlaceholderBehavior(featuredFill) {
  try engine.block.setPlaceholderBehaviorEnabled(featuredFill, enabled: true)
}
if try engine.block.supportsPlaceholderControls(featuredImage) {
  try engine.block.setPlaceholderControlsOverlayEnabled(featuredImage, enabled: true)
  try engine.block.setPlaceholderControlsButtonEnabled(featuredImage, enabled: true)
}
```

This is the recommended starting point: it makes the block replaceable and shows both the overlay and the button in one pass.

### Individual Control Options

You can also toggle each control independently.

The **overlay pattern** is a dotted surface that marks the drop-zone:

```swift highlight-placeholders-enableOverlay
try engine.block.setPlaceholderControlsOverlayEnabled(imagePlaceholder, enabled: true)
```

The **Replace button** is a single-tap entry point for swapping content:

```swift highlight-placeholders-enableButton
try engine.block.setPlaceholderControlsButtonEnabled(imagePlaceholder, enabled: true)
```

`isPlaceholderControlsOverlayEnabled(_:)` and `isPlaceholderControlsButtonEnabled(_:)` return the current visibility of each control.

## Scope Requirements and Dependencies

Whether an Adopter can actually replace a placeholder's content depends on the block's scopes. A graphic placeholder is replaceable only when `fill/change` allows it; a text placeholder is editable only when `text/edit` allows it.

```swift highlight-placeholders-scopes
  try engine.block.setScopeEnabled(imagePlaceholder, key: "fill/change", enabled: true)
  try engine.block.setScopeEnabled(imagePlaceholder, key: "fill/changeType", enabled: true)
  try engine.block.setScopeEnabled(imagePlaceholder, key: "layer/crop", enabled: true)

  try engine.block.setScopeEnabled(textPlaceholder, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(textPlaceholder, key: "text/character", enabled: true)
```

Optional scopes broaden what an Adopter can change:

- `fill/changeType` — switch between image, video, and solid-color fills.
- `layer/crop` — crop replacement images.
- `text/character` — change font and character formatting on text placeholders.

## Working with Multiple Placeholders

Templates often have several content slots. Apply placeholder settings systematically by looping over the blocks.

```swift highlight-placeholders-batchOperation
  for url in [sampleImage1, sampleImage2] {
    let slot = try engine.block.create(.graphic)
    try engine.block.setShape(slot, shape: engine.block.createShape(.rect))
    let slotFill = try engine.block.createFill(.image)
    try engine.block.setURL(slotFill, property: "fill/image/imageFileURI", value: url)
    try engine.block.setFill(slot, fill: slotFill)
    try engine.block.appendChild(to: page, child: slot)

    try engine.block.setPlaceholderEnabled(slot, enabled: true)
    if try engine.block.supportsPlaceholderBehavior(slotFill) {
      try engine.block.setPlaceholderBehaviorEnabled(slotFill, enabled: true)
    }
  }
```

This pattern suits collage templates, product showcases, and any layout with multiple content slots.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.block.supportsPlaceholderBehavior(_:)` | Checks whether a block or fill supports placeholder behavior |
| `engine.block.setPlaceholderBehaviorEnabled(_:enabled:)` | Enables or disables placeholder behavior for a block or fill |
| `engine.block.isPlaceholderBehaviorEnabled(_:)` | Queries whether placeholder behavior is enabled |
| `engine.block.setPlaceholderEnabled(_:enabled:)` | Enables or disables placeholder interaction in Adopter mode |
| `engine.block.isPlaceholderEnabled(_:)` | Queries whether placeholder interaction is enabled |
| `engine.block.supportsPlaceholderControls(_:)` | Checks whether a block supports placeholder controls |
| `engine.block.setPlaceholderControlsOverlayEnabled(_:enabled:)` | Enables or disables the placeholder overlay pattern |
| `engine.block.isPlaceholderControlsOverlayEnabled(_:)` | Queries whether the overlay pattern is shown |
| `engine.block.setPlaceholderControlsButtonEnabled(_:enabled:)` | Enables or disables the placeholder button |
| `engine.block.isPlaceholderControlsButtonEnabled(_:)` | Queries whether the placeholder button is shown |

## Next Steps

- [Lock the Template](../lock.md) - Restrict editing access to specific elements or properties to enforce design rules
- [Text Variables](./text-variables.md) - Define dynamic text elements that can be populated with custom values



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support