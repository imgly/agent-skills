/**
 * Video Captions Starterkit - Main App Component
 *
 * Provides mode selection and editor integration for video captioning.
 */

import { useCallback, useRef, useState } from 'react';
import CreativeEditor from '@cesdk/cesdk-js/react';
import type CreativeEditorSDK from '@cesdk/cesdk-js';
import type { Configuration } from '@cesdk/cesdk-js';

import {
  type CaptionMode,
  initVideoCaptionsAutocaptionEditor,
  initVideoCaptionsBlankEditor,
  initVideoCaptionsImportEditor,
  initVideoCaptionsPreCaptionedEditor
} from '../imgly';

import styles from './App.module.css';

/**
 * Demo assets for this example (images, scene archives, …) are loaded from the
 * IMG.LY CDN by default. To host them yourself, copy this kit's asset
 * folder to your own CDN or server and change this constant — or set it to
 * `''` and place the files in this app's `public/` directory. No trailing
 * slash.
 */
export const DEMO_ASSETS_BASE_URL: string =
  import.meta.env.VITE_DEMO_ASSETS_BASE_URL ||
  'https://staticimgly.com/imgly/cesdk-web-examples-data/1.81.0/starterkit-video-captions';

interface AppProps {
  editorConfig: Configuration;
}

const CAPTION_MODES: Array<{
  mode: CaptionMode;
  label: string;
  description: string;
  image: string;
}> = [
  {
    mode: 'autocaption',
    label: 'AI Auto Captions',
    description: 'Generate captions automatically using AI',
    image: `${DEMO_ASSETS_BASE_URL}/assets/autocaption-preview.png`
  },
  {
    mode: 'blank',
    label: 'Blank Video Editor',
    description:
      'Upload or create a video, then manually add or import captions.',
    image: `${DEMO_ASSETS_BASE_URL}/assets/blank-preview.png`
  },
  {
    mode: 'import',
    label: 'Caption Import',
    description: 'Import captions from an SRT file.',
    image: `${DEMO_ASSETS_BASE_URL}/assets/import-preview.png`
  },
  {
    mode: 'pre-captioned',
    label: 'Pre-captioned Video',
    description: 'Edit a video with existing captions and adjust as needed.',
    image: `${DEMO_ASSETS_BASE_URL}/assets/pre-captioned-preview.png`
  }
];

export function App({ editorConfig }: AppProps) {
  const [editorMode, setEditorMode] = useState<CaptionMode | null>(null);
  const closeEditorRef = useRef<() => void>(() => setEditorMode(null));
  closeEditorRef.current = () => setEditorMode(null);

  const handleInit = useCallback(
    async (cesdk: CreativeEditorSDK) => {
      (window as unknown as { cesdk: CreativeEditorSDK }).cesdk = cesdk;

      switch (editorMode) {
        case 'autocaption': {
          await initVideoCaptionsAutocaptionEditor(cesdk);

          await cesdk.load(
            `${DEMO_ASSETS_BASE_URL}/assets/autocaption.archive.zip`
          );

          const autocaptionPage = cesdk.engine.scene.getCurrentPage();
          if (autocaptionPage) {
            cesdk.engine.block.setPlaybackTime(autocaptionPage, 0);
          }

          cesdk.ui.insertOrderComponent(
            {
              in: 'ly.img.navigation.bar',
              position: 'start'
            },
            [
              {
                id: 'ly.img.close.navigationBar',
                onClick: () => closeEditorRef.current()
              }
            ]
          );

          cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
          break;
        }
        case 'blank': {
          await initVideoCaptionsBlankEditor(cesdk);

          await cesdk.actions.run('scene.create', {
            mode: 'Video',
            page: { width: 1280, height: 720, unit: 'Pixel' }
          });

          cesdk.i18n.setTranslations({
            en: { 'actions.export.video': 'Export Video' }
          });

          cesdk.ui.insertOrderComponent(
            {
              in: 'ly.img.navigation.bar',
              position: 'start'
            },
            [
              {
                id: 'ly.img.close.navigationBar',
                onClick: () => closeEditorRef.current()
              }
            ]
          );

          cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
          break;
        }
        case 'import': {
          await initVideoCaptionsImportEditor(cesdk);

          await cesdk.load(
            `${DEMO_ASSETS_BASE_URL}/assets/captions.archive`
          );

          const importPage = cesdk.engine.scene.getCurrentPage();
          if (importPage) {
            cesdk.engine.block.setPlaybackTime(importPage, 0);
          }

          cesdk.ui.insertOrderComponent(
            {
              in: 'ly.img.navigation.bar',
              position: 'start'
            },
            [
              {
                id: 'ly.img.close.navigationBar',
                onClick: () => closeEditorRef.current()
              }
            ]
          );

          cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
          break;
        }
        case 'pre-captioned': {
          await initVideoCaptionsPreCaptionedEditor(cesdk);

          await cesdk.load(
            `${DEMO_ASSETS_BASE_URL}/assets/captions-pre-captioned.archive`
          );

          const preCaptionedPage = cesdk.engine.scene.getCurrentPage();
          if (preCaptionedPage) {
            cesdk.engine.block.setPlaybackTime(preCaptionedPage, 0);
          }

          const captionTrack = cesdk.engine.block.findByType('captionTrack')[0];
          if (captionTrack) {
            cesdk.engine.block.findAllSelected().forEach((block) => {
              cesdk.engine.block.setSelected(block, false);
            });
            const children = cesdk.engine.block.getChildren(captionTrack);
            if (children.length > 0) {
              cesdk.engine.block.setSelected(children[0], true);
            }
          }

          cesdk.ui.insertOrderComponent(
            {
              in: 'ly.img.navigation.bar',
              position: 'start'
            },
            [
              {
                id: 'ly.img.close.navigationBar',
                onClick: () => closeEditorRef.current()
              }
            ]
          );

          cesdk.ui.openPanel('//ly.img.panel/inspector/caption');
          break;
        }
      }
    },
    [editorMode]
  );

  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      setEditorMode(null);
    }
  }, []);

  const handleDownloadSrt = useCallback(() => {
    const link = document.createElement('a');
    link.href = `${DEMO_ASSETS_BASE_URL}/assets/captions.srt`;
    link.download = 'captions.srt';
    link.click();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.block}>
        <h4 className={`h4 ${styles.heading}`}>Select Your Demo Option</h4>

        <div className={styles.cardGrid}>
          {CAPTION_MODES.map(({ mode, label, description, image }) => (
            <div key={mode} className={styles.card}>
              <img
                alt={`${label} Preview`}
                src={image}
                className={styles.cardImage}
              />
              <div className={styles.cardText}>
                <h5 className={`h5 ${styles.cardTitle}`}>{label}</h5>
                <p className={styles.cardDescription}>{description}</p>
              </div>
              <div className={styles.cardActions}>
                {mode === 'import' ? (
                  <div className={styles.buttonGroup}>
                    <button
                      className="button button--secondary button--small"
                      onClick={handleDownloadSrt}
                    >
                      <span>Download .srt File</span>
                    </button>
                    <button
                      className="button button--primary button--small"
                      onClick={() => setEditorMode(mode)}
                    >
                      <span>Open Editor</span>
                    </button>
                  </div>
                ) : (
                  <button
                    className="button button--primary button--small"
                    onClick={() => setEditorMode(mode)}
                  >
                    <span>Open Editor</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editorMode && (
        <div className={styles.overlay} onClick={handleOverlayClick}>
          <div className={styles.editorWrapper}>
            <CreativeEditor
              key={editorMode}
              className={styles.editorContainer}
              config={editorConfig}
              init={handleInit}
            />
          </div>
        </div>
      )}
    </div>
  );
}
