> This is one page of the CE.SDK Vue `@cesdk/engine` API reference. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type _PersistedCallback = (url, persistedUrl, error) => void;
```

How the engine takes one answer: the stored URL, or the reason the host could
not store the data. The engine waits for one answer per resource.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `url` | `string` |
| `persistedUrl` | `unknown` |
| `error` | `string` | `undefined` |

## Returns

`void`


---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support