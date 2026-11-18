# TextTiming

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A range of a text and the time at which it starts to be spoken, such as one word of a caption. A text animator whose text_animator/selectorTiming is not None selects the ranges by these times.

```kotlin
data class TextTiming(val from: Int, val to: Int, val start: Double)
```


## Members

### TextTiming

```kotlin
constructor(from: Int, to: Int, start: Double)
```

### from

```kotlin
val from: Int
```

Start UTF-16 index (inclusive), like the other text range calls.

### start

```kotlin
val start: Double
```

The start in seconds from the start of the block. A range before the start of the block has a negative start.

### to

```kotlin
val to: Int
```

End UTF-16 index (exclusive).
