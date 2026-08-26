> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Edit Audio](../audio.md) > [Add Sound Effects](./add-sound-effects.md)

---

Generate sound effects programmatically using buffers with arbitrary audio data. Create notification chimes, alert tones, and melodies without external files.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-create-audio-add-sound-effects)

CE.SDK lets you create audio from code using buffers. This approach generates sound effects dynamically without external files — useful for notification tones, procedural audio, or any scenario where you need to synthesize audio at runtime.

```swift file=@cesdk_swift_examples/engine-guides-create-audio-add-sound-effects/AddSoundEffects.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func addSoundEffects(engine: Engine) async throws {
  func createWavData(
    sampleRate: Int,
    durationSeconds: Double,
    generator: (Double) -> Double,
  ) -> Data {
    let bitsPerSample: UInt16 = 16
    let channels: UInt16 = 2 // Stereo output
    let numSamples = Int(durationSeconds * Double(sampleRate))
    let dataSize = UInt32(numSamples * Int(channels) * Int(bitsPerSample / 8))

    var data = Data(capacity: 44 + Int(dataSize))

    func writeLE16(_ value: UInt16) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }
    func writeLE32(_ value: UInt32) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }
    func writeSample(_ value: Int16) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }

    // RIFF chunk descriptor
    data.append(contentsOf: [0x52, 0x49, 0x46, 0x46]) // "RIFF"
    writeLE32(36 + dataSize) // File size - 8
    data.append(contentsOf: [0x57, 0x41, 0x56, 0x45]) // "WAVE"

    // fmt sub-chunk
    data.append(contentsOf: [0x66, 0x6D, 0x74, 0x20]) // "fmt "
    writeLE32(16) // Sub-chunk size (16 for PCM)
    writeLE16(1) // Audio format (1 = PCM)
    writeLE16(channels)
    writeLE32(UInt32(sampleRate))
    writeLE32(UInt32(sampleRate) * UInt32(channels) * UInt32(bitsPerSample / 8))
    writeLE16(channels * (bitsPerSample / 8)) // Block align
    writeLE16(bitsPerSample)

    // data sub-chunk
    data.append(contentsOf: [0x64, 0x61, 0x74, 0x61]) // "data"
    writeLE32(dataSize)

    // Generate audio samples — duplicate mono value to both stereo channels.
    for i in 0 ..< numSamples {
      let time = Double(i) / Double(sampleRate)
      let value = generator(time)
      let clamped = max(-1.0, min(1.0, value))
      let sample = Int16((clamped * 32767.0).rounded())
      writeSample(sample) // Left channel
      writeSample(sample) // Right channel
    }

    return data
  }

  func adsr(
    time: Double,
    noteStart: Double,
    noteDuration: Double,
    attack: Double,
    decay: Double,
    sustain: Double,
    release: Double,
  ) -> Double {
    let t = time - noteStart
    guard t >= 0 else { return 0 }

    let noteEnd = noteDuration - release

    if t < attack {
      // Attack phase: ramp up from 0 to 1
      return t / attack
    } else if t < attack + decay {
      // Decay phase: ramp down from 1 to sustain level
      return 1 - ((t - attack) / decay) * (1 - sustain)
    } else if t < noteEnd {
      // Sustain phase: hold at sustain level
      return sustain
    } else if t < noteDuration {
      // Release phase: ramp down from sustain to 0
      return sustain * (1 - (t - noteEnd) / release)
    }
    return 0
  }

  struct Note {
    let freq: Double
    let start: Double
    let duration: Double
  }
  struct SoundEffect {
    let notes: [Note]
    let totalDuration: Double
  }

  // Musical note frequencies (Hz) for the 4th and 5th octaves.
  enum Notes {
    static let c4 = 261.63
    static let e4 = 329.63
    static let g4 = 392.0
    static let a4 = 440.0
    static let c5 = 523.25
    static let d5 = 587.33
    static let e5 = 659.25
    static let f5 = 698.46
    static let g5 = 783.99
    static let a5 = 880.0
  }

  // Sound effect 1: Ascending "success" fanfare with overlapping arpeggio and chord.
  let successChime = SoundEffect(
    notes: [
      Note(freq: Notes.c4, start: 0.0, duration: 0.4),
      Note(freq: Notes.e4, start: 0.1, duration: 0.4),
      Note(freq: Notes.g4, start: 0.2, duration: 0.5),
      Note(freq: Notes.c5, start: 0.35, duration: 1.65),
      Note(freq: Notes.e5, start: 0.4, duration: 1.6),
      Note(freq: Notes.g5, start: 0.45, duration: 1.55),
    ],
    totalDuration: 2.0,
  )

  // Sound effect 2: Gentle notification melody that resolves pleasantly.
  let notificationMelody = SoundEffect(
    notes: [
      Note(freq: Notes.e5, start: 0.0, duration: 0.4),
      Note(freq: Notes.g5, start: 0.25, duration: 0.5),
      Note(freq: Notes.a5, start: 0.6, duration: 0.3),
      Note(freq: Notes.g5, start: 0.85, duration: 0.4),
      Note(freq: Notes.e5, start: 1.15, duration: 0.85),
    ],
    totalDuration: 2.0,
  )

  // Sound effect 3: Descending alert tone that grabs attention.
  let alertTone = SoundEffect(
    notes: [
      Note(freq: Notes.a5, start: 0.0, duration: 0.25),
      Note(freq: Notes.a5, start: 0.3, duration: 0.25),
      Note(freq: Notes.f5, start: 0.6, duration: 0.4),
      Note(freq: Notes.d5, start: 0.9, duration: 0.5),
      Note(freq: Notes.a4, start: 1.3, duration: 0.7),
    ],
    totalDuration: 2.0,
  )

  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)

  // Total duration: 3 effects × 2s + 2 gaps × 0.5s = 7s
  let effectDuration = 2.0
  let gapDuration = 0.5
  let totalDuration = 3 * effectDuration + 2 * gapDuration
  try engine.block.setDuration(page, duration: totalDuration)

  let sampleRate = 48000

  let chimeBuffer = engine.editor.createBuffer()

  // Generate the chime samples using the WAV helper.
  let chimeWav = createWavData(
    sampleRate: sampleRate,
    durationSeconds: successChime.totalDuration,
  ) { time in
    var sample = 0.0
    for note in successChime.notes {
      let envelope = adsr(
        time: time,
        noteStart: note.start,
        noteDuration: note.duration,
        attack: 0.02, // Soft attack (20ms)
        decay: 0.08, // Gentle decay (80ms)
        sustain: 0.7, // Sustain at 70%
        release: 0.25, // Smooth release (250ms)
      )
      if envelope > 0 {
        // Sine wave with two harmonics for a richer tone.
        let fundamental = sin(2 * .pi * note.freq * time)
        let harmonic2 = sin(4 * .pi * note.freq * time) * 0.25
        let harmonic3 = sin(6 * .pi * note.freq * time) * 0.1
        sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.3
      }
    }
    return sample
  }

  try engine.editor.setBufferData(url: chimeBuffer, offset: 0, data: chimeWav)

  let chimeLength = try engine.editor.getBufferLength(url: chimeBuffer)
  let chimeBytes = try engine.editor.getBufferData(
    url: chimeBuffer,
    offset: 0,
    length: chimeLength.uintValue,
  )

  _ = chimeBytes

  let chimeBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: chimeBlock)
  try engine.block.setURL(chimeBlock, property: "audio/fileURI", value: chimeBuffer)

  // Position the chime at the start of the timeline.
  try engine.block.setTimeOffset(chimeBlock, offset: 0)
  try engine.block.setDuration(chimeBlock, duration: successChime.totalDuration)
  try engine.block.setVolume(chimeBlock, volume: 0.8)

  let melodyBuffer = engine.editor.createBuffer()
  let melodyWav = createWavData(
    sampleRate: sampleRate,
    durationSeconds: notificationMelody.totalDuration,
  ) { time in
    var sample = 0.0
    for note in notificationMelody.notes {
      let envelope = adsr(
        time: time,
        noteStart: note.start,
        noteDuration: note.duration,
        attack: 0.01,
        decay: 0.06,
        sustain: 0.6,
        release: 0.2,
      )
      if envelope > 0 {
        let fundamental = sin(2 * .pi * note.freq * time)
        let harmonic2 = sin(4 * .pi * note.freq * time) * 0.15
        sample += (fundamental + harmonic2) * envelope * 0.4
      }
    }
    return sample
  }
  try engine.editor.setBufferData(url: melodyBuffer, offset: 0, data: melodyWav)

  let melodyBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: melodyBlock)
  try engine.block.setURL(melodyBlock, property: "audio/fileURI", value: melodyBuffer)
  try engine.block.setTimeOffset(melodyBlock, offset: effectDuration + gapDuration) // 2.5s
  try engine.block.setDuration(melodyBlock, duration: notificationMelody.totalDuration)
  try engine.block.setVolume(melodyBlock, volume: 0.8)

  let alertBuffer = engine.editor.createBuffer()
  let alertWav = createWavData(
    sampleRate: sampleRate,
    durationSeconds: alertTone.totalDuration,
  ) { time in
    var sample = 0.0
    for note in alertTone.notes {
      let envelope = adsr(
        time: time,
        noteStart: note.start,
        noteDuration: note.duration,
        attack: 0.005,
        decay: 0.05,
        sustain: 0.5,
        release: 0.15,
      )
      if envelope > 0 {
        let fundamental = sin(2 * .pi * note.freq * time)
        let harmonic2 = sin(4 * .pi * note.freq * time) * 0.2
        let harmonic3 = sin(6 * .pi * note.freq * time) * 0.15
        sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.35
      }
    }
    return sample
  }
  try engine.editor.setBufferData(url: alertBuffer, offset: 0, data: alertWav)

  let alertBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: alertBlock)
  try engine.block.setURL(alertBlock, property: "audio/fileURI", value: alertBuffer)
  try engine.block.setTimeOffset(alertBlock, offset: 2 * (effectDuration + gapDuration)) // 5s
  try engine.block.setDuration(alertBlock, duration: alertTone.totalDuration)
  try engine.block.setVolume(alertBlock, volume: 0.75)

  let archive = try await engine.scene.saveToArchive()

  _ = archive
}
```

This guide covers working with buffers to create audio data and position it in the composition.

## Working with Buffers

CE.SDK provides a buffer API for creating and managing arbitrary binary data in memory. Use buffers when you need to generate content programmatically rather than loading it from a file.

### Creating a Buffer

Create a buffer with `engine.editor.createBuffer()`, which returns a `URL` you can use to reference the buffer:

```swift highlight-addSoundEffects-bufferCreate
let chimeBuffer = engine.editor.createBuffer()
```

### Writing Data

Write data to a buffer using `engine.editor.setBufferData(url:offset:data:)`. The `offset` parameter specifies where to start writing:

```swift highlight-addSoundEffects-bufferWrite
try engine.editor.setBufferData(url: chimeBuffer, offset: 0, data: chimeWav)
```

### Reading Data

Read data back with `engine.editor.getBufferData(url:offset:length:)`, which returns the raw `Data`. Query the current size with `engine.editor.getBufferLength(url:)`, which returns the byte count as an `NSNumber`:

```swift highlight-addSoundEffects-bufferRead
let chimeLength = try engine.editor.getBufferLength(url: chimeBuffer)
let chimeBytes = try engine.editor.getBufferData(
  url: chimeBuffer,
  offset: 0,
  length: chimeLength.uintValue,
)
```

### Adding an Audio Track

Create an audio block and link it to the buffer URL. The buffer's URL goes into the block's `audio/fileURI` property via `setURL(_:property:value:)`. Append the block to the page so it joins the composition:

```swift highlight-addSoundEffects-audioTrack
let chimeBlock = try engine.block.create(.audio)
try engine.block.appendChild(to: page, child: chimeBlock)
try engine.block.setURL(chimeBlock, property: "audio/fileURI", value: chimeBuffer)
```

### Cleanup

Call `engine.editor.destroyBuffer(url:)` when a buffer is no longer needed. Buffers are also cleaned up automatically with the scene.

## Generating Audio Data

To use a buffer for audio, you need valid audio data. WAV is a convenient choice because it's a 44-byte header followed by raw PCM samples — straightforward to build in memory:

```swift highlight-addSoundEffects-wavHelper
  func createWavData(
    sampleRate: Int,
    durationSeconds: Double,
    generator: (Double) -> Double,
  ) -> Data {
    let bitsPerSample: UInt16 = 16
    let channels: UInt16 = 2 // Stereo output
    let numSamples = Int(durationSeconds * Double(sampleRate))
    let dataSize = UInt32(numSamples * Int(channels) * Int(bitsPerSample / 8))

    var data = Data(capacity: 44 + Int(dataSize))

    func writeLE16(_ value: UInt16) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }
    func writeLE32(_ value: UInt32) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }
    func writeSample(_ value: Int16) {
      var le = value.littleEndian
      withUnsafeBytes(of: &le) { data.append(contentsOf: $0) }
    }

    // RIFF chunk descriptor
    data.append(contentsOf: [0x52, 0x49, 0x46, 0x46]) // "RIFF"
    writeLE32(36 + dataSize) // File size - 8
    data.append(contentsOf: [0x57, 0x41, 0x56, 0x45]) // "WAVE"

    // fmt sub-chunk
    data.append(contentsOf: [0x66, 0x6D, 0x74, 0x20]) // "fmt "
    writeLE32(16) // Sub-chunk size (16 for PCM)
    writeLE16(1) // Audio format (1 = PCM)
    writeLE16(channels)
    writeLE32(UInt32(sampleRate))
    writeLE32(UInt32(sampleRate) * UInt32(channels) * UInt32(bitsPerSample / 8))
    writeLE16(channels * (bitsPerSample / 8)) // Block align
    writeLE16(bitsPerSample)

    // data sub-chunk
    data.append(contentsOf: [0x64, 0x61, 0x74, 0x61]) // "data"
    writeLE32(dataSize)

    // Generate audio samples — duplicate mono value to both stereo channels.
    for i in 0 ..< numSamples {
      let time = Double(i) / Double(sampleRate)
      let value = generator(time)
      let clamped = max(-1.0, min(1.0, value))
      let sample = Int16((clamped * 32767.0).rounded())
      writeSample(sample) // Left channel
      writeSample(sample) // Right channel
    }

    return data
  }
```

The helper writes the RIFF header, format chunk, and data chunk, then iterates through time to generate samples from a generator closure that returns values between `-1.0` and `1.0`. Each mono sample is duplicated into both channels for a stereo file.

## Creating Sound Effect Generators

### ADSR Envelope

Shape notes with ADSR envelopes (attack, decay, sustain, release) to avoid clicks and create natural-sounding tones:

```swift highlight-addSoundEffects-envelopeHelper
  func adsr(
    time: Double,
    noteStart: Double,
    noteDuration: Double,
    attack: Double,
    decay: Double,
    sustain: Double,
    release: Double,
  ) -> Double {
    let t = time - noteStart
    guard t >= 0 else { return 0 }

    let noteEnd = noteDuration - release

    if t < attack {
      // Attack phase: ramp up from 0 to 1
      return t / attack
    } else if t < attack + decay {
      // Decay phase: ramp down from 1 to sustain level
      return 1 - ((t - attack) / decay) * (1 - sustain)
    } else if t < noteEnd {
      // Sustain phase: hold at sustain level
      return sustain
    } else if t < noteDuration {
      // Release phase: ramp down from sustain to 0
      return sustain * (1 - (t - noteEnd) / release)
    }
    return 0
  }
```

The envelope shapes volume over time — quickly ramping up during attack, gradually falling during decay, holding steady during sustain, and fading out during release.

### Sound Effect Definitions

Define sound effects as note sequences with frequencies, start times, and durations:

```swift highlight-addSoundEffects-soundDefinitions
  struct Note {
    let freq: Double
    let start: Double
    let duration: Double
  }
  struct SoundEffect {
    let notes: [Note]
    let totalDuration: Double
  }

  // Musical note frequencies (Hz) for the 4th and 5th octaves.
  enum Notes {
    static let c4 = 261.63
    static let e4 = 329.63
    static let g4 = 392.0
    static let a4 = 440.0
    static let c5 = 523.25
    static let d5 = 587.33
    static let e5 = 659.25
    static let f5 = 698.46
    static let g5 = 783.99
    static let a5 = 880.0
  }

  // Sound effect 1: Ascending "success" fanfare with overlapping arpeggio and chord.
  let successChime = SoundEffect(
    notes: [
      Note(freq: Notes.c4, start: 0.0, duration: 0.4),
      Note(freq: Notes.e4, start: 0.1, duration: 0.4),
      Note(freq: Notes.g4, start: 0.2, duration: 0.5),
      Note(freq: Notes.c5, start: 0.35, duration: 1.65),
      Note(freq: Notes.e5, start: 0.4, duration: 1.6),
      Note(freq: Notes.g5, start: 0.45, duration: 1.55),
    ],
    totalDuration: 2.0,
  )

  // Sound effect 2: Gentle notification melody that resolves pleasantly.
  let notificationMelody = SoundEffect(
    notes: [
      Note(freq: Notes.e5, start: 0.0, duration: 0.4),
      Note(freq: Notes.g5, start: 0.25, duration: 0.5),
      Note(freq: Notes.a5, start: 0.6, duration: 0.3),
      Note(freq: Notes.g5, start: 0.85, duration: 0.4),
      Note(freq: Notes.e5, start: 1.15, duration: 0.85),
    ],
    totalDuration: 2.0,
  )

  // Sound effect 3: Descending alert tone that grabs attention.
  let alertTone = SoundEffect(
    notes: [
      Note(freq: Notes.a5, start: 0.0, duration: 0.25),
      Note(freq: Notes.a5, start: 0.3, duration: 0.25),
      Note(freq: Notes.f5, start: 0.6, duration: 0.4),
      Note(freq: Notes.d5, start: 0.9, duration: 0.5),
      Note(freq: Notes.a4, start: 1.3, duration: 0.7),
    ],
    totalDuration: 2.0,
  )
```

Each sound effect specifies a series of notes with their musical frequencies, when they start, and how long they play. Overlapping notes create chords and harmonic textures.

## Setting Up the Scene

Audio blocks live on a timeline, so create a scene with a page sized to your output and set a total duration covering all sound effects:

```swift highlight-addSoundEffects-setup
  let scene = try engine.scene.createVideo()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)
  try engine.block.setWidth(page, value: 1920)
  try engine.block.setHeight(page, value: 1080)

  // Total duration: 3 effects × 2s + 2 gaps × 0.5s = 7s
  let effectDuration = 2.0
  let gapDuration = 0.5
  let totalDuration = 3 * effectDuration + 2 * gapDuration
  try engine.block.setDuration(page, duration: totalDuration)

  let sampleRate = 48000
```

## Creating a Sound Effect

Combine the buffer API with the WAV helper to build a complete sound effect. This example generates a notification melody by mixing multiple notes with harmonics:

```swift highlight-addSoundEffects-generateMelody
  let melodyBuffer = engine.editor.createBuffer()
  let melodyWav = createWavData(
    sampleRate: sampleRate,
    durationSeconds: notificationMelody.totalDuration,
  ) { time in
    var sample = 0.0
    for note in notificationMelody.notes {
      let envelope = adsr(
        time: time,
        noteStart: note.start,
        noteDuration: note.duration,
        attack: 0.01,
        decay: 0.06,
        sustain: 0.6,
        release: 0.2,
      )
      if envelope > 0 {
        let fundamental = sin(2 * .pi * note.freq * time)
        let harmonic2 = sin(4 * .pi * note.freq * time) * 0.15
        sample += (fundamental + harmonic2) * envelope * 0.4
      }
    }
    return sample
  }
  try engine.editor.setBufferData(url: melodyBuffer, offset: 0, data: melodyWav)

  let melodyBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: melodyBlock)
  try engine.block.setURL(melodyBlock, property: "audio/fileURI", value: melodyBuffer)
  try engine.block.setTimeOffset(melodyBlock, offset: effectDuration + gapDuration) // 2.5s
  try engine.block.setDuration(melodyBlock, duration: notificationMelody.totalDuration)
  try engine.block.setVolume(melodyBlock, volume: 0.8)
```

The generator closure mixes overlapping notes, each with its own start time and duration. The `adsr` function shapes each note's volume over time, preventing harsh clicks. Adding a second harmonic at 15% creates a warmer tone than a pure sine wave.

## Positioning in Time

Position audio blocks with `setTimeOffset(_:offset:)` (when the block starts) and `setDuration(_:duration:)` (how long it plays):

```swift highlight-addSoundEffects-timelinePosition
// Position the chime at the start of the timeline.
try engine.block.setTimeOffset(chimeBlock, offset: 0)
try engine.block.setDuration(chimeBlock, duration: successChime.totalDuration)
try engine.block.setVolume(chimeBlock, volume: 0.8)
```

### Timeline Layout Example

The example spaces three sound effects with 0.5-second gaps:

```
Timeline: |----|----|----|----|----|----|----|
          0s   1s   2s   3s   4s   5s   6s   7s

Success:  |====|
          ^ 0s (2s)

Melody:         |====|
                ^ 2.5s (2s)

Alert:               |====|
                     ^ 5s (2s)
```

Each effect is 2 seconds with 0.5-second gaps between them, for a total duration of 7 seconds. The third effect — an attention-grabbing alert tone — uses sharper attack and brighter harmonics:

```swift highlight-addSoundEffects-generateAlert
  let alertBuffer = engine.editor.createBuffer()
  let alertWav = createWavData(
    sampleRate: sampleRate,
    durationSeconds: alertTone.totalDuration,
  ) { time in
    var sample = 0.0
    for note in alertTone.notes {
      let envelope = adsr(
        time: time,
        noteStart: note.start,
        noteDuration: note.duration,
        attack: 0.005,
        decay: 0.05,
        sustain: 0.5,
        release: 0.15,
      )
      if envelope > 0 {
        let fundamental = sin(2 * .pi * note.freq * time)
        let harmonic2 = sin(4 * .pi * note.freq * time) * 0.2
        let harmonic3 = sin(6 * .pi * note.freq * time) * 0.15
        sample += (fundamental + harmonic2 + harmonic3) * envelope * 0.35
      }
    }
    return sample
  }
  try engine.editor.setBufferData(url: alertBuffer, offset: 0, data: alertWav)

  let alertBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: alertBlock)
  try engine.block.setURL(alertBlock, property: "audio/fileURI", value: alertBuffer)
  try engine.block.setTimeOffset(alertBlock, offset: 2 * (effectDuration + gapDuration)) // 5s
  try engine.block.setDuration(alertBlock, duration: alertTone.totalDuration)
  try engine.block.setVolume(alertBlock, volume: 0.75)
```

## Exporting the Scene

Export the scene as an archive containing all audio data. `engine.scene.saveToArchive()` packages the scene with all embedded resources, including buffer data:

```swift highlight-addSoundEffects-export
let archive = try await engine.scene.saveToArchive()
```

> **Note:** Buffer URLs are in-memory resources and cannot be serialized with `engine.scene.saveToString()`. Use `engine.scene.saveToArchive()` to export the complete scene with embedded audio buffers.

## Troubleshooting

### No Sound

- **Check scene setup** — Ensure the audio block is attached to a page in the scene.
- **Verify duration** — The audio block's duration must be greater than 0.
- **Check buffer data** — The buffer must contain valid WAV data.

### Audio Sounds Wrong

- **Clipping** — Clamp sample values to the `-1.0` to `1.0` range before conversion.
- **Clicking** — Add attack and release phases to the envelope to avoid pops.
- **Wrong pitch** — Verify frequency calculations and the sample rate (48 kHz).

### Buffer Errors

- **Invalid WAV** — Ensure the header size fields match the actual data size.
- **Format mismatch** — Use 16-bit PCM, stereo, 48 kHz for best compatibility.

## API Reference

| Method                                                            | Description                                      |
| ----------------------------------------------------------------- | ------------------------------------------------ |
| `engine.editor.createBuffer() -> URL`                             | Create a new buffer resource for arbitrary data. |
| `engine.editor.setBufferData(url:offset:data:)`                   | Write data into a buffer.                        |
| `engine.editor.getBufferLength(url:)`                             | Get the current length of a buffer in bytes.     |
| `engine.editor.getBufferData(url:offset:length:)`                 | Read data back from a buffer.                    |
| `engine.editor.setBufferLength(url:length:)`                      | Resize a buffer.                                 |
| `engine.editor.destroyBuffer(url:)`                               | Free a buffer's resources.                       |
| `engine.block.create(.audio)`                                     | Create a new audio block.                        |
| `engine.block.setURL(_:property:value:)`                          | Set a `URL`-valued property (e.g. `audio/fileURI`). |
| `engine.block.setTimeOffset(_:offset:)`                           | Set when the audio block starts on the timeline. |
| `engine.block.setDuration(_:duration:)`                           | Set the duration of the audio block.             |
| `engine.block.setVolume(_:volume:)`                               | Set the volume level (`0.0` to `1.0`).           |
| `engine.block.appendChild(to:child:)`                             | Attach the audio block to a page.                |
| `engine.scene.saveToArchive()`                                    | Export the scene with all embedded resources.    |

## Next Steps

- [Add Music](./add-music.md) — Add background music and audio tracks to video projects
- [Adjust Audio Volume](./adjust-volume.md) — Fine-tune audio levels and balance multiple sources
- [Adjust Audio Playback Speed](./adjust-speed.md) — Create slow-motion, time-stretched, and fast-forward audio effects
- [Loop Audio](./loop.md) — Loop audio tracks for continuous playback
- Record Voiceover — On iOS, let users capture voiceover clips directly in the editor UI
- [Trim](../../edit-video/trim.md) — Control media playback timing



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support