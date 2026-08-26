> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Automate Workflows](../automation.md) > [Data Merge](./data-merge.md)

---

```swift file=@cesdk_swift_examples/engine-guides-data-merge/DataMerge.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func dataMerge(engine: Engine) async throws {
  // Resolve sample assets against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  // Sample record whose fields map to the template's variables and placeholders
  let record: [String: String] = [
    "name": "Alex Smith",
    "title": "Creative Developer",
    "email": "alex.smith@example.com",
  ]
  let photoURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")

  // Demo setup: build a minimal template inline. In production, load a
  // template scene authored on the web with `engine.scene.load(from:)`.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 400)
  try engine.block.appendChild(to: scene, child: page)

  // A photo placeholder with a semantic name
  let photoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(photoBlock, shape: engine.block.createShape(.rect))
  let photoFill = try engine.block.createFill(.image)
  try engine.block.setURL(photoFill, property: "fill/image/imageFileURI", value: photoURL)
  try engine.block.setFill(photoBlock, fill: photoFill)
  try engine.block.setWidth(photoBlock, value: 150)
  try engine.block.setHeight(photoBlock, value: 150)
  try engine.block.setPositionX(photoBlock, value: 50)
  try engine.block.setPositionY(photoBlock, value: 125)
  try engine.block.setName(photoBlock, name: "profile-photo")
  try engine.block.appendChild(to: page, child: photoBlock)

  // A text block referencing variable tokens
  let textBlock = try engine.block.create(.text)
  try engine.block.replaceText(textBlock, text: "{{name}}\n{{title}}\n{{email}}")
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 32)
  try engine.block.setPositionX(textBlock, value: 230)
  try engine.block.setPositionY(textBlock, value: 140)
  try engine.block.appendChild(to: page, child: textBlock)

  // Discover which variables the loaded template expects
  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)

  // Confirm the text block actually references variables
  let hasVariables = try engine.block.referencesAnyVariables(textBlock)
  print("Text block references variables:", hasVariables)

  // Populate each variable with a value from the record
  for (key, value) in record {
    try engine.variable.set(key: key, value: value)
  }

  // Find a placeholder block by its semantic name and swap its image content
  if let foundPhotoBlock = engine.block.find(byName: "profile-photo").first {
    let fill = try engine.block.getFill(foundPhotoBlock)
    try engine.block.setURL(
      fill,
      property: "fill/image/imageFileURI",
      value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    )
  }

  // Export the personalized design as PNG data
  let blob = try await engine.block.export(page, mimeType: .png)
  print("Exported PNG data:", blob.count, "bytes")
}
```

Automatically generate personalized designs from a template by merging external data into its variables and placeholder blocks — no editor UI required.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-data-merge)

Data merge populates a template with external data using the headless Creative Engine, producing personalized outputs like certificates, badges, or team cards without opening the editor. The template itself is authored on the web; on mobile you consume it and merge in per-record data.

This guide walks through the core merge operations: discovering variables, setting values, updating placeholder blocks, and exporting the result.

## Prepare the Data Record

In production the record comes from a CSV file, database, or API response. For this guide we define a small dictionary whose keys match the template's variables.

```swift highlight-sample-data
// Sample record whose fields map to the template's variables and placeholders
let record: [String: String] = [
  "name": "Alex Smith",
  "title": "Creative Developer",
  "email": "alex.smith@example.com",
]
let photoURL = baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg")
```

Each key maps to a `{{variableName}}` token in the template's text blocks.

## Set Up the Demo Template

Templates are designed on the web and loaded with `engine.scene.load(from:)` on mobile. For this self-contained example we build the same structure inline — a photo placeholder plus a text block with variable tokens — so the guide runs standalone.

```swift highlight-setup-template
  // Demo setup: build a minimal template inline. In production, load a
  // template scene authored on the web with `engine.scene.load(from:)`.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 400)
  try engine.block.appendChild(to: scene, child: page)

  // A photo placeholder with a semantic name
  let photoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(photoBlock, shape: engine.block.createShape(.rect))
  let photoFill = try engine.block.createFill(.image)
  try engine.block.setURL(photoFill, property: "fill/image/imageFileURI", value: photoURL)
  try engine.block.setFill(photoBlock, fill: photoFill)
  try engine.block.setWidth(photoBlock, value: 150)
  try engine.block.setHeight(photoBlock, value: 150)
  try engine.block.setPositionX(photoBlock, value: 50)
  try engine.block.setPositionY(photoBlock, value: 125)
  try engine.block.setName(photoBlock, name: "profile-photo")
  try engine.block.appendChild(to: page, child: photoBlock)

  // A text block referencing variable tokens
  let textBlock = try engine.block.create(.text)
  try engine.block.replaceText(textBlock, text: "{{name}}\n{{title}}\n{{email}}")
  try engine.block.setWidthMode(textBlock, mode: .auto)
  try engine.block.setHeightMode(textBlock, mode: .auto)
  try engine.block.setFloat(textBlock, property: "text/fontSize", value: 32)
  try engine.block.setPositionX(textBlock, value: 230)
  try engine.block.setPositionY(textBlock, value: 140)
  try engine.block.appendChild(to: page, child: textBlock)
```

In a real application, replace this block with a single `engine.scene.load(from: templateURL)` call pointing at a template your team already authored.

## Discover Variables

Inspect what the template expects with `engine.variable.findAll()`. This is useful when processing templates you did not author or when validating incoming data. `engine.block.referencesAnyVariables(_:)` confirms whether a specific block depends on variable tokens.

```swift highlight-discover-variables
  // Discover which variables the loaded template expects
  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)

  // Confirm the text block actually references variables
  let hasVariables = try engine.block.referencesAnyVariables(textBlock)
  print("Text block references variables:", hasVariables)
```

## Set Variable Values

Apply the record to the template with `engine.variable.set(key:value:)`. Every text block referencing a variable updates immediately.

```swift highlight-set-variables
// Populate each variable with a value from the record
for (key, value) in record {
  try engine.variable.set(key: key, value: value)
}
```

Variables are scene-scoped and persist for the lifetime of the engine session, so you can set them once and export as many variations as you need.

## Update a Placeholder Block

Locate a placeholder block by its semantic name with `engine.block.find(byName:)`, then swap its fill's image URI to replace the content. The pattern works for profile photos, logos, product images, or any image placeholder the template author named.

```swift highlight-update-placeholder
// Find a placeholder block by its semantic name and swap its image content
if let foundPhotoBlock = engine.block.find(byName: "profile-photo").first {
  let fill = try engine.block.getFill(foundPhotoBlock)
  try engine.block.setURL(
    fill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
  )
}
```

If you need to discover every placeholder without knowing names in advance, use `engine.block.findAllPlaceholders()` instead.

## Export the Design

Render the personalized design with `engine.block.export(_:mimeType:)`. The engine returns the encoded bytes; write them to disk, upload them, or pass them to another process.

```swift highlight-export
// Export the personalized design as PNG data
let blob = try await engine.block.export(page, mimeType: .png)
print("Exported PNG data:", blob.count, "bytes")
```

PNG, JPEG, WebP, and PDF are all supported. To process many records in a row, reset variable values between iterations or load a fresh copy of the template for each one.

## Troubleshooting

### Variables Not Rendering

If variable placeholders show instead of values:

- Verify the variable name matches the template exactly — names are case-sensitive
- Call `engine.variable.findAll()` to confirm the variable exists in the loaded scene
- Ensure `engine.variable.set(key:value:)` was called before exporting

### Placeholder Not Found

If `find(byName:)` returns an empty array:

- Confirm the block name was set in the template with `engine.block.setName(_:name:)`
- Check the name string matches exactly — names are case-sensitive
- Verify the block exists in the current scene

### Image Not Updating

If a placeholder image does not change:

- Get the fill block first with `engine.block.getFill(_:)`
- Use the `fill/image/imageFileURI` property path
- Verify the image URL is reachable from the device

## API Reference

| Method | Description |
|--------|-------------|
| `engine.scene.load(from:)` | Load a template scene from a URL |
| `engine.variable.findAll()` | List every variable name defined in the scene |
| `engine.variable.set(key:value:)` | Set a variable's value |
| `engine.variable.get(key:)` | Read the current value of a variable |
| `engine.block.referencesAnyVariables(_:)` | Check whether a block depends on variables |
| `engine.block.find(byName:)` | Find blocks by their semantic name |
| `engine.block.findAllPlaceholders()` | Return every placeholder block in the scene |
| `engine.block.getFill(_:)` | Get the fill block of a design block |
| `engine.block.setString(_:property:value:)` | Set a string property value |
| `engine.block.export(_:mimeType:)` | Export a block as image data |

## Next Steps

- [Batch Processing](./batch-processing.md) — Automate generation of multiple designs from a template in a loop.
- [Templating](../concepts/templating.md) — Learn the template model behind variables and placeholders.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support