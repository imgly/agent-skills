> This is one page of the CE.SDK Mac Catalyst documentation. For a complete overview, see the [Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Overview](./overview.md)

---

Understand Swift video projects in CE.SDK before choosing an editor UI,
Engine API workflow, or focused implementation guide.

CE.SDK video projects add time-based editing to the same scene and block model used for static designs. A video scene can contain pages, timeline tracks, media-backed clips, overlays, captions, audio, and export settings.

Use this overview to decide where your Swift integration should start. Start with the Video Editor Starter Kit for iOS when you need an interactive timeline UI. Use Engine APIs for automation, custom controls, template-driven output, or scene preparation that runs before the editor opens.

## Core Video Concepts

Video scenes are timeline-based scenes. Each page defines an independent timeline and the output frame size for that timeline. Blocks placed on the page or inside tracks become active for a duration, and the page playback time determines which frame is visible.

Scenes own the time-based project and shared resources. Pages define timelines and frame sizes. Clips are timed blocks, often backed by video media. Tracks group clips and can sequence them over time. Audio can come from video media or from standalone audio blocks. Export turns the page timeline into a shareable video output.

Timeline values are measured in seconds. Duration controls how long a block or media source is active, time offset controls when it starts in its parent timeline, and trim values control which part of a media source plays. These concepts show up across the focused Swift video guides.

## UI-Based Editing

Reach for the CE.SDK editor UI when users need to assemble or adjust videos interactively. On iOS, the editor UI covers common editing tasks such as arranging clips on a timeline, trimming media, adding overlays, editing captions, placing watermarks, previewing playback, and balancing audio.

Apps usually customize that UI around their product workflow: available tools, asset sources, export actions, brand controls, permissions, and app-specific navigation. Keep those choices in your editor configuration, then use Engine APIs for any scene preparation or post-processing that should happen before or after the user edits.

## Programmatic Editing

Use Engine APIs when your app needs reproducible video output or custom automation. Programmatic workflows can create video scenes, add pages and tracks, load media, arrange clips, set durations and offsets, adjust trim ranges, control audio, generate previews, and export finished pages.

For step-by-step code, continue with the focused guides for timeline editing, joining and arranging clips, trimming, captions, watermarks, and export.

## Platform Support and Constraints

Swift video workflows run on the user's Apple device and depend on platform media, rendering, storage, and codec support. Test the codecs, resolutions, frame rates, memory usage, and export settings that match your target devices, especially for long videos, large source files, or high-resolution output.

Some behavior is platform-specific. Export options, media loading, file access, permissions, and available codecs differ across platforms. Reach for the Swift implementation guides when a workflow touches local file access, asset loading, playback performance, or export configuration.

## Audio in Video Projects

Video projects can include audio embedded in video media and standalone audio blocks. Common Swift workflows include muting audio embedded in video fills, adding background music, adding voiceover, placing sound effects on the timeline, and adjusting volume across multiple sources.

Standalone audio blocks use the same timeline concepts as visual blocks: duration determines how long the audio plays, time offset determines when it starts, and trim values can select the source-media segment. Include audio in a rendered video by keeping those audio sources on the page and exporting the page as video.

## Export and Output

Export turns a page timeline into an output artifact. Swift video export uses Engine video export APIs to render a page range and return encoded video content. Export options can control details such as frame rate, bitrate, target dimensions, and H.264 settings.

The right export setup depends on the product: a social video may prioritize size and speed, while a template workflow may prioritize resolution and repeatable output. Use dedicated export guides for format, compression, progress, storage, and file-handling details.

## AI and App-Specific Workflows

AI-assisted and app-specific video features fit around the same scene model. Your app can generate scripts, suggest edits, create captions, prepare assets, or call external services before applying the result to a CE.SDK scene. Treat those workflows as integrations unless a focused CE.SDK guide documents them as built-in platform behavior.

## Next Steps

- Video Editor Starter Kit — For iOS, start from the timeline UI for interactive editing.
- [Programmatic Editing](../edit-video/programmatic.md) — Edit video scenes with CE.SDK Engine APIs on Swift.
- [Timeline Editor](./timeline-editor.md) — Arrange clips, audio, overlays, and timeline previews.
- [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) — Combine clips into sequences and organize them on tracks.
- [Control Audio and Video](./control.md) — Play, pause, seek, and preview audio or video content.
- [Add Captions](../edit-video/add-captions.md) — Add synchronized captions to Swift video scenes.
- [Add Watermark](../edit-video/add-watermark.md) — Add text or image watermarks to exported videos.
- [Export](../export-save-publish/export.md) — Render output for sharing or publishing.
- [Trim](../edit-video/trim.md) — Control which portion of source media plays



---

## More Resources

- **[Mac Catalyst Documentation Index](https://img.ly/docs/cesdk/mac-catalyst/)** - Browse all Mac Catalyst documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/mac-catalyst/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/mac-catalyst/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support