// @vitest-environment jsdom
import {
  act,
  render,
  renderHook,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import './support/jsdomEnv';
import { createFakeEngine, type FakeEngine } from './support/fakeEngine';
import {
  EditorProvider,
  useEditor
} from '../../src/app/contexts/EditorContext';
import { useProperty } from '../../src/app/hooks/UseSelectedProperty';
import ColorSelect from '../../src/app/components/ColorSelect/ColorSelect';
import FontSelect from '../../src/app/components/FontSelect/FontSelect';
import InspectorBar from '../../src/app/components/InspectorBar/InspectorBar';
import ShapeSelect from '../../src/app/components/ShapeSelect/ShapeSelect';
import StickerSelect from '../../src/app/components/StickerSelect/StickerSelect';
import SlideUpPanel, {
  SlideUpPanelHeader
} from '../../src/app/components/SlideUpPanel/SlideUpPanel';

vi.mock('@cesdk/engine', async () => {
  const { engineHolder: holder } = await import('./support/engineHolder');
  return { default: { init: async () => holder.engine } };
});

// The real picker computes a colour from pointer geometry, which jsdom does not
// provide. The stand-in emits the hex string the picker emits.
vi.mock('react-colorful', () => ({
  HexColorPicker: ({ onChange }: { onChange: (hex: string) => void }) => (
    <button aria-label="picker" onClick={() => onChange('#123456')} />
  )
}));

let engine: FakeEngine;

beforeEach(async () => {
  engine = createFakeEngine();
  const { engineHolder } = await import('./support/engineHolder');
  engineHolder.engine = engine;
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
  document.getElementById('root')?.remove();
  vi.restoreAllMocks();
});

const WhenReady = ({ children }: { children: ReactNode }) =>
  useEditor().engineIsLoaded ? <>{children}</> : null;

const InEditor = ({ children }: { children: ReactNode }) => (
  <EditorProvider engineConfig={{ license: 'test' }}>
    <WhenReady>{children}</WhenReady>
  </EditorProvider>
);

describe('MB-C38 the entry point renders the app', () => {
  it('mounts the editor into the root container the page ships', async () => {
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    await act(async () => {
      await import('../../src/index');
    });

    await waitFor(() => expect(container.childElementCount).toBe(1));
    expect(error).not.toHaveBeenCalledWith(
      'Failed to initialize application:',
      expect.anything()
    );
  });
});

describe('MB-C39 the colour palette and the colour picker', () => {
  it('takes a palette entry as an engine colour and a picker value as a hex string', async () => {
    const onClick = vi.fn();
    render(
      <InEditor>
        <ColorSelect onClick={onClick} />
      </InEditor>
    );
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'picker' })).toBeTruthy()
    );

    await userEvent.click(screen.getByRole('button', { name: '#ff3333ff' }));
    expect(onClick).toHaveBeenLastCalledWith({ r: 1, g: 0.2, b: 0.2, a: 1 });

    await userEvent.click(screen.getByRole('button', { name: 'picker' }));
    expect(onClick).toHaveBeenLastCalledWith({
      r: 0x12 / 255,
      g: 0x34 / 255,
      b: 0x56 / 255,
      a: 1
    });
  });
});

describe('MB-C40 the font list', () => {
  it('falls back to the first font of a typeface that ships no regular one', async () => {
    engine.asset.findAssets.mockResolvedValue({
      assets: [
        {
          id: 'typeface-Caveat',
          meta: { thumbUri: 'Caveat.png' },
          payload: {
            typeface: {
              name: 'Caveat',
              fonts: [
                { uri: 'Caveat-Bold.ttf', weight: 'bold', style: 'normal' }
              ]
            }
          }
        }
      ],
      total: 1,
      currentPage: 0
    });
    const onSelect = vi.fn();
    render(
      <InEditor>
        <FontSelect onSelect={onSelect} />
      </InEditor>
    );

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /Caveat/ })).toBeTruthy()
    );
    await userEvent.click(screen.getByRole('button', { name: /Caveat/ }));
    expect(onSelect.mock.calls[0][0].uri).toBe('Caveat-Bold.ttf');
  });
});

describe('MB-C41 an inspector entry that carries its own handler', () => {
  const Icon = () => <span>icon</span>;

  it('runs the entry handler and closes the panel instead of opening it', async () => {
    const onClick = vi.fn(() => true);
    const onAdjustmentChange = vi.fn();
    render(
      <InspectorBar
        adjustments={[{ id: 'reset', label: 'Reset', Icon, onClick }]}
        onAdjustmentChange={onAdjustmentChange}
        hasDeleteButton={false}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Reset' }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onAdjustmentChange).toHaveBeenCalledWith();
  });
});

describe('MB-C42 an asset with no label', () => {
  const unlabelled = {
    assets: [{ id: 'shape-heart', meta: { thumbUri: 'heart.svg' } }],
    total: 1,
    currentPage: 0
  };

  it('labels a shape card with the asset id', async () => {
    engine.asset.findAssets.mockResolvedValue(unlabelled);
    render(
      <InEditor>
        <ShapeSelect onClick={vi.fn()} />
      </InEditor>
    );
    await waitFor(() =>
      expect(screen.getByAltText('shape-heart')).toBeTruthy()
    );
  });

  it('labels a sticker card with the asset id', async () => {
    engine.asset.findAssets.mockResolvedValue(unlabelled);
    render(
      <InEditor>
        <StickerSelect onClick={vi.fn()} />
      </InEditor>
    );
    await waitFor(() =>
      expect(screen.getByAltText('shape-heart')).toBeTruthy()
    );
  });
});

describe('MB-C43 the panel headline', () => {
  it('falls back to the panel default when the header carries none', async () => {
    render(
      <InEditor>
        <SlideUpPanel isExpanded defaultHeadline="Sticker">
          <SlideUpPanelHeader />
        </SlideUpPanel>
      </InEditor>
    );
    await waitFor(() => expect(screen.getByText('Sticker')).toBeTruthy());
  });
});

describe('MB-C44 the property setter before the engine is up', () => {
  it('does nothing while the provider still reports no engine', () => {
    const { result } = renderHook(() => useProperty(5, 'fill/color/value'), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <EditorProvider engineConfig={{ license: 'test' }}>
          {children}
        </EditorProvider>
      )
    });

    expect(() => result.current[1](1)).not.toThrow();
    expect(engine.block.setColor).not.toHaveBeenCalled();
  });
});

describe('MB-C45 the provider disposes the engine it created', () => {
  it('disposes on unmount once the editor has finished loading', async () => {
    const { unmount } = render(
      <InEditor>
        <span>ready</span>
      </InEditor>
    );
    await waitFor(() => expect(screen.getByText('ready')).toBeTruthy());

    unmount();
    expect(engine.dispose).toHaveBeenCalledTimes(1);
  });
});
