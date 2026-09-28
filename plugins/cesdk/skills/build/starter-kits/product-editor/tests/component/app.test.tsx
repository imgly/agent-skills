// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const SAMPLES = vi.hoisted(() => [
  {
    id: 'mug',
    label: 'Mug',
    designUnit: 'Millimeter',
    areas: [
      { id: 'front', pageSize: { width: 10, height: 10 } },
      { id: 'back', pageSize: { width: 10, height: 10 }, disabled: true }
    ],
    // No colour is marked as the default, so the kit falls back to the first.
    colors: [
      { id: 'white', colorHex: '#ffffff' },
      { id: 'black', colorHex: '#000000' }
    ]
  },
  {
    id: 'cap',
    label: 'Cap',
    designUnit: 'Millimeter',
    areas: [{ id: 'front', pageSize: { width: 10, height: 10 } }],
    colors: [
      { id: 'red', colorHex: '#ff0000', isDefault: true },
      { id: 'blue', colorHex: '#0000ff' }
    ]
  }
]);

const initProductEditor = vi.hoisted(() => vi.fn(async () => undefined));
const storeProductMetadata = vi.hoisted(() => vi.fn());
const downloadProductAssets = vi.hoisted(() => vi.fn(async () => undefined));
const setupSceneOptions = vi.hoisted(() =>
  vi.fn((product: { id: string }, color: { id: string }) => ({
    product: product.id,
    color: color.id
  }))
);

vi.mock('@cesdk/cesdk-js', () => ({ default: {} }));
vi.mock('../../src/imgly', () => ({ initProductEditor }));

const reportDemoPhase = vi.hoisted(() => vi.fn());

vi.mock('../../../shared/demo-preview/lifecycle', () => ({ reportDemoPhase }));
vi.mock('../../src/app/product-catalog', () => ({
  PRODUCT_SAMPLES: SAMPLES,
  ASSETS_BASE: 'https://products.test'
}));
vi.mock('../../src/app/utils/product', () => ({
  setupSceneOptions,
  storeProductMetadata,
  downloadProductAssets,
  readProductFromMetadata: () => null
}));

import App from '../../src/app/App';

function fakeEditor(visibleAreaId: string | null = 'front') {
  const calls: { id: string; args: unknown[] }[] = [];
  const setMetadata = vi.fn();
  return {
    calls,
    setMetadata,
    cesdk: {
      actions: {
        run: vi.fn(async (id: string, ...args: unknown[]) => {
          calls.push({ id, args });
          return id === 'product.getVisibleAreaId' ? visibleAreaId : undefined;
        })
      },
      engine: {
        scene: { get: () => 1 },
        block: { setMetadata }
      }
    }
  };
}

const ran = (editor: ReturnType<typeof fakeEditor>, id: string) =>
  editor.calls.filter((call) => call.id === id);

describe('PE-C1 the product editor screen', () => {
  beforeEach(() => {
    initProductEditor.mockClear();
    storeProductMetadata.mockClear();
    downloadProductAssets.mockClear();
    setupSceneOptions.mockClear();
    reportDemoPhase.mockClear();
  });

  it('renders the products and waits for the editor', () => {
    render(
      <App cesdk={null}>
        <div data-testid="editor" />
      </App>
    );

    expect(screen.getByTestId('editor')).toBeDefined();
    expect(screen.getByTitle('Mug')).toBeDefined();
    // No colours yet: the initial product id is not in the catalogue.
    expect(screen.queryByTitle('white')).toBeNull();
    expect(initProductEditor).not.toHaveBeenCalled();
  });

  it('sets up the first product with its fallback colour once the editor arrives', async () => {
    const editor = fakeEditor();

    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );

    expect(await screen.findByTitle('white')).toBeDefined();
    expect(initProductEditor).toHaveBeenCalledWith(editor.cesdk);
    expect(setupSceneOptions).toHaveBeenCalledWith(
      SAMPLES[0],
      SAMPLES[0].colors[0]
    );
    expect(storeProductMetadata).toHaveBeenCalledWith(
      editor.cesdk.engine,
      SAMPLES[0],
      SAMPLES[0].colors[0]
    );
    expect(ran(editor, 'product.switchArea')[0].args).toEqual(['front']);
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['ready']);
  });

  it('switches to another product with that product’s default colour', async () => {
    const editor = fakeEditor();
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('white');
    const user = userEvent.setup();

    await user.click(screen.getByTitle('Cap'));

    expect(await screen.findByTitle('red')).toBeDefined();
    expect(setupSceneOptions).toHaveBeenLastCalledWith(
      SAMPLES[1],
      SAMPLES[1].colors[0]
    );
    expect(ran(editor, 'product.switchArea').at(-1)!.args).toEqual(['front']);
  });

  it('keeps the visible area when the new product has none by that name', async () => {
    const editor = fakeEditor('sleeve');
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('white');
    const user = userEvent.setup();

    await user.click(screen.getByTitle('Cap'));

    await screen.findByTitle('red');
    expect(ran(editor, 'product.switchArea').at(-1)!.args).toEqual(['front']);
  });

  it('clicking the product it already shows changes nothing', async () => {
    const editor = fakeEditor();
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('white');
    const before = editor.calls.length;
    const user = userEvent.setup();

    await user.click(screen.getByTitle('Mug'));

    expect(editor.calls).toHaveLength(before);
  });

  it('applies a colour to every enabled area and stores it on the scene', async () => {
    const editor = fakeEditor();
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('black');
    const user = userEvent.setup();

    await user.click(screen.getByTitle('black'));

    const [variables] = ran(editor, 'product.applyVariables');
    expect(variables.args[0]).toEqual({ color: 'black' });
    expect(variables.args[1]).toEqual([{ id: 'front', mockup: undefined }]);
    expect(editor.setMetadata).toHaveBeenCalledWith(
      1,
      'color',
      JSON.stringify(SAMPLES[0].colors[1])
    );
    expect(ran(editor, 'product.switchArea').at(-1)!.args).toEqual(['front']);
  });

  it('falls back to the first area when the editor reports no visible one', async () => {
    const editor = fakeEditor(null);
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('black');
    const user = userEvent.setup();

    await user.click(screen.getByTitle('black'));

    expect(ran(editor, 'product.switchArea').at(-1)!.args).toEqual(['front']);
  });

  it('stores no colour while the editor holds no scene', async () => {
    const editor = fakeEditor();
    editor.cesdk.engine.scene.get = () => null as unknown as number;
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('black');
    const user = userEvent.setup();

    await user.click(screen.getByTitle('black'));

    expect(editor.setMetadata).not.toHaveBeenCalled();
  });

  it('applies no colour once the editor is gone', async () => {
    const editor = fakeEditor();
    const { rerender } = render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('black');
    rerender(
      <App cesdk={null}>
        <div />
      </App>
    );
    const before = editor.calls.length;
    const user = userEvent.setup();

    await user.click(screen.getByTitle('black'));

    expect(editor.calls).toHaveLength(before);
  });

  it('downloads the product assets from the sidebar link', async () => {
    const editor = fakeEditor();
    render(
      <App cesdk={editor.cesdk as never}>
        <div />
      </App>
    );
    await screen.findByTitle('white');
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'here' }));

    expect(downloadProductAssets).toHaveBeenCalledWith(editor.cesdk.engine);
  });

  it('does nothing without an editor', async () => {
    render(
      <App cesdk={null}>
        <div />
      </App>
    );
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: 'here' }));
    await user.click(screen.getByTitle('Cap'));
    // Mug declares no default colour, so this takes the first-colour fallback.
    await user.click(screen.getByTitle('Mug'));

    expect(downloadProductAssets).not.toHaveBeenCalled();
    expect(setupSceneOptions).not.toHaveBeenCalled();
  });
});
