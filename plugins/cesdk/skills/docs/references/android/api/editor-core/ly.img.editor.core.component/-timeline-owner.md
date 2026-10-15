# TimelineOwner

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Renders the editor's Timeline component and its built-in add buttons.

```kotlin
@Stable
interface TimelineOwner
```


## Members

### AddAudioButtonContent

```kotlin
@Composable
abstract fun AddAudioButtonContent(button: Timeline.AddAudioButton)
```

Renders the contents of the built-in "Add Audio" button.

### AddClipButtonContent

```kotlin
@Composable
abstract fun AddClipButtonContent(button: Timeline.AddClipButton)
```

Renders the contents of the built-in "Add Clip" button.

### TimelineContent

```kotlin
@Composable
abstract fun TimelineContent(addClipButton: EditorComponent<*>?, addAudioButton: EditorComponent<*>?, headerListBuilder: HorizontalListBuilder<EditorComponent<*>>, height: TimelineHeight, expanded: Boolean)
```

Renders the timeline for the given configuration.
