> This is one page of the CE.SDK Flutter documentation. For a complete overview, see the [Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/flutter/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/flutter/guides-8d8b00/) > [Export Media Assets](https://img.ly/docs/cesdk/flutter/export-save-publish/export-82f968/) > [For Audio Processing](./audio.md)

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

```dart
final page = engine.scene.getCurrentPage();

final audioData = await engine.block.exportAudio(
  page!,
  mimeType: MimeType.audioWav,
  sampleRate: 48000,
  numberOfChannels: 2,
);

print('Exported ${audioData.length} bytes');
```

### Export Options

Configure your audio export with these parameters:

- **`mimeType`** - `MimeType.audioWav` (uncompressed) or `MimeType.audioMp4` (compressed AAC)
- **`sampleRate`** - Audio quality in Hz (default: 48000)
- **`numberOfChannels`** - 1 for mono or 2 for stereo
- **`timeOffset`** - Start time in seconds (default: 0.0)
- **`duration`** - Length to export in seconds (0.0 = entire duration)
- **`onProgress`** - Callback receiving `(rendered, encoded, total)` for progress tracking

## Find Audio Sources

To find blocks with audio in your scene:

```dart
// Find audio blocks
final audioBlocks = engine.block.findByType(BlockType.audio);

// Find video fills with audio
final videoFills = engine.block.findByType(BlockType.videoFill);
final videosWithAudio = videoFills.where((block) {
  try {
    return engine.block.getAudioInfoFromVideo(block).isNotEmpty;
  } catch (e) {
    return false;
  }
}).toList();
```

## Working with Multi-Track Video Audio

Videos can contain multiple audio tracks (e.g., different languages). CE.SDK provides APIs to inspect and extract specific tracks.

### Check audio track count

```dart
final videoFillId = engine.block.findByType(BlockType.videoFill).first;

final trackCount = engine.block.getAudioTrackCountFromVideo(videoFillId);
print('Video has $trackCount audio track(s)');
```

### Get track information

```dart
final audioTracks = engine.block.getAudioInfoFromVideo(videoFillId);

for (var i = 0; i < audioTracks.length; i++) {
  final track = audioTracks[i];
  print('Track $i: ${track.channels} channels, ${track.sampleRate} Hz, ${track.language ?? "unknown"}');
}
```

### Extract a specific track

```dart
// Create audio block from track 0 (first track)
final audioBlockId = engine.block.createAudioFromVideo(videoFillId, trackIndex: 0);

// Export just this track's audio
final trackAudio = await engine.block.exportAudio(audioBlockId);
```

### Extract all tracks

```dart
// Create audio blocks for all tracks
final audioBlockIds = engine.block.createAudiosFromVideo(videoFillId);

// Export each track
for (var i = 0; i < audioBlockIds.length; i++) {
  final audioData = await engine.block.exportAudio(audioBlockIds[i]);
  print('Track $i: ${audioData.length} bytes');
}
```

## Complete Workflow: Audio to Captions

A common workflow is to export audio, send it to a transcription service, and use the returned captions in your scene.

### Step 1: Export Audio

```dart
final page = engine.scene.getCurrentPage();

final audioData = await engine.block.exportAudio(
  page!,
  mimeType: MimeType.audioWav,
  sampleRate: 48000,
  numberOfChannels: 2,
);
```

### Step 2: Send to Transcription Service

Send the audio to a service that returns SubRip (SRT) format captions:

```dart
import 'package:http/http.dart' as http;

Future<String> transcribeAudio(Uint8List audioData) async {
  final request = http.MultipartRequest(
    'POST',
    Uri.parse('https://api.transcription-service.com/transcribe'),
  );

  request.headers['Authorization'] = 'Bearer YOUR_API_KEY';

  request.files.add(http.MultipartFile.fromBytes(
    'audio',
    audioData,
    filename: 'audio.wav',
  ));

  request.fields['format'] = 'srt';

  final response = await request.send();
  return await response.stream.bytesToString();
}

final srtContent = await transcribeAudio(audioData);
```

### Step 3: Import Captions from SRT

Use the built-in API to create caption blocks from the SRT response:

```dart
import 'dart:io';
import 'package:path/path.dart' as path;

// Save SRT to temporary file
final tempDir = Directory.systemTemp;
final tempFile = File(path.join(tempDir.path, 'captions.srt'));
await tempFile.writeAsString(srtContent);

// Import captions from file URI
final uri = tempFile.uri.toString();
final captions = await engine.block.createCaptionsFromURI(uri);

// Clean up temporary file
await tempFile.delete();

// Add captions to page
final page = engine.scene.getCurrentPage();
final captionTrack = engine.block.create(DesignBlockType.captionTrack);

for (final caption in captions) {
  engine.block.appendChild(captionTrack, caption);
}

engine.block.appendChild(page!, captionTrack);

// Center the first caption as a reference point
engine.block.alignHorizontally([captions[0]], HorizontalBlockAlignment.center);
engine.block.alignVertically([captions[0]], VerticalBlockAlignment.center);
```

### Other Processing Services

Audio export also supports these workflows:

- **Audio enhancement** - Noise removal, normalization
- **Music analysis** - Tempo, key, beat detection
- **Language detection** - Identify spoken language
- **Speaker diarization** - Identify who spoke when



---

## More Resources

- **[Flutter Documentation Index](https://img.ly/docs/cesdk/flutter/)** - Browse all Flutter documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/flutter/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/flutter/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support