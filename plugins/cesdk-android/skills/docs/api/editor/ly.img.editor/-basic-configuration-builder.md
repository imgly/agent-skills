# BasicConfigurationBuilder

- **Module:** `ly.img:editor`
- **Package:** `ly.img.editor`

Base scope class for all the solutions. Contains helper functions, as well as state objects that render overlay content.

```kotlin
@Stable
open class BasicConfigurationBuilder : EditorConfigurationBuilder
```


## Members

### BasicConfigurationBuilder

```kotlin
constructor()
```

### CloseConfirmationDialog

```kotlin
@Composable
fun CloseConfirmationDialog(_: Nothing = nothing, modifier: Modifier = Modifier, icon: @Composable () -> Unit? = { Icon(imageVector = IconPack.CloudAlertOutline, contentDescription = null) }, title: @Composable () -> Unit? = { Text(text = stringResource(R.string.ly_img_editor_dialog_close_confirm_title)) }, text: @Composable () -> Unit? = { Text(text = stringResource(R.string.ly_img_editor_dialog_close_confirm_text)) }, onDismissRequest: () -> Unit = { showCloseConfirmationDialog = false }, confirmButton: @Composable () -> Unit = { TextButton( onClick = { onDismissRequest() editorContext.eventHandler.send(EditorEvent.CloseEditor()) }, ) { Text(stringResource(R.string.ly_img_editor_dialog_close_confirm_button_confirm)) } }, dismissButton: @Composable () -> Unit? = { TextButton( onClick = onDismissRequest, ) { Text(stringResource(R.string.ly_img_editor_dialog_close_confirm_button_dismiss)) } }, properties: DialogProperties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false), __: Nothing = nothing)
```

A helper composable function for displaying a confirmation dialog when closing the editor.

### ErrorDialog

```kotlin
@Composable
fun ErrorDialog(_: Nothing = nothing, throwable: Throwable, modifier: Modifier = Modifier, icon: (@Composable () -> Unit)? = null, title: @Composable () -> Unit? = { Text(text = stringResource(R.string.ly_img_editor_dialog_error_title)) }, text: @Composable () -> Unit? = { Text( text = (throwable as? EngineException)?.getDisplayMessage(LocalContext.current) ?: throwable.message ?: "", ) }, confirmButton: @Composable () -> Unit = { TextButton( onClick = { error = null editorContext.eventHandler.send(EditorEvent.CloseEditor(throwable)) }, ) { Text(stringResource(R.string.ly_img_editor_dialog_error_confirm_text)) } }, dismissButton: (@Composable () -> Unit)? = null, onDismissRequest: () -> Unit = {}, properties: DialogProperties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false), __: Nothing = nothing)
```

A helper composable function for displaying a dialog when the editor captures a throwable.

### Loading

```kotlin
@Composable
fun Loading(_: Nothing = nothing, onDismissRequest: () -> Unit = {}, properties: DialogProperties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false), content: @Composable () -> Unit = { CircularProgressIndicator( modifier = Modifier.testTag("MainLoading"), color = MaterialTheme.colorScheme.onPrimary, ) })
```

A helper composable function for displaying a loading overlay.

### NoInternetDialog

```kotlin
@Composable
fun NoInternetDialog(_: Nothing = nothing, modifier: Modifier = Modifier, icon: @Composable () -> Unit? = { Icon(imageVector = IconPack.WifiCancel, contentDescription = null) }, title: @Composable () -> Unit? = { Text(text = stringResource(R.string.ly_img_editor_dialog_no_internet_title)) }, text: @Composable () -> Unit? = { Text(text = stringResource(R.string.ly_img_editor_dialog_no_internet_text)) }, confirmButton: @Composable () -> Unit = { TextButton( onClick = { showLoading = false editorContext.eventHandler.send(EditorEvent.CloseEditor(EditorException(EditorException.Code.NO_INTERNET))) }, ) { Text(stringResource(R.string.ly_img_editor_dialog_no_internet_button_confirm)) } }, dismissButton: (@Composable () -> Unit)? = null, onDismissRequest: () -> Unit = {}, properties: DialogProperties = DialogProperties(dismissOnBackPress = false, dismissOnClickOutside = false), __: Nothing = nothing)
```

A helper composable function for displaying a dialog when there is not internet.

### Overlay

```kotlin
@Composable
fun Overlay(_: Nothing = nothing, backHandler: @Composable () -> Unit = { val isBackHandlerEnabled by remember { combine( editorContext.engine.editor.onHistoryUpdatedWithKind().map { editorContext.engine.editor.canUndo() }, editorContext.state.map { it.isBackHandlerEnabled }, ) { canUndo, isBackHandlerEnabled -> canUndo && !isBackHandlerEnabled } }.collectAsState(false) BackHandler(isBackHandlerEnabled) { editorContext.eventHandler.send(EditorEvent.OnClose()) } }, loading: @Composable () -> Unit = { if (showLoading) { Loading() } }, errorDialog: @Composable () -> Unit = { this@BasicConfigurationBuilder.error?.let { ErrorDialog(throwable = it) } }, closeConfirmationDialog: @Composable () -> Unit = { if (showCloseConfirmationDialog) { CloseConfirmationDialog() } }, __: Nothing = nothing)
```

BackHandler(isBackHandlerEnabled) { editorContext.eventHandler.send(EditorEvent.OnClose()) } }, loading: @Composable () -> Unit = { if (showLoading) { Loading() } }, errorDialog: @Composable () -> Unit = { this@BasicConfigurationBuilder.error?.let { ErrorDialog(throwable = it) } }, closeConfirmationDialog: @Composable () -> Unit = { if (showCloseConfirmationDialog) { CloseConfirmationDialog() } }, __: Nothing = nothing) A helper function that renders the overlay based on showLoading, showCloseConfirmationDialog and error state objects.

### error

```kotlin
var error: Throwable?
```

Latest error of the editor. Depending on the type, NoInternetDialog or ErrorDialog composable is visible in the overlay.

### export

```kotlin
suspend fun export(_: Nothing = nothing, block: DesignBlock = requireNotNull(editorContext.engine.scene.get()), mimeType: MimeType = MimeType.PDF, preExport: suspend Engine.() -> Unit = { // The engine instance is background engine here and has nothing to do with editorContext.engine. this.scene.getPages().forEach { this.block.setScopeEnabled(it, key = "layer/visibility", enabled = true) this.block.setVisible(it, visible = true) } }): ByteBuffer
```

A helper function that exports the block.

### getOrLoadScene

```kotlin
suspend fun getOrLoadScene(_: Nothing = nothing, sceneUri: Uri): DesignBlock
```

A helper function that returns the currently active scene or creates it from the given sceneUri.

### observeEditorEditMode

```kotlin
suspend fun observeEditorEditMode(_: Nothing = nothing, extraInsets: (String) -> Insets = { editMode -> Insets(value = if (editMode == "Crop") 24.dp else 16.dp) }, callback: suspend (String) -> Unit = {})
```

A helper function that observes the edit mode of the the editor and sets extra canvas insets.

### shareFile

```kotlin
fun shareFile(_: Nothing = nothing, authority: String = ".ly.img.editor.fileprovider", file: File, mimeType: MimeType)
```

A helper function that opens a system dialog to share the file.

### shareUri

```kotlin
fun shareUri(_: Nothing = nothing, uri: Uri, mimeType: MimeType)
```

A helper function that opens a system dialog to share the uri.

### showCloseConfirmationDialog

```kotlin
var showCloseConfirmationDialog: Boolean
```

Whether CloseConfirmationDialog composable should be visible in the overlay.

### showConfirmationOrCloseEditor

```kotlin
fun showConfirmationOrCloseEditor()
```

A helper function that: 1. Closes the editor if the editor history is empty. 2. Shows confirmation dialog if the editor history is not empty.

### showLoading

```kotlin
var showLoading: Boolean
```

Whether Loading composable should be visible in the overlay.

### systemGalleryConfiguration

```kotlin
var systemGalleryConfiguration: SystemGalleryConfiguration
```

Whether the in-app system gallery integration is active.

### writeToFile

```kotlin
suspend fun writeToFile(_: Nothing = nothing, byteBuffer: ByteBuffer, mimeType: MimeType = MimeType.PDF, file: suspend () -> File = { val extension = "." + mimeType.key.split("/").last() File.createTempFile(UUID.randomUUID().toString(), extension) }): File
```

A helper function that writes byteBuffer into a file.
