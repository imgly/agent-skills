package ly.img.camera.flutter.plugin.model

import ly.img.camera.core.CaptureCount
import ly.img.camera.core.CaptureType
import kotlin.time.Duration.Companion.seconds
import ly.img.camera.core.CameraConfiguration as NativeCameraConfiguration

/**
 * A class containing all necessary information to configure the camera.
 *
 * @property license The license key. Pass `null` to run the SDK in evaluation mode with a watermark.
 * @property userId The id of the current user.
 * @property configuration Optional [CameraConfiguration] controlling how the camera captures media.
 */
data class CameraSettings(
    val license: String? = null,
    val userId: String?,
    val configuration: CameraConfiguration? = null,
) {
    companion object {
        fun createFromMap(map: Map<String, Any>?) = map?.let {
            CameraSettings(
                license = map["license"] as? String,
                userId = map["userId"] as? String,
                configuration = (map["configuration"] as? Map<*, *>)?.let { CameraConfiguration.createFromMap(it) },
            )
        }
    }
}

/**
 * Capture configuration forwarded from the Dart layer. String fields stay loose at the bridge
 * boundary and are mapped to the native enums when building [ly.img.camera.core.CameraConfiguration].
 *
 * @property captureType One of `"photo"`, `"video"`, `"mixed"` or `null` for the native default.
 * @property captureCount One of `"single"`, `"multi"` or `null` for the native default.
 * @property photoClipDuration Duration in seconds stamped on each photo capture.
 */
data class CameraConfiguration(
    val captureType: String? = null,
    val captureCount: String? = null,
    val photoClipDuration: Double? = null,
) {
    /**
     * Maps the wrapper configuration to a native [NativeCameraConfiguration]. Unset fields fall
     * back to native defaults.
     */
    fun toNative(): NativeCameraConfiguration {
        val defaults = NativeCameraConfiguration()
        return NativeCameraConfiguration(
            captureType = captureType?.let { type ->
                CaptureType.entries.firstOrNull { it.name.equals(type, ignoreCase = true) }
            } ?: defaults.captureType,
            captureCount = captureCount?.let { count ->
                CaptureCount.entries.firstOrNull { it.name.equals(count, ignoreCase = true) }
            } ?: defaults.captureCount,
            photoClipDuration = photoClipDuration?.seconds ?: defaults.photoClipDuration,
        )
    }

    companion object {
        fun createFromMap(map: Map<*, *>) = CameraConfiguration(
            captureType = map["captureType"] as? String,
            captureCount = map["captureCount"] as? String,
            photoClipDuration = (map["photoClipDuration"] as? Number)?.toDouble(),
        )
    }
}
