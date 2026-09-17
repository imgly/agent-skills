/**
 * Export Print-Ready PDF Panel Plugin
 *
 * This plugin provides a custom export panel for creating print-ready PDFs
 * with PDF/X-4 or PDF/X-3 compliance, CMYK color profiles, bleed margins, and page range selection.
 *
 * @see https://img.ly/docs/cesdk/js/export-save-publish/export/overview-9ed3a8/
 */

import type { CreativeEngine, EditorPlugin } from '@cesdk/cesdk-js';

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

const MILLIMETRES_PER_INCH = 25.4;

const MARGIN_PROPERTIES = [
  'page/margin/top',
  'page/margin/bottom',
  'page/margin/left',
  'page/margin/right'
];
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
// highlight-export-plugin
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
        // highlight-standard-section
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
        // highlight-standard-section
        // #endregion

        // #region Bleed Margin Section
        // highlight-bleed-section
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
        // highlight-bleed-section
        // #endregion

        // #region Color Profile Section
        // highlight-color-profile-section
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
        // highlight-color-profile-section
        // #endregion

        // #region Pages Section
        // highlight-pages-section
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
        // highlight-pages-section
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
                  const printReadyPDF = await exportPrintReadyPDF(engine, {
                    pageRange:
                      pagesState.value === PageAmountType.CUSTOM
                        ? rangeInputState.value
                        : '',
                    colorProfile: colorProfileState.value.id as ColorProfile,
                    outputStandard: standardState.value.id as PDFXStandard,
                    bleedEnabled: bleedEnabledState.value,
                    bleedMargin: bleedMarginState.value
                  });
                  await localDownload(printReadyPDF, 'my-design-print-ready');
                } catch (error: unknown) {
                  cesdk.ui.showNotification({
                    type: 'error',
                    message:
                      error instanceof Error
                        ? error.message
                        : 'Print-ready PDF export failed.',
                    duration: 'medium'
                  });
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
// highlight-export-plugin

// #region Export Function
/**
 * Millimetres expressed in the scene's own design unit.
 *
 * `page/margin/*` is read in design units, so a millimetre value has to be
 * converted or the printed bleed is not the one the user asked for.
 */
const millimetresInDesignUnit = (
  engine: CreativeEngine,
  millimetres: number
): number => {
  const scene = engine.scene.get();
  if (scene == null) {
    return millimetres;
  }
  const inches = millimetres / MILLIMETRES_PER_INCH;
  switch (engine.scene.getDesignUnit()) {
    case 'Millimeter':
      return millimetres;
    case 'Inch':
      return inches;
    default:
      return inches * engine.block.getFloat(scene, 'scene/dpi');
  }
};

interface PageMargins {
  enabled: boolean;
  margins: number[];
}

const readMargins = (engine: CreativeEngine, pageId: number): PageMargins => ({
  enabled: engine.block.getBool(pageId, 'page/marginEnabled'),
  margins: MARGIN_PROPERTIES.map((property) =>
    engine.block.getFloat(pageId, property)
  )
});

const writeMargins = (
  engine: CreativeEngine,
  pageId: number,
  { enabled, margins }: PageMargins
): void => {
  MARGIN_PROPERTIES.forEach((property, index) => {
    engine.block.setFloat(pageId, property, margins[index]);
  });
  engine.block.setBool(pageId, 'page/marginEnabled', enabled);
};

export interface PrintReadyPDFOptions {
  /** Page range such as `1,3-5`. Empty exports every page. */
  pageRange: string;
  colorProfile: ColorProfile;
  outputStandard: PDFXStandard;
  bleedEnabled: boolean;
  /** Bleed margin in millimetres. */
  bleedMargin: number;
}

/**
 * Export the scene as a print-ready PDF/X-4 or PDF/X-3.
 *
 * The scene is left exactly as it was found: the bleed margins and the page
 * visibility this function changes are restored before it returns.
 *
 * @param engine - The Creative Engine instance
 * @param options - Page range, colour profile, PDF/X standard and bleed
 * @returns The converted PDF/X document
 */
// highlight-export-function
export const exportPrintReadyPDF = async (
  engine: CreativeEngine,
  options: PrintReadyPDFOptions
): Promise<Blob> => {
  const { pageRange, colorProfile, outputStandard, bleedEnabled, bleedMargin } =
    options;

  const scene = engine.scene.get();
  if (scene == null) {
    throw new Error('No scene to export');
  }

  const pages = engine.scene.getPages();
  const filteredPages = getPagesFromRange(pages, pageRange);
  const hiddenPages = pages.filter((id: number) => !filteredPages.includes(id));

  const previousMargins = new Map(
    pages.map((id: number) => [id, readMargins(engine, id)])
  );

  try {
    if (bleedEnabled && bleedMargin > 0) {
      const bleed = millimetresInDesignUnit(engine, bleedMargin);
      filteredPages.forEach((pageId: number) => {
        writeMargins(engine, pageId, {
          enabled: true,
          margins: MARGIN_PROPERTIES.map(() => bleed)
        });
      });
    }

    hiddenPages.forEach((id: number) => {
      engine.block.setVisible(id, false);
    });

    const pdfBlob = await engine.block.export(scene, {
      mimeType: 'application/pdf'
    });

    // Lazily load the print-ready PDF plugin so its Ghostscript WASM payload is
    // only fetched when the user actually exports. Resolves to the installed
    // @imgly/plugin-print-ready-pdfs-web package (bundled as its own chunk), not
    // a runtime CDN URL.
    const { convertToPDFX } =
      await import('@imgly/plugin-print-ready-pdfs-web');

    // Convert to the selected print-ready PDF/X standard (defaults to PDF/X-4)
    return await convertToPDFX(pdfBlob, {
      outputProfile: colorProfile,
      outputStandard,
      title: 'Print-Ready Export'
    });
  } finally {
    hiddenPages.forEach((id: number) => {
      engine.block.setVisible(id, true);
    });
    previousMargins.forEach((margins, id) => {
      writeMargins(engine, id, margins);
    });
  }
};
// highlight-export-function
// #endregion

// #region Helper Functions
/**
 * Parse page range string and return array of page IDs
 */
export const getPagesFromRange = (
  scenePages: number[],
  pageRange: string
): number[] => {
  if (!pageRange) {
    return scenePages;
  }
  // The regex pattern for matching valid page ranges
  const regexPattern = /^(\d+-\d+|\d+)(,(\d+-\d+|\d+))*$/;

  // Test the input page range against the regex pattern
  if (!regexPattern.test(pageRange.replace(/\s/g, ''))) {
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
