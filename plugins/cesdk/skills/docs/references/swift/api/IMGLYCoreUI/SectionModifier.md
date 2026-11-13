# SectionModifier

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/SectionModifier`

A helper to modify an array of asset library sections within a category.

```swift
@MainActor class SectionModifier
```

## Members

### addAfter(id:_:)

```swift
@MainActor func addAfter(id: String, _ sections: AssetLibrarySection...)
```

Inserts sections after the section with the specified ID. `id`

### addBefore(id:_:)

```swift
@MainActor func addBefore(id: String, _ sections: AssetLibrarySection...)
```

Inserts sections before the section with the specified ID. `id`

### addFirst(_:)

```swift
@MainActor func addFirst(_ sections: AssetLibrarySection...)
```

Prepends sections at the start. `sections`

### addLast(_:)

```swift
@MainActor func addLast(_ sections: AssetLibrarySection...)
```

Appends sections at the end. `sections`

### init()

```swift
@MainActor init()
```

Creates a section modifier.

### remove(id:)

```swift
@MainActor func remove(id: String)
```

Removes the section with the specified ID. `id`

### replace(id:_:)

```swift
@MainActor func replace(id: String, _ sections: AssetLibrarySection...)
```

Replaces the section with the specified ID. `id`
