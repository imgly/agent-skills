# TextBackgroundItemScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.component`

Scope of the rememberTextBackground button in the inspector bar.

```kotlin
@Stable
open class TextBackgroundItemScope(parentScope: EditorScope, icon: EditorIcon) : InspectorBar.ItemScope
```


## Members

### TextBackgroundItemScope

```kotlin
constructor(parentScope: EditorScope, icon: EditorIcon)
```

### icon

```kotlin
val EditorContext.icon: EditorIcon
```

The icon state of the text background button. Used in the InspectorBar.Button.rememberTextBackground button implementation.
