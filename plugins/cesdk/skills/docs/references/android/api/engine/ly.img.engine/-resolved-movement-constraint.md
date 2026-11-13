# ResolvedMovementConstraint

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The effective movement constraint for a block, returned by EditorApi.getMovementConstraint. null is returned when the block is unconstrained.

```kotlin
data class ResolvedMovementConstraint(val overshoot: Float)
```


## Members

### ResolvedMovementConstraint

```kotlin
constructor(overshoot: Float)
```

### overshoot

```kotlin
val overshoot: Float
```
