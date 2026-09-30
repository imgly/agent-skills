import {
  createTestEngine,
  disposeTestEngine,
  type TestEngine
} from '@imgly/kit-test-harness/node';
import { createApiSpy } from '@imgly/kit-test-harness/vitest';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { FillType } from '@cesdk/cesdk-js';
import {
  afterAll,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest';

import { PhotoEditorConfig } from '../../src/imgly/config/plugin';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

interface DockEntry {
  key?: string;
  isDisabled?: boolean | (() => boolean);
  tooltip?: string | (() => string | undefined);
}

const IMAGE_TOOLS = ['ly.img.adjustment', 'ly.img.filter'];
const REQUIRES_IMAGE = 'photoEditor.dock.requiresImage';
const REPLACE_PANEL = '//ly.img.panel/assetLibrary.replace';

let engine: TestEngine;
let openPanel: string | null = null;
const spy = createApiSpy<CreativeEditorSDK>({
  answers: { 'ui.isPanelOpen': (id) => id === openPanel }
});

beforeAll(async () => {
  engine = await createTestEngine();
  // The editor keeps its UI settings (dock/*, timeline/*) itself, so the engine
  // gets only the settings it knows.
  const engineSettings = new Set(engine.editor.findAllSettings());
  const setSetting = engine.editor.setSetting.bind(engine.editor);
  engine.editor.setSetting = ((key: string, value: never) => {
    if (engineSettings.has(key)) setSetting(key, value);
  }) as typeof setSetting;
  // The configuration reads the page through `cesdk.engine`, so that one is real.
  const cesdk = new Proxy(spy.api as object, {
    get: (target, key) => (key === 'engine' ? engine : Reflect.get(target, key))
  }) as CreativeEditorSDK;
  await new PhotoEditorConfig().initialize({
    cesdk,
    engine
  } as unknown as Parameters<PhotoEditorConfig['initialize']>[0]);
});

afterAll(() => {
  disposeTestEngine();
});

beforeEach(() => {
  openPanel = null;
  const scene = engine.scene.get();
  if (scene != null) engine.block.destroy(scene);
});

function dockEntry(key: string) {
  const order = spy
    .callsTo('ui.setComponentOrder')
    .find(({ args }) => (args[0] as { in: string }).in === 'ly.img.dock')!
    .args[1] as DockEntry[];
  const entry = order.find((e) => typeof e === 'object' && e.key === key);
  if (entry == null) throw new Error(`No dock entry ${key}`);
  const { isDisabled, tooltip } = entry;
  return {
    isDisabled: typeof isDisabled === 'function' ? isDisabled() : isDisabled,
    tooltip: typeof tooltip === 'function' ? tooltip() : tooltip
  };
}

function pageWithFill(fillType: FillType): number {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.block.setFill(page, engine.block.createFill(fillType));
  return page;
}

describe('FCE-H1 Adjust and Filter need an image on the page', () => {
  it.each<FillType>(['image', 'video'])(
    'are enabled without a tooltip on a page with a %s fill',
    (fillType) => {
      pageWithFill(fillType);
      for (const key of IMAGE_TOOLS) {
        expect(dockEntry(key)).toEqual({
          isDisabled: false,
          tooltip: undefined
        });
      }
    }
  );

  it.each<FillType>([
    'color',
    'gradient/linear',
    'gradient/radial',
    'gradient/conical'
  ])('are disabled with a tooltip on a page with a %s fill', (fillType) => {
    pageWithFill(fillType);
    for (const key of IMAGE_TOOLS) {
      expect(dockEntry(key)).toEqual({
        isDisabled: true,
        tooltip: REQUIRES_IMAGE
      });
    }
  });

  it('follow the page fill when it changes after setup', () => {
    const page = pageWithFill('image');
    expect(dockEntry('ly.img.adjustment').isDisabled).toBe(false);

    engine.block.setFill(page, engine.block.createFill('color'));
    expect(dockEntry('ly.img.adjustment').isDisabled).toBe(true);

    engine.block.setFill(page, engine.block.createFill('image'));
    expect(dockEntry('ly.img.adjustment').isDisabled).toBe(false);
  });

  it('are disabled with a tooltip on a page whose fill was destroyed', () => {
    const page = pageWithFill('image');
    engine.block.destroy(engine.block.getFill(page));
    for (const key of IMAGE_TOOLS) {
      expect(dockEntry(key)).toEqual({
        isDisabled: true,
        tooltip: REQUIRES_IMAGE
      });
    }
  });

  it('are disabled on an image page while the replace panel is open, without the tooltip', () => {
    pageWithFill('image');
    openPanel = REPLACE_PANEL;
    for (const key of IMAGE_TOOLS) {
      expect(dockEntry(key)).toEqual({ isDisabled: true, tooltip: undefined });
    }
  });

  it('are disabled when there is no scene', () => {
    for (const key of IMAGE_TOOLS) {
      expect(dockEntry(key).isDisabled).toBe(true);
    }
  });

  it('leave Crop enabled on a color page', () => {
    pageWithFill('color');
    expect(dockEntry('ly.img.crop')).toEqual({
      isDisabled: undefined,
      tooltip: undefined
    });
  });

  it('register the tooltip text in English and German', () => {
    const translations = spy
      .callsTo('i18n.setTranslations')
      .map(({ args }) => args[0] as Record<string, Record<string, string>>);
    const text = (locale: string) =>
      translations.map((t) => t[locale]?.[REQUIRES_IMAGE]).find(Boolean);
    expect(text('en')).toBe('Requires an image');
    expect(text('de')).toBe('Erfordert ein Bild');
  });
});
