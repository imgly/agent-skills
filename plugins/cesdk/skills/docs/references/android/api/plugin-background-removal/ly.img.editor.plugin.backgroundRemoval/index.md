# ly.img.editor.plugin.backgroundRemoval

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`
- **Module catalog:** [`ly.img:plugin-background-removal`](<../../indexes/plugin-background-removal.md>)

## Top-level declarations

### rememberBackgroundRemoval

```kotlin
@Composable
fun Dock.Button.rememberBackgroundRemoval(config: BackgroundRemovalConfig, builder: Dock.ButtonBuilder.() -> Unit = {}): Button<Dock.ItemScope>
```

```kotlin
@Composable
fun InspectorBar.Button.rememberBackgroundRemoval(config: BackgroundRemovalConfig, builder: InspectorBar.ButtonBuilder.() -> Unit = {}): Button<InspectorBar.ItemScope>
```

A composable helper function that creates and remembers a Dock.Button that removes the background of the image of the current page. The button is only visible when the page has an image fill that is not SVG, and its scope allows a fill change.
