/**
 * ResultScreen - Comparison and result display component
 */
import { useState } from 'react';
import { useFileProcessing } from '../FileProcessingContext/FileProcessingContext';
import { CreativeEditor } from '../CreativeEditor/CreativeEditor';
import { InfoButton } from '../InfoButton/InfoButton';
import { resolveAssetPath } from '../resolveAssetPath';
import classes from './ResultScreen.module.css';

export function ResultScreen() {
  const { result, currentFile, resetState, editorConfig } = useFileProcessing();
  const [editorOpen, setEditorOpen] = useState(false);

  if (!result) return null;

  const { messages } = result;
  const warnings = messages
    .filter((m) => m.type === 'warning')
    .map((m) => m.message);
  const errors = messages
    .filter((m) => m.type === 'error')
    .map((m) => m.message);

  const handleDownloadArchive = () => {
    const link = document.createElement('a');
    link.href = result.sceneArchiveUrl;
    link.download = `${result.fileName.replace(/\.psd$/i, '')}.archive.zip`;
    link.click();
  };

  return (
    <>
      <div className={classes.cardBlock}>
        <div className={classes.resultScreen}>
          <div className={classes.resultHeader}>
            <button className="btn btn-plain" onClick={() => resetState()}>
              <img
                src={resolveAssetPath('/icons/chevron-left.svg')}
                alt="Back"
              />
              <span>New File</span>
            </button>
            <div className={classes.infoButtons}>
              <InfoButton messages={warnings} type="warning" />
              <InfoButton messages={errors} type="error" />
            </div>
          </div>

          <div className={classes.comparisonGrid}>
            {/* Column 1: Photoshop File */}
            <div>
              <h5 className={classes.heading}>Photoshop File</h5>
              <span className={classes.previewLabel}>
                {currentFile?.previewUrl
                  ? 'PNG Preview'
                  : 'No Preview Available'}
              </span>
            </div>
            <div className={classes.preview}>
              {currentFile?.previewUrl ? (
                <img
                  src={currentFile.previewUrl}
                  alt="Original Photoshop File"
                  className={classes.comparisonImage}
                />
              ) : (
                <div className={classes.noPreview}>
                  <img
                    src={resolveAssetPath('/icons/photoshop-file.svg')}
                    alt="Photoshop"
                  />
                  <p>
                    Please compare with {currentFile?.name || 'the file'} in
                    Photoshop on your machine
                  </p>
                </div>
              )}
            </div>
            <div className={classes.actions}></div>

            {/* Divider — spans all rows */}
            <div className={classes.divider}></div>

            {/* Column 2: Imported Result */}
            <div>
              <h5 className={classes.heading}>Imported Result</h5>
              <span className={classes.previewLabel}>PNG Preview</span>
            </div>
            <div className={classes.preview}>
              <img
                src={result.imageUrl}
                alt="Imported Result"
                className={classes.comparisonImage}
              />
            </div>
            <div className={classes.actions}>
              <button
                className="btn btn-primary btn-small"
                onClick={() => setEditorOpen(true)}
              >
                <img src={resolveAssetPath('/icons/edit.svg')} alt="Edit" />
                <span>Edit</span>
              </button>
              <button
                className="btn btn-secondary btn-small"
                onClick={handleDownloadArchive}
              >
                <img
                  src={resolveAssetPath('/icons/download.svg')}
                  alt="Download"
                />
                <span>Download CE.SDK Archive</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {editorOpen && (
        <CreativeEditor
          sceneArchiveUrl={result.sceneArchiveUrl}
          editorConfig={editorConfig}
          closeEditor={() => setEditorOpen(false)}
        />
      )}
    </>
  );
}
