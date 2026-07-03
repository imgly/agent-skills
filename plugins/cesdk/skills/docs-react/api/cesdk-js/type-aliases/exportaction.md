> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type ExportAction = (options?) => void | Promise<void>;
```

Action function for handling export operations.
Can be called with or without options to customize the export behavior.
Supports both standard and video export workflows through a generic type parameter.
The return type is automatically inferred based on the input options type.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `options?` | | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | [`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md) | Optional export configuration for standard or video exports |

## Returns

`void` | `Promise`\<`void`>

A promise that resolves when the export operation is complete, or void for synchronous operations


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support