> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Programmatic](./programmatic.md)

---

```swift file=@cesdk_swift_examples/engine-guides-use-templates-programmatic/UseTemplatesProgrammatically.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func useTemplatesProgrammatically(engine: Engine) async throws {
  // Resolve sample assets against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL
  let outputDir = FileManager.default.temporaryDirectory

  // Build a greeting card template from scratch.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)

  // Light gray page background.
  let pageFill = try engine.block.getFill(page)
  try engine.block.setColor(pageFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 0.95, a: 1))

  // Define the variables before any text references them.
  try engine.variable.set(key: "recipientName", value: "Template")
  try engine.variable.set(key: "customMessage", value: "This is a template example")

  // Title text block with a variable token.
  let titleBlock = try engine.block.create(.text)
  try engine.block.setName(titleBlock, name: "title")
  try engine.block.appendChild(to: page, child: titleBlock)
  try engine.block.setPositionX(titleBlock, value: 50)
  try engine.block.setPositionY(titleBlock, value: 50)
  try engine.block.setWidth(titleBlock, value: 700)
  try engine.block.setHeight(titleBlock, value: 80)
  try engine.block.replaceText(titleBlock, text: "Hello, {{recipientName}}!")
  try engine.block.setTextColor(titleBlock, color: .rgba(r: 0.2, g: 0.2, b: 0.2, a: 1))
  try engine.block.setFloat(titleBlock, property: "text/fontSize", value: 48)

  // Message text block with a variable token.
  let messageBlock = try engine.block.create(.text)
  try engine.block.setName(messageBlock, name: "message")
  try engine.block.appendChild(to: page, child: messageBlock)
  try engine.block.setPositionX(messageBlock, value: 50)
  try engine.block.setPositionY(messageBlock, value: 140)
  try engine.block.setWidth(messageBlock, value: 700)
  try engine.block.setHeight(messageBlock, value: 120)
  try engine.block.replaceText(messageBlock, text: "{{customMessage}}")
  try engine.block.setTextColor(messageBlock, color: .rgba(r: 0.3, g: 0.3, b: 0.3, a: 1))
  try engine.block.setFloat(messageBlock, property: "text/fontSize", value: 28)

  // List every variable the template defines and read a current value.
  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)
  let titleUsesVariables = try engine.block.referencesAnyVariables(titleBlock)
  print("Title references variables:", titleUsesVariables)
  let currentName = try engine.variable.get(key: "recipientName")
  print("recipientName =", currentName)

  // Serialize the template to a string and persist it for reuse.
  let templateString = try await engine.scene.saveToString()
  let templateURL = outputDir.appendingPathComponent("template.imgly")
  try templateString.write(to: templateURL, atomically: true, encoding: .utf8)

  // Populate the template with each record and export a personalized card.
  let recipients = [
    (name: "Alice", message: "Congratulations on your promotion!"),
    (name: "Bob", message: "Happy Birthday! Have a wonderful day!"),
    (name: "Charlie", message: "Thank you for your amazing work!"),
  ]
  for recipient in recipients {
    try engine.variable.set(key: "recipientName", value: recipient.name)
    try engine.variable.set(key: "customMessage", value: recipient.message)

    let cardData = try await engine.block.export(
      page,
      mimeType: .png,
      options: ExportOptions(targetWidth: 800, targetHeight: 600),
    )
    let filename = "greeting-card-\(recipient.name.lowercased()).png"
    try cardData.write(to: outputDir.appendingPathComponent(filename))
  }

  // Reload the saved template before each record so prior edits never carry over.
  let records = [
    (name: "Diana", message: "Welcome to the team!"),
    (name: "Eve", message: "Great work this quarter!"),
  ]
  for record in records {
    try await engine.scene.load(from: templateString)
    guard let recordPage = try engine.block.find(byType: .page).first else { continue }
    try engine.variable.set(key: "recipientName", value: record.name)
    try engine.variable.set(key: "customMessage", value: record.message)

    let recordData = try await engine.block.export(recordPage, mimeType: .png)
    try recordData.write(to: outputDir.appendingPathComponent("record-\(record.name.lowercased()).png"))
  }

  // Variable keys are case-sensitive and persist with the scene. Removing a
  // variable leaves its literal token in any text that still references it.
  try engine.variable.remove(key: "customMessage")
  print("Variables after removal:", engine.variable.findAll())

  // Load a pre-built template from a URL. This replaces the current scene with
  // the template's pages, blocks, variables, and placeholders.
  let templateAssetURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: templateAssetURL)
}
```

Automate template workflows with CE.SDK's Swift Engine API for batch
processing, personalization, and headless design generation.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-use-templates-programmatic)

<EngineReferenceNote {...props} />

Templates are scenes with predefined structures that support dynamic content through variables. This guide shows you how to work with them through the Engine API—no editor interface required. You build a greeting card template from scratch, bind variables, save it for reuse, and batch-export personalized designs.

## Creating Templates from Scratch

Build a template by creating a scene with `engine.scene.create()`, then arranging blocks with `engine.block.create(_:)` and `engine.block.appendChild(to:child:)`.

```swift highlight-useTemplatesProgrammatic-createTemplate
  // Build a greeting card template from scratch.
  let scene = try engine.scene.create()
  try engine.scene.setDesignUnit(.px)
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)

  // Light gray page background.
  let pageFill = try engine.block.getFill(page)
  try engine.block.setColor(pageFill, property: "fill/color/value", color: .rgba(r: 0.95, g: 0.95, b: 0.95, a: 1))

  // Define the variables before any text references them.
  try engine.variable.set(key: "recipientName", value: "Template")
  try engine.variable.set(key: "customMessage", value: "This is a template example")

  // Title text block with a variable token.
  let titleBlock = try engine.block.create(.text)
  try engine.block.setName(titleBlock, name: "title")
  try engine.block.appendChild(to: page, child: titleBlock)
  try engine.block.setPositionX(titleBlock, value: 50)
  try engine.block.setPositionY(titleBlock, value: 50)
  try engine.block.setWidth(titleBlock, value: 700)
  try engine.block.setHeight(titleBlock, value: 80)
  try engine.block.replaceText(titleBlock, text: "Hello, {{recipientName}}!")
  try engine.block.setTextColor(titleBlock, color: .rgba(r: 0.2, g: 0.2, b: 0.2, a: 1))
  try engine.block.setFloat(titleBlock, property: "text/fontSize", value: 48)

  // Message text block with a variable token.
  let messageBlock = try engine.block.create(.text)
  try engine.block.setName(messageBlock, name: "message")
  try engine.block.appendChild(to: page, child: messageBlock)
  try engine.block.setPositionX(messageBlock, value: 50)
  try engine.block.setPositionY(messageBlock, value: 140)
  try engine.block.setWidth(messageBlock, value: 700)
  try engine.block.setHeight(messageBlock, value: 120)
  try engine.block.replaceText(messageBlock, text: "{{customMessage}}")
  try engine.block.setTextColor(messageBlock, color: .rgba(r: 0.3, g: 0.3, b: 0.3, a: 1))
  try engine.block.setFloat(messageBlock, property: "text/fontSize", value: 28)
```

The title block contains `Hello, {{recipientName}}!` and the message block contains `{{customMessage}}`. The double-brace tokens mark where variables get substituted. We size and position each block, give the page a light gray background, and use a larger font size for the title than the message.

## Text Variables for Dynamic Content

Variables drive text replacement throughout a template. Define them with `engine.variable.set(key:value:)`; any text containing the matching `{{key}}` updates automatically. Read a current value with `engine.variable.get(key:)`, list every key with `engine.variable.findAll()`, and confirm a block uses variables with `engine.block.referencesAnyVariables(_:)`.

```swift highlight-useTemplatesProgrammatic-manageVariables
// List every variable the template defines and read a current value.
let variableNames = engine.variable.findAll()
print("Template variables:", variableNames)
let titleUsesVariables = try engine.block.referencesAnyVariables(titleBlock)
print("Title references variables:", titleUsesVariables)
let currentName = try engine.variable.get(key: "recipientName")
print("recipientName =", currentName)
```

## Populating Template Content

Updating a variable refreshes every text block that references it—there's no need to find and edit individual blocks. Map external data fields (JSON, API responses, database rows) onto variable keys to populate a template in a single step. For swappable media, use placeholder blocks; see [Placeholders](../create-templates/add-dynamic-content/placeholders.md).

## Saving Templates for Reuse

Serialize a template to a portable string with `engine.scene.saveToString()`. The result is a base64-encoded scene containing every block, property, and variable definition—store it in a database or write it to disk.

```swift highlight-useTemplatesProgrammatic-saveTemplate
// Serialize the template to a string and persist it for reuse.
let templateString = try await engine.scene.saveToString()
let templateURL = outputDir.appendingPathComponent("template.imgly")
try templateString.write(to: templateURL, atomically: true, encoding: .utf8)
```

To bundle a template together with its assets, such as images and fonts, use `engine.scene.saveToArchive()` instead.

## Batch Processing with Templates

Batch processing populates one template with many records. We update the variables for each recipient and export a personalized image with `engine.block.export(_:mimeType:options:)`.

```swift highlight-useTemplatesProgrammatic-batchProcessing
  // Populate the template with each record and export a personalized card.
  let recipients = [
    (name: "Alice", message: "Congratulations on your promotion!"),
    (name: "Bob", message: "Happy Birthday! Have a wonderful day!"),
    (name: "Charlie", message: "Thank you for your amazing work!"),
  ]
  for recipient in recipients {
    try engine.variable.set(key: "recipientName", value: recipient.name)
    try engine.variable.set(key: "customMessage", value: recipient.message)

    let cardData = try await engine.block.export(
      page,
      mimeType: .png,
      options: ExportOptions(targetWidth: 800, targetHeight: 600),
    )
    let filename = "greeting-card-\(recipient.name.lowercased()).png"
    try cardData.write(to: outputDir.appendingPathComponent(filename))
  }
```

`ExportOptions(targetWidth:targetHeight:)` controls the output resolution. Each call returns the rendered image data, which we write to disk.

## Data-Driven Workflows

When populating a template mutates state you don't want to carry between records, reload the saved string before each one. `engine.scene.load(from:)` restores the template to its saved state, then you apply that record's data and export.

```swift highlight-useTemplatesProgrammatic-dataDriven
  // Reload the saved template before each record so prior edits never carry over.
  let records = [
    (name: "Diana", message: "Welcome to the team!"),
    (name: "Eve", message: "Great work this quarter!"),
  ]
  for record in records {
    try await engine.scene.load(from: templateString)
    guard let recordPage = try engine.block.find(byType: .page).first else { continue }
    try engine.variable.set(key: "recipientName", value: record.name)
    try engine.variable.set(key: "customMessage", value: record.message)

    let recordData = try await engine.block.export(recordPage, mimeType: .png)
    try recordData.write(to: outputDir.appendingPathComponent("record-\(record.name.lowercased()).png"))
  }
```

This pattern powers personalized certificates, greeting cards, and social media graphics generated from a single design.

## Managing Variables

Variable keys are case-sensitive and persist with the scene. Remove one with `engine.variable.remove(key:)` when it's no longer needed; any text that still references it keeps the literal `{{token}}`.

```swift highlight-useTemplatesProgrammatic-removeVariable
// Variable keys are case-sensitive and persist with the scene. Removing a
// variable leaves its literal token in any text that still references it.
try engine.variable.remove(key: "customMessage")
print("Variables after removal:", engine.variable.findAll())
```

## Loading Existing Templates

Templates don't have to be built in code. Load a pre-built scene from a URL with `engine.scene.load(from:)`. This replaces the current scene with the template's pages, blocks, variables, and placeholders.

```swift highlight-useTemplatesProgrammatic-loadExisting
// Load a pre-built template from a URL. This replaces the current scene with
// the template's pages, blocks, variables, and placeholders.
let templateAssetURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.load(from: templateAssetURL)
```

For templates bundled with their assets, `engine.scene.load(from:)` loads the complete package. To merge a template into the current scene instead of replacing it, use `engine.scene.applyTemplate(from:)`.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.create()` | Create a blank scene to build a template |
| `engine.block.create(_:)` | Create a new design block |
| `engine.block.appendChild(to:child:)` | Add a block to the scene hierarchy |
| `engine.block.setPositionX(_:value:)` | Set a block's horizontal position |
| `engine.block.setPositionY(_:value:)` | Set a block's vertical position |
| `engine.block.setWidth(_:value:)` | Set a block's width |
| `engine.block.setHeight(_:value:)` | Set a block's height |
| `engine.block.replaceText(_:text:)` | Set text content, including `{{variable}}` tokens |
| `engine.block.referencesAnyVariables(_:)` | Check whether a block uses variables |
| `engine.block.find(byType:)` | Find blocks of a given type, such as `.page` |
| `engine.variable.set(key:value:)` | Create or update a text variable |
| `engine.variable.get(key:)` | Read a variable's current value |
| `engine.variable.findAll()` | List every variable key in the scene |
| `engine.variable.remove(key:)` | Delete a variable from the scene |
| `engine.scene.saveToString()` | Serialize the scene to a portable string |
| `engine.scene.load(from:)` | Load a scene from a string or URL |
| `engine.block.export(_:mimeType:options:)` | Export a block to image data |

## Troubleshooting

**Template loading failures:** Verify scene strings are correctly encoded and URLs are reachable. Wrap loading calls in `do`/`catch` to handle network or parsing errors.

**Variables not replacing text:** Variable keys inside `{{}}` must exactly match the keys passed to `engine.variable.set(key:value:)`. Keys are case-sensitive.

**Export issues:** Confirm all required assets are reachable before exporting. Missing images or fonts cause export failures. Check the block hierarchy—orphaned blocks that aren't connected to the page tree don't appear in exports.

## Next Steps

- [Create From Scratch](../create-templates/from-scratch.md) — Build reusable template structures block by block.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — Define dynamic text elements populated at runtime.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — Mark editable image, video, and text areas in a locked layout.
- [Automate Design Generation](../automation/design-generation.md) — Generate on-brand designs programmatically from templates.
- [Save](../export-save-publish/save.md) — Persist designs locally or to a backend for later editing.
- [Data Merge](../automation/data-merge.md) — Generate personalized designs by merging external data into templates.&#x20;



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support