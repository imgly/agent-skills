// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';

import { render, userEvent } from '@imgly/kit-test-harness/component';

import type React from 'react';

import EditorModal from '../../src/app/EditorModal/EditorModal';
import { RESTAURANTS } from '../../src/app/restaurant-catalog';
import { TEMPLATES } from '../../src/app/template-catalog';

const TEMPLATE = Object.values(TEMPLATES)[0];

function renderModal(
  overrides: Partial<React.ComponentProps<typeof EditorModal>> = {}
) {
  const props: React.ComponentProps<typeof EditorModal> = {
    isOpen: true,
    template: TEMPLATE,
    sceneString: null,
    selectedRestaurant: null,
    editorBaseConfig: {},
    onBack: vi.fn(),
    onClose: vi.fn(),
    onSave: vi.fn(),
    ...overrides
  };
  render(<EditorModal {...props} />);
  return props;
}

afterEach(() => {
  document.body.classList.remove('no-scroll');
});

// MIG-C3
describe('EditorModal', () => {
  it('renders nothing while it is closed', () => {
    renderModal({ isOpen: false });

    expect(document.body.classList.contains('no-scroll')).toBe(false);
    expect(document.querySelector('[class*="overlay"]')).toBeNull();
  });

  it('renders nothing without a template, even when open', () => {
    renderModal({ template: null });

    expect(document.querySelector('[class*="overlay"]')).toBeNull();
  });

  it('locks the page behind the open modal', () => {
    renderModal();

    expect(document.body.classList.contains('no-scroll')).toBe(true);
    expect(document.querySelector('[class*="overlay"]')).not.toBeNull();
  });

  it('opens the same shell for a generated card of a restaurant', () => {
    renderModal({
      selectedRestaurant: RESTAURANTS[0],
      sceneString: '{"version":"1"}'
    });

    expect(document.body.classList.contains('no-scroll')).toBe(true);
    expect(document.querySelector('[class*="container"]')).not.toBeNull();
  });

  it('closes on Escape, and only while it is open', async () => {
    const user = userEvent.setup();
    const closed = renderModal({ isOpen: false });
    await user.keyboard('{Escape}');
    expect(closed.onClose).not.toHaveBeenCalled();

    // The editor cannot start under jsdom and closes the modal itself, so wait
    // for that before measuring what Escape does.
    const open = renderModal();
    await vi.waitFor(() => expect(open.onClose).toHaveBeenCalled());
    (open.onClose as ReturnType<typeof vi.fn>).mockClear();

    await user.keyboard('{Escape}');
    expect(open.onClose).toHaveBeenCalledTimes(1);
  });

  it('closes itself when the editor cannot start', async () => {
    // jsdom has no WebGL, so `CreativeEditorSDK.create` rejects and the kit's
    // own `onError` handler runs.
    const errors = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);
    const props = renderModal();

    await vi.waitFor(() => expect(props.onClose).toHaveBeenCalled(), {
      timeout: 60_000
    });
    expect(errors.mock.calls[0][0]).toBe('Failed to initialize editor:');
    errors.mockRestore();
  });
});
