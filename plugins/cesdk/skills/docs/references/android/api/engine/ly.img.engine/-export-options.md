# ExportOptions

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The export options.

```kotlin
data class ExportOptions(val pngCompressionLevel: Int = 5, val jpegQuality: Float = 0.9f, val webpQuality: Float = 1.0f, val targetWidth: Float? = null, val targetHeight: Float? = null, val exportPdfWithHighCompatibility: Boolean = true, val exportPdfWithUnderlayer: Boolean = false, val underlayerSpotColorName: String = "", val underlayerOffset: Float = 0.0f, val underlayerRenderRatio: Float = 1.0f, val underlayerMaxError: Float = 2.0f, val underlayerMinFeatureWidth: Float = 0.0f, val allowTextOverhang: Boolean = false, val exportPdfWithCropMarks: Boolean = false, val exportPdfWithRegistrationMarks: Boolean = false, val printMarkOffset: Float = -1.0F, val cropMarkLength: Float = 0.0f, val printMarkWidth: Float = 0.25f, val pdfImageQuality: Float = 1.0f, val pdfChunkSize: Int? = null, val outputColorSpace: ProfileColorSpace = ProfileColorSpace.RGB, val outputProfileMode: OutputProfileMode = OutputProfileMode.OFF, val embedProfiles: Boolean = false, val preserveBlack: Boolean = false, val exportArea: RectF? = null)
```


## Members

### ExportOptions

```kotlin
constructor(pngCompressionLevel: Int = 5, jpegQuality: Float = 0.9f, webpQuality: Float = 1.0f, targetWidth: Float? = null, targetHeight: Float? = null, exportPdfWithHighCompatibility: Boolean = true, exportPdfWithUnderlayer: Boolean = false, underlayerSpotColorName: String = "", underlayerOffset: Float = 0.0f, underlayerRenderRatio: Float = 1.0f, underlayerMaxError: Float = 2.0f, underlayerMinFeatureWidth: Float = 0.0f, allowTextOverhang: Boolean = false, exportPdfWithCropMarks: Boolean = false, exportPdfWithRegistrationMarks: Boolean = false, printMarkOffset: Float = -1.0F, cropMarkLength: Float = 0.0f, printMarkWidth: Float = 0.25f, pdfImageQuality: Float = 1.0f, pdfChunkSize: Int? = null, outputColorSpace: ProfileColorSpace = ProfileColorSpace.RGB, outputProfileMode: OutputProfileMode = OutputProfileMode.OFF, embedProfiles: Boolean = false, preserveBlack: Boolean = false, exportArea: RectF? = null)
```

### allowTextOverhang

```kotlin
val allowTextOverhang: Boolean = false
```

If true, the export will include text bounding boxes that account for glyph overhangs. When enabled, text blocks with glyphs that extend beyond their frame (e.g., decorative fonts with swashes) will be exported with the full glyph bounds visible, preventing text clipping. The default value is false.

### cropMarkLength

```kotlin
val cropMarkLength: Float = 0.0f
```

Length of one crop mark line, in design units. It shares the unit of printMarkOffset, because the exported sheet grows by the sum of the two. Values <= 0 fall back to the equivalent of 15 pt. Only used when exportPdfWithCropMarks is true.

### embedProfiles

```kotlin
val embedProfiles: Boolean = false
```

Write the color profiles into the PDF: the Output profile of outputColorSpace as the OutputIntent with the condition Custom. /DefaultCMYK names the document CMYK profile that the DeviceCMYK values are written in. The file has none when that profile is the Output profile, or when outputProfileMode is not OutputProfileMode.OFF in a CMYK output. Then the OutputIntent describes the DeviceCMYK values. An RGB output without print marks has none either. sRGB becomes /DefaultRGB, except in an RGB export whose outputProfileMode is not OutputProfileMode.OFF. The file makes no PDF/X conformance claim. With outputProfileMode, each image keeps its samples. A tagged image keeps its profile as its tag, un…

### exportArea

```kotlin
val exportArea: RectF? = null
```

The rectangle of the block to export instead of the whole block, in design units. Not supported for PDF. The rectangle is in the block's own space, before rotation. (0, 0) is the block's top-left corner. For a scene, the rectangle is in scene coordinates. Its width and height must be greater than 0. The export composes the rectangle like a full export of the block. The rectangle may reach outside the block. The block's margin, stroke and allowTextOverhang do not enlarge it. The output has the aspect ratio of the rectangle, at the export resolution of the scene. targetWidth and targetHeight scale the rectangle. An output smaller than 1 px is an error. The export skips most blocks on a page w…

### exportPdfWithCropMarks

```kotlin
val exportPdfWithCropMarks: Boolean = false
```

Draw crop marks outside the bleed on every exported PDF page. Crop marks are the four pairs of corner lines that show a print shop where to cut. They are painted in the PDF registration colorant All, so they appear on every separation. This grows the PDF MediaBox to the trim plus printMarkOffset + cropMarkLength on each side, because the marks live outside the bleed. The page content, the TrimBox and the BleedBox keep describing the same physical rectangles. A page whose trim is not a rectangle, so a page with page/marginScale above 1, gets no marks and no larger page. The default value is false.

### exportPdfWithHighCompatibility

```kotlin
val exportPdfWithHighCompatibility: Boolean = true
```

Export the PDF document with a higher compatibility to different PDF viewers. Bitmap images, stripe fills, conical gradients, gradients with transparency and fills with effects are rasterized with the DPI setting instead of embedding them directly. A linear or radial gradient without transparency stays a vector. When outputProfileMode is not OutputProfileMode.OFF, or with embedProfiles, a rasterized image converts or is tagged from its rendered RGB. The profile of each image and the original bytes of a CMYK JPEG reach the file only with this option off. The default value is true.

### exportPdfWithRegistrationMarks

```kotlin
val exportPdfWithRegistrationMarks: Boolean = false
```

Draw registration marks outside the bleed on every exported PDF page. A registration mark is the bullseye target a press operator aligns the plates by. One sits at the middle of each page edge, and each is painted in the PDF registration colorant All, so they appear on every separation. This grows the PDF MediaBox on the same terms as exportPdfWithCropMarks, and a page whose trim is not a rectangle gets no marks either. A registration mark has one fixed size, so there is no knob for it. The default value is false.

### exportPdfWithUnderlayer

```kotlin
val exportPdfWithUnderlayer: Boolean = false
```

Export the PDF document with an underlayer. An underlayer is generated by adding a graphics block behind the existing elements of the shape of the elements on the page.

### jpegQuality

```kotlin
val jpegQuality: Float = 0.9f
```

The JPEG quality to use when encoding to JPEG. Valid values are (0-1], higher means better quality. Ignored for other encodings. The default value is 0.9.

### outputColorSpace

```kotlin
val outputColorSpace: ProfileColorSpace
```

The component space that a PDF export writes its colors in, and the Output profile slot it reads with SceneApi.setDocumentColorProfile. With ProfileColorSpace.RGB, the default, colors are written as DeviceRGB. With ProfileColorSpace.CMYK, every CMYK color is written as DeviceCMYK, and every spot color with CMYK values as a named Separation with a DeviceCMYK alternate. RGB colors stay DeviceRGB until outputProfileMode converts them. Any export that is not a PDF fails with EngineErrorCode.ENCODE_OUTPUT_COLOR_SPACE_UNSUPPORTED for CMYK. ProfileColorSpace.GRAY is not supported.

### outputProfileMode

```kotlin
val outputProfileMode: OutputProfileMode
```

What a PDF export does with the document's Output profile of outputColorSpace. OutputProfileMode.OFF writes the colors as they are. OutputProfileMode.CONVERT converts every solid color into the Output profile: fills, strokes, text and the alternate of each spot color. OutputProfileMode.ASSIGN keeps the values of every solid color in the space of the Output profile. Those are CMYK colors in a CMYK output and RGB colors in an RGB output. It converts the other colors as OutputProfileMode.CONVERT does. With embedProfiles, the Output profile in the file labels the kept values. Without it, they stay device values, as the converted values of OutputProfileMode.CONVERT do. A spot color's alternate i…

### pdfChunkSize

```kotlin
val pdfChunkSize: Int? = null
```

Upper bound, in bytes, for a single chunk of a streamed export. It matters most for the streamed BlockApi.export overloads, where this is the memory the caller has to hold for one chunk. A larger value lowers the per-chunk overhead and raises the memory each chunk costs. A smaller value does the opposite. null, the default, uses an engine-chosen size, and so does a value below 1. Any other value is clamped to 4096, 67108864, so an unusable request lowers the quality of the trade rather than failing the export. Note this is a bound and not a chunk size: the encoder also flushes after each page, so the last chunk of a page is normally smaller.

### pdfImageQuality

```kotlin
val pdfImageQuality: Float = 1.0f
```

The encoding quality to use for images that have to be rasterized during PDF export, e.g. images with effects or blurs applied, or any bitmap image when exportPdfWithHighCompatibility is enabled. Valid values are (0-1]. Exactly 1.0 (the default) keeps the lossless encoding, like webpQuality. Any value below 1.0 re-encodes rasterized images as lossy JPEG at the given quality, which produces much smaller files. Only rasterized content that is fully opaque can be re-encoded, because JPEG has no alpha channel. Content that keeps transparency, for example when exporting a block or a page without a background fill, stays losslessly encoded whatever this option is set to. Images whose original JPE…

### pngCompressionLevel

```kotlin
val pngCompressionLevel: Int = 5
```

The PNG compression level to use, when exporting to PNG. Valid values are 0 to 9, higher means smaller, but slower. Quality is not affected. Ignored for other encodings. The default value is 5.

### preserveBlack

```kotlin
val preserveBlack: Boolean = false
```

Keep black as black ink where outputProfileMode converts a color. With CMYK output, an exact RGB black becomes 0/0/0/100 K instead of a rich black. With RGB output, a K-only CMYK black becomes exact RGB black, and an exact RGB black stays exact. Images and PNG and JPEG exports ignore this option. Ignored when outputProfileMode is OutputProfileMode.OFF. The default value is false.

### printMarkOffset

```kotlin
val printMarkOffset: Float
```

Distance from the trim to the nearest edge of any printer's mark, in design units. Every mark type shares it, so it is comparable with the page bleed without converting. A negative value falls back to the equivalent of 6 pt. Zero is a real offset that places a mark on the trim edge. A mark may reach into the bleed, which the knife removes anyway, and every mark carries a white knockout underneath so it stays legible over artwork. Only used when exportPdfWithCropMarks or exportPdfWithRegistrationMarks is true.

### printMarkWidth

```kotlin
val printMarkWidth: Float = 0.25f
```

Stroke width of any printer's mark, in points. Every mark type shares it, and a print shop calls it the weight. Points, not design units, because a weight is a print measure that never meets the page geometry. Must be 0. Values <= 0 fall back to 0.25, a hairline. Only used when exportPdfWithCropMarks or exportPdfWithRegistrationMarks is true.

### targetHeight

```kotlin
val targetHeight: Float? = null
```

An optional target height. If used, the block will be rendered large enough that it fills the target size entirely while maintaining its aspect ratio. Without a target width, the width follows from that aspect ratio.

### targetWidth

```kotlin
val targetWidth: Float? = null
```

An optional target width. If used, the block will be rendered large enough that it fills the target size entirely while maintaining its aspect ratio. Without a target height, the height follows from that aspect ratio.

### underlayerMaxError

```kotlin
val underlayerMaxError: Float = 2.0f
```

Maximum acceptable curve-fit error, in pixels, when vectorising the underlayer contour. Smaller values produce tighter fits at the cost of more path complexity. Useful together with underlayerRenderRatio for small text on large pages. Must be 0. Values <= 0 fall back to 2.0. Defaults to 2.0 for backward compatibility.

### underlayerMinFeatureWidth

```kotlin
val underlayerMinFeatureWidth: Float = 0.0f
```

The width that a part of the underlayer keeps at least when a negative underlayerOffset shrinks it, in the same unit as underlayerOffset. A part that the shrink would make thinner keeps this width along its middle, and a part that is already thinner keeps its own shape. No effect when underlayerOffset is 0 or more. Values <= 0 turn it off. Defaults to 0.

### underlayerOffset

```kotlin
val underlayerOffset: Float = 0.0f
```

The adjustment in size of the shape of the underlayer.

### underlayerRenderRatio

```kotlin
val underlayerRenderRatio: Float = 1.0f
```

Resolution multiplier for the raster pass that extracts the underlayer contour. Higher values produce sharper underlayer outlines at the cost of memory and export time. Useful for small text on large pages, where the 1.0 default can miss fine glyph details. Must be 0. Values <= 0 fall back to 1.0. Defaults to 1.0 for backward compatibility.

### underlayerSpotColorName

```kotlin
val underlayerSpotColorName: String
```

The name of the spot color to be used for the underlayer's fill.

### webpQuality

```kotlin
val webpQuality: Float = 1.0f
```

The WebP quality to use when encoding to WebP. Valid values are (0-1], higher means better quality. WebP uses a special lossless encoding that usually produces smaller file sizes than PNG. Ignored for other encodings. Defaults to 1.0.
