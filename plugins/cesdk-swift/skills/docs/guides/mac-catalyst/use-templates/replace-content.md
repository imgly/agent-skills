> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Replace Content](./replace-content.md)

---

```swift file=@cesdk_swift_examples/engine-guides-replace-content/ReplaceContent.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func replaceContent(engine: Engine) async throws {
  // Resolve sample assets against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  // Demo setup: build a minimal template inline so the replacement APIs below
  // have named placeholders and variables to operate on. In production, load a
  // template scene authored on the web with `engine.scene.load(from:)`.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 400)
  try engine.block.appendChild(to: scene, child: page)

  // An image placeholder with a semantic name.
  let productImage = try engine.block.create(.graphic)
  try engine.block.setShape(productImage, shape: engine.block.createShape(.rect))
  let productFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    productFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(productImage, fill: productFill)
  try engine.block.setWidth(productImage, value: 300)
  try engine.block.setHeight(productImage, value: 300)
  try engine.block.setPositionX(productImage, value: 50)
  try engine.block.setPositionY(productImage, value: 50)
  try engine.block.setName(productImage, name: "product-image")
  try engine.block.setPlaceholderEnabled(productImage, enabled: true)
  try engine.block.appendChild(to: page, child: productImage)

  // A text block driven by a variable token.
  let headline = try engine.block.create(.text)
  try engine.block.replaceText(headline, text: "{{headline}}")
  try engine.block.setWidthMode(headline, mode: .auto)
  try engine.block.setHeightMode(headline, mode: .auto)
  try engine.block.setFloat(headline, property: "text/fontSize", value: 48)
  try engine.block.setPositionX(headline, value: 400)
  try engine.block.setPositionY(headline, value: 120)
  try engine.block.setName(headline, name: "headline")
  try engine.block.appendChild(to: page, child: headline)

  // A plain text block updated through direct replacement.
  let subtitle = try engine.block.create(.text)
  try engine.block.replaceText(subtitle, text: "Original subtitle")
  try engine.block.setWidthMode(subtitle, mode: .auto)
  try engine.block.setHeightMode(subtitle, mode: .auto)
  try engine.block.setFloat(subtitle, property: "text/fontSize", value: 24)
  try engine.block.setPositionX(subtitle, value: 400)
  try engine.block.setPositionY(subtitle, value: 220)
  try engine.block.setName(subtitle, name: "subtitle")
  try engine.block.appendChild(to: page, child: subtitle)

  // Find a specific block when you know its name. Names are case-sensitive.
  let headlineBlock = engine.block.find(byName: "headline").first
  if let headlineBlock {
    print("Found block named:", try engine.block.getName(headlineBlock))
  }

  // Discover every placeholder block so you can iterate over them.
  let placeholders = engine.block.findAllPlaceholders()
  print("Template placeholders:", placeholders.count)

  if let imageBlock = engine.block.find(byName: "product-image").first {
    let fill = try engine.block.getFill(imageBlock)
    if try engine.block.supportsPlaceholderBehavior(fill) {
      let enabled = try engine.block.isPlaceholderEnabled(imageBlock)
      print("product-image placeholder enabled:", enabled)
    }
  }

  // The headline block contains "{{headline}}" and updates when the variable is set.
  try engine.variable.set(key: "headline", value: "Summer Sale")

  // List every variable the template references and read a current value.
  let variableNames = engine.variable.findAll()
  let headlineValue = try engine.variable.get(key: "headline")
  print("Variables:", variableNames, "headline =", headlineValue)

  // Remove a variable you no longer need.
  try engine.variable.set(key: "legacyTag", value: "obsolete")
  try engine.variable.remove(key: "legacyTag")

  // Swap an image placeholder's source by updating its fill's image URI.
  if let imageBlock = engine.block.find(byName: "product-image").first {
    let fill = try engine.block.getFill(imageBlock)
    try engine.block.setURL(
      fill,
      property: "fill/image/imageFileURI",
      value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    )
  }

  // Replace the full text of a block without using the variable system.
  if let subtitleBlock = engine.block.find(byName: "subtitle").first {
    try engine.block.replaceText(subtitleBlock, text: "Up to 50% off this week")
  }

  // Populate the template once per record, then export each result.
  let records: [[String: String]] = [
    ["headline": "Summer Sale", "subtitle": "Up to 50% off", "image": "ly.img.image/images/sample_1.jpg"],
    ["headline": "Winter Sale", "subtitle": "Cozy deals inside", "image": "ly.img.image/images/sample_2.jpg"],
  ]

  for record in records {
    if let headline = record["headline"] {
      try engine.variable.set(key: "headline", value: headline)
    }
    if let subtitle = record["subtitle"], let subtitleBlock = engine.block.find(byName: "subtitle").first {
      try engine.block.replaceText(subtitleBlock, text: subtitle)
    }
    if let imagePath = record["image"], let imageBlock = engine.block.find(byName: "product-image").first {
      let fill = try engine.block.getFill(imageBlock)
      try engine.block.setURL(
        fill,
        property: "fill/image/imageFileURI",
        value: baseURL.appendingPathComponent(imagePath),
      )
    }
    let blob = try await engine.block.export(page, mimeType: .png)
    print("Exported \(record["headline"] ?? "record"):", blob.count, "bytes")
  }
}
```

Dynamically replace content within templates using CE.SDK's placeholder and
variable systems. Find placeholder blocks by name, update text using variables,
and swap image sources programmatically.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260825/engine-guides-replace-content)

<EngineReferenceNote {...props} />

Template content replacement enables dynamic designs by swapping placeholder content programmatically. Templates contain blocks marked as placeholders that can be located by name or discovered in bulk for batch processing. Text replacement uses the variable system with `{{variableName}}` syntax, while images are updated by modifying fill properties.

This guide covers how to find placeholder blocks, replace text using variables, swap image content, and build data-driven template workflows. It assumes you already have a template loaded — see [Templating](../concepts/templating.md) for the model behind variables and placeholders.

## Finding Placeholder Blocks

Locate replaceable content with block discovery APIs. Use `find(byName:)` to find specific blocks when you know the placeholder name. Names are case-sensitive, and `getName(_:)` reports the name set on a block.

```swift highlight-replaceContent-findByName
// Find a specific block when you know its name. Names are case-sensitive.
let headlineBlock = engine.block.find(byName: "headline").first
if let headlineBlock {
  print("Found block named:", try engine.block.getName(headlineBlock))
}
```

### Discover All Placeholders

Use `findAllPlaceholders()` to discover every placeholder block in a template and iterate through them programmatically.

```swift highlight-replaceContent-findAllPlaceholders
// Discover every placeholder block so you can iterate over them.
let placeholders = engine.block.findAllPlaceholders()
print("Template placeholders:", placeholders.count)
```

### Query Placeholder State

Graphic blocks keep their replaceable content in a fill, so placeholder behavior is a property of the fill — get it with `getFill(_:)` and pass it to `supportsPlaceholderBehavior(_:)`. The interactive placeholder flag stays on the block, so read it from the block with `isPlaceholderEnabled(_:)`. (Text blocks have no replaceable fill, so their behavior is queried on the block directly.)

```swift highlight-replaceContent-queryState
if let imageBlock = engine.block.find(byName: "product-image").first {
  let fill = try engine.block.getFill(imageBlock)
  if try engine.block.supportsPlaceholderBehavior(fill) {
    let enabled = try engine.block.isPlaceholderEnabled(imageBlock)
    print("product-image placeholder enabled:", enabled)
  }
}
```

## Text Variable Replacement

Replace text content through CE.SDK's variable system. A text block containing `{{variableName}}` updates automatically when you set the matching variable with `set(key:value:)`.

```swift highlight-replaceContent-textVariables
// The headline block contains "{{headline}}" and updates when the variable is set.
try engine.variable.set(key: "headline", value: "Summer Sale")
```

### Managing Variables

List every variable the template references with `findAll()`, read a current value with `get(key:)`, and delete one you no longer need with `remove(key:)`.

```swift highlight-replaceContent-manageVariables
  // List every variable the template references and read a current value.
  let variableNames = engine.variable.findAll()
  let headlineValue = try engine.variable.get(key: "headline")
  print("Variables:", variableNames, "headline =", headlineValue)

  // Remove a variable you no longer need.
  try engine.variable.set(key: "legacyTag", value: "obsolete")
  try engine.variable.remove(key: "legacyTag")
```

## Replacing Image Content

Update an image placeholder by modifying the fill's image source. Get the fill block with `getFill(_:)`, then set the new URL on the `fill/image/imageFileURI` property with `setURL(_:property:value:)`.

```swift highlight-replaceContent-replaceImage
// Swap an image placeholder's source by updating its fill's image URI.
if let imageBlock = engine.block.find(byName: "product-image").first {
  let fill = try engine.block.getFill(imageBlock)
  try engine.block.setURL(
    fill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
  )
}
```

## Direct Text Replacement

Replace the full text of a block without the variable system using `replaceText(_:text:in:)`. This is the right tool when you need precise control over the exact string a block displays.

```swift highlight-replaceContent-directText
// Replace the full text of a block without using the variable system.
if let subtitleBlock = engine.block.find(byName: "subtitle").first {
  try engine.block.replaceText(subtitleBlock, text: "Up to 50% off this week")
}
```

## Data-Driven Template Workflows

Build automated template population by iterating over data records. Update the variables and placeholders for each record, then export the page before moving on to the next one.

```swift highlight-replaceContent-dataDriven
  // Populate the template once per record, then export each result.
  let records: [[String: String]] = [
    ["headline": "Summer Sale", "subtitle": "Up to 50% off", "image": "ly.img.image/images/sample_1.jpg"],
    ["headline": "Winter Sale", "subtitle": "Cozy deals inside", "image": "ly.img.image/images/sample_2.jpg"],
  ]

  for record in records {
    if let headline = record["headline"] {
      try engine.variable.set(key: "headline", value: headline)
    }
    if let subtitle = record["subtitle"], let subtitleBlock = engine.block.find(byName: "subtitle").first {
      try engine.block.replaceText(subtitleBlock, text: subtitle)
    }
    if let imagePath = record["image"], let imageBlock = engine.block.find(byName: "product-image").first {
      let fill = try engine.block.getFill(imageBlock)
      try engine.block.setURL(
        fill,
        property: "fill/image/imageFileURI",
        value: baseURL.appendingPathComponent(imagePath),
      )
    }
    let blob = try await engine.block.export(page, mimeType: .png)
    print("Exported \(record["headline"] ?? "record"):", blob.count, "bytes")
  }
```

## Troubleshooting

### Block Not Found by Name

Verify the exact name string matches what's set in the template. Names are case-sensitive. Use `getName(_:)` to inspect existing block names.

### Variable Not Replacing Text

Ensure the `{{variableName}}` token in the text block matches the key passed to `set(key:value:)` exactly, including casing.

### Image Not Updating

Confirm the block has an image fill by checking that `getFill(_:)` returns a valid fill block. Verify the URL is reachable and properly formatted.

### Placeholder State Queries Return False

For a graphic block, query `supportsPlaceholderBehavior(_:)` on its fill (from `getFill(_:)`), not on the block — placeholder behavior lives on the fill, so checking the graphic block returns `false`. Text blocks are queried on the block directly.

## API Reference

| Method | Description |
|--------|-------------|
| `block.find(byName:)` | Find blocks by name identifier |
| `block.getName(_:)` | Get the name of a block |
| `block.findAllPlaceholders()` | Discover all placeholder blocks in the scene |
| `block.isPlaceholderEnabled(_:)` | Check whether placeholder functionality is enabled |
| `block.supportsPlaceholderBehavior(_:)` | Verify a fill (graphic blocks) or block (text blocks) supports placeholder behavior |
| `block.getFill(_:)` | Get the fill block from a graphic block |
| `block.setURL(_:property:value:)` | Set URL-valued properties such as image sources |
| `block.replaceText(_:text:in:)` | Replace text content directly |
| `block.export(_:mimeType:)` | Export a block to an image format |
| `variable.set(key:value:)` | Set a text variable value for dynamic replacement |
| `variable.get(key:)` | Get the current value of a variable |
| `variable.findAll()` | List all variable names in the scene |
| `variable.remove(key:)` | Remove a variable from the scene |

## Next Steps

[Data Merge](../automation/data-merge.md) — Automate filling a template from structured data records.

[Product Variations](../automation/product-variations.md) — Generate multiple design variations from a single template.

[Templating](../concepts/templating.md) — Learn the template model behind variables and placeholders.

[Placeholders](../create-templates/add-dynamic-content/placeholders.md) — Configure placeholder behavior and controls in depth.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support