# EngineConfiguration

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Basic configuration settings to initialize the engine.

```kotlin
data class EngineConfiguration(val license: String? = null, val userId: String? = null, val host: String = "") : Parcelable
```


## Members

### EngineConfiguration

```kotlin
constructor(parcel: Parcel)
```

```kotlin
constructor(license: String? = null, userId: String? = null, host: String = "")
```

### describeContents

```kotlin
open override fun describeContents(): Int
```

### host

```kotlin
val host: String
```

### license

```kotlin
val license: String? = null
```

### userId

```kotlin
val userId: String? = null
```

### writeToParcel

```kotlin
open override fun writeToParcel(parcel: Parcel, flags: Int)
```
