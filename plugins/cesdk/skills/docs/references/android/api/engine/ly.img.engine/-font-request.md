# FontRequest

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A stable font identity resolved at runtime, preserved when the font is unavailable.

```kotlin
data class FontRequest(val family: String, val subFamily: String = "", val weight: FontWeight = FontWeight.NORMAL, val style: FontStyle = FontStyle.NORMAL, val postScriptName: String? = null, val assetSourceId: String? = null, val assetId: String? = null)
```


## Members

### FontRequest

```kotlin
constructor(family: String, subFamily: String = "", weight: FontWeight = FontWeight.NORMAL, style: FontStyle = FontStyle.NORMAL, postScriptName: String? = null, assetSourceId: String? = null, assetId: String? = null)
```

### assetId

```kotlin
val assetId: String? = null
```

### assetSourceId

```kotlin
val assetSourceId: String? = null
```

### family

```kotlin
val family: String
```

### postScriptName

```kotlin
val postScriptName: String? = null
```

### style

```kotlin
val style: FontStyle
```

### subFamily

```kotlin
val subFamily: String
```

### weight

```kotlin
val weight: FontWeight
```
