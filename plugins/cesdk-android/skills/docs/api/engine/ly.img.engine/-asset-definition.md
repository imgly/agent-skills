# AssetDefinition

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

```kotlin
data class AssetDefinition(val id: String, val label: Map<String, String>? = null, val tags: Map<String, List<String>>? = null, val groups: List<String>? = null, val meta: Map<String, String>? = null, val payload: AssetPayload = AssetPayload(), val credits: AssetCredits? = null, val license: AssetLicense? = null, val utm: AssetUTM? = null)
```


## Members

### AssetDefinition

```kotlin
constructor(id: String, label: Map<String, String>? = null, tags: Map<String, List<String>>? = null, groups: List<String>? = null, meta: Map<String, String>? = null, payload: AssetPayload = AssetPayload(), credits: AssetCredits? = null, license: AssetLicense? = null, utm: AssetUTM? = null)
```

### credits

```kotlin
val credits: AssetCredits? = null
```

Credits for the creator of the asset.

### groups

```kotlin
val groups: List<String>? = null
```

Groups of the asset.

### id

```kotlin
val id: String
```

Uniquely identifying asset ID.

### label

```kotlin
val label: Map<String, String>? = null
```

Localized label mapping of the asset where key is the locale. Used for description and tooltips.

### license

```kotlin
val license: AssetLicense? = null
```

License for the asset. Overrides the asset source license if present.

### meta

```kotlin
val meta: Map<String, String>? = null
```

Asset-specific and custom meta information.

### payload

```kotlin
val payload: AssetPayload
```

Structured information about the contained asset.

### tags

```kotlin
val tags: Map<String, List<String>>? = null
```

Localized tags mapping of the asset where key is the locale. Used for filtering by tag and free-text search.

### utm

```kotlin
val utm: AssetUTM? = null
```

UTM parameters for the links inside the credits.
