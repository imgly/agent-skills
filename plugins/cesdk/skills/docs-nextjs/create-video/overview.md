> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Overview](./create-video/overview.md)

---

In addition to static designs, CE.SDK also allows you to create and edit videos. Working with videos introduces the concept of time into the scene, which requires you to switch the scene into the `"Video"` mode.

In this mode, each page in the scene has its own separate timeline within which its children can be placed. The `"playback/time"` property of each page controls the progress of time through the page.

In order to add videos to your pages, you can add a block with a `"//ly.img.ubq/fill/video"` fill. As the playback time of the page progresses, the corresponding point in time of the video fill is rendered by the block.

You can also customize the video fill's trim in order to control the portion of the video that should be looped while the block is visible.

`//ly.img.ubq/audio` blocks can be added to the page in order to play an audio file during playback.

The `playback/timeOffset` property controls after how many seconds the audio should begin to play, while the duration property defines how long the audio should play. The same APIs can be used for other design blocks as well, such as text or graphic blocks.

Finally, the whole page can be exported as a video file using the `block.exportVideo` function.

## A Note on Browser Support

Video mode heavily relies on modern features like web codecs.
A detailed list of supported browser versions can be found in our [Supported Browsers](./browser-support.md).
Please also take note of [possible restrictions based on the host platform](./file-format-support.md) browsers are running on.

## Creating a Video Scene

First, we create a scene that is set up for video editing by calling the `scene.createVideo()` API. Then we create a page, add it to the scene and define its dimensions. This page will hold our composition.

```javascript
const scene = engine.scene.createVideo();

const page = engine.block.create('page');
engine.block.appendChild(scene, page);

engine.block.setWidth(page, 1280);
engine.block.setHeight(page, 720);
```

## Setting Page Durations

Next, we define the duration of the page using the `setDuration(block: number, duration: number): void` API to be 20 seconds long. This will be the total duration of our exported video in the end.

```javascript
engine.block.setDuration(page, 20);
```

## Adding Videos

In this example, we want to show two videos, one after the other. For this, we first create two graphic blocks and assign two `'video'` fills to them.

```javascript
const video1 = engine.block.create('graphic');
engine.block.setShape(video1, engine.block.createShape('rect'));
const videoFill = engine.block.createFill('video');
engine.block.setString(
  videoFill,
  'fill/video/fileURI',
  'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-drone-footage-of-a-surfer-barrelling-a-wave-12715991.mp4'
);
engine.block.setFill(video1, videoFill);

const video2 = engine.block.create('graphic');
engine.block.setShape(video2, engine.block.createShape('rect'));
const videoFill2 = engine.block.createFill('video');
engine.block.setString(
  videoFill2,
  'fill/video/fileURI',
  'https://cdn.img.ly/assets/demo/v3/ly.img.video/videos/pexels-kampus-production-8154913.mp4'
);
engine.block.setFill(video2, videoFill2);
```

## Creating a Track

While we could add the two blocks directly to the page and and manually set their sizes and time offsets, we can alternatively also use the `track` block to simplify this work. A `track` automatically adjusts the time offsets of its children to make sure that they play one after another without any gaps, based on each child's duration.

Tracks themselves cannot be selected directly by clicking on the canvas, nor do they have any visual representation.

We create a `track` block, add it to the page and add both videos in the order in which they should play as the track's children. Next, we use the `fillParent` API, which will resize all children of the track to the same dimensions as the page.

The dimensions of a `track` are always derived from the dimensions of its children, so you should not call the `setWidth` or `setHeight` APIs on a track, but on its children instead if you can't use the `fillParent` API.

```javascript
const track = engine.block.create('track');
engine.block.appendChild(page, track);
engine.block.appendChild(track, video1);
engine.block.appendChild(track, video2);
engine.block.fillParent(track);
```

By default, each block has a duration of 5 seconds after it is created. If we want to show it on the page for a different amount of time, we can use the `setDuration` API.

Note that we can just increase the duration of the first video block to 15 seconds without having to adjust anything about the second video. The `track` takes care of that for us automatically so that the second video starts playing after 15 seconds.

```javascript
engine.block.setDuration(video1, 15);
```

If the video is longer than the duration of the graphic block that it's attached to, it will cut off once the duration of the graphic is reached. If it is too short, the video will automatically loop for as long as its graphic block is visible.

We can also manually define the portion of our video that should loop within the graphic using the `setTrimOffset(block: number, offset: number): void` and `setTrimLength(block: number, length: number): void` APIs. We use the trim offset to cut away the first second of the video and the trim length to only play 10 seconds of the video. Since our graphic is 15 seconds long, the trimmed video will be played fully once and then start looping for the remaining 5 seconds.

```javascript
/* Make sure that the video is loaded before calling the trim APIs. */
await engine.block.forceLoadAVResource(videoFill);
engine.block.setTrimOffset(videoFill, 1);
engine.block.setTrimLength(videoFill, 10);
```

We can control if a video will loop back to its beginning by calling `setLooping(block: number, looping: boolean): void`. Otherwise, the video will simply hold its last frame instead and audio will stop playing. Looping behavior is activated for all blocks by default.

```javascript
engine.block.setLooping(videoFill, true);
```

## Audio

If the video of a video fill contains an audio track, that audio will play automatically by default when the video is playing. We can mute it by calling `setMuted(block: number, muted: boolean): void`.

```javascript
engine.block.setMuted(videoFill, true);
```

We can also add audio-only files to play together with the contents of the page by adding an `'audio'` block to the page and assigning it the URL of the audio file.

```javascript
const audio = engine.block.create('audio');
engine.block.appendChild(page, audio);
engine.block.setString(
  audio,
  'audio/fileURI',
  'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a'
);
```

We can adjust the volume level of any audio block or video fill by calling `setVolume(block: number, volume: number): void`. The volume is given as a fraction in the range of 0 to 1.

```javascript
/* Set the volume level to 70%. */
engine.block.setVolume(audio, 0.7);
```

By default, our audio block will start playing at the very beginning of the page. We can change this by specifying how many seconds into the scene it should begin to play using the `setTimeOffset(block: number, offset: number): void` API.

```javascript
/* Start the audio after two seconds of playback. */
engine.block.setTimeOffset(audio, 2);
```

By default, our audio block will have a duration of 5 seconds. We can change this by specifying its duration in seconds by using the `setDuration(block: number, duration: number): void` API.

```javascript
/* Give the Audio block a duration of 7 seconds. */
engine.block.setDuration(audio, 7);
```

## Exporting Video

You can start exporting the entire page as a video file by calling `exportVideo()`. The encoding process will run in the background. You can get notified about the progress of the encoding process by the `progressCallback`. It will be called whenever another frame has been encoded.

Since the encoding process runs in the background the engine will stay interactive. So, you can continue to use the engine to manipulate the scene. Please note that these changes won't be visible in the exported video file because the scene's state has been frozen at the start of the export.

```javascript
/* Export page as mp4 video. */
const videoBlob = await engine.block.exportVideo(page, {
  mimeType: 'video/mp4',
  onProgress: (renderedFrames, encodedFrames, totalFrames) => {
    console.log(
      'Rendered',
      renderedFrames,
      'frames and encoded',
      encodedFrames,
      'frames out of',
      totalFrames
    );
  }
});

/* Download video blob. */
let anchor = document.createElement('a');
anchor.href = URL.createObjectURL(videoBlob);
anchor.download = 'exported-video.mp4';
anchor.click();
```

## Exporting Audio

You can export just the audio from your video scene by calling `exportAudio()`. This allows you to extract the audio track separately, whether from an entire page, a single audio block, a video block with audio, or a track containing multiple audio sources.

The audio export process runs in a background worker, similar to video export, keeping the main engine responsive. You can monitor the progress through the `onProgress` callback.

```javascript
/* Export page audio as an WAV audio. */
const audioBlob = await engine.block.exportAudio(page, {
  mimeType: 'audio/wav',
  onProgress: (renderedFrames, encodedFrames, totalFrames) => {
    console.log(
      'Rendered',
      renderedFrames,
      'frames and encoded',
      encodedFrames,
      'frames out of',
      totalFrames
    );
  }
});

/* Download audio blob. */
anchor = document.createElement('a');
anchor.href = URL.createObjectURL(audioBlob);
anchor.download = 'exported-audio.wav';
anchor.click();
```



---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support