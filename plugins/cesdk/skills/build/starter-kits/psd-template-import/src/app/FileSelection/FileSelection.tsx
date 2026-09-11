/**
 * FileSelection - File selection screen component
 */
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { UploadZone } from '../UploadZone/UploadZone';
import { resolveAssetPath } from '../resolveAssetPath';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'showcase-file-1',
    psdUrl: resolveAssetPath('/cases/psd-template-import/showcase-file-1.psd'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-1-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-1.png'
    ),
    alt: 'Skin Care Template'
  },
  {
    name: 'showcase-file-2',
    psdUrl: resolveAssetPath('/cases/psd-template-import/showcase-file-2.psd'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-2-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-2.png'
    ),
    alt: 'Landscape Photo Template'
  },
  {
    name: 'showcase-file-3',
    psdUrl: resolveAssetPath('/cases/psd-template-import/showcase-file-3.psd'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-3-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/psd-template-import/showcase-file-3.png'
    ),
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
