# Input

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Basic configuration settings to initialize the camera.

```kotlin
open class Input(val engineConfiguration: EngineConfiguration, val cameraConfiguration: CameraConfiguration = CameraConfiguration(), val cameraMode: CameraMode = CameraMode.Standard()) : Parcelable
```


## Members

### Input

```kotlin
constructor(parcel: Parcel)
```

```kotlin
constructor(engineConfiguration: EngineConfiguration, cameraConfiguration: CameraConfiguration = CameraConfiguration(), cameraMode: CameraMode = CameraMode.Standard())
```

### cameraConfiguration

```kotlin
val cameraConfiguration: CameraConfiguration
```

### cameraMode

```kotlin
val cameraMode: CameraMode
```

### describeContents

```kotlin
open override fun describeContents(): Int
```

### engineConfiguration

```kotlin
val engineConfiguration: EngineConfiguration
```

### writeToParcel

```kotlin
open override fun writeToParcel(parcel: Parcel, flags: Int)
```
