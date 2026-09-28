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
import { renderEditor } from './support/renderEditor';
import {
  EditorProvider,
  useEditor
} from '../../src/app/contexts/EditorContext';
import { useProperty } from '../../src/app/hooks/UseSelectedProperty';
import { getImageDimensions } from '../../src/app/components/getImageDimensions';
import { uploadFile } from '../../src/imgly/upload';
import BottomControls from '../../src/app/components/BottomControls/BottomControls';
import ImageSelect from '../../src/app/components/ImageSelect/ImageSelect';
import InspectorBar from '../../src/app/components/InspectorBar/InspectorBar';
import ShapeSelect from '../../src/app/components/ShapeSelect/ShapeSelect';
import TextAlignmentIcon from '../../src/app/components/TextAlignmentIcon/TextAlignmentIcon';
import TopBar from '../../src/app/components/TopBar/TopBar';
import { SlideUpPanelHeader } from '../../src/app/components/SlideUpPanel/SlideUpPanel';

vi.mock('@cesdk/engine', async () => {
  const { engineHolder: holder } = await import('./support/engineHolder');
  return { default: { init: async () => holder.engine } };
});

let engine: FakeEngine;

beforeEach(async () => {
  engine = createFakeEngine();
  const { engineHolder } = await import('./support/engineHolder');
  engineHolder.engine = engine;
});

afterEach(() => {
  delete (window as { cesdk?: unknown }).cesdk;
  document.querySelector('input[type=file]')?.remove();
  vi.restoreAllMocks();
});

/** Render `children` under the real provider, once the engine is up. */
const WhenReady = ({ children }: { children: ReactNode }) =>
  useEditor().engineIsLoaded ? <>{children}</> : null;

const InEditor = ({ children }: { children: ReactNode }) => (
  <EditorProvider engineConfig={{ license: 'test' }}>
    <WhenReady>{children}</WhenReady>
  </EditorProvider>
);

describe('MB-C23 the two context guards', () => {
  it('tells a caller that useEditor needs the provider', () => {
    const Consumer = () => {
      useEditor();
      return null;
    };
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<Consumer />)).toThrow(
      'useEditor must be used within a EditorProvider'
    );
  });

  it('tells a caller that useSlideUp needs the panel', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<SlideUpPanelHeader headline="Crop" />)).toThrow(
      'useSlideUp must be used within a SlideUpProvider'
    );
  });
});

describe('MB-C24 the provider drops an engine it no longer needs', () => {
  it('disposes an engine that finished initialising after the unmount', async () => {
    const { unmount } = render(<InEditor>{null}</InEditor>);
    unmount();
    await waitFor(() => expect(engine.dispose).toHaveBeenCalledTimes(1));
  });
});

describe('MB-C25 property access without a block', () => {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <InEditor>{children}</InEditor>
  );

  it('hands back a null value and a no-op setter', async () => {
    const { result } = renderHook(() => useProperty(undefined, 'fill/x'), {
      wrapper
    });
    await waitFor(() => expect(result.current[0]).toBeNull());
    expect(() => result.current[1]('anything')).not.toThrow();
  });

  it('swallows a read the engine rejects and reports it', async () => {
    engine.block.getPropertyType.mockImplementation(() => {
      throw new Error('unknown property');
    });
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    renderHook(() => useProperty(5, 'nope/at/all'), { wrapper });

    await waitFor(() => expect(log).toHaveBeenCalled());
    expect(log.mock.calls[0][0]).toBeInstanceOf(Error);
  });

  it('swallows a write the engine rejects', async () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    const { result } = renderHook(() => useProperty(5, 'text/x'), { wrapper });
    await waitFor(() => expect(result.current[1]).toBeTypeOf('function'));

    engine.block.setEnum.mockImplementation(() => {
      throw new Error('read only');
    });
    act(() => result.current[1]('Left'));
    expect(log).toHaveBeenCalled();
  });
});

describe('MB-C26 the inspector bar without a deletable selection', () => {
  it('shows no delete button when the selection is not a kind the kit deletes', async () => {
    engine.setSelection([5]);
    engine.block.getKind.mockReturnValue('page');
    render(
      <InEditor>
        <InspectorBar adjustments={[]} onAdjustmentChange={vi.fn()} />
      </InEditor>
    );
    await waitFor(() => expect(engine.scene.load).toHaveBeenCalled());
    await act(async () => engine.emitEvents());
    expect(screen.queryByRole('button', { name: 'Delete' })).toBeNull();
  });
});

describe('MB-C27 the asset grids filter by group', () => {
  it('asks the image source for one group only', async () => {
    render(
      <InEditor>
        <ImageSelect onSelect={vi.fn()} group="florals" />
      </InEditor>
    );
    await waitFor(() =>
      expect(engine.asset.findAssets).toHaveBeenCalledWith('ly.img.image', {
        page: 0,
        perPage: 9999,
        groups: ['florals']
      })
    );
  });

  it('asks the shape source for one group only', async () => {
    render(
      <InEditor>
        <ShapeSelect onClick={vi.fn()} group="florals" />
      </InEditor>
    );
    await waitFor(() =>
      expect(engine.asset.findAssets).toHaveBeenCalledWith(
        'ly.img.vector.shape',
        { page: 0, perPage: 9999, groups: ['florals'] }
      )
    );
  });
});

describe('MB-C28 the alignment icon', () => {
  const iconFor = async (alignment: string) => {
    engine.block.getEnum.mockReturnValue(alignment);
    engine.setSelection([5]);
    const { container, unmount } = render(
      <InEditor>
        <TextAlignmentIcon />
      </InEditor>
    );
    await waitFor(() => expect(container.querySelector('svg')).toBeTruthy());
    // The selection only reaches React through an engine event.
    await act(async () => engine.emitEvents());
    const markup = container.innerHTML;
    unmount();
    return markup;
  };

  it('renders a different icon per alignment', async () => {
    const [left, center, right] = [
      await iconFor('Left'),
      await iconFor('Center'),
      await iconFor('Right')
    ];
    expect(new Set([left, center, right]).size).toBe(3);
  });

  it('falls back to the centre icon for an alignment it does not know', async () => {
    expect(await iconFor('Justify')).toBe(await iconFor('Center'));
  });
});

describe('MB-C29 collapsing each panel', () => {
  it.each([
    ['Text', 'Add Text'],
    ['Image', 'Add Image'],
    ['Sticker', 'Add Sticker']
  ])('closes the %s panel', async (button, headline) => {
    await renderEditor(engine);
    await userEvent.click(screen.getByRole('button', { name: button }));
    expect(await screen.findByText(headline)).toBeTruthy();

    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    await waitFor(() => expect(screen.queryByText(headline)).toBeNull());
  });

  it('closes the shape colour panel', async () => {
    engine.setSelection([5]);
    engine.block.getKind.mockReturnValue('shape');
    await renderEditor(engine);
    await act(async () => engine.emitEvents());

    await userEvent.click(await screen.findByRole('button', { name: 'Color' }));
    await userEvent.click(screen.getByRole('button', { name: 'Collapse' }));
    await waitFor(() =>
      expect(screen.queryByRole('button', { name: 'Collapse' })).toBeNull()
    );
  });
});

describe('MB-C30 the file picker and the image measurement', () => {
  it('rejects when the picker reports no files', async () => {
    const pending = uploadFile({ supportedMimeTypes: ['image/png'] });
    const input = document.querySelector(
      'input[type=file]'
    ) as HTMLInputElement;
    Object.defineProperty(input, 'files', { configurable: true, value: null });
    input.dispatchEvent(new Event('change'));

    await expect(pending).rejects.toThrow('No files selected');
  });

  it('rejects when the image cannot be decoded', async () => {
    await expect(getImageDimensions('broken')).rejects.toBeInstanceOf(Error);
  });

  it('resolves with the decoded size', async () => {
    await expect(getImageDimensions('photo.png')).resolves.toEqual({
      width: 320,
      height: 240
    });
  });
});

describe('MB-C31 single-page focus in text edit mode', () => {
  it('scrolls to the cursor instead of zooming to the page', async () => {
    engine.editor.getEditMode.mockReturnValue('Text');
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(900);
    engine.setSelection([5]);
    await renderEditor(engine);
    engine.scene.zoomToBlock.mockClear();

    await act(async () => engine.emitStateChanged());

    await waitFor(() =>
      expect(engine.block.setPositionY).toHaveBeenCalledWith(
        7,
        expect.any(Number)
      )
    );
    expect(engine.scene.zoomToBlock).not.toHaveBeenCalled();
  });
});

describe('MB-C32 the bars render nothing before the engine is up', () => {
  it.each([
    ['top bar', <TopBar key="t" />],
    ['bottom bar', <BottomControls key="b" />]
  ])('holds the %s back', (_name, bar) => {
    const { container } = render(
      <EditorProvider engineConfig={{ license: 'test' }}>{bar}</EditorProvider>
    );
    expect(container.textContent).toBe('');
  });
});

describe('MB-C33 refocus on a viewport resize', () => {
  it('refocuses when the visual viewport changes size', async () => {
    const subscribe = vi.spyOn(window.visualViewport!, 'addEventListener');
    await renderEditor(engine);
    await waitFor(() =>
      expect(subscribe).toHaveBeenCalledWith('resize', expect.any(Function))
    );
    engine.scene.zoomToBlock.mockClear();

    await act(async () => {
      window.visualViewport?.dispatchEvent(new Event('resize'));
    });
    expect(engine.scene.zoomToBlock).toHaveBeenCalled();
  });

  it('follows the text cursor while the engine stays in text mode', async () => {
    engine.editor.getEditMode.mockReturnValue('Text');
    engine.setSelection([5]);
    await renderEditor(engine);
    // The first change puts the hook into text mode; the second is the one the
    // cursor subscription sees.
    await act(async () => engine.emitStateChanged());
    engine.editor.getTextCursorPositionInScreenSpaceX.mockReturnValue(120);
    engine.editor.getTextCursorPositionInScreenSpaceY.mockReturnValue(900);
    await act(async () => engine.emitStateChanged());

    await waitFor(() =>
      expect(engine.block.setPositionY).toHaveBeenCalledWith(
        7,
        expect.any(Number)
      )
    );
  });
});

describe('MB-C34 the entry point', () => {
  it('reports a missing root container instead of failing silently', async () => {
    document.getElementById('root')?.remove();
    const error = vi.spyOn(console, 'error').mockImplementation(() => {});

    await import('../../src/index');

    await waitFor(() => expect(error).toHaveBeenCalled());
    expect(error.mock.calls[0][0]).toBe('Failed to initialize application:');
    expect(error.mock.calls[0][1]).toBeInstanceOf(Error);
    expect((error.mock.calls[0][1] as Error).message).toBe(
      'Root container not found'
    );
  });
});
