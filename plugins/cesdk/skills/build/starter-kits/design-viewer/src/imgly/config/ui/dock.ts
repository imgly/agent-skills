/**
 * Dock Configuration - Left Side Asset Panel
 *
 * Configure the asset dock to control which asset libraries appear.
 * Each dock entry opens a panel with assets from the specified sources.
 *
 * @see https://img.ly/docs/cesdk/js/user-interface/customization/dock-cb916c/
 * @see https://img.ly/docs/cesdk/js/user-interface/appearance/icons-679e32/
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Configure the dock panel layout.
 *
 * @param cesdk - The CreativeEditorSDK instance to configure
 */
export function setupDock(cesdk: CreativeEditorSDK): void {
  // #region Dock Order
  // Each entry can reference one or more asset sources.

  // cesdk.ui.setComponentOrder({ in: 'ly.img.dock' }, [
  //
  //   /* ============================== */
  //   /* Templates                      */
  //   /* ============================== */
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.templates',
  //     icon: '@imgly/Template',
  //     label: 'libraries.ly.img.templates.label',
  //     entries: ['ly.img.templates']
  //   },
  //   { id: 'ly.img.separator', key: 'sep-1' },
  //
  //   /* ============================== */
  //   /* Combined Elements              */
  //   /* ============================== */
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.elements',
  //     icon: '@imgly/Library',
  //     label: 'component.library.elements',
  //     entries: ['ly.img.image', 'ly.img.text', 'ly.img.vector.shape', 'ly.img.sticker']
  //   },
  //
  //   /* ============================== */
  //   /* Individual Asset Types         */
  //   /* ============================== */
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.image',
  //     icon: '@imgly/Image',
  //     label: 'libraries.ly.img.image.label',
  //     entries: ['ly.img.image', 'ly.img.image.upload']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.video',
  //     icon: '@imgly/Video',
  //     label: 'libraries.ly.img.video.label',
  //     entries: ['ly.img.video', 'ly.img.video.upload']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.audio',
  //     icon: '@imgly/Audio',
  //     label: 'libraries.ly.img.audio.label',
  //     entries: ['ly.img.audio', 'ly.img.audio.upload']
  //   },
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.text',
  //     icon: '@imgly/Text',
  //     label: 'libraries.ly.img.text.label',
  //     entries: ['ly.img.text']
  //   },
  //   { id: 'ly.img.separator', key: 'sep-2' },
  //
  //   /* ============================== */
  //   /* Uploads                        */
  //   /* ============================== */
  //   {
  //     id: 'ly.img.assetLibrary.dock',
  //     key: 'ly.img.upload',
  //     icon: '@imgly/Upload',
  //     label: 'libraries.ly.img.upload.label',
  //     entries: ['ly.img.upload']
  //   },
  //
  //   /* ============================== */
  //   /* Custom Components              */
  //   /* ============================== */
  //   'ly.img.spacer',
  //   'my-app.custom-button.dock',
  //
  // ]);
  // #endregion

  // Suppress unused variable warning (remove when uncommenting code above)
  void cesdk;
}
