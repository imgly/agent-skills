> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Concepts](../concepts.md) > [Templating](./templating.md)

---

```kotlin file=@cesdk_android_examples/editor-guides-concepts-templating/TemplatingEditorSolution.kt reference-only
import android.util.Log
import android.widget.Toast
import androidx.compose.runtime.Composable
import androidx.compose.ui.platform.LocalContext
import androidx.core.net.toUri
import ly.img.editor.Editor
import ly.img.editor.core.configuration.EditorConfiguration
import ly.img.editor.core.configuration.remember
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine

@Composable
fun TemplatingEditorSolution(
    license: String? = null,
    onClose: (Throwable?) -> Unit,
) {
    val context = LocalContext.current
    Editor(
        license = license,
        baseUri = "file:///android_asset/".toUri(),
        configuration = {
            EditorConfiguration.remember {
                onCreate = {
                    val engine = editorContext.engine
                    loadPostcardTemplate(engine)

                    // Register the variables used by this tropical postcard template.
                    engine.variable.set(key = "first_name", value = "Alice")
                    engine.variable.set(key = "last_name", value = "Smith")
                    engine.variable.set(key = "city", value = "Paris")
                    engine.variable.set(key = "address", value = "10 Rue de Rivoli")

                    val variableNames = engine.variable.findAll()
                    Log.d("TemplatingGuide", "Registered scene variables: $variableNames")
                    Log.d(
                        "TemplatingGuide",
                        "Loaded tropical postcard template for ${engine.variable.get("first_name")} ${engine.variable.get("last_name")}",
                    )

                    val placeholderBlocks = engine.block.findAllPlaceholders()
                    Log.d("TemplatingGuide", "Template placeholders: ${placeholderBlocks.size}")
                    placeholderBlocks.forEach { placeholder ->
                        if (engine.block.supportsPlaceholderControls(placeholder)) {
                            engine.block.setPlaceholderControlsOverlayEnabled(placeholder, enabled = true)
                            engine.block.setPlaceholderControlsButtonEnabled(placeholder, enabled = true)
                        }
                    }
                }
                onError = { throwable ->
                    Toast.makeText(context, throwable.message, Toast.LENGTH_SHORT).show()
                }
            }
        },
        onClose = onClose,
    )
}

private suspend fun loadPostcardTemplate(engine: Engine) {
    engine.scene.load(
        sceneUri = "https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene".toUri(),
        waitForResources = true,
    )
}

private suspend fun applyPostcardTemplate(engine: Engine) {
    val scene = engine.scene.get() ?: engine.scene.create()
    if (engine.scene.getPages().isEmpty()) {
        val page = engine.block.create(DesignBlockType.Page)
        engine.block.setWidth(block = page, value = 1080F)
        engine.block.setHeight(block = page, value = 1080F)
        engine.block.appendChild(parent = scene, child = page)
    }

    engine.scene.applyTemplate(
        templateUri = "https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene".toUri(),
    )
}
```

Templates transform static designs into dynamic, data-driven content. They combine reusable layouts with variable text and placeholder media, enabling personalization at scale.

> **Reading time:** 5 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260904/editor-guides-concepts-templating)

<EngineReferenceNote {...props} />

A template is a regular CE.SDK scene that contains **variable tokens** in text and **placeholder blocks** for media. When you load a template, you can populate the variables with data and swap placeholder content without rebuilding the underlying layout.

The runnable Android sample loads the hosted `cesdk_postcard_2.scene` tropical postcard template, preserves the asset's authored framing, registers the postcard's known recipient variables, and exposes the template's existing placeholder regions. In the verified editor run, the template opens centered on its hero image area while the personalization contract is demonstrated through the registered scene variables and placeholder controls. For implementation details, see the guides linked in each section.

## What Makes a Template

Any CE.SDK scene can become a template by adding dynamic elements:

| Element | Purpose | Example |
|---------|---------|---------|
| **Variables** | Dynamic text replacement | `Hello, {{first_name}}!` |
| **Placeholders** | Swappable media slots | Profile photo, product image |
| **Editing Constraints** | Protected design elements | Locked logo, fixed layout |

Templates separate **design** (created once by designers) from **content** (populated at runtime with data). This enables workflows like batch generation, form-based customization, and user personalization.

## Variables

Variables enable dynamic text without modifying the design structure. In the sample, the loaded tropical postcard template already contains tokens such as `{{first_name}}`, `{{last_name}}`, `{{city}}`, and `{{address}}`, and the Android app registers values for those keys after loading the template.

```kotlin highlight-android-set-variables
// Register the variables used by this tropical postcard template.
engine.variable.set(key = "first_name", value = "Alice")
engine.variable.set(key = "last_name", value = "Smith")
engine.variable.set(key = "city", value = "Paris")
engine.variable.set(key = "address", value = "10 Rue de Rivoli")
```

```kotlin highlight-android-discover-variables
val variableNames = engine.variable.findAll()
```

**How variables work:**

- Register known template variables with `engine.variable.set(key = "first_name", value = "Alice")`
- Reference them in text blocks with tokens such as `{{first_name}}`, `{{city}}`, and `{{address}}`
- Use `engine.variable.findAll()` to enumerate the variables currently stored on the active scene
- CE.SDK stores the variable values on the scene so matching template tokens can resolve during rendering and export
- Tokens are case-sensitive; unmatched tokens render as literal text

Variables are scene-scoped and persist when you save the template. On Android, `engine.variable.findAll()` does not inspect the loaded template file for token names. Treat the token names used by your template as part of your scene contract, then use `findAll()` to confirm which values are currently registered on the scene.

[Learn more about text variables →](../create-templates/add-dynamic-content/text-variables.md)

## Placeholders

Placeholders mark blocks as content slots that users or automation can replace. When you mark an image block as a placeholder, it becomes a designated swap target inside the editor.

```kotlin highlight-android-discover-placeholders
val placeholderBlocks = engine.block.findAllPlaceholders()
```

**How placeholders work:**

- Mark swappable content with `engine.block.setPlaceholderEnabled(block, enabled = true)`
- Enable overlay or button affordances for supported blocks with `setPlaceholderControlsOverlayEnabled()` and `setPlaceholderControlsButtonEnabled()`
- Let adopters swap images or other media without changing the rest of the design

Use `engine.block.findAllPlaceholders()` to enumerate the blocks currently marked as placeholders. The sample loads a postcard template that already contains multiple placeholder-enabled regions, then enables the overlay controls for each supported block.

[Learn more about placeholders →](../create-templates/add-dynamic-content/placeholders.md)

## Template Workflows

Templates support several common workflows:

### Form-Based Customization

Load a template, collect form input for variables, and let users personalize text while the design stays consistent. Placeholder blocks give them controlled media replacement instead of unrestricted editing.

### Batch Generation

Load a template programmatically, iterate through data records, set variables for each record, and export personalized designs. This powers certificates, badges, postcards, and personalized marketing.

### Design Systems

Create template libraries where designers maintain approved layouts and end users customize within defined boundaries using variables and placeholders.

## Loading and Applying Templates

**Load a template** with `engine.scene.load(sceneUri = ...)` to replace the current scene entirely:

```kotlin highlight-android-load-template
engine.scene.load(
    sceneUri = "https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene".toUri(),
    waitForResources = true,
)
```

`sceneUri` can point to a CDN resource, a local file, or another Android `Uri` that resolves to a scene file. The runnable sample uses this exact flow with the hosted `cesdk_postcard_2.scene` postcard template and keeps the template's authored framing so the guide opens on the same tropical postcard asset every time.

**Apply a template** with `engine.scene.applyTemplate(templateUri = ...)` to merge template content into an existing scene while preserving the current design unit and page dimensions:

```kotlin highlight-android-apply-template
engine.scene.applyTemplate(
    templateUri = "https://cdn.img.ly/assets/demo/v3/ly.img.template/templates/cesdk_postcard_2.scene".toUri(),
)
```

Learn more about importing templates with [Import Templates](../create-templates/import.md).

## Creating Templates

Build templates by adding variable tokens to text blocks and marking media blocks as placeholders. Save the finished scene with `engine.scene.saveToString(scene = scene)` or `engine.scene.saveToArchive(scene = scene)` so it can be loaded again later.

[Learn more about creating templates →](../create-templates/from-scratch.md)

## Next Steps

- [Text Variables](../create-templates/add-dynamic-content/text-variables.md) — Define, inspect, and populate text variables in Android templates.
- [Placeholders](../create-templates/add-dynamic-content/placeholders.md) — Mark swappable content slots and expose replacement controls.
- [Create Templates From Scratch](../create-templates/from-scratch.md) — Build reusable template scenes programmatically and save them for reuse.
- [Import Templates](../create-templates/import.md) — Load and import design templates into CE.SDK from URLs, archives, and serialized strings.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support