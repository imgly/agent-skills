import { useEngine } from '@/app/contexts/EngineContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import ImagesBar from '../ImageBar/ImageBar';

const ChangeImageFileSecondary = () => {
  const { engine } = useEngine();
  const { selection } = useSelection();
  return (
    <ImagesBar
      onClick={(asset) =>
        engine.asset.applyToBlock(asset.context.sourceId, asset, selection[0])
      }
    />
  );
};
export default ChangeImageFileSecondary;
