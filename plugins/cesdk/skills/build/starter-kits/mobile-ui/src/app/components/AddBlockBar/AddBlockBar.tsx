import { useMemo, useState } from 'react';
import ImageIcon from '../../icons/Image.svg';
import ShapeIcon from '../../icons/Shape.svg';
import StickerIcon from '../../icons/Sticker.svg';
import TextIcon from '../../icons/Text.svg';
import AddImageSecondary from '../AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '../AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '../AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '../AddTextSecondary/AddTextSecondary';
import IconButton from '../IconButton/IconButton';
import classes from './AddBlockBar.module.css';

const SECONDARY_PANELS = [
  {
    id: 'text',
    label: 'Text',
    Component: AddTextSecondary,
    Icon: <TextIcon />
  },
  {
    id: 'image',
    label: 'Image',
    Component: AddImageSecondary,
    Icon: <ImageIcon />
  },
  {
    id: 'sticker',
    label: 'Sticker',
    Component: AddStickerSecondary,
    Icon: <StickerIcon />
  },
  {
    id: 'shape',
    label: 'Shape',
    Component: AddShapeSecondary,
    Icon: <ShapeIcon />
  }
];

const AddBlockBar = () => {
  const [secondaryPanelId, setSecondaryPanelId] = useState<
    string | undefined
  >();
  const SecondaryPanel = useMemo(
    () => SECONDARY_PANELS.find(({ id }) => secondaryPanelId === id)?.Component,
    [secondaryPanelId]
  );

  return (
    <>
      {SecondaryPanel && (
        <SecondaryPanel onClose={() => setSecondaryPanelId('')} />
      )}
      <div className={classes.wrapper}>
        {SECONDARY_PANELS.map(({ id, label, Icon }) => (
          <IconButton
            key={id}
            theme="menu"
            aria-label={label}
            onClick={() => setSecondaryPanelId(id)}
            icon={Icon}
          />
        ))}
      </div>
    </>
  );
};
export default AddBlockBar;
