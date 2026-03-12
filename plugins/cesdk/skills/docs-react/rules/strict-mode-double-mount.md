---
platforms: [react, react-native]
---

# React Strict Mode Double-Mounts Affect CE.SDK

In React 18+ development mode (strict mode), `<CreativeEditor>` will mount, unmount, and remount. This causes the `init` callback to run twice, with the first engine being disposed midway through.

## Rule

When debugging CE.SDK initialization issues in React dev mode, add unique log markers to confirm which code version is executing. Only the second mount's `init` matters.

## What Happens

1. **Mount** — React creates the engine and calls `init`
2. **Unmount** — React disposes the engine (logs "Engine disposed")
3. **Remount** — React creates a new engine and calls `init` again

The first mount's `init` function may still be executing async operations when the engine is disposed. Only the second mount produces the editor you see.

## Why This Is Confusing

- Console logs may come from either run, interleaved
- Blocks visible in the editor are from the second (surviving) run only
- Errors from the first run's async continuation are irrelevant noise
- It looks like the editor is "resetting" or "losing state"

## Debugging Strategy

Add unique markers to confirm which execution you're observing:

```ts
import { DesignEditorConfig } from './config/plugin';
import {
  BlurAssetSource, ColorPaletteAssetSource, CropPresetsAssetSource,
  DemoAssetSources, EffectsAssetSource, FiltersAssetSource,
  PagePresetsAssetSource, StickerAssetSource, TextAssetSource,
  TextComponentAssetSource, TypefaceAssetSource, UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';

let initCounter = 0;

<CreativeEditor
  init={async (cesdk) => {
    const runId = ++initCounter;
    console.log(`[INIT run=${runId}] Starting`);

    // Config plugin
    await cesdk.addPlugin(new DesignEditorConfig());

    // Default asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    // Demo and upload sources
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
    await cesdk.addPlugin(
      new DemoAssetSources({ include: ['ly.img.image.*'] })
    );
    console.log(`[INIT run=${runId}] Assets loaded`);

    // Create scene
    await cesdk.actions.run('scene.create', {
      page: {
        sourceId: 'ly.img.page.presets',
        assetId: 'ly.img.page.presets.print.iso.a6.landscape'
      }
    });
    console.log(`[INIT run=${runId}] Scene created`);

    // ... more setup ...
    console.log(`[INIT run=${runId}] Complete`);
  }}
/>
```

Expected output in dev mode:
```
[INIT run=1] Starting
[INIT run=1] Assets loaded
Engine disposed          ← React unmounts the first engine
[INIT run=2] Starting
[INIT run=2] Assets loaded
[INIT run=1] Scene created  ← First run continues on dead engine (ignore)
[INIT run=2] Scene created
[INIT run=2] Complete
```

## Production

This double-mount behavior only occurs in React strict mode during development. In production builds, `init` runs exactly once. No workaround is needed for production — just be aware of it when debugging.
