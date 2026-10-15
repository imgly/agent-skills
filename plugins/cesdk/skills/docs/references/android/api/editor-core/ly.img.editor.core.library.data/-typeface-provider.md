# TypefaceProvider

- **Module:** `ly.img:editor-core`
- **Package:** `ly.img.editor.core.library.data`

```kotlin
class TypefaceProvider
```


## Members

### TypefaceProvider

```kotlin
constructor()
```

### provideTypeface

```kotlin
suspend fun provideTypeface(engine: Engine, name: String): Typeface?
```

A helper function for receiving Typeface payload of typeface asset that was previously added in AssetSourceType.Typeface asset source.
