# AIGatewayPromptStyle

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

A style preset that steers AI content generation via prompt engineering. No gateway model exposes a native style parameter in its schema today, so the showcase applies styles client-side by appending promptSnippet to the user's prompt before sending the request to gateway.img.ly.

```kotlin
data class AIGatewayPromptStyle(val id: String, val displayName: String, val promptSnippet: String)
```


## Members

### AIGatewayPromptStyle

```kotlin
constructor(id: String, displayName: String, promptSnippet: String)
```

### displayName

```kotlin
val displayName: String
```

### id

```kotlin
val id: String
```

### promptSnippet

```kotlin
val promptSnippet: String
```

### thumbnailAssetUri

```kotlin
val thumbnailAssetUri: String
```

Coil-compatible URI pointing at the bundled JPEG in assets/style_thumbnails/. Empty for the "none" entry (the picker treats empty as a no-style placeholder).
