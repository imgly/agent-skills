> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Animation](./animation.md) > [Create Animations](./animation/create.md) > [Base Animations](./animation/create/base.md)

---

Add motion to design blocks with entrance, exit, and loop animations using
CE.SDK's animation system.

![Base animations demonstrating slide, fade, zoom, and loop effects on image blocks](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-base-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-animation-create-base-browser)
>
> - [Live demo](https://img.ly/examples/guides-animation-create-base-browser/)

Base animations in CE.SDK add motion to design blocks through entrance (In), exit (Out), and loop animations. Animations are created as separate objects and attached to blocks, enabling reusable configurations across multiple elements.

```typescript file=@cesdk_web_examples/guides-animation-create-base-browser/browser.ts reference-only
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
 * CE.SDK Plugin: Base Animations Guide
 *
 * Demonstrates animation features for design blocks in CE.SDK:
 * - Creating and applying entrance (In) animations
 * - Creating and applying exit (Out) animations
 * - Creating and applying loop animations
 * - Configuring duration and easing
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
    const scene = engine.scene.get();
    const pages = engine.block.findByType('page');
    const page = pages.length > 0 ? pages[0] : scene;

    // Set white background color
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

    // Calculate grid layout for 6 demonstration blocks
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 6);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Helper to create an image block
    const createImageBlock = async (index: number, imageUrl: string) => {
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

    // Block 1: Check animation support and create entrance animation
    const block1 = await createImageBlock(0, imageUrls[0]);

    // Check if block supports animations before applying
    if (engine.block.supportsAnimation(block1)) {
      // Create an entrance animation
      const slideAnimation = engine.block.createAnimation('slide');
      engine.block.setInAnimation(block1, slideAnimation);
      engine.block.setDuration(slideAnimation, 1.0);
    }

    // Block 2: Entrance animation with easing configuration
    const block2 = await createImageBlock(1, imageUrls[1]);

    // Create a fade entrance animation with easing
    const fadeInAnimation = engine.block.createAnimation('fade');
    engine.block.setInAnimation(block2, fadeInAnimation);
    engine.block.setDuration(fadeInAnimation, 1.0);
    engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');

    // Block 3: Exit animation
    const block3 = await createImageBlock(2, imageUrls[2]);

    // Create an exit animation
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');

    // Block 4: Loop animation
    const block4 = await createImageBlock(3, imageUrls[3]);

    // Create a breathing loop animation
    const breathingLoop = engine.block.createAnimation('breathing_loop');
    engine.block.setLoopAnimation(block4, breathingLoop);
    engine.block.setDuration(breathingLoop, 1.0);

    // Block 5: Animation properties and slide direction
    const block5 = await createImageBlock(4, imageUrls[4]);

    // Create slide animation and configure direction
    const slideFromTop = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block5, slideFromTop);
    engine.block.setDuration(slideFromTop, 1.0);

    // Set slide direction (in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top)
    engine.block.setFloat(
      slideFromTop,
      'animation/slide/direction',
      Math.PI / 2
    );
    engine.block.setEnum(slideFromTop, 'animationEasing', 'EaseInOut');

    // Discover all available properties for this animation
    const properties = engine.block.findAllProperties(slideFromTop);
    // eslint-disable-next-line no-console
    console.log('Slide animation properties:', properties);

    // Block 6: Get animations and replace them
    const block6 = await createImageBlock(5, imageUrls[5]);

    // Set initial animations
    const initialIn = engine.block.createAnimation('pan');
    engine.block.setInAnimation(block6, initialIn);
    engine.block.setDuration(initialIn, 1.0);

    const spinLoop = engine.block.createAnimation('spin_loop');
    engine.block.setLoopAnimation(block6, spinLoop);
    engine.block.setDuration(spinLoop, 1.0);

    // Get current animations
    const currentIn = engine.block.getInAnimation(block6);
    const currentLoop = engine.block.getLoopAnimation(block6);
    const currentOut = engine.block.getOutAnimation(block6);

    // eslint-disable-next-line no-console
    console.log(
      'Animation IDs - In:',
      currentIn,
      'Loop:',
      currentLoop,
      'Out:',
      currentOut
    );

    // Replace in animation (destroy old one first to avoid memory leaks)
    if (currentIn !== 0) {
      engine.block.destroy(currentIn);
    }
    const newInAnimation = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block6, newInAnimation);
    engine.block.setDuration(newInAnimation, 1.0);

    // Query available easing options
    const easingOptions = engine.block.getEnumValues('animationEasing');
    // eslint-disable-next-line no-console
    console.log('Available easing options:', easingOptions);

    // Set initial playback time to 1 second (after entrance animations)
    engine.block.setPlaybackTime(page, 1.0);
  }
}

export default Example;
```

This guide covers creating animations, attaching them to blocks, configuring properties like duration and easing, and managing animation lifecycle.

## Animation Fundamentals

Before applying animations to a block, we verify it supports them using `supportsAnimation()`. Once confirmed, we create an animation instance and attach it to the block.

```typescript highlight-supports-animation
// Check if block supports animations before applying
if (engine.block.supportsAnimation(block1)) {
  // Create an entrance animation
  const slideAnimation = engine.block.createAnimation('slide');
  engine.block.setInAnimation(block1, slideAnimation);
  engine.block.setDuration(slideAnimation, 1.0);
}
```

We use `createAnimation()` with an animation type like `'slide'`, `'fade'`, or `'zoom'`. The animation is then attached using `setInAnimation()` for entrance animations. Duration is set with `setDuration()` in seconds.

CE.SDK provides several animation types:

- **Entrance animations**: `slide`, `fade`, `blur`, `grow`, `zoom`, `pop`, `wipe`, `pan`, `baseline`, `spin`
- **Loop animations**: `spin_loop`, `fade_loop`, `blur_loop`, `pulsating_loop`, `breathing_loop`, `jump_loop`, `squeeze_loop`, `sway_loop`

## Entrance Animations

Entrance animations (In animations) define how a block appears on screen. We create the animation, attach it with `setInAnimation()`, and configure its properties.

```typescript highlight-entrance-animation
// Create a fade entrance animation with easing
const fadeInAnimation = engine.block.createAnimation('fade');
engine.block.setInAnimation(block2, fadeInAnimation);
engine.block.setDuration(fadeInAnimation, 1.0);
engine.block.setEnum(fadeInAnimation, 'animationEasing', 'EaseOut');
```

We use `setEnum()` to configure the easing function. Available easing options include `'Linear'`, `'EaseIn'`, `'EaseOut'`, and `'EaseInOut'`. The `'EaseOut'` easing starts fast and slows down toward the end, creating a natural deceleration effect.

## Exit Animations

Exit animations (Out animations) define how a block leaves the screen. We use `setOutAnimation()` to attach them.

```typescript highlight-exit-animation
    // Create an exit animation
    const zoomInAnimation = engine.block.createAnimation('zoom');
    engine.block.setInAnimation(block3, zoomInAnimation);
    engine.block.setDuration(zoomInAnimation, 1.0);

    const fadeOutAnimation = engine.block.createAnimation('fade');
    engine.block.setOutAnimation(block3, fadeOutAnimation);
    engine.block.setDuration(fadeOutAnimation, 1.0);
    engine.block.setEnum(fadeOutAnimation, 'animationEasing', 'EaseIn');
```

When using both entrance and exit animations, CE.SDK automatically manages their timing to prevent overlap. Changing the duration of an In animation may adjust the Out animation's duration to maintain valid timing.

## Loop Animations

Loop animations run continuously while the block is visible. We use `setLoopAnimation()` to attach them.

```typescript highlight-loop-animation
// Create a breathing loop animation
const breathingLoop = engine.block.createAnimation('breathing_loop');
engine.block.setLoopAnimation(block4, breathingLoop);
engine.block.setDuration(breathingLoop, 1.0);
```

The duration for loop animations defines the length of each cycle. A 2-second breathing loop will complete one full pulse every 2 seconds.

## Animation Properties

Each animation type has specific configurable properties. We use `findAllProperties()` to discover available properties for an animation.

```typescript highlight-animation-properties
    // Create slide animation and configure direction
    const slideFromTop = engine.block.createAnimation('slide');
    engine.block.setInAnimation(block5, slideFromTop);
    engine.block.setDuration(slideFromTop, 1.0);

    // Set slide direction (in radians: 0=right, PI/2=bottom, PI=left, 3*PI/2=top)
    engine.block.setFloat(
      slideFromTop,
      'animation/slide/direction',
      Math.PI / 2
    );
    engine.block.setEnum(slideFromTop, 'animationEasing', 'EaseInOut');

    // Discover all available properties for this animation
    const properties = engine.block.findAllProperties(slideFromTop);
    // eslint-disable-next-line no-console
    console.log('Slide animation properties:', properties);
```

For slide animations, the `animation/slide/direction` property controls the entry direction in radians:

- `0` — From the right
- `Math.PI / 2` — From the bottom
- `Math.PI` — From the left
- `3 * Math.PI / 2` — From the top

## Managing Animation Lifecycle

Animation objects must be properly managed to avoid memory leaks. When replacing an animation, we destroy the old one before setting the new one. We can retrieve current animations using `getInAnimation()`, `getOutAnimation()`, and `getLoopAnimation()`.

```typescript highlight-manage-animations
    // Set initial animations
    const initialIn = engine.block.createAnimation('pan');
    engine.block.setInAnimation(block6, initialIn);
    engine.block.setDuration(initialIn, 1.0);

    const spinLoop = engine.block.createAnimation('spin_loop');
    engine.block.setLoopAnimation(block6, spinLoop);
    engine.block.setDuration(spinLoop, 1.0);

    // Get current animations
    const currentIn = engine.block.getInAnimation(block6);
    const currentLoop = engine.block.getLoopAnimation(block6);
    const currentOut = engine.block.getOutAnimation(block6);

    // eslint-disable-next-line no-console
    console.log(
      'Animation IDs - In:',
      currentIn,
      'Loop:',
      currentLoop,
      'Out:',
      currentOut
    );

    // Replace in animation (destroy old one first to avoid memory leaks)
    if (currentIn !== 0) {
      engine.block.destroy(currentIn);
    }
    const newInAnimation = engine.block.createAnimation('wipe');
    engine.block.setInAnimation(block6, newInAnimation);
    engine.block.setDuration(newInAnimation, 1.0);
```

A return value of `0` indicates no animation is attached. Destroying a design block also destroys all its attached animations, but detached animations must be destroyed manually.

## Easing Functions

We can query available easing options using `getEnumValues()`.

```typescript highlight-easing-options
// Query available easing options
const easingOptions = engine.block.getEnumValues('animationEasing');
// eslint-disable-next-line no-console
console.log('Available easing options:', easingOptions);
```

Easing functions control animation acceleration:

| Easing      | Description                                   |
| ----------- | --------------------------------------------- |
| `Linear`    | Constant speed throughout                     |
| `EaseIn`    | Starts slow, accelerates toward the end       |
| `EaseOut`   | Starts fast, decelerates toward the end       |
| `EaseInOut` | Starts slow, speeds up, then slows down again |

## API Reference

| Method                          | Description                                |
| ------------------------------- | ------------------------------------------ |
| `createAnimation(type)`         | Create a new animation instance            |
| `supportsAnimation(block)`      | Check if block supports animations         |
| `setInAnimation(block, anim)`   | Apply entrance animation to block          |
| `setOutAnimation(block, anim)`  | Apply exit animation to block              |
| `setLoopAnimation(block, anim)` | Apply loop animation to block              |
| `getInAnimation(block)`         | Get entrance animation (returns 0 if none) |
| `getOutAnimation(block)`        | Get exit animation (returns 0 if none)     |
| `getLoopAnimation(block)`       | Get loop animation (returns 0 if none)     |
| `setDuration(anim, seconds)`    | Set animation duration                     |
| `getDuration(anim)`             | Get animation duration                     |
| `setEnum(anim, prop, value)`    | Set enum property (easing, etc.)           |
| `setFloat(anim, prop, value)`   | Set float property (direction, etc.)       |
| `findAllProperties(anim)`       | Get all available properties for animation |
| `getEnumValues(prop)`           | Get available values for enum property     |
| `destroy(anim)`                 | Destroy animation instance                 |

## Next Steps

- [Text Animations](./animation/create/text.md) — Animate text with writing styles
  and character control
- [Animation Overview](./animation/overview.md) — Understand animation concepts
  and capabilities



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support