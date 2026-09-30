import type { AssetResult } from '@cesdk/engine';
import { useEditor } from '../../contexts/EditorContext';

import ShapeSelect from '../ShapeSelect/ShapeSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

type AddShapeSecondaryProps = {
  onClose: () => void;
};

const AddShapeSecondary = ({ onClose }: AddShapeSecondaryProps) => {
  const { engine } = useEditor();

  const addShape = (asset: AssetResult) => {
    engine.asset.apply('ly.img.vector.shape', asset);
  };

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Shape"></SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ShapeSelect onClick={(asset: AssetResult) => addShape(asset)} />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddShapeSecondary;
