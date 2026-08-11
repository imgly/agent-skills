> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Split](./split.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-video-split/Split.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func split(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 60)

  let baseURL = try engine.guidesBaseURL

  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  func makeVideoBlock() async throws -> DesignBlockID {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: videoURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try await engine.block.forceLoadAVResource(fill)
    try engine.block.setDuration(block, duration: 10)
    return block
  }

  let basicVideo = try await makeVideoBlock()
  let newBlock = try engine.block.split(basicVideo, atTime: 5.0)
  _ = newBlock

  let optionsVideo = try await makeVideoBlock()
  let optionsNewBlock = try engine.block.split(
    optionsVideo,
    atTime: 4.0,
    options: SplitOptions(
      attachToParent: true,
      createParentTrackIfNeeded: false,
      selectNewBlock: false,
    ),
  )
  _ = optionsNewBlock

  let playheadVideo = try await makeVideoBlock()
  // In a real app the user moves the playhead via the timeline UI;
  // here we position it programmatically so the demo has a known split point.
  try engine.block.setPlaybackTime(page, time: 3.0)
  let playheadTime = try engine.block.getPlaybackTime(page)
  let clipStartTime = try engine.block.getTimeOffset(playheadVideo)
  let splitTime = playheadTime - clipStartTime
  let playheadNewBlock = try engine.block.split(playheadVideo, atTime: splitTime)
  _ = playheadNewBlock

  let resultsVideo = try await makeVideoBlock()
  let resultsFill = try engine.block.getFill(resultsVideo)
  let originalTrimOffset = try engine.block.getTrimOffset(resultsFill)
  let originalTrimLength = try engine.block.getTrimLength(resultsFill)
  let resultsNewBlock = try engine.block.split(resultsVideo, atTime: 6.0)
  let resultsNewFill = try engine.block.getFill(resultsNewBlock)
  let originalAfterOffset = try engine.block.getTrimOffset(resultsFill)
  let originalAfterLength = try engine.block.getTrimLength(resultsFill)
  let newBlockTrimOffset = try engine.block.getTrimOffset(resultsNewFill)
  let newBlockTrimLength = try engine.block.getTrimLength(resultsNewFill)
  _ = (originalTrimOffset, originalTrimLength, originalAfterOffset, originalAfterLength)
  _ = (newBlockTrimOffset, newBlockTrimLength)

  let deleteVideo = try await makeVideoBlock()
  // Split at the start of the section to remove.
  let middleBlock = try engine.block.split(deleteVideo, atTime: 2.0)
  // Split again 3 seconds into middleBlock to mark the end of the section.
  let endBlock = try engine.block.split(middleBlock, atTime: 3.0)
  try engine.block.destroy(middleBlock)
  _ = endBlock

  let validateVideo = try await makeVideoBlock()
  try engine.block.setDuration(validateVideo, duration: 8.0)
  let blockDuration = try engine.block.getDuration(validateVideo)
  let desiredSplitTime = 4.0
  var validatedNewBlock: DesignBlockID?
  if try engine.block.supportsTrim(validateVideo),
     desiredSplitTime > 0,
     desiredSplitTime < blockDuration {
    validatedNewBlock = try engine.block.split(validateVideo, atTime: desiredSplitTime)
  }
  _ = validatedNewBlock
}
```

Split video and audio clips at specific time points using CE.SDK's Engine API
for Swift to create independent segments from a single clip.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260811/engine-guides-create-video-split)

Clip splitting divides one block into two at a specified time. The original block ends at the split point; a new block starts there. Both blocks reference the same source media with independent timing. This differs from trimming, which adjusts a single block's playback range without creating new blocks.

This guide covers how to split clips programmatically using the Engine API, configure split options, calculate split positions from the playhead, and implement a split-and-delete workflow for removing middle sections.

## Setting Up the Scene

Create a video scene, add a page, and give the page a fixed size and total duration so the split demos below have a stable timeline.

```swift highlight-setupScene
let scene = try engine.scene.createVideo()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
try engine.block.setWidth(page, value: 1280)
try engine.block.setHeight(page, value: 720)
try engine.block.setDuration(page, duration: 60)
```

## Creating a Video Block

Each section below splits a fresh 10-second video block. The `makeVideoBlock` helper creates a `.graphic` block with a rectangular shape and a video fill, appends it to the page, and assigns a 10-second timeline duration. The helper awaits `forceLoadAVResource(_:)` before returning—loading the media is mandatory because trim properties and `split(_:atTime:)` rely on the underlying clip's duration metadata.

```swift highlight-makeVideoBlock
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  func makeVideoBlock() async throws -> DesignBlockID {
    let block = try engine.block.create(.graphic)
    try engine.block.setShape(block, shape: engine.block.createShape(.rect))
    let fill = try engine.block.createFill(.video)
    try engine.block.setURL(fill, property: "fill/video/fileURI", value: videoURL)
    try engine.block.setFill(block, fill: fill)
    try engine.block.appendChild(to: page, child: block)
    try await engine.block.forceLoadAVResource(fill)
    try engine.block.setDuration(block, duration: 10)
    return block
  }
```

## Programmatic Splitting

For applications that need to split clips programmatically—whether for automation, batch processing, or dynamic editing—CE.SDK provides the `engine.block.split(_:atTime:options:)` method.

### Basic Splitting at a Specific Time

Split a block by providing the block ID and the split time in seconds. The time parameter is relative to the block's own timeline, accounting for the block's time offset.

```swift highlight-basic-split
let basicVideo = try await makeVideoBlock()
let newBlock = try engine.block.split(basicVideo, atTime: 5.0)
```

The `split(_:atTime:)` method returns the ID of the newly created block. The original block becomes the first segment (before the split point), and the returned block is the second segment (after the split point).

### Configuring Split Options

The `SplitOptions` struct controls split behavior with three optional parameters:

- **`attachToParent`** (default: `true`): Whether to attach the new block to the same parent as the original.
- **`createParentTrackIfNeeded`** (default: `false`): Creates a parent track if needed and adds both blocks to it. Only applied when `attachToParent` is `true`.
- **`selectNewBlock`** (default: `true`): Whether to select the newly created block after splitting.

```swift highlight-split-options
let optionsVideo = try await makeVideoBlock()
let optionsNewBlock = try engine.block.split(
  optionsVideo,
  atTime: 4.0,
  options: SplitOptions(
    attachToParent: true,
    createParentTrackIfNeeded: false,
    selectNewBlock: false,
  ),
)
```

Use `selectNewBlock: false` when splitting multiple clips programmatically to avoid changing selection state between operations.

### Splitting at the Current Playhead Position

To implement playhead-based splitting like the built-in UI, get the current playback time from the page and convert it to block-relative time.

```swift highlight-split-at-playhead
let playheadVideo = try await makeVideoBlock()
// In a real app the user moves the playhead via the timeline UI;
// here we position it programmatically so the demo has a known split point.
try engine.block.setPlaybackTime(page, time: 3.0)
let playheadTime = try engine.block.getPlaybackTime(page)
let clipStartTime = try engine.block.getTimeOffset(playheadVideo)
let splitTime = playheadTime - clipStartTime
let playheadNewBlock = try engine.block.split(playheadVideo, atTime: splitTime)
```

The playhead position from `getPlaybackTime(_:)` on the page is in absolute timeline seconds. Subtract the clip's `getTimeOffset(_:)` to convert to block-relative time before passing it to `split(_:atTime:)`.

## Understanding Split Results

After a split operation, both the original and new blocks are configured with updated trim properties.

### Trim Properties After Split

Trim values are queried on the block's **fill**, not on the block itself. Use `getFill(_:)` to obtain the fill ID, then call `getTrimOffset(_:)` and `getTrimLength(_:)`.

```swift highlight-split-results
let resultsVideo = try await makeVideoBlock()
let resultsFill = try engine.block.getFill(resultsVideo)
let originalTrimOffset = try engine.block.getTrimOffset(resultsFill)
let originalTrimLength = try engine.block.getTrimLength(resultsFill)
let resultsNewBlock = try engine.block.split(resultsVideo, atTime: 6.0)
let resultsNewFill = try engine.block.getFill(resultsNewBlock)
let originalAfterOffset = try engine.block.getTrimOffset(resultsFill)
let originalAfterLength = try engine.block.getTrimLength(resultsFill)
let newBlockTrimOffset = try engine.block.getTrimOffset(resultsNewFill)
let newBlockTrimLength = try engine.block.getTrimLength(resultsNewFill)
```

The original block keeps its trim offset unchanged, but its trim length is reduced to the split point. The new block has its trim offset advanced by the split time and trim length set to cover the remaining duration. Both blocks reference the same source media—splitting is non-destructive.

### Timeline Positioning

The original block keeps its `getTimeOffset(_:)`. When `attachToParent` is `true`, the new block is positioned immediately after the original on the same parent. Both blocks stay on the same track unless `createParentTrackIfNeeded` creates a new track structure.

## Split and Delete Workflow

Remove a middle section from a clip by splitting at both boundaries and destroying the middle segment.

```swift highlight-split-and-delete
let deleteVideo = try await makeVideoBlock()
// Split at the start of the section to remove.
let middleBlock = try engine.block.split(deleteVideo, atTime: 2.0)
// Split again 3 seconds into middleBlock to mark the end of the section.
let endBlock = try engine.block.split(middleBlock, atTime: 3.0)
try engine.block.destroy(middleBlock)
```

This workflow is useful for removing unwanted sections, such as cutting out pauses, mistakes, or irrelevant portions from a recording.

## Validating Split Time

Always validate that the split time is within valid bounds before calling `split(_:atTime:)`. The split time must be greater than `0` and less than the block's duration. Confirm the block supports trim with `supportsTrim(_:)` and read the available range with `getDuration(_:)`.

```swift highlight-validate-split-time
let validateVideo = try await makeVideoBlock()
try engine.block.setDuration(validateVideo, duration: 8.0)
let blockDuration = try engine.block.getDuration(validateVideo)
let desiredSplitTime = 4.0
var validatedNewBlock: DesignBlockID?
if try engine.block.supportsTrim(validateVideo),
   desiredSplitTime > 0,
   desiredSplitTime < blockDuration {
  validatedNewBlock = try engine.block.split(validateVideo, atTime: desiredSplitTime)
}
```

Attempting to split at an invalid time (at the beginning, end, or outside the block's duration) will fail or produce unexpected results.

## Troubleshooting

### Split Returns Unexpected Block

If the returned block ID doesn't behave as expected, remember that the original block becomes the first segment (before split point) and the returned block is the second segment (after split point).

### Split Time Out of Range

If split fails or produces unexpected results, verify the split time is within bounds. Use `getDuration(_:)` to check the valid range before splitting.

### Clip Not Splitting

If `split(_:atTime:)` has no visible effect, check that the block type supports splitting. Verify `supportsTrim(_:)` returns `true` for the block. For video and audio fills, ensure `forceLoadAVResource(_:)` has been awaited before attempting to split.

## API Reference

| Method                                    | Description                                | Parameters                                                          | Returns          |
| ----------------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- | ---------------- |
| `split(_:atTime:options:)`                | Split a block at the specified time        | `id: DesignBlockID, atTime: Double, options: SplitOptions`          | `DesignBlockID`  |
| `SplitOptions(attachToParent:createParentTrackIfNeeded:selectNewBlock:)` | Configure split behavior | `attachToParent: Bool, createParentTrackIfNeeded: Bool, selectNewBlock: Bool` | `SplitOptions` |
| `getTimeOffset(_:)`                       | Get time offset relative to parent         | `id: DesignBlockID`                                                 | `Double`         |
| `getDuration(_:)`                         | Get playback duration                      | `id: DesignBlockID`                                                 | `Double`         |
| `getPlaybackTime(_:)`                     | Get current playback time                  | `id: DesignBlockID`                                                 | `Double`         |
| `getTrimOffset(_:)`                       | Get trim offset of the block's fill        | `id: DesignBlockID`                                                 | `Double`         |
| `getTrimLength(_:)`                       | Get trim length of the block's fill        | `id: DesignBlockID`                                                 | `Double`         |
| `supportsTrim(_:)`                        | Check if a block supports trim properties  | `id: DesignBlockID`                                                 | `Bool`           |
| `forceLoadAVResource(_:)`                 | Force load media resource metadata         | `id: DesignBlockID`                                                 | `Void` (async)   |
| `destroy(_:)`                             | Destroy a block                            | `id: DesignBlockID`                                                 | `Void`           |

## Next Steps

- [Trim Video and Audio](./trim.md) — Control playback range without splitting
- [Video Timeline Overview](../create-video/timeline-editor.md) — Understand the complete timeline editing system




---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support