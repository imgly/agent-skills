# ArrayModifier

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/ArrayModifier`

A helper to modify groups of [`EditorComponent`](editorcomponent.md) arrays.

```swift
class ArrayModifier<Element, Group> where Group : Hashable
```

## Members

### addAfter(id:_:)

```swift
func addAfter(id: EditorComponentID, @ArrayBuilder<Element> _ elements: () -> [Element])
```

Inserts an array of `elements` after the element with the specified `id`. `id`

### addBefore(id:_:)

```swift
func addBefore(id: EditorComponentID, @ArrayBuilder<Element> _ elements: () -> [Element])
```

Inserts an array of `elements` before the element with the specified `id`. `id`

### addFirst(_:)

```swift
func addFirst(@ArrayBuilder<Element> _ elements: () -> [Element])
```

Prepends an array of `elements`. `elements`

### addFirst(placement:_:)

```swift
func addFirst(placement: NavigationBar.ItemPlacement, @ArrayBuilder<any NavigationBar.Item> _ elements: () -> [Element])
```

Prepends an array of `elements` to a placement group. `placement`

### addLast(_:)

```swift
func addLast(@ArrayBuilder<Element> _ elements: () -> [Element])
```

Appends an array of `elements`. `elements`

### addLast(placement:_:)

```swift
func addLast(placement: NavigationBar.ItemPlacement, @ArrayBuilder<any NavigationBar.Item> _ elements: () -> [Element])
```

Appends an array of `elements` to a placement group. `placement`

### remove(id:)

```swift
func remove(id: EditorComponentID)
```

Removes the element with the specified `id`. `id`

### replace(id:_:)

```swift
func replace(id: EditorComponentID, @ArrayBuilder<Element> _ elements: () -> [Element])
```

Replaces the element with the specified `id` with an array of `elements`. `id`
