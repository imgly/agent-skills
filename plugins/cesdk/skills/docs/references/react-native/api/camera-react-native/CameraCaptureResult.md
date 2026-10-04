# CameraCaptureResult

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { CameraCaptureResult } from '@imgly/camera-react-native';`

The result for a photo, video, or mixed camera capture session.

```typescript
interface CameraCaptureResult
```

## Members

### captures

- **Kind:** Property

```typescript
captures: Capture[]
```

The individual captures from the session.

### metadata

- **Kind:** Property

```typescript
metadata: {[key: string]: unknown}
```

The associated metadata.
