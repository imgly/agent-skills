> This is one page of the CE.SDK React `@cesdk/cesdk-js` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

UtilsAPI provides utility functions for common operations in the Creative Engine SDK.

This API includes utilities for:

- Creating and managing loading dialogs
- Exporting content (images, PDFs, videos)
- Loading and downloading files
- Local file uploads

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>UtilsAPI</code></p>
  </summary>
</details>

## Methods

<details>
  <summary>
    ### generateBlockName()

    <br /><p>Generates the automatic, localized fallback name for a design block. When
    the block does not have an explicit name set, this mirrors the naming shown
    in the UI panels.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `blockId` | `number` | The block ID to generate a fallback name for |

  #### Returns

  `string`

  The localized fallback name for the block

  #### Signature

  ```typescript
  generateBlockName(blockId: number): string
  ```

  ***
</details>

<details>
  <summary>
    ### showLoadingDialog()

    <br /><p>Shows and manages a loading dialog with progress tracking</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `title?`: `string`; `message?`: `string` | `string`\[]; `cancelLabel?`: `string`; `abortLabel?`: `string`; `abortTitle?`: `string`; `abortMessage?`: `string` | `string`\[]; `size?`: `"large"` | `"regular"`; `clickOutsideToClose?`: `boolean`; `progress?`: [`DialogProgress`](./api/cesdk-js/type-aliases/dialogprogress.md); `onDone?`: () => `void`; `onAbort?`: () => `void`; } | Options for configuring the loading dialog |
  | `options.title?` | `string` | - |
  | `options.message?` | `string` | `string`\[] | - |
  | `options.cancelLabel?` | `string` | - |
  | `options.abortLabel?` | `string` | - |
  | `options.abortTitle?` | `string` | - |
  | `options.abortMessage?` | `string` | `string`\[] | - |
  | `options.size?` | `"large"` | `"regular"` | - |
  | `options.clickOutsideToClose?` | `boolean` | - |
  | `options.progress?` | [`DialogProgress`](./api/cesdk-js/type-aliases/dialogprogress.md) | - |
  | `options.onDone?` | () => `void` | - |
  | `options.onAbort?` | () => `void` | - |

  #### Returns

  `object`

  A controller object for managing the dialog

  | Name | Type |
  | ------ | ------ |
  | `dialogId` | `string` |
  | `updateProgress()` | (`progress`) => `void` |
  | `showSuccess()` | (`options`) => `void` |
  | `showError()` | (`options`) => `void` |
  | `close()` | () => `void` |

  #### Example

  ```typescript
  const controller = cesdk.utils.showLoadingDialog({
    title: 'Exporting',
    message: 'Please wait...',
    onAbort: () => console.log('Aborted')
  });

  // Update progress
  controller.updateProgress({ value: 50, max: 100 });

  // Show success
  controller.showSuccess({
    title: 'Success',
    message: 'Export completed!'
  });
  ```

  #### Signature

  ```typescript
  showLoadingDialog(options?: object): object
  ```

  ***
</details>

<details>
  <summary>
    ### export()

    <br /><p>Exports content with a loading dialog and progress tracking.
    Automatically handles both static exports (images, PDFs) and video exports based on MIME type.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* `any` |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | `T` | Export options. Type inference based on mimeType. |

  #### Returns

  `Promise`\<\{
  `blobs`: `Blob`\[];
  `options`: `T` *extends* `VideoExportOptions` ? `any` : `any`;
  }>

  Export result - either blobs array for static or single blob for video

  #### Example

  ```typescript
  // Image export
  const imageResult = await cesdk.utils.export({
    mimeType: 'image/png',
    pngCompressionLevel: 7
  });

  // Video export
  const videoResult = await cesdk.utils.export({
    mimeType: 'video/mp4',
    onProgress: (rendered, encoded, total) => console.log(`${rendered}/${total}`)
  });
  ```

  #### Signature

  ```typescript
  export(options?: T): Promise<object>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFile()

    <br /><p>Opens a file picker dialog for the user to select a file</p>
  </summary>

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType`: `"dataURL"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType` | `"dataURL"` |

  ##### Returns

  `Promise`\<`string`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Call Signature

  ```ts
  loadFile(opts): Promise<string>;
  ```

  Opens a file picker dialog for the user to select a file

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType`: `"text"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType` | `"text"` |

  ##### Returns

  `Promise`\<`string`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Call Signature

  ```ts
  loadFile(opts): Promise<Blob>;
  ```

  Opens a file picker dialog for the user to select a file

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType`: `"blob"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType` | `"blob"` |

  ##### Returns

  `Promise`\<`Blob`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Call Signature

  ```ts
  loadFile(opts): Promise<ArrayBuffer>;
  ```

  Opens a file picker dialog for the user to select a file

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType`: `"arrayBuffer"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType` | `"arrayBuffer"` |

  ##### Returns

  `Promise`\<`ArrayBuffer`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Call Signature

  ```ts
  loadFile(opts): Promise<string>;
  ```

  Opens a file picker dialog for the user to select a file

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType`: `"objectURL"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType` | `"objectURL"` |

  ##### Returns

  `Promise`\<`string`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Call Signature

  ```ts
  loadFile(opts): Promise<File>;
  ```

  Opens a file picker dialog for the user to select a file

  ##### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `opts` | \{ `accept`: `string`; `returnType?`: `"File"`; } |
  | `opts.accept` | `string` |
  | `opts.returnType?` | `"File"` |

  ##### Returns

  `Promise`\<`File`>

  The loaded file content in the requested format. For dataURL return type,
  if the file is eligible for OPFS storage and the feature is enabled, returns the
  OPFS URL (opfs://...) instead of a data URL.

  ##### Example

  ```typescript
  // Load a text file
  const text = await cesdk.utils.loadFile({
    accept: '.txt',
    returnType: 'text'
  });

  // Load an image as blob
  const blob = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'blob'
  });

  // Load a file with OPFS support (returns opfs:// URL for eligible files)
  const url = await cesdk.utils.loadFile({
    accept: 'video/*',
    returnType: 'dataURL'
  });
  // For eligible files: "opfs://cesdk-1234567890-video.mp4"
  // For non-eligible files: "data:video/mp4;base64,..."
  // Load a file as object URL (blob URL)
  const objectURL = await cesdk.utils.loadFile({
    accept: '.zip',
    returnType: 'objectURL'
  });
  // Remember to revoke the object URL when done
  URL.revokeObjectURL(objectURL);
  ```

  #### Signatures

  ```typescript
  loadFile(opts: object): Promise<string>
  ```

  ```typescript
  loadFile(opts: object): Promise<string>
  ```

  ```typescript
  loadFile(opts: object): Promise<Blob>
  ```

  ```typescript
  loadFile(opts: object): Promise<ArrayBuffer>
  ```

  ```typescript
  loadFile(opts: object): Promise<string>
  ```

  ```typescript
  loadFile(opts: object): Promise<File>
  ```

  ***
</details>

<details>
  <summary>
    ### downloadFile()

    <br /><p>Downloads a blob, string, or OPFS path as a file to the user's device</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `file` | `string` | `Blob` | The content to download (Blob, string content, or opfs:// path) |
  | `mimeType?` | [`FileMimeType`](./api/cesdk-js/type-aliases/filemimetype.md) | The MIME type of the content |

  #### Returns

  `Promise`\<`void`>

  #### Example

  ```typescript
  // Download a text file
  await cesdk.utils.downloadFile('Hello World', 'text/plain');

  // Download a blob
  const blob = new Blob(['content'], { type: 'text/plain' });
  await cesdk.utils.downloadFile(blob, 'text/plain');

  // Download from OPFS path
  await cesdk.utils.downloadFile('opfs://cesdk/buffer/file.mp4', 'video/mp4');
  ```

  #### Signature

  ```typescript
  downloadFile(file: string | Blob, mimeType?: FileMimeType): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### localUpload()

    <br /><p>Performs a local upload of a file (development only)</p>
  </summary>

  Note: This is meant for development testing only. In production,
  you should implement a proper upload handler using the callbacks API.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `file` | `File` | The file to upload |
  | `context?` | [`UploadCallbackContext`](./api/cesdk-js/documentation/namespaces/configtypes/interfaces/uploadcallbackcontext.md) | Optional context information for the upload operation |

  #### Returns

  `Promise`\<`AssetDefinition`>

  The asset definition for the uploaded file

  #### Example

  ```typescript
  const file = new File(['content'], 'test.txt');
  const asset = await cesdk.utils.localUpload(file, {
    context: { source: 'user-upload' }
  });
  ```

  #### Signature

  ```typescript
  localUpload(file: File, context?: UploadCallbackContext): Promise<AssetDefinition>
  ```

  ***
</details>

<details>
  <summary>
    ### calculateViewportPadding()

    <br /><p>Calculates the recommended viewport padding based on current viewport size and settings.
    This utility matches the internal padding used by the SDK for zoom operations.
    The calculation accounts for safe area insets to ensure content remains visible
    in UI-safe regions (avoiding notches, rounded corners, system overlays, etc.).</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `width?` | `number` | Optional viewport width to use instead of current camera width |
  | `height?` | `number` | Optional viewport height to use instead of current camera height |

  #### Returns

  `object`

  An object containing paddingX and paddingY values

  | Name | Type |
  | ------ | ------ |
  | `paddingX` | `number` |
  | `paddingY` | `number` |

  #### Example

  ```typescript
  const padding = cesdk.utils.calculateViewportPadding();
  console.log(`Padding: ${padding.paddingX}x${padding.paddingY}`);

  // Use with custom zoom
  await cesdk.engine.scene.zoomToBlock(
    pageId,
    padding.paddingX,
    padding.paddingY,
    padding.paddingX,
    padding.paddingY
  );
  ```

  #### Signature

  ```typescript
  calculateViewportPadding(width?: number, height?: number): object
  ```

  ***
</details>

<details>
  <summary>
    ### supportsVideoDecode()

    <br /><p>Checks if the current browser supports video decoding/playback.</p>
  </summary>

  Video decoding requires the WebCodecs API (VideoFrame, VideoDecoder, VideoEncoder,
  AudioDecoder, AudioEncoder). These APIs are not available on all platforms.

  **Supported platforms**: Chrome and Edge on Windows and macOS.
  **Unsupported platforms**: All browsers on Linux, Firefox on any OS.

  #### Returns

  `boolean`

  true if the browser supports video decoding, false otherwise

  #### Example

  ```typescript
  if (cesdk.utils.supportsVideoDecode()) {
    // Video features are available
    await cesdk.engine.scene.loadFromURL('video-scene.scene');
  } else {
    // Show fallback UI or message
    console.log('Video features not available in this browser');
  }
  ```

  #### Signature

  ```typescript
  supportsVideoDecode(): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### supportsVideoEncode()

    <br /><p>Checks if the current browser supports video encoding/export.</p>
  </summary>

  Video encoding requires the WebCodecs API with H.264 (AVC) video encoding
  and AAC audio encoding support. These codecs are patent-encumbered and not
  included in open-source browser builds.

  **Supported platforms**: Chrome and Edge on Windows and macOS.
  **Unsupported platforms**: All browsers on Linux, Firefox on any OS.

  For server-side video rendering that works on all platforms, see CE.SDK Renderer:
  https://img.ly/docs/cesdk/renderer/cesdk-renderer-overview-7f3e9a/

  #### Returns

  `Promise`\<`boolean`>

  A promise that resolves to true if the browser supports video encoding, false otherwise

  #### Example

  ```typescript
  if (await cesdk.utils.supportsVideoEncode()) {
    // Video export is available
    const blob = await cesdk.engine.block.exportVideo(page);
  } else {
    // Show fallback UI or suggest server-side rendering
    console.log('Video export not available - consider using CE.SDK Renderer');
  }
  ```

  #### Signature

  ```typescript
  supportsVideoEncode(): Promise<boolean>
  ```
</details>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support