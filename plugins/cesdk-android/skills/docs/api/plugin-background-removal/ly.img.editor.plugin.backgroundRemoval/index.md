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

A composable helper function that creates and remembers a Dock.Button that removes background from the current page.
