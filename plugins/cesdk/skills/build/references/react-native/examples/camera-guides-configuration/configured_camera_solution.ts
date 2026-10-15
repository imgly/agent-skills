import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY', // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
    userId: 'YOUR_USER_ID'
  };

  const result = await IMGLYCamera.openCamera(
    settings,
    require('MY_VIDEO_SOURCE')
  );
};
