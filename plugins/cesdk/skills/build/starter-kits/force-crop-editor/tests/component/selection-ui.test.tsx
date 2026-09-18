// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import type React from 'react';

import SelectionUI from '../../src/app/SelectionUI';
import { DEFAULT_CROP_PRESETS } from '../../src/app/crop-presets';
import { SAMPLE_IMAGES } from '../../src/app/sample-images';

type SelectionProps = React.ComponentProps<typeof SelectionUI>;

function renderSelection(overrides: Partial<SelectionProps> = {}) {
  const props: SelectionProps = {
    images: SAMPLE_IMAGES,
    presets: DEFAULT_CROP_PRESETS,
    selectedImage: SAMPLE_IMAGES[0],
    selectedPreset: DEFAULT_CROP_PRESETS[0],
    selectedMode: 'always' as const,
    onImageChange: vi.fn(),
    onPresetChange: vi.fn(),
    onModeChange: vi.fn(),
    onOpenEditor: vi.fn(),
    ...overrides
  };
  render(<SelectionUI {...props} />);
  return props;
}

// FCE-C1
describe('SelectionUI', () => {
  it('shows the three cards, the three images and the three presets', () => {
    renderSelection();

    expect(
      screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    ).toEqual(['Select Image', 'Select Crop Preset', 'Select Mode']);
    for (const image of SAMPLE_IMAGES) {
      expect(screen.getByAltText(image.alt)).toBeTruthy();
    }
    for (const preset of DEFAULT_CROP_PRESETS) {
      expect(screen.getByAltText(preset.meta.thumbAlt)).toBeTruthy();
    }
  });

  it('renders a square preset as 1:1 and the others as their pixel ratio', () => {
    renderSelection();

    for (const preset of DEFAULT_CROP_PRESETS) {
      const { width, height } = preset.payload.transformPreset;
      const ratio = width === height ? '1:1' : `${width}:${height}`;
      const label = screen
        .getByAltText(preset.meta.thumbAlt)
        .closest('div')?.nextElementSibling;

      expect(label?.textContent).toBe(
        `${preset.label.en.replace(/\s*\([^)]*\)/, '')}(${ratio})`
      );
    }
  });

  it('marks the selected image, preset and mode, and nothing else', () => {
    renderSelection({
      selectedImage: SAMPLE_IMAGES[1],
      selectedPreset: DEFAULT_CROP_PRESETS[2],
      selectedMode: 'silent'
    });

    expect(
      screen.getByAltText(SAMPLE_IMAGES[1].alt).parentElement?.className
    ).toContain('selected');
    expect(
      screen.getByAltText(SAMPLE_IMAGES[0].alt).parentElement?.className
    ).not.toContain('selected');
    expect(
      screen.getByAltText(DEFAULT_CROP_PRESETS[2].meta.thumbAlt).closest('div')
        ?.parentElement?.className
    ).toContain('selected');
    expect(screen.getByRole('button', { name: 'Silent' }).className).toContain(
      'selected'
    );
  });

  it('describes the chosen mode', () => {
    renderSelection({ selectedMode: 'ifNeeded' });

    expect(
      screen.getByText(
        'This mode opens the Crop Mode only if image does not match the aspect ratio.'
      )
    ).toBeTruthy();
  });

  it('reports every choice the user makes', async () => {
    const user = userEvent.setup();
    const props = renderSelection();

    await user.click(screen.getByAltText(SAMPLE_IMAGES[2].alt));
    expect(props.onImageChange).toHaveBeenCalledWith(SAMPLE_IMAGES[2]);

    await user.click(
      screen.getByAltText(DEFAULT_CROP_PRESETS[1].meta.thumbAlt)
    );
    expect(props.onPresetChange).toHaveBeenCalledWith(DEFAULT_CROP_PRESETS[1]);

    await user.click(screen.getByRole('button', { name: 'If Needed' }));
    expect(props.onModeChange).toHaveBeenCalledWith('ifNeeded');

    await user.click(screen.getByRole('button', { name: 'Open Editor' }));
    expect(props.onOpenEditor).toHaveBeenCalledTimes(1);
  });
});
