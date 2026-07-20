> This is one page of the CE.SDK Electron documentation. For a complete overview, see the [Electron Documentation Index](https://img.ly/docs/cesdk/electron.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Dynamic Content](./create-templates/add-dynamic-content.md) > [Form-Based Editing](./create-templates/add-dynamic-content/form-based-editing.md)

---

Form-based editing provides structured template customization through input controls rather than canvas manipulation, ideal for non-designers and batch workflows.

![Form-Based Editing example showing a custom form panel with input fields mapped to template variables and placeholders](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 12 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/release-$UBQ_VERSION$/guides-create-templates-dynamic-content-form-based-editing-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/cesdk-web-examples/tree/v$UBQ_VERSION$/guides-create-templates-dynamic-content-form-based-editing-browser)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.80.0-nightly.20260720/examples/guides-create-templates-dynamic-content-form-based-editing-browser/index.html)

Form-based editing transforms template adoption from visual design into structured data entry. Instead of locating and editing elements on a canvas, users fill familiar form controls (text inputs, file uploads) that map directly to template variables and placeholders.

```typescript file=@cesdk_web_examples/guides-create-templates-dynamic-content-form-based-editing-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import {
  BlurAssetSource,
  ImageColorsAssetSource,
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
import { DesignEditorConfig } from '@cesdk/core-configs-web/design-editor';
import packageJson from './package.json';

class Example implements EditorPlugin {
  name = packageJson.name;
  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required');
    }

    await cesdk.addPlugin(new DesignEditorConfig());
    // Add asset source plugins
    await cesdk.addPlugin(new BlurAssetSource());
    await cesdk.addPlugin(new ImageColorsAssetSource());
    await cesdk.addPlugin(new ColorPaletteAssetSource());
    await cesdk.addPlugin(new CropPresetsAssetSource());
    await cesdk.addPlugin(
      new UploadAssetSources({ include: ['ly.img.image.upload'] })
    );
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
      page: { width: 600, height: 800, unit: 'Pixel' }
    });
    const engine = cesdk.engine;
    const page = engine.block.findByType('page')[0];

    await this.createTemplate(engine, page);

    const variables = engine.variable.findAll();
    const placeholders = engine.block
      .findByType('graphic')
      .filter((id) => engine.block.isPlaceholderEnabled(id));

    cesdk.ui.registerComponent(
      'template-form-panel-btn-component',
      ({ builder }) => {
        const isPanelOpen = cesdk.ui.isPanelOpen('template-form');
        builder.Button('template-form-panel-btn', {
          label: 'Custom Form',
          isActive: isPanelOpen,
          onClick: () =>
            isPanelOpen
              ? cesdk.ui.closePanel('template-form')
              : cesdk.ui.openPanel('template-form')
        });
      }
    );

    cesdk.ui.registerPanel('template-form', ({ builder }) => {
      if (variables.length > 0) {
        builder.Section('variables-section', {
          title: 'Text Fields',
          children: () => {
            variables.forEach((key) => {
              builder.TextInput(`variable-${key}`, {
                inputLabel: key,
                value: engine.variable.getString(key),
                setValue: (newValue) => {
                  engine.variable.setString(key, newValue);
                }
              });
            });
          }
        });
      }

      if (placeholders.length > 0) {
        builder.Section('placeholders-section', {
          title: 'Images',
          children: () => {
            placeholders.forEach((blockId, index) => {
              const fill = engine.block.getFill(blockId);
              const uri = engine.block.getString(
                fill,
                'fill/image/imageFileURI'
              );

              builder.MediaPreview(`placeholder-${blockId}`, {
                size: 'small',
                preview: { type: 'image', uri },
                action: {
                  label: `Change Image ${index + 1}`,
                  onClick: () => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          engine.block.setString(
                            fill,
                            'fill/image/imageFileURI',
                            reader.result as string
                          );
                        };
                        reader.readAsDataURL(file);
                      }
                    };
                    input.click();
                  }
                }
              });
            });
          }
        });
      }

      builder.Section('export-section', {
        title: 'Export',
        children: () => {
          builder.Button('export-button', {
            label: 'Export Template',
            size: 'large',
            onClick: () => {
              const emptyVariables = variables.filter((key) => {
                return !engine.variable.getString(key).trim();
              });

              if (emptyVariables.length > 0) {
                alert(`Required fields: ${emptyVariables.join(', ')}`);
                return;
              }

              this.exportTemplate(engine, page);
            }
          });
        }
      });
    });

    cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
      ...cesdk.ui.getComponentOrder({ in: 'ly.img.dock' }),
      'ly.img.spacer',
      'template-form-panel-btn-component'
    ]);
    cesdk.i18n.setTranslations({
      en: {
        'panel.template-form': 'Welcome Form'
      }
    });
    cesdk.ui.openPanel('template-form');
  }

  private async createTemplate(engine: any, page: number): Promise<void> {
    const pageFill = engine.block.getFill(page);
    engine.block.setColor(pageFill, 'fill/color/value', {
      r: 1.0,
      g: 1.0,
      b: 1.0,
      a: 1.0
    });

    const title = engine.block.create('text');
    engine.block.setWidth(title, 500);
    engine.block.setHeight(title, 80);
    engine.block.setPositionX(title, 50);
    engine.block.setPositionY(title, 50);
    engine.block.setString(title, 'text/text', '{{tag}}!');
    engine.block.setFloat(title, 'text/fontSize', 64);
    engine.block.setEnum(title, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, title);

    const subtitle = engine.block.create('text');
    engine.block.setWidth(subtitle, 500);
    engine.block.setHeight(subtitle, 60);
    engine.block.setPositionX(subtitle, 50);
    engine.block.setPositionY(subtitle, 140);
    engine.block.setString(subtitle, 'text/text', '{{tagline}}');
    engine.block.setFloat(subtitle, 'text/fontSize', 52);
    engine.block.setEnum(subtitle, 'text/horizontalAlignment', 'Center');
    engine.block.appendChild(page, subtitle);

    const image = engine.block.create('graphic');
    const shape = engine.block.createShape('rect');
    engine.block.setShape(image, shape);
    engine.block.setWidth(image, 500);
    engine.block.setHeight(image, 400);
    engine.block.setPositionX(image, 50);
    engine.block.setPositionY(image, 250);

    const imageFill = engine.block.createFill('image');
    engine.block.setString(
      imageFill,
      'fill/image/imageFileURI',
      'https://img.ly/static/ubq_samples/sample_1.jpg'
    );
    engine.block.setFill(image, imageFill);
    engine.block.setPlaceholderEnabled(image, true);
    engine.block.appendChild(page, image);

    engine.variable.setString('tag', 'Welcome');
    engine.variable.setString('tagline', 'Your personalized design');
  }

  private async exportTemplate(engine: any, page: number): Promise<void> {
    try {
      const blob = await engine.block.export(page, 'image/png');
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'template.png';
      link.click();

      URL.revokeObjectURL(url);
      alert('Template exported successfully!');
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Check console for details.');
    }
  }
}

export default Example;
```

This guide shows how to discover template variables and placeholders, update content through the engine API, and build custom form panels using CE.SDK's builder API.

## Understanding Form-Based Editing

Form-based editing replaces direct canvas manipulation with structured form controls. Users interact with text inputs and file uploads instead of clicking elements on the canvas. This approach works well for non-designers, batch workflows, and scenarios requiring strict design control.

Variables control text content. Placeholders control images and videos. Discover these programmatically to build form controls that map to each customization point.

## Discovering Template Metadata

Find all variables and placeholders in the template using the engine API. Variables are text fields like "userName" or "tagline". Placeholders are image blocks marked as editable.

```typescript highlight-discover
const variables = engine.variable.findAll();
const placeholders = engine.block
  .findByType('graphic')
  .filter((id) => engine.block.isPlaceholderEnabled(id));
```

The `engine.variable.findAll()` method returns all variable keys. Filter graphic blocks by checking `isPlaceholderEnabled()` to find image placeholders.

## Working with Variables

Variables store text values that can be referenced in text blocks using `{{variableName}}` syntax.

### Using Variables in Text

Reference variables in text blocks by wrapping variable names in double curly braces:

```typescript highlight-use-variable-in-text
engine.block.setString(subtitle, 'text/text', '{{tagline}}');
```

The engine replaces `{{tagline}}` with the variable value when rendering.

### Defining Variables

Set initial values for variables using `engine.variable.setString()`:

```typescript highlight-define-variable
engine.variable.setString('tag', 'Welcome');
engine.variable.setString('tagline', 'Your personalized design');
```

### Updating Variables

Update variable values through the `setValue` callback in UI components:

```typescript highlight-update-variable-setValue
setValue: (newValue) => {
  engine.variable.setString(key, newValue);
}
```

When users type in the TextInput, the engine updates the variable and syncs the canvas automatically.

## Replacing Placeholder Content

Placeholders are graphic blocks marked as editable, allowing users to replace images or videos.

### Reading Placeholder Images

Get the current image from a placeholder by reading its fill:

```typescript highlight-get-fill
const fill = engine.block.getFill(blockId);
const uri = engine.block.getString(
  fill,
  'fill/image/imageFileURI'
);
```

### Setting New Images

Update the placeholder image by setting the fill URI:

```typescript highlight-set-fill
engine.block.setString(
  fill,
  'fill/image/imageFileURI',
  reader.result as string
);
```

The engine accepts data URLs, allowing direct file upload without external storage.

## Building the Form UI

Create custom panels using `cesdk.ui.registerPanel()` with builder components. The builder API provides `Section`, `TextInput`, `MediaPreview`, and `Button` components that automatically match CE.SDK's theme.

```typescript highlight-register-panel-variables
cesdk.ui.registerPanel('template-form', ({ builder }) => {
  if (variables.length > 0) {
    builder.Section('variables-section', {
      title: 'Text Fields',
      children: () => {
        variables.forEach((key) => {
          builder.TextInput(`variable-${key}`, {
            inputLabel: key,
            value: engine.variable.getString(key),
            setValue: (newValue) => {
              engine.variable.setString(key, newValue);
            }
          });
        });
      }
    });
  }
```

The panel appears in the dock and opens automatically when the editor loads. You can also build forms with plain HTML and vanilla JavaScript—the engine API works the same way regardless of your UI framework.

For more details on custom panels and components:

- [Create a Custom Panel](./user-interface/ui-extensions/create-custom-panel.md) — Build sidebar panels for unique workflows
- [Register a New Component](./user-interface/ui-extensions/register-new-component.md) — Create custom UI components

## Error Handling

Handle common errors gracefully:

- **Missing Variables**: Display which fields are required
- **Invalid File Types**: Check MIME types before upload
- **Network Errors**: Handle asset loading failures
- **Permission Errors**: Validate modification rights

Provide clear, actionable error messages to guide users.

## API Reference

### Variables

| Method                         | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `engine.variable.findAll()`    | List all variable keys in the template                     |
| `engine.variable.getString()`  | Read a variable's current value                            |
| `engine.variable.setString()`  | Update a variable's value                                  |

### Placeholders

| Method                              | Description                                       |
| ----------------------------------- | ------------------------------------------------- |
| `engine.block.findByType()`         | Find blocks by type (e.g., 'graphic')            |
| `engine.block.isPlaceholderEnabled()` | Check if a block is a placeholder              |
| `engine.block.getFill()`            | Get the fill ID for a block                      |
| `engine.block.setString()`          | Update block properties (e.g., image URI)        |

### UI Builder

| Method                     | Description                                              |
| -------------------------- | -------------------------------------------------------- |
| `cesdk.ui.registerPanel()` | Register a custom panel with builder components          |
| `builder.Section()`        | Create a collapsible section                             |
| `builder.TextInput()`      | Create a text input with live updates                    |
| `builder.MediaPreview()`   | Create an image preview with upload button               |
| `builder.Button()`         | Create a button with click handler                       |

## Next Steps

- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) — Deep dive into variable management
- [Placeholders](./create-templates/add-dynamic-content/placeholders.md) — Understand placeholder configuration
- [Lock Templates](./create-templates/lock.md) — Combine forms with locked designs
- [Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md) — Fine-tune what users can modify



---

## More Resources

- **[Electron Documentation Index](https://img.ly/docs/cesdk/electron.md)** - Browse all Electron documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./electron.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support