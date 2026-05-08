/**
 * UploadZone - Drag & drop file upload component
 */
import classNames from 'classnames';
import { useState } from 'react';
import { resolveAssetPath } from '../resolveAssetPath';
import classes from './UploadZone.module.css';

interface UploadZoneProps {
  onUpload: (file: File) => void;
  accept?: string[];
  filetypeNotice?: string;
  children: React.ReactNode;
}

export function UploadZone({
  children,
  onUpload,
  accept = ['.idml'],
  filetypeNotice = 'Supports .idml Format'
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const draggedData = e.dataTransfer;
    const [file] = Array.from(draggedData.files);
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!fileExtension) return;
    if (!accept.includes(`.${fileExtension}`)) return;

    onUpload(file);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const [file] = Array.from(files);
    if (!file) return;

    onUpload(file);
    event.target.value = '';
  };

  return (
    <label
      htmlFor="file-input"
      className={classNames(classes.uploadZone, {
        [classes.dragging]: isDragging
      })}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <img
        src={resolveAssetPath('/icons/upload.svg')}
        alt="Upload"
        className={classes.uploadIcon}
      />
      <span className="btn btn-primary">{children}</span>
      <input
        className={classes.hidden}
        type="file"
        id="file-input"
        onChange={handleFileChange}
        accept={accept.join(',')}
      />
      <small className={classes.filetypeNotice}>{filetypeNotice}</small>
    </label>
  );
}
