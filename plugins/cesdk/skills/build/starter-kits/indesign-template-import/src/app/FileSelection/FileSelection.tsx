/**
 * FileSelection - File selection screen component
 */
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { UploadZone } from '../UploadZone/UploadZone';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';

/**
 * Demo assets for this example (IDML files, previews, icons, …) are loaded
 * from the IMG.LY CDN by default. To host them yourself, copy this kit's
 * asset folder to your own CDN or server and change this constant — or set
 * it to `''` and place the files in this app's `public/` directory. No
 * trailing slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.1-rc.0/starterkit-indesign-template-import';

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'socialmedia',
    idmlUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/socialmedia.idml`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/socialmedia-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/socialmedia-1.png`,
    alt: 'Social Media Template'
  },
  {
    name: 'poster',
    idmlUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/poster.idml`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/poster-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/poster-1.png`,
    alt: 'Poster Template'
  },
  {
    name: 'postcard',
    idmlUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/postcard.idml`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/postcard-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/indesign-template-import/postcard-1.png`,
    alt: 'Postcard Template'
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
        accept={['.idml']}
        filetypeNotice="Supports .idml Format"
      >
        Upload InDesign File
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
