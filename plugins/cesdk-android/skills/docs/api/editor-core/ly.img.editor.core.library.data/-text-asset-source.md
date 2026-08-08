# TextAssetSource

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

A legacy custom asset source that applies a fixed font weight and size (Title / Headline / Body) when applied to a text block. The default text library (ly.img.editor.core.library.LibraryCategory.Text / ly.img.editor.core.library.LibraryContent.Text) now uses the split text preset sources (AssetSourceType.TextPlain, AssetSourceType.TextStyles, AssetSourceType.TextCurves) and no longer references this source. It is retained only for integrations that still register it explicitly; new integrations should use the split text preset sources instead.

```kotlin
class TextAssetSource(engine: Engine, typeface: Typeface) : AssetSource
```
> **Deprecated:** The default text library now uses the split text preset sources (AssetSourceType.TextPlain, TextStyles, TextCurves). Register and use those instead.


## Members

### TextAssetSource

```kotlin
constructor(engine: Engine, typeface: Typeface)
```

### applyAsset

```kotlin
open suspend override fun applyAsset(asset: Asset): DesignBlock?
```

### findAssets

```kotlin
open suspend override fun findAssets(query: FindAssetsQuery): FindAssetsResult
```

### getGroups

```kotlin
open suspend override fun getGroups(): List<String>?
```
