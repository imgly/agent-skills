> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Animation](../../animation.md) > [Create Animations](../create.md) > [Text Animations](./text.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-animations/TextAnimations.kt reference-only
import ly.img.engine.AnimationEasingType
import ly.img.engine.AnimationType
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

suspend fun textAnimations(engine: Engine): TextAnimationSummary {
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1920F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.setDuration(block = page, duration = 10.0)
    engine.block.appendChild(parent = scene, child = page)

    val introText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = introText, value = 100F)
    engine.block.setPositionY(block = introText, value = 100F)
    engine.block.setWidth(block = introText, value = 600F)
    engine.block.setHeight(block = introText, value = 200F)
    engine.block.replaceText(block = introText, text = "Creating\nText\nAnimations")
    engine.block.appendChild(parent = page, child = introText)

    check(engine.block.supportsAnimation(block = introText))

    val baselineAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
    engine.block.setInAnimation(block = introText, animation = baselineAnimation)
    engine.block.setDuration(block = baselineAnimation, duration = 2.0)

    val blockText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = blockText, value = 1300F)
    engine.block.setPositionY(block = blockText, value = 700F)
    engine.block.setWidth(block = blockText, value = 500F)
    engine.block.setHeight(block = blockText, value = 200F)
    engine.block.replaceText(block = blockText, text = "Animate the complete text block")
    engine.block.appendChild(parent = page, child = blockText)

    val blockAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
    engine.block.setInAnimation(block = blockText, animation = blockAnimation)
    engine.block.setDuration(block = blockAnimation, duration = 2.0)
    engine.block.setEnum(block = blockAnimation, property = "textAnimationWritingStyle", value = "Block")
    engine.block.setEnum(block = blockAnimation, property = "animationEasing", value = AnimationEasingType.EASE_OUT.key)

    val lineText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = lineText, value = 700F)
    engine.block.setPositionY(block = lineText, value = 100F)
    engine.block.setWidth(block = lineText, value = 600F)
    engine.block.setHeight(block = lineText, value = 200F)
    engine.block.replaceText(block = lineText, text = "Line by line\nanimation\nfor text")
    engine.block.appendChild(parent = page, child = lineText)

    val lineAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
    engine.block.setInAnimation(block = lineText, animation = lineAnimation)
    engine.block.setDuration(block = lineAnimation, duration = 2.0)
    engine.block.setEnum(block = lineAnimation, property = "textAnimationWritingStyle", value = "Line")
    engine.block.setEnum(block = lineAnimation, property = "animationEasing", value = AnimationEasingType.EASE_OUT.key)

    val wordText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = wordText, value = 1300F)
    engine.block.setPositionY(block = wordText, value = 100F)
    engine.block.setWidth(block = wordText, value = 600F)
    engine.block.setHeight(block = wordText, value = 200F)
    engine.block.replaceText(block = wordText, text = "Animate word by word for emphasis")
    engine.block.appendChild(parent = page, child = wordText)

    val wordAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
    engine.block.setInAnimation(block = wordText, animation = wordAnimation)
    engine.block.setDuration(block = wordAnimation, duration = 2.5)
    engine.block.setEnum(block = wordAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setEnum(block = wordAnimation, property = "animationEasing", value = AnimationEasingType.EASE_OUT.key)

    val characterText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = characterText, value = 100F)
    engine.block.setPositionY(block = characterText, value = 400F)
    engine.block.setWidth(block = characterText, value = 600F)
    engine.block.setHeight(block = characterText, value = 200F)
    engine.block.replaceText(block = characterText, text = "Character by character for typewriter effect")
    engine.block.appendChild(parent = page, child = characterText)

    val characterAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
    engine.block.setInAnimation(block = characterText, animation = characterAnimation)
    engine.block.setDuration(block = characterAnimation, duration = 3.0)
    engine.block.setEnum(block = characterAnimation, property = "textAnimationWritingStyle", value = "Character")
    engine.block.setEnum(block = characterAnimation, property = "animationEasing", value = AnimationEasingType.LINEAR.key)

    val sequentialText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = sequentialText, value = 700F)
    engine.block.setPositionY(block = sequentialText, value = 400F)
    engine.block.setWidth(block = sequentialText, value = 600F)
    engine.block.setHeight(block = sequentialText, value = 200F)
    engine.block.replaceText(block = sequentialText, text = "Sequential animation with zero overlap")
    engine.block.appendChild(parent = page, child = sequentialText)

    val sequentialAnimation = engine.block.createAnimation(type = AnimationType.Pan)
    engine.block.setInAnimation(block = sequentialText, animation = sequentialAnimation)
    engine.block.setDuration(block = sequentialAnimation, duration = 2.0)
    engine.block.setEnum(block = sequentialAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setFloat(block = sequentialAnimation, property = "textAnimationOverlap", value = 0.0F)
    engine.block.setEnum(block = sequentialAnimation, property = "animationEasing", value = AnimationEasingType.EASE_OUT.key)

    val cascadingText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = cascadingText, value = 1300F)
    engine.block.setPositionY(block = cascadingText, value = 400F)
    engine.block.setWidth(block = cascadingText, value = 600F)
    engine.block.setHeight(block = cascadingText, value = 200F)
    engine.block.replaceText(block = cascadingText, text = "Cascading animation with partial overlap")
    engine.block.appendChild(parent = page, child = cascadingText)

    val cascadingAnimation = engine.block.createAnimation(type = AnimationType.Pan)
    engine.block.setInAnimation(block = cascadingText, animation = cascadingAnimation)
    engine.block.setDuration(block = cascadingAnimation, duration = 1.5)
    engine.block.setEnum(block = cascadingAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setFloat(block = cascadingAnimation, property = "textAnimationOverlap", value = 0.4F)
    engine.block.setEnum(block = cascadingAnimation, property = "animationEasing", value = AnimationEasingType.EASE_OUT.key)

    val combinedText = engine.block.create(DesignBlockType.Text)
    engine.block.setPositionX(block = combinedText, value = 100F)
    engine.block.setPositionY(block = combinedText, value = 700F)
    engine.block.setWidth(block = combinedText, value = 1200F)
    engine.block.setHeight(block = combinedText, value = 200F)
    engine.block.replaceText(block = combinedText, text = "Combine writing style, overlap, duration, and easing")
    engine.block.appendChild(parent = page, child = combinedText)

    val combinedAnimation = engine.block.createAnimation(type = AnimationType.Fade)
    engine.block.setInAnimation(block = combinedText, animation = combinedAnimation)
    engine.block.setEnum(block = combinedAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setFloat(block = combinedAnimation, property = "textAnimationOverlap", value = 0.3F)
    engine.block.setDuration(block = combinedAnimation, duration = 1.5)
    engine.block.setEnum(block = combinedAnimation, property = "animationEasing", value = AnimationEasingType.EASE_IN_OUT.key)

    val writingStyleOptions = engine.block.getEnumValues(enumProperty = "textAnimationWritingStyle")
    val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")

    return TextAnimationSummary(
        writingStyleOptions = writingStyleOptions,
        easingOptions = easingOptions,
        blockWritingStyle = engine.block.getEnum(block = blockAnimation, property = "textAnimationWritingStyle"),
        lineWritingStyle = engine.block.getEnum(block = lineAnimation, property = "textAnimationWritingStyle"),
        wordWritingStyle = engine.block.getEnum(block = wordAnimation, property = "textAnimationWritingStyle"),
        characterWritingStyle = engine.block.getEnum(block = characterAnimation, property = "textAnimationWritingStyle"),
        sequentialOverlap = engine.block.getFloat(block = sequentialAnimation, property = "textAnimationOverlap"),
        cascadingOverlap = engine.block.getFloat(block = cascadingAnimation, property = "textAnimationOverlap"),
        combinedDuration = engine.block.getDuration(block = combinedAnimation),
    )
}
```

```kotlin file=@cesdk_android_examples/engine-guides-text-animations/TextAnimationSummary.kt reference-only
data class TextAnimationSummary(
    val writingStyleOptions: List<String>,
    val easingOptions: List<String>,
    val blockWritingStyle: String,
    val lineWritingStyle: String,
    val wordWritingStyle: String,
    val characterWritingStyle: String,
    val sequentialOverlap: Float,
    val cascadingOverlap: Float,
    val combinedDuration: Double,
)
```

Create text animations that reveal content as one block, line by line, word
by word, or character by character with control over timing and overlap.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260829/engine-guides-text-animations)

<EngineReferenceNote {...props} />

Text animations in CE.SDK animate text blocks with granular control over how the
text appears. Unlike standard block animations, text animations support writing
styles that determine whether animation applies to the entire text block, line
by line, word by word, or character by character.

This guide covers text-specific animation properties like writing styles and
segment overlap, enabling dynamic text presentations in your designs.

## Text Animation Fundamentals

Create animations by first creating an animation instance, then attaching it to
a text block. The animation defines how the text animates, while the text block
contains the content and styling.

```kotlin highlight-android-create-animation
val baselineAnimation = engine.block.createAnimation(type = AnimationType.Baseline)
engine.block.setInAnimation(block = introText, animation = baselineAnimation)
engine.block.setDuration(block = baselineAnimation, duration = 2.0)
```

Animations are created with `engine.block.createAnimation()` using a type like
`AnimationType.Baseline`, `AnimationType.Fade`, or `AnimationType.Pan`. Attach
the animation to the text block's entrance with `engine.block.setInAnimation()`
and set the timing with `engine.block.setDuration()`. For text-focused effects,
also consider text-only presets such as `AnimationType.TypewriterText`,
`AnimationType.BlockSwipeText`, `AnimationType.SpreadText`, and
`AnimationType.MergeText`; see [Supported Animation Types](../types.md)
for the full preset list.

## Writing Style Control

Text animations support different granularity levels through the
`textAnimationWritingStyle` property. This controls whether the animation
applies to the entire text block at once or breaks it into segments such as
lines, words, or characters. Query the available options with
`engine.block.getEnumValues(enumProperty = "textAnimationWritingStyle")`.

### Whole-Block Animation

The `Block` writing style animates the complete text block as a single segment.
Use it when the text should appear as one unit instead of revealing individual
lines, words, or characters.

```kotlin highlight-android-writing-style-block
engine.block.setEnum(block = blockAnimation, property = "textAnimationWritingStyle", value = "Block")
```

Set the writing style to `Block` with `engine.block.setEnum()` to keep the
entire text block synchronized.

### Line-by-Line Animation

The `Line` writing style animates text one line at a time from top to bottom.
Each line appears sequentially, creating a structured reveal effect.

```kotlin highlight-android-writing-style-line
engine.block.setEnum(block = lineAnimation, property = "textAnimationWritingStyle", value = "Line")
```

Set the writing style to `Line` with `engine.block.setEnum()`. This is useful
for revealing multi-line text in a clear, organized manner.

### Word-by-Word Animation

The `Word` writing style animates text one word at a time in reading order. This
creates emphasis and draws attention to individual words.

```kotlin highlight-android-writing-style-word
engine.block.setEnum(block = wordAnimation, property = "textAnimationWritingStyle", value = "Word")
```

Setting the writing style to `Word` creates dynamic text reveals that emphasize
key phrases.

### Character-by-Character Animation

The `Character` writing style animates text one character at a time, creating a
typewriter effect. This is the most granular animation option.

```kotlin highlight-android-writing-style-character
engine.block.setEnum(block = characterAnimation, property = "textAnimationWritingStyle", value = "Character")
```

Use `Character` when you want maximum control over the animation timing.

## Segment Overlap Configuration

The `textAnimationOverlap` property controls timing between animation segments.
A value of `0` means segments animate sequentially; values between `0` and `1`
create cascading effects where segments overlap partially. Use
`engine.block.setFloat()` to set the overlap value.

### Sequential Animation (Overlap = 0)

When overlap is set to `0`, each segment completes before the next begins,
creating a clear reveal effect.

```kotlin highlight-android-overlap-sequential
engine.block.setFloat(block = sequentialAnimation, property = "textAnimationOverlap", value = 0.0F)
```

Sequential animation ensures each text segment fully appears before the next one
starts, making it useful for emphasis and readability.

### Cascading Animation (Overlap = 0.4)

When overlap is set to a value between `0` and `1`, segments animate in a
cascading pattern, creating a smooth effect as they blend together.

```kotlin highlight-android-overlap-cascading
engine.block.setFloat(block = cascadingAnimation, property = "textAnimationOverlap", value = 0.4F)
```

Cascading animation with partial overlap creates fluid text reveals that feel
natural.

## Combining with Animation Properties

Text animations can be enhanced with standard animation properties like duration
and easing. Duration controls the overall timing of the animation, while easing
controls the acceleration curve. The snippet below applies all four knobs -
writing style, overlap, duration, and easing - to a single animation, then
queries the engine for available enum options.

```kotlin highlight-android-duration-easing
    engine.block.setEnum(block = combinedAnimation, property = "textAnimationWritingStyle", value = "Word")
    engine.block.setFloat(block = combinedAnimation, property = "textAnimationOverlap", value = 0.3F)
    engine.block.setDuration(block = combinedAnimation, duration = 1.5)
    engine.block.setEnum(block = combinedAnimation, property = "animationEasing", value = AnimationEasingType.EASE_IN_OUT.key)

    val writingStyleOptions = engine.block.getEnumValues(enumProperty = "textAnimationWritingStyle")
    val easingOptions = engine.block.getEnumValues(enumProperty = "animationEasing")
```

Set the easing function with `engine.block.setEnum()` and
an `AnimationEasingType` constant such as `AnimationEasingType.LINEAR.key`,
`AnimationEasingType.EASE_OUT.key`, or
`AnimationEasingType.EASE_IN_OUT.key`. Call
`engine.block.getEnumValues(enumProperty = "animationEasing")` to discover the
current engine's easing values, including quart, quint, back, and spring
variants. Combining writing style, overlap, duration, and easing gives complete
control over how text animates.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.create(blockType=_)` | Create a text or page block |
| `engine.block.appendChild(parent=_, child=_)` | Add a block to the scene hierarchy |
| `engine.block.setPositionX(block=_, value=_)` | Set the block's horizontal position |
| `engine.block.setPositionY(block=_, value=_)` | Set the block's vertical position |
| `engine.block.setWidth(block=_, value=_)` | Set the block width |
| `engine.block.setHeight(block=_, value=_)` | Set the block height |
| `engine.block.replaceText(block=_, text=_)` | Set text content |
| `engine.block.supportsAnimation(block=_)` | Check whether a block supports animations |
| `engine.block.createAnimation(type=_)` | Create a new animation instance |
| `engine.block.setInAnimation(block=_, animation=_)` | Apply animation to a block entrance |
| `engine.block.setLoopAnimation(block=_, animation=_)` | Apply a looping animation to a block |
| `engine.block.setOutAnimation(block=_, animation=_)` | Apply animation to a block exit |
| `engine.block.getInAnimation(block=_)` | Get a block's entrance animation |
| `engine.block.getLoopAnimation(block=_)` | Get a block's looping animation |
| `engine.block.getOutAnimation(block=_)` | Get a block's exit animation |
| `engine.block.setDuration(block=_, duration=_)` | Set animation duration in seconds |
| `engine.block.getDuration(block=_)` | Get animation duration in seconds |
| `engine.block.setEnum(block=_, property=_, value=_)` | Set enum properties such as writing style and easing |
| `engine.block.getEnum(block=_, property=_)` | Get enum properties such as writing style and easing |
| `engine.block.setFloat(block=_, property=_, value=_)` | Set float properties such as segment overlap |
| `engine.block.getFloat(block=_, property=_)` | Get float properties such as segment overlap |
| `engine.block.getEnumValues(enumProperty=_)` | Get available enum options for a property |

## Troubleshooting

- **Animation is not visible**: For video scenes, make sure the page that
  contains the text has a duration set before playback or export. The sample
  sets the page duration before attaching animations to the text blocks.
- **Writing style does not apply**: Attach the animation to a text block with
  `engine.block.setInAnimation()`, `engine.block.setLoopAnimation()`, or
  `engine.block.setOutAnimation()`. `textAnimationWritingStyle` only affects
  animations that run on text blocks.
- **Overlap has no visible effect**: Use a segmented writing style such as
  `Line`, `Word`, or `Character`. With `Block`, the text animates as one
  segment, so `textAnimationOverlap` has no segment timing to offset.

## Next Steps

- [Base Animations](./base.md) - Create entrance, exit, and loop
  animations
- [Edit Animations](../edit.md) — Modify existing animations in CE.SDK by reading properties, changing duration and easing, adjusting direction, and replacing or removing animations from blocks
- [Animation Overview](../overview.md) - Understand animation concepts
  and capabilities



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support