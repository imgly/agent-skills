> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Update Caption Presets](./update-caption-presets.md)

---

```swift file=@cesdk_swift_examples/engine-guides-update-caption-presets/UpdateCaptionPresets.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func updateCaptionPresets(engine: Engine) async throws {
  // A caption block to apply presets to. Caption tracks and blocks are covered
  // in the Add Captions guide; this is the minimum a preset needs to target.
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.editor.setSettingBool("features/videoCaptionsEnabled", value: true)

  let captionTrack = try engine.block.create(.captionTrack)
  try engine.block.appendChild(to: page, child: captionTrack)
  let caption = try engine.block.create(.caption)
  try engine.block.setString(caption, property: "caption/text", value: "Your caption text")
  try engine.block.appendChild(to: captionTrack, child: caption)

  let neonGlowStyle = """
  {
    "blockType": "//ly.img.ubq/caption",
    "mode": "replace",
    "typeface": { "family": "Manrope", "weight": "bold", "style": "normal" },
    "properties": {
      "caption/horizontalAlignment": "Center",
      "caption/verticalAlignment": "Center",
      "fill/enabled": true,
      "fill/solid/color": { "r": 0, "g": 1, "b": 1, "a": 1 },
      "dropShadow/enabled": true,
      "dropShadow/color": { "r": 0, "g": 1, "b": 1, "a": 1 },
      "dropShadow/offset/x": 0,
      "dropShadow/offset/y": 0,
      "dropShadow/blurRadius/x": 8,
      "dropShadow/blurRadius/y": 8
    },
    "scaleWithFontSize": [
      { "property": "dropShadow/blurRadius/x", "ratio": 0.2 },
      { "property": "dropShadow/blurRadius/y", "ratio": 0.2 }
    ]
  }
  """

  let contentJSON = """
  {
    "version": "7.0.0",
    "id": "ly.img.caption.presets",
    "assets": [
      {
        "id": "ly.img.caption.presets.neon-glow",
        "label": { "en": "Neon Glow" },
        "groups": ["caption"],
        "meta": { "thumbUri": "{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png" },
        "payload": { "stylePreset": \(neonGlowStyle) }
      }
    ]
  }
  """
  let contentURL = FileManager.default.temporaryDirectory
    .appendingPathComponent("ly.img.caption.presets-content.json")
  try contentJSON.write(to: contentURL, atomically: true, encoding: .utf8)
  let captionPresetsSourceID = try await engine.asset.addLocalAssetSourceFromJSON(contentURL)

  let boldBackgroundStyle = """
  {
    "blockType": "//ly.img.ubq/caption",
    "mode": "replace",
    "properties": {
      "caption/horizontalAlignment": "Center",
      "fill/enabled": true,
      "fill/solid/color": { "r": 1, "g": 1, "b": 1, "a": 1 },
      "backgroundColor/enabled": true,
      "backgroundColor/color": { "r": 0, "g": 0, "b": 0, "a": 0.6 }
    }
  }
  """
  let boldBackground = AssetDefinition(
    id: "ly.img.caption.presets.bold-background",
    groups: ["caption"],
    meta: ["thumbUri": "https://example.com/caption-presets/bold-background.png"],
    payload: AssetPayload(stylePreset: boldBackgroundStyle),
    label: ["en": "Bold Background"],
  )
  try engine.asset.addAsset(to: captionPresetsSourceID, asset: boldBackground)

  let presets = try await engine.asset.findAssets(
    sourceID: captionPresetsSourceID,
    query: AssetQueryData(query: nil, page: 0, groups: ["caption"], perPage: 10),
  )
  if let neonGlow = presets.assets.first(where: { $0.id == "ly.img.caption.presets.neon-glow" }) {
    try await engine.asset.applyToBlock(sourceID: captionPresetsSourceID, assetResult: neonGlow, block: caption)
  }
}
```

Extend CE.SDK's video captions with custom caption presets. A caption preset is a declarative style
preset — you describe the look as JSON and the engine applies it to a caption block.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-update-caption-presets)

<EngineReferenceNote {...props} />

A caption preset is a JSON document that the engine applies to a caption block — there are no blocks to build or files to serialize. CE.SDK groups these presets under the `ly.img.caption.presets` asset source. This guide defines a custom preset, hosts it in a `content.json`, registers another preset at runtime, and applies a preset to a caption with the engine's asset APIs.

## Define a Caption Style Preset

Describe the look as a JSON document. In Swift a style preset is opaque — you author the JSON and the engine parses and applies it, so the document never needs a typed wrapper.

```swift highlight-updateCaptionPresets-defineStylePreset
let neonGlowStyle = """
{
  "blockType": "//ly.img.ubq/caption",
  "mode": "replace",
  "typeface": { "family": "Manrope", "weight": "bold", "style": "normal" },
  "properties": {
    "caption/horizontalAlignment": "Center",
    "caption/verticalAlignment": "Center",
    "fill/enabled": true,
    "fill/solid/color": { "r": 0, "g": 1, "b": 1, "a": 1 },
    "dropShadow/enabled": true,
    "dropShadow/color": { "r": 0, "g": 1, "b": 1, "a": 1 },
    "dropShadow/offset/x": 0,
    "dropShadow/offset/y": 0,
    "dropShadow/blurRadius/x": 8,
    "dropShadow/blurRadius/y": 8
  },
  "scaleWithFontSize": [
    { "property": "dropShadow/blurRadius/x", "ratio": 0.2 },
    { "property": "dropShadow/blurRadius/y", "ratio": 0.2 }
  ]
}
"""
```

The fields:

- `blockType`: the target block. Use `"//ly.img.ubq/caption"` for caption presets.
- `mode`: `"replace"` clears anything the preset omits, so presets never stack; `"merge"` layers the preset on top and keeps untouched properties.
- `typeface`: the font, resolved by `family` with optional `weight` and `style`. An unregistered family is skipped.
- `properties`: a flat map of property paths to values. Keys without a slash are namespaced to the caption block (for example `caption/horizontalAlignment`); keys with a slash are used verbatim (`fill/solid/color`). Colors are RGBA objects with `r`, `g`, `b`, and an optional `a`, each in the 0–1 range.
- `scaleWithFontSize`: keeps a decoration proportional to the font size. Each `{ property, ratio }` entry sets `property` to `ratio × fontSize`. Any numeric caption property works — common ones are `stroke/width`, the `dropShadow` offset and blur radius, and `backgroundColor/cornerRadius` and padding.

## Host Presets in a content.json

To serve presets from your own files, host a `content.json` for the `ly.img.caption.presets` source and load it with `addLocalAssetSourceFromJSON`. The source needs only the index file and a thumbnails folder — each asset carries its look inline in `payload.stylePreset`, so there are no separate preset files:

```
ly.img.caption.presets/
├── content.json
└── thumbnails/
    └── neon-glow.png
```

```swift highlight-updateCaptionPresets-hostPresets
let contentJSON = """
{
  "version": "7.0.0",
  "id": "ly.img.caption.presets",
  "assets": [
    {
      "id": "ly.img.caption.presets.neon-glow",
      "label": { "en": "Neon Glow" },
      "groups": ["caption"],
      "meta": { "thumbUri": "{{base_url}}/ly.img.caption.presets/thumbnails/neon-glow.png" },
      "payload": { "stylePreset": \(neonGlowStyle) }
    }
  ]
}
"""
let contentURL = FileManager.default.temporaryDirectory
  .appendingPathComponent("ly.img.caption.presets-content.json")
try contentJSON.write(to: contentURL, atomically: true, encoding: .utf8)
let captionPresetsSourceID = try await engine.asset.addLocalAssetSourceFromJSON(contentURL)
```

The manifest uses `version` `"7.0.0"` and the `ly.img.caption.presets` source id. Each asset needs a unique `id`, a localized `label`, the `caption` group, a `meta.thumbUri` preview, and the declarative look in `payload.stylePreset`. Use the `{{base_url}}` placeholder for paths that resolve relative to the manifest's parent directory.

`addLocalAssetSourceFromJSON(_:matcher:)` returns the source id. It registers the source if it does not exist yet, or merges the manifest's assets into it if it does — so a hosted manifest and runtime registration share the same `ly.img.caption.presets` source.

## Register a Preset at Runtime

To add a preset without editing the `content.json`, build an `AssetDefinition` and add it to the source. The definition mirrors a hosted entry: an id, a localized label, the `caption` group, a thumbnail, and the declarative look in `payload.stylePreset`. `AssetPayload(stylePreset:)` carries the same opaque JSON document you author for the manifest.

```swift highlight-updateCaptionPresets-registerPreset
let boldBackgroundStyle = """
{
  "blockType": "//ly.img.ubq/caption",
  "mode": "replace",
  "properties": {
    "caption/horizontalAlignment": "Center",
    "fill/enabled": true,
    "fill/solid/color": { "r": 1, "g": 1, "b": 1, "a": 1 },
    "backgroundColor/enabled": true,
    "backgroundColor/color": { "r": 0, "g": 0, "b": 0, "a": 0.6 }
  }
}
"""
let boldBackground = AssetDefinition(
  id: "ly.img.caption.presets.bold-background",
  groups: ["caption"],
  meta: ["thumbUri": "https://example.com/caption-presets/bold-background.png"],
  payload: AssetPayload(stylePreset: boldBackgroundStyle),
  label: ["en": "Bold Background"],
)
try engine.asset.addAsset(to: captionPresetsSourceID, asset: boldBackground)
```

`addAsset(to:asset:)` adds the preset to the existing `ly.img.caption.presets` source, alongside any hosted or built-in presets.

## Apply a Preset to a Caption

Query the source and apply a result to a caption block. `applyToBlock(sourceID:assetResult:block:)` reads the asset's `payload.stylePreset` and applies it to the caption. `caption` here is a caption block on a caption track — see [Add Captions](../edit-video/add-captions.md) for creating caption tracks and blocks.

```swift highlight-updateCaptionPresets-applyPreset
let presets = try await engine.asset.findAssets(
  sourceID: captionPresetsSourceID,
  query: AssetQueryData(query: nil, page: 0, groups: ["caption"], perPage: 10),
)
if let neonGlow = presets.assets.first(where: { $0.id == "ly.img.caption.presets.neon-glow" }) {
  try await engine.asset.applyToBlock(sourceID: captionPresetsSourceID, assetResult: neonGlow, block: caption)
}
```

`findAssets(sourceID:query:)` returns the presets in the `caption` group regardless of insertion order, so select a specific preset by id rather than relying on the first result.

## Troubleshooting

| Issue | Cause | Solution |
| --- | --- | --- |
| Preset not loading | The manifest is unreachable or `version` is wrong | Confirm the `content.json` URL resolves and `version` is `"7.0.0"` |
| Styles not applying | `blockType` does not match the target | Set `blockType` to `"//ly.img.ubq/caption"` and apply to a caption block |
| Color or decoration missing | RGBA out of range, or the decoration is disabled | Use values in the 0–1 range and enable a decoration before coloring it (for example `dropShadow/enabled` alongside `dropShadow/color`) |
| Decoration not scaling | The property is not in `scaleWithFontSize` | Add it as a `{ property, ratio }` entry; any numeric caption property can scale (stroke width, drop-shadow offset and blur, background corner radius and padding) |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.asset.addLocalAssetSourceFromJSON(_:matcher:)` | Load a hosted `content.json` manifest into an asset source |
| `engine.asset.addAsset(to:asset:)` | Add a preset to an asset source at runtime |
| `engine.asset.findAssets(sourceID:query:)` | Query the registered caption presets |
| `engine.asset.applyToBlock(sourceID:assetResult:block:)` | Apply a preset to a caption block |

## Next Steps

- [Add Captions](../edit-video/add-captions.md) — Add captions to videos and understand caption tracks
- [Remote Asset Sources](../import-media/from-remote-source/remote-asset.md) — Host and serve assets from custom locations
- [Text Styling](../text/styling.md) — Style text blocks with fonts, colors, and effects



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support