package ly.img.starterkit.example

// highlight-starter-kit-constraints
import ly.img.editor.configuration.video.VideoConfigurationBuilder
import ly.img.editor.core.event.EditorEvent
import kotlin.time.Duration.Companion.seconds

fun VideoConfigurationBuilder.onLoaded() {
    // Enforce all videos to be between 10 and 20 seconds
    val event = EditorEvent.ApplyVideoDurationConstraints(
        minDuration = 10.seconds,
        maxDuration = 20.seconds,
    )
    editorContext.eventHandler.send(event)
    // Existing body here
}
// highlight-starter-kit-constraints
