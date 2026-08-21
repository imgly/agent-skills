# Photo

- **Module:** `IMGLYCamera`
- **DocC identifier:** `/documentation/IMGLYCamera/Photo`

A camera photo capture.

```swift
struct Photo
```

## Members

### duration

```swift
let duration: CMTime
```

The duration stamped on the photo.

### images

```swift
let images: [Photo.Image]
```

Contains one `Image` in single-camera mode or two `Image`s stacked per `cameraMode.layoutMode` in dual-camera mode.

### Photo.Image

```swift
struct Image
```

A single still image inside a photo capture.

### Image.rect

```swift
let rect: CGRect
```

The position and size of the image within the camera’s 1080x1920 canvas. In single-camera mode this is the full canvas; in dual-camera mode it is the top/bottom or left/right half.

### Image.url

```swift
let url: URL
```

The URL of the photo file.
