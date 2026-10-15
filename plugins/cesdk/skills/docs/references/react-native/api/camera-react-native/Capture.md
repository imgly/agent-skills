# Capture

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { Capture } from '@imgly/camera-react-native';`

A single capture from the camera. Either a still
photo or a video recording.

```typescript
interface Capture
```

## Members

### photo

- **Kind:** Property

```typescript
photo?: Photo
```

The captured still photo, when this is a photo capture.

### video

- **Kind:** Property

```typescript
video?: Recording
```

The video recording, when this is a video capture.
