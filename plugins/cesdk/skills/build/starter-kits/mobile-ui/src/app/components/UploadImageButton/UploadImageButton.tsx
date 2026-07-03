import type { AssetDefinition, CompleteAssetResult } from '@cesdk/engine';
import { useEditor } from '../../contexts/EditorContext';
import { getImageDimensions } from '../getImageDimensions';
import UploadIcon from '../../icons/Upload.svg';
import { uploadFile } from '../../../imgly/upload';
import IconButton from '../IconButton/IconButton';

const SUPPORTED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'image/gif'
];

async function fileUploadToAsset(file: File): Promise<AssetDefinition> {
  const url = window.URL.createObjectURL(file);
  const { width, height } = await getImageDimensions(url);

  return {
    id: url,
    meta: {
      uri: url,
      thumbUri: url,
      kind: 'image',
      fillType: '//ly.img.ubq/fill/image',
      width,
      height
    }
  };
}

type UploadImageButtonProps = {
  multiple?: boolean;
  onUpload: (asset: CompleteAssetResult) => void;
};

const UploadImageButton = ({ multiple, onUpload }: UploadImageButtonProps) => {
  const { engine } = useEditor();

  return (
    <div>
      <IconButton
        onClick={async () => {
          const files = await uploadFile({
            multiple,
            supportedMimeTypes: SUPPORTED_MIME_TYPES
          });

          const uploadedAssets = await Promise.all(
            files.map(fileUploadToAsset)
          );

          uploadedAssets.forEach((asset) =>
            engine.asset.addAssetToSource('ly.img.image', asset)
          );
          uploadedAssets.forEach((asset) =>
            onUpload({
              ...asset,
              context: { sourceId: 'ly.img.image' }
            } as unknown as CompleteAssetResult)
          );
        }}
        icon={
          <>
            <UploadIcon />
            <span>Upload</span>
          </>
        }
      />
    </div>
  );
};

export default UploadImageButton;
