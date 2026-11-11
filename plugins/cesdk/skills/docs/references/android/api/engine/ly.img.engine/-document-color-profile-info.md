# DocumentColorProfileInfo

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The profile reference stored in a document slot. Fallback profiles are not reported.

```kotlin
data class DocumentColorProfileInfo(val contentHash: String, val name: String, val uri: String)
```


## Members

### DocumentColorProfileInfo

```kotlin
constructor(contentHash: String, name: String, uri: String)
```

### contentHash

```kotlin
val contentHash: String
```

### name

```kotlin
val name: String
```

### uri

```kotlin
val uri: String
```
