> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Location options specifically for the dock, which supports an optional position.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `in` | `"ly.img.dock"` | Target the dock. |
|  `at?` | [`DockPosition`](./api/cesdk-js/type-aliases/dockposition.md) | Position of the dock. For set/insert, defaults to `'left'`. For get, omitting returns all positions. |
|  `when?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context for conditional ordering. |


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support