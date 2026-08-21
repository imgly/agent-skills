# AudioExport

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/AudioExport`

```swift
@frozen enum AudioExport
```

## Members

### AudioExport.finished(audio:)

```swift
case finished(audio: Blob)
```

### AudioExport.progress(renderedFrames:encodedFrames:totalFrames:)

```swift
case progress(renderedFrames: Int, encodedFrames: Int, totalFrames: Int)
```
