> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type UploadAction = (file, onProgress, context?) => Promise<AddImageOptions>;
```

Action function for uploading files to asset sources.

## Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `file` | `File` | The file to upload |
| `onProgress` | (`progress`) => `void` | Progress action that receives upload progress (0-100) |
| `context?` | [`UploadCallbackContext`](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uploadcallbackcontext.md) | Optional context information for the upload operation |

## Returns

`Promise`\<[`AddImageOptions`](./api/cesdk-js/variables/addimageoptions.md)>

A promise that resolves with the uploaded asset definition


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support