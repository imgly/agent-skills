> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Apply Transitions](./apply-transitions.md)

---

```swift file=@cesdk_swift_examples/engine-guides-apply-transitions/ApplyTransitions.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func applyTransitions(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 16)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)

  let baseURL = try engine.guidesBaseURL
  let videoURLs = [
    "ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4",
    "ly.img.video/videos/pexels-tony-schnagl-5528015.mp4",
    "ly.img.video/videos/pexels-taryn-elliott-8713114.mp4",
    "ly.img.video/videos/pexels-taryn-elliott-7108801.mp4",
  ].map { baseURL.appendingPathComponent($0) }

  var clips = [DesignBlockID]()
  for (index, videoURL) in videoURLs.enumerated() {
    let clip = try await makeTransitionClip(engine: engine, videoURL: videoURL, width: 1280, height: 720)
    try engine.block.appendChild(to: track, child: clip)
    try engine.block.setDuration(clip, duration: 4)
    try engine.block.setTimeOffset(clip, offset: Double(index) * 4)
    clips.append(clip)
  }
  try engine.block.fillParent(track)

  let clipA = clips[0]
  let clipB = clips[1]
  let clipC = clips[2]

  try engine.block.setPlaybackTime(page, time: 3.5)
  try await engine.captureGuide(page, label: "before-transition")

  let clipsSupportTransitions = try engine.block.supportsTransition(clipA)
    && engine.block.supportsTransition(clipB)
  print("Clips support transitions: \(clipsSupportTransitions)")

  let crossFade = try engine.block.createTransition(.crossFade)
  try engine.block.setDuration(crossFade, duration: 1)

  try engine.block.setTransition(clipA, transition: crossFade)

  let incomingClipOffset = try engine.block.getTimeOffset(clipB)
  print("Clip B now starts at \(incomingClipOffset)s (was 4)")

  let push = try engine.block.createTransition(.push)
  try engine.block.setDuration(push, duration: 1)
  try engine.block.setTransition(clipB, transition: push)

  let pushProperties = try engine.block.findAllProperties(push)
  print("Push properties: \(pushProperties)")

  try engine.block.setEnum(push, property: "transition/push/direction", value: "Left")

  try engine.block.setBool(push, property: "transition/push/morph", value: true)

  try engine.block.setPlaybackTime(page, time: 6.5)
  try await engine.captureGuide(page, label: "after-push")

  let assigned = try engine.block.getTransition(clipA)
  if engine.block.isValid(assigned) {
    print("Clip A transitions with: \(try engine.block.getType(assigned))")
  }

  let fadeToBlack = try engine.block.createTransition(.fadeToBlack)
  try engine.block.setDuration(fadeToBlack, duration: 1)
  try engine.block.setTransition(clipC, transition: fadeToBlack)

  try engine.block.removeTransition(clipC)
  print("Detached transition is still valid: \(engine.block.isValid(fadeToBlack))")
  try engine.block.destroy(fadeToBlack)

  let colorWipe = try engine.block.createTransition(.colorWipe)
  try engine.block.setDuration(colorWipe, duration: 1)
  try engine.block.setTransition(clipC, transition: colorWipe)
  try engine.block.setEnum(colorWipe, property: "transition/color-wipe/direction", value: "Up")
  try engine.block.setColor(
    colorWipe,
    property: "transition/color-wipe/color",
    color: .rgba(r: 1, g: 1, b: 1, a: 1),
  )

  // Just before the midpoint of the [9, 10] window: the wipe color covers the frame completely at
  // the midpoint, so park slightly earlier to catch the band partway across.
  try engine.block.setPlaybackTime(page, time: 9.45)
  try await engine.captureGuide(page, label: "after-color-wipe")

  // Fit the page to the reflowed sequence, then park the playhead inside the first overlap window
  // so the cross-fade blend is the frame the hero shows.
  if let lastClip = clips.last {
    let end = try engine.block.getTimeOffset(lastClip) + engine.block.getDuration(lastClip)
    try engine.block.setDuration(page, duration: end)
  }
  try engine.block.setPlaybackTime(page, time: 3.5)
  try await engine.captureGuide(page, label: "hero")
}

@MainActor
private func makeTransitionClip(
  engine: Engine,
  videoURL: URL,
  width: Float,
  height: Float,
) async throws -> DesignBlockID {
  let clip = try engine.block.create(.graphic)
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

Blend adjacent video clips into each other with clip-to-clip transitions such as cross-fades, pushes, and wipes using CE.SDK's transitions API.

![Two video clips blending into each other in a cross-fade, halfway through the transition](https://img.ly/docs/cesdk/mac-catalyst/create-video/apply-transitions-146026/assets/swift-based.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-rc.1/engine-guides-apply-transitions)

<EngineReferenceNote {...props} />

A transition belongs to the **outgoing clip** and blends it into the following clip on the same track. When you assign one, the engine overlaps the two clips for the transition duration: the incoming clip—and every clip after it on that track—moves earlier on the timeline, and audio cross-fades over the same window following the transition's easing curve.

Transitions are blocks. You create one with `createTransition(_:)`, attach it to a clip with `setTransition(_:transition:)`, and configure it through the same generic setters you use for other blocks. Once assigned, the transition is owned by its clip: it is destroyed together with the clip.

This guide covers how to check transition support, create and assign transitions between clips, understand the timeline overlap they introduce, configure per-type properties, and replace or remove them.

## Creating the Video Timeline

Transitions need a video scene with at least two adjacent clips on a track. `supportsTransition(_:)` only reports `true` for clips in a video-mode scene, so create the scene with `createVideo()`.

```swift highlight-applyTransitions-createScene
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1280)
  try engine.block.setHeight(page, value: 720)
  try engine.block.setDuration(page, duration: 16)

  let track = try engine.block.create(.track)
  try engine.block.appendChild(to: page, child: track)
```

Each clip is a graphic block with a video fill. Loading the resource up front with `forceLoadAVResource(_:)` gives the engine the clip's duration and lets it decode frames for playback.

```swift highlight-applyTransitions-clipHelper
@MainActor
private func makeTransitionClip(
  engine: Engine,
  videoURL: URL,
  width: Float,
  height: Float,
) async throws -> DesignBlockID {
  let clip = try engine.block.create(.graphic)
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

Appending the clips to the track makes them play one after another. Each clip runs for 4 seconds, so they start at 0, 4, 8, and 12 seconds.

```swift highlight-applyTransitions-createClips
  var clips = [DesignBlockID]()
  for (index, videoURL) in videoURLs.enumerated() {
    let clip = try await makeTransitionClip(engine: engine, videoURL: videoURL, width: 1280, height: 720)
    try engine.block.appendChild(to: track, child: clip)
    try engine.block.setDuration(clip, duration: 4)
    try engine.block.setTimeOffset(clip, offset: Double(index) * 4)
    clips.append(clip)
  }
  try engine.block.fillParent(track)

  let clipA = clips[0]
  let clipB = clips[1]
  let clipC = clips[2]
```

## Checking Transition Support

Before assigning a transition, verify that both the outgoing and the incoming clip support one. Any individual clip placed directly in a video track qualifies, no matter whether it shows a video, an image, a shape, a sticker or text. Audio, group, caption, and cutout blocks report `false`, as do blocks outside a video track.

```swift highlight-applyTransitions-checkSupport
let clipsSupportTransitions = try engine.block.supportsTransition(clipA)
  && engine.block.supportsTransition(clipB)
print("Clips support transitions: \(clipsSupportTransitions)")
```

`setTransition(_:transition:)` throws when either clip fails this check, so testing upfront lets you disable the option instead of handling an error later.

## Creating and Assigning a Transition

Create a cross-fade and give it a duration. The duration defines how long the two clips overlap.

```swift highlight-applyTransitions-createTransition
let crossFade = try engine.block.createTransition(.crossFade)
try engine.block.setDuration(crossFade, duration: 1)
```

The new block is standalone until you assign it. Assigning it to the first clip blends that clip into the one that follows it on the track.

```swift highlight-applyTransitions-setTransition
try engine.block.setTransition(clipA, transition: crossFade)
```

A transition block can only be assigned to one clip. Assigning a different transition to a clip that already has one detaches the previous block without destroying it.

## Understanding the Timeline Overlap

Assigning a transition reflows the timeline. The incoming clip moves earlier by the transition duration so the two clips overlap, and all downstream clips on the same track shift with it. The outgoing clip itself stays where it is, and clips on other tracks are untouched.

```swift highlight-applyTransitions-timelineReflow
let incomingClipOffset = try engine.block.getTimeOffset(clipB)
print("Clip B now starts at \(incomingClipOffset)s (was 4)")
```

With a 1-second cross-fade on the first clip, the second clip's time offset changes from 4 to 3 seconds. The effective overlap is clamped: it never exceeds half of either neighboring clip's duration, so a long transition between short clips plays shorter than requested. Removing the transition restores the original offsets.

## Configuring Transition Properties

Each transition type exposes its own properties under `transition/{type}/{property}` keys, which you set through the generic block setters. The key uses the type's short ID, so `TransitionType.push` maps to `transition/push/…`. Use `findAllProperties(_:)` to discover what a specific type offers.

```swift highlight-applyTransitions-configureProperties
  let push = try engine.block.createTransition(.push)
  try engine.block.setDuration(push, duration: 1)
  try engine.block.setTransition(clipB, transition: push)

  let pushProperties = try engine.block.findAllProperties(push)
  print("Push properties: \(pushProperties)")

  try engine.block.setEnum(push, property: "transition/push/direction", value: "Left")
```

Directional types expose a `direction` enum, but they don't all share the same value set: `push`, `slide`, `stack`, `splice`, `wipe`, `gradient-fade`, and `color-wipe` take `Left`, `Right`, `Up`, or `Down`, while `cross-spin` and `chop` take `Clockwise` or `CounterClockwise`, `diagonal-splice` takes `RaisedRamp` or `LoweredRamp`, and `two-stripes` takes `Horizontal` or `Vertical`. Call `getEnumValues(ofProperty:)` to read the accepted values for a key. Other types expose numeric controls such as `transition/cross-spin/intensity` or `transition/cross-warp/zoom`, and `color-wipe` exposes a `transition/color-wipe/color` color property.

## Morphing Between Clips

With morph enabled, the engine interpolates position, rotation, scale, and shape between the outgoing and incoming clip during the transition. Most types morph by default; `push` is the exception and starts with morph off, and `clock-wipe` and `cross-spin` don't expose the flag at all.

```swift highlight-applyTransitions-morph
try engine.block.setBool(push, property: "transition/push/morph", value: true)
```

Morphing is most visible when the two clips differ in framing—for example when one clip is scaled or rotated relative to the other.

## Reading Back a Transition

`getTransition(_:)` returns the transition assigned to a clip, or an invalid block when the clip has none. Check the result with `isValid(_:)` before using it.

```swift highlight-applyTransitions-getTransition
let assigned = try engine.block.getTransition(clipA)
if engine.block.isValid(assigned) {
  print("Clip A transitions with: \(try engine.block.getType(assigned))")
}
```

## Replacing or Removing a Transition

`removeTransition(_:)` detaches a clip's transition and restores the original clip timing, but does not destroy the detached block. Destroy it yourself when you no longer need it, then assign a replacement.

```swift highlight-applyTransitions-removeTransition
  let fadeToBlack = try engine.block.createTransition(.fadeToBlack)
  try engine.block.setDuration(fadeToBlack, duration: 1)
  try engine.block.setTransition(clipC, transition: fadeToBlack)

  try engine.block.removeTransition(clipC)
  print("Detached transition is still valid: \(engine.block.isValid(fadeToBlack))")
  try engine.block.destroy(fadeToBlack)

  let colorWipe = try engine.block.createTransition(.colorWipe)
  try engine.block.setDuration(colorWipe, duration: 1)
  try engine.block.setTransition(clipC, transition: colorWipe)
  try engine.block.setEnum(colorWipe, property: "transition/color-wipe/direction", value: "Up")
  try engine.block.setColor(
    colorWipe,
    property: "transition/color-wipe/color",
    color: .rgba(r: 1, g: 1, b: 1, a: 1),
  )
```

Removing from a clip without an assigned transition is a no-op.

## Transition Types

`createTransition(_:)` takes a `TransitionType`. Its `rawValue` is the longhand ID—`//ly.img.ubq/transition/cross-fade` for `.crossFade`—and the short form of that ID is what the property keys are built from. `TransitionType` conforms to `CaseIterable`, so you can enumerate every type to build a picker.

- **Blends**: `.crossFade`, `.crossBlur`, `.crossSpin`, `.crossZoom`, `.crossWarp`
- **Movement**: `.push`, `.slide`, `.stack`, `.splice`, `.diagonalSplice`
- **Fades**: `.fade`, `.fadeToBlack`, `.fadeToWhite`, `.gradientFade`
- **Wipes**: `.wipe`, `.lineWipe`, `.clockWipe`, `.colorWipe`
- **Patterns**: `.chop`, `.twoStripes`
- **None**: `.none`

## Troubleshooting

### Transition Has No Visible Effect

Check that both clips sit next to each other on the same track and that the playhead is inside the overlap window. The overlap starts at the incoming clip's time offset and ends at the outgoing clip's end.

### setTransition Throws

Verify `supportsTransition(_:)` returns `true` for both the outgoing and the incoming clip, and that the transition block isn't already assigned to another clip. The outgoing clip also needs a clip following it on the same track, and the call requires the `appearance/animation` scope.

### Transition Disappeared

The engine destroys an assigned transition when the owning clip is destroyed, or when the two clips stop being timeline-adjacent. Adjacency only breaks on a track you manage yourself: a track keeps its children packed while `track/automaticallyManageBlockOffsets` is `true`, which is the default.

### Transition Plays Shorter Than Requested

The effective duration is clamped to half of either neighboring clip's duration. Shorten the transition or lengthen the clips.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `engine.block.createTransition(_:)` | Create a standalone transition block of a `TransitionType` |
| `engine.block.supportsTransition(_:)` | Check whether a clip can own an outgoing transition |
| `engine.block.setTransition(_:transition:)` | Assign the outgoing transition of a clip |
| `engine.block.getTransition(_:)` | Get the assigned transition, or an invalid block when unset |
| `engine.block.removeTransition(_:)` | Detach the outgoing transition of a clip |
| `engine.block.setDuration(_:duration:)` | Set clip or transition duration in seconds |
| `engine.block.getTimeOffset(_:)` | Get a clip's timeline start |
| `engine.block.findAllProperties(_:)` | List the properties a transition exposes |
| `engine.block.getEnumValues(ofProperty:)` | List the accepted values of an enum property |
| `engine.block.isValid(_:)` | Check a `getTransition(_:)` result |
| `engine.block.destroy(_:)` | Destroy a detached transition block |

### Properties

| Property | Type | Description |
| --- | --- | --- |
| `transition/{type}/direction` | Enum | Direction of a directional transition |
| `transition/{type}/morph` | Bool | Interpolate position, rotation, scale, and shape between the clips |
| `transition/color-wipe/color` | Color | Color of the wipe |
| `transition/cross-spin/intensity` | Float | Strength of the spin |
| `transition/cross-warp/zoom` | Float | Zoom applied while warping |

## Next Steps

- [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) - Build the clip sequence transitions operate on
- [Trim Video Clips](../edit-video/trim.md) - Control which portion of media plays back
- [Create Animations](../animation/create.md) - Entrance and exit effects for individual blocks



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support