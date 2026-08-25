> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Add Sound Effects](./add-sound-effects.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-add-sound-effects/AddSoundEffects.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import java.nio.ByteBuffer
import java.nio.ByteOrder
import kotlin.math.PI
import kotlin.math.roundToInt
import kotlin.math.sin

private const val SAMPLE_RATE = 48_000
private const val CHANNEL_COUNT = 2
private const val BITS_PER_SAMPLE = 16
private const val BYTES_PER_SAMPLE = BITS_PER_SAMPLE / 8
const val WAV_HEADER_SIZE = 44

private data class Note(
    val frequencyHz: Double,
    val startSeconds: Double,
    val durationSeconds: Double,
)

private data class SoundEffect(
    val notes: List<Note>,
    val totalDurationSeconds: Double,
)

private object NoteFrequencies {
    const val C4 = 261.63
    const val E4 = 329.63
    const val G4 = 392.0
    const val A4 = 440.0
    const val C5 = 523.25
    const val D5 = 587.33
    const val E5 = 659.25
    const val F5 = 698.46
    const val G5 = 783.99
    const val A5 = 880.0
}

private val successChime =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.C4, startSeconds = 0.0, durationSeconds = 0.3),
            Note(frequencyHz = NoteFrequencies.E4, startSeconds = 0.1, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.G4, startSeconds = 0.2, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.C5, startSeconds = 0.35, durationSeconds = 1.65),
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 0.4, durationSeconds = 1.6),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.45, durationSeconds = 1.55),
        ),
        totalDurationSeconds = 2.0,
    )

private val notificationMelody =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 0.0, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.25, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.6, durationSeconds = 0.3),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.85, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 1.15, durationSeconds = 0.85),
        ),
        totalDurationSeconds = 2.0,
    )

private val alertTone =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.0, durationSeconds = 0.25),
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.3, durationSeconds = 0.25),
            Note(frequencyHz = NoteFrequencies.F5, startSeconds = 0.6, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.D5, startSeconds = 0.9, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.A4, startSeconds = 1.3, durationSeconds = 0.7),
        ),
        totalDurationSeconds = 2.0,
    )

data class GeneratedSoundEffect(
    val name: String,
    val block: DesignBlock,
    val bufferUri: Uri,
    val bufferLength: Int,
    val startSeconds: Double,
    val durationSeconds: Double,
    val volume: Float,
)

data class SoundEffectsSummary(
    val page: DesignBlock,
    val totalDurationSeconds: Double,
    val effects: List<GeneratedSoundEffect>,
)

suspend fun addSoundEffects(engine: Engine): SoundEffectsSummary {
    val scene = engine.scene.createForVideo()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)
    engine.block.setWidth(page, value = 1920F)
    engine.block.setHeight(page, value = 1080F)

    val effectDurationSeconds = 2.0
    val gapDurationSeconds = 0.5
    val totalDurationSeconds = 3 * effectDurationSeconds + 2 * gapDurationSeconds

    engine.block.setDuration(block = page, duration = totalDurationSeconds)

    val chimeBuffer = engine.editor.createBuffer()

    val chimeWav =
        createWavBuffer(
            sampleRate = SAMPLE_RATE,
            durationSeconds = successChime.totalDurationSeconds,
        ) { timeSeconds ->
            generateSoundEffectSample(
                effect = successChime,
                timeSeconds = timeSeconds,
                attackSeconds = 0.02,
                decaySeconds = 0.08,
                sustainLevel = 0.7,
                releaseSeconds = 0.25,
                gain = 0.3,
                harmonic2Gain = 0.25,
                harmonic3Gain = 0.1,
            )
        }

    engine.editor.setBufferData(uri = chimeBuffer, offset = 0, data = chimeWav)

    val chimeBufferLength = engine.editor.getBufferLength(uri = chimeBuffer)
    val riffHeader = engine.editor.getBufferData(uri = chimeBuffer, offset = 0, length = 4)
    val riffBytes = ByteArray(size = 4)
    riffHeader.get(riffBytes)
    check(riffBytes.contentEquals("RIFF".toByteArray(Charsets.US_ASCII)))

    val chimeBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = chimeBlock,
        property = "audio/fileURI",
        value = chimeBuffer,
    )
    engine.block.appendChild(parent = page, child = chimeBlock)
    engine.block.forceLoadAVResource(block = chimeBlock)

    val melodyBuffer = engine.editor.createBuffer()
    val melodyWav =
        createWavBuffer(
            sampleRate = SAMPLE_RATE,
            durationSeconds = notificationMelody.totalDurationSeconds,
        ) { timeSeconds ->
            generateSoundEffectSample(
                effect = notificationMelody,
                timeSeconds = timeSeconds,
                attackSeconds = 0.01,
                decaySeconds = 0.06,
                sustainLevel = 0.6,
                releaseSeconds = 0.2,
                gain = 0.4,
                harmonic2Gain = 0.15,
                harmonic3Gain = 0.0,
            )
        }

    engine.editor.setBufferData(uri = melodyBuffer, offset = 0, data = melodyWav)
    val melodyBufferLength = engine.editor.getBufferLength(uri = melodyBuffer)

    val melodyBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = melodyBlock,
        property = "audio/fileURI",
        value = melodyBuffer,
    )
    engine.block.appendChild(parent = page, child = melodyBlock)
    engine.block.forceLoadAVResource(block = melodyBlock)

    val alertBuffer = engine.editor.createBuffer()
    val alertWav =
        createWavBuffer(
            sampleRate = SAMPLE_RATE,
            durationSeconds = alertTone.totalDurationSeconds,
        ) { timeSeconds ->
            generateSoundEffectSample(
                effect = alertTone,
                timeSeconds = timeSeconds,
                attackSeconds = 0.005,
                decaySeconds = 0.05,
                sustainLevel = 0.5,
                releaseSeconds = 0.15,
                gain = 0.35,
                harmonic2Gain = 0.2,
                harmonic3Gain = 0.15,
            )
        }

    engine.editor.setBufferData(uri = alertBuffer, offset = 0, data = alertWav)
    val alertBufferLength = engine.editor.getBufferLength(uri = alertBuffer)

    val alertBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = alertBlock,
        property = "audio/fileURI",
        value = alertBuffer,
    )
    engine.block.appendChild(parent = page, child = alertBlock)
    engine.block.forceLoadAVResource(block = alertBlock)

    engine.block.setTimeOffset(block = chimeBlock, offset = 0.0)
    engine.block.setDuration(block = chimeBlock, duration = successChime.totalDurationSeconds)
    engine.block.setVolume(block = chimeBlock, volume = 0.8F)

    engine.block.setTimeOffset(block = melodyBlock, offset = effectDurationSeconds + gapDurationSeconds)
    engine.block.setDuration(block = melodyBlock, duration = notificationMelody.totalDurationSeconds)
    engine.block.setVolume(block = melodyBlock, volume = 0.8F)

    engine.block.setTimeOffset(block = alertBlock, offset = 2 * (effectDurationSeconds + gapDurationSeconds))
    engine.block.setDuration(block = alertBlock, duration = alertTone.totalDurationSeconds)
    engine.block.setVolume(block = alertBlock, volume = 0.75F)

    val effects =
        listOf(
            GeneratedSoundEffect(
                name = "Success chime",
                block = chimeBlock,
                bufferUri = chimeBuffer,
                bufferLength = chimeBufferLength,
                startSeconds = 0.0,
                durationSeconds = successChime.totalDurationSeconds,
                volume = 0.8F,
            ),
            GeneratedSoundEffect(
                name = "Notification melody",
                block = melodyBlock,
                bufferUri = melodyBuffer,
                bufferLength = melodyBufferLength,
                startSeconds = effectDurationSeconds + gapDurationSeconds,
                durationSeconds = notificationMelody.totalDurationSeconds,
                volume = 0.8F,
            ),
            GeneratedSoundEffect(
                name = "Alert tone",
                block = alertBlock,
                bufferUri = alertBuffer,
                bufferLength = alertBufferLength,
                startSeconds = 2 * (effectDurationSeconds + gapDurationSeconds),
                durationSeconds = alertTone.totalDurationSeconds,
                volume = 0.75F,
            ),
        )

    return SoundEffectsSummary(
        page = page,
        totalDurationSeconds = totalDurationSeconds,
        effects = effects,
    )
}

private fun createWavBuffer(
    sampleRate: Int,
    durationSeconds: Double,
    generator: (timeSeconds: Double) -> Double,
): ByteBuffer {
    val sampleCount = (durationSeconds * sampleRate).roundToInt()
    val dataSize = sampleCount * CHANNEL_COUNT * BYTES_PER_SAMPLE
    val wavFileSize = WAV_HEADER_SIZE + dataSize
    val wavData = ByteBuffer.allocateDirect(wavFileSize).order(ByteOrder.LITTLE_ENDIAN)

    wavData.put("RIFF".toByteArray(Charsets.US_ASCII))
    wavData.putInt(wavFileSize - 8)
    wavData.put("WAVE".toByteArray(Charsets.US_ASCII))
    wavData.put("fmt ".toByteArray(Charsets.US_ASCII))
    wavData.putInt(16)
    wavData.putShort(1.toShort())
    wavData.putShort(CHANNEL_COUNT.toShort())
    wavData.putInt(sampleRate)
    wavData.putInt(sampleRate * CHANNEL_COUNT * BYTES_PER_SAMPLE)
    wavData.putShort((CHANNEL_COUNT * BYTES_PER_SAMPLE).toShort())
    wavData.putShort(BITS_PER_SAMPLE.toShort())
    wavData.put("data".toByteArray(Charsets.US_ASCII))
    wavData.putInt(dataSize)

    for (sampleIndex in 0 until sampleCount) {
        val timeSeconds = sampleIndex / sampleRate.toDouble()
        val clampedValue = generator(timeSeconds).coerceIn(-1.0, 1.0)
        val pcmScale = if (clampedValue < 0.0) 32768.0 else 32767.0
        val pcmSample = (clampedValue * pcmScale).roundToInt().toShort()
        wavData.putShort(pcmSample)
        wavData.putShort(pcmSample)
    }

    wavData.flip()
    return wavData
}

private fun adsr(
    timeSeconds: Double,
    noteStartSeconds: Double,
    noteDurationSeconds: Double,
    attackSeconds: Double,
    decaySeconds: Double,
    sustainLevel: Double,
    releaseSeconds: Double,
): Double {
    val noteTime = timeSeconds - noteStartSeconds
    if (noteTime < 0.0) return 0.0

    val releaseStartSeconds = noteDurationSeconds - releaseSeconds
    return when {
        noteTime < attackSeconds -> noteTime / attackSeconds
        noteTime < attackSeconds + decaySeconds ->
            1.0 - ((noteTime - attackSeconds) / decaySeconds) * (1.0 - sustainLevel)
        noteTime < releaseStartSeconds -> sustainLevel
        noteTime < noteDurationSeconds -> sustainLevel * (1.0 - (noteTime - releaseStartSeconds) / releaseSeconds)
        else -> 0.0
    }
}

private fun generateSoundEffectSample(
    effect: SoundEffect,
    timeSeconds: Double,
    attackSeconds: Double,
    decaySeconds: Double,
    sustainLevel: Double,
    releaseSeconds: Double,
    gain: Double,
    harmonic2Gain: Double,
    harmonic3Gain: Double,
): Double {
    var sample = 0.0
    for (note in effect.notes) {
        val envelope =
            adsr(
                timeSeconds = timeSeconds,
                noteStartSeconds = note.startSeconds,
                noteDurationSeconds = note.durationSeconds,
                attackSeconds = attackSeconds,
                decaySeconds = decaySeconds,
                sustainLevel = sustainLevel,
                releaseSeconds = releaseSeconds,
            )

        if (envelope > 0.0) {
            val fundamental = sin(2 * PI * note.frequencyHz * timeSeconds)
            val secondHarmonic = sin(4 * PI * note.frequencyHz * timeSeconds) * harmonic2Gain
            val thirdHarmonic = sin(6 * PI * note.frequencyHz * timeSeconds) * harmonic3Gain
            sample += (fundamental + secondHarmonic + thirdHarmonic) * envelope * gain
        }
    }
    return sample
}

fun destroyGeneratedSoundEffectBuffers(
    engine: Engine,
    effects: List<GeneratedSoundEffect>,
) {
    effects.forEach { effect ->
        engine.editor.destroyBuffer(uri = effect.bufferUri)
    }
}
```

Generate sound effects programmatically using buffers with arbitrary audio data. Create notification chimes, alert tones, and melodies without external files.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260825/engine-guides-add-sound-effects)

<EngineReferenceNote {...props} />

CE.SDK lets you create audio from code using buffers. This approach is useful for notification tones, procedural audio, or any scenario where you need to synthesize audio at runtime instead of shipping separate audio files.

This guide covers creating WAV data in memory, writing it into CE.SDK buffers, assigning the buffers to audio blocks, and positioning those blocks on a video timeline.

## Working with Buffers

CE.SDK provides a buffer API for creating and managing arbitrary binary data in memory. For the full buffer lifecycle, see [Buffers](../../concepts/buffers.md); this guide focuses on the audio path.

### Creating a Buffer

Create a buffer with `engine.editor.createBuffer()`, which returns a `buffer://` Uri that can be referenced by audio blocks:

```kotlin highlight-android-buffer-create
val chimeBuffer = engine.editor.createBuffer()
```

### Writing Data

Write data to a buffer with `engine.editor.setBufferData()`. On Android, the data must be a direct `ByteBuffer`, which the WAV helper below returns:

```kotlin highlight-android-buffer-write
engine.editor.setBufferData(uri = chimeBuffer, offset = 0, data = chimeWav)
```

### Reading Data

Read data back with `engine.editor.getBufferData()` and query the byte length with `engine.editor.getBufferLength()`:

```kotlin highlight-android-read-buffer
val chimeBufferLength = engine.editor.getBufferLength(uri = chimeBuffer)
val riffHeader = engine.editor.getBufferData(uri = chimeBuffer, offset = 0, length = 4)
val riffBytes = ByteArray(size = 4)
riffHeader.get(riffBytes)
check(riffBytes.contentEquals("RIFF".toByteArray(Charsets.US_ASCII)))
```

### Adding an Audio Track

Create an audio block, assign the buffer Uri to its `audio/fileURI` property, and append it to the page:

```kotlin highlight-android-audio-track
val chimeBlock = engine.block.create(DesignBlockType.Audio)
engine.block.setUri(
    block = chimeBlock,
    property = "audio/fileURI",
    value = chimeBuffer,
)
engine.block.appendChild(parent = page, child = chimeBlock)
engine.block.forceLoadAVResource(block = chimeBlock)
```

`forceLoadAVResource()` loads the generated WAV metadata so the engine can treat the buffer like any other audio resource.

### Cleanup

Destroy generated buffers only after the scene no longer needs them:

```kotlin highlight-android-cleanup
fun destroyGeneratedSoundEffectBuffers(
    engine: Engine,
    effects: List<GeneratedSoundEffect>,
) {
    effects.forEach { effect ->
        engine.editor.destroyBuffer(uri = effect.bufferUri)
    }
}
```

## Generating Audio Data

Audio buffers need valid audio file bytes. The example builds a stereo WAV file with a 44-byte RIFF header and 16-bit PCM samples at 48 kHz:

```kotlin highlight-android-wav-data
private fun createWavBuffer(
    sampleRate: Int,
    durationSeconds: Double,
    generator: (timeSeconds: Double) -> Double,
): ByteBuffer {
    val sampleCount = (durationSeconds * sampleRate).roundToInt()
    val dataSize = sampleCount * CHANNEL_COUNT * BYTES_PER_SAMPLE
    val wavFileSize = WAV_HEADER_SIZE + dataSize
    val wavData = ByteBuffer.allocateDirect(wavFileSize).order(ByteOrder.LITTLE_ENDIAN)

    wavData.put("RIFF".toByteArray(Charsets.US_ASCII))
    wavData.putInt(wavFileSize - 8)
    wavData.put("WAVE".toByteArray(Charsets.US_ASCII))
    wavData.put("fmt ".toByteArray(Charsets.US_ASCII))
    wavData.putInt(16)
    wavData.putShort(1.toShort())
    wavData.putShort(CHANNEL_COUNT.toShort())
    wavData.putInt(sampleRate)
    wavData.putInt(sampleRate * CHANNEL_COUNT * BYTES_PER_SAMPLE)
    wavData.putShort((CHANNEL_COUNT * BYTES_PER_SAMPLE).toShort())
    wavData.putShort(BITS_PER_SAMPLE.toShort())
    wavData.put("data".toByteArray(Charsets.US_ASCII))
    wavData.putInt(dataSize)

    for (sampleIndex in 0 until sampleCount) {
        val timeSeconds = sampleIndex / sampleRate.toDouble()
        val clampedValue = generator(timeSeconds).coerceIn(-1.0, 1.0)
        val pcmScale = if (clampedValue < 0.0) 32768.0 else 32767.0
        val pcmSample = (clampedValue * pcmScale).roundToInt().toShort()
        wavData.putShort(pcmSample)
        wavData.putShort(pcmSample)
    }

    wavData.flip()
    return wavData
}
```

The helper clamps generated samples to the -1.0 to 1.0 range and scales negative amplitudes to the full 16-bit PCM range.

### Shaping Notes

Use an ADSR envelope to avoid clicks at note boundaries. The envelope ramps each note in, sustains it, and fades it out before the next note:

```kotlin highlight-android-envelope
private fun adsr(
    timeSeconds: Double,
    noteStartSeconds: Double,
    noteDurationSeconds: Double,
    attackSeconds: Double,
    decaySeconds: Double,
    sustainLevel: Double,
    releaseSeconds: Double,
): Double {
    val noteTime = timeSeconds - noteStartSeconds
    if (noteTime < 0.0) return 0.0

    val releaseStartSeconds = noteDurationSeconds - releaseSeconds
    return when {
        noteTime < attackSeconds -> noteTime / attackSeconds
        noteTime < attackSeconds + decaySeconds ->
            1.0 - ((noteTime - attackSeconds) / decaySeconds) * (1.0 - sustainLevel)
        noteTime < releaseStartSeconds -> sustainLevel
        noteTime < noteDurationSeconds -> sustainLevel * (1.0 - (noteTime - releaseStartSeconds) / releaseSeconds)
        else -> 0.0
    }
}
```

### Defining Sound Effects

Define each effect as a set of notes with frequencies, start times, and durations:

```kotlin highlight-android-sound-definitions
private data class Note(
    val frequencyHz: Double,
    val startSeconds: Double,
    val durationSeconds: Double,
)

private data class SoundEffect(
    val notes: List<Note>,
    val totalDurationSeconds: Double,
)

private object NoteFrequencies {
    const val C4 = 261.63
    const val E4 = 329.63
    const val G4 = 392.0
    const val A4 = 440.0
    const val C5 = 523.25
    const val D5 = 587.33
    const val E5 = 659.25
    const val F5 = 698.46
    const val G5 = 783.99
    const val A5 = 880.0
}

private val successChime =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.C4, startSeconds = 0.0, durationSeconds = 0.3),
            Note(frequencyHz = NoteFrequencies.E4, startSeconds = 0.1, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.G4, startSeconds = 0.2, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.C5, startSeconds = 0.35, durationSeconds = 1.65),
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 0.4, durationSeconds = 1.6),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.45, durationSeconds = 1.55),
        ),
        totalDurationSeconds = 2.0,
    )

private val notificationMelody =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 0.0, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.25, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.6, durationSeconds = 0.3),
            Note(frequencyHz = NoteFrequencies.G5, startSeconds = 0.85, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.E5, startSeconds = 1.15, durationSeconds = 0.85),
        ),
        totalDurationSeconds = 2.0,
    )

private val alertTone =
    SoundEffect(
        notes = listOf(
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.0, durationSeconds = 0.25),
            Note(frequencyHz = NoteFrequencies.A5, startSeconds = 0.3, durationSeconds = 0.25),
            Note(frequencyHz = NoteFrequencies.F5, startSeconds = 0.6, durationSeconds = 0.4),
            Note(frequencyHz = NoteFrequencies.D5, startSeconds = 0.9, durationSeconds = 0.5),
            Note(frequencyHz = NoteFrequencies.A4, startSeconds = 1.3, durationSeconds = 0.7),
        ),
        totalDurationSeconds = 2.0,
    )
```

The sample uses the same two-second success chime, notification melody, and alert tone as the other platform examples.

## Creating a Sound Effect

Combine the note definition, WAV helper, and buffer API to generate an audio block. This snippet creates the notification melody, writes it to a buffer, and creates the matching audio block:

```kotlin highlight-android-create-melody
    val melodyBuffer = engine.editor.createBuffer()
    val melodyWav =
        createWavBuffer(
            sampleRate = SAMPLE_RATE,
            durationSeconds = notificationMelody.totalDurationSeconds,
        ) { timeSeconds ->
            generateSoundEffectSample(
                effect = notificationMelody,
                timeSeconds = timeSeconds,
                attackSeconds = 0.01,
                decaySeconds = 0.06,
                sustainLevel = 0.6,
                releaseSeconds = 0.2,
                gain = 0.4,
                harmonic2Gain = 0.15,
                harmonic3Gain = 0.0,
            )
        }

    engine.editor.setBufferData(uri = melodyBuffer, offset = 0, data = melodyWav)
    val melodyBufferLength = engine.editor.getBufferLength(uri = melodyBuffer)

    val melodyBlock = engine.block.create(DesignBlockType.Audio)
    engine.block.setUri(
        block = melodyBlock,
        property = "audio/fileURI",
        value = melodyBuffer,
    )
    engine.block.appendChild(parent = page, child = melodyBlock)
    engine.block.forceLoadAVResource(block = melodyBlock)
```

The generator mixes overlapping notes with a light harmonic layer so the result sounds warmer than a pure sine wave:

```kotlin highlight-android-sample-generator
private fun generateSoundEffectSample(
    effect: SoundEffect,
    timeSeconds: Double,
    attackSeconds: Double,
    decaySeconds: Double,
    sustainLevel: Double,
    releaseSeconds: Double,
    gain: Double,
    harmonic2Gain: Double,
    harmonic3Gain: Double,
): Double {
    var sample = 0.0
    for (note in effect.notes) {
        val envelope =
            adsr(
                timeSeconds = timeSeconds,
                noteStartSeconds = note.startSeconds,
                noteDurationSeconds = note.durationSeconds,
                attackSeconds = attackSeconds,
                decaySeconds = decaySeconds,
                sustainLevel = sustainLevel,
                releaseSeconds = releaseSeconds,
            )

        if (envelope > 0.0) {
            val fundamental = sin(2 * PI * note.frequencyHz * timeSeconds)
            val secondHarmonic = sin(4 * PI * note.frequencyHz * timeSeconds) * harmonic2Gain
            val thirdHarmonic = sin(6 * PI * note.frequencyHz * timeSeconds) * harmonic3Gain
            sample += (fundamental + secondHarmonic + thirdHarmonic) * envelope * gain
        }
    }
    return sample
}
```

## Positioning in Time

Audio blocks exist on the page timeline. Set the page duration, then give each sound effect a time offset, duration, and volume:

```kotlin highlight-android-timeline-setup
    val effectDurationSeconds = 2.0
    val gapDurationSeconds = 0.5
    val totalDurationSeconds = 3 * effectDurationSeconds + 2 * gapDurationSeconds

    engine.block.setDuration(block = page, duration = totalDurationSeconds)
```

```kotlin highlight-android-position-effects
    engine.block.setTimeOffset(block = chimeBlock, offset = 0.0)
    engine.block.setDuration(block = chimeBlock, duration = successChime.totalDurationSeconds)
    engine.block.setVolume(block = chimeBlock, volume = 0.8F)

    engine.block.setTimeOffset(block = melodyBlock, offset = effectDurationSeconds + gapDurationSeconds)
    engine.block.setDuration(block = melodyBlock, duration = notificationMelody.totalDurationSeconds)
    engine.block.setVolume(block = melodyBlock, volume = 0.8F)

    engine.block.setTimeOffset(block = alertBlock, offset = 2 * (effectDurationSeconds + gapDurationSeconds))
    engine.block.setDuration(block = alertBlock, duration = alertTone.totalDurationSeconds)
    engine.block.setVolume(block = alertBlock, volume = 0.75F)
```

The sample spaces the effects with 0.5-second gaps:

```text
Timeline: |----|----|----|----|----|----|----|
          0s   1s   2s   3s   4s   5s   6s   7s

Success:  |====|
          ^ 0s (2s)

Melody:         |====|
                ^ 2.5s (2s)

Alert:               |====|
                     ^ 5s (2s)
```

Each effect is two seconds long, and the page duration is seven seconds.

## Troubleshooting

### No Sound

- **Check scene setup** - Audio blocks need a video scene and a page with a duration greater than zero.
- **Verify the buffer data** - The buffer must contain a valid audio file, not raw PCM bytes without a header.
- **Load the resource** - Call `engine.block.forceLoadAVResource()` after assigning the buffer Uri.

### Audio Sounds Wrong

- **Clipping** - Keep generated sample values between -1.0 and 1.0 before PCM conversion.
- **Clicking** - Add attack and release envelope phases instead of starting or stopping samples abruptly.
- **Wrong pitch** - Use the same sample rate in the WAV header and in the frequency calculation.

### Buffer Errors

- **`setBufferData()` throws** - Use a direct `ByteBuffer`, such as one from `ByteBuffer.allocateDirect(...)`.
- **Invalid WAV** - Make sure the RIFF and data chunk sizes match the actual PCM byte count.
- **Missing data after saving** - Buffers are transient resources. See [Buffers](../../concepts/buffers.md) for the `findAllTransientResources()` and `relocateResource()` flow before saving scenes that must survive the current engine session.

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.createBuffer()` | Create a new buffer resource and return its Uri. |
| `engine.editor.setBufferData(uri=_, offset=_, data=_)` | Write direct `ByteBuffer` data to a buffer at a byte offset. |
| `engine.editor.getBufferLength(uri=_)` | Get the current buffer size in bytes. |
| `engine.editor.getBufferData(uri=_, offset=_, length=_)` | Read a byte range from a buffer. |
| `engine.editor.destroyBuffer(uri=_)` | Destroy a buffer after no block needs it. |
| `engine.block.create(blockType=DesignBlockType.Audio)` | Create an audio block. |
| `engine.block.setUri(block=_, property="audio/fileURI", value=_)` | Assign a buffer Uri to an audio block source. |
| `engine.block.appendChild(parent=_, child=_)` | Add the audio block to the page timeline. |
| `engine.block.forceLoadAVResource(block=_)` | Load audio metadata for the generated resource. |
| `engine.block.setTimeOffset(block=_, offset=_)` | Set when the audio block starts. |
| `engine.block.setDuration(block=_, duration=_)` | Set how long the audio block plays. |
| `engine.block.setVolume(block=_, volume=_)` | Set the audio level from 0.0 to 1.0. |

## Next Steps

- [Trim](../../edit-video/trim.md) — Documentation for Trim
- [Adjust Audio Volume](./adjust-volume.md) — Learn how to adjust audio volume in CE.SDK to control playback levels, mute audio, and balance multiple audio sources in video projects.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support