# Selection

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component.data`

A class containing information on the current selection in the editor.

```kotlin
@Stable
data class Selection(val _: Nothing = nothing, val designBlock: DesignBlock, val parentDesignBlock: DesignBlock?, val type: DesignBlockType, val fillType: FillType?, val kind: String?, val indexInParent: Int, val screenSpaceBoundingBoxRect: RectF?, val isVisibleAtCurrentPlaybackTime: Boolean, val __: Nothing = nothing)
```


## Members

### Selection

```kotlin
constructor(_: Nothing = nothing, designBlock: DesignBlock, parentDesignBlock: DesignBlock?, type: DesignBlockType, fillType: FillType?, kind: String?, indexInParent: Int, screenSpaceBoundingBoxRect: RectF?, isVisibleAtCurrentPlaybackTime: Boolean, __: Nothing = nothing)
```

### _

```kotlin
val _: Nothing
```

### __

```kotlin
val __: Nothing
```

### designBlock

```kotlin
val designBlock: DesignBlock
```

### fillType

```kotlin
val fillType: FillType?
```

### indexInParent

```kotlin
val indexInParent: Int
```

### isTypeSupportedByEditorUi

```kotlin
val isTypeSupportedByEditorUi: Boolean
```

Whether the type of the selected design block is in supportedDesignBlockTypes.

### isVisibleAtCurrentPlaybackTime

```kotlin
val isVisibleAtCurrentPlaybackTime: Boolean
```

### kind

```kotlin
val kind: String?
```

### parentDesignBlock

```kotlin
val parentDesignBlock: DesignBlock?
```

### screenSpaceBoundingBoxRect

```kotlin
val screenSpaceBoundingBoxRect: RectF?
```

### type

```kotlin
val type: DesignBlockType
```
