// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  waitFor
} from '@imgly/kit-test-harness/component';
import type { Configuration } from '@cesdk/cesdk-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ importIdmlFile: vi.fn() }));

vi.mock('../../src/imgly/plugins/idml-importer', () => ({
  importIdmlFile: mocks.importIdmlFile
}));

import {
  FileProcessingContextProvider,
  useFileProcessing
} from '../../src/app/FileProcessingContext/FileProcessingContext';
import type { ExampleFile, ProcessResult } from '../../src/app/types';

const EDITOR_CONFIG: Configuration = { license: 'a-license' };

const EXAMPLE: ExampleFile = {
  name: 'socialmedia',
  idmlUrl: 'https://assets.example.com/socialmedia.idml',
  thumbnailBaseUrl: 'https://assets.example.com/socialmedia-thumb',
  previewUrl: 'https://assets.example.com/socialmedia.png',
  alt: 'Skin Care Template'
};

const RESULT: ProcessResult = {
  imageUrl: 'blob:preview',
  sceneArchiveUrl: 'blob:archive',
  messages: [],
  fileName: 'socialmedia'
};

let context: ReturnType<typeof useFileProcessing>;

function Probe() {
  context = useFileProcessing();
  return (
    <dl>
      <dd data-testid="status">{context.status}</dd>
      <dd data-testid="message">{context.processMessage}</dd>
      <dd data-testid="processing">{String(context.isProcessing)}</dd>
    </dl>
  );
}

function renderProvider() {
  render(
    <FileProcessingContextProvider editorConfig={EDITOR_CONFIG}>
      <Probe />
    </FileProcessingContextProvider>
  );
}

function status() {
  return screen.getByTestId('status').textContent;
}

function message() {
  return screen.getByTestId('message').textContent;
}

function processing() {
  return screen.getByTestId('processing').textContent;
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response('file-bytes'))
  );
  // jsdom implements neither object-URL method.
  URL.createObjectURL = vi.fn(() => 'blob:uploaded');
  URL.revokeObjectURL = vi.fn();
});

describe('IDML-U2 the status drives the message and the processing flag', () => {
  it('starts idle, with no message and nothing in flight', () => {
    renderProvider();
    expect(status()).toBe('idle');
    expect(message()).toBe('');
    expect(processing()).toBe('false');
  });

  it('reports fetching, then processing, then done', async () => {
    let release: (result: ProcessResult) => void = () => {};
    mocks.importIdmlFile.mockReturnValue(
      new Promise<ProcessResult>((resolve) => {
        release = resolve;
      })
    );
    renderProvider();

    act(() => {
      void context.processFile(EXAMPLE);
    });
    expect(status()).toBe('fetching');
    expect(message()).toBe('Loading IDML file...');
    expect(processing()).toBe('true');

    await waitFor(() => expect(status()).toBe('processing'));
    expect(message()).toBe('Processing IDML file...');
    expect(processing()).toBe('true');

    await act(async () => {
      release(RESULT);
    });
    expect(status()).toBe('done');
    expect(message()).toBe('');
    expect(processing()).toBe('false');
    expect(context.result).toEqual(RESULT);
    expect(context.inferenceTime).toBeGreaterThanOrEqual(0);
  });

  it('reads an uploaded file straight from the picker, without fetching it', async () => {
    mocks.importIdmlFile.mockResolvedValue(RESULT);
    renderProvider();
    const file = new File(['bytes'], 'uploaded.idml');

    await act(async () => {
      await context.processUploadedFile(file);
    });

    expect(fetch).not.toHaveBeenCalled();
    expect(mocks.importIdmlFile).toHaveBeenCalledWith(file, 'uploaded.idml', {
      license: 'a-license',
      baseURL: undefined
    });
    expect(context.currentFile?.name).toBe('uploaded.idml');
    expect(context.currentFile?.previewUrl).toBe('');
  });
});

describe('IDML-U5 reset and error state', () => {
  it('revokes both object URLs and returns to the selection screen', async () => {
    mocks.importIdmlFile.mockResolvedValue(RESULT);
    renderProvider();

    await act(async () => {
      await context.processFile(EXAMPLE);
    });
    expect(context.result).toEqual(RESULT);

    act(() => {
      context.resetState();
    });

    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:preview');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:archive');
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2);
    expect(status()).toBe('idle');
    expect(context.result).toBeNull();
    expect(context.currentFile).toBeNull();
    expect(context.inferenceTime).toBe(0);
  });

  it('revokes nothing when there is no result to release', () => {
    renderProvider();
    act(() => {
      context.resetState();
    });
    expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  });

  it('keeps an uploaded file that failed to import on the error screen', async () => {
    mocks.importIdmlFile.mockRejectedValue(new Error('broken idml'));
    renderProvider();

    await act(async () => {
      await context.processUploadedFile(new File(['idml'], 'uploaded.idml'));
    });

    expect(status()).toBe('error');
    expect(context.error?.message).toBe('broken idml');
  });

  it('wraps a rejection that is not an Error', async () => {
    mocks.importIdmlFile.mockRejectedValue('broken idml');
    renderProvider();

    await act(async () => {
      await context.processFile(EXAMPLE);
    });

    expect(context.error?.message).toBe('Unknown error');
  });

  it('records the error a failed import raised', async () => {
    mocks.importIdmlFile.mockRejectedValue(new Error('broken idml'));
    renderProvider();

    await act(async () => {
      await context.processFile(EXAMPLE);
    });

    expect(context.error?.message).toBe('broken idml');
  });

  it('tells the user that the import failed', async () => {
    mocks.importIdmlFile.mockRejectedValue(new Error('broken idml'));
    renderProvider();

    await act(async () => {
      await context.processFile(EXAMPLE);
    });

    expect(status()).toBe('error');
    expect(message()).toBe('Error: Failed to process IDML file');
  });
});

describe('IDML-U14 the context refuses to work outside its provider', () => {
  it('names the provider a caller forgot to mount', () => {
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    expect(() => render(<Probe />)).toThrow(
      'useFileProcessing must be used within a FileProcessingContextProvider'
    );

    consoleError.mockRestore();
  });
});
