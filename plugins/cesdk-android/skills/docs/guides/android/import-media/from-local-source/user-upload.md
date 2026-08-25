> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Import From Local Source](../from-local-source.md) > [From User Upload](./user-upload.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-import-media-from-local-source-user-upload/UserUploadEditorSolution.kt reference-only
import android.content.Context
import android.net.Uri
import android.webkit.MimeTypeMap
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.core.net.toUri
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import ly.img.editor.Editor
import ly.img.editor.core.R
import ly.img.editor.core.component.Dock
import ly.img.editor.core.component.NavigationBar
import ly.img.editor.core.component.remember
import ly.img.editor.core.component.rememberCloseEditor
import ly.img.editor.core.component.rememberImagesLibrary
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.library.AssetLibrary
import ly.img.editor.core.library.AssetType
import ly.img.editor.core.library.LibraryCategory
import ly.img.editor.core.library.LibraryContent
import ly.img.editor.core.library.data.AssetSourceType
import ly.img.editor.core.library.data.UploadAssetSourceType
import ly.img.engine.AssetDefinition
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.util.UUID

@Composable
fun UserUploadEditorSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    val engine = editorContext.engine
                    val scene = engine.scene.create()
                    val page = engine.block.create(DesignBlockType.Page)
                    engine.block.setWidth(block = page, value = 1080F)
                    engine.block.setHeight(block = page, value = 1080F)
                    engine.block.setFill(block = page, fill = engine.block.createFill(FillType.Color))
                    engine.block.appendChild(parent = scene, child = page)
                    registerUploadAssetSources(engine)
                }
                assetLibrary = {
                    remember {
                        userUploadAssetLibrary()
                    }
                }
                onUpload = { assetDefinition, uploadSource ->
                    persistUploadedAsset(
                        context = editorContext.activity,
                        assetDefinition = assetDefinition,
                        uploadSource = uploadSource,
                    )
                }
                navigationBar = {
                    NavigationBar.remember {
                        listBuilder = {
                            NavigationBar.ListBuilder.remember {
                                aligned(alignment = Alignment.Start) {
                                    add { NavigationBar.Button.rememberCloseEditor() }
                                }
                            }
                        }
                    }
                }
                dock = {
                    Dock.remember {
                        listBuilder = {
                            Dock.ListBuilder.remember {
                                add { Dock.Button.rememberImagesLibrary() }
                            }
                        }
                        horizontalArrangement = { Arrangement.Center }
                    }
                }
            }
        },
        onClose = onClose,
    )
}

private fun registerUploadAssetSources(engine: Engine) {
    val existingSources = engine.asset.findAllSources().toSet()

    fun addIfMissing(
        source: UploadAssetSourceType,
        mimeTypes: List<String>,
    ) {
        if (source.sourceId !in existingSources) {
            engine.asset.addLocalSource(
                sourceId = source.sourceId,
                supportedMimeTypes = mimeTypes,
            )
        }
    }

    addIfMissing(
        source = AssetSourceType.ImageUploads,
        mimeTypes = listOf(
            "image/jpeg",
            "image/png",
            "image/heic",
            "image/heif",
            "image/svg+xml",
            "image/gif",
            "image/apng",
            "image/bmp",
            "image/webp",
        ),
    )
}

private fun userUploadAssetLibrary(): AssetLibrary {
    val images = LibraryCategory.Images.copy(
        content = LibraryContent.Sections(
            titleRes = R.string.ly_img_editor_asset_library_title_images,
            sections = listOf(
                LibraryContent.Section(
                    titleRes = R.string.ly_img_editor_asset_library_section_gallery,
                    sourceTypes = listOf(AssetSourceType.GalleryImage),
                    assetType = AssetType.Image,
                    expandContent = LibraryContent.Grid(
                        titleRes = R.string.ly_img_editor_asset_library_section_gallery,
                        sourceType = AssetSourceType.GalleryImage,
                        assetType = AssetType.Image,
                    ),
                ),
                LibraryContent.Section(
                    titleRes = R.string.ly_img_editor_asset_library_section_image_uploads,
                    sourceTypes = listOf(AssetSourceType.ImageUploads),
                    assetType = AssetType.Image,
                    expandContent = LibraryContent.Grid(
                        titleRes = R.string.ly_img_editor_asset_library_section_image_uploads,
                        sourceType = AssetSourceType.ImageUploads,
                        assetType = AssetType.Image,
                    ),
                ),
            ),
        ),
    )
    return AssetLibrary.getDefault(
        tabs = listOf(
            AssetLibrary.Tab.IMAGES,
        ),
        images = images,
    )
}

private suspend fun persistUploadedAsset(
    context: Context,
    assetDefinition: AssetDefinition,
    uploadSource: UploadAssetSourceType,
): AssetDefinition {
    val meta = assetDefinition.meta ?: return assetDefinition
    val sourceUri = meta["uri"]?.toUri() ?: return assetDefinition
    val persistentUri = copyUriToAppStorage(
        context = context,
        sourceUri = sourceUri,
        uploadSource = uploadSource,
        fileLabel = "media",
    )

    val updatedMeta = meta.toMutableMap()
    updatedMeta["uri"] = persistentUri.toString()
    meta["thumbUri"]?.let { thumbnail ->
        updatedMeta["thumbUri"] = if (thumbnail == sourceUri.toString()) {
            persistentUri.toString()
        } else {
            copyUriToAppStorage(
                context = context,
                sourceUri = thumbnail.toUri(),
                uploadSource = uploadSource,
                fileLabel = "thumbnail",
            ).toString()
        }
    }

    return assetDefinition.copy(meta = updatedMeta)
}

private suspend fun copyUriToAppStorage(
    context: Context,
    sourceUri: Uri,
    uploadSource: UploadAssetSourceType,
    fileLabel: String,
): Uri = withContext(Dispatchers.IO) {
    val directory = File(context.filesDir, "cesdk-user-uploads/${uploadSource.sourceId}")
    directory.mkdirs()
    val extension = sourceUri.extension(context, uploadSource)
    val outputFile = File(directory, "$fileLabel-${UUID.randomUUID()}.$extension")

    openUriInputStream(context, sourceUri).use { input ->
        FileOutputStream(outputFile).use { output ->
            input.copyTo(output)
        }
    }

    Uri.fromFile(outputFile)
}

private fun openUriInputStream(
    context: Context,
    sourceUri: Uri,
) = context.contentResolver.openInputStream(sourceUri)
    ?: if (sourceUri.scheme == "file") {
        FileInputStream(requireNotNull(sourceUri.path) { "File URI has no path." })
    } else {
        error("Cannot read uploaded asset URI: $sourceUri")
    }

private fun Uri.extension(
    context: Context,
    uploadSource: UploadAssetSourceType,
): String {
    val detectedExtension = context.contentResolver.getType(this)?.let { mimeType ->
        MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType)
    }
    if (!detectedExtension.isNullOrBlank()) return detectedExtension

    return when (uploadSource.sourceId) {
        AssetSourceType.VideoUploads.sourceId -> "mp4"
        AssetSourceType.AudioUploads.sourceId -> "m4a"
        else -> "jpg"
    }
}
```

Let users pick images from their Android device, add those files to an upload
asset source, and replace temporary file URIs with app-owned storage before
the assets appear in the editor.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.1-rc.0/editor-guides-import-media-from-local-source-user-upload)

Android user uploads are handled by upload asset sources in the CE.SDK editor
UI. The editor opens the system picker or camera intent, creates an
`AssetDefinition`, calls `EditorConfiguration.onUpload`, and then adds the
returned asset to the matching local source.

This guide focuses on image uploads. Use the same Android APIs with
`AssetSourceType.VideoUploads` or `AssetSourceType.AudioUploads` and matching
MIME types when your editor exposes video or audio upload sections.

## Register Upload Sources

Upload buttons only work for asset sources that are registered in the engine.
Create or load your scene in `onCreate`, then register the local upload source
that your asset library should display before `onCreate` returns.

```kotlin highlight-android-create-scene-and-sources
onCreate = {
    val engine = editorContext.engine
    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1080F)
    engine.block.setHeight(block = page, value = 1080F)
    engine.block.setFill(block = page, fill = engine.block.createFill(FillType.Color))
    engine.block.appendChild(parent = scene, child = page)
    registerUploadAssetSources(engine)
}
```

The sample registers the predefined image upload source ID used by the editor
UI. Use MIME types that match the files your app accepts.

```kotlin highlight-android-register-upload-sources
private fun registerUploadAssetSources(engine: Engine) {
    val existingSources = engine.asset.findAllSources().toSet()

    fun addIfMissing(
        source: UploadAssetSourceType,
        mimeTypes: List<String>,
    ) {
        if (source.sourceId !in existingSources) {
            engine.asset.addLocalSource(
                sourceId = source.sourceId,
                supportedMimeTypes = mimeTypes,
            )
        }
    }

    addIfMissing(
        source = AssetSourceType.ImageUploads,
        mimeTypes = listOf(
            "image/jpeg",
            "image/png",
            "image/heic",
            "image/heif",
            "image/svg+xml",
            "image/gif",
            "image/apng",
            "image/bmp",
            "image/webp",
        ),
    )
}
```

The picker filters by the upload source type, while the local source stores the
accepted asset definitions.

## Show Uploads in the Asset Library

The upload UI appears when a library section contains one
`UploadAssetSourceType` and `showUpload` stays enabled. This sample keeps the
system gallery section in place so the editor can request media permissions,
then adds a separate upload section for persisted files.

```kotlin highlight-android-show-upload-sources
assetLibrary = {
    remember {
        userUploadAssetLibrary()
    }
}
```

The asset-library helper keeps the rest of the editor unchanged but limits the
media tabs to the system gallery and user-uploaded assets.

```kotlin highlight-android-upload-asset-library
private fun userUploadAssetLibrary(): AssetLibrary {
    val images = LibraryCategory.Images.copy(
        content = LibraryContent.Sections(
            titleRes = R.string.ly_img_editor_asset_library_title_images,
            sections = listOf(
                LibraryContent.Section(
                    titleRes = R.string.ly_img_editor_asset_library_section_gallery,
                    sourceTypes = listOf(AssetSourceType.GalleryImage),
                    assetType = AssetType.Image,
                    expandContent = LibraryContent.Grid(
                        titleRes = R.string.ly_img_editor_asset_library_section_gallery,
                        sourceType = AssetSourceType.GalleryImage,
                        assetType = AssetType.Image,
                    ),
                ),
                LibraryContent.Section(
                    titleRes = R.string.ly_img_editor_asset_library_section_image_uploads,
                    sourceTypes = listOf(AssetSourceType.ImageUploads),
                    assetType = AssetType.Image,
                    expandContent = LibraryContent.Grid(
                        titleRes = R.string.ly_img_editor_asset_library_section_image_uploads,
                        sourceType = AssetSourceType.ImageUploads,
                        assetType = AssetType.Image,
                    ),
                ),
            ),
        ),
    )
    return AssetLibrary.getDefault(
        tabs = listOf(
            AssetLibrary.Tab.IMAGES,
        ),
        images = images,
    )
}
```

For image sources, the button opens a small menu with system picker and camera
choices.

## Persist Uploaded Assets

When a user selects a file, CE.SDK creates an `AssetDefinition` with metadata
such as `meta["uri"]`, `meta["thumbUri"]`, and `meta["kind"]`. Use `onUpload` to
copy or upload the file before the asset is added to the source.

```kotlin highlight-android-handle-upload
onUpload = { assetDefinition, uploadSource ->
    persistUploadedAsset(
        context = editorContext.activity,
        assetDefinition = assetDefinition,
        uploadSource = uploadSource,
    )
}
```

The sample copies the selected URI into app-owned storage and returns an updated
definition with the new `meta["uri"]`. In production, replace the copy step with
your storage client and return the permanent CDN or backend URL instead.

```kotlin highlight-android-persist-upload
private suspend fun persistUploadedAsset(
    context: Context,
    assetDefinition: AssetDefinition,
    uploadSource: UploadAssetSourceType,
): AssetDefinition {
    val meta = assetDefinition.meta ?: return assetDefinition
    val sourceUri = meta["uri"]?.toUri() ?: return assetDefinition
    val persistentUri = copyUriToAppStorage(
        context = context,
        sourceUri = sourceUri,
        uploadSource = uploadSource,
        fileLabel = "media",
    )

    val updatedMeta = meta.toMutableMap()
    updatedMeta["uri"] = persistentUri.toString()
    meta["thumbUri"]?.let { thumbnail ->
        updatedMeta["thumbUri"] = if (thumbnail == sourceUri.toString()) {
            persistentUri.toString()
        } else {
            copyUriToAppStorage(
                context = context,
                sourceUri = thumbnail.toUri(),
                uploadSource = uploadSource,
                fileLabel = "thumbnail",
            ).toString()
        }
    }

    return assetDefinition.copy(meta = updatedMeta)
}

private suspend fun copyUriToAppStorage(
    context: Context,
    sourceUri: Uri,
    uploadSource: UploadAssetSourceType,
    fileLabel: String,
): Uri = withContext(Dispatchers.IO) {
    val directory = File(context.filesDir, "cesdk-user-uploads/${uploadSource.sourceId}")
    directory.mkdirs()
    val extension = sourceUri.extension(context, uploadSource)
    val outputFile = File(directory, "$fileLabel-${UUID.randomUUID()}.$extension")

    openUriInputStream(context, sourceUri).use { input ->
        FileOutputStream(outputFile).use { output ->
            input.copyTo(output)
        }
    }

    Uri.fromFile(outputFile)
}

private fun openUriInputStream(
    context: Context,
    sourceUri: Uri,
) = context.contentResolver.openInputStream(sourceUri)
    ?: if (sourceUri.scheme == "file") {
        FileInputStream(requireNotNull(sourceUri.path) { "File URI has no path." })
    } else {
        error("Cannot read uploaded asset URI: $sourceUri")
    }

private fun Uri.extension(
    context: Context,
    uploadSource: UploadAssetSourceType,
): String {
    val detectedExtension = context.contentResolver.getType(this)?.let { mimeType ->
        MimeTypeMap.getSingleton().getExtensionFromMimeType(mimeType)
    }
    if (!detectedExtension.isNullOrBlank()) return detectedExtension

    return when (uploadSource.sourceId) {
        AssetSourceType.VideoUploads.sourceId -> "mp4"
        AssetSourceType.AudioUploads.sourceId -> "m4a"
        else -> "jpg"
    }
}
```

If the asset has a separate thumbnail URI, persist that thumbnail as well. If
the thumbnail points to the same URI as the media file, reuse the media URL in
`meta["thumbUri"]`.

## Android and Web Differences

Android does not expose the Web `UploadAssetSources` plugin,
`cesdk.actions.register('uploadFile', ...)`, or `cesdk.utils.localUpload()`.
Use the Android editor configuration instead:

| Android API | What it replaces from Web |
| --- | --- |
| `AssetSourceType.ImageUploads`, `VideoUploads`, or `AudioUploads` | Upload asset-source plugin IDs |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Adding upload-capable local sources |
| `EditorConfiguration.remember { onUpload = { assetDefinition, uploadSource -> ... } }` | Registering an upload handler |
| `AssetDefinition.copy(meta=_)` | Returning a changed asset definition |

The Android `onUpload` callback does not receive a CE.SDK progress callback. If
your storage client reports progress, keep that state in your app UI while the
suspending upload callback runs.

## API Reference

| API | Purpose |
| --- | --- |
| `EditorConfiguration.remember { onCreate = { ... } }` | Creates or loads the scene and registers upload asset sources. |
| `editorContext.engine` | Provides the editor-owned engine inside configuration callbacks. |
| `engine.scene.create()` | Creates the blank sample scene. |
| `engine.block.create(blockType=_)` | Creates the sample page block. |
| `engine.block.setWidth(block=_, value=_)` | Sets the sample page width. |
| `engine.block.setHeight(block=_, value=_)` | Sets the sample page height. |
| `engine.block.createFill(fillType=_)` | Creates the sample page fill. |
| `engine.block.setFill(block=_, fill=_)` | Assigns the sample page fill. |
| `engine.block.appendChild(parent=_, child=_)` | Adds the sample page to the scene. |
| `engine.asset.findAllSources()` | Reads registered source IDs before adding upload sources. |
| `engine.asset.addLocalSource(sourceId=_, supportedMimeTypes=_)` | Registers a local asset source that accepts uploaded assets. |
| `EditorConfiguration.remember { assetLibrary = { ... } }` | Provides the asset-library UI definition. |
| `AssetLibrary.getDefault(tabs=_, images=_)` | Builds the default editor library with a customized upload tab. |
| `LibraryContent.Section(sourceTypes=_, assetType=_)` | Defines a section that can show the upload button. |
| `LibraryContent.Grid(sourceType=_, assetType=_)` | Shows uploaded assets after opening a section. |
| `EditorConfiguration.remember { onUpload = { assetDefinition, uploadSource -> ... } }` | Customizes the asset before it is added to an upload source. |
| `assetDefinition.meta` | Reads the generated asset metadata, including file and thumbnail URIs. |
| `AssetDefinition.copy(meta=_)` | Returns an updated asset definition from `onUpload`. |

Related types:

| Type | Role |
| --- | --- |
| `AssetSourceType.ImageUploads` | Upload source type for images. |
| `AssetSourceType.GalleryImage` | System gallery source that can request media permissions. |
| `AssetSourceType.VideoUploads` | Optional counterpart for video upload sections. |
| `AssetSourceType.AudioUploads` | Optional counterpart for audio upload sections. |
| `UploadAssetSourceType` | Describes the upload source that triggered `onUpload`. |

## Troubleshooting

- **The upload button is not visible:** Ensure the library section contains one
  `UploadAssetSourceType`, the same source ID is registered with
  `engine.asset.addLocalSource(...)`.
- **The gallery cannot access media:** Keep a gallery source section available
  when you rely on editor-managed media permission prompts, or request media
  permission from your own app UI before showing an upload-only library.
- **Assets disappear after app restart:** Persist the file and asset metadata in
  app storage or a backend, then re-register saved definitions on startup.
- **Unsupported files appear in the picker:** Check the source MIME filter and
  the `supportedMimeTypes` passed to `addLocalSource(...)`.
- **Large files block the upload flow:** Do file copying or network transfer
  work off the main thread and return from `onUpload` only after the permanent
  URI is ready.

## Next Steps

- [Import From Remote Source](../from-remote-source.md) - connect CE.SDK to
  server-backed or third-party asset sources.
- [Customize the Asset Library](../asset-library/customize.md) - change library tabs,
  sections, and source ordering for your editor.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support