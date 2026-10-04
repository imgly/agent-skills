import 'package:imgly_camera/imgly_camera.dart';

class CameraQuickstartSolution {
  /// Opens the camera.
  void openCamera() async {
    const settings = CameraSettings(
      license:
          "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
      userId: "YOUR_USER_ID", // A unique string to identify your user/session
    );

    final result = await IMGLYCamera.openCamera(settings);
    print(result?.toJson());
  }
}
