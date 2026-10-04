# IMGLYCamera

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** class
- **Import:** `import IMGLYCamera from '@imgly/camera-react-native';`

The IMG.LY Camera.

```typescript
class IMGLYCamera
```

## Members

### openCamera

- **Kind:** Method (3 overloads)

```typescript
static async openCamera(settings: CameraSettings & {configuration: CameraConfiguration & {captureType: 'photo' | 'mixed'}}, metadata?: {[key: string]: unknown}): Promise<CameraCaptureResult | null>
```

Opens the camera in photo or mixed capture mode.

Returns a `CameraCaptureResult` with photos, videos, or both, depending
on the configured `captureType`.

- **settings**: Configuration settings for the camera. Must include
  a `configuration` with `captureType: 'photo'` or `'mixed'`.
- **metadata**: Optional metadata to pass to the native module.
- **Returns**: A promise that resolves to the capture result, or null if cancelled.

```typescript
static async openCamera(settings: CameraSettings, video: string, metadata?: {[key: string]: unknown}): Promise<CameraReactionResult | null>
```

Opens the camera for reaction mode (iOS only).
- **settings**: Configuration settings for the camera.
- **video**: Optional video input to trigger reactions.
- **metadata**: Optional metadata to pass to the native module.
- **Returns**: A promise that resolves to the reaction result, or null if cancelled.

```typescript
static async openCamera(settings: CameraSettings, metadata?: {[key: string]: unknown}): Promise<CameraCaptureResult | null>
```

Opens the standard video camera.
- **settings**: Configuration settings for the camera.
- **metadata**: Optional metadata to pass to the native module.
- **Returns**: A promise that resolves to the capture result, or null if cancelled.
