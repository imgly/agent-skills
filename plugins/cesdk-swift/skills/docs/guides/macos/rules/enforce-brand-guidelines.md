> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Rules](../rules.md) > [Enforce Brand Guidelines](./enforce-brand-guidelines.md)

---

```swift file=@cesdk_swift_examples/engine-guides-enforce-brand-guidelines/EnforceBrandGuidelines.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func enforceBrandGuidelines(engine: Engine) async throws {
  // Demo scaffolding: create the design scene and page that hosts the brand
  // template. In your app this is whatever scene the user is editing.
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1200)
  try engine.block.setHeight(page, value: 800)
  try engine.block.appendChild(to: scene, child: page)
  let pageWidth = try engine.block.getWidth(page)
  let pageHeight = try engine.block.getHeight(page)
  // Demo scaffolding: a base URL for the example font files. Point the font
  // URLs below at your own brand font files instead.
  let fontBaseURL = try engine.guidesBaseURL

  try engine.asset.addLocalSource(sourceID: "ly.img.typeface")
  try engine.asset.addAsset(to: "ly.img.typeface", asset: AssetDefinition(
    id: "brand-sans",
    payload: AssetPayload(typeface: Typeface(name: "Brand Sans", fonts: [
      Font(
        uri: fontBaseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
        subFamily: "Regular",
        weight: .normal,
        style: .normal,
      ),
      Font(
        uri: fontBaseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
        subFamily: "Bold",
        weight: .bold,
        style: .normal,
      ),
    ])),
    label: ["en": "Brand Sans"],
  ))

  try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
  try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
  try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
  try engine.editor.setGlobalScope(key: "fill/changeType", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
  try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)
  try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
  try engine.editor.setGlobalScope(key: "text/character", value: .defer)

  let logoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(logoBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(logoBlock, value: 200)
  try engine.block.setHeight(logoBlock, value: 80)
  try engine.block.setPositionX(logoBlock, value: 40)
  try engine.block.setPositionY(logoBlock, value: 40)

  let logoFill = try engine.block.createFill(.color)
  try engine.block.setColor(logoFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.4, b: 0.8, a: 1.0))
  try engine.block.setFill(logoBlock, fill: logoFill)
  try engine.block.setName(logoBlock, name: "Company Logo")
  try engine.block.appendChild(to: page, child: logoBlock)

  try engine.block.setScopeEnabled(logoBlock, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(logoBlock, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(logoBlock, key: "fill/change", enabled: false)
  try engine.block.setScopeEnabled(logoBlock, key: "fill/changeType", enabled: false)
  try engine.block.setScopeEnabled(logoBlock, key: "lifecycle/destroy", enabled: false)
  try engine.block.setScopeEnabled(logoBlock, key: "lifecycle/duplicate", enabled: false)

  let legalText = try engine.block.create(.text)
  try engine.block.setWidth(legalText, value: pageWidth - 80)
  try engine.block.setHeight(legalText, value: 30)
  try engine.block.setPositionX(legalText, value: 40)
  try engine.block.setPositionY(legalText, value: pageHeight - 50)
  try engine.block.replaceText(legalText, text: "© 2024 Company Name. All rights reserved.")
  try engine.block.setFloat(legalText, property: "text/fontSize", value: 36)
  try engine.block.setName(legalText, name: "Legal Text")
  try engine.block.appendChild(to: page, child: legalText)

  try engine.block.setScopeEnabled(legalText, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "text/edit", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "text/character", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "lifecycle/destroy", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "lifecycle/duplicate", enabled: false)

  let contentBlock = try engine.block.create(.graphic)
  try engine.block.setShape(contentBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(contentBlock, value: 400)
  try engine.block.setHeight(contentBlock, value: 300)
  try engine.block.setPositionX(contentBlock, value: (pageWidth - 400) / 2)
  try engine.block.setPositionY(contentBlock, value: (pageHeight - 300) / 2)

  let contentFill = try engine.block.createFill(.color)
  try engine.block.setColor(contentFill, property: "fill/color/value", color: .rgba(r: 1.0, g: 0.6, b: 0.0, a: 1.0))
  try engine.block.setFill(contentBlock, fill: contentFill)
  try engine.block.setName(contentBlock, name: "Editable Content")
  try engine.block.appendChild(to: page, child: contentBlock)

  try engine.block.setScopeEnabled(contentBlock, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "layer/resize", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "fill/change", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "fill/changeType", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "lifecycle/destroy", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "lifecycle/duplicate", enabled: true)

  let editableText = try engine.block.create(.text)
  try engine.block.setWidth(editableText, value: 300)
  try engine.block.setHeight(editableText, value: 60)
  try engine.block.setPositionX(editableText, value: (pageWidth - 300) / 2)
  try engine.block.setPositionY(editableText, value: 150)
  try engine.block.replaceText(editableText, text: "Edit This Headline")
  try engine.block.setFloat(editableText, property: "text/fontSize", value: 64)
  try engine.block.setEnum(editableText, property: "text/horizontalAlignment", value: "Center")
  try engine.block.setName(editableText, name: "Editable Headline")
  try engine.block.appendChild(to: page, child: editableText)

  try engine.block.setScopeEnabled(editableText, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "layer/resize", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "text/character", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "lifecycle/destroy", enabled: true)

  let canMoveLogo = try engine.block.isAllowedByScope(logoBlock, key: "layer/move")
  let canEditLegal = try engine.block.isAllowedByScope(legalText, key: "text/edit")
  let canEditContent = try engine.block.isAllowedByScope(contentBlock, key: "fill/change")

  print("Logo is locked:", !canMoveLogo) // true
  print("Legal text is locked:", !canEditLegal) // true
  print("Content block is editable:", canEditContent) // true

  let blob = try await engine.block.export(page, mimeType: .png)
  let outputURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("enforce-brand-guidelines-result.png")
  try blob.write(to: outputURL)
}
```

Learn how to restrict the available fonts to brand typefaces and lock brand elements like logos and legal text from modification, while keeping the rest of a design fully editable.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-enforce-brand-guidelines)

<EngineReferenceNote {...props} />

Brand guidelines enforcement in CE.SDK combines two complementary approaches: restricting which assets users can choose and controlling what editing operations are permitted on brand elements. This guide restricts the available fonts to an approved set and uses the scopes system to lock brand elements like logos and legal text so they cannot be modified. On iOS, to restrict the colors users can pick in the editor, configure the editor's color palette — see the Color Palette guide. The example builds on a scene with a single page; adapt the block creation to the scene your app edits.

## Restricting Fonts to Brand Typefaces

Register the `ly.img.typeface` asset source with only your approved typefaces — instead of loading the default typeface source — so only brand fonts are available to choose from. On iOS, the editor's font picker reads its typefaces from this source, so it then offers only the registered brand fonts.

```swift highlight-enforceBrand-restrictFonts
try engine.asset.addLocalSource(sourceID: "ly.img.typeface")
try engine.asset.addAsset(to: "ly.img.typeface", asset: AssetDefinition(
  id: "brand-sans",
  payload: AssetPayload(typeface: Typeface(name: "Brand Sans", fonts: [
    Font(
      uri: fontBaseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Regular.ttf"),
      subFamily: "Regular",
      weight: .normal,
      style: .normal,
    ),
    Font(
      uri: fontBaseURL.appendingPathComponent("ly.img.typeface/fonts/Roboto/Roboto-Bold.ttf"),
      subFamily: "Bold",
      weight: .bold,
      style: .normal,
    ),
  ])),
  label: ["en": "Brand Sans"],
))
```

Each typeface has a name and a list of `Font` entries; every font carries a file URL, a subfamily name, a `FontWeight`, and a `FontStyle`. Point the font URLs at your own brand font files.

## Setting Global Scopes to Defer

Scopes control which operations are permitted. Setting a global scope to `.defer` hands the decision to each block, so per-block settings take effect. Without this, the global value (`.allow` or `.deny`) applies everywhere and block-level settings are ignored.

```swift highlight-enforceBrand-globalScopeDefer
try engine.editor.setGlobalScope(key: "layer/move", value: .defer)
try engine.editor.setGlobalScope(key: "layer/resize", value: .defer)
try engine.editor.setGlobalScope(key: "fill/change", value: .defer)
try engine.editor.setGlobalScope(key: "fill/changeType", value: .defer)
try engine.editor.setGlobalScope(key: "lifecycle/destroy", value: .defer)
try engine.editor.setGlobalScope(key: "lifecycle/duplicate", value: .defer)
try engine.editor.setGlobalScope(key: "text/edit", value: .defer)
try engine.editor.setGlobalScope(key: "text/character", value: .defer)
```

## Creating and Locking Brand Elements

### Creating a Logo Block

Create a brand element that represents the company logo and give it a fixed position, size, and brand color fill.

```swift highlight-enforceBrand-createLogo
  let logoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(logoBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(logoBlock, value: 200)
  try engine.block.setHeight(logoBlock, value: 80)
  try engine.block.setPositionX(logoBlock, value: 40)
  try engine.block.setPositionY(logoBlock, value: 40)

  let logoFill = try engine.block.createFill(.color)
  try engine.block.setColor(logoFill, property: "fill/color/value", color: .rgba(r: 0.2, g: 0.4, b: 0.8, a: 1.0))
  try engine.block.setFill(logoBlock, fill: logoFill)
  try engine.block.setName(logoBlock, name: "Company Logo")
  try engine.block.appendChild(to: page, child: logoBlock)
```

### Locking the Logo

Disable the relevant scopes on the logo so it cannot be moved, resized, recolored, duplicated, or deleted.

```swift highlight-enforceBrand-lockLogo
try engine.block.setScopeEnabled(logoBlock, key: "layer/move", enabled: false)
try engine.block.setScopeEnabled(logoBlock, key: "layer/resize", enabled: false)
try engine.block.setScopeEnabled(logoBlock, key: "fill/change", enabled: false)
try engine.block.setScopeEnabled(logoBlock, key: "fill/changeType", enabled: false)
try engine.block.setScopeEnabled(logoBlock, key: "lifecycle/destroy", enabled: false)
try engine.block.setScopeEnabled(logoBlock, key: "lifecycle/duplicate", enabled: false)
```

### Locking Legal Text

Create the legally required text and lock it the same way, additionally disabling `text/edit` so its wording cannot change, `text/character` so its font and styling stay fixed, and `lifecycle/duplicate` so it cannot be copied.

```swift highlight-enforceBrand-createLegalText
  let legalText = try engine.block.create(.text)
  try engine.block.setWidth(legalText, value: pageWidth - 80)
  try engine.block.setHeight(legalText, value: 30)
  try engine.block.setPositionX(legalText, value: 40)
  try engine.block.setPositionY(legalText, value: pageHeight - 50)
  try engine.block.replaceText(legalText, text: "© 2024 Company Name. All rights reserved.")
  try engine.block.setFloat(legalText, property: "text/fontSize", value: 36)
  try engine.block.setName(legalText, name: "Legal Text")
  try engine.block.appendChild(to: page, child: legalText)

  try engine.block.setScopeEnabled(legalText, key: "layer/move", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "layer/resize", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "text/edit", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "text/character", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "lifecycle/destroy", enabled: false)
  try engine.block.setScopeEnabled(legalText, key: "lifecycle/duplicate", enabled: false)
```

## Creating Editable Content Areas

While brand elements stay locked, other blocks can remain fully editable. Enable the scopes you want users to control on each editable block.

```swift highlight-enforceBrand-createEditableContent
  let contentBlock = try engine.block.create(.graphic)
  try engine.block.setShape(contentBlock, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(contentBlock, value: 400)
  try engine.block.setHeight(contentBlock, value: 300)
  try engine.block.setPositionX(contentBlock, value: (pageWidth - 400) / 2)
  try engine.block.setPositionY(contentBlock, value: (pageHeight - 300) / 2)

  let contentFill = try engine.block.createFill(.color)
  try engine.block.setColor(contentFill, property: "fill/color/value", color: .rgba(r: 1.0, g: 0.6, b: 0.0, a: 1.0))
  try engine.block.setFill(contentBlock, fill: contentFill)
  try engine.block.setName(contentBlock, name: "Editable Content")
  try engine.block.appendChild(to: page, child: contentBlock)

  try engine.block.setScopeEnabled(contentBlock, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "layer/resize", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "fill/change", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "fill/changeType", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "lifecycle/destroy", enabled: true)
  try engine.block.setScopeEnabled(contentBlock, key: "lifecycle/duplicate", enabled: true)
```

For text that should be editable, also enable `text/character` so users can restyle its font, style, and alignment:

```swift highlight-enforceBrand-createEditableText
  let editableText = try engine.block.create(.text)
  try engine.block.setWidth(editableText, value: 300)
  try engine.block.setHeight(editableText, value: 60)
  try engine.block.setPositionX(editableText, value: (pageWidth - 300) / 2)
  try engine.block.setPositionY(editableText, value: 150)
  try engine.block.replaceText(editableText, text: "Edit This Headline")
  try engine.block.setFloat(editableText, property: "text/fontSize", value: 64)
  try engine.block.setEnum(editableText, property: "text/horizontalAlignment", value: "Center")
  try engine.block.setName(editableText, name: "Editable Headline")
  try engine.block.appendChild(to: page, child: editableText)

  try engine.block.setScopeEnabled(editableText, key: "layer/move", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "layer/resize", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "text/edit", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "text/character", enabled: true)
  try engine.block.setScopeEnabled(editableText, key: "lifecycle/destroy", enabled: true)
```

## Validating Brand Compliance

Confirm that the constraints are enforced with `engine.block.isAllowedByScope(_:key:)`, which considers both the global and block-level scope settings.

```swift highlight-enforceBrand-validateCompliance
  let canMoveLogo = try engine.block.isAllowedByScope(logoBlock, key: "layer/move")
  let canEditLegal = try engine.block.isAllowedByScope(legalText, key: "text/edit")
  let canEditContent = try engine.block.isAllowedByScope(contentBlock, key: "fill/change")

  print("Logo is locked:", !canMoveLogo) // true
  print("Legal text is locked:", !canEditLegal) // true
  print("Content block is editable:", canEditContent) // true
```

## Exporting the Result

Export the page with the brand guidelines applied. The locked blocks remain part of the design and render alongside the editable content.

```swift highlight-enforceBrand-export
let blob = try await engine.block.export(page, mimeType: .png)
let outputURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("enforce-brand-guidelines-result.png")
try blob.write(to: outputURL)
```

## Troubleshooting

- **Locked elements still movable**: Make sure the global scope is set to `.defer` before changing block-level settings — block-level values are ignored while the global scope is `.allow` or `.deny`.
- **Brand elements still editable**: Confirm the matching scope (for example `lifecycle/destroy` or `text/edit`) is disabled on the specific block.
- **Validation always passes**: `isAllowedByScope(_:key:)` reflects the global scope unless it is `.defer`; verify the global scope before relying on block-level results.

## API Reference

| Method | Category | Purpose |
|--------|----------|---------|
| `engine.asset.addLocalSource(sourceID:)` | Asset | Create or register an asset source by ID |
| `engine.asset.addAsset(to:asset:)` | Asset | Add an asset (such as a brand typeface) to a source |
| `engine.editor.setGlobalScope(key:value:)` | Scope | Set an editor-wide scope to `.defer` for block-level control |
| `engine.block.setScopeEnabled(_:key:enabled:)` | Scope | Enable or disable a scope for a specific block |
| `engine.block.isAllowedByScope(_:key:)` | Scope | Check whether an operation is allowed |
| `engine.block.export(_:mimeType:)` | Block | Export the design with brand guidelines applied |



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support