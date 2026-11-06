# TextFontUsage

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/TextFontUsage`

A current shaping snapshot with resource readiness and font provenance. This does not indicate framebuffer or export completion.

```swift
struct TextFontUsage
```

## Members

### init(state:text:runs:)

```swift
init(state: BlockState, text: String, runs: [TextFontUsageRun])
```

### runs

```swift
let runs: [TextFontUsageRun]
```

Font provenance runs. Empty text and pending snapshots have no runs.

### state

```swift
let state: BlockState
```

Resource readiness. Pending snapshots have no runs; error snapshots can include fallback runs.

### text

```swift
let text: String
```

Resolved text after case transformations and template substitutions. Run indices refer to UTF-16 code units in this string, rather than the editable `text/text` property.
