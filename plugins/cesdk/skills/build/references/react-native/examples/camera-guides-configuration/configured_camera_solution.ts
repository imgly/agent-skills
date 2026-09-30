import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY', // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
    userId: 'YOUR_USER_ID'
  };

  const result = await IMGLYCamera.openCamera(
    settings,
    require('MY_VIDEO_SOURCE')
  );
};
