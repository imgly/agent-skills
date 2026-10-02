import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const camera = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY' // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
  };
  const result = await IMGLYCamera.openCamera(settings);
};
