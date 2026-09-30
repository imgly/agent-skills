import { CompleteAssetResult } from '@cesdk/engine';
import { useEffect, useState } from 'react';
import { useEngine } from '@/app/contexts/EngineContext';
import { findShapes } from '@/imgly/utils';
import AdjustmentsBar from '@/app/components/AdjustmentsBar/AdjustmentsBar';
import IconButton from '@/app/components/IconButton/IconButton';

const ShapeBar = ({
  onClick
}: {
  onClick: (asset: CompleteAssetResult) => void;
}) => {
  const { engine } = useEngine();
  const [shapes, setShapes] = useState<CompleteAssetResult[]>([]);

  useEffect(() => {
    findShapes(engine).then(setShapes);
  }, [engine]);

  return (
    <AdjustmentsBar gap="md">
      {shapes.map((asset, i) => (
        <IconButton
          key={asset.id}
          onClick={() => onClick(asset)}
          icon={<img src={asset.meta?.thumbUri} alt={`Add shape ${i}`} />}
        ></IconButton>
      ))}
    </AdjustmentsBar>
  );
};
export default ShapeBar;
