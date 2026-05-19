/**
 * Export Print-Ready PDF Panel Plugin
 *
 * This plugin provides a custom export panel for creating print-ready PDFs
 * with PDF/X-3 compliance, CMYK color profiles, bleed margins, and page range selection.
 *
 * @see https://img.ly/docs/cesdk/js/export/
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
 * - Bleed margin configuration
 * - Color profile selection (CMYK/RGB)
 * - Page range selection
 * - PDF/X-3 compliance
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
        'panel.//ly.img.panel/export-print-ready-pdf': 'Export PDF/X-3',
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

                await exportPrintReadyPDF(
                  engine,
                  rangeInputState.value,
                  colorProfileState.value.id as ColorProfile,
                  bleedEnabledState.value,
                  bleedMarginState.value
                );

                loadingState.setValue(false);
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
 * Export the scene as a print-ready PDF/X-3
 *
 * @param engine - The Creative Engine instance
 * @param pageRange - Page range string (e.g., "1,2-5")
 * @param colorProfile - Color profile to use (fogra39, gracol, srgb)
 * @param bleedEnabled - Whether to include bleed margins
 * @param bleedMargin - Bleed margin size in mm
 */
// highlight-export-function
const exportPrintReadyPDF = async (
  engine: CreativeEngine,
  pageRange: string,
  colorProfile: ColorProfile,
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

  const { convertToPDFX3 } = (await import(
    /* webpackIgnore: true */
    // @ts-expect-error - Dynamic import from CDN, TypeScript cannot resolve this
    'https://cdn.jsdelivr.net/npm/@imgly/plugin-print-ready-pdfs-web@1.0.0/dist/index.mjs'
  )) as {
    convertToPDFX3: (
      blob: Blob,
      options: { outputProfile: string; title: string }
    ) => Promise<Blob>;
  };

  // Convert to print-ready PDF/X-3
  const printReadyPDF = await convertToPDFX3(pdfBlob, {
    outputProfile: colorProfile,
    title: 'Print-Ready Export'
  });

  await localDownload(printReadyPDF, 'my-design-print-ready');
};
// highlight-export-function
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
