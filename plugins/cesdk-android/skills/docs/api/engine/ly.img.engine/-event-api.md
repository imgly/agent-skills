# EventApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface EventApi
```


## Members

### subscribe

```kotlin
abstract fun subscribe(blocks: List<DesignBlock> = emptyList()): Flow<List<DesignBlockEvent>>
```

Subscribe to block life-cycle events
