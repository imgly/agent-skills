# EditorConfigurationBuilder

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.configuration`

Basic builder class for EditorConfiguration.

```kotlin
@Stable
open class EditorConfigurationBuilder
```


## Members

### EditorConfigurationBuilder

```kotlin
constructor()
```

### assetLibrary

```kotlin
open var assetLibrary: ScopedProperty<EditorScope, AssetLibrary?>?
```

The configuration of the AssetLibrary. Check the documentation of AssetLibrary for more details.

### bottomPanel

```kotlin
open var bottomPanel: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed as a fixed bottom panel at the bottom of the editor, just above the dock. For example, it can be used if you want to render a timeline in a video editor via ly.img.editor.core.component.Timeline.

### canvasMenu

```kotlin
open var canvasMenu: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed as horizontal list of items next to the selected design block. Check ly.img.editor.core.component.CanvasMenu for our implementation or consider using EditorComponent.Companion.remember to fully customize it.

### colorPalette

```kotlin
open var colorPalette: ScopedProperty<EditorScope, List<Color>?>?
```

The default color palette used in the UI elements that contain color modifiers such as "Fill color", "Stroke Color" etc.

### dock

```kotlin
open var dock: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed as horizontal list of items at the bottom of the editor. Check ly.img.editor.core.component.Dock for our implementation or consider using EditorComponent.Companion.remember to fully customize it.

### editorContext

```kotlin
val EditorConfigurationBuilder.editorContext: EditorContext
```

The context of the editor. This property should be used to access all the properties and functions within the editor. It is an extension function on purpose to make accessing this object more obvious that it's part of the EditorScope and not a customer's property (italic in Android Studio makes it more obvious).

### inspectorBar

```kotlin
open var inspectorBar: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed as horizontal list of items at the bottom of the editor when a design block is selected. Check ly.img.editor.core.component.InspectorBar for our implementation or consider using EditorComponent.Companion.remember to fully customize it.

### navigationBar

```kotlin
open var navigationBar: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed as horizontal list of items at the top of the editor. Check ly.img.editor.core.component.NavigationBar for our implementation or consider using EditorComponent.Companion.remember to fully customize it.

### onClose

```kotlin
open var onClose: suspend EditorScope.() -> Unit?
```

The callback that is invoked after EditorEvent.OnClose event is triggered or when the system back button is clicked and editor cannot handle the event internally. Note that the "close" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the background.

### onCreate

```kotlin
open var onCreate: suspend EditorScope.() -> Unit?
```

The callback that is invoked when the editor is created. This is the main initialization block of both the editor and engine. Normally, you should create/load a scene, prepare asset sources and apply editor settings in this block. We recommend that you check the availability of the scene before creating/loading a new scene since a recreated scene may already exist if the callback is invoked after a process recreation. In addition to scene creation, it is highly recommended to register all the asset sources in this callback. Note that the "create" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the backgroun…

### onError

```kotlin
open var onError: suspend EditorScope.(Throwable) -> Unit?
```

The callback that is invoked after the editor captures an error. Note that the "error" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the background.

### onEvent

```kotlin
open var onEvent: EditorScope.(EditorEvent) -> Unit?
```

The callback that is invoked every time an event is sent via EditorEventHandler. Note that ly.img.editor.core.event.EditorEventHandler.send can be called from any of the callbacks and components of the EditorConfiguration.

### onExport

```kotlin
open var onExport: suspend EditorScope.() -> Unit?
```

The callback that is invoked when the export button is clicked. You may want to call one of the following functions in this callback: ly.img.engine.BlockApi.export, ly.img.engine.BlockApi.exportWithColorMask, ly.img.engine.BlockApi.exportVideo. Note that the "export" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the background.

### onLoaded

```kotlin
open var onLoaded: suspend EditorScope.() -> Unit?
```

The callback that is invoked when the editor is loaded and ready to be used. The callback is invoked right after onCreate when launching the editor for the first time or after process recreation. The callback is not invoked after configuration changes. It is best to register callbacks, collect flows returned by the engine. Note that the "load" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the background.

### onUpload

```kotlin
open var onUpload: suspend EditorScope.(AssetDefinition, UploadAssetSourceType) -> AssetDefinition?
```

The callback that is invoked after an asset is added to UploadAssetSourceType. When selecting an asset to upload, a default AssetDefinition object is constructed based on the selected asset and the callback is invoked. You can either leave the asset definition unmodified and do nothing (that's what the default implementation of the callback does), or adjust the properties of the object, or maybe even upload the asset file to your server and adjust the uri property of the asset. Note that the "upload" coroutine job will survive configuration changes and will be cancelled only if the editor is closed or the process is killed when in the background.

### overlay

```kotlin
open var overlay: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

The configuration of the component that is displayed over the editor. It is useful if you want to display a popup dialog or anything in the overlay. For example, you can update a composable state object in one of the callbacks and based on that state render a composable function. Consider using EditorComponent.Companion.remember to implement it. Note that the overlay is edge-to-edge, therefore it is your responsibility to draw over system bars too.

### parentConfiguration

```kotlin
val parentConfiguration: EditorConfiguration?
```

The configuration that was applied just before this builder via EditorConfiguration.Companion.remember or EditorConfiguration.then. This property should be used to delegate invocations from this builder. For instance, you can access callbacks and components, override and modify them, extend behavior before or after:
