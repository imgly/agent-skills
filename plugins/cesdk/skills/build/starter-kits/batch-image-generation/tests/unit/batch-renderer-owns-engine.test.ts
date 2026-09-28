import { beforeEach, describe, expect, it, vi } from 'vitest';

// `batchRender` boots its own engine when the caller hands it none. The kit
// always hands it the one the app booted, so that path is driven against a
// stand-in rather than a second wasm heap.
const { engineStub, init } = vi.hoisted(() => {
  const engineStub = {
    editor: { setSetting: vi.fn() },
    variable: {
      findAll: vi.fn(() => [] as string[]),
      getString: vi.fn(() => ''),
      setString: vi.fn()
    },
    scene: {
      load: vi.fn(async () => 0),
      saveToString: vi.fn(async () => 'saved')
    },
    block: {
      findByType: vi.fn(() => [1]),
      findByName: vi.fn(() => [] as number[]),
      getFill: vi.fn(() => 2),
      setString: vi.fn(),
      export: vi.fn(async () => new Blob(['png']))
    },
    dispose: vi.fn()
  };
  return { engineStub, init: vi.fn(async () => engineStub) };
});

vi.mock('@cesdk/engine', () => ({ default: { init } }));

const { batchRender } = await import('../../src/imgly/batch-renderer');

describe('BIG-U8 batchRender', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    engineStub.variable.findAll.mockReturnValue([]);
    engineStub.block.findByType.mockReturnValue([1]);
  });

  it('boots its own engine and disposes it again', async () => {
    const results = await batchRender('scene', [{}], {
      license: 'lic',
      baseURL: 'https://assets.test/'
    });

    expect(init).toHaveBeenCalledWith({
      license: 'lic',
      baseURL: 'https://assets.test/'
    });
    expect(results).toHaveLength(1);
    expect(engineStub.dispose).toHaveBeenCalledTimes(1);
  });

  it('disposes the engine it owns even when the scene has no page', async () => {
    engineStub.block.findByType.mockReturnValue([]);

    await expect(batchRender('scene', [{}])).rejects.toThrow(
      'No pages found in scene'
    );
    expect(engineStub.dispose).toHaveBeenCalledTimes(1);
  });

  it('leaves an engine the caller owns alone', async () => {
    await batchRender('scene', [{}], {
      engine: engineStub as unknown as Parameters<
        typeof batchRender
      >[2]['engine']
    });

    expect(init).not.toHaveBeenCalled();
    expect(engineStub.dispose).not.toHaveBeenCalled();
  });
});
