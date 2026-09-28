// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { uploadFile } from '../../src/imgly/upload';

const hiddenInput = () =>
  document.querySelector('input[type="file"]') as HTMLInputElement;

const selectFiles = (input: HTMLInputElement, files: File[] | null) => {
  Object.defineProperty(input, 'files', { configurable: true, value: files });
  input.dispatchEvent(new Event('change'));
};

describe('PH-U8 uploadFile', () => {
  it('builds one hidden input and reuses it', async () => {
    const first = uploadFile({ supportedMimeTypes: ['image/png'] });
    const input = hiddenInput();
    expect(input.style.display).toBe('none');
    expect(input.getAttribute('accept')).toBe('image/png');
    expect(input.getAttribute('multiple')).toBe('true');
    selectFiles(input, [new File(['a'], 'a.png', { type: 'image/png' })]);
    await first;

    const second = uploadFile({
      supportedMimeTypes: ['image/jpeg', 'image/webp'],
      multiple: false
    });
    expect(document.querySelectorAll('input[type="file"]')).toHaveLength(1);
    expect(hiddenInput().getAttribute('accept')).toBe('image/jpeg,image/webp');
    selectFiles(hiddenInput(), [new File(['b'], 'b.jpg')]);
    await second;
  });

  it('resolves with the selected files and clears the input', async () => {
    const pending = uploadFile({ supportedMimeTypes: ['image/png'] });
    const input = hiddenInput();
    selectFiles(input, [
      new File(['a'], 'a.png'),
      new File(['b'], 'b.png')
    ] as File[]);

    const files = await pending;
    expect(files.map((file) => file.name)).toEqual(['a.png', 'b.png']);
    expect(input.onchange).toBeNull();
    expect(input.value).toBe('');
  });

  it('rejects when the change event carries no file list', async () => {
    const pending = uploadFile({ supportedMimeTypes: [] });
    selectFiles(hiddenInput(), null);
    await expect(pending).rejects.toThrow('No files selected');
  });
});
