> This is one page of the CE.SDK SvelteKit documentation. For a complete overview, see the [SvelteKit Documentation Index](https://img.ly/sveltekit.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Edit Videos](./create-video.md) > [Timeline Editor](./create-video/timeline-editor.md)

---

The CreativeEditor SDK (CE.SDK) offers features for editing the video timeline, the horizontal layout where you arrange video, audio, and effects in the sequence they play. This tutorial will help you create advanced video editing tools for high-quality video exports.

This tutorial focuses on the user interface components. For programmatic timeline manipulation, refer to the [Video Overview](./create-video/overview.md) guide.

## When to Use

Use the CE.SDK timeline features in web applications that incorporate the following tools:

- Video montages
- Marketing video editing
- Social media content creation

## What You’ll Learn

This tutorial will show you how to:

- The video timeline works.
- To create video scenes.
- To manage video layers (tracks).
- To edit a clip’s duration and offset.
- To manage video playback.
- To generate and display video thumbnails.

## How the Timeline Works

This tutorial refers to the timeline, which is the horizontal area below the video editing canvas. The video timeline displays:

- All clips on parallel tracks
- A playhead for navigation
- Controls for playback and editing

<Picture src={videoMode} style={{ width: '85%' }} alt="Default CE.SDK Editor on Video Mode" formats={['webp']} />

Use the visual timeline for editing actions like:

- Arranging clips along a time axis to control when each element **appears**.
- Trimming clips to change their duration.
- Layer content visually.

### Activate CE.SDK Video Mode

To work with the CE.SDK Editor in video mode, specify the scene’s design as follows:

```ts
cesdk.addDefaultAssetSources(),
cesdk.addDemoAssetSources({ sceneMode: 'Video' }),
await cesdk.createVideoScene();
```

This tells the CreativeEditor:

- To use the Video editing mode (rather than the Design one).
- To load demo video assets to test the editor.
- To create a video scene, ready for editing.

### Open/Close the Timeline Editing area

The default CreativeEditor settings display the timeline when launching the UI.

Close it to increase canvas space when the scene doesn’t need timeline editing. To close it, click the **Timeline** toggle:

<Picture src={closeTimeline} style={{ width: '85%' }} alt="CE.SDK timeline UI with collapse toggle highlighted" formats={['webp']} />

To open it and access the visual timeline editing tools, click the same toggle:

<Picture src={openTimeline} style={{ width: '85%' }} alt="CE.SDK timeline UI with expanded toggle highlighted" formats={['webp']} />

### Timeline Structure

The timeline’s structure in the CE.SDK is the following:

1. Scene (root block)
2. Pages (as video segments)
3. Tracks (as parallel layers)
4. Clips (as graphic blocks)

### Track Structure

The track is a container that handles the content layer. The timeline organizes content into three track types:

- Clip tracks (for video content)
- Overlay track (for text and graphics over the video)
- Audio tracks

<Picture src={tracksStructure} style={{ width: '85%' }} alt="Two clips layered over audio and text" formats={['webp']} />

The order in which track appears determines its position in the scene:

- Moving a track to the top brings it to the front of the scene.
- Moving a track to the bottom of the timeline sends the content the back of the scene.

<Picture src={clipLayering} style={{ width: '85%' }} alt="Clip 3 on top of clip 1 and clip 2 and behind the title" formats={['webp']} />

### Control the Content Position

You can adjust the position of the content using the vertical playhead line, which indicates the current playhead time. The playhead moves along the timeline, displaying the time code.

Change the playhead position (when the clip starts playing) by either:

- Clicking on any area in the time ruler.
- Dragging the playhead with your cursor.

<Picture src={timelineDrag} style={{ width: '85%' }} alt="Current play time, dragged playhead and dragging zone" formats={['webp']} />

### Scroll and Zoom on the Timeline

Adjust the time scale to increase the level of details per frame:

1. Click anywhere in the timeline area.
2. Zoom into the timeline using:
   - Keyboard shortcuts
   - A mouse
   - A trackpad

When zoomed in, the clip stretches visually—each pixel now represents fewer milliseconds—so you can fine-tune edits frame by frame.

<Picture src={timelineZoom} style={{ width: '110%' }} alt="Unzoomed timeline VS zoomed timeline" formats={['webp']} />

## Control How the Clips Play

### Play/Pause the Scene

The playback bar contains:

- The **play/pause button** that plays the clip from the current playhead position.
- A **loop toggle** that repeats the video when activated.
- The **current timestamp**

<Picture src={playBar} style={{ width: '85%' }} alt="CE.SDK playback bar" formats={['webp']} />

The scene plays while synchronizing:

- All videos
- Overlays
- Audio

### Preview Frames

Drag and drop (scrub) the playhead back and forth to preview frames without playing the clip in real time. This allows you to quickly find the exact moment you want to edit.

<Picture src={scrubPlayhead} style={{ width: '85%' }} alt="Frame preview at 0:4:8" formats={['webp']} />

The timestamp is the current playhead time in HH:MM:SS:FF format.

<Picture src={scrubTimestamp} style={{ width: '85%' }} alt="Frame preview at 0:4:8" formats={['webp']} />

## Edit Video Clips

The CreativeEditor’s timeline allows users to visually edit clips and scenes in the browser. This section lists all timeline editing features.

### Select Clips

Before editing any clip, you need to select it to apply modifications to it. To **select a clip**, click it either:

- From the page
- From the timeline

<Picture src={clipSelect} style={{ width: '85%' }} alt="Clip selected in CE.SDK UI" formats={['webp']} />

Selecting multiple clips at once is available either:

- With cursor clicks on each clip while holding modifier keys.
- By drawing a frame in the scene with the cursor.

Selecting a clip reveals editing handles to:

- Crop the clip.
- Flip the clip.
- Trim the clip.

<Picture src={multiSelect} style={{ width: '110%' }} alt="2 clips selected at once" formats={['webp']} />

### Edit Clip’s Duration

In the timeline, selected clips show drag handles at their beginning and end. Use these handles based on your goals:

- Trim the clip from the beginning: use the left handle (at the start of the clip).
- Trim the clip from the end: use the right handle (at the end of the clip).

This operation is called **“trimming” a clip**. As you move the clip, its position on the timeline automatically updates. Trimming shortens the clip, and the cut portions:

- Don’t play anymore.
- Disappear from the timeline.

### Split Clips

The Split Control splits the selected clip into two separate clips at the playhead.

<Picture src={splitClip} style={{ width: '110%' }} alt="Clip split in 2 separate clips" formats={['webp']} />

Each resulting clip is then independently editable. **Splitting doesn’t remove any part of the original content.**

## Add Content to the Scene

Once you’ve edited the clips, you can add more elements to the scene to customize it further, such as:

- Additional clips
- Audio tracks
- Graphics and text

### Add Another Clip

The web version of the CreativeEditor allows you to add more clips to the scene in two ways:

- By clicking the "Add Clip" button:

  1. Opens the video assets gallery.
  2. Automatically adds any selected clips from the gallery to the timeline.

- By dragging and dropping from your computer to either:
  1. The page
  2. The timeline

Dragging the clip highlights the zone before dropping it.

<Picture src={dragNdrop} style={{ width: '110%' }} alt="Clip being dragged to the page and clip being dragged to the timeline in the CE.SDK Editor UI" formats={['webp']} />

The choice of the zone makes no difference: the clip’s position is automatically set at the beginning of the timeline. You can then reposition and edit it as needed.

### Add Audio and Overlays

Furthermore, there are two types of content that you can incorporate into the setting:

- Overlays (text, images, stickers)
- Audio

**Add the new content** to the scene by either:

- Clicking the kind of content to add from the **lateral menu**.
- Using the **drag and drop** feature from your computer or another source.

<Picture src={addContent} style={{ width: '85%' }} alt="Lateral menu highlighting Uploads, Images, Audio, Text and Stickers" formats={['webp']} />

Each type of content appears automatically on its own track, at the start of the timeline.

## Arrange Clips

Use the CreativeEditor UI’s timeline to edit:

- The order in which clips appear.
- Each clip starting point.
- Using advanced settings.

### Reorder Clips

Drag clips along the horizontal axis to move them earlier or later in the timeline. This makes a clip’s order relative to the other clip change.

The CreativeEditor enhances visual clip arrangement in the timeline by:

- Auto-adjusting positions to prevent overlapping clips on the same track.
- Showing the clip’s predicted position using drop indicators.

<Picture src={arrangeClips} style={{ width: '85%' }} alt="Timeline containing 2 clips, the second one being dragged along the horizontal axis" formats={['webp']} />

### Edit the Clip’s Starting Point

Each clip’s position along the horizontal axis indicates its start time in the composition. To change the start time of a clip, drag it either:

- Left to make it start **earlier**.
- Right to make it start **later**.

Gaps between clips display as empty frames showing the background color when the scene plays.

<Picture src={gapClips} style={{ width: '85%' }} alt="CE.SDK timeline showing an orange background color within a gap between 2 clips" formats={['webp']} />

### Change the Background color

To change the background color, click the **Background** button on the left side of the play bar.

<Picture src={backColor} style={{ width: '85%' }} alt="CE.SDK timeline with background color button highlighted" formats={['webp']} />

This action opens a full color editing menu to customize:

- Color settings (RGB, CMYK, Hex, Hue)
- Transparency
- Solid or gradients
- Color picking from the scene

This menu provides an option to **deactivate the background** as well. Deactivating the background makes the scene play on a transparent background.

## Configure the Timeline

### Activate/Deactivate the Timeline

The CreativeEditor SDK ships a UI with the timeline editor activated. To change the settings and deactivate the timeline , use the `ly.img.video.timeline` feature flag:

<Tabs>
  <TabItem label="Enable the timeline">
    ```ts
    // Enable the timeline (default for video scenes)
    cesdk.feature.enable('ly.img.video.timeline');

    ```
  </TabItem>

  <TabItem label="Deactivate the timeline">
    ```ts
    // Disable the timeline for a simplified interface
    cesdk.feature.disable('ly.img.video.timeline');

    ```
  </TabItem>

  <TabItem label="Conditionally show the timeline">
    Pass the option to selectively hide the timeline unless the scene is in **Video Mode**:

    ```ts
    // Only show timeline when in Video mode (this is the default behavior)
    cesdk.feature.set('ly.img.video.timeline', ({ engine }) => {
      return engine.scene.getMode() === 'Video';
    });

    cesdk.feature.set('ly.img.video.controls.split', ({ engine }) => {
      const selected = engine.block.findAllSelected();
      return selected.length === 1;
    });

    ```
  </TabItem>
</Tabs>

### Hide or Show Tracks

Simplify the CreativeEditor interface by leveraging the track visibility settings. Hide or display tracks based on specific use cases.

<Tabs>
  <TabItem label="Video tracks">
    **Enable** video features with:

    ```ts
    cesdk.feature.enable('ly.img.video.clips');

    ```

    **Hide** video feature with:

    ```ts
    cesdk.feature.disable('ly.img.video.clips');

    ```

    This will hide
  </TabItem>

  <TabItem label="Overlays tracks ">
    **Display** overlays tracks with:

    ```ts
    cesdk.feature.enable('ly.img.video.overlays');

    ```

    **Hide** overlay tracks with:

    ```ts
    cesdk.feature.disable('ly.img.video.overlays');

    ```
  </TabItem>

  <TabItem label="Audio tracks">
    **Display** audio tracks with:

    ```ts
    cesdk.feature.enable('ly.img.video.audio');

    ```

    **Hide** audio tracks with:

    ```ts
    cesdk.feature.disable('ly.img.video.audio');

    ```
  </TabItem>

  <TabItem label="All">
    **Display** all tracks with:

    ```ts
    cesdk.feature.enable([
      'ly.img.video.clips',
      'ly.img.video.overlays',
      'ly.img.video.audio'
    ]);

    ```

    **Hide** all tracks with:

    ```ts
    cesdk.feature.disable([
      'ly.img.video.clips',
      'ly.img.video.overlays',
      'ly.img.video.audio'
    ]);

    ```
  </TabItem>
</Tabs>

### Configure the Play Bar

Simplify the play bar by hiding or displaying controls in the UI:

<Tabs>
  <TabItem label="Play bar">
    **Display** the play bar with:

    ```ts
    cesdk.feature.enable('ly.img.video.controls.playback');

    ```

    **Hide** the play bar with:

    ```ts
    cesdk.feature.disable('ly.img.video.controls.playback');

    ```
  </TabItem>

  <TabItem label="Loop control">
    **Display** the loop control with:

    ```ts
    cesdk.feature.enable('ly.img.video.controls.loop');

    ```

    **Hide** the loop control with:

    ```ts
    cesdk.feature.disable('ly.img.video.controls.loop');

    ```
  </TabItem>

  <TabItem label="Zoom">
    **Display** the zoom on the timeline with:

    ```ts
    cesdk.feature.enable('ly.img.video.controls.timelineZoom');

    ```

    **Hide** the zoom into the timeline with:

    ```ts
    cesdk.feature.disable('ly.img.video.controls.timelineZoom');

    ```
  </TabItem>
</Tabs>

### Fine-tune Editing Actions

Restrict or allow editing actions by hiding or displaying the editing controls:

<Tabs>
  <TabItem label="Split">
    **Hide** the split button with:

    ```ts
    cesdk.feature.disable('ly.img.video.controls.split');

    ```
  </TabItem>

  <TabItem label="Add Clip button">
    **Hide** the **Add Clip** button with:

    ```ts
    cesdk.feature.disable('ly.img.video.addClip');

    ```
  </TabItem>

  <TabItem label="Background button">
    **Hide** the background button with:

    ```ts
    cesdk.feature.disable('ly.img.video.controls.background');

    ```
  </TabItem>

  <TabItem label="Global Settings">
    **Activate** all video features at once using global patterns with `/*`:

    ```ts
    // Enable all video features
    cesdk.feature.enable('ly.img.video.*');

    ```

    Or **deactivate** video features at once:

    ```ts
    // Disable all video control features
    cesdk.feature.disable('ly.img.video.*');

    ```
  </TabItem>
</Tabs>

### Activate Features Dynamically

You can activate or deactivate timeline features dynamically, instead of hard-coding their **on/off** state.

The following example detects the scene state:

- When a clip is selected, it activates the Split button.
- When nothing is selected, it hides the Split button.

```ts
// Disable split control when nothing is selected
cesdk.feature.set('ly.img.video.controls.split', ({ engine }) => {
  const selected = engine.block.findAllSelected();
  return selected.length === 1;
});

```

### Feature Reference

| Feature ID | Description |
|------------|-------------|
| `ly.img.video.timeline` | Show or hide the entire timeline panel |
| `ly.img.video.clips` | Show or hide the video clips track |
| `ly.img.video.overlays` | Show or hide the overlay track |
| `ly.img.video.audio` | Show or hide the audio track |
| `ly.img.video.addClip` | Enable or disable adding new clips |
| `ly.img.video.controls` | Base feature for all video controls |
| `ly.img.video.controls.toggle` | Show or hide timeline collapse/expand button |
| `ly.img.video.controls.playback` | Show or hide play/pause and timestamp |
| `ly.img.video.controls.loop` | Show or hide loop toggle |
| `ly.img.video.controls.split` | Show or hide split clip control |
| `ly.img.video.controls.background` | Show or hide background color controls |
| `ly.img.video.controls.timelineZoom` | Show or hide zoom controls |

## Troubleshooting

| Issue | Solution|
| ----- | ------- |
| Timeline not displaying | ・ Verify the scene is in video mode.<br />・ Check that `ly.img.video.timeline` feature is enabled. |
| Trim handles not displaying | ・ Click the clip first to reveal handles.<br /> ・ Check if the clip contains video/audio content. |
| Play not starting | ・ Ensure the video has loaded.<br /> ・ Check the browser console for codec errors.<br /> ・ Check that the playhead falls within the page duration. |
| Split not working | ・ Check that you’ve selected the clip to split.<br />・ Check that the playhead is within the selected clip’s duration<br />. Make sure you’ve enabled `ly.img.video.controls.split`. |

## Next Steps

- [Trim Video Clips](./edit-video/trim.md) — Detailed trimming techniques, including frame-accurate editing.
- [Control Audio and Video](./create-video/control.md) — Master volume, playback speed, and timing.
- [Activate or Deactivate Features](./user-interface/customization/disable-or-enable.md) - Full feature flag reference.
- [Compress and Export the Video](./export-save-publish/export/compress.md).



---

## More Resources

- **[SvelteKit Documentation Index](https://img.ly/sveltekit.md)** - Browse all SvelteKit documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./sveltekit.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support