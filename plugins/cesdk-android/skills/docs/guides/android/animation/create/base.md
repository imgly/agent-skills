> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Animation](../../animation.md) > [Create Animations](../create.md) > [Base Animations](./base.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-using-animations/UsingAnimations.kt reference-only
import android.net.Uri
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import ly.img.engine.AnimationEasingType
import ly.img.engine.AnimationType
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode

fun usingAnimations(
    license: String?, // pass null or empty for evaluation mode with watermark
    userId: String,
) = CoroutineScope(Dispatchers.Main).launch {
    val engine = Engine.getInstance(id = "ly.img.engine.example")
    engine.start(license = license, userId = userId)
    engine.bindOffscreen(width = 1080, height = 1920)

    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 600F)
    engine.block.appendChild(parent = scene, child = page)

    engine.scene.zoomToBlock(
        page,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    val block = engine.block.create(DesignBlockType.Graphic)
    engine.block.setShape(block, shape = engine.block.createShape(ShapeType.Rect))
    engine.block.setPositionX(block, value = 100F)
    engine.block.setPositionY(block, value = 50F)
    engine.block.setWidth(block, value = 300F)
    engine.block.setHeight(block, value = 300F)
    engine.block.appendChild(parent = page, child = block)
    val fill = engine.block.createFill(FillType.Image)
    engine.block.setUri(
        block = fill,
        property = "fill/image/imageFileURI",
        value = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )
    engine.block.setFill(block, fill = fill)

    val supportsAnimations = engine.block.supportsAnimation(block)

    if (supportsAnimations) {
        val slideAnimation = engine.block.createAnimation(AnimationType.Slide)
        engine.block.setInAnimation(block = block, animation = slideAnimation)
        engine.block.setDuration(block = slideAnimation, duration = 1.0)
    }

    if (supportsAnimations) {
        val initialIn = engine.block.getInAnimation(block)
        if (engine.block.isValid(initialIn)) {
            engine.block.destroy(initialIn)
        }

        val fadeInAnimation = engine.block.createAnimation(AnimationType.Fade)
        engine.block.setInAnimation(block = block, animation = fadeInAnimation)
        engine.block.setDuration(block = fadeInAnimation, duration = 1.0)
        engine.block.setEnum(
            block = fadeInAnimation,
            property = "animationEasing",
            value = AnimationEasingType.EASE_OUT.key,
        )

        val entranceIn = engine.block.getInAnimation(block)
        if (engine.block.isValid(entranceIn)) {
            engine.block.destroy(entranceIn)
        }

        val entranceForTiming = engine.block.createAnimation(AnimationType.Zoom)
        engine.block.setInAnimation(block = block, animation = entranceForTiming)
        engine.block.setDuration(block = entranceForTiming, duration = 1.0)

        val fadeOutAnimation = engine.block.createAnimation(AnimationType.Fade)
        engine.block.setOutAnimation(block = block, animation = fadeOutAnimation)
        engine.block.setDuration(block = fadeOutAnimation, duration = 1.0)
        engine.block.setEnum(
            block = fadeOutAnimation,
            property = "animationEasing",
            value = AnimationEasingType.EASE_IN.key,
        )

        val timingIn = engine.block.getInAnimation(block)
        if (engine.block.isValid(timingIn)) {
            engine.block.destroy(timingIn)
        }

        val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
        engine.block.setLoopAnimation(block = block, animation = breathingLoop)
        engine.block.setDuration(block = breathingLoop, duration = 2.0)

        val slideFromTop = engine.block.createAnimation(AnimationType.Slide)
        engine.block.setInAnimation(block = block, animation = slideFromTop)
        engine.block.setDuration(block = slideFromTop, duration = 1.0)

        val slideProperties = engine.block.findAllProperties(slideFromTop)
        val slideDirectionProperty = "animation/slide/direction"
        check(slideDirectionProperty in slideProperties)
        engine.block.setFloat(
            block = slideFromTop,
            property = slideDirectionProperty,
            value = 0.5F * Math.PI.toFloat(),
        )
        engine.block.setEnum(
            block = slideFromTop,
            property = "animationEasing",
            value = AnimationEasingType.EASE_IN_OUT.key,
        )

        val currentLoop = engine.block.getLoopAnimation(block)
        val currentOut = engine.block.getOutAnimation(block)

        val currentIn = engine.block.getInAnimation(block)

        if (engine.block.isValid(currentIn)) {
            engine.block.destroy(currentIn)
        }
        val replacementIn = engine.block.createAnimation(AnimationType.Wipe)
        engine.block.setInAnimation(block = block, animation = replacementIn)
        engine.block.setDuration(block = replacementIn, duration = 1.0)

        val easingOptions = engine.block.getEnumValues("animationEasing")

        check(engine.block.isValid(currentLoop))
        check(engine.block.isValid(currentOut))
        check(easingOptions.contains(AnimationEasingType.EASE_OUT.key))
        check(engine.block.getDuration(replacementIn) == 1.0)
    }

    val text = engine.block.create(DesignBlockType.Text)
    val textAnimation = engine.block.createAnimation(AnimationType.Baseline)
    engine.block.setInAnimation(text, textAnimation)
    engine.block.appendChild(page, text)
    engine.block.setPositionX(text, 100F)
    engine.block.setPositionY(text, 100F)
    engine.block.setWidthMode(text, SizeMode.AUTO)
    engine.block.setHeightMode(text, SizeMode.AUTO)
    engine.block.replaceText(text, "You can animate text\nline by line,\nword by word,\nor character by character\nwith CE.SDK")
    engine.block.setEnum(textAnimation, "textAnimationWritingStyle", "Word")
    engine.block.setDuration(textAnimation, 2.0)
    engine.block.setEnum(textAnimation, "animationEasing", "EaseOut")

    val text2 = engine.block.create(DesignBlockType.Text)
    val textAnimation2 = engine.block.createAnimation(AnimationType.Pan)
    engine.block.setInAnimation(text2, textAnimation2)
    engine.block.appendChild(page, text2)
    engine.block.setPositionX(text2, 100F)
    engine.block.setPositionY(text2, 500F)
    engine.block.setWidth(text2, 500F)
    engine.block.setHeightMode(text2, SizeMode.AUTO)
    engine.block.replaceText(text2, "You can use the textAnimationOverlap property to control the overlap between text animation segments.")
    engine.block.setFloat(textAnimation2, "textAnimationOverlap", 0.4F)
    engine.block.setDuration(textAnimation2, 1.0)
    engine.block.setEnum(textAnimation2, "animationEasing", "EaseOut")

    engine.stop()
}
```

Add motion to design blocks with entrance, exit, and loop animations using
CE.SDK's Android Engine API.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260906/engine-guides-using-animations)

<EngineReferenceNote {...props} />

Base animations add motion to non-text design blocks through entrance (In), exit (Out), and loop animations. CE.SDK creates animations as separate blocks, attaches them to design blocks, and lets you configure duration, easing, and type-specific properties.

This guide covers base animation objects. For text-specific controls such as line, word, and character animation, see [Text Animations](./text.md).

## Animation Fundamentals

Before applying animations, check whether the target block supports them. Then create an animation with `createAnimation`, attach it with `setInAnimation`, and set the animation duration in seconds.

```kotlin highlight-android-supports-animation
    val supportsAnimations = engine.block.supportsAnimation(block)

    if (supportsAnimations) {
        val slideAnimation = engine.block.createAnimation(AnimationType.Slide)
        engine.block.setInAnimation(block = block, animation = slideAnimation)
        engine.block.setDuration(block = slideAnimation, duration = 1.0)
    }
```

Use Android `AnimationType` values that match the animation category you want to attach:

| Category           | Android types                                                                                                                                                                                                                                                                     | Use                                                                                                     |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| Entrance / Exit    | `AnimationType.Slide`, `AnimationType.Fade`, `AnimationType.Blur`, `AnimationType.Grow`, `AnimationType.Zoom`, `AnimationType.Pop`, `AnimationType.Wipe`, `AnimationType.Pan`, `AnimationType.Baseline`, `AnimationType.CropZoom`, `AnimationType.Spin`, `AnimationType.KenBurns` | Animate a block as it appears or leaves the timeline                                                    |
| Text-only entrance | `AnimationType.TypewriterText`, `AnimationType.BlockSwipeText`, `AnimationType.SpreadText`, `AnimationType.MergeText`                                                                                                                                                             | Animate text-specific reveals; use the [Text Animations](./text.md) guide for text controls |
| Loop               | `AnimationType.SpinLoop`, `AnimationType.FadeLoop`, `AnimationType.BlurLoop`, `AnimationType.PulsatingLoop`, `AnimationType.BreathingLoop`, `AnimationType.JumpLoop`, `AnimationType.SqueezeLoop`, `AnimationType.SwayLoop`, `AnimationType.ScaleLoop`                            | Repeat while the block remains visible                                                                  |

For the exhaustive list and type-specific properties, see [Supported Animation Types](../types.md).

## Entrance Animations

Entrance animations define how a block appears on the timeline. Create the animation, attach it to the block with `setInAnimation`, set its duration, and configure optional properties such as easing.

```kotlin highlight-android-entrance-animation
val fadeInAnimation = engine.block.createAnimation(AnimationType.Fade)
engine.block.setInAnimation(block = block, animation = fadeInAnimation)
engine.block.setDuration(block = fadeInAnimation, duration = 1.0)
engine.block.setEnum(
    block = fadeInAnimation,
    property = "animationEasing",
    value = AnimationEasingType.EASE_OUT.key,
)
```

When replacing an entrance animation, destroy the current `getInAnimation(block)` handle if it is valid before calling `setInAnimation` again. See [Managing Animation Lifecycle](./base.md#managing-animation-lifecycle) for the full cleanup pattern.

`AnimationEasingType.EASE_OUT.key` starts fast and slows down toward the end, which makes the fade feel less abrupt.

## Exit Animations

Exit animations define how a block leaves the timeline. Attach them with `setOutAnimation` and configure their duration just like entrance animations.

```kotlin highlight-android-exit-animation
val fadeOutAnimation = engine.block.createAnimation(AnimationType.Fade)
engine.block.setOutAnimation(block = block, animation = fadeOutAnimation)
engine.block.setDuration(block = fadeOutAnimation, duration = 1.0)
engine.block.setEnum(
    block = fadeOutAnimation,
    property = "animationEasing",
    value = AnimationEasingType.EASE_IN.key,
)
```

When replacing an exit animation, destroy the current `getOutAnimation(block)` handle if it is valid before calling `setOutAnimation` again.

When a block has both entrance and exit animations, CE.SDK keeps their timing valid for the block duration and adjusts conflicting durations to avoid overlap.

## Loop Animations

Loop animations run continuously while the block is visible. Attach them with `setLoopAnimation` and use the animation duration as the length of one loop cycle.

```kotlin highlight-android-loop-animation
val breathingLoop = engine.block.createAnimation(AnimationType.BreathingLoop)
engine.block.setLoopAnimation(block = block, animation = breathingLoop)
engine.block.setDuration(block = breathingLoop, duration = 2.0)
```

When replacing a loop animation, destroy the current `getLoopAnimation(block)` handle if it is valid before calling `setLoopAnimation` again.

A 2-second breathing loop completes one full pulse every 2 seconds while the block stays visible.

## Animation Properties

Each animation type exposes its own properties. Use `findAllProperties` to inspect type-specific keys, then update documented numeric values with `setFloat` and enum values with `setEnum`.

```kotlin highlight-android-animation-properties
        val slideFromTop = engine.block.createAnimation(AnimationType.Slide)
        engine.block.setInAnimation(block = block, animation = slideFromTop)
        engine.block.setDuration(block = slideFromTop, duration = 1.0)

        val slideProperties = engine.block.findAllProperties(slideFromTop)
        val slideDirectionProperty = "animation/slide/direction"
        check(slideDirectionProperty in slideProperties)
        engine.block.setFloat(
            block = slideFromTop,
            property = slideDirectionProperty,
            value = 0.5F * Math.PI.toFloat(),
        )
        engine.block.setEnum(
            block = slideFromTop,
            property = "animationEasing",
            value = AnimationEasingType.EASE_IN_OUT.key,
        )
```

For slide animations, `animation/slide/direction` is the motion direction in radians. The block enters from the opposite side of that direction:

- `0` - Slides right, entering from the left
- `0.5 * Math.PI` - Slides down, entering from the top
- `Math.PI` - Slides left, entering from the right
- `1.5 * Math.PI` - Slides up, entering from the bottom

## Managing Animation Lifecycle

Animation blocks need the same lifecycle attention as other blocks. When replacing an attached animation, read the current handle, destroy it if it is valid, and then attach the replacement.

```kotlin highlight-android-manage-animations
        val currentIn = engine.block.getInAnimation(block)

        if (engine.block.isValid(currentIn)) {
            engine.block.destroy(currentIn)
        }
        val replacementIn = engine.block.createAnimation(AnimationType.Wipe)
        engine.block.setInAnimation(block = block, animation = replacementIn)
        engine.block.setDuration(block = replacementIn, duration = 1.0)
```

`getInAnimation`, `getOutAnimation`, and `getLoopAnimation` return invalid handles when no animation is attached. Destroying a design block also destroys its attached animations, but detached animation blocks must be destroyed manually.

## Easing Functions

Query available easing options with `getEnumValues` when you populate controls or validate a stored animation setting.

```kotlin highlight-android-easing-options
val easingOptions = engine.block.getEnumValues("animationEasing")
```

Common easing values include:

| Easing      | Description                                   |
| ----------- | --------------------------------------------- |
| `Linear`    | Constant speed throughout                     |
| `EaseIn`    | Starts slow and accelerates toward the end    |
| `EaseOut`   | Starts fast and decelerates toward the end    |
| `EaseInOut` | Starts slow, speeds up, then slows down again |

Use `AnimationEasingType` for typed access to the full Android easing surface, including the Quart, Quint, Back, and Spring `EaseIn`, `EaseOut`, and `EaseInOut` families.

## Troubleshooting

### Animation Not Playing

Verify that the target block supports animations, is visible during page playback, and has enough visible time for the animation duration.

### Duration Issues

Set the duration on the animation block, not on the target design block. Attaching an entrance or exit animation first lets CE.SDK clamp its duration against the target block's visible duration and the opposing animation.

## API Reference

| Method                                                                          | Purpose                                                   |
| ------------------------------------------------------------------------------- | --------------------------------------------------------- |
| `engine.block.supportsAnimation(block=_)`                                       | Check whether a design block can use animations.          |
| `engine.block.createAnimation(type=_)`                                          | Create an animation block for an `AnimationType`.         |
| `engine.block.setInAnimation(block=_, animation=_)`                             | Attach an entrance animation to a block.                  |
| `engine.block.setOutAnimation(block=_, animation=_)`                            | Attach an exit animation to a block.                      |
| `engine.block.setLoopAnimation(block=_, animation=_)`                           | Attach a loop animation to a block.                       |
| `engine.block.getInAnimation(block=_)`                                          | Read the current entrance animation handle.               |
| `engine.block.getOutAnimation(block=_)`                                         | Read the current exit animation handle.                   |
| `engine.block.getLoopAnimation(block=_)`                                        | Read the current loop animation handle.                   |
| `engine.block.isValid(block=_)`                                                 | Check whether an animation handle points to a live block. |
| `engine.block.setDuration(block=_, duration=_)`                                 | Set an animation duration in seconds.                     |
| `engine.block.getDuration(block=_)`                                             | Read an animation duration in seconds.                    |
| `engine.block.setEnum(block=_, property="animationEasing", value=_)`            | Set an enum property such as easing.                      |
| `engine.block.getEnumValues(enumProperty="animationEasing")`                    | List supported values for an enum property.               |
| `engine.block.setFloat(block=_, property="animation/slide/direction", value=_)` | Set numeric animation properties such as slide direction. |
| `engine.block.findAllProperties(block=_)`                                       | List configurable properties for an animation block.      |
| `engine.block.destroy(block=_)`                                                 | Destroy a detached or replaced animation block.           |

## Next Steps

- [Text Animations](./text.md) - Animate text with writing styles
  and character-level control
- [Animation Overview](../overview.md) - Understand animation concepts
  and capabilities
- [Edit Animations](../edit.md) — Modify existing animations in
  CE.SDK by reading properties, changing duration and easing, adjusting
  direction, and replacing or removing animations from blocks.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support