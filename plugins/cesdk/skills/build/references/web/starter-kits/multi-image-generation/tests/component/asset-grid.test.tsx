// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import AssetGrid from '../../src/app/AssetGrid/AssetGrid';
import { TEMPLATES } from '../../src/app/template-catalog';
import type { GeneratedAsset } from '../../src/imgly';

const templates = Object.values(TEMPLATES);

function assets(overrides: Partial<GeneratedAsset>[] = []): GeneratedAsset[] {
  return templates.map((template, index) => ({
    isLoading: false,
    src: null,
    sceneString: null,
    label: template.label,
    ...overrides[index]
  }));
}

// MIG-C1
describe('AssetGrid', () => {
  it('shows one card per template, on its placeholder preview', () => {
    render(
      <AssetGrid templates={templates} assets={assets()} onEdit={vi.fn()} />
    );

    for (const template of templates) {
      const card = screen.getByAltText(`${template.label} template`);
      expect(card.getAttribute('src')).toBe(template.previewImagePath);
      expect(card.getAttribute('width')).toBe(String(template.width));
    }
  });

  it('shows a generated image over the placeholder', () => {
    render(
      <AssetGrid
        templates={templates}
        assets={assets([{ src: 'blob:generated' }])}
        onEdit={vi.fn()}
      />
    );

    expect(
      screen.getByAltText(`${templates[0].label} template`).getAttribute('src')
    ).toBe('blob:generated');
  });

  it('marks only the card that is still rendering', () => {
    render(
      <AssetGrid
        templates={templates}
        assets={assets([undefined, { isLoading: true }])}
        onEdit={vi.fn()}
      />
    );
    const wrapper = (index: number) =>
      screen.getByAltText(`${templates[index].label} template`).parentElement
        ?.className;

    expect(wrapper(1)).toContain('loading');
    expect(wrapper(0)).not.toContain('loading');
  });

  it('reports the template and its index when Edit is clicked', async () => {
    // The overlay is `pointer-events: none` until the card is hovered, which
    // jsdom does not model.
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const onEdit = vi.fn();
    render(
      <AssetGrid templates={templates} assets={assets()} onEdit={onEdit} />
    );

    await user.click(screen.getAllByRole('button', { name: 'Edit' })[2]);

    expect(onEdit).toHaveBeenCalledWith(templates[2], 2);
  });
});
