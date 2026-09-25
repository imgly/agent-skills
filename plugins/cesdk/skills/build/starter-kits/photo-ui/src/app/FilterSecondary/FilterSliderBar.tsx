import { useCallback, useEffect } from 'react';
import type CreativeEngine from '@cesdk/engine';
import { useEditor } from '../contexts/EditorContext';
import { useProperty } from '../../imgly/hooks/useSelectedProperty';
import SliderBar from '../SliderBar/SliderBar';

const LUT_FILTER_DEFAULT_VALUE = 100;

const toPercent = (val: number) => val * 100;
const fromPercent = (val: number) => val / 100;

const LUT_FILTER_URI = 'effect/lut_filter/lutFileURI';
const LUT_FILTER_INTENSITY = 'effect/lut_filter/intensity';
const HORIZONTAL_TILES = 'effect/lut_filter/horizontalTileCount';
const VERTICAL_TILES = 'effect/lut_filter/verticalTileCount';

const LUT_FILTER_TYPE = '//ly.img.ubq/effect/lut_filter';
export function fetchLutFilterEffect(
  engine: CreativeEngine,
  block: number
): number {
  const effects = engine.block.getEffects(block);

  let adjustmentEffect = effects.find(
    (effect) => engine.block.getString(effect, 'type') === LUT_FILTER_TYPE
  );

  if (!adjustmentEffect) {
    adjustmentEffect = engine.block.createEffect('lut_filter');
    engine.block.appendEffect(block, adjustmentEffect);
  }
  return adjustmentEffect;
}

interface LutFilterConfig {
  lutImage: string;
  horizontalTileCount: number;
  verticalTileCount: number;
  name: string;
}

interface FilterSliderBarProps {
  lutFilterConfig: LutFilterConfig;
}

const FilterSliderBar = ({ lutFilterConfig }: FilterSliderBarProps) => {
  const { currentPageBlockId, engine } = useEditor();

  const lutFilter =
    engine && currentPageBlockId
      ? fetchLutFilterEffect(engine, currentPageBlockId)
      : undefined;
  const [lutFilterIntensity] = useProperty<number>(
    engine,
    lutFilter,
    LUT_FILTER_INTENSITY
  );

  const { lutImage, horizontalTileCount, verticalTileCount, name } =
    lutFilterConfig;

  const uri = engine?.editor.defaultURIResolver(
    `ly.img.filter.lut/${lutImage}`
  );

  const setFilterProperties = useCallback(
    (intensity: number) => {
      if (!engine || !lutFilter || !uri) return;
      engine.block.setString(lutFilter, LUT_FILTER_URI, uri);
      engine.block.setInt(lutFilter, HORIZONTAL_TILES, horizontalTileCount);
      engine.block.setInt(lutFilter, VERTICAL_TILES, verticalTileCount);
      engine.block.setFloat(lutFilter, LUT_FILTER_INTENSITY, intensity);
      engine.editor.addUndoStep();
    },
    [engine, horizontalTileCount, lutFilter, uri, verticalTileCount]
  );

  useEffect(() => {
    setFilterProperties(lutFilterIntensity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lutFilterConfig]);

  return (
    <SliderBar
      key={name}
      min={0}
      max={100}
      onReset={() => setFilterProperties(fromPercent(LUT_FILTER_DEFAULT_VALUE))}
      resetEnabled={toPercent(lutFilterIntensity) !== LUT_FILTER_DEFAULT_VALUE}
      current={toPercent(lutFilterIntensity)}
      onStop={() => {
        engine?.editor.addUndoStep();
      }}
      onChange={(value) => {
        setFilterProperties(fromPercent(value));
      }}
    />
  );
};
export default FilterSliderBar;
