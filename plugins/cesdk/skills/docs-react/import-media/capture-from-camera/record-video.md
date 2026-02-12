> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Import Media Assets](./import-media.md) > [Capture From Camera](./import-media/capture-from-camera.md) > [Record Video](./import-media/capture-from-camera/record-video.md)

---

Display live camera feeds in CE.SDK scenes using `PixelStreamFill` and apply real-time effects to the video.

This guide covers creating a video scene with a pixel stream fill, controlling feed orientation, accessing the camera, and updating the fill with video frames.

## Create a Video Scene with Camera Fill

To display a camera feed, create a video scene and set up a page with `PixelStreamFill`. The pixel stream fill accepts live pixel data that you provide frame by frame:

```js
engine.scene.createVideo();
const stack = engine.block.findByType('stack')[0];
const page = engine.block.create('page');
engine.block.appendChild(stack, page);

const pixelStreamFill = engine.block.createFill('pixelStream');
engine.block.setFill(page, pixelStreamFill);

engine.block.appendEffect(page, engine.block.createEffect('half_tone'));
```

We create a video scene, add a page to the stack, and assign a `PixelStreamFill` to receive camera data. The `PixelStreamFill` acts as a container that displays whatever pixel data you send to it. You can apply any CE.SDK effect to process the camera feed in real-time.

## Control Feed Orientation

The `fill/pixelStream/orientation` property controls how the camera feed is displayed. Use `UpMirrored` to horizontally flip the image, which is common for front-facing cameras to create a natural mirror-like selfie view:

```js
// Horizontal mirroring
engine.block.setEnum(
  pixelStreamFill,
  'fill/pixelStream/orientation',
  'UpMirrored'
);
```

Available orientation values:

| Value | Effect |
|-------|--------|
| `Up` | No rotation (default) |
| `Down` | 180° rotation |
| `Left` | 90° counter-clockwise |
| `Right` | 90° clockwise |
| `UpMirrored` | Horizontal flip |
| `DownMirrored` | 180° + horizontal flip |
| `LeftMirrored` | 90° CCW + horizontal flip |
| `RightMirrored` | 90° CW + horizontal flip |

These orientations let you rotate or flip the feed without expensive CPU transformations.

## Access Camera with Browser APIs

Request camera access using the browser's `navigator.mediaDevices.getUserMedia()` API. Create an HTML video element to receive the MediaStream, then update the page dimensions to match the video:

```js
navigator.mediaDevices.getUserMedia({ video: true }).then(
  (stream) => {
    const video = document.createElement('video');
    video.autoplay = true;
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      engine.block.setWidth(page, video.videoWidth);
      engine.block.setHeight(page, video.videoHeight);
      engine.scene.zoomToBlock(page, 40, 40, 40, 40);
      // Continue with frame updates...
    });
  },
  (err) => {
    console.error(err);
  }
);
```

The `facingMode` option in `getUserMedia()` lets you request the front-facing camera (`'user'`) or rear camera (`'environment'`) on mobile devices.

## Update Fill with Video Frames

Use `requestVideoFrameCallback()` to efficiently sync frame updates with the video's frame rate. Call `engine.block.setNativePixelBuffer()` in each callback to send the current video frame to CE.SDK:

```js
const onVideoFrame = () => {
  engine.block.setNativePixelBuffer(pixelStreamFill, video);
  video.requestVideoFrameCallback(onVideoFrame);
};
video.requestVideoFrameCallback(onVideoFrame);
```

The `setNativePixelBuffer()` method accepts either an `HTMLVideoElement` or `HTMLCanvasElement`, providing flexibility for different video processing workflows. Using `requestVideoFrameCallback` instead of `requestAnimationFrame` ensures frame updates are synchronized with the video's actual frame rate.

## Troubleshooting

### Camera Not Appearing

Verify camera permissions are granted in the browser. Check that the video element has `autoplay` set to `true`. Ensure the `loadedmetadata` event fires before accessing video dimensions.

### Mirrored or Rotated Incorrectly

Check the `fill/pixelStream/orientation` enum value. Front-facing cameras typically need `UpMirrored`. Mobile devices may require rotation adjustments based on device orientation.

### Effects Not Rendering

Confirm effects are appended using `engine.block.appendEffect()`. Verify the effect block was created successfully with `engine.block.createEffect()`.

### Performance Issues

Ensure `requestVideoFrameCallback` is used instead of `requestAnimationFrame` for better frame synchronization. Check that only one callback loop is running. Consider reducing effect complexity for smoother preview.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.createVideo()` | Create a video scene for camera preview |
| `engine.block.create('page')` | Create a page block to hold the camera fill |
| `engine.block.createFill('pixelStream')` | Create a fill that accepts live pixel data |
| `engine.block.setFill()` | Assign the pixel stream fill to a block |
| `engine.block.setNativePixelBuffer()` | Send video frame data to the fill |
| `engine.block.setEnum()` | Set the orientation property for mirroring or rotation |
| `engine.block.createEffect()` | Create an effect for real-time processing |
| `engine.block.appendEffect()` | Apply an effect to the page |
| `engine.block.setWidth()` | Set block width to match video dimensions |
| `engine.block.setHeight()` | Set block height to match video dimensions |
| `engine.scene.zoomToBlock()` | Fit the camera view in the viewport |



---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support