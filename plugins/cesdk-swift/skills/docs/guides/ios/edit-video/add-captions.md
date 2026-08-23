> This is one page of the CE.SDK iOS documentation. For a complete overview, see the [iOS Documentation Index](https://img.ly/docs/cesdk/ios/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/ios/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Add Captions](./add-captions.md)

---

```swift file=@cesdk_swift_examples/editor-guides-create-video-add-captions/AddCaptionsSolution.swift reference-only
import IMGLYEditor
import IMGLYEngine
import SwiftUI

/// Demonstrates how to enable the captions surface in a CE.SDK video editor.
///
/// The MDX renders each section from `editor` via highlight markers, and `body` presents
/// the same view at runtime so the showcase screenshot captures the Add Captions sheet.
struct AddCaptionsSolution: View {
  let settings = EngineSettings(
    license: secrets.licenseKey, // pass nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var editor: some View {
    Editor(settings)
      .imgly.configuration {
        GuideEditorConfiguration { builder in
          // Demo scaffolding — not part of the lesson: footage to caption, and the caption style
          // presets, without which a new caption is unstyled and the Style button stays hidden.
          builder.onCreate { engine, _ in
            try await engine.scene.create(fromVideo: Self.sampleVideoURL)
            let basePath = try engine.editor.getSettingString("basePath")
            if let baseURL = URL(string: basePath) {
              try await engine.asset.addLocalAssetSourceFromJSON(
                baseURL.appendingPathComponent("ly.img.caption.presets").appendingPathComponent("content.json"),
              )
            }
          }
          builder.dock { dock in
            dock.items { _ in
              Dock.Buttons.captions()
            }
          }
          builder.inspectorBar { inspectorBar in
            inspectorBar.items { _ in
              InspectorBar.Buttons.editCaptions()
              InspectorBar.Buttons.captionStyle()
              InspectorBar.Buttons.formatText()
              InspectorBar.Buttons.fillStroke()
              InspectorBar.Buttons.textBackground()
              InspectorBar.Buttons.split()
              InspectorBar.Buttons.delete()
            }
          }
        }
      }
  }

  /// The video the demo opens with, so the canvas shows footage behind the captions sheet.
  private static let sampleVideoURL: URL = {
    let baseURL = secrets.baseURL
      ?? URL(string: "https://cdn.img.ly/packages/imgly/cesdk-swift/1.81.0/assets")!
    return baseURL.appendingPathComponent("ly.img.video/videos/pexels-kampus-production-8154913.mp4")
  }()

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
  AddCaptionsSolution()
}
```

Let users add synchronized captions to their videos directly in the CE.SDK editor. A
dock button opens the captions sheet for creating, importing, and editing captions, two
inspector bar buttons expose caption editing and style presets, and every caption
appears as a clip on a dedicated timeline lane.

![CE.SDK iOS video editor presenting the Add Captions sheet over the canvas](https://img.ly/docs/cesdk/ios/edit-video/add-captions-f67565/assets/ios.hero.webp)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-swift-examples/tree/v1.82.0-nightly.20260823/editor-guides-create-video-add-captions)

Captions are an editor UI feature provided by `IMGLYEditor` for video scenes. One dock button and two inspector bar buttons make up the surface, and the editor supplies the caption sheets, the timeline caption lane, and preset styling.

The [Video Editor Starter Kit](../starterkits/video-editor.md)'s [`VideoEditorConfiguration`](https://github.com/imgly/cesdk-swift-examples/blob/v1.82.0-nightly.20260823/starter-kits/starter-kit-video/StarterKit/VideoEditorConfiguration.swift) — a configuration class the iOS guides repository ships as a complete video editor baseline — registers all three for you, so captions work out of the box. The sections below show how to register them in your own editor configuration; the `dock` and `inspectorBar` builders are exposed on every configuration. The [Configuration](../configuration.md) guide covers how `EditorConfiguration` and `EngineSettings` set up the editor as a whole.

## Understanding Caption Structure

Captions use the same block hierarchy as other video content: a page holds a single caption track (`DesignBlockType.captionTrack`), and the track contains one caption block (`DesignBlockType.caption`) per cue. Each caption stores its own text, time offset, and duration, while styling — font, colors, background, position — synchronizes across all captions on the track, so the subtitles always read as one consistent set. You never manage this hierarchy from the UI: the editor creates the caption track with the first caption and removes it with the last one.

## Adding the Captions Dock Button

The Video Editor Starter Kit's default dock already includes the captions button, after Stickers. Include `Dock.Buttons.captions()` in your own dock to place it yourself:

```swift highlight-addCaptions-dock
builder.dock { dock in
  dock.items { _ in
    Dock.Buttons.captions()
  }
}
```

The button renders a captions icon with a localized "Captions" label and opens the captions sheet via `EditorEvent.openSheet(type: .captions())`. `dock.items` **replaces** the configuration's dock items, so the list above is the whole dock — the example keeps it to the one button the lesson needs, and your own list decides where captions sits among the rest. To keep a configuration's existing items and add to them, use `dock.modify { _, items in items.addLast { … } }` instead. The captions surface is intended for video scenes.

## Adding the Caption Inspector Buttons

Selecting a caption — tap its clip on the timeline — shows the inspector bar. The starter kit registers the two caption buttons already; in your own configuration, include them so they surface for caption selections:

```swift highlight-addCaptions-inspectorBar
builder.inspectorBar { inspectorBar in
  inspectorBar.items { _ in
    InspectorBar.Buttons.editCaptions()
    InspectorBar.Buttons.captionStyle()
    InspectorBar.Buttons.formatText()
    InspectorBar.Buttons.fillStroke()
    InspectorBar.Buttons.textBackground()
    InspectorBar.Buttons.split()
    InspectorBar.Buttons.delete()
  }
}
```

- `InspectorBar.Buttons.editCaptions()` reopens the captions sheet with the selected caption already selected and scrolled into view.
- `InspectorBar.Buttons.captionStyle()` opens the caption style preset grid for the selected caption.

Both buttons manage their own visibility: they appear only while the selected block is a caption, and Style additionally requires the `ly.img.caption.presets` asset source (registered by default — see Styling Captions below). Listing them first keeps them at the start of the bar, so a caption selection reads Edit Captions, Style, Format, Fill & Stroke, Background, Split and Delete. Buttons that don't apply to captions hide themselves, so Duplicate, Layer and Animations stay out of the bar even when your list includes them.

The canvas menu follows the same rule. If you register one, a caption selection shows Delete alone: Bring Forward and Send Backward hide because a caption is always drawn on top of its page, and Duplicate hides because the copy would fall outside the caption track.

**Split** applies to captions too. With a caption selected, it cuts the caption at the playhead into two captions that together cover exactly the range the original occupied, and the new caption inherits the original's style and animations. The cut snaps to the nearest word gap, so it lands at that gap rather than precisely at the playhead — a caption is never divided mid-word unless it holds a single word with no gap to snap to. This is the opposite of **Split at cursor** inside the captions sheet, which cuts exactly where you put the cursor and is never snapped.

**Split** is enabled only while the playhead sits inside the selected caption with more than a tenth of a second to spare at each end; anywhere else it greys out. Selecting a caption in the captions sheet — or creating one — parks the playhead on that caption's start, so **Split** begins disabled and becomes tappable once you scrub into the caption. Selecting the clip on the timeline leaves the playhead where it is. That tenth of a second is the only length rule captions get: they are not subject to the timeline's one-second minimum clip duration, and they raise neither the "Please move the selected clip under the playhead." nor the "Can't split because one of the clips would become too short." alert. A caption a fifth of a second or shorter therefore never offers **Split** at all.

Even with the button enabled, the split declines silently and leaves the caption unchanged when it has no text or when the snapped cut would land at the very start or end of it. The original caption stays selected after the split.

## Using the Captions Sheet

The sheet's state follows the caption count. With no captions it is titled **Add Captions** and offers the creation actions; as soon as one caption exists it becomes **Edit Captions**, a scrollable list of caption cards. Reopening the sheet later goes straight to the list. The **Add Captions** state locks the sheet to a single compact height. **Edit Captions** makes it resizable, and it grows to full height while you edit a caption so the row stays clear of the keyboard.

### Add Captions

- **Create Manually** adds a styled caption and opens it for editing. The first caption starts at the beginning of the track; each one after that is appended to the end of the last, inheriting its style and length. The playhead moves to the new caption rather than the caption being placed wherever the playhead happened to sit.
- **Import File** presents a file picker limited to SRT and VTT subtitle files.
- **Generate Automatically** appears as the primary action only when a caption generation callback is configured through the configuration builder's `captionsGeneration(_:)` method — the [Auto Captions](../user-interface/ai-integration/auto-captions.md) plugin provides one backed by speech-to-text transcription. The action stays disabled while the scene has no audio or video content to transcribe.

While generation runs, the three actions are replaced by a **Generating Captions** state with a **Cancel** button. The title stays **Add Captions**, because nothing is created until the transcription returns — cancelling, or dismissing the sheet, leaves the scene untouched.

### Editing a Caption

Tap a caption card to edit it. The whole card responds, not just the text, and one tap places the cursor and raises the keyboard — there is no separate select-then-edit step. The same tap rings the card in the accent color, pauses playback, and moves the playhead to that caption so the canvas previews it. Entering a caption parks the cursor at the end of its text.

While you are editing, taps inside the card place the cursor. Tapping a different card moves editing there in a single tap and saves the caption you were editing. Tapping the empty space around the list — the margins, the gaps between cards, or below the last one — saves the current caption, dismisses the keyboard, and clears the ring.

### The Keyboard Action Bar

While you edit a caption, an action bar floats above the keyboard:

- A red trash button, **Delete caption**, removes the caption and moves editing to the one below it, with the cursor at the start of its text. On the last caption editing falls back to the caption above instead, with the cursor at the end of its text. Deleting the only caption ends editing and returns the sheet to its **Add Captions** state.
- An ellipsis button, **More**, opens the structural operations: **Merge with previous**, **Split at cursor**, and **Add new below**. **Merge with previous** is disabled on the first caption.
- Up and down arrows, **Previous Caption** and **Next Caption**, move editing to the caption above or below and save the one you were editing. They dim on the first and last caption respectively.
- **Done** ends editing and dismisses the keyboard. It does not close the sheet — the sheet keeps its own dismiss control in the navigation bar.

Only **Done** and the menu items carry visible text; the trash, the ellipsis, and the arrows are icons that announce those labels to VoiceOver. The whole bar is disabled while a caption is being created, imported, or generated.

**Split at cursor** does exactly that: the text after the cursor moves into a new caption below, which opens for editing with the cursor at the cut, and the original duration is divided between the two in proportion to the character split. Because entering a caption parks the cursor at the end, tapping **Split at cursor** immediately after tapping into a caption appends a new empty caption below instead of dividing one.

### Return and Backspace

Return and Backspace are structural inside a caption field. Return never inserts a line break:

- Return with the cursor inside the text splits the caption there, exactly as **Split at cursor** does — the tail opens for editing with the cursor at the cut, so typing carries on where you left off.
- Return with the cursor at the end of the text, including in an empty caption, adds a new empty caption below and moves editing to it.
- Return with the cursor at the very start of a caption that already has text does nothing. No line break is typed and no caption is created above.
- Backspace with the cursor at the very start of a caption that has text merges it into the caption above, leaving the cursor at the join. On the first caption there is nothing above, so the key does nothing.
- Backspace in an empty caption deletes it and continues editing at the end of the caption above. An empty first caption has nothing above it, so it is deleted and editing ends.
- Backspace anywhere else in the text, or over a selection, deletes characters as usual.

Only a typed Return is structural. Pasting text that contains line breaks inserts it verbatim, and an input method confirming a composition — CJK input, dictation — is handled normally, so multi-line captions remain possible by pasting. The field wraps to at most three lines and scrolls beyond that.

A split is refused silently when it would leave either side empty, or when the cut point falls inside a single character such as an emoji. The caption is left unchanged.

### Swipe Actions

Swipe a caption from its trailing edge for **Merge with previous**, **Add new below**, and **Delete caption**. Full swipe is off, so a hurried gesture cannot destroy a caption outright. **Merge with previous** is omitted on the first caption, and **Split at cursor** is deliberately absent — the cursor only exists while a caption is being edited, so it stays on the keyboard bar.

Swipe actions are withdrawn entirely while any caption is being edited; the keyboard bar is the way in. VoiceOver reaches the same operations as row actions on each card: **Edit**, **Merge with previous**, **Add new below**, and **Delete caption**.

### The List Footer

At the end of the list, **Add New Caption** appends a caption after the last one and opens it for editing. The red **Delete All Captions** asks first: tapping it ends any edit in progress — the keyboard drops and what you typed is saved — then raises a **Delete all captions?** alert reading "Every caption will be removed from the video." **Delete All** removes every caption and returns the sheet to its **Add Captions** state. **Cancel** dismisses the alert with every caption intact, including the edit that was just saved, and editing does not resume.

Each caption operation — create, split, merge, delete, delete all, import — commits a single undo step, so one undo reverts the whole operation. Text you type commits as its own step when editing ends or just before a bar action runs.

## Importing Subtitle Files

**Import File** limits the picker to SubRip (`.srt`) and WebVTT (`.vtt`) files. Caption timing comes from the file's cues, and a successful import replaces any existing captions as a single undo step.

WebVTT has a native system type (`org.w3.webvtt`) and needs no setup. SubRip has no system type — declare it in your app's `Info.plist` so the picker resolves `.srt` to a named type rather than a dynamic one:

```xml
<key>UTImportedTypeDeclarations</key>
<array>
  <dict>
    <key>UTTypeIdentifier</key>
    <string>ly.img.subrip</string>
    <key>UTTypeDescription</key>
    <string>SubRip Subtitle</string>
    <key>UTTypeConformsTo</key>
    <array>
      <string>public.text</string>
    </array>
    <key>UTTypeTagSpecification</key>
    <dict>
      <key>public.filename-extension</key>
      <array>
        <string>srt</string>
      </array>
      <key>public.mime-type</key>
      <array>
        <string>application/x-subrip</string>
        <string>text/srt</string>
      </array>
    </dict>
  </dict>
</array>
```

The sheet reports import failures in dedicated alerts: unsupported file formats, files that contain no captions, and damaged or unreadable files. Captions need no privacy usage-description keys — importing runs through the system file picker, which requires no permission prompt. The declaration above registers a file type; it is not a permission.

## The Timeline Caption Lane

Each caption appears as its own clip on a dedicated caption lane. The lane is the topmost track in the timeline — it starts directly below the ruler, above every other track — and it scrolls with the other tracks instead of staying pinned in place. It appears with the first caption and collapses once the last caption is removed.

- Trimming a caption clip changes its timing without moving its neighbors — the edges clamp against the previous and next caption instead of pushing them.
- Dragging a caption slides it along the lane to a new start time.
- Captions stay on their lane: they can't move into other tracks, and other clips can't be dropped into the caption lane.
- Selecting a caption clip scrolls the lane into view, so a caption above or below the visible tracks is revealed rather than silently selected off-screen.

## Styling Captions

The **Style** inspector button opens the caption preset grid, fed by the `ly.img.caption.presets` asset source. The source ships pre-registered with the default video asset sources, so presets work without extra setup. Tapping a preset applies it to the selected caption and the engine syncs the style to every caption on the track; the grid highlights the applied preset.

The other inspector styling tools behave the same way: Format (font, size, alignment, spacing), Fill & Stroke and Text Background each change every caption on the track, keeping the subtitles consistent. Text and timing remain per-caption.

Animations are the exception, and are not offered for captions. The engine animates a caption block happily, but it does not sync animations across a track the way it syncs style — so each caption would animate on its own rather than as one set of subtitles. Headless callers can still apply `createAnimation` and `setInAnimation` to a caption directly.

Captions render like any other design block, so exported videos include them burned in.

## API Reference

| API | Purpose |
| --- | --- |
| `Dock.Buttons.captions(action:title:icon:isEnabled:isVisible:)` | Dock button that opens the captions sheet |
| `InspectorBar.Buttons.editCaptions(action:title:icon:isEnabled:isVisible:)` | Inspector bar button that reopens the captions sheet; visible for caption selections |
| `InspectorBar.Buttons.captionStyle(action:title:icon:isEnabled:isVisible:)` | Inspector bar button that opens the caption style preset grid; visible for caption selections while `ly.img.caption.presets` is registered |
| `InspectorBar.Buttons.split(action:title:icon:isEnabled:isVisible:)` | Inspector bar button that splits the selected caption at the playhead, snapping the cut to the nearest word gap; for caption selections it is enabled only while the playhead sits more than 0.1 seconds from either edge of the caption |
| `SheetType.captions(style:)` | The captions sheet; opens at the small detent and can be dragged to medium and large |
| `SheetType.captionStyle(style:id:)` | The style preset sheet for a caption block |
| `EditorConfiguration.Builder.captionsGeneration(_:)` | Registers the callback that backs the sheet's Generate Automatically action |

## Next Steps

- [Update Caption Presets](../create-video/update-caption-presets.md) — Extend the caption style presets with custom styles using content.json updates
- [Dock](../user-interface/customization/dock.md) — Configure the dock area to show or hide tools, panels, or quick access actions
- [Inspector Bar](../user-interface/customization/inspector-bar.md) — Customize the inspector bar for editing properties like position, color, and size
- [Auto Captions](../user-interface/ai-integration/auto-captions.md) — Integrate automatic caption generation using the Auto Captions plugin with pluggable speech-to-text providers



---

## More Resources

- **[iOS Documentation Index](https://img.ly/docs/cesdk/ios/)** - Browse all iOS documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/ios/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/ios/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support