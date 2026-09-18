// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  ExampleFile,
  FileProcessingContextValue,
  ProcessResult
} from '../../src/app/types';

const mocks = vi.hoisted(() => ({ useFileProcessing: vi.fn() }));

vi.mock('../../src/app/FileProcessingContext/FileProcessingContext', () => ({
  useFileProcessing: mocks.useFileProcessing
}));

vi.mock('../../src/app/CreativeEditor/CreativeEditor', () => ({
  CreativeEditor: ({
    sceneArchiveUrl,
    closeEditor
  }: {
    sceneArchiveUrl: string;
    closeEditor: () => void;
  }) => (
    <div data-testid="editor">
      {sceneArchiveUrl}
      <button onClick={closeEditor}>Close the editor</button>
    </div>
  )
}));

import { ResultScreen } from '../../src/app/ResultScreen/ResultScreen';

const EXAMPLE: ExampleFile = {
  name: 'socialmedia',
  idmlUrl: 'https://assets.example.com/socialmedia.idml',
  thumbnailBaseUrl: 'https://assets.example.com/socialmedia-thumb',
  previewUrl: 'https://assets.example.com/socialmedia.png',
  alt: 'Skin Care Template'
};

const UPLOADED: ExampleFile = {
  ...EXAMPLE,
  name: 'uploaded.idml',
  previewUrl: ''
};

const resetState = vi.fn();
let clicked: HTMLAnchorElement[] = [];

function result(fileName: string): ProcessResult {
  return {
    imageUrl: 'blob:preview',
    sceneArchiveUrl: 'blob:archive',
    messages: [],
    fileName
  };
}

function renderResult(
  fileName = 'socialmedia.idml',
  currentFile: ExampleFile | null = EXAMPLE
) {
  mocks.useFileProcessing.mockReturnValue({
    result: result(fileName),
    currentFile,
    resetState,
    editorConfig: {}
  } as unknown as FileProcessingContextValue);
  render(<ResultScreen />);
}

beforeEach(() => {
  vi.clearAllMocks();
  clicked = [];
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    clicked.push(this);
  });
});

describe('IDML-U6 the archive download name', () => {
  it.each([
    ['socialmedia.idml', 'socialmedia.imgly'],
    ['A.IDML', 'A.imgly'],
    ['noextension', 'noextension.imgly']
  ])('turns %s into %s', async (fileName, expected) => {
    renderResult(fileName);
    await userEvent.click(
      screen.getByRole('button', { name: /Download CE\.SDK Archive/ })
    );
    expect(clicked).toHaveLength(1);
    expect(clicked[0].download).toBe(expected);
    expect(clicked[0].href).toBe('blob:archive');
  });
});

describe('the result screen shows both files side by side', () => {
  it('names the two columns and offers Edit, Download and New File', () => {
    renderResult();
    expect(
      screen.getByRole('heading', { name: 'InDesign File' })
    ).toBeDefined();
    expect(
      screen.getByRole('heading', { name: 'Imported Result' })
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /^Edit/ })).toBeDefined();
    expect(
      screen.getByRole('button', { name: /Download CE\.SDK Archive/ })
    ).toBeDefined();
    expect(screen.getByRole('button', { name: /New File/ })).toBeDefined();
    expect(screen.getByAltText('Imported Result')).toHaveProperty(
      'src',
      'blob:preview'
    );
  });

  it('shows the original preview for a pre-loaded example', () => {
    renderResult();
    expect(screen.getAllByText('PNG Preview')).toHaveLength(2);
    expect(screen.getByAltText('Original InDesign File')).toHaveProperty(
      'src',
      EXAMPLE.previewUrl
    );
  });

  it('says there is no preview for an uploaded file', () => {
    renderResult('uploaded.idml', UPLOADED);
    expect(screen.getByText('No Preview Available')).toBeDefined();
    expect(screen.queryByAltText('Original InDesign File')).toBeNull();
    expect(screen.getByText(/uploaded\.idml/)).toBeDefined();
  });

  it('renders nothing while there is no result', () => {
    mocks.useFileProcessing.mockReturnValue({
      result: null,
      currentFile: null,
      resetState,
      editorConfig: {}
    } as unknown as FileProcessingContextValue);
    const { container } = render(<ResultScreen />);
    expect(container.innerHTML).toBe('');
  });

  it('returns to the selection screen through New File', async () => {
    renderResult();
    await userEvent.click(screen.getByRole('button', { name: /New File/ }));
    expect(resetState).toHaveBeenCalledTimes(1);
  });

  it('opens the editor on the archive through Edit', async () => {
    renderResult();
    expect(screen.queryByTestId('editor')).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /^Edit/ }));
    expect(screen.getByTestId('editor').textContent).toContain('blob:archive');
  });

  it('returns to the result screen when the editor closes itself', async () => {
    renderResult();
    await userEvent.click(screen.getByRole('button', { name: /^Edit/ }));

    await userEvent.click(
      screen.getByRole('button', { name: 'Close the editor' })
    );

    expect(screen.queryByTestId('editor')).toBeNull();
    expect(screen.getByRole('button', { name: /New File/ })).toBeDefined();
  });

  it('names the file generically when there is nothing to name', () => {
    renderResult('uploaded.idml', null);
    expect(screen.getByText(/Please compare with the file in/)).toBeDefined();
  });
});
