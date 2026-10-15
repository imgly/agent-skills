# CameraReactionResult

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { CameraReactionResult } from '@imgly/camera-react-native';`

The result for a reaction camera recording session.

```typescript
interface CameraReactionResult
```

## Members

### video

- **Kind:** Property

```typescript
video: Recording
```

The video that was reacted to (iOS only).

### recordings

- **Kind:** Property

```typescript
recordings: Recording[]
```

The recorded videos.

### metadata

- **Kind:** Property

```typescript
metadata: {[key: string]: unknown}
```

The associated metadata.
