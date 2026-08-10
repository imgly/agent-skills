> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Force Crop](./force-crop.md)

---

```swift file=@cesdk_swift_examples/editor-guides-force-crop/ForceCropSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

// CE.SDK Guide: Force Crop
//
// This example demonstrates how to enforce specific aspect ratios
// on design blocks using the force crop API.

// MARK: - Solution View

struct ForceCropSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey,
    userID: "<your unique user id>",
  )

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        EditorConfiguration { builder in
          builder.onCreate { engine, _ in
            let imageURL = Bundle.main.url(forResource: "sample_image", withExtension: "jpg")!
            try await engine.scene.create(fromImage: imageURL)
            let basePath = try engine.editor.getSettingString("basePath")
            guard let baseURL = URL(string: basePath) else { return }
            let sourceIDs = [
              "ly.img.sticker", "ly.img.vector.shape", "ly.img.filter", "ly.img.color.palette",
              "ly.img.effect", "ly.img.blur", "ly.img.typeface", "ly.img.crop.presets",
              "ly.img.page.presets", "ly.img.text", "ly.img.text.styles", "ly.img.text.curves",
              "ly.img.text.components", "ly.img.image",
            ]
            try await withThrowingTaskGroup(of: String.self) { group in
              for id in sourceIDs {
                group.addTask {
                  try await engine.asset.addLocalAssetSourceFromJSON(
                    baseURL.appendingPathComponent(id).appendingPathComponent("content.json"),
                  )
                }
              }
              for try await _ in group {}
            }
            try engine.asset.addLocalSource(
              sourceID: "ly.img.image.upload",
              supportedMimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/apng", "image/bmp"],
            )
          }

          builder.onLoaded { context, existing in
            guard let page = try context.engine.scene.getCurrentPage() else { return }

            let sourceID = "ly.img.crop.presets"

            context.eventHandler.send(.applyForceCrop(
              to: page,
              with: [
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-1-1"),
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-16-9"),
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-9-16"),
              ],
              mode: .ifNeeded,
            ))

            try await existing()
          }
        }
      }
  }
}

// MARK: - Preview

#Preview {
  ForceCropSolution()
}
```

Enforce specific aspect ratios or fixed dimensions on design blocks using the force crop API.

![Force crop applied in the photo editor](https://img.ly/docs/cesdk/ios/user-interface/customization/force-crop-c2854e/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/editor-guides-force-crop)

## Overview

Force cropping ensures that a page or any croppable block uses a specific aspect ratio or fixed size when the editor loads. We send an `.applyForceCrop` event through the editor's event handler, providing the target design block, an array of `ForceCropPreset` candidates, and a `ForceCropMode`.

| Type | Purpose |
| ---- | ------- |
| `ForceCropPreset` | Identifies a crop preset by source ID and preset ID |
| `ForceCropMode` | Controls crop UI behavior: `.silent`, `.always`, or `.ifNeeded` |

When multiple candidates are provided, the system automatically selects the best match based on the block's current dimensions.

## Setting Up Force Crop

In the `onLoaded` callback, we get the current page and send the force crop event with preset candidates from the `ly.img.crop.presets` asset source.

```swift highlight-forceCrop-setup
          builder.onLoaded { context, existing in
            guard let page = try context.engine.scene.getCurrentPage() else { return }

            let sourceID = "ly.img.crop.presets"

            context.eventHandler.send(.applyForceCrop(
              to: page,
              with: [
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-1-1"),
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-16-9"),
                ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-9-16"),
              ],
              mode: .ifNeeded,
            ))

            try await existing()
          }
```

## Applying Force Crop

We send the `.applyForceCrop` event with the page, preset candidates, and mode. The event can be fired outside `onLoaded` as well — at any appropriate time in your business logic, but not in `onCreate`.

```swift highlight-forceCrop-apply
context.eventHandler.send(.applyForceCrop(
  to: page,
  with: [
    ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-1-1"),
    ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-16-9"),
    ForceCropPreset(sourceID: sourceID, presetID: "aspect-ratio-9-16"),
  ],
  mode: .ifNeeded,
))
```

## Understanding Crop Modes

The `ForceCropMode` parameter controls how the editor responds after applying a crop preset.

| Mode | Behavior |
| ---- | -------- |
| `.silent` | Applies the crop without opening the crop UI. |
| `.always` | Applies the crop and opens the crop sheet immediately. |
| `.ifNeeded` | Compares the preset with the current frame dimensions. The crop is applied and the sheet opens only if the ratio/size differs materially. |

## Isolating Presets

To ensure the user only sees the enforced preset, we recreate the asset source in the `onLoaded` callback:

```swift
let sourceID = "ly.img.crop.presets"
try context.engine.asset.removeSource(sourceID: sourceID)
try context.engine.asset.addLocalSource(sourceID: sourceID)
try context.engine.asset.addAsset(to: sourceID, asset: myCustomPreset)
```

## Next Steps

- [Hide Elements](./hide-elements.md) - Remove or hide UI components
- [Rearrange Buttons](./rearrange-buttons.md) - Change button order across components



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support