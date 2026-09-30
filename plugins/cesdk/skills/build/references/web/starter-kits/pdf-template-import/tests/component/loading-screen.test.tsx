// @vitest-environment jsdom
import { act, render, screen } from '@imgly/kit-test-harness/component';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoadingScreen } from '../../src/app/LoadingScreen/LoadingScreen';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

function tick(milliseconds: number) {
  act(() => {
    vi.advanceTimersByTime(milliseconds);
  });
}

describe('PDF-U11 the loading screen reports how long the import runs', () => {
  it('shows the message the kit chose for the current step', () => {
    render(<LoadingScreen text="Processing PDF file..." />);
    expect(screen.getByText('Processing PDF file...')).toBeDefined();
  });

  it('starts the stopwatch at zero and counts up', () => {
    const { container } = render(<LoadingScreen text="Loading PDF file..." />);
    expect(container.textContent).toContain('0.00s');

    tick(1500);
    expect(container.textContent).toContain('1.50s');
  });

  it('shows the previous run time beside the current one', () => {
    const { container } = render(
      <LoadingScreen text="Processing PDF file..." lastInferenceTime={2.5} />
    );
    tick(1000);
    expect(container.textContent).toContain('1.00s / 2.50s');
  });

  it('stops counting when the screen goes away', () => {
    const { unmount } = render(<LoadingScreen text="Loading PDF file..." />);
    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
