# VariableType

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/VariableType`

The value type of a variable. One name holds one type.

```swift
@objc enum VariableType
```

## Members

### init(rawValue:)

```swift
init?(rawValue: _ObjCRawEnum)
```

### VariableType.color

```swift
case color
```

A color variable.

### VariableType.image

```swift
case image
```

An image variable that holds a URL.

### VariableType.number

```swift
case number
```

A number variable.

### VariableType.string

```swift
case string
```

A text variable, used in text templates.

### VariableType.typeface

```swift
case typeface
```

A typeface variable.
