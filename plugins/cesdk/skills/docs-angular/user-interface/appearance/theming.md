> This is one page of the CE.SDK Angular documentation. For a complete overview, see the [Angular Documentation Index](https://img.ly/angular.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Guides](./guides.md) > [User Interface](./user-interface.md) > [Appearance](./user-interface/appearance.md) > [Theming](./user-interface/appearance/theming.md)

---

Customize the visual appearance of CE.SDK's user interface through theming,
allowing you to adapt colors, fonts, and sizes to match your brand identity
or application design.

![CE.SDK editor with custom green and olive nature theme showing themed UI elements](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/cesdk-web-examples/archive/refs/heads/main.zip)
>
> - [View source on GitHub](https://github.com/imgly/cesdk-web-examples)
>
> - [Open in StackBlitz](https://stackblitz.com/~/github.com/imgly/cesdk-web-examples)
>
> - [Live demo](https://img.ly/examples/guides-user-interface-appearance-theming-browser/)

CE.SDK provides comprehensive theming capabilities at two levels: built-in themes for immediate use, and a complete CSS theming API for detailed brand-specific styling. This guide demonstrates how to use each approach to customize the editor's appearance.

```typescript file=@cesdk_web_examples/guides-user-interface-appearance-theming-browser/browser.ts reference-only
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

const GREEN_OLIVE_THEME_CSS = `
.ubq-public[data-ubq-theme='light'][data-ubq-scale='normal'] {
  --ubq-canvas: hsl(95, 25%, 88%) !important;
  --ubq-elevation-1: hsl(92, 22%, 83%) !important;
  --ubq-elevation-2: hsl(88, 20%, 78%) !important;
  --ubq-elevation-3: hsl(85, 18%, 73%) !important;
  --ubq-interactive-default: hsl(88, 20%, 82%) !important;
  --ubq-interactive-hover: hsl(88, 24%, 75%) !important;
  --ubq-interactive-pressed: hsl(88, 28%, 68%) !important;
  --ubq-interactive-accent-default: hsl(135, 45%, 48%) !important;
  --ubq-interactive-accent-hover: hsl(135, 50%, 43%) !important;
  --ubq-interactive-accent-pressed: hsl(135, 55%, 38%) !important;
}
`;

/**
 * CE.SDK Plugin: Theming Guide
 *
 * This example demonstrates:
 * - Setting theme (light, dark, system)
 * - Setting scale (normal, large, modern)
 * - Dynamic scale with callback
 * - Custom theme via CSS custom properties
 */
class Example implements EditorPlugin {
  name = packageJson.name;

  version = packageJson.version;

  async initialize({ cesdk }: EditorPluginContext): Promise<void> {
    if (!cesdk) {
      throw new Error('CE.SDK instance is required for this plugin');
    }

    // Set the theme to light, dark, or system
    // 'system' automatically follows the user's OS theme preference
    cesdk.ui.setTheme('light');

    // Set a fixed scale: 'normal', 'large', or 'modern' (default)
    // - normal: Standard UI scaling for desktop
    // - large: Increased sizes for accessibility and touch devices
    // - modern: Modern theme with refined visual design
    cesdk.ui.setScale('normal');

    // Apply custom green/olive theme after CE.SDK initialization
    const style = document.createElement('style');
    style.textContent = GREEN_OLIVE_THEME_CSS;
    document.head.appendChild(style);

    // Force theme refresh to pick up custom colors
    cesdk.ui.setTheme('dark');
    await new Promise((resolve) => setTimeout(resolve, 100));
    cesdk.ui.setTheme('light');

    // Or use a dynamic scale based on viewport and device
    cesdk.ui.setScale(({ containerWidth, isTouch }) => {
      // Use large scale for small screens or touch devices
      if ((containerWidth && containerWidth < 600) || isTouch) {
        return 'large';
      }
      // Use normal scale for larger screens
      return 'normal';
    });

    // Get the current active theme
    const currentTheme = cesdk.ui.getTheme(); // Returns 'light' or 'dark'
    // eslint-disable-next-line no-console
    console.log('Current theme:', currentTheme);

    // Get the current scale setting
    const currentScale = cesdk.ui.getScale(); // Returns scale or callback function
    // eslint-disable-next-line no-console
    console.log('Current scale:', currentScale);

    // Create a design scene    await cesdk.addPlugin(new DesignEditorConfig());

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

    // Get the page
    const pages = engine.block.findByType('page');
    const page = pages[0];
    if (!page) {
      throw new Error('No page found');
    }

    // Add a visual element to demonstrate the theme
    const imageUri = 'https://img.ly/static/ubq_samples/sample_1.jpg';

    // Add an image to show theme effects
    const imageBlock = await engine.block.addImage(imageUri, {
      x: 100,
      y: 100,
      size: { width: 600, height: 400 }
    });

    engine.block.appendChild(page, imageBlock);

    // Note: The custom theme defined in custom-theme.css will automatically apply
    // when the theme/scale combination matches the CSS selectors
    // Example: .ubq-public[data-ubq-theme='dark'][data-ubq-scale='normal']
  }
}

export default Example;
```

## Built-in Themes and Scales

We provide ready-to-use theme options and scale settings that can be configured at runtime, allowing you to adapt the editor's appearance without writing custom CSS.

### Setting the Theme

Use `cesdk.ui.setTheme()` to switch between light, dark, or system themes. The system option automatically follows the user's operating system theme preference.

```typescript highlight-set-theme
// Set the theme to light, dark, or system
// 'system' automatically follows the user's OS theme preference
cesdk.ui.setTheme('light');
```

By default, the light theme is active. When you set the theme to `'system'`, CE.SDK automatically adapts to the user's OS preference and updates whenever the system theme changes.

### Reading the Current Theme

To determine which theme is currently active, use `cesdk.ui.getTheme()`:

```typescript highlight-get-theme
    // Get the current active theme
    const currentTheme = cesdk.ui.getTheme(); // Returns 'light' or 'dark'
    // eslint-disable-next-line no-console
    console.log('Current theme:', currentTheme);

    // Get the current scale setting
    const currentScale = cesdk.ui.getScale(); // Returns scale or callback function
    // eslint-disable-next-line no-console
    console.log('Current scale:', currentScale);
```

This method always returns either `'light'` or `'dark'`, never `'system'`. When the system theme is configured, `getTheme()` returns the resolved theme based on the current OS preference.

### Setting the Scale

CE.SDK supports three scale modes that affect UI element sizes, spacing, and typography. Use `cesdk.ui.setScale()` to select a fixed scale:

```typescript highlight-set-scale
// Set a fixed scale: 'normal', 'large', or 'modern' (default)
// - normal: Standard UI scaling for desktop
// - large: Increased sizes for accessibility and touch devices
// - modern: Modern theme with refined visual design
cesdk.ui.setScale('normal');
```

The scale modes offer different visual experiences:

- **`normal`**: Standard UI scaling optimized for desktop and larger screens
- **`large`**: Increased element sizes, margins, and fonts for improved readability and accessibility, particularly beneficial for users with visual or motor impairments and those on small screens
- **`modern`** (default): Modern theme with refined color palette, unified elevation surfaces, and improved visual hierarchy

### Dynamic Scale with Callbacks

For responsive designs, you can provide a callback function that returns the appropriate scale based on viewport properties:

```typescript highlight-scale-callback
// Or use a dynamic scale based on viewport and device
cesdk.ui.setScale(({ containerWidth, isTouch }) => {
  // Use large scale for small screens or touch devices
  if ((containerWidth && containerWidth < 600) || isTouch) {
    return 'large';
  }
  // Use normal scale for larger screens
  return 'normal';
});
```

The callback receives an object with two properties:

- `containerWidth`: The width in pixels of the HTML element containing CE.SDK
- `isTouch`: Boolean indicating whether the user agent supports touch input

This callback is evaluated when the viewport size changes or when the touch capability is detected, allowing CE.SDK to adapt the scale dynamically.

## Custom CSS Theming

For complete control over the editor's appearance, use CE.SDK's CSS custom properties system. This approach allows you to define every aspect of the UI's visual design through CSS variables.

### Theme Structure

Custom themes use CSS selectors that combine the root class, theme attribute, and scale attribute:

```css
.ubq-public[data-ubq-theme='dark'][data-ubq-scale='normal'] {
  /* Custom properties here */
}
```

The selector components are:

- `.ubq-public`: Root class that scopes all CE.SDK UI elements
- `[data-ubq-theme]`: Attribute for theme variant (`'light'` or `'dark'`)
- `[data-ubq-scale]`: Attribute for scale mode (`'normal'`, `'large'`, or `'modern'`)

### Loading Custom Themes

Load custom themes by linking a CSS file in your HTML or including a `<style>` tag on the same page as the editor:

```html
<link rel="stylesheet" href="custom-theme.css" />
```

Or inline:

```html
<style>
  .ubq-public[data-ubq-theme='dark'][data-ubq-scale='normal'] {
    --ubq-canvas: hsl(230.27, 52.11%, 13.92%);
    --ubq-elevation-1: hsl(230.4, 52.08%, 18.82%);
    /* ... more properties ... */
  }
</style>
```

### CSS Custom Properties

The theming API provides CSS custom properties organized into color and typography categories.

#### Color Properties

Color properties control surfaces, interactive elements, borders, and notifications. Key color property categories:

- **Canvas and Elevation**: `--ubq-canvas`, `--ubq-elevation-1`, `--ubq-elevation-2`
- **Foreground**: `--ubq-foreground-default`, `--ubq-foreground-light`, `--ubq-foreground-info`
- **Interactive States**: `--ubq-interactive-default`, `--ubq-interactive-hover`, `--ubq-interactive-pressed`
- **Input Elements**: `--ubq-input-default`, `--ubq-input-hover`
- **Borders and Strokes**: `--ubq-border-default`, `--ubq-stroke-contrast-1`, `--ubq-stroke-contrast-2`
- **Notices**: `--ubq-notice-info`, `--ubq-notice-warning`, `--ubq-notice-error`, `--ubq-notice-success`

#### Typography Properties

Typography properties control font families, sizes, line heights, letter spacing, and weights for different text styles:

- **Headlines**: `--ubq-typography-headline-l-*`, `--ubq-typography-headline-m-*`
- **Labels**: `--ubq-typography-label-m-*`, `--ubq-typography-label-s-*`
- **Body Text**: `--ubq-typography-body-m-*`
- **Input Text**: `--ubq-typography-input-m-*`
- **Buttons**: `--ubq-typography-button-m-*`

Each typography style includes properties for:

- `-size`: Font size in pixels
- `-line_height`: Line height in pixels
- `-letter_spacing`: Letter spacing (e.g., `0.02em`)
- `-font_family`: Font family with fallbacks (uses `--ubq-typography-font_family` variable, defaults to `'Inter', sans-serif`)
- `-weight`: Font weight (`normal`, `600`, etc.)

### Creating Theme Variants

We recommend providing both light and dark theme variants for the best user experience. Users expect to choose their preferred theme or have it follow their system preference.

```css
/* Dark theme */
.ubq-public[data-ubq-theme='dark'][data-ubq-scale='normal'] {
  --ubq-canvas: hsl(230.27, 52.11%, 13.92%);
  --ubq-foreground-default: hsla(0, 0%, 100%, 0.9);
  /* ... more properties ... */
}

/* Light theme */
.ubq-public[data-ubq-theme='light'][data-ubq-scale='normal'] {
  --ubq-canvas: hsl(0, 0%, 98%);
  --ubq-foreground-default: hsla(0, 0%, 0%, 0.9);
  /* ... more properties ... */
}
```

Similarly, consider providing scale variants for `normal`, `large`, and `modern` scales to ensure your theme looks correct at all scale settings.

## Best Practices

### Design Considerations

When creating custom themes:

- **Provide both light and dark variants** to respect user preferences
- **Support all three scale options** to ensure accessibility
- **Maintain sufficient contrast ratios** for readability (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
- **Test with real content** to verify the theme works across all UI elements
- **Use system fonts as fallbacks** for reliable cross-platform rendering

### Implementation Tips

For reliable theme implementation:

- **Load themes before CE.SDK initialization** to prevent visual flashes
- **Organize theme files** by theme variant and scale for maintainability
- **Document custom property values** for team collaboration
- **Version control theme files** to track changes over time

### Performance

Optimize theme performance by:

- **Minimizing CSS specificity** for faster selector matching
- **Using CSS custom properties** for efficient theme switching
- **Avoiding unnecessary repaints** by grouping property updates
- **Caching theme preferences** in localStorage to persist user choices

### Accessibility

Ensure themes are accessible:

- **Respect system theme preference** by defaulting to `'system'` theme
- **Meet WCAG AA contrast ratios** for all text and interactive elements
- **Provide the `large` scale option** for users who need larger UI elements
- **Test with screen readers** to verify theme doesn't interfere with assistive technology
- **Include theme switching controls** for users to customize their experience

## Troubleshooting

### Theme Not Applying

If your custom theme isn't visible:

1. Verify CSS is loaded **before** CE.SDK initialization
2. Check CSS selector specificity matches or exceeds built-in theme selectors
3. Ensure `.ubq-public` class is used correctly in all selectors
4. Verify `data-ubq-theme` and `data-ubq-scale` attributes match the theme and scale you've set

### Theme Switching Not Working

If `setTheme()` doesn't update the UI:

1. Confirm the method is called **after** CE.SDK initialization completes
2. Verify CSS selectors cover all theme variants (light/dark)
3. Check the browser console for JavaScript errors
4. Inspect the DOM to ensure `data-ubq-theme` attribute is updating

### Colors Display Incorrectly

If colors appear wrong:

1. Check HSL/HSLA values are valid (hue: 0-360, saturation/lightness: 0%-100%, alpha: 0-1)
2. Verify alpha channel values are in the correct range (0.0 to 1.0)
3. Test color combinations for sufficient contrast
4. Look for typos in CSS property names (they fail silently)

### Typography Not Matching Design

If fonts don't match your design:

1. Verify font family names are spelled correctly and match loaded fonts
2. Check that custom fonts are loaded and available
3. Confirm fallback fonts are specified for reliability
4. Test that the specified font weights are available in the font family

### Scale Callback Not Triggering

If dynamic scale doesn't work:

1. Check callback function signature matches expected parameters
2. Verify `containerWidth` is being evaluated correctly (handle `undefined`)
3. Test on different viewport sizes to confirm callback execution
4. Add `console.log` statements to debug callback parameters

## API Reference

Quick reference for all theming-related APIs:

### Theme Management

| Method                                        | Description                                                     |
| --------------------------------------------- | --------------------------------------------------------------- |
| `cesdk.ui.setTheme('light' \| 'dark' \| 'system')` | Set the theme to light, dark, or system (follows OS preference) |
| `cesdk.ui.getTheme()`                        | Get current active theme (returns `'light'` or `'dark'`)        |

### Scale Management

| Method                                   | Description                                                                     |
| ---------------------------------------- | ------------------------------------------------------------------------------- |
| `cesdk.ui.setScale('normal' \| 'large' \| 'modern')` | Set a fixed scale: normal (standard), large (touch-friendly), modern (refined) |
| `cesdk.ui.setScale(ScaleCallback)`       | Set dynamic scale using callback based on viewport and device                   |
| `cesdk.ui.getScale()`                    | Get current scale setting (returns scale value or callback function)            |

**ScaleCallback Type:**

```typescript
type ScaleCallback = (context: {
  containerWidth: number;
  isTouch: boolean;
}) => 'normal' | 'large' | 'modern'
```

### CSS Custom Properties

Complete reference of all available CSS custom properties for theming:

#### Color Tokens

**Canvas and Elevation**

- `--ubq-canvas`: Main canvas background color
- `--ubq-elevation-1`: First elevation level background
- `--ubq-elevation-2`: Second elevation level background
- `--ubq-elevation-3`: Third elevation level background

**Foreground Colors**

- `--ubq-foreground-default`: Default text and icon color
- `--ubq-foreground-light`: Lighter text color for secondary content
- `--ubq-foreground-info`: Informational text color
- `--ubq-foreground-active`: Active state foreground color
- `--ubq-foreground-accent`: Accent foreground color
- `--ubq-foreground-danger-default`: Danger state foreground color
- `--ubq-foreground-notice-default`: Notice foreground color

**Interactive Elements**

- `--ubq-interactive-default`: Default interactive element background
- `--ubq-interactive-hover`: Hover state background
- `--ubq-interactive-pressed`: Pressed state background
- `--ubq-interactive-selected`: Selected state background
- `--ubq-interactive-active-default`: Active element default state
- `--ubq-interactive-active-hover`: Active element hover state
- `--ubq-interactive-active-pressed`: Active element pressed state
- `--ubq-interactive-accent-default`: Accent interactive default state
- `--ubq-interactive-accent-hover`: Accent interactive hover state
- `--ubq-interactive-accent-pressed`: Accent interactive pressed state
- `--ubq-interactive-danger-default`: Danger interactive default state
- `--ubq-interactive-danger-hover`: Danger interactive hover state
- `--ubq-interactive-danger-pressed`: Danger interactive pressed state
- `--ubq-interactive-group-default`: Group interactive default state
- `--ubq-interactive-group-hover`: Group interactive hover state
- `--ubq-interactive-group-active-default`: Active group default state
- `--ubq-interactive-group-active-hover`: Active group hover state
- `--ubq-interactive-template-default`: Template interactive default state
- `--ubq-interactive-template-hover`: Template interactive hover state
- `--ubq-interactive-template-pressed`: Template interactive pressed state

**Input Elements**

- `--ubq-input-default`: Default input background
- `--ubq-input-hover`: Input hover state background

**Progress Indicators**

- `--ubq-progress`: Progress bar color

**Borders and Strokes**

- `--ubq-border-default`: Default border color
- `--ubq-stroke-contrast-1`: Low contrast stroke color
- `--ubq-stroke-contrast-2`: Medium contrast stroke color
- `--ubq-stroke-contrast-3`: High contrast stroke color

**Focus Indicators**

- `--ubq-focus-default`: Default focus indicator color
- `--ubq-focus-outline`: Focus outline color with transparency

**Overlays**

- `--ubq-overlay`: Modal and overlay background

**Notices and Feedback**

- `--ubq-notice-info`: Informational notice color
- `--ubq-notice-warning`: Warning notice color
- `--ubq-notice-error`: Error notice color
- `--ubq-notice-success`: Success notice color

**Effects**

- `--ubq-effect-shadow`: Box shadow effect for elevation
- `--ubq-effect-focus`: Focus state shadow effect

**Static Colors** (theme-independent)

- `--ubq-static-selection-frame`: Selection frame color
- `--ubq-static-contrast-white`: Static white color
- `--ubq-static-contrast-black`: Static black color
- `--ubq-static-snapping`: Snapping guide color
- `--ubq-static-bleed`: Bleed area color
- `--ubq-static-text-variable`: Variable text indicator color
- `--ubq-static-card-label-background`: Card label background gradient
- `--ubq-static-card-background`: Card background gradient

#### Typography Tokens

Each typography style supports the following properties:

- `-size`: Font size in pixels
- `-line_height`: Line height in pixels
- `-letter_spacing`: Letter spacing (e.g., `0.02em`)
- `-font_family`: Font family (uses `--ubq-typography-font_family` with fallback to `'Inter', sans-serif`)
- `-weight`: Font weight (numeric values like `450`, `600`)

**Headline Large** (`--ubq-typography-headline-l-*`)

- Used for main headings and titles
- Normal scale: 16px size, 20px line height, 0.01em letter spacing, 600 weight
- Large scale: 20px size, 25px line height, 0.01em letter spacing, 600 weight

**Headline Medium** (`--ubq-typography-headline-m-*`)

- Used for secondary headings
- Normal scale: 12px size, 16px line height, 0.03em letter spacing, 600 weight
- Large scale: 15px size, 20px line height, 0.03em letter spacing, 600 weight

**Label Medium** (`--ubq-typography-label-m-*`)

- Used for form labels and UI labels
- Normal scale: 12px size, 16px line height, 0.02em letter spacing, 450 weight
- Large scale: 15px size, 20px line height, 0.02em letter spacing, normal weight

**Label Small** (`--ubq-typography-label-s-*`)

- Used for small labels and captions
- Normal scale: 10px size, 14px line height, 0.02em letter spacing, 450 weight
- Large scale: 12.5px size, 17.5px line height, 0.02em letter spacing, normal weight

**Body Medium** (`--ubq-typography-body-m-*`)

- Used for body text and descriptions
- Normal scale: 12px size, 18px line height, 0.02em letter spacing, 450 weight
- Large scale: 15px size, 22.5px line height, 0.02em letter spacing, normal weight

**Input Medium** (`--ubq-typography-input-m-*`)

- Used for input field text
- Normal scale: 12px size, 16px line height, 0.02em letter spacing, 450 weight
- Large scale: 16px size, 20px line height, 0.02em letter spacing, normal weight (16px minimum prevents iOS zoom)

**Button Medium** (`--ubq-typography-button-m-*`)

- Used for button text
- Normal scale: 12px size, 16px line height, 0.02em letter spacing, 450 weight
- Large scale: 15px size, 20px line height, 0.02em letter spacing, normal weight

**Base Font Family**

- `--ubq-typography-font_family`: Base font family variable used by all typography tokens

#### Spacing and Measurements

**Scale Base**

- `--ubq-scale-base`: Base unit for spacing calculations (4px normal, 5px large)

**Margins**

- `--ubq-margin-base`: Base margin unit (4px normal, 5px large)
- `--ubq-margin-xs`: Extra small margin (4px normal, 5px large)
- `--ubq-margin-s`: Small margin (8px normal, 10px large)
- `--ubq-margin-m`: Medium margin (12px normal, 15px large)
- `--ubq-margin-l`: Large margin (16px normal, 20px large)
- `--ubq-margin-xl`: Extra large margin (24px normal, 30px large)

**Border Radius**

- `--ubq-border_radius-base`: Base border radius (4px normal, 5px large)
- `--ubq-border_radius-xs`: Extra small radius (2px normal, 2.5px large)
- `--ubq-border_radius-s`: Small radius (4px normal, 5px large)
- `--ubq-border_radius-m`: Medium radius (8px normal, 10px large)
- `--ubq-border_radius-l`: Large radius (12px normal, 15px large)

#### CSS Selector Pattern

All custom properties must be scoped using this pattern:

```css
.ubq-public[data-ubq-theme='light' | 'dark'][data-ubq-scale='normal' | 'large' | 'modern'] {
  /* Custom properties here */
}
```

## Next Steps

Now that you understand theming, explore related customization features:

- [Custom Labels](./user-interface/appearance/custom-labels.md) - Customize UI text labels to match your brand voice
- [Custom UI Components](./user-interface/ui-extensions.md) - Build custom UI elements for your workflow
- [Customize UI Behavior](./user-interface/ui-extensions/customize-behaviour.md) - Control and respond to CE.SDK's interface at runtime



---

## More Resources

- **[Angular Documentation Index](https://img.ly/angular.md)** - Browse all Angular documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./angular.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support