// @vitest-environment jsdom
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor
} from '@imgly/kit-test-harness/component';
import type { Configuration } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { ProcessResult } from '../../src/app/types';

const mocks = vi.hoisted(() => ({
  importPdfFile: vi.fn(),
  reportDemoPhase: vi.fn()
}));

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase: mocks.reportDemoPhase
}));

vi.mock('../../src/imgly/plugins/pdf-importer', () => ({
  importPdfFile: mocks.importPdfFile
}));

vi.mock('../../src/app/CreativeEditor/CreativeEditor', () => ({
  CreativeEditor: () => null
}));

import { App } from '../../src/app/App';

const EDITOR_CONFIG: Configuration = { license: 'a-license' };

const RESULT: ProcessResult = {
  imageUrl: 'blob:preview',
  sceneArchiveUrl: 'blob:archive',
  messages: [],
  fileName: 'postcard'
};

function renderApp() {
  return render(<App editorConfig={EDITOR_CONFIG} />);
}

function pending(): Promise<ProcessResult> {
  return new Promise<ProcessResult>(() => {});
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('pdf-bytes'))
  );
  URL.createObjectURL = vi.fn(() => 'blob:uploaded');
  URL.revokeObjectURL = vi.fn();
});

describe('PDF-U12 the screen follows the import state', () => {
  it('shows the error screen and retries the same file', async () => {
    mocks.importPdfFile.mockRejectedValueOnce(new Error('broken'));
    mocks.importPdfFile.mockResolvedValue(RESULT);
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /Postcard/ }));

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain(
        'Failed to import'
      )
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    await waitFor(() =>
      expect(screen.getByRole('button', { name: /New File/ })).toBeDefined()
    );
    expect(mocks.importPdfFile).toHaveBeenCalledTimes(2);
  });

  it('opens on the selection screen', () => {
    renderApp();
    expect(screen.getByLabelText(/Upload PDF File/)).toBeDefined();
    expect(screen.getByText('Or try these examples:')).toBeDefined();
  });

  it('shows the loading screen while the file is being imported', async () => {
    mocks.importPdfFile.mockReturnValue(pending());
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /Postcard/ }));

    await waitFor(() =>
      expect(screen.getByText('Processing PDF file...')).toBeDefined()
    );
    expect(screen.queryByText('Or try these examples:')).toBeNull();
  });

  it('shows the result screen once the import is done', async () => {
    mocks.importPdfFile.mockResolvedValue(RESULT);
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /Postcard/ }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: /New File/ })).toBeDefined()
    );
    expect(screen.queryByText('Processing PDF file...')).toBeNull();
  });
});

describe('PDF-U13 the selection screen offers both ways to pick a file', () => {
  it('imports the example file the user clicked', async () => {
    mocks.importPdfFile.mockResolvedValue(RESULT);
    renderApp();

    fireEvent.click(screen.getByRole('button', { name: /Postcard/ }));

    await waitFor(() => expect(mocks.importPdfFile).toHaveBeenCalledTimes(1));
    expect(fetch).toHaveBeenCalledWith(expect.stringContaining('postcard.pdf'));
    expect(mocks.importPdfFile.mock.calls[0][1]).toBe('postcard');
  });

  it('imports a file dropped on the upload zone, without fetching anything', async () => {
    mocks.importPdfFile.mockResolvedValue(RESULT);
    renderApp();
    const dropped = new File(['bytes'], 'own-design.pdf');

    await act(async () => {
      fireEvent.drop(screen.getByLabelText(/Upload PDF File/), {
        dataTransfer: { files: [dropped] }
      });
    });

    await waitFor(() => expect(mocks.importPdfFile).toHaveBeenCalledTimes(1));
    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.importPdfFile.mock.calls[0][0]).toBe(dropped);
  });
});

describe('PDF-U18 the demo lifecycle beacon', () => {
  it('reports the shell as soon as the app is on screen', () => {
    renderApp();
    expect(mocks.reportDemoPhase.mock.calls).toEqual([['shell']]);
  });
});
