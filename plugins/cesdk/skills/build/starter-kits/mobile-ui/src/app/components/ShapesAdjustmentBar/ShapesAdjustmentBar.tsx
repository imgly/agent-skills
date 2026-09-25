import type { ComponentType } from 'react';
import { useMemo, useState } from 'react';
import { caseAssetPath } from '../../../imgly/utils';
import ChangeShapeColorSecondary from '../ChangeShapeColorSecondary/ChangeShapeColorSecondary';

import ShapeColorIcon from '../ShapeColorIcon/ShapeColorIcon';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';
import InspectorBar from '../InspectorBar/InspectorBar';

interface Adjustment {
  id: string;
  label?: string;
  Icon: any;
  align?: 'left' | 'middle' | 'right';
  onClick?: () => any;
  Body?: ComponentType<any>;
}

export const ALL_IMAGES = [
  caseAssetPath('/images/image2.svg'),
  caseAssetPath('/images/image1.svg'),
  caseAssetPath('/images/image4.svg'),
  caseAssetPath('/images/image3.svg')
];

const ALL_ADJUSTMENTS: Adjustment[] = [
  {
    Body: ChangeShapeColorSecondary,
    Icon: ShapeColorIcon,
    id: 'color'
  }
];
const ShapesAdjustmentBar = () => {
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
      defaultHeadline={'Shape'}
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
export default ShapesAdjustmentBar;
