import classNames from 'classnames';
import { useEditor } from '../contexts/EditorContext';
import { caseAssetPath } from '../util';
import classes from './ImageSelection.module.css';

interface ImageSelectionProps {
  onShowModal: (imageUrl: string) => void;
  images: string[];
}

export default function ImageSelection({
  onShowModal,
  images
}: ImageSelectionProps) {
  const { engineIsLoaded, changeImage, selectedImageUrl, engine } = useEditor();

  const onClick = (imageUrl: string) => {
    if (engine && engine.editor.canUndo()) {
      onShowModal(imageUrl);
    } else {
      changeImage(imageUrl, true);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h4 className={classes.header}>Select Image</h4>
      <div className={classes.imageBar}>
        {engineIsLoaded && (
          <>
            {images.map((src, i) => (
              <button
                key={src}
                className={classNames(classes.imageButton, {
                  [classes['imageButton--active']]:
                    selectedImageUrl ===
                    caseAssetPath('/images/' + src + '.jpg')
                })}
                onClick={() =>
                  onClick(caseAssetPath('/images/' + src + '.jpg'))
                }
              >
                <img
                  alt={`Image ${i}`}
                  src={caseAssetPath('/images/small-' + src + '.jpg')}
                />
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
