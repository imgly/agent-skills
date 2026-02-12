> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Settings](./settings.md)

---

Settings are configuration values that control CE.SDK editor behavior without modifying scene content. They are accessed via key paths (e.g., `page/title/show`) and support multiple types including Bool, Int, Float, String, Color, and Enum. Use settings to customize visual appearance, interaction behavior, resource paths, and feature toggles.

## When to Change Settings

Settings can be changed at any time after engine initialization, but they fall into two categories based on when they should be modified.

### Initialization-Only Settings

Some settings should only be set once during or immediately after engine initialization. Changing them later may have no effect or cause unexpected behavior:

- `license` - The license key validates on startup; changing it later has no effect
- `basePath` - The base URL for resolving assets; should be set before loading any resources
- `defaultFontFileUri` / `defaultEmojiFontFileUri` - Default fonts used when no font is specified; should be set early
- `maxImageSize` - Memory limit for images; changing mid-session won't affect already-loaded images

### Runtime Settings

Most settings can be changed at any time and take effect immediately:

- **Visual appearance**: `highlightColor`, `snappingGuideColor`, `cropOverlayColor`, `page/title/color`
- **Interaction behavior**: `doubleClickToCropEnabled`, `doubleClickSelectionMode`, `touch/*`, `mouse/*`
- **Control gizmos**: `controlGizmo/showResizeHandles`, `controlGizmo/showRotateHandles`
- **Page display**: `page/title/show`, `page/dimOutOfPageAreas`, `page/title/separator`
- **Feature toggles**: `blockAnimations/enabled`, `useSystemFontFallback`, `forceSystemEmojis`
- **Snapping thresholds**: `positionSnappingThreshold`, `rotationSnappingThreshold`

These runtime settings are commonly used to adapt the editor UI to different modes, user preferences, or workflow states.

## Using the Settings API

### Discover Available Settings

Use `findAllSettings()` to get a list of all available settings:

```javascript
const allSettings = engine.editor.findAllSettings();
```

### Read and Write Settings

Use `getSetting()` and `setSetting()` to read and write settings. The API automatically handles the correct type based on the setting key:

```javascript
// Boolean settings
engine.editor.setSetting('doubleClickToCropEnabled', true);
const cropEnabled = engine.editor.getSetting('doubleClickToCropEnabled');

// Number settings
engine.editor.setSetting('maxImageSize', 4096);
engine.editor.setSetting('positionSnappingThreshold', 2.0);

// String settings
engine.editor.setSetting('page/title/separator', ' | ');

// Color settings
engine.editor.setSetting('highlightColor', { r: 1, g: 0, b: 1, a: 1 });

// Enum settings
engine.editor.setSetting('doubleClickSelectionMode', 'Direct');
const enumOptions = engine.editor.getSettingEnumOptions(
  'doubleClickSelectionMode',
);
```

### Subscribe to Settings Changes

React to settings changes using `onSettingsChanged()`:

```javascript
const unsubscribe = engine.editor.onSettingsChanged(() => {
  console.log('Editor settings have changed');
});

// Later, to stop listening:
unsubscribe();
```

### Role Management

Roles apply predefined defaults for scopes and settings:

```javascript
// Get current role
const currentRole = engine.editor.getRole();

// Set role and apply role-dependent defaults
engine.editor.setRole('Adopter');

// React to role changes
const unsubscribe = engine.editor.onRoleChanged(role => {
  console.log('Role changed to:', role);
});
```

## Available Settings

## Settings Type

Editor Settings

This section describes the all available editor settings.

| Property                                           | Type     | Default                                                       | Description                                                                                                                                                                                                                                         |
| -------------------------------------------------- | -------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `alwaysHighlightPlaceholders`                      | `Bool`   | `false`                                                       | Whether placeholder elements should always be highlighted in the scene.                                                                                                                                                                             |
| `basePath`                                         | `String` | `"some-base-path"`                                            | The root directory to be used when resolving relative paths or when accessing `bundle://` URIs on platforms that don't offer bundles.                                                                                                               |
| `blockAnimations/enabled`                          | `Bool`   | `true`                                                        | Whether animations should be enabled or not.                                                                                                                                                                                                        |
| `borderOutlineColor`                               | `Color`  | `{"r":0,"g":0,"b":0,"a":1}`                                   | The border outline color.                                                                                                                                                                                                                           |
| `camera/clamping/overshootMode`                    | `Enum`   | `"Reverse"`                                                   | Controls what happens when the clamp area is smaller than the viewport. Center: the clamp area is centered in the viewport. Reverse: the clamp area can move inside the viewport until it hits the edges., Possible values: `"Center"`, `"Reverse"` |
| `clampThumbnailTextureSizes`                       | `Bool`   | `true`                                                        | Whether to clamp thumbnail texture sizes to reduce memory usage.                                                                                                                                                                                    |
| `clearColor`                                       | `Color`  | `{"r":0,"g":0,"b":0,"a":0}`                                   | The color with which the render target is cleared before scenes get rendered. Only used while renderMode == RenderMode::Preview.                                                                                                                    |
| `colorMaskingSettings/maskColor`                   | `Color`  | `{"r":1,"g":1,"b":1,"a":1}`                                   | The current mask color. Defaults to white, which disabled all masking.                                                                                                                                                                              |
| `colorMaskingSettings/secondPass`                  | `Bool`   | `false`                                                       | Whether color masking should render the second pass.                                                                                                                                                                                                |
| `controlGizmo/blockScaleDownLimit`                 | `Float`  | `8`                                                           | Scale-down limit for blocks in screen pixels when scaling them with the gizmos or with touch gestures. The limit is ensured to be at least 0.1 to prevent scaling to size zero.                                                                     |
| `controlGizmo/showCropHandles`                     | `Bool`   | `true`                                                        | Whether or not to show the handles to adjust the crop area during crop mode.                                                                                                                                                                        |
| `controlGizmo/showCropScaleHandles`                | `Bool`   | `true`                                                        | Whether or not to display the outer handles that scale the full image during crop.                                                                                                                                                                  |
| `controlGizmo/showMoveHandles`                     | `Bool`   | `true`                                                        | Whether or not to show the move handles.                                                                                                                                                                                                            |
| `controlGizmo/showResizeHandles`                   | `Bool`   | `true`                                                        | Whether or not to display the non-proportional resize handles (edge handles).                                                                                                                                                                       |
| `controlGizmo/showRotateHandles`                   | `Bool`   | `true`                                                        | Whether or not to show the rotation handles.                                                                                                                                                                                                        |
| `controlGizmo/showScaleHandles`                    | `Bool`   | `true`                                                        | Whether or not to display the proportional scale handles (corner handles).                                                                                                                                                                          |
| `cropOverlayColor`                                 | `Color`  | `{"r":0,"g":0,"b":0,"a":0.39}`                                | Color of the dimming overlay that's added in crop mode.                                                                                                                                                                                             |
| `defaultEmojiFontFileUri`                          | `String` | `"https://cdn.img.ly/assets/v4/emoji/NotoColorEmoji.ttf"`     | URI of default font file for emojis.                                                                                                                                                                                                                |
| `defaultFontFileUri`                               | `String` | `"bundle://ly.img.cesdk/fonts/imgly_font_inter_semibold.otf"` | URI of default font file. This font file is the default everywhere unless overriden in specific settings.                                                                                                                                           |
| `doubleClickSelectionMode`                         | `Enum`   | `"Hierarchical"`                                              | The current mode of selection on double-click., Possible values: `"Direct"`, `"Hierarchical"`                                                                                                                                                       |
| `doubleClickToCropEnabled`                         | `Bool`   | `true`                                                        | Whether double clicking on an image element should switch into the crop editing mode.                                                                                                                                                               |
| `errorStateColor`                                  | `Color`  | `{"r":1,"g":1,"b":1,"a":0.7}`                                 | The error state color for design blocks.                                                                                                                                                                                                            |
| `fallbackFontUri`                                  | `String` | `""`                                                          | The URI of the fallback font to use for text that is missing certain characters.                                                                                                                                                                    |
| `forceSystemEmojis`                                | `Bool`   | `true`                                                        | Whether the system emojis should be used for text.                                                                                                                                                                                                  |
| `handleFillColor`                                  | `Color`  | `{"r":1,"g":1,"b":1,"a":1}`                                   | The fill color for handles.                                                                                                                                                                                                                         |
| `highlightColor`                                   | `Color`  | `{"r":0.2,"g":0.333,"b":1,"a":1}`                             | Color of the selection, hover, and group frames and for the handle outlines for non-placeholder elements.                                                                                                                                           |
| `license`                                          | `String` | `""`                                                          | A valid license string in JWT format.                                                                                                                                                                                                               |
| `maxImageSize`                                     | `Int`    | `4096`                                                        | The maximum size at which images are loaded into the engine. Images that exceed this size are down-scaled prior to rendering. Reducing this size further reduces the memory footprint.                                                              |
| `mouse/enableScroll`                               | `Bool`   | `true`                                                        | Whether the engine processes mouse scroll events.                                                                                                                                                                                                   |
| `mouse/enableZoom`                                 | `Bool`   | `true`                                                        | Whether the engine processes mouse zoom events.                                                                                                                                                                                                     |
| `page/allowCropInteraction`                        | `Bool`   | `true`                                                        | If crop interaction (by handles and gestures) should be possible when the enabled arrangements allow resizing.                                                                                                                                      |
| `page/allowMoveInteraction`                        | `Bool`   | `false`                                                       | If move interaction (by handles and gestures) should be possible when the enabled arrangements allow moving and if the page layout is not controlled by the scene.                                                                                  |
| `page/allowResizeInteraction`                      | `Bool`   | `false`                                                       | If a resize interaction (by handles and gestures) should be possible when the enabled arrangements allow resizing.                                                                                                                                  |
| `page/allowRotateInteraction`                      | `Bool`   | `false`                                                       | If rotation interaction (by handles and gestures) should be possible when the enabled arrangements allow rotation and if the page layout is not controlled by the scene.                                                                            |
| `page/dimOutOfPageAreas`                           | `Bool`   | `true`                                                        | Whether the opacity of the region outside of all pages should be reduced.                                                                                                                                                                           |
| `page/innerBorderColor`                            | `Color`  | `{"r":0,"g":0,"b":0,"a":0}`                                   | Color of the inner frame around the page.                                                                                                                                                                                                           |
| `page/marginFillColor`                             | `Color`  | `{"r":0.79,"g":0.12,"b":0.4,"a":0.1}`                         | Color filled into the bleed margins of pages.                                                                                                                                                                                                       |
| `page/marginFrameColor`                            | `Color`  | `{"r":0.79,"g":0.12,"b":0.4,"a":0.15}`                        | Color of frame around the bleed margin area of the pages.                                                                                                                                                                                           |
| `page/moveChildrenWhenCroppingFill`                | `Bool`   | `false`                                                       | Whether the children of the page should be transformed to match their old position relative to the page fill when a page fill is cropped.                                                                                                           |
| `page/outerBorderColor`                            | `Color`  | `{"r":1,"g":1,"b":1,"a":0}`                                   | Color of the outer frame around the page.                                                                                                                                                                                                           |
| `page/restrictResizeInteractionToFixedAspectRatio` | `Bool`   | `false`                                                       | If the resize interaction should be restricted to fixed aspect ratio resizing.                                                                                                                                                                      |
| `page/selectWhenNoBlocksSelected`                  | `Bool`   | `false`                                                       | Whether the page should automatically be selected when no blocks are selected.                                                                                                                                                                      |
| `page/title/appendPageName`                        | `Bool`   | `true`                                                        | Whether to append the page name to the title if a page name is set even if the name is not specified in the template or the template is not shown.                                                                                                  |
| `page/title/color`                                 | `Color`  | `{"r":1,"g":1,"b":1,"a":1}`                                   | Color of page titles visible in preview mode, can change with different themes.                                                                                                                                                                     |
| `page/title/fontFileUri`                           | `String` | `"bundle://ly.img.cesdk/fonts/imgly_font_inter_semibold.otf"` | Font of page titles.                                                                                                                                                                                                                                |
| `page/title/separator`                             | `String` | `"-"`                                                         | Title label separator between the page number and the page name.                                                                                                                                                                                    |
| `page/title/show`                                  | `Bool`   | `true`                                                        | Whether to show titles above each page.                                                                                                                                                                                                             |
| `page/title/showOnSinglePage`                      | `Bool`   | `true`                                                        | Whether to hide the the page title when only a single page is given.                                                                                                                                                                                |
| `page/title/showPageTitleTemplate`                 | `Bool`   | `true`                                                        | Whether to include the default page title from `page.titleTemplate`.                                                                                                                                                                                |
| `pageHighlightColor`                               | `Color`  | `{"r":0.5,"g":0.5,"b":0.5,"a":0.2}`                           | Color of the outline of each page.                                                                                                                                                                                                                  |
| `placeholderControls/showButton`                   | `Bool`   | `true`                                                        | Show the placeholder button.                                                                                                                                                                                                                        |
| `placeholderControls/showOverlay`                  | `Bool`   | `true`                                                        | Show the overlay pattern.                                                                                                                                                                                                                           |
| `placeholderHighlightColor`                        | `Color`  | `{"r":0.77,"g":0.06,"b":0.95,"a":1}`                          | Color of the selection, hover, and group frames and for the handle outlines for placeholder elements.                                                                                                                                               |
| `positionSnappingThreshold`                        | `Float`  | `4`                                                           | Position snapping threshold in screen space.                                                                                                                                                                                                        |
| `progressColor`                                    | `Color`  | `{"r":1,"g":1,"b":1,"a":0.7}`                                 | The progress indicator color.                                                                                                                                                                                                                       |
| `renderTextCursorAndSelectionInEngine`             | `Bool`   | `true`                                                        | Whether the engine should render the text cursor and selection highlights during text editing. This can be set to false, if the platform wants to perform this rendering itself.                                                                    |
| `rotationSnappingGuideColor`                       | `Color`  | `{"r":1,"g":0.004,"b":0.361,"a":1}`                           | Color of the rotation snapping guides.                                                                                                                                                                                                              |
| `rotationSnappingThreshold`                        | `Float`  | `0.15`                                                        | Rotation snapping threshold in radians.                                                                                                                                                                                                             |
| `showBuildVersion`                                 | `Bool`   | `false`                                                       | Show the build version on the canvas.                                                                                                                                                                                                               |
| `snappingGuideColor`                               | `Color`  | `{"r":1,"g":0.004,"b":0.361,"a":1}`                           | Color of the position snapping guides.                                                                                                                                                                                                              |
| `textVariableHighlightColor`                       | `Color`  | `{"r":0.7,"g":0,"b":0.7,"a":1}`                               | Color of the text variable highlighting borders.                                                                                                                                                                                                    |
| `touch/dragStartCanSelect`                         | `Bool`   | `true`                                                        | Whether dragging an element requires selecting it first. When not set, elements can be directly dragged.                                                                                                                                            |
| `touch/pinchAction`                                | `Enum`   | `"Scale"`                                                     | The action to perform when a pinch gesture is performed. Possible values: `"None"`, `"Zoom"`, `"Scale"`, `"Auto"`                                                                                                                                            |
| `touch/rotateAction`                               | `Enum`   | `"Rotate"`                                                    | Whether or not the two finger turn gesture can rotate selected elements. Possible values: `"None"`, `"Rotate"`                                                                                                                                     |
| `touch/singlePointPanning`                         | `Bool`   | `true`                                                        | Whether or not dragging on the canvas should move the camera (scrolling). When not set, the scroll bars have to be used.                                                                                                                            |
| `upload/supportedMimeTypes`                        | `String` | `""`                                                          | The MIME types supported for file uploads.                                                                                                                                                                                                          |
| `useSystemFontFallback`                            | `Bool`   | `false`                                                       | Whether the IMG.LY hosted font fallback is used for fonts that are missing certain characters, covering most of the unicode range.                                                                                                                  |
| `web/fetchCredentials`                             | `String` | `"same-origin"`                                               | The credentials mode to use for fetch requests (same-origin, include, or omit).                                                                                                                                                                     |

### GlobalScopes

| Member     | Type    | Default | Description                      |
| ---------- | ------- | ------- | -------------------------------- |
| text       | `Scope` | `Allow` | Scope for text operations.       |
| fill       | `Scope` | `Allow` | Scope for fill operations.       |
| stroke     | `Scope` | `Allow` | Scope for stroke operations.     |
| shape      | `Scope` | `Allow` | Scope for shape operations.      |
| layer      | `Scope` | `Allow` | Scope for layer operations.      |
| appearance | `Scope` | `Allow` | Scope for appearance operations. |
| lifecycle  | `Scope` | `Allow` | Scope for lifecycle operations.  |
| editor     | `Scope` | `Allow` | Scope for editor operations.     |



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support