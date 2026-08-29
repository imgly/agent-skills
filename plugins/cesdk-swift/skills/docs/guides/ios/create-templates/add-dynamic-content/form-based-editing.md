> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Form-Based Editing](./form-based-editing.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-templates-form-based-editing/FormBasedEditing.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func formBasedEditing(engine: Engine) async throws {
  // Resolve sample images against the engine's configured base URL.
  let baseURL = try engine.guidesBaseURL

  // Demo scaffolding: build a small template inline so this example runs
  // standalone. In production, replace everything up to the "Discover" section
  // with a single `engine.scene.load(from: templateURL)` call that loads a
  // template your team authored on the web — its variable tokens, defined
  // variables, and placeholder blocks are already in place.
  // Create the scene with a pixel design unit. Passing the design unit to
  // `create` also pairs the font-size unit to pixels, so the `text/fontSize`
  // values below are interpreted as pixels — the default font-size unit is
  // points, which the scene's DPI would otherwise scale up.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 600)
  try engine.block.setHeight(page, value: 800)
  try engine.block.appendChild(to: scene, child: page)

  // A heading that references the `tag` variable. It renders with the engine's
  // default font and a black fill; the example sets a larger font size than the
  // subtitle for visual hierarchy.
  let title = try engine.block.create(.text)
  try engine.block.replaceText(title, text: "{{tag}}!")
  try engine.block.setFloat(title, property: "text/fontSize", value: 56)
  try engine.block.setWidth(title, value: 500)
  try engine.block.setPositionX(title, value: 50)
  try engine.block.setPositionY(title, value: 50)
  try engine.block.appendChild(to: page, child: title)

  let subtitle = try engine.block.create(.text)
  // Reference a variable in text by wrapping its name in double curly braces.
  // The engine substitutes `{{tagline}}` with the variable's value at render time.
  try engine.block.replaceText(subtitle, text: "{{tagline}}")

  // `referencesAnyVariables(_:)` confirms a block depends on variable tokens.
  let subtitleUsesVariables = try engine.block.referencesAnyVariables(subtitle)
  print("Subtitle references variables:", subtitleUsesVariables)
  // A smaller font size than the heading gives the form a clear hierarchy.
  try engine.block.setFloat(subtitle, property: "text/fontSize", value: 32)
  try engine.block.setWidth(subtitle, value: 500)
  try engine.block.setPositionX(subtitle, value: 50)
  try engine.block.setPositionY(subtitle, value: 140)
  try engine.block.appendChild(to: page, child: subtitle)

  // An image block marked as a placeholder so users can swap its content.
  let image = try engine.block.create(.graphic)
  try engine.block.setShape(image, shape: engine.block.createShape(.rect))
  let imageFill = try engine.block.createFill(.image)
  try engine.block.setURL(
    imageFill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(image, fill: imageFill)
  try engine.block.setWidth(image, value: 500)
  try engine.block.setHeight(image, value: 400)
  try engine.block.setPositionX(image, value: 50)
  try engine.block.setPositionY(image, value: 250)
  try engine.block.setPlaceholderEnabled(image, enabled: true)
  try engine.block.appendChild(to: page, child: image)

  // Give each variable an initial value. A web-authored template ships with
  // these defaults already set; here we define them so the form has something
  // to show on first load.
  try engine.variable.set(key: "tag", value: "Welcome")
  try engine.variable.set(key: "tagline", value: "Your personalized design")

  // List every variable the template defines — render one form field per entry.
  let variableNames = engine.variable.findAll()

  // Find image placeholders: graphic blocks flagged as placeholders.
  let graphicBlocks = try engine.block.find(byType: .graphic)
  let placeholders = try graphicBlocks.filter { try engine.block.isPlaceholderEnabled($0) }
  print("Variables:", variableNames, "Placeholders:", placeholders.count)

  // Read a variable to seed a form field, then write the user's edit back.
  // In SwiftUI, call the setter from a TextField's `onChange(of:)` handler.
  let currentTag = try engine.variable.get(key: "tag")
  print("Seeding field with:", currentTag)
  try engine.variable.set(key: "tag", value: "Hello")

  // Read a placeholder's current image so the form can preview it.
  guard let placeholder = placeholders.first else { return }
  let fill = try engine.block.getFill(placeholder)
  let currentImageURL = try engine.block.getURL(fill, property: "fill/image/imageFileURI")
  print("Current placeholder image:", currentImageURL.lastPathComponent)

  // Swap the placeholder's content when the user picks a new image. Point the
  // fill at any local file URL — a photo from the picker, a bundled asset, or
  // a downloaded file.
  try engine.block.setURL(
    fill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
  )

  // Apply an entire form's current values in one pass — for example when the
  // user taps "Apply". Keep your form state in a dictionary keyed by variable
  // name and write each entry back through the engine.
  let formValues: [String: String] = [
    "tag": "Welcome Back",
    "tagline": "Built from form input",
  ]
  for (key, value) in formValues where variableNames.contains(key) {
    try engine.variable.set(key: key, value: value)
  }

  // Before exporting, confirm every variable the form exposes has a value.
  let missingFields = try variableNames.filter { try engine.variable.get(key: $0).isEmpty }
  guard missingFields.isEmpty else {
    print("Cannot export — required fields are empty:", missingFields)
    return
  }

  let exported = try await engine.block.export(page, mimeType: .png)
  print("Exported personalized template:", exported.count, "bytes")

  try await engine.captureGuide(page, label: "hero", mimeType: .png)
}
```

Expose a template's variables and placeholders through your own input controls so users customize designs by filling fields instead of manipulating the canvas — ideal for non-designers and consistent, on-brand output.

![A personalized template rendered by form-based editing — the heading and tagline show variable values substituted into the text, above a swapped placeholder image.](https://img.ly/docs/cesdk/ios/create-templates/add-dynamic-content/form-based-editing-a8a779/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260829/engine-guides-create-templates-form-based-editing)

<EngineReferenceNote {...props} />

Form-based editing turns template adoption into structured data entry. Instead of asking users to locate and edit elements on the canvas, you read a template's customization points with the headless Creative Engine and build your own form — text fields for variables, image pickers for placeholders — that writes values back through the engine API.

This guide walks through discovering a template's variables and placeholders, reading and updating their values, replacing placeholder images, and validating input before export.

## Understanding Form-Based Editing

Form-based editing replaces direct canvas manipulation with input controls you design yourself. Two kinds of customization points drive a form:

- **Variables** hold text values referenced from text blocks. Each variable maps to a text field.
- **Placeholders** are image blocks marked as editable. Each maps to an image picker.

You discover both programmatically, render matching controls in a SwiftUI form, and write user input back through the engine. The engine updates the design immediately, so a live preview reflects every change. Because the form only exposes the fields you choose, the rest of the design stays locked and on-brand.

## Discovering Template Metadata

Inspect a loaded template to learn what it lets users customize. `engine.variable.findAll()` returns every defined variable name, and filtering graphic blocks by `isPlaceholderEnabled(_:)` finds the editable images.

```swift highlight-formBasedEditing-discover
  // List every variable the template defines — render one form field per entry.
  let variableNames = engine.variable.findAll()

  // Find image placeholders: graphic blocks flagged as placeholders.
  let graphicBlocks = try engine.block.find(byType: .graphic)
  let placeholders = try graphicBlocks.filter { try engine.block.isPlaceholderEnabled($0) }
  print("Variables:", variableNames, "Placeholders:", placeholders.count)
```

Use one form field per variable name and one image picker per placeholder. `engine.block.findAllPlaceholders()` is a convenience that returns the placeholder blocks directly if you do not need the intermediate graphic-block list.

## Working with Variables

Variables store text values that text blocks reference with a `{{variableName}}` token. The engine substitutes the value at render time.

### Using Variables in Text

Reference a variable by wrapping its name in double curly braces. `referencesAnyVariables(_:)` confirms whether a block depends on variables before you expose it in a form.

```swift highlight-formBasedEditing-useVariableInText
  // Reference a variable in text by wrapping its name in double curly braces.
  // The engine substitutes `{{tagline}}` with the variable's value at render time.
  try engine.block.replaceText(subtitle, text: "{{tagline}}")

  // `referencesAnyVariables(_:)` confirms a block depends on variable tokens.
  let subtitleUsesVariables = try engine.block.referencesAnyVariables(subtitle)
  print("Subtitle references variables:", subtitleUsesVariables)
```

### Defining Variables

Give each variable an initial value so the form shows something on first load. A template authored on the web ships with these defaults already set; when you build a template in code, define them with `engine.variable.set(key:value:)`.

```swift highlight-formBasedEditing-defineVariables
// Give each variable an initial value. A web-authored template ships with
// these defaults already set; here we define them so the form has something
// to show on first load.
try engine.variable.set(key: "tag", value: "Welcome")
try engine.variable.set(key: "tagline", value: "Your personalized design")
```

### Updating Variables

Read a variable with `engine.variable.get(key:)` to seed a field, then write the user's edit back with `engine.variable.set(key:value:)`. Call the setter from a `TextField`'s `onChange(of:)` handler so the design updates as the user types.

```swift highlight-formBasedEditing-updateVariables
// Read a variable to seed a form field, then write the user's edit back.
// In SwiftUI, call the setter from a TextField's `onChange(of:)` handler.
let currentTag = try engine.variable.get(key: "tag")
print("Seeding field with:", currentTag)
try engine.variable.set(key: "tag", value: "Hello")
```

## Replacing Placeholder Content

Placeholders are graphic blocks marked editable, letting users replace images while the rest of the design stays fixed.

### Reading the Current Image

Read a placeholder's fill to preview its current image in the form. `engine.block.getURL(_:property:)` returns the image's file URL.

```swift highlight-formBasedEditing-getFill
// Read a placeholder's current image so the form can preview it.
guard let placeholder = placeholders.first else { return }
let fill = try engine.block.getFill(placeholder)
let currentImageURL = try engine.block.getURL(fill, property: "fill/image/imageFileURI")
print("Current placeholder image:", currentImageURL.lastPathComponent)
```

### Setting a New Image

Swap the image by pointing the same fill at a new file URL with `engine.block.setURL(_:property:value:)`. The URL can come from a photo picker, a bundled asset, or a downloaded file.

```swift highlight-formBasedEditing-setFill
// Swap the placeholder's content when the user picks a new image. Point the
// fill at any local file URL — a photo from the picker, a bundled asset, or
// a downloaded file.
try engine.block.setURL(
  fill,
  property: "fill/image/imageFileURI",
  value: baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
)
```

## Driving Updates from Your Own Form

Keep your form state in a dictionary keyed by variable name, then write each entry back through the engine in one pass — for example when the user taps "Apply". The same engine API works regardless of the UI framework you build the form with.

```swift highlight-formBasedEditing-driveUpdates
// Apply an entire form's current values in one pass — for example when the
// user taps "Apply". Keep your form state in a dictionary keyed by variable
// name and write each entry back through the engine.
let formValues: [String: String] = [
  "tag": "Welcome Back",
  "tagline": "Built from form input",
]
for (key, value) in formValues where variableNames.contains(key) {
  try engine.variable.set(key: key, value: value)
}
```

### Validating Before Export

Before exporting, confirm every variable the form exposes has a value. Read each one with `engine.variable.get(key:)` and block the export while any are empty, then render the finished design with `engine.block.export(_:mimeType:)`.

```swift highlight-formBasedEditing-validate
  // Before exporting, confirm every variable the form exposes has a value.
  let missingFields = try variableNames.filter { try engine.variable.get(key: $0).isEmpty }
  guard missingFields.isEmpty else {
    print("Cannot export — required fields are empty:", missingFields)
    return
  }

  let exported = try await engine.block.export(page, mimeType: .png)
  print("Exported personalized template:", exported.count, "bytes")
```

## Error Handling

Engine calls throw, so handle failures where they can occur:

- **Missing values**: Validate before export and tell users which fields are required.
- **Invalid images**: Check a file's type before assigning it to a placeholder fill.
- **Unreachable files**: Handle failures when loading images from a URL.
- **Unknown variables**: `engine.variable.get(key:)` throws if the key was never defined — guard against keys your form does not recognize.

## API Reference

| Method | Description |
|--------|-------------|
| `engine.variable.findAll()` | List every variable name defined in the template |
| `engine.variable.get(key:)` | Read a variable's current value |
| `engine.variable.set(key:value:)` | Set or update a variable's value |
| `engine.block.referencesAnyVariables(_:)` | Check whether a block depends on variables |
| `engine.block.find(byType:)` | Find blocks by type, such as `.graphic` |
| `engine.block.isPlaceholderEnabled(_:)` | Check whether a block is an editable placeholder |
| `engine.block.findAllPlaceholders()` | Return every placeholder block in the scene |
| `engine.block.getFill(_:)` | Get the fill block of a design block |
| `engine.block.getURL(_:property:)` | Read a URL property, such as an image fill's file URI |
| `engine.block.setURL(_:property:value:)` | Set a URL property to replace placeholder content |
| `engine.block.export(_:mimeType:)` | Export the finished design as image data |

## Next Steps

- [Text Variables](./text-variables.md) — Deep dive into variable management.
- [Placeholders](./placeholders.md) — Understand placeholder configuration.
- [Lock the Template](../lock.md) — Combine forms with locked designs.
- [Set Editing Constraints](./set-editing-constraints.md) — Fine-tune what users can modify.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support