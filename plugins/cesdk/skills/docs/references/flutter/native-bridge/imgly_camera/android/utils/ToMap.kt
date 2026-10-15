package ly.img.camera.flutter.plugin.utils

import android.graphics.RectF
import ly.img.camera.core.CameraResult
import ly.img.camera.core.Capture
import ly.img.camera.core.Recording
import ly.img.camera.core.Video
import kotlin.time.DurationUnit

fun Recording.toMap() = mutableMapOf<String, Any?>(
    "videos" to videos.map { it.toMap() },
    "duration" to duration.toDouble(DurationUnit.MILLISECONDS),
)

fun Video.toMap() = mutableMapOf<String, Any?>(
    "uri" to uri.toString(),
    "rect" to rect.toMap(),
)

fun RectF.toMap() = mutableMapOf<String, Any?>(
    "x" to left,
    "y" to top,
    "width" to width(),
    "height" to height(),
)

fun Capture.Photo.toMap(): MutableMap<String, Any?> {
    // Android has no dual-camera mode, so every photo is a single image taking up the full
    // 1080×1920 preview frame. The bridge contract requires a `PhotoImage` list with rect so
    // wrapper consumers can compose dual-camera layouts on platforms that support them (iOS).
    val image = mutableMapOf<String, Any?>(
        "uri" to uri.toString(),
        "rect" to mutableMapOf<String, Any?>(
            "x" to 0f,
            "y" to 0f,
            "width" to PHOTO_FRAME_WIDTH,
            "height" to PHOTO_FRAME_HEIGHT,
        ),
    )
    return mutableMapOf(
        "images" to listOf(image),
        "duration" to clipDuration.toDouble(DurationUnit.MILLISECONDS),
    )
}

private const val PHOTO_FRAME_WIDTH = 1080f
private const val PHOTO_FRAME_HEIGHT = 1920f

fun Capture.toMap() = when (this) {
    is Capture.Photo -> mutableMapOf<String, Any?>("photo" to this.toMap())
    is Capture.Video -> mutableMapOf<String, Any?>("video" to recording.toMap())
}

fun CameraResult.Reaction.toMap() = mutableMapOf<String, Any?>(
    "recordings" to this.reaction.map { it.toMap() },
    "video" to this.video.toMap(),
)

fun CameraResult.Captures.toMap() = mutableMapOf<String, Any?>(
    "captures" to captures.map { it.toMap() },
)

fun CameraResult.toMap() = when (this) {
    is CameraResult.Reaction -> mutableMapOf<String, Any?>("reaction" to this.toMap())
    is CameraResult.Captures -> mutableMapOf<String, Any?>("capture" to this.toMap())
    // `Record` is `@Deprecated(level = ERROR)` and never emitted, but the sealed interface still
    // lists it, so an exhaustive `when` requires this arm to compile.
    else -> mutableMapOf<String, Any?>()
}
