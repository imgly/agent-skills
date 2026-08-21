# ExportOptions

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ExportOptions`

```swift
@objcMembers final class ExportOptions
```

## Members

### allowTextOverhang

```swift
let allowTextOverhang: Bool
```

### exportPdfWithHighCompatibility

```swift
let exportPdfWithHighCompatibility: Bool
```

### exportPdfWithUnderlayer

```swift
let exportPdfWithUnderlayer: Bool
```

### init(pngCompressionLevel:jpegQuality:webpQuality:targetWidth:targetHeight:exportPdfWithHighCompatibility:exportPdfWithUnderlayer:underlayerSpotColorName:underlayerOffset:underlayerRenderRatio:underlayerMaxError:allowTextOverhang:pdfImageQuality:)

```swift
init(pngCompressionLevel: Int = 5, jpegQuality: Float = 0.9, webpQuality: Float = 1.0, targetWidth: Float = 0, targetHeight: Float = 0, exportPdfWithHighCompatibility: Bool = true, exportPdfWithUnderlayer: Bool = false, underlayerSpotColorName: String = "", underlayerOffset: Float = 0.0, underlayerRenderRatio: Float = 1.0, underlayerMaxError: Float = 2.0, allowTextOverhang: Bool = false, pdfImageQuality: Float = 1.0)
```

The export options. `pngCompressionLevel`

### jpegQuality

```swift
let jpegQuality: Float
```

### pdfImageQuality

```swift
let pdfImageQuality: Float
```

### pngCompressionLevel

```swift
let pngCompressionLevel: Int
```

### targetHeight

```swift
let targetHeight: Float
```

### targetWidth

```swift
let targetWidth: Float
```

### underlayerMaxError

```swift
let underlayerMaxError: Float
```

### underlayerOffset

```swift
let underlayerOffset: Float
```

### underlayerRenderRatio

```swift
let underlayerRenderRatio: Float
```

### underlayerSpotColorName

```swift
let underlayerSpotColorName: String
```

### webpQuality

```swift
let webpQuality: Float
```
