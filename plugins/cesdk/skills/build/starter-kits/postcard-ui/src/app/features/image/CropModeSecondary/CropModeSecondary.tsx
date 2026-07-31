import { useEngine } from '@/app/contexts/EngineContext';
import AdjustmentsBar from '@/app/components/AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '@/app/components/AdjustmentsBarButton/AdjustmentsBarButton';
import CheckmarkIcon from '@/app/icons/Checkmark.svg';
import ResetIcon from '@/app/icons/Reset.svg';

const CropModeSecondary = () => {
  const { engine } = useEngine();
  return (
    <AdjustmentsBar>
      <AdjustmentsBarButton onClick={() => engine.actions.run('editmode.exit')}>
        <span style={{ color: 'green' }}>
          <CheckmarkIcon />
        </span>
        <span>Done</span>
      </AdjustmentsBarButton>
      <AdjustmentsBarButton onClick={() => engine.actions.run('crop.reset')}>
        <span>
          <ResetIcon />
        </span>
        <span>Reset</span>
      </AdjustmentsBarButton>
    </AdjustmentsBar>
  );
};
export default CropModeSecondary;
