import { useRef, useState } from 'react';
import PhotoEditor from './PhotoEditor';
import './App.css';

export default function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
  }

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
  }

  if (imageUrl) {
    return <PhotoEditor imageUrl={imageUrl} />;
  }

  return (
    <div className="landing">
      <div className="landing-card">
        <div className="landing-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3 20.25h18A.75.75 0 0021.75 19.5V4.5A.75.75 0 0021 3.75H3A.75.75 0 002.25 4.5v15A.75.75 0 003 20.25zM16.5 8.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1>Photo Editor</h1>
        <p>Upload a photo to start editing</p>

        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => inputRef.current?.click()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>
            Drop image here or <strong>click to browse</strong>
          </span>
          <small>Supports JPG, PNG, WebP, GIF</small>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="file-input"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
