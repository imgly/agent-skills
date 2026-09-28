import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import { describe, expect, it } from 'vitest';

import { ExportVideoPanelPlugin } from '../../src/imgly/plugins/export-video-panel';
import { createPanelHarness, fakeEngine } from './panel-harness';

const PANEL_ID = '//ly.img.panel/video-export';
const BUTTON_ID = 'ly.img.export-options.navigationBar';
const MAX_ERROR = 'video-export.custom-resolution.max-error.label';
const MIN_ERROR = 'video-export.custom-resolution.min-error.label';

/**
 * The shipped resolution and FPS lists are module state the panel mutates in
 * place (known issue 2), so every case builds its own arrays.
 */
function resolutionOptions() {
  return [
    {
      id: 'SD',
      label: 'sd',
      description: 'sd',
      value: { width: 640, height: 480 }
    },
    {
      id: 'HD',
      label: 'hd',
      description: 'hd',
      value: { width: 1280, height: 720 }
    },
    {
      id: 'FHD',
      label: 'fhd',
      description: 'fhd',
      value: { width: 1920, height: 1080 }
    },
    {
      id: '2K',
      label: '2k',
      description: '2k',
      value: { width: 2560, height: 1440 }
    },
    {
      id: '4K',
      label: '4k',
      description: '4k',
      value: { width: 3840, height: 2160 }
    },
    {
      id: 'Custom',
      label: 'custom',
      description: 'custom',
      value: { width: 1000, height: 1000 }
    }
  ];
}

function fpsOptions() {
  return [
    { id: '24', label: 'fps24', value: 24 },
    { id: '30', label: 'fps30', value: 30 },
    { id: '60', label: 'fps60', value: 60 },
    { id: '120', label: 'fps120', value: 120 }
  ];
}

function harnessFor(
  overrides: Record<string, unknown> = {},
  harnessOptions: Parameters<typeof createPanelHarness>[1] = {}
) {
  return createPanelHarness(
    ExportVideoPanelPlugin({
      resolutionOptions: resolutionOptions(),
      fpsOptions: fpsOptions(),
      ...overrides
    }) as never,
    harnessOptions
  );
}

describe('VEO-U1 registration', () => {
  it('registers the panel on the right and the navigation-bar button at the end', async () => {
    const spy = createApiSpy<CreativeEditorSDK>();

    await (
      ExportVideoPanelPlugin() as unknown as {
        initialize: (context: { cesdk: CreativeEditorSDK }) => Promise<void>;
      }
    ).initialize({ cesdk: spy.api });

    expect(spy.lastArgsOf('i18n.setTranslations')).toBeDefined();
    expect(spy.lastArgsOf('ui.registerComponent')?.[0]).toBe(BUTTON_ID);
    expect(spy.lastArgsOf('ui.registerPanel')?.[0]).toBe(PANEL_ID);
    expect(spy.lastArgsOf('ui.setPanelPosition')).toEqual([PANEL_ID, 'right']);
    expect(spy.lastArgsOf('ui.insertOrderComponent')).toEqual([
      { in: 'ly.img.navigation.bar', position: 'end' },
      { id: BUTTON_ID }
    ]);
    expect(spy.callsTo('engine.scene.onActiveChanged')).toHaveLength(1);
  });

  it('the navigation-bar button opens the panel and closes it again', async () => {
    const closed = await harnessFor({}, { isPanelOpen: false });
    const open = await harnessFor({}, { isPanelOpen: true });

    for (const harness of [closed, open]) {
      const register = harness.callsTo('ui.registerComponent')[0];
      const builderCalls: { id: string; options: Record<string, any> }[] = [];
      (register.args[1] as (context: { builder: unknown }) => void)({
        builder: {
          Button: (id: string, options: Record<string, any>) =>
            builderCalls.push({ id, options })
        }
      });
      expect(builderCalls[0].options.color).toBe('accent');
      builderCalls[0].options.onClick();
    }

    expect(closed.callsTo('ui.openPanel')[0].args).toEqual([PANEL_ID]);
    expect(closed.callsTo('ui.closePanel')).toHaveLength(0);
    expect(open.callsTo('ui.closePanel')[0].args).toEqual([PANEL_ID]);
    expect(open.callsTo('ui.openPanel')).toHaveLength(0);
  });

  it('returns without touching anything when there is no editor', async () => {
    const initialize = (
      ExportVideoPanelPlugin() as unknown as {
        initialize: (context: { cesdk: null }) => Promise<void>;
      }
    ).initialize;

    await expect(initialize({ cesdk: null })).resolves.toBeUndefined();
  });
});

describe('VEO-U2 the aspect-ratio filter', () => {
  it.each([
    [1920, 1080, ['HD', 'FHD', '2K', '4K', 'Custom'], 'FHD'],
    [1080, 1920, ['Custom'], 'Custom'],
    [1080, 1080, ['Custom'], 'Custom'],
    [640, 480, ['SD', 'Custom'], 'SD']
  ])(
    'a %i x %i page offers %j with %s selected',
    async (width, height, expected, selected) => {
      const harness = await harnessFor();

      harness.render(fakeEngine({ width, height }));

      const select = harness.find('Select', 'resolution-select')!;
      expect(
        (select.options.values as { id: string }[]).map((value) => value.id)
      ).toEqual(expected);
      expect(select.options.value.id).toBe(selected);
    }
  );
});

describe('VEO-U3 the default when no preset matches', () => {
  it('selects Custom carrying the page size, not its declared default', async () => {
    const harness = await harnessFor();

    harness.render(fakeEngine({ width: 1000, height: 500 }));

    const select = harness.find('Select', 'resolution-select')!;
    expect(select.options.value.id).toBe('Custom');
    expect(
      harness.find('NumberInput', 'custom-resolution-width')!.options.value
    ).toBe(1000);
    expect(
      harness.find('NumberInput', 'custom-resolution-height')!.options.value
    ).toBe(500);
  });
});

describe('VEO-U4 the resolution falls back to Custom when the page changes', () => {
  it('drops a preset that the new page size cannot offer', async () => {
    const harness = await harnessFor();
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    const select = harness.find('Select', 'resolution-select')!;
    select.options.setValue(
      (select.options.values as { id: string }[]).find(
        (value) => value.id === '2K'
      )
    );
    harness.render(fakeEngine({ width: 1080, height: 1920 }));

    expect(harness.find('Select', 'resolution-select')!.options.value.id).toBe(
      'Custom'
    );
  });
});

describe('VEO-U5 custom width and height stay in the page ratio', () => {
  async function customHarness() {
    const harness = await harnessFor();
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    const select = harness.find('Select', 'resolution-select')!;
    select.options.setValue(
      (select.options.values as { id: string }[]).find(
        (value) => value.id === 'Custom'
      )
    );
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    return harness;
  }

  it('derives the width from a typed height', async () => {
    const harness = await customHarness();

    harness
      .find('NumberInput', 'custom-resolution-height')!
      .options.setValue(720);
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    expect(
      harness.find('NumberInput', 'custom-resolution-width')!.options.value
    ).toBe(1280);
  });

  it('derives the height from a typed width', async () => {
    const harness = await customHarness();

    harness
      .find('NumberInput', 'custom-resolution-width')!
      .options.setValue(640);
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    expect(
      harness.find('NumberInput', 'custom-resolution-height')!.options.value
    ).toBe(360);
  });

  it('rounds the derived dimension to a whole pixel', async () => {
    const harness = await customHarness();

    harness
      .find('NumberInput', 'custom-resolution-height')!
      .options.setValue(100);
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    expect(
      harness.find('NumberInput', 'custom-resolution-width')!.options.value
    ).toBe(178);
  });
});

describe('VEO-U6 validation', () => {
  async function customAt(width: number, height: number) {
    const harness = await harnessFor();
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    const select = harness.find('Select', 'resolution-select')!;
    select.options.setValue(
      (select.options.values as { id: string }[]).find(
        (value) => value.id === 'Custom'
      )
    );
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    harness
      .find('NumberInput', 'custom-resolution-height')!
      .options.setValue(height);
    harness
      .find('NumberInput', 'custom-resolution-width')!
      .options.setValue(width);
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    return harness;
  }

  function errors(harness: Awaited<ReturnType<typeof customAt>>) {
    return harness.builderCalls
      .filter((call) => call.component === 'Text' && call.id.endsWith('-error'))
      .map((call) => call.options.content as string);
  }

  it('reports a size above the limit and disables the export button', async () => {
    const harness = await customAt(4001, 2000);

    expect(errors(harness)).toEqual([MAX_ERROR]);
    expect(
      harness.find('Button', 'export-video-button')!.options.isDisabled
    ).toBe(true);
  });

  it('reports a size below the limit and disables the export button', async () => {
    const harness = await customAt(15, 100);

    expect(errors(harness)).toEqual([MIN_ERROR]);
    expect(
      harness.find('Button', 'export-video-button')!.options.isDisabled
    ).toBe(true);
  });

  // The two dimensions move together in the page's ratio, so a page would have
  // to be wider than 250:1 for one to exceed 4000 while the other stays under
  // 16. Both messages at once is unreachable for any real page.
  it('never reports both messages, because the two dimensions move together', async () => {
    expect(errors(await customAt(15, 4001))).toEqual([MIN_ERROR]);
    expect(errors(await customAt(4001, 15))).toEqual([MAX_ERROR]);
  });

  it('leaves the export button enabled for a size inside the limits', async () => {
    const harness = await customAt(1280, 720);

    expect(errors(harness)).toEqual([]);
    expect(
      harness.find('Button', 'export-video-button')!.options.isDisabled
    ).toBe(false);
  });
});

describe('VEO-U7 export options', () => {
  it('exports the selected resolution and frame rate and downloads the blob', async () => {
    const harness = await harnessFor();
    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    harness
      .find('Select', 'fps-select')!
      .options.setValue({ id: '60', label: 'fps60', value: 60 });
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    await harness.find('Button', 'export-video-button')!.options.onClick();

    expect(harness.callsTo('utils.export')[0].args[0]).toEqual({
      mimeType: 'video/mp4',
      videoBitrate: 'Auto',
      targetWidth: 1920,
      targetHeight: 1080,
      framerate: 60
    });
    expect(harness.callsTo('utils.downloadFile')).toHaveLength(1);
    expect(harness.callsTo('utils.downloadFile')[0].args[1]).toBe('video/mp4');
  });

  it('hands the blob to a supplied onExport instead of downloading it', async () => {
    const received: Blob[] = [];
    const harness = await harnessFor({
      onExport: (blob: Blob) => received.push(blob)
    });
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    await harness.find('Button', 'export-video-button')!.options.onClick();

    expect(received).toHaveLength(1);
    expect(harness.callsTo('utils.downloadFile')).toHaveLength(0);
  });
});

describe('VEO-U8 the export button’s busy state', () => {
  it('clears while the export is pending and after it rejects', async () => {
    let settle: (() => void) | undefined;
    const harness = await harnessFor(
      {},
      {
        exportImpl: () =>
          new Promise((_, reject) => {
            settle = () => reject(new Error('encoder unavailable'));
          })
      }
    );
    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    const pending = harness
      .find('Button', 'export-video-button')!
      .options.onClick();

    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    expect(
      harness.find('Button', 'export-video-button')!.options.isLoading
    ).toBe(true);

    settle!();
    await expect(pending).rejects.toThrow('encoder unavailable');

    harness.render(fakeEngine({ width: 1920, height: 1080 }));
    expect(
      harness.find('Button', 'export-video-button')!.options.isLoading
    ).toBe(false);
  });
});

describe('VEO-U9 custom option arrays', () => {
  it('uses the frame rates the caller passes', async () => {
    const harness = await harnessFor({
      fpsOptions: [{ id: '25', label: 'fps25', value: 25 }]
    });

    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    expect(
      (
        harness.find('Select', 'fps-select')!.options.values as { id: string }[]
      ).map((value) => value.id)
    ).toEqual(['25']);
  });

  it('selects a frame rate from a single-entry list', async () => {
    const harness = await harnessFor({
      fpsOptions: [{ id: '25', label: 'fps25', value: 25 }]
    });

    harness.render(fakeEngine({ width: 1920, height: 1080 }));

    expect(harness.find('Select', 'fps-select')!.options.value).toBeDefined();
  });
});

describe('VEO-U10 the panel closes on a scene change', () => {
  it('closes on scene.onActiveChanged', async () => {
    const harness = await harnessFor();

    harness.onActiveChanged!();

    expect(harness.callsTo('ui.closePanel')[0].args).toEqual([PANEL_ID]);
  });
});

describe('VEO-U15 the panel without a page', () => {
  it('renders nothing while the scene has no current page', async () => {
    const harness = await harnessFor();

    const calls = harness.render(
      fakeEngine({ width: 1920, height: 1080, currentPage: null })
    );

    expect(calls).toEqual([]);
  });
});
