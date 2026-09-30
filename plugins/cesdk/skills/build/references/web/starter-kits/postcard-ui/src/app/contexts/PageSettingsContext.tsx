import { RGBAColor, Typeface } from '@cesdk/engine';
import { createContext, useContext, useEffect, useState } from 'react';
import { useEditor } from './EditorContext';
import { useEngine } from '@/app/contexts/EngineContext';
import { BLOCK_NAMES } from '@/imgly/constants';
import { hexToRgba } from '@/imgly/utils';

interface PageSettingsContextType {
  frontBackgroundColor: RGBAColor;
  setFrontBackgroundColor: (color: RGBAColor) => void;
  frontAccentColor: RGBAColor;
  setFrontAccentColor: (color: RGBAColor) => void;

  backGreetingsTextTypeface: Typeface | null;
  setBackGreetingsTextTypeface: (typeface: Typeface) => void;
  backGreetingsTextColor: RGBAColor;
  setBackGreetingsTextColor: (color: RGBAColor) => void;
  backGreetingsTextSize: number;
  setBackGreetingsTextSize: (size: number) => void;
}

const PageSettingsContext = createContext<PageSettingsContextType | undefined>(
  undefined
);

const DEFAULT_COLOR = {
  r: 0,
  g: 0,
  b: 0,
  a: 1
};

export const PageSettingsProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const { engine } = useEngine();
  const { postcardTemplate, sceneIsLoaded } = useEditor();

  const [frontBackgroundColor, setFrontBackgroundColor] =
    useState<RGBAColor>(DEFAULT_COLOR);
  const [frontAccentColor, setFrontAccentColor] =
    useState<RGBAColor>(DEFAULT_COLOR);
  const [backGreetingsTextTypeface, setBackGreetingsTextTypeface] =
    useState<Typeface | null>(null);

  const [backGreetingsTextColor, setBackGreetingsTextColor] =
    useState<RGBAColor>(hexToRgba('#263BAA'));
  const [backGreetingsTextSize, setBackGreetingsTextSize] =
    useState<number>(22);

  // Read initial typeface (read-only engine access, kept here)
  useEffect(() => {
    if (!engine || !sceneIsLoaded) return;
    const [block] = engine.block.findByName(BLOCK_NAMES.greeting);
    if (!block) return;
    setBackGreetingsTextTypeface(engine.block.getTypeface(block));
  }, [engine, sceneIsLoaded]);

  useEffect(() => {
    if (sceneIsLoaded)
      engine.actions.run(
        'setColorByBlockName',
        BLOCK_NAMES.accent,
        frontAccentColor
      );
  }, [sceneIsLoaded, engine, frontAccentColor]);

  useEffect(() => {
    if (sceneIsLoaded)
      engine.actions.run(
        'setColorByBlockName',
        BLOCK_NAMES.background,
        frontBackgroundColor
      );
  }, [sceneIsLoaded, engine, frontBackgroundColor]);

  useEffect(() => {
    if (sceneIsLoaded && backGreetingsTextTypeface)
      engine.actions.run(
        'setFontByBlockName',
        BLOCK_NAMES.greeting,
        backGreetingsTextTypeface
      );
  }, [sceneIsLoaded, engine, backGreetingsTextTypeface]);

  useEffect(() => {
    if (sceneIsLoaded)
      engine.actions.run(
        'setColorByBlockName',
        BLOCK_NAMES.greeting,
        backGreetingsTextColor
      );
  }, [sceneIsLoaded, engine, backGreetingsTextColor]);

  useEffect(() => {
    if (sceneIsLoaded)
      engine.actions.run(
        'setTextSizeByBlockName',
        BLOCK_NAMES.greeting,
        backGreetingsTextSize
      );
  }, [sceneIsLoaded, engine, backGreetingsTextSize]);

  useEffect(() => {
    if (postcardTemplate) {
      setFrontAccentColor(hexToRgba(postcardTemplate.colors[0]));
      setFrontBackgroundColor(hexToRgba(postcardTemplate.colors[1]));
    }
  }, [postcardTemplate]);

  const value = {
    frontBackgroundColor,
    setFrontBackgroundColor,
    frontAccentColor,
    setFrontAccentColor,

    backGreetingsTextTypeface,
    setBackGreetingsTextTypeface,
    backGreetingsTextColor,
    setBackGreetingsTextColor,
    backGreetingsTextSize,
    setBackGreetingsTextSize
  };
  return (
    <PageSettingsContext.Provider value={value}>
      {children}
    </PageSettingsContext.Provider>
  );
};

export const usePageSettings = () => {
  const context = useContext(PageSettingsContext);
  if (context === undefined) {
    throw new Error(
      'usePageSettings must be used within a PageSettingsProvider'
    );
  }
  return context;
};
