# FillStrokeItemScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the InspectorBar.Button.rememberFillStroke button in the inspector bar.

```kotlin
@Stable
open class FillStrokeItemScope(parentScope: EditorScope, fillStrokeIcon: EditorIcon.FillStroke?) : InspectorBar.ItemScope
```


## Members

### FillStrokeItemScope

```kotlin
constructor(parentScope: EditorScope, fillStrokeIcon: EditorIcon.FillStroke?)
```

### fillStrokeIcon

```kotlin
val EditorContext.fillStrokeIcon: EditorIcon.FillStroke
```

The icon state of the fill stroke button. Used in the InspectorBar.Button.rememberFillStroke button implementation.
