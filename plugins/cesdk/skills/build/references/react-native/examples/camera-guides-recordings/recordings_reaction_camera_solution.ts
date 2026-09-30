import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY' // Get your license from https://img.ly/forms/free-trial, pass null for evaluation mode with watermark
  };

  try {
    const result = await IMGLYCamera.openCamera(
      settings,
      require('MY_VIDEO_SOURCE')
    );
    if (result === null) {
      console.log('The editor has been cancelled.');
      return;
    }
    console.log(result.video.duration);
    result.video.videos.forEach((video) => {
      console.log(video.uri);
      console.log(video.rect);
    });

    result.recordings.forEach((recording) => {
      console.log(recording.duration);
      recording.videos.forEach((video) => {
        console.log(video.uri);
        console.log(video.rect);
      });
    });
  } catch (error) {
    console.log(`Error occurred in the camera session: ${error}.`);
  }
};
