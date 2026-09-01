> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Open the Editor](../open-the-editor.md) > [URI Resolver](./uri-resolver.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-uri-resolver/UriResolver.kt reference-only
import android.net.Uri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.engine.Engine

private const val ASSET_BASE_PATH = "file:///android_asset"

suspend fun uriResolver(engine: Engine): List<Uri> = withContext(Dispatchers.Main) {
    val originalBasePath = engine.editor.getSettingString("basePath")
    engine.editor.setSettingString(keypath = "basePath", value = ASSET_BASE_PATH)

    try {
        val relativeAsset = Uri.parse("images/poster.jpg")
        val protectedAsset = Uri.parse("https://assets.example.com/protected/poster.jpg")

        val defaultRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)
        val defaultAbsoluteUri = engine.editor.getAbsoluteUri(uri = protectedAsset)

        val appAssetHost = "app.example.com"
        val storageHost = "assets.example.com"
        val appAsset = Uri.parse("https://$appAssetHost/images/poster.jpg")

        engine.editor.setUriResolver { uri ->
            if (uri.host == appAssetHost) {
                uri
                    .buildUpon()
                    .authority(storageHost)
                    .build()
            } else {
                engine.editor.defaultUriResolver(uri)
            }
        }

        val rewrittenAppAssetUri = engine.editor.getAbsoluteUri(uri = appAsset)

        val protectedHost = "assets.example.com"
        val protectedPrefix = "/protected/"
        val token = "precomputed-session-token"

        engine.editor.setUriResolver { uri ->
            val shouldAuthenticate =
                uri.host == protectedHost &&
                    uri.path?.startsWith(protectedPrefix) == true

            if (shouldAuthenticate) {
                uri
                    .buildUpon()
                    .appendQueryParameter("token", token)
                    .build()
            } else {
                engine.editor.defaultUriResolver(uri)
            }
        }

        val authenticatedUri = engine.editor.getAbsoluteUri(uri = protectedAsset)
        val delegatedRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)

        engine.editor.setUriResolver(null)
        val restoredRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)

        listOf(
            defaultRelativeUri,
            defaultAbsoluteUri,
            rewrittenAppAssetUri,
            authenticatedUri,
            delegatedRelativeUri,
            restoredRelativeUri,
        )
    } finally {
        engine.editor.setUriResolver(null)
        engine.editor.setUriResolverAsync(null)
        engine.editor.setSettingString(keypath = "basePath", value = originalBasePath)
    }
}
```

Learn how to intercept and transform asset URIs in CE.SDK, enabling
authentication and custom resolution logic.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260901/engine-guides-uri-resolver)

<EngineReferenceNote {...props} />

When CE.SDK loads an asset, it resolves the requested URI to an absolute `Uri` before fetching it. You can intercept this step to add authentication tokens, redirect to a different host, or transform URIs to match your application's asset storage.

## Default URI Resolution

By default, CE.SDK resolves relative paths against the Engine `basePath` setting. Absolute URIs with a scheme, such as `https://` or `file://`, pass through unchanged.

Use `getAbsoluteUri(uri=_)` to preview how a path resolves without loading the asset:

```kotlin highlight-android-test-resolution
        val relativeAsset = Uri.parse("images/poster.jpg")
        val protectedAsset = Uri.parse("https://assets.example.com/protected/poster.jpg")

        val defaultRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)
        val defaultAbsoluteUri = engine.editor.getAbsoluteUri(uri = protectedAsset)
```

## Custom URI Resolver

Register a custom resolver with `setUriResolver(resolver=_)`. CE.SDK routes each requested `Uri` through your resolver and fetches the absolute `Uri` it returns for that request only.

```kotlin highlight-android-set-resolver
        val appAssetHost = "app.example.com"
        val storageHost = "assets.example.com"
        val appAsset = Uri.parse("https://$appAssetHost/images/poster.jpg")

        engine.editor.setUriResolver { uri ->
            if (uri.host == appAssetHost) {
                uri
                    .buildUpon()
                    .authority(storageHost)
                    .build()
            } else {
                engine.editor.defaultUriResolver(uri)
            }
        }

        val rewrittenAppAssetUri = engine.editor.getAbsoluteUri(uri = appAsset)
```

Call `defaultUriResolver(uri=_)` for paths you do not transform. Without that fallback, unmatched relative paths stay unresolved.

## Adding Authentication

A common use case is attaching a token to protected asset URIs. The synchronous resolver is not a `suspend` function, so generate tokens before registering it and only read those prepared values inside the resolver.

```kotlin highlight-android-authentication
        val protectedHost = "assets.example.com"
        val protectedPrefix = "/protected/"
        val token = "precomputed-session-token"

        engine.editor.setUriResolver { uri ->
            val shouldAuthenticate =
                uri.host == protectedHost &&
                    uri.path?.startsWith(protectedPrefix) == true

            if (shouldAuthenticate) {
                uri
                    .buildUpon()
                    .appendQueryParameter("token", token)
                    .build()
            } else {
                engine.editor.defaultUriResolver(uri)
            }
        }

        val authenticatedUri = engine.editor.getAbsoluteUri(uri = protectedAsset)
        val delegatedRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)
```

Your asset server validates the query parameter and serves the protected asset. If each request needs a backend exchange for a short-lived URL, register a suspendable resolver with `setUriResolverAsync(resolver=_)` instead.

## Removing a Resolver

Pass `null` to the resolver setter to restore default behavior. A later synchronous or asynchronous resolver replaces the active custom resolver.

```kotlin highlight-android-remove-resolver
engine.editor.setUriResolver(null)
val restoredRelativeUri = engine.editor.getAbsoluteUri(uri = relativeAsset)
```

## Key Constraints

- **Return absolute URIs**: Always return a `Uri` with a scheme, such as `https://`, `file://`, or `content://`.
- **Choose sync or async deliberately**: Use `setUriResolver(resolver=_)` for precomputed values. Use `setUriResolverAsync(resolver=_)` when resolution must suspend for I/O.
- **Keep one resolver active**: New resolver registrations replace previous ones.
- **Delegate unmatched paths**: Call `defaultUriResolver(uri=_)` for any URI your custom logic does not handle.

## API Reference

| API | Purpose |
| --- | --- |
| `engine.editor.getAbsoluteUri(uri=_)` | Resolves a `Uri` through the active custom resolver or default resolver without loading the asset |
| `engine.editor.setUriResolver(resolver=_)` | Registers a non-suspending resolver that returns an absolute `Uri` |
| `engine.editor.setUriResolver(null)` | Clears the active custom resolver through the synchronous setter |
| `engine.editor.setUriResolverAsync(resolver=_)` | Registers a suspendable resolver for I/O-backed URI resolution |
| `engine.editor.setUriResolverAsync(null)` | Clears the active custom resolver through the asynchronous setter |
| `engine.editor.defaultUriResolver(uri=_)` | Applies CE.SDK's default `basePath` resolution for delegated URIs |

## Next Steps

- [Configuration](../configuration.md) — Learn how to configure CE.SDK to match your application's functional, visual, and performance requirements.
- [Import From Remote Source](../import-media/from-remote-source.md) — Connect CE.SDK to external sources like servers or third-party platforms to import assets remotely.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support