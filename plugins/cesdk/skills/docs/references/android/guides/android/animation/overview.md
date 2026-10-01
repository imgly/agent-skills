> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Overview](./overview.md)

---

Animations in CreativeEditor SDK (CE.SDK) bring your designs to life by adding motion to images, text, and design elements in video scenes. Whether you're creating a dynamic social media post, a video ad, or an engaging product demo, animations help capture attention and communicate ideas more effectively.

The editor UI can expose preset in, out, and loop animations for selected video, image, sticker, shape, and text blocks. You can adjust the properties exposed by each preset in the UI where available, or control animations programmatically with the CreativeEngine API.

Android integrations can use the [Video Editor Starter Kit](../starterkits/video-editor.md) Animations inspector for supported block types.

[Explore Demos](https://img.ly/showcases/cesdk?tags=android)

[Get Started](../get-started/overview.md)

## Animation Capabilities in CE.SDK

CE.SDK enables animation across a variety of design elements, giving you the flexibility to animate:

- **Images:** Animate image blocks with movements like fades, zooms, or rotations.
- **Text:** Animate text layers to create effects such as typewriter reveals or slide-ins.
- **Shapes and Graphics:** Add motion to vector shapes, icons, and graphic blocks to create visually rich layouts.

You can animate key properties of these elements, including:

- **Position:** Move elements across the canvas.
- **Scale:** Zoom in or out dynamically.
- **Rotation:** Spin or pivot elements over time.
- **Opacity:** Fade elements in and out.

## Supported Animation Types

CE.SDK provides a range of animation types designed for common motion effects. Core categories include:

- **Fade:** Smooth transitions in or out using opacity changes.
- **Slide:** Move elements into or out of the frame from any direction.
- **Zoom:** Scale elements up or down to create dynamic emphasis.
- **Rotate:** Apply rotational motion for spins or turns.

These animations can be used as in, out or loop animations to create complex sequences.

## Timeline and Preset Timing

Animations in CE.SDK are time-based presets attached to blocks in video scenes. In, out, and loop animations start relative to block visibility on the page timeline.

In animations play when a block appears, out animations play when it leaves, and loop animations repeat while the block is visible. CE.SDK animations are preset effects, so they do not expose custom per-property keyframe editing.

Use the editor UI for supported preset selection and property adjustments, or use CreativeEngine for programmatic setup and rendering. Use MP4 export when you need to preserve motion in the final output.

## Next Steps

- [Supported Animation Types](./types.md) — Compare available object
  and text animation presets and their properties.
- [Create Animations](./create.md) — Build entrance, exit, loop, and
  text animations in one end-to-end workflow.
- [Edit Animations](./edit.md) — Modify existing animations in
  CE.SDK by reading properties, changing duration and easing, adjusting
  direction, and replacing or removing animations from blocks.
- [Timeline Editor](../create-video/timeline-editor.md) — Arrange video tracks, clips, and
  audio on a time-based canvas.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support