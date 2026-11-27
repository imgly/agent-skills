# EditorLayout

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.configuration`

How the editor arranges the canvas and the editing controls. Set it via EditorConfigurationBuilder.layout. New values can be added in a minor release, so compare a value with ==, or give a when over this type an else branch.

```kotlin
enum EditorLayout : Enum<EditorLayout>
```


## Members

### SIDE_BY_SIDE

```kotlin
enum entry SIDE_BY_SIDE
```

The canvas fills the leading half of the editor. The bottom panel and the dock form a column on the trailing half, and the inspector bar replaces the dock in that column while a block is selected. Sheets open in the column. The navigation bar stays on top, across the full width. In a right-to-left layout the column is on the left. This layout applies on an editor that has a visible bottom panel, such as the video editor, is at least 600 dp wide and is at least three quarters as wide as it is tall. So a phone in landscape, an open foldable and a tablet in landscape show this layout. Otherwise the editor shows STACKED: a phone in portrait, a folded foldable in portrait and a tablet narrower t…

### STACKED

```kotlin
enum entry STACKED
```

The canvas fills the editor, and the bottom panel and the dock sit at the bottom. This is the default.

### entries

```kotlin
val entries: EnumEntries<EditorLayout>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): EditorLayout
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<EditorLayout>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
