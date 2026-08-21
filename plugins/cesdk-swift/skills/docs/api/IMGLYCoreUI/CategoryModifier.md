# CategoryModifier

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/CategoryModifier`

A helper to modify an array of asset library categories. Similar to `ArrayModifier` but works with string-based IDs for asset library types.

```swift
@MainActor class CategoryModifier
```

## Members

### addAfter(id:_:)

```swift
@MainActor func addAfter(id: String, _ categories: AssetLibraryCategory...)
```

Inserts categories after the category with the specified ID. `id`

### addBefore(id:_:)

```swift
@MainActor func addBefore(id: String, _ categories: AssetLibraryCategory...)
```

Inserts categories before the category with the specified ID. `id`

### addFirst(_:)

```swift
@MainActor func addFirst(_ categories: AssetLibraryCategory...)
```

Prepends categories at the start. `categories`

### addLast(_:)

```swift
@MainActor func addLast(_ categories: AssetLibraryCategory...)
```

Appends categories at the end. `categories`

### init()

```swift
@MainActor init()
```

Creates a category modifier.

### modifySections(of:_:)

```swift
@MainActor func modifySections(of id: String, _ modify: @escaping (SectionModifier) -> Void)
```

Modifies the sections of the category with the specified ID. `id`

### remove(id:)

```swift
@MainActor func remove(id: String)
```

Removes the category with the specified ID. `id`

### replace(id:_:)

```swift
@MainActor func replace(id: String, _ categories: AssetLibraryCategory...)
```

Replaces the category with the specified ID. `id`
