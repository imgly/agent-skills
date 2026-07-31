import TextAlignCenterIcon from '@/app/icons/TextAlignCenter.svg';
import TextAlignLeftIcon from '@/app/icons/TextAlignLeft.svg';
import TextAlignRightIcon from '@/app/icons/TextAlignRight.svg';
import AdjustmentsBar from '../AdjustmentsBar/AdjustmentsBar';
import AdjustmentsBarButton from '../AdjustmentsBarButton/AdjustmentsBarButton';

const ALL_ALIGNMENTS = [
  {
    value: 'Left',
    Icon: <TextAlignLeftIcon />
  },
  {
    value: 'Center',
    Icon: <TextAlignCenterIcon />
  },
  {
    value: 'Right',
    Icon: <TextAlignRightIcon />
  }
];

interface AlignmentSelectProps {
  onClick: (value: string) => void;
  activeAlignment: string;
}

const AlignmentSelect = ({
  onClick,
  activeAlignment
}: AlignmentSelectProps) => {
  return (
    <AdjustmentsBar>
      {ALL_ALIGNMENTS.map(({ value, Icon }) => (
        <AdjustmentsBarButton
          key={value}
          isActive={value === activeAlignment}
          onClick={() => onClick(value)}
        >
          <span>{Icon}</span>
          <span>{value}</span>
        </AdjustmentsBarButton>
      ))}
    </AdjustmentsBar>
  );
};
export default AlignmentSelect;
