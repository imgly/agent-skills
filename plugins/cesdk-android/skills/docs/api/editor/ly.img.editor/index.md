# ly.img.editor

- **Module:** `ly.img:editor`
- **Package:** `ly.img.editor`
- **Module catalog:** [`ly.img:editor`](<../../indexes/editor.md>)

## Top-level declarations

### ApparelEditor

```kotlin
@Composable
fun ApparelEditor(onClose: (Throwable?) -> Unit)
```
> **Deprecated (with error):** ApparelEditor solution is moved to a starter kit package. Check this migration guide for details: https://img.ly/docs/cesdk/android/to-v1-73-ab14fb/

### DesignEditor

```kotlin
@Composable
fun DesignEditor(onClose: (Throwable?) -> Unit)
```
> **Deprecated (with error):** DesignEditor solution has become a starter kit. Check this migration guide for details: https://img.ly/docs/cesdk/android/to-v1-73-ab14fb/

### Editor

```kotlin
@Composable
fun Editor(license: String? = null, userId: String? = null, baseUri: Uri = defaultBaseUri, host: String = "", engineRenderTarget: EngineRenderTarget = EngineRenderTarget.SURFACE_VIEW, uiMode: EditorUiMode = EditorUiMode.SYSTEM, configuration: ScopedProperty<EditorScope, EditorConfiguration> = { EditorConfiguration.remember() }, onClose: (Throwable?) -> Unit = {})
```

Built to provide versatile photo and video editing capabilities. Toggling between edit, preview and pages modes enables users to evaluate their edited photos/videos before export.

### PhotoEditor

```kotlin
@Composable
fun PhotoEditor(onClose: (Throwable?) -> Unit)
```
> **Deprecated (with error):** PhotoEditor solution has become a starter kit. Check this migration guide for details: https://img.ly/docs/cesdk/android/to-v1-73-ab14fb/

### PostcardEditor

```kotlin
@Composable
fun PostcardEditor(onClose: (Throwable?) -> Unit)
```
> **Deprecated (with error):** PostcardEditor solution has become a starter kit. Check this migration guide for details: https://img.ly/docs/cesdk/android/to-v1-73-ab14fb/

### VideoEditor

```kotlin
@Composable
fun VideoEditor(onClose: (Throwable?) -> Unit)
```
> **Deprecated (with error):** VideoEditor solution has become a starter kit. Check this migration guide for details: https://img.ly/docs/cesdk/android/to-v1-73-ab14fb/

### defaultBaseUri

```kotlin
val defaultBaseUri: Uri
```

The default baseUri value used in Editor composable.
