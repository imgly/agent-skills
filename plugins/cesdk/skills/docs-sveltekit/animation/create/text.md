> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Create Animations](./animation/create.md) > [Text Animations](./animation/create/text.md)

---

Create engaging text animations that reveal content line by line, word by word, or character by character with granular control over timing and overlap.

![Text animations demonstrating different writing styles and overlap configurations](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-text-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-text-browser)
>
> - [Live demo](https://img.ly/examples/guides-animation-create-text-browser/)

Text animations in CE.SDK allow you to animate text blocks with granular control over how the text appears. Unlike standard block animations, text animations support writing styles that determine whether animation applies to the entire text, line by line, word by word, or character by character.

```typescript file=@cesdk_web_examples/guides-animation-create-text-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Text Animations Guide
 *
 * Demonstrates text-specific animation features in CE.SDK:
 * - Creating and applying animations to text blocks
 * - Text animation writing styles (line, word, character)
 * - Segment overlap configuration
 * - Combining with easing and duration properties
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video features for animation playback
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene (required for animations)
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set page dimensions before calculating grid layout
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);

    // Set white background color for the page
    // First check if page supports fill, if not or doesn't have one, create one
    if (!engine.block.supportsFill(page) || !engine.block.getFill(page)) {
      const fill = engine.block.createFill('color');
      engine.block.setFill(page, fill);
    }
    engine.block.setColor(engine.block.getFill(page), 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    // Calculate responsive grid layout for demonstrations
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Create a text block and animation
    // Animations are created separately and then attached to blocks
    const text1 = engine.block.create('text');
    engine.block.setWidth(text1, blockWidth);
    engine.block.setHeight(text1, blockHeight);
    engine.block.appendChild(page, text1);
    const pos1 = getPosition(0);
    engine.block.setPositionX(text1, pos1.x);
    engine.block.setPositionY(text1, pos1.y);
    engine.block.replaceText(text1, 'Creating\nText\nAnimations');
    engine.block.setFloat(text1, 'text/fontSize', 48);
    engine.block.setEnum(text1, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text1, 'text/verticalAlignment', 'Center');

    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);

    // Writing Style: Line-by-line animation
    // Text animates one line at a time from top to bottom
    const text2 = engine.block.create('text');
    engine.block.setWidth(text2, blockWidth);
    engine.block.setHeight(text2, blockHeight);
    engine.block.appendChild(page, text2);
    const pos2 = getPosition(1);
    engine.block.setPositionX(text2, pos2.x);
    engine.block.setPositionY(text2, pos2.y);
    engine.block.replaceText(text2, 'Line by line\nanimation\nfor text');
    engine.block.setFloat(text2, 'text/fontSize', 42);
    engine.block.setEnum(text2, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text2, 'text/verticalAlignment', 'Center');

    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');

    // Writing Style: Word-by-word animation
    // Text animates one word at a time in reading order
    const text3 = engine.block.create('text');
    engine.block.setWidth(text3, blockWidth);
    engine.block.setHeight(text3, blockHeight);
    engine.block.appendChild(page, text3);
    const pos3 = getPosition(2);
    engine.block.setPositionX(text3, pos3.x);
    engine.block.setPositionY(text3, pos3.y);
    engine.block.replaceText(text3, 'Animate word by word for emphasis');
    engine.block.setFloat(text3, 'text/fontSize', 42);
    engine.block.setEnum(text3, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text3, 'text/verticalAlignment', 'Center');

    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');

    // Writing Style: Character-by-character animation
    // Text animates one character at a time (typewriter effect)
    const text4 = engine.block.create('text');
    engine.block.setWidth(text4, blockWidth);
    engine.block.setHeight(text4, blockHeight);
    engine.block.appendChild(page, text4);
    const pos4 = getPosition(3);
    engine.block.setPositionX(text4, pos4.x);
    engine.block.setPositionY(text4, pos4.y);
    engine.block.replaceText(
      text4,
      'Character by character for typewriter effect'
    );
    engine.block.setFloat(text4, 'text/fontSize', 38);
    engine.block.setEnum(text4, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text4, 'text/verticalAlignment', 'Center');

    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');

    // Segment Overlap: Sequential animation (overlap = 0)
    // Each segment completes before the next begins
    const text5 = engine.block.create('text');
    engine.block.setWidth(text5, blockWidth);
    engine.block.setHeight(text5, blockHeight);
    engine.block.appendChild(page, text5);
    const pos5 = getPosition(4);
    engine.block.setPositionX(text5, pos5.x);
    engine.block.setPositionY(text5, pos5.y);
    engine.block.replaceText(text5, 'Sequential animation with zero overlap');
    engine.block.setFloat(text5, 'text/fontSize', 40);
    engine.block.setEnum(text5, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text5, 'text/verticalAlignment', 'Center');

    const animation5 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text5, animation5);
    engine.block.setDuration(animation5, 2.0);
    engine.block.setEnum(animation5, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0 for sequential animation
    engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
    engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');

    // Segment Overlap: Cascading animation (overlap = 0.4)
    // Segments overlap partially for smooth flow
    const text6 = engine.block.create('text');
    engine.block.setWidth(text6, blockWidth);
    engine.block.setHeight(text6, blockHeight);
    engine.block.appendChild(page, text6);
    const pos6 = getPosition(5);
    engine.block.setPositionX(text6, pos6.x);
    engine.block.setPositionY(text6, pos6.y);
    engine.block.replaceText(text6, 'Cascading animation with partial overlap');
    engine.block.setFloat(text6, 'text/fontSize', 40);
    engine.block.setEnum(text6, 'text/horizontalAlignment', 'Center');
    engine.block.setEnum(text6, 'text/verticalAlignment', 'Center');

    const animation6 = engine.block.createAnimation('pan');
    engine.block.setInAnimation(text6, animation6);
    engine.block.setDuration(animation6, 1.5);
    engine.block.setEnum(animation6, 'textAnimationWritingStyle', 'Word');

    // Set overlap to 0.4 for cascading effect
    engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
    engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');

    // Combining animation properties: Duration and Easing
    // Duration controls overall timing, easing controls acceleration
    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Query available writing style options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    // eslint-disable-next-line no-console
    console.log('Available writing style options:', writingStyleOptions);

    // Start playback to see animations
    engine.block.setPlaying(page, true);
    engine.block.setLooping(page, true);
  }
}

export default Example;
```

This guide covers text-specific animation properties like writing styles and segment overlap, enabling dynamic and engaging text presentations in your designs.

## Text Animation Fundamentals

We create animations by first creating an animation instance, then attaching it to a text block. The animation block defines how the text will animate, while the text block contains the content and styling.

```typescript highlight-create-animation
    // Create an animation instance with the 'baseline' type
    const animation1 = engine.block.createAnimation('baseline');

    // Apply the animation to the text block's entrance
    engine.block.setInAnimation(text1, animation1);

    // Set basic animation properties
    engine.block.setDuration(animation1, 2.0);
```

Animations are created separately using `engine.block.createAnimation()` with an animation type like 'baseline', 'fade', or 'pan'. We then attach the animation to the text block's entrance using `engine.block.setInAnimation()`. The animation duration is set with `engine.block.setDuration()`.

## Writing Style Control

Text animations support different granularity levels through the `textAnimationWritingStyle` property. This controls whether the animation applies to the entire text at once, or breaks it into segments (lines, words, or characters). We can query available options using `engine.block.getEnumValues('textAnimationWritingStyle')`.

### Line-by-Line Animation

The `Line` writing style animates text one line at a time from top to bottom. Each line appears sequentially, creating a structured reveal effect.

```typescript highlight-writing-style-line
    const animation2 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text2, animation2);
    engine.block.setDuration(animation2, 2.0);

    // Set writing style to 'Line' for line-by-line animation
    engine.block.setEnum(animation2, 'textAnimationWritingStyle', 'Line');
    engine.block.setEnum(animation2, 'animationEasing', 'EaseOut');
```

We use `engine.block.setEnum()` to set the writing style to `'Line'`. This is ideal for revealing multi-line text in a clear, organized manner.

### Word-by-Word Animation

The `Word` writing style animates text one word at a time in reading order. This creates emphasis and draws attention to individual words.

```typescript highlight-writing-style-word
    const animation3 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text3, animation3);
    engine.block.setDuration(animation3, 2.5);

    // Set writing style to 'Word' for word-by-word animation
    engine.block.setEnum(animation3, 'textAnimationWritingStyle', 'Word');
    engine.block.setEnum(animation3, 'animationEasing', 'EaseOut');
```

Setting the writing style to `'Word'` is perfect for creating dynamic, engaging text reveals that emphasize key phrases.

### Character-by-Character Animation

The `Character` writing style animates text one character at a time, creating a classic typewriter effect. This is the most granular animation option.

```typescript highlight-writing-style-character
    const animation4 = engine.block.createAnimation('baseline');
    engine.block.setInAnimation(text4, animation4);
    engine.block.setDuration(animation4, 3.0);

    // Set writing style to 'Character' for character-by-character animation
    engine.block.setEnum(animation4, 'textAnimationWritingStyle', 'Character');
    engine.block.setEnum(animation4, 'animationEasing', 'Linear');
```

The `'Character'` writing style is ideal for typewriter effects and when you want maximum control over the animation timing.

## Segment Overlap Configuration

The `textAnimationOverlap` property controls timing between animation segments. A value of 0 means segments animate sequentially, while values between 0 and 1 create cascading effects where segments overlap partially. We use `engine.block.setFloat()` to set the overlap value.

### Sequential Animation (Overlap = 0)

When overlap is set to 0, each segment completes before the next begins, creating a clear, structured reveal effect.

```typescript highlight-overlap-sequential
// Set overlap to 0 for sequential animation
engine.block.setFloat(animation5, 'textAnimationOverlap', 0.0);
engine.block.setEnum(animation5, 'animationEasing', 'EaseOut');
```

Sequential animation ensures each text segment fully appears before the next one starts, making it perfect for emphasis and readability.

### Cascading Animation (Overlap = 0.4)

When overlap is set to a value between 0 and 1, segments animate in a cascading pattern, creating a smooth, flowing effect as they blend together.

```typescript highlight-overlap-cascading
// Set overlap to 0.4 for cascading effect
engine.block.setFloat(animation6, 'textAnimationOverlap', 0.4);
engine.block.setEnum(animation6, 'animationEasing', 'EaseOut');
```

Cascading animation with partial overlap creates dynamic, fluid text reveals that feel natural and engaging.

## Combining with Animation Properties

Text animations can be enhanced with standard animation properties like duration and easing. Duration controls the overall timing of the animation, while easing controls the acceleration curve.

```typescript highlight-duration-easing
    // Combining animation properties: Duration and Easing
    // Duration controls overall timing, easing controls acceleration
    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Query available writing style options
    const writingStyleOptions = engine.block.getEnumValues(
      'textAnimationWritingStyle'
    );
    // eslint-disable-next-line no-console
    console.log('Available writing style options:', writingStyleOptions);
```

We use `engine.block.setEnum()` to set the easing function ('EaseIn', 'EaseOut', 'EaseInOut', 'Linear'). We can query available easing options using `engine.block.getEnumValues('animationEasing')`. Combining writing style, overlap, duration, and easing gives us complete control over how text animates.

## API Reference

| Method                                            | Description                                        |
| ------------------------------------------------- | -------------------------------------------------- |
| `createAnimation(type)`                           | Create a new animation instance                    |
| `setInAnimation(block, animation)`                | Apply animation to block entrance                  |
| `setLoopAnimation(block, animation)`              | Apply looping animation to block                   |
| `setOutAnimation(block, animation)`               | Apply animation to block exit                      |
| `getInAnimation(block)`                           | Get the entrance animation of a block              |
| `getLoopAnimation(block)`                         | Get the looping animation of a block               |
| `getOutAnimation(block)`                          | Get the exit animation of a block                  |
| `setDuration(animation, seconds)`                 | Set animation duration in seconds                  |
| `getDuration(animation)`                          | Get animation duration                             |
| `setEnum(animation, property, value)`             | Set enum property (writing style, easing)          |
| `getEnum(animation, property)`                    | Get enum property value                            |
| `setFloat(animation, property, value)`            | Set float property (overlap value)                 |
| `getFloat(animation, property)`                   | Get float property value                           |
| `getEnumValues(property)`                         | Get available enum options for a property          |
| `supportsAnimation(block)`                        | Check if block supports animations                 |
| `replaceText(block, text)`                        | Set text content of a text block                   |
| `setPlaying(block, enabled)`                      | Start or stop playback                             |
| `setLooping(block, enabled)`                      | Enable or disable looping playback                 |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support