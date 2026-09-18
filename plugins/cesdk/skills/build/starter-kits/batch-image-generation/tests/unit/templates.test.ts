import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadTemplates } from '../../src/app/templates';

const SCENES_JSON = fileURLToPath(
  new URL('../../public/scenes.json', import.meta.url)
);

// BIG-U2: the two shipped templates, built from the shipped scenes.json.
describe('loadTemplates', () => {
  beforeEach(async () => {
    const body = await readFile(SCENES_JSON, 'utf8');
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response(body))
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches scenes.json next to the page', async () => {
    await loadTemplates();

    expect(fetch).toHaveBeenCalledWith('./scenes.json');
  });

  it('returns exactly the portrait and landscape templates', async () => {
    expect(Object.keys(await loadTemplates())).toEqual([
      'portrait',
      'landscape'
    ]);
  });

  it.each([
    ['portrait', 180, 240, 'image/jpeg', 'images/empty_portrait.png'],
    ['landscape', 260, 150, 'image/png', 'images/empty_landscape.png']
  ])(
    '%s is %i x %i, exports %s and previews %s',
    async (key, width, height, outputFormat, preview) => {
      const template = (await loadTemplates())[key];

      expect(template.id).toBe(key);
      expect(template.width).toBe(width);
      expect(template.height).toBe(height);
      expect(template.outputFormat).toBe(outputFormat);
      expect(template.previewImagePath).toBe(`./${preview}`);
    }
  );

  it('carries a non-empty scene string for both templates', async () => {
    const templates = await loadTemplates();

    expect(templates.portrait.sceneString.length).toBeGreaterThan(0);
    expect(templates.landscape.sceneString.length).toBeGreaterThan(0);
    expect(templates.portrait.sceneString).not.toBe(
      templates.landscape.sceneString
    );
  });
});
