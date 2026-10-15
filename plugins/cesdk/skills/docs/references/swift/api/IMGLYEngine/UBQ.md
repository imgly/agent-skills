# UBQ

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/UBQ`

```swift
class UBQ
```

## Members

### init(canvas:audioContext:)

```swift
init?(canvas: MTKView, audioContext: UInt8)
```

### init(size:audioContext:)

```swift
init?(size: CGSize, audioContext: UInt8)
```

### screenRect(_:)

```swift
func screenRect(_ block: UInt32) -> CGRect
```

### setEngineIdentity(host:)

```swift
func setEngineIdentity(host: String)
```

### test_mark(asClicked:)

```swift
func test_mark(asClicked block: UInt32)
```

### test_pointerDown(_:)

```swift
func test_pointerDown(_ position: CGPoint)
```

### test_pointerMove(_:)

```swift
func test_pointerMove(_ position: CGPoint)
```

### test_pointerUp(_:cancelled:)

```swift
func test_pointerUp(_ position: CGPoint, cancelled: Bool)
```

### update()

```swift
func update()
```
