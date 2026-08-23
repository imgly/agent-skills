> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Edit Animations](./edit.md)

---

```swift file=@cesdk_swift_examples/engine-guides-edit-animations/EditAnimations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func editAnimations(engine: Engine) async throws {
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

  let slideAnimation = try engine.block.createAnimation(.slide)
  try engine.block.setInAnimation(block, animation: slideAnimation)
  try engine.block.setDuration(slideAnimation, duration: 1.0)

  let fadeOutAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setOutAnimation(block, animation: fadeOutAnimation)

  let breathingLoop = try engine.block.createAnimation(.breathingLoop)
  try engine.block.setLoopAnimation(block, animation: breathingLoop)

  let inAnimation = try engine.block.getInAnimation(block)
  let outAnimation = try engine.block.getOutAnimation(block)
  let loopAnimation = try engine.block.getLoopAnimation(block)
  let inType = try engine.block.getType(inAnimation)
  let outType = try engine.block.getType(outAnimation)

  let currentDuration = try engine.block.getDuration(inAnimation)
  let currentEasing = try engine.block.getEnum(inAnimation, property: "animationEasing")
  let allProperties = try engine.block.findAllProperties(inAnimation)

  try engine.block.setDuration(inAnimation, duration: 0.8)
  try engine.block.setDuration(loopAnimation, duration: 2.0)

  try engine.block.setEnum(inAnimation, property: "animationEasing", value: "EaseOut")
  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")

  try engine.block.setFloat(
    inAnimation,
    property: "animation/slide/direction",
    value: .pi,
  )
  let direction = try engine.block.getFloat(inAnimation, property: "animation/slide/direction")

  let currentIn = try engine.block.getInAnimation(block)
  try engine.block.destroy(currentIn)
  let zoomAnimation = try engine.block.createAnimation(.zoom)
  try engine.block.setInAnimation(block, animation: zoomAnimation)
  try engine.block.setDuration(zoomAnimation, duration: 0.6)
  try engine.block.setEnum(zoomAnimation, property: "animationEasing", value: "EaseInOut")

  let currentLoop = try engine.block.getLoopAnimation(block)
  try engine.block.destroy(currentLoop)

  _ = (outType, inType, currentDuration, currentEasing, allProperties, easingOptions, direction, outAnimation)
}
```

Modify existing animations by reading properties, changing duration and easing, and replacing or removing animations from blocks.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/engine-guides-edit-animations)

Editing animations in CE.SDK involves retrieving existing animations from blocks and modifying their properties. This guide assumes you've already created and attached animations to blocks as covered in the [Base Animations](./create/base.md) guide.

This guide covers retrieving animations, reading and modifying properties, changing easing functions, adjusting animation-specific settings, and replacing or removing animations.

## Retrieving Animations

Before modifying an animation, retrieve it from the block using `getInAnimation`, `getOutAnimation`, or `getLoopAnimation`. Each returns an invalid `DesignBlockID` when no animation is attached to that slot, so guard with `if engine.block.isValid(animation)` before calling other APIs on the handle — `getType` and `getDuration` throw on an invalid handle. Once you have a valid handle, `getType` identifies the animation type (`//ly.img.ubq/animation/slide`, `//ly.img.ubq/animation/fade`, etc.). The example below skips the guard because all three slots were just populated in the same function; in production code, where a slot may be empty, always guard.

```swift highlight-editAnimations-retrieveAnimations
let inAnimation = try engine.block.getInAnimation(block)
let outAnimation = try engine.block.getOutAnimation(block)
let loopAnimation = try engine.block.getLoopAnimation(block)
let inType = try engine.block.getType(inAnimation)
let outType = try engine.block.getType(outAnimation)
```

## Reading Animation Properties

Inspect current animation settings using property getters. `getDuration` returns the animation length in seconds, while `getEnum` retrieves values like easing functions. Use `findAllProperties` to discover all configurable properties for an animation.

```swift highlight-editAnimations-readProperties
let currentDuration = try engine.block.getDuration(inAnimation)
let currentEasing = try engine.block.getEnum(inAnimation, property: "animationEasing")
let allProperties = try engine.block.findAllProperties(inAnimation)
```

Different animation types expose different properties — slide animations have direction, while loop animations may have intensity or scale properties.

## Modifying Animation Duration

Change animation timing with `setDuration`. The duration is specified in seconds.

```swift highlight-editAnimations-modifyDuration
try engine.block.setDuration(inAnimation, duration: 0.8)
try engine.block.setDuration(loopAnimation, duration: 2.0)
```

When modifying In or Out animation durations, CE.SDK automatically adjusts the paired animation to prevent overlap. For loop animations, the duration defines the cycle length.

## Changing Easing Functions

Easing controls animation acceleration. Use `setEnum` with the `"animationEasing"` property to change it.

```swift highlight-editAnimations-changeEasing
try engine.block.setEnum(inAnimation, property: "animationEasing", value: "EaseOut")
let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
```

Use `getEnumValues(ofProperty: "animationEasing")` to discover available options:

| Easing | Description |
| --- | --- |
| `Linear` | Constant speed throughout |
| `EaseIn` | Starts slow, accelerates toward the end |
| `EaseOut` | Starts fast, decelerates toward the end |
| `EaseInOut` | Starts slow, speeds up, then slows down again |

## Adjusting Animation-Specific Properties

Each animation type has unique configurable properties. For slide animations, change the entry direction using `setFloat` on `"animation/slide/direction"`. The value is the angle in radians that the block travels along during entrance — the block starts off-screen on the opposite side and slides in:

- `0` — Slides right (enters from the left)
- `0.5 * .pi` — Slides down (enters from the top)
- `.pi` — Slides left (enters from the right)
- `1.5 * .pi` — Slides up (enters from the bottom)

```swift highlight-editAnimations-adjustProperties
try engine.block.setFloat(
  inAnimation,
  property: "animation/slide/direction",
  value: .pi,
)
let direction = try engine.block.getFloat(inAnimation, property: "animation/slide/direction")
```

For text animations, adjust `"textAnimationWritingStyle"` (Block, Line, Word, Character) and `"textAnimationOverlap"` (0 for sequential, 1 for simultaneous) — see [Text Animations](./create/text.md) for details.

## Replacing Animations

To swap an animation type, destroy the existing animation before setting a new one. This prevents memory leaks from orphaned animation objects.

```swift highlight-editAnimations-replaceAnimation
let currentIn = try engine.block.getInAnimation(block)
try engine.block.destroy(currentIn)
let zoomAnimation = try engine.block.createAnimation(.zoom)
try engine.block.setInAnimation(block, animation: zoomAnimation)
try engine.block.setDuration(zoomAnimation, duration: 0.6)
try engine.block.setEnum(zoomAnimation, property: "animationEasing", value: "EaseInOut")
```

## Removing Animations

Remove an animation by destroying it with `destroy`. After destruction, the getter returns an invalid `DesignBlockID` for that slot — `isValid(_:)` reports `false`.

```swift highlight-editAnimations-removeAnimation
let currentLoop = try engine.block.getLoopAnimation(block)
try engine.block.destroy(currentLoop)
```

Destroying a design block automatically destroys all its attached animations. Detached animations must be destroyed manually to free memory.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.getInAnimation(block)` | Get entrance animation ID (invalid ID if none) |
| `engine.block.getOutAnimation(block)` | Get exit animation ID (invalid ID if none) |
| `engine.block.getLoopAnimation(block)` | Get loop animation ID (invalid ID if none) |
| `engine.block.getType(anim)` | Get animation type string |
| `engine.block.getDuration(anim)` | Get animation duration in seconds |
| `engine.block.setDuration(anim, duration:)` | Set animation duration |
| `engine.block.getEnum(anim, property:)` | Get enum property value |
| `engine.block.setEnum(anim, property:, value:)` | Set enum property value |
| `engine.block.getFloat(anim, property:)` | Get float property value |
| `engine.block.setFloat(anim, property:, value:)` | Set float property value |
| `engine.block.findAllProperties(anim)` | Get all available properties |
| `engine.block.getEnumValues(ofProperty:)` | Get available values for an enum property |
| `engine.block.destroy(anim)` | Destroy animation and free memory |

## Next Steps

- [Supported Animation Types](./types.md) — Explore the animation types available in CE.SDK and their configurable properties
- [Base Animations](./create/base.md) — Create entrance, exit, and loop animations
- [Text Animations](./create/text.md) — Animate text with writing styles and character control
- [Animation Overview](./overview.md) — Understand animation concepts and capabilities



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support