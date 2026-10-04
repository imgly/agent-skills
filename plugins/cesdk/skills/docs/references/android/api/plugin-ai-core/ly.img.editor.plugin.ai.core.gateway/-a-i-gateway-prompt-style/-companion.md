# Companion

- **Module:** `ly.img:plugin-ai-core`
- **Package:** `ly.img.editor.plugin.ai.core.gateway`

```kotlin
object Companion
```


## Members

### NONE_ID

```kotlin
const val NONE_ID: String
```

### curated

```kotlin
val curated: List<AIGatewayPromptStyle>
```

The 14-style set the showcase ships with. To customize, edit this array directly — each new style needs the three fields below, and a matching <id>.jpeg under assets/style_thumbnails/. Non-breaking hyphens (U+2011) inside the snippets keep compound words like cel‑shaded from splitting across model tokenisation.
