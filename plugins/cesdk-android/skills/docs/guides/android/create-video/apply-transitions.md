> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../guides.md) > [Create and Edit Videos](../create-video.md) > [Apply Transitions](./apply-transitions.md)

---

Blend adjacent video clips into each other with clip-to-clip transitions such as cross-fades, pushes, and wipes using CE.SDK's transitions API.

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/main/engine-guides-apply-transitions)

<EngineReferenceNote {...props} />

A transition belongs to the **outgoing clip** and blends it into the following clip on the same track. When you assign one, the engine overlaps the two clips for the transition duration: the incoming clip—and every clip after it—moves earlier on the timeline, and audio cross-fades linearly over the same window.

Transitions are blocks. You create one with `createTransition`, attach it to a clip with `setTransition`, and configure it through the same generic setters you use for other blocks. Once assigned, the transition is owned by its clip: it is destroyed together with the clip, and the engine also destroys it automatically when the two clips stop being timeline-adjacent.

```kotlin file=@cesdk_android_examples/engine-guides-apply-transitions/ApplyTransitions.kt reference-only
import android.net.Uri
import android.util.Log
import kotlinx.coroutines.yield
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.FillType
import ly.img.engine.ShapeType
import ly.img.engine.TransitionType

private const val TAG = "ApplyTransitions"

// The engine lays out track children on its scheduled update pass, so derived values such as time
// offsets only settle once that pass has run. Offscreen runs like this sample have to wait for it.
private suspend fun waitForScheduledEngineUpdate() = yield()

suspend fun applyTransitions(engine: Engine): TransitionSummary {
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1280F)
    engine.block.setHeight(block = page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)

    // Build a sequence of four clips on a single track.
    val videoUris = listOf(
        "https://img.ly/static/ubq_video_samples/bbb.mp4",
        "https://img.ly/static/ubq_video_samples/test30.mp4",
        "https://img.ly/static/ubq_video_samples/multitrack_output.mp4",
        "https://img.ly/static/ubq_video_samples/bbb.mp4",
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)

    val clips = videoUris.map { videoUri ->
        val clip = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block = clip, shape = engine.block.createShape(ShapeType.Rect))

        val videoFill = engine.block.createFill(FillType.Video)
        engine.block.setUri(block = videoFill, property = "fill/video/fileURI", value = Uri.parse(videoUri))
        engine.block.setFill(block = clip, fill = videoFill)

        engine.block.setDuration(block = clip, duration = 4.0)
        engine.block.appendChild(parent = track, child = clip)
        clip
    }
    engine.block.fillParent(track)

    val (clipA, clipB, clipC) = clips

    // Individual clips placed directly in a video track support transitions, no matter whether they
    // show a video, an image, a shape, a sticker or text.
    val clipsSupportTransitions =
        engine.block.supportsTransition(clipA) && engine.block.supportsTransition(clipB)
    Log.i(TAG, "Clips support transitions: $clipsSupportTransitions")

    // The duration defines how long the two clips overlap.
    val crossFade = engine.block.createTransition(TransitionType.CrossFade)
    engine.block.setDuration(block = crossFade, duration = 1.0)

    // Assign the transition to the outgoing clip. It blends this clip into the next clip
    // on the same track.
    engine.block.setTransition(block = clipA, transition = crossFade)

    waitForScheduledEngineUpdate()

    // Assigning a transition overlaps the two clips: the incoming clip and everything after it
    // move earlier by the transition duration.
    val incomingClipOffset = engine.block.getTimeOffset(clipB)
    Log.i(TAG, "Clip B now starts at $incomingClipOffset seconds (was 4)")

    // Per-type properties use the generic block setters with "transition/{type}/{property}" keys.
    // Discover what a type exposes with findAllProperties.
    val push = engine.block.createTransition(TransitionType.Push)
    engine.block.setDuration(block = push, duration = 1.0)
    engine.block.setTransition(block = clipB, transition = push)

    val pushProperties = engine.block.findAllProperties(push)
    Log.i(TAG, "Push properties: $pushProperties")

    engine.block.setEnum(block = push, property = "transition/push/direction", value = "Left")

    // With morph enabled, position, rotation, scale, and shape are interpolated between the
    // outgoing and incoming clip.
    engine.block.setBoolean(block = push, property = "transition/push/morph", value = true)

    // An unset relation returns an invalid block, so check the result with isValid.
    val assigned = engine.block.getTransition(clipA)
    val assignedType = if (engine.block.isValid(assigned)) engine.block.getType(assigned) else null
    Log.i(TAG, "Clip A transitions with: $assignedType")

    val fadeToBlack = engine.block.createTransition(TransitionType.FadeToBlack)
    engine.block.setDuration(block = fadeToBlack, duration = 1.0)
    engine.block.setTransition(block = clipC, transition = fadeToBlack)

    // removeTransition detaches the block and restores the original clip timing, but does not
    // destroy it: the detached block stays valid until you destroy it yourself.
    engine.block.removeTransition(clipC)
    val detachedTransitionIsValid = engine.block.isValid(fadeToBlack)
    engine.block.destroy(fadeToBlack)

    val colorWipe = engine.block.createTransition(TransitionType.ColorWipe)
    engine.block.setDuration(block = colorWipe, duration = 1.0)
    engine.block.setTransition(block = clipC, transition = colorWipe)
    engine.block.setEnum(block = colorWipe, property = "transition/color-wipe/direction", value = "Up")
    engine.block.setColor(
        block = colorWipe,
        property = "transition/color-wipe/color",
        value = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 1F),
    )

    // Fit the page duration to the reflowed sequence and park the playhead inside the first
    // overlap window so the cross-fade blend is the visible frame.
    val lastClip = clips.last()
    engine.block.setDuration(
        block = page,
        duration = engine.block.getTimeOffset(lastClip) + engine.block.getDuration(lastClip),
    )
    engine.block.setPlaybackTime(block = page, time = 3.5)

    return TransitionSummary(
        clipsSupportTransitions = clipsSupportTransitions,
        incomingClipOffset = incomingClipOffset,
        pushProperties = pushProperties,
        assignedTransitionType = assignedType,
        replacedTransitionType = engine.block.getType(engine.block.getTransition(clipC)),
        detachedTransitionIsValid = detachedTransitionIsValid,
    )
}
```

This guide covers how to check transition support, create and assign transitions between clips, understand the timeline overlap they introduce, configure per-type properties, and replace or remove them.

## Creating the Video Timeline

Transitions need a video scene with at least two adjacent clips on a track. We create the scene first.

```kotlin highlight-android-setup
    val scene = engine.scene.createForVideo()

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(block = page, value = 1280F)
    engine.block.setHeight(block = page, value = 720F)
    engine.block.appendChild(parent = scene, child = page)
```

Next, we build a sequence of four clips. Each clip is a graphic block with a video fill, and appending the clips to a track makes them play one after another.

```kotlin highlight-android-create-clips
    // Build a sequence of four clips on a single track.
    val videoUris = listOf(
        "https://img.ly/static/ubq_video_samples/bbb.mp4",
        "https://img.ly/static/ubq_video_samples/test30.mp4",
        "https://img.ly/static/ubq_video_samples/multitrack_output.mp4",
        "https://img.ly/static/ubq_video_samples/bbb.mp4",
    )

    val track = engine.block.create(DesignBlockType.Track)
    engine.block.appendChild(parent = page, child = track)

    val clips = videoUris.map { videoUri ->
        val clip = engine.block.create(DesignBlockType.Graphic)
        engine.block.setShape(block = clip, shape = engine.block.createShape(ShapeType.Rect))

        val videoFill = engine.block.createFill(FillType.Video)
        engine.block.setUri(block = videoFill, property = "fill/video/fileURI", value = Uri.parse(videoUri))
        engine.block.setFill(block = clip, fill = videoFill)

        engine.block.setDuration(block = clip, duration = 4.0)
        engine.block.appendChild(parent = track, child = clip)
        clip
    }
    engine.block.fillParent(track)

    val (clipA, clipB, clipC) = clips
```

Each clip plays for 4 seconds, so the clips initially start at 0, 4, 8, and 12 seconds.

## Checking Transition Support

Before assigning a transition, we verify that both the outgoing and the incoming clip support one. Any individual clip placed directly in a video track qualifies, no matter whether it shows a video, an image, a shape, a sticker or text. Audio, group, caption, and cutout blocks report `false`, as do blocks outside a video track.

```kotlin highlight-android-check-support
// Individual clips placed directly in a video track support transitions, no matter whether they
// show a video, an image, a shape, a sticker or text.
val clipsSupportTransitions =
    engine.block.supportsTransition(clipA) && engine.block.supportsTransition(clipB)
Log.i(TAG, "Clips support transitions: $clipsSupportTransitions")
```

`setTransition` throws when either clip fails this check, so testing upfront lets you disable the option instead of handling an error later.

## Creating and Assigning a Transition

We create a cross-fade and give it a duration. The duration defines how long the two clips overlap.

```kotlin highlight-android-create-transition
// The duration defines how long the two clips overlap.
val crossFade = engine.block.createTransition(TransitionType.CrossFade)
engine.block.setDuration(block = crossFade, duration = 1.0)
```

The new block is standalone until we assign it. Assigning it to the first clip blends that clip into the one that follows it on the track.

```kotlin highlight-android-set-transition
// Assign the transition to the outgoing clip. It blends this clip into the next clip
// on the same track.
engine.block.setTransition(block = clipA, transition = crossFade)
```

A transition block can only be assigned to one clip. Assigning a different transition to a clip that already has one detaches the previous block without destroying it.

## Understanding the Timeline Overlap

Assigning a transition reflows the timeline. The incoming clip moves earlier by the transition duration so the two clips overlap, and all downstream clips shift with it.

```kotlin highlight-android-timeline-reflow
// Assigning a transition overlaps the two clips: the incoming clip and everything after it
// move earlier by the transition duration.
val incomingClipOffset = engine.block.getTimeOffset(clipB)
Log.i(TAG, "Clip B now starts at $incomingClipOffset seconds (was 4)")
```

With a 1-second cross-fade on the first clip, the second clip's time offset changes from 4 to 3 seconds. The effective overlap is clamped: it never exceeds half of either neighboring clip's duration, so a long transition between short clips plays shorter than requested. Removing the transition restores the original offsets.

## Configuring Transition Properties

Each transition type exposes its own properties under `transition/{type}/{property}` keys, which you set through the generic block setters. Use `findAllProperties` to discover what a specific type offers.

```kotlin highlight-android-configure-properties
    // Per-type properties use the generic block setters with "transition/{type}/{property}" keys.
    // Discover what a type exposes with findAllProperties.
    val push = engine.block.createTransition(TransitionType.Push)
    engine.block.setDuration(block = push, duration = 1.0)
    engine.block.setTransition(block = clipB, transition = push)

    val pushProperties = engine.block.findAllProperties(push)
    Log.i(TAG, "Push properties: $pushProperties")

    engine.block.setEnum(block = push, property = "transition/push/direction", value = "Left")
```

Directional types such as `push`, `slide`, `wipe`, and `color-wipe` expose a `direction` enum. Others expose numeric controls, for example `transition/cross-spin/intensity` or `transition/cross-warp/zoom`, and `color-wipe` exposes a `transition/color-wipe/color` color property.

## Morphing Between Clips

Most transition types expose a `morph` flag—only `clock-wipe` and `cross-spin` don't. When enabled, the engine interpolates position, rotation, scale, and shape between the outgoing and incoming clip during the transition.

```kotlin highlight-android-morph
// With morph enabled, position, rotation, scale, and shape are interpolated between the
// outgoing and incoming clip.
engine.block.setBoolean(block = push, property = "transition/push/morph", value = true)
```

Morphing is most visible when the two clips differ in framing—for example when one clip is scaled or rotated relative to the other.

## Reading Back a Transition

`getTransition` returns the transition assigned to a clip, or an invalid block when the clip has none. Check the result with `isValid` before using it.

```kotlin highlight-android-get-transition
// An unset relation returns an invalid block, so check the result with isValid.
val assigned = engine.block.getTransition(clipA)
val assignedType = if (engine.block.isValid(assigned)) engine.block.getType(assigned) else null
Log.i(TAG, "Clip A transitions with: $assignedType")
```

## Replacing or Removing a Transition

`removeTransition` detaches a clip's transition and restores the original clip timing, but does not destroy the detached block. Destroy it yourself when you no longer need it, then assign a replacement.

```kotlin highlight-android-remove-transition
    val fadeToBlack = engine.block.createTransition(TransitionType.FadeToBlack)
    engine.block.setDuration(block = fadeToBlack, duration = 1.0)
    engine.block.setTransition(block = clipC, transition = fadeToBlack)

    // removeTransition detaches the block and restores the original clip timing, but does not
    // destroy it: the detached block stays valid until you destroy it yourself.
    engine.block.removeTransition(clipC)
    val detachedTransitionIsValid = engine.block.isValid(fadeToBlack)
    engine.block.destroy(fadeToBlack)

    val colorWipe = engine.block.createTransition(TransitionType.ColorWipe)
    engine.block.setDuration(block = colorWipe, duration = 1.0)
    engine.block.setTransition(block = clipC, transition = colorWipe)
    engine.block.setEnum(block = colorWipe, property = "transition/color-wipe/direction", value = "Up")
    engine.block.setColor(
        block = colorWipe,
        property = "transition/color-wipe/color",
        value = Color.fromRGBA(r = 1F, g = 1F, b = 1F, a = 1F),
    )
```

Removing from a clip without an assigned transition is a no-op.

## Transition Types

`createTransition` takes a `TransitionType`:

- **Blends**: `CrossFade`, `CrossBlur`, `CrossSpin`, `CrossZoom`, `CrossWarp`
- **Movement**: `Push`, `Slide`, `Stack`, `Splice`, `DiagonalSplice`
- **Fades**: `Fade`, `FadeToBlack`, `FadeToWhite`, `GradientFade`
- **Wipes**: `Wipe`, `LineWipe`, `ClockWipe`, `ColorWipe`
- **Patterns**: `Chop`, `TwoStripes`
- **None**: `None`

## Troubleshooting

### Transition Has No Visible Effect

Check that both clips sit next to each other on the same track and that the playhead is inside the overlap window. The overlap starts at the incoming clip's time offset and ends at the outgoing clip's end.

### setTransition Throws

Verify `supportsTransition` returns `true` for both the outgoing and the incoming clip, and that the transition block isn't already assigned to another clip.

### Transition Disappeared

The engine destroys an assigned transition when the two clips stop being timeline-adjacent—for example after a gap is introduced between them—or when the owning clip is destroyed.

### Transition Plays Shorter Than Requested

The effective duration is clamped to half of either neighboring clip's duration. Shorten the transition or lengthen the clips.

## API Reference

| Method | Purpose |
| --- | --- |
| `engine.scene.createForVideo()` | Create the video scene the clips and transitions live in. |
| `engine.block.create(blockType=_)` | Create the page, track, and clip blocks. |
| `engine.block.appendChild(parent=_, child=_)` | Add the page, track, and clips in timeline order. |
| `engine.block.setWidth(block=_, value=_)` | Set the page width. |
| `engine.block.setHeight(block=_, value=_)` | Set the page height. |
| `engine.block.createShape(type=_)` | Create the rectangle shape a clip is drawn with. |
| `engine.block.setShape(block=_, shape=_)` | Assign the shape to a clip. |
| `engine.block.createFill(fillType=_)` | Create the video fill that carries a clip's media. |
| `engine.block.setUri(block=_, property="fill/video/fileURI", value=_)` | Assign a video URI to a video fill. |
| `engine.block.setFill(block=_, fill=_)` | Assign the video fill to a clip. |
| `engine.block.fillParent(block=_)` | Size the track to fill the page. |
| `engine.block.createTransition(type=_)` | Create a standalone transition block of the given `TransitionType`. |
| `engine.block.supportsTransition(block=_)` | Check whether a clip can own an outgoing transition. |
| `engine.block.setTransition(block=_, transition=_)` | Assign the outgoing transition of a clip. |
| `engine.block.getTransition(block=_)` | Read the assigned transition (invalid block if unset). |
| `engine.block.removeTransition(block=_)` | Detach the outgoing transition of a clip. |
| `engine.block.setDuration(block=_, duration=_)` | Set clip or transition duration in seconds. |
| `engine.block.getTimeOffset(block=_)` | Read a clip's timeline start. |
| `engine.block.setEnum(block=_, property="transition/push/direction", value=_)` | Configure a directional transition. |
| `engine.block.setColor(block=_, property="transition/color-wipe/color", value=_)` | Configure the wipe color. |
| `engine.block.setBoolean(block=_, property="transition/push/morph", value=_)` | Enable morphing between the two clips. |
| `engine.block.findAllProperties(block=_)` | List the properties a transition exposes. |
| `engine.block.getType(block=_)` | Read the type of an assigned transition. |
| `engine.block.isValid(block=_)` | Check a `getTransition` result. |
| `engine.block.destroy(block=_)` | Destroy a detached transition block. |

## Next Steps

- [Join and Arrange Video Clips](../edit-video/join-and-arrange.md) — Build the clip sequence transitions operate on
- [Trim Video and Audio](../edit-video/trim.md) — Control which portion of a clip plays back
- [Create Animations](../animation/create.md) — Entrance and exit effects for individual blocks



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support