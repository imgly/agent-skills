> This is one page of the CE.SDK Electron `@cesdk/cesdk-js` API reference. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md) or the [cesdk-js API Index](./api/cesdk-js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

---

Control the user interface and behavior of the Creative Editor SDK.

The UserInterfaceAPI provides comprehensive methods for managing panels,
notifications, dialogs, component registration, UI ordering, asset libraries,
and custom interface elements within the editor.

## Constructors

<details>
  <summary>
    ### Constructor

    <br /><p><code>UserInterfaceAPI</code></p>
  </summary>
</details>

## Experimental Features

<details>
  <summary>
    ### unstable\_registerCustomPanel()
  </summary>

  Registers a custom panel that hooks into a DOM element for custom UI rendering.

  The onMount function is called when the panel opens, and its return value
  (if a function) is called when the panel closes for cleanup.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The unique ID for the custom panel. |
  | `onMount` | [`CustomPanelMountFunction`](./api/cesdk-js/type-aliases/custompanelmountfunction.md) | Function called when the panel is mounted, should return a cleanup function. This API may change or be removed in future versions. |

  #### Returns

  `void`

  ***
</details>

<details>
  <summary>
    ### ~~unstable\_getView()~~
  </summary>

  Gets the current view style of the editor interface.

  #### Returns

  [`ViewStyle`](./api/cesdk-js/type-aliases/viewstyle.md)

  The current view style ('default' or 'advanced').

  #### Deprecated

  Use `getView()` instead. This experimental API will be removed in a future version.
  This API may change or be removed in future versions.

  #### Example

  ```javascript
  // Before (deprecated)
  const view = cesdk.ui.unstable_getView();

  // After (preferred)
  const view = cesdk.ui.getView();
  ```
</details>

## Asset Library

<details>
  <summary>
    ### addAssetLibraryEntry()

    <br /><p>Adds a new asset library entry for display in asset libraries.</p>
  </summary>

  If an entry with the same ID already exists, it will be replaced.
  The method validates sorting configurations and warns about duplicates.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `AssetLibraryEntry` | [`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md) | The asset library entry configuration to add. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  addAssetLibraryEntry(AssetLibraryEntry: AssetLibraryEntry): void
  ```

  ***
</details>

<details>
  <summary>
    ### updateAssetLibraryEntry()

    <br /><p>Updates an existing asset library entry with new properties.</p>
  </summary>

  The provided properties will be merged with the existing entry.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md) | The ID of the asset library entry to update. |
  | `assetLibraryEntry` | | `Partial`\<`Omit`\<[`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md), `"id"` | `"sourceIds"`> & `object`> | ((`entry`) => `Partial`\<`Omit`\<[`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md), `"id"` | `"sourceIds"`> & `object`>) | Partial entry properties to merge with the existing entry, or a function that receives the current entry and returns the updated properties. |

  #### Returns

  `void`

  #### Example

  ```typescript
  // Simple static update
  cesdk.ui.updateAssetLibraryEntry('ly.img.colors', {
    sourceIds: ['my-custom-colors']
  });

  // Update other properties using callback with entry
  cesdk.ui.updateAssetLibraryEntry('ly.img.pagePresets', (entry) => ({
    title: entry?.title ? `${entry.title} (Custom)` : 'Page Formats',
    icon: { name: 'format-icon' }
  }));

  // Extend sourceIds with lazy resolution (preserves dynamic behavior)
  cesdk.ui.updateAssetLibraryEntry('ly.img.typefaces', {
    sourceIds: ({ currentIds }) => [...currentIds, 'my-custom-fonts']
  });
  ```

  #### Signature

  ```typescript
  updateAssetLibraryEntry(id: AssetEntryId, assetLibraryEntry: Partial<Omit<AssetLibraryEntry, "id" | "sourceIds"> & object> | (entry: AssetLibraryEntry) => Partial<Omit<AssetLibraryEntry, "id" | "sourceIds"> & object>): void
  ```

  ***
</details>

<details>
  <summary>
    ### removeAssetLibraryEntry()

    <br /><p>Removes an asset library entry from the available entries.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md) | The ID of the asset library entry to remove. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  removeAssetLibraryEntry(id: AssetEntryId): void
  ```

  ***
</details>

<details>
  <summary>
    ### getAssetLibraryEntry()

    <br /><p>Gets a specific asset library entry by its ID.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md) | The ID of the asset library entry to retrieve. |

  #### Returns

  [`AssetLibraryEntry`](./api/cesdk-js/interfaces/assetlibraryentry.md)

  The asset library entry configuration, or undefined if not found.

  #### Signature

  ```typescript
  getAssetLibraryEntry(id: AssetEntryId): AssetLibraryEntry
  ```

  ***
</details>

<details>
  <summary>
    ### findAllAssetLibraryEntries()

    <br /><p>Gets all currently registered asset library entry IDs.</p>
  </summary>

  #### Returns

  [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md)\[]

  Array of asset library entry IDs.

  #### Signature

  ```typescript
  findAllAssetLibraryEntries(): AssetEntryId[]
  ```

  ***
</details>

<details>
  <summary>
    ### ~~setBackgroundTrackAssetLibraryEntries()~~

    <br /><p>Sets the asset library entries to use for the background track in video scenes.</p>
  </summary>

  This setting only affects video scenes and has no impact on other scene types.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `backgroundTrackAssetLibraryEntries` | [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md)\[] | Array of asset library entry IDs for the background track. |

  #### Returns

  `void`

  #### Deprecated

  please use the cesdk.actions API to register an action for 'addClip' and implement your own logic.

  #### Example

  ```ts
  // Before
  cesdk.ui.setBackgroundTrackAssetLibraryEntries(['ly.img.video', 'ly.img.image']);
  // After
  cesdk.actions.register('addClip', async () => {
    cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
      payload: {
        entries: ['ly.img.video', 'ly.img.image']
      }
    });
  });
  ```

  ***
</details>

<details>
  <summary>
    ### ~~getBackgroundTrackAssetLibraryEntries()~~

    <br /><p>Gets the asset library entries configured for the background track in video scenes.</p>
  </summary>

  This setting only affects video scenes and has no impact on other scene types.

  #### Returns

  [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md)\[]

  Array of asset library entry IDs configured for the background track.

  #### Deprecated

  The background track entries are now defined via the cesdk.actions API.

  ***
</details>

<details>
  <summary>
    ### setReplaceAssetLibraryEntries()

    <br /><p>Sets a function that determines which asset library entries to use for replacement operations.</p>
  </summary>

  The function receives context information (like selected blocks or default entry IDs)
  and returns the appropriate asset library entry IDs for replacement.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `replaceAssetLibraryEntries` | (`context`) => [`AssetEntryId`](./api/cesdk-js/type-aliases/assetentryid.md)\[] | Function that receives context and returns an array of asset library entry IDs for replacement. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setReplaceAssetLibraryEntries(replaceAssetLibraryEntries: (context: ReplaceAssetLibraryEntriesContext) => AssetEntryId[]): void
  ```
</details>

## Component Registration

<details>
  <summary>
    ### registerPanel()

    <br /><p>Registers a panel with builder-based rendering system.</p>
  </summary>

  The builder render function will be called with a builder and the engine
  as arguments. The builder object is used to defined what base components
  should be rendered (such as a button). The engine can be used to get any
  state from the engine. The render function will be re-called if anything
  in the engine changes regarding the made engine calls.

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `P` *extends* [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) | [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The panel ID for use with panel management APIs. |
  | `renderPanel` | [`BuilderRenderFunction`](./api/cesdk-js/type-aliases/builderrenderfunction.md)\<`P`> | Function that renders the panel content using the builder system. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  registerPanel(panelId: string, renderPanel: BuilderRenderFunction<P>): void
  ```

  ***
</details>

<details>
  <summary>
    ### ~~unstable\_registerPanel()~~

    <br /><p>Registers a panel with builder-based rendering system.</p>
  </summary>

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `P` *extends* [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) | [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The panel ID for use with panel management APIs. |
  | `renderComponent` | [`BuilderRenderFunction`](./api/cesdk-js/type-aliases/builderrenderfunction.md)\<`P`> | Function that renders the panel content using the builder system. |

  #### Returns

  `void`

  #### Deprecated

  Use `registerPanel` instead.

  ***
</details>

<details>
  <summary>
    ### registerComponent()

    <br /><p>Registers a component that can be rendered at different UI locations.</p>
  </summary>

  The builder render function will be called with a builder and the engine
  as arguments. The builder object is used to defined what base components
  should be rendered (such as a button). The engine can be used to get any
  state from the engine. The render function will be re-called if anything
  in the engine changes regarding the made engine calls.

  #### Type Parameters

  | Type Parameter | Default type |
  | ------ | ------ |
  | `P` *extends* [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) | [`ComponentPayload`](./api/cesdk-js/interfaces/componentpayload.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `ids` | `string` | `string`\[] | The component ID or array of IDs for use in ordering APIs. |
  | `renderComponent` | [`BuilderRenderFunction`](./api/cesdk-js/type-aliases/builderrenderfunction.md)\<`P`> | Function that renders the component using the builder system. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  registerComponent(ids: string | string[], renderComponent: BuilderRenderFunction<P>): void
  ```
</details>

## Dialogs

<details>
  <summary>
    ### showDialog()

    <br /><p>Displays a modal dialog with custom content and actions.</p>
  </summary>

  Dialogs can have different types (info, success, warning, error, loading)
  and support custom actions like OK, Cancel, or custom buttons.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `dialog` | `string` | [`Dialog`](./api/cesdk-js/interfaces/dialog.md) | The dialog content as a string or dialog object. |

  #### Returns

  `string`

  The dialog ID for programmatic updates or closure.

  #### Signature

  ```typescript
  showDialog(dialog: string | Dialog): string
  ```

  ***
</details>

<details>
  <summary>
    ### updateDialog()

    <br /><p>Updates an existing dialog with new content or properties.</p>
  </summary>

  The dialog properties will be merged with the existing dialog configuration.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the dialog to update. |
  | `dialog` | | `Partial`\<[`Dialog`](./api/cesdk-js/interfaces/dialog.md)> | ((`dialog`) => `Partial`\<[`Dialog`](./api/cesdk-js/interfaces/dialog.md)>) | Partial dialog properties to merge, or a function that receives the current dialog and returns updates. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  updateDialog(id: string, dialog: Partial<Dialog> | (dialog: Dialog) => Partial<Dialog>): void
  ```

  ***
</details>

<details>
  <summary>
    ### closeDialog()

    <br /><p>Closes a dialog programmatically.</p>
  </summary>

  If the dialog has an onClose callback, it will be executed before removal.
  Closing an already closed dialog has no effect.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the dialog to close. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  closeDialog(id: string): void
  ```
</details>

## Notifications

<details>
  <summary>
    ### showNotification()

    <br /><p>Displays a non-blocking notification message to the user.</p>
  </summary>

  Notifications appear temporarily and can be dismissed by the user.
  They support different types (info, success, warning, error) and durations.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `notification` | | `string` | [`Notification`](./api/cesdk-js/interfaces/notification.md) | The notification content as a string or notification object. |

  #### Returns

  `string`

  The notification ID for programmatic updates or dismissal.

  #### Signature

  ```typescript
  showNotification(notification: string | Notification_2): string
  ```

  ***
</details>

<details>
  <summary>
    ### dismissNotification()

    <br /><p>Dismisses a notification programmatically.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the notification to dismiss. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  dismissNotification(id: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### updateNotification()

    <br /><p>Updates an existing notification with new content or properties.</p>
  </summary>

  The notification object will be merged with the existing notification.
  If the duration is updated, the timeout will be reset. Updates to
  dismissed notifications are ignored.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The ID of the notification to update. |
  | `notification` | `Partial`\<[`Notification`](./api/cesdk-js/interfaces/notification.md)> | Partial notification properties to merge. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  updateNotification(id: string, notification: Partial<Notification_2>): void
  ```
</details>

## Other

<details>
  <summary>
    ### experimental

    <br /><p>PLEASE NOTE: This contains experimental APIs.</p>
  </summary>

  Use them with caution since they might change without warning and might be replaced
  with a completely different concept or maybe not at all.

  ***
</details>

<details>
  <summary>
    ### getView()

    <br /><p>Gets the current view style of the editor interface.</p>
  </summary>

  The view style controls the complexity and feature set shown in the UI.
  'default' provides a simplified interface, while 'advanced' shows more
  comprehensive editing tools and options.

  #### Returns

  [`ViewStyle`](./api/cesdk-js/type-aliases/viewstyle.md)

  The current view style ('default' or 'advanced').

  #### Example

  ```javascript
  // Get the current view style
  const viewStyle = cesdk.ui.getView(); // 'default' or 'advanced'

  // Use for conditional UI logic
  const showAdvancedOptions = cesdk.ui.getView() === 'advanced';

  // Switch to advanced mode if currently in default
  if (cesdk.ui.getView() === 'default') {
    cesdk.ui.setView('advanced');
  }
  ```

  #### Signature

  ```typescript
  getView(): ViewStyle
  ```

  ***
</details>

<details>
  <summary>
    ### setView

    <br /><p>Sets the view style of the editor interface.</p>
  </summary>

  This immediately updates the UI to reflect the new view style.
  The view style controls which UI elements and features are available.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `view` | [`ViewStyle`](./api/cesdk-js/type-aliases/viewstyle.md) | The view style to set ('default' or 'advanced'). |

  #### Returns

  `void`

  #### Example

  ```javascript
  // Set view to advanced mode
  cesdk.ui.setView('advanced');

  // Set view to simplified mode
  cesdk.ui.setView('default');

  // Toggle between view styles
  const currentView = cesdk.ui.getView();
  const newView = currentView === 'advanced' ? 'default' : 'advanced';
  cesdk.ui.setView(newView);
  ```

  ***
</details>

<details>
  <summary>
    ### applyForceCrop()

    <br /><p>programmatically applies a crop preset to a design block.</p>
  </summary>

  This is useful in scenarios where you want to enforce a particular
  format (e.g., fixed aspect ratio) and define how the editor should
  respond after the preset is applied.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `DesignBlockId` | The ID of the design block to apply the crop preset to. |
  | `options` | \{ `sourceId`: `string`; `presetId`: `string`; `mode`: `"silent"` | `"always"` | `"ifNeeded"`; } | Options for applying the crop preset: - `sourceId`: The ID of the asset source containing the crop preset. - `presetId`: The ID of the crop preset to apply. - `mode`: The mode for applying the crop preset: - `'silent'`: Apply the crop preset silently. - `'always'`: Apply the crop preset and enter crop mode. - `'ifNeeded'`: Apply the crop preset only if needed (i.e., if the preset is different from the current crop). |
  | `options.sourceId` | `string` | - |
  | `options.presetId` | `string` | - |
  | `options.mode` | `"silent"` | `"always"` | `"ifNeeded"` | - |

  #### Returns

  `Promise`\<`void`>

  #### Signature

  ```typescript
  applyForceCrop(id: DesignBlockId, options: object): Promise<void>
  ```
</details>

## Panel Management

<details>
  <summary>
    ### openPanel()

    <br /><p>Opens a panel if it exists, is not already open, and is currently registered.</p>
  </summary>

  If requirements are not met, this is a no-op.

  Available built-in panel IDs:

  - `//ly.img.panel/inspector` - Opens the inspector panel for the selected block
  - `//ly.img.panel/assetLibrary.replace` - Opens the asset library for replacing the selected block. Beware that the library might show nothing depending on how it was configured.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* [`PanelId`](./api/cesdk-js/type-aliases/panelid.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `T` | The ID of the panel to open. |
  | `options?` | [`PanelOptions`](./api/cesdk-js/type-aliases/paneloptions.md)\<`T`> | Optional configuration for panel position and floating state. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  openPanel(panelId: T, options?: PanelOptions<T>): void
  ```

  ***
</details>

<details>
  <summary>
    ### closePanel()

    <br /><p>Closes panels that match the given pattern. Supports wildcard matching.</p>
  </summary>

  Available built-in panel IDs:

  - `//ly.img.panel/inspector` - Inspector panel
  - `//ly.img.panel/assetLibrary` - Asset library
  - `//ly.img.panel/assetLibrary.replace` - Replacement asset library

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The panel ID or pattern to match panels for closing. |

  #### Returns

  `void`

  #### Example

  ```javascript
  // Close a specific panel by exact ID
  cesdk.ui.closePanel('//ly.img.panel/inspector');

  // Close all ly.img panels using wildcard
  cesdk.ui.closePanel('//ly.img.*');

  // Close all panels with specific prefix
  cesdk.ui.closePanel('//ly.img.panel/*');

  // Close panels matching complex pattern
  cesdk.ui.closePanel('//ly.img.panel/' + '*' + '/stroke/' + '*');

  // Close any inspector panels regardless of namespace
  cesdk.ui.closePanel('*' + '/inspector');

  // Close all asset library panels
  cesdk.ui.closePanel('*assetLibrary*');
  ```

  #### Signature

  ```typescript
  closePanel(panelId: string): void
  ```

  ***
</details>

<details>
  <summary>
    ### isPanelOpen()

    <br /><p>Checks if a panel is currently open.</p>
  </summary>

  Available built-in panel IDs:

  - `//ly.img.panel/inspector` - Inspector panel for the selected block
  - `//ly.img.panel/assetLibrary` - Asset library panel
  - `//ly.img.panel/assetLibrary.replace` - Replacement asset library panel

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* [`PanelId`](./api/cesdk-js/type-aliases/panelid.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `T` | The ID of the panel to check. |
  | `options?` | [`PanelOptions`](./api/cesdk-js/type-aliases/paneloptions.md)\<`T`> | Optional criteria to match against the panel's current state. |

  #### Returns

  `boolean`

  True if the panel is open and matches the specified options, false otherwise.

  #### Signature

  ```typescript
  isPanelOpen(panelId: T, options?: PanelOptions<T>): boolean
  ```

  ***
</details>

<details>
  <summary>
    ### findAllPanels()

    <br /><p>Gets all panel IDs, optionally filtered by state or position.</p>
  </summary>

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `T` *extends* [`PanelId`](./api/cesdk-js/type-aliases/panelid.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options?` | [`PanelOptions`](./api/cesdk-js/type-aliases/paneloptions.md)\<`T`> & `object` | Optional filter criteria for panel state and position. |

  #### Returns

  `string`\[]

  Array of panel IDs matching the specified criteria.

  #### Example

  ```
  cesdk.ui.findAllPanels();
  cesdk.ui.findAllPanels({ open: true, position: 'left' });
  ```

  #### Signature

  ```typescript
  findAllPanels(options?: PanelOptions<T> & object): string[]
  ```

  ***
</details>

<details>
  <summary>
    ### setPanelPosition()

    <br /><p>Sets the position of a panel within the editor interface.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The ID of the panel to position. |
  | `panelPosition` | | [`PanelPosition`](./api/cesdk-js/type-aliases/panelposition.md) | (() => [`PanelPosition`](./api/cesdk-js/type-aliases/panelposition.md)) | The position ('left' or 'right') or a function returning the position. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPanelPosition(panelId: string, panelPosition: PanelPosition | () => PanelPosition): void
  ```

  ***
</details>

<details>
  <summary>
    ### getPanelPosition()

    <br /><p>Gets the current position of a panel.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The ID of the panel. |

  #### Returns

  [`PanelPosition`](./api/cesdk-js/type-aliases/panelposition.md)

  The panel's position ('left' or 'right').

  #### Signature

  ```typescript
  getPanelPosition(panelId: string): PanelPosition
  ```

  ***
</details>

<details>
  <summary>
    ### setPanelFloating()

    <br /><p>Sets whether a panel floats over the canvas.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The ID of the panel to configure. |
  | `floating` | `boolean` | (() => `boolean`) | True to make the panel float over the canvas, false to dock it. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  setPanelFloating(panelId: string, floating: boolean | () => boolean): void
  ```

  ***
</details>

<details>
  <summary>
    ### getPanelFloating()

    <br /><p>Checks if a panel is currently floating over the canvas.</p>
  </summary>

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `panelId` | `string` | The ID of the panel to check. |

  #### Returns

  `boolean`

  True if the panel is floating, false if it's docked.

  #### Signature

  ```typescript
  getPanelFloating(panelId: string): boolean
  ```
</details>

## Theme Management

<details>
  <summary>
    ### getTheme()

    <br /><p>Gets the resolved theme that is currently being used.
    If the theme configuration is 'system', returns the OS preference.
    If the theme configuration is a function, it is evaluated lazily and the result is returned.</p>
  </summary>

  #### Returns

  [`Theme`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/theme.md)

  The resolved theme ('light' or 'dark').

  #### Example

  ```javascript
  // Get the actual theme being used
  const theme = cesdk.ui.getTheme(); // 'light' or 'dark'

  // Use for conditional styling
  const iconColor = cesdk.ui.getTheme() === 'dark' ? 'white' : 'black';

  // Theme function is evaluated each time getTheme() is called
  cesdk.ui.setTheme(() => new Date().getHours() >= 18 ? 'dark' : 'light');
  const currentTheme = cesdk.ui.getTheme(); // Function is evaluated here
  ```

  #### Signature

  ```typescript
  getTheme(): Theme
  ```

  ***
</details>

<details>
  <summary>
    ### setTheme

    <br /><p>Sets the theme configuration.</p>
  </summary>

  This will immediately update the UI to reflect the new theme.
  Can be set to:

  - 'light' or 'dark' for a specific theme
  - 'system' to use the OS preference
  - A function that returns 'light' or 'dark' for dynamic theming

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `theme` | [`ThemeConfig`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/themeconfig.md) | The theme configuration to set. |

  #### Returns

  `void`

  #### Example

  ```javascript
  // Set a specific theme
  cesdk.ui.setTheme('dark');

  // Use system preference
  cesdk.ui.setTheme('system');

  // Set theme based on custom logic
  cesdk.ui.setTheme(() => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6 ? 'dark' : 'light';
  });

  // Toggle between themes
  const currentTheme = cesdk.ui.getTheme();
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  cesdk.ui.setTheme(newTheme);
  ```
</details>

## UI Layout

<details>
  <summary>
    ### ~~setDockOrder()~~

    <br /><p>Sets the rendering order of components in the dock area.</p>
  </summary>

  The ids in this order refer to registered default components or custom components
  registered in `registerComponent`.

  Different orders can be set depending on different contexts. The context
  consists of the edit mode (e.g. `Transform` or `Text`) right now. If no
  context is given, the default order is set for the `Transform` edit mode.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `dockOrder` | ( | [`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md) | [`DockOrderComponent`](./api/cesdk-js/type-aliases/dockordercomponent.md))\[] | Array of component IDs defining the dock order. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying when this order applies. |

  #### Returns

  `void`

  #### Deprecated

  Use `setComponentOrder({ in: 'ly.img.dock' }, order)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getDockOrder()~~

    <br /><p>Gets the current rendering order of dock components.</p>
  </summary>

  The id in this order refer to registered default components or custom components
  registered in `registerComponent`.

  Different orders could have been set depending on different contexts.
  The context consists of the edit mode (e.g. `Transform` or `Text`) right now.
  If no context is given, the default order (with `Transform` edit mode) is
  returned.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to retrieve. |

  #### Returns

  [`DockOrderComponent`](./api/cesdk-js/type-aliases/dockordercomponent.md)\[]

  Array of component configurations defining the dock order.

  #### Deprecated

  Use `getComponentOrder({ in: 'ly.img.dock' })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~updateDockOrderComponent()~~

    <br /><p>Updates a component in the render order of the dock area.</p>
  </summary>

  This method finds a dock order component matching the provided matcher and updates it
  with the given component, ID, or updater function. The matcher can be a function or
  an object describing the component to match. The update can be a new ID, a partial
  object with updated properties, or a function that receives the current component and
  returns the updated one.

  The update API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>> | Function or object to match the component to update. |
  | `update` | | [`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md) | `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>> | ((`component`) => `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>>) | New ID, partial properties, or updater function for the component. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated dock order array.

  | Name | Type |
  | ------ | ------ |
  | `updated` | `number` |
  | `order` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>\[] |

  #### Deprecated

  Use `updateOrderComponent({ in: 'ly.img.dock', match }, update)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~removeDockOrderComponent()~~

    <br /><p>Removes a component from the render order of the dock area.</p>
  </summary>

  This method finds a dock order component matching the provided matcher and removes it
  from the current order. The matcher can be a function or an object describing the component to match.

  The remove API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>> | Function or object to match the component to remove. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated dock order array.

  | Name | Type |
  | ------ | ------ |
  | `removed` | `number` |
  | `order` | [`DockOrderComponent`](./api/cesdk-js/type-aliases/dockordercomponent.md)\[] |

  #### Deprecated

  Use `removeOrderComponent({ in: 'ly.img.dock', match })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~insertDockOrderComponent()~~

    <br /><p>Inserts a component into the render order of the dock area.</p>
  </summary>

  This method inserts a new dock order component before or after a component matching
  the provided matcher. The matcher can be a function or an object describing the component to match.
  The location can be 'before' or 'after'.

  The insert API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)>> | Function or object to match the component to insert relative to. |
  | `component` | | [`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`DockOrderComponentId`](./api/cesdk-js/type-aliases/dockordercomponentid.md)> | The component ID or configuration to insert. |
  | `location?` | [`InsertOrderComponentLocation`](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Where to insert the new component relative to the matched component ('before' or 'after'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated dock order array.

  | Name | Type |
  | ------ | ------ |
  | `inserted` | `boolean` |
  | `order` | ( | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`string`> | \{ `id`: `string`; })\[] |

  #### Deprecated

  Use `insertOrderComponent({ in: 'ly.img.dock', before/after }, component)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~setInspectorBarOrder()~~

    <br /><p>Sets the rendering order of components in the inspector bar.</p>
  </summary>

  The
  id in this order refer to registered default components or custom components
  registered in `registerComponent`.

  Different orders can be set depending on different contexts. The context
  consists of the edit mode (e.g. `Transform` or `Text`) right now. If no
  context is given, the default order is set for the `Transform` edit mode.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `inspectorBarOrder` | ( | [`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>)\[] | Array of component IDs defining the inspector bar order. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying when this order applies. |

  #### Returns

  `void`

  #### Deprecated

  Use `setComponentOrder({ in: 'ly.img.inspector.bar' }, order)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getInspectorBarOrder()~~

    <br /><p>Gets the current rendering order of inspector bar components.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Returns the order for the specified context, or
  defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to retrieve. |

  #### Returns

  [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`ComponentId`](./api/cesdk-js/type-aliases/componentid.md)>\[]

  Array of component configurations defining the inspector bar order.

  #### Deprecated

  Use `getComponentOrder({ in: 'ly.img.inspector.bar' })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~updateInspectorBarOrderComponent()~~

    <br /><p>Updates a component in the render order of the inspector bar.</p>
  </summary>

  This method finds an inspector bar order component matching the provided matcher and updates it
  with the given component, ID, or updater function. The matcher can be a function or
  an object describing the component to match. The update can be a new ID, a partial
  object with updated properties, or a function that receives the current component and
  returns the updated one.

  The update API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>> | Function or object to match the component to update. |
  | `update` | | [`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md) | `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>> | ((`component`) => `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>>) | New ID, partial properties, or updater function for the component. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated inspector bar order array.

  | Name | Type |
  | ------ | ------ |
  | `updated` | `number` |
  | `order` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>\[] |

  #### Deprecated

  Use `updateOrderComponent({ in: 'ly.img.inspector.bar', match }, update)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~removeInspectorBarOrderComponent()~~

    <br /><p>Removes a component from the render order of the inspector bar.</p>
  </summary>

  This method finds an inspector bar order component matching the provided matcher and removes it
  from the current order. The matcher can be a function or an object describing the component to match.

  The remove API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>> | Function or object to match the component to remove. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated inspector bar order array.

  | Name | Type |
  | ------ | ------ |
  | `removed` | `number` |
  | `order` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>\[] |

  #### Deprecated

  Use `removeOrderComponent({ in: 'ly.img.inspector.bar', match })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~insertInspectorBarOrderComponent()~~

    <br /><p>Inserts a component into the render order of the inspector bar.</p>
  </summary>

  This method inserts a new inspector bar order component before or after a component matching
  the provided matcher. The matcher can be a function or an object describing the component to match.
  The location can be 'before' or 'after'.

  The insert API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)>> | Function or object to match the component to insert relative to. |
  | `component` | | [`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`InspectorBarComponentId`](./api/cesdk-js/type-aliases/inspectorbarcomponentid.md)> | The component ID or configuration to insert. |
  | `location?` | [`InsertOrderComponentLocation`](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Where to insert the new component relative to the matched component ('before' or 'after'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated inspector bar order array.

  | Name | Type |
  | ------ | ------ |
  | `inserted` | `boolean` |
  | `order` | ( | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`string`> | \{ `id`: `string`; })\[] |

  #### Deprecated

  Use `insertOrderComponent({ in: 'ly.img.inspector.bar', before/after }, component)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~setCanvasMenuOrder()~~

    <br /><p>Sets the rendering order of components in the canvas menu.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Different orders can be set for different contexts
  (e.g., Transform or Text edit modes). Defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `canvasMenuOrder` | ( | [`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md) | [`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md))\[] | Array of component IDs defining the canvas menu order. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying when this order applies. |

  #### Returns

  `void`

  #### Deprecated

  Use `setComponentOrder({ in: 'ly.img.canvas.menu' }, order)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getCanvasMenuOrder()~~

    <br /><p>Gets the current rendering order of canvas menu components.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Returns the order for the specified context, or
  defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to retrieve. |

  #### Returns

  [`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md)\[]

  Array of component configurations defining the canvas menu order.

  #### Deprecated

  Use `getComponentOrder({ in: 'ly.img.canvas.menu' })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~updateCanvasMenuOrderComponent()~~

    <br /><p>Updates a component in the render order of the canvas menu.</p>
  </summary>

  This method finds a canvas menu order component matching the provided matcher and updates it
  with the given component, ID, or updater function. The matcher can be a function or
  an object describing the component to match. The update can be a new ID, a partial
  object with updated properties, or a function that receives the current component and
  returns the updated one.

  The update API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md)>> | Function or object to match the component to update. |
  | `update` | | [`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md) | `Partial`\<[`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md)> | ((`component`) => `Partial`\<[`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md)>) | New ID, partial properties, or updater function for the component. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  An object containing the number of updated components and the updated canvas menu order array.

  | Name | Type |
  | ------ | ------ |
  | `updated` | `number` |
  | `order` | [`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md)\[] |

  #### Deprecated

  Use `updateOrderComponent({ in: 'ly.img.canvas.menu', match }, update)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~removeCanvasMenuOrderComponent()~~

    <br /><p>Removes a component from the render order of the canvas menu.</p>
  </summary>

  This method finds a canvas menu order component matching the provided matcher and removes it
  from the current order. The matcher can be a function or an object describing the component to match.

  The remove API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md)>> | Function or object to match the component to remove. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  An object containing the number of removed components and the updated canvas menu order array.

  | Name | Type |
  | ------ | ------ |
  | `removed` | `number` |
  | `order` | [`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md)\[] |

  #### Deprecated

  Use `removeOrderComponent({ in: 'ly.img.canvas.menu', match })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~insertCanvasMenuOrderComponent()~~

    <br /><p>Inserts a component into the render order of the canvas menu.</p>
  </summary>

  This method inserts a new canvas menu order component before or after a component matching
  the provided matcher. The matcher can be a function or an object describing the component to match.
  The location can be 'before' or 'after'.

  The insert API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md)>> | Function or object to match the component to insert relative to. |
  | `component` | | [`CanvasMenuComponentId`](./api/cesdk-js/type-aliases/canvasmenucomponentid.md) | [`CanvasMenuOrderComponent`](./api/cesdk-js/type-aliases/canvasmenuordercomponent.md) | The component ID or configuration to insert. |
  | `location?` | [`InsertOrderComponentLocation`](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Where to insert the new component relative to the matched component ('before' or 'after'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated canvas menu order array.

  | Name | Type |
  | ------ | ------ |
  | `inserted` | `boolean` |
  | `order` | ( | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`string`> | \{ `id`: `string`; })\[] |

  #### Deprecated

  Use `insertOrderComponent({ in: 'ly.img.canvas.menu', before/after }, component)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~setNavigationBarOrder()~~

    <br /><p>Sets the rendering order of components in the navigation bar.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Different orders can be set for different contexts
  (e.g., Transform or Text edit modes). Defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `navigationBarOrder` | ( | [`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md) | [`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md))\[] | Array of component IDs defining the navigation bar order. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying when this order applies. |

  #### Returns

  `void`

  #### Deprecated

  Use `setComponentOrder({ in: 'ly.img.navigation.bar' }, order)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~updateNavigationBarOrderComponent()~~

    <br /><p>Updates a component in the render order of the navigation bar.</p>
  </summary>

  This method finds a navigation bar order component matching the provided matcher and updates it
  with the given component, ID, or updater function. The matcher can be a function or
  an object describing the component to match. The update can be a new ID, a partial
  object with updated properties, or a function that receives the current component and
  returns the updated one.

  The update API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md)>> | Function or object to match the component to update. |
  | `update` | | [`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md) | `Partial`\<[`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md)> | ((`component`) => `Partial`\<[`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md)>) | New ID, partial properties, or updater function for the component. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  An object containing the number of updated components and the updated navigation bar order array.

  | Name | Type |
  | ------ | ------ |
  | `updated` | `number` |
  | `order` | [`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md)\[] |

  #### Deprecated

  Use `updateOrderComponent({ in: 'ly.img.navigation.bar', match }, update)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~removeNavigationBarOrderComponent()~~

    <br /><p>Removes a component from the render order of the navigation bar.</p>
  </summary>

  This method finds a navigation bar order component matching the provided matcher and removes it
  from the current order. The matcher can be a function or an object describing the component to match.

  The remove API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md)>> | Function or object to match the component to remove. |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  An object containing the number of removed components and the updated navigation bar order array.

  | Name | Type |
  | ------ | ------ |
  | `removed` | `number` |
  | `order` | [`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md)\[] |

  #### Deprecated

  Use `removeOrderComponent({ in: 'ly.img.navigation.bar', match })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~insertNavigationBarOrderComponent()~~

    <br /><p>Inserts a component into the render order of the navigation bar.</p>
  </summary>

  This method inserts a new navigation bar order component before or after a component matching
  the provided matcher. The matcher can be a function or an object describing the component to match.
  The location can be 'before' or 'after'.

  The insert API can be used in different contexts (such as edit modes).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md)>> | Function or object to match the component to insert relative to. |
  | `component` | | [`NavigationBarComponentId`](./api/cesdk-js/type-aliases/navigationbarcomponentid.md) | [`NavigationBarOrderComponent`](./api/cesdk-js/type-aliases/navigationbarordercomponent.md) | The component ID or configuration to insert. |
  | `location?` | [`InsertOrderComponentLocation`](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Where to insert the new component relative to the matched component ('before' or 'after'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated navigation bar order array.

  | Name | Type |
  | ------ | ------ |
  | `inserted` | `boolean` |
  | `order` | ( | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`string`> | \{ `id`: `string`; })\[] |

  #### Deprecated

  Use `insertOrderComponent({ in: 'ly.img.navigation.bar', before/after }, component)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getNavigationBarOrder()~~

    <br /><p>Gets the current rendering order of navigation bar components.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Returns the order for the specified context, or
  defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to retrieve. |

  #### Returns

  [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`ComponentId`](./api/cesdk-js/type-aliases/componentid.md)>\[]

  Array of component configurations defining the navigation bar order.

  #### Deprecated

  Use `getComponentOrder({ in: 'ly.img.navigation.bar' })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~setCanvasBarOrder()~~

    <br /><p>Sets the rendering order of components in the canvas bar.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Canvas bars can be positioned at the top or bottom
  of the canvas. Different orders can be set for different contexts
  (e.g., Transform or Text edit modes). Defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `canvasBarOrder` | ( | [`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>)\[] | Array of component IDs defining the canvas bar order. |
  | `position` | `"bottom"` | `"top"` | The canvas bar position ('top' or 'bottom'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying when this order applies. |

  #### Returns

  `void`

  #### Deprecated

  Use `setComponentOrder({ in: 'ly.img.canvas.bar', at: position }, order)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~getCanvasBarOrder()~~

    <br /><p>Gets the current rendering order of canvas bar components at the specified position.</p>
  </summary>

  Component IDs refer to built-in components or those registered via
  registerComponent. Returns the order for the specified context, or
  defaults to Transform mode if no context is provided.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `position` | `"bottom"` | `"top"` | The canvas bar position ('top' or 'bottom'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to retrieve. |

  #### Returns

  [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`ComponentId`](./api/cesdk-js/type-aliases/componentid.md)>\[]

  Array of component configurations defining the canvas bar order.

  #### Deprecated

  Use `getComponentOrder({ in: 'ly.img.canvas.bar', at: position })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~updateCanvasBarOrderComponent()~~

    <br /><p>Updates a component in the render order of the canvas bar.</p>
  </summary>

  This method finds a canvas bar order component matching the provided matcher and updates it
  with the given component, ID, or updater function. The matcher can be a function or
  an object describing the component to match. The update can be a new ID, a partial
  object with updated properties, or a function that receives the current component and
  returns the updated one.

  The update API can be used in different contexts (such as edit modes and bar positions).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>> | Function or object to match the component to update. |
  | `update` | | [`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md) | `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>> | ((`component`) => `Partial`\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>>) | New ID, partial properties, or updater function for the component. |
  | `position` | `"bottom"` | `"top"` | The canvas bar position ('top' or 'bottom'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated canvas bar order array.

  | Name | Type |
  | ------ | ------ |
  | `updated` | `number` |
  | `order` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>\[] |

  #### Deprecated

  Use `updateOrderComponent({ in: 'ly.img.canvas.bar', at: position, match }, update)` instead.

  ***
</details>

<details>
  <summary>
    ### ~~removeCanvasBarOrderComponent()~~

    <br /><p>Removes a component from the render order of the canvas bar.</p>
  </summary>

  This method finds a canvas bar order component matching the provided matcher and removes it
  from the current order. The matcher can be a function or an object describing the component to match.

  The remove API can be used in different contexts (such as edit modes and bar positions).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>> | Function or object to match the component to remove. |
  | `position` | `"bottom"` | `"top"` | The canvas bar position ('top' or 'bottom'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated canvas bar order array.

  | Name | Type |
  | ------ | ------ |
  | `removed` | `number` |
  | `order` | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>\[] |

  #### Deprecated

  Use `removeOrderComponent({ in: 'ly.img.canvas.bar', at: position, match })` instead.

  ***
</details>

<details>
  <summary>
    ### ~~insertCanvasBarOrderComponent()~~

    <br /><p>Inserts a component into the render order of the canvas bar.</p>
  </summary>

  This method inserts a new canvas bar order component before or after a component matching
  the provided matcher. The matcher can be a function or an object describing the component to match.
  The location can be 'before' or 'after'.

  The insert API can be used in different contexts (such as edit modes and bar positions).

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `matcher` | [`OrderComponentMatcher`](./api/cesdk-js/type-aliases/ordercomponentmatcher.md)\<[`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)>> | Function or object to match the component to insert relative to. |
  | `component` | | [`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md) | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<[`CanvasBarComponentId`](./api/cesdk-js/type-aliases/canvasbarcomponentid.md)> | The component ID or configuration to insert. |
  | `position` | `"bottom"` | `"top"` | The canvas bar position ('top' or 'bottom'). |
  | `location?` | [`InsertOrderComponentLocation`](./api/cesdk-js/type-aliases/insertordercomponentlocation.md) | Where to insert the new component relative to the matched component ('before' or 'after'). |
  | `orderContext?` | [`OrderContext`](./api/cesdk-js/interfaces/ordercontext.md) | Optional context specifying which order to update. |

  #### Returns

  `object`

  The updated canvas bar order array.

  | Name | Type |
  | ------ | ------ |
  | `inserted` | `boolean` |
  | `order` | ( | [`OrderComponent`](./api/cesdk-js/interfaces/ordercomponent.md)\<`string`> | \{ `id`: `string`; })\[] |

  #### Deprecated

  Use `insertOrderComponent({ in: 'ly.img.canvas.bar', at: position, before/after }, component)` instead.

  ***
</details>

<details>
  <summary>
    ### addIconSet()

    <br /><p>Adds a custom icon set to the editor interface.</p>
  </summary>

  The icon set should be an SVG sprite containing symbol elements.
  Symbol IDs must start with '@' to be recognized by the editor.

  **Security Warning**: The SVG sprite is injected into the DOM without
  sanitization. Only use trusted sources to prevent XSS attacks.
  Consider using libraries like DOMPurify for untrusted content.

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `id` | `string` | The unique identifier for the icon set. |
  | `svgSprite` | `string` | The SVG sprite string containing symbol definitions. |

  #### Returns

  `void`

  #### Signature

  ```typescript
  addIconSet(id: string, svgSprite: string): void
  ```
</details>

## UI Scale Management

<details>
  <summary>
    ### getScale()

    <br /><p>Gets the resolved scale that is currently being used.
    If the scale configuration is a function, it is evaluated lazily and the result is returned.</p>
  </summary>

  #### Returns

  [`Scale`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scale.md)

  The resolved scale ('normal' or 'large').

  #### Example

  ```javascript
  // Get the actual scale being used
  const scale = cesdk.ui.getScale(); // 'normal' or 'large'

  // Use for conditional sizing
  const fontSize = cesdk.ui.getScale() === 'large' ? '16px' : '14px';

  // Scale function is evaluated each time getScale() is called
  cesdk.ui.setScale(({ containerWidth }) => containerWidth < 768 ? 'large' : 'normal');
  const currentScale = cesdk.ui.getScale(); // Function is evaluated here
  ```

  #### Signature

  ```typescript
  getScale(): Scale
  ```

  ***
</details>

<details>
  <summary>
    ### setScale

    <br /><p>Sets the scale configuration.</p>
  </summary>

  This will immediately update the UI to reflect the new scale.
  Can be set to:

  - 'normal' or 'large' for a specific scale
  - A function that returns 'normal' or 'large' based on viewport properties

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `scale` | [`ScaleConfig`](./api/cesdk-js/documentation/namespaces/configtypes/type-aliases/scaleconfig.md) | The scale configuration to set. |

  #### Returns

  `void`

  #### Example

  ```javascript
  // Set a specific scale
  cesdk.ui.setScale('large');

  // Set scale based on viewport
  cesdk.ui.setScale(({ containerWidth, isTouch }) => {
    if (isTouch || containerWidth < 768) {
      return 'large';
    }
    return 'normal';
  });

  // Toggle between scales
  const currentScale = cesdk.ui.getScale();
  const newScale = currentScale === 'normal' ? 'large' : 'normal';
  cesdk.ui.setScale(newScale);
  ```
</details>

## Unified Component Order API

<details>
  <summary>
    ### setComponentOrder()

    <br /><p>Sets the rendering order of components in a UI area.</p>
  </summary>

  This unified method replaces area-specific methods like `setDockOrder`,
  `setInspectorBarOrder`, etc. It provides a consistent API for all UI areas.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`AnyUILocationOptions`](./api/cesdk-js/type-aliases/anyuilocationoptions.md)\<`A`> | Location options specifying which area to set. For canvas bar, requires `at` position. For dock, `at` specifies position (`'left'`, `'right'`, or `'bottom'`); defaults to `'left'`. |
  | `order` | [`ComponentSpec`](./api/cesdk-js/type-aliases/componentspec.md)\<`A`>\[] | Array of component IDs or component objects defining the order. |

  #### Returns

  `void`

  #### Example

  ```typescript
  // Set dock order
  cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, ['ly.img.spacer', 'my.button']);

  // Set canvas bar order (requires position)
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.canvas.bar', at: 'top' },
    ['ly.img.settings.canvasBar']
  );

  // Set order with edit mode context
  cesdk.ui.setComponentOrder(
    { in: 'ly.img.inspector.bar', when: { editMode: 'Text' } },
    ['ly.img.text.typeFace.inspectorBar', 'ly.img.text.bold.inspectorBar']
  );
  ```

  #### Signature

  ```typescript
  setComponentOrder(options: AnyUILocationOptions<A>, order: ComponentSpec<A>[]): void
  ```

  ***
</details>

<details>
  <summary>
    ### getComponentOrder()

    <br /><p>Gets the current rendering order of components in a UI area.</p>
  </summary>

  This unified method replaces area-specific methods like `getDockOrder`,
  `getInspectorBarOrder`, etc.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`AnyUILocationOptions`](./api/cesdk-js/type-aliases/anyuilocationoptions.md)\<`A`> | Location options specifying which area to get. For canvas bar, `at` is required. For dock, omitting `at` returns components from all positions. |

  #### Returns

  [`OrderComponentFor`](./api/cesdk-js/type-aliases/ordercomponentfor.md)\<`A`>\[]

  Array of components in the specified area.

  #### Example

  ```typescript
  // Get all dock components across all positions
  const allDock = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });

  // Get dock order at a specific position
  const rightDock = cesdk.ui.getComponentOrder({ in: 'ly.img.dock', at: 'right' });

  // Get canvas bar order (requires position)
  const canvasBarTop = cesdk.ui.getComponentOrder({ in: 'ly.img.canvas.bar', at: 'top' });
  ```

  #### Signature

  ```typescript
  getComponentOrder(options: AnyUILocationOptions<A>): OrderComponentFor<A>[]
  ```

  ***
</details>

<details>
  <summary>
    ### updateOrderComponent()

    <br /><p>Updates components matching a criteria in one or more UI areas.</p>
  </summary>

  This unified method replaces area-specific update methods. Supports glob
  patterns for both areas and component matching.

  **Canvas Bar Note:** For `ly.img.canvas.bar`, if `options.at` is omitted,
  the update applies to BOTH top and bottom bars and results are combined.

  **Dock Note:** For `ly.img.dock`, if `options.at` is omitted, the update
  applies to all dock positions (left, right, bottom) and results are combined.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIAreaSpecifier`](./api/cesdk-js/type-aliases/uiareaspecifier.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`ComponentMatchOptions`](./api/cesdk-js/interfaces/componentmatchoptions.md)\<`A`> | Match options specifying where and what to update. |
  | `update` | [`UpdateSpec`](./api/cesdk-js/type-aliases/updatespec.md)\<[`UIArea`](./api/cesdk-js/type-aliases/uiarea.md)> | New ID, partial properties, or updater function. |

  #### Returns

  `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) ? [`UpdateResult`](./api/cesdk-js/interfaces/updateresult.md)\<`A`> : [`MultiAreaUpdateResult`](./api/cesdk-js/type-aliases/multiareaupdateresult.md)

  For single area: UpdateResult. For multi-area: MultiAreaUpdateResult.

  #### Example

  ```typescript
  // Update by exact ID
  cesdk.ui.updateOrderComponent(
    { in: 'ly.img.dock', match: 'ly.img.separator' },
    { key: 'my-separator' }
  );

  // Update by glob pattern
  cesdk.ui.updateOrderComponent(
    { in: 'ly.img.dock', match: 'ly.img.*' },
    { disabled: true }
  );

  // Update using function
  cesdk.ui.updateOrderComponent(
    { in: 'ly.img.inspector.bar', match: 'first' },
    (component) => ({ key: `${component.id}-modified` })
  );

  // Update across multiple areas
  const results = cesdk.ui.updateOrderComponent(
    { in: '*', match: 'ly.img.separator' },
    { key: 'global-sep' }
  );
  ```

  #### Signature

  ```typescript
  updateOrderComponent(options: ComponentMatchOptions<A>, update: UpdateSpec<UIArea>): A extends UIArea ? UpdateResult<A> : MultiAreaUpdateResult
  ```

  ***
</details>

<details>
  <summary>
    ### removeOrderComponent()

    <br /><p>Removes components matching a criteria from one or more UI areas.</p>
  </summary>

  This unified method replaces area-specific remove methods. Supports glob
  patterns for both areas and component matching.

  **Canvas Bar Note:** For `ly.img.canvas.bar`, if `options.at` is omitted,
  the removal applies to BOTH top and bottom bars and results are combined.

  **Dock Note:** For `ly.img.dock`, if `options.at` is omitted, the removal
  applies to all dock positions (left, right, bottom) and results are combined.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIAreaSpecifier`](./api/cesdk-js/type-aliases/uiareaspecifier.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`ComponentMatchOptions`](./api/cesdk-js/interfaces/componentmatchoptions.md)\<`A`> | Match options specifying where and what to remove. |

  #### Returns

  `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) ? [`RemoveResult`](./api/cesdk-js/interfaces/removeresult.md)\<`A`> : [`MultiAreaRemoveResult`](./api/cesdk-js/type-aliases/multiarearemoveresult.md)

  For single area: RemoveResult. For multi-area: MultiAreaRemoveResult.

  #### Example

  ```typescript
  // Remove by exact ID
  cesdk.ui.removeOrderComponent({ in: 'ly.img.dock', match: 'ly.img.separator' });

  // Remove by position
  cesdk.ui.removeOrderComponent({ in: 'ly.img.inspector.bar', match: 'last' });

  // Remove by glob pattern
  cesdk.ui.removeOrderComponent({ in: 'ly.img.dock', match: 'ly.img.*' });

  // Remove from all areas
  const results = cesdk.ui.removeOrderComponent({
    in: '*',
    match: 'ly.img.separator'
  });
  ```

  #### Signature

  ```typescript
  removeOrderComponent(options: ComponentMatchOptions<A>): A extends UIArea ? RemoveResult<A> : MultiAreaRemoveResult
  ```

  ***
</details>

<details>
  <summary>
    ### insertOrderComponent()

    <br /><p>Inserts one or more components into a UI area at a specified position.</p>
  </summary>

  This unified method replaces area-specific insert methods. Supports
  inserting before, after, or at a specific index. When inserting multiple
  components, they are inserted in order at the specified position.

  **Canvas Bar Note:** For `ly.img.canvas.bar`, `options.at` is required
  and must specify either 'top' or 'bottom'.

  **Dock Note:** For `ly.img.dock`, if `options.at` is omitted, the anchor
  component is searched across all positions. For positional inserts
  (start/end/index), defaults to `'left'`.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | [`InsertComponentOptions`](./api/cesdk-js/type-aliases/insertcomponentoptions.md)\<`A`> | Insert options specifying where to insert. |
  | `components` | | [`ComponentSpec`](./api/cesdk-js/type-aliases/componentspec.md)\<`A`> | [`ComponentSpec`](./api/cesdk-js/type-aliases/componentspec.md)\<`A`>\[] | The component ID(s) or object(s) to insert. Can be a single component or an array. |

  #### Returns

  [`InsertResult`](./api/cesdk-js/interfaces/insertresult.md)\<`A`>

  InsertResult with success status, count, and new order.

  #### Example

  ```typescript
  // Append single component to end (default)
  cesdk.ui.insertOrderComponent({ in: 'ly.img.dock' }, 'my.button');

  // Insert multiple components at once
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', after: 'ly.img.spacer' },
    ['my.button.1', 'my.button.2', 'my.button.3']
  );

  // Insert before a component
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', before: 'ly.img.separator' },
    'my.button'
  );

  // Insert after a component
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.inspector.bar', after: 'ly.img.fill.inspectorBar' },
    'my.fill.tool'
  );

  // Insert at specific position
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', position: 'start' },
    ['first.button', 'second.button']
  );

  // Insert at index
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', position: 2 },
    'my.third.button'
  );

  // Insert at negative index (from end)
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.dock', position: -1 },
    'my.before.last.button'
  );
  ```

  #### Signature

  ```typescript
  insertOrderComponent(options: InsertComponentOptions<A>, components: ComponentSpec<A> | ComponentSpec<A>[]): InsertResult<A>
  ```

  ***
</details>

<details>
  <summary>
    ### getOrderContext()

    <br /><p>Gets the active order context for a UI area.</p>
  </summary>

  Returns the full context including both settable properties (like `view` for
  the caption panel) and engine-derived properties (like `editMode`).

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | \{ `in`: `A`; } | Location options specifying which area to get context for. |
  | `options.in` | `A` | - |

  #### Returns

  [`OrderContextFor`](./api/cesdk-js/type-aliases/ordercontextfor.md)\<`A`>

  The full order context for the area, or undefined if no context has been set.

  #### Example

  ```typescript
  // Get caption panel context
  const context = cesdk.ui.getOrderContext({ in: 'ly.img.caption.panel' });
  // → { view: 'edit', editMode: 'Transform' } | undefined

  // Get inspector bar context (editMode only, derived from engine)
  const inspectorContext = cesdk.ui.getOrderContext({ in: 'ly.img.inspector.bar' });
  // → { editMode: 'Crop' } | undefined
  ```

  #### Signature

  ```typescript
  getOrderContext(options: object): OrderContextFor<A>
  ```

  ***
</details>

<details>
  <summary>
    ### setOrderContext()

    <br /><p>Sets the active order context for a UI area.</p>
  </summary>

  Only accepts settable properties (excludes base OrderContext properties like
  `editMode` which are derived from the engine). For the caption panel, this
  means you can set the `view` property.

  #### Type Parameters

  | Type Parameter |
  | ------ |
  | `A` *extends* [`UIArea`](./api/cesdk-js/type-aliases/uiarea.md) |

  #### Parameters

  | Parameter | Type | Description |
  | ------ | ------ | ------ |
  | `options` | \{ `in`: `A`; } | Location options specifying which area to set context for. |
  | `options.in` | `A` | - |
  | `context` | [`UIAreaContext`](./api/cesdk-js/type-aliases/uiareacontext.md)\<`A`> | The context properties to set. Only settable properties are accepted. |

  #### Returns

  `void`

  #### Example

  ```typescript
  // Set caption panel to style view
  cesdk.ui.setOrderContext(
    { in: 'ly.img.caption.panel' },
    { view: 'style' }
  );

  // Note: editMode cannot be set via this API - it's engine-derived
  // Use cesdk.engine.editor.setEditMode('Crop') instead
  ```

  #### Signature

  ```typescript
  setOrderContext(options: object, context: UIAreaContext<A>): void
  ```
</details>


---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[cesdk-js API Reference](./api/cesdk-js.md)** - Full cesdk-js API reference
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support