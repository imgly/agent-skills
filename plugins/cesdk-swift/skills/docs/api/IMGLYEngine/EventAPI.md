# EventAPI

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/EventAPI`

```swift
@MainActor final class EventAPI
```

## Members

### publisher(blocks:)

```swift
@MainActor func publisher(blocks: [DesignBlockID]) -> AnyPublisher<[BlockEvent], Never>
```

Subscribe to block life-cycle events. `blocks`

### subscribe(to:)

```swift
@MainActor func subscribe(to blocks: [DesignBlockID]) -> AsyncStream<[BlockEvent]>
```

Subscribe to block life-cycle events. `blocks`
