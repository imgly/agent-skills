import { BlockBar } from '@/app/components/BlockBar/BlockBar';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';
import CurrentColorIcon from '@/app/components/CurrentColorIcon/CurrentColorIcon';
import DeleteSelectedButton from '@/app/features/blocks/DeleteSelectedButton/DeleteSelectedButton';

const ADJUSTMENTS = [
  {
    Component: <ChangeShapeColorSecondary />,
    Icon: <CurrentColorIcon />,
    label: 'Color',
    id: 'replace'
  }
];

const ShapesAdjustmentBar = () => {
  return (
    <BlockBar items={ADJUSTMENTS}>
      <DeleteSelectedButton />
    </BlockBar>
  );
};
export default ShapesAdjustmentBar;
