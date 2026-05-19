> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type OnUploadCallback = (file, onProgress, context?) => Promise<AddImageOptions>;
```

Represents the upload callback function for the Creative Editor SDK.
This type defines a function that handles file uploads, including progress updates and context.

## Parameters

| Parameter | Type |
| ------ | ------ |
| `file` | `File` |
| `onProgress` | (`progress`) => `void` |
| `context?` | [`UploadCallbackContext`](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uploadcallbackcontext.md) |

## Returns

`Promise`\<[`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md)>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support