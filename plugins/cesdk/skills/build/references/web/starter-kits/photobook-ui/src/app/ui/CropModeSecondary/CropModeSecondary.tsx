import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

import CheckmarkIcon from '../../icons/Checkmark.svg';
import ResetIcon from '../../icons/Reset.svg';
import { useEngine } from '../../contexts/EngineContext';

function CropModeSecondary() {
  const { engine } = useEngine();

  const resetCurrentCrop = () => {
    const allSelectedImageElements = engine.block.findAllSelected();
    allSelectedImageElements.forEach((imageElementId) => {
      engine.block.resetCrop(imageElementId);
    });
  };

  return (
    <AdjustmentsBar>
      <AdjustmentsBarButton
        onClick={() => engine.editor.setEditMode('Transform')}
      >
        <span style={{ color: 'green' }}>
          <CheckmarkIcon />
        </span>
        <span>Done</span>
      </AdjustmentsBarButton>
      <AdjustmentsBarButton onClick={() => resetCurrentCrop()}>
        <span>
          <ResetIcon />
        </span>
        <span>Reset</span>
      </AdjustmentsBarButton>
    </AdjustmentsBar>
  );
}
export default CropModeSecondary;
