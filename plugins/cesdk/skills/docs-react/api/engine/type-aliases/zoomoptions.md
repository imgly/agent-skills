> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ZoomOptions = object;
```

Options for zooming to a block with optional animation.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `padding?` | | `number` | \{ `x?`: `number`; `y?`: `number`; } | \{ `top?`: `number`; `bottom?`: `number`; `left?`: `number`; `right?`: `number`; } | Padding configuration around the block |
|  `animate?` | | `boolean` | \{ `duration?`: `number`; `easing?`: [`AnimationEasing`](./api/engine/type-aliases/animationeasing.md); `interruptible?`: `boolean`; } | Animation configuration - boolean for default animation or object for custom settings |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support