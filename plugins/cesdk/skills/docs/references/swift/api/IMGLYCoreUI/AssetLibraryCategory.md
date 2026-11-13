# AssetLibraryCategory

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/AssetLibraryCategory`

A category (tab) in the asset library, containing sections. This is the data representation of an asset library tab, aligned with Android’s `AssetLibraryCategory`.

```swift
struct AssetLibraryCategory
```

## Members

### ==(_:_:)

```swift
static func == (lhs: AssetLibraryCategory, rhs: AssetLibraryCategory) -> Bool
```

### AssetLibraryCategory.ID

```swift
enum ID
```

A namespace for default category IDs.

### ID-swift.enum.audio

```swift
static let audio: String
```

ID for the audio category.

### defaultAudio

```swift
static var defaultAudio: AssetLibraryCategory { get }
```

Default audio category.

### defaultCategories

```swift
static var defaultCategories: [AssetLibraryCategory] { get }
```

Default categories for the asset library.

### defaultElements

```swift
static var defaultElements: AssetLibraryCategory { get }
```

Default elements category. This is a meta-category that automatically groups all other categories into a single scrollable view. Its `sections` array is unused — the content is derived from the other categories at render time.

### defaultImages

```swift
static var defaultImages: AssetLibraryCategory { get }
```

Default images category.

### defaultPhotoRoll

```swift
static var defaultPhotoRoll: AssetLibraryCategory { get }
```

Default photo roll category (images and videos).

### defaultShapes

```swift
static var defaultShapes: AssetLibraryCategory { get }
```

Default shapes category.

### defaultStickers

```swift
static var defaultStickers: AssetLibraryCategory { get }
```

Default stickers category.

### defaultText

```swift
static var defaultText: AssetLibraryCategory { get }
```

Default text category: plain text, text styles, text combinations, and curved text.

### defaultVideos

```swift
static var defaultVideos: AssetLibraryCategory { get }
```

Default videos category.

### ID-swift.enum.elements

```swift
static let elements: String
```

ID for the elements category. This is a meta-category that groups all other categories.

### icon

```swift
var icon: Image
```

### id

```swift
let id: String
```

### ID-swift.enum.images

```swift
static let images: String
```

ID for the images category.

### init(id:title:icon:sections:)

```swift
init(id: String, title: LocalizedStringResource, icon: Image, sections: [AssetLibrarySection])
```

Creates a library category. `id`

### ID-swift.enum.photoRoll

```swift
static let photoRoll: String
```

ID for the photo roll category.

### sections

```swift
var sections: [AssetLibrarySection]
```

### ID-swift.enum.shapes

```swift
static let shapes: String
```

ID for the shapes category.

### ID-swift.enum.stickers

```swift
static let stickers: String
```

ID for the stickers category.

### ID-swift.enum.text

```swift
static let text: String
```

ID for the text category.

### title

```swift
var title: LocalizedStringResource
```

### ID-swift.enum.videos

```swift
static let videos: String
```

ID for the videos category.
