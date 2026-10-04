import "package:imgly_editor/imgly_editor.dart";

class EditorConfigurationBasicsSolution {
  /// Opens the editor.
  void openEditor() async {
    final settings = EditorSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        baseUri: "YOUR_BASE_URI",
        userId: "YOUR_USER_ID" // A unique string to identify your user/session
        );

    final _ = await IMGLYEditor.openEditor(
        preset: EditorPreset.design,
        settings: settings,
        metadata: {"MY_KEY": "MY_VALUE"}
        );
  }
}
