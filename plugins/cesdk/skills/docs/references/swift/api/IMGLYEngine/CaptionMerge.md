# CaptionMerge

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/CaptionMerge`

The result of [`mergeCaptionWithPrevious(_:keepCurrent:)`](blockapi/mergecaptionwithprevious(_:keepcurrent:).md).

```swift
struct CaptionMerge
```

## Members

### caption

```swift
let caption: DesignBlockID
```

The caption that stays.

### init(caption:textIndex:)

```swift
init(caption: DesignBlockID, textIndex: Int)
```

### textIndex

```swift
let textIndex: Int
```

The grapheme index of the merged text where the text of the merged caption starts, such as for a caret.
