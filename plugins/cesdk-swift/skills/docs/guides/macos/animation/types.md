> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Supported Animation Types](./types.md)

---

```swift file=@cesdk_swift_examples/engine-guides-animation-types/AnimationTypes.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func animationTypes(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.appendChild(to: scene, child: page)

  let pageFill = try engine.block.createFill(.color)
  try engine.block.setColor(pageFill, property: "fill/color/value", r: 1, g: 1, b: 1, a: 1)
  try engine.block.setFill(page, fill: pageFill)

  let baseURL = try engine.guidesBaseURL
  let imageURLs = [
    baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_2.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_3.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_4.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_5.jpg"),
    baseURL.appendingPathComponent("ly.img.image/images/sample_6.jpg"),
  ]

  // 2 columns × 3 rows grid layout for 6 demonstration blocks.
  let columns = 2
  let rows = 3
  let blockWidth: Float = 1920 / Float(columns) - 60
  let blockHeight: Float = 1080 / Float(rows) - 60

  func createImageBlock(index: Int) throws -> DesignBlockID {
    let graphic = try engine.block.create(.graphic)
    try engine.block.setShape(graphic, shape: engine.block.createShape(.rect))
    let imageFill = try engine.block.createFill(.image)
    try engine.block.setURL(imageFill, property: "fill/image/imageFileURI", value: imageURLs[index])
    try engine.block.setFill(graphic, fill: imageFill)
    try engine.block.setWidth(graphic, value: blockWidth)
    try engine.block.setHeight(graphic, value: blockHeight)
    let column = index % columns
    let row = index / columns
    try engine.block.setPositionX(graphic, value: 30 + Float(column) * (blockWidth + 60))
    try engine.block.setPositionY(graphic, value: 30 + Float(row) * (blockHeight + 60))
    try engine.block.appendChild(to: page, child: graphic)
    return graphic
  }

  let block1 = try createImageBlock(index: 0)

  let slideAnimation = try engine.block.createAnimation(.slide)
  try engine.block.setInAnimation(block1, animation: slideAnimation)
  try engine.block.setDuration(slideAnimation, duration: 1.0)
  try engine.block.setFloat(slideAnimation, property: "animation/slide/direction", value: .pi)
  try engine.block.setEnum(slideAnimation, property: "animationEasing", value: "EaseOut")

  let block2 = try createImageBlock(index: 1)

  let fadeAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(block2, animation: fadeAnimation)
  try engine.block.setDuration(fadeAnimation, duration: 1.0)
  try engine.block.setEnum(fadeAnimation, property: "animationEasing", value: "EaseInOut")

  let block3 = try createImageBlock(index: 2)

  let zoomAnimation = try engine.block.createAnimation(.zoom)
  try engine.block.setInAnimation(block3, animation: zoomAnimation)
  try engine.block.setDuration(zoomAnimation, duration: 1.0)
  try engine.block.setBool(zoomAnimation, property: "animation/zoom/fade", value: true)

  let block4 = try createImageBlock(index: 3)

  let wipeIn = try engine.block.createAnimation(.wipe)
  try engine.block.setInAnimation(block4, animation: wipeIn)
  try engine.block.setDuration(wipeIn, duration: 1.0)
  try engine.block.setEnum(wipeIn, property: "animation/wipe/direction", value: "Right")

  let fadeOut = try engine.block.createAnimation(.fade)
  try engine.block.setOutAnimation(block4, animation: fadeOut)
  try engine.block.setDuration(fadeOut, duration: 1.0)
  try engine.block.setEnum(fadeOut, property: "animationEasing", value: "EaseIn")

  let block5 = try createImageBlock(index: 4)

  let breathingLoop = try engine.block.createAnimation(.breathingLoop)
  try engine.block.setLoopAnimation(block5, animation: breathingLoop)
  try engine.block.setDuration(breathingLoop, duration: 2.0)
  // Intensity: 0 results in a maximum scale of 1.25; 1 results in a maximum scale of 2.5.
  try engine.block.setFloat(breathingLoop, property: "animation/breathing_loop/intensity", value: 0.3)

  let block6 = try createImageBlock(index: 5)

  let spinIn = try engine.block.createAnimation(.spin)
  try engine.block.setInAnimation(block6, animation: spinIn)
  try engine.block.setDuration(spinIn, duration: 1.0)
  try engine.block.setEnum(spinIn, property: "animation/spin/direction", value: "Clockwise")
  try engine.block.setFloat(spinIn, property: "animation/spin/intensity", value: 0.5)

  let blurOut = try engine.block.createAnimation(.blur)
  try engine.block.setOutAnimation(block6, animation: blurOut)
  try engine.block.setDuration(blurOut, duration: 1.0)

  let swayLoop = try engine.block.createAnimation(.swayLoop)
  try engine.block.setLoopAnimation(block6, animation: swayLoop)
  try engine.block.setDuration(swayLoop, duration: 1.5)

  let slideProperties = try engine.block.findAllProperties(slideAnimation)
  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")

  // Advance playback so the entrance animations have started by the time the
  // scene is rendered or exported.
  try engine.block.setPlaybackTime(page, time: 1.9)

  _ = slideProperties
  _ = easingOptions
}
```

Apply entrance, exit, and loop animations to design blocks using the available animation types in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0/engine-guides-animation-types)

CE.SDK organizes animations into three categories: entrance (In), exit (Out), and loop. Each category determines when the animation plays during the block's lifecycle. This guide demonstrates different animation types and their configurable properties.

This guide covers applying entrance animations (slide, fade, zoom), exit animations, loop animations, and configuring animation properties like direction, easing, and intensity.

## Entrance Animations

Entrance animations define how a block appears. We use `createAnimation(_:)` with the animation type and attach it using `setInAnimation(_:animation:)`.

### Slide Animation

The slide animation moves a block in from a specified direction. The `animation/slide/direction` property uses radians where `0` is right, `.pi / 2` is bottom, `.pi` is left, and `3 * .pi / 2` is top.

```swift highlight-animationTypes-entranceSlide
let slideAnimation = try engine.block.createAnimation(.slide)
try engine.block.setInAnimation(block1, animation: slideAnimation)
try engine.block.setDuration(slideAnimation, duration: 1.0)
try engine.block.setFloat(slideAnimation, property: "animation/slide/direction", value: .pi)
try engine.block.setEnum(slideAnimation, property: "animationEasing", value: "EaseOut")
```

### Fade Animation

The fade animation transitions opacity from invisible to fully visible. Easing controls the animation curve.

```swift highlight-animationTypes-entranceFade
let fadeAnimation = try engine.block.createAnimation(.fade)
try engine.block.setInAnimation(block2, animation: fadeAnimation)
try engine.block.setDuration(fadeAnimation, duration: 1.0)
try engine.block.setEnum(fadeAnimation, property: "animationEasing", value: "EaseInOut")
```

### Zoom Animation

The zoom animation scales the block from a smaller size to its final dimensions. The `animation/zoom/fade` property adds an opacity transition during scaling.

```swift highlight-animationTypes-entranceZoom
let zoomAnimation = try engine.block.createAnimation(.zoom)
try engine.block.setInAnimation(block3, animation: zoomAnimation)
try engine.block.setDuration(zoomAnimation, duration: 1.0)
try engine.block.setBool(zoomAnimation, property: "animation/zoom/fade", value: true)
```

Other entrance animation types include:

- `.blur` — Transitions from blurred to clear
- `.wipe` — Reveals with a directional wipe
- `.pop` — Bouncy scale effect
- `.spin` — Rotates the block into view
- `.grow` — Scales up from a point

## Exit Animations

Exit animations define how a block leaves the screen. We use `setOutAnimation(_:animation:)` to attach them. CE.SDK prevents overlap between entrance and exit durations automatically.

```swift highlight-animationTypes-exitAnimation
  let wipeIn = try engine.block.createAnimation(.wipe)
  try engine.block.setInAnimation(block4, animation: wipeIn)
  try engine.block.setDuration(wipeIn, duration: 1.0)
  try engine.block.setEnum(wipeIn, property: "animation/wipe/direction", value: "Right")

  let fadeOut = try engine.block.createAnimation(.fade)
  try engine.block.setOutAnimation(block4, animation: fadeOut)
  try engine.block.setDuration(fadeOut, duration: 1.0)
  try engine.block.setEnum(fadeOut, property: "animationEasing", value: "EaseIn")
```

In this example, a wipe entrance transitions to a fade exit. Mirror entrance effects for visual consistency, or use contrasting effects for emphasis.

## Loop Animations

Loop animations run continuously while the block is visible. They can combine with entrance and exit animations. We use `setLoopAnimation(_:animation:)` to attach them.

```swift highlight-animationTypes-loopAnimation
let breathingLoop = try engine.block.createAnimation(.breathingLoop)
try engine.block.setLoopAnimation(block5, animation: breathingLoop)
try engine.block.setDuration(breathingLoop, duration: 2.0)
// Intensity: 0 results in a maximum scale of 1.25; 1 results in a maximum scale of 2.5.
try engine.block.setFloat(breathingLoop, property: "animation/breathing_loop/intensity", value: 0.3)
```

The duration controls each cycle length. Loop animation types include:

- `.breathingLoop` — Slow scale pulse
- `.pulsatingLoop` — Rhythmic scale
- `.spinLoop` — Continuous rotation
- `.fadeLoop` — Opacity cycling
- `.swayLoop` — Rotational oscillation
- `.jumpLoop` — Jumping motion
- `.blurLoop` — Blur cycling
- `.squeezeLoop` — Squeezing effect

## Combined Animations

A single block can have entrance, exit, and loop animations running together. The loop animation runs throughout the block's visibility while entrance and exit animations play at the appropriate times.

```swift highlight-animationTypes-combinedAnimations
  let spinIn = try engine.block.createAnimation(.spin)
  try engine.block.setInAnimation(block6, animation: spinIn)
  try engine.block.setDuration(spinIn, duration: 1.0)
  try engine.block.setEnum(spinIn, property: "animation/spin/direction", value: "Clockwise")
  try engine.block.setFloat(spinIn, property: "animation/spin/intensity", value: 0.5)

  let blurOut = try engine.block.createAnimation(.blur)
  try engine.block.setOutAnimation(block6, animation: blurOut)
  try engine.block.setDuration(blurOut, duration: 1.0)

  let swayLoop = try engine.block.createAnimation(.swayLoop)
  try engine.block.setLoopAnimation(block6, animation: swayLoop)
  try engine.block.setDuration(swayLoop, duration: 1.5)
```

## Configuring Animation Properties

Each animation type has specific configurable properties. We use `findAllProperties(_:)` to discover available properties and `getEnumValues(ofProperty:)` to query options for enum properties.

```swift highlight-animationTypes-discoverProperties
let slideProperties = try engine.block.findAllProperties(slideAnimation)
let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
```

Common configurable properties include:

- **Direction**: Controls entry/exit direction in radians or enum values
- **Easing**: Animation curve (`Linear`, `EaseIn`, `EaseOut`, `EaseInOut`)
- **Intensity**: Strength of the effect (varies by animation type)
- **Fade**: Whether to include opacity transition

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.createAnimation(_:)` | Create animation by type |
| `engine.block.setInAnimation(_:animation:)` | Attach entrance animation |
| `engine.block.setOutAnimation(_:animation:)` | Attach exit animation |
| `engine.block.setLoopAnimation(_:animation:)` | Attach loop animation |
| `engine.block.setDuration(_:duration:)` | Set animation duration |
| `engine.block.setFloat(_:property:value:)` | Set numeric property |
| `engine.block.setEnum(_:property:value:)` | Set enum property |
| `engine.block.setBool(_:property:value:)` | Set boolean property |
| `engine.block.findAllProperties(_:)` | Discover configurable properties |
| `engine.block.getEnumValues(ofProperty:)` | Get available enum values |

## Next Steps

- [Base Animations](./create/base.md) — Create and attach animations to blocks
- [Text Animations](./create/text.md) — Animate text with writing styles
- [Animation Overview](./overview.md) — Animation concepts and capabilities



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support