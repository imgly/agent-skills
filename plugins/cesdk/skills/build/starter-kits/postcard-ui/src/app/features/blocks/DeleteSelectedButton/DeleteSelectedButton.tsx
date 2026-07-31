import { useEngine } from '@/app/contexts/EngineContext';
import { useSelection } from '@/app/contexts/SelectionContext';
import { canDeleteSelection } from '@/imgly/utils';
import TrashBinIcon from '@/app/icons/TrashBin.svg';
import IconButton from '@/app/components/IconButton/IconButton';

const DeleteSelectedButton = ({ isActive = false }) => {
  const { engine } = useEngine();
  const { selection } = useSelection();

  const deleteSelected = async () => {
    // Leave crop mode first so the delete never happens from inside a crop.
    if (engine.editor.getEditMode() === 'Crop') {
      await engine.actions.run('editmode.exit');
    }
    await engine.actions.run('selection.delete');
    engine.editor.addUndoStep();
  };

  if (!canDeleteSelection(engine, selection)) {
    return null;
  }
  return (
    <IconButton
      onClick={() => deleteSelected()}
      icon={<TrashBinIcon />}
      iconColor="red"
      isActive={isActive}
    >
      Delete
    </IconButton>
  );
};
export default DeleteSelectedButton;
