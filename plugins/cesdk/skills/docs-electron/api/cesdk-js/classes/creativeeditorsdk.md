> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

The main entry point for the Creative Editor SDK.

This class provides a comprehensive interface for creating, configuring, and managing
creative editing experiences using our ready-made editor. The SDK can be configured to
serve a multitude of use cases, offering a wide range of features such as asset management,
scene creation, export operations, and plugin management.

## Categories

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>CreativeEditorSDK</code></p>
  </summary>
</details>

## Members

Instance members that allow access to the underlying engine, user interface, and configuration APIs.

<details>
  <summary>
    ### version

    <br /><p>The version of the CE.SDK package.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### engine

    <br /><p>Access to the CreativeEngine instance that powers the editor.</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### ui

    <br /><p>Access to the [UserInterfaceAPI](./api/cesdk-js/classes/userinterfaceapi.md) for controlling the editor's user interface</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### i18n

    <br /><p>Access to the [InternationalizationAPI](./api/cesdk-js/classes/internationalizationapi.md) to control locale and translations</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### feature

    <br /><p>Access to the [FeatureAPI](./api/cesdk-js/classes/featureapi.md) to control feature availability</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### actions

    <br /><p>Access to the [ActionsAPI](./api/cesdk-js/classes/actionsapi.md) to control event actions</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### utils

    <br /><p>Access to the [UtilsAPI](./api/cesdk-js/classes/utilsapi.md) for utility functions</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### version

    <br /><p>The version of the Creative Editor SDK</p>
  </summary>
</details>

## Lifecycle Management

Methods for SDK initialization, cleanup, and resource management.

<details>
  <summary>
    ### dispose()

    <br /><p>Disposes the editor and engine if no longer needed.</p>
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
    ### create()

    <br /><p>Creates an editor and renders it for the given container.</p>
  </summary>

  This method gives you more control over the initialization process of the
  editor.  After the returned Promise resolves, you can execute configuration
  commands on the CreativeEditorSDK instance.  Once that is done, you can
  load or create an initial scene. Until then the CreativeEditorSDK will
  display a loading spinner

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `container` | `string` | `HTMLDivElement` | the container to mount the editor as a HTML element or selector |
  | `config?` | [`Configuration`](./api/cesdk-js/type-aliases/configuration.md) | the initial configuration to create the editor |

  #### Returns

  `Promise`\<`CreativeEditorSDK`>

  a promise which resolves after the engine is ready to receive further commands on the CreativeEditorSDK instance

  #### Signature

  ```typescript
  create(container: string | HTMLDivElement, config?: Configuration): Promise<CreativeEditorSDK>
  ```
</details>

## Configuration

Methods for configuring SDK behavior, translations, and runtime settings.

<details>
  <summary>
    ### onReset()

    <br /><p>Registers a callback function to be executed when resetEditor is called.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `callback` | (`cesdk`) => `void` | Function to be called with the cesdk instance when reset occurs |

  #### Returns

  Function to remove the callback from the registry

  () => `void`

  #### Example

  ```typescript
  const removeCallback = cesdk.onReset((cesdk) => {
    console.log('Editor is being reset');
    // Custom cleanup/reinitialization logic
  });

  // Later, to remove the callback:
  removeCallback();
  ```

  #### Signature

  ```typescript
  onReset(callback: (cesdk: CreativeEditorSDK) => void): () => void
  ```

  ***
</details>

<details>
  <summary>
    ### disableNoSceneWarning()

    <br /><p>Disable the warning logged when no scene is available.</p>
  </summary>

  If no scene is available, 2 seconds after `CreativeEditorSDK.create()`,
  a warning is shown on the console. This method disables this warning.
  That can be useful in situation where you are waiting for long running
  async processes to finish before creating the scene.

  #### Returns

  `void`

  #### Signature

  ```typescript
  disableNoSceneWarning(): void
  ```

  ***
</details>

<details>
  <summary>
    ### resetEditor()

    <br /><p>Resets the editor to a clean state by disabling all features, clearing UI configurations,
    and removing asset sources.</p>
  </summary>

  #### Returns

  `void`

  #### Example

  ```typescript
  // Reset the editor to clean state
  cesdk.resetEditor();

  // Reconfigure as needed
  cesdk.feature.enable('ly.img.navigation.bar');
  cesdk.addPlugin(new TypefaceAssetSource());
  ```

  #### Signature

  ```typescript
  resetEditor(): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~reapplyLegacyUserConfiguration()~~

    <br /><p>Re-applies the user's initial deprecated configuration that was passed to
    <code>CreativeEditorSDK.create()</code>. This restores deprecated configuration
    values that may have been cleared by <code>resetEditor()</code>.</p>
  </summary>

  Config plugins should call this as the last step of their `initialize()`
  method, after all features, UI, actions, and settings have been set up.

  #### Returns

  `void`

  #### Deprecated

  This method is an intermediate measure to preserve backward
  compatibility while users migrate away from deprecated configuration
  options. It will be removed once the deprecated configuration paths
  are fully dropped.

  ***
</details>

<details>
  <summary>
    ### ~~setTranslations()~~

    <br /><p>Adds translations to be used by the editor.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `definition` | `Partial`\<`Record`\<[`LocaleKey`](./api/cesdk-js/type-aliases/localekey.md), `Partial`\<[`Translations`](./api/cesdk-js/interfaces/translations.md)>>> | locale to a translation object |

  #### Returns

  `void`

  #### Deprecated

  Use `cesdk.i18n.setTranslations()` instead. This method will be removed in a future version.

  #### Example

  ```
  // Deprecated - do not use
  cesdk.setTranslations({...});

  // Use this instead
  cesdk.i18n.setTranslations({
   en: {
     presets: {
       scene: ...
     }
   }
  })
  ```
</details>

## Plugin Management

Methods for extending SDK functionality through plugins and custom integrations.

<details>
  <summary>
    ### addPlugin()

    <br /><p>Adds and initializes a plugin to the editor.</p>
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `plugin` | [`EditorPlugin`](./api/cesdk-js/interfaces/editorplugin.md) |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  addPlugin(plugin: EditorPlugin): Promise<void>
  ```
</details>

## Asset Management

Methods for registering, managing, and refreshing asset sources including default assets,
demo assets, and custom asset libraries.

<details>
  <summary>
    ### ~~addDefaultAssetSources()~~

    <br /><p>Convenience function to register a set of our default asset sources.</p>
  </summary>

  The sources contain our example assets. These are:

  - `'ly.img.sticker'` - Various stickers
  - `'ly.img.vector.shape'` - Shapes and arrows
  - `'ly.img.filter'` - Filter effects (LUT and duotone)

  These assets are parsed at `\{\{base_url\}\}/<id>/content.json`, where
  `baseURL` defaults to the IMG.LY CDN.
  Each source is created via `addLocalSource` and populated with the parsed assets. To modify the available
  assets, you may either exclude certain IDs via `excludeAssetSourceIds` or alter the sources after creation.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: `DefaultAssetSourceId`\[]; } | Configuration options for asset sources. Contains `baseURL` (defaults to IMG.LY CDN) and `excludeAssetSourceIds` (IDs to ignore during load). |
  | `options.baseURL?` | `string` | - |
  | `options.excludeAssetSourceIds?` | `DefaultAssetSourceId`\[] | - |

  #### Returns

  `Promise`\<`void`>

  #### Deprecated

  This method uses legacy v4 asset source IDs and will be removed in a future version.
  Please migrate to v5 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().

  ***
</details>

<details>
  <summary>
    ### ~~addDemoAssetSources()~~

    <br /><p>Convenience function that registers a set of demo asset sources</p>
  </summary>

  These contain our example assets. These are not to meant to be used in your production code.

  These are

  - `'ly.img.image'` - Sample images
  - `'ly.img.image.upload'` - Demo source to upload image assets
  - `'ly.img.audio'` - Sample audios
  - `'ly.img.audio.upload'` - Demo source to upload audio assets
  - `'ly.img.video'` - Sample videos
  - `'ly.img.video.upload'` - Demo source to upload video assets

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | \{ `baseURL?`: `string`; `excludeAssetSourceIds?`: `DemoAssetSourceId`\[]; `sceneMode?`: `SceneMode`; `withUploadAssetSources?`: `boolean`; } | Configuration options for asset sources. Contains `baseURL` (defaults to IMG.LY CDN), `excludeAssetSourceIds` (IDs to ignore during load), and `sceneMode` (loads video-specific sources if 'Video'). |
  | `options.baseURL?` | `string` | - |
  | `options.excludeAssetSourceIds?` | `DemoAssetSourceId`\[] | - |
  | `options.sceneMode?` | `SceneMode` | - |
  | `options.withUploadAssetSources?` | `boolean` | - |

  #### Returns

  `Promise`\<`void`>

  #### Deprecated

  This method uses legacy v3 demo asset source IDs and will be removed in a future version.
  Please migrate to v4 asset sources using engine.asset.addLocalAssetSourceFromJSONURI().

  ***
</details>

<details>
  <summary>
    ### ~~refetchAssetSources()~~

    <br /><p>Trigger a refetch of the asset source and update the asset library panel with the new items accordingly.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `sourceId?` | `string` | `string`\[] | The ID or IDs of the asset sources to refetch. If not provided, all asset sources will be refetched. |

  #### Returns

  `void`

  #### Deprecated

  Please use `cesdk.engine.asset.assetSourceContentsChanged` instead.
</details>

## Scene Creation

Methods for creating new scenes from scratch, including design scenes, video scenes,
and scenes from existing images.

<details>
  <summary>
    ### ~~createDesignScene()~~

    <br /><p>Create a scene with a single empty page with the given format.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `format?` | [`PageFormatDefinition`](./api/cesdk-js/type-aliases/pageformatdefinition.md) | A `PageFormatDefinition` object specifying the page format to use. |

  #### Returns

  `Promise`\<`number`>

  #### Deprecated

  Use `cesdk.actions.run('scene.create', { mode: 'Design' })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~createVideoScene()~~

    <br /><p>Create a scene with a single empty page with the given format.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `format?` | [`PageFormatDefinition`](./api/cesdk-js/type-aliases/pageformatdefinition.md) | The page format to use. Can be either a string, identifying a page format that has been configured or a `PageFormatDefinition` object. |

  #### Returns

  `Promise`\<`number`>

  #### Deprecated

  Use `cesdk.actions.run('scene.create', { mode: 'Video' })` instead.

  ***
</details>

<details>
  <summary>
    ### createFromImage()

    <br /><p>Loads the given image and creates a scene with a single page showing the image.</p>
  </summary>

  Fetching the image may take an arbitrary amount of time, so the scene isn't immediately available.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The image URL. |
  | `dpi?` | `number` | The scene's DPI. Defaults to 300. |
  | `pixelScaleFactor?` | `number` | The display's pixel scale factor. Defaults to 1. |
  | `sceneLayout?` | `SceneLayout` | The layout of the scene. Defaults to 'Free'. |
  | `spacing?` | `number` | Spacing between pages. Defaults to 0. |
  | `spacingInScreenSpace?` | `boolean` | Whether spacing is in screen space. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  a promise which resolves if the scene was successfully created.

  #### Signature

  ```typescript
  createFromImage(url: string, dpi?: number, pixelScaleFactor?: number, sceneLayout?: SceneLayout, spacing?: number, spacingInScreenSpace?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### createFromVideo()

    <br /><p>Create a scene from the provided video.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The url of the video |

  #### Returns

  `Promise`\<`number`>

  a promise which resolves if the scene was successfully created.

  #### Signature

  ```typescript
  createFromVideo(url: string): Promise<number>
  ```
</details>

## Scene Loading

Methods for loading existing scenes from various sources including strings, URLs,
and encoded scene data.

<details>
  <summary>
    ### ~~load()~~

    <br /><p>Load an encoded scene from the provided string.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `scene` | `string` | A string starting with UBQ1 and containing the encoded scene. |

  #### Returns

  `Promise`\<`number`>

  #### Deprecated

  Use `loadFromString` instead.

  ***
</details>

<details>
  <summary>
    ### loadFromString()

    <br /><p>Load an encoded scene from the provided string.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `scene` | `string` | A string starting with UBQ1 and containing the encoded scene. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  a promise which resolves if the scene was successfully loaded.

  #### Signature

  ```typescript
  loadFromString(scene: string, overrideEditorConfig?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromURL()

    <br /><p>Load the scene stored in the file at the given URL.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The url to fetch to acquire the scene string. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  a promise which resolves if the scene was successfully loaded.

  #### Signature

  ```typescript
  loadFromURL(url: string, overrideEditorConfig?: boolean): Promise<number>
  ```

  ***
</details>

<details>
  <summary>
    ### loadFromArchiveURL()

    <br /><p>Load a previously archived scene from the URL to the scene file.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `url` | `string` | The URL of the scene archive file. |
  | `overrideEditorConfig?` | `boolean` | Whether to override editor configuration with settings and data from the scene file. Defaults to false. |

  #### Returns

  `Promise`\<`number`>

  a promise which resolves if the scene was successfully loaded.

  #### Signature

  ```typescript
  loadFromArchiveURL(url: string, overrideEditorConfig?: boolean): Promise<number>
  ```
</details>

## Scene Saving

Methods for persisting and exporting scene data as strings or files.

<details>
  <summary>
    ### save()

    <br /><p>Save and return a scene as a base64 encoded string.</p>
  </summary>

  #### Returns

  `Promise`\<`string`>

  a promise with the scene as a string

  #### Signature

  ```typescript
  save(): Promise<string>
  ```
</details>

## Export Operations

Methods for exporting scenes and pages as files in various formats and mimeTypes.

<details>
  <summary>
    ### export()

    <br /><p>Exports one or multiple page(s) as an file in the given mimeType</p>
  </summary>

  Please note: the `onExport` callback provided in the configuration will be
  not called. This callback is for exports triggered by an user interaction.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`ExportOptions`](./api/cesdk-js/interfaces/exportoptions.md) | options for the export |

  #### Returns

  `Promise`\<\{
  `blobs`: `Blob`\[];
  `options`: [`ExportOptions`](./api/cesdk-js/interfaces/exportoptions.md);
  }>

  a promise with an object holding `blobs` of the export pages and the provided `options`.

  #### Signature

  ```typescript
  export(options: ExportOptions): Promise<object>
  ```
</details>

## Upload Operations

Methods for handling file uploads and asset creation from user-provided files.

<details>
  <summary>
    ### ~~unstable\_upload()~~
  </summary>

  Uses the configured upload handler to upload the given file.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `file` | `File` | The file to upload |
  | `onProgress` | (`progress`) => `void` | A callback to track the progress of the upload This API is experimental and may change or be removed in future versions. |

  #### Returns

  `Promise`\<`AssetDefinition`>

  #### Deprecated

  This API will be removed in future versions. Please use the `uploadFile` action instead.
</details>

## Other

<details>
  <summary>
    ### ui

    <br /><p>| Name | Type |
    | ------ | ------ |
    | <code>addIconSet()</code> | (<code>id</code>, <code>svgSprite</code>) => <code>void</code> |
    | <code>setComponentOrder()</code> | (<code>\_options</code>, <code>order</code>) => <code>void</code> |
    | <code>setTheme()</code> | (<code>theme</code>) => <code>void</code> |</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### i18n

    <br /><p>| Name | Type |
    | ------ | ------ |
    | <code>setTranslations()</code> | (<code>definition</code>) => <code>void</code> |</p>
  </summary>

  ***
</details>

<details>
  <summary>
    ### getBaseURL()

    <br /><p>Returns the baseURL that was provided in the configuration during editor initialization.</p>
  </summary>

  #### Returns

  `string`

  The original baseURL from the top-level configuration

  #### Example

  ```typescript
  const cesdk = await CreativeEditorSDK.create('#editor', {
    baseURL: 'https://my-cdn.example.com/assets/'
  });

  console.log(cesdk.getBaseURL()); // 'https://my-cdn.example.com/assets/'
  ```

  #### Signature

  ```typescript
  getBaseURL(): string
  ```
</details>

## Page Management

This API is experimental and may change or be removed in future versions.

<details>
  <summary>
    ### unstable\_switchPage()
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `pageId` | `number` |

  #### Returns

  `Promise`\<`void`>

  ***
</details>

<details>
  <summary>
    ### unstable\_getPages()
  </summary>

  #### Returns

  `Promise`\<`number`\[]>

  ***
</details>

<details>
  <summary>
    ### unstable\_onActivePageChanged()
  </summary>

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `callback` | (`id`) => `void` |

  #### Returns

  () => `void`

  ***
</details>

<details>
  <summary>
    ### unstable\_focusPage()
  </summary>

  Focus on a specific page and zoom to fit it in the viewport.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `pageId` | `number` | The ID of the page to focus on |

  #### Returns

  `Promise`\<`void`>

  A promise that resolves when the focus operation is complete
</details>

## Upload Operations

This API is experimental and may change or be removed in future versions.

<details>
  <summary>
    ### ~~unstable\_supportsUpload()~~
  </summary>

  Returns true if a upload handler was configured. If mime types are given
  as an argument, it will return true if the upload handler supports all of
  the given mime types.

  #### Parameters

  | Parameter | Type |
  | ------ | ------ |
  | `mimeTypes?` | `string` | `string`\[] |

  #### Returns

  `boolean`

  #### Deprecated

  This API will be removed in future versions. Please use the `engine.editor.getSetting('upload/supportedMimeTypes')` to check for supported mime types instead.
</details>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support