// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import { AssetCard } from '../../src/app/GeneratedAssets/AssetCard';
import { GeneratedAssets } from '../../src/app/GeneratedAssets/GeneratedAssets';
import type { GeneratedAsset } from '../../src/imgly';

const ASSET: GeneratedAsset = {
  id: 1,
  label: 'Instagram Post',
  src: 'blob:asset',
  sceneString: null,
  variables: {},
  isLoading: false,
  width: 1080,
  height: 1080,
  type: 'image'
};

function renderCard(overrides: Partial<GeneratedAsset> = {}) {
  const onDownload = vi.fn();
  const onEdit = vi.fn();
  const { container } = render(
    <AssetCard
      asset={{ ...ASSET, ...overrides }}
      onDownload={onDownload}
      onEdit={onEdit}
    />
  );
  return { container, onDownload, onEdit };
}

// ADG-C6
describe('AssetCard', () => {
  it('shows a spinner in the asset ratio while it renders', () => {
    const { container } = renderCard({ isLoading: true, height: 1920 });
    const wrapper = container.querySelector('[class*="loadingSpinnerWrapper"]');

    expect(wrapper).not.toBeNull();
    expect((wrapper as HTMLElement).style.aspectRatio).toBe('1080 / 1920');
    expect(screen.queryByRole('img', { name: 'Instagram Post' })).toBeNull();
  });

  it('shows an image asset as an image', () => {
    renderCard();

    expect(screen.getByRole('img', { name: 'Instagram Post' })).toBeTruthy();
  });

  it('shows a video asset as a muted looping video', () => {
    const { container } = renderCard({ type: 'video', src: 'blob:reel' });
    const video = container.querySelector('video');

    expect(video?.getAttribute('src')).toBe('blob:reel');
    expect(video?.hasAttribute('loop')).toBe(true);
    expect(video?.muted).toBe(true);
  });

  it.each(['image', 'video'] as const)(
    'falls back to an empty source while a %s asset has none',
    (type) => {
      const { container } = renderCard({ type, src: null });
      const media = container.querySelector(type === 'image' ? 'img' : 'video');

      expect(media?.getAttribute('src')).toBe('');
    }
  );

  it('reports an edit and a download', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { onDownload, onEdit } = renderCard();

    await user.click(screen.getByRole('button', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);

    await user.click(screen.getByRole('button', { name: 'Download' }));
    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});

// ADG-C20
describe('GeneratedAssets', () => {
  const story: GeneratedAsset = { ...ASSET, id: 2, label: 'Instagram Story' };

  it('lists the assets by id and reports the card that was used', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onDownload = vi.fn();
    const onEdit = vi.fn();
    render(
      <GeneratedAssets
        assets={[story, ASSET]}
        onDownload={onDownload}
        onEdit={onEdit}
      />
    );

    expect(
      screen
        .getAllByRole('img', { name: /^Instagram/ })
        .map((img) => img.getAttribute('alt'))
    ).toEqual(['Instagram Post', 'Instagram Story']);

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[1]);
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(onEdit).toHaveBeenCalledWith(story);

    await user.click(screen.getAllByRole('button', { name: 'Download' })[0]);
    expect(onDownload).toHaveBeenCalledTimes(1);
    expect(onDownload).toHaveBeenCalledWith(ASSET);
  });
});
