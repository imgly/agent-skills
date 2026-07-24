import { useEngine } from '@/app/contexts/EngineContext';
import ImagesBar from '../ImageBar/ImageBar';

const AddImageSecondary = () => {
  const { engine } = useEngine();
  return (
    <ImagesBar
      onClick={async (asset) => {
        await engine.asset.apply(asset.context.sourceId, asset);
      }}
    />
  );
};
export default AddImageSecondary;
