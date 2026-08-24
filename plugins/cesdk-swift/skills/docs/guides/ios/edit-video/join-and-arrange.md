> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Join and Arrange](./join-and-arrange.md)

---

```swift file=@cesdk_swift_examples/engine-guides-join-and-arrange-video/JoinAndArrangeVideo.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func joinAndArrangeVideo(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.setDuration(page, duration: 15)

  let baseURL = try engine.guidesBaseURL
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  let clipA = try await makeVideoClip(engine: engine, name: "Clip A", videoURL: videoURL, width: 1920, height: 1080)
  let clipB = try await makeVideoClip(engine: engine, name: "Clip B", videoURL: videoURL, width: 1920, height: 1080)
  let clipC = try await makeVideoClip(engine: engine, name: "Clip C", videoURL: videoURL, width: 1920, height: 1080)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
  try engine.block.setBool(track, property: "track/automaticallyManageBlockOffsets", value: false)

  try engine.block.appendChild(to: track, child: clipA)
  try engine.block.appendChild(to: track, child: clipB)
  try engine.block.appendChild(to: track, child: clipC)

  try engine.block.fillParent(track)
  let initialOrder = try engine.block.getChildren(track)
  assert(initialOrder == [clipA, clipB, clipC])

  try engine.block.setDuration(clipA, duration: 5)
  try engine.block.setDuration(clipB, duration: 5)
  try engine.block.setDuration(clipC, duration: 5)
  try engine.block.setDuration(track, duration: 15)

  try engine.block.setTimeOffset(clipA, offset: 0)
  try engine.block.setTimeOffset(clipB, offset: 5)
  try engine.block.setTimeOffset(clipC, offset: 10)

  try engine.block.insertChild(into: track, child: clipC, at: 0)
  try engine.block.setTimeOffset(clipC, offset: 0)
  try engine.block.setTimeOffset(clipA, offset: 5)
  try engine.block.setTimeOffset(clipB, offset: 10)

  let children = try engine.block.getChildren(track)
  for (index, clip) in children.enumerated() {
    let name = try engine.block.getName(clip)
    let offset = try engine.block.getTimeOffset(clip)
    let duration = try engine.block.getDuration(clip)
    print("Position \(index): \(name) at \(offset)s for \(duration)s")
  }
  let finalNames = try children.map { try engine.block.getName($0) }
  let finalOffsets = try children.map { try engine.block.getTimeOffset($0) }
  assert(finalNames == ["Clip C", "Clip A", "Clip B"])
  assert(finalOffsets == [0, 5, 10])

  let overlayTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: overlayTrack)
  try engine.block.setTimeOffset(overlayTrack, offset: 2)

  let overlayClip = try await makeVideoClip(
    engine: engine,
    name: "Overlay Clip",
    videoURL: videoURL,
    width: 1920 / 4,
    height: 1080 / 4,
  )
  try engine.block.setDuration(overlayClip, duration: 5)
  try engine.block.appendChild(to: overlayTrack, child: overlayClip)
  try engine.block.setPositionX(overlayClip, value: 1920 - 1920 / 4 - 40)
  try engine.block.setPositionY(overlayClip, value: 1080 - 1080 / 4 - 40)
}

@MainActor
private func makeVideoClip(
  engine: Engine,
  name: String,
  videoURL: URL,
  width: Float,
  height: Float,
) async throws -> DesignBlockID {
  let clip = try engine.block.create(.graphic)
  try engine.block.setName(clip, name: name)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(clip, value: width)
  try engine.block.setHeight(clip, value: height)

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(clip, fill: videoFill)
  try engine.block.setContentFillMode(clip, mode: .cover)
  try await engine.block.forceLoadAVResource(videoFill)

  return clip
}

```

Combine multiple video clips into a sequence and organize them in the composition using CE.SDK tracks, durations, and time offsets.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260824/engine-guides-join-and-arrange-video)

<EngineReferenceNote {...props} />

Video compositions in CE.SDK use a **Scene → Page → Track → Clip** hierarchy. Tracks group clips for timed playback. This guide sets clip durations and time offsets explicitly so each underlying API is visible; in most apps the default automatic mode covered in [Creating Tracks](./join-and-arrange.md#creating-tracks) handles sequencing for you.

A clip is a graphic block with a video fill, so the same APIs that position, resize, or transform any other block apply to video. The example below builds a three-clip montage, reorders it, and adds an overlay track for a picture-in-picture composition.

## Joining Clips via UI

CE.SDK's video editor includes timeline controls for arranging clips. On iOS, the [Video Editor Starter Kit](../starterkits/video-editor.md) ships an interactive timeline UI you can start from. Use the Engine API sections below when you need to prepare scenes programmatically.

### Adding Clips to Timeline

Users add clips from the asset library to the timeline. Adding a clip to an existing track joins it to that sequence; adding it to an empty area creates a separate track.

The timeline displays clip duration visually, so longer clips take more horizontal space and the sequence is easy to scan.

### Reordering Clips

Users can drag clips within a track to reorder them. The timeline updates the sequence and its time offsets so clips remain packed without gaps.

### Creating Additional Tracks

Additional tracks create layered compositions. Tracks later in the page's child order render on top, which enables overlays, titles, and picture-in-picture layouts.

## Programmatic Clip Joining

### Creating the Scene

Create a video scene, add a page, set a 16:9 frame, and make the page long enough for three 5-second clips.

```swift highlight-joinAndArrange-create-scene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1920)
try engine.block.setHeight(page, value: 1080)
try engine.block.setDuration(page, duration: 15)
```

### Creating Video Clips

Each clip is built by composing a graphic block, a rectangle shape, and a video fill. The `makeVideoClip` helper defined in [Clip Helper](./join-and-arrange.md#clip-helper) below centralizes that construction and loads the video resource before returning the clip.

```swift highlight-joinAndArrange-create-clips
let clipA = try await makeVideoClip(engine: engine, name: "Clip A", videoURL: videoURL, width: 1920, height: 1080)
let clipB = try await makeVideoClip(engine: engine, name: "Clip B", videoURL: videoURL, width: 1920, height: 1080)
let clipC = try await makeVideoClip(engine: engine, name: "Clip C", videoURL: videoURL, width: 1920, height: 1080)
```

### Clip Helper

```swift highlight-joinAndArrange-clip-helper
@MainActor
private func makeVideoClip(
  engine: Engine,
  name: String,
  videoURL: URL,
  width: Float,
  height: Float,
) async throws -> DesignBlockID {
  let clip = try engine.block.create(.graphic)
  try engine.block.setName(clip, name: name)
  try engine.block.setShape(clip, shape: engine.block.createShape(.rect))
  try engine.block.setWidth(clip, value: width)
  try engine.block.setHeight(clip, value: height)

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(clip, fill: videoFill)
  try engine.block.setContentFillMode(clip, mode: .cover)
  try await engine.block.forceLoadAVResource(videoFill)

  return clip
}
```

`forceLoadAVResource(_:)` ensures the video metadata is available before downstream calls such as duration, thumbnails, or trim read from it.

### Creating Tracks

Create a track and attach it to the page. The example also turns off automatic offset management on this track so it can demonstrate explicit `setTimeOffset(_:offset:)` calls in the next sections. In most apps, leaving the default automatic mode on is preferred — tracks then pack their children sequentially from the order they were appended.

```swift highlight-joinAndArrange-create-track
let track = try engine.block.create(.track)
try engine.block.appendChild(to: page, child: track)
try engine.block.setBool(track, property: "track/automaticallyManageBlockOffsets", value: false)
```

### Adding Clips to Track

Append the clips to the track so they share a timeline container. `fillParent(_:)` on a track first resizes each child clip to fill the page frame, then resizes the track itself to match. Without it, the track inherits its dimensions from the children's intrinsic sizes — which happens to be 1920×1080 here, but calling `fillParent(_:)` keeps the track aligned with the page regardless of how individual clips were sized. The overlay track in [Multi-Track Compositions](./join-and-arrange.md#multi-track-compositions) skips this call because the overlay clip is intentionally smaller than the page.

```swift highlight-joinAndArrange-add-clips-to-track
  try engine.block.appendChild(to: track, child: clipA)
  try engine.block.appendChild(to: track, child: clipB)
  try engine.block.appendChild(to: track, child: clipC)

  try engine.block.fillParent(track)
```

### Setting Clip Durations

Set each clip duration in seconds. The track duration covers the full 15-second sequence.

```swift highlight-joinAndArrange-set-clip-durations
try engine.block.setDuration(clipA, duration: 5)
try engine.block.setDuration(clipB, duration: 5)
try engine.block.setDuration(clipC, duration: 5)
try engine.block.setDuration(track, duration: 15)
```

## Arranging Clips

### Time Offsets

Time offsets control when each block becomes active relative to its parent. In a manual sequence, set each child clip's offset to the cumulative duration of the preceding clips.

```swift highlight-joinAndArrange-time-offsets
try engine.block.setTimeOffset(clipA, offset: 0)
try engine.block.setTimeOffset(clipB, offset: 5)
try engine.block.setTimeOffset(clipC, offset: 10)
```

Clip A starts at 0 seconds, Clip B at 5 seconds, and Clip C at 10 seconds. With 5-second durations, this creates a continuous 15-second sequence.

### Reordering Clips

Use `insertChild(into:child:at:)` to move an existing clip to a specific index. The track's child order changes immediately. Update the time offsets after the move so playback follows the new order without gaps.

```swift highlight-joinAndArrange-reorder-clips
try engine.block.insertChild(into: track, child: clipC, at: 0)
try engine.block.setTimeOffset(clipC, offset: 0)
try engine.block.setTimeOffset(clipA, offset: 5)
try engine.block.setTimeOffset(clipB, offset: 10)
```

Moving Clip C to index 0 changes the order from A → B → C to C → A → B. The resulting offsets are C at 0 seconds, A at 5 seconds, and B at 10 seconds.

### Querying Track Children

`getChildren(_:)` returns clip IDs in playback order. Combine it with `getName(_:)`, `getTimeOffset(_:)`, and `getDuration(_:)` to render a custom timeline view or to serialize the current arrangement to disk.

```swift highlight-joinAndArrange-query-track-children
let children = try engine.block.getChildren(track)
for (index, clip) in children.enumerated() {
  let name = try engine.block.getName(clip)
  let offset = try engine.block.getTimeOffset(clip)
  let duration = try engine.block.getDuration(clip)
  print("Position \(index): \(name) at \(offset)s for \(duration)s")
}
```

## Multi-Track Compositions

### Adding Multiple Tracks

Create layered compositions by adding more tracks to the page. This example adds an overlay track that starts at 2 seconds and contains a smaller clip in the bottom-right corner.

```swift highlight-joinAndArrange-multi-track
  let overlayTrack = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: overlayTrack)
  try engine.block.setTimeOffset(overlayTrack, offset: 2)

  let overlayClip = try await makeVideoClip(
    engine: engine,
    name: "Overlay Clip",
    videoURL: videoURL,
    width: 1920 / 4,
    height: 1080 / 4,
  )
  try engine.block.setDuration(overlayClip, duration: 5)
  try engine.block.appendChild(to: overlayTrack, child: overlayClip)
  try engine.block.setPositionX(overlayClip, value: 1920 - 1920 / 4 - 40)
  try engine.block.setPositionY(overlayClip, value: 1080 - 1080 / 4 - 40)
```

### Track Rendering Order

CE.SDK renders page children in order. The first track appears behind later tracks, so add background video first and overlays or titles later.

- **Background layers**: Full-frame clips on the first track.
- **Overlays**: Smaller clips positioned on later tracks.
- **Titles**: Text or graphics added above the video tracks.

## Troubleshooting

### Clips Not Appearing

Verify that every clip is attached to a track and that the track is attached to the page. `engine.block.getParent(_:)` and `engine.block.getChildren(_:)` are the quickest checks for hierarchy issues.

### Wrong Playback Order

Check the track child order first. Default tracks automatically pack child offsets from that order and each clip's duration. When you manage timing manually, disable `track/automaticallyManageBlockOffsets` and write the offsets with `setTimeOffset(_:offset:)`. CE.SDK still prevents overlaps inside a single track; use separate tracks for overlapping or layered clips.

### Video Not Loading

Check that the video URL is reachable and uses a supported format. Call `engine.block.forceLoadAVResource(_:)` on the video fill before you depend on media metadata such as duration or thumbnails.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.createVideo()` | Create a scene configured for video playback. |
| `engine.block.create(.page)` | Create the page that holds the video composition. |
| `engine.block.create(.track)` | Create a track for sequential or layered clips. |
| `engine.block.create(.graphic)` | Create the graphic block used as a video clip. |
| `engine.block.createFill(.video)` | Create the video fill attached to a clip block. |
| `engine.block.appendChild(to:child:)` | Add a clip to a track or a track to a page hierarchy. |
| `engine.block.insertChild(into:child:at:)` | Move or insert a child at a specific rendering-order index. |
| `engine.block.getChildren(_:)` | Read child blocks in rendering order. |
| `engine.block.setDuration(_:duration:)` | Set a page, track, or clip duration in seconds. |
| `engine.block.getDuration(_:)` | Read a block's duration in seconds. |
| `engine.block.setTimeOffset(_:offset:)` | Set when a block starts relative to its parent. |
| `engine.block.getTimeOffset(_:)` | Read a block's time offset in seconds. |
| `engine.block.setBool(_:property:value:)` | Set the `track/automaticallyManageBlockOffsets` flag to switch a track between automatic and manual child offset management. |
| `engine.block.forceLoadAVResource(_:)` | Load audio or video metadata for a video fill or audio block. |
| `engine.block.fillParent(_:)` | Resize and position a block to fill its parent frame; when the block is a group or track, child blocks are filled against the enclosing frame first. |

## Next Steps

- [Trim Video Clips](./trim.md) — Control which portion of media plays back
- [Control Audio and Video](../create-video/control.md) — Master playback timing and audio mixing.
- [Timeline Editor](../create-video/timeline-editor.md) — Understand the complete timeline editing system.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support