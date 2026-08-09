> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Dynamic Content](./add-dynamic-content.md)

---

```swift file=@cesdk_swift_examples/engine-guides-dynamic-content/DynamicContent.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func dynamicContent(engine: Engine) async throws {
  // Resolve sample assets against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  // Demo scaffolding: create an 800×600 pixel page to hold the template content.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  try engine.block.setFloat(scene, property: "scene/dpi", value: 72)
  try engine.block.setFloat(scene, property: "scene/pixelScaleFactor", value: 1)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  // Set the Adopter role before creating the template's content so the engine
  // enforces the editing scopes configured below.
  try engine.editor.setRole("Adopter")

  // Content area: 480px wide, centered (left margin = 160px)
  let contentX: Float = 160
  let contentWidth: Float = 480

  try engine.variable.set(key: "firstName", value: "Jane")
  try engine.variable.set(key: "lastName", value: "Doe")
  try engine.variable.set(key: "companyName", value: "IMG.LY")

  // Create heading with variable tokens
  let headingText = try engine.block.create(.text)
  try engine.block.replaceText(
    headingText,
    text: "Welcome to {{companyName}}, {{firstName}} {{lastName}}.",
  )

  // Discover all variables in the scene
  let allVariables = engine.variable.findAll()
  print("Variables in scene:", allVariables)
  try engine.block.setWidth(headingText, value: contentWidth)
  try engine.block.setHeightMode(headingText, mode: .auto)
  try engine.block.setFloat(headingText, property: "text/fontSize", value: 32)
  try engine.block.setTextHorizontalAlignment(headingText, alignment: .left)
  try engine.block.appendChild(to: page, child: headingText)
  try engine.block.setPositionX(headingText, value: contentX)
  try engine.block.setPositionY(headingText, value: 200)

  // Create description with bullet points
  let descriptionText = try engine.block.create(.text)
  try engine.block.replaceText(
    descriptionText,
    text: "This example demonstrates dynamic templates.\n\n"
      + "• Text Variables — Personalize content with {{tokens}}\n"
      + "• Placeholders — Swappable images and media\n"
      + "• Editing Constraints — Protected brand elements",
  )
  try engine.block.setWidth(descriptionText, value: contentWidth)
  try engine.block.setHeightMode(descriptionText, mode: .auto)
  try engine.block.setFloat(descriptionText, property: "text/fontSize", value: 20)
  try engine.block.setTextHorizontalAlignment(descriptionText, alignment: .left)
  try engine.block.appendChild(to: page, child: descriptionText)
  try engine.block.setPositionX(descriptionText, value: contentX)
  try engine.block.setPositionY(descriptionText, value: 300)

  try await engine.captureGuide(page, label: "after-text-variables")

  // Demo scaffolding: create a hero image that the placeholder section below
  // turns into a swappable drop zone.
  let heroImage = try engine.block.create(.graphic)
  try engine.block.setShape(heroImage, shape: engine.block.createShape(.rect))
  let heroFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    heroFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(heroImage, fill: heroFill)
  try engine.block.setWidth(heroImage, value: contentWidth)
  try engine.block.setHeight(heroImage, value: 140)
  try engine.block.appendChild(to: page, child: heroImage)
  try engine.block.setPositionX(heroImage, value: contentX)
  try engine.block.setPositionY(heroImage, value: 40)

  // Enable placeholder behavior on the image fill
  let fill = try engine.block.getFill(heroImage)
  if try engine.block.supportsPlaceholderBehavior(fill) {
    try engine.block.setPlaceholderBehaviorEnabled(fill, enabled: true)
  }

  // Enable user interaction and visual controls on the block
  try engine.block.setPlaceholderEnabled(heroImage, enabled: true)
  if try engine.block.supportsPlaceholderControls(heroImage) {
    try engine.block.setPlaceholderControlsOverlayEnabled(heroImage, enabled: true)
    try engine.block.setPlaceholderControlsButtonEnabled(heroImage, enabled: true)
  }

  // Find all placeholders in the scene
  let placeholders = engine.block.findAllPlaceholders()
  print("Placeholders in scene:", placeholders.count)

  // Demo scaffolding: create a brand image that the constraints section below
  // protects from user edits.
  let brandImage = try engine.block.create(.graphic)
  try engine.block.setShape(brandImage, shape: engine.block.createShape(.rect))
  let brandFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    brandFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg"),
  )
  try engine.block.setFill(brandImage, fill: brandFill)
  try engine.block.setWidth(brandImage, value: 100)
  try engine.block.setHeight(brandImage, value: 25)
  try engine.block.appendChild(to: page, child: brandImage)
  try engine.block.setPositionX(brandImage, value: 350)
  try engine.block.setPositionY(brandImage, value: 540)

  // Lock the brand image: prevent moving, resizing, and selection
  try engine.block.setScopeEnabled(brandImage, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(brandImage, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(brandImage, key: "editor/select", enabled: false)

  // Verify constraints are applied
  let canSelect = try engine.block.isScopeEnabled(brandImage, key: "editor/select")
  let canMove = try engine.block.isScopeEnabled(brandImage, key: "layer/move")
  print("Brand image - canSelect:", canSelect, "canMove:", canMove)

  try await engine.captureGuide(page, label: "hero")
}
```

Dynamic content transforms static designs into flexible, data-driven templates. CE.SDK provides three complementary capabilities—text variables, placeholders, and editing constraints—that work together to enable personalization while maintaining design integrity.

![Dynamic content example with resolved text variables, a swappable hero image, and a protected brand image.](https://img.ly/docs/cesdk/macos/create-templates/add-dynamic-content-53fad7/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-dynamic-content)

<EngineReferenceNote {...props} />

This guide covers how to use dynamic content capabilities in CE.SDK templates. The example creates a social media card with personalized name and company variables, a replaceable hero image, and a protected brand image.

## Dynamic Content Capabilities

CE.SDK offers three ways to make templates dynamic:

- **Text Variables** — Insert `{{tokens}}` in text that resolve to dynamic values at runtime
- **Placeholders** — Mark blocks as drop zones where users can swap images or videos
- **Editing Constraints** — Lock specific properties to protect brand elements while allowing controlled changes

The example sets the Adopter role with `engine.editor.setRole(_:)` before creating the template's content. Under the Adopter role, the engine enforces editing scopes and defers scope decisions to each block's own settings, so the block-level constraints configured below take effect.

## Text Variables

Text variables enable data-driven text personalization. Define variables using `engine.variable.set(key:value:)`, then reference them in text blocks with `{{variableName}}` tokens.

```swift highlight-dynamicContent-textVariables
  try engine.variable.set(key: "firstName", value: "Jane")
  try engine.variable.set(key: "lastName", value: "Doe")
  try engine.variable.set(key: "companyName", value: "IMG.LY")

  // Create heading with variable tokens
  let headingText = try engine.block.create(.text)
  try engine.block.replaceText(
    headingText,
    text: "Welcome to {{companyName}}, {{firstName}} {{lastName}}.",
  )

  // Discover all variables in the scene
  let allVariables = engine.variable.findAll()
  print("Variables in scene:", allVariables)
```

Variables are defined globally and can be referenced in any text block. The `findAll()` method returns all variable keys in the scene, useful for building dynamic editing interfaces. Read a variable's current value with `engine.variable.get(key:)`.

> **Note:** Variable keys are case-sensitive. `{{Name}}` and `{{name}}` are different variables.

## Placeholders

Placeholders turn design blocks into drop zones for swappable media. Mark an image block as a placeholder, and users can replace its content while the surrounding design remains fixed.

```swift highlight-dynamicContent-placeholders
  // Enable placeholder behavior on the image fill
  let fill = try engine.block.getFill(heroImage)
  if try engine.block.supportsPlaceholderBehavior(fill) {
    try engine.block.setPlaceholderBehaviorEnabled(fill, enabled: true)
  }

  // Enable user interaction and visual controls on the block
  try engine.block.setPlaceholderEnabled(heroImage, enabled: true)
  if try engine.block.supportsPlaceholderControls(heroImage) {
    try engine.block.setPlaceholderControlsOverlayEnabled(heroImage, enabled: true)
    try engine.block.setPlaceholderControlsButtonEnabled(heroImage, enabled: true)
  }

  // Find all placeholders in the scene
  let placeholders = engine.block.findAllPlaceholders()
  print("Placeholders in scene:", placeholders.count)
```

For a graphic block, placeholder behavior is a property of its fill: retrieve the fill with `getFill(_:)`, then query support and enable the behavior on that fill. The interactive placeholder flag and the visual controls apply to the block itself — enable user interaction with `setPlaceholderEnabled(_:enabled:)`, and configure the overlay and replace button separately via `setPlaceholderControlsOverlayEnabled(_:enabled:)` and `setPlaceholderControlsButtonEnabled(_:enabled:)`.

## Editing Constraints

Editing constraints protect design integrity by limiting what users can modify. Use scope-based APIs to lock specific properties while keeping others editable.

```swift highlight-dynamicContent-editingConstraints
  // Lock the brand image: prevent moving, resizing, and selection
  try engine.block.setScopeEnabled(brandImage, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(brandImage, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(brandImage, key: "editor/select", enabled: false)

  // Verify constraints are applied
  let canSelect = try engine.block.isScopeEnabled(brandImage, key: "editor/select")
  let canMove = try engine.block.isScopeEnabled(brandImage, key: "layer/move")
  print("Brand image - canSelect:", canSelect, "canMove:", canMove)
```

The `setScopeEnabled(_:key:enabled:)` method controls individual properties. Setting `"editor/select"` to `false` prevents users from selecting the block entirely, making it completely non-interactive. Combined with `"layer/move"` and `"layer/resize"`, this creates a fully protected element.

## Choosing the Right Capability

| Need | Capability |
| --- | --- |
| Dynamic text content | Text Variables |
| Swappable images/videos | Placeholders |
| Lock specific properties | Editing Constraints |

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.setRole(_:)` | Set user role (Creator, Adopter, Viewer, Presenter) |
| `engine.variable.findAll()` | Get all variable keys in the scene |
| `engine.variable.set(key:value:)` | Create or update a text variable |
| `engine.variable.get(key:)` | Read a variable's current value |
| `engine.block.getFill(_:)` | Get the fill that carries a graphic block's placeholder behavior |
| `engine.block.supportsPlaceholderBehavior(_:)` | Check placeholder support |
| `engine.block.setPlaceholderBehaviorEnabled(_:enabled:)` | Enable placeholder behavior |
| `engine.block.setPlaceholderEnabled(_:enabled:)` | Enable user interaction |
| `engine.block.findAllPlaceholders()` | Find all placeholder blocks |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Enable or disable editing scope |
| `engine.block.isScopeEnabled(_:key:)` | Query scope state |

## Next Steps

Each capability has a dedicated deep-dive guide:

- [Text Variables](./add-dynamic-content/text-variables.md) - Personalize text with tokens resolved at runtime
- [Placeholders](./add-dynamic-content/placeholders.md) - Mark image, video, or text blocks as swappable drop zones
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Lock specific properties with scope-based permissions
- [Form-Based Editing](./add-dynamic-content/form-based-editing.md) - Build custom form interfaces to drive template customization



---

## Related Pages

- [Text Variables](./add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values at runtime.
- [Placeholders](./add-dynamic-content/placeholders.md) - Use placeholders to mark editable image, video, or text areas within a locked template layout.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Control editing capabilities in CE.SDK templates with the Scope system to lock positions, prevent transformations, and build guided editing experiences in Swift.
- [Form-Based Editing](./add-dynamic-content/form-based-editing.md) - Build custom form interfaces for template customization using CE.SDK variables and placeholders.


---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support