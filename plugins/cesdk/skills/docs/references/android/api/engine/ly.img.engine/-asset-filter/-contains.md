# Contains

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Matches if the value of property contains value as a substring (ASCII case-insensitive).

```kotlin
data class Contains(val property: String, val value: String) : AssetFilter
```


## Members

### Contains

```kotlin
constructor(property: String, value: String)
```

### property

```kotlin
val property: String
```

### value

```kotlin
val value: String
```
