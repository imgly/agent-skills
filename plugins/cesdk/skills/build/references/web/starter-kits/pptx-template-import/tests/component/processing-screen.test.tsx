// @vitest-environment jsdom
import { render, screen } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { FileProcessingContextValue } from '../../src/app/types';

const mocks = vi.hoisted(() => ({ useFileProcessing: vi.fn() }));

vi.mock('../../src/app/FileProcessingContext/FileProcessingContext', () => ({
  useFileProcessing: mocks.useFileProcessing
}));

vi.mock('../../src/app/ResultScreen/ResultScreen', () => ({
  ResultScreen: () => <div data-testid="result" />
}));

import { FileProcessing } from '../../src/app/FileProcessing/FileProcessing';

function renderProcessing(inferenceTime: number) {
  mocks.useFileProcessing.mockReturnValue({
    currentFile: { name: 'example-1-skin' },
    result: null,
    isProcessing: true,
    processMessage: 'Processing PPTX file...',
    inferenceTime
  } as unknown as FileProcessingContextValue);
  return render(<FileProcessing />);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('PPTX-U16 the processing screen reports the previous run time', () => {
  it('shows only the current stopwatch on the first import', () => {
    const { container } = renderProcessing(0);
    expect(screen.getByText('Processing PPTX file...')).toBeDefined();
    expect(container.textContent).not.toContain(' / ');
  });

  it('shows the previous run time once one has been measured', () => {
    const { container } = renderProcessing(2.5);
    expect(container.textContent).toContain(' / 2.50s');
  });
});
