# Asset

- **Module:** `ly.img:engine`
- **Package:** `ly.img.engine`

Single asset result of a findAssets query.

```kotlin
data class Asset(val id: String, val context: AssetContext?, val label: String? = null, val locale: String? = null, val tags: List<String>? = null, val groups: List<String>? = null, val active: Boolean = false, val meta: Map<String, String>? = null, val payload: AssetPayload = AssetPayload(), val credits: AssetCredits? = null, val license: AssetLicense? = null, val utm: AssetUTM? = null)
```


## Members

### Asset

```kotlin
constructor(id: String, context: AssetContext?, label: String? = null, locale: String? = null, tags: List<String>? = null, groups: List<String>? = null, active: Boolean = false, meta: Map<String, String>? = null, payload: AssetPayload = AssetPayload(), credits: AssetCredits? = null, license: AssetLicense? = null, utm: AssetUTM? = null)
```

### active

```kotlin
val active: Boolean = false
```

If the asset is marked as active.

### context

```kotlin
val context: AssetContext?
```

Context on how an asset was added and shall be used.

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
val label: String? = null
```

The label of the asset. Used for description and tooltips.

### license

```kotlin
val license: AssetLicense? = null
```

License for the asset. Overrides the asset source license if present.

### locale

```kotlin
val locale: String? = null
```

The locale of the label and tags.

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
val tags: List<String>? = null
```

The tags of the asset. Used for filtering by tag and free-text search.

### utm

```kotlin
val utm: AssetUTM? = null
```

UTM parameters for the links inside the credits.
