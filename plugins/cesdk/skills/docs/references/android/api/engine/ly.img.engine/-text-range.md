# TextRange

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A half-open UTF-16 range in TextFontUsage.text.

```kotlin
data class TextRange(val from: Int, val to: Int)
```


## Members

### TextRange

```kotlin
constructor(from: Int, to: Int)
```

### from

```kotlin
val from: Int
```

Inclusive start code-unit index.

### to

```kotlin
val to: Int
```

Exclusive end code-unit index.
