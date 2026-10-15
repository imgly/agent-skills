import "package:imgly_camera/imgly_camera.dart";

class CameraConfigurationSolution {
  /// Opens the camera.
  void openCamera() async {
    final settings = CameraSettings(
        license:
            "YOUR_LICENSE", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        userId:
            "YOUR_USER_ID"); // A unique string to identify your user/session

    final _ = await IMGLYCamera.openCamera(
      settings,
      // Optional, if you want to react to a video
      video: 'https://img.ly/static/ubq_video_samples/test30.mp4',
    );
  }
}
