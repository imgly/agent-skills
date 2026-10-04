# SheetState

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.sheet`

```kotlin
@Stable
interface SheetState
```


## Members

### contentHeight

```kotlin
abstract val contentHeight: Int
```

The current height of the content in swipeable sheet.

### currentValue

```kotlin
abstract val currentValue: SheetValue
```

The current value of the SheetState.

### isAnimationRunning

```kotlin
abstract val isAnimationRunning: Boolean
```

Whether an animation is currently in progress.

### lastVelocity

```kotlin
abstract val lastVelocity: Float
```

The velocity of the last known animation. Gets reset to 0f when an animation completes successfully, but does not get reset when an animation gets interrupted. You can use this value to provide smooth reconciliation behavior when re-targeting an animation.

### maxOffset

```kotlin
abstract val maxOffset: Float
```

The maximum offset this state can reach. This will be the biggest anchor, or Float.POSITIVE_INFINITY if the anchors are not initialized yet.

### minOffset

```kotlin
abstract val minOffset: Float
```

The minimum offset this state can reach. This will be the smallest anchor, or Float.NEGATIVE_INFINITY if the anchors are not initialized yet.

### offset

```kotlin
abstract val offset: Float?
```

The current offset, or null if it has not been initialized yet. During the first composition, the offset will be null. In subsequent compositions, the offset will be derived from the anchors of the previous pass. Always prefer accessing the offset from a LaunchedEffect as it will be scheduled to be executed the next frame, after layout.

### progress

```kotlin
abstract val progress: Float?
```

The fraction of the progress going from minOffset to maxOffset, within 0f..1f bounds. The value is null if offset is null or if the anchors are not initialized yet.

### requireOffset

```kotlin
abstract fun requireOffset(): Float
```

Require the current offset.

### targetValue

```kotlin
abstract val targetValue: SheetValue
```

The target value. This is the closest value to the current offset (taking into account positional thresholds). If no interactions like animations or drags are in progress, this will be the current value.
