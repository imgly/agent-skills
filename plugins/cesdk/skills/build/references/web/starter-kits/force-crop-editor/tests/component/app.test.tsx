// @vitest-environment jsdom
import { render, screen, userEvent } from '@imgly/kit-test-harness/component';
import { afterEach, describe, expect, it, vi } from 'vitest';

const reportDemoPhase = vi.hoisted(() => vi.fn());

vi.mock('../../../shared/demo-preview/lifecycle', () => ({
  reportDemoPhase
}));

import App from '../../src/app/App';
import { DEFAULT_CROP_PRESETS } from '../../src/app/crop-presets';
import { SAMPLE_IMAGES } from '../../src/app/sample-images';

function selectedImageAlt(): string | null | undefined {
  return document
    .querySelector('[class*="imageOption"][class*="selected"] img')
    ?.getAttribute('alt');
}

afterEach(() => {
  vi.restoreAllMocks();
  reportDemoPhase.mockClear();
});

// FCE-C2
describe('App', () => {
  it('starts on the first image, the first preset and the Always mode', () => {
    render(<App config={{}} />);

    expect(selectedImageAlt()).toBe(SAMPLE_IMAGES[0].alt);
    expect(screen.getByRole('button', { name: 'Always' }).className).toContain(
      'selected'
    );
    expect(
      screen.getByText('This mode opens the Crop Mode always.')
    ).toBeTruthy();
  });

  it('reports the shell as the end of this demo\u2019s automatic load', () => {
    render(<App config={{}} />);

    // No editor mounts until the visitor opens one.
    expect(reportDemoPhase.mock.calls.flat()).toEqual(['shell']);
  });

  it('mounts the editor only after Open Editor is clicked', async () => {
    const user = userEvent.setup();
    render(<App config={{}} />);

    expect(document.querySelector('[class*="editorContainer"]')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Open Editor' }));

    const container = document.querySelector('[class*="editorContainer"]');
    expect(container).not.toBeNull();
    // The editor mounts one animation frame later.
    await vi.waitFor(() => expect(container?.children.length).toBe(1));
  });

  it('paints the container one frame before it mounts the editor', async () => {
    // The kit defers the mount to the next animation frame so the container is
    // laid out first; holding the frame back shows that intermediate state.
    vi.spyOn(window, 'requestAnimationFrame').mockReturnValue(1);
    const user = userEvent.setup();
    render(<App config={{}} />);

    await user.click(screen.getByRole('button', { name: 'Open Editor' }));

    expect(document.querySelector('[class*="editorContainer"]')).not.toBeNull();
    expect(
      document.querySelector('[class*="editorContainer"]')?.children.length
    ).toBe(0);
  });

  it('keeps the preset and the mode when the image changes', async () => {
    const user = userEvent.setup();
    render(<App config={{}} />);

    await user.click(screen.getByRole('button', { name: 'Silent' }));
    await user.click(
      screen.getByAltText(DEFAULT_CROP_PRESETS[1].meta.thumbAlt)
    );
    await user.click(screen.getByAltText(SAMPLE_IMAGES[2].alt));

    expect(selectedImageAlt()).toBe(SAMPLE_IMAGES[2].alt);
    expect(screen.getByRole('button', { name: 'Silent' }).className).toContain(
      'selected'
    );
    expect(
      screen.getByAltText(DEFAULT_CROP_PRESETS[1].meta.thumbAlt).closest('div')
        ?.parentElement?.className
    ).toContain('selected');
  });
});
