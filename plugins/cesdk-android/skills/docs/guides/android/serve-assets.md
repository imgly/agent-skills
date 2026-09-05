> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](./guides.md) > [Serve Assets](./serve-assets.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-serve-assets/ServeAssets.kt reference-only
import android.net.Uri
import ly.img.engine.Engine

private val serveAssetsDefaultSourceIds =
    listOf(
        "ly.img.sticker",
        "ly.img.vector.shape",
        "ly.img.filter",
        "ly.img.color.palette",
        "ly.img.effect",
        "ly.img.blur",
        "ly.img.typeface",
        "ly.img.crop.presets",
        "ly.img.page.presets",
        "ly.img.text",
        "ly.img.text.styles",
        "ly.img.text.curves",
        "ly.img.text.components",
        "ly.img.caption.presets",
    )

private val serveAssetsSampleSourceIds =
    listOf(
        "ly.img.image",
        "ly.img.video",
        "ly.img.audio",
        "ly.img.templates",
        "ly.img.templates.premium",
    )

data class ServeAssetsResult(
    val defaultSourceIds: List<String>,
    val sampleSourceIds: List<String>,
    val basePath: String,
)

private suspend fun registerServeAssetSources(
    engine: Engine,
    baseUri: Uri,
    sourceIds: List<String>,
    matchersBySourceId: Map<String, List<String>> = emptyMap(),
): List<String> {
    val existingSourceIds = engine.asset.findAllSources().toSet()
    val registeredSourceIds = mutableListOf<String>()

    sourceIds
        .filterNot(existingSourceIds::contains)
        .forEach { sourceId ->
            registeredSourceIds +=
                engine.asset.addLocalSourceFromJSON(
                    contentUri = baseUri.buildUpon()
                        .appendPath(sourceId)
                        .appendPath("content.json")
                        .build(),
                    matcher = matchersBySourceId[sourceId],
                )
        }

    return registeredSourceIds
}

suspend fun serveAssets(
    engine: Engine,
    baseUri: Uri,
): ServeAssetsResult {
    registerServeAssetSources(
        engine = engine,
        baseUri = baseUri,
        sourceIds = serveAssetsDefaultSourceIds,
    )

    registerServeAssetSources(
        engine = engine,
        baseUri = baseUri,
        sourceIds = serveAssetsSampleSourceIds,
    )

    engine.editor.setSettingString(
        keypath = "basePath",
        value = baseUri.toString(),
    )

    val sourceIds = engine.asset.findAllSources()
    return ServeAssetsResult(
        defaultSourceIds = serveAssetsDefaultSourceIds.filter(sourceIds::contains),
        sampleSourceIds = serveAssetsSampleSourceIds.filter(sourceIds::contains),
        basePath = engine.editor.getSettingString(keypath = "basePath"),
    )
}

fun serveAssetsRemoteBaseUri(): Uri {
    return Uri.parse("https://cdn.your.custom.domain/assets")
}

fun serveAssetsAppAssetsBaseUri(): Uri {
    return Uri.parse("file:///android_asset/assets")
}

suspend fun serveAssetsWithFilteredStickers(
    engine: Engine,
    baseUri: Uri,
) {
    registerServeAssetSources(
        engine = engine,
        baseUri = baseUri,
        sourceIds = listOf("ly.img.sticker"),
        matchersBySourceId =
            mapOf(
                "ly.img.sticker" to listOf("ly.img.sticker.emoji.*"),
            ),
    )
}
```

Configure the Creative Engine to load its asset sources from your own server
or Android app assets instead of the IMG.LY CDN.

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/engine-guides-serve-assets)

<EngineReferenceNote {...props} />

The editor loads assets from the IMG.LY CDN by default, which is convenient while you are getting started. For production, host those assets yourself so your app controls runtime availability, caching, and compliance requirements.

## Download the Assets

Download the asset archive for the same CE.SDK Android version that your app uses. Android, iOS, and web archives are platform-specific, so use the `cesdk-android` package path for Android projects.

[Download Assets (v1.83.0-nightly.20260905)](https://cdn.img.ly/packages/imgly/cesdk-android/1.83.0-nightly.20260905/imgly-assets.zip)

Or download and extract it from the command line:

```bash
curl -O https://cdn.img.ly/packages/imgly/cesdk-android/1.83.0-nightly.20260905/imgly-assets.zip
unzip imgly-assets.zip -d imgly-assets
```

The archive extracts an inner `assets/` directory. Deploy or copy that inner folder, for example `imgly-assets/assets/`, and point your `baseUri` at it. Inside that folder, CE.SDK expects one `ly.img.*` directory per asset source, the `fonts/` and `emoji/` directories, and preview thumbnail directories such as `ly.img.animation` and `ly.img.animation.text`. Thumbnail directories do not contain `content.json` manifests, so keep them at your asset base URI but do not register them as asset sources.

## Register the Default Asset Sources

Each asset source is described by a `content.json` manifest. Register a source by pointing `engine.asset.addLocalSourceFromJSON(...)` at its manifest URI; the engine resolves the files in that source relative to the manifest location.

```kotlin highlight-android-default-source-ids
private val serveAssetsDefaultSourceIds =
    listOf(
        "ly.img.sticker",
        "ly.img.vector.shape",
        "ly.img.filter",
        "ly.img.color.palette",
        "ly.img.effect",
        "ly.img.blur",
        "ly.img.typeface",
        "ly.img.crop.presets",
        "ly.img.page.presets",
        "ly.img.text",
        "ly.img.text.styles",
        "ly.img.text.curves",
        "ly.img.text.components",
        "ly.img.caption.presets",
    )
```

Use the same helper for every default source ID. The sample skips sources that are already registered so the setup is safe to call when your editor or test reuses an Engine instance.

```kotlin highlight-android-register-sources
private suspend fun registerServeAssetSources(
    engine: Engine,
    baseUri: Uri,
    sourceIds: List<String>,
    matchersBySourceId: Map<String, List<String>> = emptyMap(),
): List<String> {
    val existingSourceIds = engine.asset.findAllSources().toSet()
    val registeredSourceIds = mutableListOf<String>()

    sourceIds
        .filterNot(existingSourceIds::contains)
        .forEach { sourceId ->
            registeredSourceIds +=
                engine.asset.addLocalSourceFromJSON(
                    contentUri = baseUri.buildUpon()
                        .appendPath(sourceId)
                        .appendPath("content.json")
                        .build(),
                    matcher = matchersBySourceId[sourceId],
                )
        }

    return registeredSourceIds
}
```

The default sources are:

- `ly.img.sticker` — Stickers.
- `ly.img.vector.shape` — Shapes and arrows.
- `ly.img.filter` — LUT and duotone color filters.
- `ly.img.color.palette` — Default color palette.
- `ly.img.effect` — Effects.
- `ly.img.blur` — Blurs.
- `ly.img.typeface` — Typefaces.
- `ly.img.crop.presets` — Crop presets.
- `ly.img.page.presets` — Page resize presets.
- `ly.img.text`, `ly.img.text.styles`, `ly.img.text.curves` — Text presets.
- `ly.img.text.components` — Text design component library.
- `ly.img.caption.presets` — Caption style presets for video captions.

## Register Sample Content Sources

The archive also ships sample content for development and prototyping. Register these sources the same way when you want the editor to show the bundled demo images, videos, audio, or templates; replace them with your own content sources in production.

```kotlin highlight-android-sample-source-ids
private val serveAssetsSampleSourceIds =
    listOf(
        "ly.img.image",
        "ly.img.video",
        "ly.img.audio",
        "ly.img.templates",
        "ly.img.templates.premium",
    )
```

The sample content sources are:

- `ly.img.image` — Sample images.
- `ly.img.video` — Sample videos.
- `ly.img.audio` — Sample audio.
- `ly.img.templates` — Sample design templates.
- `ly.img.templates.premium` — Premium sample design templates.

## Point the Base URI at Your Assets

Set `baseUri` to the deployed or bundled inner `assets/` folder that contains the per-source directories, then register the sources from that location.

For assets on your own server or CDN, use an absolute HTTPS URI that points at the deployed inner `assets/` folder:

```kotlin highlight-android-remote-base-uri
return Uri.parse("https://cdn.your.custom.domain/assets")
```

For assets bundled with your app, copy the extracted `imgly-assets/assets/` folder into your app module's `src/main/assets/` directory. This produces paths such as `src/main/assets/assets/ly.img.sticker/content.json`, so the Android assets URI points at `file:///android_asset/assets`:

```kotlin highlight-android-app-assets-base-uri
return Uri.parse("file:///android_asset/assets")
```

> **Note:** If you use the Android [Starter Kits](./starterkits.md) or the `Editor`
> composable, pass your self-hosted location through the `baseUri` parameter.
> The editor sets the Engine `basePath` from that value before configuration
> callbacks run, so your callback can register sources from
> `editorContext.baseUri`.

## Customize Which Assets Load

To register only part of a source, pass ID patterns to the `matcher` parameter when you register that source.
Asset source IDs must be unique, so use this instead of registering the same source earlier without a matcher.
Patterns support the `*` wildcard, and an asset is included when it matches any pattern.

```kotlin highlight-android-filtered-source
registerServeAssetSources(
    engine = engine,
    baseUri = baseUri,
    sourceIds = listOf("ly.img.sticker"),
    matchersBySourceId =
        mapOf(
            "ly.img.sticker" to listOf("ly.img.sticker.emoji.*"),
        ),
)
```

For deeper curation, edit the `content.json` manifests before you deploy them to your server or app assets.

## Configure Engine-Level Assets

The engine also loads font fallback files for Unicode coverage and the emoji font separately from asset sources. Point the `basePath` setting at the same location so those files load from your self-hosted assets:

```kotlin highlight-android-engine-level-assets
engine.editor.setSettingString(
    keypath = "basePath",
    value = baseUri.toString(),
)
```

This setting affects:

- **Font fallback files** — Used when text contains characters not covered by the selected font. Android currently loads fallback files from `{basePath}/fonts/font-{index}.ttf` only when `basePath` is an `http` or `https` URI. For `file://` and Android app-asset URIs, fallback font files still load from `https://cdn.img.ly/assets/v4`.
- **Emoji font** — The default emoji font (`NotoColorEmoji.ttf`). Located at `{basePath}/emoji/NotoColorEmoji.ttf`; this resolves from local, app-asset, or remote base paths.

Both directories are included in the asset archive. Deploy the extracted `fonts/` and `emoji/` directories with your remote asset base URI. For bundled app assets, include `emoji/` for local emoji loading, but keep in mind that fallback font files still use the IMG.LY CDN fallback today.

## API Reference

| Method | Description |
| --- | --- |
| `engine.asset.addLocalSourceFromJSON(contentUri=_, matcher=_)` | Register an asset source by loading its `content.json` manifest from a URI. Pass `matcher` ID patterns to filter which assets load. |
| `engine.asset.findAllSources()` | Check which asset source IDs are already registered. |
| `engine.editor.setSettingString(keypath="basePath", value=_)` | Set the base URI used for font fallback files, emoji assets, animation thumbnails, and other relative resource paths. |
| `engine.editor.getSettingString(keypath="basePath")` | Read the current Engine base path. |

## Next Steps

- [Assets](./concepts/assets.md) — How asset sources and assets fit together.
- [Insert Shapes or Stickers](./insert-media/shapes-or-stickers.md) — Add shapes and stickers to your designs using CE.SDK. Create rectangles, ellipses, stars, polygons, lines, and custom vector paths programmatically or through the built-in UI.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support