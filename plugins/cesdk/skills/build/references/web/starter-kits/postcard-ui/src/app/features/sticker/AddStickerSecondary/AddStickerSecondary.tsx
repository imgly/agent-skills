import { useEngine } from '@/app/contexts/EngineContext';
import StickerBar from '../StickerBar/StickerBar';

// Stable reference so StickerBar's effect doesn't re-run every render.
const STICKER_GROUPS = ['emoticons'];

const AddStickerSecondary = () => {
  const { engine } = useEngine();
  return (
    <StickerBar
      groups={STICKER_GROUPS}
      onClick={(asset) => engine.asset.apply(asset.context.sourceId, asset)}
    />
  );
};
export default AddStickerSecondary;
