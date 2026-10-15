# nonNil(_:file:function:line:)

- **Module:** `IMGLYCoreUI`
- **DocC identifier:** `/documentation/IMGLYCoreUI/nonNil(_:file:function:line:)`

Unwraps an optional and throws if it was `nil`. `value`

```swift
func nonNil<T>(_ value: T?, file: StaticString = #file, function: String = #function, line: UInt = #line) throws -> T
```
