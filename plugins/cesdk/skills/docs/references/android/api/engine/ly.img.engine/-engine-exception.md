# EngineException

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Structured engine error surfaced from the native side. The structured fields (code, category, hint, docsUrl, args, silent) are populated from the engine's error catalog. Every engine error carries a stable, non-empty code; as a defensive measure code may be empty — treat it the same as any other unrecognized code rather than crashing on it.

```kotlin
open class EngineException(message: String, val code: String = "", val category: String = "", val hint: String = "", docs: String = "", val args: Map<String, Any> = emptyMap(), val silent: Boolean = false) : RuntimeException
```


## Members

### EngineException

```kotlin
constructor(message: String, code: String = "", category: String = "", hint: String = "", docs: String = "", args: Map<String, Any> = emptyMap(), silent: Boolean = false)
```

### args

```kotlin
val args: Map<String, Any>
```

Typed template arguments. Values are Boolean, Long, Double, or String (preserved across the JNI boundary).

### category

```kotlin
val category: String
```

Category prefix derived from code (e.g. "SCENE"). Empty when code is empty.

### code

```kotlin
val code: String
```

Stable catalog id (e.g. "SCENE.NOT_VALID"). Empty only as a defensive fallback.

### docsUrl

```kotlin
val docsUrl: String?
```

Fully-qualified docs URL using the Android docs base, e.g. https://img.ly/docs/cesdk/android/user-interface/font-size-d194d1/. null when docs is empty.

### hint

```kotlin
val hint: String
```

English developer-facing "what to do next" hint, already interpolated. Empty when none.

### silent

```kotlin
val silent: Boolean = false
```

Catalog silent flag — expected platform limitation that should not be logged.
