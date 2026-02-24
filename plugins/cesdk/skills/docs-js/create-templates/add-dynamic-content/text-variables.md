> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Insert Dynamic Content](./create-templates/add-dynamic-content.md) > [Text Variables](./create-templates/add-dynamic-content/text-variables.md)

---

Text variables enable data-driven template personalization in CE.SDK. Insert
placeholder tokens like `{{ firstName }}` into text blocks, then populate them
with actual values programmatically. This separates design from content,
enabling automated document generation, batch processing, and mass
personalization workflows.

![Text Variables example showing personalized text with dynamic data](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-text-variables-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-dynamic-content-text-variables-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-dynamic-content-text-variables-browser/)

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-text-variables-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';

import {
  BlurAssetSource,
  ColorPaletteAssetSource,
  CropPresetsAssetSource,
  DemoAssetSources,
  EffectsAssetSource,
  FiltersAssetSource,
  PagePresetsAssetSource,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
import { DesignEditorConfig } from './design-editor/plugin';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Text Variables Guide
 *
 * Demonstrates text variable management in CE.SDK with a single comprehensive example:
 * - Discovering variables with findAll()
 * - Creating and updating variables with setString()
 * - Reading variable values with getString()
 * - Binding variables to text blocks with {{variable}} tokens
 * - Detecting variable references with referencesAnyVariables()
 * - Removing variables with remove()
 * - Localizing variable labels
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }
    await cesdk.addPlugin(new DesignEditorConfig());

    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(new UploadAssetSources({ include: ['ly.img.image.upload'] }));
    await cesdk.addPlugin(
      new DemoAssetSources({
        include: [
          'ly.img.templates.blank.*',
          'ly.img.templates.presentation.*',
          'ly.img.templates.print.*',
          'ly.img.templates.social.*',
          'ly.img.image.*'
        ]
      })
    );
    await cesdk.addPlugin(new EffectsAssetSource());
    await cesdk.addPlugin(new FiltersAssetSource());
    await cesdk.addPlugin(new PagePresetsAssetSource());
    await cesdk.addPlugin(new StickerAssetSource());
    await cesdk.addPlugin(new TextAssetSource());
    await cesdk.addPlugin(new TextComponentAssetSource());
    await cesdk.addPlugin(new TypefaceAssetSource());
    await cesdk.addPlugin(new VectorShapeAssetSource());

    await cesdk.actions.run('scene.create', {
      page: { width: 800, height: 600, unit: 'Pixel' }
    });

    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    const pageWidth = engine.block.getWidth(page);
    const pageHeight = engine.block.getHeight(page);

    // Localize variable labels that appear in the Variables panel UI
    cesdk.i18n.setTranslations({
      en: {
        'variables.firstName.label': 'First Name',
        'variables.lastName.label': 'Last Name',
        'variables.email.label': 'Email Address',
        'variables.company.label': 'Company Name',
        'variables.title.label': 'Job Title'
      }
    });

    // Pattern 1: Discover all existing variables in the scene
    // This is useful when loading templates to see what variables need values
    const existingVariables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log('Existing variables:', existingVariables); // []

    // Pattern 2: Create and update text variables
    // If a variable doesn't exist, setString() creates it
    // If it already exists, setString() updates its value
    engine.variable.setString('firstName', 'Alex');
    engine.variable.setString('lastName', 'Smith');
    engine.variable.setString('email', 'alex.smith@example.com');
    engine.variable.setString('company', 'IMG.LY');
    engine.variable.setString('title', 'Creative Developer');

    // Pattern 3: Read variable values at runtime
    const firstName = engine.variable.getString('firstName');
    // eslint-disable-next-line no-console
    console.log('First name variable:', firstName); // 'Alex'

    // Create a single comprehensive text block demonstrating all variable patterns
    const textBlock = engine.block.create('text');

    // Multi-line text combining:
    // - Single variable ({{firstName}})
    // - Multiple variables ({{firstName}} {{lastName}})
    // - Variables in context (Email: {{email}})
    const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 52);
    engine.block.appendChild(page, textBlock);

    // Center the text block on the page (after font size is set)
    // Get the actual frame dimensions of the block (including its bounds)
    const frameX = engine.block.getFrameX(textBlock);
    const frameY = engine.block.getFrameY(textBlock);
    const frameWidth = engine.block.getFrameWidth(textBlock);
    const frameHeight = engine.block.getFrameHeight(textBlock);

    // Calculate centered position accounting for frame offset
    engine.block.setPositionX(textBlock, (pageWidth - frameWidth) / 2 - frameX);
    engine.block.setPositionY(
      textBlock,
      (pageHeight - frameHeight) / 2 - frameY
    );

    // Check if the block contains variable references
    const hasVariables = engine.block.referencesAnyVariables(textBlock);
    // eslint-disable-next-line no-console
    console.log('Text block has variables:', hasVariables); // true

    // Create and then remove a temporary variable to demonstrate removal
    engine.variable.setString('tempVariable', 'Temporary Value');
    // eslint-disable-next-line no-console
    console.log('Variables before removal:', engine.variable.findAll());

    // Remove the temporary variable
    engine.variable.remove('tempVariable');
    // eslint-disable-next-line no-console
    console.log('Variables after removal:', engine.variable.findAll());

    // Select the text block to show the Variables panel
    engine.block.setSelected(textBlock, true);

    // Final check: List all variables in the scene
    const finalVariables = engine.variable.findAll();
    // eslint-disable-next-line no-console
    console.log('Final variables in scene:', finalVariables);
    // Expected: ['firstName', 'lastName', 'email', 'company', 'title']

    // Build a custom Variables Manager panel
    // CE.SDK doesn't include a built-in UI for creating/managing variables,
    // so you can build one using the Panel Builder API
    cesdk.ui.registerPanel(
      'ly.img.variablesManager',
      ({ builder, engine: panelEngine, state }) => {
        const { Section, TextInput, Button } = builder;

        // State for creating new variables
        const newVariableName = state('newVariableName', '');
        const newVariableValue = state('newVariableValue', '');

        // Section: Create New Variable
        Section('create-variable', {
          title: 'Create New Variable',
          children: () => {
            TextInput('new-name', {
              inputLabel: 'Variable Name',
              ...newVariableName
            });

            TextInput('new-value', {
              inputLabel: 'Default Value',
              ...newVariableValue
            });

            Button('create-btn', {
              label: 'Create Variable',
              color: 'accent',
              isDisabled: !newVariableName.value.trim(),
              onClick: () => {
                const name = newVariableName.value.trim();
                if (name) {
                  panelEngine.variable.setString(name, newVariableValue.value);
                  newVariableName.setValue('');
                  newVariableValue.setValue('');
                }
              }
            });
          }
        });

        // Section: Existing Variables
        const variables = panelEngine.variable.findAll();
        Section('existing-variables', {
          title: `Manage Variables (${variables.length})`,
          children: () => {
            if (variables.length === 0) {
              builder.Text('no-vars', { content: 'No variables defined yet.' });
              return;
            }

            variables.forEach(varName => {
              TextInput(`var-${varName}`, {
                inputLabel: varName,
                value: panelEngine.variable.getString(varName),
                setValue: value => {
                  panelEngine.variable.setString(varName, value);
                },
                suffix: {
                  icon: '@imgly/TrashBin',
                  tooltip: 'Delete variable',
                  onClick: () => {
                    panelEngine.variable.remove(varName);
                  }
                }
              });
            });
          }
        });
      }
    );

    // Set the panel title
    cesdk.i18n.setTranslations({
      en: {
        'panel.ly.img.variablesManager': 'Custom Variables Panel'
      }
    });

    // Add a dock button to open the panel
    cesdk.ui.registerComponent('variablesManager.dock', ({ builder: b }) => {
      const isPanelOpen = cesdk.ui.isPanelOpen('ly.img.variablesManager');
      b.Button('variables-dock-btn', {
        label: 'Variables',
        icon: '@imgly/Text',
        onClick: () => {
          if (isPanelOpen) {
            cesdk.ui.closePanel('ly.img.variablesManager');
          } else {
            cesdk.ui.openPanel('ly.img.variablesManager');
          }
        },
        isActive: isPanelOpen
      });
    });

    // Add button to dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'variablesManager.dock'
    ]);
  }
}

export default Example;
```

This guide covers how to discover, create, update, and manage text variables both through the UI and programmatically using the Variables API.

## Introduction

Text variables allow you to design templates once and personalize them with different content for each use. At render time, CE.SDK replaces variable tokens with actual values provided through the Variables API. This approach is ideal for:

- **Automated document generation** - Certificates, invoices, reports
- **Mass personalization** - Marketing materials with recipient data
- **Data-driven design** - Templates populated from JSON, CSV, or APIs
- **Form-based editing** - Expose variables through custom interfaces

## Using the Built-in Insert Variable UI

CE.SDK includes an *Insert Variable* dropdown in the text editing canvas menu that allows template authors to insert variable tokens into text blocks.

> **Caution:** The Insert Variable dropdown **only appears when at least one variable is
> already defined** in the scene. If no variables exist, the dropdown will not
> be visible. You must first create variables programmatically using
> `engine.variable.setString()` before the UI becomes available.

To use the Insert Variable UI:

1. **Define variables** using `engine.variable.setString()` — the dropdown won't appear without this step
2. **Enter text edit mode** by double-clicking a text block
3. **Click the Insert Variable dropdown** in the canvas menu (or press `Ctrl+Shift+L` / `Cmd+Shift+L`)

The dropdown allows you to:

- **Insert tokens** into text blocks using `{{variableName}}` syntax
- **Select from all defined variables** in the current scene

Variables appear with localized labels when you configure translations through the i18n API.

> **Note:** CE.SDK does not include a built-in UI for end users to *create* or *manage*
> variables — the Insert Variable dropdown only lets users insert existing
> variables into text. If you need a UI for creating and editing variables, see
> [Building a Variables Manager Panel](#building-a-variables-manager-panel)
> below.

## Discovering Variables

When working with templates that already contain variables, discover what variables exist before populating them with values.

```typescript highlight-discover-variables
// Pattern 1: Discover all existing variables in the scene
// This is useful when loading templates to see what variables need values
const existingVariables = engine.variable.findAll();
// eslint-disable-next-line no-console
console.log('Existing variables:', existingVariables); // []
```

The `findAll()` method returns an array of all variable keys defined in the scene. This is essential when loading templates to understand what data needs to be provided.

## Creating and Updating Variables

Create or update variables using `setString()`. If the variable doesn't exist, it will be created. If it already exists, its value will be updated.

```typescript highlight-create-update-variables
// Pattern 2: Create and update text variables
// If a variable doesn't exist, setString() creates it
// If it already exists, setString() updates its value
engine.variable.setString('firstName', 'Alex');
engine.variable.setString('lastName', 'Smith');
engine.variable.setString('email', 'alex.smith@example.com');
engine.variable.setString('company', 'IMG.LY');
engine.variable.setString('title', 'Creative Developer');
```

> **Note:** Variable keys are case-sensitive. `{{ Name }}` and `{{ name }}` are different
> variables.

## Reading Variable Values

Retrieve the current value of a variable at runtime using `getString()`. This is useful for validation or displaying current values in custom UI.

```typescript highlight-read-variable-value
// Pattern 3: Read variable values at runtime
const firstName = engine.variable.getString('firstName');
// eslint-disable-next-line no-console
console.log('First name variable:', firstName); // 'Alex'
```

## Binding Variables to Text Blocks

Insert variable tokens directly into text block content using the `{{variableName}}` syntax. CE.SDK automatically detects and resolves these tokens at render time.

### Single Variable

```typescript highlight-single-variable-binding
    // Create a single comprehensive text block demonstrating all variable patterns
    const textBlock = engine.block.create('text');

    // Multi-line text combining:
    // - Single variable ({{firstName}})
    // - Multiple variables ({{firstName}} {{lastName}})
    // - Variables in context (Email: {{email}})
    const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 52);
    engine.block.appendChild(page, textBlock);
```

### Multiple Variables

Combine multiple variables in a single text block:

```typescript highlight-multiple-variable-binding
    // Create a single comprehensive text block demonstrating all variable patterns
    const textBlock = engine.block.create('text');

    // Multi-line text combining:
    // - Single variable ({{firstName}})
    // - Multiple variables ({{firstName}} {{lastName}})
    // - Variables in context (Email: {{email}})
    const textContent = `Hello, {{firstName}}!

Full Name: {{firstName}} {{lastName}}
Email: {{email}}
Position: {{title}}
Company: {{company}}`;

    engine.block.replaceText(textBlock, textContent);
    engine.block.setWidthMode(textBlock, 'Auto');
    engine.block.setHeightMode(textBlock, 'Auto');
    engine.block.setFloat(textBlock, 'text/fontSize', 52);
    engine.block.appendChild(page, textBlock);
```

The variables resolve in place, maintaining the surrounding text and formatting.

## Detecting Variable References

Check if a block contains variable references using `referencesAnyVariables()`. This returns `true` if the block's text contains any `{{variable}}` tokens.

```typescript highlight-detect-variable-references
// Check if the block contains variable references
const hasVariables = engine.block.referencesAnyVariables(textBlock);
// eslint-disable-next-line no-console
console.log('Text block has variables:', hasVariables); // true
```

This is useful for identifying which blocks need variable values before export or for implementing validation logic.

## Removing Variables

Remove unused variables from the scene with `remove()`. This cleans up the variable store when certain variables are no longer needed.

```typescript highlight-remove-variable
    // Create and then remove a temporary variable to demonstrate removal
    engine.variable.setString('tempVariable', 'Temporary Value');
    // eslint-disable-next-line no-console
    console.log('Variables before removal:', engine.variable.findAll());

    // Remove the temporary variable
    engine.variable.remove('tempVariable');
    // eslint-disable-next-line no-console
    console.log('Variables after removal:', engine.variable.findAll());
```

After removal, the variable no longer exists in the scene. Text blocks that reference removed variables will display the token literally (e.g., `{{removedVar}}`).

## Localizing Variable Labels

In CE.SDK (with UI), display friendly labels for variables in the inspector panel using i18n translations. Map variable keys to human-readable names that appear in the UI.

```typescript highlight-localize-variables
// Localize variable labels that appear in the Variables panel UI
cesdk.i18n.setTranslations({
  en: {
    'variables.firstName.label': 'First Name',
    'variables.lastName.label': 'Last Name',
    'variables.email.label': 'Email Address',
    'variables.company.label': 'Company Name',
    'variables.title.label': 'Job Title'
  }
});
```

Without localization, the Insert Variable dropdown shows the technical variable key (e.g., `firstName`). With localization, it shows the friendly label (e.g., "First Name").

## Combining with Other Features

Text variables work seamlessly with other CE.SDK template features:

### With Placeholders

Use **placeholders** for dynamic images and videos while **variables** personalize text content. This combination enables fully dynamic templates where both visuals and copy change per use case.

### With Editing Constraints

Lock layout elements while allowing only variable token editing. This ensures brand consistency while enabling content personalization.

### With Role-Based Editing

Show the Insert Variable dropdown only to template authors (Creator role) and hide it from end users (Adopter role). This guides the editing experience based on user permissions.

## Building a Variables Manager Panel

CE.SDK's built-in Insert Variable dropdown only allows users to insert existing variables — it doesn't provide a UI for creating or managing variables. If you want end users to create, edit, and delete variables through the editor interface, you can build a custom panel using the Panel Builder API.

The following example creates a Variables Manager panel with:

- A form to create new variables with a name and default value
- A list of existing variables with editable values and delete buttons
- A dock button to toggle the panel

```typescript highlight-variables-manager-panel
    // Build a custom Variables Manager panel
    // CE.SDK doesn't include a built-in UI for creating/managing variables,
    // so you can build one using the Panel Builder API
    cesdk.ui.registerPanel(
      'ly.img.variablesManager',
      ({ builder, engine: panelEngine, state }) => {
        const { Section, TextInput, Button } = builder;

        // State for creating new variables
        const newVariableName = state('newVariableName', '');
        const newVariableValue = state('newVariableValue', '');

        // Section: Create New Variable
        Section('create-variable', {
          title: 'Create New Variable',
          children: () => {
            TextInput('new-name', {
              inputLabel: 'Variable Name',
              ...newVariableName
            });

            TextInput('new-value', {
              inputLabel: 'Default Value',
              ...newVariableValue
            });

            Button('create-btn', {
              label: 'Create Variable',
              color: 'accent',
              isDisabled: !newVariableName.value.trim(),
              onClick: () => {
                const name = newVariableName.value.trim();
                if (name) {
                  panelEngine.variable.setString(name, newVariableValue.value);
                  newVariableName.setValue('');
                  newVariableValue.setValue('');
                }
              }
            });
          }
        });

        // Section: Existing Variables
        const variables = panelEngine.variable.findAll();
        Section('existing-variables', {
          title: `Manage Variables (${variables.length})`,
          children: () => {
            if (variables.length === 0) {
              builder.Text('no-vars', { content: 'No variables defined yet.' });
              return;
            }

            variables.forEach(varName => {
              TextInput(`var-${varName}`, {
                inputLabel: varName,
                value: panelEngine.variable.getString(varName),
                setValue: value => {
                  panelEngine.variable.setString(varName, value);
                },
                suffix: {
                  icon: '@imgly/TrashBin',
                  tooltip: 'Delete variable',
                  onClick: () => {
                    panelEngine.variable.remove(varName);
                  }
                }
              });
            });
          }
        });
      }
    );

    // Set the panel title
    cesdk.i18n.setTranslations({
      en: {
        'panel.ly.img.variablesManager': 'Custom Variables Panel'
      }
    });

    // Add a dock button to open the panel
    cesdk.ui.registerComponent('variablesManager.dock', ({ builder: b }) => {
      const isPanelOpen = cesdk.ui.isPanelOpen('ly.img.variablesManager');
      b.Button('variables-dock-btn', {
        label: 'Variables',
        icon: '@imgly/Text',
        onClick: () => {
          if (isPanelOpen) {
            cesdk.ui.closePanel('ly.img.variablesManager');
          } else {
            cesdk.ui.openPanel('ly.img.variablesManager');
          }
        },
        isActive: isPanelOpen
      });
    });

    // Add button to dock
    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'variablesManager.dock'
    ]);
```

This panel integrates with the dock and provides a complete variable management experience. Users can create new variables, edit existing values, and remove variables they no longer need.

> **Note:** For more information on building custom panels, see the&#x20;
> [Create a Custom Panel](./user-interface/ui-extensions/create-custom-panel.md) guide.

## API Reference

| Method                                  | Description                                 |
| --------------------------------------- | ------------------------------------------- |
| `engine.variable.findAll()`             | Get array of all variable keys in the scene |
| `engine.variable.setString()`           | Create or update a text variable            |
| `engine.variable.getString()`           | Read the current value of a variable        |
| `engine.variable.remove()`              | Delete a variable from the scene            |
| `engine.block.referencesAnyVariables()` | Check if a block contains variable tokens   |
| `engine.block.replaceText()`            | Set text content (supports variable tokens) |
| `cesdk.i18n.setTranslations()`          | Set UI labels for variable names            |



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support