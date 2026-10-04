> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  `builder` | [`Builder`](./api/cesdk-js/documentation/namespaces/experimentalbuilder/interfaces/builder.md) | - |
|  `global` | \{ \<`T`> (`id`, `defaultValue`): `object`; \<`T`> (`id`): `object`; } | Global state object that can be used to store and retrieve values. It will take a unique identifier for this state that can be used to access this store later. `const { value, setValue } = global('unique-id', 'default-value');` If no default value is set, the `value` property may be undefined if no value was set before: `const { value, setValue } = global('unique-id', 'default-value');` **Param** The unique identifier for the state. **Param** The default value for the state. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support