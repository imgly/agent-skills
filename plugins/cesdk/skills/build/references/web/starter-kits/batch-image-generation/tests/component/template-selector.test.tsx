// @vitest-environment jsdom
import {
  fireEvent,
  render,
  screen,
  userEvent
} from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import { TemplateSelector } from '../../src/app/TemplateSelector/TemplateSelector';
import type { Template } from '../../src/app/types';

const templates = {
  portrait: { label: 'Portrait', previewImagePath: '/p.png' } as Template,
  landscape: { label: 'Landscape', previewImagePath: '/l.png' } as Template
};

function renderSelector() {
  const onSelect = vi.fn();
  const onEdit = vi.fn();
  render(
    <TemplateSelector
      templates={templates}
      selectedTemplateName="portrait"
      onSelect={onSelect}
      onEdit={onEdit}
    />
  );
  const tile = (label: string) =>
    screen.getByAltText(label).closest('[role="button"]')!;
  return { onSelect, onEdit, tile };
}

describe('BIG-C1 TemplateSelector', () => {
  it('selects another template by click and by the Enter key', async () => {
    const { onSelect, tile } = renderSelector();

    await userEvent.click(tile('Landscape'));
    fireEvent.keyDown(tile('Landscape'), { key: 'Enter' });

    expect(onSelect).toHaveBeenCalledTimes(2);
    expect(onSelect).toHaveBeenCalledWith('landscape');
  });

  it('reports nothing for the template that is already selected', async () => {
    const { onSelect, tile } = renderSelector();

    await userEvent.click(tile('Portrait'));
    fireEvent.keyDown(tile('Portrait'), { key: 'Enter' });
    fireEvent.keyDown(tile('Landscape'), { key: 'ArrowDown' });

    expect(onSelect).not.toHaveBeenCalled();
  });

  it('opens the editor from the selected template only', async () => {
    const { onEdit } = renderSelector();

    await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

    expect(onEdit).toHaveBeenCalledTimes(1);
  });
});
