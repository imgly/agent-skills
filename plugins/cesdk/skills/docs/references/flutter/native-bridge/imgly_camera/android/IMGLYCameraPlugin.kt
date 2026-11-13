package ly.img.camera.flutter.plugin

import android.app.Activity
import android.content.Intent
import android.net.Uri
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import io.flutter.plugin.common.MethodChannel.MethodCallHandler
import io.flutter.plugin.common.MethodChannel.Result
import io.flutter.plugin.common.PluginRegistry
import ly.img.camera.core.CameraConfiguration
import ly.img.camera.core.CameraMode
import ly.img.camera.core.CameraResult
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.EngineConfiguration
import ly.img.camera.flutter.plugin.model.CameraSettings
import ly.img.camera.flutter.plugin.model.getParcelableExtraCompat
import ly.img.camera.flutter.plugin.model.weak
import ly.img.camera.flutter.plugin.utils.toMap

/** A closure to specify a [CaptureMedia.Input] the camera session based on given *metadata*. */
typealias CameraInputClosure = InputClosurePayload.() -> CaptureMedia.Input?

/** A closure to add Metadata before sending the [CameraResult] to the Dart layer. */
typealias CameraResultClosure = ResultClosurePayload.() -> Map<String, Any?>?

data class InputClosurePayload(
    val cameraSettings: CameraSettings,
    val engineConfiguration: EngineConfiguration,
    val metadata: Map<String, Any>,
    val videoUri: Uri?,
)

data class ResultClosurePayload(
    val cameraResult: CameraResult,
    val inputMetadata: Map<String, Any>,
)

class IMGLYCameraPlugin :
    FlutterPlugin,
    MethodCallHandler,
    ActivityAware,
    PluginRegistry.ActivityResultListener {
    companion object {
        var configurationClosure: CameraInputClosure = {
            null
        }
        var resultClosure: CameraResultClosure = {
            null
        }
        const val NAME = "IMGLYCamera"
        const val REQUEST_CODE = 29057
    }

    private lateinit var channel: MethodChannel
    private var activity by weak<Activity>(null)
    private var pendingResult: Result? = null
    private var inputMetadata: Map<String, Any>? = null

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(binding.binaryMessenger, "imgly_camera")
        channel.setMethodCallHandler(this)
    }

    @Suppress("UNCHECKED_CAST")
    override fun onMethodCall(
        call: MethodCall,
        result: Result,
    ) {
        val activity = activity
            ?: return result.error("NO_ACTIVITY", "No activity found", null)

        if (call.method == "openCamera") {
            if (pendingResult != null) {
                return result.error("ALREADY_ACTIVE", "A camera request is already running", null)
            }

            val args = call.arguments as? Map<*, *>
                ?: return result.error("INVALID_ARGUMENTS", "Call arguments must be a map", null)

            val settings = CameraSettings.createFromMap(call.argument<Map<String, Any>>("settings"))
            if (settings?.license == null) {
                return result.error("INVALID_ARGUMENTS", "Missing required `license` arguments", null)
            }

            pendingResult = result

            val inputPayload = InputClosurePayload(
                cameraSettings = settings,
                engineConfiguration = EngineConfiguration(
                    license = settings.license,
                    userId = settings.userId,
                ),
                metadata = args["metadata"] as? Map<String, Any> ?: emptyMap(),
                videoUri = call.argument<String>("video")?.let { Uri.parse(it) },
            )

            val captureMediaInput =
                configurationClosure(inputPayload)
                    ?: CaptureMedia.Input(
                        inputPayload.engineConfiguration,
                        cameraConfiguration = settings.configuration?.toNative() ?: CameraConfiguration(),
                        cameraMode = if (inputPayload.videoUri == null) {
                            CameraMode.Standard()
                        } else {
                            CameraMode.Reaction(inputPayload.videoUri)
                        },
                    )

            activity.startActivityForResult(CaptureMedia().createIntent(activity, captureMediaInput), REQUEST_CODE)
        } else {
            result.notImplemented()
        }
    }

    override fun onActivityResult(
        requestCode: Int,
        resultCode: Int,
        intent: Intent?,
    ): Boolean {
        if (requestCode == REQUEST_CODE) {
            val result = pendingResult ?: return false
            val inputMetadata = inputMetadata ?: emptyMap()
            this.pendingResult = null
            this.inputMetadata = null

            val cameraResult = intent?.getParcelableExtraCompat<CameraResult>(CaptureMedia.INTENT_KEY_CAMERA_RESULT)
            if (resultCode == Activity.RESULT_OK && cameraResult != null) {
                result.success(
                    cameraResult.toMap().also {
                        it["metadata"] = resultClosure(ResultClosurePayload(cameraResult, inputMetadata))
                    },
                )
            } else {
                result.success(null)
            }
            return true
        }
        return false
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
        binding.addActivityResultListener(this)
    }

    override fun onDetachedFromActivityForConfigChanges() {
        activity = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        activity = binding.activity
        binding.addActivityResultListener(this)
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }
}
