import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import TextFontIcon from '../../icons/TextFont.svg';
import ChangeTextAlignmentSecondary from '../ChangeTextAlignmentSecondary/ChangeTextAlignmentSecondary';
import ChangeTextColorSecondary from '../ChangeTextColorSecondary/ChangeTextColorSecondary';
import ChangeFontSecondary from '../ChangeTextFontSecondary/ChangeTextFontSecondary';
import InspectorBar from '../InspectorBar/InspectorBar';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';
import TextAlignmentIcon from '../TextAlignmentIcon/TextAlignmentIcon';
import TextColorIcon from '../TextColorIcon/TextColorIcon';

interface Adjustment {
  id: string;
  label?: string;
  Icon: any;
  align?: 'left' | 'middle' | 'right';
  onClick?: () => any;
  Body?: ComponentType<any>;
}

const ALL_ADJUSTMENTS: Adjustment[] = [
  {
    Body: ChangeFontSecondary,
    Icon: TextFontIcon,
    id: 'font'
  },
  {
    Body: ChangeTextAlignmentSecondary,
    Icon: TextAlignmentIcon,
    id: 'align'
  },
  {
    Body: ChangeTextColorSecondary,
    Icon: TextColorIcon,
    id: 'color'
  }
];

const TextAdjustmentsBar = () => {
  const [selectedAdjustmentId, setSelectedAdjustmentId] = useState<
    string | undefined
  >();

  const selectedAdjustment = useMemo(
    () => ALL_ADJUSTMENTS.find(({ id }) => selectedAdjustmentId === id),
    [selectedAdjustmentId]
  );
  const AdjustmentComponent = useMemo(() => {
    if (selectedAdjustment) {
      return selectedAdjustment.Body;
    }
  }, [selectedAdjustment]);

  return (
    <SlideUpPanel
      defaultHeadline={'Text'}
      isExpanded={!!selectedAdjustmentId}
      onExpandedChanged={(value) =>
        !value && setSelectedAdjustmentId(undefined)
      }
      InspectorBar={
        <InspectorBar
          activeAdjustmentId={selectedAdjustmentId}
          onAdjustmentChange={async (newAdjustmentId) => {
            setSelectedAdjustmentId(newAdjustmentId);
          }}
          adjustments={ALL_ADJUSTMENTS}
        />
      }
    >
      {AdjustmentComponent && <AdjustmentComponent />}
    </SlideUpPanel>
  );
};
export default TextAdjustmentsBar;
