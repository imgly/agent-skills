# BackgroundRemovalPlugin

- **Module:** `ly.img:plugin-background-removal`
- **Package:** `ly.img.editor.plugin.backgroundRemoval`

Plugin for background removal. This plugin adds a button to the Dock that removes the background of the current page's image. Add InspectorBar.Button.rememberBackgroundRemoval with inspectorBarModifier to remove the background of the selected image or page. Each result file goes through the editor's onUpload callback, and the image gets the URI that the callback returns.

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

### inspectorBarModifier

```kotlin
var inspectorBarModifier: HorizontalListBuilderModify<EditorComponent<*>>.(BackgroundRemovalConfig) -> Unit?
```

The InspectorBar modifier in order to place the InspectorBar.Button.rememberBackgroundRemoval button. By default, it is null, and the plugin leaves the inspector bar unchanged. To prepend the button, set inspectorBarModifier = { addFirst { InspectorBar.Button.rememberBackgroundRemoval(config = it) } }.

### inspectorBar

```kotlin
open override var inspectorBar: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

Returns the editor inspector bar with the background removal button inserted by inspectorBarModifier, or the parent's inspector bar when inspectorBarModifier is null.

### onCreate

```kotlin
open override var onCreate: suspend EditorScope.() -> Unit?
```

Initializes the configured background remover after the parent configuration is created.
