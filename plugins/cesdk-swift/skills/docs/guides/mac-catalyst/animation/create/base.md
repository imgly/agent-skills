> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Animation](../../animation.md) > [Create Animations](../create.md) > [Base Animations](./base.md)

---

```swift file=@cesdk_swift_examples/engine-guides-base-animations/BaseAnimations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func baseAnimations(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 800)
  try engine.block.setHeight(page, value: 600)
  try engine.block.appendChild(to: scene, child: page)

  try await engine.scene.zoom(to: page, paddingLeft: 40, paddingTop: 40, paddingRight: 40, paddingBottom: 40)

  let baseURL = try engine.guidesBaseURL

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
  try engine.block.setDuration(slideIn, duration: 1.0)

  let fadeIn = try engine.block.createAnimation(.fade)
  try engine.block.destroy(engine.block.getInAnimation(block))
  try engine.block.setInAnimation(block, animation: fadeIn)
  try engine.block.setDuration(fadeIn, duration: 0.8)
  try engine.block.setEnum(fadeIn, property: "animationEasing", value: "EaseOut")

  let fadeOut = try engine.block.createAnimation(.fade)
  try engine.block.setOutAnimation(block, animation: fadeOut)
  try engine.block.setDuration(fadeOut, duration: 0.6)

  let breathing = try engine.block.createAnimation(.breathingLoop)
  try engine.block.setLoopAnimation(block, animation: breathing)
  try engine.block.setDuration(breathing, duration: 2.0)

  let slideFromTop = try engine.block.createAnimation(.slide)
  let slideProperties = try engine.block.findAllProperties(slideFromTop)
  print("Slide animation properties: \(slideProperties)")
  try engine.block.setFloat(slideFromTop, property: "animation/slide/direction", value: 0.5 * .pi)

  let currentIn = try engine.block.getInAnimation(block)
  let currentLoop = try engine.block.getLoopAnimation(block)
  let currentOut = try engine.block.getOutAnimation(block)
  print("Animation IDs — In: \(currentIn), Loop: \(currentLoop), Out: \(currentOut)")

  if engine.block.isValid(currentLoop) {
    try engine.block.destroy(currentLoop)
  }
  let squeeze = try engine.block.createAnimation(.squeezeLoop)
  try engine.block.setLoopAnimation(block, animation: squeeze)
  // Destroying a design block also destroys all its attached animations:
  // try engine.block.destroy(block)

  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
  print("Available easing options: \(easingOptions)")
  try engine.block.setEnum(fadeIn, property: "animationEasing", value: "EaseInOut")

  try engine.block.destroy(slideFromTop)
}
```

Add motion to design blocks with entrance, exit, and loop animations using
CE.SDK's animation system.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260810/engine-guides-base-animations)

Base animations in CE.SDK add motion to design blocks through entrance (In), exit (Out), and loop animations. Animations are created as separate objects and attached to blocks, enabling reusable configurations across multiple elements.

This guide covers creating animations, attaching them to blocks, configuring properties like duration and easing, and managing animation lifecycle.

## Animation Fundamentals

Before applying animations to a block, verify it supports them using `supportsAnimation`. Once confirmed, create an animation instance with `createAnimation`, attach it with `setInAnimation`, and set its length with `setDuration`.

```swift highlight-baseAnim-supports
guard try engine.block.supportsAnimation(block) else {
  return
}
let slideIn = try engine.block.createAnimation(.slide)
try engine.block.setInAnimation(block, animation: slideIn)
try engine.block.setDuration(slideIn, duration: 1.0)
```

CE.SDK provides several animation types via the `AnimationType` enum:

- **Entrance animations:** `.slide`, `.fade`, `.blur`, `.grow`, `.zoom`, `.pop`, `.wipe`, `.pan`, `.baseline`, `.spin`
- **Loop animations:** `.spinLoop`, `.fadeLoop`, `.blurLoop`, `.pulsatingLoop`, `.breathingLoop`, `.jumpLoop`, `.squeezeLoop`, `.swayLoop`

## Entrance Animations

Entrance animations (In animations) define how a block appears on screen. Create the animation, attach it with `setInAnimation`, and configure its properties. When replacing an existing entrance animation, destroy the previous one with `destroy(getInAnimation(block))` before calling `setInAnimation` again — otherwise the old animation object leaks (see [Managing Animation Lifecycle](./base.md#managing-animation-lifecycle)).

```swift highlight-baseAnim-entrance
let fadeIn = try engine.block.createAnimation(.fade)
try engine.block.destroy(engine.block.getInAnimation(block))
try engine.block.setInAnimation(block, animation: fadeIn)
try engine.block.setDuration(fadeIn, duration: 0.8)
try engine.block.setEnum(fadeIn, property: "animationEasing", value: "EaseOut")
```

`setEnum` configures the easing function. Available options include `"Linear"`, `"EaseIn"`, `"EaseOut"`, and `"EaseInOut"`. The `"EaseOut"` easing starts fast and slows down toward the end, creating a natural deceleration effect.

## Exit Animations

Exit animations (Out animations) define how a block leaves the screen. Use `setOutAnimation` to attach them.

```swift highlight-baseAnim-exit
let fadeOut = try engine.block.createAnimation(.fade)
try engine.block.setOutAnimation(block, animation: fadeOut)
try engine.block.setDuration(fadeOut, duration: 0.6)
```

When using both entrance and exit animations, CE.SDK automatically manages their timing to prevent overlap. Changing the duration of an In animation may adjust the Out animation's duration to maintain valid timing.

## Loop Animations

Loop animations run continuously while the block is visible. Use `setLoopAnimation` to attach them.

```swift highlight-baseAnim-loop
let breathing = try engine.block.createAnimation(.breathingLoop)
try engine.block.setLoopAnimation(block, animation: breathing)
try engine.block.setDuration(breathing, duration: 2.0)
```

The duration for loop animations defines the length of each cycle. A 2-second breathing loop completes one full pulse every 2 seconds.

## Animation Properties

Each animation type has specific configurable properties. Use `findAllProperties` to discover available properties for an animation, and `setFloat` or `setEnum` to modify them.

```swift highlight-baseAnim-properties
let slideFromTop = try engine.block.createAnimation(.slide)
let slideProperties = try engine.block.findAllProperties(slideFromTop)
print("Slide animation properties: \(slideProperties)")
try engine.block.setFloat(slideFromTop, property: "animation/slide/direction", value: 0.5 * .pi)
```

For slide animations, the `animation/slide/direction` property is the angle in radians that the block travels along during entrance — the block starts off-screen on the opposite side and slides in:

- `0` — Slides right (enters from the left)
- `0.5 * .pi` — Slides down (enters from the top)
- `.pi` — Slides left (enters from the right)
- `1.5 * .pi` — Slides up (enters from the bottom)

## Managing Animation Lifecycle

Animation objects must be properly managed to avoid memory leaks. When replacing an animation, destroy the old one before setting the new one. Retrieve current animations using `getInAnimation`, `getOutAnimation`, and `getLoopAnimation`.

```swift highlight-baseAnim-manage
  let currentIn = try engine.block.getInAnimation(block)
  let currentLoop = try engine.block.getLoopAnimation(block)
  let currentOut = try engine.block.getOutAnimation(block)
  print("Animation IDs — In: \(currentIn), Loop: \(currentLoop), Out: \(currentOut)")

  if engine.block.isValid(currentLoop) {
    try engine.block.destroy(currentLoop)
  }
  let squeeze = try engine.block.createAnimation(.squeezeLoop)
  try engine.block.setLoopAnimation(block, animation: squeeze)
  // Destroying a design block also destroys all its attached animations:
  // try engine.block.destroy(block)
```

These getters return an invalid `DesignBlockID` when no animation is attached. Use `engine.block.isValid(_:)` to check for that case — it reports `false` for the null sentinel that the getters return in the empty slot. Destroying a design block also destroys all of its attached animations, but detached animations must be destroyed manually.

## Easing Functions

Query available easing options using `getEnumValues(ofProperty:)`.

```swift highlight-baseAnim-easing
let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
print("Available easing options: \(easingOptions)")
try engine.block.setEnum(fadeIn, property: "animationEasing", value: "EaseInOut")
```

Easing functions control animation acceleration:

| Easing      | Description                                   |
| ----------- | --------------------------------------------- |
| `Linear`    | Constant speed throughout                     |
| `EaseIn`    | Starts slow, accelerates toward the end       |
| `EaseOut`   | Starts fast, decelerates toward the end       |
| `EaseInOut` | Starts slow, speeds up, then slows down again |

## Troubleshooting

### Animation Not Playing

Verify that the target block supports animations, is visible during page playback, and has enough visible time for the animation duration.

### Duration Issues

Set the duration on the animation instance, not on the target design block. Attaching an entrance or exit animation first lets CE.SDK clamp its duration against the target block's visible duration and the opposing animation.

## API Reference

| Method                                        | Description                               |
| --------------------------------------------- | ----------------------------------------- |
| `engine.block.createAnimation(_:)`            | Create a new animation instance           |
| `engine.block.supportsAnimation(_:)`          | Check if a block supports animations      |
| `engine.block.setInAnimation(_:animation:)`   | Apply entrance animation to a block       |
| `engine.block.setOutAnimation(_:animation:)`  | Apply exit animation to a block           |
| `engine.block.setLoopAnimation(_:animation:)` | Apply loop animation to a block           |
| `engine.block.getInAnimation(_:)`             | Get the entrance animation ID             |
| `engine.block.getOutAnimation(_:)`            | Get the exit animation ID                 |
| `engine.block.getLoopAnimation(_:)`           | Get the loop animation ID                 |
| `engine.block.setDuration(_:duration:)`       | Set animation duration in seconds         |
| `engine.block.getDuration(_:)`                | Get animation duration                    |
| `engine.block.setEnum(_:property:value:)`     | Set an enum property (easing, etc.)       |
| `engine.block.setFloat(_:property:value:)`    | Set a float property (direction, etc.)    |
| `engine.block.findAllProperties(_:)`          | Get all configurable properties           |
| `engine.block.getEnumValues(ofProperty:)`     | Get available values for an enum property |
| `engine.block.destroy(_:)`                    | Destroy an animation instance             |

## Next Steps

- [Supported Animation Types](../types.md) — Explore the animation
  types available in CE.SDK and their configurable properties
- [Text Animations](./text.md) — Animate text with writing styles
  and character-level control
- [Animation Overview](../overview.md) — Understand animation concepts
  and capabilities
- [Edit Animations](../edit.md) — Modify existing animations on
  blocks



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support