> This is one page of the CE.SDK Angular `@cesdk/engine` API reference. For a complete overview, see the [Angular Documentation Index](https://img.ly/docs/cesdk/angular.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Options for creating a reactive property

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `equals?` | [`_EqualsFn`](./api/engine/type-aliases/equalsfn.md)\<`T`> | Equality comparison function (default: strict equality) |
|  `emitOnSubscribe?` | `boolean` | If true, emit the initial value to new subscribers |
|  `trackSource?` | (`listener`) => [`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md) | Optional source to track (will subscribe and forward updates) |


---

## More Resources

- **[Angular Documentation Index](https://img.ly/docs/cesdk/angular.md)** - Browse all Angular documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support