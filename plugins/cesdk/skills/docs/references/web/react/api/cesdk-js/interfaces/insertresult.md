> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Result of an insert operation.

## Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) | [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `inserted` | `boolean` | Whether at least one component was successfully inserted. False if target not found. |
|  `insertedCount` | `number` | Number of components that were inserted. |
|  `order` | [`OrderComponentFor`](./api/cesdk-js/type-aliases/ordercomponentfor.md)\<`A`>\[] | The new order after the insert. |


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support