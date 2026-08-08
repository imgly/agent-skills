package ly.img.starterkit.example

// highlight-starter-kit-ui-mode
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.EditorUiMode
import ly.img.editor.configuration.photo.PhotoConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorUiModeScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        uiMode = EditorUiMode.SYSTEM, // EditorUiMode.SYSTEM, EditorUiMode.LIGHT, EditorUiMode.DARK
        configuration = {
            EditorConfiguration.remember(::PhotoConfigurationBuilder)
        },
        onClose = onClose,
    )
}
// highlight-starter-kit-ui-mode
