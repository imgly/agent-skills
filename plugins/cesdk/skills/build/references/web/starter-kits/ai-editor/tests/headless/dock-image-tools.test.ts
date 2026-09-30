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

import { PhotoEditorConfig } from '../../src/imgly/config/photo-editor/plugin';

vi.mock('@cesdk/cesdk-js', () => ({ default: { version: 'test' } }));

interface ButtonOptions {
  isDisabled?: boolean;
  tooltip?: string;
}

type Render = (context: {
  builder: { Button: (id: string, options: ButtonOptions) => void };
}) => void;

const IMAGE_TOOLS = [
  'ly.img.adjustment.dock',
  'ly.img.filter.dock',
  'ly.img.effects.dock'
];
const REQUIRES_IMAGE = 'photoEditor.dock.requiresImage';

let engine: TestEngine;
const spy = createApiSpy<CreativeEditorSDK>({
  answers: { 'ui.isPanelOpen': () => false }
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
  const scene = engine.scene.get();
  if (scene != null) engine.block.destroy(scene);
});

/** Renders the dock component and returns the button state it declares. */
function dockButton(id: string) {
  const call = spy
    .callsTo('ui.registerComponent')
    .find(({ args }) => args[0] === id);
  if (call == null) throw new Error(`No dock component ${id}`);
  let options: ButtonOptions | undefined;
  (call.args[1] as Render)({
    builder: {
      Button: (_id, given) => {
        options = given;
      }
    }
  });
  if (options == null) throw new Error(`${id} declared no button`);
  return { isDisabled: options.isDisabled, tooltip: options.tooltip };
}

function pageWithFill(fillType: FillType): number {
  const scene = engine.scene.create();
  const page = engine.block.create('page');
  engine.block.appendChild(scene, page);
  engine.block.setFill(page, engine.block.createFill(fillType));
  return page;
}

describe('AIE-H4 Adjust, Filter and Effects need an image on the page', () => {
  it.each<FillType>(['image', 'video'])(
    'are enabled without a tooltip on a page with a %s fill',
    (fillType) => {
      pageWithFill(fillType);
      for (const id of IMAGE_TOOLS) {
        expect(dockButton(id)).toEqual({
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
    for (const id of IMAGE_TOOLS) {
      expect(dockButton(id)).toEqual({
        isDisabled: true,
        tooltip: REQUIRES_IMAGE
      });
    }
  });

  it('follow the page fill when it changes after setup', () => {
    const page = pageWithFill('image');
    expect(dockButton('ly.img.adjustment.dock').isDisabled).toBe(false);

    engine.block.setFill(page, engine.block.createFill('color'));
    expect(dockButton('ly.img.adjustment.dock').isDisabled).toBe(true);

    engine.block.setFill(page, engine.block.createFill('image'));
    expect(dockButton('ly.img.adjustment.dock').isDisabled).toBe(false);
  });

  it('are disabled with a tooltip on a page whose fill was destroyed', () => {
    const page = pageWithFill('image');
    engine.block.destroy(engine.block.getFill(page));
    for (const id of IMAGE_TOOLS) {
      expect(dockButton(id)).toEqual({
        isDisabled: true,
        tooltip: REQUIRES_IMAGE
      });
    }
  });

  it('are disabled when there is no scene', () => {
    for (const id of IMAGE_TOOLS) {
      expect(dockButton(id).isDisabled).toBe(true);
    }
  });

  it('leave Crop enabled on a color page', () => {
    pageWithFill('color');
    expect(dockButton('ly.img.crop.dock')).toEqual({
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
