/**
 * FileSelection - File selection screen component
 */
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { UploadZone } from '../UploadZone/UploadZone';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';

/**
 * Demo assets for this example (PDF files, previews, icons, …) are loaded
 * from the IMG.LY CDN by default. To host them yourself, copy this kit's
 * asset folder to your own CDN or server and change this constant — or set
 * it to `''` and place the files in this app's `public/` directory. No
 * trailing slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.80.0-rc.1/starterkit-pdf-template-import';

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'postcard',
    pdfUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/postcard.pdf`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/postcard-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/postcard-preview.png`,
    alt: 'Postcard'
  },
  {
    name: 'poster',
    pdfUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/poster.pdf`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/poster-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/poster-preview.png`,
    alt: 'Poster'
  },
  {
    name: 'socialmedia',
    pdfUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/socialmedia.pdf`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/socialmedia-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pdf-template-import/socialmedia-preview.png`,
    alt: 'Social Media'
  }
];

export function FileSelection() {
  const { processFile, processUploadedFile } = useFileProcessing();

  return (
    <div className={classes.cardBlock}>
      <UploadZone
        onUpload={(file: File) => {
          processUploadedFile(file);
        }}
        accept={['.pdf']}
        filetypeNotice="Supports .pdf Format"
      >
        Upload PDF File
      </UploadZone>
      <ExampleFileContainer
        files={EXAMPLE_FILES}
        onClick={(file) => {
          processFile(file);
        }}
      />
    </div>
  );
}
