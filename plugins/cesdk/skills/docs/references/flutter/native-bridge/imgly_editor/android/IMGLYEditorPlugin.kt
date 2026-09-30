package ly.img.editor.flutter.plugin

import android.app.Activity
import android.content.Intent
import android.os.Build
import android.os.Parcelable
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import io.flutter.plugin.common.MethodChannel.Result
import io.flutter.plugin.common.PluginRegistry
import ly.img.editor.flutter.plugin.activity.EditorActivity
import ly.img.editor.flutter.plugin.builder.Builder
import ly.img.editor.flutter.plugin.helper.AssetHelper
import ly.img.editor.flutter.plugin.helper.IntentHelper
import ly.img.editor.flutter.plugin.model.EditorPreset
import ly.img.editor.flutter.plugin.model.EditorResult
import ly.img.editor.flutter.plugin.model.EditorSettings

/** A closure to specify an [Builder] based on a given *preset* and *metadata*. */
typealias IMGLYBuilderClosure = (preset: EditorPreset?, metadata: Map<String, Any>?) -> Builder

/** The Android implementation for the *imgly_editor* Flutter plugin. */
class IMGLYEditorPlugin :
    FlutterPlugin,
    MethodCallHandler,
    ActivityAware,
    PluginRegistry.ActivityResultListener {
    companion object {
        /** A closure to specify a [Builder] based on a given *preset* and *metadata*. */
        var builderClosure: IMGLYBuilderClosure? = null
    }

    private lateinit var channel: MethodChannel
    private var binding: ActivityPluginBinding? = null
    private var completion: ((kotlin.Result<EditorResult?>) -> Unit)? = null
    private var pluginBinding: FlutterPlugin.FlutterPluginBinding? = null

    /** IMGLY constants for the plugin use. */
    private object IMGLYConstants {
        const val K_ERROR_EXPORT_FAILED = "E_EXPORT_FAILED"
        const val K_ERROR_MISSING_REGISTRY = "E_MISSING_REGISTRY"
        const val K_ERROR_MISSING_ARGUMENTS = "E_MISSING_ARGUMENTS"
        const val K_ERROR_PARSING = "E_PARSING"
        const val K_ERROR_EXPORT_FAILED_MESSAGE = "Failed to export the artifact due to: "
        const val K_ERROR_PARSING_MESSAGE = "Unable to parse the argument(s): "
        const val K_ERROR_MISSING_ARGUMENTS_MESSAGE = "Unable to find required argument(s): "
    }

    override fun onAttachedToEngine(flutterPluginBinding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(flutterPluginBinding.binaryMessenger, "imgly_editor")
        channel.setMethodCallHandler(this)
        pluginBinding = flutterPluginBinding
    }

    override fun onMethodCall(
        call: MethodCall,
        result: Result,
    ) {
        if (call.method == "openEditor") {
            val rawSettings = call.argument<Map<String, Any>>("settings")
            if (rawSettings != null) {
                val settings = EditorSettings.createFromMap(rawSettings)
                val source = settings?.source
                val rawPreset = call.argument<String>("preset")
                val preset = rawPreset?.let { EditorPreset.fromValue(it) }
                val metadata = call.argument<Map<String, Any>>("metadata")

                if (source != null) {
                    val binding = pluginBinding
                    if (binding == null) {
                        result.error(IMGLYConstants.K_ERROR_MISSING_REGISTRY, "The plugin registry could not be found.", null)
                        return
                    }
                    val resolvedUri = AssetHelper.retrieveAsset(source.source, binding)
                    if (resolvedUri == null) {
                        result.error(IMGLYConstants.K_ERROR_PARSING, IMGLYConstants.K_ERROR_PARSING_MESSAGE, source)
                        return
                    }
                    settings.source?.source = resolvedUri
                }

                if (settings != null) {
                    this.openEditor(preset, settings, metadata) {
                        it.fold(
                            onSuccess = { value ->
                                if (value == null) {
                                    result.success(null)
                                } else {
                                    val map = mutableMapOf<String, Any?>()
                                    map["scene"] = value.scene
                                    map["artifact"] = value.artifact
                                    map["thumbnail"] = value.thumbnail
                                    map["metadata"] = value.metadata
                                    result.success(map)
                                }
                            },
                            onFailure = {
                                result.error(
                                    IMGLYConstants.K_ERROR_EXPORT_FAILED,
                                    IMGLYConstants.K_ERROR_EXPORT_FAILED_MESSAGE,
                                    it.localizedMessage,
                                )
                            },
                        )
                    }
                } else {
                    result.error(IMGLYConstants.K_ERROR_PARSING, IMGLYConstants.K_ERROR_PARSING_MESSAGE, "configuration")
                }
            } else {
                result.error(
                    IMGLYConstants.K_ERROR_MISSING_ARGUMENTS,
                    IMGLYConstants.K_ERROR_MISSING_ARGUMENTS_MESSAGE,
                    "configuration",
                )
            }
        } else {
            result.notImplemented()
        }
    }

    /**
     * Opens the creative editor.
     * @param preset The [EditorPreset] used to determine which UI preset to use.
     * @param config The [EditorSettings] containing all relevant information for the editor.
     * @param metadata Any custom metadata used for the [Builder].
     * @param completion The completion handler to execute once the editor failed, cancelled or exported.
     */
    private fun openEditor(
        preset: EditorPreset?,
        config: EditorSettings,
        metadata: Map<String, Any>?,
        completion: (kotlin.Result<EditorResult?>) -> Unit,
    ) {
        val activity = binding?.activity ?: return
        this.completion = completion

        val intent = Intent(activity, EditorActivity::class.java).apply {
            putExtra(EditorActivity.INTENT_EXTRA_CONFIG, config)
            putExtra(EditorActivity.INTENT_EXTRA_PRESET, preset as Parcelable)
            putExtra(EditorActivity.INTENT_EXTRA_METADATA, IntentHelper.mapToBundle(metadata))
        }
        activity.startActivityForResult(intent, EditorActivity.INTENT_REQUEST_CODE)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
        pluginBinding = null
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        this.binding = binding
        binding.addActivityResultListener(this)
    }

    override fun onDetachedFromActivityForConfigChanges() {
        this.binding?.removeActivityResultListener(this)
        this.binding = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        this.binding = binding
        binding.addActivityResultListener(this)
    }

    override fun onDetachedFromActivity() {
        this.binding?.removeActivityResultListener(this)
        this.binding = null
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        data: Intent?,
    ): Boolean {
        if (requestCode == EditorActivity.INTENT_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                val result = data?.getParcelableExtra<EditorResult>(EditorActivity.INTENT_EXTRA_RESULT)
                result?.let {
                    this.completion?.invoke(kotlin.Result.success(it))
                    this.completion = null
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                this.completion?.invoke(kotlin.Result.success(null))
            } else if (resultCode == EditorActivity.INTENT_RESULT_ERROR_CODE) {
                val error = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                    data?.getSerializableExtra(EditorActivity.INTENT_EXTRA_RESULT, Throwable::class.java)
                } else {
                    data?.getSerializableExtra(EditorActivity.INTENT_EXTRA_RESULT) as Throwable
                }
                this.completion?.invoke(
                    kotlin.Result.failure(Exception("Failed to initialize the editor with error: ${error?.localizedMessage}")),
                )
            }
            return true
        }
        return false
    }
}
