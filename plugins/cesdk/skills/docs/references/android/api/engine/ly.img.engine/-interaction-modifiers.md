# InteractionModifiers

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

The modifier keys that an interaction update applies, as held keys would during a pointer drag.

```kotlin
data class InteractionModifiers(val alt: Boolean = false, val command: Boolean = false, val control: Boolean = false)
```


## Members

### InteractionModifiers

```kotlin
constructor(alt: Boolean = false, command: Boolean = false, control: Boolean = false)
```

### alt

```kotlin
val alt: Boolean = false
```

### command

```kotlin
val command: Boolean = false
```

### control

```kotlin
val control: Boolean = false
```
