/**
 * Animation Panel Helper
 *
 * Selects the first background clip that is visible at the current playback
 * time and opens the animation inspector for it.
 */

import type CreativeEditorSDK from '@cesdk/cesdk-js';

/**
 * Select the first visible background clip and open the animation panel.
 *
 * @param instance - The CreativeEditorSDK instance to act on
 */
export async function openAnimationPanel(instance: CreativeEditorSDK) {
  const engine = instance.engine;
  for (const block of engine.block.findAll()) {
    // Get background clips
    if (engine.block.isAlwaysOnBottom(block)) {
      for (const child of engine.block.getChildren(block)) {
        // Select the first one that is visible
        if (engine.block.isVisibleAtCurrentPlaybackTime(child)) {
          engine.block.select(child);
          await new Promise((resolve) => setTimeout(resolve, 100));
          instance.ui.openPanel('//ly.img.panel/inspector/animation');
          break;
        }
      }
      break;
    }
  }
}
