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

### cropMarkLength

```swift
let cropMarkLength: Float
```

### exportPdfWithCropMarks

```swift
let exportPdfWithCropMarks: Bool
```

### exportPdfWithHighCompatibility

```swift
let exportPdfWithHighCompatibility: Bool
```

### exportPdfWithRegistrationMarks

```swift
let exportPdfWithRegistrationMarks: Bool
```

### exportPdfWithUnderlayer

```swift
let exportPdfWithUnderlayer: Bool
```

### init(pngCompressionLevel:jpegQuality:webpQuality:targetWidth:targetHeight:exportPdfWithHighCompatibility:exportPdfWithUnderlayer:underlayerSpotColorName:underlayerOffset:underlayerRenderRatio:underlayerMaxError:allowTextOverhang:exportPdfWithCropMarks:exportPdfWithRegistrationMarks:printMarkOffset:cropMarkLength:printMarkWidth:pdfImageQuality:pdfChunkSize:)

```swift
init(pngCompressionLevel: Int = 5, jpegQuality: Float = 0.9, webpQuality: Float = 1.0, targetWidth: Float = 0, targetHeight: Float = 0, exportPdfWithHighCompatibility: Bool = true, exportPdfWithUnderlayer: Bool = false, underlayerSpotColorName: String = "", underlayerOffset: Float = 0.0, underlayerRenderRatio: Float = 1.0, underlayerMaxError: Float = 2.0, allowTextOverhang: Bool = false, exportPdfWithCropMarks: Bool = false, exportPdfWithRegistrationMarks: Bool = false, printMarkOffset: Float = -1.0, cropMarkLength: Float = 0.0, printMarkWidth: Float = 0.25, pdfImageQuality: Float = 1.0, pdfChunkSize: UInt32 = 0)
```

The export options. `pngCompressionLevel`

### jpegQuality

```swift
let jpegQuality: Float
```

### pdfChunkSize

```swift
let pdfChunkSize: UInt32
```

### pdfImageQuality

```swift
let pdfImageQuality: Float
```

### pngCompressionLevel

```swift
let pngCompressionLevel: Int
```

### printMarkOffset

```swift
let printMarkOffset: Float
```

### printMarkWidth

```swift
let printMarkWidth: Float
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
