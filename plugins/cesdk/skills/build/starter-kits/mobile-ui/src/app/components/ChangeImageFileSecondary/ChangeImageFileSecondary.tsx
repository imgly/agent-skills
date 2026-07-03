import type { CompleteAssetResult } from '@cesdk/engine';
import { useEditor } from '../../contexts/EditorContext';
import ImageSelect from '../ImageSelect/ImageSelect';
import {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

type ChangeImageFileSecondaryProps = {
  onClose: () => void;
};

const ChangeImageFileSecondary = ({
  onClose
}: ChangeImageFileSecondaryProps) => {
  const { engine, selectedBlocks } = useEditor();

  return (
    <>
      <SlideUpPanelHeader headline="Replace">
        <UploadImageButton
          multiple={false}
          onUpload={(asset: CompleteAssetResult) =>
            engine.asset.applyToBlock(
              asset.context.sourceId,
              asset,
              selectedBlocks[0].id
            )
          }
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(asset: CompleteAssetResult) => {
            engine.asset.applyToBlock(
              asset.context.sourceId,
              asset,
              selectedBlocks[0].id
            );
            engine.block.resetCrop(selectedBlocks[0].id);
            onClose();
          }}
        />
      </SlideUpPanelBody>
    </>
  );
};
export default ChangeImageFileSecondary;
