/**
 * FileSelection - File selection screen component
 */
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { UploadZone } from '../UploadZone/UploadZone';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';
import { DEMO_ASSETS_BASE_URL } from '../../imgly/demo-assets';
export { DEMO_ASSETS_BASE_URL };

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'example-1-skin',
    pptxUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-1-skin.pptx`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-1-skin-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-1-skin-preview.png`,
    alt: 'Skin Care Presentation'
  },
  {
    name: 'example-2-bike',
    pptxUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-2-bike.pptx`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-2-bike-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-2-bike-preview.png`,
    alt: 'Bike Presentation'
  },
  {
    name: 'example-3-social',
    pptxUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-3-social.pptx`,
    thumbnailBaseUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-3-social-thumb`,
    previewUrl: `${DEMO_ASSETS_BASE_URL}/cases/pptx-template-import/example-3-social-preview.png`,
    alt: 'Social Media Presentation'
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
        accept={['.pptx']}
        filetypeNotice="Supports .pptx Format"
      >
        Upload PowerPoint File
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
