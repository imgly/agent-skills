# SandboxPolicy

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/SandboxPolicy`

Which engine methods and host functions a script can reach. A rule names a method by its full path, which starts with `imgly.engine`: `imgly.engine.block.setString` matches one method, `imgly.engine.block.*` a group, and `*` everything. A shortened rule such as `block.destroy` matches nothing. A host function is named `<specifier>.<name>`. `deny` wins over `allow`. An empty `allow` keeps the default policy. The rule `@default` keeps the default policy and adds the other rules to it, as in `["@default", "imgly/app"]`.

```swift
struct SandboxPolicy
```

## Members

### allow

```swift
var allow: [String]
```

### deny

```swift
var deny: [String]
```

### init(allow:deny:)

```swift
init(allow: [String] = [], deny: [String] = [])
```
