/**
 * Custom Components - Buttons, Panels, and UI Extensions
 *
 * Register custom UI components using the builder API.
 * Add custom buttons to the dock, navigation bar, or inspector bar.
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

  // Suppress unused variable warning
  void cesdk;
}
