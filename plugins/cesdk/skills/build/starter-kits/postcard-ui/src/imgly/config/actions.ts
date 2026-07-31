/**
 * Actions Configuration - Postcard-Specific Actions
 *
 * Registers the postcard editor's operations on the engine's Actions API so
 * components run them via `engine.actions.run(...)`.
 *
 * Common operations are engine defaults and need no registration here:
 * `history.undo`, `history.redo`, `selection.delete`, `crop.reset`,
 * `crop.enter` and `editmode.exit`.
 *
 * @see https://img.ly/docs/cesdk/js/actions-6ch24x
 */

import type CreativeEngine from '@cesdk/engine';
import type { Font, RGBAColor, Typeface } from '@cesdk/engine';
import { autoPlaceBlockOnPage } from '../utils';

// The scene is authored at 300 DPI (print resolution). CE.SDK's export render
// pass is driven at 72 DPI; we set it for the export and restore 300 after.
const SCENE_AUTHORING_DPI = 300;
const EXPORT_RENDER_DPI = 72;

// Typed ids for `engine.actions.register` / `engine.actions.run`.
declare module '@cesdk/engine' {
  interface EngineActionsRegistry {
    addText: (pageBlockId: number, font: Font, typeface: Typeface) => number;
    replaceFontOnSelection: (font: Font, typeface: Typeface) => void;
    exportToPdf: (
      currentPageBlockId: number | null | undefined
    ) => Promise<Blob>;
    setColorByBlockName: (blockName: string, color: RGBAColor) => void;
    setTextSizeByBlockName: (blockName: string, size: number) => void;
    setFontByBlockName: (blockName: string, typeface: Typeface) => void;
  }
}

/**
 * Register the postcard-specific actions.
 *
 * @param engine - The CreativeEngine instance whose registry receives the actions.
 */
export function setupActions(engine: CreativeEngine): void {
  // #region Add Text Action
  // Create a centered text block sized to half the page width and place it.
  engine.actions.register('addText', (pageBlockId, font, typeface) => {
    const block = engine.block.create('text');
    engine.block.setFont(block, font.uri, typeface);
    engine.block.setFloat(block, 'text/fontSize', 40);
    engine.block.setEnum(block, 'text/horizontalAlignment', 'Center');
    engine.block.setHeightMode(block, 'Auto');
    const pageWidth = engine.block.getWidth(pageBlockId);
    engine.block.setWidth(block, pageWidth * 0.5);
    autoPlaceBlockOnPage(engine, pageBlockId, block);
    return block;
  });
  // #endregion

  // #region Replace Font Action
  // Replace the font on all currently selected text blocks.
  engine.actions.register('replaceFontOnSelection', (font, typeface) => {
    engine.block.findAllSelected().forEach((block) => {
      engine.block.setFont(block, font.uri, typeface);
    });
    engine.editor.addUndoStep();
  });
  // #endregion

  // #region Export To PDF Action
  // Export the whole scene as a PDF. All pages are made visible for the
  // export, then visibility and DPI are restored in a finally block so a
  // failed export never leaves the scene in export state.
  engine.actions.register('exportToPdf', async (currentPageBlockId) => {
    const pages = engine.scene.getPages();
    const scene = engine.scene.get()!;
    try {
      pages.forEach((block) => engine.block.setVisible(block, true));
      engine.block.setFloat(scene, 'scene/dpi', EXPORT_RENDER_DPI);
      return await engine.block.export(scene, {
        mimeType: 'application/pdf'
      });
    } finally {
      engine.block.setFloat(scene, 'scene/dpi', SCENE_AUTHORING_DPI);
      pages.forEach((block) =>
        engine.block.setVisible(block, currentPageBlockId === block)
      );
    }
  });
  // #endregion

  // #region Page Style Actions
  // The postcard templates author blocks with well-known names (Greeting,
  // Accent, Background); the style step drives them by name.

  // Set fill (and stroke if present) of every block with the given name.
  engine.actions.register('setColorByBlockName', (blockName, color) => {
    const { r, g, b } = color;
    engine.block.findByName(blockName).forEach((blockId) => {
      if (engine.block.supportsStroke(blockId)) {
        engine.block.setStrokeColor(blockId, { r, g, b, a: 1.0 });
      }
      engine.block.setColor(blockId, 'fill/solid/color', { r, g, b, a: 1.0 });
    });
    engine.editor.addUndoStep();
  });

  engine.actions.register('setTextSizeByBlockName', (blockName, size) => {
    engine.block.findByName(blockName).forEach((blockId) => {
      engine.block.setFloat(blockId, 'text/fontSize', size);
    });
    engine.editor.addUndoStep();
  });

  engine.actions.register('setFontByBlockName', (blockName, typeface) => {
    const font =
      typeface.fonts.find(
        (f) => f.style === 'normal' && f.weight === 'normal'
      ) ?? typeface.fonts[0];
    engine.editor.setEditMode('Transform');
    engine.block.findByName(blockName).forEach((blockId) => {
      engine.block.setFont(blockId, font.uri, typeface);
    });
    engine.editor.addUndoStep();
  });
  // #endregion
}
