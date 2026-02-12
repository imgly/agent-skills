> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Audio](./create-audio/audio.md) > [Add Music](./create-audio/audio/add-music.md)

---

Add background music and audio tracks to video projects using CE.SDK's audio
block system for rich multimedia experiences.

![Add Music example showing audio tracks in the timeline](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-add-music-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-audio-add-music-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-audio-add-music-browser/)

Audio blocks are standalone timeline elements that play alongside video content, independent of video fills. You can add music from the built-in asset library or from custom URLs, position tracks on the timeline, configure volume levels, and layer multiple audio tracks for complex soundscapes.

```typescript file=@cesdk_web_examples/guides-create-audio-add-music-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Add Music Guide
 *
 * Demonstrates adding background music to video projects:
 * - Creating audio blocks programmatically
 * - Setting audio source URIs
 * - Configuring timeline position and duration
 * - Adjusting audio volume
 * - Querying audio assets from the library
 * - Managing audio blocks
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Video mode for audio support
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Video',
      withUploadAssetSources: true
    });
    await cesdk.createVideoScene();

    const engine = cesdk.engine;
    const page = engine.scene.getCurrentPage();
    if (!page) {
      throw new Error('No page found in scene');
    }

    // Set page dimensions for video (16:9)
    engine.block.setWidth(page, 1920);
    engine.block.setHeight(page, 1080);

    // Set page duration for timeline
    engine.block.setDuration(page, 30);

    // Enable audio and timeline features for the UI
    cesdk.feature.enable('ly.img.video.timeline');
    cesdk.feature.enable('ly.img.video.audio');
    cesdk.feature.enable('ly.img.video.controls.playback');

    // Create an audio block for background music
    const audioBlock = engine.block.create('audio');

    // Set the audio source file
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Append audio to the page (makes it part of the timeline)
    engine.block.appendChild(page, audioBlock);

    // Wait for audio to load to get duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total duration of the audio file
    const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
    console.log('Audio total duration:', totalDuration, 'seconds');

    // Set when the audio starts on the timeline (0 = beginning)
    engine.block.setTimeOffset(audioBlock, 0);

    // Set how long the audio plays (use full duration or page duration)
    const playbackDuration = Math.min(totalDuration, 30);
    engine.block.setDuration(audioBlock, playbackDuration);

    // Set the audio volume (0.0 = mute, 1.0 = full volume)
    engine.block.setVolume(audioBlock, 0.8);

    // Get current volume
    const currentVolume = engine.block.getVolume(audioBlock);
    console.log('Audio volume:', currentVolume);

    // Query available audio tracks from the asset library
    const audioAssets = await engine.asset.findAssets('ly.img.audio', {
      page: 0,
      perPage: 10
    });

    console.log('Available audio assets:', audioAssets.assets.length);

    // Log metadata for each audio asset
    audioAssets.assets.forEach((asset) => {
      console.log('Audio asset:', {
        id: asset.id,
        label: asset.label,
        duration: asset.meta?.duration,
        uri: asset.meta?.uri
      });
    });

    // Find all audio blocks in the scene
    const allAudioBlocks = engine.block.findByType('audio');
    console.log('Total audio blocks:', allAudioBlocks.length);

    // Get information about each audio block
    allAudioBlocks.forEach((block, index) => {
      const uri = engine.block.getString(block, 'audio/fileURI');
      const timeOffset = engine.block.getTimeOffset(block);
      const duration = engine.block.getDuration(block);
      const volume = engine.block.getVolume(block);

      console.log(`Audio block ${index + 1}:`, {
        uri: uri.split('/').pop(), // Just filename
        timeOffset: `${timeOffset}s`,
        duration: `${duration}s`,
        volume: `${(volume * 100).toFixed(0)}%`
      });
    });

    // Example: Remove the second audio block if it exists
    if (allAudioBlocks.length > 1) {
      const blockToRemove = allAudioBlocks[1];

      // Destroy the block to remove it and free resources
      engine.block.destroy(blockToRemove);

      console.log('Removed second audio block');
    }

    console.log(
      'Add Music guide initialized. Open the timeline to see audio tracks.'
    );
  }
}

export default Example;
```

This guide covers how to add music using the built-in audio UI and how to create and configure audio blocks programmatically using the Block API.

## Using the Built-in Audio UI

### Enable Audio Features

Audio blocks require Video mode with timeline support. Enable the audio and timeline features to give users access to audio capabilities through the UI.

```typescript highlight-enable-audio-features
// Enable audio and timeline features for the UI
cesdk.feature.enable('ly.img.video.timeline');
cesdk.feature.enable('ly.img.video.audio');
cesdk.feature.enable('ly.img.video.controls.playback');
```

These features control:

- `ly.img.video.timeline` - Shows the timeline for positioning audio tracks
- `ly.img.video.audio` - Enables the audio library in the dock
- `ly.img.video.controls.playback` - Adds playback controls for previewing audio

### User Workflow

With audio features enabled, users can add music through the interface:

1. **Open the dock** - Access the asset library panel
2. **Select audio category** - Browse available music tracks
3. **Preview tracks** - Listen to audio before adding
4. **Drag to timeline** - Add audio to the project
5. **Position on timeline** - Adjust when audio starts and ends
6. **Adjust volume** - Use the inspector to set volume levels

## Programmatic Audio Creation

### Create Audio Block

We create audio blocks using `engine.block.create('audio')` and set the source file using the `audio/fileURI` property. The audio block must be appended to a page to become part of the timeline.

```typescript highlight-create-audio-block
    // Create an audio block for background music
    const audioBlock = engine.block.create('audio');

    // Set the audio source file
    const audioUri =
      'https://cdn.img.ly/assets/demo/v3/ly.img.audio/audios/far_from_home.m4a';
    engine.block.setString(audioBlock, 'audio/fileURI', audioUri);

    // Append audio to the page (makes it part of the timeline)
    engine.block.appendChild(page, audioBlock);
```

Audio blocks support common formats including M4A, MP3, and WAV. The source URI can point to any accessible URL or local file.

### Configure Timeline Position

Audio blocks have timeline properties that control when and how long they play. We use `setTimeOffset()` to set the start time and `setDuration()` to control playback length.

```typescript highlight-configure-timeline
    // Wait for audio to load to get duration
    await engine.block.forceLoadAVResource(audioBlock);

    // Get the total duration of the audio file
    const totalDuration = engine.block.getAVResourceTotalDuration(audioBlock);
    console.log('Audio total duration:', totalDuration, 'seconds');

    // Set when the audio starts on the timeline (0 = beginning)
    engine.block.setTimeOffset(audioBlock, 0);

    // Set how long the audio plays (use full duration or page duration)
    const playbackDuration = Math.min(totalDuration, 30);
    engine.block.setDuration(audioBlock, playbackDuration);
```

The `forceLoadAVResource()` method ensures the audio file is loaded before we access its duration. This is important when you need to know the total length of the audio file for timeline calculations.

### Configure Volume

Volume is set using `setVolume()` with values from 0.0 (mute) to 1.0 (full volume). This volume level is applied during export and affects the final rendered output.

```typescript highlight-configure-volume
    // Set the audio volume (0.0 = mute, 1.0 = full volume)
    engine.block.setVolume(audioBlock, 0.8);

    // Get current volume
    const currentVolume = engine.block.getVolume(audioBlock);
    console.log('Audio volume:', currentVolume);
```

## Working with Audio Assets

### Query Audio Library

CE.SDK provides a demo audio library that you can query using the Asset API. This allows you to build custom audio selection interfaces or programmatically add tracks based on metadata.

```typescript highlight-query-audio-assets
    // Query available audio tracks from the asset library
    const audioAssets = await engine.asset.findAssets('ly.img.audio', {
      page: 0,
      perPage: 10
    });

    console.log('Available audio assets:', audioAssets.assets.length);

    // Log metadata for each audio asset
    audioAssets.assets.forEach((asset) => {
      console.log('Audio asset:', {
        id: asset.id,
        label: asset.label,
        duration: asset.meta?.duration,
        uri: asset.meta?.uri
      });
    });
```

Each asset includes metadata such as duration, file URI, and thumbnail URL, which you can use to display track information or make programmatic selections.

## Managing Audio Blocks

### List Audio Blocks

Use `findByType('audio')` to retrieve all audio blocks in the scene. This is useful for building audio management interfaces or batch operations.

```typescript highlight-list-audio-blocks
    // Find all audio blocks in the scene
    const allAudioBlocks = engine.block.findByType('audio');
    console.log('Total audio blocks:', allAudioBlocks.length);

    // Get information about each audio block
    allAudioBlocks.forEach((block, index) => {
      const uri = engine.block.getString(block, 'audio/fileURI');
      const timeOffset = engine.block.getTimeOffset(block);
      const duration = engine.block.getDuration(block);
      const volume = engine.block.getVolume(block);

      console.log(`Audio block ${index + 1}:`, {
        uri: uri.split('/').pop(), // Just filename
        timeOffset: `${timeOffset}s`,
        duration: `${duration}s`,
        volume: `${(volume * 100).toFixed(0)}%`
      });
    });
```

### Remove Audio

To remove an audio block, call `destroy()` which removes it from the scene and frees its resources.

```typescript highlight-remove-audio
    // Example: Remove the second audio block if it exists
    if (allAudioBlocks.length > 1) {
      const blockToRemove = allAudioBlocks[1];

      // Destroy the block to remove it and free resources
      engine.block.destroy(blockToRemove);

      console.log('Removed second audio block');
    }
```

Always destroy blocks that are no longer needed to prevent memory leaks, especially when working with multiple audio files.

## API Reference

| Method                                | Description                                |
| ------------------------------------- | ------------------------------------------ |
| `feature.enable('ly.img.video.timeline')` | Show timeline for audio positioning    |
| `feature.enable('ly.img.video.audio')`    | Enable audio library in dock           |
| `feature.enable('ly.img.video.controls.playback')` | Add playback controls       |
| `block.create('audio')`               | Create a new audio block                   |
| `block.setString(id, 'audio/fileURI', uri)` | Set the audio source file            |
| `block.setTimeOffset(id, seconds)`    | Set when audio starts on timeline          |
| `block.setDuration(id, seconds)`      | Set audio playback duration                |
| `block.setVolume(id, volume)`         | Set volume (0.0 to 1.0)                    |
| `block.getVolume(id)`                 | Get current volume level                   |
| `block.getAVResourceTotalDuration(id)`| Get total audio file duration              |
| `block.forceLoadAVResource(id)`       | Force load audio resource                  |
| `block.findByType('audio')`           | Find all audio blocks in scene             |
| `asset.findAssets(sourceId, query)`   | Query audio assets                         |



---

## More Resources

- **[Electron Documentation Index](https://img.ly/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support