import TextIcon from '@/app/icons/Text.svg';
import TextAlignMiddleIcon from '@/app/icons/TextAlignCenter.svg';
import BlockBar from '@/app/components/BlockBar/BlockBar';
import ChangeFontSecondary from '../ChangeFontSecondary/ChangeFontSecondary';
import ChangeTextAlignmentSecondary from '../ChangeTextAlignmentSecondary/ChangeTextAlignmentSecondary';
import ChangeTextColorSecondary from '../ChangeTextColorSecondary/ChangeTextColorSecondary';
import CurrentColorIcon from '@/app/components/CurrentColorIcon/CurrentColorIcon';
import DeleteSelectedButton from '@/app/features/blocks/DeleteSelectedButton/DeleteSelectedButton';

const ADJUSTMENTS = [
  {
    Component: <ChangeTextColorSecondary />,
    Icon: <CurrentColorIcon />,
    label: 'Color',
    id: 'color'
  },
  {
    Component: <ChangeFontSecondary />,
    Icon: <TextIcon />,
    label: 'Font',
    id: 'font'
  },
  {
    Component: <ChangeTextAlignmentSecondary />,
    Icon: <TextAlignMiddleIcon />,
    label: 'Align',
    id: 'align'
  }
];

const TextAdjustmentsBar = () => {
  return (
    <BlockBar items={ADJUSTMENTS}>
      <DeleteSelectedButton />
    </BlockBar>
  );
};
export default TextAdjustmentsBar;
