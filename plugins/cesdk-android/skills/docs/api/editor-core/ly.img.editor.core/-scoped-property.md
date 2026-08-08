# ScopedProperty

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`

Represents composable lambda that runs in Scope which value can be updated as a result of recompositions.

```kotlin
typealias ScopedProperty<Scope, Return> = @Composable Scope.() -> Return
```
