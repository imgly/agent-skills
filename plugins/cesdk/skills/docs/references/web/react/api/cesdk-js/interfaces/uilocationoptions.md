> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Location options for non-positional UI areas.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) | [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `in` | `A` *extends* `"ly.img.dock"` | `"ly.img.canvas.bar"` ? `never` : `A` | The UI area to target. Cannot be 'ly.img.canvas.bar' or 'ly.img.dock' - use their specific location options instead. |
|  `when?` | [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`> | Optional context for conditional ordering. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support