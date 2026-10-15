# Photo

- **Package:** `@imgly/camera-react-native` (React Native, TypeScript)
- **Kind:** interface
- **Import:** `import { Photo } from '@imgly/camera-react-native';`

A captured still photo. Contains one image in standard mode or two stacked images in dual camera mode.

```typescript
interface Photo
```

## Members

### images

- **Kind:** Property

```typescript
images: PhotoImage[]
```

The individual image(s) of the photo capture.

### duration

- **Kind:** Property

```typescript
duration: number
```

The duration stamped on the photo, in seconds.
Note: the Flutter bridge passes this value in milliseconds instead.
