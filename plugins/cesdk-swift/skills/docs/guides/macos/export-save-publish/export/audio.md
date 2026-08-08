> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Export Media Assets](../export.md) > [For Audio Processing](./audio.md)

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

```swift
let page = try engine.scene.getCurrentPage()

let audioData = try await engine.block.exportAudio(
    page,
    mimeType: .wav,
    sampleRate: 48000,
    numberOfChannels: 2
)

print("Exported \(audioData.count) bytes")
```

### Export Options

Configure your audio export with these parameters:

- **`mimeType`** - `.wav` (uncompressed) or `.mp4` (compressed AAC)
- **`sampleRate`** - Audio quality in Hz (default: 48000)
- **`numberOfChannels`** - 1 for mono or 2 for stereo
- **`timeOffset`** - Start time in seconds (default: 0.0)
- **`duration`** - Length to export in seconds (0.0 = entire duration)
- **`onProgress`** - Callback receiving `(rendered, encoded, total)` for progress tracking

## Find Audio Sources

To find blocks with audio in your scene:

```swift
// Find audio blocks
let audioBlocks = try engine.block.findByType(.audio)

// Find video fills with audio
let videoFills = try engine.block.findByType(.videoFill)
let videosWithAudio = videoFills.filter { block in
    do {
        return try !engine.block.getAudioInfoFromVideo(block).isEmpty
    } catch {
        return false
    }
}
```

## Working with Multi-Track Video Audio

Videos can contain multiple audio tracks (e.g., different languages). CE.SDK provides APIs to inspect and extract specific tracks.

### Check audio track count

```swift
guard let videoFillId = try engine.block.findByType(.videoFill).first else {
    throw AudioExportError.noVideoFound
}

let trackCount = try engine.block.getAudioTrackCountFromVideo(videoFillId)
print("Video has \(trackCount) audio track(s)")
```

### Get track information

```swift
let audioTracks = try engine.block.getAudioInfoFromVideo(videoFillId)

for (index, track) in audioTracks.enumerated() {
    print("""
        Track \(index):
        - Channels: \(track.channels)      // 1=mono, 2=stereo
        - Sample Rate: \(track.sampleRate) Hz
        - Language: \(track.language ?? "unknown")
        - Label: \(track.label ?? "Track \(index)")
        """)
}
```

### Extract a specific track

```swift
// Create audio block from track 0 (first track)
let audioBlockId = try engine.block.createAudioFromVideo(videoFillId, trackIndex: 0)

// Export just this track's audio
let trackAudioData = try await engine.block.exportAudio(
    audioBlockId,
    mimeType: .wav,
    sampleRate: 48000,
    numberOfChannels: 2
)
```

### Extract all tracks

```swift
// Create audio blocks for all tracks
let audioBlockIds = try engine.block.createAudiosFromVideo(videoFillId)

// Export each track
for (i, audioBlockId) in audioBlockIds.enumerated() {
    let trackData = try await engine.block.exportAudio(audioBlockId, mimeType: .wav)
    print("Track \(i): \(trackData.count) bytes")
}
```

## Complete Workflow: Audio to Captions

A common workflow is to export audio, send it to a transcription service, and use the returned captions in your scene.

### Step 1: Export Audio

```swift
let page = try engine.scene.getCurrentPage()

let audioData = try await engine.block.exportAudio(
    page,
    mimeType: .wav,
    sampleRate: 48000,
    numberOfChannels: 2
)
```

### Step 2: Send to Transcription Service

Send the audio to a service that returns SubRip (SRT) format captions:

Provide the endpoint and authorization header through your app's configuration. Point the endpoint at an app-owned backend or proxy, and keep third-party service credentials out of the client.

```swift
func transcribeAudio(
    _ audioData: Data,
    endpoint: URL,
    authorizationHeader: String
) async throws -> String {
    let boundary = UUID().uuidString
    var body = Data()

    // Add audio file
    body.append("--\(boundary)\r\n")
    body.append("Content-Disposition: form-data; name=\"audio\"; filename=\"audio.wav\"\r\n")
    body.append("Content-Type: audio/wav\r\n\r\n")
    body.append(audioData)
    body.append("\r\n")

    // Add format parameter
    body.append("--\(boundary)\r\n")
    body.append("Content-Disposition: form-data; name=\"format\"\r\n\r\n")
    body.append("srt")
    body.append("\r\n--\(boundary)--\r\n")

    var request = URLRequest(url: endpoint)
    request.httpMethod = "POST"
    request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
    request.setValue(authorizationHeader, forHTTPHeaderField: "Authorization")
    request.httpBody = body

    let (data, _) = try await URLSession.shared.data(for: request)
    return String(data: data, encoding: .utf8) ?? ""
}

extension Data {
    mutating func append(_ string: String) {
        if let data = string.data(using: .utf8) {
            append(data)
        }
    }
}

let srtContent = try await transcribeAudio(
    audioData,
    endpoint: transcriptionEndpoint,
    authorizationHeader: transcriptionAuthorizationHeader
)
```

### Step 3: Import Captions from SRT

Use the built-in API to create caption blocks from the SRT response:

```swift
import Foundation

// Save SRT to temporary file
let tempDir = FileManager.default.temporaryDirectory
let tempFile = tempDir.appendingPathComponent("captions.srt")
try srtContent.write(to: tempFile, atomically: true, encoding: .utf8)

// Import captions from file URL
let captions = try await engine.block.createCaptionsFromURI(tempFile.absoluteString)

// Clean up temporary file
try FileManager.default.removeItem(at: tempFile)

// Add captions to page
let page = try engine.scene.getCurrentPage()
let captionTrack = try engine.block.create(.captionTrack)

for caption in captions {
    try engine.block.appendChild(to: captionTrack, child: caption)
}

try engine.block.appendChild(to: page, child: captionTrack)

// Center the first caption as a reference point
try engine.block.alignHorizontally([captions[0]], alignment: .center)
try engine.block.alignVertically([captions[0]], alignment: .center)
```

### Other Processing Services

Audio export also supports these workflows:

- **Audio enhancement** - Noise removal, normalization
- **Music analysis** - Tempo, key, beat detection
- **Language detection** - Identify spoken language
- **Speaker diarization** - Identify who spoke when

## Next Steps

Now that you understand audio export, explore related audio and video features in the [Create Video guides](../../create-video.md).



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support