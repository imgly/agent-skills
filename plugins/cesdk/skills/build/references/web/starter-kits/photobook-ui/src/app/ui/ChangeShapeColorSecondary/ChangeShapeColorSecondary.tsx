import { useMemo } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { useSelectedProperty } from '../../contexts/UseSelectedProperty';
import ColorSelect from '../ColorSelect/ColorSelect';

function ChangeShapeColorSecondary() {
  const { getColorPalette } = useEditor();
  const colorPalette = useMemo(() => getColorPalette(), [getColorPalette]);
  const [shapeColor, setShapeColor] = useSelectedProperty('fill/solid/color');

  return (
    <ColorSelect
      onClick={(color) => setShapeColor(color)}
      activeColor={shapeColor}
      colorPalette={colorPalette}
    />
  );
}
export default ChangeShapeColorSecondary;
