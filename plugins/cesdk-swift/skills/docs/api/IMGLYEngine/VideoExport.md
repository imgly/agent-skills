# VideoExport

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VideoExport`

```swift
@frozen enum VideoExport
```

## Members

### VideoExport.finished(video:)

```swift
case finished(video: Blob)
```

### VideoExport.progress(renderedFrames:encodedFrames:totalFrames:)

```swift
case progress(renderedFrames: Int, encodedFrames: Int, totalFrames: Int)
```
