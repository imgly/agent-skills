> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for inserting components into a positional UI area (e.g., canvas bar).

## Extended by

- [`PositionalInsertAfterOptions`](./api/cesdk-js/interfaces/positionalinsertafteroptions.md)
- [`PositionalInsertAppendOptions`](./api/cesdk-js/interfaces/positionalinsertappendoptions.md)
- [`PositionalInsertAtPositionOptions`](./api/cesdk-js/interfaces/positionalinsertatpositionoptions.md)
- [`PositionalInsertBeforeOptions`](./api/cesdk-js/interfaces/positionalinsertbeforeoptions.md)

## Type Parameters

| Type Parameter |
| ------ |
| `A` *extends* [`PositionalUIArea`](./api/cesdk-js/type-aliases/positionaluiarea.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `in` | `A` | The UI area to insert into. |
|  `at` | [`PositionFor`](./api/cesdk-js/type-aliases/positionfor.md)\<`A`> | Which slot within the area (e.g., 'top' or 'bottom' for canvas bar). |
|  `when?` | [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`> | Optional context for conditional ordering. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support