> This is one page of the CE.SDK Next.js documentation. For a complete overview, see the [Next.js Documentation Index](https://img.ly/nextjs.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Audio](./create-audio/audio.md)

---

The **CreativeEditor (CE.SDK)** provides different **audio features** you can leverage in web-based apps. This section covers how to **add audio blocks**, **extract** audio from videos, control **playback**, generate **waveforms**, and manage **multi-track audio**.

## Use Cases

Use the CE.SDK audio features when you need to create:

- Background music
- Voice-overs
- Sound effects
- Podcasts

## How Audio Works in the CE.SDK

The CE.SDK represents audio as audio blocks.

Each block has:

- Source (file or extracted track)

- Playback properties (time, speed, volume, mute)

- Timeline properties (offset, duration, trim length)

- Optional waveform thumbnails for UI visualization

### What Are the Timeline Properties

Each audio block has properties that determine when and how much of the sound plays:

- **Offset:** the delay before an audio block begins playing inside the scene timeline.

- **Trim length**: cuts the audio to keep only a specific part of it.

- **Duration**: defines how long the audio plays.

### What Are Waveforms

Waveforms are **visual representations** of the audio signal over time. They show the amplitude (volume level) of the sound at each moment, using peaks and valleys.

The CE.SDK can generate sampled waveform data that you can render in your UI. This is especially helpful for editing tools.

### When to Create VS. Extract Audio

The CE.SDK allows you to either create a blank audio block or extract the audio from a video.

- **Create an empty audio block** when you want to add external or standalone audio that doesn’t come from a video.

- **Extract the audio** when it comes from a video block already in your scene.

## CE.SDK Audio Features Overview

The table below summarizes the main audio-related capabilities in CE.SDK.\
Each feature is related to an example further down the page.

| **Category**             | **Action**                  | **API Name**                         | **Notes** |
|--------------------------|-----------------------------|---------------------------------------|-----------|
| **Create Audio Blocks**  | Create empty audio block    | `create`                     | Creates an audio block with no source. |
|                          | Extract audio from video    | `createAudioFromVideo`                | Requires a video block ID and track index. |
| **Playback Control**     | Set playback position       | `setPlaybackTime`                     | Time in seconds. |
|                          | Volume                      | `setVolume`                           | Range `0.0–1.0`. |
|                          | Mute                        | `setMuted`                            | Boolean. |
|                          | Playback speed              | `setPlaybackSpeed`                    | Range `0.25–3.0`. |
| **Timeline Management**  | Offset                      | `setTimeOffset`                       | To move the playback starting point in the scene timeline. |
|                          | Duration                    | `setDuration`                         | Total length (seconds). |
|                          | Trim length                 | `setTrimLength`                       | Cuts content to a defined length. |
| **Replace Audio Source** | Reload edited scene         | `scene.loadFromString`                | Used when replacing audio at runtime. |
| **Waveforms**            | Generate thumbnails         | `generateAudioThumbnailSequence`      | Produces waveform sample data for UI. |
| **Export Audio**         | Export WAV                  | `exportAudio`                         | MIME type: `audio/wav`. |
|                          | Export MP4                  | `exportAudio`                         | MIME type: `audio/mp4`. |

## Examples

Find in the following list of examples different API calls listed in the preceding table.

### Create Audio

<Tabs>
  <TabItem label="Create Audio">
    To create an empty audio block, use:

    ```ts
    const blockId = engine.block.create('audio');

    ```
  </TabItem>

  <TabItem label="Extract Audio from a Video">
    Use `engine.block.createAudioFromVideo(blockId, trackIndex: number);`.

    This example:

    1. Extracts the first audio track (1) from a video.
    2. Appends it to the page for further manipulation.

    > **Note:** `videoBlockId` and `pageId` must refer to existing blocks.

    ```ts
    const audioBlockId = engine.block.createAudioFromVideo(videoBlockId, 0);
    // Attach to the page so it’s part of the scene
    engine.block.appendChild(pageId, audioBlockId);
    ```
  </TabItem>

  <TabItem label="Add Audio Sources">
    This example:

    1. Creates an audio block.
    2. Attaches the audio block to the page.
    3. Sets the source for the audio from a remote URL.

    > **Note:** `pageId` must refer to an existing page.

    ```ts
    // Create an audio block
      const audioBlockId = engine.block.create('audio');
      await engine.block.appendChild(pageId, audioBlockId);
      engine.block.setString(
        audioBlockId,
        'audio/fileURI',
        'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a'
      );

    ```

    For details on loading sources, check [the dedicated guide](./import-media/from-remote-source/unsplash.md).
  </TabItem>

  <TabItem label="Export">
    This example exports the audio block in **mp4** format:

    > **Note:** `blockId` must refer to an existing audio block.

    ```ts
    engine.block.exportAudio(blockId, {
      mymeType: 'audio/mp4'
      }
    );

    ```

    This example exports the audio in **wav** format:

    ```ts
    const audioData = await engine.block.exportAudio(blockId, {
      mimeType: 'audio/wav'
      }
    );

    ```
  </TabItem>
</Tabs>

### Control Audio Playback

<Tabs>
  <TabItem label="Basic Playback Control">
    Use `engine.block.setPlaybackTime(blockId, time: number)`.

    This example sets the current playback at 3 seconds:

    ```ts
    engine.block.setPlaybackTime(blockId, 3)

    ```
  </TabItem>

  <TabItem label="Volume">
    Use `engine.block.setVolume(blockId, volume: number);`.

    This example sets the volume at 1 (max value):

    ```ts
    engine.block.setVolume(blockId, 1);

    ```
  </TabItem>

  <TabItem label="Mute">
    Use `engine.block.setMuted(blockId, muted: boolean);`.

    This example mutes the audio of the block:

    ```ts
    engine.block.setMuted(blockId, true);

    ```
  </TabItem>

  <TabItem label="Speed">
    Use `engine.block.setPlaybackSpeed(blockId, speed: number);`.

    This example multiplies the speed by 0.25:

    ```ts
    engine.block.setPlaybackSpeed(blockId, 0.25);
    ```
  </TabItem>
</Tabs>

### Manage Audio Timeline

<Tabs>
  <TabItem label="Offset">
    If the audio has an offset of:

    - 0 s → It plays immediately when the scene starts.

    - 2 s → The CE.SDK waits 2 seconds before playing it.

    - 10 s → The audio only starts at the 10-second mark.

    Use `engine.block.setTimeOffset(blockId, offset: number)`.

    This example starts the audio at 2 s on the timeline:

    ```ts
    engine.block.setTimeOffset(blockId, 2);

    ```
  </TabItem>

  <TabItem label="Duration">
    Use `engine.block.setDuration(blockId, duration: number)`.

    This example sets the audio duration for 300 seconds:

    ```ts
    engine.block.setDuration(blockId, 300)
    ```
  </TabItem>

  <TabItem label="Trimming">
    Use `engine.block.setTrimLength(blockId, length: number);`.

    This example creates a new trim that:

    1. Starts at the second 2 of the audio content.
    2. Plays for 10 seconds.

    ```ts
    engine.block.setTrimOffset(blockId, 2)
    engine.block.setTrimLength(blockId, 10);
    ```
  </TabItem>

  <TabItem label="Generate Audio Thumbnails">
    Use:

    ```ts
    engine.block.generateAudioThumbnailSequence(
      blockId, 
      samplesPerChunk: number, 
      timeBegin: number, 
      timeEnd: number, 
      numberOfSamples: number, 
      numberOfChannels: number)

    ```

    This example generates 1 audio sample that:

    - Produces 3 chunks of this sample.
    - Start at second 8.
    - End at second 18.
    - Is stereo audio (1 for mono, 2 for stereo)

    > **Note:** `audioBlockId` must refer to an existing block.

    ```ts
    const audioThumbnail = engine.block.generateAudioThumbnailSequence(
      audioBlockId,
      3,   // samplesPerChunk
      8,   // timeBegin
      18,  // timeEnd
      1,   // numberOfSamples
      2,   // numberOfChannels
      // Return the result 
      (chunkIndex, result) => {
        if (result instanceof Error) {
        console.error('Thumbnail chunk failed', result);
        audioThumbnail();
        return;
        }
        console.log(`Chunk ${chunkIndex}`, result);
      }
    );

    ```

    Once generated, integrate the waveform into your UI.
  </TabItem>
</Tabs>

## Next Steps

For each feature’s detailed instructions and options:

- Explore the [CE.SDK API options](./api-reference/overview.md).
- Check the dedicated guides in the audio section.



---

## Related Pages

- [Add Sound Effects](./create-audio/audio/add-sound-effects.md) - Learn how to use buffers with arbitrary data to generate sound effects programmatically
- [Add Music](./create-audio/audio/add-music.md) - Add background music and audio tracks to video projects using CE.SDK's audio block system.
- [Adjust Audio Volume](./create-video/audio/adjust-volume.md) - Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.
- [Adjust Audio Playback Speed](./create-video/audio/adjust-speed.md) - Learn how to adjust audio playback speed in CE.SDK to create slow-motion, time-stretched, and fast-forward audio effects.
- [Loop Audio](./create-audio/audio/loop.md) - Create seamless repeating audio playback for background music and sound effects using CE.SDK's audio looping system.


---

## More Resources

- **[Next.js Documentation Index](https://img.ly/nextjs.md)** - Browse all Next.js documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./nextjs.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support