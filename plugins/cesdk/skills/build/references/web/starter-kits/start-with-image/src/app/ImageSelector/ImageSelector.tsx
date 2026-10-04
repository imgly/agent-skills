/**
 * Image Selection Sidebar Component
 *
 * Displays sample images for users to select and load into the editor.
 */

import classNames from 'classnames';

import type { ImageAsset } from '../image-catalog';

import classes from './ImageSelector.module.css';

interface ImageSelectorProps {
  images: ImageAsset[];
  selectedImage: ImageAsset | null;
  onSelect: (image: ImageAsset) => void;
}

export function ImageSelector({
  images,
  selectedImage,
  onSelect
}: ImageSelectorProps) {
  return (
    <div className={classes.sidebar}>
      <h3 className={classes.heading}>Select Image</h3>
      <div className={classes.imageList}>
        {images.map((image: ImageAsset) => (
          <button
            key={image.full}
            className={classNames(classes.imageButton, {
              [classes.active]: image.full === selectedImage?.full
            })}
            onClick={() => onSelect(image)}
          >
            <img src={image.thumbUri} alt={image.alt} loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
