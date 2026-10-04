> This is one page of the CE.SDK React Native documentation. For a complete overview, see the [React Native Documentation Index](https://img.ly/docs/cesdk/react-native/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/react-native/llms-full.txt).

**Navigation:** [Guides](https://img.ly/docs/cesdk/react-native/guides-8d8b00/) > [Import Media Assets](https://img.ly/docs/cesdk/react-native/import-media-4e3703/) > [Capture From Camera](https://img.ly/docs/cesdk/react-native/import-media/capture-from-camera-92f388/) > [Access Recordings](./recordings.md)

---

Learn how to get the captured photos and recorded videos from the `CameraCaptureResult` and `CameraReactionResult` types of the `openCamera` function.

## Success

A `Capture` is either a `Photo` or a `Video` recording. `Photo.images` carries one image in standard mode or two stacked images in dual-camera mode. A `Recording` has a `duration` and contains an array of `Video`s — one `Video` for single-camera recordings or two for dual-camera recordings.

Each `Video` has:

- A `uri` to the video file that is stored in a temporary location. Make sure to copy the file to a permanent location if you want to access it later.
- A `rect` that contains the position of each video as it was shown in the camera preview. For dual camera recordings, you can use these `Rect`s to arrange the videos as they were laid out in the camera.

Each `PhotoImage` has the same `uri` + `rect` shape.

### Standard and Dual Camera

If the user has captured anything, the `openCamera` will return a `CameraCaptureResult` containing an array of `Capture` values. Iterate the array and pattern-match on `photo` vs `video`.

```typescript
result.captures.forEach(capture => {
  if (capture.photo) {
    capture.photo.images.forEach(image => {
      console.log(image.uri);
      console.log(image.rect);
    });
  } else if (capture.video) {
    console.log(capture.video.duration);
    capture.video.videos.forEach(video => {
      console.log(video.uri);
      console.log(video.rect);
    });
  }
});
```

### Video Reaction

If the user has recorded a reaction, the `openCamera` will return a `CameraReactionResult` which will contain the video that was reacted to and an array of `Recording`s, each representing a segment of the recorded reaction.

```typescript
console.log(result.video.duration);
result.video.videos.forEach(video => {
  console.log(video.uri);
  console.log(video.rect);
});

result.recordings.forEach(recording => {
  console.log(recording.duration);
  recording.videos.forEach(video => {
    console.log(video.uri);
    console.log(video.rect);
  });
});
```

## Cancellation

If the user has cancelled the camera session the `openCamera` function will return `null`.

```typescript
if (result === null) {
  console.log('The editor has been cancelled.');
  return;
}
```

## Failure

The `openCamera` function will throw if the user has not allowed accessing their camera and/or microphone or any other parsing/argument error occurred.

```typescript
console.log(`Error occurred in the camera session: ${error}.`);
```

## Full Code

Here's the full code for both files:

### recordings\_camera\_solution.ts

```typescript
import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY',
  };

  try {
    const result = await IMGLYCamera.openCamera(settings);
    if (result === null) {
      console.log('The editor has been cancelled.');
      return;
    }
    result.captures.forEach(capture => {
      if (capture.photo) {
        capture.photo.images.forEach(image => {
          console.log(image.uri);
          console.log(image.rect);
        });
      } else if (capture.video) {
        console.log(capture.video.duration);
        capture.video.videos.forEach(video => {
          console.log(video.uri);
          console.log(video.rect);
        });
      }
    });
  } catch (error) {
    console.log(`Error occurred in the camera session: ${error}.`);
  }
};
```

### recordings\_reaction\_camera\_solution.ts

```typescript
import IMGLYCamera, { CameraSettings } from '@imgly/camera-react-native';

export const recordings_reaction_camera_solution = async (): Promise<void> => {
  const settings: CameraSettings = {
    license: 'YOUR_LICENSE_KEY',
  };

  try {
    const result = await IMGLYCamera.openCamera(
      settings,
      require('MY_VIDEO_SOURCE'),
    );
    if (result === null) {
      console.log('The editor has been cancelled.');
      return;
    }
    console.log(result.video.duration);
    result.video.videos.forEach(video => {
      console.log(video.uri);
      console.log(video.rect);
    });

    result.recordings.forEach(recording => {
      console.log(recording.duration);
      recording.videos.forEach(video => {
        console.log(video.uri);
        console.log(video.rect);
      });
    });
  } catch (error) {
    console.log(`Error occurred in the camera session: ${error}.`);
  }
};
```



---

## More Resources

- **[React Native Documentation Index](https://img.ly/docs/cesdk/react-native/)** - Browse all React Native documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/react-native/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/react-native/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support