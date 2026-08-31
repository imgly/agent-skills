> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Engine](./engine-interface.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-setup/MyApplication.kt reference-only
import android.app.Application
import ly.img.engine.Engine

class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Engine.init(application = this)
    }
}
```

```kotlin file=@cesdk_android_examples/engine-guides-setup/MyActivity.kt reference-only
import android.net.Uri
import android.os.Bundle
import android.view.SurfaceHolder
import android.view.SurfaceView
import android.view.TextureView
import androidx.activity.ComponentActivity
import androidx.lifecycle.lifecycleScope
import kotlinx.coroutines.launch
import ly.img.engine.Engine

class MyActivity : ComponentActivity() {
    private val engine = Engine.getInstance(id = "ly.img.engine.example")

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val textureView = TextureView(this)
        setContentView(textureView)
        lifecycleScope.launch {
            engine.start(
                license = null, // pass null or empty for evaluation mode with watermark
                userId = "<your unique user id>",
                savedStateRegistryOwner = this@MyActivity,
            )
            bindTextureView(textureView)
            loadScene()
        }
    }

    override fun onDestroy() {
        engine.stop()
        super.onDestroy()
    }

    private fun bindTextureView(textureView: TextureView) {
        engine.bindTextureView(textureView)
    }

    private suspend fun loadScene() {
        // Check whether a scene already exists before loading it again as it might have been restored in engine.start.
        engine.scene.get() ?: run {
            val sceneUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")
            engine.scene.load(sceneUri)
        }
    }

    private fun bindSurfaceView() {
        val surfaceView = SurfaceView(this)
        setContentView(surfaceView)
        engine.bindSurfaceView(surfaceView)
    }

    private fun bindSurfaceHolder(surfaceHolder: SurfaceHolder) {
        engine.bindSurfaceHolder(surfaceHolder)
    }

    private fun bindOffscreen() {
        engine.bindOffscreen(width = 100, height = 100)
    }
}
```

```kotlin file=@cesdk_android_examples/engine-guides-setup/MyComposable.kt reference-only
import android.net.Uri
import android.view.SurfaceView
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSavedStateRegistryOwner
import androidx.compose.ui.viewinterop.AndroidView
import ly.img.engine.Engine

@Composable
fun MyComposable() {
    val engine = remember { Engine.getInstance(id = "ly.img.engine.example") }
    val context = LocalContext.current
    val surfaceView = remember { SurfaceView(context) }
    val savedStateRegistryOwner = LocalSavedStateRegistryOwner.current
    AndroidView(factory = { surfaceView })
    LaunchedEffect(Unit) {
        engine.start(
            license = null, // pass null or empty for evaluation mode with watermark
            userId = "<your unique user id>",
            savedStateRegistryOwner = savedStateRegistryOwner,
        )
        engine.bindSurfaceView(surfaceView)
        engine.scene.get() ?: run {
            val sceneUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")
            engine.scene.load(sceneUri)
        }
    }
    DisposableEffect(Unit) {
        onDispose {
            engine.stop()
        }
    }
}
```

The Android Engine is the programmatic entry point behind CE.SDK. You can use it through the prebuilt editor UI, where the editor setup manages initialization, or create and bind an Engine yourself for headless rendering, custom UI, and automation.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-rc.0/engine-guides-setup)

## Choose the Integration Mode

Most Android integrations fall into one of two modes:

| Mode | Who initializes the Engine? | When to use it |
| --- | --- | --- |
| Prebuilt editor UI | The editor setup initializes the Engine for you. | You use the CE.SDK editor UI or a Starter Kit and access the Engine from editor callbacks or configuration hooks. |
| Headless or custom Engine | Your app initializes and starts the Engine. | You render offscreen, generate assets, validate scenes, build custom UI, or run automation without showing the editor. |

The lifecycle below applies only when you create and start an Engine yourself. If you use the prebuilt editor or a Starter Kit, access the Engine through the editor's callbacks instead because it handles initialization for you.

## Initialize the Engine

Before any Engine instance can start, call `Engine.init(application)` from your `Application.onCreate()` method.

```kotlin highlight-android-application-init
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        Engine.init(application = this)
    }
}
```

This call stores the application context and prepares the Engine's internal directories. It must run on the main thread and should happen once during app startup.

## Create and Start an Engine

Create an Engine instance with a stable ID, then start it on the main thread with your license and user ID. The sample uses an Activity lifecycle coroutine, but any main-thread coroutine works. Render binding and scene work should run after `engine.start(...)` completes.

```kotlin highlight-android-activity-engine
private val engine = Engine.getInstance(id = "ly.img.engine.example")
```

```kotlin highlight-android-activity-start
lifecycleScope.launch {
    engine.start(
        license = null, // pass null or empty for evaluation mode with watermark
        userId = "<your unique user id>",
        savedStateRegistryOwner = this@MyActivity,
    )
    bindTextureView(textureView)
    loadScene()
}
```

The `id` controls Engine instance reuse: calling `Engine.getInstance(id=_)` with the same ID returns the same instance. `engine.start(...)` returns `false` if that instance is already running, so a new `savedStateRegistryOwner` is registered only when the Engine starts again. To avoid loading the same scene repeatedly after state restoration, check `engine.scene.get()` after `engine.start(...)` and only load a scene when none was restored.

## Bind a Render Target

After `engine.start(...)` completes, bind the Engine to the render target that matches your integration:

<Tabs>
  <TabItem label="TextureView">
    ```kotlin highlight-android-activity-bind-texture-view
    engine.bindTextureView(textureView)
    ```
  </TabItem>

  <TabItem label="SurfaceView">
    ```kotlin highlight-android-activity-bind-surface-view
    val surfaceView = SurfaceView(this)
    setContentView(surfaceView)
    engine.bindSurfaceView(surfaceView)
    ```
  </TabItem>

  <TabItem label="SurfaceHolder">
    ```kotlin highlight-android-activity-bind-surface-holder
    engine.bindSurfaceHolder(surfaceHolder)
    ```
  </TabItem>

  <TabItem label="Offscreen">
    ```kotlin highlight-android-activity-bind-offscreen
    engine.bindOffscreen(width = 100, height = 100)
    ```
  </TabItem>
</Tabs>

Use a visible `TextureView` or `SurfaceView` for a custom Android UI. Use `bindSurfaceHolder(surfaceHolder=_)` when your UI already owns a raw `SurfaceHolder`, such as a custom player view or third-party wrapper. Use `bindOffscreen(width=_, height=_)` for headless rendering where no view is displayed.

Only one Engine can be bound to a render target at a time. Binding one Engine unbinds other running UI Engines, so keep background and foreground rendering flows explicit.

## Work With the Scene

After the Engine is started and bound, load or create a scene before calling APIs that need scene content.

When you pass a `SavedStateRegistryOwner` to `engine.start(...)`, the Engine can restore a saved scene after process recreation. Check whether a scene already exists before loading a new one.

```kotlin highlight-android-activity-load-scene
// Check whether a scene already exists before loading it again as it might have been restored in engine.start.
engine.scene.get() ?: run {
    val sceneUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")
    engine.scene.load(sceneUri)
}
```

## Clean Up the Engine

Call `engine.stop()` when the standalone host that owns the `savedStateRegistryOwner` is destroyed. In this sample, that includes Activity recreation so the next Activity can start the named Engine and register its new saved-state owner. App architectures that keep one Engine running across configuration changes should manage restoration outside this snippet instead of passing a new owner to an already-running instance.

```kotlin highlight-android-activity-cleanup
override fun onDestroy() {
    engine.stop()
    super.onDestroy()
}
```

Use `engine.stop()` for lifecycle cleanup: it unbinds the current render target, releases runtime resources, unregisters saved-state handling, and clears the current scene. Use `engine.unbind()` only when the Engine should keep running while you detach it from one render target and bind it to another.

## Compose Lifecycle

Compose integrations follow the same lifecycle: remember the Engine instance, start it in a `LaunchedEffect`, bind a `SurfaceView`, work with the scene after the start call completes, and stop it from `DisposableEffect.onDispose` when this Composable owns the Engine lifecycle.

```kotlin highlight-android-compose-engine
val engine = remember { Engine.getInstance(id = "ly.img.engine.example") }
```

Set up the `SurfaceView` and saved-state owner before the start coroutine uses them.

```kotlin highlight-android-compose-render-target
val context = LocalContext.current
val surfaceView = remember { SurfaceView(context) }
val savedStateRegistryOwner = LocalSavedStateRegistryOwner.current
AndroidView(factory = { surfaceView })
```

```kotlin highlight-android-compose-start
LaunchedEffect(Unit) {
    engine.start(
        license = null, // pass null or empty for evaluation mode with watermark
        userId = "<your unique user id>",
        savedStateRegistryOwner = savedStateRegistryOwner,
    )
    engine.bindSurfaceView(surfaceView)
    engine.scene.get() ?: run {
        val sceneUri = Uri.parse("https://cdn.img.ly/assets/demo/v1/ly.img.template/templates/cesdk_postcard_1.scene")
        engine.scene.load(sceneUri)
    }
}
```

```kotlin highlight-android-compose-cleanup
DisposableEffect(Unit) {
    onDispose {
        engine.stop()
    }
}
```

Use this pattern when you build a custom UI around the Engine. If you use the prebuilt editor UI, prefer the editor or Starter Kit lifecycle hooks instead of creating a separate Engine in the Composable.

## Troubleshooting

**Cannot start the Engine before calling Engine.init(applicationContext)**: Call `Engine.init(application)` once from `Application.onCreate()` before calling `Engine.getInstance(...)` or `engine.start(...)`.

**Engine APIs fail from the wrong thread**: Call Engine APIs from the Engine's own dispatcher. Public Engine instances created with `Engine.getInstance(...)` run on the main thread. Export callbacks such as `onPreExport` run on a separate background Engine thread, so configure that Engine inside the provided callback.

**No frames render in a custom render loop**: Ensure the Engine is bound before rendering frames. Headless frame rendering needs `engine.bindOffscreen(width=_, height=_)`; custom UI flows need a visible `SurfaceView` or `TextureView`.

**The export output is empty**: Ensure the scene contains renderable blocks, required resources are reachable, and export options target the block you expect. `engine.block.export(...)` prepares its own background export Engine, so `bindOffscreen(...)` on the main Engine is not the fix for empty export output.

**A scene loads twice after rotation or process recreation**: If you pass a `SavedStateRegistryOwner` to `engine.start(...)`, check `engine.scene.get()` before loading a new scene.

## API Reference

| Method | Purpose |
| --- | --- |
| `Engine.init(application=_)` | Initialize the Engine before any instance starts. |
| `Engine.getInstance(id=_, audioContext=_)` | Get or create a named Engine instance. Pass `AudioContext.NONE` to disable audio playback for the first instance with that ID, or use `AudioContext.AUTO` for the default audio-capable context. |
| `engine.start(license=_, userId=_, savedStateRegistryOwner=_)` | Start the Engine and optionally wire scene state restoration. |
| `engine.bindTextureView(textureView=_)` | Render into a `TextureView`. |
| `engine.bindSurfaceView(surfaceView=_)` | Render into a `SurfaceView`. |
| `engine.bindSurfaceHolder(surfaceHolder=_)` | Render into a raw `SurfaceHolder`. |
| `engine.bindOffscreen(width=_, height=_)` | Render without a visible UI surface. |
| `engine.unbind()` | Detach the current render target. |
| `engine.isEngineRunning()` | Check whether `start()` has completed and `stop()` has not been called. |
| `engine.stop()` | Stop the Engine and release its runtime resources. |

## Next Steps

- [Headless Mode](./concepts/headless-mode.md) - Use the Engine directly without the prebuilt UI.
- [Batch Processing](./automation/batch-processing.md) - Process multiple designs.
- [Data Merge](./automation/data-merge.md) - Personalize templates with external data.
- [Export](./export-save-publish/export.md) - Explore export options and formats.
- Node.js SDK - Use the server-side Engine package for backend processing.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support