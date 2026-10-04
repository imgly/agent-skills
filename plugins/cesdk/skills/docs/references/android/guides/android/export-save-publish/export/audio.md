> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [For Audio Processing](./audio.md)

---

Export audio from pages, video blocks, audio blocks, and tracks to WAV or MP4
format for external processing, transcription, or analysis.

The `exportAudio` API allows you to extract audio from any block that contains audio content. This is particularly useful when integrating with external audio processing services like speech-to-text transcription, audio enhancement, or music analysis platforms.

Audio can be exported from multiple block types:

- **Page blocks** - Export the complete mixed audio timeline
- **Video blocks** - Extract audio tracks from videos
- **Audio blocks** - Export standalone audio content
- **Track blocks** - Export audio from specific timeline tracks

## Export Audio

Export audio from any block using the `exportAudio` API:

```kotlin
val page = engine.scene.getCurrentPage()

val audioData = engine.block.exportAudio(
    page,
    MimeType.AUDIO_WAV,
    48000,
    2
)

Log.d("AudioExport", "Exported ${audioData.size} bytes")
```

### Export Options

Configure your audio export with these parameters:

- **`mimeType`** - `MimeType.AUDIO_WAV` (uncompressed) or `MimeType.AUDIO_MP4` (compressed AAC)
- **`sampleRate`** - Audio quality in Hz (default: 48000)
- **`numberOfChannels`** - 1 for mono or 2 for stereo
- **`timeOffset`** - Start time in seconds (default: 0f)
- **`duration`** - Length to export in seconds (0f = entire duration)
- **`onProgress`** - Callback receiving `(rendered, encoded, total)` for progress tracking

## Find Audio Sources

To find blocks with audio in your scene:

```kotlin
// Find audio blocks
val audioBlocks = engine.block.findByType(BlockType.Audio)

// Find video fills with audio
val videoFills = engine.block.findByType(BlockType.VideoFill)
val videosWithAudio = videoFills.filter { block ->
    try {
        engine.block.getAudioInfoFromVideo(block).isNotEmpty()
    } catch (e: Exception) {
        false
    }
}
```

## Working with Multi-Track Video Audio

Videos can contain multiple audio tracks (e.g., different languages). CE.SDK provides APIs to inspect and extract specific tracks.

### Check audio track count

```kotlin
val videoFillId = engine.block.findByType(BlockType.VideoFill).first()

val trackCount = engine.block.getAudioTrackCountFromVideo(videoFillId)
Log.d("AudioExport", "Video has $trackCount audio track(s)")
```

### Get track information

```kotlin
val audioTracks = engine.block.getAudioInfoFromVideo(videoFillId)

audioTracks.forEachIndexed { index, track ->
    Log.d("AudioExport", """
        Track $index:
        - Channels: ${track.channels}      // 1=mono, 2=stereo
        - Sample Rate: ${track.sampleRate} Hz
        - Language: ${track.language ?: "unknown"}
        - Label: ${track.label ?: "Track $index"}
    """.trimIndent())
}
```

### Extract a specific track

```kotlin
// Create audio block from track 0 (first track)
val audioBlockId = engine.block.createAudioFromVideo(videoFillId, 0)

// Export just this track's audio
val trackAudioData = engine.block.exportAudio(
    audioBlockId,
    MimeType.AUDIO_WAV,
    48000,
    2
)
```

### Extract all tracks

```kotlin
// Create audio blocks for all tracks
val audioBlockIds = engine.block.createAudiosFromVideo(videoFillId)

// Export each track
audioBlockIds.forEachIndexed { i, audioBlockId ->
    val trackData = engine.block.exportAudio(audioBlockId, MimeType.AUDIO_WAV)
    Log.d("AudioExport", "Track $i: ${trackData.size} bytes")
}
```

## Complete Workflow: Audio to Captions

A common workflow is to export audio, send it to a transcription service, and use the returned captions in your scene.

### Step 1: Export Audio

```kotlin
val page = engine.scene.getCurrentPage()

val audioData = engine.block.exportAudio(
    page,
    MimeType.AUDIO_WAV,
    48000,
    2
)
```

### Step 2: Send to Transcription Service

Send the audio to a service that returns SubRip (SRT) format captions:

Provide `transcriptionEndpoint` and `transcriptionAuthorizationHeader` from your app's configuration. Point the endpoint at an app-owned backend or proxy, and keep third-party service credentials out of the Android client.

```kotlin
suspend fun transcribeAudio(
    audioData: ByteArray,
    transcriptionEndpoint: String,
    authorizationHeader: String,
): String = withContext(Dispatchers.IO) {
    val client = OkHttpClient()

    val requestBody = MultipartBody.Builder()
        .setType(MultipartBody.FORM)
        .addFormDataPart(
            "audio",
            "audio.wav",
            audioData.toRequestBody("audio/wav".toMediaType())
        )
        .addFormDataPart("format", "srt")
        .build()

    val request = Request.Builder()
        .url(transcriptionEndpoint)
        .addHeader("Authorization", authorizationHeader)
        .post(requestBody)
        .build()

    val response = client.newCall(request).execute()
    response.body?.string() ?: throw Exception("Empty response")
}

val srtContent = transcribeAudio(
    audioData = audioData,
    transcriptionEndpoint = transcriptionEndpoint,
    authorizationHeader = transcriptionAuthorizationHeader,
)
```

### Step 3: Import Captions from SRT

Use the built-in API to create caption blocks from the SRT response:

```kotlin
import java.io.File

// Save SRT to temporary file
val tempFile = File.createTempFile("captions", ".srt")
tempFile.writeText(srtContent)

// Import captions from file URI
val uri = tempFile.toURI().toString()
val captions = engine.block.createCaptionsFromURI(uri)

// Clean up temporary file
tempFile.delete()

// Add captions to page
val page = engine.scene.getCurrentPage()
val captionTrack = engine.block.create(DesignBlockType.CaptionTrack)

captions.forEach { caption ->
    engine.block.appendChild(captionTrack, caption)
}

engine.block.appendChild(page, captionTrack)

// Center the first caption as a reference point
engine.block.alignHorizontally(listOf(captions[0]), HorizontalBlockAlignment.Center)
engine.block.alignVertically(listOf(captions[0]), VerticalBlockAlignment.Center)
```

### Other Processing Services

Audio export also supports these workflows:

- **Audio enhancement** - Noise removal, normalization
- **Music analysis** - Tempo, key, beat detection
- **Language detection** - Identify spoken language
- **Speaker diarization** - Identify who spoke when

## Next Steps

- [To MP4](./to-mp4.md) — Export video compositions as MP4 files with configurable
  encoding options, progress tracking, and resolution control.
- [Add Captions](../../edit-video/add-captions.md) — Add synchronized captions to video scenes
  and import subtitle files.
- [Control Audio and Video](../../create-video/control.md) — Play, pause, seek, and preview
  audio and video content programmatically.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support