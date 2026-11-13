# HistoryUpdate

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Describes the kind of update that triggered an EditorApi.onHistoryUpdatedWithKind event. The order of the values must stay in sync with ubq::editor::HistoryUpdate on the C++ side.

```kotlin
enum HistoryUpdate : Enum<HistoryUpdate>
```


## Members

### ACTIVATED

```kotlin
enum entry ACTIVATED
```

A different history buffer was activated via EditorApi.setActiveHistory. The undo/redo stack visible to the user changed, but no new snapshot was created and no undo/redo was applied as part of this event.

### UPDATED

```kotlin
enum entry UPDATED
```

The active history's snapshots changed: a new snapshot was added (e.g. after an edit), or undo/redo was applied. The scene state changed as a direct consequence of the history update.

### entries

```kotlin
val entries: EnumEntries<HistoryUpdate>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): HistoryUpdate
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<HistoryUpdate>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
