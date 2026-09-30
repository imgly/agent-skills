# EditorScope

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`

Scope of the editor. All the callbacks (both regular and composable) that configure the editor are within this scope object.

```kotlin
@Stable
open class EditorScope
```


## Members

### EditorScope

```kotlin
constructor(parentScope: EditorScope)
```

### editorContext

```kotlin
val EditorScope.editorContext: EditorContext
```

The context of the editor. This property should be used to access all the properties and functions within the editor. It is an extension function on purpose to make accessing this object more obvious that it's part of the EditorScope and not a customer's property (italic in Android Studio makes it more obvious).
