> This is one page of the CE.SDK Vanilla JS/TS documentation. For a complete overview, see the [Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md). For all docs in one file, see [llms-full.txt](./llms-full.txt.md).

**Navigation:** [Starter Kits](./starterkits.md) > [Customization](./starterkits/customization.md) > [Print-Ready PDF Editor](./starterkits/print-ready-pdf-editor.md)

---

Deliver print-ready CMYK PDF/X-4 and PDF/X-3 files straight from your web app. Perfect for web-to-print and marketing automation.

![Print-Ready PDF Editor starter kit showing the PDF export interface](https://img.ly/docs/cesdk/./assets/browser.hero.webp)

> **Reading time:** 10 minutes
>
> **Resources:**
>
> - [Download examples](https://github.com/imgly/starterkit-print-ready-pdf-editor-ts-web/archive/refs/tags/release-$UBQ_VERSION$.zip)
>
> - [View source on GitHub](https://github.com/imgly/starterkit-print-ready-pdf-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Open in StackBlitz](https://stackblitz.com/github/imgly/starterkit-print-ready-pdf-editor-ts-web/tree/release-$UBQ_VERSION$)
>
> - [Live demo](https://cdn.img.ly/demo/cesdk-web-examples/v1.83.0-nightly.20260906/examples/starterkit-print-ready-pdf-editor/index.html)

***

## Pre-requisites

This guide assumes basic familiarity with JavaScript or TypeScript.

- **Node.js v22+** with npm – [Download](https://nodejs.org/)
- **Supported browsers** – Chrome 114+, Edge 114+, Firefox 115+, Safari 15.6+<br />
  See [Browser Support](./browser-support.md) for the full list

***

<Tabs syncKey="project-type">
  <TabItem label="New Project">
    ## Get Started

    Start fresh with a standalone Print-Ready PDF Editor project. This creates a complete, ready-to-run application with PDF/X-4 and PDF/X-3 export capabilities.

    ## Step 1: Clone the Repository

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-print-ready-pdf-editor-ts-web.git
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-print-ready-pdf-editor-ts-web starterkit-print-ready-pdf-editor-ts-web
      </TerminalTab>
    </TerminalTabs>

    The `src/` folder contains the editor code:

    ```
    src/
    ├── imgly/
    │   ├── config/
    │   │   ├── actions.ts                # Export/import actions
    │   │   ├── features.ts               # Feature toggles
    │   │   ├── i18n.ts                   # Translations
    │   │   ├── plugin.ts                 # Main configuration plugin
    │   │   ├── settings.ts               # Engine settings
    │   │   └── ui/
    │   │       ├── canvas.ts                 # Canvas configuration
    │   │       ├── components.ts             # Custom component registration
    │   │       ├── dock.ts                   # Dock layout configuration
    │   │       ├── index.ts                  # Combines UI customization exports
    │   │       ├── inspectorBar.ts           # Inspector bar layout
    │   │       ├── navigationBar.ts          # Navigation bar layout
    │   │       └── panel.ts                  # Panel configuration
    │   ├── index.ts                  # Editor initialization function
    │   └── plugins/
    │       └── export-print-ready-pdf.ts
    └── index.ts
    ```

    ## Step 2: Install Dependencies

    Install the required packages:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        cd starterkit-print-ready-pdf-editor-ts-web
        npm install
      </TerminalTab>

      <TerminalTab label="pnpm">
        cd starterkit-print-ready-pdf-editor-ts-web
        pnpm install
      </TerminalTab>

      <TerminalTab label="yarn">
        cd starterkit-print-ready-pdf-editor-ts-web
        yarn
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in `src/index.ts`.

    ```typescript title="src/index.ts"
    const config = {
      // ...
      baseURL: '/assets'
      // ...
    };
    ```

    ## Step 4: Run the Development Server

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm run dev
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm run dev
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn dev
      </TerminalTab>
    </TerminalTabs>

    Open `http://localhost:5173` in your browser.
  </TabItem>

  <TabItem label="Existing Project">
    ## Get Started

    Integrate the Print-Ready PDF Editor into an existing web application. This adds the editor configuration with PDF/X-4 and PDF/X-3 export to your current project structure.

    ## Step 1: Clone

    <TerminalTabs>
      <TerminalTab label="Navigate">
        cd your-project
      </TerminalTab>
    </TerminalTabs>

    Clone the starter kit and copy the editor configuration to your project:

    <TerminalTabs>
      <TerminalTab label="git">
        git clone https://github.com/imgly/starterkit-print-ready-pdf-editor-ts-web.git
        cp -r starterkit-print-ready-pdf-editor-ts-web/src/imgly ./src/imgly
        rm -rf starterkit-print-ready-pdf-editor-ts-web
      </TerminalTab>

      <TerminalTab label="degit">
        npx degit imgly/starterkit-print-ready-pdf-editor-ts-web/src/imgly ./src/imgly
      </TerminalTab>
    </TerminalTabs>

    > **Adjust Path:** The default destination is `./src/imgly`. Adjust the path to match your project structure.

    The `imgly/` folder contains the editor configuration:

    ```
    imgly/
    ├── config/
    │   ├── actions.ts                # Export/import actions
    │   ├── features.ts               # Feature toggles
    │   ├── i18n.ts                   # Translations
    │   ├── plugin.ts                 # Main configuration plugin
    │   ├── settings.ts               # Engine settings
    │   └── ui/
    │       ├── canvas.ts                 # Canvas configuration
    │       ├── components.ts             # Custom component registration
    │       ├── dock.ts                   # Dock layout configuration
    │       ├── index.ts                  # Combines UI customization exports
    │       ├── inspectorBar.ts           # Inspector bar layout
    │       ├── navigationBar.ts          # Navigation bar layout
    │       └── panel.ts                  # Panel configuration
    ├── index.ts                  # Editor initialization function
    └── plugins/
        └── export-print-ready-pdf.ts
    ```

    ## Step 2: Install Dependencies

    Install the required packages for the editor:

    ### Core Editor

    Install the Creative Editor SDK:

    <TerminalTabs syncKey="package-manager">
      <TerminalTab label="npm">
        npm install @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="pnpm">
        pnpm add @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>

      <TerminalTab label="yarn">
        yarn add @cesdk/cesdk-js@$UBQ\_VERSION$
      </TerminalTab>
    </TerminalTabs>

    ## Step 3: Download Assets

    CE.SDK requires engine assets (fonts, icons, UI elements) to function. These must be served as static files from your project's `public/` directory.

    <TerminalTabs>
      <TerminalTab label="Download">
        curl -O https://cdn.img.ly/packages/imgly/cesdk-js/$UBQ\_VERSION$/imgly-assets.zip
        unzip imgly-assets.zip -d public/
        rm imgly-assets.zip
      </TerminalTab>
    </TerminalTabs>

    > **Asset Configuration:** The starter kit is pre-configured to load assets from `/assets`. If you place assets in a different location, update the `baseURL` in Step 5: Initialize the Editor.

    ## Step 4: Add a Container Element

    Add a container element to your HTML where the editor will be mounted:

    ```html
    <div id="cesdk_container" style="width: 100%; height: 100vh;"></div>
    ```

    ## Step 5: Initialize the Editor

    Import and call the initialization function from your application's entry point:

    ```typescript title="src/index.ts"
    import CreativeEditorSDK from '@cesdk/cesdk-js';

    import { initPrintReadyPdfEditor } from './imgly';

    const config = {
      userId: 'your-user-id',
      baseURL: '/assets'
      // license: 'YOUR_LICENSE_KEY',
    };

    CreativeEditorSDK.create('#cesdk_container', config)
      .then(async (cesdk) => {
        await initPrintReadyPdfEditor(cesdk);
      })
      .catch((error) => {
        console.error('Failed to initialize CE.SDK:', error);
      });
    ```
  </TabItem>
</Tabs>

## Set Up a Scene

CE.SDK offers multiple ways to load content into the editor. Choose the method that matches your use case:

```typescript title="src/index.ts"
// Create a blank design canvas - starts with an empty design scene
await cesdk.actions.run('scene.create');

// Load from a template archive - restores a previously saved project
await cesdk.load('https://example.com/template.zip');

// Load from an image URL - creates a new scene with the image
await cesdk.createFromImage('https://example.com/image.jpg');

// Load from a scene file - restores a scene from JSON
await cesdk.load('https://example.com/scene.json');
```

The `createDesignScene()` method is ideal for design workflows, as it creates a blank canvas ready for content.

> **More Loading Options:** See [Open the Editor](./open-the-editor.md) for all available loading methods.

## Print-Ready PDF Export

The Print-Ready PDF Editor includes a custom export panel for producing print-ready PDF/X-4 and PDF/X-3 files. This panel provides professional printing options directly in the editor.

### Export Panel Features

The export panel includes:

- **Bleed Margins** – Add configurable bleed margins for professional printing
- **Color Profiles** – Choose between CMYK (ISO Coated v2, GRACoL 2006) and RGB (sRGB) profiles
- **Page Range Selection** – Export all pages or specify a custom range
- **PDF/X Standard** – Choose between PDF/X-4 (default, preserves live transparency) and PDF/X-3 (flattened)
- **PDF/X-4 & PDF/X-3 Compliance** – Generate PDFs that meet print industry standards

### Using the Export Panel

Click the "Export PDF" button in the navigation bar to open the export panel. The panel is registered as a custom component in `src/imgly/plugins/export-print-ready-pdf.ts`:

```typescript file=@cesdk_web_examples/starterkit-print-ready-pdf-editor/src/imgly/plugins/export-print-ready-pdf.ts reference-only
/**
 * Export Print-Ready PDF Panel Plugin
 *
 * This plugin provides a custom export panel for creating print-ready PDFs
 * with PDF/X-4 or PDF/X-3 compliance, CMYK color profiles, bleed margins, and page range selection.
 *
 * @see https://img.ly/docs/cesdk/js/export-save-publish/export/overview-9ed3a8/
 */

import { type CreativeEngine, EditorPlugin } from '@cesdk/cesdk-js';

// #region Color Profiles
type ColorProfile = 'fogra39' | 'gracol' | 'srgb';

const COLOR_PROFILE_SELECT_VALUES = [
  { id: 'fogra39', label: 'ISO Coated v2 (ECI) (CMYK)' },
  { id: 'gracol', label: 'GRACoL 2006 (CMYK)' },
  { id: 'srgb', label: 'sRGB (RGB)' }
];

const COLOR_PROFILE_DEFAULT_VALUE = COLOR_PROFILE_SELECT_VALUES[0];
// #endregion

// #region PDF/X Standard
type PDFXStandard = 'PDF/X-3' | 'PDF/X-4';

const PDFX_STANDARD_SELECT_VALUES = [
  { id: 'PDF/X-4', label: 'PDF/X-4 (recommended)' },
  { id: 'PDF/X-3', label: 'PDF/X-3' }
];

// PDF/X-4 is the default: it preserves live transparency so vector text on
// transparent pages stays selectable. PDF/X-3 (PDF 1.4) flattens transparency.
const PDFX_STANDARD_DEFAULT_VALUE = PDFX_STANDARD_SELECT_VALUES[0];
// #endregion

// #region Page Amount Types
export enum PageAmountType {
  ALL = 'all',
  CUSTOM = 'custom'
}
// #endregion

type SelectValue = { id: string; label: string | string[] };

// #region Bleed Margin Defaults
const DEFAULT_BLEED_MARGIN = 3; // mm
// #endregion

/**
 * Export Print-Ready PDF Panel Plugin
 *
 * Provides a custom panel for exporting print-ready PDFs with:
 * - PDF/X standard selection (PDF/X-4 or PDF/X-3)
 * - Bleed margin configuration
 * - Color profile selection (CMYK/RGB)
 * - Page range selection
 */
export const ExportPrintReadyPDFPanelPlugin = (): EditorPlugin => ({
  name: 'ly.img.export-print-ready-pdf',
  version: '1.0.0',
  initialize: async ({ cesdk }) => {
    if (cesdk == null) return;

    // #region Navigation Bar Button
    cesdk.ui.registerComponent(
      'ly.img.export-print-ready-pdf.navigationBar',
      ({ builder }) => {
        builder.Button('export-button', {
          color: 'accent',
          variant: 'regular',
          label: 'common.export',
          onClick: () => {
            if (cesdk.ui.isPanelOpen('//ly.img.panel/export-print-ready-pdf')) {
              cesdk.ui.closePanel('//ly.img.panel/export-print-ready-pdf');
            } else {
              cesdk.ui.openPanel('//ly.img.panel/export-print-ready-pdf');
            }
          }
        });
      }
    );
    // #endregion

    // #region Translations
    cesdk.i18n.setTranslations({
      en: {
        'panel.//ly.img.panel/export-print-ready-pdf': 'Export Print-Ready PDF',
        'pages/all': 'All',
        'pages/custom': 'Custom',
        'bleed/enabled': 'Include Bleed',
        'bleed/margin': 'Bleed Margin (mm)'
      }
    });
    // #endregion

    // #region Panel Registration
    cesdk.ui.registerPanel(
      '//ly.img.panel/export-print-ready-pdf',
      ({ builder, engine, state }) => {
        // State for bleed margins
        const bleedEnabledState = state<boolean>('bleedEnabled', true);
        const bleedMarginState = state<number>(
          'bleedMargin',
          DEFAULT_BLEED_MARGIN
        );

        // State for PDF/X standard
        const standardState = state<SelectValue>(
          'standard',
          PDFX_STANDARD_DEFAULT_VALUE
        );

        // State for color profile
        const colorProfileState = state<SelectValue>(
          'colorProfile',
          COLOR_PROFILE_DEFAULT_VALUE
        );

        // State for page selection
        const pagesState = state<PageAmountType>('pages', PageAmountType.ALL);
        const rangeInputState = state<string>('rangeInput', '');
        const rangeInputErrorState = state<string | undefined>(
          'rangeInputError'
        );
        const rangePageState = state<number[]>('rangePages', []);

        // #region PDF/X Standard Section
        builder.Section('standard-section', {
          children: () => {
            builder.Select('pdfx-standard', {
              inputLabel: 'PDF/X Standard',
              values: PDFX_STANDARD_SELECT_VALUES,
              value: standardState.value,
              setValue: standardState.setValue,
              tooltip:
                'PDF/X-4 preserves live transparency and keeps vector text selectable. PDF/X-3 (PDF 1.4) flattens transparency for older prepress workflows.'
            });
          }
        });
        // #endregion

        // #region Bleed Margin Section
        builder.Section('bleed-section', {
          children: () => {
            builder.Checkbox('bleed-enabled', {
              inputLabel: 'bleed/enabled',
              value: bleedEnabledState.value,
              setValue: bleedEnabledState.setValue
            });

            if (bleedEnabledState.value) {
              builder.NumberInput('bleed-margin', {
                inputLabel: 'bleed/margin',
                value: bleedMarginState.value,
                setValue: bleedMarginState.setValue,
                min: 0,
                max: 25,
                step: 0.5
              });
            }
          }
        });
        // #endregion

        // #region Color Profile Section
        builder.Section('color-profile-section', {
          children: () => {
            builder.Select('color-profile', {
              inputLabel: 'Color Profile',
              values: COLOR_PROFILE_SELECT_VALUES,
              value: colorProfileState.value,
              setValue: colorProfileState.setValue,
              tooltip:
                'Select the color profile for print-ready PDF export. CMYK profiles are recommended for professional printing.'
            });
          }
        });
        // #endregion

        // #region Pages Section
        builder.Section('pages-section', {
          children: () => {
            builder.ButtonGroup('pages', {
              inputLabel: 'Pages',
              children: () => {
                [PageAmountType.ALL, PageAmountType.CUSTOM].forEach(
                  (pageType) => {
                    builder.Button(pageType, {
                      label: `pages/${pageType}`,
                      isActive: pagesState.value === pageType,
                      onClick: () => pagesState.setValue(pageType)
                    });
                  }
                );
              }
            });

            if (pagesState.value === 'custom') {
              builder.TextInput('page-range', {
                inputLabel: 'Page Range',
                value: rangeInputState.value,
                setValue: (newValue) => {
                  rangeInputState.setValue(newValue);
                  try {
                    rangePageState.setValue(getPagesFromRange([], newValue));
                    rangeInputErrorState.setValue(undefined);
                  } catch (error: unknown) {
                    rangeInputErrorState.setValue(
                      error instanceof Error ? error.message : 'Invalid range'
                    );
                  }
                }
              });
              builder.Text('page-range-info', {
                content: rangeInputErrorState.value ?? 'e.g.: 1,1-2',
                align: 'right'
              });
            }
          }
        });
        // #endregion

        // #region Export Button Section
        builder.Section('export-button', {
          children: () => {
            const loadingState = state<boolean>('loading', false);
            builder.Button('export', {
              label: 'Export PDF',
              isLoading: loadingState.value,
              color: 'accent',
              onClick: async () => {
                loadingState.setValue(true);
                try {
                  await exportPrintReadyPDF(
                    engine,
                    rangeInputState.value,
                    colorProfileState.value.id as ColorProfile,
                    standardState.value.id as PDFXStandard,
                    bleedEnabledState.value,
                    bleedMarginState.value
                  );
                } catch (error: unknown) {
                  // Surface the failure instead of leaving the button spinning
                  // forever if export or PDF/X conversion throws.
                  // eslint-disable-next-line no-console
                  console.error('Print-ready PDF export failed:', error);
                } finally {
                  loadingState.setValue(false);
                }
              }
            });
          }
        });
        // #endregion
      }
    );
    // #endregion

    // #region Panel Position
    cesdk.ui.setPanelPosition(
      '//ly.img.panel/export-print-ready-pdf',
      'right' as 'left' | 'right'
    );
    // #endregion
  }
});

// #region Export Function
/**
 * Export the scene as a print-ready PDF/X-4 or PDF/X-3
 *
 * @param engine - The Creative Engine instance
 * @param pageRange - Page range string (e.g., "1,2-5")
 * @param colorProfile - Color profile to use (fogra39, gracol, srgb)
 * @param outputStandard - PDF/X standard to produce ('PDF/X-4' or 'PDF/X-3')
 * @param bleedEnabled - Whether to include bleed margins
 * @param bleedMargin - Bleed margin size in mm
 */
const exportPrintReadyPDF = async (
  engine: CreativeEngine,
  pageRange: string,
  colorProfile: ColorProfile,
  outputStandard: PDFXStandard,
  bleedEnabled: boolean,
  bleedMargin: number
) => {
  const scene = engine.scene.get();
  if (scene == null) {
    return;
  }

  const pages = engine.scene.getPages();
  let filteredPages: number[] = pages;
  try {
    filteredPages = getPagesFromRange(pages, pageRange);
  } catch {
    return;
  }

  const hiddenPages = pages.filter((id: number) => !filteredPages.includes(id));

  // Apply bleed margins if enabled
  if (bleedEnabled && bleedMargin > 0) {
    // Convert mm to design units (assuming 1 unit = 1 point, 1 mm ≈ 2.83465 points)
    const bleedInPoints = bleedMargin * 2.83465;
    filteredPages.forEach((pageId: number) => {
      engine.block.setFloat(pageId, 'page/margin/top', bleedInPoints);
      engine.block.setFloat(pageId, 'page/margin/bottom', bleedInPoints);
      engine.block.setFloat(pageId, 'page/margin/left', bleedInPoints);
      engine.block.setFloat(pageId, 'page/margin/right', bleedInPoints);
      engine.block.setBool(pageId, 'page/marginEnabled', true);
    });
  }

  // Hide pages from export that are not specified in the range
  hiddenPages.forEach((id: number) => {
    engine.block.setVisible(id, false);
  });

  // Export as standard PDF first
  const pdfBlob = await engine.block.export(scene, {
    mimeType: 'application/pdf'
  });

  // Restore hidden pages
  hiddenPages.forEach((id: number) => {
    engine.block.setVisible(id, true);
  });

  // Lazily load the print-ready PDF plugin so its Ghostscript WASM payload is
  // only fetched when the user actually exports. Resolves to the installed
  // @imgly/plugin-print-ready-pdfs-web package (bundled as its own chunk), not
  // a runtime CDN URL.
  const { convertToPDFX } = await import('@imgly/plugin-print-ready-pdfs-web');

  // Convert to the selected print-ready PDF/X standard (defaults to PDF/X-4)
  const printReadyPDF = await convertToPDFX(pdfBlob, {
    outputProfile: colorProfile,
    outputStandard,
    title: 'Print-Ready Export'
  });

  await localDownload(printReadyPDF, 'my-design-print-ready');
};
// #endregion

// #region Helper Functions
/**
 * Parse page range string and return array of page IDs
 */
const getPagesFromRange = (
  scenePages: number[],
  pageRange: string
): number[] => {
  if (!pageRange) {
    return scenePages;
  }
  // The regex pattern for matching valid page ranges
  const regexPattern = /^(\d+-\d+|\d+)(,(\d+-\d+|\d+))*$/;

  // Test the input page range against the regex pattern
  if (!regexPattern.test(pageRange.replace(/\s/, ''))) {
    throw new Error('Invalid page range');
  }

  // Split the input page range by commas
  const pageRanges = pageRange.split(',');

  // Build a list of page indexes within the specified ranges
  const pageIndexes: number[] = [];
  pageRanges.forEach((range: string) => {
    if (range.includes('-')) {
      const [start, end] = range.split('-').map(Number);
      for (let i = start; i <= end; i++) {
        pageIndexes.push(i);
      }
    } else {
      pageIndexes.push(Number(range));
    }
  });

  return [...scenePages].filter((_, i) => pageIndexes.includes(i + 1));
};

/**
 * Trigger a file download in the browser
 */
const localDownload = (data: Blob, filename: string): Promise<void> => {
  return new Promise((resolve) => {
    const element = document.createElement('a');
    element.setAttribute('href', window.URL.createObjectURL(data));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

    resolve();
  });
};
// #endregion
```

The PDF/X standard selector defaults to PDF/X-4, which preserves live transparency:

```typescript highlight-standard-section
builder.Section('standard-section', {
  children: () => {
    builder.Select('pdfx-standard', {
      inputLabel: 'PDF/X Standard',
      values: PDFX_STANDARD_SELECT_VALUES,
      value: standardState.value,
      setValue: standardState.setValue,
      tooltip:
        'PDF/X-4 preserves live transparency and keeps vector text selectable. PDF/X-3 (PDF 1.4) flattens transparency for older prepress workflows.'
    });
  }
});
```

The bleed section adds a toggle and a margin input measured in millimeters:

```typescript highlight-bleed-section
        builder.Section('bleed-section', {
          children: () => {
            builder.Checkbox('bleed-enabled', {
              inputLabel: 'bleed/enabled',
              value: bleedEnabledState.value,
              setValue: bleedEnabledState.setValue
            });

            if (bleedEnabledState.value) {
              builder.NumberInput('bleed-margin', {
                inputLabel: 'bleed/margin',
                value: bleedMarginState.value,
                setValue: bleedMarginState.setValue,
                min: 0,
                max: 25,
                step: 0.5
              });
            }
          }
        });
```

The color profile selector offers CMYK and RGB profiles:

```typescript highlight-color-profile-section
builder.Section('color-profile-section', {
  children: () => {
    builder.Select('color-profile', {
      inputLabel: 'Color Profile',
      values: COLOR_PROFILE_SELECT_VALUES,
      value: colorProfileState.value,
      setValue: colorProfileState.setValue,
      tooltip:
        'Select the color profile for print-ready PDF export. CMYK profiles are recommended for professional printing.'
    });
  }
});
```

The pages section exports all pages or a custom range:

```typescript highlight-pages-section
        builder.Section('pages-section', {
          children: () => {
            builder.ButtonGroup('pages', {
              inputLabel: 'Pages',
              children: () => {
                [PageAmountType.ALL, PageAmountType.CUSTOM].forEach(
                  (pageType) => {
                    builder.Button(pageType, {
                      label: `pages/${pageType}`,
                      isActive: pagesState.value === pageType,
                      onClick: () => pagesState.setValue(pageType)
                    });
                  }
                );
              }
            });

            if (pagesState.value === 'custom') {
              builder.TextInput('page-range', {
                inputLabel: 'Page Range',
                value: rangeInputState.value,
                setValue: (newValue) => {
                  rangeInputState.setValue(newValue);
                  try {
                    rangePageState.setValue(getPagesFromRange([], newValue));
                    rangeInputErrorState.setValue(undefined);
                  } catch (error: unknown) {
                    rangeInputErrorState.setValue(
                      error instanceof Error ? error.message : 'Invalid range'
                    );
                  }
                }
              });
              builder.Text('page-range-info', {
                content: rangeInputErrorState.value ?? 'e.g.: 1,1-2',
                align: 'right'
              });
            }
          }
        });
```

### Color Profile Options

| Profile | Color Space | Use Case |
|---------|-------------|----------|
| ISO Coated v2 (fogra39) | CMYK | European printing standards |
| GRACoL 2006 (gracol) | CMYK | North American printing standards |
| sRGB | RGB | Web and screen display |

### Programmatic PDF Export

You can also trigger PDF export programmatically. Export the scene as a standard PDF first, then convert it to a print-ready PDF/X file with `convertToPDFX` from the `@imgly/plugin-print-ready-pdfs-web` package:

```typescript
import { convertToPDFX } from '@imgly/plugin-print-ready-pdfs-web';

// Export the scene as a standard PDF
const scene = cesdk.engine.scene.get();
const pdfBlob = await cesdk.engine.block.export(scene, {
  mimeType: 'application/pdf'
});

// Convert to a print-ready PDF/X file with a CMYK color profile
const printReadyPDF = await convertToPDFX(pdfBlob, {
  outputProfile: 'fogra39', // ISO Coated v2 (CMYK)
  outputStandard: 'PDF/X-4', // default; use 'PDF/X-3' for older pipelines
  title: 'Print-Ready Export'
});
```

To include bleed, the starter kit sets the page margin properties (`page/margin/top`, `page/margin/bottom`, `page/margin/left`, `page/margin/right` and `page/marginEnabled`) on each page before exporting — see `src/imgly/plugins/export-print-ready-pdf.ts` for the full implementation.

## Customize Assets

The Print-Ready PDF Editor uses asset source plugins to provide built-in libraries for templates, stickers, shapes, and fonts. The starter kit includes a curated selection—customize what's included based on your needs.

Asset sources are added via plugins in `src/imgly/index.ts`. Enable or disable individual sources:

```typescript title="src/imgly/index.ts"
import {
  FiltersAssetSource,
  StickerAssetSource,
  TextAssetSource,
  VectorShapeAssetSource,
  EffectsAssetSource,
  // ...
} from '@cesdk/cesdk-js/plugins';

// Add only the sources you need
await cesdk.addPlugin(new FiltersAssetSource());
await cesdk.addPlugin(new StickerAssetSource());
await cesdk.addPlugin(new TextAssetSource());
await cesdk.addPlugin(new VectorShapeAssetSource());
await cesdk.addPlugin(new EffectsAssetSource());
// ...
```

> **Available Asset Sources:** See [Asset Source Plugins](./plugins/asset-sources.md) for the complete list of available sources.

For production deployments, self-hosting assets is required—the IMG.LY CDN is intended for development only. See [Serve Assets](./serve-assets.md) for downloading assets, configuring `baseURL`, and excluding unused sources to optimize load times.

## Configure Actions

Actions are functions that handle user interactions like exporting designs, saving scenes, and importing files. CE.SDK provides built-in actions that you can run directly or override with custom implementations.

**Key built-in actions:**

- `exportDesign` – Export the current design to PNG, JPEG, PDF, or other formats
- `saveScene` – Save the scene as a JSON string for later editing
- `importScene` – Import a previously saved scene (`.imgly` or `.scene`)
- `exportScene` – Export the scene as an `.imgly` file, either the scene alone or an archive with all assets
- `uploadFile` – Handle file uploads with progress tracking

Use `cesdk.actions.run()` to execute any action:

```typescript
// Run a built-in action
await cesdk.actions.run('exportDesign', { mimeType: 'image/png' });
```

#### Import from File Picker

```typescript title="src/imgly/config/actions.ts"
// Let users open images from their device
cesdk.actions.register('importImage', async () => {
  const blobURL = await cesdk.utils.loadFile({
    accept: 'image/*',
    returnType: 'objectURL'
  });
  await cesdk.createFromImage(blobURL);
});
```

#### Export and Save

```typescript title="src/imgly/config/actions.ts"
// Register export action that downloads the edited design
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs, options } = await cesdk.utils.export(exportOptions);
  await cesdk.utils.downloadFile(blobs[0], options.mimeType);
});
```

#### Upload to Your Backend

```typescript title="src/imgly/config/actions.ts"
// Override the built-in exportDesign action to send to your server
cesdk.actions.register('exportDesign', async (exportOptions) => {
  const { blobs } = await cesdk.utils.export(exportOptions);

  const formData = new FormData();
  formData.append('design', blobs[0], 'design.png');

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });

  const { url } = await response.json();
  console.log('Uploaded to:', url);
});
```

> **Learn More:** See [Actions](./actions.md) for the full list of built-in actions, how to run them, and how to register custom actions.

***

## Customize (Optional)

### Theming

CE.SDK supports light and dark themes out of the box, plus automatic system preference detection. Switch between themes programmatically:

```typescript title="src/imgly/config/settings.ts"
// 'light' | 'dark' | 'system' | (() => 'light' | 'dark')
cesdk.ui.setTheme('dark');
```

See [Theming](./user-interface/appearance/theming.md) for custom color schemes, CSS variables, and advanced styling options.

### Localization

Customize UI labels and add support for multiple languages. The i18n system supports translation keys for all UI elements:

```typescript title="src/imgly/config/i18n.ts"
// Override specific labels
cesdk.i18n.setTranslations({
  en: {
    'actions.export.image': 'Download Design',
    'common.cancel': 'Cancel',
    'common.apply': 'Apply'
  }
});

// Add a new language
cesdk.i18n.setTranslations({
  de: {
    'actions.export.image': 'Design herunterladen'
  }
});

// Set the active locale
cesdk.i18n.setLocale('de');
```

See [Localization](./user-interface/localization.md) for supported languages, translation key reference, and right-to-left language support.

### UI Layout

![CE.SDK Editor UI Areas](https://img.ly/docs/cesdk/../_shared/assets/CESDK-UI.png)

Customize the editor interface by modifying the dock, inspector bar, navigation bar, and canvas menu. CE.SDK provides Order APIs to control which components appear and in what sequence.

```typescript title="src/imgly/config/ui/navigationBar.ts"
// Get current navigation bar components
const navOrder = cesdk.ui.getNavigationBarOrder();

// Add a custom button to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  { id: 'my-custom-action' },
  'after'
);

// Rearrange dock items
cesdk.ui.setDockOrder([
  'ly.img.assetLibrary.dock',
  'ly.img.separator',
  'my-custom-dock-item'
]);

// Customize the inspector bar
cesdk.ui.setInspectorBarOrder([
  'ly.img.fill.inspectorBar',
  'ly.img.separator',
  'ly.img.filter.inspectorBar'
]);
```

The Order API methods follow a consistent pattern across all UI areas:

- `get*Order()` – Retrieve the current component order
- `set*Order()` – Replace the entire order
- `insert*OrderComponent()` – Add components relative to existing ones

See [Dock](./user-interface/customization/dock.md), [Inspector Bar](./user-interface/customization/inspector-bar.md), [Navigation Bar](./user-interface/customization/navigation-bar.md), [Canvas Menu](./user-interface/customization/canvas-menu.md), and [Canvas](./user-interface/customization/canvas.md) for detailed layout customization options.

### Custom Components

Build custom UI components using the builder system and integrate them in the editor. Custom components receive reactive state updates and can interact with the engine API.

```typescript title="src/imgly/config/ui/components.ts"
// Register a custom component
cesdk.ui.registerComponent('my-custom-button', ({ builder, engine }) => {
  const selectedBlocks = engine.block.findAllSelected();

  builder.Button('apply-effect', {
    label: 'Apply Effect',
    isDisabled: selectedBlocks.length === 0,
    onClick: () => {
      // Apply custom logic to selected blocks
    }
  });
});

// Add the component to the navigation bar
cesdk.ui.insertNavigationBarOrderComponent(
  'ly.img.spacer',
  'my-custom-button',
  'after'
);
```

Custom components automatically re-render when the engine state they depend on changes—no manual subscription management required.

See [Register New Component](./user-interface/ui-extensions/register-new-component.md) for the complete builder API and component patterns.

### Settings & Features

Fine-tune editor behavior through settings and features.

**Settings** configure core engine behavior—rendering, input handling, and history management:

```typescript title="src/imgly/config/settings.ts"
cesdk.engine.editor.setSettingBool('page/dimOutOfPageAreas', true);
cesdk.engine.editor.setSettingBool('mouse/enableZoomControl', true);
cesdk.engine.editor.setSettingBool('features/undoHistory', true);
```

**Features** toggle which editing tools and panels appear in the UI:

```typescript title="src/imgly/config/features.ts"
// Toggle editor features
cesdk.feature.enable('ly.img.crop', true);
cesdk.feature.enable('ly.img.filter', true);
cesdk.feature.enable('ly.img.adjustment', true);
```

See [Settings](./settings.md) and [Features](./user-interface/customization/disable-or-enable.md) for the complete reference.

### Explore Plugins

CE.SDK has a rich plugin ecosystem that extends the editor with powerful capabilities. Plugins can add new features, integrate third-party services, or customize editor behavior.

#### Background Removal

Add AI-powered background removal that runs entirely client-side. The background removal plugin processes images directly in the browser without sending data to external servers.

```typescript title="src/imgly/config/plugin.ts"
import BackgroundRemovalPlugin from '@imgly/plugin-background-removal';

// Add background removal capability
await cesdk.addPlugin(BackgroundRemovalPlugin());
```

See [Background Removal](./edit-image/remove-bg.md) for setup instructions and configuration options.

#### AI Integration

Extend the editor with generative AI capabilities for text-to-image generation, image enhancement, and intelligent editing features. CE.SDK integrates with various AI providers.

```typescript title="src/imgly/config/plugin.ts"
import AIPlugin from '@imgly/plugin-ai-generation';

// Configure AI generation
await cesdk.addPlugin(AIPlugin({
  provider: 'your-ai-provider',
  apiKey: 'your-api-key'
}));
```

See [AI Integration](./user-interface/ai-integration.md) for provider setup and supported AI features.

#### Custom Asset Sources

Connect external asset libraries like Unsplash, Getty Images, or your own content management system. Asset sources let users browse and insert content from any source.

```typescript title="src/imgly/config/plugin.ts"
import UnsplashAssetSource from '@imgly/plugin-unsplash';

// Add Unsplash integration
await cesdk.addPlugin(UnsplashAssetSource({
  accessKey: 'your-unsplash-access-key'
}));
```

See [Custom Asset Sources](./import-media/from-remote-source/unsplash.md) for integration patterns.

#### Discover More Plugins

Explore the full plugin ecosystem in the [IMG.LY plugins repository](https://github.com/imgly/plugins). Available plugins include:

- **Vectorizer** – Convert raster images to vectors
- **Design Presets** – Pre-built design templates
- **Social Media Templates** – Platform-specific sizing
- **And more** – Check the repository for the latest additions

***

## Key Capabilities

The Print-Ready PDF Editor includes everything needed for professional print production.

<CapabilityGrid
  features={[
  {
    title: 'PDF/X-4 & PDF/X-3 Compliance',
    description:
      'Export PDFs that meet print industry standards for professional printing workflows.',
    imageId: 'client-side',
  },
  {
    title: 'CMYK Color Profiles',
    description:
      'Support for ISO Coated v2 (FOGRA39) and GRACoL 2006 color profiles for accurate print colors.',
    imageId: 'filters',
  },
  {
    title: 'Bleed Margins',
    description:
      'Configurable bleed margins for professional print production with full edge-to-edge printing.',
    imageId: 'transform',
  },
  {
    title: 'Multi-Page Documents',
    description:
      'Create brochures, catalogs, and multi-page print designs with page range export options.',
    imageId: 'text-editing',
  },
  {
    title: 'Background Removal',
    description:
      'AI-powered background removal that runs entirely in the browser without server dependencies.',
    imageId: 'green-screen',
  },
  {
    title: 'Asset Libraries',
    description:
      'Access built-in collections of templates, stickers, shapes, and graphics, plus import custom assets.',
    imageId: 'asset-libraries',
  },
]}
/>

<br />

> **Free Trial:** [Sign up for a free trial](https://img.ly/forms/free-trial) to get a license key and remove the watermark.

***

## Troubleshooting

### Editor doesn't load

- **Check the container element exists**: Ensure your container element is in the DOM before calling `create()`
- **Verify the baseURL**: Assets must be accessible from the CDN or your self-hosted location
- **Check console errors**: Look for CORS or network errors in browser developer tools

### Assets don't appear

- **Check network requests**: Open DevTools Network tab and look for failed requests to `cdn.img.ly`
- **Self-host assets for production**: See [Serve Assets](./serve-assets.md) to host assets on your infrastructure

### PDF export fails

- **Check browser console**: Look for errors related to the print-ready PDF plugin
- **Verify color profile availability**: Ensure the selected color profile is loaded
- **Wait for content to load**: Ensure all images are fully loaded before exporting

### Watermark appears in production

- **Add your license key**: Set the `license` property in your configuration
- **Sign up for a trial**: Get a free trial license at [img.ly/forms/free-trial](https://img.ly/forms/free-trial)

***

## Next Steps

- [Configuration](./configuration.md) – Complete list of initialization options
- [Serve Assets](./serve-assets.md) – Self-host engine assets for production
- [Actions](./actions.md) – Build custom export and save workflows
- [Theming](./user-interface/appearance/theming.md) – Customize colors and appearance
- [Localization](./user-interface/localization.md) – Add translations and language support
- [Print Ready PDF](./plugins/print-ready-pdf.md) – Learn more about PDF/X-4 and PDF/X-3 export options



---

## More Resources

- **[Vanilla JS/TS Documentation Index](https://img.ly/docs/cesdk/js.md)** - Browse all Vanilla JS/TS documentation
- **[Complete Documentation](./llms-full.txt.md)** - Full documentation in one file (for LLMs)
- **[Web Documentation](./js.md)** - Interactive documentation with examples
- **[Support](mailto:support@img.ly)** - Contact IMG.LY support