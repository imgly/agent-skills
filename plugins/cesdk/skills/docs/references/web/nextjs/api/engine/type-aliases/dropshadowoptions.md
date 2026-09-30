> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type DropShadowOptions = object;
```

Options for configuring drop shadow effects on blocks.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `color?` | [`Color`](./api/engine/type-aliases/color.md) | The color of the drop shadow |
|  `offset?` | `object` | The offset position of the shadow |
| `offset.x?` | `number` | Horizontal offset in scene design units |
| `offset.y?` | `number` | Vertical offset in scene design units |
|  `blur?` | `object` | The blur radius of the shadow |
| `blur.x?` | `number` | Horizontal blur radius in scene design units |
| `blur.y?` | `number` | Vertical blur radius in scene design units |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support