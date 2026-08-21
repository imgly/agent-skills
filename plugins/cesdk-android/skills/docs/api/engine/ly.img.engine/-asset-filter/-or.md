# Or

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Matches if at least one of the filters matches. Must not be empty.

```kotlin
data class Or(val filters: List<AssetFilter>) : AssetFilter
```


## Members

### Or

```kotlin
constructor(filters: List<AssetFilter>)
```

### filters

```kotlin
val filters: List<AssetFilter>
```
