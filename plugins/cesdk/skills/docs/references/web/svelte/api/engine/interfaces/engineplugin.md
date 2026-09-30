> This is one page of the CE.SDK Svelte `@cesdk/engine` API reference. For a complete overview, see the [Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Represents an engine plugin.

Defines the structure of an engine plugin, including its name, version, and initialization function.

- 'name': The name of the plugin.
- 'version': The version of the plugin.
- 'initialize': The function to initialize the plugin with the provided context. Can be synchronous or asynchronous.

## Properties

| Property | Type |
| ------ | ------ |
|  `name` | `string` |
|  `version` | `string` |
|  `initialize` | (`context`) => `void` | `Promise`\<`void`> |


---

## More Resources

- **[Svelte Documentation Index](https://img.ly/docs/cesdk/svelte.md)** - Browse all Svelte documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./svelte.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support