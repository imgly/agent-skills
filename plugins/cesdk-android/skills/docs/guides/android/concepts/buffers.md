> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Buffers](./buffers.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-buffers/Buffers.kt reference-only
import android.net.Uri
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.PI
import kotlin.math.sin

suspend fun buffers(engine: Engine) = withContext(engine.dispatcher) {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1080F)
    engine.block.setHeight(page, value = 1920F)
    engine.block.setDuration(page, duration = 2.0)

    val bufferUri = engine.editor.createBuffer()

    try {
        val sampleRate = 44_100
        val durationSeconds = 2
        val frequencyHz = 440.0
        val numChannels = 2
        val samplesPerChannel = sampleRate * durationSeconds
        val sampleCount = samplesPerChannel * numChannels
        val samples = FloatArray(sampleCount)

        for (sampleIndex in 0 until samplesPerChannel) {
            val time = sampleIndex / sampleRate.toDouble()
            val sampleValue = (sin(2 * PI * frequencyHz * time) * 0.5).toFloat()
            val bufferIndex = sampleIndex * numChannels
            samples[bufferIndex] = sampleValue
            samples[bufferIndex + 1] = sampleValue
        }

        val bytesPerSample = 2
        val wavDataSize = sampleCount * bytesPerSample
        val wavFileSize = 44 + wavDataSize
        val wavData = ByteBuffer.allocateDirect(wavFileSize).order(ByteOrder.LITTLE_ENDIAN)

        "RIFF".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(wavFileSize - 8)
        "WAVE".forEach { wavData.put(it.code.toByte()) }
        "fmt ".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(16)
        wavData.putShort(1.toShort())
        wavData.putShort(numChannels.toShort())
        wavData.putInt(sampleRate)
        wavData.putInt(sampleRate * numChannels * bytesPerSample)
        wavData.putShort((numChannels * bytesPerSample).toShort())
        wavData.putShort((bytesPerSample * 8).toShort())
        "data".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(wavDataSize)

        for (sample in samples) {
            val clampedSample = sample.coerceIn(-1F, 1F)
            val pcmScale = if (clampedSample < 0F) 32768F else Short.MAX_VALUE.toFloat()
            val pcmSample = clampedSample * pcmScale
            wavData.putShort(pcmSample.toInt().toShort())
        }

        wavData.flip()
        engine.editor.setBufferData(uri = bufferUri, offset = 0, data = wavData)

        val header = engine.editor.getBufferData(uri = bufferUri, offset = 0, length = 44)
        val riff = buildString {
            repeat(4) { append(header.get().toInt().toChar()) }
        }
        check(riff == "RIFF")

        val bufferLength = engine.editor.getBufferLength(uri = bufferUri)
        check(bufferLength == wavFileSize)

        val demoBuffer = engine.editor.createBuffer()
        try {
            val demoData =
                ByteBuffer.allocateDirect(8).apply {
                    for (value in 1..8) put(value.toByte())
                    flip()
                }
            engine.editor.setBufferData(uri = demoBuffer, offset = 0, data = demoData)
            engine.editor.setBufferLength(uri = demoBuffer, length = 4)
            check(engine.editor.getBufferLength(uri = demoBuffer) == 4)
        } finally {
            engine.editor.destroyBuffer(uri = demoBuffer)
        }

        val audioBlock = engine.block.create(DesignBlockType.Audio)
        engine.block.setUri(block = audioBlock, property = "audio/fileURI", value = bufferUri)
        engine.block.setDuration(audioBlock, duration = durationSeconds.toDouble())
        engine.block.appendChild(parent = page, child = audioBlock)
        engine.block.forceLoadAVResource(audioBlock)

        val transientResources = engine.editor.findAllTransientResources()
        check(transientResources.any { (uri, size) -> uri == bufferUri && size == bufferLength })

        val relocatedUri = Uri.parse("https://cdn.example.com/audio/generated-tone.wav")
        val persistedData = engine.editor.getBufferData(uri = bufferUri, offset = 0, length = bufferLength)
        check(persistedData.remaining() == bufferLength)
        engine.editor.relocateResource(currentUri = bufferUri, relocatedUri = relocatedUri)
        check(engine.block.getUri(block = audioBlock, property = "audio/fileURI") == relocatedUri)
    } finally {
        engine.block.findByType(DesignBlockType.Audio)
            .filter(engine.block::isValid)
            .filter { audioBlock ->
                engine.block.getUri(audioBlock, property = "audio/fileURI") == bufferUri
            }
            .forEach(engine.block::destroy)
        engine.editor.destroyBuffer(uri = bufferUri)
    }
}
```

Store and manage temporary binary data directly in memory using CE.SDK's buffer API for dynamically generated content like procedural audio or streaming media.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/engine-guides-buffers)

<EngineReferenceNote {...props} />

Buffers are in-memory containers referenced via `buffer://` Uris. Unlike external files that require network or file I/O, buffers live only inside the current engine session. This makes them useful for generated audio, real-time image data, or any content you want to pass to blocks without writing it to disk first.

This guide covers how to create and destroy buffers, write and read bytes with Android's direct `ByteBuffer` API, assign a buffer to an audio block, and relocate transient resources before saving or exporting a scene.

## Setting Up a Video Scene

Audio blocks need a video scene and a page with a duration. The example creates a two-second 1080 x 1920 page so the generated audio has a timeline context.

```kotlin highlight-android-setup-video-scene
val scene = engine.scene.createForVideo()
val page = engine.block.create(DesignBlockType.Page)
engine.block.appendChild(parent = scene, child = page)
engine.block.setWidth(page, value = 1080F)
engine.block.setHeight(page, value = 1920F)
engine.block.setDuration(page, duration = 2.0)
```

## Creating and Managing Buffers

Use `engine.editor.createBuffer()` to allocate a buffer and get back its `buffer://` Uri. Buffers stay in memory until you explicitly destroy them with `engine.editor.destroyBuffer()` or stop the engine.

```kotlin highlight-android-create-buffer
val bufferUri = engine.editor.createBuffer()
```

## Writing Data to Buffers

On Android, `engine.editor.setBufferData()` requires a direct `ByteBuffer`, so the example builds the payload in `ByteBuffer.allocateDirect(...)`. It generates a 440 Hz stereo tone at 44.1 kHz for two seconds and wraps the samples in a WAV header so the audio block can load the buffer as a normal audio resource.

```kotlin highlight-android-generate-samples
        val sampleRate = 44_100
        val durationSeconds = 2
        val frequencyHz = 440.0
        val numChannels = 2
        val samplesPerChannel = sampleRate * durationSeconds
        val sampleCount = samplesPerChannel * numChannels
        val samples = FloatArray(sampleCount)

        for (sampleIndex in 0 until samplesPerChannel) {
            val time = sampleIndex / sampleRate.toDouble()
            val sampleValue = (sin(2 * PI * frequencyHz * time) * 0.5).toFloat()
            val bufferIndex = sampleIndex * numChannels
            samples[bufferIndex] = sampleValue
            samples[bufferIndex + 1] = sampleValue
        }
```

```kotlin highlight-android-write-buffer
        val bytesPerSample = 2
        val wavDataSize = sampleCount * bytesPerSample
        val wavFileSize = 44 + wavDataSize
        val wavData = ByteBuffer.allocateDirect(wavFileSize).order(ByteOrder.LITTLE_ENDIAN)

        "RIFF".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(wavFileSize - 8)
        "WAVE".forEach { wavData.put(it.code.toByte()) }
        "fmt ".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(16)
        wavData.putShort(1.toShort())
        wavData.putShort(numChannels.toShort())
        wavData.putInt(sampleRate)
        wavData.putInt(sampleRate * numChannels * bytesPerSample)
        wavData.putShort((numChannels * bytesPerSample).toShort())
        wavData.putShort((bytesPerSample * 8).toShort())
        "data".forEach { wavData.put(it.code.toByte()) }
        wavData.putInt(wavDataSize)

        for (sample in samples) {
            val clampedSample = sample.coerceIn(-1F, 1F)
            val pcmScale = if (clampedSample < 0F) 32768F else Short.MAX_VALUE.toFloat()
            val pcmSample = clampedSample * pcmScale
            wavData.putShort(pcmSample.toInt().toShort())
        }

        wavData.flip()
        engine.editor.setBufferData(uri = bufferUri, offset = 0, data = wavData)
```

The `offset` parameter is measured in bytes, which lets you append or overwrite specific regions of the buffer when you stream or update data incrementally.

## Reading Data from Buffers

Use `engine.editor.getBufferData()` to read any byte range back into another `ByteBuffer`. Here we read the first 44 bytes and verify the WAV `RIFF` header.

```kotlin highlight-android-read-buffer
val header = engine.editor.getBufferData(uri = bufferUri, offset = 0, length = 44)
val riff = buildString {
    repeat(4) { append(header.get().toInt().toChar()) }
}
check(riff == "RIFF")
```

## Querying Buffer Length

Use `engine.editor.getBufferLength()` to check how many bytes are currently stored in the buffer. This is useful before full reads or before relocating the data elsewhere.

```kotlin highlight-android-get-buffer-length
val bufferLength = engine.editor.getBufferLength(uri = bufferUri)
check(bufferLength == wavFileSize)
```

## Resizing Buffers

You can grow or shrink a buffer with `engine.editor.setBufferLength()`. The example uses a separate demo buffer so the audio payload stays intact while we demonstrate truncation.

```kotlin highlight-android-resize-buffer
val demoBuffer = engine.editor.createBuffer()
try {
    val demoData =
        ByteBuffer.allocateDirect(8).apply {
            for (value in 1..8) put(value.toByte())
            flip()
        }
    engine.editor.setBufferData(uri = demoBuffer, offset = 0, data = demoData)
    engine.editor.setBufferLength(uri = demoBuffer, length = 4)
    check(engine.editor.getBufferLength(uri = demoBuffer) == 4)
} finally {
    engine.editor.destroyBuffer(uri = demoBuffer)
}
```

Truncating a buffer permanently discards bytes beyond the new length, so read or copy the data first if you still need it.

## Assigning Buffers to Blocks

Buffer Uris work like any other resource Uri in CE.SDK. On Android, `engine.block.setUri()` is the most convenient way to assign them to Uri-valued properties such as `audio/fileURI`.

```kotlin highlight-android-assign-buffer-to-audio-block
val audioBlock = engine.block.create(DesignBlockType.Audio)
engine.block.setUri(block = audioBlock, property = "audio/fileURI", value = bufferUri)
engine.block.setDuration(audioBlock, duration = durationSeconds.toDouble())
engine.block.appendChild(parent = page, child = audioBlock)
engine.block.forceLoadAVResource(audioBlock)
```

After assigning the buffer Uri, `engine.block.forceLoadAVResource()` loads the audio resource metadata so the engine can resolve duration and playback data from the generated WAV bytes.

The same pattern works for other Uri properties:

- **Audio blocks**: `audio/fileURI`
- **Image fills**: `fill/image/imageFileURI`
- **Video fills**: `fill/video/fileURI`

## Transient Resources and Scene Serialization

Buffers are transient resources. The Uri may be serialized, but the bytes themselves are not persisted with the scene. Use `engine.editor.findAllTransientResources()` before export or save so you know which resources still need to be relocated.

```kotlin highlight-android-find-transient-resources
val transientResources = engine.editor.findAllTransientResources()
check(transientResources.any { (uri, size) -> uri == bufferUri && size == bufferLength })
```

> **Note:** **Limitations**Buffers are intended for temporary data only.* Buffer data is not part of [scene serialization](./scenes.md).
> * Changes to buffers cannot be undone with the [history system](./undo-and-history.md).

## Persisting Buffer Data

To keep buffer content beyond the current session, read the bytes back out, upload them to persistent storage, then call `engine.editor.relocateResource()` so every block reference points at the new Uri.

```kotlin highlight-android-persist-buffer
val relocatedUri = Uri.parse("https://cdn.example.com/audio/generated-tone.wav")
val persistedData = engine.editor.getBufferData(uri = bufferUri, offset = 0, length = bufferLength)
check(persistedData.remaining() == bufferLength)
engine.editor.relocateResource(currentUri = bufferUri, relocatedUri = relocatedUri)
check(engine.block.getUri(block = audioBlock, property = "audio/fileURI") == relocatedUri)
```

The example uses a placeholder CDN URL to show the relocation step. In production, replace that with the URL returned by your own storage or upload pipeline.

## Troubleshooting

**Audio block does not load the buffer**

Make sure the buffer contains a valid audio file format such as WAV. Raw PCM bytes alone are not enough for `audio/fileURI`.

**`setBufferData()` throws on Android**

The `data` argument must be a direct `ByteBuffer`. Use `ByteBuffer.allocateDirect(...)` instead of `ByteArray` or a heap-backed buffer.

**Buffer data is missing after saving or exporting**

Buffers are transient. Find them with `findAllTransientResources()`, upload them to persistent storage, then relocate the scene references before serializing.

**Memory usage keeps growing**

Destroy buffers when they are no longer needed. They stay resident until you call `destroyBuffer()` or stop the engine.

## Next Steps

- [Scenes](./scenes.md) — Understand how scenes are structured and what gets serialized.
- [Undo and History](./undo-and-history.md) — Learn which editor changes participate in undo and redo.
- [Resources](./resources.md) — Explore how CE.SDK resolves, loads, and relocates resource Uris.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support