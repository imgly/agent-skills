> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Annotation](./annotation.md)

---

```swift file=@cesdk_swift_examples/engine-guides-annotation/Annotation.swift reference-only
import IMGLYEngine

@MainActor
func annotation(engine: Engine) async throws {
  // Resolve the sample video against the engine's base URL. In an app you would
  // point this at your own media URL. This line is example scaffolding, not part
  // of the annotation lesson, so it stays outside the highlighted snippets.
  let baseURL = try engine.guidesBaseURL
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  let page = try createAnnotationScene(engine: engine, videoURL: videoURL)
  let text = try addTextAnnotation(engine: engine, page: page)
  let highlight = try addShapeAnnotation(engine: engine, page: page)
  let annotations = [text, highlight]

  let sync = AnnotationTimelineSync(engine: engine, page: page)
  sync.refresh(annotations)
  try seekToAnnotation(engine: engine, page: page, annotation: highlight)

  _ = try setAnnotationPlayback(engine: engine, page: page, playing: true, looping: true)
  try updateAnnotationText(engine: engine, annotation: text, text: "Replay this part")
  try moveAnnotation(engine: engine, annotation: highlight, x: 780, y: 260)
  try updateAnnotationTiming(engine: engine, annotation: highlight, start: 13.0, duration: 3.0)
  try removeAnnotation(engine: engine, annotation: text)
}

@MainActor
private func createAnnotationScene(engine: Engine, videoURL: URL) throws -> DesignBlockID {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 20)

  let video = try engine.block.create(.graphic)
  try engine.block.setShape(video, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(video, fill: videoFill)

  let videoTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: videoTrack)
  try engine.block.appendChild(to: videoTrack, child: video)
  try engine.block.fillParent(videoTrack)

  return page
}

@MainActor
private func addTextAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let text = try engine.block.create(.text)
  try engine.block.replaceText(text, text: "Watch this part!")
  try engine.block.setTextFontSize(text, fontSize: 32)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.setPositionX(text, value: 160)
  try engine.block.setPositionY(text, value: 560)

  try engine.block.setTimeOffset(text, offset: 5)
  try engine.block.setDuration(text, duration: 5)

  try engine.block.appendChild(to: page, child: text)
  return text
}

@MainActor
private func addShapeAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let highlight = try engine.block.create(.graphic)
  try engine.block.setShape(highlight, shape: engine.block.createShape(.star))
  try engine.block.setWidth(highlight, value: 140)
  try engine.block.setHeight(highlight, value: 140)
  try engine.block.setPositionX(highlight, value: 700)
  try engine.block.setPositionY(highlight, value: 240)

  let fill = try engine.block.createFill(.color)
  try engine.block.setFill(highlight, fill: fill)
  try engine.block.setFillSolidColor(highlight, r: 1, g: 0, b: 0, a: 1)

  try engine.block.setTimeOffset(highlight, offset: 12)
  try engine.block.setDuration(highlight, duration: 4)

  try engine.block.appendChild(to: page, child: highlight)
  return highlight
}

private struct AnnotationTimelineState {
  var currentTime: Double
  var activeAnnotation: DesignBlockID?
}

@MainActor
private final class AnnotationTimelineSync {
  private let engine: Engine
  private let page: DesignBlockID
  private(set) var state = AnnotationTimelineState(currentTime: 0, activeAnnotation: nil)
  private var pollingTask: Task<Void, Never>?

  init(engine: Engine, page: DesignBlockID) {
    self.engine = engine
    self.page = page
  }

  // Call this from UI code that owns a lifecycle. It polls at a modest interval
  // so the UI stays responsive.
  func start(_ annotations: [DesignBlockID]) {
    pollingTask?.cancel()
    pollingTask = Task { [weak self] in
      while !Task.isCancelled {
        self?.refresh(annotations)
        try? await Task.sleep(nanoseconds: 200_000_000) // ~5 Hz
      }
    }
  }

  func refresh(_ annotations: [DesignBlockID]) {
    let currentTime = (try? engine.block.getPlaybackTime(page)) ?? 0
    let active = annotations.first { annotation in
      guard engine.block.isValid(annotation) else { return false }
      return (try? engine.block.isVisibleAtCurrentPlaybackTime(annotation)) == true
    }
    state = AnnotationTimelineState(currentTime: currentTime, activeAnnotation: active)
  }

  func stop() {
    pollingTask?.cancel()
    pollingTask = nil
  }
}

@MainActor
private func seekToAnnotation(engine: Engine, page: DesignBlockID, annotation: DesignBlockID) throws {
  guard try engine.block.supportsPlaybackTime(page) else { return }

  let start = try engine.block.getTimeOffset(annotation)
  try engine.block.setPlaybackTime(page, time: start)
}

@MainActor
private func setAnnotationPlayback(
  engine: Engine,
  page: DesignBlockID,
  playing: Bool,
  looping: Bool,
) throws -> (isPlaying: Bool, isLooping: Bool) {
  try engine.block.setPlaying(page, enabled: playing)
  let isPlaying = try engine.block.isPlaying(page)

  try engine.block.setLooping(page, looping: looping)
  let isLooping = try engine.block.isLooping(page)

  return (isPlaying, isLooping)
}

@MainActor
private func updateAnnotationText(engine: Engine, annotation: DesignBlockID, text: String) throws {
  try engine.block.replaceText(annotation, text: text)
}

@MainActor
private func moveAnnotation(engine: Engine, annotation: DesignBlockID, x: Float, y: Float) throws {
  try engine.block.setPositionX(annotation, value: x)
  try engine.block.setPositionY(annotation, value: y)
}

@MainActor
private func updateAnnotationTiming(
  engine: Engine,
  annotation: DesignBlockID,
  start: Double,
  duration: Double,
) throws {
  try engine.block.setTimeOffset(annotation, offset: start)
  try engine.block.setDuration(annotation, duration: duration)
}

@MainActor
private func removeAnnotation(engine: Engine, annotation: DesignBlockID) throws {
  try engine.block.destroy(annotation)
}

```

Annotations are timed visual overlays such as text labels, shapes, highlights, stickers, or images. In CE.SDK they are ordinary blocks placed above video content and made visible for a specific timeline range.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-annotation)

<EngineReferenceNote {...props} />

## When to Use Annotations

Use annotations for tutorials, sports analysis, education, product demos, and other video workflows where viewers should notice a specific moment. Use captions instead when the content is synchronized spoken text.

Annotations use the same Block API as other visual content. Timing is controlled in seconds with `setTimeOffset(_:offset:)` and `setDuration(_:duration:)`, and playback sync reads the page's current playback time.

## Annotation Blocks and Timeline Placement

For a standalone video scene, create a video page with explicit dimensions and duration, add the media to a track, and append annotation blocks to the page after the media. Page children added later render above earlier content.

```swift highlight-annotation-timelinePlacement
@MainActor
private func createAnnotationScene(engine: Engine, videoURL: URL) throws -> DesignBlockID {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 20)

  let video = try engine.block.create(.graphic)
  try engine.block.setShape(video, shape: engine.block.createShape(.rect))
  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(video, fill: videoFill)

  let videoTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: videoTrack)
  try engine.block.appendChild(to: videoTrack, child: video)
  try engine.block.fillParent(videoTrack)

  return page
}
```

## Add a Text Annotation

A text annotation is a `.text` block. Position it like any other text block, then set the timeline range before appending it to the page.

```swift highlight-annotation-textAnnotation
@MainActor
private func addTextAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let text = try engine.block.create(.text)
  try engine.block.replaceText(text, text: "Watch this part!")
  try engine.block.setTextFontSize(text, fontSize: 32)
  try engine.block.setWidthMode(text, mode: .auto)
  try engine.block.setHeightMode(text, mode: .auto)
  try engine.block.setPositionX(text, value: 160)
  try engine.block.setPositionY(text, value: 560)

  try engine.block.setTimeOffset(text, offset: 5)
  try engine.block.setDuration(text, duration: 5)

  try engine.block.appendChild(to: page, child: text)
  return text
}
```

The example starts at `5.0` seconds and lasts `5.0` seconds, so it is visible from 5s to 10s on the page timeline.

## Add a Shape Annotation

A shape annotation uses a graphic block with a vector shape and fill. This example creates a red star that appears after the text annotation.

```swift highlight-annotation-shapeAnnotation
@MainActor
private func addShapeAnnotation(engine: Engine, page: DesignBlockID) throws -> DesignBlockID {
  let highlight = try engine.block.create(.graphic)
  try engine.block.setShape(highlight, shape: engine.block.createShape(.star))
  try engine.block.setWidth(highlight, value: 140)
  try engine.block.setHeight(highlight, value: 140)
  try engine.block.setPositionX(highlight, value: 700)
  try engine.block.setPositionY(highlight, value: 240)

  let fill = try engine.block.createFill(.color)
  try engine.block.setFill(highlight, fill: fill)
  try engine.block.setFillSolidColor(highlight, r: 1, g: 0, b: 0, a: 1)

  try engine.block.setTimeOffset(highlight, offset: 12)
  try engine.block.setDuration(highlight, duration: 4)

  try engine.block.appendChild(to: page, child: highlight)
  return highlight
}
```

Any visual block can serve as an annotation. Use text for labels, graphics for highlights, and image or sticker blocks for branded markers.

## Synchronize Annotation UI with Playback

Custom UI can poll the page playback time and mark whichever annotation is visible at that moment. Keep the polling interval modest, for example 100-200 ms, so the UI stays responsive.

```swift highlight-annotation-playbackSync
private struct AnnotationTimelineState {
  var currentTime: Double
  var activeAnnotation: DesignBlockID?
}

@MainActor
private final class AnnotationTimelineSync {
  private let engine: Engine
  private let page: DesignBlockID
  private(set) var state = AnnotationTimelineState(currentTime: 0, activeAnnotation: nil)
  private var pollingTask: Task<Void, Never>?

  init(engine: Engine, page: DesignBlockID) {
    self.engine = engine
    self.page = page
  }

  // Call this from UI code that owns a lifecycle. It polls at a modest interval
  // so the UI stays responsive.
  func start(_ annotations: [DesignBlockID]) {
    pollingTask?.cancel()
    pollingTask = Task { [weak self] in
      while !Task.isCancelled {
        self?.refresh(annotations)
        try? await Task.sleep(nanoseconds: 200_000_000) // ~5 Hz
      }
    }
  }

  func refresh(_ annotations: [DesignBlockID]) {
    let currentTime = (try? engine.block.getPlaybackTime(page)) ?? 0
    let active = annotations.first { annotation in
      guard engine.block.isValid(annotation) else { return false }
      return (try? engine.block.isVisibleAtCurrentPlaybackTime(annotation)) == true
    }
    state = AnnotationTimelineState(currentTime: currentTime, activeAnnotation: active)
  }

  func stop() {
    pollingTask?.cancel()
    pollingTask = nil
  }
}
```

`refresh(_:)` performs a single tick — read it once after seeking or on demand. `start(_:)` runs the polling loop until you call `stop()`; call it from UI code that owns the lifecycle.

> **Note:** * Engine calls must stay on the main thread. `AnnotationTimelineSync` is annotated `@MainActor` so its polling task inherits the main actor.
> * Store the active annotation ID in UI state and render your own list, marker, or toolbar state from that value.

## Seek to an Annotation

Seek on the page, not on the annotation block itself. Read the annotation start with `getTimeOffset(_:)`, then set the page playback time.

```swift highlight-annotation-seek
@MainActor
private func seekToAnnotation(engine: Engine, page: DesignBlockID, annotation: DesignBlockID) throws {
  guard try engine.block.supportsPlaybackTime(page) else { return }

  let start = try engine.block.getTimeOffset(annotation)
  try engine.block.setPlaybackTime(page, time: start)
}
```

## Controlling Playback (Play/Pause, Loop)

Use page playback controls as supporting APIs for preview UI. For broader audio and video playback controls, see [Control Audio and Video](../create-video/control.md).

```swift highlight-annotation-playbackControls
@MainActor
private func setAnnotationPlayback(
  engine: Engine,
  page: DesignBlockID,
  playing: Bool,
  looping: Bool,
) throws -> (isPlaying: Bool, isLooping: Bool) {
  try engine.block.setPlaying(page, enabled: playing)
  let isPlaying = try engine.block.isPlaying(page)

  try engine.block.setLooping(page, looping: looping)
  let isLooping = try engine.block.isLooping(page)

  return (isPlaying, isLooping)
}
```

## Edit and Remove Annotations

Text, position, timing, and deletion use the same block APIs after an annotation exists. Keep these operations focused so your UI can call them from list actions or inspector controls.

```swift highlight-annotation-editText
@MainActor
private func updateAnnotationText(engine: Engine, annotation: DesignBlockID, text: String) throws {
  try engine.block.replaceText(annotation, text: text)
}
```

```swift highlight-annotation-move
@MainActor
private func moveAnnotation(engine: Engine, annotation: DesignBlockID, x: Float, y: Float) throws {
  try engine.block.setPositionX(annotation, value: x)
  try engine.block.setPositionY(annotation, value: y)
}
```

```swift highlight-annotation-retime
@MainActor
private func updateAnnotationTiming(
  engine: Engine,
  annotation: DesignBlockID,
  start: Double,
  duration: Double,
) throws {
  try engine.block.setTimeOffset(annotation, offset: start)
  try engine.block.setDuration(annotation, duration: duration)
}
```

```swift highlight-annotation-remove
@MainActor
private func removeAnnotation(engine: Engine, annotation: DesignBlockID) throws {
  try engine.block.destroy(annotation)
}
```

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.scene.createVideo()` | Create a video scene that supports timeline playback. |
| `engine.block.create(_:)` | Create text, graphic, page, and track blocks. |
| `engine.block.setWidth(_:value:)` / `engine.block.setHeight(_:value:)` | Size pages and visual annotation blocks. |
| `engine.block.setWidthMode(_:mode:)` / `engine.block.setHeightMode(_:mode:)` | Auto-size text annotations to their content. |
| `engine.block.replaceText(_:text:)` | Set or update text annotation content. |
| `engine.block.setTextFontSize(_:fontSize:)` | Set text annotation size. |
| `engine.block.createShape(_:)` / `engine.block.setShape(_:shape:)` | Create a shape annotation. |
| `engine.block.createFill(_:)` / `engine.block.setFill(_:fill:)` / `engine.block.setFillSolidColor(_:r:g:b:a:)` | Style graphic annotations. |
| `engine.block.setURL(_:property:value:)` | Attach video media to a video fill. |
| `engine.block.setPositionX(_:value:)` / `engine.block.setPositionY(_:value:)` | Place annotations on the page. |
| `engine.block.setTimeOffset(_:offset:)` / `engine.block.getTimeOffset(_:)` | Set or read the annotation start time in seconds. |
| `engine.block.setDuration(_:duration:)` / `engine.block.getDuration(_:)` | Set or read the annotation duration in seconds. |
| `engine.block.appendChild(to:child:)` | Add annotations to the page hierarchy. |
| `engine.block.fillParent(_:)` | Make a track fill its parent page. |
| `engine.block.isValid(_:)` | Ignore annotations that were removed before a UI refresh. |
| `engine.block.supportsPlaybackTime(_:)` | Check whether a page can be seeked. |
| `engine.block.setPlaybackTime(_:time:)` / `engine.block.getPlaybackTime(_:)` | Seek or read timeline playback time. |
| `engine.block.isVisibleAtCurrentPlaybackTime(_:)` | Determine whether an annotation is active at the current page time. |
| `engine.block.setPlaying(_:enabled:)` / `engine.block.isPlaying(_:)` | Start or query playback. |
| `engine.block.setLooping(_:looping:)` / `engine.block.isLooping(_:)` | Control loop behavior. |
| `engine.block.destroy(_:)` | Remove an annotation. |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `fill/video/fileURI` | URL | Video media source for a video fill. |

## Troubleshooting

- **Annotation does not show up:** append it to the page after the media track, and keep its `timeOffset` plus `duration` inside the page duration.
- **Seek jumps do nothing:** call `setPlaybackTime(_:time:)` on the page block, not on the annotation block.
- **UI feels sluggish:** poll at 5-10 Hz and keep engine calls on the main thread.
- **Export differs from preview:** verify the video scene duration and test very small text or heavy effects in exported MP4 output.

## Next Steps

- [Add Captions](./add-captions.md) - Use caption blocks and tracks for synchronized spoken text.
- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) - Populate labels from dynamic values such as usernames or scores.
- [Control Audio and Video](../create-video/control.md) - Control timeline playback, trim ranges, looping, and resources.
- [Timeline Editor](../create-video/timeline-editor.md) - Build timeline interfaces for arranging clips and overlays.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support