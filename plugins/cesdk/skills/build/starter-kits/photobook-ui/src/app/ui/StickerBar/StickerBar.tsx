import { CompleteAssetResult } from '@cesdk/engine';
import { useCallback, useEffect, useState } from 'react';
import { useEngine } from '../../contexts/EngineContext';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import IconButton from '../IconButton/IconButton';

function StickerBar({
  onClick
}: {
  onClick: (asset: CompleteAssetResult) => void;
}) {
  const { engine } = useEngine();
  const [stickers, setStickers] = useState<CompleteAssetResult[]>([]);

  const queryStickers = useCallback(async () => {
    const STICKER_ASSET_LIBRARY_ID = 'ly.img.sticker';
    const queryParameters = { page: 0, perPage: 999 };
    const results = await engine.asset.findAssets(
      STICKER_ASSET_LIBRARY_ID,
      queryParameters
    );
    return results;
  }, [engine]);

  useEffect(() => {
    const loadStickers = async () => {
      const newStickers = await queryStickers();
      setStickers(newStickers.assets);
    };
    loadStickers();
  }, [queryStickers]);

  return (
    <AdjustmentsBar gap="md">
      {stickers.map((asset, i) => (
        <IconButton
          key={asset.id}
          onClick={() => onClick(asset)}
          icon={<img src={asset.meta?.thumbUri} alt={`Add sticker ${i}`} />}
        />
      ))}
    </AdjustmentsBar>
  );
}
export default StickerBar;
