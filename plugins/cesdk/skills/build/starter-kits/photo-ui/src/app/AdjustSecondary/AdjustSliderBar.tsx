import { useEditor } from '../contexts/EditorContext';
import { useProperty } from '../../imgly/hooks/useSelectedProperty';
import SliderBar from '../SliderBar/SliderBar';

import type CreativeEngine from '@cesdk/engine';

const ADJUSTMENT_DEFAULT_VALUE = 0;

const toPercent = (val: number) => val * 100;
const fromPercent = (val: number) => val / 100;

const ADJUSTMENT_TYPE = '//ly.img.ubq/effect/adjustments';
export function fetchAdjustmentEffect(
  engine: CreativeEngine,
  block: number
): number {
  const effects = engine.block.getEffects(block);

  let adjustmentEffect = effects.find(
    (effect) => engine.block.getString(effect, 'type') === ADJUSTMENT_TYPE
  );

  if (!adjustmentEffect) {
    adjustmentEffect = engine.block.createEffect('adjustments');
    engine.block.appendEffect(block, adjustmentEffect);
  }
  return adjustmentEffect;
}

interface AdjustSliderBarProps {
  adjustmentId: string;
}

const AdjustSliderBar = ({ adjustmentId }: AdjustSliderBarProps) => {
  const { currentPageBlockId, engine } = useEditor();

  const adjustmentEffect =
    engine && currentPageBlockId
      ? fetchAdjustmentEffect(engine, currentPageBlockId)
      : undefined;

  const [adjustment, setAdjustment] = useProperty<number>(
    engine,
    adjustmentEffect,
    'adjustments/' + adjustmentId
  );

  return (
    <SliderBar
      key={adjustmentId}
      min={-100}
      max={100}
      onReset={() => setAdjustment(fromPercent(ADJUSTMENT_DEFAULT_VALUE))}
      resetEnabled={adjustment !== 0}
      current={toPercent(adjustment)}
      onStop={() => {
        engine?.editor.addUndoStep();
      }}
      onChange={(value) => {
        setAdjustment(fromPercent(value));
      }}
    />
  );
};
export default AdjustSliderBar;
