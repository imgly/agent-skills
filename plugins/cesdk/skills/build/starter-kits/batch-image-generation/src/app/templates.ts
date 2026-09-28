/**
 * Template definitions for Batch Image Generation
 */

import type { Template } from './types';

interface ScenesData {
  portraitScene: string;
  landscapeScene: string;
}

/** Load templates with scene data from public/scenes.json */
export async function loadTemplates(): Promise<Record<string, Template>> {
  const response = await fetch('./scenes.json');
  const scenes: ScenesData = await response.json();

  return {
    portrait: {
      id: 'portrait',
      label: 'Portrait',
      sceneString: scenes.portraitScene,
      previewImagePath: './images/empty_portrait.png',
      width: 180,
      height: 240,
      outputFormat: 'image/jpeg'
    },
    landscape: {
      id: 'landscape',
      label: 'Landscape',
      sceneString: scenes.landscapeScene,
      previewImagePath: './images/empty_landscape.png',
      width: 260,
      height: 150,
      outputFormat: 'image/png'
    }
  };
}
