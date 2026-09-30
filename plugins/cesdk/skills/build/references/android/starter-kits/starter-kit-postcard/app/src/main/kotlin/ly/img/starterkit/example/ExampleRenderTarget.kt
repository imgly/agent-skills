package ly.img.starterkit.example

// highlight-starter-kit-engine-render-target
import androidx.compose.runtime.Composable
import ly.img.editor.Editor
import ly.img.editor.configuration.postcard.PostcardConfigurationBuilder
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.editor.core.engine.EngineRenderTarget

@Composable
fun EditorRenderTargetScreen(onClose: (error: Throwable?) -> Unit) {
    Editor(
        license = null, // pass null or empty for evaluation mode with watermark
        engineRenderTarget = EngineRenderTarget.SURFACE_VIEW, // EngineRenderTarget.SURFACE_VIEW, EngineRenderTarget.TEXTURE_VIEW
        configuration = {
            EditorConfiguration.remember(::PostcardConfigurationBuilder)
        },
        onClose = onClose,
    )
}
// highlight-starter-kit-engine-render-target
