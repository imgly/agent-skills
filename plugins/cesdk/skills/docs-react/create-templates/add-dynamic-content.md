> This is one page of the CE.SDK React documentation. For a complete overview, see the [React Documentation Index](https://img.ly/react.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [Create and Use Templates](./create-templates.md) > [Insert Dynamic Content](./create-templates/add-dynamic-content.md)

---

Dynamic content transforms static designs into flexible, data-driven templates. CE.SDK provides three complementary capabilities—text variables, placeholders, and editing constraints—that work together to enable personalization while maintaining design integrity.

![Dynamic Content example showing variables and placeholders](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 8 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-add-dynamic-content-browser)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples/tree/main/guides-create-templates-add-dynamic-content-browser)
>
> - [Live demo](https://img.ly/examples/guides-create-templates-add-dynamic-content-browser/)

```typescript file=@cesdk_web_examples/guides-create-templates-add-dynamic-content-browser/browser.ts reference-only
import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import packageJson from './package.json';

/**
 * CE.SDK Plugin: Dynamic Content Overview
 *
 * Demonstrates the dynamic content capabilities in CE.SDK templates:
 * - Text Variables: Insert {{tokens}} that resolve to dynamic values
 * - Placeholders: Create drop zones for swappable images/videos
 * - Editing Constraints: Lock properties while allowing controlled changes
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Initialize CE.SDK with Design mode and set role to Adopter
    await cesdk.addDefaultAssetSources();
    await cesdk.addDemoAssetSources({
      sceneMode: 'Design',
      withUploadAssetSources: true
    });
    await cesdk.createDesignScene();

    const engine = cesdk.engine;

    // Set editor role to Adopter for template usage
    engine.editor.setRole('Adopter');

    const page = engine.block.findByType('page')[0];

    // Set page dimensions
    engine.block.setWidth(page, 800);
    engine.block.setHeight(page, 600);

    // Content area: 480px wide, centered (left margin = 160px)
    const contentX = 160;
    const contentWidth = 480;

    // TEXT VARIABLES: Define variables for personalization
    engine.variable.setString('firstName', 'Jane');
    engine.variable.setString('lastName', 'Doe');
    engine.variable.setString('companyName', 'IMG.LY');

    // Create heading with company variable
    const headingText = engine.block.create('text');
    engine.block.replaceText(
      headingText,
      'Welcome to {{companyName}}, {{firstName}} {{lastName}}.'
    );
    engine.block.setWidth(headingText, contentWidth);
    engine.block.setHeightMode(headingText, 'Auto');
    engine.block.setFloat(headingText, 'text/fontSize', 64);
    engine.block.setEnum(headingText, 'text/horizontalAlignment', 'Left');
    engine.block.appendChild(page, headingText);
    engine.block.setPositionX(headingText, contentX);
    engine.block.setPositionY(headingText, 200);

    // Create description with bullet points
    const descriptionText = engine.block.create('text');
    engine.block.replaceText(
      descriptionText,
      'This example demonstrates dynamic templates.\n\n' +
        '• Text Variables — Personalize content with {{tokens}}\n' +
        '• Placeholders — Swappable images and media\n' +
        '• Editing Constraints — Protected brand elements'
    );
    engine.block.setWidth(descriptionText, contentWidth);
    engine.block.setHeightMode(descriptionText, 'Auto');
    engine.block.setFloat(descriptionText, 'text/fontSize', 44);
    engine.block.setEnum(descriptionText, 'text/horizontalAlignment', 'Left');
    engine.block.appendChild(page, descriptionText);
    engine.block.setPositionX(descriptionText, contentX);
    engine.block.setPositionY(descriptionText, 300);

    // Discover all variables in the scene
    const allVariables = engine.variable.findAll();
    console.log('Variables in scene:', allVariables);

    // PLACEHOLDERS: Create hero image as a swappable drop zone
    const heroImage = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/sample_1.jpg',
      { size: { width: contentWidth, height: 140 } }
    );
    engine.block.appendChild(page, heroImage);
    engine.block.setPositionX(heroImage, contentX);
    engine.block.setPositionY(heroImage, 40);

    // Enable placeholder behavior for the hero image
    if (engine.block.supportsPlaceholderBehavior(heroImage)) {
      engine.block.setPlaceholderBehaviorEnabled(heroImage, true);
      engine.block.setPlaceholderEnabled(heroImage, true);

      if (engine.block.supportsPlaceholderControls(heroImage)) {
        engine.block.setPlaceholderControlsOverlayEnabled(heroImage, true);
        engine.block.setPlaceholderControlsButtonEnabled(heroImage, true);
      }
    }

    // Find all placeholders in the scene
    const placeholders = engine.block.findAllPlaceholders();
    console.log('Placeholders in scene:', placeholders.length);

    // EDITING CONSTRAINTS: Add logo that cannot be moved or selected
    const logo = await engine.block.addImage(
      'https://img.ly/static/ubq_samples/imgly_logo.jpg',
      { size: { width: 100, height: 25 } }
    );
    engine.block.appendChild(page, logo);
    engine.block.setPositionX(logo, 350);
    engine.block.setPositionY(logo, 540);

    // Lock the logo: prevent moving, resizing, and selection
    engine.block.setScopeEnabled(logo, 'layer/move', false);
    engine.block.setScopeEnabled(logo, 'layer/resize', false);
    engine.block.setScopeEnabled(logo, 'editor/select', false);

    // Verify constraints are applied
    const canSelect = engine.block.isScopeEnabled(logo, 'editor/select');
    const canMove = engine.block.isScopeEnabled(logo, 'layer/move');
    console.log('Logo - canSelect:', canSelect, 'canMove:', canMove);

    // Zoom to fit the page with autoFit enabled
    await cesdk.actions.run('zoom.toBlock', page, {
      padding: 40,
      animate: false,
      autoFit: true
    });

    console.log('Dynamic Content demo initialized.');

    cesdk.engine.block.setSelected(page, false);
  }
}

export default Example;
```

This guide covers how to use dynamic content capabilities in CE.SDK templates. The example creates a social media card with personalized name and company variables, a replaceable hero image, and a protected logo.

## Dynamic Content Capabilities

CE.SDK offers three ways to make templates dynamic:

- **Text Variables** — Insert `{{tokens}}` in text that resolve to dynamic values at runtime
- **Placeholders** — Mark blocks as drop zones where users can swap images or videos
- **Editing Constraints** — Lock specific properties to protect brand elements while allowing controlled changes

## Text Variables

Text variables enable data-driven text personalization. Define variables using `engine.variable.setString()`, then reference them in text blocks with `{{variableName}}` tokens.

```typescript highlight-text-variables
    engine.variable.setString('firstName', 'Jane');
    engine.variable.setString('lastName', 'Doe');
    engine.variable.setString('companyName', 'IMG.LY');

    // Create heading with company variable
    const headingText = engine.block.create('text');
    engine.block.replaceText(
      headingText,
      'Welcome to {{companyName}}, {{firstName}} {{lastName}}.'
    );
```

Variables are defined globally and can be referenced in any text block. The `findAll()` method returns all variable keys in the scene, useful for building dynamic editing interfaces.

> **Note:** Variable keys are case-sensitive. `{{Name}}` and `{{name}}` are different variables.

## Placeholders

Placeholders turn design blocks into drop zones for swappable media. Mark an image block as a placeholder, and users can replace its content while the surrounding design remains fixed.

```typescript highlight-placeholders
    // Enable placeholder behavior for the hero image
    if (engine.block.supportsPlaceholderBehavior(heroImage)) {
      engine.block.setPlaceholderBehaviorEnabled(heroImage, true);
      engine.block.setPlaceholderEnabled(heroImage, true);

      if (engine.block.supportsPlaceholderControls(heroImage)) {
        engine.block.setPlaceholderControlsOverlayEnabled(heroImage, true);
        engine.block.setPlaceholderControlsButtonEnabled(heroImage, true);
      }
    }
```

Enable placeholder behavior with `setPlaceholderBehaviorEnabled()`, then enable user interaction with `setPlaceholderEnabled()`. The visual overlay and replace button are controlled separately via `setPlaceholderControlsOverlayEnabled()` and `setPlaceholderControlsButtonEnabled()`.

## Editing Constraints

Editing constraints protect design integrity by limiting what users can modify. Use scope-based APIs to lock specific properties while keeping others editable.

```typescript highlight-editing-constraints
    // Lock the logo: prevent moving, resizing, and selection
    engine.block.setScopeEnabled(logo, 'layer/move', false);
    engine.block.setScopeEnabled(logo, 'layer/resize', false);
    engine.block.setScopeEnabled(logo, 'editor/select', false);

    // Verify constraints are applied
    const canSelect = engine.block.isScopeEnabled(logo, 'editor/select');
    const canMove = engine.block.isScopeEnabled(logo, 'layer/move');
    console.log('Logo - canSelect:', canSelect, 'canMove:', canMove);
```

The `setScopeEnabled()` method controls individual properties. Setting `'editor/select'` to `false` prevents users from selecting the block entirely, making it completely non-interactive. Combined with `'layer/move'` and `'layer/resize'`, this creates a fully protected element.

## Choosing the Right Capability

| Need | Capability |
| --- | --- |
| Dynamic text content | Text Variables |
| Swappable images/videos | Placeholders |
| Lock specific properties | Editing Constraints |

## API Reference

| Method | Description |
| --- | --- |
| `engine.editor.setRole()` | Set user role (Creator, Adopter, Viewer) |
| `engine.variable.findAll()` | Get all variable keys in the scene |
| `engine.variable.setString()` | Create or update a text variable |
| `engine.variable.getString()` | Read a variable's current value |
| `engine.block.supportsPlaceholderBehavior()` | Check placeholder support |
| `engine.block.setPlaceholderBehaviorEnabled()` | Enable placeholder behavior |
| `engine.block.setPlaceholderEnabled()` | Enable user interaction |
| `engine.block.findAllPlaceholders()` | Find all placeholder blocks |
| `engine.block.setScopeEnabled()` | Enable or disable editing scope |
| `engine.block.isScopeEnabled()` | Query scope state |



---

## Related Pages

- [Text Variables](./create-templates/add-dynamic-content/text-variables.md) - Define dynamic text elements that can be populated with custom values during design generation.
- [Placeholders](./create-templates/add-dynamic-content/placeholders.md) - Use placeholders to mark editable image, video, or text areas within a locked template layout.
- [Set Editing Constraints](./create-templates/add-dynamic-content/set-editing-constraints.md) - Learn how to control editing capabilities in CE.SDK templates using the Scope system to lock positions, prevent transformations, and create guided editing experiences


---

## More Resources

- **[React Documentation Index](https://img.ly/react.md)** - Browse all React documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./react.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support