> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [To MP4](./export-save-publish/export/to-mp4.md)

---

Export your video compositions as MP4 files with H.264 encoding, progress tracking, and configurable quality settings.

![Export to MP4 hero image](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-mp4-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-export-save-publish-export-to-mp4-browser)
>
> - [Live demo](https://img.ly/examples/guides-export-save-publish-export-to-mp4-browser/)

MP4 is the most widely supported video format, using H.264 encoding for efficient compression. CE.SDK handles frame rendering, encoding, and audio muxing entirely client-side, giving you control over quality and file size.

```typescript file=@cesdk_web_examples/guides-export-save-publish-export-to-mp4-browser/browser.ts reference-only
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
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
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    const engine = cesdk.engine;

    cesdk.feature.enable('ly.img.video');
    await engine.scene.loadFromURL(
      'https://cdn.img.ly/assets/demo/v3/ly.img.video.template/templates/milli-surf-school.scene'
    );
    const page = engine.scene.getCurrentPage();
    if (!page) throw new Error('No page found');

    await cesdk.actions.run('zoom.toPage', { autoFit: true });

    // Setup export functionality
    await this.setupExportActions(cesdk, page);
  }

  private async setupExportActions(
    cesdk: CreativeEditorSDK,
    page: number
  ): Promise<void> {
    const engine = cesdk.engine;

    // Add export buttons to navigation bar
    cesdk.ui.insertOrderComponent({ in: 'ly.img.navigation.bar', position: 'end' }, {
      id: 'ly.img.actions.navigationBar',
      children: [
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-builtin',
          label: 'Export Video',
          icon: '@imgly/Save',
          onClick: () => {
            cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video',
          label: 'Export MP4',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting Video',
              message: 'Encoding MP4...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                mimeType: 'video/mp4',
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-progress',
          label: 'Export (dialog)',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting Video',
              message: 'Encoding MP4...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.showSuccess({ message: 'Export complete!' });
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-hd',
          label: 'Export HD',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting HD Video',
              message: 'Encoding 1080p...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                targetWidth: 1920,
                targetHeight: 1080,
                framerate: 30,
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        },
        {
          id: 'ly.img.action.navigationBar',
          key: 'export-video-quality',
          label: 'Export HQ',
          icon: '@imgly/Save',
          onClick: async () => {
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting HQ Video',
              message: 'Encoding high quality...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                h264Profile: 100,
                videoBitrate: 8_000_000,
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.close();
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
          }
        }
      ]
    });
  }
}

export default Example;
```

This guide covers exporting videos to MP4, tracking progress, configuring resolution and quality, and using built-in export actions.

## Export to MP4

Call `engine.block.exportVideo()` with a page block to export it as an MP4 video. The method returns a Blob containing the encoded video data.

```typescript highlight=highlight-export-video
const blob = await engine.block.exportVideo(page, {
  mimeType: 'video/mp4',
```

Pass the page ID from `engine.scene.getCurrentPage()` to export the current video scene.

## Export Options

Video export supports configuration options for progress tracking, resolution, framerate, and encoding quality.

### Progress Dialog

Use `cesdk.utils.showLoadingDialog()` to display a progress dialog during export. The `onProgress` callback updates the dialog with rendering progress.

```typescript highlight=highlight-progress-dialog
            const dialog = cesdk.utils.showLoadingDialog({
              title: 'Exporting Video',
              message: 'Encoding MP4...',
              progress: 0
            });

            try {
              const blob = await engine.block.exportVideo(page, {
                onProgress: (_, encoded, total) => {
                  dialog.updateProgress({ value: encoded, max: total });
                }
              });

              dialog.showSuccess({ message: 'Export complete!' });
              await cesdk.utils.downloadFile(blob, 'video/mp4');
            } catch (error) {
              dialog.showError({ message: 'Export failed' });
              throw error;
            }
```

The dialog provides `updateProgress()` to show a progress bar, `showSuccess()` for completion feedback, and `showError()` for failures. The `onProgress` callback receives rendered frames, encoded frames, and total frames.

### Resolution and Framerate

Use `targetWidth`, `targetHeight`, and `framerate` to control output dimensions and smoothness.

```typescript highlight=highlight-resolution
const blob = await engine.block.exportVideo(page, {
  targetWidth: 1920,
  targetHeight: 1080,
  framerate: 30,
```

If only one dimension is specified, the other is calculated to maintain aspect ratio. Default framerate is 30 fps.

### H.264 Profile and Quality

The `h264Profile` option controls encoding quality and device compatibility:

- **66 (Baseline)**: Maximum compatibility, lower compression
- **77 (Main)**: Balanced quality and compatibility (default)
- **100 (High)**: Best compression, modern devices only

Set `videoBitrate` in bits per second to control file size.

```typescript highlight=highlight-quality
const blob = await engine.block.exportVideo(page, {
  h264Profile: 100,
  videoBitrate: 8_000_000,
```

### All MP4 Export Options

| Option | Description |
| ------ | ----------- |
| `mimeType` | Output format: `'video/mp4'` or `'video/quicktime'`. Defaults to `'video/mp4'`. |
| `onProgress` | Callback receiving `(renderedFrames, encodedFrames, totalFrames)` for progress tracking. |
| `targetWidth` | Target output width in pixels. |
| `targetHeight` | Target output height in pixels. |
| `framerate` | Target framerate in Hz. Defaults to `30`. |
| `h264Profile` | H.264 profile: 66 (Baseline), 77 (Main), 100 (High). Defaults to `77`. |
| `h264Level` | H.264 level multiplied by 10 (e.g., 52 = level 5.2). Defaults to `52`. |
| `videoBitrate` | Video bitrate in bits/second. `0` enables automatic selection. |
| `audioBitrate` | Audio bitrate in bits/second. `0` enables automatic selection. |
| `timeOffset` | Start time in seconds for partial export. Defaults to `0`. |
| `duration` | Export duration in seconds. Defaults to scene duration. |
| `abortSignal` | Signal to cancel the export operation. |

## Built-in Export Action

CE.SDK provides a built-in `exportDesign` action that handles export with a progress dialog and automatic download. Trigger it with `cesdk.actions.run()`:

```typescript highlight=highlight-builtin-action
cesdk.actions.run('exportDesign', { mimeType: 'video/mp4' });
```

The built-in action exports the current page as MP4 and prompts the user to download the result. It displays a progress dialog during encoding.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.block.exportVideo(blockId, options)` | Export a page block as MP4 video with encoding options |
| `cesdk.actions.run('exportDesign', options)` | Run the built-in export action with progress dialog |
| `cesdk.utils.showLoadingDialog(options)` | Show a loading dialog with progress tracking |
| `cesdk.utils.downloadFile(blob, mimeType)` | Download a blob to the user's device |

## Next Steps

- [Export Overview](./export-save-publish/export/overview.md) - Compare all supported export formats
- [Export Size Limits](./export-save-publish/export/size-limits.md) - Check device limits before exporting large videos
- [Export Audio](./guides/export-save-publish/export/audio.md) - Export audio tracks separately
- [Partial Export](./export-save-publish/export/partial-export.md) - Export specific blocks or timeline segments



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support