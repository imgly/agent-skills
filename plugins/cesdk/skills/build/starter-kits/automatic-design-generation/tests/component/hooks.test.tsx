// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { useRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { useOnClickOutside } from '../../src/app/CustomizationPanel/useOnClickOutside';

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

// ADG-C4
describe('useOnClickOutside', () => {
  it('ignores a click the page made for itself, wherever it lands', async () => {
    // The hook only acts on a trusted event. jsdom marks every scripted click
    // untrusted and `isTrusted` cannot be redefined, so the callback itself is
    // only reachable from the browser suite.
    const user = userEvent.setup();
    const onOutside = vi.fn();
    render(<Panel onOutside={onOutside} />);

    await user.click(screen.getByRole('button', { name: 'inside' }));
    await user.click(screen.getByRole('button', { name: 'outside' }));

    expect(onOutside).not.toHaveBeenCalled();
  });

  it('stops listening once the element is gone', async () => {
    const user = userEvent.setup();
    const onOutside = vi.fn();
    const view = render(<Panel onOutside={onOutside} />);
    const outside = screen.getByRole('button', { name: 'outside' });

    view.unmount();
    await user.click(outside);

    expect(onOutside).not.toHaveBeenCalled();
  });
});
