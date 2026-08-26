> This is one page of the CE.SDK macOS documentation. For a complete overview, see the [macOS Documentation Index](https://img.ly/docs/cesdk/macos/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/macos/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Load a Scene](./load-scene.md)

---

```swift file=@cesdk_swift_examples/engine-guides-load-scene-from-remote/LoadSceneFromRemote.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func loadSceneFromRemote(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let sceneURL =
    baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")

  try await engine.scene.load(from: sceneURL)

  guard let text = try engine.block.find(byType: .text).first else { return }
  try engine.block.setDropShadowEnabled(text, enabled: true)
}
```

```swift file=@cesdk_swift_examples/engine-guides-load-scene-from-string/LoadSceneFromString.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func loadSceneFromString(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  let sceneBlob = try await URLSession.shared.data(from: sceneURL).0
  guard let blobString = String(data: sceneBlob, encoding: .utf8) else { return }

  try await engine.scene.load(from: blobString)

  let text = try engine.block.find(byType: .text).first!
  try engine.block.setDropShadowEnabled(text, enabled: true)
}
```

```swift file=@cesdk_swift_examples/engine-guides-load-scene-from-blob/LoadSceneFromBlob.swift reference-only
import Foundation
import IMGLYEngine

@MainActor
func loadSceneFromBlob(engine: Engine) async throws {
  let baseURL = try engine.guidesBaseURL

  let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
  let sceneBlob = try await URLSession.shared.data(from: sceneURL).0

  guard let blobString = String(data: sceneBlob, encoding: .utf8) else { return }

  try await engine.scene.load(from: blobString)

  let text = try engine.block.find(byType: .text).first!
  try engine.block.setDropShadowEnabled(text, enabled: true)
}
```

Load previously saved scenes to resume editing or adapt existing designs. The
CE.SDK Engine loads scenes from a remote URL, a string, or a data blob, and a
loaded scene is immediately editable.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260826/engine-guides-load-scene-from-remote)

<EngineReferenceNote {...props} />

Scene files contain layout, properties, and asset references, but not the assets themselves. When loading a scene, make sure the referenced asset URLs remain accessible. For self-contained packages with bundled assets, use archives instead.

This guide covers loading scenes from URLs, strings, and blobs, and modifying a loaded scene.

## Load a Scene from URL

The most common approach loads a scene from a remote URL. Pass a URL that points to a scene file — an `.imgly` or `.scene` file — to `engine.scene.load(from:)`. The call is asynchronous and replaces any existing scene with the loaded one. It throws if the scene cannot be loaded.

```swift highlight-load-remote
try await engine.scene.load(from: sceneURL)
```

## Load a Scene from String

When a scene is stored in a database or local storage, load it from a string — typically the output of a previous `engine.scene.saveToString()` call. Here, fetch the scene over the network and decode it to a string.

```swift highlight-fetch-string
let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
let sceneBlob = try await URLSession.shared.data(from: sceneURL).0
guard let blobString = String(data: sceneBlob, encoding: .utf8) else { return }
```

Pass the string to `engine.scene.load(from:)`. As with the URL form, the editor resets and presents the loaded scene.

```swift highlight-load-string
try await engine.scene.load(from: blobString)
```

## Load a Scene from In-Memory Data

When you already hold the scene's bytes in memory — from a file upload or blob storage — start from `Data`. Here, fetch the bytes to stand in for that in-memory data.

```swift highlight-fetch-blob
let sceneURL = baseURL.appendingPathComponent("ly.img.templates/templates/cesdk_business_card_1.scene")
let sceneBlob = try await URLSession.shared.data(from: sceneURL).0
```

`load(from:)` accepts a `URL` or a `String`, but not raw `Data`, so decode the bytes to a UTF-8 string first.

```swift highlight-read-blob
guard let blobString = String(data: sceneBlob, encoding: .utf8) else { return }
```

Then load it with `engine.scene.load(from:)`.

```swift highlight-load-blob
try await engine.scene.load(from: blobString)
```

## Modify a Loaded Scene

After loading, the scene is immediately editable. Locate elements with `engine.block.find(byType:)`, then change them with the block APIs. This example adds a drop shadow to the first text block.

```swift highlight-modify-text-remote
guard let text = try engine.block.find(byType: .text).first else { return }
try engine.block.setDropShadowEnabled(text, enabled: true)
```

A scene load can be reverted with `engine.editor.undo()`.

## Scene Files vs Archives

Scene files are lightweight: they store only references to assets, so the scene won't display correctly if those asset URLs become unavailable. For a self-contained package with bundled assets, load an archive with the same `engine.scene.load(from:)` call — the engine detects the file kind automatically, and all asset paths resolve relative to the archive's location. Both scenes and archives use the `.imgly` extension; `.scene` and `.zip` files also load. See [Import Design from Archive](./import-design/from-archive.md) for the full archive workflow. To redirect asset requests to a different location, register a custom resolver; see the [URI Resolver](./uri-resolver.md) guide.

## Troubleshooting

### Scene fails to load

- Verify the URL is reachable and returns a valid `.scene` file.
- Ensure the scene format is compatible with your CE.SDK version.

### Assets not displaying after load

- Scene files store asset references as URLs — make sure those URLs remain accessible.
- Use archives for self-contained scenes with bundled assets.
- Configure a [URI resolver](./uri-resolver.md) if assets are hosted on a different server.

### String content is invalid

- Ensure the string is the exact output of `engine.scene.saveToString()`.
- Verify the string was not modified or truncated during storage.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.load(from: URL)` | Load a scene or archive from a URL (file kind detected automatically) |
| `engine.scene.load(from: String)` | Load a scene from a string |
| `engine.scene.loadArchive(from: URL)` | Load a scene archive from a URL |
| `engine.block.find(byType:)` | Find blocks by type |
| `engine.block.setDropShadowEnabled(_:enabled:)` | Enable or disable a block's drop shadow |
| `engine.editor.undo()` | Revert a scene load |

## Next Steps

- [Save Scenes](../export-save-publish/save.md) — Persist your work as a scene file or archive for later loading.
- [Blocks](../concepts/blocks.md) — Edit blocks, properties, and content in a loaded scene.



---

## More Resources

- **[macOS Documentation Index](https://img.ly/docs/cesdk/macos/)** - Browse all macOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/macos/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/macos/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support