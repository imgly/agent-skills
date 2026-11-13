package ly.img.camera.reactnative.module.model

import android.net.Uri
import android.os.Parcel
import android.os.Parcelable
import kotlin.time.Duration
import kotlin.time.Duration.Companion.milliseconds

/**
 * A camera recording.
 *
 * @property videos contains one or two [Video]s, for single camera output or dual camera output respectively
 * @property duration the duration of the recording
 */
data class Recording(
    val videos: List<Video>,
    val duration: Duration,
) : Parcelable {
    constructor(parcel: Parcel) : this(
        videos = parcel.createTypedArrayList(Video)!!,
        duration = parcel.readLong().milliseconds,
    )
    constructor(recording: ly.img.camera.core.Recording) : this(
        recording.videos.map { Video(it) },
        recording.duration,
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeTypedList(videos)
        parcel.writeLong(duration.inWholeMilliseconds)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<Recording> {
        override fun createFromParcel(parcel: Parcel): Recording = Recording(parcel)

        override fun newArray(size: Int): Array<Recording?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "videos" to videos.map { it.toMap() },
        "duration" to duration.inWholeMilliseconds.toDouble(),
    )
}

/**
 * A video in a [Recording].
 *
 * @param uri the uri of the video
 */
data class Video(
    val uri: Uri,
) : Parcelable {
    constructor(parcel: Parcel) : this(uri = parcel.readParcelable(Uri::class.java.classLoader)!!)
    constructor(video: ly.img.camera.core.Video) : this(
        video.uri,
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeParcelable(uri, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<Video> {
        override fun createFromParcel(parcel: Parcel): Video = Video(parcel)

        override fun newArray(size: Int): Array<Video?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "uri" to uri.toString(),
    )
}
