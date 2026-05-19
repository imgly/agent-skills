import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import InspectorBar from '../InspectorBar/InspectorBar';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';

interface Adjustment {
  id: string;
  label?: string;
  Icon: any;
  align?: 'left' | 'middle' | 'right';
  onClick?: () => any;
  Body?: ComponentType<any>;
}

const ALL_ADJUSTMENTS: Adjustment[] = [];
const StickerAdjustmentBar = () => {
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
      defaultHeadline={'Sticker'}
      isExpanded={!!selectedAdjustmentId}
      onExpandedChanged={(value) =>
        !value && setSelectedAdjustmentId(undefined)
      }
      InspectorBar={
        <InspectorBar
          activeAdjustmentId={selectedAdjustmentId}
          onAdjustmentChange={(newAdjustmentId) =>
            setSelectedAdjustmentId(newAdjustmentId)
          }
          adjustments={ALL_ADJUSTMENTS}
        />
      }
    >
      {AdjustmentComponent && <AdjustmentComponent />}
    </SlideUpPanel>
  );
};
export default StickerAdjustmentBar;
