> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Product Variations](./product-variations.md)

---

```swift file=@cesdk_swift_examples/engine-guides-product-variations/ProductVariations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func productVariations(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  struct ProductVariant {
    let color: String
    let size: String
    let price: String
    let imageURL: URL
  }

  let variants: [ProductVariant] = [
    ProductVariant(
      color: "Midnight Black",
      size: "M",
      price: "$29.99",
      imageURL: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    ),
    ProductVariant(
      color: "Ocean Blue",
      size: "L",
      price: "$34.99",
      imageURL: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    ),
  ]

  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 500)
  try engine.block.setHeight(page, value: 500)

  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.setWidth(text, value: 400)
  try engine.block.setHeight(text, value: 50)
  try engine.block.setPositionX(text, value: 50)
  try engine.block.setPositionY(text, value: 50)
  try engine.block.replaceText(text, text: "{{ProductName}} – {{ProductColor}}")

  let priceText = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: priceText)
  try engine.block.setWidth(priceText, value: 200)
  try engine.block.setHeight(priceText, value: 40)
  try engine.block.setPositionX(priceText, value: 50)
  try engine.block.setPositionY(priceText, value: 120)
  try engine.block.replaceText(priceText, text: "{{ProductPrice}}")

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.appendChild(to: page, child: imageBlock)
  try engine.block.setWidth(imageBlock, value: 300)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 180)
  try engine.block.setName(imageBlock, name: "ProductImage")
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )

  // Save template as a string for further export
  let templateString = try await engine.scene.saveToString()

  let variableKeys = engine.variable.findAll()
  print("Template variables: \(variableKeys)")
  // Expected: ["ProductName", "ProductColor", "ProductPrice"]

  for variant in variants {
    // Reload the template for each variant
    try await engine.scene.load(from: templateString)

    // Set text variables for this variant
    try engine.variable.set(key: "ProductName", value: "Classic Tee")
    try engine.variable.set(key: "ProductColor", value: variant.color)
    try engine.variable.set(key: "ProductPrice", value: variant.price)

    // Replace the product image by finding the block by name
    if let block = engine.block.find(byName: "ProductImage").first {
      let fill = try engine.block.getFill(block)
      try engine.block.setURL(
        fill,
        property: "fill/image/imageFileURI",
        value: variant.imageURL,
      )
    }

    // Export the current variation
    guard let exportPage = try engine.block.find(byType: .page).first else { continue }
    let blob = try await engine.block.export(exportPage, mimeType: .jpeg)

    // Save to a file
    let dir = FileManager.default.temporaryDirectory
    let fileName = "product-\(variant.color.lowercased().replacingOccurrences(of: " ", with: "-"))-\(variant.size).jpg"
    let fileURL = dir.appendingPathComponent(fileName)
    try blob.write(to: fileURL)
  }
}
```

Generate multiple product variants — different colors, sizes or copy — from a single design template using the CE.SDK Engine API in Swift.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260822/engine-guides-product-variations)

## What You'll Learn

- Define a data model to describe product attribute combinations.
- Load a design template and discover its available variables.
- Replace text placeholders and swap product images for each variant.
- Export each variation as JPEG.

## When to Use It

Use product variations when a single product needs multiple visual representations — for example, a t-shirt in five colors or a sneaker in three sizes. Each variant shares the same layout but differs in text, images or styling.

For generating many images from **different data records**, see [Batch Processing](./batch-processing.md). For producing **multiple layout formats** from one record, see [Multiple Image Generation](./multi-image-generation.md).

## Define the Data Model

Start by modeling your product variants. Each entry represents one combination of attributes to apply to the template.

```swift highlight-productVariations-dataModel
  struct ProductVariant {
    let color: String
    let size: String
    let price: String
    let imageURL: URL
  }

  let variants: [ProductVariant] = [
    ProductVariant(
      color: "Midnight Black",
      size: "M",
      price: "$29.99",
      imageURL: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    ),
    ProductVariant(
      color: "Ocean Blue",
      size: "L",
      price: "$34.99",
      imageURL: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    ),
  ]
```

The `imageURL` points to the product photo for that color variant. In production, you'd load these from an API or database.

## Create a Template

Product variation templates use **text variables** (wrapped in `{{double braces}}`) and **named image blocks** as placeholders. You can create templates in the Web CE.SDK editor and save them as archives, or build them on any platform programmatically (see example below).

```swift highlight-productVariations-createTemplate
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 500)
  try engine.block.setHeight(page, value: 500)

  let text = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: text)
  try engine.block.setWidth(text, value: 400)
  try engine.block.setHeight(text, value: 50)
  try engine.block.setPositionX(text, value: 50)
  try engine.block.setPositionY(text, value: 50)
  try engine.block.replaceText(text, text: "{{ProductName}} – {{ProductColor}}")

  let priceText = try engine.block.create(.text)
  try engine.block.appendChild(to: page, child: priceText)
  try engine.block.setWidth(priceText, value: 200)
  try engine.block.setHeight(priceText, value: 40)
  try engine.block.setPositionX(priceText, value: 50)
  try engine.block.setPositionY(priceText, value: 120)
  try engine.block.replaceText(priceText, text: "{{ProductPrice}}")

  let imageBlock = try engine.block.create(.graphic)
  try engine.block.appendChild(to: page, child: imageBlock)
  try engine.block.setWidth(imageBlock, value: 300)
  try engine.block.setHeight(imageBlock, value: 300)
  try engine.block.setPositionX(imageBlock, value: 100)
  try engine.block.setPositionY(imageBlock, value: 180)
  try engine.block.setName(imageBlock, name: "ProductImage")
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setFill(imageBlock, fill: imageFill)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )

  // Save template as a string for further export
  let templateString = try await engine.scene.saveToString()
```

Text blocks containing `{{ProductName}}`, `{{ProductColor}}` and `{{ProductPrice}}` automatically register as variables. Named image blocks like `"ProductImage"` let you swap fills by name.

## Discover Template Variables

Before processing, verify which variables the template exposes. This is useful for validating data against the template at runtime.

```swift highlight-productVariations-discoverVariables
let variableKeys = engine.variable.findAll()
print("Template variables: \(variableKeys)")
// Expected: ["ProductName", "ProductColor", "ProductPrice"]
```

`findAll()` returns the keys of all registered text variables. Use this to confirm your data model covers every placeholder before starting a batch run.

## Generate Variations

Loop through each variant, reload the template, populate variables, then export.

```swift highlight-productVariations-generateLoop
  for variant in variants {
    // Reload the template for each variant
    try await engine.scene.load(from: templateString)

    // Set text variables for this variant
    try engine.variable.set(key: "ProductName", value: "Classic Tee")
    try engine.variable.set(key: "ProductColor", value: variant.color)
    try engine.variable.set(key: "ProductPrice", value: variant.price)

    // Replace the product image by finding the block by name
    if let block = engine.block.find(byName: "ProductImage").first {
      let fill = try engine.block.getFill(block)
      try engine.block.setURL(
        fill,
        property: "fill/image/imageFileURI",
        value: variant.imageURL,
      )
    }

    // Export the current variation
    guard let exportPage = try engine.block.find(byType: .page).first else { continue }
    let blob = try await engine.block.export(exportPage, mimeType: .jpeg)

    // Save to a file
    let dir = FileManager.default.temporaryDirectory
    let fileName = "product-\(variant.color.lowercased().replacingOccurrences(of: " ", with: "-"))-\(variant.size).jpg"
    let fileURL = dir.appendingPathComponent(fileName)
    try blob.write(to: fileURL)
  }
```

### Set Text Variables

Use `engine.variable.set(key:value:)` to replace each placeholder with the variant's data:

```swift highlight-productVariations-setVariables
// Set text variables for this variant
try engine.variable.set(key: "ProductName", value: "Classic Tee")
try engine.variable.set(key: "ProductColor", value: variant.color)
try engine.variable.set(key: "ProductPrice", value: variant.price)
```

All variable values are strings. Convert numbers or prices to their display format before setting them.

### Replace the Product Image

Find the image block by its name and update its fill URI:

```swift highlight-productVariations-replaceImage
// Replace the product image by finding the block by name
if let block = engine.block.find(byName: "ProductImage").first {
  let fill = try engine.block.getFill(block)
  try engine.block.setURL(
    fill,
    property: "fill/image/imageFileURI",
    value: variant.imageURL,
  )
}
```

The block name `"ProductImage"` was assigned when the template was created. Using names keeps automation readable compared to referencing block IDs directly.

### Export the Variant

Export the populated page as JPEG and write it to disk:

```swift highlight-productVariations-export
    // Export the current variation
    guard let exportPage = try engine.block.find(byType: .page).first else { continue }
    let blob = try await engine.block.export(exportPage, mimeType: .jpeg)

    // Save to a file
    let dir = FileManager.default.temporaryDirectory
    let fileName = "product-\(variant.color.lowercased().replacingOccurrences(of: " ", with: "-"))-\(variant.size).jpg"
    let fileURL = dir.appendingPathComponent(fileName)
    try blob.write(to: fileURL)
```

You can export as PNG, PDF or other formats by changing the `mimeType` parameter. See the [Export](../export-save-publish/export.md) guide for all available options.

## Next Steps

Product variations are one pattern for automating design output. Explore related guides:

- [Batch Processing](./batch-processing.md) — process many data records at once.
- [Multiple Image Generation](./multi-image-generation.md) — create multiple layout formats from one record.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — deep dive into the variable system.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — work with placeholder blocks.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support