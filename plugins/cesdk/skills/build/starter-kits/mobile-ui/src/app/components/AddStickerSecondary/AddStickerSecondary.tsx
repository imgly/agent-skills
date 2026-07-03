import type { AssetResult } from '@cesdk/engine';
import { useState } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';

import StickerSelect from '../StickerSelect/StickerSelect';
import StickerSelectFilter from '../StickerSelectFilter/StickerSelectFilter';

type AddStickerSecondaryProps = {
  onClose: () => void;
};

const AddStickerSecondary = ({ onClose }: AddStickerSecondaryProps) => {
  const [group, setGroup] = useState<string | undefined>();
  const { engine } = useEditor();

  const addSticker = (asset: AssetResult) => {
    engine.asset.apply('ly.img.sticker', asset);
  };

  return (
    <SlideUpPanel isExpanded onExpandedChanged={(value) => !value && onClose()}>
      <SlideUpPanelHeader headline="Add Sticker">
        <StickerSelectFilter
          currentGroup={group}
          onChange={(group: string) => setGroup(group)}
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <StickerSelect
          group={group}
          onClick={(type: AssetResult) => addSticker(type)}
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddStickerSecondary;
