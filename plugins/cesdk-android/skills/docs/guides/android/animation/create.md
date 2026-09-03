> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Create Animations](./create.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-create-animations/CreateAnimations.kt reference-only
import ly.img.engine.AnimationEasingType
import ly.img.engine.AnimationType
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

data class CreateAnimations(
    val supportsGraphicAnimation: Boolean,
    val slideDirection: Float,
    val slideEasing: String,
    val entranceDuration: Double,
    val exitDuration: Double,
    val loopAnimationType: String,
    val textWritingStyle: String,
    val textOverlap: Float,
    val replacedLoopAnimationIsValid: Boolean,
)

fun createAnimations(engine: Engine): CreateAnimations {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.setDuration(block = page, duration = 5.0)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block, value = 180F)
    engine.block.setPositionY(block, value = 180F)
    engine.block.setWidth(block, value = 360F)
    engine.block.setHeight(block, value = 360F)
    val fill = engine.block.createFill(FillType.Color)
    engine.block.setFill(block = block, fill = fill)
    engine.block.setFillSolidColor(block = block, color = Color.fromRGBA(r = 0.12F, g = 0.44F, b = 0.95F, a = 1F))
    engine.block.appendChild(parent = page, child = block)

    val supportsGraphicAnimation = engine.block.supportsAnimation(block)
    if (!supportsGraphicAnimation) {
        error("Graphic block does not support animations.")
    }

    val slideIn = engine.block.createAnimation(AnimationType.Slide)
    engine.block.setInAnimation(block = block, animation = slideIn)
    engine.block.setDuration(block = slideIn, duration = 1.0)

    val fadeOut = engine.block.createAnimation(AnimationType.Fade)
    engine.block.setOutAnimation(block = block, animation = fadeOut)
    engine.block.setDuration(block = fadeOut, duration = 0.75)
    engine.block.setEnum(
        block = fadeOut,
        property = "animationEasing",
        value = AnimationEasingType.EASE_IN.key,
    )

    val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
    engine.block.setLoopAnimation(block = block, animation = breathingLoop)
    engine.block.setDuration(block = breathingLoop, duration = 2.0)
    check(engine.block.getDuration(breathingLoop) == 2.0)

    val slideProperties = engine.block.findAllProperties(slideIn)
    if ("animation/slide/direction" in slideProperties) {
        engine.block.setFloat(
            block = slideIn,
            property = "animation/slide/direction",
            value = 1.5F * Math.PI.toFloat(),
        )
    }

    val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")
    check(AnimationEasingType.EASE_OUT.key in easingOptions)
    engine.block.setEnum(
        block = slideIn,
        property = "animationEasing",
        value = AnimationEasingType.EASE_OUT.key,
    )

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = textBlock)
    engine.block.setPositionX(textBlock, value = 160F)
    engine.block.setPositionY(textBlock, value = 620F)
    engine.block.setWidth(textBlock, value = 720F)
    engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
    engine.block.replaceText(
        textBlock,
        "Create animations\nline by line,\nword by word,\nor character by character.",
    )
    check(engine.block.supportsAnimation(textBlock))

    val groupedTextBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = groupedTextBlock)
    engine.block.setPositionX(groupedTextBlock, value = 160F)
    engine.block.setPositionY(groupedTextBlock, value = 820F)
    engine.block.setWidth(groupedTextBlock, value = 720F)
    engine.block.setHeightMode(groupedTextBlock, mode = SizeMode.AUTO)
    engine.block.replaceText(groupedTextBlock, "Reveal this line word by word.")
    check(engine.block.supportsAnimation(groupedTextBlock))

    val typewriterText = engine.block.createAnimation(AnimationType.TypewriterText)
    engine.block.setInAnimation(block = textBlock, animation = typewriterText)
    engine.block.setDuration(block = typewriterText, duration = 2.0)

    val wordReveal = engine.block.createAnimation(AnimationType.Baseline)
    engine.block.setInAnimation(block = groupedTextBlock, animation = wordReveal)
    engine.block.setEnum(
        block = wordReveal,
        property = "textAnimationWritingStyle",
        value = "Word",
    )
    engine.block.setFloat(
        block = wordReveal,
        property = "textAnimationOverlap",
        value = 0.4F,
    )

    val previousLoop = engine.block.getLoopAnimation(block)
    val spinLoop = engine.block.createAnimation(AnimationType.SpinLoop)
    engine.block.setLoopAnimation(block = block, animation = spinLoop)
    if (engine.block.isValid(previousLoop)) {
        engine.block.destroy(previousLoop)
    }

    val attachedIn = engine.block.getInAnimation(block)
    val attachedOut = engine.block.getOutAnimation(block)
    val attachedLoop = engine.block.getLoopAnimation(block)

    check(engine.block.isValid(attachedIn))
    check(engine.block.isValid(attachedOut))
    check(engine.block.isValid(attachedLoop))
    check(engine.block.getType(attachedIn) == AnimationType.Slide.key)
    check(engine.block.getType(attachedOut) == AnimationType.Fade.key)
    check(engine.block.getType(attachedLoop) == AnimationType.SpinLoop.key)
    check(engine.block.getEnum(slideIn, "animationEasing") == AnimationEasingType.EASE_OUT.key)
    check(engine.block.getEnum(fadeOut, "animationEasing") == AnimationEasingType.EASE_IN.key)
    check(engine.block.getType(typewriterText) == AnimationType.TypewriterText.key)
    check(engine.block.getEnum(wordReveal, "textAnimationWritingStyle") == "Word")
    check(engine.block.getFloat(wordReveal, "textAnimationOverlap") == 0.4F)
    check(engine.block.getDuration(attachedIn) == 1.0)
    check(engine.block.getDuration(attachedOut) == 0.75)

    return CreateAnimations(
        supportsGraphicAnimation = supportsGraphicAnimation,
        slideDirection = engine.block.getFloat(slideIn, "animation/slide/direction"),
        slideEasing = engine.block.getEnum(slideIn, "animationEasing"),
        entranceDuration = engine.block.getDuration(attachedIn),
        exitDuration = engine.block.getDuration(attachedOut),
        loopAnimationType = engine.block.getType(attachedLoop),
        textWritingStyle = engine.block.getEnum(wordReveal, "textAnimationWritingStyle"),
        textOverlap = engine.block.getFloat(wordReveal, "textAnimationOverlap"),
        replacedLoopAnimationIsValid = engine.block.isValid(previousLoop),
    )
}
```

Add motion to design elements by creating entrance, exit, and loop animations
using CE.SDK's animation system.

![Android create animations result preview showing the guide's animated graphic block and text blocks](https://img.ly/docs/cesdk/android/animation/create-15cf50/assets/android.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260903/engine-guides-create-animations)

<EngineReferenceNote {...props} />

CE.SDK creates animations as separate block instances and attaches them to target blocks. You can apply entrance animations that play when a block appears, exit animations that play before it leaves, and loop animations that run while it stays visible. Text blocks also support writing-style controls for whole-block, line, word, or character reveals.

This guide covers how to create and configure animations programmatically on Android, including timing, easing, type-specific properties, text animation settings, and lifecycle cleanup.

Use this page as the complete end-to-end workflow. The focused guides linked below cover base, text, editing, and animation-type details separately.

## Animation Fundamentals

Verify that a block supports animations before creating animation blocks for it. Once support is confirmed, create an animation with `createAnimation`, attach it to the target block, and configure the animation duration.

```kotlin highlight-android-check-support
val supportsGraphicAnimation = engine.block.supportsAnimation(block)
if (!supportsGraphicAnimation) {
    error("Graphic block does not support animations.")
}
```

Animation support is available for common visible design blocks:

- **Graphic blocks** with image, video, color, or other fills
- **Text blocks** with additional writing-style options
- **Shape-backed graphics** whose graphic block uses a vector shape

CE.SDK exposes animation presets through `AnimationType`:

- **Entrance and exit animations**: `Slide`, `Pan`, `Fade`, `Blur`, `Grow`, `Zoom`, `Pop`, `Wipe`, `Baseline`, `CropZoom`, `Spin`, `KenBurns`
- **Text-only animations**: `TypewriterText`, `BlockSwipeText`, `SpreadText`, `MergeText`
- **Loop animations**: `SpinLoop`, `FadeLoop`, `BlurLoop`, `PulsatingLoop`, `BreathingLoop`, `JumpLoop`, `SqueezeLoop`, `SwayLoop`, `ScaleLoop`

## Entrance Animations

Entrance animations define how blocks appear on screen. Create the animation, attach it with `setInAnimation`, and set its duration in seconds.

```kotlin highlight-android-entrance-animation
val slideIn = engine.block.createAnimation(AnimationType.Slide)
engine.block.setInAnimation(block = block, animation = slideIn)
engine.block.setDuration(block = slideIn, duration = 1.0)
```

The animation duration controls how long the entrance effect runs after the target block becomes visible.

## Exit Animations

Exit animations define how blocks leave the scene. Attach them with `setOutAnimation`; CE.SDK coordinates entrance and exit timing against the block's visible duration.

```kotlin highlight-android-exit-animation
val fadeOut = engine.block.createAnimation(AnimationType.Fade)
engine.block.setOutAnimation(block = block, animation = fadeOut)
engine.block.setDuration(block = fadeOut, duration = 0.75)
engine.block.setEnum(
    block = fadeOut,
    property = "animationEasing",
    value = AnimationEasingType.EASE_IN.key,
)
```

When a block has both entrance and exit animations, CE.SDK adjusts their durations against the block's visible time range to prevent overlap.

## Loop Animations

Loop animations run while the block remains visible. Use a loop animation type, then attach it with `setLoopAnimation`.

```kotlin highlight-android-loop-animation
val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
engine.block.setLoopAnimation(block = block, animation = breathingLoop)
engine.block.setDuration(block = breathingLoop, duration = 2.0)
```

The loop animation duration controls one cycle of the repeated motion. Loop animations can run at the same time as entrance and exit animations, which makes them useful for subtle continuous motion.

## Animation Properties

Animation blocks expose type-specific properties. Use `findAllProperties` before writing a property such as slide direction, and use `getEnumValues` to inspect enum-backed options like easing curves.

```kotlin highlight-android-animation-properties
    val slideProperties = engine.block.findAllProperties(slideIn)
    if ("animation/slide/direction" in slideProperties) {
        engine.block.setFloat(
            block = slideIn,
            property = "animation/slide/direction",
            value = 1.5F * Math.PI.toFloat(),
        )
    }

    val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")
    check(AnimationEasingType.EASE_OUT.key in easingOptions)
    engine.block.setEnum(
        block = slideIn,
        property = "animationEasing",
        value = AnimationEasingType.EASE_OUT.key,
    )
```

Common configurable properties include:

- **Direction**: Slide animations use radians as the motion direction (`0` = slides right and enters from the left, `0.5 * PI` = slides down and enters from the top, `PI` = slides left and enters from the right, `1.5 * PI` = slides up and enters from the bottom).
- **Easing**: `AnimationEasingType` includes `Linear`, the base `EaseIn`, `EaseOut`, and `EaseInOut` curves, and higher-order `Quart`, `Quint`, `Back`, and `Spring` families such as `EaseOutQuint`, `EaseOutBack`, and `EaseInOutSpring`. Call `engine.block.getEnumValues(enumProperty="animationEasing")` to enumerate the full list at runtime.

## Text Animations

Text blocks support text-only animation presets such as `TypewriterText`, `BlockSwipeText`, `SpreadText`, and `MergeText`. For text-capable entrance and exit animations, set `textAnimationWritingStyle` to `Block`, `Line`, `Word`, or `Character` to control how the animation is grouped, and set `textAnimationOverlap` to control how much consecutive segments overlap.

```kotlin highlight-android-text-animation
    val typewriterText = engine.block.createAnimation(AnimationType.TypewriterText)
    engine.block.setInAnimation(block = textBlock, animation = typewriterText)
    engine.block.setDuration(block = typewriterText, duration = 2.0)

    val wordReveal = engine.block.createAnimation(AnimationType.Baseline)
    engine.block.setInAnimation(block = groupedTextBlock, animation = wordReveal)
    engine.block.setEnum(
        block = wordReveal,
        property = "textAnimationWritingStyle",
        value = "Word",
    )
    engine.block.setFloat(
        block = wordReveal,
        property = "textAnimationOverlap",
        value = 0.4F,
    )
```

An overlap value of `0` keeps segments sequential. Values closer to `1` make more of the segment animations run at the same time.

## Managing Animation Lifecycle

Read current animations with `getInAnimation`, `getOutAnimation`, or `getLoopAnimation` before replacing them. After assigning a replacement, destroy the previously attached animation block so it does not remain in the scene graph unused.

```kotlin highlight-android-manage-lifecycle
val previousLoop = engine.block.getLoopAnimation(block)
val spinLoop = engine.block.createAnimation(AnimationType.SpinLoop)
engine.block.setLoopAnimation(block = block, animation = spinLoop)
if (engine.block.isValid(previousLoop)) {
    engine.block.destroy(previousLoop)
}
```

Invalid handles mean that no animation is attached for that slot.

## Troubleshooting

### Animation Not Playing

Verify the target block with `supportsAnimation`. Also check that the block is visible during playback and that the animation duration fits inside the block's visible duration.

### Duration Issues

Set the duration on the animation block, not on the target block. Attaching an entrance or exit animation first lets CE.SDK clamp its duration against the target block's visible duration and the opposing animation.

### Memory Leaks

Destroy a replaced animation block after assigning its replacement. Replacing a block's animation detaches the old animation instance but does not automatically destroy it.

### Timing Conflicts

Entrance and exit animations share the target block's visible time range. If they seem to overlap incorrectly, CE.SDK automatically adjusts durations to prevent conflicts. Reduce individual animation durations if needed.

## API Reference

| Method                                                                          | Purpose                                                                       |
| ------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| `engine.block.supportsAnimation(block=_)`                                       | Check whether a block can use animations.                                     |
| `engine.block.createAnimation(type=_)`                                          | Create an animation block for a supported `AnimationType`.                    |
| `engine.block.setInAnimation(block=_, animation=_)`                             | Attach an entrance animation.                                                 |
| `engine.block.setOutAnimation(block=_, animation=_)`                            | Attach an exit animation.                                                     |
| `engine.block.setLoopAnimation(block=_, animation=_)`                           | Attach a loop animation.                                                      |
| `engine.block.getInAnimation(block=_)`                                          | Read the current entrance animation handle.                                   |
| `engine.block.getOutAnimation(block=_)`                                         | Read the current exit animation handle.                                       |
| `engine.block.getLoopAnimation(block=_)`                                        | Read the current loop animation handle.                                       |
| `engine.block.setDuration(block=_, duration=_)`                                 | Set an animation duration in seconds.                                         |
| `engine.block.getDuration(block=_)`                                             | Read an animation duration in seconds.                                        |
| `engine.block.findAllProperties(block=_)`                                       | Discover properties supported by a specific animation block.                  |
| `engine.block.getEnumValues(enumProperty="animationEasing")`                    | List allowed enum values for a property.                                      |
| `engine.block.setEnum(block=_, property="animationEasing", value=_)`            | Configure an enum animation property such as easing.                          |
| `engine.block.setEnum(block=_, property="textAnimationWritingStyle", value=_)`  | Configure text animation grouping as `Block`, `Line`, `Word`, or `Character`. |
| `engine.block.setFloat(block=_, property="animation/slide/direction", value=_)` | Configure slide direction in radians.                                         |
| `engine.block.setFloat(block=_, property="textAnimationOverlap", value=_)`      | Configure overlap between text animation segments.                            |
| `engine.block.isValid(block=_)`                                                 | Check whether an animation handle still points to a valid block.              |
| `engine.block.destroy(block=_)`                                                 | Destroy a detached or replaced animation block.                               |

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

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support