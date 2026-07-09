/**
 * CE.SDK Postcard UI - Main Application Component
 *
 * A custom postcard editor with front/back editing, stickers,
 * text, and image composition.
 */

import { useState } from 'react';
import type CreativeEngine from '@cesdk/engine';
import type { Configuration } from '@cesdk/engine';
import classes from './App.module.css';
import { EditorProvider } from './contexts/EditorContext';
import { PageSettingsProvider } from './contexts/PageSettingsContext';
import PostcardUI from './PostcardUI/PostcardUI';
import { EngineProvider } from '../imgly/contexts/EngineContext';
import { SinglePageModeProvider } from '../imgly/contexts/SinglePageModeContext';
import { SelectionProvider } from '../imgly/contexts/SelectionContext';
import LoadingSpinner from './ui/LoadingSpinner/LoadingSpinner';
import { createImageColorsSource, createUnsplashSource } from '../imgly';

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

    // `getBaseURL()` returns the configured assets base, trailing-slash normalized.
    const baseURL = engine.getBaseURL();

    // Add default asset sources directly through the engine-native asset API.
    engine.asset.addSource(createImageColorsSource(engine));
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.color.palette/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.typeface/content.json`
    );
    // Text style presets live in three engine-side sources.
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.text/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.text.styles/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.text.curves/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.text.components/content.json`
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.vector.shape/content.json`,
      { matcher: ['ly.img.vector.shape.filled.*'] }
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.sticker/content.json`
    );

    // Local upload sources for images, videos, and audio.
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

    // Demo asset sources (templates, audio, video).
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.templates/content.json`,
      { matcher: ['ly.img.templates.design.*'] }
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.audio/content.json`,
      { matcher: ['ly.img.audio.*'] }
    );
    await engine.asset.addLocalAssetSourceFromJSONURI(
      `${baseURL}ly.img.video/content.json`,
      { matcher: ['ly.img.video.*'] }
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
