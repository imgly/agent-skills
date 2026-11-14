# UpscaleConstraintRule

- **Module:** `IMGLYEngine`
- **DocC identifier:** `/documentation/IMGLYEngine/UpscaleConstraintRule`

An upscale constraint rule. The `scope` determines which blocks the rule applies to; `maxUpscale` is the largest ratio of output pixels to source pixels, a finite number greater than 0.

```swift
struct UpscaleConstraintRule
```

## Members

### init(maxUpscale:scope:)

```swift
init(maxUpscale: Float, scope: UpscaleConstraintScope = .scene)
```

### maxUpscale

```swift
let maxUpscale: Float
```

The largest ratio of the output pixels that the image covers to the pixels of its largest source.

### scope

```swift
let scope: UpscaleConstraintScope
```

The scope this rule applies to.
