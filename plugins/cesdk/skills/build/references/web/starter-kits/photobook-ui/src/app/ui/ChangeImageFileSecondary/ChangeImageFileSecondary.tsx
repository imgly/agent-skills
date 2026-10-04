import { useEngine } from '../../contexts/EngineContext';
import { useSelection } from '../../contexts/UseSelection';
import ImagesBar from '../ImageBar/ImageBar';

function ChangeImageFileSecondary() {
  const { engine } = useEngine();
  const { selection } = useSelection();
  return (
    <ImagesBar
      onClick={(asset) =>
        engine.asset.applyToBlock(asset.context.sourceId, asset, selection[0])
      }
    />
  );
}
export default ChangeImageFileSecondary;
