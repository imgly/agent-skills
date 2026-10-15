# BackgroundRemovalPlugin

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Plugin for background removal. This plugin adds a dedicated button to the Dock that removes the background from the current page.

```kotlin
open class BackgroundRemovalPlugin : EditorConfigurationBuilder
```


## Members

### BackgroundRemovalPlugin

```kotlin
constructor()
```

### config

```kotlin
var config: BackgroundRemovalConfig?
```

Background removal configuration object. Check BackgroundRemovalPlugin inheritors for available options.

### dockModifier

```kotlin
var dockModifier: HorizontalListBuilderModify<EditorComponent<*>>.(BackgroundRemovalConfig) -> Unit
```

The Dock modifier in order to place the Dock.Button.rememberBackgroundRemoval button. By default, it is prepended to the dock.

### dock

```kotlin
open override var dock: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

Returns the editor dock with the background removal button inserted by dockModifier.

### onCreate

```kotlin
open override var onCreate: suspend EditorScope.() -> Unit?
```

Initializes the configured background remover after the parent configuration is created.
