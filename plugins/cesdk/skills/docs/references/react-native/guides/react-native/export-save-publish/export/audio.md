> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Export Media Assets](https://img.ly/docs/cesdk/react-native/export-save-publish/export-82f968/) > [For Audio Processing](./audio.md)

---

Export audio from pages, video blocks, audio blocks, and tracks to WAV or MP4 format for external processing, transcription, or analysis.

The `exportAudio` API allows you to extract audio from any block that contains audio content. This is particularly useful when integrating with external audio processing services like speech-to-text transcription, audio enhancement, or music analysis platforms.

Audio can be exported from multiple block types:

- **Page blocks** - Export the complete mixed audio timeline
- **Video blocks** - Extract audio tracks from videos
- **Audio blocks** - Export standalone audio content
- **Track blocks** - Export audio from specific timeline tracks

## Export Audio

Export audio from any block using the `exportAudio` API:

```typescript
const page = engine.scene.getCurrentPage();

const audioBlob = await engine.block.exportAudio(page, {
  mimeType: 'audio/wav',
  sampleRate: 48000,
  numberOfChannels: 2
});

console.log(`Exported ${audioBlob.size} bytes`);
```

### Export Options

Configure your audio export with these options:

- **`mimeType`** - `'audio/wav'` (uncompressed) or `'audio/mp4'` (compressed AAC)
- **`sampleRate`** - Audio quality in Hz (default: 48000)
- **`numberOfChannels`** - 1 for mono or 2 for stereo
- **`timeOffset`** - Start time in seconds (default: 0)
- **`duration`** - Length to export in seconds (0 = entire duration)
- **`onProgress`** - Callback receiving `(rendered, encoded, total)` for progress tracking

## Find Audio Sources

To find blocks with audio in your scene:

```typescript
// Find audio blocks
const audioBlocks = engine.block.findByType('audio');

// Find video blocks with audio
const videoFills = engine.block.findByType('//ly.img.ubq/fill/video');
const videosWithAudio = videoFills.filter(block => {
  try {
    return engine.block.getAudioInfoFromVideo(block).length > 0;
  } catch {
    return false;
  }
});
```

## Working with Multi-Track Video Audio

Videos can contain multiple audio tracks (e.g., different languages). CE.SDK provides APIs to inspect and extract specific tracks.

### Check audio track count

```typescript
const videoFillId = engine.block.findByType('//ly.img.ubq/fill/video')[0];

const trackCount = engine.block.getAudioTrackCountFromVideo(videoFillId);
console.log(`Video has ${trackCount} audio track(s)`);
```

### Get track information

```typescript
const audioTracks = engine.block.getAudioInfoFromVideo(videoFillId);

audioTracks.forEach((track, index) => {
  console.log(`Track ${index}:`, {
    channels: track.channels,
    sampleRate: track.sampleRate,
    language: track.language || 'unknown',
    label: track.label || `Track ${index}`
  });
});
```

### Extract a specific track

```typescript
// Create audio block from track 0 (first track)
const audioBlockId = engine.block.createAudioFromVideo(videoFillId, 0);

// Export just this track's audio
const trackAudioBlob = await engine.block.exportAudio(audioBlockId, {
  mimeType: 'audio/wav'
});
```

### Extract all tracks

```typescript
// Create audio blocks for all tracks
const audioBlockIds = engine.block.createAudiosFromVideo(videoFillId);

// Export each track
for (let i = 0; i < audioBlockIds.length; i++) {
  const trackBlob = await engine.block.exportAudio(audioBlockIds[i]);
  console.log(`Track ${i}: ${trackBlob.size} bytes`);
}
```

## Complete Workflow: Audio to Captions

A common workflow is to export audio, send it to a transcription service, and use the returned captions in your scene.

### Step 1: Export Audio

```typescript
const page = engine.scene.getCurrentPage();

const audioBlob = await engine.block.exportAudio(page, {
  mimeType: 'audio/wav',
  sampleRate: 48000,
  numberOfChannels: 2
});
```

### Step 2: Send to Transcription Service

Send the audio to a service that returns SubRip (SRT) format captions:

```typescript
async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'audio.wav');
  formData.append('format', 'srt');

  const response = await fetch('https://api.transcription-service.com/transcribe', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: formData
  });

  // Returns SRT format text
  return await response.text();
}

const srtContent = await transcribeAudio(audioBlob);
```

### Step 3: Import Captions from SRT

Use the built-in API to create caption blocks from the SRT response:

```typescript
// Create a file from the SRT text
const srtFile = new File([srtContent], 'captions.srt', {
  type: 'application/x-subrip'
});

// Create object URL and import captions
const uri = URL.createObjectURL(srtFile);
const captions = await engine.block.createCaptionsFromURI(uri);
URL.revokeObjectURL(uri);

// Add captions to page
const page = engine.scene.getCurrentPage();
const captionTrack = engine.block.create('//ly.img.ubq/captionTrack');

captions.forEach(caption => {
  engine.block.appendChild(captionTrack, caption);
});

engine.block.appendChild(page, captionTrack);

// Center the first caption as a reference point
engine.block.alignHorizontally([captions[0]], 'Center');
engine.block.alignVertically([captions[0]], 'Center');
```

### Other Processing Services

Audio export also supports these workflows:

- **Audio enhancement** - Noise removal, normalization
- **Music analysis** - Tempo, key, beat detection
- **Language detection** - Identify spoken language
- **Speaker diarization** - Identify who spoke when



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support