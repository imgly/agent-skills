> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A declarative style preset the engine applies to text and caption blocks. The engine parses and
applies it identically on every platform. Lives in [AssetPayload.stylePreset](./api/engine/interfaces/assetpayload.md).

Most of the look is in [AssetStylePreset.properties](./api/engine/interfaces/assetstylepreset.md); the other fields cover the font,
size-relative scaling and animations.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `blockType?` | `"//ly.img.ubq/text"` | `"//ly.img.ubq/caption"` | The block type this preset is for. Used as the type to create when the preset is applied with no target block, and as the apply filter (it only restyles a block of this type). Omitted applies to any block. Style presets target text and caption blocks; the value is the longhand id, which the engine matches against the block's `getType()`. |
|  `mode?` | `"replace"` | `"merge"` | How the preset combines with the block's current look. `'replace'` (the default) also clears the decorations and animations the preset omits, so switching presets never stacks; `'merge'` layers the preset on top, keeping everything it does not set. Either way the block's text content is never touched, and its size only changes when the preset asks for it (`fontSize.resizeExistingOnApply`, or a `text/path` baseline adopting its bounding box). |
|  `typeface?` | `object` | Font to apply. The engine resolves `family` against the registered typefaces and matches `weight`/`style`. Ignored when the family is empty or not registered. |
| `typeface.family` | `string` | - |
| `typeface.weight?` | [`FontWeight`](./api/engine/type-aliases/fontweight.md) | - |
| `typeface.style?` | [`FontStyle`](./api/engine/type-aliases/fontstyle.md) | - |
|  `fontSize?` | `object` | Scene-relative font size. `scale` is a unitless multiplier on the scene's base font size (1 = the base size), sizing a block created from the preset. With `resizeExistingOnApply: true` the same size also resizes an existing block on apply. For an absolute size, set `properties['text/fontSize']` instead (it takes precedence). |
| `fontSize.scale` | `number` | - |
| `fontSize.resizeExistingOnApply?` | `boolean` | - |
|  `scaleWithFontSize?` | `object`\[] | Lengths that scale with the block's font size. Each entry sets its `property` to `ratio × fontSize` — e.g. `{ property: 'stroke/width', ratio: 0.012 }` makes the stroke width `0.012 × fontSize`. Keeps a preset's stroke width, drop-shadow offset/blur, … proportional at any size. |
|  `properties?` | [`AssetStylePresetProperties`](./api/engine/type-aliases/assetstylepresetproperties.md) | The bulk of the look: typography plus the `fill/*`, `stroke/*`, `dropShadow/*` and `backgroundColor/*` decorations with their `…/enabled` toggles. Known paths are value-checked and autocomplete. See [AssetStylePresetProperties](./api/engine/type-aliases/assetstylepresetproperties.md). |
|  `inAnimation?` | [`AssetStylePresetAnimation`](./api/engine/interfaces/assetstylepresetanimation.md) | Entrance animation. |
|  `outAnimation?` | [`AssetStylePresetAnimation`](./api/engine/interfaces/assetstylepresetanimation.md) | Exit animation. |
|  `loopAnimation?` | [`AssetStylePresetAnimation`](./api/engine/interfaces/assetstylepresetanimation.md) | Looping animation. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support