> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Apply a Template](./apply-template.md)

---

```swift file=@cesdk_swift_examples/engine-guides-apply-template/ApplyTemplate.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func applyTemplate(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1080)
  try engine.block.setHeight(page, value: 1920)

  let templateURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  try await engine.scene.applyTemplate(from: templateURL)

  guard let appliedPage = try engine.scene.getPages().first else { return }
  let width = try engine.block.getWidth(appliedPage)
  let height = try engine.block.getHeight(appliedPage)
  print("Page dimensions preserved: \(width) x \(height)")

  let alternativeTemplateURL = baseURL
    .appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene")
  try await engine.scene.applyTemplate(from: alternativeTemplateURL)

  // A serialized scene string, here read from the template file. In production
  // it typically comes from your database or an API response.
  let templateData = try await URLSession.shared.data(from: templateURL).0
  guard let templateString = String(bytes: templateData, encoding: .utf8) else { return }
  try await engine.scene.applyTemplate(from: templateString)
}
```

Apply template content to an existing scene with the Swift Engine API while
keeping your current page dimensions and design unit. Template content is
automatically scaled to fit, so you can switch layouts without changing the
canvas size.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-apply-template)

<EngineReferenceNote {...props} />

Applying a template loads the template's content into the current scene while keeping the scene's design unit and page dimensions. The content is resized to fit those dimensions. This differs from `scene.load(from:)`, which replaces the entire scene, including its dimensions.

This guide covers applying templates from a URL and from a serialized string, verifying that page dimensions stay fixed, and switching between templates on the same scene.

## When to Use Apply vs Load

Use `applyTemplate(from:)` when you want to:

- **Switch templates**: Let users preview different templates while keeping a consistent canvas size.
- **Standardize output dimensions**: Generate content with fixed sizes, such as social-media formats or print sizes.
- **Batch process with templates**: Apply different templates to a pre-configured scene without dimension drift.

Use `scene.load(from:)` when you need the template's original dimensions.

**Key distinction**: Loading replaces everything, including dimensions; applying keeps your dimensions and resizes the template's content to fit.

## Apply a Template from URL

Create a scene and set the page dimensions you want to keep. These dimensions are preserved when the template is applied.

```swift highlight-applyTemplate-setup
let scene = try engine.scene.create()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1080)
try engine.block.setHeight(page, value: 1920)
```

Call `applyTemplate(from:)` with the template's URL. The template's content is resized automatically to fit the current page dimensions. The method throws if no scene exists yet, so create or load one first.

```swift highlight-applyTemplate-fromURL
let templateURL = baseURL
  .appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
try await engine.scene.applyTemplate(from: templateURL)
```

## Verify Preserved Dimensions

Applying a template reloads the scene, so query the current page again with `scene.getPages()` before reading its size. The width and height match the values set during setup, confirming the template adopted your dimensions instead of its own.

```swift highlight-applyTemplate-verifyDimensions
guard let appliedPage = try engine.scene.getPages().first else { return }
let width = try engine.block.getWidth(appliedPage)
let height = try engine.block.getHeight(appliedPage)
print("Page dimensions preserved: \(width) x \(height)")
```

## Template Switching

Apply another template to the same scene. Each call replaces the content while preserving the page dimensions and design unit, which is the basis for a "preview" experience where users explore different templates without affecting their canvas size.

```swift highlight-applyTemplate-switching
let alternativeTemplateURL = baseURL
  .appendingPathComponent("ly.img.templates/templates/cesdk_blank_1.scene")
try await engine.scene.applyTemplate(from: alternativeTemplateURL)
```

## Apply a Template from String

For templates stored in a database or returned from an API, pass the serialized scene contents to `applyTemplate(from:)` as a base64 string instead of a URL. The example reads the string from the template file; in your app it comes from your own storage.

```swift highlight-applyTemplate-fromString
// A serialized scene string, here read from the template file. In production
// it typically comes from your database or an API response.
let templateData = try await URLSession.shared.data(from: templateURL).0
guard let templateString = String(bytes: templateData, encoding: .utf8) else { return }
try await engine.scene.applyTemplate(from: templateString)
```

## Troubleshooting

### No Scene Loaded

`applyTemplate(from:)` requires an existing scene. Create one first with `engine.scene.create()` or load one with `engine.scene.load(from:)`; otherwise the call throws.

### Template Not Accessible

Verify the template URL is reachable and valid. For remote URLs, check network connectivity; for bundled files, confirm the resource path resolves.

### Content Not Scaling as Expected

Template content scales to fit the current page dimensions. Set the page dimensions before applying the template so the content adjusts to the size you expect.

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `scene.applyTemplate(from: URL)` | Scene | Apply a template from a URL, preserving current dimensions |
| `scene.applyTemplate(from: String)` | Scene | Apply a template from a base64 string, preserving current dimensions |
| `scene.create()` | Scene | Create a new scene as the target for template application |
| `scene.getPages()` | Scene | Read the scene's pages to verify dimensions |
| `block.create(.page)` | Block | Create a page block |
| `block.appendChild(to:child:)` | Block | Add the page to the scene |
| `block.setWidth(_:value:)` | Block | Set the page width |
| `block.setHeight(_:value:)` | Block | Set the page height |
| `block.getWidth(_:)` | Block | Read the page width |
| `block.getHeight(_:)` | Block | Read the page height |

## Next Steps

- [Templates Overview](./overview.md) — Understanding templates in CE.SDK
- [Use Templates Programmatically](./programmatic.md) — Comprehensive programmatic template workflows
- [Generate From Template](./generate.md) — Generate finished designs by loading, populating, and exporting templates&#x20;



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support