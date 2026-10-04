package ly.img.starterkit.example

// highlight-starter-kit-composable
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.apparel.ApparelConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

// onClose should pop screen from the backstack of jetpack compose navigation
@Composable
fun EditorScreen(onClose: (Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        configuration = {
            EditorConfiguration.remember(::ApparelConfigurationBuilder)
        },
        onClose = onClose,
    )
}
// highlight-starter-kit-composable
