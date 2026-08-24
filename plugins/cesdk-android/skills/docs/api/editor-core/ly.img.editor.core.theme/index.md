# ly.img.editor.core.theme

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.theme`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### EditorTheme

```kotlin
@Composable
fun EditorTheme(useDarkTheme: Boolean = isSystemInDarkTheme(), content: @Composable () -> Unit)
```

Wrapper composable that applies the editor's color scheme and typography to any child composable. Use this if you want to apply the editor styling to any other composable of your app.

### LocalExtendedColorScheme

```kotlin
val LocalExtendedColorScheme: ProvidableCompositionLocal<ExtendedColorScheme>
```

### LocalIsDarkTheme

```kotlin
val LocalIsDarkTheme: ProvidableCompositionLocal<Boolean>
```

CompositionLocal that holds the current theme's color scheme.

### LocalShimmer

```kotlin
val LocalShimmer: ProvidableCompositionLocal<Shimmer?>
```

### fillAndStrokeColors

```kotlin
val fillAndStrokeColors: List<Color>
```

The fill and stroke colors.

### surface1

```kotlin
@get:Composable
@get:ReadOnlyComposable
val ColorScheme.surface1: Color
```

### surface2

```kotlin
@get:Composable
@get:ReadOnlyComposable
val ColorScheme.surface2: Color
```

### surface3

```kotlin
@get:Composable
@get:ReadOnlyComposable
val ColorScheme.surface3: Color
```
