# ly.img.editor.core.configuration

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.configuration`
- **Module catalog:** [`ly.img:editor-core`](<../../indexes/editor-core.md>)

## Top-level declarations

### remember

```kotlin
@Composable
fun EditorConfiguration.Companion.remember(builder: EditorConfigurationBuilder.() -> Unit = {}): EditorConfiguration
```

```kotlin
@Composable
fun <Builder : EditorConfigurationBuilder> EditorConfiguration.Companion.remember(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): EditorConfiguration
```

A composable overload for EditorConfiguration.Companion.remember that uses EditorConfigurationBuilder to create and remember an EditorConfiguration instance. Check the documentation of overloaded EditorConfiguration.Companion.remember function below for more details. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions:

### then

```kotlin
@Composable
fun EditorConfiguration.then(builder: EditorConfigurationBuilder.() -> Unit = {}): EditorConfiguration
```

```kotlin
@Composable
fun <Builder : EditorConfigurationBuilder> EditorConfiguration.then(builderFactory: () -> Builder, builder: Builder.() -> Unit = {}): EditorConfiguration
```

A composable overload for EditorConfiguration.then that uses EditorConfigurationBuilder to create and remember an EditorConfiguration instance. Check the documentation of overloaded EditorConfiguration.then function below for more details. Note that builder lambda runs only once, therefore you should not have builder property reassignments based on conditions:
