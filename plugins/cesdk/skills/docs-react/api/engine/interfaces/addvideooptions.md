> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for adding videos to the scene.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `sizeMode?` | [`SizeMode`](./api/engine/type-aliases/sizemode.md) | How the video should be sized and positioned |
|  `positionMode?` | [`PositionMode`](./api/engine/type-aliases/positionmode.md) | How the position should be interpreted |
|  `x?` | `number` | X position in scene design units |
|  `y?` | `number` | Y position in scene design units |
|  `cornerRadius?` | `number` | Corner radius for rounded corners in scene design units |
|  `timeline?` | `object` | Timeline configuration |
| `timeline.timeOffset?` | `number` | Start time offset in seconds |
| `timeline.duration?` | `number` | Duration in seconds |
|  `shadow?` | [`DropShadowOptions`](./api/engine/type-aliases/dropshadowoptions.md) | Drop shadow configuration |
|  `animation?` | [`AnimationOptions`](./api/engine/type-aliases/animationoptions.md) | Animation configuration |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support