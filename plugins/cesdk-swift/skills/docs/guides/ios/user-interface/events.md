> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [User Interface](../user-interface.md) > [UI Events](./events.md)

---

```swift file=@cesdk_swift_examples/editor-guides-configuration-ui-events/UiEventsEditorSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

@MainActor
final class UiEventsLog: ObservableObject {
  @Published var lastEvent: String = "Waiting for editor events"
}

struct UiEventsEditorSolution: View {
  let settings = EngineSettings(license: secrets.licenseKey, // pass nil for evaluation mode with watermark
                                userID: "<your unique user id>")

  @StateObject private var log = UiEventsLog()
  @State private var isPresented = false

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          builder.onChanged { [log] update, _, existing in
            try existing()
            let message: String = switch update {
            case let .viewMode(_, new):
              "View mode changed to \(new.editorViewMode)"
            case let .page(_, new):
              "Page index changed to \(new)"
            case let .editMode(_, new):
              "Edit mode changed to \(new)"
            case let .gestureActive(_, isActive):
              isActive ? "Canvas touch started" : "Canvas touch ended"
            }
            log.lastEvent = message
          }

          builder.onLoaded { [log] context, existing in
            try await existing()
            context.eventHandler.send(.setExtraCanvasInsets(24))
            log.lastEvent = "Editor loaded"
          }

          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.elementsLibrary()
              Dock.Button(id: "app.dock.button.preview") { context in
                context.eventHandler.send(.setViewMode(.preview))
              } label: { _ in
                Label("Preview", systemImage: "eye")
              }
            }
          }
        }
      }
  }

  var body: some View {
    Button("Use the Editor") { isPresented = true }
      .fullScreenCover(isPresented: $isPresented) {
        ModalEditor {
          editor
            .safeAreaInset(edge: .top) {
              Text(log.lastEvent)
                .font(.footnote)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(.thinMaterial, in: Capsule())
                .padding(.top, 4)
            }
        }
      }
  }
}

#Preview {
  UiEventsEditorSolution()
}
```

Dispatch built-in editor events with `EditorEventHandler.send(_:)` and observe editor state changes with `builder.onChanged` — two APIs for driving the editor and keeping your app in sync.

![UI Events](https://img.ly/docs/cesdk/ios/user-interface/events-514b70/assets/ios.hero.webp)

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260822/editor-guides-configuration-ui-events)

This guide walks through both APIs. The examples build on `GuideEditorConfiguration`, a minimal baseline that ships only a navigation bar (close, undo, redo). See the [Configuration](../configuration.md) guide for how `EditorConfiguration` and `EngineSettings` set up the editor as a whole. If you need CreativeEngine block lifecycle changes (created, updated, or destroyed blocks) instead, use [Events](../concepts/events.md) — that guide uses `engine.event.subscribe()` and is separate from both editor APIs covered here.

## Sending Editor Events

An `EditorEvent` is a value your app dispatches to the editor to drive an action — change the view mode, open a sheet, start an export, share a file, close the editor, surface an error. You dispatch by calling `send(_:)` on an `EditorEventHandler`, which the editor makes available in every component context and in every `EditorConfiguration.Builder` lifecycle callback except `onCreate` and `onUpload`. `onLoaded` and `onChanged` expose it via `context.eventHandler`; `onExport`, `onClose`, and `onError` receive it as a dedicated parameter.

The built-in events are defined as static functions or properties on `EditorEvent`. See the [List of Available Editor Events](./events.md#list-of-available-editor-events) below for the full catalog.

### From a Lifecycle Callback

`onLoaded` is a natural place to dispatch an event once the editor is ready:

```swift highlight-uiEvents-sendFromCallback
builder.onLoaded { [log] context, existing in
  try await existing()
  context.eventHandler.send(.setExtraCanvasInsets(24))
  log.lastEvent = "Editor loaded"
}
```

Other callbacks fit specific event families: dispatch `.exportProgress(_:)` and `.shareFile(_:)` from `onExport`, or `.showErrorAlert(_:)` from `onError`.

### From a Custom UI Component

Every editor component receives its event handler through its component context. This example declares a dock that includes a custom button which switches the editor into preview mode when tapped. `dock.items { ... }` replaces the dock's item list wholesale, so any button you want to keep must be included in the closure.

```swift highlight-uiEvents-sendFromComponent
builder.dock { dock in
  dock.items { _ in
    Dock.Buttons.elementsLibrary()
    Dock.Button(id: "app.dock.button.preview") { context in
      context.eventHandler.send(.setViewMode(.preview))
    } label: { _ in
      Label("Preview", systemImage: "eye")
    }
  }
}
```

## Observing Editor State Changes

`builder.onChanged` is a separate mechanism: instead of your app driving the editor, the editor notifies your app when its own state advances. Configure the handler on the `EditorConfiguration.Builder`. It runs on the main actor and receives an `EditorStateChange` that covers the four state axes the editor tracks.

```swift highlight-uiEvents-observe
builder.onChanged { [log] update, _, existing in
  try existing()
  let message: String = switch update {
  case let .viewMode(_, new):
    "View mode changed to \(new.editorViewMode)"
  case let .page(_, new):
    "Page index changed to \(new)"
  case let .editMode(_, new):
    "Edit mode changed to \(new)"
  case let .gestureActive(_, isActive):
    isActive ? "Canvas touch started" : "Canvas touch ended"
  }
  log.lastEvent = message
}
```

The `EditorStateChange` cases are:

| Case | Payload | Emitted when |
| --- | --- | --- |
| `.viewMode(oldValue:newValue:)` | `ViewModeState` | The editor enters or leaves preview mode. |
| `.page(oldValue:newValue:)` | Page index | The visible page changes. |
| `.editMode(oldValue:newValue:)` | `IMGLYEngine.EditMode` | The engine's edit mode changes (for example transform ↔ text). |
| `.gestureActive(oldValue:newValue:)` | `Bool` | A canvas touch gesture starts or ends. |

Call `try existing()` to chain any previously registered handler — including the Starter Kits' defaults — before running your own logic.

Some state changes are downstream effects of events you sent (dispatching `.setViewMode(.preview)` eventually flips the observed view mode); others come from user interaction the app never sees directly (a canvas gesture emits `.gestureActive` with no matching event).

### Route Observed State into SwiftUI

Keep UI state in regular SwiftUI storage and update it from the observation handler. A small `ObservableObject` bridges the editor's callbacks into your app's `@StateObject`, so any view that reads it stays in sync with editor activity.

```swift highlight-uiEvents-overlay
editor
  .safeAreaInset(edge: .top) {
    Text(log.lastEvent)
      .font(.footnote)
      .padding(.horizontal, 12)
      .padding(.vertical, 6)
      .background(.thinMaterial, in: Capsule())
      .padding(.top, 4)
  }
```

`safeAreaInset(edge: .top)` layers your view above the editor without pushing content into the canvas area. Because the store is `@MainActor`, `@Published` updates from inside the handler flow into the overlay immediately.

## Lifecycle Callbacks

`EditorConfiguration.Builder` exposes seven callbacks that fire at specific points in the editor's lifetime. Five of them expose an `EditorEventHandler` (as covered in [Sending Editor Events](#sending-editor-events)); two receive only the engine.

| Callback | Purpose | Event handler |
| --- | --- | --- |
| `onCreate` | Runs once when the editor is created, before the first UI is presented. Register asset sources, set global scopes and roles, and load or create the initial scene. | — |
| `onLoaded` | Runs once after the editor loads and the first scene is ready. Configure post-load state or dispatch initial events (for example set canvas insets). | `context.eventHandler` |
| `onChanged` | Runs whenever the editor's own state advances — view mode, current page, edit mode, and canvas gestures. See [Observing Editor State Changes](#observing-editor-state-changes). | `context.eventHandler` |
| `onExport` | Runs when the user triggers an export. Handle the exported file, report progress with `.exportProgress(_:)`, share results with `.shareFile(_:)`. | Dedicated parameter |
| `onClose` | Runs when the user closes the editor. Save state, prompt for unsaved changes, dismiss the presenting view. | Dedicated parameter |
| `onError` | Runs when an unhandled error surfaces. Log the error or display it with `.showErrorAlert(_:)`. | Dedicated parameter |
| `onUpload` | Runs when the user uploads an asset. Route the asset to a persistent store and return a persisted `AssetDefinition`. | — |

Each callback receives an `existing` closure — call `try existing()` (or `try await existing()`) to chain the previous handler, including the Starter Kits' defaults, before running your own logic.

## List of Available Editor Events

Built-in events are static factory functions or properties on `EditorEvent`. Selection, add-from, and navigation events live in nested namespaces on `EditorEvents`.

| Event | What it does |
| --- | --- |
| `.setViewMode(_:)` | Switch view mode (`.edit`, `.preview`, `.pages`). |
| `.setExtraCanvasInsets(_:)` | Reserve safe-area insets above the canvas. |
| `.openSheet(type:)` | Present a built-in editor sheet. |
| `.closeSheet` | Close the currently open sheet. |
| `.startExport` | Trigger the `onExport` callback. |
| `.cancelExport` | Cancel a running export. |
| `.exportProgress(_:)` | Show the export progress sheet. |
| `.exportCompleted(action:)` | Show the export completed sheet and run an action on dismiss. |
| `.shareFile(_:)` | Present the system share sheet with a file URL. |
| `.showErrorAlert(_:)` | Display an error alert. |
| `.showCloseConfirmationAlert` | Display the close confirmation alert. |
| `.closeEditor` | Dismiss the editor. |
| `.onClose` | Invoke the `onClose` callback. |
| `.setVideoDurationConstraints(minimumVideoDuration:maximumVideoDuration:)` | Apply video length constraints. |
| `.showVideoMinLengthAlert(minimumVideoDuration:)` | Show the below-minimum video length alert. |
| `.applyForceCrop(to:with:mode:)` | Apply a force-crop preset to a block. |
| `EditorEvents.Selection.*` | Manipulate the current selection — `.duplicateSelection`, `.deleteSelection`, `.enterTextEditModeForSelection`, `.splitSelection`, `.moveSelectionAsClip`, `.moveSelectionAsOverlay`, `.enterGroupForSelection`, `.selectGroupForSelection`, `.bringSelectionForward`, `.sendSelectionBackward`. |
| `EditorEvents.AddFrom.*` | Add assets from `.addFromPhotoRoll(addToBackgroundTrack:)`, `.addFromSystemCamera(to:addToBackgroundTrack:)`, or `.addFromIMGLYCamera(to:)`. |
| `EditorEvents.Navigation.*` | `.navigateToPreviousPage` and `.navigateToNextPage`. |

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `builder.onChanged { update, context, existing in ... }` | Configures the editor state observation handler. |
| `builder.onLoaded { context, existing in ... }` | Runs once after the editor loads. Provides an `EditorEventHandler` on the context for sending events. |
| `context.eventHandler.send(_:)` | Dispatches a built-in `EditorEvent` from a callback or UI component. |

### Key Types

| Type | Purpose |
| --- | --- |
| `EditorEvent` | Protocol for editor UI events. Built-in events live in the `EditorEvents` namespace and are exposed as static factories on `EditorEvent`. |
| `EditorEventHandler` | Protocol with a single `send(_:)` method. Available on every editor component context and on every lifecycle callback except `onCreate` and `onUpload` (`onLoaded` and `onChanged` expose it via `context.eventHandler`; `onExport`, `onClose`, and `onError` receive it as a dedicated parameter). |
| `OnChanged.EditorStateChange` | Enum of the four state axes the editor tracks: `viewMode`, `page`, `editMode`, and `gestureActive`. |
| `EditorViewMode` | The active view mode: `.edit`, `.preview`, or `.pages`. |

## Next Steps

- [Events](../concepts/events.md) — Subscribe to CreativeEngine block lifecycle events for created, updated, or destroyed blocks.
- [Configuration](../configuration.md) — Configure `EditorConfiguration` and `EngineSettings` for the editor as a whole.
- [Design Editor Starter Kit](../starterkits/design-editor.md) — Explore a complete iOS editor surface built on the same configuration layer.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support