# VariableBinding

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

A block property that is bound to a variable.

```kotlin
data class VariableBinding(val block: DesignBlock, val property: String, val variable: String)
```


## Members

### VariableBinding

```kotlin
constructor(block: DesignBlock, property: String, variable: String)
```

### block

```kotlin
val block: DesignBlock
```

The block that has the bound property.

### property

```kotlin
val property: String
```

The property path, for example "position/x".

### variable

```kotlin
val variable: String
```

The key of the variable.
