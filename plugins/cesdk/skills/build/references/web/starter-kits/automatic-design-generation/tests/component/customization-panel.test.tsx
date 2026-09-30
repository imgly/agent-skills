// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import type React from 'react';

import { CustomizationPanel } from '../../src/app/CustomizationPanel/CustomizationPanel';
import { PRESET_COLORS } from '../../src/app/constants';
import { SIZES } from '../../src/app/api/transformer';

function renderPanel(
  overrides: Partial<React.ComponentProps<typeof CustomizationPanel>> = {}
) {
  const props: React.ComponentProps<typeof CustomizationPanel> = {
    message: 'Listen now',
    backgroundColor: PRESET_COLORS[0],
    selectedSizeIndexes: [0],
    outputType: 'image',
    videoSupported: true,
    isLoading: false,
    onMessageChange: vi.fn(),
    onColorChange: vi.fn(),
    onSizeToggle: vi.fn(),
    onTypeChange: vi.fn(),
    ...overrides
  };
  const view = render(<CustomizationPanel {...props} />);
  return { ...view, props };
}

// ADG-C7
describe('CustomizationPanel', () => {
  it('offers the shipped preset colours and every size', () => {
    renderPanel();

    for (const color of PRESET_COLORS) {
      expect(
        screen.getByRole('button', { name: `Select color ${color}` })
      ).toBeTruthy();
    }
    expect(screen.getAllByRole('checkbox')).toHaveLength(SIZES.length);
  });

  it('reports the message, a preset colour and a size the user picks', async () => {
    const user = userEvent.setup();
    const { props } = renderPanel();

    await user.type(screen.getByRole('textbox'), '!');
    expect(props.onMessageChange).toHaveBeenCalledWith('Listen now!');

    await user.click(
      screen.getByRole('button', { name: `Select color ${PRESET_COLORS[1]}` })
    );
    expect(props.onColorChange).toHaveBeenCalledWith(PRESET_COLORS[1]);

    await user.click(screen.getAllByRole('checkbox')[1]);
    expect(props.onSizeToggle).toHaveBeenCalledWith(1);
  });

  it('opens the colour picker from its own button', async () => {
    const user = userEvent.setup();
    const { container } = renderPanel();
    const modal = () => container.querySelector('[class*="pickerModal"]');

    expect(modal()?.className).not.toContain('pickerModalOpen');
    await user.click(
      screen.getByRole('button', { name: 'Toggle color picker' })
    );

    expect(modal()?.className).toContain('pickerModalOpen');
  });

  it.each([
    ['image' as const, 'Video', 'video' as const],
    ['video' as const, 'Image', 'image' as const]
  ])(
    'switches from %s to the other type',
    async (outputType, label, picked) => {
      const user = userEvent.setup();
      const { props } = renderPanel({ outputType });

      await user.click(screen.getByText(label));

      expect(props.onTypeChange).toHaveBeenCalledWith(picked);
    }
  );

  it('warns and refuses to switch when video is unsupported', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { props } = renderPanel({ videoSupported: false });

    expect(
      screen.getByText('Video is only supported in Chromium-based browsers.')
    ).toBeTruthy();

    await user.click(screen.getByText('Video'));
    expect(props.onTypeChange).not.toHaveBeenCalled();
  });

  it('marks the chosen type and locks both while a generation runs', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    const { props } = renderPanel({ outputType: 'video', isLoading: true });

    expect(screen.getByText('Video').closest('button')?.className).toContain(
      'active'
    );
    expect(
      screen.getByText('Image').closest('button')?.className
    ).not.toContain('active');

    await user.click(screen.getByText('Image'));
    expect(props.onTypeChange).not.toHaveBeenCalled();
  });

  it('shows no warning while video is supported', () => {
    renderPanel();

    expect(
      screen.queryByText('Video is only supported in Chromium-based browsers.')
    ).toBeNull();
  });
});
