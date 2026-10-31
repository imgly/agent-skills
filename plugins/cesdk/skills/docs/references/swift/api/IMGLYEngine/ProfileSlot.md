# ProfileSlot

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/ProfileSlot`

One document profile, selected by role and component space.

```swift
struct ProfileSlot
```

## Members

### init(role:space:)

```swift
init(role: ProfileRole, space: ProfileColorSpace)
```

Creates a slot with an explicit role and component space.

### role

```swift
let role: ProfileRole
```

The purpose of the profile.

### space

```swift
let space: ProfileColorSpace
```

The component space of the profile.
