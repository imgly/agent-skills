# SpotColor

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class SpotColor : Color
```


## Members

### externalReference

```kotlin
val externalReference: String?
```

The external reference of a spot color, e.g. the name of formula guide it comes from.

### name

```kotlin
val name: String
```

The name of the spot color i.e. "PANTONE 102 C" or "HKS 47".

### tint

```kotlin
val tint: Float
```

The tint component in the range of 0 to 1.
