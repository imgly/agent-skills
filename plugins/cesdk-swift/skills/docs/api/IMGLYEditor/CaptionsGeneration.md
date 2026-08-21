# CaptionsGeneration

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/CaptionsGeneration`

A namespace for automatic caption generation. Configuring a callback via [`captionsGeneration(_:)`](editorconfiguration/builder/captionsgeneration(_:).md) adds a **Generate Automatically** action to the Add Captions sheet. The editor owns the UI and imports the result; the callback only turns the scene’s audio into a captions file. The IMG.LY auto-captions plugin provides one; custom implementations can use any speech-to-text backend.

```swift
enum CaptionsGeneration
```

## Members

### CaptionsGeneration.Callback

```swift
typealias Callback = @MainActor @Sendable (Engine) async throws -> URL
```

A callback that transcribes the scene’s audible content into a captions file. `engine`

### CaptionsGeneration.Error

```swift
enum Error
```

Errors a [`CaptionsGeneration.Callback`](callback.md) can throw to drive specific alert copy in the captions sheet.

### Error.CaptionsGeneration.Error.noSpeech

```swift
case noSpeech
```

No transcribable speech was found in the scene’s audio.
