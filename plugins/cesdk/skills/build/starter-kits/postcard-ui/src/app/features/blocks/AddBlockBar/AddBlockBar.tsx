import ImageIcon from '@/app/icons/Image.svg';
import ShapeIcon from '@/app/icons/Shape.svg';
import StickerIcon from '@/app/icons/Sticker.svg';
import TextIcon from '@/app/icons/Text.svg';
import AddImageSecondary from '@/app/features/image/AddImageSecondary/AddImageSecondary';
import AddShapeSecondary from '@/app/features/shape/AddShapeSecondary/AddShapeSecondary';
import AddStickerSecondary from '@/app/features/sticker/AddStickerSecondary/AddStickerSecondary';
import AddTextSecondary from '@/app/features/text/AddTextSecondary/AddTextSecondary';
import BlockBar from '@/app/components/BlockBar/BlockBar';

const BUTTONS = [
  {
    Component: <AddTextSecondary />,
    Icon: <TextIcon />,
    label: 'Text',
    id: 'text'
  },
  {
    Component: <AddImageSecondary />,
    Icon: <ImageIcon />,
    label: 'Image',
    id: 'image'
  },
  {
    Component: <AddShapeSecondary />,
    Icon: <ShapeIcon />,
    label: 'Shape',
    id: 'shape'
  },
  {
    Component: <AddStickerSecondary />,
    Icon: <StickerIcon />,
    label: 'Sticker',
    id: 'sticker'
  }
];

const AddBlockBar = () => {
  return <BlockBar items={BUTTONS} />;
};

export default AddBlockBar;
