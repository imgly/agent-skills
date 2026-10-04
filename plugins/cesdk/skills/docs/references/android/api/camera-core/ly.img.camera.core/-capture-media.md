# CaptureMedia

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

An ActivityResultContract to start the IMG.LY Camera with the Input. The output is a CameraResult — either CameraResult.Captures for standard photo / video / mixed sessions, or CameraResult.Reaction for reaction sessions.

```kotlin
open class CaptureMedia : ActivityResultContract<CaptureMedia.Input, CameraResult?>
```


## Members

### CaptureMedia

```kotlin
constructor()
```

### createIntent

```kotlin
@CallSuper
open override fun createIntent(context: Context, input: CaptureMedia.Input): Intent
```

### getSynchronousResult

```kotlin
override fun getSynchronousResult(context: Context, input: CaptureMedia.Input): ActivityResultContract.SynchronousResult<CameraResult?>?
```

### parseResult

```kotlin
open override fun parseResult(resultCode: Int, intent: Intent?): CameraResult?
```
