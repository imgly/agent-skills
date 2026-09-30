package ly.img.editor.flutter.plugin.helper

import android.net.Uri
import io.flutter.embedding.engine.plugins.FlutterPlugin

/** Helper to use resolve assets. */
class AssetHelper {
    companion object {
        /**
         * Retrieves the Uri string of a given asset.
         * @param source The source of the asset.
         * @param binding The plugin binding.
         * @return The resolved [Uri] as a [String].
         */
        fun retrieveAsset(
            source: String,
            binding: FlutterPlugin.FlutterPluginBinding,
        ): String? {
            fun uriOrNull(uri: Uri?): String? {
                return try {
                    if (uri?.scheme != null && uri.path != null) {
                        return uri.toString()
                    }
                    return null
                } catch (e: Exception) {
                    null
                }
            }

            return if (source.contains("://")) {
                uriOrNull(Uri.parse(source))
            } else {
                val path = binding.flutterAssets.getAssetFilePathByName(source)
                uriOrNull(Uri.parse("file:///android_asset/$path"))
            }
        }
    }
}
