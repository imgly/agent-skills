# SandboxState

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

How a script settled.

```kotlin
enum SandboxState : Enum<SandboxState>
```


## Members

### Fulfilled

```kotlin
enum entry Fulfilled
```

### Pending

```kotlin
enum entry Pending
```

### Rejected

```kotlin
enum entry Rejected
```

### entries

```kotlin
val entries: EnumEntries<SandboxState>
```

Returns a representation of an immutable list of all enum entries, in the order they're declared. This method may be used to iterate over the enum entries.

### valueOf

```kotlin
fun valueOf(value: String): SandboxState
```

Returns the enum constant of this type with the specified name. The string must match exactly an identifier used to declare an enum constant in this type. (Extraneous whitespace characters are not permitted.)

### values

```kotlin
fun values(): Array<SandboxState>
```

Returns an array containing the constants of this enum type, in the order they're declared. This method may be used to iterate over the constants.
