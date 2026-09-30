> This is one page of the CE.SDK Next.js `@cesdk/cesdk-js` API reference. For a complete overview, see the [Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ImportSceneAction = (options) => void | Promise<void>;
```

Action function for handling scene import operations.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options` | \{ `format?`: `"scene"` | `"archive"`; } | Options for configuring the import operation - options.format: The format of the imported scene data. |
| `options.format?` | `"scene"` | `"archive"` | - |

## Returns

`void` | `Promise`\<`void`>

A promise that resolves with the imported scene data as a string, or the scene data directly


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/docs/cesdk/nextjs.md)** - Browse all Next.js documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support