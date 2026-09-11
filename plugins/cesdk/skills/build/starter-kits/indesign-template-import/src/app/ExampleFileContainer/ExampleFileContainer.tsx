/**
 * ExampleFileContainer - Example IDML files grid
 */
import { resolveAssetPath } from '../resolveAssetPath';
import type { ExampleFile } from '../types';
import classes from './ExampleFileContainer.module.css';

interface ExampleFileContainerProps {
  files: ExampleFile[];
  onClick: (file: ExampleFile) => void;
}

export function ExampleFileContainer({
  files,
  onClick
}: ExampleFileContainerProps) {
  return (
    <div className={classes.exampleSection}>
      <div className={classes.sectionHeader}>Or try these examples:</div>
      <div className={classes.exampleFiles}>
        {files.map((file) => (
          <button
            key={file.idmlUrl}
            className={classes.exampleFile}
            onClick={() => onClick(file)}
          >
            <img
              src={`${file.thumbnailBaseUrl}.png`}
              srcSet={`${file.thumbnailBaseUrl}.png 1x, ${file.thumbnailBaseUrl}@2x.png 2x`}
              alt={file.alt}
            />
            <img
              src={resolveAssetPath('/icons/indesign-file.svg')}
              alt="InDesign"
              className={classes.fileTypeIcon}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
