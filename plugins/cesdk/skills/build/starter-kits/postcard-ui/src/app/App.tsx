/**
 * CE.SDK Postcard UI - Main Application Component
 *
 * A custom postcard editor with front/back editing, stickers,
 * text, and image composition.
 */

import { useState } from 'react';
import type CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/engine';
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
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import { PageSettingsProvider } from './contexts/PageSettingsContext';
import PostcardUI from './PostcardUI/PostcardUI';
import { EngineProvider } from '../imgly/contexts/EngineContext';
import { SinglePageModeProvider } from '../imgly/contexts/SinglePageModeContext';
import { SelectionProvider } from '../imgly/contexts/SelectionContext';
import LoadingSpinner from './ui/LoadingSpinner/LoadingSpinner';
import { createUnsplashSource } from '../imgly';

interface AppProps {
  engineConfig: Partial<Configuration>;
}

const App: React.FC<AppProps> = ({ engineConfig }) => {
  const [engine, setEngine] = useState<CreativeEngine | null>(null);

  // Merge with required defaults
  const config: Partial<Configuration> = {
    baseURL: import.meta.env.VITE_IMGLY_LOCAL_ASSETS_URL,
    ...engineConfig,
    featureFlags: {
      preventScrolling: true,
      ...engineConfig.featureFlags
    }
  };

  const configureEngine = async (engine: CreativeEngine) => {
    setEngine(engine);
    engine.editor.setSetting('page/title/show', false);

    // Add default asset sources via plugins
    await engine.addPlugin(new ImageColorsAssetSource());
    await engine.addPlugin(new ColorPaletteAssetSource());
    await engine.addPlugin(new TypefaceAssetSource());
    await engine.addPlugin(new TextAssetSource());
    await engine.addPlugin(new TextComponentAssetSource());
    await engine.addPlugin(
      new VectorShapeAssetSource({
        include: ['ly.img.vector.shape.filled.*']
      })
    );
    await engine.addPlugin(new StickerAssetSource());

    // Add demo asset sources via plugins
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
        include: [
          'ly.img.templates.design.*',
          'ly.img.audio.*',
          'ly.img.video.*'
        ]
      })
    );

    engine.editor.setGlobalScope('lifecycle/destroy', 'Defer');
    engine.editor.setRole('Adopter');

    engine.asset.addSource(createUnsplashSource(engine));

    const stickers = await engine.asset.findAssets('ly.img.sticker', {
      page: 0,
      perPage: 9999
    });
    stickers.assets.forEach((sticker) => {
      if (sticker.groups[0] !== 'emoticons') {
        engine.asset.removeAssetFromSource('ly.img.sticker', sticker.id);
      }
    });
  };

  return (
    <div className={classes.fullHeightWrapper}>
      <div className={classes.wrapper}>
        <div className={classes.innerWrapper}>
          <EngineProvider
            LoadingComponent={<LoadingSpinner />}
            config={config}
            configure={configureEngine}
          >
            <SinglePageModeProvider
              defaultVerticalTextScrollEnabled={true}
              defaultRefocusCropModeEnabled={false}
              defaultTextScrollTopPadding={110}
              defaultTextScrollBottomPadding={92}
              defaultPaddingBottom={92}
              defaultPaddingLeft={40}
              defaultPaddingRight={40}
              defaultPaddingTop={110}
            >
              <EditorProvider>
                <PageSettingsProvider>
                  <SelectionProvider engine={engine}>
                    <PostcardUI />
                  </SelectionProvider>
                </PageSettingsProvider>
              </EditorProvider>
            </SinglePageModeProvider>
          </EngineProvider>
        </div>
      </div>
    </div>
  );
};

export default App;
