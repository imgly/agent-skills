# HistoryUpdate

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/HistoryUpdate`

The kind of update that triggered an `onHistoryUpdated` callback.

```swift
@objc enum HistoryUpdate
```

## Members

### HistoryUpdate.activated

```swift
case activated
```

A different history buffer was activated via `setActiveHistory`. The undo/redo stack visible to the user changed, but no new snapshot was created and no undo/redo was applied as part of this event.

### HistoryUpdate.updated

```swift
case updated
```

The active history’s snapshots changed: a new snapshot was added (e.g. after an edit), or undo/redo was applied. The scene state changed as a direct consequence of the history update.

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```
