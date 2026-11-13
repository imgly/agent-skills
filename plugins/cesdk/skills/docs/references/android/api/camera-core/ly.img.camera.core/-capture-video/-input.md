# Input

- **Module:** `ly.img:camera-core`
- **Package:** `ly.img.camera.core`

Renamed to CaptureMedia.Input. See CaptureVideo for migration details.

```kotlin
class Input(val engineConfiguration: EngineConfiguration, val cameraConfiguration: CameraConfiguration = CameraConfiguration(), val cameraMode: CameraMode = CameraMode.Standard()) : CaptureMedia.Input
```
> **Deprecated (with error):** Use CaptureMedia.Input. Replace with `import ly.img.camera.core.CaptureMedia; CaptureMedia.Input`.


## Members

### Input

```kotlin
constructor(engineConfiguration: EngineConfiguration, cameraConfiguration: CameraConfiguration = CameraConfiguration(), cameraMode: CameraMode = CameraMode.Standard())
```
