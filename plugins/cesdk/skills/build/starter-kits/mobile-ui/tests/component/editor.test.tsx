// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './support/jsdomEnv';
import { createFakeEngine, type FakeEngine } from './support/fakeEngine';

let engine: FakeEngine;

/** `toBeDisabled` has no types in this workspace; read the property instead. */
const disabledState = (name: string) =>
  (screen.getByRole('button', { name }) as HTMLButtonElement).disabled;

vi.mock('@cesdk/engine', () => ({
  default: { init: vi.fn(async () => engine) }
}));

const App = (await import('../../src/app/App')).default;
const { UPLOAD_MIME_TYPES } = await import('../../src/imgly');

const renderApp = async (fake: FakeEngine) => {
  engine = fake;
  const result = render(<App engineConfig={{ license: 'test' }} />);
  await waitFor(() =>
    expect(screen.getByRole('button', { name: 'Canvas size' })).toBeTruthy()
  );
  return result;
};

beforeEach(() => {
  engine = createFakeEngine();
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
});

describe('MB-C10 the editor boots through EditorProvider', () => {
  it('shows the loading spinner until the engine is ready', async () => {
    const { container } = await renderApp(createFakeEngine());
    // The spinner is gone once the top bar has replaced it.
    expect(container.querySelector('svg')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Undo' })).toBeTruthy();
  });

  it('registers exactly the sources the kit ships, then loads the scene', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);

    const jsonSources =
      fake.asset.addLocalAssetSourceFromJSONURI.mock.calls.map(([uri]) => uri);
    expect(jsonSources).toEqual([
      'https://assets.test/ly.img.typeface/content.json',
      'https://assets.test/ly.img.vector.shape/content.json',
      'https://assets.test/ly.img.sticker/content.json',
      'https://assets.test/ly.img.image/content.json'
    ]);
    expect(fake.asset.addLocalSource).toHaveBeenCalledWith(
      'ly.img.image.upload',
      UPLOAD_MIME_TYPES
    );
    expect(fake.scene.load).toHaveBeenCalledWith(
      expect.stringContaining('/social-media.scene')
    );
  });

  it('narrows the engine to the mobile gestures the custom UI owns', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);

    expect(fake.editor.setSetting.mock.calls).toEqual([
      ['mouse/enableScroll', false],
      ['mouse/enableZoom', false],
      ['page/title/show', false]
    ]);
  });

  it('mounts the engine canvas into the kit container', async () => {
    const fake = createFakeEngine();
    const { container } = await renderApp(fake);
    expect(container.querySelector('#cesdk')?.contains(fake.element)).toBe(
      true
    );
  });

  it('filters the shape source to the filled vector shapes', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    const shapeCall = fake.asset.addLocalAssetSourceFromJSONURI.mock.calls.find(
      ([uri]) => String(uri).includes('vector.shape')
    );
    expect(shapeCall?.[1]).toEqual({
      matcher: ['ly.img.vector.shape.filled.*']
    });
  });
});

describe('MB-C11 the provider mirrors engine state into React', () => {
  it('tracks the selection an engine event reports', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    expect(screen.getByRole('button', { name: 'Text' })).toBeTruthy();

    fake.setSelection([5]);
    fake.block.getKind.mockReturnValue('text');
    await act(async () => fake.emitEvents());

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Font' })).toBeTruthy()
    );
  });

  it('ignores an empty event batch', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    fake.setSelection([5]);
    fake.block.getKind.mockReturnValue('text');
    await act(async () => fake.emitEvents([]));

    expect(screen.queryByRole('button', { name: 'Font' })).toBeNull();
  });

  it('follows the engine into crop mode and disables the top bar there', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    expect(disabledState('Canvas size')).toBe(false);

    fake.editor.getEditMode.mockReturnValue('Crop');
    await act(async () => fake.emitStateChanged());

    await waitFor(() => expect(disabledState('Canvas size')).toBe(true));
  });

  it('disables undo and redo from the engine history flags', async () => {
    const fake = createFakeEngine();
    fake.editor.canUndo.mockReturnValue(false);
    fake.editor.canRedo.mockReturnValue(false);
    await renderApp(fake);
    await act(async () => fake.emitEvents());

    await waitFor(() => expect(disabledState('Undo')).toBe(true));
    expect(disabledState('Redo')).toBe(true);
  });

  it('exposes the engine on window for the browser suite', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    expect((window as { cesdk?: unknown }).cesdk).toBe(fake);
  });
});

describe('MB-C12 single-page focus', () => {
  it('zooms to the current page once the pages are known', async () => {
    const fake = createFakeEngine({ pages: [10, 11] });
    await renderApp(fake);

    await waitFor(() => expect(fake.scene.zoomToBlock).toHaveBeenCalled());
    expect(fake.scene.zoomToBlock.mock.calls[0][0]).toBe(10);
    expect(fake.scene.zoomToBlock.mock.calls[0][1]).toEqual({
      padding: { left: 8, top: 8, right: 8, bottom: 8 }
    });
  });

  it('shows only the current page when the scene has more than one', async () => {
    const fake = createFakeEngine({ pages: [10, 11] });
    await renderApp(fake);

    await waitFor(() => expect(fake.block.setVisible).toHaveBeenCalled());
    expect(fake.block.setVisible.mock.calls).toEqual([
      [10, true],
      [11, false]
    ]);
  });

  it('leaves a single-page scene visible as it is', async () => {
    const fake = createFakeEngine({ pages: [10] });
    await renderApp(fake);
    expect(fake.block.setVisible).not.toHaveBeenCalled();
  });

  it('refocuses when the engine leaves text edit mode', async () => {
    const fake = createFakeEngine({ pages: [10, 11] });
    await renderApp(fake);
    fake.scene.zoomToBlock.mockClear();

    fake.editor.getEditMode.mockReturnValue('Transform');
    await act(async () => fake.emitStateChanged());

    await waitFor(() => expect(fake.scene.zoomToBlock).toHaveBeenCalled());
  });
});

describe('MB-C13 the top bar', () => {
  it('undoes and redoes through the engine', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);
    // The buttons stay disabled until an engine event carries the history flags.
    await act(async () => fake.emitEvents());

    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(fake.editor.undo).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByRole('button', { name: 'Redo' }));
    expect(fake.editor.redo).toHaveBeenCalledTimes(1);
  });

  it('exports the current page as a PNG and downloads it', async () => {
    const fake = createFakeEngine({ pages: [10, 11] });
    await renderApp(fake);
    const click = vi
      .spyOn(HTMLAnchorElement.prototype, 'click')
      .mockImplementation(() => {});

    await userEvent.click(screen.getByTitle('download'));

    await waitFor(() => expect(fake.block.export).toHaveBeenCalled());
    expect(fake.block.export).toHaveBeenCalledWith(10, {
      mimeType: 'image/png'
    });
    expect(click).toHaveBeenCalled();
    click.mockRestore();
  });

  it('resizes every page from the canvas size modal', async () => {
    const fake = createFakeEngine({ pages: [10, 11] });
    await renderApp(fake);

    await userEvent.click(screen.getByRole('button', { name: 'Canvas size' }));
    expect(screen.getByRole('heading', { name: 'Size' })).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: /IG Story/ }));
    expect(fake.block.resizeContentAware).toHaveBeenCalledWith(
      [10, 11],
      1080,
      1920
    );
    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Size' })).toBeNull()
    );
  });

  it('closes the canvas size modal without resizing', async () => {
    const fake = createFakeEngine();
    await renderApp(fake);

    await userEvent.click(screen.getByRole('button', { name: 'Canvas size' }));
    const modal = screen.getByRole('heading', { name: 'Size' })
      .parentElement as HTMLElement;
    await userEvent.click(modal.querySelector('button') as HTMLButtonElement);

    await waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Size' })).toBeNull()
    );
    expect(fake.block.resizeContentAware).not.toHaveBeenCalled();
  });
});
