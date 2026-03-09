> This is one page of the CE.SDK Nuxt.js documentation. For a complete overview, see the [Nuxt.js Documentation Index](https://img.ly/nuxtjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [For Social Media](./export-save-publish/for-social-media.md)

---

Export vertical video designs for social media platforms with the correct dimensions, formats, and quality settings.
Configure video exports with appropriate resolution, framerate, and bitrate optimized for Instagram Reels, TikTok, and YouTube Shorts.

![Export for Social Media example showing CE.SDK with export buttons for different platforms](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-for-social-media-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-for-social-media-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-for-social-media-browser/)

Short-form vertical video has become the dominant format for social media. Instagram Reels, TikTok, and YouTube Shorts all use the 9:16 aspect ratio at 1080×1920 pixels. This guide demonstrates how to create and export vertical video content with the correct settings for these platforms.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-for-social-media-browser/browser.ts reference-only
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

/**
 * CE.SDK Plugin: Export for Social Media Guide
 *
 * This example demonstrates:
 * - Creating a vertical video scene (9:16) for Instagram Reels, TikTok, YouTube Shorts
 * - Exporting videos with resolution, framerate, and bitrate settings
 * - Tracking video export progress
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

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

    const engine = cesdk.engine;

    // Create a vertical video scene (9:16) for Instagram Reels, TikTok, YouTube Shorts
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1080, height: 1920, unit: 'Pixel' }
    });

    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Add a video clip that fills the vertical frame
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const videoBlock = await engine.block.addVideo(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      pageWidth,
      pageHeight
    );
    engine.block.fillParent(videoBlock);

    // Export video for Instagram Reels / TikTok / YouTube Shorts (9:16)
    const exportVideo = async () => {
      cesdk.ui.showNotification({
        message: 'Exporting video...',
        type: 'info'
      });

      const currentPage = engine.scene.getCurrentPage();
      if (!currentPage) return;

      const videoBlob = await engine.block.exportVideo(currentPage, {
        mimeType: 'video/mp4',
        targetWidth: 1080,
        targetHeight: 1920,
        framerate: 30,
        videoBitrate: 8_000_000, // 8 Mbps
        onProgress: (renderedFrames, encodedFrames, totalFrames) => {
          const percent = Math.round((encodedFrames / totalFrames) * 100);
          console.log(
            `Export progress: ${percent}% (${encodedFrames}/${totalFrames} frames)`
          );
        }
      });

      await cesdk.utils.downloadFile(videoBlob, 'video/mp4');
      cesdk.ui.showNotification({
        message: `Video exported: ${(videoBlob.size / 1024 / 1024).toFixed(
          1
        )} MB (1080×1920)`,
        type: 'success'
      });
    };

    // Configure navigation bar with export button
    cesdk.ui.setComponentOrder({ in: 'ly.img.navigation.bar' }, [
      'ly.img.undoRedo.navigationBar',
      'ly.img.spacer',
      {
        id: 'ly.img.action.navigationBar',
        onClick: exportVideo,
        key: 'export-video',
        label: 'Export Video',
        icon: '@imgly/Video',
        variant: 'plain',
        color: 'accent'
      }
    ]);
  }
}

export default Example;
```

This guide covers creating a vertical video scene, exporting with resolution, framerate, and bitrate settings, and tracking export progress.

## Creating a Video Scene

Create a video scene with the correct dimensions for vertical video. Use `createVideoScene()` with explicit pixel dimensions to ensure your content matches platform requirements.

```typescript highlight-setup
    // Create a vertical video scene (9:16) for Instagram Reels, TikTok, YouTube Shorts
    await cesdk.actions.run('scene.create', {
      mode: 'Video',
      page: { width: 1080, height: 1920, unit: 'Pixel' }
    });

    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found');
    }

    // Add a video clip that fills the vertical frame
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const videoBlock = await engine.block.addVideo(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4',
      pageWidth,
      pageHeight
    );
    engine.block.fillParent(videoBlock);
```

The scene uses 1080×1920 pixels (9:16 aspect ratio), which is the standard resolution for Instagram Reels, TikTok, and YouTube Shorts. The video block fills the entire page dimensions.

## Exporting Videos

Export video content using `engine.block.exportVideo()`. Configure resolution, framerate, and bitrate for optimal quality and file size.

```typescript highlight-export-video
const videoBlob = await engine.block.exportVideo(currentPage, {
  mimeType: 'video/mp4',
  targetWidth: 1080,
  targetHeight: 1920,
  framerate: 30,
  videoBitrate: 8_000_000, // 8 Mbps
  onProgress: (renderedFrames, encodedFrames, totalFrames) => {
    const percent = Math.round((encodedFrames / totalFrames) * 100);
    console.log(
      `Export progress: ${percent}% (${encodedFrames}/${totalFrames} frames)`
    );
  }
});
```

Key video export settings:

- **mimeType**: `video/mp4` for broad platform compatibility
- **targetWidth/targetHeight**: Output resolution (1080×1920 for vertical)
- **framerate**: 30 frames per second (standard for social media)
- **videoBitrate**: 8 Mbps provides good quality while keeping file sizes reasonable

Higher bitrates produce better quality but larger files. For short-form vertical video, 8 Mbps (8,000,000 bits per second) balances quality and upload speed.

## Tracking Export Progress

Video exports can take time, especially for longer content. Use the `onProgress` callback to provide users with feedback during export.

```typescript highlight-progress
onProgress: (renderedFrames, encodedFrames, totalFrames) => {
  const percent = Math.round((encodedFrames / totalFrames) * 100);
  console.log(
    `Export progress: ${percent}% (${encodedFrames}/${totalFrames} frames)`
  );
}
```

The callback receives three parameters:

- **renderedFrames**: Number of frames rendered so far
- **encodedFrames**: Number of frames encoded to the output file
- **totalFrames**: Total frames to be exported

The encoding stage typically trails rendering slightly. Calculate progress percentage from `encodedFrames / totalFrames` for an accurate completion indicator.

## Downloading Exported Files

After export, use `cesdk.utils.downloadFile()` to trigger a browser download:

```typescript
const videoBlob = await engine.block.exportVideo(page, { /* options */ });
await cesdk.utils.downloadFile(videoBlob, 'video/mp4');
```

This utility handles the download process automatically, including memory cleanup. For server uploads, pass the Blob directly to your upload function or FormData.

## API Reference

| Method | Purpose |
|--------|---------|
| `cesdk.actions.run('scene.create', { mode: 'Video' })` | Create a video scene with specified dimensions |
| `engine.block.exportVideo()` | Export block as video (MP4) |
| `engine.scene.getCurrentPage()` | Get the active page for export |
| `cesdk.utils.downloadFile()` | Trigger browser download for exported files |

### Export Options (Videos)

| Option | Type | Description |
|--------|------|-------------|
| `mimeType` | `string` | Output format: `video/mp4` |
| `targetWidth` | `number` | Output width in pixels |
| `targetHeight` | `number` | Output height in pixels |
| `framerate` | `number` | Frames per second |
| `videoBitrate` | `number` | Video bitrate in bits per second |
| `onProgress` | `function` | Progress callback with frame counts |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Complete export options including H.264 profiles and advanced settings



---

## More Resources

- **[Nuxt.js Documentation Index](https://img.ly/nuxtjs.md)** - Browse all Nuxt.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nuxtjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support