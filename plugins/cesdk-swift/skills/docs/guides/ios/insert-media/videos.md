> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Insert Media Assets](../insert-media.md) > [Insert Videos](./videos.md)

---

Add videos to your CE.SDK scenes programmatically with the Swift Engine API:
build a graphic block, attach a video fill, and configure trim, position, and
size from code.

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-insert-media-videos)

<EngineReferenceNote {...props} />

Videos in CE.SDK are graphic blocks with a video fill. A graphic block provides the shape and position on the page; the attached video fill carries the source URL and the trim metadata.

```swift file=@cesdk_swift_examples/engine-guides-insert-media-videos/InsertMediaVideos.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func insertMediaVideos(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.setDuration(page, duration: 30)

  let baseURL = try engine.guidesBaseURL
  let videoURL = baseURL.appendingPathComponent(
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
  )

  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)

  try engine.block.appendChild(to: page, child: videoBlock)

  // Place an 800x450 frame at the center of the 1920x1080 page.
  try engine.block.setWidth(videoBlock, value: 800)
  try engine.block.setHeight(videoBlock, value: 450)
  try engine.block.setPositionX(videoBlock, value: 560)
  try engine.block.setPositionY(videoBlock, value: 315)

  try await engine.block.forceLoadAVResource(videoFill)
  let totalDuration = try engine.block.getAVResourceTotalDuration(videoFill)
  let trimOffset = 2.0
  let trimLength = min(5.0, totalDuration - trimOffset)
  try engine.block.setTrimOffset(videoFill, offset: trimOffset)
  try engine.block.setTrimLength(videoFill, length: trimLength)
  try engine.block.setDuration(videoBlock, duration: trimLength)

  let graphicBlocks = try engine.block.find(byType: .graphic)
  for block in graphicBlocks {
    let fill = try engine.block.getFill(block)
    guard try engine.block.getType(fill) == FillType.video.rawValue else { continue }
    let uri = try engine.block.getString(fill, property: "fill/video/fileURI")
    let offset = try engine.block.getTrimOffset(fill)
    let length = try engine.block.getTrimLength(fill)
    print(String(format: "Video %u — trim %.2fs..+%.2fs, uri %@", block, offset, length, uri))
  }

  try engine.block.destroy(videoBlock)
}
```

This guide covers creating a video block, configuring trim, positioning the frame, finding existing videos in a scene, and removing them.

## Creating a Video Block

Create a graphic block with `create(_:)`, attach a rectangular shape with `setShape(_:shape:)`, then create a video fill with `createFill(_:)` and point it at the source URL via `setString(_:property:value:)` using the `fill/video/fileURI` property. Append the graphic block to a page with `appendChild(to:child:)`.

```swift highlight-insertMediaVideos-createVideoBlock
  let videoBlock = try engine.block.create(.graphic)
  try engine.block.setShape(videoBlock, shape: engine.block.createShape(.rect))

  let videoFill = try engine.block.createFill(.video)
  try engine.block.setURL(videoFill, property: "fill/video/fileURI", value: videoURL)
  try engine.block.setFill(videoBlock, fill: videoFill)

  try engine.block.appendChild(to: page, child: videoBlock)
```

The source URI can be a remote URL or a local file path. The video fill is a separate block referenced by the graphic; configuration of trim and source URL happens on the fill, while position, size, and timeline placement happen on the graphic block.

## Positioning and Sizing

Set the frame size with `setWidth(_:value:)` and `setHeight(_:value:)`, and the on-page position with `setPositionX(_:value:)` and `setPositionY(_:value:)`. All four values are expressed in the scene's design unit.

```swift highlight-insertMediaVideos-positionAndSize
// Place an 800x450 frame at the center of the 1920x1080 page.
try engine.block.setWidth(videoBlock, value: 800)
try engine.block.setHeight(videoBlock, value: 450)
try engine.block.setPositionX(videoBlock, value: 560)
try engine.block.setPositionY(videoBlock, value: 315)
```

The origin sits at the top-left of the page (per the engine doc for `setPositionY`), so positive X moves the frame right and positive Y moves it down.

## Configuring Trim

Control which portion of the source plays with `setTrimOffset(_:offset:)` and `setTrimLength(_:length:)`. Apply both to the **video fill** — the trim metadata lives on the fill, not on the graphic block that owns it. Call `forceLoadAVResource(_:)` first so the engine fetches the source and decodes its container, then read the source duration with `getAVResourceTotalDuration(_:)` to clamp trim values against the available content.

```swift highlight-insertMediaVideos-configureTrim
try await engine.block.forceLoadAVResource(videoFill)
let totalDuration = try engine.block.getAVResourceTotalDuration(videoFill)
let trimOffset = 2.0
let trimLength = min(5.0, totalDuration - trimOffset)
try engine.block.setTrimOffset(videoFill, offset: trimOffset)
try engine.block.setTrimLength(videoFill, length: trimLength)
try engine.block.setDuration(videoBlock, duration: trimLength)
```

The graphic block's timeline duration is independent of the fill's trim length — setting `setDuration(_:duration:)` on the block to match the trim length keeps the block visible on the timeline for exactly as long as its content plays.

## Finding Video Blocks

Use `find(byType:)` with `DesignBlockType.graphic` to retrieve every graphic block in the scene, then filter by fill type. Graphic blocks can carry color, image, or video fills; reading the fill's type with `getType(_:)` and comparing against `FillType.video.rawValue` selects the video-backed ones.

```swift highlight-insertMediaVideos-findVideoBlocks
let graphicBlocks = try engine.block.find(byType: .graphic)
for block in graphicBlocks {
  let fill = try engine.block.getFill(block)
  guard try engine.block.getType(fill) == FillType.video.rawValue else { continue }
  let uri = try engine.block.getString(fill, property: "fill/video/fileURI")
  let offset = try engine.block.getTrimOffset(fill)
  let length = try engine.block.getTrimLength(fill)
  print(String(format: "Video %u — trim %.2fs..+%.2fs, uri %@", block, offset, length, uri))
}
```

For each block, read the source URI with `getString(_:property:)` and the trim properties with `getTrimOffset(_:)` and `getTrimLength(_:)`.

## Removing Videos

Call `destroy(_:)` to remove a graphic block from the scene. Destroying the block detaches it from its parent page and releases the attached video fill.

```swift highlight-insertMediaVideos-removeVideo
try engine.block.destroy(videoBlock)
```

## API Reference

| Method | Category | Purpose |
| --- | --- | --- |
| `block.create(.graphic)` | Block | Create a new graphic block |
| `block.createShape(.rect)` | Block | Create a rectangular shape |
| `block.setShape(_:shape:)` | Block | Attach a shape to a graphic block |
| `block.createFill(.video)` | Block | Create a video fill |
| `block.setString(_:property:value:)` (`fill/video/fileURI`) | Block | Set the video source URL |
| `block.getString(_:property:)` (`fill/video/fileURI`) | Block | Read the video source URL |
| `block.setFill(_:fill:)` | Block | Attach a fill to a graphic block |
| `block.getFill(_:)` | Block | Get the fill attached to a graphic block |
| `block.getType(_:)` | Block | Read the engine type string |
| `block.appendChild(to:child:)` | Block | Add a block to a parent |
| `block.forceLoadAVResource(_:)` | Block | Load video metadata |
| `block.getAVResourceTotalDuration(_:)` | Block | Read the source file's total duration in seconds |
| `block.setTrimOffset(_:offset:)` | Block | Set the trim start point on the fill |
| `block.getTrimOffset(_:)` | Block | Get the trim start point |
| `block.setTrimLength(_:length:)` | Block | Set the trim duration on the fill |
| `block.getTrimLength(_:)` | Block | Get the trim duration |
| `block.setWidth(_:value:)` | Block | Set the block's width |
| `block.setHeight(_:value:)` | Block | Set the block's height |
| `block.setPositionX(_:value:)` | Block | Set the horizontal position |
| `block.setPositionY(_:value:)` | Block | Set the vertical position |
| `block.setDuration(_:duration:)` | Block | Set the block's timeline duration |
| `block.find(byType:)` | Block | Find blocks by `DesignBlockType` |
| `block.destroy(_:)` | Block | Remove a block |

## Next Steps

- [Video Fills](../fills/video.md) — Configure video fill properties beyond trim and source URL
- [Create Videos Overview](../create-video/overview.md) — Choose the right guide for creating and editing a video project
- [Apply Filters and Effects](../filters-and-effects/apply.md) — Enhance video appearance with adjustments and overlays
- [Export Overview](../export-save-publish/export/overview.md) — Render scenes with video to MP4 or image formats



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support