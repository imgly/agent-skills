> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Templating](./templating.md)

---

Templates transform static designs into dynamic, data-driven content. They combine reusable layouts with variable text and placeholder media, enabling personalization at scale.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260903/engine-guides-concepts-templating)

A template is a regular CE.SDK scene that contains **variable tokens** in text and **placeholder blocks** for media. When you load a template, you can populate the variables with data and swap placeholder content—producing personalized designs without modifying the underlying layout.

```swift file=@cesdk_swift_examples/engine-guides-concepts-templating/Templating.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func templating(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let templateURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.load(from: templateURL)

  let variableNames = engine.variable.findAll()
  print("Template variables:", variableNames)

  try engine.variable.set(key: "Name", value: "Jane")
  try engine.variable.set(key: "Greeting", value: "Wish you were here!")

  let placeholders = engine.block.findAllPlaceholders()
  print("Template placeholders:", placeholders.count)
}
```

This guide explains the core concepts. For implementation details, see the guides linked in each section.

## What Makes a Template

Any CE.SDK scene can become a template by adding dynamic elements:

| Element | Purpose | Example |
|---------|---------|---------|
| **Variables** | Dynamic text replacement | `Hello, {{firstName}}!` |
| **Placeholders** | Swappable media slots | Profile photo, product image |
| **Editing Constraints** | Protected design elements | Locked logo, fixed layout |

Templates separate **design** (created once by designers) from **content** (populated at runtime with data). This enables workflows like batch generation, form-based customization, and user personalization.

## Loading Templates

Load a template from a URL using `engine.scene.load(from:)`. This loads the template's structure into the engine, including any pages, blocks, variables, and placeholders.

```swift highlight-templating-loadTemplate
let templateURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.load(from: templateURL)
```

Templates are standard CE.SDK scene files. You can load them from your own servers, CDNs, or cloud storage.

## Variables

Variables enable dynamic text without modifying the design structure. Text blocks contain `{{variableName}}` tokens that CE.SDK resolves at render time.

### Discovering Variables

Use `engine.variable.findAll()` to discover what variables a template expects:

```swift highlight-templating-discoverVariables
let variableNames = engine.variable.findAll()
print("Template variables:", variableNames)
```

This returns an array of variable names defined in the template.

### Setting Variable Values

Populate variables with `engine.variable.set(key:value:)`:

```swift highlight-templating-setVariables
try engine.variable.set(key: "Name", value: "Jane")
try engine.variable.set(key: "Greeting", value: "Wish you were here!")
```

**How variables work:**

- Reference them in text blocks: `Welcome, {{name}}!`
- CE.SDK automatically updates all text blocks using that variable
- Tokens are case-sensitive; unmatched tokens render as literal text
- Variables are scene-scoped and persist when you save the template

[Learn more about text variables →](../create-templates/add-dynamic-content/text-variables.md)

## Placeholders

Placeholders mark blocks as content slots that users or automation can replace. When you enable placeholder behavior on an image block, it becomes a designated swap target.

### Discovering Placeholders

Use `engine.block.findAllPlaceholders()` to discover all placeholder blocks in a loaded template:

```swift highlight-templating-discoverPlaceholders
let placeholders = engine.block.findAllPlaceholders()
print("Template placeholders:", placeholders.count)
```

**How placeholders work:**

- Enable with `engine.block.setPlaceholderEnabled(_:enabled:)`
- Placeholder blocks are marked for content replacement
- You can programmatically replace placeholder content with new images or media

[Learn more about placeholders →](../create-templates/add-dynamic-content/placeholders.md)

## Template Workflows

Templates support several common workflows:

### Batch Generation

Load a template programmatically, iterate through data records, set variables for each record, and export personalized designs. This powers use cases like certificates, badges, and personalized marketing.

### Form-Based Customization

Load a template, present a form for variable values, and let users customize text while the design stays consistent. The editor UI handles placeholder replacement through drag-and-drop.

### Design Systems

Create template libraries where designers maintain approved layouts and automation populates them with data at scale.

## Creating Templates

Build templates by adding variable tokens to text blocks and configuring placeholder behavior on media blocks. Save with `engine.scene.saveToString()` or `engine.scene.saveToArchive()`.

[Learn more about creating templates →](../create-templates/from-scratch.md)

## Importing Templates

CE.SDK provides two approaches for working with templates:

**Load a template** with `engine.scene.load(from:)` to replace the current scene entirely, including page dimensions.

**Apply a template** with `engine.scene.applyTemplate(from:)` to merge template content into an existing scene while preserving current page dimensions.

## Next Steps

- [Create Templates From Scratch](../create-templates/from-scratch.md) — Build a reusable template with variables and placeholders.
- [Import Templates](../create-templates/import.md) — Load and import design templates into CE.SDK from URLs, archives, and serialized strings.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — Reference variables inside text blocks and update them at runtime.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — Mark blocks as swap targets for template consumers.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support