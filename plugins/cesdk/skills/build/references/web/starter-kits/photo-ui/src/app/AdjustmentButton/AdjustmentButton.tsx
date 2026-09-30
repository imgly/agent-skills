import classes from './AdjustmentButton.module.css';
import classNames from 'classnames';

interface AdjustmentButtonProps {
  id?: string;
  label: string;
  onClick: () => void;
  isActive: boolean;
}

const AdjustmentButton = ({
  id,
  label,
  onClick,
  isActive
}: AdjustmentButtonProps) => {
  return (
    <button
      key={id}
      onClick={onClick}
      className={classNames(classes.button, {
        [classes['button--active']]: isActive
      })}
    >
      {label}
    </button>
  );
};
export default AdjustmentButton;
