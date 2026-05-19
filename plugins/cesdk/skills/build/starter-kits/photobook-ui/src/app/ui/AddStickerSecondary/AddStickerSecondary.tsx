import { useEngine } from '../../contexts/EngineContext';
import StickerBar from '../StickerBar/StickerBar';

function AddStickerSecondary() {
  const { engine } = useEngine();

  return (
    <StickerBar
      onClick={(asset) => engine.asset.apply(asset.context.sourceId, asset)}
    />
  );
}
export default AddStickerSecondary;
