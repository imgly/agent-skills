/**
 * Custom Components - Buttons, Panels, and UI Extensions
 *
 * Register custom UI components using the builder API.
 * Add custom buttons to the dock, navigation bar, or inspector bar.
 *
 * ## Component Registration
 *
 * - `cesdk.ui.registerComponent(id, renderFn)` - Register a custom component
 * - `cesdk.ui.registerPanel(id, renderFn)` - Register a custom panel
 *
 * ## Builder API
 *
 * The builder context provides methods to create UI elements:
 * - `builder.Button(id, options)` - Button
 * - `builder.ButtonGroup(id, options)` - Button group
 * - `builder.Checkbox(id, options)` - Checkbox
 * - `builder.ColorInput(id, options)` - Color picker
 * - `builder.Component(id, options)` - Embed another component
 * - `builder.Dropdown(id, options)` - Dropdown menu
 * - `builder.Heading(id, options)` - Heading text
 * - `builder.Library(id, options)` - Asset library
 * - `builder.MediaPreview(id, options)` - Media preview
 * - `builder.NumberInput(id, options)` - Number input
 * - `builder.Section(id, options)` - Section container
 * - `builder.Select(id, options)` - Dropdown select
 * - `builder.Separator(id)` - Visual separator
 * - `builder.Slider(id, options)` - Slider control
 * - `builder.Text(id, options)` - Text content
 * - `builder.TextArea(id, options)` - Multi-line text input
 * - `builder.TextInput(id, options)` - Single-line text input
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/register-new-component-b04a04/
 * @see https://img.ly/docs/cesdk/js/user-interface/ui-extensions/create-custom-panel-d87b83/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Register and configure custom UI components.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupComponents(cesdk: CreativeEditorSDK): void {
  // ============================================================================
  // ADD COMPONENTS TO UI
  // Uncomment to add custom components to the UI
  // ============================================================================
  // #region Add to Dock
  // const currentDockOrder = cesdk.ui.getComponentOrder({ in: 'ly.img.dock' });
  // cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [...currentDockOrder, 'ly.img.spacer', CUSTOM_BUTTON_ID]);
  // #endregion
  // ============================================================================
  // EXAMPLE: Navigation bar button that opens a custom panel
  // ============================================================================
  // #region Custom Component - Navigation bar button that opens a custom panel
  // cesdk.ui.registerComponent(
  //   'my-app.export.navigationBar',
  //   ({ builder }) => {
  //     builder.Button('export-button', {
  //       color: 'accent',
  //       variant: 'regular',
  //       label: 'Export',
  //       onClick: () => {
  //         if (cesdk.ui.isPanelOpen('my-app.export-panel')) {
  //           cesdk.ui.closePanel('my-app.export-panel');
  //         } else {
  //           cesdk.ui.openPanel('my-app.export-panel');
  //         }
  //       }
  //     });
  //   }
  // );
  // #endregion
  // ============================================================================
  // EXAMPLE: Custom panel with state management
  // ============================================================================
  // #region Custom Panel - Export options with state management
  // cesdk.i18n.setTranslations({
  //   en: {
  //     'panel.my-app.export-panel': 'Export Design',
  //     'formats/jpeg': 'JPEG',
  //     'formats/png': 'PNG',
  //     'formats/pdf': 'PDF'
  //   }
  // });
  //
  // cesdk.ui.registerPanel(
  //   'my-app.export-panel',
  //   ({ builder, engine, state }) => {
  //     const formatState = state<string>('format', 'jpeg');
  //     const loadingState = state<boolean>('loading', false);
  //
  //     builder.Section('format-section', {
  //       children: () => {
  //         builder.ButtonGroup('format', {
  //           children: () => {
  //             ['jpeg', 'png', 'pdf'].forEach((format) => {
  //               builder.Button(format, {
  //                 label: `formats/${format}`,
  //                 isActive: formatState.value === format,
  //                 onClick: () => formatState.setValue(format)
  //               });
  //             });
  //           }
  //         });
  //       }
  //     });
  //
  //     builder.Section('export-button', {
  //       children: () => {
  //         builder.Button('export', {
  //           label: 'Export Design',
  //           isLoading: loadingState.value,
  //           color: 'accent',
  //           onClick: async () => {
  //             loadingState.setValue(true);
  //             const scene = engine.scene.get();
  //             if (scene) {
  //               const mimeType =
  //                 formatState.value === 'pdf'
  //                   ? 'application/pdf'
  //                   : `image/${formatState.value}`;
  //               const blob = await engine.block.export(scene, { mimeType });
  //               console.log('Exported:', blob);
  //             }
  //             loadingState.setValue(false);
  //           }
  //         });
  //       }
  //     });
  //   }
  // );
  //
  // cesdk.ui.setPanelPosition('my-app.export-panel', 'right');
  // #endregion

  // ============================================================================
  // Custom Page Navigation Component
  // ============================================================================

  // highlight-page-select-icons
  // Add custom icons for page navigation arrows
  cesdk.ui.addIconSet(
    '@imgly/custom',
    `
      <svg>
        <symbol
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="@imgly/custom/icon/ArrowLeft"
        >
        <path d="M4.79289 12.7072L11.2929 19.2072L12.7071 17.793L7.91414 13H19V11H7.9143L12.7071 6.20718L11.2929 4.79297L4.79289 11.293C4.60536 11.4805 4.5 11.7349 4.5 12.0001C4.5 12.2653 4.60536 12.5196 4.79289 12.7072Z" fill="currentColor"/>
        </symbol>
        <symbol
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          id="@imgly/custom/icon/ArrowRight"
        >
        <path d="M19.2071 12.7072L12.7071 19.2072L11.2929 17.793L16.0858 13.0001H5V11.0001H16.0858L11.2929 6.20719L12.7071 4.79297L19.2071 11.293C19.3947 11.4805 19.5 11.7349 19.5 12.0001C19.5 12.2653 19.3947 12.5196 19.2071 12.7072Z" fill="currentColor"/>
        </symbol>
      </svg>
    `
  );
  // highlight-page-select-icons

  // highlight-page-select-component
  // Register custom page-select component for navigating templates with multiple pages
  // This provides a way to switch between pages in multi-page templates while
  // keeping the single-page editing mode experience

  function getPageName(
    engine: CreativeEditorSDK['engine'],
    pageId: number,
    useName = false
  ): string {
    if (!engine.block.isValid(pageId)) return '';
    const allPages = engine.scene.getPages();
    if (!allPages.includes(pageId)) return '';

    return (
      (useName && engine.block.getName(pageId)) ||
      `Page ${allPages.indexOf(pageId) + 1}`
    );
  }

  function switchAndSelectPage(newPage: number) {
    cesdk.unstable_switchPage(newPage);
    // Select the new page
    cesdk.engine.block.select(newPage);
  }

  let lastActivePageIndex = 0;
  cesdk.ui.registerComponent('page-select', ({ builder, engine }) => {
    const pageIds = engine.scene.getPages();
    const activePageId = engine.scene.getCurrentPage();

    // If a user deletes the current page, manually switch to another page
    if (activePageId !== null && !pageIds.includes(activePageId)) {
      const newPage =
        pageIds[lastActivePageIndex] ??
        pageIds[lastActivePageIndex - 1] ??
        pageIds[0];
      if (newPage !== undefined) {
        switchAndSelectPage(newPage);
      }
    }
    if (activePageId !== null) {
      lastActivePageIndex = pageIds.indexOf(activePageId);
    }

    // If there is only one page, don't show the page select component
    if (pageIds.length <= 1) return;

    // If there are less than 4 pages, show all pages as buttons
    if (pageIds.length <= 3) {
      builder.ButtonGroup('pages', {
        children: () => {
          pageIds.forEach((id) => {
            builder.Button(String(id), {
              label: getPageName(engine, id, true),
              isActive: activePageId === id,
              onClick: () => activePageId !== id && switchAndSelectPage(id)
            });
          });
        }
      });
    } else {
      // If there are more than 3 pages, show prev/next buttons with dropdown
      const activePageIndex =
        activePageId !== null ? pageIds.indexOf(activePageId) : 0;
      const prevPageId = pageIds[activePageIndex - 1];
      const nextPageId = pageIds[activePageIndex + 1];

      builder.ButtonGroup('pagesControls', {
        children: () => {
          builder.Button('prevPage', {
            tooltip: 'Previous Page',
            icon: '@imgly/custom/icon/ArrowLeft',
            isDisabled: prevPageId === undefined,
            onClick: () =>
              prevPageId !== undefined && switchAndSelectPage(prevPageId)
          });

          builder.Dropdown('pageSelect', {
            tooltip: 'Select Page',
            label: `${activePageId !== null ? getPageName(engine, activePageId) : ''} / ${pageIds.length}`,
            children: ({ close }) => {
              pageIds.forEach((id) => {
                builder.Button(String(id), {
                  label: engine.block.getName(id) || getPageName(engine, id),
                  isActive: activePageId === id,
                  onClick: () => {
                    switchAndSelectPage(id);
                    close();
                  }
                });
              });
            }
          });

          builder.Button('nextPage', {
            tooltip: 'Next Page',
            icon: '@imgly/custom/icon/ArrowRight',
            isDisabled: nextPageId === undefined,
            onClick: () =>
              nextPageId !== undefined && switchAndSelectPage(nextPageId)
          });
        }
      });
    }
  });
  // highlight-page-select-component
}
