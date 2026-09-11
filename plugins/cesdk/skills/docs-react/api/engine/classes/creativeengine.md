> This is one page of the CE.SDK React `@cesdk/engine` API reference. For a complete overview, see the [React Documentation Index](https://img.ly/docs/cesdk/react.md) or the [engine API Index](./api/engine.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The CreativeEngine is the core processing unit of CE.SDK and handles state management, rendering, input handling, and much more.
It provides APIs to directly interact with assets, blocks, scenes, and variables. These APIs can be used in a headless environment
to build and manipulate designs programmatically, or in a browser to create interactive applications.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>CreativeEngine</code></p>
  </summary>
</details>

## Engine Management

Methods for initializing, configuring, and managing the engine lifecycle.

<details>
  <summary>
    ### version

    <br /><p>The version of the CE.SDK package.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### version

    <br /><p>The SDK version</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### addPlugin()

    <br /><p>Add and initialize a plugin to the engine.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `plugin` | [`EnginePlugin`](./api/engine/interfaces/engineplugin.md) | The plugin to add and initialize. |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  addPlugin(plugin: EnginePlugin): Promise<void>
  ```

  ***
</details>

<details>
  <summary>
    ### setWheelEventTarget()

    <br /><p>Install the mousewheel event handler for the CreativeEngine on a different element than the canvas.</p>
  </summary>

  This can be useful if you are rendering HTML elements on top of the canvas
  and want to scroll the canvas when the mouse is over those elements.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `target` | `HTMLElement` | The HTML element to attach the wheel event handler to. |

  #### Returns

  A function that removes the event handler from the target and adds it back to the canvas.

  () => `void`

  #### Signature

  ```typescript
  setWheelEventTarget(target: HTMLElement): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### element

    <br /><p>Access the canvas element used by the CreativeEngine.</p>
  </summary>

  ##### Returns

  [`HTMLCreativeEngineCanvasElement`](./api/engine/interfaces/htmlcreativeenginecanvaselement.md)

  ***
</details>

<details>
  <summary>
    ### dispose()

    <br /><p>Dispose the engine and clean up all resources.</p>
  </summary>

  #### Returns

  `void`

  #### Signature

  ```typescript
  dispose(): void
  ```

  ***
</details>

<details>
  <summary>
    ### init()

    <br /><p>Initialize a CreativeEngine with an optional configuration.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `C` *extends* `Partial`\<[`Configuration`](./api/engine/interfaces/configuration.md)> |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `config?` | `C` | Optional configuration object for engine initialization. |

  #### Returns

  `Promise`\<`CreativeEngine` & `C` *extends* `object` ? `object` : `object`>

  A promise that resolves to an engine instance.

  #### Signature

  ```typescript
  init(config?: C): Promise<CreativeEngine & C extends { canvas: any } ? { element: undefined } : { element: HTMLCreativeEngineCanvasElement }>
  ```

  ***
</details>

<details>
  <summary>
    ### getBaseURL()

    <br /><p>Returns the configured base URL for the engine's assets.</p>
  </summary>

  #### Returns

  `string`

  The absolute base URL configured for this engine instance.

  #### Example

  ```typescript
  const engine = await CreativeEngine.init({
    baseURL: 'https://my-cdn.example.com/assets/'
  });

  console.log(engine.getBaseURL()); // 'https://my-cdn.example.com/assets/'
  ```

  #### Signature

  ```typescript
  getBaseURL(): string
  ```
</details>

## Core APIs

<details>
  <summary>
    ### asset

    <br /><p>Manage and interact with assets in the engine.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### block

    <br /><p>Create, find, delete and modify with blocks in the engine.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### editor

    <br /><p>Manage the editor state, including edit modes and undo/redo operations.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### event

    <br /><p>Subscribe to events in the engine.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### scene

    <br /><p>Manage scenes, including creating, modifying, and deleting scenes.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### variable

    <br /><p>Manage variables in the engine, allowing for dynamic data handling and manipulation.</p>
  </summary>
</details>

## Asset Sources

Methods for adding default and demo asset sources to the engine.

<details>
  <summary>
    ### ~~addDefaultAssetSources()~~

    <br /><p>Register a set of asset sources containing default assets.</p>
  </summary>

  Available default asset sources:

  - `'ly.img.sticker'` - Various stickers
  - `'ly.img.vectorpath'` - Shapes and arrows
  - `'ly.img.filter.lut'` - LUT effects of various kinds
  - `'ly.img.filter.duotone'` - Color effects of various kinds

  These assets are parsed at `\{\{base_url\}\}/<id>/content.json`, where
  `base_url` defaults to the IMG.LY CDN.
  Each source is created via `addLocalSource` and populated with the parsed assets. To modify the available
  assets, you may either exclude certain IDs via `excludeAssetSourceIds` or alter the sources after creation.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: [`DefaultAssetSourceId`](./api/engine/type-aliases/defaultassetsourceid.md)\[]; } | Configuration options for loading default asset sources. |
  | `options.baseURL?` | `string` | The source of the asset definitions, must be absolute. Defaults to IMG.LY CDN. |
  | `options.excludeAssetSourceIds?` | [`DefaultAssetSourceId`](./api/engine/type-aliases/defaultassetsourceid.md)\[] | A list of IDs, that will be ignored during load. |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when all asset sources are loaded.

  #### Deprecated

  This method uses legacy v4 asset source IDs and will be removed in a future version.
  Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().

  ***
</details>

<details>
  <summary>
    ### ~~addDemoAssetSources()~~

    <br /><p>Register a set of demo asset sources containing example assets.</p>
  </summary>

  **Note**: These are demonstration assets not meant for production use.

  Available demo asset sources:

  - `'ly.img.image'` - Sample images
  - `'ly.img.image.upload'` - Demo source to upload image assets
  - `'ly.img.audio'` - Sample audios
  - `'ly.img.audio.upload'` - Demo source to upload audio assets
  - `'ly.img.video'` - Sample videos
  - `'ly.img.video.upload'` - Demo source to upload video assets

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: [`DemoAssetSourceId`](./api/engine/type-aliases/demoassetsourceid.md)\[]; `sceneMode?`: `"Design"` | `"Video"`; `withUploadAssetSources?`: `boolean`; } | Configuration options for loading demo asset sources. |
  | `options.baseURL?` | `string` | The source of the demo asset definitions, must be absolute. Defaults to IMG.LY CDN. |
  | `options.excludeAssetSourceIds?` | [`DemoAssetSourceId`](./api/engine/type-aliases/demoassetsourceid.md)\[] | A list of IDs, that will be ignored during load |
  | `options.sceneMode?` | `"Design"` | `"Video"` | **Deprecated** Since v1.72. Scene mode no longer affects which asset sources are loaded. |
  | `options.withUploadAssetSources?` | `boolean` | If 'true' asset sources for uploads are added (default false) |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when all demo asset sources are loaded.

  #### Deprecated

  This method uses legacy v3 demo asset source IDs and will be removed in a future version.
  Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().
</details>

## Experimental Features

Experimental APIs that may change or be removed in future versions.

<details>
  <summary>
    ### unstable\_setVideoExportInactivityTimeout()
  </summary>

  Configure the timeout for video export inactivity detection.

  Some browsers exhibit a bug where support for certain video codecs is
  offered, but when attempting to decode or encode in these codecs, the
  request will simply never return. We detect that situation using a
  timeout. To prevent this mechanism from triggering in situations where the
  export simply takes long because of a slow device, you can configure the
  timeout here.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `timeout` | `number` | Timeout in milliseconds. Defaults to 10 seconds. This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_setExportInactivityTimeout()
  </summary>

  Configure the timeout for block-exports in WebWorkers.

  If exporting a block hangs because resources take too long to initialize,
  the export will be aborted after this many ms.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `timeout` | `number` | Timeout in milliseconds (default: 10 000) This API is experimental and may change or be removed in future versions. |

  #### Returns

  `void`
</details>


---

## More Resources

- **[React Documentation Index](https://img.ly/docs/cesdk/react.md)** - Browse all React documentation
- **[engine API Reference](./api/engine.md)** - Full engine API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support