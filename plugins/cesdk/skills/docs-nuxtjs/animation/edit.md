> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Edit Animations](./animation/edit.md)

---

Modify existing animations by reading properties, changing duration and easing, and replacing or removing animations from blocks.

![Edit animations demonstrating property modification, easing changes, and animation replacement on image blocks](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-animation-edit-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-animation-edit-browser)
>
> - [Live demo](https://img.ly/examples/guides-animation-edit-browser/)

Editing animations in CE.SDK involves retrieving existing animations from blocks and modifying their properties. This guide assumes you've already created and attached animations to blocks as covered in the [Base Animations](./animation/create/base.md) guide.

```typescript file=@cesdk_web_examples/guides-animation-edit-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { VideoEditorConfig } from './video-editor/plugin';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Edit Animations Guide
 *
 * Demonstrates how to edit existing animations in CE.SDK:
 * - Retrieving animations from blocks
 * - Reading animation properties (type, duration, easing)
 * - Modifying animation duration and easing
 * - Adjusting animation-specific properties
 * - Replacing and removing animations
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
    await cesdk.addPlugin(new VideoEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: ['ly.img.image.upload', 'ly.img.video.upload', 'ly.img.audio.upload']
      })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.video.*',
          'ly.img.image.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(
      new PagePresetsAssetSource({
        include: [
          'ly.img.page.presets.instagram.*',
          'ly.img.page.presets.facebook.*',
          'ly.img.page.presets.x.*',
          'ly.img.page.presets.linkedin.*',
          'ly.img.page.presets.pinterest.*',
          'ly.img.page.presets.tiktok.*',
          'ly.img.page.presets.youtube.*',
          'ly.img.page.presets.video.*'
        ]
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1920, height: 1080, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const pages = engine.block.findByType('page');
    const page = pages[0]!;

    // Set white background color
    const pageFill = engine.block.getFill(page);
    if (pageFill) {
      engine.block.setColor(pageFill, 'fill/color/value', {
        r: 1.0,
        g: 1.0,
        b: 1.0,
        a: 1.0
      });
    }

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper to create an image block with an initial animation
    const createAnimatedBlock = async (index: number, imageUrl: string) => {
      const graphic = engine.block.create('graphic');
      const imageFill = engine.block.createFill('image');
      engine.block.setString(imageFill, 'fill/image/imageFileURI', imageUrl);
      engine.block.setFill(graphic, imageFill);
      engine.block.setShape(graphic, engine.block.createShape('rect'));
      engine.block.setWidth(graphic, blockWidth);
      engine.block.setHeight(graphic, blockHeight);
      const pos = getPosition(index);
      engine.block.setPositionX(graphic, pos.x);
      engine.block.setPositionY(graphic, pos.y);
      engine.block.appendChild(page, graphic);

      // Add an initial slide animation
      const slideAnim = engine.block.createAnimation('slide');
      engine.block.setInAnimation(graphic, slideAnim);
      engine.block.setDuration(slideAnim, 1.0);

      return graphic;
    };

    // Sample images for demonstration
    const imageUrls = [
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      'https://img.ly/static/ubq_samples/sample_2.jpg',
      'https://img.ly/static/ubq_samples/sample_3.jpg',
      'https://img.ly/static/ubq_samples/sample_4.jpg',
      'https://img.ly/static/ubq_samples/sample_5.jpg',
      'https://img.ly/static/ubq_samples/sample_6.jpg'
    ];

    // Block 1: Retrieve animations and check their existence
    const block1 = await createAnimatedBlock(0, imageUrls[0]);

    // Retrieve animations from a block
    const inAnimation = engine.block.getInAnimation(block1);
    const outAnimation = engine.block.getOutAnimation(block1);
    const loopAnimation = engine.block.getLoopAnimation(block1);

    // Check if animations exist (0 means no animation)
    console.log('In animation:', inAnimation !== 0 ? 'exists' : 'none');
    console.log('Out animation:', outAnimation !== 0 ? 'exists' : 'none');
    console.log('Loop animation:', loopAnimation !== 0 ? 'exists' : 'none');

    // Get animation type if it exists
    if (inAnimation !== 0) {
      const animationType = engine.block.getType(inAnimation);
      console.log('Animation type:', animationType);
    }

    // Block 2: Read animation properties
    const block2 = await createAnimatedBlock(1, imageUrls[1]);

    // Read animation properties
    const animation2 = engine.block.getInAnimation(block2);
    if (animation2 !== 0) {
      // Get current duration
      const duration = engine.block.getDuration(animation2);
      console.log('Duration:', duration, 'seconds');

      // Get current easing
      const easing = engine.block.getEnum(animation2, 'animationEasing');
      console.log('Easing:', easing);

      // Discover all available properties
      const allProperties = engine.block.findAllProperties(animation2);
      console.log('Available properties:', allProperties);
    }

    // Block 3: Modify animation duration
    const block3 = await createAnimatedBlock(2, imageUrls[2]);

    // Modify animation duration
    const animation3 = engine.block.getInAnimation(block3);
    if (animation3 !== 0) {
      // Change duration to 1.5 seconds
      engine.block.setDuration(animation3, 1.5);

      // Verify the change
      const newDuration = engine.block.getDuration(animation3);
      console.log('Updated duration:', newDuration, 'seconds');
    }

    // Block 4: Change easing function
    const block4 = await createAnimatedBlock(3, imageUrls[3]);

    // Change animation easing
    const animation4 = engine.block.getInAnimation(block4);
    if (animation4 !== 0) {
      // Query available easing options
      const easingOptions = engine.block.getEnumValues('animationEasing');
      console.log('Available easing options:', easingOptions);

      // Set easing to EaseInOut for smooth acceleration and deceleration
      engine.block.setEnum(animation4, 'animationEasing', 'EaseInOut');
    }

    // Block 5: Adjust animation-specific properties (slide direction)
    const block5 = await createAnimatedBlock(4, imageUrls[4]);

    // Adjust animation-specific properties
    const animation5 = engine.block.getInAnimation(block5);
    if (animation5 !== 0) {
      // Get current direction (for slide animations)
      const currentDirection = engine.block.getFloat(
        animation5,
        'animation/slide/direction'
      );
      console.log('Current direction (radians):', currentDirection);

      // Change direction to slide from top (3*PI/2 radians)
      engine.block.setFloat(
        animation5,
        'animation/slide/direction',
        (3 * Math.PI) / 2
      );
    }

    // Block 6: Replace and remove animations
    const block6 = await createAnimatedBlock(5, imageUrls[5]);

    // Replace an existing animation
    const oldAnimation = engine.block.getInAnimation(block6);
    if (oldAnimation !== 0) {
      // Destroy the old animation to prevent memory leaks
      engine.block.destroy(oldAnimation);
    }

    // Create and set a new animation
    const newAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block6, newAnimation);
    engine.block.setDuration(newAnimation, 1.2);
    engine.block.setEnum(newAnimation, 'animationEasing', 'EaseOut');

    // Add a loop animation to demonstrate removal
    const loopAnim = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block6, loopAnim);
    engine.block.setDuration(loopAnim, 1.0);

    // Remove the loop animation by destroying it
    const currentLoop = engine.block.getLoopAnimation(block6);
    if (currentLoop !== 0) {
      engine.block.destroy(currentLoop);
      // Verify removal - should now return 0
      const verifyLoop = engine.block.getLoopAnimation(block6);
      console.log(
        'Loop animation after removal:',
        verifyLoop === 0 ? 'none' : 'exists'
      );
    }
  }
}

export default Example;
```

This guide covers retrieving animations, reading and modifying properties, changing easing functions, adjusting animation-specific settings, and replacing or removing animations.

## Retrieving Animations

Before modifying an animation, we retrieve it from the block using `getInAnimation()`, `getOutAnimation()`, or `getLoopAnimation()`. A return value of `0` indicates no animation is attached.

```typescript highlight-retrieve-animations
    // Retrieve animations from a block
    const inAnimation = engine.block.getInAnimation(block1);
    const outAnimation = engine.block.getOutAnimation(block1);
    const loopAnimation = engine.block.getLoopAnimation(block1);

    // Check if animations exist (0 means no animation)
    console.log('In animation:', inAnimation !== 0 ? 'exists' : 'none');
    console.log('Out animation:', outAnimation !== 0 ? 'exists' : 'none');
    console.log('Loop animation:', loopAnimation !== 0 ? 'exists' : 'none');

    // Get animation type if it exists
    if (inAnimation !== 0) {
      const animationType = engine.block.getType(inAnimation);
      console.log('Animation type:', animationType);
    }
```

We use `getType()` to identify the animation type (slide, fade, zoom, etc.). This is useful when you need to apply type-specific modifications.

## Reading Animation Properties

We can inspect current animation settings using property getters. `getDuration()` returns the animation length in seconds, while `getEnum()` retrieves values like easing functions.

```typescript highlight-read-properties
    // Read animation properties
    const animation2 = engine.block.getInAnimation(block2);
    if (animation2 !== 0) {
      // Get current duration
      const duration = engine.block.getDuration(animation2);
      console.log('Duration:', duration, 'seconds');

      // Get current easing
      const easing = engine.block.getEnum(animation2, 'animationEasing');
      console.log('Easing:', easing);

      // Discover all available properties
      const allProperties = engine.block.findAllProperties(animation2);
      console.log('Available properties:', allProperties);
    }
```

Use `findAllProperties()` to discover all configurable properties for an animation. Different animation types expose different properties—slide animations have direction, while loop animations may have intensity or scale properties.

## Modifying Animation Duration

Change animation timing with `setDuration()`. The duration is specified in seconds.

```typescript highlight-modify-duration
    // Modify animation duration
    const animation3 = engine.block.getInAnimation(block3);
    if (animation3 !== 0) {
      // Change duration to 1.5 seconds
      engine.block.setDuration(animation3, 1.5);

      // Verify the change
      const newDuration = engine.block.getDuration(animation3);
      console.log('Updated duration:', newDuration, 'seconds');
    }
```

When modifying In or Out animation durations, CE.SDK automatically adjusts the paired animation to prevent overlap. For loop animations, the duration defines the cycle length.

## Changing Easing Functions

Easing controls animation acceleration. We use `setEnum()` with the `'animationEasing'` property to change it.

```typescript highlight-change-easing
    // Change animation easing
    const animation4 = engine.block.getInAnimation(block4);
    if (animation4 !== 0) {
      // Query available easing options
      const easingOptions = engine.block.getEnumValues('animationEasing');
      console.log('Available easing options:', easingOptions);

      // Set easing to EaseInOut for smooth acceleration and deceleration
      engine.block.setEnum(animation4, 'animationEasing', 'EaseInOut');
    }
```

Use `getEnumValues('animationEasing')` to discover available options:

| Easing      | Description                                     |
| ----------- | ----------------------------------------------- |
| `Linear`    | Constant speed throughout                       |
| `EaseIn`    | Starts slow, accelerates toward the end         |
| `EaseOut`   | Starts fast, decelerates toward the end         |
| `EaseInOut` | Starts slow, speeds up, then slows down again   |

## Adjusting Animation-Specific Properties

Each animation type has unique configurable properties. For slide animations, we can change the entry direction.

```typescript highlight-adjust-properties
    // Adjust animation-specific properties
    const animation5 = engine.block.getInAnimation(block5);
    if (animation5 !== 0) {
      // Get current direction (for slide animations)
      const currentDirection = engine.block.getFloat(
        animation5,
        'animation/slide/direction'
      );
      console.log('Current direction (radians):', currentDirection);

      // Change direction to slide from top (3*PI/2 radians)
      engine.block.setFloat(
        animation5,
        'animation/slide/direction',
        (3 * Math.PI) / 2
      );
    }
```

The `animation/slide/direction` property uses radians:

- `0` — From the right
- `Math.PI / 2` — From the bottom
- `Math.PI` — From the left
- `3 * Math.PI / 2` — From the top

For text animations, you can adjust `textAnimationWritingStyle` (Line, Word, Character) and `textAnimationOverlap` (0 for sequential, 1 for simultaneous).

## Replacing Animations

To swap an animation type, destroy the existing animation before setting a new one. This prevents memory leaks from orphaned animation objects.

```typescript highlight-replace-animation
    // Replace an existing animation
    const oldAnimation = engine.block.getInAnimation(block6);
    if (oldAnimation !== 0) {
      // Destroy the old animation to prevent memory leaks
      engine.block.destroy(oldAnimation);
    }

    // Create and set a new animation
    const newAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block6, newAnimation);
    engine.block.setDuration(newAnimation, 1.2);
    engine.block.setEnum(newAnimation, 'animationEasing', 'EaseOut');
```

We first retrieve and destroy the old animation, then create and attach a new one with the desired type and properties.

## Removing Animations

Remove an animation by destroying it. After destruction, the getter returns `0`.

```typescript highlight-remove-animation
    // Add a loop animation to demonstrate removal
    const loopAnim = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block6, loopAnim);
    engine.block.setDuration(loopAnim, 1.0);

    // Remove the loop animation by destroying it
    const currentLoop = engine.block.getLoopAnimation(block6);
    if (currentLoop !== 0) {
      engine.block.destroy(currentLoop);
      // Verify removal - should now return 0
      const verifyLoop = engine.block.getLoopAnimation(block6);
      console.log(
        'Loop animation after removal:',
        verifyLoop === 0 ? 'none' : 'exists'
      );
    }
```

Destroying a design block automatically destroys all its attached animations. However, detached animations must be destroyed manually to free memory.

## API Reference

| Method                                | Description                                        |
| ------------------------------------- | -------------------------------------------------- |
| `block.getInAnimation(block)`         | Get entrance animation (returns 0 if none)         |
| `block.getOutAnimation(block)`        | Get exit animation (returns 0 if none)             |
| `block.getLoopAnimation(block)`       | Get loop animation (returns 0 if none)             |
| `block.getType(anim)`                 | Get animation type string                          |
| `block.getDuration(anim)`             | Get animation duration in seconds                  |
| `block.setDuration(anim, seconds)`    | Set animation duration                             |
| `block.getEnum(anim, prop)`           | Get enum property value                            |
| `block.setEnum(anim, prop, value)`    | Set enum property value                            |
| `block.getFloat(anim, prop)`          | Get float property value                           |
| `block.setFloat(anim, prop, value)`   | Set float property value                           |
| `block.findAllProperties(anim)`       | Get all available properties                       |
| `block.getEnumValues(prop)`           | Get available values for enum property             |
| `block.destroy(anim)`                 | Destroy animation and free memory                  |

## Next Steps

- [Base Animations](./animation/create/base.md) — Create entrance, exit, and loop animations
- [Text Animations](./animation/create/text.md) — Animate text with writing styles and character control
- [Animation Overview](./animation/overview.md) — Understand animation concepts and capabilities



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support