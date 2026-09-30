> This is one page of the CE.SDK Next.js `@cesdk/engine` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
LogLevel: object;
```

Provides a set of predefined log levels for the Creative Editor SDK.

The `LogLevel` object contains constants representing different severity levels
for logging messages. These levels can be used to categorize log messages based
on their importance and urgency.

## Type Declaration

| Name | Type |
| ------ | ------ |
|  `Info` | `"Info"` |
|  `Warning` | `"Warning"` |
|  `Error` | `"Error"` |

## Deprecated

Specifying log levels via `LogLevel.Info` has been deprecated.
Please use the desired LogLevel string directly.


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support