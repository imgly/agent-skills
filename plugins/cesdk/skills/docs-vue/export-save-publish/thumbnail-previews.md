> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/docs/cesdk/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Export Media Assets](./export-save-publish/export.md) > [Thumbnail Previews](./export-save-publish/thumbnail-previews.md)

---

Stream timeline filmstrips, page storyboards, and audio waveforms out of CE.SDK as each frame and sample chunk becomes ready.

![Thumbnail Previews hero image](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-export-save-publish-thumbnail-previews-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-export-save-publish-thumbnail-previews-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.82.0-nightly.20260823/examples/guides-export-save-publish-thumbnail-previews-browser/index.html)

Two methods on `engine.block` produce sequences of previews and hand them back one piece at a time, as soon as each piece is ready:

- `generateVideoThumbnailSequence()` gives you a set number of image frames spread across a time range. Use it for timeline filmstrips, scrubbers, page storyboards, and single preview frames.
- `generateAudioThumbnailSequence()` gives you a waveform as chunks of loudness values.

Both are built for previews, so they render at most 512 px per side. Ask for more and you still get the size you asked for, but the extra pixels are stretched, not sharper.

When you need a full-resolution still image, such as a gallery tile or a saved cover, use [Create Thumbnail](./export-save-publish/create-thumbnail.md) instead.

```typescript file=@cesdk_web_examples/guides-export-save-publish-thumbnail-previews-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import type CreativeEngine from '@cesdk/engine';
import {
  BlurAssetSource,
  CaptionPresetsAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  ImageColorsAssetSource,
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

const VIDEO_URI = 'https://img.ly/static/ubq_video_samples/bbb.mp4';
const AUDIO_URI =
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';

const PAGE_WIDTH = 1920;
const PAGE_HEIGHT = 1080;
const PAGE_DURATION = 12;

type PanelSlot =
  | 'storyboard'
  | 'previewFrame'
  | 'pagePreview'
  | 'filmstrip'
  | 'waveform';

/** Where each generated preview is placed on the page, in design units. */
const PANEL_SLOTS: Record<PanelSlot, { x: number; y: number; width: number }> =
  {
    storyboard: { x: 60, y: 60, width: 1800 },
    previewFrame: { x: 60, y: 240, width: 500 },
    pagePreview: { x: 620, y: 240, width: 500 },
    filmstrip: { x: 60, y: 700, width: 1800 },
    waveform: { x: 60, y: 850, width: 1800 }
  };

/** Renders a normalized `[0, 1]` envelope as mirrored bars around a centerline. */
function drawWaveform(envelope: Float32Array): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = envelope.length * 2;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create a 2D canvas context');

  context.fillStyle = '#12121a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const centerLine = canvas.height / 2;
  context.fillStyle = '#7a8cff';

  for (let i = 0; i < envelope.length; i++) {
    // The values are already normalized, so each one maps straight onto a bar
    // height. No peak finding and no rescaling.
    const amplitude = Math.max(envelope[i] * centerLine, 0.5);
    context.fillRect(i * 2, centerLine - amplitude, 1, amplitude * 2);
  }

  return canvas;
}

class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  private engine!: CreativeEngine;

  private page!: number;

  private videoFill!: number;

  private audioBlock!: number;

  private videoDuration = 0;

  private audioDuration = 0;

  private panels = new Map<PanelSlot, { block: number; url: string }>();

  /** The cancel closure of the request currently running for a given block. */
  private inFlight = new Map<number, () => void>();

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    await cesdk.addPlugin(new VideoEditorConfig());

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
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      layout: 'DepthStack',
      page: { width: PAGE_WIDTH, height: PAGE_HEIGHT, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    this.engine = engine;

    const page = engine.scene.getCurrentPage();
    if (page == null) throw new Error('No page found in the scene');
    this.page = page;
    engine.block.setDuration(page, PAGE_DURATION);

    // A video clip on the background track. The fill is the block that owns
    // the media file, and the fill is what decodes real frames.
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));
    engine.block.setWidth(videoBlock, PAGE_WIDTH);
    engine.block.setHeight(videoBlock, PAGE_HEIGHT);

    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', VIDEO_URI);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.appendChild(track, videoBlock);
    engine.block.setDuration(videoBlock, PAGE_DURATION);
    this.videoFill = videoFill;

    // A separate audio clip for the waveform.
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', AUDIO_URI);
    engine.block.appendChild(page, audioBlock);
    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, PAGE_DURATION);
    this.audioBlock = audioBlock;

    // Not strictly required — both APIs wait for the resource — but loading
    // up front means the first request does not race the download.
    await engine.block.forceLoadAVResource(videoFill);
    await engine.block.forceLoadAVResource(audioBlock);

    this.videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    this.audioDuration = engine.block.getAVResourceTotalDuration(audioBlock);

    await engine.scene.zoomToBlock(page, { padding: 40 });

    this.addActions(cesdk);

    // Kick off one video and one audio sequence. They run side by side: the
    // engine advances the front video request and the front audio request on
    // every tick.
    this.generateFilmstrip();
    this.generateWaveform();
  }

  /** A filmstrip of decoded frames sampled across the source media file. */
  private generateFilmstrip(): void {
    const engine = this.engine;
    const numberOfFrames = 12;
    const thumbnailHeight = 96;

    const strip = document.createElement('canvas');
    const context = strip.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    // A block can only have one request in flight, and a second one waits for
    // the first instead of failing. Cancel before asking again.
    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // A video fill decodes real frames. The times are media time in the
      // source file, so trim, time offset, speed and looping are ignored.
      this.videoFill,
      thumbnailHeight,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          // An error ends the sequence. No further frames arrive.
          console.error('Filmstrip failed:', result.message);
          return;
        }

        // The engine derives the width from the frame's aspect ratio, so the
        // canvas can only be sized once the first frame is in.
        if (!sized) {
          strip.width = result.width * numberOfFrames;
          strip.height = result.height;
          sized = true;
        }

        // Frames are not guaranteed to arrive in index order — always place
        // each frame at its reported index.
        context.putImageData(result, frameIndex * result.width, 0);

        // There is no completion callback, and the reported index is always 0
        // on error, so counting arrivals is the only reliable finish test.
        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('filmstrip', strip);
        }
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }

  /** A storyboard of the composed page rendered at several points in time. */
  private generateStoryboard(): void {
    const engine = this.engine;
    const numberOfFrames = 8;
    const thumbnailHeight = 96;

    const board = document.createElement('canvas');
    const context = board.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    this.cancelPending(this.page);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // Passing a page — or any design block below a page — re-renders the
      // composed scene instead of decoding a file. Times are relative to the
      // block's own time offset on the page timeline.
      this.page,
      thumbnailHeight,
      0,
      engine.block.getDuration(this.page),
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Storyboard failed:', result.message);
          return;
        }

        if (!sized) {
          board.width = result.width * numberOfFrames;
          board.height = result.height;
          sized = true;
        }

        context.putImageData(result, frameIndex * result.width, 0);

        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('storyboard', board);
        }
      }
    );

    this.inFlight.set(this.page, cancel);
  }

  /** A waveform envelope for the audio clip. */
  private generateWaveform(): void {
    const engine = this.engine;
    const samplesPerChunk = 64;
    const numberOfSamples = 768;
    const numberOfChannels = 1;
    const numberOfChunks = Math.ceil(numberOfSamples / samplesPerChunk);

    const envelope = new Float32Array(numberOfSamples);
    let received = 0;

    // Compressed audio is throttled per tick, so only ask for the window that
    // actually sits on the timeline instead of the whole file.
    const timeEnd = Math.min(this.audioDuration, PAGE_DURATION);

    this.cancelPending(this.audioBlock);

    const cancel = engine.block.generateAudioThumbnailSequence(
      // Only an audio block or a video fill is accepted here. A page or a
      // graphic is rejected.
      this.audioBlock,
      samplesPerChunk,
      0,
      timeEnd,
      numberOfSamples,
      numberOfChannels,
      (chunkIndex, result) => {
        if (result instanceof Error) {
          console.error('Waveform failed:', result.message);
          return;
        }

        // On Web this Float32Array is a zero-copy view into the WASM heap.
        // Copy it here, synchronously, before doing anything else with it.
        const chunk = result.slice();

        // numberOfSamples counts samples per channel, and stereo chunks
        // interleave left and right, so step by numberOfChannels. The final
        // chunk is shorter whenever the total does not divide evenly.
        const sampleCount = chunk.length / numberOfChannels;
        const offset = chunkIndex * samplesPerChunk;
        for (let i = 0; i < sampleCount; i++) {
          envelope[offset + i] = chunk[i * numberOfChannels];
        }

        received += 1;
        if (received === numberOfChunks) {
          void this.publishCanvas('waveform', drawWaveform(envelope));
        }
      }
    );

    this.inFlight.set(this.audioBlock, cancel);
  }

  /** A single preview frame of the video at one point in time. */
  private generatePreviewFrame(): void {
    const engine = this.engine;
    const time = Math.min(2, this.videoDuration);

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      180,
      time,
      time,
      // With a single frame, a video fill returns exactly timeBegin.
      1,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Preview frame failed:', result.message);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = result.width;
        canvas.height = result.height;
        canvas.getContext('2d')?.putImageData(result, 0, 0);

        void this.publishCanvas('previewFrame', canvas);
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }

  /** The browser-only shortcut: one PNG of the current page at a given time. */
  private async generatePagePreview(): Promise<void> {
    // It also runs on the current page, so it queues behind a storyboard.
    this.cancelPending(this.page);

    const height = 256;
    const blob = await this.engine.block.generateThumbnailAtTimeOffset(
      height,
      4
    );

    const width = Math.round((height * PAGE_WIDTH) / PAGE_HEIGHT);
    await this.publishPanel('pagePreview', blob, width, height);
  }

  /** Start a long sequence and stop it with the returned cancel closure. */
  private demonstrateCancellation(): void {
    const engine = this.engine;
    const numberOfFrames = 240;
    let received = 0;

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      64,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) return;
        received += 1;
      }
    );
    this.inFlight.set(this.videoFill, cancel);

    // The flag is honored on the next engine tick, so frames already produced
    // this tick still arrive. Nothing is delivered because of the cancel
    // itself — no final error and no completion signal.
    window.setTimeout(() => {
      this.cancelPending(this.videoFill);
      console.log(
        `Cancelled after ${received} of ${numberOfFrames} frames arrived`
      );
    }, 400);
  }

  /** Stops whatever sequence is still running for a block. */
  private cancelPending(block: number): void {
    // Cancelling twice, after completion, or after a failure is a safe no-op.
    this.inFlight.get(block)?.();
    this.inFlight.delete(block);
  }

  /**
   * Encodes a canvas and places it on the page.
   *
   * `toBlob` is asynchronous, which keeps the scene mutation out of the
   * thumbnail callback — that callback runs inside the engine's update loop,
   * and writing to the scene from there re-enters the engine.
   */
  private async publishCanvas(
    slot: PanelSlot,
    canvas: HTMLCanvasElement
  ): Promise<void> {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, 'image/png');
    });
    if (!blob) throw new Error(`Could not encode the ${slot} panel`);

    await this.publishPanel(slot, blob, canvas.width, canvas.height);
  }

  /** Places an encoded preview on the page, replacing whatever was there. */
  private async publishPanel(
    slot: PanelSlot,
    blob: Blob,
    pixelWidth: number,
    pixelHeight: number
  ): Promise<void> {
    const engine = this.engine;
    const { x, y, width } = PANEL_SLOTS[slot];
    const height = (width * pixelHeight) / pixelWidth;

    const previous = this.panels.get(slot);
    if (previous) {
      engine.block.destroy(previous.block);
      URL.revokeObjectURL(previous.url);
      this.panels.delete(slot);
    }

    const url = URL.createObjectURL(blob);

    const block = engine.block.create('graphic');
    engine.block.setShape(block, engine.block.createShape('rect'));

    const fill = engine.block.createFill('image');
    engine.block.setString(fill, 'fill/image/imageFileURI', url);
    engine.block.setFill(block, fill);

    engine.block.setWidth(block, width);
    engine.block.setHeight(block, height);
    engine.block.setPositionX(block, x);
    engine.block.setPositionY(block, y);
    engine.block.appendChild(this.page, block);
    engine.block.setTimeOffset(block, 0);
    engine.block.setDuration(block, engine.block.getDuration(this.page));

    this.panels.set(slot, { block, url });

    await engine.block.forceLoadResources([fill]);
  }

  private addActions(cesdk: EditorPluginContext['cesdk']): void {
    if (!cesdk) return;

    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.actions.navigationBar',
        children: [
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-filmstrip',
            label: 'Filmstrip',
            icon: '@imgly/Video',
            onClick: () => this.generateFilmstrip()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-storyboard',
            label: 'Storyboard',
            icon: '@imgly/Timeline',
            onClick: () => this.generateStoryboard()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-waveform',
            label: 'Waveform',
            icon: '@imgly/Adjustments',
            onClick: () => this.generateWaveform()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-frame',
            label: 'Single Frame',
            icon: '@imgly/Image',
            onClick: () => this.generatePreviewFrame()
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-page',
            label: 'Page PNG',
            icon: '@imgly/Save',
            onClick: () => {
              this.generatePagePreview().catch((error) => {
                console.error('Page preview failed:', error);
              });
            }
          },
          {
            id: 'ly.img.action.navigationBar',
            key: 'thumbnail-previews-cancel',
            label: 'Cancel Demo',
            icon: '@imgly/Reload',
            onClick: () => this.demonstrateCancellation()
          }
        ]
      }
    );
  }
}

export default Example;
```

## Set Up the Scene

The example builds a video scene with one video clip on the background track and one audio clip on the page, then holds on to the video *fill* and the audio block. The fill matters: the fill is the block that owns the media file, and it is the fill that decodes real frames.

```typescript highlight=highlight-tp-setup
    const engine = cesdk.engine;
    this.engine = engine;

    const page = engine.scene.getCurrentPage();
    if (page == null) throw new Error('No page found in the scene');
    this.page = page;
    engine.block.setDuration(page, PAGE_DURATION);

    // A video clip on the background track. The fill is the block that owns
    // the media file, and the fill is what decodes real frames.
    const track = engine.block.create('track');
    engine.block.appendChild(page, track);

    const videoBlock = engine.block.create('graphic');
    engine.block.setShape(videoBlock, engine.block.createShape('rect'));
    engine.block.setWidth(videoBlock, PAGE_WIDTH);
    engine.block.setHeight(videoBlock, PAGE_HEIGHT);

    const videoFill = engine.block.createFill('video');
    engine.block.setString(videoFill, 'fill/video/fileURI', VIDEO_URI);
    engine.block.setFill(videoBlock, videoFill);
    engine.block.appendChild(track, videoBlock);
    engine.block.setDuration(videoBlock, PAGE_DURATION);
    this.videoFill = videoFill;

    // A separate audio clip for the waveform.
    const audioBlock = engine.block.create('audio');
    engine.block.setString(audioBlock, 'audio/fileURI', AUDIO_URI);
    engine.block.appendChild(page, audioBlock);
    engine.block.setTimeOffset(audioBlock, 0);
    engine.block.setDuration(audioBlock, PAGE_DURATION);
    this.audioBlock = audioBlock;

    // Not strictly required — both APIs wait for the resource — but loading
    // up front means the first request does not race the download.
    await engine.block.forceLoadAVResource(videoFill);
    await engine.block.forceLoadAVResource(audioBlock);

    this.videoDuration = engine.block.getAVResourceTotalDuration(videoFill);
    this.audioDuration = engine.block.getAVResourceTotalDuration(audioBlock);
```

You do not have to call `forceLoadAVResource()` first — both methods wait for the media on their own. Calling it up front downloads the media before you ask for previews, so the first request does not spend that time waiting.

## Generate a Video Filmstrip

Ask for a number of frames across a time range and paint each one as it arrives. The engine derives the width from the media's aspect ratio, so `thumbnailHeight` is the only size you control.

```typescript highlight=highlight-tp-filmstrip
  /** A filmstrip of decoded frames sampled across the source media file. */
  private generateFilmstrip(): void {
    const engine = this.engine;
    const numberOfFrames = 12;
    const thumbnailHeight = 96;

    const strip = document.createElement('canvas');
    const context = strip.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    // A block can only have one request in flight, and a second one waits for
    // the first instead of failing. Cancel before asking again.
    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // A video fill decodes real frames. The times are media time in the
      // source file, so trim, time offset, speed and looping are ignored.
      this.videoFill,
      thumbnailHeight,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          // An error ends the sequence. No further frames arrive.
          console.error('Filmstrip failed:', result.message);
          return;
        }

        // The engine derives the width from the frame's aspect ratio, so the
        // canvas can only be sized once the first frame is in.
        if (!sized) {
          strip.width = result.width * numberOfFrames;
          strip.height = result.height;
          sized = true;
        }

        // Frames are not guaranteed to arrive in index order — always place
        // each frame at its reported index.
        context.putImageData(result, frameIndex * result.width, 0);

        // There is no completion callback, and the reported index is always 0
        // on error, so counting arrivals is the only reliable finish test.
        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('filmstrip', strip);
        }
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }
```

When you pass a video fill, the frames are spaced evenly across the range, and both the first and last moment you asked for are included.

Those times refer to the **source video file**, not to the timeline. Trimming the clip, moving it, changing its speed, or looping it makes no difference here. If you want a strip that matches the trimmed clip, work out the corresponding times in the source file before you call.

### Choosing the block: video fill vs. design block

The same method behaves in two entirely different ways depending on what you pass it.

Pass a **page or any design block below a page** and the engine re-renders the composed scene instead of decoding a file:

```typescript highlight=highlight-tp-storyboard
  /** A storyboard of the composed page rendered at several points in time. */
  private generateStoryboard(): void {
    const engine = this.engine;
    const numberOfFrames = 8;
    const thumbnailHeight = 96;

    const board = document.createElement('canvas');
    const context = board.getContext('2d');
    if (!context) throw new Error('Could not create a 2D canvas context');

    let sized = false;
    let received = 0;

    this.cancelPending(this.page);

    const cancel = engine.block.generateVideoThumbnailSequence(
      // Passing a page — or any design block below a page — re-renders the
      // composed scene instead of decoding a file. Times are relative to the
      // block's own time offset on the page timeline.
      this.page,
      thumbnailHeight,
      0,
      engine.block.getDuration(this.page),
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Storyboard failed:', result.message);
          return;
        }

        if (!sized) {
          board.width = result.width * numberOfFrames;
          board.height = result.height;
          sized = true;
        }

        context.putImageData(result, frameIndex * result.width, 0);

        received += 1;
        if (received === numberOfFrames) {
          void this.publishCanvas('storyboard', board);
        }
      }
    );

    this.inFlight.set(this.page, cancel);
  }
```

Here is how the two compare:

| | Video fill | Page or design block |
| --- | --- | --- |
| What you get | Frames decoded from the video file | The whole composition, rendered |
| Frame times | Evenly spaced, including the first and last moment of the range | Spread across the range, but never exactly the first or last moment |
| Times refer to | The source video file | The page timeline, relative to the block |
| Speed | Slower, because each frame is decoded on its own | Faster, because several frames render together |

Since the design block never lands exactly on the ends of the range, one frame over `0` to `10` seconds gives you the frame at 5 seconds, not at 0.

Two more things to expect from a page or design block. Blocks render without their animations, so you see them in their resting state. And video inside the composition comes from a small set of cached frames rather than a fresh decode, so a page storyboard shows the video content only approximately. When you need accurate frames from a specific clip, ask its video fill instead.

You can pass a video fill, a page, a graphic, text, a group, or a track. Fills other than video, shapes, effects, and animations are not supported. A design block must also sit on a page — a block you have not added to a page yet, or the scene itself, does not work.

### Handling frames as they stream in

Three rules keep the callback simple to work with:

**Count the frames to know when it finished.** There is no separate "done" callback. Do not test whether the frame index equals `numberOfFrames - 1` either, because a failed request always reports index `0`. Keep a counter instead.

**Use the index you are given, not the order of arrival.** Frames can arrive out of order. Put each one where its index says, as the example does with `putImageData(result, frameIndex * result.width, 0)`.

**An error ends the whole request.** Once your callback receives an `Error`, no more frames follow. Treat it as the end of the request, not as one skipped frame.

Your callback runs while the engine is working, so avoid changing the scene from inside it. The example waits for `canvas.toBlob()` first, which finishes after the engine is done.

The `ImageData` you receive is yours to keep for as long as you need it.

## Draw an Audio Waveform

`generateAudioThumbnailSequence()` accepts an audio block or a video fill — nothing else. Passing a page or a graphic is rejected right at the call.

```typescript highlight=highlight-tp-waveform
  /** A waveform envelope for the audio clip. */
  private generateWaveform(): void {
    const engine = this.engine;
    const samplesPerChunk = 64;
    const numberOfSamples = 768;
    const numberOfChannels = 1;
    const numberOfChunks = Math.ceil(numberOfSamples / samplesPerChunk);

    const envelope = new Float32Array(numberOfSamples);
    let received = 0;

    // Compressed audio is throttled per tick, so only ask for the window that
    // actually sits on the timeline instead of the whole file.
    const timeEnd = Math.min(this.audioDuration, PAGE_DURATION);

    this.cancelPending(this.audioBlock);

    const cancel = engine.block.generateAudioThumbnailSequence(
      // Only an audio block or a video fill is accepted here. A page or a
      // graphic is rejected.
      this.audioBlock,
      samplesPerChunk,
      0,
      timeEnd,
      numberOfSamples,
      numberOfChannels,
      (chunkIndex, result) => {
        if (result instanceof Error) {
          console.error('Waveform failed:', result.message);
          return;
        }

        // On Web this Float32Array is a zero-copy view into the WASM heap.
        // Copy it here, synchronously, before doing anything else with it.
        const chunk = result.slice();

        // numberOfSamples counts samples per channel, and stereo chunks
        // interleave left and right, so step by numberOfChannels. The final
        // chunk is shorter whenever the total does not divide evenly.
        const sampleCount = chunk.length / numberOfChannels;
        const offset = chunkIndex * samplesPerChunk;
        for (let i = 0; i < sampleCount; i++) {
          envelope[offset + i] = chunk[i * numberOfChannels];
        }

        received += 1;
        if (received === numberOfChunks) {
          void this.publishCanvas('waveform', drawWaveform(envelope));
        }
      }
    );

    this.inFlight.set(this.audioBlock, cancel);
  }
```

`numberOfSamples` counts samples **per channel**, while each chunk carries `samplesPerChunk * numberOfChannels` floats, interleaved left-then-right for stereo. `numberOfChannels` must be 1 or 2.

You receive `numberOfSamples / samplesPerChunk` chunks, rounded up, and the last one is shorter when the numbers do not divide evenly. Asking for 95 samples at 10 per chunk gives you 10 chunks, the last holding 5.

A range that runs past the end of the audio is not an error — those chunks arrive filled with zeros.

### What the numbers mean

The engine analyzes the audio for you. Every value is a loudness between `0` and `1`, never negative, and already smoothed — so these are numbers you can draw straight away, not raw audio data.

That keeps the drawing code simple: mirror each value around a center line. You do not need to find peaks or rescale anything.

```typescript highlight=highlight-tp-waveform-draw
/** Renders a normalized `[0, 1]` envelope as mirrored bars around a centerline. */
function drawWaveform(envelope: Float32Array): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = envelope.length * 2;
  canvas.height = 128;

  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create a 2D canvas context');

  context.fillStyle = '#12121a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const centerLine = canvas.height / 2;
  context.fillStyle = '#7a8cff';

  for (let i = 0; i < envelope.length; i++) {
    // The values are already normalized, so each one maps straight onto a bar
    // height. No peak finding and no rescaling.
    const amplitude = Math.max(envelope[i] * centerLine, 0.5);
    context.fillRect(i * 2, centerLine - amplitude, 1, amplitude * 2);
  }

  return canvas;
}
```

Very quiet audio reads as `0`, which is why a near-silent track draws as a flat line.

One detail specific to the web: the `Float32Array` belongs to the engine and stays valid only while your callback runs. Copy it before you keep it — `result.slice()` in the example — otherwise the values can change under you when you read them later.

## Capture a Single Preview Frame

The simplest case is one frame at one moment. On a video fill, `numberOfFrames: 1` gives you the frame at `timeBegin`.

```typescript highlight=highlight-tp-single-frame
  /** A single preview frame of the video at one point in time. */
  private generatePreviewFrame(): void {
    const engine = this.engine;
    const time = Math.min(2, this.videoDuration);

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      180,
      time,
      time,
      // With a single frame, a video fill returns exactly timeBegin.
      1,
      (frameIndex, result) => {
        if (result instanceof Error) {
          console.error('Preview frame failed:', result.message);
          return;
        }

        const canvas = document.createElement('canvas');
        canvas.width = result.width;
        canvas.height = result.height;
        canvas.getContext('2d')?.putImageData(result, 0, 0);

        void this.publishCanvas('previewFrame', canvas);
      }
    );

    this.inFlight.set(this.videoFill, cancel);
  }
```

For the common case of "give me a preview of the current page", there is a shortcut. `generateThumbnailAtTimeOffset()` does the same work and gives you a PNG `Blob`:

```typescript highlight=highlight-tp-helper
  /** The browser-only shortcut: one PNG of the current page at a given time. */
  private async generatePagePreview(): Promise<void> {
    // It also runs on the current page, so it queues behind a storyboard.
    this.cancelPending(this.page);

    const height = 256;
    const blob = await this.engine.block.generateThumbnailAtTimeOffset(
      height,
      4
    );

    const width = Math.round((height * PAGE_WIDTH) / PAGE_HEIGHT);
    await this.publishPanel('pagePreview', blob, width, height);
  }
```

It always uses the current page, accepts a `height` of 512 or less, and works in the browser only — not in Node.

## Cancel Generation

On the web, both methods return a function that cancels the request. Keep it — calling it is the only way to stop a request that is already running.

```typescript highlight=highlight-tp-cancel
  /** Start a long sequence and stop it with the returned cancel closure. */
  private demonstrateCancellation(): void {
    const engine = this.engine;
    const numberOfFrames = 240;
    let received = 0;

    this.cancelPending(this.videoFill);

    const cancel = engine.block.generateVideoThumbnailSequence(
      this.videoFill,
      64,
      0,
      this.videoDuration,
      numberOfFrames,
      (frameIndex, result) => {
        if (result instanceof Error) return;
        received += 1;
      }
    );
    this.inFlight.set(this.videoFill, cancel);

    // The flag is honored on the next engine tick, so frames already produced
    // this tick still arrive. Nothing is delivered because of the cancel
    // itself — no final error and no completion signal.
    window.setTimeout(() => {
      this.cancelPending(this.videoFill);
      console.log(
        `Cancelled after ${received} of ${numberOfFrames} frames arrived`
      );
    }, 400);
  }

  /** Stops whatever sequence is still running for a block. */
  private cancelPending(block: number): void {
    // Cancelling twice, after completion, or after a failure is a safe no-op.
    this.inFlight.get(block)?.();
    this.inFlight.delete(block);
  }
```

A cancel takes effect a moment later, so one or two results can still reach your callback. Nothing arrives to tell you the cancel happened — the results simply stop. Cancelling twice, cancelling after the request finished, or cancelling a request that already failed are all safe.

How much a cancel stops depends on what you asked for:

| Request | Cancel before the first result | Cancel while it runs |
| --- | --- | --- |
| Video fill | Stops it — nothing arrives | **No effect.** The rest of the frames still arrive |
| Page or design block | Stops it | Stops it |
| Audio waveform | Stops it | Stops it |

Plan around the first row. Once the engine starts decoding a video fill, a cancel no longer reaches it, and your callback keeps firing for a strip you no longer want.

The simple guard is to ignore what you no longer need: keep a counter that you increase every time you start a new strip, and drop any frame that belongs to an older one. Short requests help too — eight frames finish quickly, a hundred take a while.

Always cancel before you request the same block again. A block handles one request at a time, and a second request waits instead of failing. Start a new filmstrip on every scrub without cancelling and the requests pile up, then arrive in the order you made them rather than the order you want.

## Performance and Limits

- **Ask for 512 px or less.** Above that you get a larger image that is no sharper, and it costs more memory.
- **One request per block at a time.** Cancel before you request the same block again, and ignore results you no longer need.
- **Requests run one after another.** Many strips started at once wait for each other. One video request and one audio request can progress together, but two video requests cannot.
- **Video fills are slower than pages.** Each frame from a video file is decoded on its own, so long strips take noticeably longer than a page storyboard of the same length.
- **Compressed audio takes longer.** A WAV file produces its waveform almost immediately. A long MP3 or AAC file arrives over several moments.
- **These calls do not trigger React re-renders.** Unlike most engine getters, they are not tracked, so calling them inside `withEngine` or `useEngineSelector` sets up no dependency. Refresh them yourself, for example when the editor history changes.
- **Whole numbers only.** `thumbnailHeight`, `numberOfFrames`, `samplesPerChunk`, `numberOfSamples`, and `numberOfChannels` must be integers. A value such as `72 * devicePixelRatio` can be fractional, so round it first.

## Troubleshooting

| Symptom | What to do |
| --- | --- |
| The request never seems to finish | You are probably testing whether the frame index equals `numberOfFrames - 1`. A failed request reports index `0`, so that test never matches. Count the frames instead. |
| `MEDIA.OPERATION_UNSUPPORTED_FOR_BLOCK` | You passed something that is not a video fill or a design block, such as an image fill, a shape, or an effect. |
| `MEDIA.BLOCK_NOT_PAGE_OR_CHILD` | The block is not on a page yet, or you passed the scene. Pass a page or a block that sits on one. |
| `MEDIA.BLOCK_SIZE_ZERO` | The block has no width or height. Give it a size first. |
| The waveform is flat | The time range is past the end of the audio, or the audio is very quiet. |
| Waveform values change after you store them | Copy the `Float32Array` inside the callback with `result.slice()`. |
| Thumbnails look soft | You asked for more than 512 px. Ask for 512 or less. |
| A second request seems stuck | It is waiting for the first request on that block. Cancel the first one. |
| Frames still arrive after you cancelled | Expected when you cancel a video fill request that already started. Ignore the frames you no longer need. |

`getVideoFillThumbnail()`, `getVideoFillThumbnailAtlas()`, and `getPageThumbnailAtlas()` are deprecated in favor of `generateVideoThumbnailSequence()`. Do not reach for them in new code.

## API Reference

| Method | Description |
| --- | --- |
| `engine.block.generateVideoThumbnailSequence(id: DesignBlockId, thumbnailHeight: number, timeBegin: number, timeEnd: number, numberOfFrames: number, onFrame: (frameIndex: number, result: ImageData \| Error) => void): () => void` | Streams image frames across a time range from a video fill or a design block. Returns a cancel function. |
| `engine.block.generateAudioThumbnailSequence(id: DesignBlockId, samplesPerChunk: number, timeBegin: number, timeEnd: number, numberOfSamples: number, numberOfChannels: number, onChunk: (chunkIndex: number, result: Float32Array \| Error) => void): () => void` | Streams waveform chunks from an audio block or a video fill. Returns a cancel function. |
| `engine.block.generateThumbnailAtTimeOffset(height: number, time: number): Promise<Blob>` | Browser-only shortcut that resolves with one PNG of the current page at a point in time. `height` must be 512 or less. |
| `engine.block.forceLoadAVResource(id: DesignBlockId): Promise<void>` | Downloads an audio or video resource up front, so the first preview request does not wait for it. |
| `engine.block.getAVResourceTotalDuration(id: DesignBlockId): number` | Returns the full duration of a video fill's or audio block's media file, in seconds. |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/docs/cesdk/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support