# CameraSettings

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { CameraSettings } from '@imgly/camera-react-native';`

A class containing all necessary settings to setup the camera.

```typescript
interface CameraSettings
```

## Members

### license

- **Kind:** Property

```typescript
license?: string
```

The license of the editor. Pass `null` to run the SDK in evaluation mode with a watermark.

### userId

- **Kind:** Property

```typescript
userId?: string
```

Unique ID tied to your application's user.
This helps us accurately calculate monthly
active users (MAU).

### configuration

- **Kind:** Property

```typescript
configuration?: CameraConfiguration
```

Optional camera configuration. When omitted,
native defaults apply.
