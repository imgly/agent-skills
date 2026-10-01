import InspectorBar from '../InspectorBar/InspectorBar';
import SlideUpPanel from '../SlideUpPanel/SlideUpPanel';

// A sticker offers no adjustment of its own, so the bar carries only the
// headline and the delete button the inspector adds.
const StickerAdjustmentBar = () => (
  <SlideUpPanel
    defaultHeadline={'Sticker'}
    isExpanded={false}
    InspectorBar={
      <InspectorBar adjustments={[]} onAdjustmentChange={() => {}} />
    }
  />
);
export default StickerAdjustmentBar;
