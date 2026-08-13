import classNames from 'classnames';
import RedoIcon from '@/app/icons/Redo.svg';
import UndoIcon from '@/app/icons/Undo.svg';
import { useEngine } from '@/app/contexts/EngineContext';
import { useHistory } from '@/app/hooks/useHistory';
import classes from './UndoRedoButtons.module.css';

const UndoRedoButtons = () => {
  const { engine } = useEngine();
  const { canRedo, canUndo } = useHistory({ engine });

  return (
    <div className={classes.container}>
      <button
        onClick={() => engine.actions.run('history.undo')}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canUndo
        })}
        disabled={!canUndo}
      >
        <UndoIcon />
      </button>
      <button
        onClick={() => engine.actions.run('history.redo')}
        className={classNames(classes.button, {
          [classes['button--disabled']]: !canRedo
        })}
        disabled={!canRedo}
      >
        <RedoIcon />
      </button>
    </div>
  );
};
export default UndoRedoButtons;
