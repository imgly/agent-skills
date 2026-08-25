> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Configuration](./configuration.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-basics/BasicEditorSolution.kt reference-only
import android.util.Log
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

// Call this composable from your app's navigation layer.
@Composable
fun BasicEditorSolution(
    license: String,
    signedInUserId: String?,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        userId = signedInUserId,
        baseUri = "file:///android_asset/assets/".toUri(),
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW,
        uiMode = EditorUiMode.SYSTEM,
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val editor = editorContext.engine.editor
                    editor.setRole("Creator")
                    Log.i("ConfigurationGuide", "Current role: ${editor.getRole()}")

                    editor.setSettingBoolean(
                        keypath = "doubleClickToCropEnabled",
                        value = false,
                    )
                    val doubleClickToCropEnabled = editor.getSettingBoolean(
                        keypath = "doubleClickToCropEnabled",
                    )
                    Log.i(
                        "ConfigurationGuide",
                        "Double-click crop enabled: $doubleClickToCropEnabled",
                    )
                }
            }
        },
        onClose = onClose,
    )
}
```

Configure the Android editor with license validation, asset locations, user
tracking, rendering behavior, and runtime Engine settings.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/editor-guides-configuration-basics)

<EngineReferenceNote {...props} />

The Android `Editor` composable owns Engine startup for the CE.SDK editor UI. Pass startup values directly to `Editor`, then use `EditorConfiguration` for callbacks, component customization, and runtime Engine settings through the existing `editorContext.engine`.

## Required Configuration

### License Key

Production apps should pass a CE.SDK license key. Passing `null` or an empty value starts evaluation mode, which keeps export watermarks active.

| Property  | Type      | Purpose                                                        |
| --------- | --------- | -------------------------------------------------------------- |
| `license` | `String?` | License key used to unlock CE.SDK and remove export watermarks |

Request a trial license through [IMG.LY Contact Sales](https://img.ly/forms/contact-sales/).

```kotlin highlight-android-license
license = license,
```

## Optional Configuration

These `Editor` parameters configure startup values, editor lifecycle hooks, and close handling. Values such as `userId`, `baseUri`, `host`, `engineRenderTarget`, and `uiMode` apply when the editor starts, while `configuration` and `onClose` cover callbacks and behavior throughout the editor lifecycle.

| Property             | Type                                                  | Purpose                                                                                                                             |
| -------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `userId`             | `String?`                                             | User identifier for Monthly Active User (MAU) tracking                                                                              |
| `baseUri`            | `Uri`                                                 | Base location for bundled or self-hosted CE.SDK assets; defaults to the top-level `ly.img.editor.defaultBaseUri`                    |
| `host`               | `String`                                              | Build host passed to Engine startup for license host matching; leave empty unless your license setup requires a specific host value |
| `engineRenderTarget` | `EngineRenderTarget` (`SURFACE_VIEW`, `TEXTURE_VIEW`) | Android view type used by the Engine renderer                                                                                       |
| `uiMode`             | `EditorUiMode` (`SYSTEM`, `LIGHT`, `DARK`)            | Light, dark, or system-following editor theme mode                                                                                  |
| `configuration`      | `@Composable EditorScope.() -> EditorConfiguration`   | Scoped configuration lambda for editor callbacks, UI components, asset library, and color palette                                   |
| `onClose`            | `(Throwable?) -> Unit`                                | Close/error callback used by your navigation layer                                                                                  |

Android routes editor and engine messages through Logcat. There is no initialization-time custom logger configuration option.

## Configuration Properties

### User ID

Set `userId` when your app has signed-in users. Pass the current user's stable application ID instead of a shared hard-coded value, or omit it for anonymous sessions. CE.SDK also uses the Android device ID for tracking accuracy, so include that collection in your Play Store Data safety form.

```kotlin highlight-android-user-id
userId = signedInUserId,
```

### Asset Base URI

`baseUri` is the base path for relative editor and Engine asset paths. If omitted, `Editor` uses the top-level `defaultBaseUri` from `ly.img.editor`, a versioned IMG.LY CDN URL defined by the Android SDK. For production apps, bundle the CE.SDK Android assets with your app or host them yourself, then point `baseUri` at that location instead of relying on the IMG.LY CDN.

For the local URI shown below, download the versioned CE.SDK Android asset bundle from [the IMG.LY CDN](https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0-nightly.20260825/imgly-assets.zip) and extract it. The archive contains a top-level `assets/` directory; copy that directory into your app module's `src/main/assets/` folder so `file:///android_asset/assets/` points directly at the asset files. If you host the same asset folder, pass its HTTPS base URL as `baseUri` instead; the [Serve Assets From Your Server](./serve-assets.md) guide covers that setup.

```kotlin highlight-android-base-uri
baseUri = "file:///android_asset/assets/".toUri(),
```

### Rendering and UI Mode

Use `engineRenderTarget` to choose the underlying Android render view:

- `EngineRenderTarget.SURFACE_VIEW` renders through `SurfaceView`.
- `EngineRenderTarget.TEXTURE_VIEW` renders through `TextureView`.

Use `uiMode` for the editor color scheme:

- `EditorUiMode.SYSTEM` follows the operating system setting.
- `EditorUiMode.LIGHT` displays the editor in light mode.
- `EditorUiMode.DARK` displays the editor in dark mode.

Advanced theme customization belongs in the [Theming](./user-interface/appearance/theming.md) guide.

```kotlin highlight-android-rendering
engineRenderTarget = EngineRenderTarget.SURFACE_VIEW,
uiMode = EditorUiMode.SYSTEM,
```

## Runtime Configuration

Use `EditorConfiguration.remember` for callbacks that run inside the editor lifecycle. The default editor creation flow creates the initial scene for you, so this guide keeps that default and uses `onLoaded` to apply the role and settings after the editor is ready. If you override `onCreate`, create or load a scene before the callback completes.

The `builder` lambda passed to `EditorConfiguration.remember` runs only once.
Assign callbacks once and put conditions that depend on changing Compose state
inside the callback so it reads the current value when it runs.

Use `EditorConfiguration.remember` and `then` to chain additional configuration blocks and IMG.LY plugins onto an existing editor configuration.

```kotlin highlight-android-runtime-configuration
        configuration = {
            EditorConfiguration.remember {
                onLoaded = {
                    val editor = editorContext.engine.editor
                    editor.setRole("Creator")
                    Log.i("ConfigurationGuide", "Current role: ${editor.getRole()}")

                    editor.setSettingBoolean(
                        keypath = "doubleClickToCropEnabled",
                        value = false,
                    )
                    val doubleClickToCropEnabled = editor.getSettingBoolean(
                        keypath = "doubleClickToCropEnabled",
                    )
                    Log.i(
                        "ConfigurationGuide",
                        "Double-click crop enabled: $doubleClickToCropEnabled",
                    )
                }
            }
        },
```

`setRole()` changes the active editing role and applies role-dependent defaults. The CE.SDK editor UI applies `Adopter` before `onLoaded`; the sample sets `Creator` so the callback demonstrates a role change in the editor flow. Supported roles are `Creator`, `Adopter`, `Viewer`, and `Presenter`. On Android, read and write the role with `setRole()` and `getRole()` rather than a settings keypath.

Settings such as `doubleClickToCropEnabled` are available through the typed setting methods on `engine.editor`. The sample disables double-click crop so the readback logs a non-default value. Use the Boolean, Int, Float, String, Color, and Enum setter/getter pairs for known settings, and use `findAllSettings()` or `getSettingType()` when you need to inspect available settings dynamically.

> **Note:** For full event and callback handling, see [UI Events](./user-interface/events.md).
> For toolbar and button layout changes, see&#x20;
> [Navigation Bar](./user-interface/customization/navigation-bar.md).

## Troubleshooting

| Issue                                                   | What to check                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Exports still contain a watermark                       | `null` or an empty `license` intentionally starts evaluation mode and keeps export watermarks active. If you pass a production key and startup fails, check for an expired, invalid, or host-mismatched key because Android license validation surfaces those cases as unlock errors instead of continuing in evaluation mode. |
| Assets are missing or fail to load                      | Check that `baseUri` points at the copied or hosted Android asset folder. For `file:///android_asset/assets/`, the extracted archive's top-level `assets/` directory must be copied directly into `src/main/assets/`.                                                                                                          |
| The editor opens without a scene after custom callbacks | If you override `onCreate`, your callback owns scene creation or loading. Call the relevant `editorContext.engine.scene.create*` or `load*` API before the callback completes, or keep the default creation flow and use `onLoaded` for role and settings changes.                                                             |

## API Reference

| Method                                                                                                       | Purpose                                                                                       |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| `Editor(license=_, userId=_, baseUri=_, host=_, engineRenderTarget=_, uiMode=_, configuration=_, onClose=_)` | Initialize the Android editor UI with startup configuration                                   |
| `EditorConfiguration.remember(builder=_)`                                                                    | Create editor lifecycle callbacks and component configuration with an optional builder lambda |
| `EditorConfiguration.remember(builderFactory=_, builder=_)`                                                  | Create editor lifecycle callbacks with a custom configuration builder                         |
| `existingConfiguration.then(builder=_)`                                                                      | Chain another configuration block onto an existing editor configuration                       |
| `existingConfiguration.then(builderFactory=_, builder=_)`                                                    | Chain another configuration builder or plugin onto an existing editor configuration           |
| `EditorConfigurationBuilder.onCreate=_`                                                                      | Create or load the scene when overriding default editor creation                              |
| `EditorConfigurationBuilder.onLoaded=_`                                                                      | Run post-load configuration after the editor scene is available                               |
| `EditorConfigurationBuilder.onExport=_`                                                                      | Handle export button actions                                                                  |
| `EditorConfigurationBuilder.onClose=_`                                                                       | Handle editor close events inside the editor lifecycle                                        |
| `EditorConfigurationBuilder.onEvent=_`                                                                       | Handle editor events                                                                          |
| `EditorConfigurationBuilder.onUpload=_`                                                                      | Adjust or upload assets before they are added to upload asset sources                         |
| `EditorConfigurationBuilder.onError=_`                                                                       | Handle errors captured by the editor                                                          |
| `EditorConfigurationBuilder.colorPalette=_`                                                                  | Configure the editor UI color palette                                                         |
| `EditorConfigurationBuilder.assetLibrary=_`                                                                  | Configure the asset library                                                                   |
| `EditorConfigurationBuilder.dock=_`                                                                          | Configure the bottom dock component                                                           |
| `EditorConfigurationBuilder.navigationBar=_`                                                                 | Configure the top navigation bar component                                                    |
| `EditorConfigurationBuilder.inspectorBar=_`                                                                  | Configure the inspector bar shown for selected blocks                                         |
| `EditorConfigurationBuilder.canvasMenu=_`                                                                    | Configure the canvas menu next to selected blocks                                             |
| `EditorConfigurationBuilder.bottomPanel=_`                                                                   | Configure a fixed bottom panel, such as a timeline panel                                      |
| `EditorConfigurationBuilder.overlay=_`                                                                       | Configure overlay UI above the editor                                                         |
| `engine.editor.setRole(role=_)`                                                                              | Set the active editing role                                                                   |
| `engine.editor.getRole()`                                                                                    | Read the active editing role                                                                  |
| `engine.editor.onRoleChanged()`                                                                              | Collect role changes after role defaults are applied                                          |
| `engine.editor.setSettingBoolean(keypath=_, value=_)`                                                        | Set a boolean Engine setting                                                                  |
| `engine.editor.getSettingBoolean(keypath=_)`                                                                 | Read a boolean Engine setting                                                                 |
| `engine.editor.setSettingInt(keypath=_, value=_)`                                                            | Set an integer Engine setting                                                                 |
| `engine.editor.getSettingInt(keypath=_)`                                                                     | Read an integer Engine setting                                                                |
| `engine.editor.setSettingFloat(keypath=_, value=_)`                                                          | Set a float Engine setting                                                                    |
| `engine.editor.getSettingFloat(keypath=_)`                                                                   | Read a float Engine setting                                                                   |
| `engine.editor.setSettingString(keypath=_, value=_)`                                                         | Set a string Engine setting                                                                   |
| `engine.editor.getSettingString(keypath=_)`                                                                  | Read a string Engine setting                                                                  |
| `engine.editor.setSettingColor(keypath=_, value=_)`                                                          | Set a color Engine setting                                                                    |
| `engine.editor.getSettingColor(keypath=_)`                                                                   | Read a color Engine setting                                                                   |
| `engine.editor.setSettingEnum(keypath=_, value=_)`                                                           | Set an enum Engine setting                                                                    |
| `engine.editor.getSettingEnum(keypath=_)`                                                                    | Read an enum Engine setting                                                                   |
| `engine.editor.getSettingEnumOptions(keypath=_)`                                                             | Read supported values for an enum Engine setting                                              |
| `engine.editor.findAllSettings()`                                                                            | List available Engine settings                                                                |
| `engine.editor.getSettingType(keypath=_)`                                                                    | Read the type of an Engine setting                                                            |
| `engine.editor.onSettingsChanged()`                                                                          | Collect Engine setting change events                                                          |

## Next Steps

- [Theming](./user-interface/appearance/theming.md) - Customize the editor's visual appearance
- [Localization](./user-interface/localization.md) - Configure languages and translations
- [Asset Library](./import-media/asset-library.md) - Configure asset sources and libraries
- [Editing Workflow](./concepts/editing-workflow.md) - Control editing capabilities with roles
  and scopes
- [Headless Mode](./concepts/headless-mode.md) - Use CE.SDK without the UI



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support