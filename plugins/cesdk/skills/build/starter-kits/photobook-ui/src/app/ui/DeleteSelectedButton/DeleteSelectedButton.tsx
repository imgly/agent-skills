import { useSelection } from '../../contexts/UseSelection';
import TrashBinIcon from '../../icons/TrashBin.svg';
import { useEngine } from '../../contexts/EngineContext';
import IconButton from '../IconButton/IconButton';

function DeleteSelectedButton({ isActive = false }) {
  const { engine } = useEngine();
  const { selection } = useSelection();

  const deleteSelectedElement = () => {
    if (engine.editor.getEditMode() === 'Crop') {
      engine.editor.setEditMode('Transform');
    }
    const selectedBlocks = engine.block.findAllSelected();
    selectedBlocks.forEach((pageId) => {
      engine.block.destroy(pageId);
    });
    engine.editor.addUndoStep();
  };

  // For a render after a delete the selection can still name a destroyed block,
  // which the engine refuses to answer scope questions about.
  if (
    !selection.every(
      (block) =>
        engine.block.isValid(block) &&
        engine.block.isAllowedByScope(block, 'lifecycle/destroy')
    )
  ) {
    return null;
  }
  return (
    <IconButton
      onClick={() => deleteSelectedElement()}
      icon={<TrashBinIcon />}
      iconColor="red"
      isActive={isActive}
    >
      Delete
    </IconButton>
  );
}
export default DeleteSelectedButton;
