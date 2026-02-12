> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Create Animations](./animation/create.md)

---

Add motion to design elements by creating entrance, exit, and loop animations using CE.SDK's animation system.

![Create Animations example showing animated blocks with various animation types](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-browser)
>
> - [Live demo](https://img.ly/examples/guides-animation-create-browser/)

CE.SDK provides a unified animation system for adding motion to design elements. Animations are created as separate block instances and attached to target blocks using type-specific methods. You can apply entrance animations (how blocks appear), exit animations (how blocks leave), and loop animations (continuous motion while visible). Text blocks support additional properties for word-by-word or character-by-character reveals.

```typescript file=@cesdk_web_examples/guides-animation-create-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Create Animations Guide
 *
 * Demonstrates animation features in CE.SDK:
 * - Creating entrance (In) animations
 * - Creating exit (Out) animations
 * - Creating loop animations
 * - Configuring duration and easing
 * - Text animations with writing styles
 * - Managing animation lifecycle
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
    const pages = engine.block.findByType('page');
    const page = pages[0];

    // Set page dimensions and duration
    const pageWidth = 1920;
    const pageHeight = 1080;
    engine.block.setWidth(page, pageWidth);
    engine.block.setHeight(page, pageHeight);
    engine.block.setDuration(page, 5.0);

    // Create gradient background
    if (engine.block.supportsFill(page)) {
      const gradientFill = engine.block.createFill('gradient/linear');
      engine.block.setGradientColorStops(gradientFill, 'fill/gradient/colors', [
        { color: { r: 0.4, g: 0.2, b: 0.8, a: 1.0 }, stop: 0 },
        { color: { r: 0.1, g: 0.3, b: 0.6, a: 1.0 }, stop: 0.5 },
        { color: { r: 0.2, g: 0.1, b: 0.4, a: 1.0 }, stop: 1 }
      ]);
      // Diagonal gradient from top-left to bottom-right
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointX', 0);
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/startPointY', 0);
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointX', 1);
      engine.block.setFloat(gradientFill, 'fill/gradient/linear/endPointY', 1);
      engine.block.setFill(page, gradientFill);
    }

    // ===== Title: "Create Animations" with entrance animation =====
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Create Animations');
    engine.block.setTextFontSize(titleBlock, 120);
    engine.block.setTextColor(titleBlock, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);
    engine.block.setDuration(titleBlock, 5.0);

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(titleBlock)) {
      // Create an entrance animation
      const slideIn = engine.block.createAnimation('slide');
      engine.block.setInAnimation(titleBlock, slideIn);
      engine.block.setDuration(slideIn, 1.2);
      engine.block.setFloat(slideIn, 'animation/slide/direction', (3 * Math.PI) / 2);
      engine.block.setEnum(slideIn, 'animationEasing', 'EaseOut');
    }

    // Center title horizontally and position in upper third
    const titleWidth = engine.block.getFrameWidth(titleBlock);
    const titleHeight = engine.block.getFrameHeight(titleBlock);
    engine.block.setPositionX(titleBlock, (pageWidth - titleWidth) / 2);
    engine.block.setPositionY(titleBlock, pageHeight * 0.25);

    // ===== IMG.LY Logo with pulsating loop animation =====
    const logoBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 200, height: 200 } }
    );
    engine.block.appendChild(page, logoBlock);
    engine.block.setDuration(logoBlock, 5.0);
    // Contain the image within the block frame
    engine.block.setEnum(logoBlock, 'contentFill/mode', 'Contain');

    // Create a pulsating loop animation
    const pulsating = engine.block.createAnimation('pulsating_loop');
    engine.block.setLoopAnimation(logoBlock, pulsating);
    engine.block.setDuration(pulsating, 1.5);

    // Add fade entrance for the logo
    const logoFadeIn = engine.block.createAnimation('fade');
    engine.block.setInAnimation(logoBlock, logoFadeIn);
    engine.block.setDuration(logoFadeIn, 0.8);
    engine.block.setEnum(logoFadeIn, 'animationEasing', 'EaseOut');

    // Position logo below title, centered
    const logoWidth = engine.block.getFrameWidth(logoBlock);
    engine.block.setPositionX(logoBlock, (pageWidth - logoWidth) / 2);
    engine.block.setPositionY(logoBlock, pageHeight * 0.25 + titleHeight + 40);

    // ===== Subtitle with text animation =====
    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(subtitleBlock, 'Entrance • Exit • Loop');
    engine.block.setTextFontSize(subtitleBlock, 48);
    engine.block.setTextColor(subtitleBlock, { r: 0.9, g: 0.9, b: 1.0, a: 0.9 });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.setDuration(subtitleBlock, 5.0);

    // Create text animation with word-by-word reveal
    const textAnim = engine.block.createAnimation('fade');
    engine.block.setInAnimation(subtitleBlock, textAnim);
    engine.block.setDuration(textAnim, 1.5);

    // Configure text animation writing style (Line, Word, or Character)
    engine.block.setEnum(textAnim, 'textAnimationWritingStyle', 'Word');
    // Set overlap for cascading effect (0 = sequential, 0-1 = cascading)
    engine.block.setFloat(textAnim, 'textAnimationOverlap', 0.3);

    // Position subtitle below logo
    const subtitleWidth = engine.block.getFrameWidth(subtitleBlock);
    engine.block.setPositionX(subtitleBlock, (pageWidth - subtitleWidth) / 2);
    engine.block.setPositionY(subtitleBlock, pageHeight * 0.65);

    // ===== Bottom right text with exit animation =====
    const footerBlock = engine.block.create('text');
    engine.block.replaceText(footerBlock, 'Powered by CE.SDK');
    engine.block.setTextFontSize(footerBlock, 32);
    engine.block.setTextColor(footerBlock, { r: 1.0, g: 1.0, b: 1.0, a: 0.7 });
    engine.block.setEnum(footerBlock, 'text/horizontalAlignment', 'Right');
    engine.block.setWidthMode(footerBlock, 'Auto');
    engine.block.setHeightMode(footerBlock, 'Auto');
    engine.block.appendChild(page, footerBlock);

    // Footer appears at start and fades out at the end
    engine.block.setTimeOffset(footerBlock, 0);
    engine.block.setDuration(footerBlock, 5.0);

    // Create exit animation that plays at the end of the block's duration
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(footerBlock, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');

    // Position footer at bottom right with padding
    const footerWidth = engine.block.getFrameWidth(footerBlock);
    const footerHeight = engine.block.getFrameHeight(footerBlock);
    engine.block.setPositionX(footerBlock, pageWidth - footerWidth - 60);
    engine.block.setPositionY(footerBlock, pageHeight - footerHeight - 40);

    // ===== Animation Properties Demo =====
    // Create slide animation and configure direction for title
    const titleInAnim = engine.block.getInAnimation(titleBlock);
    if (titleInAnim !== 0) {
      // Discover all available properties for this animation
      const properties = engine.block.findAllProperties(titleInAnim);
      console.log('Slide animation properties:', properties);
    }

    // Example: Retrieve animations to verify they're attached
    const currentTitleIn = engine.block.getInAnimation(titleBlock);
    const currentLogoLoop = engine.block.getLoopAnimation(logoBlock);
    const currentFooterOut = engine.block.getOutAnimation(footerBlock);

    console.log(
      'Animation IDs - Title In:',
      currentTitleIn,
      'Logo Loop:',
      currentLogoLoop,
      'Footer Out:',
      currentFooterOut
    );

    // Get available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);

    // Set initial playback time to show the scene after animations start
    engine.block.setPlaybackTime(page, 2.0);
  }
}

export default Example;
```

This guide covers how to create and configure animations programmatically, including entrance, exit, loop, and text animations with customizable timing and easing.

## Animation Fundamentals

We first verify that a block supports animations before creating and attaching them. The basic pattern involves creating an animation instance with `createAnimation()`, then attaching it using the appropriate setter method.

```typescript highlight-check-support
    const titleBlock = engine.block.create('text');
    engine.block.replaceText(titleBlock, 'Create Animations');
    engine.block.setTextFontSize(titleBlock, 120);
    engine.block.setTextColor(titleBlock, { r: 1.0, g: 1.0, b: 1.0, a: 1.0 });
    engine.block.setEnum(titleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(titleBlock, 'Auto');
    engine.block.setHeightMode(titleBlock, 'Auto');
    engine.block.appendChild(page, titleBlock);
    engine.block.setDuration(titleBlock, 5.0);

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(titleBlock)) {
      // Create an entrance animation
      const slideIn = engine.block.createAnimation('slide');
      engine.block.setInAnimation(titleBlock, slideIn);
      engine.block.setDuration(slideIn, 1.2);
      engine.block.setFloat(slideIn, 'animation/slide/direction', (3 * Math.PI) / 2);
      engine.block.setEnum(slideIn, 'animationEasing', 'EaseOut');
    }
```

Animation support is available for:

- **Graphic blocks** with image or video fills
- **Text blocks** with additional writing style options
- **Shape blocks** with fills

CE.SDK provides several animation presets:

- **Entrance animations**: slide, fade, blur, zoom, pop, wipe, pan
- **Exit animations**: same types as entrance
- **Loop animations**: breathing\_loop, spin\_loop, fade\_loop, pulsating\_loop, jump\_loop, squeeze\_loop, sway\_loop

## Entrance Animations

Entrance animations define how blocks appear on screen. We create the animation with `createAnimation()`, attach it with `setInAnimation()`, and configure the duration with `setDuration()`.

```typescript highlight-entrance-animation
// Add fade entrance for the logo
const logoFadeIn = engine.block.createAnimation('fade');
engine.block.setInAnimation(logoBlock, logoFadeIn);
engine.block.setDuration(logoFadeIn, 0.8);
engine.block.setEnum(logoFadeIn, 'animationEasing', 'EaseOut');
```

The `animationEasing` property controls the animation curve. Available options include Linear, EaseIn, EaseOut, and EaseInOut.

## Exit Animations

Exit animations define how blocks leave the screen. We attach them with `setOutAnimation()`. CE.SDK manages timing automatically to prevent overlap between entrance and exit animations.

```typescript highlight-exit-animation
    const footerBlock = engine.block.create('text');
    engine.block.replaceText(footerBlock, 'Powered by CE.SDK');
    engine.block.setTextFontSize(footerBlock, 32);
    engine.block.setTextColor(footerBlock, { r: 1.0, g: 1.0, b: 1.0, a: 0.7 });
    engine.block.setEnum(footerBlock, 'text/horizontalAlignment', 'Right');
    engine.block.setWidthMode(footerBlock, 'Auto');
    engine.block.setHeightMode(footerBlock, 'Auto');
    engine.block.appendChild(page, footerBlock);

    // Footer appears at start and fades out at the end
    engine.block.setTimeOffset(footerBlock, 0);
    engine.block.setDuration(footerBlock, 5.0);

    // Create exit animation that plays at the end of the block's duration
    const fadeOut = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(footerBlock, fadeOut);
    engine.block.setDuration(fadeOut, 1.0);
    engine.block.setEnum(fadeOut, 'animationEasing', 'EaseIn');
```

When a block has both entrance and exit animations, CE.SDK adjusts their timing based on the block's duration on the timeline.

## Loop Animations

Loop animations run continuously while the block is visible. We use animation types ending in `_loop` and attach them with `setLoopAnimation()`.

```typescript highlight-loop-animation
    const logoBlock = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 200, height: 200 } }
    );
    engine.block.appendChild(page, logoBlock);
    engine.block.setDuration(logoBlock, 5.0);
    // Contain the image within the block frame
    engine.block.setEnum(logoBlock, 'contentFill/mode', 'Contain');

    // Create a pulsating loop animation
    const pulsating = engine.block.createAnimation('pulsating_loop');
    engine.block.setLoopAnimation(logoBlock, pulsating);
    engine.block.setDuration(pulsating, 1.5);
```

Loop animations continue throughout the block's visible duration, creating continuous motion effects like breathing, spinning, or pulsating.

## Animation Properties

Each animation type exposes configurable properties. We use `setFloat()` and `setEnum()` to adjust these properties, and `findAllProperties()` to discover available options.

```typescript highlight-animation-properties
// Create slide animation and configure direction for title
const titleInAnim = engine.block.getInAnimation(titleBlock);
if (titleInAnim !== 0) {
  // Discover all available properties for this animation
  const properties = engine.block.findAllProperties(titleInAnim);
  console.log('Slide animation properties:', properties);
}
```

Common configurable properties include:

- **Direction**: Set in radians for slide animations (0=right, PI/2=bottom, PI=left, 3\*PI/2=top)
- **Easing**: Linear, EaseIn, EaseOut, EaseInOut

## Text Animations

Text blocks support additional animation properties for granular control over how text appears. The `textAnimationWritingStyle` property controls whether the animation applies to the entire text, line by line, word by word, or character by character.

```typescript highlight-text-animation
    const subtitleBlock = engine.block.create('text');
    engine.block.replaceText(subtitleBlock, 'Entrance • Exit • Loop');
    engine.block.setTextFontSize(subtitleBlock, 48);
    engine.block.setTextColor(subtitleBlock, { r: 0.9, g: 0.9, b: 1.0, a: 0.9 });
    engine.block.setEnum(subtitleBlock, 'text/horizontalAlignment', 'Center');
    engine.block.setWidthMode(subtitleBlock, 'Auto');
    engine.block.setHeightMode(subtitleBlock, 'Auto');
    engine.block.appendChild(page, subtitleBlock);
    engine.block.setDuration(subtitleBlock, 5.0);

    // Create text animation with word-by-word reveal
    const textAnim = engine.block.createAnimation('fade');
    engine.block.setInAnimation(subtitleBlock, textAnim);
    engine.block.setDuration(textAnim, 1.5);

    // Configure text animation writing style (Line, Word, or Character)
    engine.block.setEnum(textAnim, 'textAnimationWritingStyle', 'Word');
    // Set overlap for cascading effect (0 = sequential, 0-1 = cascading)
    engine.block.setFloat(textAnim, 'textAnimationOverlap', 0.3);
```

Writing style options:

- **Line**: Animate entire lines together
- **Word**: Animate word by word
- **Character**: Animate character by character

The `textAnimationOverlap` property (0 to 1) controls the cascading effect. A value of 0 means sequential animation, while values closer to 1 create more overlap between segments.

## Managing Animation Lifecycle

We can retrieve current animations using `getInAnimation()`, `getOutAnimation()`, and `getLoopAnimation()`. A return value of 0 indicates no animation is attached.

```typescript highlight-manage-lifecycle
    // Example: Retrieve animations to verify they're attached
    const currentTitleIn = engine.block.getInAnimation(titleBlock);
    const currentLogoLoop = engine.block.getLoopAnimation(logoBlock);
    const currentFooterOut = engine.block.getOutAnimation(footerBlock);

    console.log(
      'Animation IDs - Title In:',
      currentTitleIn,
      'Logo Loop:',
      currentLogoLoop,
      'Footer Out:',
      currentFooterOut
    );

    // Get available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    console.log('Available easing options:', easingOptions);
```

When replacing animations, destroy the old instance with `destroy()` to prevent memory leaks.

## Troubleshooting

### Animation Not Playing

Verify the block supports animations with `supportsAnimation()`. Check that the scene is in Video mode, as animations require timeline-based playback.

### Duration Issues

Ensure the animation is attached to a block before setting its duration. Duration is set on the animation instance, not the block.

### Memory Leaks

When replacing an animation, destroy the old animation instance before creating a new one:

```typescript
const current = engine.block.getInAnimation(block);
if (current !== 0) {
  engine.block.destroy(current);
}
const newAnim = engine.block.createAnimation('fade');
engine.block.setInAnimation(block, newAnim);
```

### Timing Conflicts

If entrance and exit animations seem to overlap incorrectly, CE.SDK automatically adjusts durations to prevent conflicts. Reduce individual animation durations if needed.

## API Reference

| Method                                        | Description                                |
| --------------------------------------------- | ------------------------------------------ |
| `engine.block.createAnimation(type)`          | Create animation instance                  |
| `engine.block.supportsAnimation(block)`       | Check if block supports animations         |
| `engine.block.setInAnimation(block, anim)`    | Attach entrance animation                  |
| `engine.block.setOutAnimation(block, anim)`   | Attach exit animation                      |
| `engine.block.setLoopAnimation(block, anim)`  | Attach loop animation                      |
| `engine.block.getInAnimation(block)`          | Get entrance animation (0 if none)         |
| `engine.block.getOutAnimation(block)`         | Get exit animation (0 if none)             |
| `engine.block.getLoopAnimation(block)`        | Get loop animation (0 if none)             |
| `engine.block.setDuration(anim, seconds)`     | Set animation duration                     |
| `engine.block.setEnum(anim, prop, value)`     | Set enum property (easing, writing style)  |
| `engine.block.setFloat(anim, prop, value)`    | Set float property (direction, overlap)    |
| `engine.block.findAllProperties(anim)`        | List available properties                  |
| `engine.block.getEnumValues(prop)`            | Get enum options                           |
| `engine.block.destroy(anim)`                  | Destroy animation instance                 |

## Next Steps

- [Base Animations](./animation/create/base.md) — Detailed non-text block animations
- [Text Animations](./animation/create/text.md) — Text-specific animation control
- [Edit Animations](./animation/edit.md) — Modify existing animations
- [Animation Overview](./animation/overview.md) — Animation concepts



---

## Related Pages

- [Base Animations](./animation/create/base.md) - Apply movement, scaling, rotation, or opacity changes to elements using timeline-based keyframes.
- [Text Animations](./animation/create/text.md) - Animate text elements with effects like fade, typewriter, and bounce for dynamic visual presentation.


---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support