# ly.img.engine

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`
- **Module catalog:** [`ly.img:engine`](<../../indexes/engine.md>)

## Top-level declarations

### addDefaultAssetSources

```kotlin
suspend fun Engine.addDefaultAssetSources(baseUri: Uri = Engine.assetBaseUri, exclude: Set<DefaultAssetSource> = emptySet()): Job
```
> **Deprecated:** Uses legacy v4 asset source IDs and will be removed in a future version. Against a CDN that serves v5+ content (the default Engine.assetBaseUri from this release on), the IDs renamed or merged in v5 ('vectorpath'->'vector.shape', 'colors.defaultPalette'->'color.palette', 'filter.lut'+'filter.duotone'->'filter') are skipped (logged, not loaded) so one missing source no longer aborts the batch. Register sources via Engine.asset.addLocalSourceFromJSON(contentUri) with the v5 IDs (plus the new 'ly.…

Convenience function that registers a set of asset sources containing our example assets. Note: See DefaultAssetSource enum for available values. Note: By default, these assets are parsed from the IMG.LY CDN at https://cdn.img.ly/packages/imgly/cesdk-android/<version>/assets/<id>/content.json. Each source is created via AssetApi.addLocalSource and populated with the parsed assets. To modify the available assets, you may either mask out certain IDs via exclude or alter the sources after their creation.

### addDemoAssetSources

```kotlin
suspend fun Engine.addDemoAssetSources(exclude: Set<DemoAssetSource> = emptySet(), withUploadAssetSources: Boolean = false, baseUri: Uri = Engine.assetBaseUri)
```
> **Deprecated:** Uses legacy v3-era demo asset source IDs and will be removed in a future version. Register each source via Engine.asset.addLocalSourceFromJSON(contentUri) instead. Migration guide: https://img.ly/docs/cesdk/android/to-v1-77-ac6ca9/

Convenience function that registers a set of demo asset sources containing our example assets. Note: See DemoAssetSource enum for available values. Note: By default, these assets are parsed from the IMG.LY CDN at https://cdn.img.ly/packages/imgly/cesdk-android/<version>/assets/<id>/content.json. Important: For production use, you should self-host the assets or include them in your application bundle and provide your own base URI instead of loading them from the IMG.LY CDN. The assets can be downloaded from https://cdn.img.ly/packages/imgly/cesdk-android/<version>/imgly-assets.zip.

### assetBaseUri

```kotlin
val Engine.Companion.assetBaseUri: Uri
```
> **Deprecated:** Asset-source URI handling is moving out of the engine binding to match Web. Construct your own baseUri in your app pointing at bundled assets or your own server. The IMG.LY CDN is for development/evaluation only — self-host the assets for production. Will be removed in a future version.

The default base URI for loading CE.SDK asset definitions from the IMG.LY CDN. Points to the cesdk-android platform-specific versioned asset directory on the IMG.LY CDN. Each source's manifest is expected at <assetBaseUri>/<sourceID>/content.json.

### defaultAssetSourcesBaseUri

```kotlin
val Engine.defaultAssetSourcesBaseUri: Uri?
```
> **Deprecated:** Tied to the deprecated addDefaultAssetSources helper. Once you migrate to Engine.asset.addLocalSourceFromJSON(contentUri) this returns null — track the base URI yourself. Will be removed in a future version.

Returns the base uri of the default asset sources that was previously passed to addDefaultAssetSources. Important: Only addDefaultAssetSources writes this metadata key. Code that has migrated to Engine.asset.addLocalSourceFromJSON(contentUri) will not populate it; callers should track the base URI on their own side instead.

### exportSettings

```kotlin
fun Engine.exportSettings(): List<Setting>
```

Returns all the keypath-value setting pairs of the Engine. Useful when copying settings between Engine instances (see importSettings).

### getMoveHandleVisibility

```kotlin
fun EditorApi.getMoveHandleVisibility(): HandleVisibility
```

Get when the standalone move handle is shown for the selected block.

### getResizeHandlesVisibility

```kotlin
fun EditorApi.getResizeHandlesVisibility(): HandleVisibility
```

Get when the edge (resize) handles are shown for the selected block.

### getRotateHandlesVisibility

```kotlin
fun EditorApi.getRotateHandlesVisibility(): HandleVisibility
```

Get when the rotation handle is shown for the selected block.

### getScaleHandlesVisibility

```kotlin
fun EditorApi.getScaleHandlesVisibility(): HandleVisibility
```

Get when the corner (scale) handles are shown for the selected block.

### importSettings

```kotlin
fun Engine.importSettings(settings: List<Setting>)
```

Sets all the keypath-value setting pairs to the Engine. Useful when copying settings between Engine instances (see exportSettings).

### populateAssetSource

```kotlin
suspend fun Engine.populateAssetSource(id: String, jsonUri: Uri, replaceBaseUri: Uri? = null)
```
> **Deprecated:** Will be removed in a future version. Use Engine.asset.addLocalSourceFromJSON(contentUri) instead. Replace with `asset.addLocalSourceFromJSON(jsonUri)`.

Creates and adds a new local asset source with id. A describing content json file is fetched from jsonUri and containing assets are added to the local asset source. Note: Check "https://cdn.img.ly/packages/imgly/cesdk-android/1.82.0/assets/ly.img.sticker/content.json" for the structure of the json file.

### setMoveHandleVisibility

```kotlin
fun EditorApi.setMoveHandleVisibility(value: HandleVisibility)
```

Set when the standalone move handle is shown for the selected block.

### setResizeHandlesVisibility

```kotlin
fun EditorApi.setResizeHandlesVisibility(value: HandleVisibility)
```

Set when the edge (resize) handles are shown for the selected block.

### setRotateHandlesVisibility

```kotlin
fun EditorApi.setRotateHandlesVisibility(value: HandleVisibility)
```

Set when the rotation handle is shown for the selected block.

### setScaleHandlesVisibility

```kotlin
fun EditorApi.setScaleHandlesVisibility(value: HandleVisibility)
```

Set when the corner (scale) handles are shown for the selected block.
