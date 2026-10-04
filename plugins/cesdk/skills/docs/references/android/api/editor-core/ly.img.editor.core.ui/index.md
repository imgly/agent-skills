# ly.img.editor.core.ui

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.ui`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### ColorButton

```kotlin
@Composable
fun ColorButton(modifier: Modifier = Modifier, color: Color?, selected: Boolean = false, punchHole: Boolean = false, onClick: (() -> Unit)? = null, buttonSize: Dp = 40.dp, selectionStrokeWidth: Dp = 2.dp)
```

```kotlin
@Composable
fun ColorButton(colors: List<Color>, modifier: Modifier = Modifier, selected: Boolean = false, punchHole: Boolean = false, onClick: (() -> Unit)? = null, buttonSize: Dp = 40.dp, selectionStrokeWidth: Dp = 2.dp)
```

A composable function that renders Color.

### DefaultPreview

```kotlin
@Preview(showBackground = true)
@Composable
fun DefaultPreview()
```

### DefaultRowButtonPreview

```kotlin
@Preview(showBackground = true)
@Composable
fun DefaultRowButtonPreview()
```

### EditorIcon

```kotlin
@Composable
fun EditorIcon(icon: EditorIcon, modifier: Modifier = Modifier)
```

A composable function that renders EditorIcon.

### IconTextButton

```kotlin
@Composable
fun IconTextButton(onClick: () -> Unit, modifier: Modifier = Modifier, icon: (@Composable () -> Unit)? = null, text: (@Composable () -> Unit)? = null, enabled: Boolean = true, contentPadding: PaddingValues = PaddingValues(vertical = 10.dp, horizontal = 4.dp), tint: Color = MaterialTheme.colorScheme.onSurfaceVariant, containerColor: Color = Color.Transparent)
```

```kotlin
@Composable
fun IconTextButton(onClick: () -> Unit, modifier: Modifier = Modifier, editorIcon: EditorIcon? = null, text: String? = null, enabled: Boolean = true, contentPadding: PaddingValues = PaddingValues(vertical = 10.dp, horizontal = 4.dp), tint: Color = MaterialTheme.colorScheme.onSurfaceVariant)
```

A composable function that renders a button with icon and text, positioned vertically.

### IconTextRowButton

```kotlin
@Composable
fun IconTextRowButton(onClick: () -> Unit, modifier: Modifier = Modifier, icon: (@Composable () -> Unit)? = null, text: (@Composable () -> Unit)? = null, enabled: Boolean = true, contentPadding: PaddingValues = PaddingValues(vertical = 10.dp, horizontal = 4.dp), tint: Color = MaterialTheme.colorScheme.onSurfaceVariant)
```

A composable function that renders a button with icon and text, positioned horizontally.

### PreviewDisabled

```kotlin
@Preview(showBackground = true)
@Composable
fun PreviewDisabled()
```

### PreviewRowButtonDisabled

```kotlin
@Preview(showBackground = true)
@Composable
fun PreviewRowButtonDisabled()
```

### SheetHeader

```kotlin
@Composable
fun SheetHeader(title: String, actionContent: (@Composable BoxScope.() -> Unit)? = null, onClose: () -> Unit, icon: ImageVector = IconPack.ExpandMore)
```

Header of all the sheets.

### ifTrue

```kotlin
inline fun Modifier.ifTrue(predicate: Boolean, builder: Modifier.() -> Modifier): Modifier
```

### toPx

```kotlin
@Composable
fun Dp.toPx(): Float
```
