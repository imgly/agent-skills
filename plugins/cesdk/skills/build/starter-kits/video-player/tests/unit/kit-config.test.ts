import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it, vi } from 'vitest';

class PlayerConfigStub {
  kind = 'PlayerConfig';
}

vi.mock('@cesdk/core-configs-web/player-editor', () => ({
  PlayerConfig: PlayerConfigStub
}));

const kit = await import('../../src/imgly');

describe('initVideoPlayer', () => {
  it('VPY-U1 adds PlayerConfig and configures nothing else', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    await kit.initVideoPlayer(spy.api);

    expect(spy.calls.map(({ path }) => path)).toEqual(['addPlugin']);
    expect(spy.lastArgsOf('addPlugin')?.[0]).toBeInstanceOf(PlayerConfigStub);
  });

  it('VPY-U2 re-exports PlayerConfig so a customer can compose the config', () => {
    expect(kit.PlayerConfig).toBe(PlayerConfigStub);
  });
});
