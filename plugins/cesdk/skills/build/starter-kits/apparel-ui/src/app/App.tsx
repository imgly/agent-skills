import { useState } from 'react';
import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import ApparelUI from './components/ApparelUI/ApparelUI';
import { EngineProvider } from './contexts/EngineContext';
import { SinglePageModeProvider } from './contexts/SinglePageModeContext';
import { SelectionProvider } from './contexts/UseSelection';
import createUnsplashSource from '../imgly/UnsplashSource';
import createImageColorsSource from '../imgly/ImageColorsSource';
import type CreativeEngine from '@cesdk/engine';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

const LoadingSpinner = () => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}
  >
    <div>Loading...</div>
  </div>
);

const App = ({ engineConfig }: AppProps) => {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);

  // Merge with required defaults
  const config: Partial<Configuration> = {
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    role: 'Adopter',
    ...engineConfig,
    featureFlags: {
      preventScrolling: true,
      ...engineConfig.featureFlags
    }
  };

  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={config}
            configure={async (engine) => {
              setEngine(engine);
              engine.editor.setSetting('page/title/show', false);

              // Register the default asset sources directly against the engine.
              // `getBaseURL()` returns the configured assets base, already
              // trailing-slash normalized.
              const baseURL = engine.getBaseURL();
              const addContentSource = (sourceId: string, matcher?: string[]) =>
                engine.asset.addLocalAssetSourceFromJSONURI(
                  `${baseURL}${sourceId}/content.json`,
                  matcher ? { matcher } : undefined
                );

              // Dominant colors extracted from the scene's image blocks.
              engine.asset.addSource(createImageColorsSource(engine));

              // Content sources loaded from their bundled `content.json`.
              await addContentSource('ly.img.color.palette');
              await addContentSource('ly.img.sticker');
              await addContentSource('ly.img.typeface');
              // Text style presets live in three engine-side sources.
              await addContentSource('ly.img.text');
              await addContentSource('ly.img.text.styles');
              await addContentSource('ly.img.text.curves');
              await addContentSource('ly.img.text.components');
              await addContentSource('ly.img.vector.shape', [
                'ly.img.vector.shape.filled.*'
              ]);
              await addContentSource('ly.img.templates', [
                'ly.img.templates.*'
              ]);

              // Local upload sources (empty until the user uploads).
              engine.asset.addLocalSource('ly.img.image.upload', [
                'image/jpeg',
                'image/png',
                'image/webp',
                'image/svg+xml',
                'image/bmp',
                'image/gif',
                'image/apng'
              ]);
              engine.asset.addLocalSource('ly.img.video.upload', [
                'application/json',
                'video/mp4',
                'video/quicktime',
                'video/webm',
                'video/matroska',
                'image/gif',
                'image/apng'
              ]);
              engine.asset.addLocalSource('ly.img.audio.upload', [
                'audio/mpeg',
                'audio/mp3',
                'audio/x-m4a',
                'audio/wav'
              ]);

              engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');

              engine.asset.addSource(createUnsplashSource(engine));

              // Filter stickers to only show emoticons
              const stickers = await engine.asset.findAssets('ly.img.sticker', {
                page: 0,
                perPage: 9999
              });
              stickers.assets.forEach((sticker) => {
                if (sticker.groups[0] !== 'emoticons') {
                  engine.asset.removeAssetFromSource(
                    'ly.img.sticker',
                    sticker.id
                  );
                }
              });
            }}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
              defaultRefocusCropModeEnabled={false}
              defaultTextScrollTopPadding={null}
              defaultTextScrollBottomPadding={null}
            >
              <EditorProvider>
                <SelectionProvider engine={engine}>
                  <ApparelUI />
                </SelectionProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
