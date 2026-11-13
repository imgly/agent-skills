# ScopedDecoration

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core`

Represents composable lambda that runs in Scope and should be used to decorate other composables.

```kotlin
typealias ScopedDecoration<Scope> = @Composable Scope.(@Composable () -> Unit) -> Unit
```
