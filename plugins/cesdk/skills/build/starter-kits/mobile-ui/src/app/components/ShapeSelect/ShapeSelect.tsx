import type { AssetQueryData, CompleteAssetResult } from '@cesdk/engine';
import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import Card from '../Card/Card';
import classes from './ShapeSelect.module.css';

type ShapeSelectProps = {
  onClick: (asset: CompleteAssetResult) => void;
  group?: string;
};

const ShapeSelect = ({ onClick, group }: ShapeSelectProps) => {
  const { engine } = useEditor();
  const [shapes, setShapes] = useState<CompleteAssetResult[]>([]);

  const queryShapes = useCallback(
    async (_group?: string) => {
      const SHAPE_ASSET_LIBRARY_ID = 'ly.img.vector.shape';
      const queryParameters: AssetQueryData = { page: 0, perPage: 9999 };
      if (group) {
        queryParameters.groups = [group];
      }
      const results = await engine.asset.findAssets(
        SHAPE_ASSET_LIBRARY_ID,
        queryParameters
      );
      return results;
    },
    [group, engine]
  );

  useEffect(() => {
    const loadShapes = async () => {
      const newShapes = await queryShapes(group);
      setShapes(newShapes.assets);
    };
    loadShapes();
  }, [queryShapes, group]);

  return (
    <div className={classes.wrapper}>
      {shapes.map((asset) => (
        <Card
          key={asset.id}
          onClick={() => onClick(asset)}
          backgroundImage={asset.meta.thumbUri}
        ></Card>
      ))}
    </div>
  );
};
export default ShapeSelect;
