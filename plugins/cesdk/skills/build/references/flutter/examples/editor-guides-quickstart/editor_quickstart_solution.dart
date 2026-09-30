import "package:imgly_editor/imgly_editor.dart";

class EditorQuickstartSolution {
  /// Opens the editor.
  void openEditor() async {
    final settings = EditorSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        userId:
            "YOUR_USER_ID"); // A unique string to identify your user/session

    final _ = await IMGLYEditor.openEditor(settings: settings);
  }
}
