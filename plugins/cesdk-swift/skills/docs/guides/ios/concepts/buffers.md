> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Buffers](./buffers.md)

---

```swift file=@cesdk_swift_examples/engine-guides-buffers/Buffers.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func buffers(engine: Engine) throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let audioBuffer = engine.editor.createBuffer()

  // Generate 10 seconds of stereo 48 kHz audio data
  let sampleCount = 10 * 2 * 48000
  let samples = ContiguousArray<Float>(unsafeUninitializedCapacity: sampleCount) { buffer, initializedCount in
    for i in stride(from: 0, to: buffer.count, by: 2) {
      let sample = sin((440.0 * Float(i) * Float.pi) / 48000.0)
      buffer[i + 0] = sample
      buffer[i + 1] = sample
    }
    initializedCount = buffer.count
  }

  // Write the audio samples to the buffer
  try samples.withUnsafeBufferPointer { buffer in
    try engine.editor.setBufferData(url: audioBuffer, offset: 0, data: Data(buffer: buffer))
  }

  // Read a subrange of the buffer data
  let chunk = try engine.editor.getBufferData(url: audioBuffer, offset: 0, length: 4096)

  // Query the current buffer length in bytes
  let length = try engine.editor.getBufferLength(url: audioBuffer)

  // Reduce the buffer to half its length, truncating from 10 to 5 seconds
  try engine.editor.setBufferLength(url: audioBuffer, length: UInt(truncating: length) / 2)

  // Create an audio block and assign the buffer as its source
  let audioBlock = try engine.block.create(.audio)
  try engine.block.appendChild(to: page, child: audioBlock)
  try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioBuffer)

  // Find all transient resources in the scene, including buffers
  let transientResources = try engine.editor.findAllTransientResources()
  for resource in transientResources {
    print("Transient resource: \(resource.url), size: \(resource.size) bytes")
  }

  // To persist buffer data, read it, upload to storage, then relocate
  let bufferData = try engine.editor.getBufferData(
    url: audioBuffer,
    offset: 0,
    length: UInt(truncating: try engine.editor.getBufferLength(url: audioBuffer)),
  )

  // In production, upload `bufferData` to a CDN or cloud storage
  let persistentURL = URL(string: "https://example.com/audio/generated.raw")!

  // Update all references to the old buffer URI throughout the scene
  try engine.editor.relocateResource(currentURL: audioBuffer, relocatedURL: persistentURL)

  // Free buffer resources when no longer needed
  try engine.editor.destroyBuffer(url: audioBuffer)

  _ = chunk
  _ = bufferData
}
```

Store and manage temporary binary data directly in memory using CE.SDK's buffer API for dynamically generated content like procedural audio or real-time image data.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-buffers)

Buffers are in-memory containers for binary data referenced via `buffer://` URIs. Unlike external files that require network or file I/O, buffers exist only during the current session and are not serialized when saving scenes. This makes them ideal for procedural audio, real-time image data, or streaming content that doesn't need to persist beyond the current editing session.

This guide covers how to create and manage buffers, write and read binary data, assign buffers to block properties like audio sources, and handle transient resources when saving scenes.

## Setting Up a Video Scene

Since this example uses audio blocks, we first create a scene with a page. Audio blocks require a scene context with timeline support.

```swift highlight-buffers-setup
let scene = try engine.scene.create()
let page = try engine.block.create(.page)
try engine.block.appendChild(to: scene, child: page)
```

## Creating and Managing Buffers

Use `engine.editor.createBuffer()` to allocate a new buffer and receive its URI. This URI follows the `buffer://` scheme and uniquely identifies the buffer within the engine instance.

```swift highlight-buffers-createBuffer
let audioBuffer = engine.editor.createBuffer()
```

Buffers persist in memory until you explicitly destroy them with `engine.editor.destroyBuffer()` or the engine instance is disposed. For large buffers or long editing sessions, destroy buffers when they're no longer needed to free memory.

## Writing Data to Buffers

Populate a buffer with binary data using `engine.editor.setBufferData()`. This method takes the buffer URL, an offset in bytes, and a `Data` value containing the bytes to write.

In this example, we generate a 440 Hz sine wave as 10 seconds of stereo PCM audio samples at 48 kHz. We create a `ContiguousArray<Float>` for the sample values, then convert them to `Data` for writing.

```swift highlight-buffers-writeData
  // Generate 10 seconds of stereo 48 kHz audio data
  let sampleCount = 10 * 2 * 48000
  let samples = ContiguousArray<Float>(unsafeUninitializedCapacity: sampleCount) { buffer, initializedCount in
    for i in stride(from: 0, to: buffer.count, by: 2) {
      let sample = sin((440.0 * Float(i) * Float.pi) / 48000.0)
      buffer[i + 0] = sample
      buffer[i + 1] = sample
    }
    initializedCount = buffer.count
  }

  // Write the audio samples to the buffer
  try samples.withUnsafeBufferPointer { buffer in
    try engine.editor.setBufferData(url: audioBuffer, offset: 0, data: Data(buffer: buffer))
  }
```

The offset parameter supports incremental writes — you can append data or overwrite specific ranges within the buffer.

## Reading Data from Buffers

Read data back from a buffer with `engine.editor.getBufferData()`, specifying the buffer URL, a starting offset, and the number of bytes to read. This returns a `Data` value that you can process or convert back to typed arrays.

```swift highlight-buffers-readData
// Read a subrange of the buffer data
let chunk = try engine.editor.getBufferData(url: audioBuffer, offset: 0, length: 4096)
```

Partial reads are supported — you can read any range within the buffer bounds.

## Querying Buffer Length

Use `engine.editor.getBufferLength()` to determine the current size of a buffer in bytes.

```swift highlight-buffers-getLength
// Query the current buffer length in bytes
let length = try engine.editor.getBufferLength(url: audioBuffer)
```

## Resizing Buffers

Change a buffer's size with `engine.editor.setBufferLength()`. Increasing the size allocates additional space, while decreasing it truncates the data. Here we halve the buffer, reducing the audio from 10 to 5 seconds.

```swift highlight-buffers-resize
// Reduce the buffer to half its length, truncating from 10 to 5 seconds
try engine.editor.setBufferLength(url: audioBuffer, length: UInt(truncating: length) / 2)
```

Truncating a buffer permanently discards data beyond the new length.

## Assigning Buffers to Blocks

Buffer URIs work like any other resource URI in CE.SDK. Assign them to block properties using `engine.block.setURL()`. For audio blocks, set the `audio/fileURI` property.

```swift highlight-buffers-assignBlock
// Create an audio block and assign the buffer as its source
let audioBlock = try engine.block.create(.audio)
try engine.block.appendChild(to: page, child: audioBlock)
try engine.block.setURL(audioBlock, property: "audio/fileURI", value: audioBuffer)
```

The same approach works for other resource properties:

- **Audio blocks**: `audio/fileURI`
- **Image fills**: `fill/image/imageFileURI`
- **Video fills**: `fill/video/fileURI`

Any property that accepts a URI can reference a buffer.

## Transient Resources and Scene Serialization

Buffers are transient resources — the URI gets serialized when you save a scene, but the actual binary data does not persist. This means a saved scene will contain references to `buffer://` URIs that won't resolve when loaded again.

Use `engine.editor.findAllTransientResources()` to discover all transient resources in the current scene, including buffers. Each resource includes its URL and size in bytes.

```swift highlight-buffers-transientResources
// Find all transient resources in the scene, including buffers
let transientResources = try engine.editor.findAllTransientResources()
for resource in transientResources {
  print("Transient resource: \(resource.url), size: \(resource.size) bytes")
}
```

> **Note:** **Limitations**Buffers are intended for temporary data only.* Buffer data is not part of [scene serialization](./scenes.md)
> * Changes to buffers can't be undone using the [history system](./undo-and-history.md)

## Persisting Buffer Data

To permanently save buffer content, extract the data, upload it to persistent storage, then use `engine.editor.relocateResource()` to update all references throughout the scene to point to the new URL.

```swift highlight-buffers-persistData
  // To persist buffer data, read it, upload to storage, then relocate
  let bufferData = try engine.editor.getBufferData(
    url: audioBuffer,
    offset: 0,
    length: UInt(truncating: try engine.editor.getBufferLength(url: audioBuffer)),
  )

  // In production, upload `bufferData` to a CDN or cloud storage
  let persistentURL = URL(string: "https://example.com/audio/generated.raw")!

  // Update all references to the old buffer URI throughout the scene
  try engine.editor.relocateResource(currentURL: audioBuffer, relocatedURL: persistentURL)
```

After relocation, saving the scene serializes the new persistent URLs instead of the transient `buffer://` URIs.

## Troubleshooting

**Buffer data not appearing in exported scene**

Buffers are transient and don't persist with scene saves. Use `findAllTransientResources()` to identify buffers, then relocate them to persistent storage before exporting.

**Memory usage growing unexpectedly**

Call `engine.editor.destroyBuffer()` when buffers are no longer needed. Unlike external resources that can be garbage collected, buffers remain in memory until explicitly destroyed.

**Data corruption when writing**

Ensure the offset plus data length doesn't exceed the intended buffer bounds. Resize the buffer first with `setBufferLength()` if you need more space.

**Buffer URI not recognized by block**

Verify the buffer was created in the same engine instance. Buffer URIs are not portable between different engine instances or sessions.

## Next Steps

- [Scenes](./scenes.md) — Understand scene structure and serialization
- [Undo and History](./undo-and-history.md) — Learn about the history system and its limitations with buffers
- [Resources](./resources.md) — Learn how CE.SDK manages resource URIs and loading



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support