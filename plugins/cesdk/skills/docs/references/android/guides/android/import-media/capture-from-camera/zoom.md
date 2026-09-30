> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Import Media Assets](../../import-media.md) > [Capture From Camera](../capture-from-camera.md) > [Zoom](./zoom.md)

---

Use camera zoom to frame subjects before recording video or taking photos with
the Mobile Camera. Zoom is built into the live camera preview, and users
control it with a pinch gesture. The photo or video captured next reflects the
applied zoom level.

## How Camera Zoom Works

When the camera is open, users pinch directly on the live preview. The camera
reads the gesture scale, multiplies it by the current CameraX zoom ratio, and
applies the result to the active camera.

The final zoom ratio is clamped to the range the camera device supports. CE.SDK
uses the minimum and maximum zoom ratios reported by CameraX, so the available
range can vary between devices and lenses.

## No Zoom Configuration

Camera zoom does not have a public `CameraConfiguration` option on Android.
`CameraConfiguration` controls capture behavior such as recording color, maximum
duration, capture type, capture count, photo clip duration, and photo preview
behavior.

Use [Mobile Camera Configuration](./camera-configuration.md) for those capture
options. Zoom remains an interactive preview gesture while the camera is active.

## Camera Zoom vs. Canvas Zoom

Camera zoom is separate from CreativeEngine scene and viewport zoom.
CreativeEngine scene APIs such as `engine.scene.setZoomLevel(...)`,
`engine.scene.zoomToBlock(...)`, and zoom auto-fit affect the editor canvas after
a scene is loaded. See [Set Zoom Level](../../open-the-editor/set-zoom-level.md) for the canvas
zoom APIs.

Canvas zoom APIs do not zoom the device camera feed during capture. For
camera capture, users zoom the preview with the pinch gesture before they commit
a photo or video.

## Troubleshooting

**The zoom feels limited** - The zoom range depends on the active camera and the
minimum and maximum zoom ratios reported by CameraX. Some cameras may not expose
a usable zoom range.

**Pinching does nothing** - The gesture works on the live camera preview from an
active camera feed. Test on a physical device when you need representative
camera zoom behavior.

**I need to set zoom in code** - The CE.SDK Mobile Camera does not expose a
public programmatic zoom API. Pinch-to-zoom is the only zoom path on the Mobile
Camera today.

## Next Steps

- [Integrate Mobile Camera](./integrate.md) - Add CE.SDK camera capture to your Android app.
- [Mobile Camera Configuration](./camera-configuration.md) - Configure capture modes, counts, durations, and preview behavior.
- [Take Photo](./take-photo.md) - Learn how to capture a photo with the Mobile Camera.
- [Access Recordings](./recordings.md) - Manage access to recorded videos or reactions.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support