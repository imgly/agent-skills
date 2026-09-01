> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Events](./events.md)

---

```swift file=@cesdk_swift_examples/engine-guides-events/Events.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
// swiftlint:disable:next cyclomatic_complexity
func events(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.star))
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)

  let allEventsTask = Task {
    for await events in engine.event.subscribe(to: []) {
      for event in events {
        print("Event: \(event.type) for block \(event.block)")
      }
    }
  }

  let specificTask = Task {
    for await events in engine.event.subscribe(to: [block]) {
      for event in events {
        print("Specific event: \(event.type) for block \(event.block)")
      }
    }
  }

  try await Task.sleep(nanoseconds: NSEC_PER_SEC)

  let processTask = Task {
    for await events in engine.event.subscribe(to: []) {
      for event in events {
        switch event.type {
        case .created:
          let type = try engine.block.getType(event.block)
          print("Block created: \(type)")
        case .updated:
          let type = try engine.block.getType(event.block)
          print("Block updated: \(type)")
        case .destroyed:
          print("Block destroyed: \(event.block)")
        @unknown default:
          break
        }
      }
    }
  }

  try await Task.sleep(nanoseconds: NSEC_PER_SEC)

  try engine.block.setRotation(block, radians: 0.5 * .pi)

  try await Task.sleep(nanoseconds: NSEC_PER_SEC)

  if engine.block.isValid(block) {
    let type = try engine.block.getType(block)
    print("Block is valid: \(type)")
  }

  try engine.block.destroy(block)

  try await Task.sleep(nanoseconds: NSEC_PER_SEC)

  allEventsTask.cancel()
  specificTask.cancel()
  processTask.cancel()
}
```

Monitor and react to block changes in real time by subscribing to creation,
update, and destruction events in your CE.SDK scene.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260901/engine-guides-events)

Events enable real-time monitoring of block changes in CE.SDK. When blocks are created, modified, or destroyed, the engine delivers these changes through subscriptions at the end of each update cycle. In Swift, the event API uses `AsyncStream` for seamless integration with Swift concurrency.

This guide covers subscribing to block lifecycle events, processing the three event types (`.created`, `.updated`, `.destroyed`), filtering events to specific blocks, and properly cleaning up subscriptions.

## Setup

Create a scene with a graphic block to observe events on:

```swift highlight-events-setup
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.star))
  try engine.block.setFill(block, fill: engine.block.createFill(.color))
  try engine.block.appendChild(to: page, child: block)
```

## Event Types

CE.SDK provides three event types that capture the block lifecycle:

| Type | Description |
|------|-------------|
| `.created` | Fires when a new block is added to the scene |
| `.updated` | Fires when any property of a block changes |
| `.destroyed` | Fires when a block is removed from the scene |

Each `BlockEvent` contains a `block` property with the block ID and a `type` property indicating which event occurred.

## Subscribing to All Blocks

Use `engine.event.subscribe(to:)` to receive an `AsyncStream` of batched events. Pass an empty array to receive events from all blocks in the scene:

```swift highlight-events-subscribeAll
let allEventsTask = Task {
  for await events in engine.event.subscribe(to: []) {
    for event in events {
      print("Event: \(event.type) for block \(event.block)")
    }
  }
}
```

Iterate the stream inside a `Task`. The stream emits arrays of `BlockEvent` at the end of each engine update cycle.

## Subscribing to Specific Blocks

For better performance when you only care about certain blocks, pass an array of block IDs to filter events:

```swift highlight-events-subscribeSpecific
let specificTask = Task {
  for await events in engine.event.subscribe(to: [block]) {
    for event in events {
      print("Specific event: \(event.type) for block \(event.block)")
    }
  }
}
```

This reduces overhead since the engine only prepares events for the blocks you're tracking.

### API Reference

```swift
public func subscribe(to blocks: [DesignBlockID]) -> AsyncStream<[BlockEvent]>
```

Subscribe to block life-cycle events.

- `blocks:`: A list of blocks to filter events by. If the list is empty, events for every block are sent.
- Returns: A stream of events. Events are bundled and sent at the end of each engine update.

## Processing Events by Type

Handle each event type by switching on the `type` property. For `.created` and `.updated` events, you can safely use Block API methods. For `.destroyed` events, the block ID is no longer valid:

```swift highlight-events-processEvents
let processTask = Task {
  for await events in engine.event.subscribe(to: []) {
    for event in events {
      switch event.type {
      case .created:
        let type = try engine.block.getType(event.block)
        print("Block created: \(type)")
      case .updated:
        let type = try engine.block.getType(event.block)
        print("Block updated: \(type)")
      case .destroyed:
        print("Block destroyed: \(event.block)")
      @unknown default:
        break
      }
    }
  }
}
```

## Triggering Events

Modifying any property of a block triggers an `.updated` event. Due to deduplication, you receive at most one `.updated` event per block per engine update cycle, regardless of how many properties changed:

```swift highlight-events-updated
try engine.block.setRotation(block, radians: 0.5 * .pi)
```

Destroying a block triggers a `.destroyed` event:

```swift highlight-events-destroyed
try engine.block.destroy(block)
```

## Handling Destroyed Blocks Safely

When a block is destroyed, its ID becomes invalid. Calling Block API methods on a destroyed block throws an error. Always check validity with `engine.block.isValid()` before operations:

```swift highlight-events-destroyedSafety
if engine.block.isValid(block) {
  let type = try engine.block.getType(block)
  print("Block is valid: \(type)")
}
```

## Unsubscribing from Events

In Swift, cancelling the `Task` that iterates the `AsyncStream` automatically unsubscribes from events. Cancel tasks when you no longer need to track changes:

```swift highlight-events-unsubscribe
allEventsTask.cancel()
specificTask.cancel()
processTask.cancel()
```

Always cancel subscription tasks when your view disappears or you no longer need to track changes. Keeping unnecessary subscriptions active forces the engine to prepare event lists at every update.

> **Tip:** CE.SDK also provides a Combine-based `engine.event.publisher(blocks:)` method as an alternative to `AsyncStream` for Combine-based architectures.

## Event Batching and Deduplication

Events are collected during an engine update and delivered together at the end. The engine deduplicates events, so you receive at most one `.updated` event per block per update cycle. Event order in the stream does not reflect the actual order of changes within the update.

This batching behavior means:

- Multiple property changes to a single block result in one `.updated` event
- You cannot determine which specific property changed from the event alone
- If you need to track specific property changes, compare against cached values

## Next Steps

- [Blocks](./blocks.md) — Learn about block types, properties, and lifecycle.
- [Undo and History](./undo-and-history.md) — Implement undo/redo functionality.
- [Scenes](./scenes.md) — Understand scene structure and management.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support