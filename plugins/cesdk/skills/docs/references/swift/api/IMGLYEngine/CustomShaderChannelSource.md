# CustomShaderChannelSource

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CustomShaderChannelSource`

The source of one pass channel.

```swift
@objc enum CustomShaderChannelSource
```

## Members

### CustomShaderChannelSource.backdrop

```swift
case backdrop
```

The composited background prefix, excluding this output and later siblings; the name must be empty.

### CustomShaderChannelSource.currentPass

```swift
case currentPass
```

### CustomShaderChannelSource.effectInput

```swift
case effectInput
```

The image entering this effect in its render chain; the channel name must be empty.

### CustomShaderChannelSource.empty

```swift
case empty
```

Transparent RGBA zero sampled from a 1x1 texture.

### CustomShaderChannelSource.input

```swift
case input
```

### CustomShaderChannelSource.previousPass

```swift
case previousPass
```

### CustomShaderChannelSource.transitionIncoming

```swift
case transitionIncoming
```

The incoming clip of a custom-shader transition; only transitions accept it, and the name must be empty.

### CustomShaderChannelSource.transitionOutgoing

```swift
case transitionOutgoing
```

The outgoing clip of a custom-shader transition; only transitions accept it, and the name must be empty.

### init(rawValue:)

```swift
init?(rawValue: Int32)
```
