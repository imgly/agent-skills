import classNames from 'classnames';
import RedoIcon from '../../icons/Redo.svg';
import UndoIcon from '../../icons/Undo.svg';
import { useEngine } from '../../contexts/EngineContext';
import { useHistory } from '../../contexts/UseHistory';
import classes from './UndoRedoButtons.module.css';

function UndoRedoButtons() {
  const { engine } = useEngine();
  const { canRedo, canUndo } = useHistory({ engine });

  return (
    <div className={classes.container}>
      <button
        aria-label="Undo"
        onClick={() => engine.editor.undo()}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canUndo
        })}
        disabled={!canUndo}
      >
        <UndoIcon />
      </button>
      <button
        aria-label="Redo"
        onClick={() => engine.editor.redo()}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canRedo
        })}
        disabled={!canRedo}
      >
        <RedoIcon />
      </button>
    </div>
  );
}
export default UndoRedoButtons;
