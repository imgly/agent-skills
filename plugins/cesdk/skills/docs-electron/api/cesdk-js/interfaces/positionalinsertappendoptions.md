> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Append to end (positional areas).

## Extends

- [`BasePositionalInsertOptions`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md)\<`A`>

## Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md) |

## Properties

| Property | Type | Description | Inherited from |
| ------ | ------ | ------ | ------ |
|  `in` | `A` | The UI area to insert into. | [`BasePositionalInsertOptions`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md).[`in`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md) |
|  `at` | [`PositionFor`](./api/cesdk-js/type-aliases/positionfor.md)\<`A`> | Which slot within the area (e.g., 'top' or 'bottom' for canvas bar). | [`BasePositionalInsertOptions`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md).[`at`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md) |
|  `when?` | [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`> | Optional context for conditional ordering. | [`BasePositionalInsertOptions`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md).[`when`](./api/cesdk-js/interfaces/basepositionalinsertoptions.md) |
|  `before?` | `never` | - | - |
|  `after?` | `never` | - | - |
|  `position?` | `never` | - | - |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support