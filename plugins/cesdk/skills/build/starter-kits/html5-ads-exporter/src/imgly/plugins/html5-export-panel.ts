/**
 * HTML5 Export Panel Plugin
 *
 * Provides HTML5 export options for CE.SDK designs including:
 * - Format selection (Embedded single HTML vs External with separate assets)
 * - Text rendering mode (HTML text vs Vectorized)
 * - Page index selection for multi-page scenes
 * - Preview in new tab
 * - Download as ZIP
 *
 * @example
 * ```typescript
 * import { Html5ExportPanelPlugin } from './plugins/html5-export-panel';
 *
 * await cesdk.addPlugin(new Html5ExportPanelPlugin());
 * ```
 *
 * @see https://img.ly/docs/cesdk/js/export/to-html5/
 */

import type { EditorPlugin, EditorPluginContext } from '@cesdk/cesdk-js';
import CreativeEditorSDK from '@cesdk/cesdk-js';
import { exportHtml, injectGsapPlayer } from '@imgly/html-exporter';

// ============================================================================
// Constants and Types
// ============================================================================

// highlight-available-formats
const AVAILABLE_FORMATS = ['embedded', 'external'] as const;
type Format = (typeof AVAILABLE_FORMATS)[number];

const AVAILABLE_TEXT_MODES = ['html', 'vector'] as const;
type TextMode = (typeof AVAILABLE_TEXT_MODES)[number];
// highlight-available-formats

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Download a blob as a file to the user's device.
 */
// highlight-local-download
const localDownload = (data: Blob, filename: string): void => {
  const element = document.createElement('a');
  element.setAttribute('href', URL.createObjectURL(data));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
// highlight-local-download

// ============================================================================
// Plugin Class
// ============================================================================

/**
 * HTML5 Export Panel plugin.
 *
 * Registers an export button in the navigation bar and a custom panel
 * with options for format, text mode, and page selection.
 *
 * @public
 */
// highlight-plugin-class
export class Html5ExportPanelPlugin implements EditorPlugin {
  name = 'html5-export-panel';
  version = CreativeEditorSDK.version;

  async initialize({ cesdk }: EditorPluginContext) {
    if (!cesdk) return;

    // Register translations for the export panel
    cesdk.i18n.setTranslations({
      en: {
        'panel.//ly.img.panel/html5-export': 'Export HTML5',
        'html5-export.format/embedded': 'Embedded',
        'html5-export.format/external': 'External',
        'html5-export.format/embedded.description':
          'Single self-contained HTML file with base64-embedded assets',
        'html5-export.format/external.description':
          'HTML file with separate image and font asset files',
        'html5-export.textMode/html': 'HTML Text',
        'html5-export.textMode/vector': 'Vector',
        'html5-export.textMode/html.description':
          'Selectable and searchable text with CSS styling',
        'html5-export.textMode/vector.description':
          'Pixel-perfect vectorized text (not selectable)'
      }
    });

    // Register the navigation bar export button
    // highlight-register-component
    cesdk.ui.registerComponent(
      'ly.img.html5-export.navigationBar',
      ({ builder }) => {
        builder.Button('html5-export-button', {
          color: 'accent',
          variant: 'regular',
          label: 'common.export',
          onClick: () => {
            if (cesdk.ui.isPanelOpen('//ly.img.panel/html5-export')) {
              cesdk.ui.closePanel('//ly.img.panel/html5-export');
            } else {
              cesdk.ui.openPanel('//ly.img.panel/html5-export');
            }
          }
        });
      }
    );
    // highlight-register-component

    // Register the export panel
    // highlight-register-panel
    cesdk.ui.registerPanel(
      '//ly.img.panel/html5-export',
      ({ builder, engine, state }) => {
        const formatState = state<Format>('format', 'embedded');
        const textModeState = state<TextMode>('textMode', 'html');
        const pageIndexState = state<number>('pageIndex', 0);

        // Get the number of pages in the scene
        const pages = engine.block.findByType('page');
        const pageCount = pages.length;

        // ============================
        // Format Selection
        // ============================
        builder.Section('format-section', {
          children: () => {
            builder.ButtonGroup('format', {
              inputLabel: 'Format',
              children: () => {
                AVAILABLE_FORMATS.forEach((format) => {
                  builder.Button(format, {
                    label: `html5-export.format/${format}`,
                    isActive: formatState.value === format,
                    onClick: () => formatState.setValue(format)
                  });
                });
              }
            });

            builder.Text('format-description', {
              content: `html5-export.format/${formatState.value}.description`,
              align: 'center'
            });
          }
        });

        // ============================
        // Text Mode Selection
        // ============================
        builder.Section('text-mode-section', {
          children: () => {
            builder.ButtonGroup('textMode', {
              inputLabel: 'Text Mode',
              children: () => {
                AVAILABLE_TEXT_MODES.forEach((mode) => {
                  builder.Button(mode, {
                    label: `html5-export.textMode/${mode}`,
                    isActive: textModeState.value === mode,
                    onClick: () => textModeState.setValue(mode)
                  });
                });
              }
            });

            builder.Text('text-mode-description', {
              content: `html5-export.textMode/${textModeState.value}.description`,
              align: 'center'
            });
          }
        });

        // ============================
        // Page Index Selection (multi-page)
        // ============================
        if (pageCount > 1) {
          builder.Section('page-section', {
            children: () => {
              builder.NumberInput('pageIndex', {
                inputLabel: 'Page',
                min: 1,
                max: pageCount,
                step: 1,
                value: pageIndexState.value + 1,
                setValue: (newValue) => {
                  pageIndexState.setValue(
                    Math.max(0, Math.min(newValue - 1, pageCount - 1))
                  );
                }
              });
              builder.Text('page-info', {
                content: `Page ${pageIndexState.value + 1} of ${pageCount}`,
                align: 'right'
              });
            }
          });
        }

        // ============================
        // Export Actions
        // ============================
        builder.Section('export-actions', {
          children: () => {
            const loadingPreviewState = state<boolean>('loadingPreview', false);
            const loadingZipState = state<boolean>('loadingZip', false);
            const isLoading =
              loadingPreviewState.value || loadingZipState.value;

            // Export & Preview button
            builder.Button('export-preview', {
              label: 'Export & Preview',
              isLoading: loadingPreviewState.value,
              isDisabled: isLoading,
              color: 'accent',
              onClick: async () => {
                loadingPreviewState.setValue(true);
                try {
                  // Export as embedded HTML for preview
                  const result = await exportHtml(engine, {
                    format: 'embedded',
                    pageIndex: pageIndexState.value,
                    textMode: textModeState.value,
                    animated: true
                  });

                  const htmlFile = result.files.get('index.html');
                  if (!htmlFile) {
                    throw new Error('Export did not produce an HTML file');
                  }

                  const rawHtml =
                    typeof htmlFile.content === 'string'
                      ? htmlFile.content
                      : new TextDecoder().decode(htmlFile.content);

                  const htmlContent = injectGsapPlayer(rawHtml, {
                    autoplay: true
                  });

                  // Open preview in new tab
                  const blob = new Blob([htmlContent], { type: 'text/html' });
                  window.open(URL.createObjectURL(blob), '_blank');

                  // Log any warnings
                  if (result.messages && result.messages.length > 0) {
                    for (const msg of result.messages) {
                      console.log(`[${msg.type}] ${msg.message}`);
                    }
                  }
                } catch (error) {
                  console.error('HTML5 export preview failed:', error);
                } finally {
                  loadingPreviewState.setValue(false);
                }
              }
            });

            // Download ZIP button
            builder.Button('download-zip', {
              label: 'Download ZIP',
              isLoading: loadingZipState.value,
              isDisabled: isLoading,
              onClick: async () => {
                loadingZipState.setValue(true);
                try {
                  // Export with external format for ZIP
                  const result = await exportHtml(engine, {
                    format: 'external',
                    pageIndex: pageIndexState.value,
                    textMode: textModeState.value,
                    animated: true
                  });

                  // Package as ZIP and download
                  const zip = await result.files.toZip();
                  const blob = new Blob([zip.buffer as ArrayBuffer], {
                    type: 'application/zip'
                  });
                  localDownload(blob, 'html5-export.zip');

                  // Log any warnings
                  if (result.messages && result.messages.length > 0) {
                    for (const msg of result.messages) {
                      console.log(`[${msg.type}] ${msg.message}`);
                    }
                  }
                } catch (error) {
                  console.error('HTML5 ZIP download failed:', error);
                } finally {
                  loadingZipState.setValue(false);
                }
              }
            });
          }
        });
      }
    );
    // highlight-register-panel

    // Set panel position
    cesdk.ui.setPanelPosition(
      '//ly.img.panel/html5-export',
      'right' as 'left' | 'right'
    );

    // Insert to navigation bar
    cesdk.ui.insertOrderComponent(
      { in: 'ly.img.navigation.bar', position: 'end' },
      {
        id: 'ly.img.html5-export.navigationBar'
      }
    );
  }
}
// highlight-plugin-class
