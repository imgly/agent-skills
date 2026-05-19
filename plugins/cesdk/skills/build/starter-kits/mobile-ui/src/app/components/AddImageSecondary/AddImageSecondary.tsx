import type { CompleteAssetResult } from '@cesdk/engine';
import { useEditor } from '../../contexts/EditorContext';
import ImageSelect from '../ImageSelect/ImageSelect';
import SlideUpPanel, {
  SlideUpPanelBody,
  SlideUpPanelHeader
} from '../SlideUpPanel/SlideUpPanel';
import UploadImageButton from '../UploadImageButton/UploadImageButton';

type AddImageSecondaryProps = {
  onClose: () => void;
};

const AddImageSecondary = ({ onClose }: AddImageSecondaryProps) => {
  const { engine } = useEditor();

  return (
    <SlideUpPanel
      isExpanded={true}
      onExpandedChanged={(value) => !value && onClose()}
    >
      <SlideUpPanelHeader headline="Add Image">
        <UploadImageButton
          onUpload={(asset: CompleteAssetResult) => {
            engine.asset.apply(asset.context.sourceId, asset);
          }}
        />
      </SlideUpPanelHeader>
      <SlideUpPanelBody>
        <ImageSelect
          onSelect={(asset: CompleteAssetResult) => {
            engine.asset.apply(asset.context.sourceId, asset);
          }}
        />
      </SlideUpPanelBody>
    </SlideUpPanel>
  );
};
export default AddImageSecondary;
