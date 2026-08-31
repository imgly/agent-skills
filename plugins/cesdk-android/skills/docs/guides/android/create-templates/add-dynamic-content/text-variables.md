> This is one page of the CE.SDK Android documentation. For a complete overview, see the [Android Documentation Index](https://img.ly/docs/cesdk/android/). For all docs in one file, see [llms-full.txt](https://img.ly/docs/cesdk/android/llms-full.txt).

**Navigation:** [Guides](../../guides.md) > [Create and Use Templates](../../create-templates.md) > [Dynamic Content](../add-dynamic-content.md) > [Text Variables](./text-variables.md)

---

```kotlin file=@cesdk_android_examples/engine-guides-text-variables/TextVariables.kt reference-only
import ly.img.engine.Color
import ly.img.engine.DesignBlockType
import ly.img.engine.Engine
import ly.img.engine.MimeType
import ly.img.engine.SizeMode

suspend fun textVariables(engine: Engine): TextVariablesResult {
    val sampleKeys = listOf("firstName", "lastName")
    sampleKeys.forEach { key ->
        if (engine.variable.findAll().contains(key)) {
            engine.variable.remove(key)
        }
    }

    val scene = engine.scene.create()
    val page = engine.block.create(DesignBlockType.Page)
    engine.block.setWidth(page, value = 800F)
    engine.block.setHeight(page, value = 400F)
    engine.block.appendChild(parent = scene, child = page)

    val textBlock = engine.block.create(DesignBlockType.Text)
    engine.block.replaceText(
        block = textBlock,
        text = "Certificate for {{firstName}} {{lastName}}",
    )
    engine.block.setPositionX(textBlock, value = 120F)
    engine.block.setPositionY(textBlock, value = 164F)
    engine.block.setWidth(textBlock, value = 560F)
    engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
    engine.block.setTextFontSize(textBlock, fontSize = 42F)
    engine.block.setTextColor(textBlock, color = Color.fromHex("#FF14171F"))
    engine.block.appendChild(parent = page, child = textBlock)

    val recipientData = mapOf(
        "firstName" to "Alex",
        "lastName" to "Smith",
    )

    recipientData.forEach { (key, value) ->
        engine.variable.set(key = key, value = value)
    }

    val variableNames = engine.variable.findAll().sorted()

    val firstName = engine.variable.get(key = "firstName")

    val hasVariableReferences = engine.block.referencesAnyVariables(textBlock)

    val tokenRegex = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
    val tokenKeys = engine.block.findByType(DesignBlockType.Text)
        .flatMap { block ->
            tokenRegex.findAll(engine.block.getString(block, property = "text/text"))
                .map { match -> match.groupValues[1].trim() }
                .toList()
        }
        .distinct()

    val pagePngData = engine.block.export(page, mimeType = MimeType.PNG)

    engine.variable.remove(key = "lastName")
    val remainingVariableNames = engine.variable.findAll().sorted()

    val result = TextVariablesResult(
        variablesAfterUpdate = variableNames,
        firstName = firstName,
        hasVariableReferences = hasVariableReferences,
        tokenKeys = tokenKeys,
        variablesAfterRemoval = remainingVariableNames,
        templateText = engine.block.getString(textBlock, property = "text/text"),
        templateTextBlockIsAttached = engine.block.getParent(textBlock) == page,
        pagePngData = pagePngData,
    )

    engine.variable.remove(key = "firstName")

    return result
}
```

```kotlin file=@cesdk_android_examples/engine-guides-text-variables/TextVariablesResult.kt reference-only
import java.nio.ByteBuffer

data class TextVariablesResult(
    val variablesAfterUpdate: List<String>,
    val firstName: String,
    val hasVariableReferences: Boolean,
    val tokenKeys: List<String>,
    val variablesAfterRemoval: List<String>,
    val templateText: String,
    val templateTextBlockIsAttached: Boolean,
    val pagePngData: ByteBuffer,
)
```

Create reusable Android templates whose text content is populated from data at runtime.

> **Reading time:** 7 minutes
>
> **Resources:**
>
> - [View source on GitHub](https://github.com/imgly/cesdk-android-examples/tree/v1.83.0-nightly.20260831/engine-guides-text-variables)

<EngineReferenceNote {...props} />

Text variables separate a design's text layout from the values your app supplies. Put tokens such as `{{firstName}}` into text blocks, then update the variable store with matching keys before preview or export.

This guide focuses on the Android CreativeEngine APIs for creating tokenized text, setting values, reading them back, and validating which blocks still reference variables.

## Variables and Tokens

Tokens and variables are related, but they are not the same thing. A token is the `{{key}}` placeholder written into a text block, while a variable is the key-value entry stored on the engine.

Tokens do not automatically create variable entries. Use `engine.variable.set()` to seed the store before you expect a token to resolve.

## Binding Tokens to Text Blocks

Use the same text editing APIs you already use for normal text blocks. The token syntax can appear on its own or inside a longer string. Add the text block to the page that belongs to your template scene so it becomes visible and exportable content.

```kotlin highlight-android-bind-tokens
val textBlock = engine.block.create(DesignBlockType.Text)
engine.block.replaceText(
    block = textBlock,
    text = "Certificate for {{firstName}} {{lastName}}",
)
engine.block.setPositionX(textBlock, value = 120F)
engine.block.setPositionY(textBlock, value = 164F)
engine.block.setWidth(textBlock, value = 560F)
engine.block.setHeightMode(textBlock, mode = SizeMode.AUTO)
engine.block.setTextFontSize(textBlock, fontSize = 42F)
engine.block.setTextColor(textBlock, color = Color.fromHex("#FF14171F"))
engine.block.appendChild(parent = page, child = textBlock)
```

The stored text remains the template string. When the engine renders the block, matching variable values replace the token positions.

## Setting Variable Values

Populate the variable store with `engine.variable.set()`. Calling `set()` for an existing key updates the value, so the same template can be reused for multiple data records.

```kotlin highlight-android-set-values
    val recipientData = mapOf(
        "firstName" to "Alex",
        "lastName" to "Smith",
    )

    recipientData.forEach { (key, value) ->
        engine.variable.set(key = key, value = value)
    }
```

Variable keys are case-sensitive. Keep the key names in your data model and text tokens identical.

## Discovering Variables

Use `engine.variable.findAll()` to list the keys currently stored on the engine. This reports variables that have been set, not every token that appears in text.

```kotlin highlight-android-discover-variables
val variableNames = engine.variable.findAll().sorted()
```

Use this for values you set in the current engine session. If you load a saved scene and need variables stored with that scene, pass `overrideEditorConfig = true` to `engine.scene.load(...)`; the default load options do not restore persisted editor configuration variables.

## Reading Variable Values

Read an existing value with `engine.variable.get()`. Call it after you know the key exists, for example from your own data model or from `findAll()`.

```kotlin highlight-android-read-variable
val firstName = engine.variable.get(key = "firstName")
```

If a key is missing, the engine reports an error instead of returning an empty string.

## Detecting Variable References

Use `engine.block.referencesAnyVariables()` to check whether a text block contains any `{{...}}` tokens.

```kotlin highlight-android-detect-references
val hasVariableReferences = engine.block.referencesAnyVariables(textBlock)
```

The check applies to the block you pass in. If you need to validate a whole scene, iterate over text blocks and check each one.

## Scanning Token Names

Because `findAll()` lists stored variables only, scan text block content when you need to discover token names that have not been seeded yet.

```kotlin highlight-android-scan-tokens
val tokenRegex = Regex("""\{\{\s*([^{}]+?)\s*\}\}""")
val tokenKeys = engine.block.findByType(DesignBlockType.Text)
    .flatMap { block ->
        tokenRegex.findAll(engine.block.getString(block, property = "text/text"))
            .map { match -> match.groupValues[1].trim() }
            .toList()
    }
    .distinct()
```

The example reads the `text/text` property from each text block and extracts the tokens used in this guide, `firstName` and `lastName`. The regex scans the text between `{{` and `}}`, so it also handles names such as `user.name`, `campaign-id`, or `full_name`.

## Removing Variables

Remove a variable with `engine.variable.remove()` when it is no longer part of the current scene or data record.

```kotlin highlight-android-remove-variable
engine.variable.remove(key = "lastName")
val remainingVariableNames = engine.variable.findAll().sorted()
```

Removing a variable does not remove tokens from text blocks. If a block still contains `{{lastName}}`, that token remains in the template text until you change the text content or set the variable again.

## API Reference

| Method | Purpose |
|--------|---------|
| `engine.block.create(blockType=DesignBlockType.Text)` | Create a text block for tokenized copy |
| `engine.block.replaceText(block=_, text=_)` | Replace text content, including `{{key}}` tokens |
| `engine.block.setPositionX(block=_, value=_)` | Set the text block's horizontal position on the template page |
| `engine.block.setPositionY(block=_, value=_)` | Set the text block's vertical position on the template page |
| `engine.block.setWidth(block=_, value=_)` | Set the text block width inside the template page |
| `engine.block.setHeightMode(block=_, mode=_)` | Let the text block height adapt to the inserted copy |
| `engine.block.setTextFontSize(block=_, fontSize=_)` | Set the text block font size |
| `engine.block.setTextColor(block=_, color=_)` | Set the text block color |
| `engine.block.appendChild(parent=_, child=_)` | Attach the tokenized text block to the template page |
| `engine.variable.set(key=_, value=_)` | Create or update a text variable value |
| `engine.variable.findAll()` | List variable keys currently stored on the engine |
| `engine.variable.get(key=_)` | Read an existing variable value |
| `engine.block.referencesAnyVariables(block=_)` | Check whether one block contains variable tokens |
| `engine.block.findByType(type=DesignBlockType.Text)` | Find text blocks for scene-level validation |
| `engine.block.getString(block=_, property="text/text")` | Read a text block's stored template string |
| `engine.variable.remove(key=_)` | Remove an existing variable value |

## Troubleshooting

**A token appears in the output**: Confirm the token name exactly matches a key passed to `engine.variable.set()`, including case.

**`findAll()` returns fewer names than expected**: `findAll()` lists stored variables only. It does not scan text blocks for tokens.

**`get()` fails for a variable**: Check that the key exists before reading it. You can seed optional variables with an empty string when you want unresolved text to disappear.

**`referencesAnyVariables()` returns `false`**: Pass the actual text block. The method does not inspect children of a parent block.

## Next Steps

- [Placeholders](./placeholders.md) — Mark editable media or text areas inside locked template layouts.
- [Form-Based Editing](./form-based-editing.md) — Build custom form interfaces for template customization using CE.SDK variables and placeholders
- [Automate Design Generation](../../automation/design-generation.md) — Generate on-brand designs programmatically using templates, variables, and CE.SDK’s headless API.
- [Data Merge](../../automation/data-merge.md) — Merge external records into templates with variables and named placeholder blocks.
- [Templating](../../concepts/templating.md) — Understand reusable scene templates with dynamic text and placeholder media.



---

## More Resources

- **[Android Documentation Index](https://img.ly/docs/cesdk/android/)** - Browse all Android documentation
- **[Complete Documentation](https://img.ly/docs/cesdk/android/llms-full.txt)** - Full documentation in one file (for LLMs)
- **[Web Documentation](https://img.ly/docs/cesdk/android/)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support