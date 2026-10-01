import { createApiSpy, type ApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

// The plugin itself is `plugin-ai-apps-web`'s; this kit decides only which
// provider map it is given.
vi.mock('@imgly/plugin-ai-apps-web', () => ({
  default: vi.fn((options: unknown) => ({ name: 'ai-apps', options }))
}));

import AiApps from '@imgly/plugin-ai-apps-web';

import { AiAppsConfig } from '../../src/imgly';
import type { AiEditorMode, AiProviderMap } from '../../src/imgly';

const PROVIDERS: AiProviderMap = { text2image: ['provider' as never] };

async function configure(
  mode: AiEditorMode
): Promise<ApiSpy<CreativeEditorSDK>> {
  const spy = createApiSpy<CreativeEditorSDK>();
  await new AiAppsConfig(PROVIDERS, mode).initialize({
    cesdk: spy.api
  } as never);
  return spy;
}

function libraryEntry(spy: ApiSpy<CreativeEditorSDK>, id: string) {
  const call = spy
    .callsTo('ui.updateAssetLibraryEntry')
    .find(({ args }) => args[0] === id);
  if (call == null) return undefined;
  const { sourceIds } = call.args[1] as {
    sourceIds: (context: { currentIds: string[] }) => string[];
  };
  return sourceIds({ currentIds: ['existing'] });
}

describe('AIE-U11 AiAppsConfig', () => {
  it('does nothing without an editor', async () => {
    const plugin = new AiAppsConfig(PROVIDERS, 'Design');
    await expect(
      plugin.initialize({ cesdk: undefined } as never)
    ).resolves.toBeUndefined();
  });

  it('puts the AI apps entry first in the dock', async () => {
    const spy = await configure('Design');
    expect(spy.callsTo('ui.insertOrderComponent')[0].args).toEqual([
      { in: 'ly.img.dock', position: 'start' },
      { id: 'ly.img.ai/apps.dock' }
    ]);
  });

  it('puts the AI canvas-menu entries first, while transforming', async () => {
    const spy = await configure('Design');
    expect(spy.callsTo('ui.insertOrderComponent')[1].args).toEqual([
      {
        in: 'ly.img.canvas.menu',
        position: 'start',
        when: { editMode: 'Transform' }
      },
      [
        'ly.img.ai.text.canvasMenu',
        'ly.img.ai.image.canvasMenu',
        'ly.img.separator'
      ]
    ]);
  });

  it('hands the AI Apps plugin the provider map it was built with', async () => {
    await configure('Design');
    expect(AiApps).toHaveBeenCalledWith({ providers: PROVIDERS });
  });

  it.each(['Design', 'Video'] as const)(
    'appends the image history to the image library in %s mode',
    async (mode) => {
      const spy = await configure(mode);
      expect(libraryEntry(spy, 'ly.img.image')).toEqual([
        'existing',
        'ly.img.ai.image-generation.history'
      ]);
    }
  );

  it('appends the video and audio histories in Video mode only', async () => {
    const video = await configure('Video');
    expect(libraryEntry(video, 'ly.img.video')).toEqual([
      'existing',
      'ly.img.ai.video-generation.history'
    ]);
    expect(libraryEntry(video, 'ly.img.audio')).toEqual([
      'existing',
      'ly.img.ai.audio-generation.history'
    ]);

    const design = await configure('Design');
    expect(libraryEntry(design, 'ly.img.video')).toBeUndefined();
    expect(libraryEntry(design, 'ly.img.audio')).toBeUndefined();
  });
});
