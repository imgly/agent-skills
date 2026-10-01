> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

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

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support