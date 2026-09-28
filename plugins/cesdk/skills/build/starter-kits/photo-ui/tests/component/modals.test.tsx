// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import Modal from '../../src/app/Modal/Modal';
import UnsavedChangesModal from '../../src/app/UnsavedChangesModal/UnsavedChangesModal';

const changeImage = vi.fn();

vi.mock('../../src/app/contexts/EditorContext', () => ({
  useEditor: () => ({ changeImage })
}));

const IMAGE_URL = 'https://example.invalid/images/dog.jpg';

beforeEach(() => {
  changeImage.mockReset();
  changeImage.mockResolvedValue(undefined);
});

describe('PH-C1 Modal', () => {
  it('renders nothing when it is closed', () => {
    const { container } = render(
      <Modal open={false}>
        <p>hidden</p>
      </Modal>
    );
    expect(container.textContent).toBe('');
  });

  it('renders its children and its title when it is open', () => {
    render(
      <Modal open title="Unsaved Changes">
        <p>shown</p>
      </Modal>
    );
    expect(screen.getByText('shown')).toBeTruthy();
    expect(screen.getByText('Unsaved Changes')).toBeTruthy();
  });

  it('omits the title element when no title is given', () => {
    render(
      <Modal open>
        <p>shown</p>
      </Modal>
    );
    expect(screen.queryByText('Unsaved Changes')).toBeNull();
  });

  it('passes maxWidth and maxHeight to the dialog box', () => {
    render(
      <Modal open maxWidth="380px" maxHeight="200px">
        <p>shown</p>
      </Modal>
    );
    const box = screen.getByText('shown').parentElement as HTMLElement;
    expect(box.style.maxWidth).toBe('380px');
    expect(box.style.maxHeight).toBe('200px');
  });
});

describe('PH-C2 UnsavedChangesModal', () => {
  const onClose = vi.fn();

  beforeEach(() => onClose.mockReset());

  it('offers Cancel, Discard Changes and Apply Changes', () => {
    render(<UnsavedChangesModal imageUrl={IMAGE_URL} onClose={onClose} />);
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
    expect(
      screen.getByRole('button', { name: 'Discard Changes' })
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Apply Changes' })).toBeTruthy();
  });

  it('closes without touching the photo on Cancel', async () => {
    render(<UnsavedChangesModal imageUrl={IMAGE_URL} onClose={onClose} />);
    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(changeImage).not.toHaveBeenCalled();
  });

  it('discards the changes on Discard Changes', async () => {
    render(<UnsavedChangesModal imageUrl={IMAGE_URL} onClose={onClose} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Discard Changes' })
    );

    expect(changeImage).toHaveBeenCalledWith(IMAGE_URL, false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps the changes on Apply Changes', async () => {
    render(<UnsavedChangesModal imageUrl={IMAGE_URL} onClose={onClose} />);
    await userEvent.click(
      screen.getByRole('button', { name: 'Apply Changes' })
    );

    expect(changeImage).toHaveBeenCalledWith(IMAGE_URL, true);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
