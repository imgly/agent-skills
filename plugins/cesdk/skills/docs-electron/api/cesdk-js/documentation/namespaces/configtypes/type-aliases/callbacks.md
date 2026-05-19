> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

```ts
type Callbacks = object;
```

Represents the callback functions for various events in the Creative Editor SDK.
This interface defines functions for handling back, close, share, save, load, load archive, download, export,
upload, and unsupported browser events.

## Deprecated

Use the `cesdk.actions` API and the Order API instead.

## Properties

| Property | Type | Description |
| ------ | ------ | ------ |
|  ~~`onBack?`~~ | () => `void` | `Promise`\<`void`> | **Deprecated** Use the onClick on `'ly.img.back.navigationBar'` and the Order API instead. |
|  ~~`onClose?`~~ | () => `void` | `Promise`\<`void`> | **Deprecated** Use the onClick on `'ly.img.close.navigationBar'` and the Order API instead. |
|  ~~`onShare?`~~ | (`s`) => `void` | `Promise`\<`void`> | **Deprecated** Use the onClick on `'ly.img.shareScene.navigationBar'` and the Order API instead. |
|  ~~`onSave?`~~ | (`s`) => `void` | `Promise`\<`void`> | **Deprecated** Use the onClick on `'ly.img.saveScene.navigationBar'` and the Order API instead. |
|  ~~`onLoad?`~~ | (() => `Promise`\<`string`>) | `"upload"` | **Deprecated** Use the onClick on `'ly.img.importScene.navigationBar'` and the Order API instead. |
|  ~~`onLoadArchive?`~~ | (() => `Promise`\<`string`>) | `"uploadArchive"` | **Deprecated** Use the onClick on `'ly.img.importArchive.navigationBar'` and the Order API instead. |
|  ~~`onDownload?`~~ | ((`s`) => `void` | `Promise`\<`void`>) | `"download"` | **Deprecated** Use the onClick on `'ly.img.exportScene.navigationBar'` and the Order API instead. |
|  ~~`onExport?`~~ | ((`blobs`, `options`) => `void` | `Promise`\<`void`>) | `"download"` | **Deprecated** Use the onClick on `'ly.img.export.navigationBar'` and the Order API instead. |
|  ~~`onUpload?`~~ | | [`OnUploadCallback`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/onuploadcallback.md) | `"local"` | `Partial`\<[`OnUploadOptions`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/onuploadoptions.md)> & `object` | **Deprecated** Use the `cesdk.actions.register('uploadFile', action)` and `engine.editor.setSetting('upload/supportedMimeTypes', '<mimeType>,<mimeType>')` instead. Note: If you are using `addDemoAssetSources`, now you will have to explicitly enable upload sources by setting `withUploadAssetSources: true`. |
|  ~~`onUnsupportedBrowser?`~~ | () => `void` | **Deprecated** Use the `cesdk.actions.register('onUnsupportedBrowser', action)` instead. |


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support