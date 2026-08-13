import classNames from 'classnames';
import { useMemo } from 'react';
import { useEngine } from '@/app/contexts/EngineContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import AddBlockBar from '../AddBlockBar/AddBlockBar';
import ImageAdjustmentBar from '@/app/features/image/ImageAdjustmentBar/ImageAdjustmentBar';
import ShapesAdjustmentBar from '@/app/features/shape/ShapesAdjustmentBar/ShapesAdjustmentBar';
import StickerAdjustmentBar from '@/app/features/sticker/StickerAdjustmentBar/StickerAdjustmentBar';
import TextAdjustmentsBar from '@/app/features/text/TextAdjustmentsBar/TextAdjustmentsBar';
import classes from './BottomControls.module.css';

const BLOCK_TYPE_TO_CONTROLS = [
  { type: '//ly.img.ubq/text', kind: 'text', component: TextAdjustmentsBar },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'image',
    component: ImageAdjustmentBar
  },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'shape',
    component: ShapesAdjustmentBar
  },
  {
    type: '//ly.img.ubq/graphic',
    kind: 'sticker',
    component: StickerAdjustmentBar
  }
];

const BottomControls = ({ DefaultComponent = AddBlockBar, visible = true }) => {
  const { engine } = useEngine();
  const { selection } = useSelection();

  let ControlComponent = DefaultComponent;

  const selectedBlock = useMemo<null | {
    id: number;
    type: string;
    kind: string;
  }>(() => {
    if (!selection || selection.length !== 1) return null;

    return {
      id: selection[0],
      type: engine.block.getType(selection[0]),
      kind: engine.block.getKind(selection[0])
    };
  }, [selection, engine]);

  if (selectedBlock) {
    const blockControl = BLOCK_TYPE_TO_CONTROLS.find(
      ({ type, kind }) =>
        selectedBlock.type.startsWith(type) &&
        selectedBlock.kind.startsWith(kind)
    );
    if (blockControl) {
      ControlComponent = blockControl.component;
    }
  }

  return (
    // The key is used to force a rerender whenever a different block is selected.
    // The rerender is needed to force the SlideUp Animation
    <div className={classNames(classes.wrapper)} key={selectedBlock?.id}>
      {visible && <ControlComponent />}
    </div>
  );
};
export default BottomControls;
