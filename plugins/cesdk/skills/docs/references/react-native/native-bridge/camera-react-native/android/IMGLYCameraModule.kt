package ly.img.camera.reactnative.module

import android.app.Activity
import android.content.Intent
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import ly.img.camera.CameraActivity
import ly.img.camera.core.CaptureMedia
import ly.img.camera.core.CaptureMedia.Companion.INTENT_KEY_CAMERA_INPUT
import ly.img.camera.core.EngineConfiguration
import ly.img.camera.reactnative.module.model.CameraResult
import ly.img.camera.reactnative.module.model.CameraSettings

/** A closure to specify a [CaptureMedia.Input] the camera session based on given *metadata*. */
typealias CameraInputClosure = (metadata: Map<String, Any?>?) -> CaptureMedia.Input

/** A closure to modify the [CameraResult] before being send to the JS layer. */
typealias CameraResultClosure = (result: CameraResult?) -> CameraResult?

/** The React Native module for the IMG.LY Camera SDK. */
class IMGLYCameraModule(
    reactContext: ReactApplicationContext,
) : IMGLYCameraModuleSpec(reactContext),
    ActivityEventListener {
    companion object {
        /** A closure to specify a [CaptureMedia.Input] based on given *metadata*. */
        var configurationClosure: CameraInputClosure? = null

        /** A closure to modify the [CameraResult] before being send to the JS layer. */
        var resultClosure: CameraResultClosure? = null

        /** The name of the module. */
        const val NAME = "IMGLYCamera"
    }

    init {
        reactContext.addActivityEventListener(this)
    }

    /** The completion handler used by the activity result listener. */
    private var completion: ((Result<CameraResult?>) -> Unit)? = null

    /** The request code for the camera activity. */
    private val requestCode = 29057

    /** IMGLY constants for the plugin use. */
    private object IMGLYConstants {
        const val ERROR_EXPORT_FAILED = "E_EXPORT_FAILED"
        const val ERROR_MISSING_ARGUMENTS = "E_MISSING_ARGUMENTS"
        const val ERROR_PARSING = "E_PARSING"
        const val ERROR_EXPORT_FAILED_MESSAGE = "Failed to export the artifact due to: "
        const val ERROR_PARSING_MESSAGE = "Unable to parse the argument(s): "
        const val ERROR_MISSING_ARGUMENTS_MESSAGE = "Unable to find required argument(s): "
    }

    /**
     * Opens the camera.
     * @param settings The camera settings as [ReadableMap] used to configure the camera.
     * @param video The video to react to. (iOS only)
     * @param metadata The metadata associated with the function call.
     * @param promise The promise to communicate with the JS side.
     */
    @ReactMethod
    override fun openCamera(
        settings: ReadableMap?,
        video: String?,
        metadata: ReadableMap?,
        promise: Promise?,
    ) {
        if (settings == null) {
            promise?.reject(IMGLYConstants.ERROR_MISSING_ARGUMENTS, IMGLYConstants.ERROR_MISSING_ARGUMENTS_MESSAGE)
        } else {
            val settingsHashMap = settings.toHashMap()
            val cameraSettings = kotlin.runCatching {
                CameraSettings.createFromMap(settingsHashMap)
            }.getOrElse {
                promise?.reject(
                    IMGLYConstants.ERROR_PARSING,
                    IMGLYConstants.ERROR_PARSING_MESSAGE,
                    it,
                )
                return
            }
            val metadataHashMap = metadata?.toHashMap()

            openCamera(cameraSettings, video, metadataHashMap) {
                it.fold(
                    onSuccess = { value ->
                        if (value == null) {
                            promise?.resolve(null)
                        } else {
                            promise?.resolve(
                                convertToWritableMap(value.toMap()),
                            )
                        }
                    },
                    onFailure = {
                        promise?.reject(
                            IMGLYConstants.ERROR_EXPORT_FAILED,
                            IMGLYConstants.ERROR_EXPORT_FAILED_MESSAGE + it.localizedMessage,
                        )
                    },
                )
            }
        }
    }

    /**
     * Opens the camera.
     * @param settings The [CameraSettings] used to configure the camera.
     * @param video The video to react to. (iOS only)
     * @param metadata The metadata associated with the function call.
     * @param completion The completion handler to handle the camera result.
     */
    private fun openCamera(
        settings: CameraSettings,
        video: String?,
        metadata: Map<String, Any?>?,
        completion: ((Result<CameraResult?>) -> Unit),
    ) {
        val activity = this.reactApplicationContext.currentActivity ?: return
        this.completion = completion

        val engineConfiguration =
            EngineConfiguration(license = settings.license ?: "", userId = settings.userId, host = "react-native")
        val cameraConfiguration =
            settings.configuration?.toNative() ?: ly.img.camera.core.CameraConfiguration()
        val input: CaptureMedia.Input =
            configurationClosure?.invoke(metadata) ?: CaptureMedia.Input(engineConfiguration, cameraConfiguration)
        val intent = Intent(activity, CameraActivity::class.java).apply {
            putExtra(INTENT_KEY_CAMERA_INPUT, input)
        }
        activity.startActivityForResult(intent, requestCode)
    }

    /** The name of the module. */
    override fun getName() = NAME

    /** Handles the activity result. */
    override fun onActivityResult(
        activity: Activity,
        requestCode: Int,
        resultCode: Int,
        intent: Intent?,
    ) {
        if (requestCode == this.requestCode) {
            if (resultCode == Activity.RESULT_OK) {
                val result = intent?.getParcelableExtra<ly.img.camera.core.CameraResult>(CaptureMedia.INTENT_KEY_CAMERA_RESULT)
                when (result) {
                    is ly.img.camera.core.CameraResult.Captures -> {
                        var modifiedResult: CameraResult? = CameraResult(result)
                        val closure = resultClosure
                        if (closure != null) {
                            modifiedResult = closure.invoke(modifiedResult)
                        }
                        this.completion?.invoke(Result.success(modifiedResult))
                        this.completion = null
                    } else -> {
                        this.completion?.invoke(Result.success(null))
                        this.completion = null
                    }
                }
            } else if (resultCode == Activity.RESULT_CANCELED) {
                this.completion?.invoke(Result.success(null))
            }
        }
    }

    override fun onNewIntent(intent: Intent) {}

    operator fun WritableMap.set(
        id: String,
        value: Boolean,
    ) = this.putBoolean(id, value)

    operator fun WritableMap.set(
        id: String,
        value: String?,
    ) = this.putString(id, value)

    operator fun WritableMap.set(
        id: String,
        value: Double,
    ) = this.putDouble(id, value)

    operator fun WritableMap.set(
        id: String,
        value: Float,
    ) = this.putDouble(id, value.toDouble())

    operator fun WritableMap.set(
        id: String,
        value: WritableArray?,
    ) = this.putArray(id, value)

    operator fun WritableMap.set(
        id: String,
        value: Int,
    ) = this.putInt(id, value)

    operator fun WritableMap.set(
        id: String,
        value: WritableMap?,
    ) = this.putMap(id, value)

    private fun reactArray(list: List<Any?>): WritableArray {
        val array = Arguments.createArray()
        for (item in list) {
            when (item) {
                null -> array.pushNull()
                is String -> array.pushString(item)
                is Boolean -> array.pushBoolean(item)
                is Double -> array.pushDouble(item)
                is Float -> array.pushDouble(item.toDouble())
                is Int -> array.pushInt(item)
                is Map<*, *> -> array.pushMap(convertToWritableMap(item))
                is List<*> -> array.pushArray(reactArray(item)) // Handle nested lists
                else -> throw RuntimeException("Type not supported by WritableArray")
            }
        }
        return array
    }

    private fun convertToWritableMap(map: Map<*, *>): WritableMap {
        val writableMap = Arguments.createMap()
        for ((key, value) in map) {
            if (key is String) {
                when (value) {
                    null -> writableMap.putNull(key)
                    is String -> writableMap.putString(key, value)
                    is Boolean -> writableMap.putBoolean(key, value)
                    is Double -> writableMap.putDouble(key, value)
                    is Int -> writableMap.putInt(key, value)
                    is Float -> writableMap.putDouble(key, value.toDouble())
                    is Map<*, *> -> writableMap.putMap(key, convertToWritableMap(value))
                    is WritableArray -> writableMap.putArray(key, value)
                    is List<*> -> writableMap.putArray(key, reactArray(value)) // Corrected to call reactArray
                    else -> throw RuntimeException("Type not supported in WritableMap")
                }
            }
        }
        return writableMap
    }
}
