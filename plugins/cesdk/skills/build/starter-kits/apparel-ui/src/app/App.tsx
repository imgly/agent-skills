import { useState } from 'react';
import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import ApparelUI from './components/ApparelUI/ApparelUI';
import { EngineProvider } from './contexts/EngineContext';
import { SinglePageModeProvider } from './contexts/SinglePageModeContext';
import { SelectionProvider } from './contexts/UseSelection';
import createUnsplashSource from '../imgly/UnsplashSource';
import {
  ImageColorsAssetSource,
  ColorPaletteAssetSource,
  DemoAssetSources,
  StickerAssetSource,
  TextAssetSource,
  TextComponentAssetSource,
  TypefaceAssetSource,
  UploadAssetSources,
  VectorShapeAssetSource
} from '@cesdk/cesdk-js/plugins';
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
              await engine.addPlugin(new ImageColorsAssetSource());
              await engine.addPlugin(new ColorPaletteAssetSource());
              await engine.addPlugin(new StickerAssetSource());
              await engine.addPlugin(new TypefaceAssetSource());
              await engine.addPlugin(new TextAssetSource());
              await engine.addPlugin(new TextComponentAssetSource());
              await engine.addPlugin(
                new VectorShapeAssetSource({
                  include: ['ly.img.vector.shape.filled.*']
                })
              );
              await engine.addPlugin(
                new UploadAssetSources({
                  include: [
                    'ly.img.image.upload',
                    'ly.img.video.upload',
                    'ly.img.audio.upload'
                  ]
                })
              );
              await engine.addPlugin(
                new DemoAssetSources({
                  include: ['ly.img.templates.*']
                })
              );
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
