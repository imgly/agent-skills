> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Compositions](../create-composition.md) > [Programmatic Creation](./programmatic.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-composition-programmatic/CreateCompositionProgrammatic.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createCompositionProgrammatic(engine: Engine) async throws {
  // Resolve sample assets against the configured base URL (engine `basePath`,
  // or the product CDN as a fallback).
  let baseURL = try engine.guidesBaseURL

  // Roboto typeface with all variants for mixed styling
  let robotoBase = baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto")
  let robotoTypeface = Typeface(
    name: "Roboto",
    fonts: [
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-Italic.ttf"),
        subFamily: "Italic",
        weight: .normal,
        style: .italic,
      ),
      Font(
        uri: robotoBase.appendingPathComponent("Roboto-BoldItalic.ttf"),
        subFamily: "Bold Italic",
        weight: .bold,
        style: .italic,
      ),
    ],
  )

  // Create a scene and a page with social media dimensions (1080x1080)
  let scene = try engine.scene.create()
  try engine.block.setFloat(scene, property: "scene/dpi", value: 300)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  // Set page background to a light lavender color
  let backgroundFill = try engine.block.createFill(.color)
  try engine.block.setColor(
    backgroundFill,
    property: "fill/color/value",
    color: .rgba(r: 0.94, g: 0.93, b: 0.98, a: 1.0),
  )
  try engine.block.setFill(page, fill: backgroundFill)

  // Add the main headline text with the Roboto typeface
  let headline = try engine.block.create(.text)
  try engine.block.replaceText(headline, text: "Integrate\nCreative Editing\ninto your App")
  try engine.block.setFont(headline, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
  try engine.block.setFloat(headline, property: "text/lineHeight", value: 0.78)

  // Apply bold weight and a black color to the whole headline
  if try engine.block.canToggleBoldFont(headline) {
    try engine.block.toggleBoldFont(headline)
  }
  try engine.block.setTextColor(headline, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))

  // Fix the container size and let the font scale automatically
  try engine.block.setWidthMode(headline, mode: .absolute)
  try engine.block.setHeightMode(headline, mode: .absolute)
  try engine.block.setWidth(headline, value: 960)
  try engine.block.setHeight(headline, value: 300)
  try engine.block.setBool(headline, property: "text/automaticFontSizeEnabled", value: true)

  try engine.block.setPositionX(headline, value: 60)
  try engine.block.setPositionY(headline, value: 80)
  try engine.block.appendChild(to: page, child: headline)

  // Add the tagline with mixed per-range styling
  let tagline = try engine.block.create(.text)
  let taglineText = "in hours,\nnot months."
  try engine.block.replaceText(tagline, text: taglineText)
  try engine.block.setFont(tagline, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
  try engine.block.setFloat(tagline, property: "text/lineHeight", value: 0.78)

  // Style "in hours," — purple and italic
  let inHoursRange = taglineText.range(of: "in hours,")!
  try engine.block.setTextColor(tagline, color: .rgba(r: 0.2, g: 0.2, b: 0.8, a: 1.0), in: inHoursRange)
  if try engine.block.canToggleItalicFont(tagline, in: inHoursRange) {
    try engine.block.toggleItalicFont(tagline, in: inHoursRange)
  }

  // Style "not months." — black and bold
  let notMonthsRange = taglineText.range(of: "not months.")!
  try engine.block.setTextColor(tagline, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0), in: notMonthsRange)
  if try engine.block.canToggleBoldFont(tagline, in: notMonthsRange) {
    try engine.block.toggleBoldFont(tagline, in: notMonthsRange)
  }

  try engine.block.setWidthMode(tagline, mode: .absolute)
  try engine.block.setHeightMode(tagline, mode: .absolute)
  try engine.block.setWidth(tagline, value: 960)
  try engine.block.setHeight(tagline, value: 220)
  try engine.block.setBool(tagline, property: "text/automaticFontSizeEnabled", value: true)
  try engine.block.setPositionX(tagline, value: 60)
  try engine.block.setPositionY(tagline, value: 551)
  try engine.block.appendChild(to: page, child: tagline)

  // Add the CTA title with an explicit font size
  let ctaTitle = try engine.block.create(.text)
  try engine.block.replaceText(ctaTitle, text: "Start a Free Trial")
  try engine.block.setFont(ctaTitle, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
  try engine.block.setFloat(ctaTitle, property: "text/fontSize", value: 80)
  try engine.block.setFloat(ctaTitle, property: "text/lineHeight", value: 1.0)

  if try engine.block.canToggleBoldFont(ctaTitle) {
    try engine.block.toggleBoldFont(ctaTitle)
  }
  try engine.block.setTextColor(ctaTitle, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))

  try engine.block.setWidthMode(ctaTitle, mode: .absolute)
  try engine.block.setHeightMode(ctaTitle, mode: .auto)
  try engine.block.setWidth(ctaTitle, value: 664.6)
  try engine.block.setPositionX(ctaTitle, value: 64)
  try engine.block.setPositionY(ctaTitle, value: 952)
  try engine.block.appendChild(to: page, child: ctaTitle)

  // Add the website URL
  let ctaURL = try engine.block.create(.text)
  try engine.block.replaceText(ctaURL, text: "www.img.ly")
  try engine.block.setFont(ctaURL, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
  try engine.block.setFloat(ctaURL, property: "text/fontSize", value: 80)
  try engine.block.setFloat(ctaURL, property: "text/lineHeight", value: 1.0)
  try engine.block.setTextColor(ctaURL, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))

  try engine.block.setWidthMode(ctaURL, mode: .absolute)
  try engine.block.setHeightMode(ctaURL, mode: .auto)
  try engine.block.setWidth(ctaURL, value: 664.6)
  try engine.block.setPositionX(ctaURL, value: 64)
  try engine.block.setPositionY(ctaURL, value: 1006)
  try engine.block.appendChild(to: page, child: ctaURL)

  // Add a horizontal divider line
  let dividerLine = try engine.block.create(.graphic)
  let lineShape = try engine.block.createShape(.line)
  try engine.block.setShape(dividerLine, shape: lineShape)

  let lineFill = try engine.block.createFill(.color)
  try engine.block.setColor(lineFill, property: "fill/color/value", color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))
  try engine.block.setFill(dividerLine, fill: lineFill)

  try engine.block.setWidth(dividerLine, value: 418)
  try engine.block.setHeight(dividerLine, value: 11.3)
  try engine.block.setPositionX(dividerLine, value: 64)
  try engine.block.setPositionY(dividerLine, value: 460)
  try engine.block.appendChild(to: page, child: dividerLine)

  // Add the IMG.LY logo image
  let logo = try engine.block.create(.graphic)
  let logoShape = try engine.block.createShape(.rect)
  try engine.block.setShape(logo, shape: logoShape)

  let logoFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    logoFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(logo, fill: logoFill)

  try engine.block.setContentFillMode(logo, mode: .contain)
  try engine.block.setWidth(logo, value: 200)
  try engine.block.setHeight(logo, value: 65)
  try engine.block.setPositionX(logo, value: 820)
  try engine.block.setPositionY(logo, value: 960)
  try engine.block.appendChild(to: page, child: logo)

  // Export the composition as a PNG
  let options = ExportOptions(targetWidth: 1080, targetHeight: 1080)
  let blob = try await engine.block.export(page, mimeType: .png, options: options)

  // Write the exported data to disk
  let outputURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("composition.png")
  try blob.write(to: outputURL)
}
```

Build compositions entirely through code using the CE.SDK Engine for automation, batch processing, and headless rendering.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260821/engine-guides-create-composition-programmatic)

CE.SDK provides a complete Engine API for building designs through code. Instead of relying on user interactions through an editor UI, you can create scenes, add blocks like text, images, and shapes, and position them programmatically. This approach enables automation workflows, batch processing, server-side rendering, and integration with custom interfaces.

This guide covers how to create a scene structure with social media dimensions, set background colors, add text with mixed styling, line shapes, images, and export the finished composition.

## Initialize the Engine

We start by declaring a Roboto typeface that includes all variants needed for mixed styling. Setting up the typeface up front means later code can toggle bold or italic without reconfiguring fonts.

```swift highlight-setup
// Roboto typeface with all variants for mixed styling
let robotoBase = baseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto")
let robotoTypeface = Typeface(
  name: "Roboto",
  fonts: [
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Regular.ttf"),
      subFamily: "Regular",
      weight: .normal,
      style: .normal,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Bold.ttf"),
      subFamily: "Bold",
      weight: .bold,
      style: .normal,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-Italic.ttf"),
      subFamily: "Italic",
      weight: .normal,
      style: .italic,
    ),
    Font(
      uri: robotoBase.appendingPathComponent("Roboto-BoldItalic.ttf"),
      subFamily: "Bold Italic",
      weight: .bold,
      style: .italic,
    ),
  ],
)
```

The Engine is created once by the caller (for example `try Engine(license: "<your license key>")`) and passed to the function that builds the composition.

## Create Scene Structure

We create the foundation of the composition with social media dimensions (1080x1080 pixels for Instagram). A scene contains one or more pages, and pages contain the design blocks.

```swift highlight-create-scene
  // Create a scene and a page with social media dimensions (1080x1080)
  let scene = try engine.scene.create()
  try engine.block.setFloat(scene, property: "scene/dpi", value: 300)

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)
```

`engine.scene.create()` returns a scene handle. Create a page with `engine.block.create(.page)`, set its dimensions with `setWidth()` and `setHeight()`, then attach it to the scene with `appendChild(to:child:)`.

## Set Page Background

We set the page background using a color fill. This demonstrates how to create and assign fills to blocks.

```swift highlight-add-background
// Set page background to a light lavender color
let backgroundFill = try engine.block.createFill(.color)
try engine.block.setColor(
  backgroundFill,
  property: "fill/color/value",
  color: .rgba(r: 0.94, g: 0.93, b: 0.98, a: 1.0),
)
try engine.block.setFill(page, fill: backgroundFill)
```

We create a color fill using `createFill(.color)`, set the color via `setColor(_:property:color:)` with the `fill/color/value` property, then assign the fill to the page.

## Add Text Blocks

Text blocks allow you to add and style text content. We demonstrate three different approaches to text sizing and styling.

### Create Text and Set Content

Create a text block, set its content with `replaceText()`, then bind the Roboto typeface we declared earlier:

```swift highlight-text-create
// Add the main headline text with the Roboto typeface
let headline = try engine.block.create(.text)
try engine.block.replaceText(headline, text: "Integrate\nCreative Editing\ninto your App")
try engine.block.setFont(headline, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
try engine.block.setFloat(headline, property: "text/lineHeight", value: 0.78)
```

### Style Entire Text Block

Apply styling to the entire text block using `toggleBoldFont()` and `setTextColor()`:

```swift highlight-text-style-block
// Apply bold weight and a black color to the whole headline
if try engine.block.canToggleBoldFont(headline) {
  try engine.block.toggleBoldFont(headline)
}
try engine.block.setTextColor(headline, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))
```

### Enable Automatic Font Sizing

Configure the text block to automatically scale its font size to fit within fixed dimensions:

```swift highlight-text-auto-size
// Fix the container size and let the font scale automatically
try engine.block.setWidthMode(headline, mode: .absolute)
try engine.block.setHeightMode(headline, mode: .absolute)
try engine.block.setWidth(headline, value: 960)
try engine.block.setHeight(headline, value: 300)
try engine.block.setBool(headline, property: "text/automaticFontSizeEnabled", value: true)
```

### Range-based Text Styling

Apply different styles to specific character ranges within a single text block:

```swift highlight-text-range-style
  // Style "in hours," — purple and italic
  let inHoursRange = taglineText.range(of: "in hours,")!
  try engine.block.setTextColor(tagline, color: .rgba(r: 0.2, g: 0.2, b: 0.8, a: 1.0), in: inHoursRange)
  if try engine.block.canToggleItalicFont(tagline, in: inHoursRange) {
    try engine.block.toggleItalicFont(tagline, in: inHoursRange)
  }

  // Style "not months." — black and bold
  let notMonthsRange = taglineText.range(of: "not months.")!
  try engine.block.setTextColor(tagline, color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0), in: notMonthsRange)
  if try engine.block.canToggleBoldFont(tagline, in: notMonthsRange) {
    try engine.block.toggleBoldFont(tagline, in: notMonthsRange)
  }
```

Swift's range-based overloads take a `Range<String.Index>` rather than integer offsets, so you can use idiomatic `String.range(of:)` to locate the subrange. Passing `nil` (or omitting the `in:` parameter) targets the entire string.

- `setTextColor(_:color:in:)` — apply color to a specific character range
- `canToggleBoldFont(_:in:)` / `toggleBoldFont(_:in:)` — toggle bold styling for a range
- `canToggleItalicFont(_:in:)` / `toggleItalicFont(_:in:)` — toggle italic styling for a range

### Fixed Font Size

Set an explicit font size instead of using automatic sizing:

```swift highlight-text-fixed-size
// Add the CTA title with an explicit font size
let ctaTitle = try engine.block.create(.text)
try engine.block.replaceText(ctaTitle, text: "Start a Free Trial")
try engine.block.setFont(ctaTitle, fontFileURL: robotoTypeface.fonts[0].uri, typeface: robotoTypeface)
try engine.block.setFloat(ctaTitle, property: "text/fontSize", value: 80)
try engine.block.setFloat(ctaTitle, property: "text/lineHeight", value: 1.0)
```

## Add Shapes

We create shapes using graphic blocks. CE.SDK supports `rect`, `line`, `ellipse`, `polygon`, `star`, and `vectorPath` shapes through the `ShapeType` enum.

### Create a Shape Block

Create a graphic block and assign a shape to it:

```swift highlight-shape-create
// Add a horizontal divider line
let dividerLine = try engine.block.create(.graphic)
let lineShape = try engine.block.createShape(.line)
try engine.block.setShape(dividerLine, shape: lineShape)
```

### Apply Fill to Shape

Create a color fill and apply it to the shape:

```swift highlight-shape-fill
let lineFill = try engine.block.createFill(.color)
try engine.block.setColor(lineFill, property: "fill/color/value", color: .rgba(r: 0.0, g: 0.0, b: 0.0, a: 1.0))
try engine.block.setFill(dividerLine, fill: lineFill)
```

## Add Images

We add images using graphic blocks with image fills.

### Create an Image Block

Create a graphic block with a rect shape and an image fill:

```swift highlight-image-create
  // Add the IMG.LY logo image
  let logo = try engine.block.create(.graphic)
  let logoShape = try engine.block.createShape(.rect)
  try engine.block.setShape(logo, shape: logoShape)

  let logoFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    logoFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(logo, fill: logoFill)
```

We set the image URL via `setString(_:property:value:)` with the `fill/image/imageFileURI` property.

## Position and Size Blocks

All blocks use the same positioning and sizing APIs:

```swift highlight-block-position
try engine.block.setContentFillMode(logo, mode: .contain)
try engine.block.setWidth(logo, value: 200)
try engine.block.setHeight(logo, value: 65)
try engine.block.setPositionX(logo, value: 820)
try engine.block.setPositionY(logo, value: 960)
try engine.block.appendChild(to: page, child: logo)
```

- `setWidth(_:value:)` / `setHeight(_:value:)` — set block dimensions
- `setPositionX(_:value:)` / `setPositionY(_:value:)` — set block position
- `setContentFillMode(_:mode:)` — control how content fills the block (`.crop`, `.cover`, `.contain`)
- `appendChild(to:child:)` — add the block to the page hierarchy

## Export the Composition

We export the finished composition using the engine API.

### Export Using the Engine API

`engine.block.export(_:mimeType:options:)` returns the rendered bytes as `Data` (aliased as `Blob`):

```swift highlight-export-api
// Export the composition as a PNG
let options = ExportOptions(targetWidth: 1080, targetHeight: 1080)
let blob = try await engine.block.export(page, mimeType: .png, options: options)
```

### Write to File System

Write the returned `Data` to disk using `write(to:)`:

```swift highlight-export-file
// Write the exported data to disk
let outputURL = URL(fileURLWithPath: NSTemporaryDirectory()).appendingPathComponent("composition.png")
try blob.write(to: outputURL)
```

## Troubleshooting

- **Blocks not appearing**: Verify that `appendChild(to:child:)` attaches blocks to the page. Blocks must be part of the scene hierarchy to render.
- **Text styling not applied**: Verify character ranges are correct for range-based APIs. Swift uses `Range<String.Index>`, which correctly handles multi-byte characters when you locate the subrange with `String.range(of:)`.
- **Image stretched**: Use `setContentFillMode(_:mode: .contain)` to maintain the image's aspect ratio.
- **Export fails**: Verify that page dimensions are set before export. The export requires valid dimensions.
- **Typeface missing variants**: If `canToggleBoldFont(_:)` returns `false`, the configured `Typeface` is missing a bold `Font` entry with the matching style. Check that each weight/style combination has a `Font` in the typeface.

## Next Steps

- [Layer Management](./layer-management.md) — Control block stacking and organization
- [Positioning and Alignment](./position-and-align.md) — Precise block placement
- [Group and Ungroup](./group-and-ungroup.md) — Group blocks for unified transforms
- [Blend Modes](./blend-modes.md) — Control how blocks interact visually
- [Export](../export-save-publish/export.md) — Export options and formats



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support