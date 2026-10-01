// @vitest-environment jsdom
import {
  act,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { useRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CustomizationPanel } from '../../src/app/CustomizationPanel/CustomizationPanel';
import { PRESET_COLORS } from '../../src/app/constants';
import { useOnClickOutside } from '../../src/app/CustomizationPanel/useOnClickOutside';

/**
 * jsdom defines `isTrusted` as a non-configurable getter on every event, so a
 * dispatched click can never be trusted. The handler the hook registered is
 * captured instead and called with the shape a real browser would deliver.
 */
function captureDocumentClickHandler() {
  const handlers: ((event: unknown) => void)[] = [];
  const add = document.addEventListener.bind(document);
  vi.spyOn(document, 'addEventListener').mockImplementation(
    (
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => {
      if (type === 'click') {
        handlers.push(listener as (event: unknown) => void);
      }
      add(type, listener, options);
    }
  );
  return (target: Node) =>
    handlers.forEach((handler) => handler({ target, isTrusted: true }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

// ADG-C11
describe('useOnClickOutside on a trusted click', () => {
  function Panel({ onOutside }: { onOutside: () => void }) {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, onOutside);
    return (
      <div>
        <div ref={ref}>
          <button type="button">inside</button>
        </div>
        <button type="button">outside</button>
      </div>
    );
  }

  it('runs the callback for a click outside and leaves one inside alone', () => {
    const clickOutside = captureDocumentClickHandler();
    const onOutside = vi.fn();
    render(<Panel onOutside={onOutside} />);

    clickOutside(screen.getByRole('button', { name: 'inside' }));
    expect(onOutside).not.toHaveBeenCalled();

    clickOutside(screen.getByRole('button', { name: 'outside' }));
    expect(onOutside).toHaveBeenCalledTimes(1);
  });
});

// ADG-C12
describe('CustomizationPanel closes its colour picker', () => {
  it('closes an open picker on a trusted click outside and stays closed otherwise', async () => {
    const clickOutside = captureDocumentClickHandler();
    const { container } = render(
      <CustomizationPanel
        message="Listen now"
        backgroundColor={PRESET_COLORS[0]}
        selectedSizeIndexes={[0]}
        outputType="image"
        videoSupported
        isLoading={false}
        onMessageChange={vi.fn()}
        onColorChange={vi.fn()}
        onSizeToggle={vi.fn()}
        onTypeChange={vi.fn()}
      />
    );
    const modal = () =>
      container.querySelector('[class*="pickerModal"]') as HTMLElement;

    // A click outside while the picker is closed leaves it closed.
    act(() => clickOutside(document.body));
    expect(modal().className).not.toContain('pickerModalOpen');

    await userEvent.click(
      screen.getByRole('button', { name: 'Toggle color picker' })
    );
    expect(modal().className).toContain('pickerModalOpen');

    act(() => clickOutside(document.body));
    expect(modal().className).not.toContain('pickerModalOpen');
  });
});
