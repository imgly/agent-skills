# ArrayBuilder

- **Module:** `IMGLYEditor`
- **DocC identifier:** `/documentation/IMGLYEditor/ArrayBuilder`

A result builder for building arrays.

```swift
@resultBuilder enum ArrayBuilder<Element>
```

## Members

### ArrayBuilder.Component

```swift
typealias Component = [Element]
```

The type of components.

### ArrayBuilder.Expression

```swift
typealias Expression = Element
```

The type of expressions.

### buildArray(_:)

```swift
static func buildArray(_ components: [ArrayBuilder<Element>.Component]) -> ArrayBuilder<Element>.Component
```

### buildBlock(_:)

```swift
static func buildBlock(_ components: ArrayBuilder<Element>.Component...) -> ArrayBuilder<Element>.Component
```

### buildEither(first:)

```swift
static func buildEither(first component: ArrayBuilder<Element>.Component) -> ArrayBuilder<Element>.Component
```

### buildEither(second:)

```swift
static func buildEither(second component: ArrayBuilder<Element>.Component) -> ArrayBuilder<Element>.Component
```

### buildExpression(_:)-4kogm

```swift
static func buildExpression(_ expression: ArrayBuilder<Element>.Expression) -> ArrayBuilder<Element>.Component
```

### buildExpression(_:)-8bbmw

```swift
static func buildExpression(_ expression: [ArrayBuilder<Element>.Expression]) -> ArrayBuilder<Element>.Component
```

### buildOptional(_:)

```swift
static func buildOptional(_ component: ArrayBuilder<Element>.Component?) -> ArrayBuilder<Element>.Component
```
