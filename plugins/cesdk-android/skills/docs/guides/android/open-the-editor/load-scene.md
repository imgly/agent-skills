> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [Load a Scene](./load-scene.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-load-scene-from-remote/LoadSceneFromRemote.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

suspend fun loadSceneFromRemote(engine: Engine): DesignBlock {
    val sceneUri = Uri.parse(
        "file:///android_asset/imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene",
    )
    val scene = engine.scene.load(sceneUri = sceneUri, waitForResources = true)

    val text = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.setDropShadowEnabled(block = text, enabled = true)

    return scene
}
```

```kotlin file=@cesdk_android_examples/engine-guides-load-scene-from-string/LoadSceneFromString.kt reference-only
import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

suspend fun loadSceneFromString(
    engine: Engine,
    context: Context,
): DesignBlock {
    val sceneString = withContext(Dispatchers.IO) {
        context.assets.open("imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene")
            .bufferedReader(Charsets.UTF_8)
            .use { it.readText() }
    }
    val scene = engine.scene.load(scene = sceneString, waitForResources = true)

    val text = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.setDropShadowEnabled(block = text, enabled = true)

    return scene
}
```

```kotlin file=@cesdk_android_examples/engine-guides-load-scene-from-blob/LoadSceneFromBlob.kt reference-only
import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.DesignBlock
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

suspend fun loadSceneFromBlob(
    engine: Engine,
    context: Context,
): DesignBlock {
    val sceneBytes = withContext(Dispatchers.IO) {
        context.assets.open("imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene")
            .use { it.readBytes() }
    }
    val sceneString = sceneBytes.toString(Charsets.UTF_8)
    val scene = engine.scene.load(scene = sceneString, waitForResources = true)

    val text = engine.block.findByType(DesignBlockType.Text).first()
    engine.block.setDropShadowEnabled(block = text, enabled = true)

    return scene
}
```

Load previously saved scenes to resume editing or modify existing designs.

![Loaded postcard scene on Android](https://img.ly/docs/cesdk/android/open-the-editor/load-scene-478833/assets/load-scene-android.png)

> **Reading time:** 6 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/find/v1.82.0-nightly.20260824?q=engine-guides-load-scene)

<EngineReferenceNote {...props} />

Scene files contain layout, block properties, and asset references, but not the referenced assets themselves. When you load a scene, keep the image, font, audio, and video URLs from that scene accessible to the Android app.

This guide covers loading scenes from a URL, a stored string, and byte data, then modifying the loaded scene through the CreativeEngine API.

The visible result is the loaded postcard scene with the first text block's drop shadow enabled.

## Load a Scene from URL

Use `engine.scene.load(sceneUri = ...)` when your backend or CDN hosts a scene file — an `.imgly` or `.scene` file. The engine replaces the currently active scene with the loaded scene.

```kotlin highlight-android-load-from-url
val sceneUri = Uri.parse(
    "file:///android_asset/imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene",
)
val scene = engine.scene.load(sceneUri = sceneUri, waitForResources = true)
```

The sample passes `waitForResources = true` because it modifies the scene after loading. This waits for referenced resources to finish loading before the suspend call returns.
For a hosted scene, replace the bundled `file:///android_asset/...` URI with your HTTPS scene URI.

## Load a Scene from String

Use `engine.scene.load(scene = ...)` when you stored the serialized scene contents in a database or local storage. The string should match the output from `engine.scene.saveToString(...)`.

```kotlin highlight-android-load-from-string
val sceneString = withContext(Dispatchers.IO) {
    context.assets.open("imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene")
        .bufferedReader(Charsets.UTF_8)
        .use { it.readText() }
}
val scene = engine.scene.load(scene = sceneString, waitForResources = true)
```

The sample reads a bundled Android asset to stand in for stored scene contents. Keep the scene string unchanged while storing it; truncation, character-set conversion, or extra wrapping data makes the scene invalid.

## Load a Scene from Blob

Android apps usually receive uploaded or locally stored scene data as bytes rather than a browser `Blob`. Decode those bytes as UTF-8 and pass the resulting scene string to `engine.scene.load(scene = ...)`.

```kotlin highlight-android-load-from-blob
val sceneBytes = withContext(Dispatchers.IO) {
    context.assets.open("imgly-assets/ly.img.templates/templates/cesdk_postcard_1.scene")
        .use { it.readBytes() }
}
val sceneString = sceneBytes.toString(Charsets.UTF_8)
val scene = engine.scene.load(scene = sceneString, waitForResources = true)
```

The sample reads the same bundled scene as bytes before decoding it. This pattern works for data from a file picker, app-private storage, or any API that returns the `.scene` file as a `ByteArray`.

## Modify a Loaded Scene

After loading, the scene is immediately editable. Find the blocks you want to update and use the regular block APIs to change them.

```kotlin highlight-android-modify-loaded-scene
val text = engine.block.findByType(DesignBlockType.Text).first()
engine.block.setDropShadowEnabled(block = text, enabled = true)
```

The sample loads a postcard scene that contains a text block, then enables a drop shadow on that text. If the user should be able to undo the load, call `engine.editor.undo()` from your own undo workflow.

## Scene Files vs Archives

A scene file is lightweight because it stores only references to external assets. If those URLs stop resolving, the scene still loads but affected images, fonts, audio, or video may be missing.

For self-contained packages with bundled assets, save and load archives instead. Pass the archive URI to the same `engine.scene.load(sceneUri = ...)` call — the engine detects scene vs archive content automatically. Both scenes and archives use the `.imgly` extension; `.scene` and `.zip` files also load. See [Import Design from Archive](./import-design/from-archive.md) for the full archive workflow.

## Troubleshooting

### Scene Fails to Load

- Verify that the URI points to a valid `.scene` file and is reachable from the Android device.
- Keep scene data compatible with the CE.SDK version used by the app.
- Use HTTPS or configure Android network security explicitly if your app must load from another scheme.

### Assets Are Missing After Loading

- Scene files keep asset URLs by reference, so those URLs must remain accessible.
- Use scene archives when the scene should carry its assets with it.
- Configure a [URI resolver](./uri-resolver.md) when your app needs to redirect old asset paths to a new location.

### String or Byte Data Is Invalid

- Store the exact string returned by `engine.scene.saveToString(...)`.
- Decode byte data with the same character set used when the scene was saved.
- Avoid wrapping the scene content in extra JSON or metadata before passing it to `engine.scene.load(scene = ...)`.

## API Reference

| Method | Description |
| ------ | ----------- |
| `engine.scene.load(sceneUri=_, waitForResources=_)` | Load a scene or archive from a URI (content detected automatically) |
| `engine.scene.load(scene=_, waitForResources=_)` | Load a scene from serialized scene contents |
| `engine.scene.loadArchive(archiveUri=_, waitForResources=_)` | Load a scene archive from a URI |
| `engine.scene.saveToString(scene=_)` | Serialize a scene for storage |
| `engine.block.findByType(type=_)` | Find blocks by typed block kind |
| `engine.block.supportsDropShadow(block=_)` | Check whether a block exposes drop shadow properties |
| `engine.block.setDropShadowEnabled(block=_, enabled=_)` | Enable or disable a block's drop shadow |
| `engine.block.isDropShadowEnabled(block=_)` | Check whether a block's drop shadow is enabled |
| `engine.editor.undo()` | Revert the latest undoable editor operation |



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support