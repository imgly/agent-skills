> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Supported Animation Types](./types.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-animation-types/AnimationTypes.kt reference-only
import ly.img.engine.AnimationType
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import kotlin.math.PI

data class AnimationTypes(
    val slideDirection: Float,
    val fadeEasing: String,
    val zoomUsesFade: Boolean,
    val wipeDirection: String,
    val breathingIntensity: Float,
    val spinDirection: String,
    val spinIntensity: Float,
    val slideProperties: List<String>,
    val easingOptions: List<String>,
)

fun animationTypes(engine: Engine): AnimationTypes {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1920F)
    engine.block.setHeight(page, value = 1080F)
    engine.block.setDuration(page, duration = 6.0)

    val pageFill = engine.block.createFill(FillType.Color)
    engine.block.setColor(pageFill, property = "fill/color/value", value = Color.fromRGBA(250, 250, 252))
    engine.block.setFill(page, fill = pageFill)

    val demoColors = listOf(
        Color.fromRGBA(67, 97, 238),
        Color.fromRGBA(239, 71, 111),
        Color.fromRGBA(255, 209, 102),
        Color.fromRGBA(6, 214, 160),
        Color.fromRGBA(17, 138, 178),
        Color.fromRGBA(131, 56, 236),
    )
    val columns = 2
    val blockWidth = 900F
    val blockHeight = 300F
    val blocks = demoColors.mapIndexed { index, color ->
        val block = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
        engine.block.setPositionX(block, value = 30F + (index % columns) * (blockWidth + 60F))
        engine.block.setPositionY(block, value = 30F + (index / columns) * (blockHeight + 60F))
        engine.block.setWidth(block, value = blockWidth)
        engine.block.setHeight(block, value = blockHeight)
        engine.block.setDuration(block, duration = 5.0)

        val fill = engine.block.createFill(FillType.Color)
        engine.block.setColor(fill, property = "fill/color/value", value = color)
        engine.block.setFill(block, fill = fill)
        engine.block.appendChild(parent = page, child = block)
        block
    }
    blocks.forEach { block ->
        check(engine.block.supportsAnimation(block))
    }

    val slideBlock = blocks[0]

    val slideAnimation = engine.block.createAnimation(AnimationType.Slide)
    engine.block.setInAnimation(block = slideBlock, animation = slideAnimation)
    engine.block.setDuration(block = slideAnimation, duration = 1.0)
    // Animation-specific fields are exposed through the generic property API.
    engine.block.setFloat(
        block = slideAnimation,
        property = "animation/slide/direction",
        value = PI.toFloat(),
    )
    engine.block.setEnum(block = slideAnimation, property = "animationEasing", value = "EaseOut")

    val fadeBlock = blocks[1]

    val fadeAnimation = engine.block.createAnimation(AnimationType.Fade)
    engine.block.setInAnimation(block = fadeBlock, animation = fadeAnimation)
    engine.block.setDuration(block = fadeAnimation, duration = 1.0)
    engine.block.setEnum(block = fadeAnimation, property = "animationEasing", value = "EaseInOut")

    val zoomBlock = blocks[2]

    val zoomAnimation = engine.block.createAnimation(AnimationType.Zoom)
    engine.block.setInAnimation(block = zoomBlock, animation = zoomAnimation)
    engine.block.setDuration(block = zoomAnimation, duration = 1.0)
    engine.block.setBoolean(block = zoomAnimation, property = "animation/zoom/fade", value = true)

    val exitBlock = blocks[3]

    val wipeIn = engine.block.createAnimation(AnimationType.Wipe)
    engine.block.setInAnimation(block = exitBlock, animation = wipeIn)
    engine.block.setDuration(block = wipeIn, duration = 1.0)
    engine.block.setEnum(block = wipeIn, property = "animation/wipe/direction", value = "Right")

    val fadeOut = engine.block.createAnimation(AnimationType.Fade)
    engine.block.setOutAnimation(block = exitBlock, animation = fadeOut)
    engine.block.setDuration(block = fadeOut, duration = 1.0)
    engine.block.setEnum(block = fadeOut, property = "animationEasing", value = "EaseIn")

    val loopBlock = blocks[4]

    val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
    engine.block.setLoopAnimation(block = loopBlock, animation = breathingLoop)
    engine.block.setDuration(block = breathingLoop, duration = 2.0)
    // Intensity 0 scales to 1.25, while intensity 1 scales to 2.5.
    engine.block.setFloat(
        block = breathingLoop,
        property = "animation/breathing_loop/intensity",
        value = 0.3F,
    )

    val combinedBlock = blocks[5]

    val spinIn = engine.block.createAnimation(AnimationType.Spin)
    engine.block.setInAnimation(block = combinedBlock, animation = spinIn)
    engine.block.setDuration(block = spinIn, duration = 1.0)
    engine.block.setEnum(block = spinIn, property = "animation/spin/direction", value = "Clockwise")
    engine.block.setFloat(block = spinIn, property = "animation/spin/intensity", value = 0.5F)

    val blurOut = engine.block.createAnimation(AnimationType.Blur)
    engine.block.setOutAnimation(block = combinedBlock, animation = blurOut)
    engine.block.setDuration(block = blurOut, duration = 1.0)

    val swayLoop = engine.block.createAnimation(AnimationType.SwayLoop)
    engine.block.setLoopAnimation(block = combinedBlock, animation = swayLoop)
    engine.block.setDuration(block = swayLoop, duration = 1.5)

    val slideProperties = engine.block.findAllProperties(slideAnimation)
    val easingOptions = engine.block.getEnumValues("animationEasing")

    engine.block.setPlaybackTime(page, time = 1.9)

    return AnimationTypes(
        slideDirection = engine.block.getFloat(slideAnimation, property = "animation/slide/direction"),
        fadeEasing = engine.block.getEnum(fadeAnimation, property = "animationEasing"),
        zoomUsesFade = engine.block.getBoolean(zoomAnimation, property = "animation/zoom/fade"),
        wipeDirection = engine.block.getEnum(wipeIn, property = "animation/wipe/direction"),
        breathingIntensity = engine.block.getFloat(breathingLoop, property = "animation/breathing_loop/intensity"),
        spinDirection = engine.block.getEnum(spinIn, property = "animation/spin/direction"),
        spinIntensity = engine.block.getFloat(spinIn, property = "animation/spin/intensity"),
        slideProperties = slideProperties,
        easingOptions = easingOptions,
    )
}
```

Apply entrance, exit, and loop animations to design blocks using the available animation types in CE.SDK.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260810/engine-guides-animation-types)

<EngineReferenceNote {...props} />

CE.SDK organizes animations into three categories: entrance (In), exit (Out), and loop. Each category determines when the animation plays during the block's lifecycle. This guide demonstrates different animation types and their configurable properties.

The snippets use existing graphic blocks in a video scene and focus on the animation APIs. Use the [Base Animations](./create/base.md) guide when you need the lower-level flow for creating, attaching, replacing, and reading animations.

## Entrance Animations

Entrance animations define how a block appears. Use `createAnimation()` with an `AnimationType` and attach it with `setInAnimation()`.

### Slide Animation

The slide animation moves a block in from a specified direction. The `animation/slide/direction` property uses radians where `0` is right, `PI / 2` is bottom, `PI` is left, and `3 * PI / 2` is top. Use `animation/slide/fade` when the slide should also fade opacity during the movement.

```kotlin highlight-android-entrance-slide
val slideAnimation = engine.block.createAnimation(AnimationType.Slide)
engine.block.setInAnimation(block = slideBlock, animation = slideAnimation)
engine.block.setDuration(block = slideAnimation, duration = 1.0)
// Animation-specific fields are exposed through the generic property API.
engine.block.setFloat(
    block = slideAnimation,
    property = "animation/slide/direction",
    value = PI.toFloat(),
)
engine.block.setEnum(block = slideAnimation, property = "animationEasing", value = "EaseOut")
```

### Fade Animation

The fade animation transitions opacity from invisible to fully visible. Easing controls the animation curve.

```kotlin highlight-android-entrance-fade
val fadeAnimation = engine.block.createAnimation(AnimationType.Fade)
engine.block.setInAnimation(block = fadeBlock, animation = fadeAnimation)
engine.block.setDuration(block = fadeAnimation, duration = 1.0)
engine.block.setEnum(block = fadeAnimation, property = "animationEasing", value = "EaseInOut")
```

### Zoom Animation

The zoom animation scales the block from a smaller size to its final dimensions. The `animation/zoom/fade` property adds an opacity transition during scaling.

```kotlin highlight-android-entrance-zoom
val zoomAnimation = engine.block.createAnimation(AnimationType.Zoom)
engine.block.setInAnimation(block = zoomBlock, animation = zoomAnimation)
engine.block.setDuration(block = zoomAnimation, duration = 1.0)
engine.block.setBoolean(block = zoomAnimation, property = "animation/zoom/fade", value = true)
```

Additional entrance animation types include:

- `AnimationType.Pan` - Moves content across the block
- `AnimationType.Blur` - Transitions from blurred to clear
- `AnimationType.Wipe` - Reveals with a directional wipe
- `AnimationType.Baseline` - Slides text in along its baseline
- `AnimationType.Pop` - Uses a bouncy scale effect
- `AnimationType.Spin` - Rotates the block into view
- `AnimationType.Grow` - Scales up from a point
- `AnimationType.CropZoom` - Zooms content inside the block frame
- `AnimationType.KenBurns` - Pans and zooms image or video content

Text-only entrance animation types include:

- `AnimationType.TypewriterText` - Text-only character reveal
- `AnimationType.BlockSwipeText` - Text-only block sweep reveal
- `AnimationType.SpreadText` - Text-only letter spacing effect
- `AnimationType.MergeText` - Text-only line merge effect

## Exit Animations

Exit animations define how a block leaves the screen. Use `setOutAnimation()` to attach them. CE.SDK prevents overlap between entrance and exit durations automatically.

```kotlin highlight-android-exit-animation
    val wipeIn = engine.block.createAnimation(AnimationType.Wipe)
    engine.block.setInAnimation(block = exitBlock, animation = wipeIn)
    engine.block.setDuration(block = wipeIn, duration = 1.0)
    engine.block.setEnum(block = wipeIn, property = "animation/wipe/direction", value = "Right")

    val fadeOut = engine.block.createAnimation(AnimationType.Fade)
    engine.block.setOutAnimation(block = exitBlock, animation = fadeOut)
    engine.block.setDuration(block = fadeOut, duration = 1.0)
    engine.block.setEnum(block = fadeOut, property = "animationEasing", value = "EaseIn")
```

In this example, a wipe entrance transitions to a fade exit. Mirror entrance effects for visual consistency, or use contrasting effects for emphasis.

## Loop Animations

Loop animations run continuously while the block is visible. They can combine with entrance and exit animations. Use `setLoopAnimation()` to attach them.

```kotlin highlight-android-loop-animation
val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
engine.block.setLoopAnimation(block = loopBlock, animation = breathingLoop)
engine.block.setDuration(block = breathingLoop, duration = 2.0)
// Intensity 0 scales to 1.25, while intensity 1 scales to 2.5.
engine.block.setFloat(
    block = breathingLoop,
    property = "animation/breathing_loop/intensity",
    value = 0.3F,
)
```

The duration controls each cycle length. Loop animation types include:

- `AnimationType.BreathingLoop` - Slow scale pulse
- `AnimationType.PulsatingLoop` - Rhythmic scale
- `AnimationType.SpinLoop` - Continuous rotation
- `AnimationType.FadeLoop` - Opacity cycling
- `AnimationType.SwayLoop` - Rotational oscillation
- `AnimationType.JumpLoop` - Jumping motion
- `AnimationType.BlurLoop` - Blur cycling
- `AnimationType.SqueezeLoop` - Squeezing effect
- `AnimationType.ScaleLoop` - Continuous scale animation

## Combined Animations

A single block can have entrance, exit, and loop animations running together. The loop animation runs throughout the block's visibility while entrance and exit animations play at the appropriate times. For spin animations, `animation/spin/fade` controls whether the rotation also fades opacity.

```kotlin highlight-android-combined-animations
    val spinIn = engine.block.createAnimation(AnimationType.Spin)
    engine.block.setInAnimation(block = combinedBlock, animation = spinIn)
    engine.block.setDuration(block = spinIn, duration = 1.0)
    engine.block.setEnum(block = spinIn, property = "animation/spin/direction", value = "Clockwise")
    engine.block.setFloat(block = spinIn, property = "animation/spin/intensity", value = 0.5F)

    val blurOut = engine.block.createAnimation(AnimationType.Blur)
    engine.block.setOutAnimation(block = combinedBlock, animation = blurOut)
    engine.block.setDuration(block = blurOut, duration = 1.0)

    val swayLoop = engine.block.createAnimation(AnimationType.SwayLoop)
    engine.block.setLoopAnimation(block = combinedBlock, animation = swayLoop)
    engine.block.setDuration(block = swayLoop, duration = 1.5)
```

## Configuring Animation Properties

Each animation type has specific configurable properties. Use `findAllProperties()` to discover available properties and `getEnumValues()` to query options for enum properties.

```kotlin highlight-android-discover-properties
val slideProperties = engine.block.findAllProperties(slideAnimation)
val easingOptions = engine.block.getEnumValues("animationEasing")
```

Common configurable properties include:

- **Direction**: Controls entry or exit direction in radians or enum values
- **Easing**: Sets the animation curve, such as `Linear`, `EaseIn`, `EaseOut`, or `EaseInOut`
- **Intensity**: Controls the strength of the effect, with exact behavior depending on the animation type
- **Fade**: Adds or removes an opacity transition

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.supportsAnimation(block=_)` | Returns whether the block can have animations. |
| `engine.block.createAnimation(type=_)` | Creates an animation of the given `AnimationType`. |
| `engine.block.setInAnimation(block=_, animation=_)` | Attaches an entrance animation to a block. |
| `engine.block.setOutAnimation(block=_, animation=_)` | Attaches an exit animation to a block. |
| `engine.block.setLoopAnimation(block=_, animation=_)` | Attaches a loop animation to a block. |
| `engine.block.setDuration(block=_, duration=_)` | Sets the animation duration in seconds. |
| `engine.block.setFloat(block=_, property="animation/slide/direction", value=_)` | Sets the slide direction in radians. |
| `engine.block.setBoolean(block=_, property="animation/slide/fade", value=_)` | Enables or disables opacity fading during a slide animation. |
| `engine.block.setFloat(block=_, property="animation/breathing_loop/intensity", value=_)` | Sets the breathing-loop scale intensity. |
| `engine.block.setFloat(block=_, property="animation/spin/intensity", value=_)` | Sets how far the spin animation rotates. |
| `engine.block.setEnum(block=_, property="animationEasing", value=_)` | Sets the animation easing curve: `Linear`, `EaseIn`, `EaseOut`, `EaseInOut`, `EaseInQuart`, `EaseOutQuart`, `EaseInOutQuart`, `EaseInQuint`, `EaseOutQuint`, `EaseInOutQuint`, `EaseInBack`, `EaseOutBack`, `EaseInOutBack`, `EaseInSpring`, `EaseOutSpring`, or `EaseInOutSpring`. |
| `engine.block.setEnum(block=_, property="animation/wipe/direction", value=_)` | Sets the wipe direction: `Up`, `Right`, `Down`, or `Left`. |
| `engine.block.setEnum(block=_, property="animation/spin/direction", value=_)` | Sets the spin direction: `Clockwise` or `CounterClockwise`. |
| `engine.block.setBoolean(block=_, property="animation/spin/fade", value=_)` | Enables or disables opacity fading during a spin animation. |
| `engine.block.setBoolean(block=_, property="animation/zoom/fade", value=_)` | Enables or disables the zoom fade. |
| `engine.block.findAllProperties(block=_)` | Lists the properties available on an animation block. |
| `engine.block.getEnumValues(enumProperty=_)` | Lists supported values for an enum property. |

## Next Steps

- [Base Animations](./create/base.md) - Create and attach animations to blocks
- [Text Animations](./create/text.md) - Animate text with writing styles
- [Animation Overview](./overview.md) - Review animation concepts and capabilities



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support