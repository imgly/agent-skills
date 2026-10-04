# ColorRenderingIntent

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ColorRenderingIntent`

How a color that the destination cannot reproduce is mapped into it. The raw values are the ICC rendering intent numbers.

```swift
@objc enum ColorRenderingIntent
```

## Members

### ColorRenderingIntent.absoluteColorimetric

```swift
case absoluteColorimetric
```

### ColorRenderingIntent.perceptual

```swift
case perceptual
```

### ColorRenderingIntent.relativeColorimetric

```swift
case relativeColorimetric
```

### ColorRenderingIntent.saturation

```swift
case saturation
```

### init(rawValue:)

```swift
init?(rawValue: Int32)
```
