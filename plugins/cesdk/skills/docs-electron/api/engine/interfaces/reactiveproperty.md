> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

A reactive property with subscribe, value, and update methods

## Type Parameters

| Type Parameter |
| ------ |
| `T` |

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `subscribe` | (`listener`) => [`_Unsubscribe`](./api/engine/type-aliases/unsubscribe.md) | Subscribe to value changes |
|  `value` | () => `T` | Get current value |
|  `update` | (`newValue`) => `void` | Update the value (will notify listeners if changed) |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support