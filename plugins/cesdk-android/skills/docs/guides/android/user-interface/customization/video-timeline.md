> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [User Interface](../../user-interface.md) > [Customization](../customization.md) > [Video Timeline](./video-timeline.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-configuration-timeline/TimelineCustomizationSolution.kt reference-only
import androidx.compose.foundation.layout.size
import androidx.compose.runtime.Composable
import androidx.compose.runtime.MutableState
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import ly.img.editor.Editor
import ly.img.editor.core.component.Button
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorComponent
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.HorizontalListBuilder
import ly.img.editor.core.component.Timeline
import ly.img.editor.core.component.UnalignedListBuilder
import ly.img.editor.core.component.data.TimelineHeight
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberAddAudio
import ly.img.editor.core.component.rememberAddClip
import ly.img.editor.core.component.rememberAudiosLibrary
import ly.img.editor.core.component.rememberCamera
import ly.img.editor.core.component.rememberGallery
import ly.img.editor.core.component.rememberImglyCamera
import ly.img.editor.core.component.rememberLibrary
import ly.img.editor.core.component.rememberLoop
import ly.img.editor.core.component.rememberMusic
import ly.img.editor.core.component.rememberOverlaysLibrary
import ly.img.editor.core.component.rememberPlayPause
import ly.img.editor.core.component.rememberResizeAll
import ly.img.editor.core.component.rememberStickersAndShapesLibrary
import ly.img.editor.core.component.rememberSystemGallery
import ly.img.editor.core.component.rememberTextLibrary
import ly.img.editor.core.component.rememberTimecode
import ly.img.editor.core.component.rememberToggleExpanded
import ly.img.editor.core.component.rememberVoiceoverRecord
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.event.EditorEvent
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.LibraryElements
import ly.img.editor.core.iconpack.Music
import ly.img.editor.core.iconpack.VolumeHigh
import ly.img.editor.core.state.EditorViewMode

object AddStockFootage : EditorEvent

// Add this composable to your NavHost
@Composable
fun TimelineCustomizationSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    // Note that the value is reset on configuration changes.
    // Default implementation uses editorContext.mutableStateOf which survives configuration changes.
    val isTimelineExpanded = remember { mutableStateOf(false) }

    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember {
                bottomPanel = { rememberCustomizedTimeline(expandedState = isTimelineExpanded) }

                // Demo scaffolding, not part of the lesson: the dock a video editor usually offers,
                // so there is media to arrange on the timeline.
                dock = { rememberVideoDock() }
            }
        },
        onClose = onClose,
    )
}

@Composable
private fun rememberVideoDock() = Dock.remember {
    listBuilder = {
        Dock.ListBuilder.remember {
            add { Dock.Button.rememberSystemGallery() }
            add { Dock.Button.rememberImglyCamera() }
            add { Dock.Button.rememberOverlaysLibrary() }
            add { Dock.Button.rememberTextLibrary() }
            add { Dock.Button.rememberStickersAndShapesLibrary() }
            add { Dock.Button.rememberAudiosLibrary() }
            add { Dock.Button.rememberVoiceoverRecord() }
            add { Dock.Button.rememberResizeAll() }
        }
    }
}

@Composable
private fun rememberCustomizedTimeline(expandedState: MutableState<Boolean>) = Timeline.remember {
    // Your own state decides whether the timeline starts expanded. The expand/collapse toggle
    // writes back to it, so this value keeps matching what is on screen.
    scope = {
        remember(this) {
            Timeline.Scope(parentScope = this, expandedState = expandedState)
        }
    }

    addClipButton = {
        Timeline.Button.rememberAddClip {
            optionsBuilder = {
                UnalignedListBuilder.remember {
                    add { Timeline.AddClipOption.rememberCamera() }
                    add { Timeline.AddClipOption.rememberLibrary() }
                    add {
                        Timeline.AddClipOption.remember {
                            id = { EditorComponentId("my.company.timeline.addClip.stockFootage") }
                            vectorIcon = { IconPack.LibraryElements }
                            textString = { "Stock Footage" }
                            onClick = { editorContext.eventHandler.send(AddStockFootage) }
                        }
                    }
                }
            }
        }
    }

    addAudioButton = {
        Timeline.Button.rememberAddAudio {
            optionsBuilder = {
                UnalignedListBuilder.remember {
                    add { Timeline.AddAudioOption.rememberMusic() }
                }
            }
        }
    }

    // The timeline renders tracks alone, so the header is declared rather than modified.
    headerListBuilder = {
        Timeline.HeaderListBuilder.remember {
            aligned(alignment = Alignment.Start) {
                add { Timeline.Label.rememberTimecode() }
            }
            aligned(alignment = Alignment.CenterHorizontally) {
                add { Timeline.Button.rememberPlayPause() }
            }
            aligned(alignment = Alignment.End) {
                add { rememberMuteButton() }
                add { Timeline.Button.rememberToggleExpanded() }
            }
        }
    }

    // Grow to at most three overlay tracks. This is the default.
    height = { TimelineHeight.Dynamic(maximumTracks = 3) }
    // Or pin the timeline to exactly two overlay tracks:
    // height = { TimelineHeight.Fixed(tracks = 2) }
}

@Composable
private fun rememberMuteButton(): Button<Timeline.ItemScope> {
    var muted by remember { mutableStateOf(false) }
    return Button.remember(::timelineHeaderButtonBuilder) {
        id = { EditorComponentId("my.company.timeline.button.mute") }
        vectorIcon = { IconPack.VolumeHigh }
        contentDescription = { if (muted) "Unmute" else "Mute" }
        onClick = { muted = muted.not() }
    }
}

private fun timelineHeaderButtonBuilder() = Timeline.ButtonBuilder()

@Composable
fun rememberRestatedAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        UnalignedListBuilder.remember {
            add {
                // Reordered, and the gallery source keeps its icon while its label changes.
                Timeline.AddClipOption.rememberGallery {
                    textString = { "From Device" }
                }
            }
            add {
                // A built-in source keeps its label and icon while its behavior is replaced.
                Timeline.AddClipOption.rememberCamera {
                    onClick = { editorContext.eventHandler.send(AddStockFootage) }
                }
            }
            add {
                Timeline.AddClipOption.rememberLibrary()
            }
        }
    }
}

@Composable
fun rememberConditionalAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        val state by editorContext.state.collectAsState()
        UnalignedListBuilder.remember {
            // The options lambda is re-evaluated on recomposition, so read state inside it
            // rather than capturing a value from the caller.
            if (state.viewMode is EditorViewMode.Edit) {
                add { Timeline.AddClipOption.rememberCamera() }
            }
            add { Timeline.AddClipOption.rememberLibrary() }
        }
    }
}

@Composable
fun rememberSingleSourceAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        UnalignedListBuilder.remember {
            add { Timeline.AddClipOption.rememberLibrary() }
        }
    }
}

// The lane sizes a replacement to one track row, so drop the header button's square touch target.
@Composable
fun rememberCustomAddAudioButton() = Button.remember(Timeline::ButtonBuilder) {
    modifier = { Modifier.size(width = 96.dp, height = 40.dp) }
    id = { EditorComponentId("my.company.timeline.button.soundtrack") }
    vectorIcon = { IconPack.Music }
    textString = { "Soundtrack" }
    onClick = { editorContext.eventHandler.send(AddStockFootage) }
}

@Composable
fun rememberDeclaredHeader(): HorizontalListBuilder<EditorComponent<*>> = Timeline.HeaderListBuilder.remember {
    aligned(alignment = Alignment.Start) {
        add { Timeline.Label.rememberTimecode() }
    }
    aligned(alignment = Alignment.CenterHorizontally) {
        add { Timeline.Button.rememberPlayPause() }
    }
    aligned(alignment = Alignment.End) {
        add { Timeline.Button.rememberLoop() }
        add { Timeline.Button.rememberToggleExpanded() }
    }
}

// The defaults are already bare: no header, and no lane buttons. An empty header removes the
// player bar with it, and the tracks keep rendering.
@Composable
fun rememberBareTimeline() = Timeline.remember()
```

Customize the video timeline — the playback and arrangement surface below the
canvas — by configuring its add-content buttons, header, height, and expanded
state instead of rebuilding it.

![The timeline with a customized header and an Add Clip menu offering a custom source](https://img.ly/docs/cesdk/android/user-interface/customization/video-timeline-7a0400/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.84.0-nightly.20260919/editor-guides-configuration-timeline)

## Timeline Architecture

`Timeline` is both the component you mount and the namespace for everything that customizes it. It renders three configurable surfaces:

- The **header** above the ruler, holding the timecode, playback controls, and the expand/collapse toggle.
- The **"Add Clip" button** in the background lane, after the last clip of the main sequence.
- The **"Add Audio" button** at the foot of the overlay stack, below the overlay tracks.

**Key types:**

- **`TimelineBuilder`** — the builder `Timeline.remember` hands you. It exposes `addClipButton`, `addAudioButton`, `headerListBuilder`, `height`, and `scope`.
- **`Timeline.Scope`** — the timeline scope, constructed with its parent scope and a `MutableState<Boolean>` for the expanded state.
- **`Timeline.ItemScope`** — the scope every header item and lane button is built in. `editorContext` reaches the engine, the event handler, and the editor state from there.
- **`Timeline.AddClipOption`** / **`Timeline.AddAudioOption`** — the entries the two lane buttons offer. Each is an ordinary editor component, so it takes the same `vectorIcon`, `textString`, `enabled` and `visible` properties as a dock button.
- **`Timeline.AddClipButtonBuilder`** / **`Timeline.AddAudioButtonBuilder`** — configure each lane button, including its `optionsBuilder`. Use `UnalignedListBuilder.remember` and `add { ... }` to declare the menu entries.
- **`TimelineHeight`** — `Dynamic` or `Fixed`, counted in track rows.

Each property is a lambda evaluated during composition, so what the timeline shows can follow editor state rather than being fixed when the editor is created.

## Configuration

Mount the timeline as the editor's bottom panel. `Timeline.remember` builds the component, which renders its tracks and nothing else: no header, and no lane buttons. Each section below turns one of those surfaces on. The video starter kit does the same, so its timeline is a configuration rather than a separate component.

```kotlin highlight-android-bottom-panel
bottomPanel = { rememberCustomizedTimeline(expandedState = isTimelineExpanded) }
```

That timeline is built by a `Timeline.remember` block, and every section below sets one property on its builder:

```kotlin highlight-android-timeline-builder
@Composable
private fun rememberCustomizedTimeline(expandedState: MutableState<Boolean>) = Timeline.remember {
```

The builder block runs once, so avoid reassigning properties conditionally inside it. Read changing values inside the individual property lambdas instead — those re-evaluate on recomposition. The [Configuration](../../configuration.md) guide covers how `EditorConfiguration` sets up the editor as a whole, and the [Video Editor Starter Kit](../../starterkits/video-editor.md) shows the complete editor surface this timeline sits in.

## Device Permissions

The default add-content options reach two capabilities Android gates behind a runtime prompt: `Timeline.AddClipOption.rememberCamera()` records through the camera, and `Timeline.AddAudioOption.rememberVoiceover()` records through the microphone.

The CE.SDK camera module declares `android.permission.CAMERA` and `android.permission.RECORD_AUDIO` in its own manifest, so manifest merging adds them to your app and you do not declare them yourself. The camera and voiceover flows request the runtime grant when the user first opens them.

Device media is your app's responsibility. `Timeline.AddClipOption.rememberGallery()` opens the library's gallery source, which reads the device's media store, so declare the `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`, and `READ_MEDIA_AUDIO` permissions your minimum SDK requires — plus `READ_MEDIA_VISUAL_USER_SELECTED` to support partial access, where the user grants only selected items rather than the whole library.

## Add Clip Sources

The "Add Clip" button opens a menu of sources that add to the background track. `Timeline.Button.rememberAddClip` decides which sources it offers. There are three built-in ones — `rememberCamera()`, `rememberGallery()`, and `rememberLibrary()`. The button offers camera plus library by default.

To customize the menu, set `optionsBuilder` to an `UnalignedListBuilder.remember` block and declare each entry with `add { ... }`, in display order. Menu entries do not use the header's `aligned { ... }` groups. This example includes camera, library, and a custom stock-footage source:

```kotlin highlight-android-add-clip
addClipButton = {
    Timeline.Button.rememberAddClip {
        optionsBuilder = {
            UnalignedListBuilder.remember {
                add { Timeline.AddClipOption.rememberCamera() }
                add { Timeline.AddClipOption.rememberLibrary() }
                add {
                    Timeline.AddClipOption.remember {
                        id = { EditorComponentId("my.company.timeline.addClip.stockFootage") }
                        vectorIcon = { IconPack.LibraryElements }
                        textString = { "Stock Footage" }
                        onClick = { editorContext.eventHandler.send(AddStockFootage) }
                    }
                }
            }
        }
    }
}
```

A custom source's `onClick` runs in the editor scope, so it can reach the engine, the configured asset library, and the event handler through `editorContext`. Sending your own event keeps the picker logic in your configuration:

```kotlin highlight-android-custom-event
object AddStockFootage : EditorEvent
```

Every built-in source carries a stable id — `Timeline.AddClipOption.Id.camera`, `.gallery`, `.library`, and `Timeline.AddAudioOption.Id.music` / `.voiceover` for the audio ones. Use them to find a source in a list, or to give a replacement the same identity.

### Reorder, Relabel, and Replace Behavior

List the sources yourself to control the order or drop one. Each built-in factory accepts a builder with `icon`, `vectorIcon`, `text`, `textString`, and `onClick` properties, so a source can keep its behavior while its presentation changes, or keep its presentation while its behavior changes:

```kotlin highlight-android-add-clip-restated
@Composable
fun rememberRestatedAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        UnalignedListBuilder.remember {
            add {
                // Reordered, and the gallery source keeps its icon while its label changes.
                Timeline.AddClipOption.rememberGallery {
                    textString = { "From Device" }
                }
            }
            add {
                // A built-in source keeps its label and icon while its behavior is replaced.
                Timeline.AddClipOption.rememberCamera {
                    onClick = { editorContext.eventHandler.send(AddStockFootage) }
                }
            }
            add {
                Timeline.AddClipOption.rememberLibrary()
            }
        }
    }
}
```

> **Caution:** Assigning `optionsBuilder` replaces the default menu. Leave it unset when you
> want the built-in sources and any defaults added in future releases.

### Hide a Source Conditionally

Read editor state inside `optionsBuilder` and conditionally call `add { ... }` to include a source:

```kotlin highlight-android-add-clip-conditional
@Composable
fun rememberConditionalAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        val state by editorContext.state.collectAsState()
        UnalignedListBuilder.remember {
            // The options lambda is re-evaluated on recomposition, so read state inside it
            // rather than capturing a value from the caller.
            if (state.viewMode is EditorViewMode.Edit) {
                add { Timeline.AddClipOption.rememberCamera() }
            }
            add { Timeline.AddClipOption.rememberLibrary() }
        }
    }
}
```

### One Source Instead of a Menu

When only one source remains, the button performs it directly on tap instead of opening a menu and uses that source's text as its label. Set the button's `textString` to override this automatic label. This example opens the asset library directly:

```kotlin highlight-android-add-clip-single
@Composable
fun rememberSingleSourceAddClipButton() = Timeline.Button.rememberAddClip {
    optionsBuilder = {
        UnalignedListBuilder.remember {
            add { Timeline.AddClipOption.rememberLibrary() }
        }
    }
}
```

An `UnalignedListBuilder.remember` block with no entries hides the button entirely.

## Add Audio Sources

The "Add Audio" button works the same way. `Timeline.Button.rememberAddAudio` offers `rememberMusic()` and `rememberVoiceover()` by default. Override `optionsBuilder` to change its sources. This example includes only music, so the button uses the music source's label and opens the audio library directly:

```kotlin highlight-android-add-audio
addAudioButton = {
    Timeline.Button.rememberAddAudio {
        optionsBuilder = {
            UnalignedListBuilder.remember {
                add { Timeline.AddAudioOption.rememberMusic() }
            }
        }
    }
}
```

### Replace the Whole Button

Create a custom button with `Button.remember(Timeline::ButtonBuilder)` to give it a `Timeline.ItemScope`. Assign the component returned by `rememberCustomAddAudioButton()` to `addAudioButton`:

```kotlin highlight-android-add-audio-custom
// The lane sizes a replacement to one track row, so drop the header button's square touch target.
@Composable
fun rememberCustomAddAudioButton() = Button.remember(Timeline::ButtonBuilder) {
    modifier = { Modifier.size(width = 96.dp, height = 40.dp) }
    id = { EditorComponentId("my.company.timeline.button.soundtrack") }
    vectorIcon = { IconPack.Music }
    textString = { "Soundtrack" }
    onClick = { editorContext.eventHandler.send(AddStockFootage) }
}
```

The lane sizes a replacement to one track row and reserves its height by row count, so a taller button overflows the lane. Set `modifier` in the button's builder to give it an explicit size, as the example does with `96.dp` by `40.dp`.

## Timeline Header

Header items are grouped by alignment — `Alignment.Start`, `Alignment.CenterHorizontally`, or `Alignment.End`. Each group is positioned independently, so an item's alignment decides which edge it hugs; there is no separate spacer item.

The header is empty until you declare it. The ready-made items are `Timeline.Label.rememberTimecode()`, `Timeline.Button.rememberPlayPause()`, `rememberLoop()`, and `rememberToggleExpanded()`. Each is an editor component with a configurable builder. Play/pause and loop use `Timeline.ButtonBuilder`, which exposes `onClick` and icon properties. Timecode and expand/collapse use `Timeline.ItemBuilder`; customize their rendered content through `decoration` or hide them with `visible`. The timecode displays a value and has no action, so it sits under `Timeline.Label` rather than `Timeline.Button`.

### Declare the Header

Declare the items you want, grouped by alignment. A centered group is centered as a whole, so keep one item in it — otherwise that item will not sit in the middle of the header:

```kotlin highlight-android-modify-header
// The timeline renders tracks alone, so the header is declared rather than modified.
headerListBuilder = {
    Timeline.HeaderListBuilder.remember {
        aligned(alignment = Alignment.Start) {
            add { Timeline.Label.rememberTimecode() }
        }
        aligned(alignment = Alignment.CenterHorizontally) {
            add { Timeline.Button.rememberPlayPause() }
        }
        aligned(alignment = Alignment.End) {
            add { rememberMuteButton() }
            add { Timeline.Button.rememberToggleExpanded() }
        }
    }
}
```

Prefer the alignment-anchored operations over `addAfter(id=)` and `addBefore(id=)` when the position only has to be "at this edge". The id-anchored operations fail when the item they name is absent, which is what happens once a built-in item you anchored on is removed or renamed. Pass `failIfNotFound = false` to make an anchored operation tolerate that.

A custom header item is an ordinary editor component, so it can hold its own state:

```kotlin highlight-android-custom-header-item
@Composable
private fun rememberMuteButton(): Button<Timeline.ItemScope> {
    var muted by remember { mutableStateOf(false) }
    return Button.remember(::timelineHeaderButtonBuilder) {
        id = { EditorComponentId("my.company.timeline.button.mute") }
        vectorIcon = { IconPack.VolumeHigh }
        contentDescription = { if (muted) "Unmute" else "Mute" }
        onClick = { muted = muted.not() }
    }
}

private fun timelineHeaderButtonBuilder() = Timeline.ButtonBuilder()
```

### Declare the Header Outright

Assign a list builder to `headerListBuilder` to declare the header from the groups you want:

```kotlin highlight-android-header
@Composable
fun rememberDeclaredHeader(): HorizontalListBuilder<EditorComponent<*>> = Timeline.HeaderListBuilder.remember {
    aligned(alignment = Alignment.Start) {
        add { Timeline.Label.rememberTimecode() }
    }
    aligned(alignment = Alignment.CenterHorizontally) {
        add { Timeline.Button.rememberPlayPause() }
    }
    aligned(alignment = Alignment.End) {
        add { Timeline.Button.rememberLoop() }
        add { Timeline.Button.rememberToggleExpanded() }
    }
}
```

## Remove a Surface

None of the three surfaces is present until you add it, so the bare component already renders tracks alone. Leaving `addAudioButton` unset also lets the timeline reclaim the row that button would occupy, and an empty header renders no player bar rather than an empty strip:

```kotlin highlight-android-remove
// The defaults are already bare: no header, and no lane buttons. An empty header removes the
// player bar with it, and the tracks keep rendering.
@Composable
fun rememberBareTimeline() = Timeline.remember()
```

## Timeline Height

The timeline's height is expressed in track rows rather than pixels. The count covers the rows stacked above the background track — the overlay tracks, plus the caption lane when the scene has one. The background track is always shown and is never counted.

`TimelineHeight.Dynamic` is the default. The timeline hugs its rows and grows to at most `maximumTracks`. `TimelineHeight.Fixed` sizes the timeline to show exactly that many rows and stops auto-resizing — `0` still shows the background track, and negative values are clamped to `0`:

```kotlin highlight-android-height
// Grow to at most three overlay tracks. This is the default.
height = { TimelineHeight.Dynamic(maximumTracks = 3) }
// Or pin the timeline to exactly two overlay tracks:
// height = { TimelineHeight.Fixed(tracks = 2) }
```

Because `height` is a lambda, it can follow editor state rather than being a constant.

## Expanded State

By default the editor owns the expanded state, which starts expanded and survives configuration changes. To provide your own `MutableState<Boolean>`, override the builder's `scope` and construct `Timeline.Scope(parentScope = this, expandedState = expandedState)`. Remember that scope using the parent scope as its key:

```kotlin highlight-android-expanded
// Your own state decides whether the timeline starts expanded. The expand/collapse toggle
// writes back to it, so this value keeps matching what is on screen.
scope = {
    remember(this) {
        Timeline.Scope(parentScope = this, expandedState = expandedState)
    }
}
```

The example passes a state initialized to `false`, so the timeline starts collapsed. Within the timeline and its item scopes, `editorContext.expandedState` exposes that same state. It stays in sync in both directions: writing to it expands or collapses the timeline, and the user's own toggle writes back. Collapsing leaves the header visible and hides the tracks below it.

The example creates this state with `remember`. Use `rememberSaveable` instead if your custom expanded state should survive configuration changes.

## API Reference

### Methods

| Method | Description |
| --- | --- |
| `Timeline.remember(builder=_)` | Builds the timeline component, mounted as bottom-panel content |
| `Timeline.Button.rememberAddClip(builder=_)` | The "Add Clip" button with the given sources |
| `Timeline.Button.rememberAddAudio(builder=_)` | The "Add Audio" button with the given sources |
| `Timeline.Label.rememberTimecode(builder=_)` | Header label showing the playhead position and total duration |
| `Timeline.Button.rememberPlayPause(builder=_)` | Header play/pause button |
| `Timeline.Button.rememberLoop(builder=_)` | Header looping toggle |
| `Timeline.Button.rememberToggleExpanded(builder=_)` | Header expand/collapse toggle |
| `Timeline.HeaderListBuilder.remember(builder=_)` | Declares the header from alignment groups |
| `UnalignedListBuilder.remember(builder=_)` | Declares a lane button's menu entries |
| `add(block=_)` | Appends a menu entry or header item |
| `Timeline.Scope(parentScope=_, expandedState=_)` | Creates a timeline scope using the supplied expanded state |
| `Button.remember(builderFactory=_, builder=_)` | Builds a custom header or lane button |
| `Timeline.AddClipOption.rememberCamera(builder=_)` | Records a clip with the camera |
| `Timeline.AddClipOption.rememberGallery(builder=_)` | Opens the asset library's device gallery |
| `Timeline.AddClipOption.rememberLibrary(builder=_)` | Opens the asset library |
| `Timeline.AddClipOption.remember(builder=_)` | A custom clip source |
| `Timeline.AddAudioOption.rememberMusic(builder=_)` | Opens the audio asset library |
| `Timeline.AddAudioOption.rememberVoiceover(builder=_)` | Starts a voiceover recording |
| `Timeline.AddAudioOption.remember(builder=_)` | A custom audio source |
| `remove(id=_, failIfNotFound=_)` | Removes a header item by id |
| `addFirst(alignment=_, block=_)` | Prepends a header item to an alignment group |
| `editorContext.eventHandler.send(event=_)` | Sends an editor event from an option or button |

### Properties

Builder properties below are assigned through composable lambdas; the types shown are their return values.

| Property | Type | Description |
| --- | --- | --- |
| `addClipButton` | `EditorComponent<*>?` | The "Add Clip" button. `null`, the default, shows none |
| `addAudioButton` | `EditorComponent<*>?` | The "Add Audio" button. `null`, the default, shows none |
| `headerListBuilder` | `HorizontalListBuilder<EditorComponent<*>>` | The header above the ruler. Empty by default |
| `height` | `TimelineHeight` | `Dynamic(maximumTracks=3)` by default, or `Fixed(tracks=_)` |
| `scope` | `Timeline.Scope` | The timeline scope. Construct it with your own expanded state to drive and observe expansion |

The following properties belong to the lane button builders and timeline scopes:

| Property | Type | Description |
| --- | --- | --- |
| `Timeline.AddClipButtonBuilder.optionsBuilder` | `UnalignedListBuilder<Timeline.AddClipOption>` | Clip menu entries; camera plus library by default |
| `Timeline.AddAudioButtonBuilder.optionsBuilder` | `UnalignedListBuilder<Timeline.AddAudioOption>` | Audio menu entries; music plus voiceover by default |
| `textString` | `String` | Lane button label override; otherwise a single source supplies its own label |
| `editorContext.expandedState` | `MutableState<Boolean>` | Expanded state available within `Timeline.Scope` and `Timeline.ItemScope` |

Built-in components expose stable ids:

| Property | Type | Description |
| --- | --- | --- |
| `Timeline.Button.Id.loop` | `EditorComponentId` | Id constants for the built-in header items |
| `Timeline.AddClipOption.Id.camera` | `EditorComponentId` | Id constants for the built-in clip sources |
| `Timeline.AddAudioOption.Id.music` | `EditorComponentId` | Id constants for the built-in audio sources |

## Next Steps

- [Timeline Editor](../../create-video/timeline-editor.md) — Build and edit timelines programmatically with the engine.
- [Record Voiceover](../../create-audio/audio/record-voiceover.md) — The recording flow behind the voiceover add-audio source.
- [Hide Elements](./hide-elements.md) — Remove editor items your integration does not need&#x20;
- [Dock](./dock.md) — Bottom toolbar that opens asset libraries and sheets.
- [Inspector Bar](./inspector-bar.md) — Contextual toolbar for the selected block.
- [Navigation Bar](./navigation-bar.md) — Top bar configuration.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support