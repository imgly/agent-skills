> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Create From Scratch](./from-scratch.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-templates-from-scratch/CreateTemplateFromScratch.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createTemplateFromScratch(engine: Engine) async throws {
  // Resolve sample assets (fonts, image) against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.create(designUnit: .px, fontSizeUnit: .px)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 1000)
  try engine.block.appendChild(to: scene, child: page)

  let backgroundFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    backgroundFill,
    property: "fill/color/value",
    color: .rgba(r: 0.98, g: 0.98, b: 0.99, a: 1),
  )
  try engine.block.setFill(page, fill: backgroundFill)

  let brandTypeface = Typeface(
    name: "Brand Sans",
    fonts: [
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
    ],
  )
  let brandRegularFont = brandTypeface.fonts[0]

  let headline = try engine.block.create(.text)
  try engine.block.replaceText(headline, text: "{{title}}")
  try engine.block.setFont(headline, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(headline, fontSize: 72)
  try engine.block.setTextColor(headline, color: .rgba(r: 0.09, g: 0.09, b: 0.09, a: 1))
  try engine.block.setPositionX(headline, value: 72)
  try engine.block.setPositionY(headline, value: 96)
  try engine.block.setWidth(headline, value: 656)
  try engine.block.setHeightMode(headline, mode: .auto)
  try engine.block.appendChild(to: page, child: headline)

  let subtitle = try engine.block.create(.text)
  try engine.block.replaceText(subtitle, text: "{{subtitle}}")
  try engine.block.setFont(subtitle, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(subtitle, fontSize: 32)
  try engine.block.setTextColor(subtitle, color: .rgba(r: 0.32, g: 0.32, b: 0.32, a: 1))
  try engine.block.setPositionX(subtitle, value: 72)
  try engine.block.setPositionY(subtitle, value: 194)
  try engine.block.setWidth(subtitle, value: 620)
  try engine.block.setHeightMode(subtitle, mode: .auto)
  try engine.block.appendChild(to: page, child: subtitle)

  let cta = try engine.block.create(.text)
  try engine.block.replaceText(cta, text: "{{cta}}")
  try engine.block.setFont(cta, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(cta, fontSize: 36)
  try engine.block.setTextColor(cta, color: .rgba(r: 0.09, g: 0.09, b: 0.09, a: 1))
  try engine.block.setPositionX(cta, value: 72)
  try engine.block.setPositionY(cta, value: 858)
  try engine.block.setWidth(cta, value: 400)
  try engine.block.setHeightMode(cta, mode: .auto)
  try engine.block.appendChild(to: page, child: cta)

  try engine.variable.set(key: "title", value: "Summer Sale")
  try engine.variable.set(key: "subtitle", value: "Up to 50% off all items")
  try engine.variable.set(key: "cta", value: "Learn More")

  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setName(imageBlock, name: "hero-image")
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(imageBlock, value: 72)
  try engine.block.setPositionY(imageBlock, value: 300)
  try engine.block.setWidth(imageBlock, value: 656)
  try engine.block.setHeight(imageBlock, value: 500)
  try engine.block.setContentFillMode(imageBlock, mode: .cover)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)

  let placeholderFill = try engine.block.getFill(imageBlock)
  if try engine.block.supportsPlaceholderBehavior(placeholderFill) {
    try engine.block.setPlaceholderBehaviorEnabled(placeholderFill, enabled: true)
  }

  try engine.block.setPlaceholderEnabled(imageBlock, enabled: true)
  if try engine.block.supportsPlaceholderControls(imageBlock) {
    try engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, enabled: true)
    try engine.block.setPlaceholderControlsButtonEnabled(imageBlock, enabled: true)
  }

  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)

  for block in [headline, subtitle, cta, imageBlock] {
    try engine.block.setScopeEnabled(block, key: "layer/move", enabled: false)
    try engine.block.setScopeEnabled(block, key: "layer/resize", enabled: false)
  }
  try engine.block.setScopeEnabled(imageBlock, key: "fill/change", enabled: true)

  let imageCanMove = try engine.block.isAllowedByScope(imageBlock, key: "layer/move")
  let imageFillCanChange = try engine.block.isAllowedByScope(imageBlock, key: "fill/change")
  print("Image can move:", imageCanMove, "— fill can change:", imageFillCanChange)

  // Most-evolved scene — the finished promotional card, promoted to the guide's hero image.
  try await engine.captureGuide(page, label: "hero")

  try await engine.block.forceLoadResources([page])
  let templateString = try await engine.scene.saveToString()
  let templateArchive = try await engine.scene.saveToArchive()
  print("Template string characters:", templateString.count)
  print("Template archive bytes:", templateArchive.count)
}
```

Build reusable design templates entirely through code for automation, batch
generation, and custom template creation tools.

![A promotional card template with the "Summer Sale" headline above the "Up to 50% off all items" subtitle, a swappable hero image, and a "Learn More" call to action.](https://img.ly/docs/cesdk/ios/create-templates/from-scratch-663cda/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-create-templates-from-scratch)

<EngineReferenceNote {...props} />

CE.SDK lets you create a template without starting from an existing scene. You define the page size, add text and graphic blocks, bind text variables, mark media as a placeholder, restrict editing with scopes, and save the result for reuse.

This guide builds a promotional card template with variable-driven text and one swappable image area. The sample assumes an existing `Engine` instance and focuses on the scene and block APIs that assemble the reusable template.

## Create a Blank Scene

Create the scene with pixel units for layout and text sizing, add a page, and define the template canvas size. Pairing the design unit with a matching font-size unit keeps `setTextFontSize` values in pixels.

```swift highlight-createTemplateFromScratch-createScene
  let scene = try engine.scene.create(designUnit: .px, fontSizeUnit: .px)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 1000)
  try engine.block.appendChild(to: scene, child: page)
```

## Set Page Background

Use a color fill for the page background so every generated template starts from the same base appearance.

```swift highlight-createTemplateFromScratch-addBackground
let backgroundFill = try engine.block.createFill(.color)
try engine.block.setColor(
  backgroundFill,
  property: "fill/color/value",
  color: .rgba(r: 0.98, g: 0.98, b: 0.99, a: 1),
)
try engine.block.setFill(page, fill: backgroundFill)
```

The fill stores the color value, and `setFill` assigns that fill to the page.

## Add Text Blocks

Text blocks hold the template copy. The sample uses a bundled font, variable tokens for dynamic content, and fixed positions so the layout stays predictable.

```swift highlight-createTemplateFromScratch-addText
  let brandTypeface = Typeface(
    name: "Brand Sans",
    fonts: [
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
      Font(
        uri: baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
    ],
  )
  let brandRegularFont = brandTypeface.fonts[0]

  let headline = try engine.block.create(.text)
  try engine.block.replaceText(headline, text: "{{title}}")
  try engine.block.setFont(headline, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(headline, fontSize: 72)
  try engine.block.setTextColor(headline, color: .rgba(r: 0.09, g: 0.09, b: 0.09, a: 1))
  try engine.block.setPositionX(headline, value: 72)
  try engine.block.setPositionY(headline, value: 96)
  try engine.block.setWidth(headline, value: 656)
  try engine.block.setHeightMode(headline, mode: .auto)
  try engine.block.appendChild(to: page, child: headline)

  let subtitle = try engine.block.create(.text)
  try engine.block.replaceText(subtitle, text: "{{subtitle}}")
  try engine.block.setFont(subtitle, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(subtitle, fontSize: 32)
  try engine.block.setTextColor(subtitle, color: .rgba(r: 0.32, g: 0.32, b: 0.32, a: 1))
  try engine.block.setPositionX(subtitle, value: 72)
  try engine.block.setPositionY(subtitle, value: 194)
  try engine.block.setWidth(subtitle, value: 620)
  try engine.block.setHeightMode(subtitle, mode: .auto)
  try engine.block.appendChild(to: page, child: subtitle)

  let cta = try engine.block.create(.text)
  try engine.block.replaceText(cta, text: "{{cta}}")
  try engine.block.setFont(cta, fontFileURL: brandRegularFont.uri, typeface: brandTypeface)
  try engine.block.setTextFontSize(cta, fontSize: 36)
  try engine.block.setTextColor(cta, color: .rgba(r: 0.09, g: 0.09, b: 0.09, a: 1))
  try engine.block.setPositionX(cta, value: 72)
  try engine.block.setPositionY(cta, value: 858)
  try engine.block.setWidth(cta, value: 400)
  try engine.block.setHeightMode(cta, mode: .auto)
  try engine.block.appendChild(to: page, child: cta)
```

Each text block is appended to the page after its content, typography, position, and sizing are configured. Setting the height mode to `.auto` lets a block grow to fit its resolved text.

## Add Text Variables

Variables populate the `{{title}}`, `{{subtitle}}`, and `{{cta}}` tokens in the text blocks. Set defaults while authoring the template so the design has meaningful preview content.

```swift highlight-createTemplateFromScratch-addVariables
  try engine.variable.set(key: "title", value: "Summer Sale")
  try engine.variable.set(key: "subtitle", value: "Up to 50% off all items")
  try engine.variable.set(key: "cta", value: "Learn More")

  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)
```

When your app applies the template later, call `engine.variable.set(key:value:)` again with the runtime values. `engine.variable.findAll()` returns the keys currently registered in the scene.

## Add Graphic Blocks

Graphic blocks are the image containers in the template. Give the image block a name so your app can find it later, then assign a rectangle shape and image fill.

```swift highlight-createTemplateFromScratch-addGraphic
  let imageBlock = try engine.block.create(.graphic)
  try engine.block.setName(imageBlock, name: "hero-image")
  try engine.block.setShape(imageBlock, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(imageBlock, value: 72)
  try engine.block.setPositionY(imageBlock, value: 300)
  try engine.block.setWidth(imageBlock, value: 656)
  try engine.block.setHeight(imageBlock, value: 500)
  try engine.block.setContentFillMode(imageBlock, mode: .cover)

  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.appendChild(to: page, child: imageBlock)
```

`setContentFillMode(_:mode:)` set to `.cover` crops the image to fill its bounds. The sample resolves a bundled sample image; in your app, use a stable local or remote URL that can be resolved when the template is loaded.

## Configure Placeholders

Placeholder behavior makes the image fill act as swappable content, while placeholder controls let a CE.SDK editor present the block as an interactive drop zone.

```swift highlight-createTemplateFromScratch-configurePlaceholder
  let placeholderFill = try engine.block.getFill(imageBlock)
  if try engine.block.supportsPlaceholderBehavior(placeholderFill) {
    try engine.block.setPlaceholderBehaviorEnabled(placeholderFill, enabled: true)
  }

  try engine.block.setPlaceholderEnabled(imageBlock, enabled: true)
  if try engine.block.supportsPlaceholderControls(imageBlock) {
    try engine.block.setPlaceholderControlsOverlayEnabled(imageBlock, enabled: true)
    try engine.block.setPlaceholderControlsButtonEnabled(imageBlock, enabled: true)
  }
```

Placeholder behavior lives on the fill, so enable it on the fill returned by `getFill(_:)`. Placeholder interaction and controls live on the graphic block itself. Guard the control calls with `supportsPlaceholderControls(_:)` so they only run on blocks that support them.

## Apply Editing Constraints

Scopes protect the layout while keeping the image content replaceable. Defer the relevant global scopes to the block level, then disable movement and resizing on the template elements.

```swift highlight-createTemplateFromScratch-applyConstraints
  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)

  for block in [headline, subtitle, cta, imageBlock] {
    try engine.block.setScopeEnabled(block, key: "layer/move", enabled: false)
    try engine.block.setScopeEnabled(block, key: "layer/resize", enabled: false)
  }
  try engine.block.setScopeEnabled(imageBlock, key: "fill/change", enabled: true)

  let imageCanMove = try engine.block.isAllowedByScope(imageBlock, key: "layer/move")
  let imageFillCanChange = try engine.block.isAllowedByScope(imageBlock, key: "fill/change")
  print("Image can move:", imageCanMove, "— fill can change:", imageFillCanChange)
```

Deferring a global scope tells the engine to consult each block's own setting for that capability. The image block keeps `fill/change` enabled so users or automation can replace the image without moving the placeholder. `isAllowedByScope(_:key:)` returns the effective permission after resolving both the global and block-level settings. For the full scope and role model, see [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md).

## Save the Template

Save the finished scene as a string when its assets stay externally resolvable, or as an archive when you need a portable package with the assets bundled in.

```swift highlight-createTemplateFromScratch-saveTemplate
try await engine.block.forceLoadResources([page])
let templateString = try await engine.scene.saveToString()
let templateArchive = try await engine.scene.saveToArchive()
print("Template string characters:", templateString.count)
print("Template archive bytes:", templateArchive.count)
```

`forceLoadResources(_:)` ensures referenced assets are loaded before saving. `saveToString()` is compact and works well for templates stored alongside stable asset URLs. `saveToArchive()` returns a ZIP archive that bundles the assets the engine can access at save time.

## Troubleshooting

**Blocks do not appear**: Verify that every page, text block, and graphic block is attached with `appendChild(to:child:)`.

**Variables do not resolve**: Check that each text token uses the same key as `engine.variable.set(key:value:)`, including the double curly braces in the text.

**The placeholder is not swappable**: Enable placeholder behavior on the fill returned by `getFill(_:)`, not on the graphic block, and enable placeholder interaction on the block.

**Constraints are not enforced**: Defer the relevant global scope with `setGlobalScope(key:value:)` set to `.defer` before applying block-level scope settings.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.create(designUnit:fontSizeUnit:)` | Create the empty template scene with pixel measurements and pixel text sizing. |
| `engine.block.create(_:)` | Create a page, text, or graphic block. |
| `engine.block.setWidth(_:value:)` | Set page or block width. |
| `engine.block.setHeight(_:value:)` | Set page or block height. |
| `engine.block.setHeightMode(_:mode:)` | Let a text block's height fit its content with `.auto`. |
| `engine.block.setPositionX(_:value:)` | Set a block's horizontal position. |
| `engine.block.setPositionY(_:value:)` | Set a block's vertical position. |
| `engine.block.appendChild(to:child:)` | Add a page or block to the scene hierarchy. |
| `engine.block.createFill(_:)` | Create a color or image fill. |
| `engine.block.setColor(_:property:color:)` | Set the background fill color. |
| `engine.block.setFill(_:fill:)` | Assign a fill to a page or graphic block. |
| `engine.block.getFill(_:)` | Read the fill block attached to a graphic block. |
| `engine.block.replaceText(_:text:)` | Set text block content. |
| `engine.block.setFont(_:fontFileURL:typeface:)` | Apply a typeface to a text block. |
| `engine.block.setTextFontSize(_:fontSize:)` | Set text size. |
| `engine.block.setTextColor(_:color:)` | Set text color. |
| `engine.variable.set(key:value:)` | Set a text variable value. |
| `engine.variable.findAll()` | Read the variable keys registered in the scene. |
| `engine.block.setName(_:name:)` | Name a block for later lookup. |
| `engine.block.createShape(_:)` | Create a rectangular shape for the graphic block. |
| `engine.block.setShape(_:shape:)` | Assign the shape to the graphic block. |
| `engine.block.setContentFillMode(_:mode:)` | Crop the image to cover its placeholder bounds with `.cover`. |
| `engine.block.setURL(_:property:value:)` | Set the image URL on the image fill. |
| `engine.block.supportsPlaceholderBehavior(_:)` | Check whether the fill supports placeholder behavior. |
| `engine.block.setPlaceholderBehaviorEnabled(_:enabled:)` | Enable placeholder behavior on the fill. |
| `engine.block.setPlaceholderEnabled(_:enabled:)` | Enable placeholder interaction on the graphic block. |
| `engine.block.supportsPlaceholderControls(_:)` | Check whether the graphic block supports placeholder controls. |
| `engine.block.setPlaceholderControlsOverlayEnabled(_:enabled:)` | Show the placeholder overlay. |
| `engine.block.setPlaceholderControlsButtonEnabled(_:enabled:)` | Show the placeholder action button. |
| `engine.editor.setGlobalScope(key:value:)` | Defer a scope to block-level settings with `.defer`. |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Allow or deny a scope on one block. |
| `engine.block.isAllowedByScope(_:key:)` | Read the effective permission for a scope on a block. |
| `engine.block.forceLoadResources(_:)` | Ensure referenced assets are loaded before saving. |
| `engine.scene.saveToString()` | Serialize the template scene as a string. |
| `engine.scene.saveToArchive()` | Save the template scene and accessible assets as an archive. |

## Next Steps

- [Placeholders](./add-dynamic-content/placeholders.md) - Configure placeholder behavior and visual controls in depth.
- [Text Variables](./add-dynamic-content/text-variables.md) - Implement dynamic text personalization with variables.
- [Set Editing Constraints](./add-dynamic-content/set-editing-constraints.md) - Lock layout properties to protect design integrity.
- [Add to Template Library](./add-to-template-library.md) - Save and organize templates in an asset source for users to browse and apply.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support