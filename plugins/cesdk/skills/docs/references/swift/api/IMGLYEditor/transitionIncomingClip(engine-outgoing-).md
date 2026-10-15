# transitionIncomingClip(engine:outgoing:)

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/transitionIncomingClip(engine:outgoing:)`

Returns the clip that follows `outgoing` on its track when the pair is eligible for a transition: both clips support transitions and touch or overlap on the timeline. Returns `nil` otherwise. Drives the default visibility of the inspector bar’s transition button.

```swift
@MainActor func transitionIncomingClip(engine: Engine, outgoing: DesignBlockID) -> DesignBlockID?
```
