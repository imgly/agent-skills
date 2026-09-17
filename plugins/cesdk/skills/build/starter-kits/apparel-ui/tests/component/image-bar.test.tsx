// @vitest-environment jsdom
import type { CompleteAssetResult } from '@cesdk/engine';
import {
  render,
  screen,
  userEvent,
  waitFor
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import ImageBarButton from '../../src/app/ui/ImageBar/ImageBarButton';
import LoadingSpinner from '../../src/app/ui/LoadingSpinner/LoadingSpinner';

const asset = {
  id: 'asset-1',
  meta: { thumbUri: 'https://cdn.test/thumb.png' }
} as unknown as CompleteAssetResult;

describe('AP-C4 LoadingSpinner and ImageBarButton', () => {
  it('renders the spinner the image button falls back to', () => {
    const { container } = render(<LoadingSpinner />);
    expect(
      container.querySelector('[data-cy="loading-spinner"]')
    ).not.toBeNull();
  });

  it('disables the button and shows the spinner while its click runs', async () => {
    let finish: () => void = () => {};
    const onClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          finish = resolve;
        })
    );
    render(<ImageBarButton imageAsset={asset} onClick={onClick} />);
    const button = screen.getByRole('button');

    await userEvent.click(button);
    expect(button.hasAttribute('disabled')).toBe(true);

    finish();
    await waitFor(() => expect(button.hasAttribute('disabled')).toBe(false));
  });
});
