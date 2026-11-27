# EditorLayout

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/EditorLayout`

The arrangement of the canvas and the editor’s panels. The navigation bar spans the full width in every layout. New cases can be added in a minor release, so compare a value with `==`, or give a `switch` over this type a `default` case.

```swift
enum EditorLayout
```

## Members

### EditorLayout.sideBySide

```swift
case sideBySide
```

The canvas sits on the leading side. The bottom panel and the dock form a column on the trailing side, and the timeline fills the column’s height. The inspector bar replaces the dock in the column while a block is selected. In a right-to-left layout the column is on the left. The column applies on an editor that has a bottom panel, is at least 600 points wide and is at least as wide as tall, such as the video editor on an iPhone or an iPad in landscape. Otherwise the editor shows [`EditorLayout.stacked`](stacked.md). A phone and an iPad in portrait always do, and so does a design or photo editor without a bottom panel. The size is the editor’s own size with its bars, not the screen’s. The e…

### EditorLayout.stacked

```swift
case stacked
```

The canvas sits above the bottom panel and the dock. This is the default.
