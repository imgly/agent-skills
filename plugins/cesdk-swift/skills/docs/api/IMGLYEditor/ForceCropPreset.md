# ForceCropPreset

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/ForceCropPreset`

A crop preset candidate for force crop operations. When applying force crop with multiple preset candidates, the system automatically selects the best matching preset based on the block’s current dimensions.

```swift
struct ForceCropPreset
```

## Members

### init(sourceID:presetID:)

```swift
init(sourceID: String, presetID: String)
```

Creates a new force crop preset candidate. `sourceID`
