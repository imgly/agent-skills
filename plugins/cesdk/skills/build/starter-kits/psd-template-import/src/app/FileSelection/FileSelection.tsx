/**
 * FileSelection - File selection screen component
 */
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { UploadZone } from '../UploadZone/UploadZone';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';

/**
 * Demo assets for this example (icons, PSD files, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.0-rc.1/starterkit-psd-template-import';

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'showcase-file-1',
    psdUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-1.psd`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-1-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-1.png`,
    alt: 'Skin Care Template'
  },
  {
    name: 'showcase-file-2',
    psdUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-2.psd`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-2-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-2.png`,
    alt: 'Landscape Photo Template'
  },
  {
    name: 'showcase-file-3',
    psdUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-3.psd`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-3-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/psd-template-import/showcase-file-3.png`,
    alt: 'Business Card Template'
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
        accept={['.psd', '.psb']}
        filetypeNotice="Supports .psd and .psb Formats"
      >
        Upload Photoshop File
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
