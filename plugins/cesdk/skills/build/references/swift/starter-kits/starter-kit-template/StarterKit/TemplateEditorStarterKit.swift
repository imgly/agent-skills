import IMGLYEditor
import IMGLYEngine
import SwiftUI

// MARK: - Starter Kit View

struct TemplateEditorStarterKit: View {
  // Provide `EngineSettings` with your license and an optional userId.
  let settings = EngineSettings(
    license: secrets.licenseKey, // Use nil for evaluation mode with watermark
    userID: "<your unique user id>",
  )

  var body: some View {
    Editor(settings)
      .imgly.configuration {
        TemplateEditorConfiguration()
      }
  }
}

// MARK: - Preview

#Preview {
  TemplateEditorStarterKit()
}
