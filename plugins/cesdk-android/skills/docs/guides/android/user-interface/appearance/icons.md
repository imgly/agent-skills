> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Appearance](../appearance.md) > [Icons](./icons.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-appearance-icons/IconsEditorSolution.kt reference-only
import android.widget.Toast
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.core.component.CanvasMenu
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberImagesLibrary
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.Replace
import ly.img.editor.guides.icons.BrandIcons
import ly.img.editor.guides.icons.brandicons.BrandSpark
import ly.img.engine.DesignBlockType
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.Color as EngineColor

// Add this composable to your NavHost
@Composable
fun IconsEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    if (editorContext.engine.scene.get() == null) {
                        val scene = editorContext.engine.scene.create()
                        val page = editorContext.engine.block.create(DesignBlockType.Page)
                        editorContext.engine.block.setWidth(page, value = 1080F)
                        editorContext.engine.block.setHeight(page, value = 1080F)
                        editorContext.engine.block.appendChild(parent = scene, child = page)

                        val block = editorContext.engine.block.create(DesignBlockType.Graphic)
                        editorContext.engine.block.setShape(
                            block,
                            shape = editorContext.engine.block.createShape(ShapeType.Rect),
                        )
                        val fill = editorContext.engine.block.createFill(FillType.Color)
                        editorContext.engine.block.setFill(block, fill = fill)
                        editorContext.engine.block.setFillSolidColor(
                            block = block,
                            color = EngineColor.fromRGBA(r = 0.86F, g = 0.9F, b = 1F, a = 1F),
                        )
                        editorContext.engine.block.setWidth(block, value = 420F)
                        editorContext.engine.block.setHeight(block, value = 420F)
                        editorContext.engine.block.setPositionX(block, value = 330F)
                        editorContext.engine.block.setPositionY(block, value = 330F)
                        editorContext.engine.block.appendChild(parent = page, child = block)
                        editorContext.engine.scene.zoomToBlock(page)
                        editorContext.engine.block.setSelected(block, selected = true)
                    }
                }
                dock = {
                    Dock.remember {
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add {
                                    Dock.Button.rememberImagesLibrary {
                                        vectorIcon = { BrandIcons.BrandSpark }
                                    }
                                }
                                add { Dock.Button.rememberTextLibrary() }
                            }
                        }
                    }
                }
                canvasMenu = {
                    CanvasMenu.remember {
                        listBuilder = {
                            CanvasMenu.ListBuilder.remember {
                                add {
                                    CanvasMenu.Button.remember {
                                        id = { EditorComponentId("com.example.guides.icons.canvasMenu.brandAction") }
                                        vectorIcon = { BrandIcons.BrandSpark }
                                        contentDescription = { "Show brand action" }
                                        onClick = {
                                            Toast.makeText(
                                                editorContext.activity,
                                                "Brand action",
                                                Toast.LENGTH_SHORT,
                                            ).show()
                                        }
                                    }
                                }
                                add {
                                    CanvasMenu.Button.remember {
                                        id = { EditorComponentId("com.example.guides.icons.canvasMenu.replace") }
                                        vectorIcon = { IconPack.Replace }
                                        contentDescription = { "Replace selection" }
                                        onClick = {
                                            Toast.makeText(
                                                editorContext.activity,
                                                "Replace selection",
                                                Toast.LENGTH_SHORT,
                                            ).show()
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

Customize the editor’s icons by passing Compose `ImageVector` values to editor components.

![Icons example showing the Android editor with branded and built-in canvas menu icons](https://img.ly/docs/cesdk/android/user-interface/appearance/icons-679e32/assets/icons-android.png)

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0/editor-guides-appearance-icons)

The Android editor UI renders icons through Jetpack Compose. Use built-in `IconPack` vectors for common editor actions, or convert your own SVGs into `ImageVector` properties and pass them to component builders.

For a complete product surface, start with the [Design Editor Starter Kit](../../starterkits/design-editor.md). The snippets below use the same `EditorConfiguration` component system so you can apply the pattern to your own editor setup.

## Creating Custom Icon Vectors

Android does not register runtime SVG sprite strings. Convert each trusted SVG into a Compose vector and expose it from your app’s icon pack, then import the generated property where you configure the editor UI.

Generate vectors from source SVG files during development and commit the generated Kotlin source. Use an SVG-to-Compose generator such as `svg-to-compose` so the result is a Compose `ImageVector` property that works with `vectorIcon`. Use `currentColor`-friendly SVGs when possible so Material tinting can style the icon consistently.

### SVG Source Requirements

- Start from trusted SVG files that your team owns or has reviewed.
- Include a `viewBox` so the generated vector scales correctly in editor buttons.
- Avoid hardcoded width and height values that fight Compose sizing.
- Prefer paths that can be tinted by the receiving component.

### Security Considerations

Because Android icon vectors are compiled Kotlin source, the editor does not inject arbitrary SVG markup at runtime. Do not add a runtime SVG parser for untrusted content just to mirror web integrations; sanitize and review SVGs before generating Kotlin vectors.

## Replacing Dock Entry Icons

Override a predefined dock button’s `vectorIcon` when you want to keep the button behavior but change how it looks. This example keeps the Images library action and swaps only its icon.

```kotlin highlight-android-replace-dock-icon
Dock.Button.rememberImagesLibrary {
    vectorIcon = { BrandIcons.BrandSpark }
}
```

The builder override runs inside the existing `Dock.Button.rememberImagesLibrary` helper, so the button still opens the Images library. Only the `ImageVector` changes.

## Using Icons in Custom Components

Create a custom editor component when your app owns both the icon and the action. This example adds a branded canvas menu button with a stable app-owned component ID, a generated `ImageVector`, an accessibility label, and a click handler for the app action.

```kotlin highlight-android-custom-canvas-menu-icon
CanvasMenu.Button.remember {
    id = { EditorComponentId("com.example.guides.icons.canvasMenu.brandAction") }
    vectorIcon = { BrandIcons.BrandSpark }
    contentDescription = { "Show brand action" }
    onClick = {
        Toast.makeText(
            editorContext.activity,
            "Brand action",
            Toast.LENGTH_SHORT,
        ).show()
    }
}
```

The button uses `BrandIcons.BrandSpark` through `vectorIcon`, so CE.SDK still applies the canvas menu button tint. Use the lower-level `icon` composable only when your component needs custom Compose content instead of a single vector.

## Built-In Icons

CE.SDK ships generated Compose vectors in `ly.img.editor.core.iconpack.IconPack`. Import the extension property you need, then pass it anywhere an editor component accepts an `ImageVector`.

For example, import `ly.img.editor.core.iconpack.IconPack` and the specific extension property, such as `ly.img.editor.core.iconpack.Replace`, before using `IconPack.Replace` in an editor component:

```kotlin highlight-android-iconpack-component
CanvasMenu.Button.remember {
    id = { EditorComponentId("com.example.guides.icons.canvasMenu.replace") }
    vectorIcon = { IconPack.Replace }
    contentDescription = { "Replace selection" }
    onClick = {
        Toast.makeText(
            editorContext.activity,
            "Replace selection",
            Toast.LENGTH_SHORT,
        ).show()
    }
}
```

| Icon |
| ---- |
| `IconPack.AddAudio` |
| `IconPack.AddCameraBackground` |
| `IconPack.AddCameraForeground` |
| `IconPack.AddGalleryBackground` |
| `IconPack.AddGalleryForeground` |
| `IconPack.AddImageForeground` |
| `IconPack.AddOverlay` |
| `IconPack.AddShape` |
| `IconPack.AddSticker` |
| `IconPack.AddText` |
| `IconPack.Adjustments` |
| `IconPack.Animation` |
| `IconPack.ArrowBack` |
| `IconPack.ArrowForward` |
| `IconPack.AsClip` |
| `IconPack.AsOverlay` |
| `IconPack.Blur` |
| `IconPack.BringForward` |
| `IconPack.Close` |
| `IconPack.CloudAlertOutline` |
| `IconPack.CropRotate` |
| `IconPack.Delete` |
| `IconPack.Duplicate` |
| `IconPack.Effect` |
| `IconPack.Elements` |
| `IconPack.ExpandMore` |
| `IconPack.Export` |
| `IconPack.Filter` |
| `IconPack.GroupEnter` |
| `IconPack.Image` |
| `IconPack.ImageOutline` |
| `IconPack.Keyboard` |
| `IconPack.LayersOutline` |
| `IconPack.LibraryElementsOutline` |
| `IconPack.LibraryElements` |
| `IconPack.Minus` |
| `IconPack.Music` |
| `IconPack.Pages` |
| `IconPack.PlayBox` |
| `IconPack.PlayBoxOutline` |
| `IconPack.Plus` |
| `IconPack.Preview` |
| `IconPack.PreviewToggled` |
| `IconPack.Rabbit` |
| `IconPack.Redo` |
| `IconPack.ReorderHorizontally` |
| `IconPack.Replace` |
| `IconPack.Resize` |
| `IconPack.SelectGroup` |
| `IconPack.SendBackward` |
| `IconPack.ShapeIcon` |
| `IconPack.Shapes` |
| `IconPack.ShapesOutline` |
| `IconPack.SizeL` |
| `IconPack.SizeLCircled` |
| `IconPack.SizeM` |
| `IconPack.SizeMCircled` |
| `IconPack.SizeS` |
| `IconPack.SizeSCircled` |
| `IconPack.Split` |
| `IconPack.StickerEmoji` |
| `IconPack.StickerEmojiOutline` |
| `IconPack.TextFields` |
| `IconPack.Typeface` |
| `IconPack.Undo` |
| `IconPack.VoiceoverAdd` |
| `IconPack.VolumeHigh` |
| `IconPack.WifiCancel` |

## Troubleshooting

### Custom Icon Not Appearing

- Verify the generated icon property is imported from the package where your vector was generated.
- Confirm the editor component uses `vectorIcon` or draws the vector through the `icon` composable.
- Keep custom component IDs stable and unique so the component list can manage replacements correctly.

### Icon Not Scaling Correctly

- Check the source SVG `viewBox` before generating the Compose vector.
- Avoid hardcoded dimensions in custom `Icon` composables unless the surrounding component expects them.
- Test the icon in both light and dark UI modes when the vector contains multiple paths.

### Icon Color Not Matching Theme

- Prefer the `vectorIcon` builder property so CE.SDK applies the component tint.
- If you use the lower-level `icon` composable, pass the desired tint to `Icon`.
- Avoid generated vectors with hardcoded brand colors unless the icon must ignore the theme.

## API Reference

| API | Description |
| --- | ----------- |
| `Dock.remember(builder=_)` | Creates the dock component that owns dock items. |
| `Dock.ListBuilder.remember(builder=_)` | Defines the dock item list and order. |
| `Dock.Button.rememberImagesLibrary(builder=_)` | Creates the predefined Images library dock button and lets you override builder properties such as `vectorIcon`. |
| `CanvasMenu.remember(builder=_)` | Creates the canvas menu component that appears for selected blocks. |
| `CanvasMenu.ListBuilder.remember(builder=_)` | Defines the canvas menu item list and order. |
| `CanvasMenu.Button.remember(builder=_)` | Creates a custom canvas menu button for app-owned actions. |
| `CanvasMenu.ButtonBuilder.id` | Assigns a stable component ID to the custom canvas menu button. |
| `EditorComponentId(id=_)` | Assigns a stable unique ID to a custom editor component. |
| `IconPack.Replace` | Provides the built-in Replace icon vector after importing `ly.img.editor.core.iconpack.Replace`. |
| `Dock.ButtonBuilder.vectorIcon` | Supplies the `ImageVector` rendered by a dock button. |
| `Dock.ButtonBuilder.icon` | Supplies custom Compose icon content for a dock button when a single `ImageVector` is not enough. |
| `CanvasMenu.ButtonBuilder.vectorIcon` | Supplies the `ImageVector` rendered by a canvas menu button. |
| `CanvasMenu.ButtonBuilder.icon` | Supplies custom Compose icon content for a canvas menu button when a single `ImageVector` is not enough. |
| `CanvasMenu.ButtonBuilder.contentDescription` | Supplies the accessibility label for the canvas menu button icon. |
| `CanvasMenu.ButtonBuilder.onClick` | Handles the custom canvas menu button action. |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support