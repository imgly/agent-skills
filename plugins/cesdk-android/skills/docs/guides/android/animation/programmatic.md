> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Programmatic](./programmatic.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-programmatic-animations/ProgrammaticAnimations.kt reference-only
import ly.img.engine.AnimationEasingType
import ly.img.engine.AnimationType
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

data class ProgrammaticAnimations(
    val slideInType: String,
    val firstLoopType: String,
    val replacementLoopType: String,
    val outType: String,
    val slideDirection: Float,
    val slideDuration: Double,
    val slideEasing: String,
    val slideProperties: List<String>,
    val easingValues: List<String>,
    val textWritingStyle: String,
    val textOverlap: Float,
)

suspend fun programmaticAnimations(engine: Engine): ProgrammaticAnimations {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 1080F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.setDuration(block = page, duration = 5.0)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block = block, value = 290F)
    engine.block.setPositionY(block = block, value = 260F)
    engine.block.setWidth(block = block, value = 500F)
    engine.block.setHeight(block = block, value = 320F)
    engine.block.setDuration(block = block, duration = 4.0)
    engine.block.setFill(block = block, fill = engine.block.createFill(FillType.Color))
    engine.block.appendChild(parent = page, child = block)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = textBlock)
    engine.block.setPositionX(block = textBlock, value = 180F)
    engine.block.setPositionY(block = textBlock, value = 700F)
    engine.block.setWidth(block = textBlock, value = 720F)
    engine.block.setHeightMode(block = textBlock, mode = SizeMode.AUTO)
    engine.block.replaceText(textBlock, "Animate text one word at a time")

    check(engine.block.supportsAnimation(block)) {
        "This block does not support animations."
    }

    val slideInAnimation = engine.block.createAnimation(AnimationType.Slide)
    val breathingLoopAnimation = engine.block.createAnimation(AnimationType.BreathingLoop)
    val fadeOutAnimation = engine.block.createAnimation(AnimationType.Fade)

    engine.block.setInAnimation(block = block, animation = slideInAnimation)
    engine.block.setLoopAnimation(block = block, animation = breathingLoopAnimation)
    engine.block.setOutAnimation(block = block, animation = fadeOutAnimation)

    val slideProperties = engine.block.findAllProperties(slideInAnimation)
    val easingValues = engine.block.getEnumValues("animationEasing")

    check(slideProperties.contains("animation/slide/direction")) {
        "Slide animations do not expose animation/slide/direction."
    }
    check(easingValues.contains(AnimationEasingType.EASE_OUT.key)) {
        "The animationEasing enum does not expose ${AnimationEasingType.EASE_OUT.key}."
    }

    engine.block.setDuration(block = slideInAnimation, duration = 0.6)
    engine.block.setEnum(
        block = slideInAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_OUT.key,
    )
    // No type-safe Android helper exists for this animation-specific property yet.
    engine.block.setFloat(
        block = slideInAnimation,
        property = "animation/slide/direction",
        value = 0.5F * Math.PI.toFloat(),
    )

    val currentInAnimation = engine.block.getInAnimation(block)
    val currentLoopAnimation = engine.block.getLoopAnimation(block)
    val currentOutAnimation = engine.block.getOutAnimation(block)

    check(engine.block.isValid(currentInAnimation))
    val currentLoopType = engine.block.getType(currentLoopAnimation)

    val previousLoopAnimation = engine.block.getLoopAnimation(block)
    val squeezeLoopAnimation = engine.block.createAnimation(AnimationType.SqueezeLoop)

    engine.block.destroy(previousLoopAnimation)
    engine.block.setLoopAnimation(block = block, animation = squeezeLoopAnimation)

    val textAnimation = engine.block.createAnimation(AnimationType.Baseline)
    engine.block.setInAnimation(block = textBlock, animation = textAnimation)
    engine.block.setEnum(block = textAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setFloat(block = textAnimation, property = "textAnimationOverlap", value = 0.4F)

    val replacementLoopAnimation = engine.block.getLoopAnimation(block)

    check(engine.block.getType(currentInAnimation) == AnimationType.Slide.key)
    check(currentLoopType == AnimationType.BreathingLoop.key)
    check(engine.block.getType(replacementLoopAnimation) == AnimationType.SqueezeLoop.key)
    check(engine.block.getType(currentOutAnimation) == AnimationType.Fade.key)
    check(slideProperties.contains("animation/slide/direction"))
    check(easingValues.contains(AnimationEasingType.EASE_OUT.key))
    check(engine.block.getFloat(slideInAnimation, "animation/slide/direction") == 0.5F * Math.PI.toFloat())
    check(engine.block.getDuration(slideInAnimation) == 0.6)
    check(engine.block.getEnum(slideInAnimation, "animationEasing") == AnimationEasingType.EASE_OUT.key)
    check(engine.block.getEnum(textAnimation, "textAnimationWritingStyle") == "Word")
    check(engine.block.getFloat(textAnimation, "textAnimationOverlap") == 0.4F)

    return ProgrammaticAnimations(
        slideInType = engine.block.getType(currentInAnimation),
        firstLoopType = currentLoopType,
        replacementLoopType = engine.block.getType(replacementLoopAnimation),
        outType = engine.block.getType(currentOutAnimation),
        slideDirection = engine.block.getFloat(slideInAnimation, "animation/slide/direction"),
        slideDuration = engine.block.getDuration(slideInAnimation),
        slideEasing = engine.block.getEnum(slideInAnimation, "animationEasing"),
        slideProperties = slideProperties,
        easingValues = easingValues,
        textWritingStyle = engine.block.getEnum(textAnimation, "textAnimationWritingStyle"),
        textOverlap = engine.block.getFloat(textAnimation, "textAnimationOverlap"),
    )
}
```

Create, assign, inspect, and replace CE.SDK animations from Android code by
using CreativeEngine block APIs.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260822/engine-guides-programmatic-animations)

<EngineReferenceNote {...props} />

Programmatic animation control is useful for automation, templates, and custom mobile controls. Animations belong to video scenes and attach to design blocks through separate In, Loop, and Out slots.

## Check Animation Support

Check a target block before you create and attach animation objects. Not every block type supports animation, so the sample fails early when the selected block is not animatable.

```kotlin highlight-android-check-support
check(engine.block.supportsAnimation(block)) {
    "This block does not support animations."
}
```

## Create Typed Animations

Create animation objects with Android's typed `AnimationType` values instead of raw animation type strings. In and Out slots can use block animation types such as `Slide`, `Pan`, `Fade`, `Blur`, `Grow`, `Zoom`, `Pop`, `Wipe`, `Baseline`, `CropZoom`, `Spin`, and `KenBurns`; Loop slots use loop types such as `SpinLoop`, `FadeLoop`, `BlurLoop`, `PulsatingLoop`, `BreathingLoop`, `JumpLoop`, `SqueezeLoop`, `SwayLoop`, and `ScaleLoop`. See the [Base Animations](./create/base.md) catalog for the full list of supported block animation types.

```kotlin highlight-android-create-animations
val slideInAnimation = engine.block.createAnimation(AnimationType.Slide)
val breathingLoopAnimation = engine.block.createAnimation(AnimationType.BreathingLoop)
val fadeOutAnimation = engine.block.createAnimation(AnimationType.Fade)
```

## Attach Animations to Slots

Each design block has one In animation slot, one Loop animation slot, and one Out animation slot. Assign the animation object to the matching slot with `setInAnimation`, `setLoopAnimation`, or `setOutAnimation`.

```kotlin highlight-android-attach-animations
engine.block.setInAnimation(block = block, animation = slideInAnimation)
engine.block.setLoopAnimation(block = block, animation = breathingLoopAnimation)
engine.block.setOutAnimation(block = block, animation = fadeOutAnimation)
```

Setting a different animation for the same slot replaces that slot's association. Keep the previous animation handle if you plan to destroy or reuse it later.

## Configure Timing and Properties

Use `setDuration` for animation timing, `setEnum` for easing values, and type-specific property keys for properties such as slide direction. The sample also asks the engine which properties and easing values are available before relying on them.

```kotlin highlight-android-configure-properties
    val slideProperties = engine.block.findAllProperties(slideInAnimation)
    val easingValues = engine.block.getEnumValues("animationEasing")

    check(slideProperties.contains("animation/slide/direction")) {
        "Slide animations do not expose animation/slide/direction."
    }
    check(easingValues.contains(AnimationEasingType.EASE_OUT.key)) {
        "The animationEasing enum does not expose ${AnimationEasingType.EASE_OUT.key}."
    }

    engine.block.setDuration(block = slideInAnimation, duration = 0.6)
    engine.block.setEnum(
        block = slideInAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_OUT.key,
    )
    // No type-safe Android helper exists for this animation-specific property yet.
    engine.block.setFloat(
        block = slideInAnimation,
        property = "animation/slide/direction",
        value = 0.5F * Math.PI.toFloat(),
    )
```

The slide direction is stored in radians. In this example, `0.5F * Math.PI.toFloat()` makes the block slide along the vertical direction.

## Read and Replace Animations

Read the current slot handles when you need to inspect or replace animations. The returned handle can be passed to other block APIs, including `getType` and `isValid`.

```kotlin highlight-android-read-animations
    val currentInAnimation = engine.block.getInAnimation(block)
    val currentLoopAnimation = engine.block.getLoopAnimation(block)
    val currentOutAnimation = engine.block.getOutAnimation(block)

    check(engine.block.isValid(currentInAnimation))
    val currentLoopType = engine.block.getType(currentLoopAnimation)
```

Destroy detached animation objects when you replace them and no longer need them. Destroying a design block also destroys its attached animations, but standalone animation objects should be cleaned up explicitly.

```kotlin highlight-android-replace-animation
    val previousLoopAnimation = engine.block.getLoopAnimation(block)
    val squeezeLoopAnimation = engine.block.createAnimation(AnimationType.SqueezeLoop)

    engine.block.destroy(previousLoopAnimation)
    engine.block.setLoopAnimation(block = block, animation = squeezeLoopAnimation)
```

## Configure Text Animation Properties

Text animations use the same property APIs. The sample attaches `AnimationType.Baseline` to a text block; dedicated text animation presets also include `TypewriterText`, `BlockSwipeText`, `SpreadText`, and `MergeText`. `textAnimationWritingStyle` controls whether text animates as a block, by line, by word, or by character, and `textAnimationOverlap` controls the timing overlap between those segments.

```kotlin highlight-android-text-animation-properties
val textAnimation = engine.block.createAnimation(AnimationType.Baseline)
engine.block.setInAnimation(block = textBlock, animation = textAnimation)
engine.block.setEnum(block = textAnimation, property = "textAnimationWritingStyle", value = "Word")
engine.block.setFloat(block = textAnimation, property = "textAnimationOverlap", value = 0.4F)
```

For detailed text animation behavior and type coverage, continue with [Text Animations](./create/text.md).

## API Reference

| API | Purpose |
| --- | --- |
| `engine.block.supportsAnimation(block=_)` | Check whether a block supports animation slots. |
| `engine.block.createAnimation(type=_)` | Create an animation object from an `AnimationType`. |
| `engine.block.setInAnimation(block=_, animation=_)` | Attach an entrance animation. |
| `engine.block.setLoopAnimation(block=_, animation=_)` | Attach a looping animation. |
| `engine.block.setOutAnimation(block=_, animation=_)` | Attach an exit animation. |
| `engine.block.getInAnimation(block=_)` | Read the entrance animation handle. |
| `engine.block.getLoopAnimation(block=_)` | Read the looping animation handle. |
| `engine.block.getOutAnimation(block=_)` | Read the exit animation handle. |
| `engine.block.isValid(block=_)` | Check that a returned animation handle is still valid. |
| `engine.block.getType(block=_)` | Inspect an animation object's concrete type. |
| `engine.block.setDuration(block=_, duration=_)` | Set animation duration in seconds. |
| `engine.block.setEnum(block=_, property=_, value=_)` | Set enum properties such as easing or text writing style. |
| `engine.block.setFloat(block=_, property=_, value=_)` | Set numeric animation properties. |
| `engine.block.findAllProperties(block=_)` | Discover properties supported by an animation object. |
| `engine.block.getEnumValues(enumProperty=_)` | Discover enum values for a property. |
| `engine.block.destroy(block=_)` | Destroy an animation object when replacing or removing it. |

## Next Steps

- [Base Animations](./create/base.md) - Review the full catalog of block animation setup and type details.
- [Text Animations](./create/text.md) - Configure text-specific animation behavior.
- [Edit Animations](./edit.md) — Modify existing animations in CE.SDK by reading properties, changing duration and easing, adjusting direction, and replacing or removing animations from blocks.
- [Animation Overview](./overview.md) - Review the animation model and supported platforms.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support