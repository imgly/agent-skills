/**
 * FileSelection - File selection screen component
 */
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { ExampleFileContainer } from '../ExampleFileContainer/ExampleFileContainer';
import { UploadZone } from '../UploadZone/UploadZone';
import { resolveAssetPath } from '../resolveAssetPath';
import type { ExampleFile } from '../types';
import classes from './FileSelection.module.css';

const EXAMPLE_FILES: ExampleFile[] = [
  {
    name: 'socialmedia',
    idmlUrl: resolveAssetPath(
      '/cases/indesign-template-import/socialmedia.idml'
    ),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/indesign-template-import/socialmedia-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/indesign-template-import/socialmedia-1.png'
    ),
    alt: 'Social Media Template'
  },
  {
    name: 'poster',
    idmlUrl: resolveAssetPath('/cases/indesign-template-import/poster.idml'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/indesign-template-import/poster-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/indesign-template-import/poster-1.png'
    ),
    alt: 'Poster Template'
  },
  {
    name: 'postcard',
    idmlUrl: resolveAssetPath('/cases/indesign-template-import/postcard.idml'),
    thumbnailBaseUrl: resolveAssetPath(
      '/cases/indesign-template-import/postcard-thumb'
    ),
    previewUrl: resolveAssetPath(
      '/cases/indesign-template-import/postcard-1.png'
    ),
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
