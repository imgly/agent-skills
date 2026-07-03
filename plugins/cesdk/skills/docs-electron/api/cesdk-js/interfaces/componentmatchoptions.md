> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for update and remove operations.
Supports multi-area operations via arrays or glob patterns.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* [`UIAreaSpecifier`](./api/cesdk-js/type-aliases/uiareaspecifier.md) | [`UIAreaSpecifier`](./api/cesdk-js/type-aliases/uiareaspecifier.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `in` | `A` | The UI area(s) to operate on. Can be a single area, array, or glob pattern. |
|  `match` | [`ComponentMatcher`](./api/cesdk-js/type-aliases/componentmatcher.md)\<[`InferComponentType`](./api/cesdk-js/type-aliases/infercomponenttype.md)\<`A`>> | The matcher to find components. Autocomplete is area-specific when targeting a single area. |
|  `when?` | [`InferOrderContext`](./api/cesdk-js/type-aliases/inferordercontext.md)\<`A`> | Optional context filter. |
|  `at?` | `A` *extends* `"ly.img.canvas.bar"` ? `"bottom"` | `"top"` : `A` *extends* `"ly.img.dock"` ? [`DockPosition`](./api/cesdk-js/type-aliases/dockposition.md) : `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) ? `never` : | [`DockPosition`](./api/cesdk-js/type-aliases/dockposition.md) | `"top"` | Position filter. For canvas bar: `'top'` or `'bottom'`. For dock: `'left'`, `'right'`, or `'bottom'`. If omitted, the operation applies to all positions. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support