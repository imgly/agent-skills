package ly.img.camera.reactnative.module.model

import android.net.Uri
import android.os.Parcel
import android.os.Parcelable
import ly.img.camera.reactnative.module.model.CameraResult.CREATOR.readMap
import ly.img.camera.reactnative.module.model.CameraResult.CREATOR.writeMap
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds
import kotlin.time.DurationUnit
import ly.img.camera.core.CameraResult as CoreCameraResult
import ly.img.camera.core.Capture as CoreCapture

/**
 * A captured still photo.
 *
 * @property uri The location of the photo file in temporary storage.
 * @property duration The duration stamped on the photo.
 */
data class Photo(
    val uri: Uri,
    val duration: Duration,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        uri = parcel.readParcelable(Uri::class.java.classLoader)!!,
        duration = parcel.readLong().milliseconds,
    )
    constructor(photo: CoreCapture.Photo) : this(
        uri = photo.uri,
        duration = photo.clipDuration,
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeParcelable(uri, flags)
        parcel.writeLong(duration.inWholeMilliseconds)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<Photo> {
        private const val PHOTO_FRAME_WIDTH = 1080f
        private const val PHOTO_FRAME_HEIGHT = 1920f

        override fun createFromParcel(parcel: Parcel): Photo = Photo(parcel)

        override fun newArray(size: Int): Array<Photo?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> {
        // Android has no dual-camera mode — emit a single-element `images` list with the rect
        // covering the full 1080×1920 preview frame so the wire format matches iOS's
        // `Photo { images: [PhotoImage], duration }` contract.
        val image = mapOf<String, Any?>(
            "uri" to uri.toString(),
            "rect" to mapOf<String, Any?>(
                "x" to 0f,
                "y" to 0f,
                "width" to PHOTO_FRAME_WIDTH,
                "height" to PHOTO_FRAME_HEIGHT,
            ),
        )
        return mapOf(
            "images" to listOf(image),
            "duration" to duration.toDouble(DurationUnit.MILLISECONDS),
        )
    }
}

/**
 * A single capture from the camera. Either a still [photo] or a video [video] recording.
 */
data class Capture(
    val photo: Photo?,
    val video: Recording?,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        photo = parcel.readParcelable(Photo::class.java.classLoader),
        video = parcel.readParcelable(Recording::class.java.classLoader),
    )
    constructor(capture: CoreCapture) : this(
        photo = (capture as? CoreCapture.Photo)?.let { Photo(it) },
        video = (capture as? CoreCapture.Video)?.recording?.let { Recording(it) },
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeParcelable(photo, flags)
        parcel.writeParcelable(video, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<Capture> {
        override fun createFromParcel(parcel: Parcel): Capture = Capture(parcel)

        override fun newArray(size: Int): Array<Capture?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> = buildMap<String, Any?> {
        photo?.let { put("photo", it.toMap()) }
        video?.let { put("video", it.toMap()) }
    }
}

/**
 * The result type for a photo, video, or mixed camera capture session.
 *
 * @property captures The captures of the camera session.
 */
data class CameraCapture(
    val captures: List<Capture>?,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        captures = parcel.createTypedArrayList(Capture),
    )
    constructor(captures: CoreCameraResult.Captures) : this(
        captures = captures.captures.map { Capture(it) },
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeTypedList(captures)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraCapture> {
        override fun createFromParcel(parcel: Parcel): CameraCapture = CameraCapture(parcel)

        override fun newArray(size: Int): Array<CameraCapture?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "captures" to captures?.map { it.toMap() },
    )
}

/**
 * A class representing the result of a camera session.
 *
 * @property capture The result for a photo, video, or mixed capture session.
 * @property metadata The associated metadata.
 */
data class CameraResult(
    val capture: CameraCapture?,
    val metadata: Map<String, Any> = emptyMap(),
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        capture = parcel.readParcelable(CameraCapture::class.java.classLoader),
        metadata = readMap(parcel),
    )
    constructor(captures: CoreCameraResult.Captures) : this(
        capture = CameraCapture(captures),
        metadata = emptyMap(),
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeParcelable(capture, flags)
        writeMap(parcel, metadata, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraResult> {
        override fun createFromParcel(parcel: Parcel): CameraResult = CameraResult(parcel)

        override fun newArray(size: Int): Array<CameraResult?> = arrayOfNulls(size)

        private fun writeMap(
            parcel: Parcel,
            map: Map<String, Any>,
            flags: Int,
        ) {
            parcel.writeInt(map.size)
            for ((key, value) in map) {
                parcel.writeString(key)
                parcel.writeValue(value)
            }
        }

        private fun readMap(parcel: Parcel): Map<String, Any> {
            val size = parcel.readInt()
            val map = mutableMapOf<String, Any>()
            repeat(size) {
                val key = parcel.readString()
                val value = parcel.readValue(this::class.java.classLoader)
                key ?: throw (IllegalStateException("Key must not be null."))
                value ?: throw (IllegalStateException("Value must not be null."))

                map[key] = value
            }
            return map
        }
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "capture" to capture?.toMap(),
        "metadata" to metadata,
    )
}
