> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Edit Animations](./edit.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-edit-animations/EditAnimations.kt reference-only
import ly.img.engine.AnimationEasingType
import ly.img.engine.AnimationType
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType

suspend fun editAnimations(engine: Engine): EditAnimationsSummary {
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(block = page, value = 800F)
    engine.block.setHeight(block = page, value = 600F)
    engine.block.setDuration(block = page, duration = 5.0)

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.appendChild(parent = page, child = block)
    engine.block.setShape(block = block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block = block, value = 100F)
    engine.block.setPositionY(block = block, value = 80F)
    engine.block.setWidth(block = block, value = 320F)
    engine.block.setHeight(block = block, value = 240F)

    val fill = engine.block.createFill(FillType.Color)
    engine.block.setColor(
        block = fill,
        property = "fill/color/value",
        value = Color.fromRGBA(r = 0.12F, g = 0.38F, b = 0.95F, a = 1F),
    )
    engine.block.setFill(block = block, fill = fill)

    check(engine.block.supportsAnimation(block = block))

    val slideInAnimation = engine.block.createAnimation(AnimationType.Slide)
    val fadeOutAnimation = engine.block.createAnimation(AnimationType.Fade)
    val breathingLoopAnimation = engine.block.createAnimation(AnimationType.BreathingLoop)

    engine.block.setInAnimation(block = block, animation = slideInAnimation)
    engine.block.setOutAnimation(block = block, animation = fadeOutAnimation)
    engine.block.setLoopAnimation(block = block, animation = breathingLoopAnimation)

    engine.block.setDuration(block = slideInAnimation, duration = 1.0)
    engine.block.setDuration(block = fadeOutAnimation, duration = 0.6)
    engine.block.setDuration(block = breathingLoopAnimation, duration = 1.5)
    engine.block.setEnum(
        block = slideInAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_OUT.key,
    )

    val inAnimation = engine.block.getInAnimation(block = block)
    val outAnimation = engine.block.getOutAnimation(block = block)
    val loopAnimation = engine.block.getLoopAnimation(block = block)

    check(engine.block.isValid(block = inAnimation)) { "Expected an In animation." }
    check(engine.block.isValid(block = outAnimation)) { "Expected an Out animation." }
    check(engine.block.isValid(block = loopAnimation)) { "Expected a Loop animation." }

    val inAnimationType = engine.block.getType(block = inAnimation)
    val outAnimationType = engine.block.getType(block = outAnimation)
    val loopAnimationType = engine.block.getType(block = loopAnimation)

    val initialDuration = engine.block.getDuration(block = inAnimation)
    val initialEasing = engine.block.getEnum(
        block = inAnimation,
        property = "animationEasing",
    )
    val slideProperties = engine.block.findAllProperties(block = inAnimation)

    engine.block.setDuration(block = inAnimation, duration = 0.8)
    engine.block.setDuration(block = loopAnimation, duration = 2.0)
    val updatedDuration = engine.block.getDuration(block = inAnimation)

    // animationEasing is the Engine property key for animation acceleration curves.
    engine.block.setEnum(
        block = inAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_IN_OUT.key,
    )
    val updatedEasing = engine.block.getEnum(
        block = inAnimation,
        property = "animationEasing",
    )
    val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")

    // Slide direction is exposed as radians.
    engine.block.setFloat(
        block = inAnimation,
        property = "animation/slide/direction",
        value = Math.PI.toFloat(),
    )
    val slideDirection = engine.block.getFloat(
        block = inAnimation,
        property = "animation/slide/direction",
    )
    // Slide fade is exposed as a boolean property.
    engine.block.setBoolean(
        block = inAnimation,
        property = "animation/slide/fade",
        value = true,
    )
    val slideFade = engine.block.getBoolean(
        block = inAnimation,
        property = "animation/slide/fade",
    )

    val currentInAnimation = engine.block.getInAnimation(block = block)
    if (engine.block.isValid(block = currentInAnimation)) {
        engine.block.destroy(block = currentInAnimation)
    }

    val zoomAnimation = engine.block.createAnimation(type = AnimationType.Zoom)
    engine.block.setInAnimation(block = block, animation = zoomAnimation)
    engine.block.setDuration(block = zoomAnimation, duration = 0.6)
    engine.block.setEnum(
        block = zoomAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_IN_OUT.key,
    )

    val replacementType = engine.block.getType(
        block = engine.block.getInAnimation(block = block),
    )

    val currentLoopAnimation = engine.block.getLoopAnimation(block = block)
    if (engine.block.isValid(block = currentLoopAnimation)) {
        engine.block.destroy(block = currentLoopAnimation)
    }

    val loopAnimationRemoved = !engine.block.isValid(
        block = engine.block.getLoopAnimation(block = block),
    )

    return EditAnimationsSummary(
        inAnimationType = inAnimationType,
        outAnimationType = outAnimationType,
        loopAnimationType = loopAnimationType,
        initialDuration = initialDuration,
        updatedDuration = updatedDuration,
        initialEasing = initialEasing,
        updatedEasing = updatedEasing,
        easingOptions = easingOptions,
        slideProperties = slideProperties,
        slideDirection = slideDirection,
        slideFade = slideFade,
        replacementType = replacementType,
        loopAnimationRemoved = loopAnimationRemoved,
    )
}
```

Modify existing animations by reading properties, changing duration and easing,
and replacing or removing animations from Android design blocks.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260809/engine-guides-edit-animations)

<EngineReferenceNote {...props} />

Editing animations in Android uses the same block API model as creating animations: retrieve the attached animation block, inspect its properties, then update or replace that animation block. This guide assumes you already attached In, Out, or Loop animations as covered in [Base Animations](./create/base.md).

The example works with a video scene that already contains a graphic block with slide, fade, and loop animations. It focuses on editing those animation handles rather than editor UI setup.

## Retrieving Animations

Before modifying an animation, retrieve it from the block with `getInAnimation`, `getOutAnimation`, or `getLoopAnimation`. Android returns an invalid handle when the slot is empty, so check `isValid` before passing the animation handle to other APIs.

```kotlin highlight-android-retrieve-animations
    val inAnimation = engine.block.getInAnimation(block = block)
    val outAnimation = engine.block.getOutAnimation(block = block)
    val loopAnimation = engine.block.getLoopAnimation(block = block)

    check(engine.block.isValid(block = inAnimation)) { "Expected an In animation." }
    check(engine.block.isValid(block = outAnimation)) { "Expected an Out animation." }
    check(engine.block.isValid(block = loopAnimation)) { "Expected a Loop animation." }

    val inAnimationType = engine.block.getType(block = inAnimation)
    val outAnimationType = engine.block.getType(block = outAnimation)
    val loopAnimationType = engine.block.getType(block = loopAnimation)
```

Use `getType` after the validity check to branch on animation types such as slide, fade, zoom, or breathing loop.

## Reading Animation Properties

Inspect current settings with property getters. `getDuration` returns the animation length in seconds, `getEnum` reads enum properties such as easing, and `findAllProperties` lists the properties available for the specific animation type.

```kotlin highlight-android-read-properties
val initialDuration = engine.block.getDuration(block = inAnimation)
val initialEasing = engine.block.getEnum(
    block = inAnimation,
    property = "animationEasing",
)
val slideProperties = engine.block.findAllProperties(block = inAnimation)
```

Different animation types expose different properties. For example, slide animations expose `animation/slide/direction`, while text animations expose writing style and overlap properties.

## Modifying Animation Duration

Change timing with `setDuration`. In and Out animation durations are measured in seconds, while Loop animation duration defines one cycle of the repeated motion.

```kotlin highlight-android-modify-duration
engine.block.setDuration(block = inAnimation, duration = 0.8)
engine.block.setDuration(block = loopAnimation, duration = 2.0)
val updatedDuration = engine.block.getDuration(block = inAnimation)
```

When you change an In or Out animation duration, CE.SDK keeps paired entrance and exit animations from overlapping on the same block.

## Changing Easing Functions

Easing controls the acceleration curve during the animation. Use `setEnum` with the `animationEasing` property and one of the values exposed by `AnimationEasingType`.

```kotlin highlight-android-change-easing
// animationEasing is the Engine property key for animation acceleration curves.
engine.block.setEnum(
    block = inAnimation,
    property = "animationEasing",
    value = AnimationEasingType.EASE_IN_OUT.key,
)
val updatedEasing = engine.block.getEnum(
    block = inAnimation,
    property = "animationEasing",
)
val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")
```

Use `getEnumValues` to discover the active easing set at runtime. The public Android enum exposes these values:

| Easing | Description |
| --- | --- |
| `Linear` | Constant speed throughout |
| `EaseIn` | Starts slow, then accelerates |
| `EaseOut` | Starts fast, then decelerates |
| `EaseInOut` | Starts slow, speeds up, then slows down again |
| `EaseInQuart` | Quartic curve that accelerates toward the end |
| `EaseOutQuart` | Quartic curve that decelerates toward the end |
| `EaseInOutQuart` | Quartic curve that eases at both ends |
| `EaseInQuint` | Quintic curve that accelerates toward the end |
| `EaseOutQuint` | Quintic curve that decelerates toward the end |
| `EaseInOutQuint` | Quintic curve that eases at both ends |
| `EaseInBack` | Overshooting curve that accelerates into the motion |
| `EaseOutBack` | Overshooting curve that decelerates out of the motion |
| `EaseInOutBack` | Overshooting curve that eases at both ends |
| `EaseInSpring` | Spring-style curve that accelerates into the motion |
| `EaseOutSpring` | Spring-style curve that decelerates out of the motion |
| `EaseInOutSpring` | Spring-style curve that eases at both ends |

## Adjusting Animation-Specific Properties

Each animation type has its own configurable properties. For slide animations, set `animation/slide/direction` with a radian value to change the travel direction, and set `animation/slide/fade` to blend opacity during the slide.

```kotlin highlight-android-adjust-properties
// Slide direction is exposed as radians.
engine.block.setFloat(
    block = inAnimation,
    property = "animation/slide/direction",
    value = Math.PI.toFloat(),
)
val slideDirection = engine.block.getFloat(
    block = inAnimation,
    property = "animation/slide/direction",
)
// Slide fade is exposed as a boolean property.
engine.block.setBoolean(
    block = inAnimation,
    property = "animation/slide/fade",
    value = true,
)
val slideFade = engine.block.getBoolean(
    block = inAnimation,
    property = "animation/slide/fade",
)
```

Slide direction describes how the block moves:

- `0` — Slides right and enters from the left
- `Math.PI / 2` — Slides down and enters from the top
- `Math.PI` — Slides left and enters from the right
- `3 * Math.PI / 2` — Slides up and enters from the bottom

For text animations, use the same property APIs with `textAnimationWritingStyle` (Block, Line, Word, Character) and `textAnimationOverlap` (0 for sequential, 1 for simultaneous). See [Text Animations](./create/text.md) for the text-specific flow.

## Replacing Animations

To change an animation type, destroy the existing animation block before attaching a new one. Check the slot first because empty animation slots return an invalid handle.

```kotlin highlight-android-replace-animation
    val currentInAnimation = engine.block.getInAnimation(block = block)
    if (engine.block.isValid(block = currentInAnimation)) {
        engine.block.destroy(block = currentInAnimation)
    }

    val zoomAnimation = engine.block.createAnimation(type = AnimationType.Zoom)
    engine.block.setInAnimation(block = block, animation = zoomAnimation)
    engine.block.setDuration(block = zoomAnimation, duration = 0.6)
    engine.block.setEnum(
        block = zoomAnimation,
        property = "animationEasing",
        value = AnimationEasingType.EASE_IN_OUT.key,
    )

    val replacementType = engine.block.getType(
        block = engine.block.getInAnimation(block = block),
    )
```

The replacement animation can then receive its own duration, easing, and type-specific properties. Detached animation blocks are not cleaned up automatically.

## Removing Animations

Remove an animation by destroying the attached animation block. After destruction, the slot getter returns an invalid handle.

```kotlin highlight-android-remove-animation
    val currentLoopAnimation = engine.block.getLoopAnimation(block = block)
    if (engine.block.isValid(block = currentLoopAnimation)) {
        engine.block.destroy(block = currentLoopAnimation)
    }

    val loopAnimationRemoved = !engine.block.isValid(
        block = engine.block.getLoopAnimation(block = block),
    )
```

Destroying a design block also destroys its attached animations. You only need to destroy animations manually when you replace or detach them while keeping the design block.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.block.createAnimation(type=_)` | Create an animation block for a supported `AnimationType`. |
| `engine.block.setInAnimation(block=_, animation=_)` | Attach an entrance animation to a design block. |
| `engine.block.setOutAnimation(block=_, animation=_)` | Attach an exit animation to a design block. |
| `engine.block.setLoopAnimation(block=_, animation=_)` | Attach a repeated loop animation to a design block. |
| `engine.block.getInAnimation(block=_)` | Read the current entrance animation handle. |
| `engine.block.getOutAnimation(block=_)` | Read the current exit animation handle. |
| `engine.block.getLoopAnimation(block=_)` | Read the current loop animation handle. |
| `engine.block.isValid(block=_)` | Check whether a returned animation handle is usable. |
| `engine.block.getType(block=_)` | Read the animation block type. |
| `engine.block.getDuration(block=_)` | Read animation duration in seconds. |
| `engine.block.setDuration(block=_, duration=_)` | Set animation duration in seconds. |
| `engine.block.getEnum(block=_, property=_)` | Read an enum property such as `animationEasing`. |
| `engine.block.setEnum(block=_, property="animationEasing", value=_)` | Set an enum animation property. |
| `engine.block.getEnumValues(enumProperty="animationEasing")` | List supported easing values. |
| `engine.block.findAllProperties(block=_)` | Discover properties supported by a specific animation block. |
| `engine.block.getFloat(block=_, property="animation/slide/direction")` | Read a numeric animation property. |
| `engine.block.setFloat(block=_, property="animation/slide/direction", value=_)` | Set a numeric animation property. |
| `engine.block.getBoolean(block=_, property="animation/slide/fade")` | Read a boolean animation property. |
| `engine.block.setBoolean(block=_, property="animation/slide/fade", value=_)` | Set a boolean animation property. |
| `engine.block.destroy(block=_)` | Destroy a replaced or removed animation block. |

## Next Steps

- [Base Animations](./create/base.md) — Create entrance, exit, and loop animations
- [Text Animations](./create/text.md) — Animate text with writing styles and character control
- [Animation Overview](./overview.md) — Understand animation concepts and capabilities



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support