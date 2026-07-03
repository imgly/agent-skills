import type { AssetQueryData, CompleteAssetResult } from '@cesdk/engine';
import Masonry from 'react-masonry-css';
import { useCallback, useEffect, useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { caseAssetPath } from '../../../imgly/utils';
import classes from './ImageSelect.module.css';

export const STOCK_IMAGES = [...Array(10).keys()].map((index) =>
  caseAssetPath(`/images/image${index + 1}.jpg`)
);

type ImageSelectProps = {
  onSelect: (asset: CompleteAssetResult) => void;
  group?: string;
};

const ImageSelect = ({ onSelect, group }: ImageSelectProps) => {
  const { engine } = useEditor();
  const [images, setImages] = useState<CompleteAssetResult[]>([]);

  const queryImages = useCallback(
    async (_group?: string) => {
      const IMAGE_ASSET_LIBRARY_ID = 'ly.img.image';
      const queryParameters: AssetQueryData = { page: 0, perPage: 9999 };
      if (group) {
        queryParameters.groups = [group];
      }
      const results = await engine.asset.findAssets(
        IMAGE_ASSET_LIBRARY_ID,
        queryParameters
      );
      return results;
    },
    [group, engine]
  );

  useEffect(() => {
    const loadImages = async () => {
      const newImages = await queryImages(group);
      setImages(newImages.assets);
    };
    loadImages();
  }, [queryImages, group]);

  return (
    <Masonry
      breakpointCols={3}
      className={classes.wrapper}
      columnClassName={classes.gridColumn}
    >
      {images.map((asset) => (
        <button
          key={asset.id}
          className={classes.imageButton}
          onClick={() => onSelect(asset)}
        >
          <img height="56" src={asset.meta.thumbUri} alt="sample asset" />
        </button>
      ))}
    </Masonry>
  );
};
export default ImageSelect;
