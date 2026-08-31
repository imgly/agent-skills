> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Customization](./user-interface/customization.md) > [Video Timeline](./user-interface/customization/video-timeline.md)

---

The video timeline is the editor's playback and arrangement surface. In this
guide we will see how to use the Feature, Component Order, and Actions APIs
and engine settings to customize the video timeline.

![Video timeline customization showing a multi-track layout, an always-visible transition control, a fixed-height timeline, and a custom Rewind button](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0-nightly.20260831/examples/guides-user-interface-customization-video-timeline-browser/index.html)

CE.SDK allows you to customize the timeline at runtime: toggle the visibility of the timeline and its buttons, customize the controls bar and its height behavior, and more. The Overview below lists each customization point.

```typescript file=@cesdk_web_examples/guides-user-interface-customization-video-timeline-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ImageColorsAssetSource,
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
import { VideoEditorConfig } from '@cesdk/core-configs-web/video-editor';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Load the video editor config (provides the timeline, playback, and full UI)
    await cesdk.addPlugin(new VideoEditorConfig());

    // The timeline and its parts are gated by the Feature API. Enable the whole
    // family with a glob, or enable individual features for finer control.
    cesdk.feature.enable('ly.img.video.timeline.*');

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new CaptionPresetsAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({
        include: [
          'ly.img.image.upload',
          'ly.img.video.upload',
          'ly.img.audio.upload'
        ]
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
        include: ['ly.img.page.presets.video.*']
      })
    );
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: 1280, height: 720, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    // Build a video track with three clips and a background music track so the
    // timeline renders multiple rows worth of content to customize.
    const videoUrls = [
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-tony-schnagl-5528015.mp4',
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-taryn-elliott-8713114.mp4'
    ];

    const videoTrack = engine.block.create('track');
    engine.block.appendChild(page, videoTrack);

    const clips: number[] = [];
    for (const url of videoUrls) {
      const clip = await engine.block.addVideo(url, 1280, 720, {
        timeline: { duration: 4 }
      });
      engine.block.appendChild(videoTrack, clip);
      clips.push(clip);
    }
    engine.block.fillParent(videoTrack);

    // A cross-fade between the first two clips gives the transition control
    // something to render in the timeline.
    const crossFade = engine.block.createTransition('cross-fade');
    engine.block.setDuration(crossFade, 1);
    engine.block.setTransition(clips[0], crossFade);

    // A second track holding an audio clip demonstrates the multi-track view.
    const audioBlock = engine.block.create('audio');
    engine.block.appendChild(page, audioBlock);
    engine.block.setString(
      audioBlock,
      'audio/fileURI',
      'https://cdn.img.ly/assets/demo/v1/ly.img.audio/audios/far_from_home.m4a'
    );
    engine.block.setDuration(audioBlock, 12);

    // Show every track in the timeline. 'active' collapses the timeline to a
    // single row showing only the selected track's clips.
    cesdk.engine.editor.setSetting('timeline/trackVisibility', 'all');

    // Keep the transition control between adjacent clips permanently visible
    // instead of revealing it only on hover.
    cesdk.engine.editor.setSetting(
      'timeline/transitionControlVisibility',
      'always'
    );

    // Give the timeline a fixed 320px height. Pass { height: 'auto' } to
    // restore the content-hugging default, or add maxHeight to cap how tall
    // the auto-growing timeline may get.
    cesdk.actions.run('timeline.setHeight', { height: 320 });

    // Register a custom Rewind button that jumps playback back to the start.
    cesdk.ui.registerComponent(
      'ly.img.video.timeline.rewind',
      ({ builder }) => {
        builder.Button('rewind', {
          label: 'Rewind',
          icon: '@imgly/Repeat',
          onClick: () => {
            engine.block.setPlaybackTime(page, 0);
          }
        });
      }
    );

    // The video editor config already sets a default controls bar order. Add
    // the Rewind button to the front and remove the loop control.
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.video.timeline.controls.bar', position: 'start' },
      'ly.img.video.timeline.rewind'
    );

    cesdk.ui.removeOrderComponent({
      in: 'ly.img.video.timeline.controls.bar',
      match: 'ly.img.video.timeline.loop'
    });

    // The "Add Clip" button below the tracks runs the built-in `addClip`
    // action. Toggle the button with its feature, or register your own action
    // to change what the button does.
    cesdk.feature.enable('ly.img.video.timeline.addClip');

    cesdk.actions.register('addClip', () => {
      cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
        payload: {
          entries: ['ly.img.image', 'ly.img.video'],
          applyAssetContext: { clipType: 'clip' }
        }
      });
    });

    // Select the first clip so the timeline is populated for the hero image.
    engine.block.select(clips[0]);
  }
}

export default Example;
```

## Overview

The timeline is customized through four APIs, each covered in its own section below:

- **Enable / Disable** — enable or disable the timeline and its individual buttons through the Feature API using `ly.img.video.timeline.*` keys.
- **Order Component APIs** — order, add, and remove the timeline buttons through the Component Order API on the `ly.img.video.timeline.controls.bar` area.
- **Customization Actions** — set a fixed height, cap the maximum height or restore the content-hugging default through the `timeline.setHeight` action.
- **Engine Settings** — control track and transition visibility through the `timeline/trackVisibility` and `timeline/transitionControlVisibility` settings.

## Enable / Disable

The timeline and its individual controls are governed by the Feature API. Enable or disable the entire family with a glob pattern, or address individual feature keys for finer-grained control.

```typescript highlight=highlight-enable-features
// The timeline and its parts are gated by the Feature API. Enable the whole
// family with a glob, or enable individual features for finer control.
cesdk.feature.enable('ly.img.video.timeline.*');
```

Each key toggles a specific part of the timeline:

| Feature key                                   | Enables                              |
| --------------------------------------------- | ------------------------------------ |
| `ly.img.video.timeline`                       | The timeline surface itself          |
| `ly.img.video.timeline.ruler`                 | The time ruler above the tracks      |
| `ly.img.video.timeline.clips`                 | Clip editing on the tracks           |
| `ly.img.video.timeline.audio`                 | The audio track                      |
| `ly.img.video.timeline.overlays`              | Overlay tracks                       |
| `ly.img.video.timeline.addClip`               | The add clip button below the tracks |
| `ly.img.video.timeline.clip.menu`             | The per-clip context menu            |
| `ly.img.video.timeline.controls`              | The controls bar base feature        |
| `ly.img.video.timeline.controls.bar`          | The controls bar area itself         |
| `ly.img.video.timeline.controls.toggle`       | The expand/collapse control          |
| `ly.img.video.timeline.controls.playback`     | The play/pause control               |
| `ly.img.video.timeline.controls.loop`         | The loop control                     |
| `ly.img.video.timeline.controls.split`        | The split control                    |
| `ly.img.video.timeline.controls.background`   | The background color control         |
| `ly.img.video.timeline.controls.timelineZoom` | The zoom control                     |

## Order Component APIs

The controls bar holds the timeline's buttons — play/pause, split, loop, zoom, and so on. It is a Component Order API area identified by `ly.img.video.timeline.controls.bar`, and it is gated by the `ly.img.video.timeline.controls.bar` feature. You register custom components and set the order the same way as for the dock or inspector bar.

First register a custom Rewind button with `registerComponent`. The builder's `Button` takes a label, an icon, and a click handler that seeks playback back to the start.

```typescript highlight=highlight-custom-control
// Register a custom Rewind button that jumps playback back to the start.
cesdk.ui.registerComponent(
  'ly.img.video.timeline.rewind',
  ({ builder }) => {
    builder.Button('rewind', {
      label: 'Rewind',
      icon: '@imgly/Repeat',
      onClick: () => {
        engine.block.setPlaybackTime(page, 0);
      }
    });
  }
);
```

The video editor config already sets a default controls bar order, so you can adjust it in place instead of replacing the whole order. We add the Rewind button to the front with `insertOrderComponent` and remove the loop control with `removeOrderComponent`.

```typescript highlight=highlight-controls-order
    // The video editor config already sets a default controls bar order. Add
    // the Rewind button to the front and remove the loop control.
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.video.timeline.controls.bar', position: 'start' },
      'ly.img.video.timeline.rewind'
    );

    cesdk.ui.removeOrderComponent({
      in: 'ly.img.video.timeline.controls.bar',
      match: 'ly.img.video.timeline.loop'
    });
```

> **Note:** As of CE.SDK 1.82 the engine ships **no built-in default order** for the
> controls bar. The video editor config provides one, so `insertOrderComponent`
> and `removeOrderComponent` have an existing order to adjust. Without a config
> that sets an order, the bar renders nothing until you call `setComponentOrder`
> yourself.

### Built-in Component IDs

These IDs are available for the controls bar order, in addition to any custom components you register.

| Component ID                         | Description                                 |
| ------------------------------------ | ------------------------------------------- |
| `ly.img.separator`                   | Visual divider between components           |
| `ly.img.spacer`                      | Flexible space that pushes components apart |
| `ly.img.video.timeline.background`   | Timeline background color button            |
| `ly.img.video.timeline.split`        | Split the selected clip at the playhead     |
| `ly.img.video.timeline.playbackInfo` | Current time and total duration readout     |
| `ly.img.video.timeline.playPause`    | Play/pause toggle                           |
| `ly.img.video.timeline.loop`         | Loop toggle                                 |
| `ly.img.video.timeline.zoom`         | Timeline zoom controls                      |
| `ly.img.video.timeline.toggle`       | Expand/collapse the timeline                |

### Add Clip Button

Below the tracks, the timeline shows an "Add Clip" button that runs the built-in `addClip` action. The button is gated by the `ly.img.video.timeline.addClip` feature. Register your own `addClip` action to control what it opens — here we open the asset library filtered to image and video sources.

```typescript highlight=highlight-add-clip
    // The "Add Clip" button below the tracks runs the built-in `addClip`
    // action. Toggle the button with its feature, or register your own action
    // to change what the button does.
    cesdk.feature.enable('ly.img.video.timeline.addClip');

    cesdk.actions.register('addClip', () => {
      cesdk.ui.openPanel('//ly.img.panel/assetLibrary', {
        payload: {
          entries: ['ly.img.image', 'ly.img.video'],
          applyAssetContext: { clipType: 'clip' }
        }
      });
    });
```

Use a custom action to open your own source, an upload flow, or a dialog instead of the default asset library.

## Customization Actions

The timeline's height is set through the `timeline.setHeight` action. It accepts a settings object with a `height` (a value in pixels or `'auto'`) and a `maxHeight` in pixels.

```typescript highlight=highlight-set-height
// Give the timeline a fixed 320px height. Pass { height: 'auto' } to
// restore the content-hugging default, or add maxHeight to cap how tall
// the auto-growing timeline may get.
cesdk.actions.run('timeline.setHeight', { height: 320 });
```

By default the timeline grows and shrinks to hug its content. Passing a number as `height` fixes the timeline at that height, while `'auto'` restores the default content-hugging behavior, which starts at 30% of the editor viewport height. Passing a number as `maxHeight` caps how tall the timeline may get — both when it grows with its content and when it is resized by hand — replacing the built-in limit, so a larger value also allows a taller timeline. In both modes the drag-to-resize handle stays available — dragging sets a manual height, and double-clicking the handle resets it.

## Engine Settings

Two engine settings control timeline visibility. Set them through `cesdk.engine.editor.setSetting`.

### Track Visibility

The timeline can show all tracks in the scene or collapse to a single row that follows the active track. Set `timeline/trackVisibility` to `'all'` for the full multi-track view, or `'active'` for the simplified view.

```typescript highlight=highlight-track-visibility
// Show every track in the timeline. 'active' collapses the timeline to a
// single row showing only the selected track's clips.
cesdk.engine.editor.setSetting('timeline/trackVisibility', 'all');
```

In our example the scene has a video track and a separate audio track, so `'all'` renders both rows. The `'active'` value is useful for a compact editor where only the selected track's clips matter.

> **Note:** Setting `timeline/trackVisibility` to `'active'` also hides the timeline's
> drag-to-resize handle.

### Transition Controls

When two clips sit next to each other on a track, the timeline shows a control between them for editing the transition. By default it appears on hover. Set `timeline/transitionControlVisibility` to `'always'` to keep it visible at all times.

```typescript highlight=highlight-transition-visibility
// Keep the transition control between adjacent clips permanently visible
// instead of revealing it only on hover.
cesdk.engine.editor.setSetting(
  'timeline/transitionControlVisibility',
  'always'
);
```

The control still hides on "tight" seams where there is no room to draw it. Our example assigns a cross-fade between the first two clips, so the always-visible control has something to render. For creating and configuring the transitions themselves, see [Apply Transitions](./create-video/apply-transitions.md).

## API Reference

| Method                                                                            | Purpose                                                  |
| --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| `cesdk.feature.enable('ly.img.video.timeline.*')`                                 | Enable the timeline and its buttons                      |
| `cesdk.engine.editor.setSetting('timeline/trackVisibility', v)`                   | Show all tracks (`'all'`) or the active one (`'active'`) |
| `cesdk.engine.editor.setSetting('timeline/transitionControlVisibility', v)`       | Show transition controls on `'hover'` or `'always'`      |
| `cesdk.actions.run('timeline.setHeight', settings)`                               | Set a fixed timeline `height` and/or a `maxHeight` cap   |
| `cesdk.ui.registerComponent(ids, renderComponent)`                                | Register a custom controls bar component                 |
| `cesdk.ui.setComponentOrder({ in: 'ly.img.video.timeline.controls.bar' }, order)` | Set the controls bar order                               |
| `cesdk.ui.getComponentOrder({ in: 'ly.img.video.timeline.controls.bar' })`        | Read the current controls bar order                      |
| `cesdk.ui.insertOrderComponent({ in: 'ly.img.video.timeline.controls.bar' }, c)`  | Insert components into the controls bar                  |
| `cesdk.ui.removeOrderComponent({ in: 'ly.img.video.timeline.controls.bar' })`     | Remove components from the controls bar                  |
| `cesdk.actions.run('addClip')`                                                    | Run the built-in add clip action                         |
| `cesdk.actions.register('addClip', handler)`                                      | Replace the add clip action behavior                     |
| `cesdk.feature.enable('ly.img.video.timeline.addClip')`                           | Show or hide the add clip button                         |

## Next Steps

Each API used here is covered in depth in its own guide:

- [Feature API](./user-interface/customization/disable-or-enable.md) — enable, disable, and conditionally toggle
  editor features.
- [Component Order API](./user-interface/customization/reference/component-order-api.md) — order, insert, update, and remove
  components in any UI area.
- [Actions API](./actions.md) — run and register built-in and custom actions.



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/docs/cesdk/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support