import { expect, waitForEditorReady } from '@imgly/kit-test-harness';
import type { Locator, Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEMO_DIR = resolve(
  __dirname,
  '../../../../../packages/cesdk-web-examples-data/data',
  'starterkit-indesign-template-import/cases/indesign-template-import'
);

export const EXAMPLES = [
  'Social Media Template InDesign',
  'Poster Template InDesign',
  'Postcard Template InDesign'
];

/** The smallest of the three demo files, so the upload cases stay quick. */
export const SMALLEST_DEMO_FILE = 'socialmedia.idml';

export function demoFile(name: string): string {
  return resolve(DEMO_DIR, name);
}

export class KitApp {
  constructor(readonly page: Page) {}

  get uploadInput(): Locator {
    return this.page.getByLabel('Upload InDesign File');
  }

  get newFile(): Locator {
    return this.page.getByRole('button', { name: /New File/ });
  }

  get edit(): Locator {
    return this.page.getByRole('button', { name: /^Edit/ });
  }

  get downloadArchive(): Locator {
    return this.page.getByRole('button', { name: /Download CE\.SDK Archive/ });
  }

  /** The editor's navigation bar, which is where this kit's editor controls sit. */
  get navigationBar(): Locator {
    return this.page.getByRole('region', { name: 'Navigation Bar' });
  }

  example(name: string): Locator {
    return this.page.getByRole('button', { name });
  }

  async open(): Promise<void> {
    await this.page.goto('./');
    await expect(this.uploadInput).toBeAttached();
  }

  /** Wait for the import to finish; the result screen is the only signal. */
  async waitForResult(): Promise<void> {
    await this.newFile.waitFor({ timeout: 180_000 });
  }

  async importExample(name: string): Promise<void> {
    await this.example(name).click();
    await this.waitForResult();
  }

  async upload(fileName: string): Promise<void> {
    await this.uploadInput.setInputFiles(demoFile(fileName));
  }

  async drop(fileName: string, contents?: Buffer): Promise<void> {
    const bytes = contents ?? readFileSync(demoFile(fileName));
    const dataTransfer = await this.page.evaluateHandle(
      ({ base64, name }) => {
        const binary = atob(base64);
        const buffer = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i += 1) {
          buffer[i] = binary.charCodeAt(i);
        }
        const transfer = new DataTransfer();
        transfer.items.add(new File([buffer], name));
        return transfer;
      },
      { base64: bytes.toString('base64'), name: fileName }
    );
    await this.uploadInput.dispatchEvent('dragenter', { dataTransfer });
    await this.uploadInput.dispatchEvent('drop', { dataTransfer });
    await dataTransfer.dispose();
  }

  async openEditor(): Promise<void> {
    await this.edit.click();
    await waitForEditorReady(this.page);
  }
}
