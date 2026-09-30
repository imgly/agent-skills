import { useEngine } from '../../contexts/EngineContext';
import ShapesBar from '../ShapesBar/ShapesBar';

function AddShapeSecondary() {
  const { engine } = useEngine();

  return (
    <ShapesBar
      onClick={(asset) => engine.asset.apply(asset.context.sourceId, asset)}
    />
  );
}
export default AddShapeSecondary;
