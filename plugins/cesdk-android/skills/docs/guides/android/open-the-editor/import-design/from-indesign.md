> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Open the Editor](../../open-the-editor.md) > [Import a Design](../import-design.md) > [From InDesign](./from-indesign.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-open-the-editor-import-design-from-indesign/ImportFromInDesign.kt reference-only
import android.net.Uri
import ly.img.engine.DesignBlock
import ly.img.engine.Engine

suspend fun importFromInDesign(
    engine: Engine,
    archiveUri: Uri,
): DesignBlock {
    val scene = engine.scene.load(
        sceneUri = archiveUri,
        waitForResources = true,
    )

    check(engine.scene.getPages().isNotEmpty()) {
        "The converted InDesign archive contains no pages."
    }

    engine.scene.zoomToBlock(
        block = scene,
        paddingLeft = 40F,
        paddingTop = 40F,
        paddingRight = 40F,
        paddingBottom = 40F,
    )

    return scene
}
```

Load a CE.SDK archive converted from an Adobe InDesign IDML file into your
Android app, then continue editing the imported design.

> **Reading time:** 4 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.82.0-nightly.20260823/engine-guides-open-the-editor-import-design-from-indesign)

<EngineReferenceNote {...props} />

Android does not parse IDML files. Convert the IDML into a self-contained
`.imgly` archive in a browser or Node.js environment, then deliver that archive
to the app through your backend, app storage, or a user-selected document. For
server-side conversion, use the [Node.js importer](./from-indesign.md).

## Conversion Prerequisite

> **Commercial Runtime License:** For commercial use, your CE.SDK license must cover the runtime performing
> conversion: Web for browser conversion or Node.js for server conversion. An
> Android-only license does not cover either conversion runtime.

## Load the Converted Archive

Convert the IDML once with `@imgly/idml-importer` in a browser or Node.js
environment, save the resulting `.imgly` archive, and make its `Uri` available
to Android. The archive bundles the converted scene with its embedded assets,
so `load()` can replace the active scene without Android reading the
original IDML file.

```kotlin highlight-android-load-converted-archive
val scene = engine.scene.load(
    sceneUri = archiveUri,
    waitForResources = true,
)
```

Pass a local file URI, a readable Android content URI, or a remote HTTPS URI.
`waitForResources=true` resumes the coroutine after the archive's bundled
resources are ready for editing or export.

## Verify the Import

Confirm that the loaded scene contains pages before showing it in your app. An
empty page list means the converted archive has no usable design pages.

```kotlin highlight-android-verify-import
check(engine.scene.getPages().isNotEmpty()) {
    "The converted InDesign archive contains no pages."
}
```

## Fit the Scene to the Viewport

Frame the loaded scene after the archive is ready. The padding values are
screen pixels around the focused scene.

```kotlin highlight-android-fit-viewport
engine.scene.zoomToBlock(
    block = scene,
    paddingLeft = 40F,
    paddingTop = 40F,
    paddingRight = 40F,
    paddingBottom = 40F,
)
```

## What Gets Imported

The conversion can preserve element grouping, positioning, rotation,
transparency, text with bold and italic styling, shapes, solid and gradient
fills, strokes, and embedded images. Android receives the converted scene in
the archive and can edit it like any other CE.SDK scene.

## Limitations

These conversion limits apply before the archive reaches Android:

- **Linked images** become placeholders. Embed images in InDesign before exporting to IDML.
- **Text flow** between multiple frames is not supported and may appear duplicated.
- **Image fitting** can differ when images are shrunk inside their frames.
- **Embedded PDF or Adobe Illustrator content** needs the embedded importer during conversion; otherwise it becomes a placeholder.
- **Unavailable fonts** use fallbacks selected during conversion.
- **Complex text formatting** beyond bold and italic may not be preserved.

These are the highlights only—the [`@imgly/idml-importer`](https://www.npmjs.com/package/@imgly/idml-importer) page on npm maintains the complete, up-to-date list of supported features and limitations.

## API Reference

| Method | Description |
| --- | --- |
| `engine.scene.load(sceneUri=_, overrideEditorConfig=_, waitForResources=_)` | Load the converted archive and its bundled assets from a URI. |
| `engine.scene.getPages()` | Return the pages in the active imported scene. |
| `engine.scene.zoomToBlock(block=_, paddingLeft=_, paddingTop=_, paddingRight=_, paddingBottom=_)` | Fit the imported scene in the viewport with screen-pixel padding. |

## Next Steps

- [Import Design from Archive](./from-archive.md) — Load CE.SDK archives from storage, document providers, or remote locations.
- [Import Templates](../../create-templates/import.md) — Load templates from scene files, archives, and serialized strings.
- [Export Overview](../../export-save-publish/export/overview.md) — Export the imported design to images, documents, and other formats.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support