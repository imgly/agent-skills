> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Font Size Unit](./font-size-unit.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-concepts-font-size-unit/FontSizeUnit.kt reference-only
import ly.img.engine.DesignBlockType
import ly.img.engine.DesignUnit
import ly.img.engine.Engine
import ly.img.engine.FontUnit
import ly.img.engine.SceneLayout
import ly.img.engine.SizeMode
import kotlin.math.abs

private const val FONT_SIZE_EPSILON = 0.001F

fun fontSizeUnit(engine: Engine) {
    // `scene.create(designUnit, fontSizeUnit)` lets you pair both units
    // explicitly. When `fontSizeUnit` is null, CE.SDK pairs it with
    // `designUnit`: `Pixel` design -> `Pixel` fonts, `Millimeter` and
    // `Inch` -> `Point` fonts.
    val scene = engine.scene.create(
        designUnit = DesignUnit.PIXEL,
        fontSizeUnit = FontUnit.POINT,
        sceneLayout = SceneLayout.FREE,
    )

    val page = engine.block.create(DesignBlockType.Page)
    engine.block.appendChild(parent = scene, child = page)

    val text = engine.block.create(DesignBlockType.Text)
    engine.block.appendChild(parent = page, child = text)
    engine.block.replaceText(text, text = "Font Size Unit")
    engine.block.setWidthMode(text, mode = SizeMode.AUTO)
    engine.block.setHeightMode(text, mode = SizeMode.AUTO)

    // Read the scene's current font-size unit. This scene passes `Point`
    // explicitly even though the design unit is `Pixel`.
    val initialUnit = engine.scene.getFontSizeUnit()
    println("Initial font-size unit: $initialUnit") // POINT
    check(initialUnit == FontUnit.POINT)

    // Switch the scene-wide default. Existing text keeps its visual size;
    // only future `setTextFontSize` / `getTextFontSizes` calls use the new
    // unit. `setDesignUnit` does not overwrite this setting, so the choice
    // survives changes to the design coordinate system.
    engine.scene.setFontSizeUnit(FontUnit.PIXEL)
    val switchedUnit = engine.scene.getFontSizeUnit()
    println("After switch: $switchedUnit") // PIXEL
    check(switchedUnit == FontUnit.PIXEL)

    // The value 24f is interpreted in the scene's `fontSizeUnit`, so the
    // engine reads it as 24 px.
    engine.block.setTextFontSize(text, fontSize = 24F)

    // Font-size float properties use the same font-size unit.
    engine.block.setFloat(block = text, property = "text/fontSize", value = 24F)

    // `getTextFontSizes` returns values in the scene's `fontSizeUnit`,
    // mirroring how `setTextFontSize` interpreted them.
    val sizesInPixels = engine.block.getTextFontSizes(text)
    val propertyFontSizeInPixels = engine.block.getFloat(block = text, property = "text/fontSize")
    println("Sizes (px): $sizesInPixels")
    println("Property size (px): $propertyFontSizeInPixels")
    check(sizesInPixels.size == 1 && abs(sizesInPixels.first() - 24F) < FONT_SIZE_EPSILON)
    check(abs(propertyFontSizeInPixels - 24F) < FONT_SIZE_EPSILON)
}
```

Pick the unit your scene uses for `setTextFontSize` and `getTextFontSizes`.
The engine continues to store font sizes in points internally; this setting
only changes how values are interpreted at the API boundary.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.81.0-nightly.20260808/engine-guides-concepts-font-size-unit)

<EngineReferenceNote {...props} />

A scene's `fontSizeUnit` is the unit `BlockApi.setTextFontSize` expects when setting a value and `BlockApi.getTextFontSizes` returns the value. CE.SDK supports two units: `FontUnit.POINT` (the typographic default) and `FontUnit.PIXEL` (to match a pixel-based design unit).

This guide covers reading and changing the scene's font-size unit, how that default flows through Android text APIs, why Android font-size calls use the scene-level font unit, and how to pair the font unit with the design unit at scene creation.

## Reading the Current Font-Size Unit

Use `engine.scene.getFontSizeUnit()` to retrieve the font unit the current scene uses for the font size APIs. In this sample, the scene passes `FontUnit.POINT` explicitly even though the design unit is `DesignUnit.PIXEL`.

When the unit-aware `engine.scene.create(designUnit, fontSizeUnit, sceneLayout)` overload receives `fontSizeUnit=null`, CE.SDK pairs the font-size unit with the design unit: `DesignUnit.PIXEL` uses `FontUnit.PIXEL`, while `DesignUnit.MILLIMETER` and `DesignUnit.INCH` use `FontUnit.POINT`. Loaded scenes saved before `fontSizeUnit` existed return `FontUnit.POINT` for compatibility.

```kotlin highlight-android-get-font-size-unit
// Read the scene's current font-size unit. This scene passes `Point`
// explicitly even though the design unit is `Pixel`.
val initialUnit = engine.scene.getFontSizeUnit()
println("Initial font-size unit: $initialUnit") // POINT
```

## Setting the Font-Size Unit

`engine.scene.setFontSizeUnit(FontUnit)` switches the scene-wide default. Existing text retains its visual size—the engine still stores values in points and converts on the way in and out. Only subsequent `setTextFontSize` and `getTextFontSizes` calls use the new unit.

```kotlin highlight-android-set-font-size-unit
// Switch the scene-wide default. Existing text keeps its visual size;
// only future `setTextFontSize` / `getTextFontSizes` calls use the new
// unit. `setDesignUnit` does not overwrite this setting, so the choice
// survives changes to the design coordinate system.
engine.scene.setFontSizeUnit(FontUnit.PIXEL)
val switchedUnit = engine.scene.getFontSizeUnit()
println("After switch: $switchedUnit") // PIXEL
```

`setDesignUnit` does not change `fontSizeUnit`, so a deliberate font-unit choice survives changes to the design coordinate system.

## Setting Font Sizes in the Scene Unit

When you call `BlockApi.setTextFontSize(block, fontSize, from, to)`, the value is interpreted in the scene's `fontSizeUnit`. The optional `from` and `to` parameters limit the write to a UTF-16 code unit range; keep the default `-1` values to target the whole text block, or the current editing selection when the block is being edited.

The same unit applies to `BlockApi.setFloat` and `BlockApi.getFloat` for `text/fontSize`, `text/minAutomaticFontSize`, `text/maxAutomaticFontSize`, `caption/fontSize`, `caption/minAutomaticFontSize`, and `caption/maxAutomaticFontSize`.

```kotlin highlight-android-implicit-set
    // The value 24f is interpreted in the scene's `fontSizeUnit`, so the
    // engine reads it as 24 px.
    engine.block.setTextFontSize(text, fontSize = 24F)

    // Font-size float properties use the same font-size unit.
    engine.block.setFloat(block = text, property = "text/fontSize", value = 24F)
```

## No Per-Call Unit Override on Android

Android's `BlockApi.setTextFontSize` and `BlockApi.getTextFontSizes` APIs use the scene's `fontSizeUnit` directly. They do not expose a per-call unit option, so set the scene unit that matches your workflow before writing or reading font sizes.

If your app stores typography in another unit, convert those values in your application layer before passing them to CE.SDK, or switch the scene's `fontSizeUnit` for the workflow that owns those text edits.

## Reading Font Sizes

`BlockApi.getTextFontSizes(block, from, to)` returns values in the scene's `fontSizeUnit`. Use `from` and `to` UTF-16 code unit offsets to read a substring range; keep the default `-1` values to read the current cursor or selection while the block is being edited, or the whole text block otherwise. The same conversion applies to `BlockApi.getFloat(block, "text/fontSize")`, so reads match how Android interpreted the previous write.

```kotlin highlight-android-read-sizes
// `getTextFontSizes` returns values in the scene's `fontSizeUnit`,
// mirroring how `setTextFontSize` interpreted them.
val sizesInPixels = engine.block.getTextFontSizes(text)
val propertyFontSizeInPixels = engine.block.getFloat(block = text, property = "text/fontSize")
println("Sizes (px): $sizesInPixels")
println("Property size (px): $propertyFontSizeInPixels")
```

## Pairing Units at Scene Creation

The unit-aware `engine.scene.create(designUnit, fontSizeUnit, sceneLayout)` overload accepts both options. When `fontSizeUnit` is `null`, CE.SDK pairs it with `designUnit` (`DesignUnit.PIXEL` ⇒ `FontUnit.PIXEL`, `DesignUnit.MILLIMETER` and `DesignUnit.INCH` ⇒ `FontUnit.POINT`). Pass both explicitly when you want to mix them—for example, a Pixel design with Point-based typography.

```kotlin highlight-android-create-with-units
// `scene.create(designUnit, fontSizeUnit)` lets you pair both units
// explicitly. When `fontSizeUnit` is null, CE.SDK pairs it with
// `designUnit`: `Pixel` design -> `Pixel` fonts, `Millimeter` and
// `Inch` -> `Point` fonts.
val scene = engine.scene.create(
    designUnit = DesignUnit.PIXEL,
    fontSizeUnit = FontUnit.POINT,
    sceneLayout = SceneLayout.FREE,
)
```

Auto-pairing only applies to the unit-aware overload above. The layout-only `engine.scene.create(sceneLayout)` overload creates a Pixel scene with `FontUnit.POINT`. `engine.scene.createForVideo()`, `engine.scene.createFromImage()`, and `engine.scene.createFromVideo()` also keep `FontUnit.POINT` for compatibility. Call `engine.scene.setFontSizeUnit(FontUnit.PIXEL)` after creation if you want font sizes to match Pixel-based coordinates.

## API Reference

| API | Purpose |
| --- | --- |
| `engine.scene.getFontSizeUnit()` | Get the current scene's font-size unit. |
| `engine.scene.setFontSizeUnit(fontSizeUnit=_)` | Set the current scene's font-size unit. |
| `engine.scene.create(designUnit=_, fontSizeUnit=null, sceneLayout=SceneLayout.FREE)` | Create a scene whose font-size unit is paired automatically with the design unit. |
| `engine.scene.create(sceneLayout=SceneLayout.FREE)` | Create a Pixel scene with the compatibility font-size unit `FontUnit.POINT`. |
| `engine.scene.createForVideo()` | Create a video scene with the compatibility font-size unit `FontUnit.POINT`. |
| `engine.scene.createFromImage(imageUri=_, dpi=300F, pixelScaleFactor=1F, sceneLayout=SceneLayout.FREE)` | Create an image scene with the compatibility font-size unit `FontUnit.POINT`. |
| `engine.scene.createFromVideo(videoUri=_)` | Create a video scene from a video URI with the compatibility font-size unit `FontUnit.POINT`. |
| `engine.block.setTextFontSize(block=_, fontSize=_, from=-1, to=-1)` | Set a text block's font size, or a UTF-16 text range, in the scene unit. |
| `engine.block.getTextFontSizes(block=_, from=-1, to=-1)` | Read a text block's font sizes, or a UTF-16 text range, in the scene unit. |
| `engine.block.setFloat(block=_, property="text/fontSize", value=_)`<br />`engine.block.getFloat(block=_, property="text/fontSize")` | Set or read the main text font-size property in the scene unit. |
| `engine.block.setFloat(block=_, property="text/minAutomaticFontSize", value=_)`<br />`engine.block.getFloat(block=_, property="text/minAutomaticFontSize")` | Set or read the text auto-resize minimum in the scene unit. |
| `engine.block.setFloat(block=_, property="text/maxAutomaticFontSize", value=_)`<br />`engine.block.getFloat(block=_, property="text/maxAutomaticFontSize")` | Set or read the text auto-resize maximum in the scene unit. |
| `engine.block.setFloat(block=_, property="caption/fontSize", value=_)`<br />`engine.block.getFloat(block=_, property="caption/fontSize")` | Set or read the caption font-size property in the scene unit. |
| `engine.block.setFloat(block=_, property="caption/minAutomaticFontSize", value=_)`<br />`engine.block.getFloat(block=_, property="caption/minAutomaticFontSize")` | Set or read the caption auto-resize minimum in the scene unit. |
| `engine.block.setFloat(block=_, property="caption/maxAutomaticFontSize", value=_)`<br />`engine.block.getFloat(block=_, property="caption/maxAutomaticFontSize")` | Set or read the caption auto-resize maximum in the scene unit. |

## Next Steps

- [Design Units](./design-units.md) - Understand the broader unit system that determines layout coordinates and DPI.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support