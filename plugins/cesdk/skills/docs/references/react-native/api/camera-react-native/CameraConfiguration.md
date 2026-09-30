# CameraConfiguration

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { CameraConfiguration } from '@imgly/camera-react-native';`

Configuration options that control how the camera captures media.
All fields are optional; missing values fall back to native defaults
(`video`, `multi`, `5` seconds).

```typescript
interface CameraConfiguration
```

## Members

### captureType

- **Kind:** Property

```typescript
captureType?: CaptureType
```

The kind of media the camera captures.

### captureCount

- **Kind:** Property

```typescript
captureCount?: CaptureCount
```

How many captures the camera session produces.

### photoClipDuration

- **Kind:** Property

```typescript
photoClipDuration?: number
```

The duration in seconds stamped on each captured photo.
