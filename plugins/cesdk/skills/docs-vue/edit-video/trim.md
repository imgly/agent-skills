> This is one page of the CE.SDK Vue documentation. For a complete overview, see the [Vue Documentation Index](https://img.ly/vue.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Trim](./edit-video/trim.md)

---

Control video playback timing by trimming clips to specific start points and
durations using CE.SDK's timeline UI and programmatic trim API.

![Video Trim example showing timeline with video clips and trim controls](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-trim-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-video-trim-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-video-trim-browser/)

Understanding the difference between **fill-level trimming** and **block-level timing** is essential. Fill-level trimming (`setTrimOffset`, `setTrimLength`) controls which portion of the source media plays, while block-level timing (`setTimeOffset`, `setDuration`) controls when and how long the block appears in your timeline. These two systems work together to give you complete control over video playback.

```typescript file=@cesdk_web_examples/guides-create-video-trim-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';
import { calculateGridLayout } from './utils';

/**
 * CE.SDK Plugin: Trim Video Guide
 *
 * Demonstrates trimming video clips in CE.SDK:
 * - Loading video resources with forceLoadAVResource
 * - Basic video trimming with setTrimOffset/setTrimLength
 * - Getting current trim values
 * - Coordinating trim with block duration
 * - Trimming with looping enabled
 * - Checking trim support
 * - Frame-accurate trimming
 * - Batch trimming multiple videos
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Enable video editing features in CE.SDK
    cesdk.feature.enable('ly.img.video');
    cesdk.feature.enable('ly.img.timeline');
    cesdk.feature.enable('ly.img.playback');

    // Load assets and create a video scene (required for trimming)
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

    // Calculate responsive grid layout based on page dimensions
    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);
    const layout = calculateGridLayout(pageWidth, pageHeight, 8);
    const { blockWidth, blockHeight, getPosition } = layout;

    // Use a sample video URL from demo assets
    const videoUri = 'https://img.ly/static/ubq_video_samples/bbb.mp4';

    // Create a sample video block to demonstrate trim support checking
    const sampleVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the video fill - trim operations are applied to the fill, not the block
    const videoFill = engine.block.getFill(sampleVideo);

    // Check if the fill supports trim operations
    const supportsTrim = engine.block.supportsTrim(videoFill);
    // eslint-disable-next-line no-console
    console.log('Video fill supports trim:', supportsTrim); // true for video fills

    // Select this block so timeline controls are visible
    engine.block.setSelected(sampleVideo, true);

    // Pattern: Always load video resource before accessing trim properties
    // This ensures metadata (duration, frame rate, etc.) is available
    await engine.block.forceLoadAVResource(videoFill);

    // Now we can safely access video metadata
    const totalDuration = engine.block.getDouble(
      videoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Total video duration:', totalDuration, 'seconds');

    // Pattern #1: Demonstrate Individual Before Combined
    // Create a separate video block for basic trim demonstration
    const basicTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the fill to apply trim operations
    const basicTrimFill = engine.block.getFill(basicTrimVideo);

    // Load resource before trimming
    await engine.block.forceLoadAVResource(basicTrimFill);

    // Trim video to start at 2 seconds and play for 5 seconds
    engine.block.setTrimOffset(basicTrimFill, 2.0);
    engine.block.setTrimLength(basicTrimFill, 5.0);

    // Get current trim values to verify or modify
    const currentOffset = engine.block.getTrimOffset(basicTrimFill);
    const currentLength = engine.block.getTrimLength(basicTrimFill);
    // eslint-disable-next-line no-console
    console.log(
      `Basic trim - Offset: ${currentOffset}s, Length: ${currentLength}s`
    );

    // Pattern #5: Progressive Complexity - coordinating trim with block duration
    // Create a video block demonstrating trim + duration coordination
    const durationTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const durationTrimFill = engine.block.getFill(durationTrimVideo);
    await engine.block.forceLoadAVResource(durationTrimFill);

    // Set trim: play portion from 3s to 8s (5 seconds of content)
    engine.block.setTrimOffset(durationTrimFill, 3.0);
    engine.block.setTrimLength(durationTrimFill, 5.0);

    // Set block duration: how long this block appears in the timeline
    // When duration equals trim length, the entire trimmed portion plays once
    engine.block.setDuration(durationTrimVideo, 5.0);

    // eslint-disable-next-line no-console
    console.log(
      'Trim+Duration - Block will play trimmed 5s exactly once in timeline'
    );

    // Create a video block with trim + looping
    const loopingTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const loopingTrimFill = engine.block.getFill(loopingTrimVideo);
    await engine.block.forceLoadAVResource(loopingTrimFill);

    // Trim to a short 3-second segment
    engine.block.setTrimOffset(loopingTrimFill, 1.0);
    engine.block.setTrimLength(loopingTrimFill, 3.0);

    // Enable looping so the 3-second segment repeats
    engine.block.setLooping(loopingTrimFill, true);

    // Verify looping is enabled
    const isLooping = engine.block.isLooping(loopingTrimFill);
    // eslint-disable-next-line no-console
    console.log('Looping enabled:', isLooping);

    // Set duration longer than trim length - the trim will loop to fill it
    engine.block.setDuration(loopingTrimVideo, 9.0);

    // eslint-disable-next-line no-console
    console.log(
      'Looping trim - 3s segment will loop 3 times to fill 9s duration'
    );

    // Pattern #6: Descriptive naming - frame-accurate trim demonstration
    // Create a video block for frame-accurate trimming
    const frameAccurateTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const frameFill = engine.block.getFill(frameAccurateTrimVideo);
    await engine.block.forceLoadAVResource(frameFill);

    // Note: Frame rate is not directly accessible via the API
    // For this example, we'll assume a common frame rate of 30fps
    const frameRate = 30;

    // Calculate trim offset based on specific frame number
    // Example: Start at frame 60 for a 30fps video = 2.0 seconds
    const startFrame = 60;
    const trimOffsetSeconds = startFrame / frameRate;

    // Trim for exactly 150 frames = 5.0 seconds at 30fps
    const trimFrames = 150;
    const trimLengthSeconds = trimFrames / frameRate;

    engine.block.setTrimOffset(frameFill, trimOffsetSeconds);
    engine.block.setTrimLength(frameFill, trimLengthSeconds);

    // eslint-disable-next-line no-console
    console.log(
      `Frame-accurate trim - Frame rate: ${frameRate}fps (assumed), Start frame: ${startFrame}, Duration: ${trimFrames} frames`
    );

    // Pattern: Batch processing multiple video clips
    // Create multiple video blocks to demonstrate batch trimming
    const batchVideoUris = [
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    ];

    const batchVideos = [];
    for (let i = 0; i < batchVideoUris.length; i++) {
      const batchVideo = await engine.block.addVideo(
        batchVideoUris[i],
        blockWidth,
        blockHeight
      );
      batchVideos.push(batchVideo);

      // Get the fill for trim operations
      const batchFill = engine.block.getFill(batchVideo);

      // Load resource before trimming
      await engine.block.forceLoadAVResource(batchFill);

      // Apply consistent trim: first 4 seconds of each video
      engine.block.setTrimOffset(batchFill, 0.0);
      engine.block.setTrimLength(batchFill, 4.0);

      // Set consistent duration
      engine.block.setDuration(batchVideo, 4.0);
    }

    // eslint-disable-next-line no-console
    console.log('Batch trim - Applied consistent 4s trim to 3 video blocks');

    // ===== Position all blocks in grid layout =====
    const blocks = [
      sampleVideo, // Position 0
      basicTrimVideo, // Position 1
      durationTrimVideo, // Position 2
      loopingTrimVideo, // Position 3
      frameAccurateTrimVideo, // Position 4
      ...batchVideos // Positions 5-7
    ];

    blocks.forEach((block, index) => {
      const pos = getPosition(index);
      engine.block.setPositionX(block, pos.x);
      engine.block.setPositionY(block, pos.y);
    });

    // Start playback automatically when the example loads
    try {
      engine.block.setPlaying(page, true);
      // eslint-disable-next-line no-console
      console.log(
        'Video trim guide initialized. Playback started automatically. Use timeline controls to adjust trim handles.'
      );
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(
        'Video trim guide initialized. Click play button to start playback.'
      );
    }
  }
}

export default Example;
```

This guide covers how to use the built-in timeline UI for visual trimming and how to trim videos programmatically using the Engine API.

## Understanding Trim Concepts

### Fill-Level Trimming

When we trim a video, we're adjusting properties of the video's fill, not the block itself. The fill represents the media source—the actual video file. Fill-level trimming determines which portion of that source media will play.

`setTrimOffset` specifies where playback starts within the source media. A trim offset of `2.0` skips the first two seconds of the video file.

`setTrimLength` defines how much of the source media plays from the trim offset point. A trim length of 5.0 will play 5 seconds of the source. Combined with a trim offset of 2.0, the video plays from 2 seconds to 7 seconds of the original file.

This trimming is completely non-destructive—the source video file remains unchanged. You can adjust trim values at any time to show different portions of the same media.

> **Note:** Audio blocks use the same trim API (`setTrimOffset`, `setTrimLength`) as video
> blocks. The concepts are identical, though this guide focuses on video.

### Block-Level Timing

Block-level timing is separate from trimming and controls when and how long a block exists in the timeline. `setTimeOffset` determines when the block becomes active in the composition timeline (useful for track-based layouts). `setDuration` controls how long the block appears in the timeline.

The *trim* controls what plays from the source media, while the *duration* controls how long that playback appears in your timeline. If the duration exceeds the trim length and if looping is disabled, the trimmed portion will play once and then hold the last frame for the remaining duration.

### Common Use Cases

Trimming enables many video editing workflows:

- **Remove unwanted segments** - Cut intro or outro portions to keep videos concise
- **Extract key moments** - Isolate specific segments from longer source media
- **Sync audio to video** - Trim audio and video independently for perfect alignment
- **Create loops** - Trim to a specific length and enable loop mode for seamless repeating content
- **Uniform compositions** - Batch trim multiple clips to consistent lengths

## Trimming Video via UI

### Accessing Trim Controls

When you select a video block in the timeline, CE.SDK reveals trim handles at the edges of the clip. These visual controls appear as draggable handles on the left and right sides of the video block in the timeline panel.

The trimmed portion of your video is visually distinguished from the untrimmed regions on either side that represent portions of the source media that won't play due to trim settings. This visual feedback makes it immediately clear which part of your video will be included in the final composition.

### Using Trim Handles

We adjust trimming by dragging the handles. The left handle controls the trim offset—dragging it right increases the offset, skipping more of the beginning. Dragging left decreases the offset, including more from the start of the video.

The right handle adjusts the trim length by changing where the video stops playing. Dragging left shortens the trim length, ending playback earlier. Dragging right extends it, playing more of the source media.

For frame-accurate control, many CE.SDK interfaces provide numeric input fields where you can type exact time values in seconds. This precision is essential when you need to trim to specific frames or match exact durations.

The icon on the trim handle turns into an outward-pointing arrow.

### Preview During Trimming

Scrubbing the playhead through your trimmed content shows exactly what will play. This immediate feedback loop makes it easy to find the perfect trim points visually.

If your video extends beyond the page duration, out-of-bounds content is indicated with a blue overlay in the timeline and won't be visible in the final output.

### Constraints and Limitations

CE.SDK enforces a minimum trim duration to prevent creating zero-length or extremely short clips that could cause playback issues. If you try to drag handles closer than this minimum, the handle will resist further movement.

When clips extend beyond page duration boundaries, grey visual indicators show which portions fall outside. While the video block may be longer than the page, only content within the page duration will appear in exports or final compositions.

## Programmatic Video Trimming

### Prerequisites and Setup

For applications that need to apply trimming programmatically—whether for automation, batch processing, or dynamic user experiences—we start by setting up CE.SDK in Video mode with the proper configuration.

```typescript highlight-enable-video-features
// Enable video editing features in CE.SDK
cesdk.feature.enable('ly.img.video');
cesdk.feature.enable('ly.img.timeline');
cesdk.feature.enable('ly.img.playback');
```

Video mode is required for trimming operations. Design mode doesn't provide timeline-based editing capabilities, so we must use `createVideoScene()` to access trim functionality.

### Loading Video Resources

Before accessing trim properties or setting trim values, we must load the video resource metadata using `forceLoadAVResource`. This critical step ensures CE.SDK has downloaded information about the video's duration, frame rate, and other properties needed for accurate trimming.

```typescript highlight-load-video-resource
    // Pattern: Always load video resource before accessing trim properties
    // This ensures metadata (duration, frame rate, etc.) is available
    await engine.block.forceLoadAVResource(videoFill);

    // Now we can safely access video metadata
    const totalDuration = engine.block.getDouble(
      videoFill,
      'fill/video/totalDuration'
    );
    // eslint-disable-next-line no-console
    console.log('Total video duration:', totalDuration, 'seconds');
```

Skipping this step is a common source of errors. Without loading the resource first, trim operations may fail silently or produce unexpected results. Always await `forceLoadAVResource` before calling any trim methods.

Once loaded, we can access metadata like `totalDuration` and `frameRate` from the video fill. This information helps us calculate valid trim ranges and ensures we don't try to trim beyond the available media.

### Checking Trim Support

Before applying trim operations, we verify that a block supports trimming. While video blocks typically support trimming, other block types like pages and scenes do not.

```typescript highlight-check-trim-support
    // Create a sample video block to demonstrate trim support checking
    const sampleVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the video fill - trim operations are applied to the fill, not the block
    const videoFill = engine.block.getFill(sampleVideo);

    // Check if the fill supports trim operations
    const supportsTrim = engine.block.supportsTrim(videoFill);
    // eslint-disable-next-line no-console
    console.log('Video fill supports trim:', supportsTrim); // true for video fills

    // Select this block so timeline controls are visible
    engine.block.setSelected(sampleVideo, true);
```

Checking support prevents runtime errors and allows you to build robust interfaces that only show trim controls for compatible blocks. Graphic blocks with video fills also support trimming, not just top-level video blocks.

### Trimming Video

Once we've confirmed trim support and loaded the resource, we can apply trimming. Here we create a video block and trim it to start 2 seconds into the source media and play for 5 seconds.

```typescript highlight-basic-video-trim
    // Pattern #1: Demonstrate Individual Before Combined
    // Create a separate video block for basic trim demonstration
    const basicTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    // Get the fill to apply trim operations
    const basicTrimFill = engine.block.getFill(basicTrimVideo);

    // Load resource before trimming
    await engine.block.forceLoadAVResource(basicTrimFill);

    // Trim video to start at 2 seconds and play for 5 seconds
    engine.block.setTrimOffset(basicTrimFill, 2.0);
    engine.block.setTrimLength(basicTrimFill, 5.0);
```

The trim offset of 2.0 skips the first 2 seconds of the video. The trim length of 5.0 means exactly 5 seconds of video will play, starting from that offset point. So this video plays from the 2-second mark to the 7-second mark of the original file.

### Getting Current Trim Values

We can retrieve the current trim settings to verify values, build UI controls, or make relative adjustments based on existing settings.

```typescript highlight-get-trim-values
// Get current trim values to verify or modify
const currentOffset = engine.block.getTrimOffset(basicTrimFill);
const currentLength = engine.block.getTrimLength(basicTrimFill);
// eslint-disable-next-line no-console
console.log(
  `Basic trim - Offset: ${currentOffset}s, Length: ${currentLength}s`
);
```

These getter methods return the current trim offset and length in seconds. Use them to populate UI inputs, calculate remaining media duration, or create undo/redo functionality in your application.

## Additional Trimming Techniques

### Trimming with Block Duration

Take a look at this example to understand how trim length and block duration interact:

```typescript highlight-trim-with-duration
    // Pattern #5: Progressive Complexity - coordinating trim with block duration
    // Create a video block demonstrating trim + duration coordination
    const durationTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const durationTrimFill = engine.block.getFill(durationTrimVideo);
    await engine.block.forceLoadAVResource(durationTrimFill);

    // Set trim: play portion from 3s to 8s (5 seconds of content)
    engine.block.setTrimOffset(durationTrimFill, 3.0);
    engine.block.setTrimLength(durationTrimFill, 5.0);

    // Set block duration: how long this block appears in the timeline
    // When duration equals trim length, the entire trimmed portion plays once
    engine.block.setDuration(durationTrimVideo, 5.0);

    // eslint-disable-next-line no-console
    console.log(
      'Trim+Duration - Block will play trimmed 5s exactly once in timeline'
    );
```

In this example, we trim the video to a 5-second segment (from 3s to 8s of the source) and set the block duration to exactly 5 seconds. This means the entire trimmed portion plays once, then stops. The block duration matches the trim length, so there's no looping or holding on the last frame.

If the block duration is less than the trim length, only part of the trimmed segment will play. If duration exceeds trim length without looping enabled, the video plays the trimmed portion once and holds on the last frame for the remaining time.

### Trimming with Looping

Looping allows a trimmed video segment to repeat seamlessly. We enable looping and set a block duration longer than the trim length to create repeating playback.

```typescript highlight-trim-with-looping
    // Create a video block with trim + looping
    const loopingTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const loopingTrimFill = engine.block.getFill(loopingTrimVideo);
    await engine.block.forceLoadAVResource(loopingTrimFill);

    // Trim to a short 3-second segment
    engine.block.setTrimOffset(loopingTrimFill, 1.0);
    engine.block.setTrimLength(loopingTrimFill, 3.0);

    // Enable looping so the 3-second segment repeats
    engine.block.setLooping(loopingTrimFill, true);

    // Verify looping is enabled
    const isLooping = engine.block.isLooping(loopingTrimFill);
    // eslint-disable-next-line no-console
    console.log('Looping enabled:', isLooping);

    // Set duration longer than trim length - the trim will loop to fill it
    engine.block.setDuration(loopingTrimVideo, 9.0);

    // eslint-disable-next-line no-console
    console.log(
      'Looping trim - 3s segment will loop 3 times to fill 9s duration'
    );
```

Here we trim to a 3-second segment and enable looping. The block duration of 9 seconds means this 3-second segment will loop 3 times to fill the entire duration. This technique is perfect for creating background loops, repeated motion graphics, or extending short clips.

When looping is enabled, CE.SDK automatically restarts playback from the trim offset when it reaches the end of the trim length.

### Frame-Accurate Trimming

For precise editing, we often need to trim to specific frame boundaries rather than arbitrary time values. Using the video's frame rate metadata, we can calculate exact frame-based trim points.

```typescript highlight-frame-accurate-trim
    // Pattern #6: Descriptive naming - frame-accurate trim demonstration
    // Create a video block for frame-accurate trimming
    const frameAccurateTrimVideo = await engine.block.addVideo(
      videoUri,
      blockWidth,
      blockHeight
    );

    const frameFill = engine.block.getFill(frameAccurateTrimVideo);
    await engine.block.forceLoadAVResource(frameFill);

    // Note: Frame rate is not directly accessible via the API
    // For this example, we'll assume a common frame rate of 30fps
    const frameRate = 30;

    // Calculate trim offset based on specific frame number
    // Example: Start at frame 60 for a 30fps video = 2.0 seconds
    const startFrame = 60;
    const trimOffsetSeconds = startFrame / frameRate;

    // Trim for exactly 150 frames = 5.0 seconds at 30fps
    const trimFrames = 150;
    const trimLengthSeconds = trimFrames / frameRate;

    engine.block.setTrimOffset(frameFill, trimOffsetSeconds);
    engine.block.setTrimLength(frameFill, trimLengthSeconds);

    // eslint-disable-next-line no-console
    console.log(
      `Frame-accurate trim - Frame rate: ${frameRate}fps (assumed), Start frame: ${startFrame}, Duration: ${trimFrames} frames`
    );
```

We first retrieve the frame rate from the video fill metadata. Then we convert frame numbers to time offsets by dividing by the frame rate. Starting at frame 60 with a 30fps video gives us exactly 2.0 seconds. Trimming for 150 frames provides exactly 5.0 seconds of playback.

This technique ensures frame-accurate edits, which is essential for professional video editing workflows. Remember that codec compression may affect true frame accuracy—for critical applications, test with your target codecs to verify precision.

### Batch Processing Multiple Videos

When working with multiple video clips that need consistent trimming, we can iterate through collections and apply the same trim settings programmatically.

```typescript highlight-batch-trim-videos
    // Pattern: Batch processing multiple video clips
    // Create multiple video blocks to demonstrate batch trimming
    const batchVideoUris = [
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4',
      'https://img.ly/static/ubq_video_samples/bbb.mp4'
    ];

    const batchVideos = [];
    for (let i = 0; i < batchVideoUris.length; i++) {
      const batchVideo = await engine.block.addVideo(
        batchVideoUris[i],
        blockWidth,
        blockHeight
      );
      batchVideos.push(batchVideo);

      // Get the fill for trim operations
      const batchFill = engine.block.getFill(batchVideo);

      // Load resource before trimming
      await engine.block.forceLoadAVResource(batchFill);

      // Apply consistent trim: first 4 seconds of each video
      engine.block.setTrimOffset(batchFill, 0.0);
      engine.block.setTrimLength(batchFill, 4.0);

      // Set consistent duration
      engine.block.setDuration(batchVideo, 4.0);
    }

    // eslint-disable-next-line no-console
    console.log('Batch trim - Applied consistent 4s trim to 3 video blocks');
```

We create multiple video blocks and apply identical trim settings to each one. This ensures consistency across clips—perfect for creating video montages, multi-angle compositions, or any scenario where uniform clip lengths are required.

When batch processing, always load each video's resources before trimming. Don't assume all videos have the same duration—check total duration to ensure your trim values don't exceed available media.

## Trim vs Duration Interaction

### How setDuration Affects Playback

The relationship between trim length and block duration determines playback behavior. When block duration equals trim length, the video plays the trimmed portion exactly once. When duration is less than trim length, playback stops before the trimmed portion finishes. When duration exceeds trim length with looping disabled, the video plays once and holds on the last frame.

With looping enabled, exceeding trim length causes the trimmed segment to repeat until the block duration is filled. This creates seamless loops as long as the content loops visually.

### Best Practices

For predictable behavior, always consider both trim and duration together. Set trim values first to define the source media segment you want. Then set duration to control timeline length. If you want the entire trimmed segment to play once, match duration to trim length. For looping content, enable looping before setting a longer duration.

When building UIs, update both values together when users adjust trim handles. This prevents confusion about why a video isn't playing the full trimmed length (duration too short) or why it's holding on the last frame (duration too long without looping).

## Performance Considerations

CE.SDK's video system is optimized for real-time editing, but understanding these performance factors helps you build responsive applications:

- **Resource loading**: Use `forceLoadAVResource` judiciously. Loading resources has overhead, so batch loads when possible rather than loading repeatedly.
- **Trim adjustments**: Changing trim values is lightweight—CE.SDK updates the playback range without reprocessing the video. You can adjust trim interactively without performance concerns.
- **Mobile devices**: Video decoding is more expensive on mobile. Limit the number of simultaneous video blocks and consider lower resolution sources for editing (high resolution for export).
- **Long videos**: Very long source videos (30+ minutes) may have slower seeking to trim offsets. Consider pre-cutting extremely long videos into shorter segments.

Test your trim operations on target devices early in development to ensure acceptable performance for your users.

## Troubleshooting

### Trim Not Applied

If setting trim values has no visible effect, the most common cause is forgetting to await `forceLoadAVResource`. The resource must be loaded before trim values take effect. Always load resources first.

Another possibility is confusing time offset with trim offset. `setTimeOffset` controls when the block appears in the timeline, while `setTrimOffset` controls where in the source media playback starts. Make sure you're using the correct method.

### Incorrect Trim Calculation

If trim values seem offset or produce unexpected results, verify you're calculating based on the source media duration, not the block duration. Use `getTotalDuration` from the fill metadata to understand the available media length.

Also check that you're not exceeding the total available duration. Trim offset plus trim length should never exceed total duration. CE.SDK may clamp values automatically, but it's better to validate before setting.

### Playback Beyond Trim Length

If video plays past the intended trim length, check that block duration doesn't exceed trim length. When duration is longer and looping is disabled, the video will hold on the last frame for the excess duration.

Ensure looping is set correctly for your use case. If you want playback to stop at the trim length, set duration equal to trim length or enable looping.

### Audio/Video Desync

When trimming both audio and video independently, desynchronization can occur if offset and duration values aren't coordinated carefully. Calculate both trim offsets to maintain the original relationship between audio and video timing.

Consider the original sync point between audio and video in the source media. If they were perfectly synced at 0 seconds originally, maintaining the same offset difference preserves that sync.

### Frame-Accurate Trim Issues

If frame-accurate trimming doesn't land on exact frames, remember that floating-point precision can cause tiny discrepancies. Round your calculated values to a reasonable precision (e.g., 3 decimal places).

Also understand codec limitations. Variable frame rate videos don't have perfectly uniform frame timing, so true frame accuracy may not be possible. Use constant frame rate sources for critical frame-accurate applications.

## Best Practices

### Workflow Recommendations

1. Always `await forceLoadAVResource()` before accessing trim properties
2. Check `supportsTrim()` before applying trim operations
3. Coordinate trim length with block duration for predictable behavior
4. Use TypeScript for type safety with CE.SDK API
5. Preview trimmed content before final export
6. Validate trim values don't exceed total media duration

### Code Organization

- Separate media loading from trim logic
- Create helper functions for common trim patterns (e.g., `trimToFrames`, `trimToPercentage`)
- Handle errors gracefully with try-catch blocks around `forceLoadAVResource`
- Document complex trim calculations with comments explaining frame math

### Performance Optimization

- Avoid redundant `forceLoadAVResource` calls—load once, trim multiple times
- Use appropriate preview quality settings during editing to maintain responsiveness
- Test on target devices early to identify performance bottlenecks

## API Reference

| Method                           | Description                        | Parameters                            | Returns         |
| -------------------------------- | ---------------------------------- | ------------------------------------- | --------------- |
| `getFill(id)`                    | Get the fill block for a block     | `id: DesignBlockId`                   | `DesignBlockId` |
| `forceLoadAVResource(id)`        | Force load media resource metadata | `id: DesignBlockId`                   | `Promise<void>` |
| `supportsTrim(id)`               | Check if block supports trimming   | `id: DesignBlockId`                   | `boolean`       |
| `setTrimOffset(id, offset)`      | Set start point of media playback  | `id: DesignBlockId, offset: number`   | `void`          |
| `getTrimOffset(id)`              | Get current trim offset            | `id: DesignBlockId`                   | `number`        |
| `setTrimLength(id, length)`      | Set duration of trimmed media      | `id: DesignBlockId, length: number`   | `void`          |
| `getTrimLength(id)`              | Get current trim length            | `id: DesignBlockId`                   | `number`        |
| `getAVResourceTotalDuration(id)` | Get total duration of source media | `id: DesignBlockId`                   | `number`        |
| `setLooping(id, enabled)`        | Enable/disable media looping       | `id: DesignBlockId, enabled: boolean` | `void`          |
| `isLooping(id)`                  | Check if media looping is enabled  | `id: DesignBlockId`                   | `boolean`       |
| `setDuration(id, duration)`      | Set block playback duration        | `id: DesignBlockId, duration: number` | `void`          |
| `getDuration(id)`                | Get block duration                 | `id: DesignBlockId`                   | `number`        |
| `setTimeOffset(id, offset)`      | Set when block becomes active      | `id: DesignBlockId, offset: number`   | `void`          |
| `getTimeOffset(id)`              | Get block time offset              | `id: DesignBlockId`                   | `number`        |



---

## More Resources

- **[Vue Documentation Index](https://img.ly/vue.md)** - Browse all Vue documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./vue.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support