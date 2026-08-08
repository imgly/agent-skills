> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Force Trim](./force-trim.md)

---

```swift file=@cesdk_swift_examples/editor-guides-force-trim/ForceTrimSolution.swift reference-only
import IMGLYEditor
import SwiftUI

struct ForceTrimSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey, // pass nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        VideoEditorConfiguration { builder in
          builder.onLoaded { context, _ in
            context.setVideoDurationConstraints(
              minimumVideoDuration: 5,
              maximumVideoDuration: 15,
            )
          }
        }
      }
  }

  @State private var isPresented = false

  var body: some View {
    Button("Use the Editor") {
      isPresented = true
    }
    .fullScreenCover(isPresented: $isPresented) {
      ModalEditor {
        editor
      }
    }
  }
}

#Preview {
  ForceTrimSolution()
}
```

Force trim lets you enforce minimum and maximum video durations in the timeline UI. The editor clamps export to the maximum duration and shows labels to communicate the limits.

## Configure duration constraints

Apply constraints in the `EditorConfiguration.onLoaded` callback after the scene has loaded. Use seconds for the values and ensure the max is not smaller than the min.

```swift highlight-forceTrim-constraints
context.setVideoDurationConstraints(
  minimumVideoDuration: 5,
  maximumVideoDuration: 15,
)
```

## Launch the video editor

Present the `VideoEditor` as usual. You can call `setVideoDurationConstraints` again later to adjust limits at runtime.

```swift highlight-forceTrim-onLoaded
builder.onLoaded { context, _ in
  context.setVideoDurationConstraints(
    minimumVideoDuration: 5,
    maximumVideoDuration: 15,
  )
}
```

## Timeline and export behavior

When the scene duration is below the minimum, the min label stays visible and the editor blocks export with a dialog. When the duration exceeds the maximum, the playhead sticks to the max position and export is clamped to that duration.



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support