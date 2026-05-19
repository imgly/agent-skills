> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for inserting components into a UI area.

## Extended by

- [`InsertAfterOptions`](./api/cesdk-js/interfaces/insertafteroptions.md)
- [`InsertAppendOptions`](./api/cesdk-js/interfaces/insertappendoptions.md)
- [`InsertAtPositionOptions`](./api/cesdk-js/interfaces/insertatpositionoptions.md)
- [`InsertBeforeOptions`](./api/cesdk-js/interfaces/insertbeforeoptions.md)

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* `Exclude`\<[`UIArea`](./api/cesdk-js/type-aliases/uiarea.md), [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md)> | `Exclude`\<[`UIArea`](./api/cesdk-js/type-aliases/uiarea.md), [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md)> |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `in` | `A` | The UI area to insert into. |
|  `when?` | [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`> | Optional context for conditional ordering. |
|  `at?` | `A` *extends* `"ly.img.dock"` ? [`DockPosition`](./api/cesdk-js/type-aliases/dockposition.md) : `never` | Dock position: `'left'`, `'right'`, or `'bottom'`. Defaults to `'left'`. Only available for `'ly.img.dock'`. |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support