import { Font, Typeface } from '@cesdk/engine';
import { useEngine } from '@/app/contexts/EngineContext';
import { useSinglePageMode } from '@/app/contexts/SinglePageModeContext';
import FontSelect from '@/app/components/FontSelect/FontSelect';

const AddTextSecondary = () => {
  const { engine } = useEngine();
  const { currentPageBlockId } = useSinglePageMode();

  return (
    <FontSelect
      onSelect={(font: Font, typeface: Typeface) => {
        if (currentPageBlockId == null) return;
        engine.actions.run('addText', currentPageBlockId, font, typeface);
      }}
    />
  );
};
export default AddTextSecondary;
