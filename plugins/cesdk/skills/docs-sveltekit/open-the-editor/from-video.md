> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Open the Editor](./open-the-editor.md) > [Create From Video](./open-the-editor/from-video.md)

---

Open CE.SDK with a video as the starting point for editing. The scene dimensions match the video resolution and timeline mode is enabled.

![Create From Video example showing CE.SDK with a video loaded for editing](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-video-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-open-the-editor-from-video-browser)
>
> - [Live demo](https://img.ly/examples/guides-open-the-editor-from-video-browser/)

CE.SDK creates video editing scenes from a single video URL using `engine.scene.createFromVideo()`. This approach works well for video trimmers, overlay editors, or processing uploaded video files.

```typescript file=@cesdk_web_examples/guides-open-the-editor-from-video-browser/browser.ts reference-only
import type CreativeEngine from '@cesdk/cesdk-js/cesdk-engine';
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

// ===== Handle Different Video Sources =====
// Helper function to create a scene from a blob (e.g., file upload)
// This pattern is useful when users upload video files via <input type="file">
async function createSceneFromBlob(
  engine: CreativeEngine,
  blob: Blob
): Promise<number> {
  const objectURL = URL.createObjectURL(blob);
  const scene = await engine.scene.createFromVideo(objectURL);
  // Note: Don't revoke the URL immediately - the engine needs it for rendering
  // Only revoke when the scene is no longer needed
  return scene;
}

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

    // ===== Create a Scene from a Video URL =====
    // Video URL to create the scene from
    const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a scene from the video
    // The scene dimensions match the video resolution
    // Timeline mode is automatically enabled
    const scene = await engine.scene.createFromVideo(videoUrl);

    // ===== Work with the Video Block =====
    // Find the video block that was created
    // The video is placed inside a graphic block
    const graphicBlocks = engine.block.findByType('graphic');
    const videoBlock = graphicBlocks[0];

    // Modify video block properties
    // For example, adjust opacity
    engine.block.setOpacity(videoBlock, 0.95);

    // ===== Control Video Playback =====
    // Get the video duration
    const duration = engine.block.getDuration(scene);

    // Set playback position to 2 seconds
    const page = engine.block.findByType('page')[0];
    engine.block.setPlaybackTime(page, 2);

    // Start video playback
    // engine.block.setPlaying(scene, true);

    // Zoom to show the video
    await engine.scene.zoomToBlock(page);
  }
}

export default Example;
```

This guide covers how to create scenes from video files and control video playback.

## Create a Scene From a Video URL

Pass a video URL to `engine.scene.createFromVideo()` to load the video and create a scene with matching dimensions.

```typescript highlight-create-from-video
    // Video URL to create the scene from
    const videoUrl = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a scene from the video
    // The scene dimensions match the video resolution
    // Timeline mode is automatically enabled
    const scene = await engine.scene.createFromVideo(videoUrl);
```

The scene uses pixel design units and includes a timeline structure. Page dimensions match the video resolution automatically.

## Work With the Video Block

After creating the scene, locate the video block to modify its properties.

```typescript highlight-find-video-block
    // Find the video block that was created
    // The video is placed inside a graphic block
    const graphicBlocks = engine.block.findByType('graphic');
    const videoBlock = graphicBlocks[0];

    // Modify video block properties
    // For example, adjust opacity
    engine.block.setOpacity(videoBlock, 0.95);
```

The video is placed inside a graphic block. Use `engine.block.findByType('graphic')` to find it. You can modify properties like opacity, position, or apply effects using the Block API.

## Control Video Playback

Use playback controls to start, stop, and seek within the video.

```typescript highlight-control-playback
    // Get the video duration
    const duration = engine.block.getDuration(scene);

    // Set playback position to 2 seconds
    const page = engine.block.findByType('page')[0];
    engine.block.setPlaybackTime(page, 2);

    // Start video playback
    // engine.block.setPlaying(scene, true);
```

Call `engine.block.setPlaying()` on the scene to start or stop playback. Use `engine.block.setPlaybackTime()` to jump to a specific position and `engine.block.getDuration()` to get the total video length.

## Handle Different Video Sources

Create scenes from blob URLs when working with file uploads.

```typescript highlight-blob-source
// Helper function to create a scene from a blob (e.g., file upload)
// This pattern is useful when users upload video files via <input type="file">
async function createSceneFromBlob(
  engine: CreativeEngine,
  blob: Blob
): Promise<number> {
  const objectURL = URL.createObjectURL(blob);
  const scene = await engine.scene.createFromVideo(objectURL);
  // Note: Don't revoke the URL immediately - the engine needs it for rendering
  // Only revoke when the scene is no longer needed
  return scene;
}
```

Use `URL.createObjectURL()` to create a blob URL from a File object or fetched blob. This pattern supports file uploads from `<input type="file">` elements. Note that the blob URL must remain valid while the scene is in use - don't revoke it until the scene is no longer needed.

## Scene Configuration

Scenes created from video include:

- Page dimensions matching video resolution
- Pixel design units
- Timeline mode enabled
- A single page with the video graphic block

## Troubleshooting

**Video fails to load**

Verify the video URL is accessible and check CORS headers allow fetching from the source domain. Ensure the format is supported (MP4, WebM).

**Video plays without audio**

Browser autoplay policies may block audio until user interaction. Verify the video file contains an audio track.

**Scene dimensions don't match video**

Dimensions come from video metadata during load. Check the video file has valid dimension metadata.

## API Reference

| Method                           | Purpose                    |
| -------------------------------- | -------------------------- |
| `engine.scene.createFromVideo()` | Create scene from video URL |
| `engine.block.findByType()`      | Find blocks by type        |
| `engine.block.setOpacity()`      | Set block opacity          |
| `engine.block.setPlaying()`      | Start or stop playback     |
| `engine.block.setPlaybackTime()` | Set playback position      |
| `engine.block.getDuration()`     | Get video/scene duration   |
| `engine.scene.get()`             | Get active scene           |



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support