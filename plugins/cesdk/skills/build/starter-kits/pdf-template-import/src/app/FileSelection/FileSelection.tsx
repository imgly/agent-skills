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
    name: 'postcard',
    pdfUrl: resolveAssetPath('/cases/pdf-template-import/postcard.pdf'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/pdf-template-import/postcard-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/pdf-template-import/postcard-preview.png'
    ),
    alt: 'Postcard'
  },
  {
    name: 'poster',
    pdfUrl: resolveAssetPath('/cases/pdf-template-import/poster.pdf'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/pdf-template-import/poster-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/pdf-template-import/poster-preview.png'
    ),
    alt: 'Poster'
  },
  {
    name: 'socialmedia',
    pdfUrl: resolveAssetPath('/cases/pdf-template-import/socialmedia.pdf'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/pdf-template-import/socialmedia-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/pdf-template-import/socialmedia-preview.png'
    ),
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
