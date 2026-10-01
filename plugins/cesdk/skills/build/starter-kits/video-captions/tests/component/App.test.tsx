// @vitest-environment jsdom
import { render, screen } from '@imgly/kit-test-harness/component';
import { describe, expect, it, vi } from 'vitest';

import { App, DEMO_ASSETS_BASE_URL } from '../../src/app/App';

vi.mock('../../src/imgly', () => ({
  initVideoCaptionsAutocaptionEditor: vi.fn(),
  initVideoCaptionsBlankEditor: vi.fn(),
  initVideoCaptionsImportEditor: vi.fn(),
  initVideoCaptionsPreCaptionedEditor: vi.fn()
}));
vi.mock('@cesdk/cesdk-js/react', () => ({
  default: () => null
}));

const MODES = [
  ['AI Auto Captions', 'autocaption-preview.png'],
  ['Blank Video Editor', 'blank-preview.png'],
  ['Caption Import', 'import-preview.png'],
  ['Pre-captioned Video', 'pre-captioned-preview.png']
];

describe('VCA-U5 the mode table', () => {
  it('renders the four options in order, each with its preview image', () => {
    render(<App editorConfig={{}} />);

    const headings = screen
      .getAllByRole('heading', { level: 5 })
      .map((node) => node.textContent);
    expect(headings).toEqual(MODES.map(([label]) => label));

    MODES.forEach(([label, image]) => {
      expect(
        screen.getByRole('img', { name: `${label} Preview` })
      ).toHaveProperty('src', `${DEMO_ASSETS_BASE_URL}/assets/${image}`);
    });
  });

  it('offers the SRT download on the import option only', () => {
    render(<App editorConfig={{}} />);

    expect(screen.getAllByRole('button', { name: 'Open Editor' })).toHaveLength(
      4
    );
    expect(
      screen.getAllByRole('button', { name: 'Download .srt File' })
    ).toHaveLength(1);
  });
});
