> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Use Templates](../create-templates.md) > [Edit or Remove Templates](./edit-or-remove.md)

---

```swift file=@cesdk_swift_examples/engine-guides-edit-or-remove-templates/EditOrRemoveTemplates.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editOrRemoveTemplates(engine: Engine) async throws {
  // Demo scaffolding: a scene with one page that serves as the template content.
  // Passing the design unit to `create` also pairs the font-size unit to pixels,
  // so the `text/fontSize` values below are interpreted as pixels — the default
  // font-size unit is points, which the scene's DPI would otherwise scale up.
  let scene = try engine.scene.create(designUnit: .px)
  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)
  let pageWidth = try engine.block.getWidth(page)
  let pageHeight = try engine.block.getHeight(page)

  try engine.asset.addLocalSource(sourceID: "my-templates", applyAsset: { [weak engine] asset in
    guard let engine, let uri = asset.meta?["uri"],
          let base64Content = uri.split(separator: ",", maxSplits: 1).dropFirst().first
    else { return nil }
    try await engine.scene.load(from: String(base64Content))
    return nil
  })

  let titleBlock = try engine.block.create(.text)
  try engine.block.replaceText(titleBlock, text: "Original Template")
  try engine.block.setFloat(titleBlock, property: "text/fontSize", value: 64)
  try engine.block.setWidthMode(titleBlock, mode: .auto)
  try engine.block.setHeightMode(titleBlock, mode: .auto)
  try engine.block.appendChild(to: page, child: titleBlock)

  let subtitleBlock = try engine.block.create(.text)
  try engine.block.replaceText(subtitleBlock, text: "A reusable starting point")
  try engine.block.setFloat(subtitleBlock, property: "text/fontSize", value: 42)
  try engine.block.setWidthMode(subtitleBlock, mode: .auto)
  try engine.block.setHeightMode(subtitleBlock, mode: .auto)
  try engine.block.appendChild(to: page, child: subtitleBlock)

  // Position the text blocks centered on the page.
  let titleWidth = try engine.block.getFrameWidth(titleBlock)
  let titleHeight = try engine.block.getFrameHeight(titleBlock)
  try engine.block.setPositionX(titleBlock, value: (pageWidth - titleWidth) / 2)
  try engine.block.setPositionY(titleBlock, value: pageHeight / 2 - titleHeight - 20)

  let subtitleWidth = try engine.block.getFrameWidth(subtitleBlock)
  try engine.block.setPositionX(subtitleBlock, value: (pageWidth - subtitleWidth) / 2)
  try engine.block.setPositionY(subtitleBlock, value: pageHeight / 2 + 20)

  // Capture the composed template for the guide's hero image (verification only —
  // not part of the rendered snippets).
  try await engine.captureGuide(page, label: "hero", mimeType: .png)

  let originalContent = try await engine.scene.saveToString()
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-original",
    meta: [
      "uri": "data:application/octet-stream;base64,\(originalContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Original Template"],
  ))

  try engine.block.replaceText(titleBlock, text: "Updated Template")
  try engine.block.replaceText(subtitleBlock, text: "This template was edited and saved")

  let updatedContent = try await engine.scene.saveToString()
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-updated",
    meta: [
      "uri": "data:application/octet-stream;base64,\(updatedContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Updated Template"],
  ))

  // Re-center the text blocks after the edits changed their frame sizes.
  let newTitleWidth = try engine.block.getFrameWidth(titleBlock)
  let newTitleHeight = try engine.block.getFrameHeight(titleBlock)
  try engine.block.setPositionX(titleBlock, value: (pageWidth - newTitleWidth) / 2)
  try engine.block.setPositionY(titleBlock, value: pageHeight / 2 - newTitleHeight - 20)

  let newSubtitleWidth = try engine.block.getFrameWidth(subtitleBlock)
  try engine.block.setPositionX(subtitleBlock, value: (pageWidth - newSubtitleWidth) / 2)

  // Add a temporary template to demonstrate removal.
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-temporary",
    meta: [
      "uri": "data:application/octet-stream;base64,\(originalContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Temporary Template"],
  ))

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-temporary")

  try engine.block.replaceText(subtitleBlock, text: "Updated again with new content")
  let reUpdatedContent = try await engine.scene.saveToString()

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-updated")
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-updated",
    meta: [
      "uri": "data:application/octet-stream;base64,\(reUpdatedContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Updated Template"],
  ))

  // Restore the original template content as the active scene.
  try await engine.scene.load(from: originalContent)
}

private func templateThumbnail(engine: Engine, page: DesignBlockID) async throws -> String {
  // `targetWidth` bounds the export so the thumbnail stays small.
  let data = try await engine.block.export(page, mimeType: .png, options: ExportOptions(targetWidth: 200))
  return "data:image/png;base64,\(data.base64EncodedString())"
}

```

Modify existing templates and manage template lifecycle in your asset library using CE.SDK.

![A template page with the centered heading "Original Template" above the subtitle "A reusable starting point".](https://img.ly/docs/cesdk/mac-catalyst/create-templates/edit-or-remove-38a8be/assets/swift-based.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1-rc.0/engine-guides-edit-or-remove-templates)

<EngineReferenceNote {...props} />

Templates evolve as designs change. You might need to update branding, fix content errors, or remove outdated templates from your library. CE.SDK provides APIs for adding, editing, and removing templates from asset sources.

This guide covers how to add templates to asset sources, edit template content, remove templates, and save updated versions.

## Adding Templates

First, create a local asset source to store your templates. The `applyAsset` callback runs when a template from this source is applied to the scene — it reads the base64 scene data from the asset's `uri` metadata entry and loads it with `engine.scene.load(from:)`. Return `nil` because applying a template replaces the current scene content rather than creating a new block. The source retains this callback for its lifetime, so capture the engine weakly to avoid risking a retain cycle.

```swift highlight-editOrRemoveTemplates-createSource
try engine.asset.addLocalSource(sourceID: "my-templates", applyAsset: { [weak engine] asset in
  guard let engine, let uri = asset.meta?["uri"],
        let base64Content = uri.split(separator: ",", maxSplits: 1).dropFirst().first
  else { return nil }
  try await engine.scene.load(from: String(base64Content))
  return nil
})
```

Next, create your template content using block APIs:

```swift highlight-editOrRemoveTemplates-createTemplate
  let titleBlock = try engine.block.create(.text)
  try engine.block.replaceText(titleBlock, text: "Original Template")
  try engine.block.setFloat(titleBlock, property: "text/fontSize", value: 64)
  try engine.block.setWidthMode(titleBlock, mode: .auto)
  try engine.block.setHeightMode(titleBlock, mode: .auto)
  try engine.block.appendChild(to: page, child: titleBlock)

  let subtitleBlock = try engine.block.create(.text)
  try engine.block.replaceText(subtitleBlock, text: "A reusable starting point")
  try engine.block.setFloat(subtitleBlock, property: "text/fontSize", value: 42)
  try engine.block.setWidthMode(subtitleBlock, mode: .auto)
  try engine.block.setHeightMode(subtitleBlock, mode: .auto)
  try engine.block.appendChild(to: page, child: subtitleBlock)
```

Then save the template with `saveToString()` and add it to the asset source using `addAsset(to:asset:)`. Each template needs a unique ID, a label, and metadata containing the template URI and thumbnail:

```swift highlight-editOrRemoveTemplates-addToSource
let originalContent = try await engine.scene.saveToString()
try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
  id: "template-original",
  meta: [
    "uri": "data:application/octet-stream;base64,\(originalContent)",
    "thumbUri": try await templateThumbnail(engine: engine, page: page),
  ],
  label: ["en": "Original Template"],
))
```

The `uri` entry in the `meta` dictionary contains the template content as a data URI. The `thumbUri` entry provides the thumbnail the asset library displays. The example exports the rendered template to a small PNG with `engine.block.export(_:mimeType:options:)`, so the thumbnail previews the actual content:

```swift highlight-editOrRemoveTemplates-thumbnailHelper
private func templateThumbnail(engine: Engine, page: DesignBlockID) async throws -> String {
  // `targetWidth` bounds the export so the thumbnail stays small.
  let data = try await engine.block.export(page, mimeType: .png, options: ExportOptions(targetWidth: 200))
  return "data:image/png;base64,\(data.base64EncodedString())"
}
```

> **Note:** Use a raster format such as PNG or JPEG for `thumbUri`. The asset library displays raster thumbnails directly across platforms; vector formats like SVG are not decoded by the native image loaders and render as broken thumbnails.

## Editing Templates

Modify template content using block APIs. The example updates the text blocks with `replaceText(_:text:)`; the same pattern applies to any block property, such as image fills or positions.

```swift highlight-editOrRemoveTemplates-modifyTemplate
  try engine.block.replaceText(titleBlock, text: "Updated Template")
  try engine.block.replaceText(subtitleBlock, text: "This template was edited and saved")

  let updatedContent = try await engine.scene.saveToString()
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-updated",
    meta: [
      "uri": "data:application/octet-stream;base64,\(updatedContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Updated Template"],
  ))
```

After editing, save the modified template as a new asset or update an existing one.

## Removing Templates

Remove templates from asset sources using `removeAsset(from:assetID:)`. This permanently deletes the template entry from the source.

```swift highlight-editOrRemoveTemplates-removeTemplate
  // Add a temporary template to demonstrate removal.
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-temporary",
    meta: [
      "uri": "data:application/octet-stream;base64,\(originalContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Temporary Template"],
  ))

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-temporary")
```

> **Warning:** Removal is permanent. The template is no longer accessible from the asset source after removal. If you need to restore templates, maintain backups or implement a soft-delete mechanism.

## Saving Updated Templates

To update an existing template, first remove it using `removeAsset(from:assetID:)`, then add the updated version with `addAsset(to:asset:)` using the same asset ID. Adding an asset whose ID already exists in the source throws an error, so the removal has to come first.

```swift highlight-editOrRemoveTemplates-updateInSource
  try engine.block.replaceText(subtitleBlock, text: "Updated again with new content")
  let reUpdatedContent = try await engine.scene.saveToString()

  try engine.asset.removeAsset(from: "my-templates", assetID: "template-updated")
  try engine.asset.addAsset(to: "my-templates", asset: AssetDefinition(
    id: "template-updated",
    meta: [
      "uri": "data:application/octet-stream;base64,\(reUpdatedContent)",
      "thumbUri": try await templateThumbnail(engine: engine, page: page),
    ],
    label: ["en": "Updated Template"],
  ))
```

Reusing the asset ID keeps existing references to the template valid while the content changes underneath.

## Best Practices

### Versioning Strategies

When managing template updates, consider these approaches:

- **Replace in place**: Reuse the same asset ID — remove the old entry, then add the update. Existing references to the template keep working.
- **Version suffixes**: Create new entries with version identifiers (e.g., `template-v2`). This preserves old versions while introducing new ones.
- **Archive old versions**: Move deprecated templates to a separate source before removal. This maintains a history without cluttering the main library.

### Change Notifications

Each `addAsset(to:asset:)` and `removeAsset(from:assetID:)` call emits a contents-changed signal for its source, so observers of the source stay up to date without extra work. Call `assetSourceContentsChanged(sourceID:)` explicitly when template data changes through a path the engine can't observe — for example, when the backing store of a custom asset source updates.

### Template IDs

Use descriptive, unique IDs that reflect the template's purpose (e.g., `marketing-banner-2024`, `social-post-square`). Consistent naming conventions make templates easier to find and manage programmatically.

### Thumbnails

Generate meaningful thumbnails that accurately represent template content. Good thumbnails improve discoverability in the asset library and help users quickly identify the right template.

### Memory Considerations

Templates stored as base64 data URIs remain in memory. For production applications with many templates, consider storing template content externally and using URLs in the `uri` metadata entry instead of inline data URIs.

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSource(sourceID:applyAsset:)` | Create a local asset source |
| `engine.asset.addAsset(to:asset:)` | Add a template to an asset source |
| `engine.asset.removeAsset(from:assetID:)` | Remove a template from an asset source |
| `engine.asset.assetSourceContentsChanged(sourceID:)` | Signal observers that a source's contents changed |
| `engine.scene.saveToString()` | Save the scene as a base64 string |
| `engine.scene.load(from:)` | Load a scene from a base64 string |
| `engine.block.export(_:mimeType:options:)` | Render a block to image data (used for the thumbnail) |



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support