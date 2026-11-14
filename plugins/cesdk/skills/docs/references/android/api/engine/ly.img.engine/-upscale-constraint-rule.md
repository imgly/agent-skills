# UpscaleConstraintRule

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

An upscale constraint rule. The scope determines which blocks the rule applies to; maxUpscale is the largest ratio of output pixels to source pixels, a finite number greater than 0.

```kotlin
data class UpscaleConstraintRule(val maxUpscale: Float, val scope: UpscaleConstraintScope = UpscaleConstraintScope.Scene)
```


## Members

### UpscaleConstraintRule

```kotlin
constructor(maxUpscale: Float, scope: UpscaleConstraintScope = UpscaleConstraintScope.Scene)
```

### maxUpscale

```kotlin
val maxUpscale: Float
```

### scope

```kotlin
val scope: UpscaleConstraintScope
```
