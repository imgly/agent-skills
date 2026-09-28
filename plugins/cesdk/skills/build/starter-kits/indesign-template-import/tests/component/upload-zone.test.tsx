// @vitest-environment jsdom
import { fireEvent, render, screen } from '@imgly/kit-test-harness/component';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UploadZone } from '../../src/app/UploadZone/UploadZone';

const ACCEPT = ['.idml'];

function file(name: string): File {
  return new File(['bytes'], name);
}

let onUpload: ReturnType<typeof vi.fn>;

function renderZone() {
  onUpload = vi.fn();
  render(
    <UploadZone onUpload={onUpload} accept={ACCEPT}>
      Upload InDesign File
    </UploadZone>
  );
  return screen.getByLabelText(/Upload InDesign File/);
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe('IDML-U1 the upload zone filters what it forwards', () => {
  it.each(['a.idml', 'a.IDML'])('forwards a dropped %s', (name) => {
    const input = renderZone();
    fireEvent.drop(input, { dataTransfer: { files: [file(name)] } });
    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(onUpload.mock.calls[0][0].name).toBe(name);
  });

  it.each(['a.indd', 'a.txt', 'noextension'])(
    'ignores a dropped %s',
    (name) => {
      const input = renderZone();
      fireEvent.drop(input, { dataTransfer: { files: [file(name)] } });
      expect(onUpload).not.toHaveBeenCalled();
    }
  );

  it('says why a dropped file was rejected, until a file is accepted', () => {
    const input = renderZone();
    fireEvent.drop(input, { dataTransfer: { files: [file('a.txt')] } });

    expect(screen.getByRole('alert').textContent).toBe(
      `Only ${ACCEPT.join(', ')} files can be imported.`
    );

    fireEvent.drop(input, { dataTransfer: { files: [file(`a${ACCEPT[0]}`)] } });
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('ignores a drop that carries no file', () => {
    const input = renderZone();
    fireEvent.drop(input, { dataTransfer: { files: [] } });
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('ignores a dropped file whose name has no extension after the dot', () => {
    const input = renderZone();
    fireEvent.drop(input, { dataTransfer: { files: [file('a.')] } });
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('ignores a dialog the user dismissed without picking anything', () => {
    const input = renderZone();
    fireEvent.change(input, { target: { files: [] } });
    expect(onUpload).not.toHaveBeenCalled();
  });

  it('keeps the zone highlighted while the pointer moves over it', () => {
    const input = renderZone();
    const zone = input.closest('label')!;

    fireEvent.dragOver(input, { dataTransfer: { files: [file('a.idml')] } });
    expect(zone.className).toContain('dragging');
  });

  it('highlights the zone while a file is dragged over it', () => {
    const input = renderZone();
    const zone = input.closest('label')!;
    expect(zone.className).not.toContain('dragging');

    fireEvent.dragEnter(input, { dataTransfer: { files: [file('a.idml')] } });
    expect(zone.className).toContain('dragging');

    fireEvent.dragLeave(input, { dataTransfer: { files: [file('a.idml')] } });
    expect(zone.className).not.toContain('dragging');
  });

  it('forwards a file picked through the dialog and clears the input', () => {
    const input = renderZone() as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file('a.idml')] } });
    expect(onUpload).toHaveBeenCalledTimes(1);
    expect(input.value).toBe('');
  });

  it('offers the accepted extensions to the file dialog', () => {
    const input = renderZone() as HTMLInputElement;
    expect(input.accept).toBe('.idml');
  });

  it('rejects a picked file the accept list does not cover', () => {
    const input = renderZone();
    fireEvent.change(input, { target: { files: [file('a.txt')] } });
    expect(onUpload).not.toHaveBeenCalled();
  });
});
