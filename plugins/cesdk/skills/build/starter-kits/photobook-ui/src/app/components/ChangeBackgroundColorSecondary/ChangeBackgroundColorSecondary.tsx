import { useEffect } from 'react';
import { useEditor } from '../../contexts/EditorContext';
import { useEngine } from '../../contexts/EngineContext';
import { useSinglePageMode } from '../../contexts/SinglePageModeContext';
import { useProperty } from '../../contexts/UseSelectedProperty';
import ColorSelect from '../../ui/ColorSelect/ColorSelect';

function ChangeBackgroundColorSecondary() {
  const { engine } = useEngine();
  const { getColorPalette } = useEditor();
  const { currentPageBlockId } = useSinglePageMode();
  const [backgroundColor, setBackgroundColor] = useProperty(
    currentPageBlockId,
    'fill/solid/color',
    { shouldAddUndoStep: false }
  );

  // Add undo step when component dismounts:
  useEffect(() => {
    return () => {
      if (engine) {
        engine.editor.addUndoStep();
      }
    };
  }, [engine]);

  return (
    <ColorSelect
      onClick={(color) => setBackgroundColor(color)}
      activeColor={backgroundColor}
      colorPalette={getColorPalette()}
    />
  );
}
export default ChangeBackgroundColorSecondary;
