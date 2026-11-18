# CaptionMerge

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The result of BlockApi.mergeCaptionWithPrevious.

```kotlin
data class CaptionMerge(val caption: DesignBlock, val textIndex: Int)
```


## Members

### CaptionMerge

```kotlin
constructor(caption: DesignBlock, textIndex: Int)
```

### caption

```kotlin
val caption: DesignBlock
```

The caption that stays.

### textIndex

```kotlin
val textIndex: Int
```

The UTF-16 index of the merged text where the text of the merged caption starts, such as for a caret.
