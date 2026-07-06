import { useEngine } from '../../contexts/EngineContext';
import ImagesBar from '../ImageBar/ImageBar';

function AddImageSecondary() {
  const { engine } = useEngine();

  return (
    <ImagesBar
      onClick={async (asset) => {
        engine.asset.apply(asset.context.sourceId, asset);
      }}
    />
  );
}
export default AddImageSecondary;
