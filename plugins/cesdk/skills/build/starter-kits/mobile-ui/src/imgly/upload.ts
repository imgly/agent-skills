export type UploadContent = string | ArrayBuffer;
export type UploadOptions = {
  supportedMimeTypes: string[];
  multiple?: boolean;
  type?: 'string' | 'file';
};

let fileInput: HTMLInputElement | undefined;

function getFileInput(): HTMLInputElement {
  if (fileInput == null) {
    fileInput = document.createElement('input');
    fileInput.setAttribute('type', 'file');
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }
  return fileInput;
}

/**
 * Trigger a file upload dialog and return the selected files.
 */
export function uploadFile({
  supportedMimeTypes,
  multiple = true
}: UploadOptions): Promise<File[]> {
  const element = getFileInput();
  const accept = supportedMimeTypes.join(',');

  return new Promise<File[]>((resolve, reject) => {
    if (accept) {
      element.setAttribute('accept', accept);
    }
    if (multiple) {
      element.setAttribute('multiple', String(multiple));
    }
    element.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files) {
        const files = Object.values(target.files);
        resolve(files);
      } else {
        reject(new Error('No files selected'));
      }
      element.onchange = null;
      element.value = '';
    };
    element.click();
  });
}
