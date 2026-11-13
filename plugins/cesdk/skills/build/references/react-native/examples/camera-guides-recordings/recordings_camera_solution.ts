import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY' // Request a license at https://img.ly/forms/contact-sales/, pass null for evaluation mode with watermark
  };

  try {
    const result = await IMGLYCamera.openCamera(settings);
    if (result === null) {
      console.log('The editor has been cancelled.');
      return;
    }
    result.captures.forEach((capture) => {
      if (capture.photo) {
        capture.photo.images.forEach((image) => {
          console.log(image.uri);
          console.log(image.rect);
        });
      } else if (capture.video) {
        console.log(capture.video.duration);
        capture.video.videos.forEach((video) => {
          console.log(video.uri);
          console.log(video.rect);
        });
      }
    });
  } catch (error) {
    console.log(`Error occurred in the camera session: ${error}.`);
  }
};
