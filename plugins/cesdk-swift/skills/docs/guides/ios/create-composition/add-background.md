> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Add a Background](./add-background.md)

---

```swift file=@cesdk_swift_examples/engine-guides-add-background/AddBackground.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addBackground(engine: Engine) async throws {
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  if try engine.block.supportsFill(page) {
    let gradientFill = try engine.block.createFill(.linearGradient)
    try engine.block.setGradientColorStops(gradientFill, property: "fill/gradient/colors", colors: [
      GradientColorStop(color: .rgba(r: 0.85, g: 0.75, b: 0.95, a: 1.0), stop: 0),
      GradientColorStop(color: .rgba(r: 0.7, g: 0.9, b: 0.95, a: 1.0), stop: 1),
    ])
    try engine.block.setFill(page, fill: gradientFill)
  }

  // Create a text block to demonstrate background color
  let textBlock = try engine.block.create(.text)
  try engine.block.setString(textBlock, property: "text/text", value: "Backgrounds")
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 48)
  try engine.block.setWidth(textBlock, value: 280)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setPositionX(textBlock, value: 66)
  try engine.block.setPositionY(textBlock, value: 280)
  try engine.block.appendChild(to: page, child: textBlock)

  if try engine.block.supportsBackgroundColor(textBlock) {
    try engine.block.setBackgroundColorEnabled(textBlock, enabled: true)
    try engine.block.setColor(
      textBlock,
      property: "backgroundColor/color",
      color: .rgba(r: 1.0, g: 1.0, b: 1.0, a: 1.0),
    )
    try engine.block.setFloat(textBlock, property: "backgroundColor/paddingLeft", value: 16)
    try engine.block.setFloat(textBlock, property: "backgroundColor/paddingRight", value: 16)
    try engine.block.setFloat(textBlock, property: "backgroundColor/paddingTop", value: 10)
    try engine.block.setFloat(textBlock, property: "backgroundColor/paddingBottom", value: 10)
    try engine.block.setFloat(textBlock, property: "backgroundColor/cornerRadius", value: 8)
  }

  // Create a graphic block to demonstrate image fill on a shape
  let baseURL = try engine.guidesBaseURL
  let imageBlock = try engine.block.create(.graphic)
  let rectShape = try engine.block.createShape(.rect)
  try engine.block.setShape(imageBlock, shape: rectShape)
  try engine.block.setWidth(imageBlock, value: 340)
  try engine.block.setHeight(imageBlock, value: 400)
  try engine.block.setPositionX(imageBlock, value: 420)
  try engine.block.setPositionY(imageBlock, value: 100)
  try engine.block.appendChild(to: page, child: imageBlock)

  if try engine.block.supportsFill(imageBlock) {
    let imageFill = try engine.block.createFill(.image)
    try engine.block.setURL(
      imageFill,
      property: "fill/image/imageFileURI",
      value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    )
    try engine.block.setFill(imageBlock, fill: imageFill)
  }

  let pageSupportsFill = try engine.block.supportsFill(page) // true
  let textSupportsBackground = try engine.block.supportsBackgroundColor(textBlock) // true
  let imageSupportsFill = try engine.block.supportsFill(imageBlock) // true
}
```

Add backgrounds to designs using fills for pages and shapes, and the background color property for text blocks.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260831/engine-guides-add-background)

CE.SDK provides two distinct approaches for adding backgrounds to design elements. Understanding when to use each approach ensures your designs render correctly and efficiently.

## Setup

Create a scene with a page where we'll apply backgrounds.

```swift highlight-addBackground-setup
  let scene = try engine.scene.create()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)
```

## Fills

Fills are visual content applied to pages and graphic blocks. Supported fill types include solid colors, linear gradients, radial gradients, and images.

### Check Fill Support

Before applying a fill, verify the block supports it with `supportsFill(_:)`. Pages and graphic blocks typically support fills, while text blocks handle their content differently.

Use `supportsBackgroundColor(_:)` for the dedicated background color property available on text blocks.

### Apply a Gradient Fill

Create a fill with `createFill(_:)` specifying the type, configure its color stops, then apply it with `setFill(_:fill:)`. The example below creates a linear gradient with two color stops transitioning from pastel purple to light cyan.

```swift highlight-addBackground-pageFill
if try engine.block.supportsFill(page) {
  let gradientFill = try engine.block.createFill(.linearGradient)
  try engine.block.setGradientColorStops(gradientFill, property: "fill/gradient/colors", colors: [
    GradientColorStop(color: .rgba(r: 0.85, g: 0.75, b: 0.95, a: 1.0), stop: 0),
    GradientColorStop(color: .rgba(r: 0.7, g: 0.9, b: 0.95, a: 1.0), stop: 1),
  ])
  try engine.block.setFill(page, fill: gradientFill)
}
```

### Apply an Image Fill

Image fills display images within the block's shape bounds. Create an image fill, set its URI, and apply it to a graphic block.

```swift highlight-addBackground-shapeFill
if try engine.block.supportsFill(imageBlock) {
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(imageBlock, fill: imageFill)
}
```

Image fills automatically scale to cover the shape area.

## Background Color

Background color is a dedicated property available specifically on text blocks. Unlike fills, background colors include configurable padding and corner radius, creating highlighted text effects without additional graphic blocks.

### Apply Background Color

Enable the background color with `setBackgroundColorEnabled(_:enabled:)`, then configure its appearance using property paths for color, padding, and corner radius.

```swift highlight-addBackground-backgroundColor
if try engine.block.supportsBackgroundColor(textBlock) {
  try engine.block.setBackgroundColorEnabled(textBlock, enabled: true)
  try engine.block.setColor(
    textBlock,
    property: "backgroundColor/color",
    color: .rgba(r: 1.0, g: 1.0, b: 1.0, a: 1.0),
  )
  try engine.block.setFloat(textBlock, property: "backgroundColor/paddingLeft", value: 16)
  try engine.block.setFloat(textBlock, property: "backgroundColor/paddingRight", value: 16)
  try engine.block.setFloat(textBlock, property: "backgroundColor/paddingTop", value: 10)
  try engine.block.setFloat(textBlock, property: "backgroundColor/paddingBottom", value: 10)
  try engine.block.setFloat(textBlock, property: "backgroundColor/cornerRadius", value: 8)
}
```

The padding properties (`backgroundColor/paddingLeft`, `backgroundColor/paddingRight`, `backgroundColor/paddingTop`, `backgroundColor/paddingBottom`) control the space between the text and the background edge. The `backgroundColor/cornerRadius` property rounds the corners.

## Check Feature Support

Use `supportsFill(_:)` to check whether a block supports fills, and `supportsBackgroundColor(_:)` to check whether a block supports the background color property. Always verify support before calling related APIs.

```swift highlight-addBackground-checkSupport
let pageSupportsFill = try engine.block.supportsFill(page) // true
let textSupportsBackground = try engine.block.supportsBackgroundColor(textBlock) // true
let imageSupportsFill = try engine.block.supportsFill(imageBlock) // true
```

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsFill(_:)` | Check if a block supports fills |
| `engine.block.createFill(_:)` | Create a fill (color, linearGradient, radialGradient, image) |
| `engine.block.setFill(_:fill:)` | Apply a fill to a block |
| `engine.block.getFill(_:)` | Get the fill applied to a block |
| `engine.block.setGradientColorStops(_:property:colors:)` | Set gradient color stops |
| `engine.block.supportsBackgroundColor(_:)` | Check if a block supports background color |
| `engine.block.setBackgroundColorEnabled(_:enabled:)` | Enable or disable background color |
| `engine.block.isBackgroundColorEnabled(_:)` | Check if background color is enabled |
| `engine.block.setColor(_:property:color:)` | Set color properties |
| `engine.block.setFloat(_:property:value:)` | Set float properties (padding, radius) |

## Next Steps

- [Apply Colors](../colors/apply.md) — Work with RGB, CMYK, and spot colors
- [Fills Overview](../fills/overview.md) — Learn about all fill types in depth



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support