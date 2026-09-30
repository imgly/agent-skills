package ly.img.starterkit.example

// highlight-starter-kit-force-crop
import ly.img.editor.configuration.photo.PhotoConfigurationBuilder
import ly.img.editor.core.component.data.ForceCropConfiguration
import ly.img.editor.core.component.data.ForceCropMode
import ly.img.editor.core.component.data.ForceCropPresetCandidate
import ly.img.editor.core.event.EditorEvent

suspend fun PhotoConfigurationBuilder.onLoaded() {
    // Apply force crop, allow 1:1, 16:9 or 9:16
    val configuration = ForceCropConfiguration(
        sourceId = "ly.img.crop.presets",
        presetId = "aspect-ratio-1-1",
        presetCandidates = listOf(
            ForceCropPresetCandidate(
                sourceId = "ly.img.crop.presets",
                presetId = "aspect-ratio-16-9",
            ),
            ForceCropPresetCandidate(
                sourceId = "ly.img.crop.presets",
                presetId = "aspect-ratio-9-16",
            ),
        ),
        mode = ForceCropMode.IfNeeded(threshold = 0.01f),
    )
    editorContext.eventHandler.send(
        event = EditorEvent.ApplyForceCrop(
            designBlock = requireNotNull(editorContext.engine.scene.getCurrentPage()),
            configuration = configuration,
        ),
    )
    // Existing body here
}
// highlight-starter-kit-force-crop
