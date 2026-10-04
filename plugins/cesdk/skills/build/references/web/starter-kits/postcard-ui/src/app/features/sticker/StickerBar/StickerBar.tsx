import { CompleteAssetResult } from '@cesdk/engine';
import { useEffect, useState } from 'react';
import { useEngine } from '@/app/contexts/EngineContext';
import { findStickers } from '@/imgly/utils';
import AdjustmentsBar from '@/app/components/AdjustmentsBar/AdjustmentsBar';
import IconButton from '@/app/components/IconButton/IconButton';

const StickerBar = ({
  onClick,
  groups
}: {
  onClick: (asset: CompleteAssetResult) => void;
  groups?: string[];
}) => {
  const { engine } = useEngine();
  const [stickers, setStickers] = useState<CompleteAssetResult[]>([]);

  useEffect(() => {
    findStickers(engine, groups).then(setStickers);
  }, [engine, groups]);

  return (
    <AdjustmentsBar gap="md">
      {stickers.map((asset, i) => (
        <IconButton
          key={asset.id}
          onClick={() => onClick(asset)}
          icon={<img src={asset.meta?.thumbUri} alt={`Add sticker ${i}`} />}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default StickerBar;
