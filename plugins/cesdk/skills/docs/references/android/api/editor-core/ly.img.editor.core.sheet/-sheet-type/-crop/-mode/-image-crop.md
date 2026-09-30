# ImageCrop

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

Default mode for cropping image or video fills.

```kotlin
data object ImageCrop : SheetType.Crop.Mode
```


## Members

### applyOnAllPages

```kotlin
open override val applyOnAllPages: Boolean = false
```

### hasContentFillMode

```kotlin
open override val hasContentFillMode: Boolean = true
```

### hasCropAsset

```kotlin
open override val hasCropAsset: Boolean = true
```

### hasPageAsset

```kotlin
open override val hasPageAsset: Boolean = false
```

### hasResetButton

```kotlin
open override val hasResetButton: Boolean = true
```

### hasResizeOption

```kotlin
open override var hasResizeOption: Boolean
```

### hasRotateOptions

```kotlin
open override val hasRotateOptions: Boolean = true
```

### titleRes

```kotlin
open override val titleRes: Int
```
