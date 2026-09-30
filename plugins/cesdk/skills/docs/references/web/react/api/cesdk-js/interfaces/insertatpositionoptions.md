> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Insert at a specific position.

## Extends

- [`BaseInsertOptions`](./api/cesdk-js/interfaces/baseinsertoptions.md)\<`A`>

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* `Exclude`\<[`UIArea`](./api/cesdk-js/type-aliases/uiarea.md), [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md)> | `Exclude`\<[`UIArea`](./api/cesdk-js/type-aliases/uiarea.md), [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md)> |

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `in` | `A` | The UI area to insert into. | [`BaseInsertOptions`](./api/cesdk-js/interfaces/baseinsertoptions.md).[`in`](./api/cesdk-js/interfaces/baseinsertoptions.md) |
|  `when?` | [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`> | Optional context for conditional ordering. | [`BaseInsertOptions`](./api/cesdk-js/interfaces/baseinsertoptions.md).[`when`](./api/cesdk-js/interfaces/baseinsertoptions.md) |
|  `at?` | `A` *extends* `"ly.img.dock"` ? [`DockPosition`](./api/cesdk-js/type-aliases/dockposition.md) : `never` | Dock position: `'left'`, `'right'`, or `'bottom'`. Defaults to `'left'`. Only available for `'ly.img.dock'`. | [`BaseInsertOptions`](./api/cesdk-js/interfaces/baseinsertoptions.md).[`at`](./api/cesdk-js/interfaces/baseinsertoptions.md) |
|  `position` | `number` | `"start"` | `"end"` | Insert at 'start', 'end', or a specific index. Negative indexes count from end. | - |
|  `before?` | `never` | - | - |
|  `after?` | `never` | - | - |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support