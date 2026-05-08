> This is one page of the CE.SDK Electron `@cesdk/engine` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type AsyncURIResolver = (URI, defaultURIResolver) => Promise<string> | string;
```

An async-compatible URI resolver function.

May return a plain string for synchronous resolution, or a `Promise<string>`
for asynchronous resolution. The engine preserves synchronous behaviour when
a plain string is returned (important for call-sites that expect immediate
resolution).

## Parameters

| Parameter | Type |
| ------ | ------ |
| `URI` | `string` |
| `defaultURIResolver` | (`URI`) => `string` |

## Returns

`Promise`\<`string`> | `string`


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support