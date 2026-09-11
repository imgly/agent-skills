import { useEngine } from '../../../imgly/contexts/EngineContext';
import ShapesBar from '../ShapesBar/ShapesBar';

const AddShapeSecondary = () => {
  const { engine } = useEngine();

  return (
    <ShapesBar
      onClick={(asset) => engine.asset.apply(asset.context.sourceId, asset)}
    />
  );
};
export default AddShapeSecondary;
