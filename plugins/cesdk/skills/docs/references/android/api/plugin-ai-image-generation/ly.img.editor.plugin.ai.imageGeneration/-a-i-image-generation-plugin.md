# AIImageGenerationPlugin

- **Module:** `ly.img:plugin-ai-image-generation`
- **Package:** `ly.img.editor.plugin.ai.imageGeneration`

Plugin for image generation using AI. This plugin adds dedicated buttons both to the Dock and the InspectorBar.

```kotlin
open class AIImageGenerationPlugin : EditorConfigurationBuilder
```


## Members

### AIImageGenerationPlugin

```kotlin
constructor()
```

### aiGatewayConfig

```kotlin
var aiGatewayConfig: AIGatewayConfig?
```

The gateway config to IMG.LY AI features.

### dockModifier

```kotlin
var dockModifier: HorizontalListBuilderModify<EditorComponent<*>>.(AIGatewayConfig) -> Unit
```

The Dock modifier in order to place the Dock.Button.rememberAIImageGeneration button. By default, it is prepended to the dock.

### dock

```kotlin
open override var dock: ScopedProperty<EditorScope, EditorComponent<*>?>?
```

### inspectorBarModifier

```kotlin
var inspectorBarModifier: HorizontalListBuilderModify<EditorComponent<*>>.(AIGatewayConfig) -> Unit
```

The InspectorBar modifier in order to place the InspectorBar.Button.rememberAIImageGeneration button. By default, it is prepended to the inspector bar.

### inspectorBar

```kotlin
open override var inspectorBar: ScopedProperty<EditorScope, EditorComponent<*>?>?
```
