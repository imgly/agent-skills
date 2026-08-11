> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Theming](./theming.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-theming/ThemingEditorSolution.kt reference-only
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.material3.MaterialTheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.Replace

// Add this composable to your NavHost
@Composable
fun ThemingEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    var uiMode by remember { mutableStateOf(EditorUiMode.LIGHT) }

    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        uiMode = uiMode,
        configuration = {
            EditorConfiguration.remember {
                dock = {
                    Dock.remember {
                        horizontalArrangement = { Arrangement.Center }
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add {
                                    Dock.Button.remember {
                                        textString = {
                                            if (uiMode == EditorUiMode.DARK) {
                                                "Use Light Theme"
                                            } else {
                                                "Use Dark Theme"
                                            }
                                        }
                                        vectorIcon = { IconPack.Replace }
                                        tint = { MaterialTheme.colorScheme.onSecondaryContainer }
                                        containerColor = { MaterialTheme.colorScheme.secondaryContainer }
                                        onClick = {
                                            uiMode = if (uiMode == EditorUiMode.DARK) {
                                                EditorUiMode.LIGHT
                                            } else {
                                                EditorUiMode.DARK
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

Configure the Android editor to follow the system appearance or force a light
or dark theme.

![Android editor theme-toggle button in light and dark modes](https://img.ly/docs/cesdk/android/user-interface/appearance/theming-4b0938/assets/theming-android.png)

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/editor-guides-configuration-theming)

The Android editor applies CE.SDK's Compose `EditorTheme` inside the `Editor` composable. Use `uiMode` when your app needs to override the device theme, then style custom editor components from `MaterialTheme.colorScheme` so they stay aligned with the active light or dark palette.

For a complete ready-made surface, start with the [Design Editor Starter Kit](../../starterkits/design-editor.md) and apply the same `uiMode` setting where your app renders `Editor`.

## Built-in Themes

The `Editor` composable accepts `uiMode` and defaults to `EditorUiMode.SYSTEM`.

| Mode | Behavior |
| ---- | -------- |
| `EditorUiMode.SYSTEM` | Follows the operating system light or dark setting. |
| `EditorUiMode.LIGHT` | Always renders the editor with the light palette. |
| `EditorUiMode.DARK` | Always renders the editor with the dark palette. |

Pass the selected mode directly to `Editor`:

```kotlin highlight-android-editor-uimode
uiMode = uiMode,
```

## Switching Themes at Runtime

Hoist the selected mode into Compose state when users should change the theme from your UI.

```kotlin highlight-android-theme-state
var uiMode by remember { mutableStateOf(EditorUiMode.LIGHT) }
```

The sample starts with `EditorUiMode.LIGHT` so the theme-toggle button and screenshot show a deterministic light-to-dark switch. In production, initialize this state from your app's theme preference, or use `EditorUiMode.SYSTEM` when the editor should follow the device setting.

The sample adds a dock button that toggles between the light and dark palettes. Its label, icon tint, and container color are read from the current Compose theme, so the custom button updates with the editor theme.

```kotlin highlight-android-theme-toggle
configuration = {
    EditorConfiguration.remember {
        dock = {
            Dock.remember {
                horizontalArrangement = { Arrangement.Center }
                listBuilder = {
                    Dock.ListBuilder.remember {
                        add {
                            Dock.Button.remember {
                                textString = {
                                    if (uiMode == EditorUiMode.DARK) {
                                        "Use Light Theme"
                                    } else {
                                        "Use Dark Theme"
                                    }
                                }
                                vectorIcon = { IconPack.Replace }
                                tint = { MaterialTheme.colorScheme.onSecondaryContainer }
                                containerColor = { MaterialTheme.colorScheme.secondaryContainer }
                                onClick = {
                                    uiMode = if (uiMode == EditorUiMode.DARK) {
                                        EditorUiMode.LIGHT
                                    } else {
                                        EditorUiMode.DARK
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
},
```

## Custom Styling Scope

Android theming is implemented through Jetpack Compose. `uiMode` selects the editor's light or dark palette, while app-specific controls you add through editor configuration should read the active Compose theme instead of hard-coding colors.

Use component configuration for app-specific UI that you add to the editor:

- Read colors and typography from `MaterialTheme` inside configuration lambdas.
- Apply brand colors to the custom components you own, such as dock buttons, panels, or actions.
- Test any custom tint, container, or text color in both light and dark modes.

## Best Practices

- Use `EditorUiMode.SYSTEM` unless your app has its own appearance preference.
- Persist a user-selected theme in your app state and pass it back through `uiMode`.
- Prefer `MaterialTheme.colorScheme` values for custom editor components so contrast stays tied to the active palette.
- Validate custom component colors against real editor content in light and dark modes.

## Troubleshooting

- **The editor keeps following the system theme:** pass `EditorUiMode.LIGHT` or `EditorUiMode.DARK` through `uiMode` instead of leaving the default.
- **A runtime toggle updates text but not the editor palette:** keep the selected `EditorUiMode` in Compose state above `Editor` so changing it recomposes the editor.
- **Custom buttons look wrong in one mode:** avoid hard-coded colors and read `MaterialTheme.colorScheme` from inside the component configuration.

## API Reference

| API | Description |
| --- | ----------- |
| `Editor(uiMode=_)` | Selects whether the editor follows the system theme or renders a fixed light or dark palette. |
| `EditorConfiguration.remember(builder=_)` | Provides the editor component configuration used by the sample dock button. |
| `Dock.remember(builder=_)` | Configures the editor dock that hosts custom dock items. |
| `Dock.ListBuilder.remember(builder=_)` | Builds the ordered list of items shown in the dock. |
| `Dock.ListBuilder.add(block=_)` | Adds a custom dock item to the dock list. |
| `Dock.Button.remember(builder=_)` | Creates the custom theme-toggle button shown in the dock. |

## Next Steps

- [Custom Labels](./custom-labels.md) — Override default UI text with your own labels for full control over the editor's wording.
- [UI Extensions](../ui-extensions.md) - Extend the editor interface with custom components, panels, actions, and dialogs tailored to your workflow.
- [Customize Behaviour](../ui-extensions/customize-behaviour.md) — Define how UI components behave when interacting with your custom logic.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support