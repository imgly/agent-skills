/**
 * Export Design Panel Plugin
 *
 * Provides advanced export options for CE.SDK designs including:
 * - Format selection (JPEG, PNG, PDF)
 * - Quality settings for image exports
 * - Resolution control with custom dimensions
 * - Page range selection for multi-page documents
 *
 * @example
 * ```typescript
 * import { setupExportDesignPanel } from './plugins/export-design-panel';
 *
 * // After SDK is initialized
 * setupExportDesignPanel(cesdk);
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/export/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { CreativeEngine, ImageMimeType } from '@cesdk/cesdk-js';

// ============================================================================
// Constants and Types
// ============================================================================

// highlight-available-formats
const AVAILABLE_FORMATS = [
  'image/jpeg',
  'image/png',
  'application/pdf'
] as const;
// highlight-available-formats

type Formats = (typeof AVAILABLE_FORMATS)[number];

// highlight-enums
enum PageAmountType {
  ALL = 'all',
  RANGE = 'range'
}

enum ResolutionItemValue {
  Small = 'small',
  Original = 'original',
  Large = 'large',
  Huge = 'huge',
  Custom = 'custom'
}

enum QualityType {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  VeryHigh = 'very-high',
  Maximum = 'maximum'
}
// highlight-enums

// highlight-quality-settings
const QualityJpeg = {
  [QualityType.Low]: 0.2,
  [QualityType.Medium]: 0.4,
  [QualityType.High]: 0.6,
  [QualityType.VeryHigh]: 0.8,
  [QualityType.Maximum]: 1
};

const QualityPng = {
  [QualityType.Low]: 9,
  [QualityType.Medium]: 7,
  [QualityType.High]: 5,
  [QualityType.VeryHigh]: 3,
  [QualityType.Maximum]: 1
};
// highlight-quality-settings

const QUALITY_SELECT_VALUES = [
  { id: QualityType.Low, label: `quality/${QualityType.Low}` },
  { id: QualityType.Medium, label: `quality/${QualityType.Medium}` },
  { id: QualityType.High, label: `quality/${QualityType.High}` },
  { id: QualityType.VeryHigh, label: `quality/${QualityType.VeryHigh}` },
  { id: QualityType.Maximum, label: `quality/${QualityType.Maximum}` }
];

const QUALITY_DEFAULT_VALUE = QUALITY_SELECT_VALUES[2];

type ResolutionScaleValue = Exclude<
  ResolutionItemValue,
  ResolutionItemValue.Custom
>;

// highlight-resolution-settings
const RESOLUTION_SCALE: Record<ResolutionScaleValue, number> = {
  [ResolutionItemValue.Small]: 0.5,
  [ResolutionItemValue.Original]: 1,
  [ResolutionItemValue.Large]: 1.5,
  [ResolutionItemValue.Huge]: 2
};

const MAX_RESOLUTION = 4000;
// highlight-resolution-settings

const RESOLUTION_SELECT_VALUES = [
  {
    id: ResolutionItemValue.Small,
    label: `resolution/${ResolutionItemValue.Small}`
  },
  {
    id: ResolutionItemValue.Original,
    label: `resolution/${ResolutionItemValue.Original}`
  },
  {
    id: ResolutionItemValue.Large,
    label: `resolution/${ResolutionItemValue.Large}`
  },
  {
    id: ResolutionItemValue.Huge,
    label: `resolution/${ResolutionItemValue.Huge}`
  },
  {
    id: ResolutionItemValue.Custom,
    label: `resolution/${ResolutionItemValue.Custom}`
  }
];

const RESOLUTION_DEFAULT_VALUE = RESOLUTION_SELECT_VALUES[1];

type SelectValue = { id: string; label: string | string[] };

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse a page range string into an array of page block IDs.
 *
 * @param scenePages - Array of page block IDs from the scene
 * @param pageRange - Page range string (e.g., "1,2-4,6")
 * @returns Array of page block IDs that match the range
 * @throws Error if the page range format is invalid
 */
// highlight-get-pages-from-range
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
// highlight-get-pages-from-range

/**
 * Create a description string showing the export dimensions in pixels.
 */
const createDescription = (
  engine: CreativeEngine,
  scene: number | null,
  scale: number,
  pageWidth: number,
  pageHeight: number
) => {
  const designUnit = scene
    ? engine.block.getEnum(scene, 'scene/designUnit')
    : 'Pixel';
  const defaultDPI = scene ? engine.block.getFloat(scene, 'scene/dpi') : 300;

  const dpi = defaultDPI * scale;

  let width = pageWidth * scale;
  let height = pageHeight * scale;

  if (designUnit === 'Millimeter') {
    width = Math.round((pageWidth * dpi) / 25.4);
    height = Math.round((pageHeight * dpi) / 25.4);
  }

  if (designUnit === 'Inch') {
    width = Math.round(pageWidth * dpi);
    height = Math.round(pageHeight * dpi);
  }

  return `${width} x ${height} px`;
};

/**
 * Export the design with the specified options.
 *
 * For PDF format, exports all specified pages as a single PDF file.
 * For image formats, exports each page as a separate image file.
 */
// highlight-export-design
const exportDesign = async (
  cesdk: CreativeEditorSDK,
  pageRange: string,
  mimeType:
    | 'application/pdf'
    | 'application/octet-stream'
    | ImageMimeType
    | undefined,
  scale: number,
  qualityType: QualityType
) => {
  const engine = cesdk.engine;
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
  // the export will create a single PDF and download it
  if (mimeType === 'application/pdf') {
    const hiddenPages = pages.filter(
      (id: number) => !filteredPages.includes(id)
    );

    // hide pages from export that are not specified in the range
    hiddenPages.forEach((id: number) => {
      engine.block.setVisible(id, false);
    });

    const blob = await engine.block.export(scene, { mimeType: mimeType });

    hiddenPages.forEach((id: number) => {
      engine.block.setVisible(id, true);
    });

    await cesdk.utils.downloadFile(blob, mimeType);
  } else {
    // resize the exported image
    const exportPageWidth =
      engine.block.getFloat(scene, 'scene/pageDimensions/width') * scale;
    const exportPageHeight =
      engine.block.getFloat(scene, 'scene/pageDimensions/height') * scale;

    // each page will be exported and downloaded separately
    for (let i = 0; i < filteredPages.length; i++) {
      const blob = await engine.block.export(filteredPages[i], {
        mimeType: mimeType,
        targetWidth: exportPageWidth,
        targetHeight: exportPageHeight,
        jpegQuality: QualityJpeg[qualityType],
        pngCompressionLevel: QualityPng[qualityType]
      });

      await cesdk.utils.downloadFile(blob, mimeType);
    }
  }
};
// highlight-export-design

// ============================================================================
// Setup Function
// ============================================================================

/**
 * Setup the Export Design Panel plugin.
 *
 * Registers the export button component and export panel with full
 * customization options for format, quality, resolution, and page range.
 *
 * @param cesdk - The CreativeEditorSDK instance
 */
// highlight-setup-function
export function setupExportDesignPanel(cesdk: CreativeEditorSDK): void {
  // Register translations for the export panel
  cesdk.i18n.setTranslations({
    en: {
      'panel.//ly.img.panel/export': 'Export Design',
      ['formats/image/jpeg']: 'JPEG',
      ['formats/image/png']: 'PNG',
      ['formats/application/pdf']: 'PDF',
      ['formats/application/pdf.description']: 'Best for Printing',
      ['formats/image/jpeg.description']: 'Shareable web format',
      ['formats/image/png.description']: 'Complex Images with Transparency',
      [`pages/all`]: 'All',
      [`pages/range`]: 'Range',
      [`quality/${QualityType.Low}`]: 'Low',
      [`quality/${QualityType.Medium}`]: 'Medium',
      [`quality/${QualityType.High}`]: 'High',
      [`quality/${QualityType.VeryHigh}`]: 'Very High',
      [`quality/${QualityType.Maximum}`]: 'Maximum',
      [`resolution/${ResolutionItemValue.Small}`]: 'Small',
      [`resolution/${ResolutionItemValue.Original}`]: 'Original',
      [`resolution/${ResolutionItemValue.Large}`]: 'Large',
      [`resolution/${ResolutionItemValue.Huge}`]: 'Huge',
      [`resolution/${ResolutionItemValue.Custom}`]: 'Custom'
    }
  });

  // Register the navigation bar export button
  // highlight-register-component
  cesdk.ui.registerComponent(
    'ly.img.export-options-design.navigationBar',
    ({ builder }) => {
      builder.Button('export-button', {
        color: 'accent',
        variant: 'regular',
        label: 'common.export',
        onClick: () => {
          if (cesdk.ui.isPanelOpen('//ly.img.panel/export')) {
            cesdk.ui.closePanel('//ly.img.panel/export');
          } else {
            cesdk.ui.openPanel('//ly.img.panel/export');
          }
        }
      });
    }
  );
  // highlight-register-component

  // Register the export panel
  // highlight-register-panel
  cesdk.ui.registerPanel(
    '//ly.img.panel/export',
    ({ builder, engine, state }) => {
      const formatState = state<Formats>('format', AVAILABLE_FORMATS[0]);
      const pagesState = state<PageAmountType>('pages', PageAmountType.ALL);

      const rangeInputState = state<string>('rangeInput', '');
      const rangeInputErrorState = state<string | undefined>('rangeInputError');
      const rangePageState = state<number[]>('rangePages', []);

      const maxErrorWidth = state<boolean>('maxErrorWidth', false);
      const maxErrorHeight = state<boolean>('maxErrorHeight', false);

      const qualityState = state<SelectValue>('quality', QUALITY_DEFAULT_VALUE);
      const resolutionState = state<SelectValue>(
        'resolution',
        RESOLUTION_DEFAULT_VALUE
      );

      const scale =
        RESOLUTION_SCALE[resolutionState.value.id as ResolutionItemValue];
      const customScaleState = state<number>('custom-resolution-scale', 1);

      // Format selection section
      builder.Section('format-section', {
        children: () => {
          builder.ButtonGroup('format', {
            children: () => {
              AVAILABLE_FORMATS.forEach((format) => {
                builder.Button(format, {
                  label: `formats/${format}`,
                  isActive: formatState.value === format,
                  onClick: () => formatState.setValue(format)
                });
              });
            }
          });

          builder.Text('format-description', {
            content: `formats/${formatState.value}.description`,
            align: 'center'
          });
        }
      });

      // Page selection section
      builder.Section('pages-section', {
        children: () => {
          builder.ButtonGroup('pages', {
            inputLabel: 'Pages',
            children: () => {
              [PageAmountType.ALL, PageAmountType.RANGE].forEach((format) => {
                builder.Button(format, {
                  label: `pages/${format}`,
                  isActive: pagesState.value === format,
                  onClick: () => pagesState.setValue(format)
                });
              });
            }
          });

          if (pagesState.value === 'range') {
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

      // Quality and resolution section (only for image formats)
      if (formatState.value !== 'application/pdf') {
        builder.Section('export-quality', {
          children: () => {
            builder.Select('quality', {
              inputLabel: 'Quality',
              values: QUALITY_SELECT_VALUES,
              value: qualityState.value,
              setValue: qualityState.setValue,
              tooltip:
                'Select the quality of the exported image. Higher quality increases the file size and export time.'
            });
            const scene = engine.scene.get();

            const pageWidth =
              scene != null
                ? engine.block.getFloat(scene, 'scene/pageDimensions/width')
                : 0;
            const pageHeight =
              scene != null
                ? engine.block.getFloat(scene, 'scene/pageDimensions/height')
                : 0;

            builder.Select('resolution', {
              inputLabel: 'Resolution',
              values: RESOLUTION_SELECT_VALUES,
              value: resolutionState.value,
              setValue: resolutionState.setValue
            });

            if (scale != null) {
              builder.Text('resolution-description', {
                content: createDescription(
                  engine,
                  scene,
                  resolutionState.value.id === ResolutionItemValue.Custom
                    ? customScaleState.value
                    : scale,
                  pageWidth,
                  pageHeight
                ),
                align: 'right'
              });
            }

            if (resolutionState.value.id === ResolutionItemValue.Custom) {
              const widthState = state<number>(
                'custom-resolution-width',
                pageWidth
              );
              const heightState = state<number>(
                'custom-resolution-height',
                pageHeight
              );

              builder.NumberInput('custom-resolution-height', {
                inputLabel: 'Height',
                min: 1,
                max: MAX_RESOLUTION,
                step: 1,
                value: heightState.value,
                setValue: (newHeight) => {
                  // set the height and keep the aspect ratio for the width
                  heightState.setValue(newHeight);
                  const newWidth = (pageWidth * newHeight) / pageHeight;
                  widthState.setValue(newWidth);
                  // set the pixel scale for the export
                  customScaleState.setValue(newHeight / pageHeight);

                  maxErrorWidth.setValue(newWidth > MAX_RESOLUTION);
                  maxErrorHeight.setValue(newHeight > MAX_RESOLUTION);
                }
              });
              builder.NumberInput('custom-resolution-width', {
                inputLabel: 'Width',
                min: 1,
                max: MAX_RESOLUTION,
                step: 1,
                value: widthState.value,
                setValue: (newWidth) => {
                  // set the width and keep the aspect ratio for height
                  widthState.setValue(newWidth);
                  const newHeight = (pageHeight * newWidth) / pageWidth;
                  heightState.setValue(newHeight);
                  // set the pixel scale value for the export
                  customScaleState.setValue(newWidth / pageWidth);

                  maxErrorWidth.setValue(newWidth > MAX_RESOLUTION);
                  maxErrorHeight.setValue(newHeight > MAX_RESOLUTION);
                }
              });

              if (maxErrorWidth.value || maxErrorHeight.value) {
                builder.Text('custom-resolution-maxError', {
                  content: `Height or width can't be greater than ${MAX_RESOLUTION}`,
                  align: 'right'
                });
              }
            }
          }
        });
      }

      // Export button section
      builder.Section('export-button', {
        children: () => {
          const loadingState = state<boolean>('loading', false);
          builder.Button('export', {
            label: 'Export Design',
            isLoading: loadingState.value,
            isDisabled: maxErrorWidth.value || maxErrorHeight.value,
            color: 'accent',
            onClick: async () => {
              loadingState.setValue(true);

              await exportDesign(
                cesdk,
                rangeInputState.value,
                formatState.value,
                resolutionState.value.id === ResolutionItemValue.Custom
                  ? customScaleState.value
                  : RESOLUTION_SCALE[
                      resolutionState.value.id as ResolutionScaleValue
                    ],
                qualityState.value.id as QualityType
              );

              loadingState.setValue(false);
            }
          });
        }
      });
    }
  );
  // highlight-register-panel

  // Set panel position
  cesdk.ui.setPanelPosition(
    '//ly.img.panel/export',
    'right' as 'left' | 'right'
  );

  // Insert to navigation bar
  cesdk.ui.insertOrderComponent(
    { in: 'ly.img.navigation.bar', position: 'end' },
    {
      id: 'ly.img.export-options-design.navigationBar'
    }
  );
}
// highlight-setup-function
