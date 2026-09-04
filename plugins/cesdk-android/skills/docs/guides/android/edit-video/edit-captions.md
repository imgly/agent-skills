> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Edit Captions](./edit-captions.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-create-video-edit-captions/EditCaptionsSolution.kt reference-only
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.callback.onCreate
import ly.img.editor.configuration.video.callback.onLoadAssetSources
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.InspectorBar
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberAudiosLibrary
import ly.img.editor.core.component.rememberCaptionStyle
import ly.img.editor.core.component.rememberCaptions
import ly.img.editor.core.component.rememberDelete
import ly.img.editor.core.component.rememberEditCaptions
import ly.img.editor.core.component.rememberFormatText
import ly.img.editor.core.component.rememberSplit
import ly.img.editor.core.component.rememberSystemGallery
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

// Add this composable to your NavHost.
@Composable
fun EditCaptionsSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    // The Video Editor Starter Kit registers the caption preset source, the Captions dock button and both
    // caption inspector buttons, so captions are available without any configuration of your own.
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder) {
                onCreate = {
                    // Demo scaffolding — not part of the lesson: open a sample clip so the canvas shows
                    // footage behind the captions sheet.
                    onCreate(
                        createScene = {
                            editorContext.engine.scene.createFromVideo(
                                videoUri = editorContext.baseUri
                                    .buildUpon()
                                    .appendPath("ly.img.video")
                                    .appendPath("videos")
                                    .appendPath("pexels-kampus-production-8154913.mp4")
                                    .build(),
                            )
                        },
                    )
                }
            }
        },
        onClose = onClose,
    )
}

/**
 * The three registrations captions need, for a video editor configuration that does not already carry them.
 *
 * Compiled against the starter kit so the sample builds, but written for a configuration without captions —
 * adding a button the list already holds would render it twice.
 */
@Composable
private fun CustomVideoCaptionsSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember(::VideoConfigurationBuilder) {
                onCreate = {
                    onCreate(
                        loadAssetSources = {
                            onLoadAssetSources()
                            editorContext.engine.asset.addLocalSourceFromJSON(
                                contentUri = editorContext.baseUri
                                    .buildUpon()
                                    .appendPath("ly.img.caption.presets")
                                    .appendPath("content.json")
                                    .build(),
                            )
                        },
                    )
                }
                dock = {
                    Dock.remember {
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add { Dock.Button.rememberSystemGallery() }
                                add { Dock.Button.rememberTextLibrary() }
                                add { Dock.Button.rememberCaptions() }
                                add { Dock.Button.rememberAudiosLibrary() }
                            }
                        }
                    }
                }
                inspectorBar = {
                    InspectorBar.remember {
                        listBuilder = {
                            InspectorBar.ListBuilder.remember {
                                add { InspectorBar.Button.rememberEditCaptions() }
                                add { InspectorBar.Button.rememberCaptionStyle() }
                                add { InspectorBar.Button.rememberFormatText() }
                                add { InspectorBar.Button.rememberSplit() }
                                add { InspectorBar.Button.rememberDelete() }
                            }
                        }
                    }
                }
            }
        },
        onClose = onClose,
    )
}
```

Let users add synchronized captions to their videos inside the editor. A dock button opens the
captions sheet for creating, importing, and editing captions, two inspector bar buttons expose
caption editing and style presets, and every caption appears as a clip on a dedicated timeline lane.

![The Android video editor with the Add Captions sheet open over a video clip](https://img.ly/docs/cesdk/android/edit-video/edit-captions-ed9c17/assets/android.hero.webp)

> **Reading time:** 9 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/editor-guides-create-video-edit-captions)

Captions are an editor UI feature for video scenes. Three registrations turn the surface on — a dock button, an asset source, and two inspector bar buttons — and the editor supplies the captions sheet, the timeline caption lane, and preset styling. To build captions programmatically instead, see [Add Captions](./add-captions.md).

The [Video Editor Starter Kit](../starterkits/video-editor.md)'s `VideoConfigurationBuilder` already carries all three, so a video editor built on it has captions without any configuration of your own. The sections below cover each registration for a configuration that doesn't, and describe the surface those registrations produce. The [Configuration](../configuration.md) guide covers editor setup as a whole.

## Understanding Caption Structure

Captions use the same block hierarchy as other video content: a page holds a single caption track, and the track holds one caption block per cue. Each caption stores its own text, time offset, and duration, while styling — font, colors, background, position — synchronizes across every caption on the track, so the subtitles always read as one consistent set. You never manage this hierarchy from the UI: the editor creates the caption track with the first caption and removes it with the last one.

## Adding the Captions Dock Button

`Dock.Button.rememberCaptions()` is what opens the captions sheet, so a dock without it leaves the feature unreachable. Include it in the dock's list:

```kotlin highlight-android-captions-dock
Dock.remember {
    listBuilder = {
        Dock.ListBuilder.remember {
            add { Dock.Button.rememberSystemGallery() }
            add { Dock.Button.rememberTextLibrary() }
            add { Dock.Button.rememberCaptions() }
            add { Dock.Button.rememberAudiosLibrary() }
        }
    }
}
```

The button renders a captions icon with a localized "Captions" label and sends `EditorEvent.Sheet.Open(SheetType.Captions())`. It carries no visibility condition of its own — put it in the docks where captions apply. If you are adding captions to an existing list rather than declaring a new one, `existingListBuilder.modify { addLast { … } }` appends it; check the list doesn't already hold it, because a repeated id renders the button twice.

## Registering the Caption Style Presets

Caption styling comes from the `ly.img.caption.presets` asset source. The starter kit loads it with its other sources; a configuration that builds its own list has to include it, or the Style button stays hidden and new captions are created unstyled:

```kotlin highlight-android-caption-presets-source
onLoadAssetSources()
editorContext.engine.asset.addLocalSourceFromJSON(
    contentUri = editorContext.baseUri
        .buildUpon()
        .appendPath("ly.img.caption.presets")
        .appendPath("content.json")
        .build(),
)
```

`editorContext.baseUri` points at the asset root the editor is already configured with, so the same code works against the CDN and against self-hosted assets. To ship your own caption styles, see [Update Caption Presets](../create-video/update-caption-presets.md).

## Adding the Caption Inspector Buttons

Selecting a caption — tap its clip on the timeline — shows the inspector bar. Add the two caption buttons to its list:

```kotlin highlight-android-captions-inspector-bar
InspectorBar.remember {
    listBuilder = {
        InspectorBar.ListBuilder.remember {
            add { InspectorBar.Button.rememberEditCaptions() }
            add { InspectorBar.Button.rememberCaptionStyle() }
            add { InspectorBar.Button.rememberFormatText() }
            add { InspectorBar.Button.rememberSplit() }
            add { InspectorBar.Button.rememberDelete() }
        }
    }
}
```

- `InspectorBar.Button.rememberEditCaptions()` reopens the captions sheet with the selected caption scrolled into view. It hides itself when the caption's `text/edit` scope is denied — a caption is a text block, and that scope governs the whole sheet, so denying it takes caption editing, deleting, retiming, and importing away together.
- `InspectorBar.Button.rememberCaptionStyle()` opens the caption style presets. It hides itself while `ly.img.caption.presets` is unregistered.

Both buttons appear only while the selected block is a caption. Of the video configuration's own buttons, Duplicate, Layer, and Animations hide themselves for a caption, while Format, Fill & Stroke, Text Background, Split, and Delete stay available. Move as Clip isn't in that list, but it hides for captions too if you add it yourself. The [Inspector Bar](../user-interface/customization/inspector-bar.md) guide lists the full button set and which selections each one renders for.

Selecting a caption on the canvas opens the [Canvas Menu](../user-interface/customization/canvas-menu.md) as usual, minus what a caption cannot do: Duplicate, because the copy would land outside the caption track, and the layer moves, because captions always render above the rest of the page. Delete and the remaining entries stay.

**Split** applies to captions too, cutting the selected caption at the playhead into two captions that together cover exactly the range the original occupied; the new caption inherits the original's style. The cut snaps to the nearest word gap — the position just after a space — so the trailing caption never starts with one. Text with no space to snap to, such as a single long word or an unspaced script, falls back to the nearest character boundary and is cut mid-word. Because the cut lands on the playhead, the button is enabled only while the playhead sits more than 0.1 seconds inside the caption at both ends and the caption holds at least two characters. Captions are exempt from the timeline's one-second minimum clip duration and never raise its "Please move the selected clip under the playhead." or "Can't split because one of the clips would become too short." messages — a split that can't be made simply does nothing.

## Using the Captions Sheet

The sheet's state follows the caption count. With no captions it is titled **Add Captions** and offers the creation actions; as soon as one caption exists it becomes **Edit Captions**, a scrollable list of caption cards. Reopening the sheet later goes straight to the list, and opening it while a caption is selected on the canvas scrolls that row into view. The sheet is sized by its content and grows to full editor height as captions are added and while the keyboard is open.

### Add Captions

- **Create Manually** adds a styled three-second caption at the start of the page timeline, moves the playhead to it, and opens it for editing.
- **Import File** opens the system document picker to choose an SRT or VTT subtitle file.
- **Generate Automatically** appears as the primary action only when the [Auto Captions](../user-interface/ai-integration/auto-captions.md) plugin is installed — the editor looks for it at runtime and leaves the action out otherwise. It stays disabled while the page has no audio or video to transcribe.

While generation runs, the three actions are replaced by a **Generating Captions** state with a **Cancel** button. The title stays **Add Captions**, because nothing is created until the transcription returns, which is what makes **Cancel** leave the scene untouched. Generation belongs to the editor rather than the sheet, so closing the sheet to look at the timeline does not throw the transcription away — reopening finds it still running.

These three actions belong to the empty state only. Once captions exist the sheet shows the list, so re-importing over an existing set means deleting the captions first.

### Editing a Caption

Tap a caption card to edit it. The whole card responds, not just the text, and one tap places the caret and raises the keyboard — there is no separate select-then-edit step. The same tap rings the card in the accent color, and unless the caption is already the canvas selection it also selects it, pauses playback, and moves the playhead to that caption so the canvas previews it. Entering a caption parks the caret at the end of its text. A card whose swipe actions stand open is the exception: the first tap closes the swipe.

Tapping a different card moves editing there in a single tap and saves the caption you were editing. Text reaches the scene when editing ends or just before a structural action runs, never per keystroke, so typing does not fill the undo history.

### The Keyboard Action Bar

While you edit a caption, an action bar floats directly above the keyboard:

- A red trash button, **Delete caption**, removes the caption and moves editing to the one below it, with the caret at the start of its text. On the last caption editing falls back to the caption above instead, with the caret at the end of its text. Deleting the only caption ends editing and returns the sheet to its **Add Captions** state.
- An overflow button, **More**, opens the structural operations: **Merge with previous**, **Split at cursor**, and **Add new below**. **Merge with previous** is omitted on the first caption.
- Up and down arrows, **Previous Caption** and **Next Caption**, move editing to the caption above or below and save the one you were editing. They are disabled on the first and last caption respectively.
- **Done** ends editing, dismisses the keyboard, and clears the accent ring. It does not close the sheet.

Only **Done** and the menu items carry visible text; the trash, the overflow, and the arrows are icons that announce those labels to screen readers. The whole bar is disabled while a caption is being created, imported, or generated.

**Split at cursor** moves the text after the caret into a new caption below, which opens for editing with the caret at the cut, and divides the original duration between the two in proportion to the character split. Because entering a caption parks the caret at the end, tapping **Split at cursor** immediately after tapping into a caption appends a new empty caption below instead of dividing one.

### Return and Backspace

Return and Backspace are structural inside a caption field. Return never inserts a line break:

- Return with the caret inside the text splits the caption there, exactly as **Split at cursor** does — the tail opens for editing with the caret at the cut, so typing carries on where you left off.
- Return with the caret at the end of the text, including in an empty caption, adds a new empty caption below and moves editing to it.
- Return with the caret at the very start of a caption that already has text does nothing. No line break is typed and no caption is created above.
- Backspace with the caret at the very start of a caption that has text merges it into the caption above, joining the two texts with a single space and leaving the caret at the join. On the first caption there is nothing above, so the key does nothing.
- Backspace in an empty caption deletes it and continues editing at the end of the caption above. An empty first caption has nothing above it, so it is deleted and editing ends.
- Backspace anywhere else in the text, or over a selection, deletes characters as usual.

Only a typed Return is structural: it is recognized as one when the change adds exactly one line break immediately behind the caret. A multi-line paste therefore goes in verbatim, and an input method confirming a composition — CJK input, dictation, autocorrect — is handled normally, so a caption can still hold more than one line. A card shows at most three lines of text.

Backspace is read from key events only, because a delete at the start of a field is indistinguishable from a caret move in the text a soft keyboard reports. An input method that does not send `KEYCODE_DEL` therefore leaves merge and delete to the action bar and the row's swipe actions, which reach the same operations.

A split is refused silently when it would leave either side empty, when the cut would fall inside a single user-perceived character such as an emoji, or when either half would come out shorter than a tenth of a second. That last floor guards every split, not just the inspector button that can grey itself out — a caret split near the end of a short caption is refused rather than nudged, so the pair always tiles exactly the range the original occupied. The caption is left unchanged.

### Swipe Actions

Swipe a caption card aside to reveal **Merge with previous**, **Add new below**, and **Delete caption** as icons, with those labels carried as content descriptions. Full swipe is off, so a hurried gesture cannot destroy a caption outright — an action runs only when its icon is tapped, and only one row can stand open at a time. **Merge with previous** is omitted on the first caption.

Swipe actions are withdrawn entirely while a caption is being edited or while another caption operation is still running; the keyboard bar is the way in. Screen readers reach the same three operations as custom actions on each card, so they work without the gesture.

### The List Footer

At the end of the list, **Add New Caption** appends a caption after the last one and opens it for editing. The red **Delete All Captions** asks first: tapping it dismisses the keyboard — saving what you typed — then raises a **Delete all captions?** dialog reading "Every caption will be removed from the video." **Delete All** removes every caption and returns the sheet to its **Add Captions** state. **Cancel** dismisses the dialog with every caption intact.

Each caption operation — create, split, merge, delete, delete all, import, apply a preset — commits a single undo step, so one undo reverts the whole operation.

## Importing Subtitle Files

**Import File** opens the Storage Access Framework picker, so no storage permission is involved. The picker's filter is deliberately wide, because stock Android has no `.vtt` MIME mapping and cloud providers report subtitle files as plain text; the format is decided after the pick, from the file extension, then the MIME type, then a `WEBVTT` signature in the file's bytes, defaulting to SubRip. Only SubRip (`.srt`) and WebVTT (`.vtt`) are recognized, and anything else is rejected by the parser rather than at pick time.

Caption timing comes from the file's cues. An import replaces the page's caption track wholesale and lands as a single undo step. The imported captions are styled with the default preset rather than the look of the captions they replace — an import brings in a whole new track, so there is no style of its own to carry over. An import cannot be cancelled, so its outcome is binary — every cue imported, or nothing changed.

Failures leave the scene exactly as it was and name the cause in a **Couldn't import captions** dialog:

| Message | Cause |
| --- | --- |
| "No captions were found in the file." | The file parsed but held no cues. |
| "This file format isn't supported. Import an SRT or VTT file." | The file is neither SubRip nor WebVTT. |
| "The file couldn't be read. It appears to be damaged or incomplete." | The bytes are truncated or corrupt. |
| "The file couldn't be read. Please try again." | The file could not be opened or copied. |

Anything the engine rejects for another reason falls back to the engine's own message under the same title. Separately, a device with no app able to serve the picker shows a "No app available to complete this action." toast instead of opening it.

## The Timeline Caption Lane

Each caption appears as its own clip on a dedicated caption lane, showing the caption's text. The lane is the topmost track in the timeline — it starts directly below the ruler, above every other track — and it scrolls with the other tracks instead of staying pinned in place. It appears with the first caption and collapses once the last caption is removed.

- Trimming a caption clip changes its timing without moving its neighbors — the edges clamp against the previous and next caption instead of pushing them, so silences elsewhere on the lane survive.
- A caption clip can be trimmed down to 0.1 seconds, where every other clip type stops at one second.
- Dragging a caption slides it along the lane to a new start time, clamped into the gap its neighbors leave. A drop into a gap too small for the caption is refused rather than shortening it.
- Captions stay on their lane: they can't move into other tracks, and no other clip can be dropped onto the lane or into the space above it — so while a scene has captions, dragging a clip to the very top no longer opens a new track.
- Selecting a caption clip scrolls the timeline vertically until the lane is visible, so a caption above the visible tracks is revealed rather than silently selected off screen. The timeline opens scrolled to its last track, so the lane usually needs that scroll or a manual one to come into view.
- Captions never stretch the timeline's ruler past the footage, and they don't appear in the reorder sheet.

## Styling Captions

The **Style** inspector button opens the caption style presets, fed by the `ly.img.caption.presets` asset source. Tapping one applies it to the selected caption and the engine syncs the style to every caption on the track, keeping the caption's own size and placement where it has one. The applied preset stays marked: its asset id is recorded on the caption track, so the grid still shows which one is in use after a scene round-trip, including for tracks authored on another platform.

The first caption on an empty track, and every imported set, starts from **Outline** (`ly.img.caption.presets.outline`). Every later caption is added as a blank copy of its neighbor, so it carries that neighbor's style without touching the rest of the track.

The other inspector styling tools behave the same way: Format (font, size, alignment, spacing), Fill & Stroke, and Text Background each change every caption on the track, keeping the subtitles consistent. Because a caption's text properties always apply to the whole block, Format works on the caption as a unit — there is no per-selection formatting inside a caption, and list styles are unavailable. Text and timing remain per-caption.

Animations are the exception, and the inspector hides them for a caption: the engine animates a caption block but does not sync animations across the track, so choosing one would animate a single subtitle while the rest stayed still. A style preset that carries animations still applies them to every caption, because there the engine writes each sibling itself.

Captions render like any other design block, so exported videos include them burned in.

## API Reference

| API | Purpose |
| --- | --- |
| `EditorConfiguration.remember(builder=_)` | Creates the editor configuration that hosts the captions surface. |
| `Dock.Button.rememberCaptions()` | Dock button that opens the captions sheet. |
| `existingListBuilder.modify { addLast { … } }` | Appends the captions button to the configuration's dock list. |
| `InspectorBar.remember(builder=_)` | Rebuilds the inspector bar so caption buttons are constructed in its item scope. |
| `InspectorBar.Button.rememberEditCaptions()` | Inspector bar button that reopens the captions sheet; visible for caption selections. |
| `InspectorBar.Button.rememberCaptionStyle()` | Inspector bar button that opens the caption style presets; visible for caption selections while `ly.img.caption.presets` is registered. |
| `existingListBuilder.modify { addFirst { … } }` | Prepends the caption buttons to the configuration's inspector bar list. |
| `engine.asset.addLocalSourceFromJSON(contentUri=_)` | Registers the `ly.img.caption.presets` asset source that feeds the style presets. |

## Next Steps

- [Add Captions](./add-captions.md) — Create, import, style, and export caption blocks with the Engine APIs
- [Auto Captions](../user-interface/ai-integration/auto-captions.md) — Generate captions from speech with the Auto Captions plugin
- [Update Caption Presets](../create-video/update-caption-presets.md) — Extend the caption style presets with custom styles using content.json updates
- [Dock](../user-interface/customization/dock.md) — Configure the dock area to show or hide tools, panels, or quick access actions
- [Inspector Bar](../user-interface/customization/inspector-bar.md) — Customize the inspector bar for editing properties like position, color, and size



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support