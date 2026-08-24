package ly.img.starterkit.example

// highlight-starter-kit-base-uri
import androidx.compose.runtime.Composable
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.configuration.apparel.ApparelConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember

@Composable
fun EditorBaseUriScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        baseUri = "file:///android_asset".toUri(), // this points to android assets
        configuration = {
            EditorConfiguration.remember(::ApparelConfigurationBuilder)
        },
        onClose = onClose,
    )
}
// highlight-starter-kit-base-uri
