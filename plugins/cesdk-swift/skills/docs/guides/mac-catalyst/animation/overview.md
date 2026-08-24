> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Animation](../animation.md) > [Overview](./overview.md)

---

Animations in CreativeEditor SDK (CE.SDK) bring your designs to life by adding motion to images, text, and design elements in video scenes. Whether you're creating a dynamic social media post, a video ad, or an engaging product demo, animations help capture attention and communicate ideas more effectively.

The editor UI can expose preset in, out, and loop animations for selected video, image, sticker, shape, and text blocks. You can adjust the properties exposed by each preset in the UI where available, or control animations programmatically with the CreativeEngine API.

[Explore Demos](https://img.ly/showcases/cesdk?tags=ios)

[Get Started](../get-started/overview.md)

## Timeline and Preset Timing

Animations in CE.SDK are time-based presets attached to blocks in video scenes. In, out, and loop animations start relative to block visibility on the page timeline.

In animations play when a block appears, out animations play when it leaves, and loop animations repeat while the block is visible. CE.SDK animations are preset effects, so they do not expose custom per-property keyframe editing.

Use the editor UI for supported preset selection and property adjustments, or use CreativeEngine for programmatic setup and rendering. Use MP4 export when you need to preserve motion in the final output.

## Next Steps

- [Supported Animation Types](./types.md) — Compare available object
  and text animation presets and their properties.
- [Create Animations](./create.md) — Build entrance, exit, loop, and
  text animations in one end-to-end workflow.
- [Edit Animations](./edit.md) — Inspect, update, replace, or remove
  animations already attached to a block.
- [Timeline Editor](../create-video/timeline-editor.md) — Arrange video tracks, clips, and
  audio on a time-based canvas.



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support