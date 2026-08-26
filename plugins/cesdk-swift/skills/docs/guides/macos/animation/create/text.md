> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Animation](../../animation.md) > [Create Animations](../create.md) > [Text Animations](./text.md)

---

```swift file=@cesdk_swift_examples/engine-guides-text-animations/TextAnimations.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func textAnimations(engine: Engine) async throws {
  let scene = try engine.scene.createVideo()

  let page = try engine.block.create(.page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)
  try engine.block.setDuration(page, duration: 10)
  try engine.block.appendChild(to: scene, child: page)

  let text1 = try engine.block.create(.text)
  try engine.block.setPositionX(text1, value: 100)
  try engine.block.setPositionY(text1, value: 100)
  try engine.block.setWidth(text1, value: 600)
  try engine.block.setHeight(text1, value: 200)
  try engine.block.replaceText(text1, text: "Creating\nText\nAnimations")
  try engine.block.appendChild(to: page, child: text1)

  let baselineAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text1, animation: baselineAnimation)
  try engine.block.setDuration(baselineAnimation, duration: 2.0)

  let text2 = try engine.block.create(.text)
  try engine.block.setPositionX(text2, value: 700)
  try engine.block.setPositionY(text2, value: 100)
  try engine.block.setWidth(text2, value: 600)
  try engine.block.setHeight(text2, value: 200)
  try engine.block.replaceText(text2, text: "Line by line\nanimation\nfor text")
  try engine.block.appendChild(to: page, child: text2)

  let lineAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text2, animation: lineAnimation)
  try engine.block.setDuration(lineAnimation, duration: 2.0)
  try engine.block.setEnum(lineAnimation, property: "textAnimationWritingStyle", value: "Line")
  try engine.block.setEnum(lineAnimation, property: "animationEasing", value: "EaseOut")

  let text3 = try engine.block.create(.text)
  try engine.block.setPositionX(text3, value: 1300)
  try engine.block.setPositionY(text3, value: 100)
  try engine.block.setWidth(text3, value: 600)
  try engine.block.setHeight(text3, value: 200)
  try engine.block.replaceText(text3, text: "Animate word by word for emphasis")
  try engine.block.appendChild(to: page, child: text3)

  let wordAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text3, animation: wordAnimation)
  try engine.block.setDuration(wordAnimation, duration: 2.5)
  try engine.block.setEnum(wordAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setEnum(wordAnimation, property: "animationEasing", value: "EaseOut")

  let text4 = try engine.block.create(.text)
  try engine.block.setPositionX(text4, value: 100)
  try engine.block.setPositionY(text4, value: 400)
  try engine.block.setWidth(text4, value: 600)
  try engine.block.setHeight(text4, value: 200)
  try engine.block.replaceText(text4, text: "Character by character for typewriter effect")
  try engine.block.appendChild(to: page, child: text4)

  let characterAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text4, animation: characterAnimation)
  try engine.block.setDuration(characterAnimation, duration: 3.0)
  try engine.block.setEnum(characterAnimation, property: "textAnimationWritingStyle", value: "Character")
  try engine.block.setEnum(characterAnimation, property: "animationEasing", value: "Linear")

  let text5 = try engine.block.create(.text)
  try engine.block.setPositionX(text5, value: 700)
  try engine.block.setPositionY(text5, value: 400)
  try engine.block.setWidth(text5, value: 600)
  try engine.block.setHeight(text5, value: 200)
  try engine.block.replaceText(text5, text: "Sequential animation with zero overlap")
  try engine.block.appendChild(to: page, child: text5)

  let sequentialAnimation = try engine.block.createAnimation(.pan)
  try engine.block.setInAnimation(text5, animation: sequentialAnimation)
  try engine.block.setDuration(sequentialAnimation, duration: 2.0)
  try engine.block.setEnum(sequentialAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(sequentialAnimation, property: "textAnimationOverlap", value: 0.0)
  try engine.block.setEnum(sequentialAnimation, property: "animationEasing", value: "EaseOut")

  let text6 = try engine.block.create(.text)
  try engine.block.setPositionX(text6, value: 1300)
  try engine.block.setPositionY(text6, value: 400)
  try engine.block.setWidth(text6, value: 600)
  try engine.block.setHeight(text6, value: 200)
  try engine.block.replaceText(text6, text: "Cascading animation with partial overlap")
  try engine.block.appendChild(to: page, child: text6)

  let cascadingAnimation = try engine.block.createAnimation(.pan)
  try engine.block.setInAnimation(text6, animation: cascadingAnimation)
  try engine.block.setDuration(cascadingAnimation, duration: 1.5)
  try engine.block.setEnum(cascadingAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(cascadingAnimation, property: "textAnimationOverlap", value: 0.4)
  try engine.block.setEnum(cascadingAnimation, property: "animationEasing", value: "EaseOut")

  let text7 = try engine.block.create(.text)
  try engine.block.setPositionX(text7, value: 100)
  try engine.block.setPositionY(text7, value: 700)
  try engine.block.setWidth(text7, value: 1200)
  try engine.block.setHeight(text7, value: 200)
  try engine.block.replaceText(text7, text: "Combine writing style, overlap, duration, and easing")
  try engine.block.appendChild(to: page, child: text7)

  let combinedAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(text7, animation: combinedAnimation)
  try engine.block.setEnum(combinedAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(combinedAnimation, property: "textAnimationOverlap", value: 0.3)
  try engine.block.setDuration(combinedAnimation, duration: 1.5)
  try engine.block.setEnum(combinedAnimation, property: "animationEasing", value: "EaseInOut")

  let writingStyleOptions = try engine.block.getEnumValues(ofProperty: "textAnimationWritingStyle")
  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")

  _ = writingStyleOptions
  _ = easingOptions
}
```

Create engaging text animations that reveal content line by line, word by word, or character by character with granular control over timing and overlap.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.1/engine-guides-text-animations)

Text animations in CE.SDK animate text blocks with granular control over how the text appears. Unlike standard block animations, text animations support writing styles that determine whether animation applies to the entire text, line by line, word by word, or character by character.

This guide covers text-specific animation properties like writing styles and segment overlap, enabling dynamic and engaging text presentations in your designs.

## Text Animation Fundamentals

Create animations by first creating an animation instance, then attaching it to a text block. The animation defines how the text animates, while the text block contains the content and styling.

```swift highlight-textAnimations-createAnimation
  let text1 = try engine.block.create(.text)
  try engine.block.setPositionX(text1, value: 100)
  try engine.block.setPositionY(text1, value: 100)
  try engine.block.setWidth(text1, value: 600)
  try engine.block.setHeight(text1, value: 200)
  try engine.block.replaceText(text1, text: "Creating\nText\nAnimations")
  try engine.block.appendChild(to: page, child: text1)

  let baselineAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text1, animation: baselineAnimation)
  try engine.block.setDuration(baselineAnimation, duration: 2.0)
```

Animations are created with `createAnimation(_:)` using a type like `.baseline`, `.fade`, or `.pan`. Attach the animation to the text block's entrance with `setInAnimation(_:animation:)` and set the timing with `setDuration(_:duration:)`.

## Writing Style Control

Text animations support different granularity levels through the `textAnimationWritingStyle` property. This controls whether the animation applies to the entire text at once, or breaks it into segments (lines, words, or characters). Query the available options with `getEnumValues(ofProperty: "textAnimationWritingStyle")`.

### Line-by-Line Animation

The `Line` writing style animates text one line at a time from top to bottom. Each line appears sequentially, creating a structured reveal effect.

```swift highlight-textAnimations-writingStyleLine
  let text2 = try engine.block.create(.text)
  try engine.block.setPositionX(text2, value: 700)
  try engine.block.setPositionY(text2, value: 100)
  try engine.block.setWidth(text2, value: 600)
  try engine.block.setHeight(text2, value: 200)
  try engine.block.replaceText(text2, text: "Line by line\nanimation\nfor text")
  try engine.block.appendChild(to: page, child: text2)

  let lineAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text2, animation: lineAnimation)
  try engine.block.setDuration(lineAnimation, duration: 2.0)
  try engine.block.setEnum(lineAnimation, property: "textAnimationWritingStyle", value: "Line")
  try engine.block.setEnum(lineAnimation, property: "animationEasing", value: "EaseOut")
```

Set the writing style to `"Line"` with `setEnum(_:property:value:)`. This is ideal for revealing multi-line text in a clear, organized manner.

### Word-by-Word Animation

The `Word` writing style animates text one word at a time in reading order. This creates emphasis and draws attention to individual words.

```swift highlight-textAnimations-writingStyleWord
  let text3 = try engine.block.create(.text)
  try engine.block.setPositionX(text3, value: 1300)
  try engine.block.setPositionY(text3, value: 100)
  try engine.block.setWidth(text3, value: 600)
  try engine.block.setHeight(text3, value: 200)
  try engine.block.replaceText(text3, text: "Animate word by word for emphasis")
  try engine.block.appendChild(to: page, child: text3)

  let wordAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text3, animation: wordAnimation)
  try engine.block.setDuration(wordAnimation, duration: 2.5)
  try engine.block.setEnum(wordAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setEnum(wordAnimation, property: "animationEasing", value: "EaseOut")
```

Setting the writing style to `"Word"` is perfect for dynamic, engaging text reveals that emphasize key phrases.

### Character-by-Character Animation

The `Character` writing style animates text one character at a time, creating a classic typewriter effect. This is the most granular animation option.

```swift highlight-textAnimations-writingStyleCharacter
  let text4 = try engine.block.create(.text)
  try engine.block.setPositionX(text4, value: 100)
  try engine.block.setPositionY(text4, value: 400)
  try engine.block.setWidth(text4, value: 600)
  try engine.block.setHeight(text4, value: 200)
  try engine.block.replaceText(text4, text: "Character by character for typewriter effect")
  try engine.block.appendChild(to: page, child: text4)

  let characterAnimation = try engine.block.createAnimation(.baseline)
  try engine.block.setInAnimation(text4, animation: characterAnimation)
  try engine.block.setDuration(characterAnimation, duration: 3.0)
  try engine.block.setEnum(characterAnimation, property: "textAnimationWritingStyle", value: "Character")
  try engine.block.setEnum(characterAnimation, property: "animationEasing", value: "Linear")
```

The `"Character"` writing style is ideal for typewriter effects and when you want maximum control over the animation timing.

## Segment Overlap Configuration

The `textAnimationOverlap` property controls timing between animation segments. A value of `0` means segments animate sequentially; values between `0` and `1` create cascading effects where segments overlap partially. Use `setFloat(_:property:value:)` to set the overlap value.

### Sequential Animation (Overlap = 0)

When overlap is set to `0`, each segment completes before the next begins, creating a clear, structured reveal effect.

```swift highlight-textAnimations-overlapSequential
  let text5 = try engine.block.create(.text)
  try engine.block.setPositionX(text5, value: 700)
  try engine.block.setPositionY(text5, value: 400)
  try engine.block.setWidth(text5, value: 600)
  try engine.block.setHeight(text5, value: 200)
  try engine.block.replaceText(text5, text: "Sequential animation with zero overlap")
  try engine.block.appendChild(to: page, child: text5)

  let sequentialAnimation = try engine.block.createAnimation(.pan)
  try engine.block.setInAnimation(text5, animation: sequentialAnimation)
  try engine.block.setDuration(sequentialAnimation, duration: 2.0)
  try engine.block.setEnum(sequentialAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(sequentialAnimation, property: "textAnimationOverlap", value: 0.0)
  try engine.block.setEnum(sequentialAnimation, property: "animationEasing", value: "EaseOut")
```

Sequential animation ensures each text segment fully appears before the next one starts, making it perfect for emphasis and readability.

### Cascading Animation (Overlap = 0.4)

When overlap is set to a value between `0` and `1`, segments animate in a cascading pattern, creating a smooth, flowing effect as they blend together.

```swift highlight-textAnimations-overlapCascading
  let text6 = try engine.block.create(.text)
  try engine.block.setPositionX(text6, value: 1300)
  try engine.block.setPositionY(text6, value: 400)
  try engine.block.setWidth(text6, value: 600)
  try engine.block.setHeight(text6, value: 200)
  try engine.block.replaceText(text6, text: "Cascading animation with partial overlap")
  try engine.block.appendChild(to: page, child: text6)

  let cascadingAnimation = try engine.block.createAnimation(.pan)
  try engine.block.setInAnimation(text6, animation: cascadingAnimation)
  try engine.block.setDuration(cascadingAnimation, duration: 1.5)
  try engine.block.setEnum(cascadingAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(cascadingAnimation, property: "textAnimationOverlap", value: 0.4)
  try engine.block.setEnum(cascadingAnimation, property: "animationEasing", value: "EaseOut")
```

Cascading animation with partial overlap creates fluid text reveals that feel natural and engaging.

## Combining with Animation Properties

Text animations can be enhanced with standard animation properties like duration and easing. Duration controls the overall timing of the animation, while easing controls the acceleration curve. The snippet below applies all four knobs — writing style, overlap, duration, and easing — to a single animation, then queries the engine for available enum options.

```swift highlight-textAnimations-durationEasing
  let text7 = try engine.block.create(.text)
  try engine.block.setPositionX(text7, value: 100)
  try engine.block.setPositionY(text7, value: 700)
  try engine.block.setWidth(text7, value: 1200)
  try engine.block.setHeight(text7, value: 200)
  try engine.block.replaceText(text7, text: "Combine writing style, overlap, duration, and easing")
  try engine.block.appendChild(to: page, child: text7)

  let combinedAnimation = try engine.block.createAnimation(.fade)
  try engine.block.setInAnimation(text7, animation: combinedAnimation)
  try engine.block.setEnum(combinedAnimation, property: "textAnimationWritingStyle", value: "Word")
  try engine.block.setFloat(combinedAnimation, property: "textAnimationOverlap", value: 0.3)
  try engine.block.setDuration(combinedAnimation, duration: 1.5)
  try engine.block.setEnum(combinedAnimation, property: "animationEasing", value: "EaseInOut")

  let writingStyleOptions = try engine.block.getEnumValues(ofProperty: "textAnimationWritingStyle")
  let easingOptions = try engine.block.getEnumValues(ofProperty: "animationEasing")
```

Set the easing function with `setEnum(_:property: "animationEasing", value:)` using values such as `"EaseIn"`, `"EaseOut"`, `"EaseInOut"`, or `"Linear"`. Query available writing style and easing options with `getEnumValues(ofProperty:)`. Combining writing style, overlap, duration, and easing gives complete control over how text animates.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.createAnimation(_:)` | Create a new animation instance |
| `engine.block.setInAnimation(_:animation:)` | Apply animation to block entrance |
| `engine.block.setLoopAnimation(_:animation:)` | Apply looping animation to block |
| `engine.block.setOutAnimation(_:animation:)` | Apply animation to block exit |
| `engine.block.setDuration(_:duration:)` | Set animation duration in seconds |
| `engine.block.setEnum(_:property:value:)` | Set enum property (writing style, easing) |
| `engine.block.setFloat(_:property:value:)` | Set float property (overlap value) |
| `engine.block.getEnumValues(ofProperty:)` | Get available enum options for a property |
| `engine.block.replaceText(_:text:)` | Set text content of a text block |
| `engine.block.supportsAnimation(_:)` | Check if a block supports animations |

## Next Steps

- [Supported Animation Types](../types.md) — Explore the animation types available in CE.SDK and their configurable properties
- [Base Animations](./base.md) — Create entrance, exit, and loop animations
- [Edit Animations](../edit.md) — Modify existing animations on blocks
- [Animation Overview](../overview.md) — Understand animation concepts and capabilities



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support