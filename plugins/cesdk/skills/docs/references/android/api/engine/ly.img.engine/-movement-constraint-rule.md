# MovementConstraintRule

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A movement constraint rule. The scope determines which blocks the rule applies to; overshoot is a non-negative fraction of the moved block's own size.

```kotlin
data class MovementConstraintRule(val overshoot: Float, val scope: MovementConstraintScope = MovementConstraintScope.Scene)
```


## Members

### MovementConstraintRule

```kotlin
constructor(overshoot: Float, scope: MovementConstraintScope = MovementConstraintScope.Scene)
```

### overshoot

```kotlin
val overshoot: Float
```

### scope

```kotlin
val scope: MovementConstraintScope
```
