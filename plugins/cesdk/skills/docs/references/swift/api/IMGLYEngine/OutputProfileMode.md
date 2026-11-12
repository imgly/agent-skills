# OutputProfileMode

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/OutputProfileMode`

What a PDF export does with the document’s Output profile. See `ExportOptions.outputProfileMode`.

```swift
@objc enum OutputProfileMode
```

## Members

### init(rawValue:)

```swift
init?(rawValue: Int32)
```

### OutputProfileMode.assign

```swift
case assign
```

Keep the colors in the space of the Output profile and convert the others. `embedProfiles` labels them.

### OutputProfileMode.convert

```swift
case convert
```

Convert every color into the Output profile.

### OutputProfileMode.off

```swift
case off
```

Write the colors as they are.
