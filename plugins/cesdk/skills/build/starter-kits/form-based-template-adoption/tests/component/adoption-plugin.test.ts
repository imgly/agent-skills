// @vitest-environment jsdom
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { RGBAColor } from '@cesdk/cesdk-js';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  FormBasedTemplateAdoptionPlugin,
  uploadFile
} from '../../src/imgly/plugins/form-based-template-adoption';

const rgba = (r: number, g: number, b: number, a = 1): RGBAColor =>
  ({ r, g, b, a }) as RGBAColor;

const TEXT_BLOCK = 10;
const IMAGE_BLOCK = 20;
const FILL_OFFSET = 1000;

type Callback = () => void;

interface Harness {
  cesdk: CreativeEditorSDK;
  engine: Record<string, Record<string, ReturnType<typeof vi.fn>>>;
  ui: Record<string, ReturnType<typeof vi.fn>>;
  resizeCallbacks: Callback[];
  activeChanged: Callback[];
  observed: unknown[];
  disconnected: number;
}

/**
 * A fake editor rich enough for the plugin to configure and render against.
 * The panel is a pure function of this, so every branch is reachable without a
 * browser.
 */
function harness(): Harness {
  const resizeCallbacks: Callback[] = [];
  const activeChanged: Callback[] = [];
  const observed: unknown[] = [];
  const state = { disconnected: 0 };

  class ResizeObserverStub {
    constructor(private readonly callback: Callback) {
      resizeCallbacks.push(callback);
    }
    observe(target: unknown) {
      observed.push(target);
    }
    unobserve() {}
    disconnect() {
      state.disconnected += 1;
    }
  }
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  // jsdom ships no object-URL support, and the kit relocates every transient
  // resource through one before the panel can preview it.
  URL.createObjectURL = vi.fn(() => 'blob:relocated');
  URL.revokeObjectURL = vi.fn();

  const engine = {
    editor: {
      setSetting: vi.fn(),
      setGlobalScope: vi.fn(),
      addUndoStep: vi.fn(),
      getActiveHistory: vi.fn(() => 1),
      createHistory: vi.fn(() => 2),
      setActiveHistory: vi.fn(),
      destroyHistory: vi.fn(),
      findAllTransientResources: vi.fn(() => [
        { URL: 'buffer:hero' },
        { URL: 'bundle://ly.img.cesdk/fonts/a.ttf' }
      ]),
      getBufferLength: vi.fn(() => 4),
      getBufferData: vi.fn(() => new Uint8Array([1, 2, 3, 4])),
      relocateResource: vi.fn()
    },
    scene: {
      get: vi.fn(() => 1),
      zoomToBlock: vi.fn(),
      onActiveChanged: vi.fn((callback: Callback) => {
        activeChanged.push(callback);
        return () => {};
      })
    },
    block: {
      findAll: vi.fn(() => [TEXT_BLOCK, IMAGE_BLOCK]),
      findByType: vi.fn((type: string) =>
        type === 'page'
          ? [1]
          : type === 'text'
            ? [TEXT_BLOCK]
            : type === 'graphic'
              ? [IMAGE_BLOCK]
              : []
      ),
      findAllSelected: vi.fn(() => [IMAGE_BLOCK]),
      setSelected: vi.fn(),
      getName: vi.fn((id: number) => (id === TEXT_BLOCK ? 'Headline' : 'Hero')),
      getPositionX: vi.fn(() => 0),
      getPositionY: vi.fn(() => 0),
      getType: vi.fn((id: number) =>
        id >= FILL_OFFSET
          ? '//ly.img.ubq/fill/image'
          : id === TEXT_BLOCK
            ? '//ly.img.ubq/text'
            : '//ly.img.ubq/graphic'
      ),
      supportsFill: vi.fn((id: number) => id === IMAGE_BLOCK),
      isFillEnabled: vi.fn(() => true),
      isValid: vi.fn(() => true),
      getFill: vi.fn((id: number) => id + FILL_OFFSET),
      getColor: vi.fn(() => rgba(1, 0, 0, 0.5)),
      supportsStroke: vi.fn(() => false),
      isStrokeEnabled: vi.fn(() => false),
      getStrokeColor: vi.fn(() => rgba(0, 0, 0)),
      setStrokeColor: vi.fn(),
      setColor: vi.fn(),
      setTextColor: vi.fn(),
      getTextColors: vi.fn(() => [rgba(0, 0, 1, 0.25)]),
      isScopeEnabled: vi.fn(() => true),
      getString: vi.fn((_id: number, property: string) =>
        property === 'text/text' ? 'Line one\nLine two' : ''
      ),
      replaceText: vi.fn(),
      getSourceSet: vi.fn(() => [{ uri: 'blob:hero' }]),
      setSourceSet: vi.fn(),
      addImageFileURIToSourceSet: vi.fn().mockResolvedValue(undefined),
      setString: vi.fn(),
      forceLoadResources: vi.fn().mockResolvedValue(undefined)
    },
    element: document.createElement('div')
  };

  const ui = {
    setComponentOrder: vi.fn(),
    registerPanel: vi.fn(),
    openPanel: vi.fn()
  };

  const cesdk = {
    engine,
    ui,
    feature: { set: vi.fn() },
    i18n: { setTranslations: vi.fn() }
  } as unknown as CreativeEditorSDK;

  return {
    cesdk,
    engine: engine as never,
    ui,
    resizeCallbacks,
    activeChanged,
    observed,
    get disconnected() {
      return state.disconnected;
    }
  };
}

interface RecordedControl {
  kind: string;
  id: string;
  options: Record<string, unknown>;
}

/** Renders the panel and records every control the kit asks the builder for. */
function renderPanel(test: Harness): RecordedControl[] {
  const controls: RecordedControl[] = [];
  const record =
    (kind: string) => (id: string, options: Record<string, unknown>) => {
      controls.push({ kind, id, options });
      if (kind === 'Section') {
        (options.children as (() => void) | undefined)?.();
      }
    };
  const store = new Map<string, unknown>();
  const renderFn = test.ui.registerPanel.mock.calls[0][1] as (context: {
    builder: Record<string, unknown>;
    engine: unknown;
    state: unknown;
  }) => void;

  renderFn({
    builder: {
      Section: record('Section'),
      MediaPreview: record('MediaPreview'),
      TextInput: record('TextInput'),
      TextArea: record('TextArea'),
      ColorInput: record('ColorInput')
    },
    engine: test.engine,
    state: (key: string, initial: unknown) => {
      if (!store.has(key)) store.set(key, initial);
      return {
        get value() {
          return store.get(key);
        },
        setValue: (next: unknown) => store.set(key, next)
      };
    }
  });
  return controls;
}

async function initialize(test: Harness): Promise<void> {
  await FormBasedTemplateAdoptionPlugin().initialize!({
    cesdk: test.cesdk
  } as never);
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('FTA-U17 the plugin locks the editor down to the form', () => {
  let test: Harness;

  beforeEach(async () => {
    test = harness();
    await initialize(test);
  });

  it('turns off scroll, zoom and the page title', () => {
    const settings = new Map(
      test.engine.editor.setSetting.mock.calls.map(([key, value]) => [
        key,
        value
      ])
    );
    expect(settings.get('page/title/show')).toBe(false);
    expect(settings.get('mouse/enableScroll')).toBe(false);
    expect(settings.get('mouse/enableZoom')).toBe(false);
  });

  it('empties the inspector bar, the dock and the canvas bar', () => {
    const orders = new Map(
      test.ui.setComponentOrder.mock.calls.map(([target, order]) => [
        (target as { in: string }).in,
        order
      ])
    );
    expect(orders.get('ly.img.inspector.bar')).toEqual([]);
    expect(orders.get('ly.img.dock')).toEqual([]);
    expect(orders.get('ly.img.canvas.bar')).toEqual([]);
  });

  it('leaves only image and PDF export in the navigation bar', () => {
    const navigationBar = test.ui.setComponentOrder.mock.calls.find(
      ([target]) => (target as { in: string }).in === 'ly.img.navigation.bar'
    )?.[1] as (string | { children: string[] })[];
    expect(navigationBar.at(-1)).toEqual({
      id: 'ly.img.actions.navigationBar',
      children: [
        'ly.img.exportImage.navigationBar',
        'ly.img.exportPDF.navigationBar'
      ]
    });
  });

  it('disables the dock and the resize button', () => {
    const flags = new Map(
      (
        test.cesdk.feature.set as unknown as ReturnType<typeof vi.fn>
      ).mock.calls.map(([id, value]) => [id as string, value as boolean])
    );
    expect(flags.get('ly.img.dock')).toBe(false);
    expect(flags.get('ly.img.page.resize')).toBe(false);
  });

  it('denies direct selection on the canvas', () => {
    expect(test.engine.editor.setGlobalScope).toHaveBeenCalledWith(
      'editor/select',
      'Deny'
    );
  });

  it('translates the panel title in English and German', () => {
    const translations = (
      test.cesdk.i18n.setTranslations as unknown as ReturnType<typeof vi.fn>
    ).mock.calls[0][0] as Record<string, Record<string, string>>;
    expect(translations.en['panel.form-based-adaption']).toBe('Edit Template');
    expect(translations.de['panel.form-based-adaption']).toBe(
      'Template bearbeiten'
    );
  });

  it('opens the form panel and does not let the user close it', () => {
    expect(test.ui.openPanel).toHaveBeenCalledWith('form-based-adaption', {
      closableByUser: false
    });
  });

  it('does nothing at all without a cesdk instance', async () => {
    const bare = harness();
    await FormBasedTemplateAdoptionPlugin().initialize!({
      cesdk: undefined
    } as never);
    expect(bare.ui.registerPanel).not.toHaveBeenCalled();
  });
});

describe('FTA-U18 the canvas follows the container', () => {
  it('zooms the scene to fit whenever the container resizes', async () => {
    const test = harness();
    await initialize(test);

    expect(test.observed).toEqual([test.engine.element]);
    test.resizeCallbacks[0]();
    expect(test.engine.scene.zoomToBlock).toHaveBeenCalledWith(1, {
      padding: 60
    });
  });

  it('stops observing once the engine has no scene left', async () => {
    const test = harness();
    await initialize(test);

    (test.engine as unknown as { scene: unknown }).scene = undefined;
    test.resizeCallbacks[0]();

    expect(test.disconnected).toBe(1);
  });
});

describe('FTA-U19 the scene is prepared once', () => {
  let test: Harness;

  beforeEach(async () => {
    test = harness();
    await initialize(test);
    test.activeChanged[0]();
    await vi.waitFor(() =>
      expect(test.engine.editor.addUndoStep).toHaveBeenCalled()
    );
  });

  it('deselects everything the template shipped selected', () => {
    expect(test.engine.block.setSelected).toHaveBeenCalledWith(
      IMAGE_BLOCK,
      false
    );
  });

  it('starts a fresh history, so the setup is not undoable', () => {
    expect(test.engine.editor.setActiveHistory).toHaveBeenCalledWith(2);
    expect(test.engine.editor.destroyHistory).toHaveBeenCalledWith(1);
  });

  it('prepares the scene only once, however often the active scene changes', () => {
    const calls = test.engine.editor.createHistory.mock.calls.length;
    test.activeChanged[0]();
    expect(test.engine.editor.createHistory.mock.calls).toHaveLength(calls);
  });
});

describe('FTA-U20 the form the panel renders', () => {
  let test: Harness;
  let controls: RecordedControl[];

  beforeEach(async () => {
    test = harness();
    await initialize(test);
    test.activeChanged[0]();
    await vi.waitFor(() =>
      expect(test.engine.editor.addUndoStep).toHaveBeenCalled()
    );
    controls = renderPanel(test);
  });

  it('offers an Image, a Text and a Color section, in that order', () => {
    expect(
      controls.filter(({ kind }) => kind === 'Section').map(({ id }) => id)
    ).toEqual([
      'form-based-adaption.image',
      'form-based-adaption.text',
      'form-based-adaption.color'
    ]);
  });

  it('names the image action after the block', () => {
    const preview = controls.find(({ kind }) => kind === 'MediaPreview');
    expect((preview?.options.action as { label: string }).label).toBe(
      'Change Hero'
    );
  });

  it('gives a multi-line block a text area rather than an input', () => {
    expect(controls.some(({ kind }) => kind === 'TextArea')).toBe(true);
    expect(controls.some(({ kind }) => kind === 'TextInput')).toBe(false);
  });

  it('writes an edited value to every block that shares the name', () => {
    const area = controls.find(({ kind }) => kind === 'TextArea');
    (area?.options.setValue as (value: string) => void)('New copy');
    expect(test.engine.block.replaceText).toHaveBeenCalledWith(
      TEXT_BLOCK,
      'New copy'
    );
    expect(test.engine.editor.addUndoStep).toHaveBeenCalled();
  });

  it('previews the image file URI when the block carries no source set', () => {
    test.engine.block.getSourceSet.mockReturnValue([]);
    test.engine.block.getString.mockImplementation(
      (_id: number, property: string) =>
        property === 'fill/image/imageFileURI' ? 'blob:fallback' : 'Headline'
    );

    const preview = renderPanel(test).find(
      ({ kind }) => kind === 'MediaPreview'
    );
    expect((preview?.options.preview as { uri: string }).uri).toBe(
      'blob:fallback'
    );
  });

  it('renders nothing when the scene has no page', () => {
    test.engine.block.findByType.mockReturnValue([]);
    expect(renderPanel(test)).toEqual([]);
  });
});

describe('FTA-U21 changing a colour writes to every block that carries it', () => {
  it.each([
    ['fill', 'setColor'],
    ['stroke', 'setStrokeColor'],
    ['text', 'setTextColor']
  ])('writes a %s colour through %s', async (type, method) => {
    const test = harness();
    test.engine.block.supportsFill.mockImplementation(() => type === 'fill');
    test.engine.block.supportsStroke.mockImplementation(
      () => type === 'stroke'
    );
    test.engine.block.isStrokeEnabled.mockImplementation(
      () => type === 'stroke'
    );
    test.engine.block.getType.mockImplementation((id: number) =>
      id >= FILL_OFFSET
        ? '//ly.img.ubq/fill/color'
        : type === 'text'
          ? '//ly.img.ubq/text'
          : '//ly.img.ubq/graphic'
    );
    test.engine.block.findAll.mockReturnValue([IMAGE_BLOCK]);
    test.engine.block.getStrokeColor.mockReturnValue(rgba(1, 0, 0, 0.5));
    test.engine.block.getTextColors.mockReturnValue([rgba(1, 0, 0, 0.5)]);

    await initialize(test);
    test.activeChanged[0]();
    await vi.waitFor(() =>
      expect(test.engine.editor.addUndoStep).toHaveBeenCalled()
    );

    const color = renderPanel(test).find(({ kind }) => kind === 'ColorInput');
    expect(color).toBeDefined();
    (color?.options.setValue as (value: RGBAColor) => void)(rgba(0, 1, 0));

    expect(test.engine.block[method]).toHaveBeenCalledWith(
      ...(type === 'fill'
        ? [IMAGE_BLOCK + FILL_OFFSET, 'fill/color/value', rgba(0, 1, 0, 0.5)]
        : [IMAGE_BLOCK, rgba(0, 1, 0, 0.5)])
    );
  });
});

describe('FTA-U22 uploadFile', () => {
  const clicked: EventTarget[] = [];
  const listener = (event: Event) => {
    if (event.target != null) clicked.push(event.target);
  };

  beforeEach(() => {
    clicked.length = 0;
    document.addEventListener('click', listener);
  });

  afterEach(() => {
    document.removeEventListener('click', listener);
  });

  function picker(): HTMLInputElement {
    return clicked.at(-1) as HTMLInputElement;
  }

  function answerWith(files: File[] | null): void {
    const element = picker();
    Object.defineProperty(element, 'files', { value: files, writable: true });
    element.dispatchEvent(new Event('change'));
  }

  it('opens one hidden picker limited to the given types, and reuses it', async () => {
    const pending = uploadFile({ supportedMimeTypes: ['image/*'] });
    const first = picker();
    expect(first.getAttribute('type')).toBe('file');
    expect(first.getAttribute('accept')).toBe('image/*');
    expect(first.getAttribute('multiple')).toBe('true');
    expect(first.style.display).toBe('none');
    expect(document.body.contains(first)).toBe(true);

    const file = new File(['x'], 'a.png', { type: 'image/png' });
    answerWith([file]);
    await expect(pending).resolves.toEqual([file]);

    const second = uploadFile({ supportedMimeTypes: [], multiple: false });
    expect(picker()).toBe(first);
    answerWith([file]);
    await second;
  });

  it('rejects when the picker reports no files', async () => {
    const pending = uploadFile({ supportedMimeTypes: ['image/*'] });
    answerWith(null);
    await expect(pending).rejects.toThrow('No files selected');
  });
});

describe('FTA-U23 replacing an image', () => {
  const clicked: EventTarget[] = [];
  const listener = (event: Event) => {
    if (event.target != null) clicked.push(event.target);
  };
  let test: Harness;
  let action: { onClick: () => void };

  beforeEach(async () => {
    clicked.length = 0;
    document.addEventListener('click', listener);
    test = harness();
    await initialize(test);
    test.activeChanged[0]();
    await vi.waitFor(() =>
      expect(test.engine.editor.addUndoStep).toHaveBeenCalled()
    );
    action = renderPanel(test).find(({ kind }) => kind === 'MediaPreview')
      ?.options.action as { onClick: () => void };
  });

  afterEach(() => {
    document.removeEventListener('click', listener);
  });

  function answerPicker(): void {
    const element = clicked.at(-1) as HTMLInputElement;
    Object.defineProperty(element, 'files', {
      value: [new File(['x'], 'a.png', { type: 'image/png' })],
      writable: true
    });
    element.dispatchEvent(new Event('change'));
  }

  it('clears the old fill before it adds the chosen file', async () => {
    action.onClick();
    answerPicker();

    await vi.waitFor(() =>
      expect(test.engine.block.addImageFileURIToSourceSet).toHaveBeenCalled()
    );
    expect(test.engine.block.setString).toHaveBeenCalledWith(
      IMAGE_BLOCK + FILL_OFFSET,
      'fill/image/imageFileURI',
      ''
    );
    expect(test.engine.block.setSourceSet).toHaveBeenCalledWith(
      IMAGE_BLOCK + FILL_OFFSET,
      'fill/image/sourceSet',
      []
    );
    expect(test.engine.block.addImageFileURIToSourceSet).toHaveBeenCalledWith(
      IMAGE_BLOCK + FILL_OFFSET,
      'fill/image/sourceSet',
      'blob:relocated'
    );
  });

  it('reports a failed replacement instead of leaving the preview loading', async () => {
    const logged = vi.spyOn(console, 'error').mockImplementation(() => {});
    test.engine.block.addImageFileURIToSourceSet.mockRejectedValue(
      new Error('unreadable image')
    );

    action.onClick();
    answerPicker();

    await vi.waitFor(() => expect(logged).toHaveBeenCalled());
    expect(logged).toHaveBeenCalledWith('Error uploading image');
  });
});

describe('FTA-U24 a single-line block gets a text input', () => {
  it('chooses the input from the text the template shipped', async () => {
    const test = harness();
    test.engine.block.getString.mockReturnValue('One line');
    await initialize(test);
    test.activeChanged[0]();
    await vi.waitFor(() =>
      expect(test.engine.editor.addUndoStep).toHaveBeenCalled()
    );

    const controls = renderPanel(test);
    expect(controls.some(({ kind }) => kind === 'TextInput')).toBe(true);
    expect(controls.some(({ kind }) => kind === 'TextArea')).toBe(false);
  });
});
