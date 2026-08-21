> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Plugin Architecture](./plugin-architecture.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-plugins-custom-plugin/CustomFeaturePluginEditorSolution.kt reference-only
import android.net.Uri
import android.util.Log
import android.widget.Toast
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.core.net.toUri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.coroutineScope
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import ly.img.editor.BasicConfigurationBuilder
import ly.img.editor.Editor
import ly.img.editor.configuration.design.DesignConfigurationBuilder
import ly.img.editor.core.EditorScope
import ly.img.editor.core.ScopedProperty
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.EditorComponent
import ly.img.editor.core.component.EditorComponentId
import ly.img.editor.core.component.modify
import ly.img.editor.core.component.remember
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.EditorConfigurationBuilder
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.core.iconpack.IconPack
import ly.img.editor.core.iconpack.Image
import ly.img.engine.ContentFillMode
import ly.img.engine.DesignBlockType
import ly.img.engine.FillType
import ly.img.engine.HorizontalBlockAlignment
import ly.img.engine.ShapeType
import ly.img.engine.SizeMode
import ly.img.engine.VerticalBlockAlignment
import java.io.File
import java.nio.ByteBuffer
import java.util.UUID

@Composable
fun CustomFeaturePluginEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::DesignConfigurationBuilder)
                .then(::CustomFeaturePlugin) {
                    randomImageUri = "https://img.ly/static/ubq_samples/sample_1.jpg".toUri()
                }
        },
        onClose = onClose,
    )
}

open class CustomFeaturePlugin : EditorConfigurationBuilder() {
    var randomImageUri: Uri by editorContext.mutableStateOf(
        key = "com.example.editor.customFeature.randomImageUri",
        initial = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )

    private var isLoading: Boolean by editorContext.mutableStateOf(
        key = BasicConfigurationBuilder.KEY_STATE_SHOW_LOADING,
        initial = false,
    )

    override var onCreate: (suspend EditorScope.() -> Unit)? = {
        try {
            isLoading = true
            val editorScope = this
            coroutineScope {
                launch {
                    parentConfiguration?.onCreate?.invoke(editorScope)
                    // The parent Design configuration hides loading after scene setup.
                    isLoading = true
                }
                launch {
                    Log.d(TAG, "CustomFeaturePlugin setup started.")
                    delay(3_000)
                    Log.d(TAG, "CustomFeaturePlugin setup finished.")
                }
            }
        } finally {
            isLoading = false
        }
    }

    override var onExport: (suspend EditorScope.() -> Unit)? = {
        try {
            isLoading = true
            val scene = requireNotNull(editorContext.engine.scene.get()) {
                "A scene is required before exporting."
            }
            val archive = editorContext.engine.scene.saveToArchive(scene = scene)
            val file = writeArchiveToTempFile(archive)
            Toast.makeText(editorContext.activity, "Saved scene archive to ${file.name}", Toast.LENGTH_SHORT).show()
            Log.d(TAG, "Saved scene archive to ${file.absolutePath}")
        } finally {
            isLoading = false
        }
    }

    override var dock: ScopedProperty<EditorScope, EditorComponent<*>?>? = dockComponent@{
        val sourceDock = parentConfiguration?.dock as? Dock ?: return@dockComponent null
        val updatedListBuilder = sourceDock.listBuilder.modify {
            addFirst {
                Dock.Button.remember {
                    id = { EditorComponentId("com.example.component.dock.button.customFeature") }
                    vectorIcon = { IconPack.Image }
                    textString = { "Image" }
                    contentDescription = { "Add image" }
                    onClick = { addImageBlockFromPlugin() }
                }
            }
        }
        remember(sourceDock, updatedListBuilder) {
            sourceDock.copy(listBuilder = updatedListBuilder)
        }
    }

    override var canvasMenu: ScopedProperty<EditorScope, EditorComponent<*>?>? = {
        null
    }

    private fun EditorScope.addImageBlockFromPlugin() {
        val engine = editorContext.engine
        val page = requireNotNull(engine.scene.getCurrentPage()) {
            "A current page is required before adding an image block."
        }
        val imageBlock = engine.block.create(DesignBlockType.Graphic)
        val shape = engine.block.createShape(ShapeType.Rect)
        val fill = engine.block.createFill(FillType.Image)

        engine.block.setShape(block = imageBlock, shape = shape)
        engine.block.setUri(
            block = fill,
            property = "fill/image/imageFileURI",
            value = randomImageUri,
        )
        engine.block.setFill(block = imageBlock, fill = fill)
        engine.block.setContentFillMode(block = imageBlock, mode = ContentFillMode.COVER)
        engine.block.setWidthMode(block = imageBlock, mode = SizeMode.PERCENT)
        engine.block.setWidth(block = imageBlock, value = 0.5F)
        engine.block.appendChild(parent = page, child = imageBlock)
        if (engine.block.isAlignable(listOf(imageBlock))) {
            engine.block.alignHorizontally(listOf(imageBlock), alignment = HorizontalBlockAlignment.CENTER)
            engine.block.alignVertically(listOf(imageBlock), alignment = VerticalBlockAlignment.CENTER)
        }
        engine.block.setSelected(block = imageBlock, selected = true)
    }

    private suspend fun writeArchiveToTempFile(archive: ByteBuffer): File = withContext(Dispatchers.IO) {
        File.createTempFile("custom-feature-${UUID.randomUUID()}", ".imgly").apply {
            outputStream().channel.use { channel ->
                channel.write(archive)
            }
        }
    }

    private companion object {
        const val TAG = "CustomFeaturePlugin"
    }
}
```

Understand how CE.SDK's plugin system fits together on Android—what a plugin
is, how it chains onto an editor configuration, and which parts of the editor
it can extend.

![Diagram of the Android plugin configuration chain: a base configuration is chained into a custom plugin with then(), the plugin overrides callbacks and components and reaches the previous configuration through parentConfiguration, and the result configures the Editor composable](https://img.ly/docs/cesdk/android/concepts/plugin-architecture-068fc4/assets/plugin-chain-android.svg)

A plugin is a self-contained unit that packages editor behavior—callbacks, state, UI component configuration—and attaches to an existing editor without rebuilding it. On Android, a plugin is a class inheriting from `EditorConfigurationBuilder` that is chained onto the editor configuration. IMG.LY ships official plugins such as background removal this way, and you can build your own.

This guide covers what a plugin is on Android, when to use one instead of other customization mechanisms, how plugins compose through the configuration chain, and where each official plugin is documented.

## What a Plugin Is

The editor configuration is built first, and plugins are chained onto it afterwards. Each plugin is one `EditorConfigurationBuilder` subclass with one place where it applies its behavior: the builder properties it overrides. The same composition idea exists on every platform, even though the APIs differ—the Web registers plugin objects with `addPlugin()` and iOS subclasses `EditorConfiguration`.

## Plugin or Not?

Plugins are one of several customization mechanisms, and they're commonly conflated. Use this list to place them:

- **Inline configuration**: The default. Configure the editor directly in the builder block where it's created—best for one editor surface or a one-off product flow.
- **Starter kits**: Copy-to-adapt scaffolds for complete editor experiences. Browse them in the [starter kits overview](../starterkits.md).
- **Plugins**: When the same behavior must travel between projects or entry points as one unit.

Importers and exporters are standalone packages that convert file formats. They are versioned independently of CE.SDK and are not plugins—you use their own APIs instead of chaining them onto the editor configuration.

## How a Plugin Attaches

The base configuration comes first, plugins second, app-specific edits last. `EditorConfiguration.remember` creates the base, and `then(::SomePlugin)` chains a plugin onto it. The builder block passed to `then` configures plugin options for this editor entry point:

```kotlin highlight-android-apply-plugin
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::DesignConfigurationBuilder)
            .then(::CustomFeaturePlugin) {
                randomImageUri = "https://img.ly/static/ubq_samples/sample_1.jpg".toUri()
            }
    },
    onClose = onClose,
)
```

Each plugin in the chain can reach the previous configuration through `parentConfiguration`, so it decides per callback and per component whether to extend the inherited behavior or replace it.

## Extending and Replacing Behavior

A plugin that overrides `onCreate` can run work around the inherited setup by invoking `parentConfiguration?.onCreate` in the middle:

```kotlin highlight-android-on-create
override var onCreate: (suspend EditorScope.() -> Unit)? = {
    try {
        isLoading = true
        val editorScope = this
        coroutineScope {
            launch {
                parentConfiguration?.onCreate?.invoke(editorScope)
                // The parent Design configuration hides loading after scene setup.
                isLoading = true
            }
            launch {
                Log.d(TAG, "CustomFeaturePlugin setup started.")
                delay(3_000)
                Log.d(TAG, "CustomFeaturePlugin setup finished.")
            }
        }
    } finally {
        isLoading = false
    }
}
```

The same choice applies to UI components. This dock override keeps the inherited dock and prepends one button instead of replacing the whole component:

```kotlin highlight-android-dock
override var dock: ScopedProperty<EditorScope, EditorComponent<*>?>? = dockComponent@{
    val sourceDock = parentConfiguration?.dock as? Dock ?: return@dockComponent null
    val updatedListBuilder = sourceDock.listBuilder.modify {
        addFirst {
            Dock.Button.remember {
                id = { EditorComponentId("com.example.component.dock.button.customFeature") }
                vectorIcon = { IconPack.Image }
                textString = { "Image" }
                contentDescription = { "Add image" }
                onClick = { addImageBlockFromPlugin() }
            }
        }
    }
    remember(sourceDock, updatedListBuilder) {
        sourceDock.copy(listBuilder = updatedListBuilder)
    }
}
```

## Plugin Options

Plugins expose options as builder properties, so the same plugin can behave differently in different editors. State that participates in Compose recomposition uses `editorContext.mutableStateOf`:

```kotlin highlight-android-plugin-state
    var randomImageUri: Uri by editorContext.mutableStateOf(
        key = "com.example.editor.customFeature.randomImageUri",
        initial = Uri.parse("https://img.ly/static/ubq_samples/sample_1.jpg"),
    )

    private var isLoading: Boolean by editorContext.mutableStateOf(
        key = BasicConfigurationBuilder.KEY_STATE_SHOW_LOADING,
        initial = false,
    )
```

## Official Plugins

Each official plugin has its own page with installation and options; this table only maps the landscape.

| Plugin | What it does | Docs |
| --- | --- | --- |
| Background Removal | Removes image backgrounds on device | [Remove Background](../edit-image/remove-bg.md) |
| AI Generation | Generates images and more in the editor | [AI Image Generation](../plugins/ai-image-generation.md) |

The [plugins section](../plugins.md) lists the full set.

## Building Your Own

A custom plugin is an `EditorConfigurationBuilder` subclass with a stable identity, options as builder properties, and overridden callbacks or components. Reach for one when the same behavior needs to travel together instead of being pasted into every editor setup. The [Custom Feature Plugin](../plugins/custom-plugin.md) guide walks through building the plugin shown on this page.

## Troubleshooting

- **The editor opens without the expected scene**: A plugin replaced `onCreate` and skipped the base setup. Delegate to `parentConfiguration?.onCreate`, or fully create the scene inside the plugin.
- **A dock or inspector item disappears**: The plugin replaced a component instead of extending it. Derive from `parentConfiguration?.dock` when adding controls.
- **Plugin options don't update**: The option is captured once in the builder. Store dynamic values with `editorContext.mutableStateOf` so they participate in state.

## Next Steps

- [Custom Feature Plugin](../plugins/custom-plugin.md) - Build your own plugin
- [Architecture](./architecture.md) - How the CreativeEngine is structured
- [Starter Kits](../starterkits.md) - Complete editor scaffolds to start from



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support