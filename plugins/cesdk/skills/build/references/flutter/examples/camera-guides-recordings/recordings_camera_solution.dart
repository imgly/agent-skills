import 'package:flutter/material.dart';
import 'package:imgly_camera/imgly_camera.dart';

class RecordingsCameraSolution extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: () async {
        const settings = CameraSettings(
          license:
              "YOUR-LICENSE-KEY", // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
        );
        try {
          final result = await IMGLYCamera.openCamera(settings);
          if (result == null) {
            print('The editor has been cancelled.');
            return;
          }
          final captures = result.capture?.captures;
          if (captures != null) {
            for (final capture in captures) {
              final photo = capture.photo;
              final video = capture.video;
              if (photo != null) {
                for (final image in photo.images) {
                  print('Photo path: ${image.uri}');
                  print('Photo rect: ${image.rect.toJson()}');
                }
              } else if (video != null) {
                print('Recording duration: ${video.duration}');
                for (final clip in video.videos) {
                  print('Video path: ${clip.uri}');
                  print('Video rect: ${clip.rect}');
                }
              }
            }
          }
        } catch (error) {
          print('Error occurred in the camera session: $error');
        }
      },
      child: const Text('Open Camera'),
    );
  }
}
