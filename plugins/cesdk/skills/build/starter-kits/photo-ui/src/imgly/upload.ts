/**
 * File Upload Utilities
 *
 * Helper for triggering file uploads from the browser.
 */

export type UploadContent = string | ArrayBuffer;
export type UploadOptions = {
  supportedMimeTypes: string[];
  multiple?: boolean;
  type?: 'string' | 'file';
};

/**
 * Trigger a file upload dialog and return the selected files.
 */
export const uploadFile = (() => {
  const element: HTMLInputElement = document.createElement('input');
  element.setAttribute('type', 'file');
  element.style.display = 'none';
  document.body.appendChild(element);
  return ({ supportedMimeTypes, multiple = true }: UploadOptions) => {
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
  };
})();
