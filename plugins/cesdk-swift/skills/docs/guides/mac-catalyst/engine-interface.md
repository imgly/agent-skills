> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Engine](./engine-interface.md)

---

```swift file=@cesdk_swift_examples/engine-guides-engine-interface/EngineInterface.swift reference-only
import IMGLYEngine

@MainActor
func engineInterface(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let json = try await engine.scene.saveToString()
  try await engine.scene.load(from: json)
}

@MainActor
func makeOffscreenEngine(license: String) async throws -> Engine {
  try await Engine(
    context: .offscreen(size: .init(width: 1024, height: 1024)),
    audioContext: .none,
    license: license,
  )
}

```

The CE.SDK Engine is the C++-powered core behind every creative operation. The Engine interface gives you direct programmatic control across iOS, macOS, and Mac Catalyst — from validation and thumbnail generation to background exports and batch automation.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.81.0-nightly.20260809/engine-guides-engine-interface)

CE.SDK is built on a layered architecture: a cross-platform C++ engine handles rendering, scene management, and creative operations, and Swift bindings expose that surface to your app through `IMGLYEngine`. On iOS, the prebuilt editor UI calls the same bindings under the hood. Whether you reach for the editor or the engine directly, you get identical capabilities.

## Swift SDK Modules

CE.SDK ships several Swift modules. Pick the smallest one that matches your integration:

| Module | Availability | Use it for |
|---|---|---|
| `IMGLYEngine` | iOS 14+, macOS 12+, Mac Catalyst | Engine-only access. Initialize directly with `try await Engine(...)`. The foundation for headless work, custom editors, and hidden Engine instances. |
| `IMGLYEditor` | iOS 16+ | The prebuilt SwiftUI editor. Compose a Starter Kit configuration (Design, Video, Photo, Apparel, Postcard) or assemble your own with `EditorConfiguration`. |
| `IMGLYCamera` | iOS 16+ | The prebuilt camera UI. Returns recordings ready to feed into the editor. |

`IMGLYEngine` is the only module that ships on macOS and Mac Catalyst — the editor and camera modules build on iOS only. On those non-iOS targets, initialize `IMGLYEngine` directly and drive the engine from your own AppKit or SwiftUI surface.

## Engine API Namespaces

The Engine organizes its functionality into six namespaces. Each groups methods for one domain — content hierarchy, design elements, assets, editor settings, template variables, and reactive updates:

```swift highlight-engineInterface-namespaces
@MainActor
func engineInterface(engine: Engine) async throws {
  let scene = try engine.scene.create()
  let page = try engine.block.create(.page)
  try engine.block.appendChild(to: scene, child: page)

  let json = try await engine.scene.saveToString()
  try await engine.scene.load(from: json)
}
```

| Namespace | Purpose |
|---|---|
| `engine.scene` | Create, load, and save scenes and pages. |
| `engine.block` | Create, modify, and export design elements (graphics, text, audio, video). |
| `engine.asset` | Register and query asset sources (images, templates, fonts). |
| `engine.editor` | Configure editor settings, manage edit modes, handle undo and redo. |
| `engine.variable` | Define and update template variables for data merge. |
| `engine.event` | Subscribe to engine events such as selection changes and block updates. |

## Combining UI and Engine Access

On iOS, the prebuilt editor UI calls the same engine APIs internally. Reach the Engine through your editor configuration's `onCreate` callback — a `@MainActor` closure that receives the started Engine and runs before the editor renders. Use it for validation, scene preloading, custom asset sources, or any other engine-level work that should happen alongside visual editing.

On macOS and Mac Catalyst, the prebuilt editor UI is not available. Initialize the Engine directly with `try await Engine(...)` and build your own surface on top of the same namespaces.

## Hidden Engine Instances

Each `Engine` is an independent runtime. You can keep one Engine driving the editor while a second instance does work in the background — design validation, thumbnail generation, or preview rendering — without affecting what the user sees.

To run an Engine without a visible view, initialize it with an offscreen render context:

```swift highlight-engineInterface-offscreen
@MainActor
func makeOffscreenEngine(license: String) async throws -> Engine {
  try await Engine(
    context: .offscreen(size: .init(width: 1024, height: 1024)),
    audioContext: .none,
    license: license,
  )
}
```

The offscreen instance has full access to the same six API namespaces — load scenes, run blocks through the export pipeline, and drop the reference when the work completes.

## Memory Management

The Swift `Engine` is reference-counted. ARC tears it down and releases its GPU resources when the last strong reference goes out of scope. Hold one Engine for the lifetime of an editing session and let ARC release it on scope exit — there is no explicit `dispose()` call to make.

For background processing where you spin up an additional Engine instance, drop the reference as soon as the work completes. The instance will deallocate and reclaim its buffers.

## Choosing an Approach

| Scenario | Approach |
|---|---|
| Interactive end-user editing | For iOS, the prebuilt editor UI (`IMGLYEditor`) with a Starter Kit configuration. On macOS and Mac Catalyst, a custom surface built on `IMGLYEngine`. |
| Background validation or thumbnail generation | A hidden `IMGLYEngine` instance. |
| Custom Apple-native UI with full engine control | `IMGLYEngine` plus your own SwiftUI or AppKit view. |
| High-resolution or bulk server-side export | Offload to a Node.js backend running `@cesdk/node`. |

## Troubleshooting

**`try await Engine(...)` throws on initialization.** Confirm the CE.SDK license key passed to `license:` is valid and that your bundle identifier matches the one registered with the license. Some licenses also require a non-empty `userID:`.

**Engine APIs report a `MainActor` warning.** The `Engine` class is `@MainActor`-isolated. Call its methods from a `@MainActor` context — either a `@MainActor` function, a SwiftUI view body, or an explicit `Task { @MainActor in ... }`.

**A hidden Engine instance keeps memory pinned.** Drop the strong reference when the offscreen work completes. ARC releases the engine and reclaims its GPU buffers once no caller is holding it.

## API Reference

| API | Purpose |
|---|---|
| `Engine(context:audioContext:license:userID:)` | Initialize a standalone Engine. Async; throws on invalid license. Defaults `context: .metal` (renders to a Metal view); pass `.offscreen(size:)` for headless work. |
| `engine.scene.create()` | Create an empty scene. |
| `engine.scene.saveToString()` | Serialize the current scene to a string. |
| `engine.scene.load(from:)` | Load a scene from a serialized string, or a scene or archive `.imgly` file from a URL. |
| `engine.block.create(_:)` | Create a new block of a given type. |
| `engine.block.appendChild(to:child:)` | Add a block as a child of a parent. |

## Next Steps

- [Architecture](./concepts/architecture.md) — Explore the Engine and its six API namespaces in depth.&#x20;
- [Batch Processing](./automation/batch-processing.md) — Process multiple designs in one flow.
- [Data Merge](./automation/data-merge.md) — Personalize templates with external data.
- Node.js SDK — Use the server-side Engine package for backend processing.




---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support