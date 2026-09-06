> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Create Animations](./create.md)

---

```swift file=@cesdk_swift_examples/engine-guides-create-animations/CreateAnimations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func createAnimations(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)

  let block = try engine.block.create(.graphic)
  try engine.block.setShape(block, shape: engine.block.createShape(.rect))
  try engine.block.setPositionX(block, value: 100)
  try engine.block.setPositionY(block, value: 50)
  try engine.block.setWidth(block, value: 300)
  try engine.block.setHeight(block, value: 300)
  try engine.block.appendChild(to: page, child: block)
  let fill = try engine.block.createFill(.image)
  try engine.block.setURL(
    fill,
    property: "fill/image/imageFileURI",
    value: baseURL.appendingPathComponent("ly.img.image/images/sample_1.jpg"),
  )
  try engine.block.setFill(block, fill: fill)

  guard try engine.block.supportsAnimation(block) else {
    return
  }

  let slideIn = try engine.block.createAnimation(.slide)
  try engine.block.setInAnimation(block, animation: slideIn)
  try engine.block.setDuration(slideIn, duration: 1.2)

  try engine.block.setEnum(slideIn, property: "animationEasing", value: "EaseOut")
  try engine.block.setFloat(slideIn, property: "animation/slide/direction", value: 1.5 * .pi)

  let fadeOut = try engine.block.createAnimation(.fade)
  try engine.block.setOutAnimation(block, animation: fadeOut)
  try engine.block.setDuration(fadeOut, duration: 1.0)
  try engine.block.setEnum(fadeOut, property: "animationEasing", value: "EaseIn")

  let pulsatingLoop = try engine.block.createAnimation(.pulsatingLoop)
  try engine.block.setLoopAnimation(block, animation: pulsatingLoop)
  try engine.block.setDuration(pulsatingLoop, duration: 1.5)

  let slideProperties = try engine.block.findAllProperties(slideIn)
  print("Slide animation properties: \(slideProperties)")

  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
  print("Available easing options: \(easingOptions)")

  let text = try engine.block.create(.text)
  try engine.block.setPositionX(text, value: 100)
  try engine.block.setPositionY(text, value: 400)
  try engine.block.setWidth(text, value: 600)
  try engine.block.setHeight(text, value: 100)
  try engine.block.replaceText(text, text: "Entrance • Exit • Loop")
  try engine.block.appendChild(to: page, child: text)

  let textAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(text, animation: textAnimation)
  try engine.block.setDuration(textAnimation, duration: 1.5)
  try engine.block.setEnum(textAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(textAnimation, property: "textAnimationOverlap", value: 0.3)

  let currentIn = try engine.block.getInAnimation(block)
  let currentOut = try engine.block.getOutAnimation(block)
  let currentLoop = try engine.block.getLoopAnimation(block)
  print("Animation IDs — In: \(currentIn), Out: \(currentOut), Loop: \(currentLoop)")

  if engine.block.isValid(currentIn) {
    try engine.block.destroy(currentIn)
    let zoomIn = try engine.block.createAnimation(.zoom)
    try engine.block.setInAnimation(block, animation: zoomIn)
    try engine.block.setDuration(zoomIn, duration: 0.8)
  }

  let currentAnimation = try engine.block.getInAnimation(block)
  if engine.block.isValid(currentAnimation) {
    try engine.block.destroy(currentAnimation)
  }
  let newAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(block, animation: newAnimation)
}
```

Add motion to design elements by creating entrance, exit, and loop animations
using CE.SDK's animation system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.83.0-nightly.20260906/engine-guides-create-animations)

CE.SDK provides a unified animation system for adding motion to design elements. Animations are created as separate block instances and attached to target blocks using type-specific methods. You can apply entrance animations (how blocks appear), exit animations (how blocks leave), and loop animations (continuous motion while visible). Text blocks support additional properties for word-by-word or character-by-character reveals.

This guide covers how to create and configure animations programmatically, including entrance, exit, loop, and text animations with customizable timing and easing.

Use this page as the complete end-to-end workflow. The focused guides linked below cover base, text, editing, and animation-type details separately.

## Animation Fundamentals

Verify that a block supports animations before creating and attaching them. The basic pattern creates an animation instance with `createAnimation(_:)`, attaches it with the appropriate setter, and configures the duration with `setDuration(_:duration:)`.

```swift highlight-createAnimations-checkSupport
  guard try engine.block.supportsAnimation(block) else {
    return
  }

  let slideIn = try engine.block.createAnimation(.slide)
  try engine.block.setInAnimation(block, animation: slideIn)
  try engine.block.setDuration(slideIn, duration: 1.2)
```

Animation support is available for:

- **Graphic blocks** with image or video fills
- **Text blocks** with additional writing style options
- **Shape blocks** with fills

CE.SDK provides several animation presets:

- **Entrance animations**: `slide`, `fade`, `blur`, `zoom`, `pop`, `wipe`, `pan`
- **Exit animations**: same types as entrance
- **Loop animations**: `breathingLoop`, `spinLoop`, `fadeLoop`, `pulsatingLoop`, `jumpLoop`, `squeezeLoop`, `swayLoop`

## Entrance Animations

Entrance animations define how blocks appear on screen. Attach them with `setInAnimation(_:animation:)`. Configure the curve with the `animationEasing` property and, for `slide`, the `animation/slide/direction` property in radians.

```swift highlight-createAnimations-entranceAnimation
try engine.block.setEnum(slideIn, property: "animationEasing", value: "EaseOut")
try engine.block.setFloat(slideIn, property: "animation/slide/direction", value: 1.5 * .pi)
```

The `animationEasing` property accepts `Linear`, `EaseIn`, `EaseOut`, `EaseInOut`, and higher-order curves like `EaseOutQuint` and `EaseOutBack`. Call `getEnumValues(ofProperty: "animationEasing")` to enumerate the full list at runtime. Slide direction uses radians where `0` is right, `0.5 * .pi` is bottom, `.pi` is left, and `1.5 * .pi` is top — the snippet above slides the block in from the top.

## Exit Animations

Exit animations define how blocks leave the screen. Attach them with `setOutAnimation(_:animation:)`. CE.SDK manages timing automatically to prevent overlap between entrance and exit animations.

```swift highlight-createAnimations-exitAnimation
let fadeOut = try engine.block.createAnimation(.fade)
try engine.block.setOutAnimation(block, animation: fadeOut)
try engine.block.setDuration(fadeOut, duration: 1.0)
try engine.block.setEnum(fadeOut, property: "animationEasing", value: "EaseIn")
```

When a block has both entrance and exit animations, CE.SDK adjusts their timing based on the block's duration in the composition.

## Loop Animations

Loop animations run continuously while the block is visible. Use animation types ending in `Loop` and attach them with `setLoopAnimation(_:animation:)`.

```swift highlight-createAnimations-loopAnimation
let pulsatingLoop = try engine.block.createAnimation(.pulsatingLoop)
try engine.block.setLoopAnimation(block, animation: pulsatingLoop)
try engine.block.setDuration(pulsatingLoop, duration: 1.5)
```

Loop animations continue throughout the block's visible duration, creating continuous motion effects like breathing, spinning, or pulsating.

## Animation Properties

Each animation type exposes configurable properties. Use `setFloat(_:property:value:)` and `setEnum(_:property:value:)` to adjust them, and `findAllProperties(_:)` to discover available options. To enumerate the allowed values for an enum property, call `getEnumValues(ofProperty:)`.

```swift highlight-createAnimations-animationProperties
  let slideProperties = try engine.block.findAllProperties(slideIn)
  print("Slide animation properties: \(slideProperties)")

  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
  print("Available easing options: \(easingOptions)")
```

Common configurable properties include:

- **Direction**: Set in radians for slide animations (`0` = right, `0.5 * .pi` = bottom, `.pi` = left, `1.5 * .pi` = top)
- **Easing**: `Linear`, `EaseIn`, `EaseOut`, `EaseInOut`

## Text Animations

Text blocks support additional animation properties for granular control over how text appears. The `textAnimationWritingStyle` property controls whether the animation applies to the entire text, line by line, word by word, or character by character.

```swift highlight-createAnimations-textAnimation
  let text = try engine.block.create(.text)
  try engine.block.setPositionX(text, value: 100)
  try engine.block.setPositionY(text, value: 400)
  try engine.block.setWidth(text, value: 600)
  try engine.block.setHeight(text, value: 100)
  try engine.block.replaceText(text, text: "Entrance • Exit • Loop")
  try engine.block.appendChild(to: page, child: text)

  let textAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(text, animation: textAnimation)
  try engine.block.setDuration(textAnimation, duration: 1.5)
  try engine.block.setEnum(textAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(textAnimation, property: "textAnimationOverlap", value: 0.3)
```

Writing style options:

- **`Line`**: Animate entire lines together
- **`Word`**: Animate word by word
- **`Character`**: Animate character by character

The `textAnimationOverlap` property (`0` to `1`) controls the cascading effect. A value of `0` means sequential animation, while values closer to `1` create more overlap between segments.

## Managing Animation Lifecycle

Retrieve current animations with `getInAnimation(_:)`, `getOutAnimation(_:)`, and `getLoopAnimation(_:)`. An empty slot returns an invalid `DesignBlockID`; use `isValid(_:)` to detect it before calling other APIs on the handle. When replacing an animation, destroy the old instance with `destroy(_:)` to prevent memory leaks.

```swift highlight-createAnimations-manageLifecycle
  let currentIn = try engine.block.getInAnimation(block)
  let currentOut = try engine.block.getOutAnimation(block)
  let currentLoop = try engine.block.getLoopAnimation(block)
  print("Animation IDs — In: \(currentIn), Out: \(currentOut), Loop: \(currentLoop)")

  if engine.block.isValid(currentIn) {
    try engine.block.destroy(currentIn)
    let zoomIn = try engine.block.createAnimation(.zoom)
    try engine.block.setInAnimation(block, animation: zoomIn)
    try engine.block.setDuration(zoomIn, duration: 0.8)
  }
```

## Troubleshooting

### Animation Not Playing

Verify the block supports animations with `supportsAnimation(_:)`. Ensure playback is active on the page.

### Duration Issues

Set the duration on the animation instance, not on the target block. Attaching an entrance or exit animation first lets CE.SDK clamp its duration against the target block's visible duration and the opposing animation.

### Memory Leaks

When replacing an animation, destroy the old animation instance before creating a new one:

```swift highlight-createAnimations-replaceMemoryLeaks
let currentAnimation = try engine.block.getInAnimation(block)
if engine.block.isValid(currentAnimation) {
  try engine.block.destroy(currentAnimation)
}
let newAnimation = try engine.block.createAnimation(.fade)
try engine.block.setInAnimation(block, animation: newAnimation)
```

### Timing Conflicts

If entrance and exit animations seem to overlap incorrectly, CE.SDK automatically adjusts durations to prevent conflicts. Reduce individual animation durations if needed.

## API Reference

| Method                                        | Description                                 |
| --------------------------------------------- | ------------------------------------------- |
| `engine.block.createAnimation(_:)`            | Create animation instance                   |
| `engine.block.supportsAnimation(_:)`          | Check if block supports animations          |
| `engine.block.setInAnimation(_:animation:)`   | Attach entrance animation                   |
| `engine.block.setOutAnimation(_:animation:)`  | Attach exit animation                       |
| `engine.block.setLoopAnimation(_:animation:)` | Attach loop animation                       |
| `engine.block.getInAnimation(_:)`             | Get entrance animation (invalid ID if none) |
| `engine.block.getOutAnimation(_:)`            | Get exit animation (invalid ID if none)     |
| `engine.block.getLoopAnimation(_:)`           | Get loop animation (invalid ID if none)     |
| `engine.block.setDuration(_:duration:)`       | Set animation duration                      |
| `engine.block.getDuration(_:)`                | Get animation duration                      |
| `engine.block.setEnum(_:property:value:)`     | Set enum property (easing, writing style)   |
| `engine.block.setFloat(_:property:value:)`    | Set float property (direction, overlap)     |
| `engine.block.findAllProperties(_:)`          | List available properties                   |
| `engine.block.getEnumValues(ofProperty:)`     | Get enum options                            |
| `engine.block.destroy(_:)`                    | Destroy animation instance                  |

## Next Steps

- [Base Animations](./create/base.md) — Create and attach entrance, exit,
  and loop presets to non-text blocks.
- [Text Animations](./create/text.md) — Configure text-specific presets,
  writing styles, and overlap.
- [Edit Animations](./edit.md) — Inspect, update, replace, or remove
  an attached animation.
- [Supported Animation Types](./types.md) — Compare available presets
  and their properties.
- [Animation Overview](./overview.md) — Review the animation model and
  core concepts.



---

## Related Pages

- [Base Animations](./create/base.md) - Apply entrance, exit, and loop animation presets with duration, easing, and type-specific properties.
- [Text Animations](./create/text.md) - Animate text elements with effects like fade, typewriter, and bounce for dynamic visual presentation.


---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support