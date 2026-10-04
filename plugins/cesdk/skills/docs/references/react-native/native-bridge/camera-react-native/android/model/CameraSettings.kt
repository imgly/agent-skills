package ly.img.camera.reactnative.module.model

import android.os.Parcel
import android.os.Parcelable
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
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        license = parcel.readString(),
        userId = parcel.readString(),
        configuration = parcel.readParcelable(CameraConfiguration::class.java.classLoader),
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeString(license)
        parcel.writeString(userId)
        parcel.writeParcelable(configuration, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraSettings> {
        override fun createFromParcel(parcel: Parcel): CameraSettings = CameraSettings(parcel)

        override fun newArray(size: Int): Array<CameraSettings?> = arrayOfNulls(size)

        fun createFromMap(map: Map<String, Any?>): CameraSettings {
            val license = map["license"] as? String
            val userId = map["userId"] as? String
            val configuration = (map["configuration"] as? Map<*, *>)?.let {
                CameraConfiguration.createFromMap(it)
            }
            return CameraSettings(license, userId, configuration)
        }
    }
}

/**
 * Capture configuration forwarded from the TS layer. String fields stay loose at the bridge
 * boundary and are mapped to the native enums when building [NativeCameraConfiguration].
 *
 * @property captureType One of `"photo"`, `"video"`, `"mixed"` or `null` for the native default.
 * @property captureCount One of `"single"`, `"multi"` or `null` for the native default.
 * @property photoClipDuration Duration in seconds stamped on each photo capture.
 */
data class CameraConfiguration(
    val captureType: String? = null,
    val captureCount: String? = null,
    val photoClipDuration: Double? = null,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        captureType = parcel.readString(),
        captureCount = parcel.readString(),
        photoClipDuration = parcel.readValue(Double::class.java.classLoader) as? Double,
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeString(captureType)
        parcel.writeString(captureCount)
        parcel.writeValue(photoClipDuration)
    }

    override fun describeContents(): Int = 0

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

    companion object CREATOR : Parcelable.Creator<CameraConfiguration> {
        override fun createFromParcel(parcel: Parcel): CameraConfiguration = CameraConfiguration(parcel)

        override fun newArray(size: Int): Array<CameraConfiguration?> = arrayOfNulls(size)

        fun createFromMap(map: Map<*, *>) = CameraConfiguration(
            captureType = map["captureType"] as? String,
            captureCount = map["captureCount"] as? String,
            photoClipDuration = (map["photoClipDuration"] as? Number)?.toDouble(),
        )
    }
}
