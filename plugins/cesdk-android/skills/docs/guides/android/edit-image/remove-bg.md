> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Images](../edit-image.md) > [Remove Background](./remove-bg.md) > [Plugins](../plugins.md) > [Background Removal](./remove-bg.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-background-removal/BackgroundRemovalEditorSolution.kt reference-only
import android.graphics.Bitmap
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.photo.PhotoConfigurationBuilder
import ly.img.editor.configuration.photo.callback.onCreate
import ly.img.editor.core.EditorScope
import ly.img.editor.core.component.Dock
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.plugin.backgroundRemoval.BackgroundRemovalConfig
import ly.img.editor.plugin.backgroundRemoval.BackgroundRemovalMask
import ly.img.editor.plugin.backgroundRemoval.BackgroundRemovalPlugin
import ly.img.editor.plugin.backgroundRemoval.GoogleBackgroundRemovalConfig
import ly.img.editor.plugin.backgroundRemoval.GoogleBackgroundRemovalPlugin
import ly.img.editor.plugin.backgroundRemoval.IMGLYBackgroundRemovalConfig
import ly.img.editor.plugin.backgroundRemoval.IMGLYBackgroundRemovalPlugin
import ly.img.editor.plugin.backgroundRemoval.rememberBackgroundRemoval
import ly.img.editor.plugin.backgroundRemoval.remover.BackgroundRemover
import okhttp3.OkHttpClient
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.concurrent.TimeUnit

// Add this composable to your NavHost.
@Composable
fun BackgroundRemovalEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder) {
                    onCreate = {
                        onCreate(
                            createScene = {
                                editorContext.engine.scene.createFromImage(
                                    imageUri = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80".toUri(),
                                )
                            },
                        )
                    }
                }
                .then(::IMGLYBackgroundRemovalPlugin)
        },
        onClose = onClose,
    )
}

@Composable
private fun BackgroundRemovalEditorSolutionWithIMGLYConfiguration(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder)
                .then(::IMGLYBackgroundRemovalPlugin) {
                    config = IMGLYBackgroundRemovalConfig(
                        model = IMGLYBackgroundRemovalConfig.Model.FP16,
                        modelBaseUri = "https://staticimgly.com/imgly/plugin-mobile-background-removal/1.0.0".toUri(),
                        loadMode = IMGLYBackgroundRemovalConfig.LoadMode.EAGER,
                        httpClient = OkHttpClient.Builder()
                            .connectTimeout(15, TimeUnit.SECONDS)
                            .readTimeout(120, TimeUnit.SECONDS)
                            .writeTimeout(120, TimeUnit.SECONDS)
                            .build(),
                    )
                    dockModifier = {
                        addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                    }
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun BackgroundRemovalEditorSolutionWithGoogle(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder)
                .then(::GoogleBackgroundRemovalPlugin)
        },
        onClose = onClose,
    )
}

@Composable
private fun BackgroundRemovalEditorSolutionWithGoogleConfiguration(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder)
                .then(::GoogleBackgroundRemovalPlugin) {
                    config = GoogleBackgroundRemovalConfig(
                        httpClient = OkHttpClient.Builder()
                            .connectTimeout(15, TimeUnit.SECONDS)
                            .readTimeout(120, TimeUnit.SECONDS)
                            .writeTimeout(120, TimeUnit.SECONDS)
                            .build(),
                    )
                    dockModifier = {
                        addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                    }
                }
        },
        onClose = onClose,
    )
}

private data class CustomBackgroundRemovalConfig(
    override val httpClient: OkHttpClient = OkHttpClient(),
) : BackgroundRemovalConfig {
    override val remover: BackgroundRemover<*> = CustomBackgroundRemover()
}

private class CustomBackgroundRemover : BackgroundRemover<CustomBackgroundRemovalConfig> {
    override fun EditorScope.initialize() {
        // Prepare local models, SDK clients, or service credentials here.
    }

    override suspend fun EditorScope.processImage(bitmap: Bitmap): BackgroundRemovalMask {
        val width = bitmap.width
        val height = bitmap.height
        val buffer = ByteBuffer
            .allocateDirect(width * height * Float.SIZE_BYTES)
            .order(ByteOrder.nativeOrder())

        // Dummy data filled with 1s.
        repeat(width * height) {
            buffer.putFloat(1f)
        }
        buffer.rewind()

        return BackgroundRemovalMask(
            buffer = buffer,
            width = width,
            height = height,
        )
    }
}

@Composable
private fun BackgroundRemovalEditorSolutionWithCustomRemover(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder)
                .then(::BackgroundRemovalPlugin) {
                    config = CustomBackgroundRemovalConfig()
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun BackgroundRemovalEditorSolutionWithCustomDockModifier(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::PhotoConfigurationBuilder)
                .then(::BackgroundRemovalPlugin) {
                    config = CustomBackgroundRemovalConfig()
                    dockModifier = {
                        addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                    }
                }
        },
        onClose = onClose,
    )
}
```

Add a background removal action to your Android editor so users can remove an image background and continue editing the result.

![Background Removal action in the Android Photo Editor dock](https://img.ly/docs/cesdk/android/edit-image/remove-bg-9dfcf7/assets/android.hero.png)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260811/editor-guides-background-removal)

The Background Removal plugin adds a dock action that processes the current page image and replaces its fill with a transparent-background result. This guide explores the [IMG.LY ONNX implementation](./remove-bg.md#imgly-implementation), the [Google ML Kit implementation](./remove-bg.md#google-implementation), and a [custom remover implementation](./remove-bg.md#custom-background-remover).

> **Warning:** Background removal is applied to the current page block. The page must use an image fill for the plugin to process it.

For a complete Photo Editor setup, see the [Photo Editor starter kit](../starterkits/photo-editor.md).

## IMG.LY Implementation

The IMG.LY implementation runs an ONNX segmentation model on the device. Use it when you want to control the model variant, model asset location, and model loading behavior.

```groovy
dependencies {
    implementation("ly.img:plugin-background-removal-imgly:1.81.0-nightly.20260811")
}
```

### Minimal Implementation

Compose `IMGLYBackgroundRemovalPlugin` with your editor configuration. The plugin inserts the dock button and uses the default IMG.LY configuration.

```kotlin highlight-android-imgly-minimal
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder) {
                onCreate = {
                    onCreate(
                        createScene = {
                            editorContext.engine.scene.createFromImage(
                                imageUri = "https://images.unsplash.com/photo-1438761681033-6461ffad8d80".toUri(),
                            )
                        },
                    )
                }
            }
            .then(::IMGLYBackgroundRemovalPlugin)
    },
    onClose = onClose,
)
```

### Configuration Options

Configure `IMGLYBackgroundRemovalPlugin` when you need to select a model, change where model files are loaded from, control eager or lazy loading, customize network timeouts, or move the dock button.

```kotlin highlight-android-imgly-configuration
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder)
            .then(::IMGLYBackgroundRemovalPlugin) {
                config = IMGLYBackgroundRemovalConfig(
                    model = IMGLYBackgroundRemovalConfig.Model.FP16,
                    modelBaseUri = "https://staticimgly.com/imgly/plugin-mobile-background-removal/1.0.0".toUri(),
                    loadMode = IMGLYBackgroundRemovalConfig.LoadMode.EAGER,
                    httpClient = OkHttpClient.Builder()
                        .connectTimeout(15, TimeUnit.SECONDS)
                        .readTimeout(120, TimeUnit.SECONDS)
                        .writeTimeout(120, TimeUnit.SECONDS)
                        .build(),
                )
                dockModifier = {
                    addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                }
            }
    },
    onClose = onClose,
)
```

| Option | Default | Description |
| --- | --- | --- |
| `config.model` | `IMGLYBackgroundRemovalConfig.Model.FP16` | Chooses the ONNX model variant. `FP32` favors quality and file size is largest, `FP16` is the default balance, and `QUINT8` is smaller and faster with a stronger quality trade-off. |
| `config.modelBaseUri` | `https://staticimgly.com/imgly/plugin-mobile-background-removal/1.0.0` | Base URI used to resolve the selected model file. The plugin appends `config.model.key`, for example `isnet_fp16.onnx`. You can download the models and store them in your own CDN, or download the files into the assets folder of your app and set `modelBaseUri = "file:///android_asset".toUri()`. |
| `config.loadMode` | `IMGLYBackgroundRemovalConfig.LoadMode.EAGER` | `EAGER` starts loading the model during plugin initialization. `LAZY` waits until the first removal action. |
| `config.httpClient` | Default `OkHttpClient` | HTTP client used to load source images and remote model assets. Override it for app-specific timeouts or interceptors. |
| `dockModifier` | Adds the button first | Changes where `Dock.Button.rememberBackgroundRemoval()` is inserted in the dock. |

> **Note:** You can improve the initial wait time further by pre-downloading the model outside the editor. Simply create an instance of `IMGLYBackgroundRemover` with the desired config and call `forceDownloadModel(context)` function.

## Google Implementation

The Google implementation uses Google's on-device ML Kit segmentation backend. Use it when you want an on-device segmentation option with the same dock button placement controls.

```groovy
dependencies {
    implementation("ly.img:plugin-background-removal-google:1.81.0-nightly.20260811")
}
```

### Minimal Implementation

Compose `GoogleBackgroundRemovalPlugin` with your editor configuration.

```kotlin highlight-android-google-minimal
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder)
            .then(::GoogleBackgroundRemovalPlugin)
    },
    onClose = onClose,
)
```

### Configuration Options

Configure `GoogleBackgroundRemovalPlugin` when you need to customize the HTTP client or move the dock button.

```kotlin highlight-android-google-configuration
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder)
            .then(::GoogleBackgroundRemovalPlugin) {
                config = GoogleBackgroundRemovalConfig(
                    httpClient = OkHttpClient.Builder()
                        .connectTimeout(15, TimeUnit.SECONDS)
                        .readTimeout(120, TimeUnit.SECONDS)
                        .writeTimeout(120, TimeUnit.SECONDS)
                        .build(),
                )
                dockModifier = {
                    addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                }
            }
    },
    onClose = onClose,
)
```

| Option | Default | Description |
| --- | --- | --- |
| `config.httpClient` | Default `OkHttpClient` | HTTP client used by the plugin when it loads source images. Override it for app-specific timeouts or interceptors. |
| `dockModifier` | Adds the button first | Changes where `Dock.Button.rememberBackgroundRemoval()` is inserted in the dock. |

## Custom Background Remover

For custom segmentation, include the base plugin package and implement `BackgroundRemover`. Your config object selects the remover, and `BackgroundRemovalPlugin` keeps the same dock action and editor integration.

```groovy
dependencies {
    implementation("ly.img:plugin-background-removal:1.81.0-nightly.20260811")
}
```

### Minimal Implementation

Implement `BackgroundRemovalConfig` to select your remover, then compose the base plugin with your custom config. `initialize()` prepares your backend, and `processImage()` returns the foreground mask.

```kotlin highlight-android-custom-remover
private data class CustomBackgroundRemovalConfig(
    override val httpClient: OkHttpClient = OkHttpClient(),
) : BackgroundRemovalConfig {
    override val remover: BackgroundRemover<*> = CustomBackgroundRemover()
}

private class CustomBackgroundRemover : BackgroundRemover<CustomBackgroundRemovalConfig> {
    override fun EditorScope.initialize() {
        // Prepare local models, SDK clients, or service credentials here.
    }

    override suspend fun EditorScope.processImage(bitmap: Bitmap): BackgroundRemovalMask {
        val width = bitmap.width
        val height = bitmap.height
        val buffer = ByteBuffer
            .allocateDirect(width * height * Float.SIZE_BYTES)
            .order(ByteOrder.nativeOrder())

        // Dummy data filled with 1s.
        repeat(width * height) {
            buffer.putFloat(1f)
        }
        buffer.rewind()

        return BackgroundRemovalMask(
            buffer = buffer,
            width = width,
            height = height,
        )
    }
}
```

```kotlin highlight-android-custom-plugin
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder)
            .then(::BackgroundRemovalPlugin) {
                config = CustomBackgroundRemovalConfig()
            }
    },
    onClose = onClose,
)
```

### Configuration Options

Configure `BackgroundRemovalPlugin` when you need to move the dock button.

```kotlin highlight-android-custom-dock-modifier
Editor(
    license = license,
    configuration = {
        EditorConfiguration
            .remember(::PhotoConfigurationBuilder)
            .then(::BackgroundRemovalPlugin) {
                config = CustomBackgroundRemovalConfig()
                dockModifier = {
                    addFirst { Dock.Button.rememberBackgroundRemoval(config = it) }
                }
            }
    },
    onClose = onClose,
)
```

| Option | Default | Description |
| --- | --- | --- |
| `dockModifier` | Adds the button first | Changes where `Dock.Button.rememberBackgroundRemoval()` is inserted in the dock. |

## Troubleshooting

- If the button is missing, verify that the selected plugin is composed with the editor configuration.
- If removal fails, check that the current page block has an image fill.
- If the IMG.LY implementation cannot load a model, verify that `modelBaseUri` plus the selected model filename resolves to a readable `.onnx` file.
- If the first IMG.LY run feels slow, use `LoadMode.EAGER` or bundle the selected model in app assets.

## API Reference

| API | Purpose |
| --- | --- |
| `IMGLYBackgroundRemovalPlugin` | Adds the background removal action with the IMG.LY ONNX Runtime backend. |
| `IMGLYBackgroundRemovalConfig` | Configures IMG.LY model selection, model URI, loading behavior, and HTTP loading. |
| `GoogleBackgroundRemovalPlugin` | Adds the background removal action with Google's on-device segmentation backend. |
| `GoogleBackgroundRemovalConfig` | Configures HTTP loading for the Google implementation. |
| `BackgroundRemovalPlugin` | Base plugin used with a custom `BackgroundRemovalConfig`. |
| `BackgroundRemover.initialize()` | Prepares a custom remover before use. |
| `BackgroundRemover.processImage(bitmap=_)` | Produces the foreground mask for an image. |
| `Dock.Button.rememberBackgroundRemoval(config=_)` | Creates the reusable background removal dock button. |
| `EditorConfiguration.then()` | Composes the selected plugin with the base editor configuration. |

## Next Steps

- [Configuration](../configuration.md) - Configure the editor for your app.
- [Photo Editor](../starterkits/photo-editor.md) - Start from the Photo Editor starter kit.
- [Open the Editor From an Image](../open-the-editor/from-image.md) - Start the editor with image content.
- [Dock](../user-interface/customization/dock.md) - Customize dock items and ordering.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support