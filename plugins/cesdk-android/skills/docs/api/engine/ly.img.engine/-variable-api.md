# VariableApi

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
interface VariableApi
```


## Members

### findAll

```kotlin
abstract fun findAll(): List<String>
```

Get all text variables currently stored in the engine.

### get

```kotlin
abstract fun get(key: String): String
```

Get a text variable.

### remove

```kotlin
abstract fun remove(key: String)
```

Destroy a text variable.

### set

```kotlin
abstract fun set(key: String, value: String)
```

Set a text variable.
