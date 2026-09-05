> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

---

```kotlin file=@cesdk_android_examples/editor-guides-auto-captions-plugin/AutoCaptionsPluginSolution.kt reference-only
import androidx.compose.runtime.Composable
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.callback.onCreate
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.plugin.autoCaptions.AutoCaptionsPlugin
import ly.img.editor.plugin.autoCaptions.TranscriptionOptions
import ly.img.editor.plugin.autoCaptions.TranscriptionProvider
import ly.img.editor.plugin.autoCaptions.gateway.GatewayTranscriptionProvider
import okhttp3.Call
import okhttp3.Callback
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.Response
import java.io.File
import java.io.IOException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException

// Add this composable to your NavHost.
@Composable
fun AutoCaptionsPluginSolution(
    license: String,
    gatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration
                .remember(::VideoConfigurationBuilder) {
                    onCreate = {
                        // Demo scaffolding — not part of the lesson: open a sample clip so the canvas shows
                        // footage behind the captions sheet and Generate Automatically has speech to transcribe.
                        onCreate(
                            createScene = {
                                editorContext.engine.scene.createFromVideo(
                                    videoUri = editorContext.baseUri
                                        .buildUpon()
                                        .appendPath("ly.img.video")
                                        .appendPath("videos")
                                        .appendPath("pexels-kampus-production-8154913.mp4")
                                        .build(),
                                )
                            },
                        )
                    }
                }
                .then(::AutoCaptionsPlugin) {
                    provider = GatewayTranscriptionProvider(apiKey = gatewayApiKey)
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun AutoCaptionsTranscriptionOptionsSolution(
    license: String,
    gatewayApiKey: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::VideoConfigurationBuilder)
                .then(::AutoCaptionsPlugin) {
                    provider = GatewayTranscriptionProvider(apiKey = gatewayApiKey)
                    options = TranscriptionOptions(
                        language = "en",
                        maxLineLength = 30,
                        maxLines = 2,
                    )
                }
        },
        onClose = onClose,
    )
}

/**
 * A minimal custom provider: post the audio to any speech-to-text service and return SRT text.
 */
class CustomTranscriptionProvider(
    private val httpClient: OkHttpClient = OkHttpClient(),
) : TranscriptionProvider {
    override val name = "My Speech-to-Text Service"

    override suspend fun transcribe(
        audio: File,
        mimeType: String,
        options: TranscriptionOptions,
    ): String {
        val url = "https://example.com/transcribe".toHttpUrl()
            .newBuilder()
            .apply { options.language?.let { addQueryParameter("language", it) } }
            .build()
        val request = Request.Builder()
            .url(url)
            // The file streams out in segments; reading it into memory first would defeat the point of
            // receiving one, since a scene's audio has no size limit.
            .post(audio.asRequestBody(mimeType.toMediaType()))
            .build()

        return suspendCancellableCoroutine { continuation ->
            val call = httpClient.newCall(request)
            // Tapping Cancel cancels the surrounding coroutine; aborting the call stops the request from
            // running on to its timeout.
            continuation.invokeOnCancellation { call.cancel() }
            call.enqueue(
                object : Callback {
                    override fun onFailure(
                        call: Call,
                        e: IOException,
                    ) = continuation.resumeWithException(e)

                    override fun onResponse(
                        call: Call,
                        response: Response,
                    ) {
                        response.use {
                            if (!it.isSuccessful) {
                                continuation.resumeWithException(IOException("Transcription failed: ${it.code}"))
                            } else {
                                // Convert your service's response to SRT here, and return an empty string
                                // when it reports no speech.
                                continuation.resume(it.body?.string().orEmpty())
                            }
                        }
                    }
                },
            )
        }
    }
}

@Composable
private fun AutoCaptionsCustomProviderSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::VideoConfigurationBuilder)
                .then(::AutoCaptionsPlugin) {
                    provider = CustomTranscriptionProvider()
                }
        },
        onClose = onClose,
    )
}

@Composable
private fun AutoCaptionsGenerationCallbackSolution(
    license: String,
    onClose: (Throwable?) -> Unit,
) {
    Editor(
        license = license,
        configuration = {
            EditorConfiguration
                .remember(::VideoConfigurationBuilder)
                .then(::AutoCaptionsPlugin) {
                    // The plugin still owns the Generate action and its cancellable progress state; only the
                    // transcription is yours. It validates a provider at setup either way, so one is still
                    // required even though a replaced generator never calls it.
                    provider = CustomTranscriptionProvider()
                    captionsGeneration = {
                        // Replace this with your own pipeline: transcribe the scene's audible content —
                        // editorContext.engine reads it — and serialize the cues as SRT or VTT, timed relative
                        // to the page timeline. The fixed cue below stands in for that work.
                        val srt = """
                            1
                            00:00:00,000 --> 00:00:03,000
                            Captions from a custom pipeline
                        """.trimIndent()
                        // Returning null tells the user no speech was detected; any error thrown shows a
                        // generic message and reaches the integrator's `onError`.
                        if (srt.isBlank()) {
                            null
                        } else {
                            withContext(Dispatchers.IO) {
                                File.createTempFile("captions", ".srt", editorContext.activity.cacheDir)
                                    .apply { writeText(srt) }
                            }
                        }
                    }
                }
        },
        onClose = onClose,
    )
}
```

Generate captions automatically from spoken audio in video and audio blocks using CE.SDK's Auto Captions plugin.

![The Add Captions sheet in the Android video editor with the Generate Automatically action](https://img.ly/docs/cesdk/android/user-interface/ai-integration/auto-captions-73368c/assets/android.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260905/editor-guides-auto-captions-plugin)

The Auto Captions plugin transcribes the scene's audible content and creates styled, time-synced caption blocks from the result. It ships with a built-in provider that runs the ElevenLabs Scribe v2 speech-to-text model through the IMG.LY AI Gateway, and you can plug in any speech-to-text service by implementing the `TranscriptionProvider` interface. For creating and editing captions by hand, see [Edit Captions](../../edit-video/edit-captions.md).

The example builds on the [Video Editor Starter Kit](../../starterkits/video-editor.md)'s `VideoConfigurationBuilder`, whose dock already carries the captions button. The plugin's action lives in the Add Captions sheet, so an editor configuration of your own needs that button too, or there is no way to reach the action — see [Edit Captions](../../edit-video/edit-captions.md).

## Using the Built-in UI

Registering the plugin adds a primary **Generate Automatically** action to the Add Captions sheet, which opens from the captions dock button. Like the sheet's other starting points, it shows only while the page has no captions yet, and it stays disabled until the page holds audio or video to transcribe.

Tapping **Generate Automatically** replaces the sheet's actions with a **Generating Captions** state and a **Cancel** button. Nothing reaches the scene until the transcription returns, which is what makes **Cancel** leave it untouched. The run belongs to the editor rather than the sheet, so dismissing the sheet to look at the timeline does not throw a long transcription away — reopening finds it still running, and a result that arrives while the sheet is closed still lands. On success the result is imported through the same path as an SRT or VTT file: captions arrive styled with the default preset and time-synced, and the whole run lands as a single undo step. The sheet then switches to the Edit Captions list, where you tap a caption to edit its text and use the keyboard action bar to split, merge, add, and delete — see [Edit Captions](../../edit-video/edit-captions.md).

The plugin transcribes the current page's audible content as a whole: every audio block and every video with an audio track. Muted blocks, blocks with their volume at zero, and videos without an audio track are skipped silently, and each block's cues are placed at its position on the page timeline — trimming and playback speed included. Where two sources overlap in time, the higher-ranked one wins: voiceover first, then video, then other audio. A source only claims the stretches it actually speaks for, not the whole clip it sits in, so a short voiceover over a long video no longer silences the video underneath it for the clip's full length. There is no per-block picker: the action always covers the whole page.

## Installing the Plugin

Add the plugin to the module that hosts CE.SDK. It follows CE.SDK's unified versioning, so install the version that matches your editor version:

```groovy
dependencies {
    implementation("ly.img:plugin-auto-captions:1.83.0-nightly.20260905")
}
```

The plugin reaches its transcription service over the network. It needs no permission of its own — `android.permission.INTERNET` already merges in from the engine.

The editor does not depend on the plugin. The plugin publishes its generator into the editor's state under a key of its own, and the Add Captions sheet reads that key and leaves **Generate Automatically** out when nothing is published — which is how the sheet offers the action without the editor carrying a transcription stack nobody asked for. Nothing captions-specific sits in the editor's own modules: the `CaptionsGenerator` alias belongs to the plugin, the sheet spells the function type inline, and the editor never names a class that would be missing whenever the plugin isn't installed. Returning `null` is how a generator reports that there was nothing to transcribe.

## Configuring the Built-in Provider

Import the editor configuration APIs, the plugin, and the provider where you build your editor configuration:

```kotlin highlight-android-auto-captions-imports
import androidx.compose.runtime.Composable
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import ly.img.editor.Editor
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.configuration.video.callback.onCreate
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.configuration.then
import ly.img.editor.plugin.autoCaptions.AutoCaptionsPlugin
import ly.img.editor.plugin.autoCaptions.TranscriptionOptions
import ly.img.editor.plugin.autoCaptions.TranscriptionProvider
import ly.img.editor.plugin.autoCaptions.gateway.GatewayTranscriptionProvider
import okhttp3.Call
import okhttp3.Callback
import okhttp3.HttpUrl.Companion.toHttpUrl
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.asRequestBody
import okhttp3.Response
import java.io.File
import java.io.IOException
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
```

Chain `AutoCaptionsPlugin` onto your editor configuration with `then` and give it a provider. The built-in `GatewayTranscriptionProvider` only needs an IMG.LY API key — the gateway handles provider routing, billing, and asset storage:

```kotlin highlight-android-auto-captions-basic-setup
Editor(
    license = license, // pass null or empty for evaluation mode with watermark
    configuration = {
        EditorConfiguration
            .remember(::VideoConfigurationBuilder) {
                onCreate = {
                    // Demo scaffolding — not part of the lesson: open a sample clip so the canvas shows
                    // footage behind the captions sheet and Generate Automatically has speech to transcribe.
                    onCreate(
                        createScene = {
                            editorContext.engine.scene.createFromVideo(
                                videoUri = editorContext.baseUri
                                    .buildUpon()
                                    .appendPath("ly.img.video")
                                    .appendPath("videos")
                                    .appendPath("pexels-kampus-production-8154913.mp4")
                                    .build(),
                            )
                        },
                    )
                }
            }
            .then(::AutoCaptionsPlugin) {
                provider = GatewayTranscriptionProvider(apiKey = gatewayApiKey)
            }
    },
    onClose = onClose,
)
```

You create and manage API keys in the IMG.LY Dashboard. Keys use the `sk_` prefix, and you control which AI models a key can access and its credit budget per key in the Dashboard. The provider also accepts a `gatewayUrl` for a custom gateway base URL and an `httpClient`, so you can route requests through your own OkHttp client — an interceptor that injects a header, or a proxy.

Registering the plugin is the whole change: the starter kit's dock already opens the Add Captions sheet where the action appears. See [Edit Captions](../../edit-video/edit-captions.md) for the full captions surface, including the dock button a configuration of your own has to add and the caption inspector buttons.

> **Warning:** A missing provider fails at editor setup rather than the first time somebody taps **Generate Automatically**, so a checkout without a key does not reach the user as a generic error.

## Transcription Options

Set `options` to control the transcription language and how the transcript is broken into subtitle cues:

```kotlin highlight-android-auto-captions-transcription-options
.then(::AutoCaptionsPlugin) {
    provider = GatewayTranscriptionProvider(apiKey = gatewayApiKey)
    options = TranscriptionOptions(
        language = "en",
        maxLineLength = 30,
        maxLines = 2,
    )
}
```

| Option | Default | Purpose |
| --- | --- | --- |
| `language` | `null` | BCP-47 code of the spoken language, for example `"en"`, `"de"`, `"pt"`. `null` lets the provider detect the language automatically. |
| `maxLineLength` | `37` | Maximum characters per subtitle line before the next word starts a new line. |
| `maxLines` | `1` | Maximum lines per subtitle cue before the next words start a new cue. |

The built-in provider honors both formatting limits; a custom provider is free to apply or ignore them.

## Implementing a Custom Transcription Provider

Use any speech-to-text service by implementing the `TranscriptionProvider` interface. It requires a `name` string and a `transcribe` method that turns an audio file into SRT subtitle text:

```kotlin highlight-android-auto-captions-custom-provider

/**
 * A minimal custom provider: post the audio to any speech-to-text service and return SRT text.
 */
class CustomTranscriptionProvider(
    private val httpClient: OkHttpClient = OkHttpClient(),
) : TranscriptionProvider {
    override val name = "My Speech-to-Text Service"

    override suspend fun transcribe(
        audio: File,
        mimeType: String,
        options: TranscriptionOptions,
    ): String {
        val url = "https://example.com/transcribe".toHttpUrl()
            .newBuilder()
            .apply { options.language?.let { addQueryParameter("language", it) } }
            .build()
        val request = Request.Builder()
            .url(url)
            // The file streams out in segments; reading it into memory first would defeat the point of
            // receiving one, since a scene's audio has no size limit.
            .post(audio.asRequestBody(mimeType.toMediaType()))
            .build()

        return suspendCancellableCoroutine { continuation ->
            val call = httpClient.newCall(request)
            // Tapping Cancel cancels the surrounding coroutine; aborting the call stops the request from
            // running on to its timeout.
            continuation.invokeOnCancellation { call.cancel() }
            call.enqueue(
                object : Callback {
                    override fun onFailure(
                        call: Call,
                        e: IOException,
                    ) = continuation.resumeWithException(e)

                    override fun onResponse(
                        call: Call,
                        response: Response,
                    ) {
                        response.use {
                            if (!it.isSuccessful) {
                                continuation.resumeWithException(IOException("Transcription failed: ${it.code}"))
                            } else {
                                // Convert your service's response to SRT here, and return an empty string
                                // when it reports no speech.
                                continuation.resume(it.body?.string().orEmpty())
                            }
                        }
                    }
                },
            )
        }
    }
}
```

The method receives the audio as a `File` staged in the editor's cache directory, with its MIME type — `audio/mp4` for the AAC track extracted from a video, and for a standalone audio block the source file's own type, commonly `audio/mpeg` or `audio/wav` — plus the `TranscriptionOptions` you configured. Stream the file rather than reading it into memory: a scene's audio has no size limit, and the file is what keeps a long recording off the heap. The editor deletes it once generation ends, so don't hold on to it past the call. Return an SRT-formatted string with timings relative to the start of the audio, or an empty string when no speech was detected. Any exception you throw surfaces as a generation failure in the editor and is passed to your `onError` callback, and `name` identifies the provider in the failure log. The surrounding coroutine is cancelled when the user taps **Cancel**, so keep implementations cooperatively cancellable — the sample aborts its in-flight call from `invokeOnCancellation`.

Pass your provider to the plugin in place of the built-in one:

```kotlin highlight-android-auto-captions-use-custom-provider
.then(::AutoCaptionsPlugin) {
    provider = CustomTranscriptionProvider()
}
```

## Full Custom Generation

The plugin's transcription step is a `CaptionsGenerator` you can replace. Do that to own the whole pipeline — not just the speech-to-text call — while keeping the editor's Generate action and its cancellable progress state:

```kotlin highlight-android-auto-captions-generation-callback
.then(::AutoCaptionsPlugin) {
    // The plugin still owns the Generate action and its cancellable progress state; only the
    // transcription is yours. It validates a provider at setup either way, so one is still
    // required even though a replaced generator never calls it.
    provider = CustomTranscriptionProvider()
    captionsGeneration = {
        // Replace this with your own pipeline: transcribe the scene's audible content —
        // editorContext.engine reads it — and serialize the cues as SRT or VTT, timed relative
        // to the page timeline. The fixed cue below stands in for that work.
        val srt = """
            1
            00:00:00,000 --> 00:00:03,000
            Captions from a custom pipeline
        """.trimIndent()
        // Returning null tells the user no speech was detected; any error thrown shows a
        // generic message and reaches the integrator's `onError`.
        if (srt.isBlank()) {
            null
        } else {
            withContext(Dispatchers.IO) {
                File.createTempFile("captions", ".srt", editorContext.activity.cacheDir)
                    .apply { writeText(srt) }
            }
        }
    }
}
```

The generator is a plain `suspend () -> File?` that you assign inside the plugin's configuration block, so it closes over the plugin's `editorContext` — `editorContext.engine` reads the scene's audio and video content, and `editorContext.activity.cacheDir` gives you somewhere to write. The skeleton above returns a fixed cue instead. It must return an SRT or VTT `File` with cue timings relative to the page timeline. The editor owns the UI around it: it shows the same **Generate Automatically** action and busy state, imports the returned file — replacing any existing captions — and deletes the file afterwards. Return `null` when there is nothing to transcribe; anything you throw reaches your `onError` callback behind the generic message. If your pipeline signals that deeper in its call stack, catch it there and return `null` — only what this callback returns reaches the editor. The editor cancels it when the user taps **Cancel**.

The plugin checks for a `provider` when the editor is configured, whichever generator is in place, so keep setting one even when a replacement never calls it.

## Error Handling

Generation failures reach the user as a toast from the editor rather than a dialog the sheet owns, because a run outlives the sheet and a failure can land while it is closed:

- **No speech**: when the page has nothing audible or the transcription comes back empty, the message reads "No speech was detected in the audio."
- **Any other error**: transport and service errors show "Something went wrong while generating captions. Please try again."
- **Cancellation**: cancelling says nothing — the sheet returns to its Add Captions state and the scene stays untouched.

When several blocks are transcribed, one block's failure doesn't sink the others; an error surfaces only when nothing was produced at all, so a partial run succeeds without telling the user which block dropped out.

The message the user sees stays generic, so the cause is handed to your `onError` callback — the same channel the rest of the captions sheet reports through, which puts it in your crash reporting rather than only on an attached device. The plugin also logs per-block failures under the `AutoCaptions` tag, naming the provider on transcription errors.

## Troubleshooting

- **Generate Automatically doesn't appear**: the editor looks for the plugin at runtime and leaves the action out when it isn't there. Add the `ly.img:plugin-auto-captions` dependency, chain `AutoCaptionsPlugin` onto your editor configuration with `then`, and make sure the dock carries `Dock.Button.rememberCaptions()` so the Add Captions sheet can be opened.
- **Generate Automatically is disabled**: the current page has no audio or video content to transcribe — blocks on other pages don't count. Add a video or audio block to the page you're editing.
- **No-speech message despite spoken content**: muted blocks, blocks with their volume at zero, and videos without audio tracks are skipped. Check the mute and volume state of the blocks that carry the speech.
- **Generation fails with the generic message**: verify the device can reach the gateway and that the API key is valid. Your `onError` callback receives the underlying failure, and the log under the `AutoCaptions` tag names the provider.
- **Generated captions appear unstyled**: default styling comes from the `ly.img.caption.presets` asset source. Register it as shown in [Edit Captions](../../edit-video/edit-captions.md).

## API Reference

| API | Category | Purpose |
| --- | --- | --- |
| `EditorConfiguration.remember(builder=_)` | Plugin registration | Creates the editor configuration the plugin is chained onto. |
| `then(builderFactory=::AutoCaptionsPlugin, builder=_)` | Plugin registration | Adds the Generate Automatically action to the Add Captions sheet, backed by the configured provider. |
| `GatewayTranscriptionProvider(apiKey=_, gatewayUrl=_, httpClient=_)` | Provider | Built-in provider running ElevenLabs Scribe v2 through the IMG.LY AI Gateway. |
| `TranscriptionOptions(language=_, maxLineLength=_, maxLines=_)` | Provider | Language and subtitle formatting options passed to the provider. |
| `TranscriptionProvider.transcribe(audio=_, mimeType=_, options=_)` | Provider contract | Turns a staged audio `File` into SRT subtitle text. |
| `AutoCaptionsPlugin.captionsGeneration` | Plugin registration | The `suspend () -> File?` the Generate action runs; replace it to source captions yourself. Return `null` when there is nothing to transcribe. |
| `Dock.Button.rememberCaptions()` | Dock | Dock button that opens the Add Captions sheet, already present in the video starter kit's dock. |

### Related types

- `TranscriptionProvider` — the interface a speech-to-text backend implements.
- `CaptionsGenerator` — the type behind the Generate action; a `typealias` for `suspend () -> File?`, in `ly.img.editor.plugin.autoCaptions`. Return `null` to tell the user no speech was detected.

## Next Steps

- [Edit Captions](../../edit-video/edit-captions.md) — Create, import, edit, and style captions in the editor
- [Add Captions](../../edit-video/add-captions.md) — Build captions programmatically with the Engine APIs
- [Update Caption Presets](../../create-video/update-caption-presets.md) — Extend the caption style presets with custom styles using content.json updates
- [Dock](../customization/dock.md) — Configure the dock area to show or hide tools, panels, or quick access actions



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support