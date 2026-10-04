# PhotoImage

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { PhotoImage } from '@imgly/camera-react-native';`

A single image inside a photo capture.

```typescript
interface PhotoImage
```

## Members

### uri

- **Kind:** Property

```typescript
uri: string
```

A url to the photo file that is stored
in a temporary location.

### rect

- **Kind:** Property

```typescript
rect: Rect
```

A rect that contains the position of
the image inside the dual-camera layout
(iOS only).
